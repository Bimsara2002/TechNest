-- TechNest schema
-- Roadmap step 3. Run this first, then 0002_policies.sql, then 0003_storage.sql.
--
-- Money is numeric(12,2), never float: binary floating point cannot represent
-- decimal currency exactly and the rounding error shows up in order totals.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums ----

create type public.user_role as enum ('customer', 'admin');

create type public.order_status as enum (
  'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'
);

create type public.payment_status as enum ('unpaid', 'paid', 'refunded');

create type public.payment_method as enum ('cod', 'payhere', 'bank_transfer');

create type public.coupon_type as enum ('percentage', 'fixed');

-- ------------------------------------------------------------- profiles ----

-- One row per signed-in user, created automatically by the trigger below.
-- `role` lives here and is what is_admin() reads, so it is protected by
-- column-level grants in 0002_policies.sql - a customer must never be able to
-- promote themselves.
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  phone       text,
  role        public.user_role not null default 'customer',
  blocked     boolean not null default false,
  created_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Reads the caller's role without tripping over row level security on
-- profiles. A plain subquery inside a profiles policy recurses; SECURITY
-- DEFINER sidesteps that and is the documented Supabase pattern.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------ catalogue structure ------

create table public.categories (
  id          bigint generated always as identity primary key,
  name        text not null,
  slug        text not null unique,
  image_url   text,
  sort_order  integer not null default 0
);

create table public.brands (
  id        bigint generated always as identity primary key,
  name      text not null unique,
  slug      text not null unique,
  logo_url  text
);

create table public.products (
  id              bigint generated always as identity primary key,
  name            text not null,
  slug            text not null unique,
  description     text not null default '',
  price           numeric(12, 2) not null check (price >= 0),
  discount_price  numeric(12, 2) check (discount_price >= 0),
  stock           integer not null default 0 check (stock >= 0),
  sku             text unique,
  brand_id        bigint references public.brands(id) on delete set null,
  category_id     bigint references public.categories(id) on delete set null,
  image_url       text,
  specs           jsonb not null default '{}'::jsonb,
  is_active       boolean not null default true,
  is_featured     boolean not null default false,
  low_stock_at    integer not null default 3,
  created_at      timestamptz not null default now(),
  -- A "discount" above the real price would render as a negative saving.
  constraint discount_below_price
    check (discount_price is null or discount_price < price)
);

create index products_category_idx on public.products (category_id);
create index products_brand_idx    on public.products (brand_id);
create index products_active_idx   on public.products (is_active, created_at desc);

-- Trigram index so the search box can do fast case-insensitive partial matches.
create extension if not exists pg_trgm;
create index products_name_trgm_idx on public.products using gin (name gin_trgm_ops);

create table public.product_images (
  id          bigint generated always as identity primary key,
  product_id  bigint not null references public.products(id) on delete cascade,
  image_url   text not null,
  sort_order  integer not null default 0
);

create index product_images_product_idx on public.product_images (product_id);

-- ------------------------------------------------------------ customer -----

create table public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  full_name   text not null,
  address     text not null,
  city        text not null,
  phone       text not null,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index addresses_user_idx on public.addresses (user_id);

-- --------------------------------------------------------------- orders ----

-- UUID primary key so order URLs are not guessable, plus a short human
-- reference ("TN-00042") for the success page, invoices and support calls.
create sequence public.order_number_seq start 1;

create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text not null unique
                    default 'TN-' || lpad(nextval('public.order_number_seq')::text, 5, '0'),
  user_id         uuid not null references auth.users(id) on delete restrict,
  subtotal        numeric(12, 2) not null check (subtotal >= 0),
  delivery_fee    numeric(12, 2) not null default 0 check (delivery_fee >= 0),
  discount        numeric(12, 2) not null default 0 check (discount >= 0),
  total           numeric(12, 2) not null check (total >= 0),
  status          public.order_status not null default 'pending',
  payment_method  public.payment_method not null default 'cod',
  payment_status  public.payment_status not null default 'unpaid',
  full_name       text not null,
  address         text not null,
  city            text not null,
  phone           text not null,
  note            text,
  created_at      timestamptz not null default now()
);

create index orders_user_idx    on public.orders (user_id, created_at desc);
create index orders_status_idx  on public.orders (status, created_at desc);

-- `price` is the price paid at purchase time, copied in by the order function.
-- Never join to products.price to display an old order: a later price change
-- would silently rewrite history.
create table public.order_items (
  id          bigint generated always as identity primary key,
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  bigint not null references public.products(id) on delete restrict,
  name        text not null,
  quantity    integer not null check (quantity > 0),
  price       numeric(12, 2) not null check (price >= 0)
);

create index order_items_order_idx on public.order_items (order_id);

-- ------------------------------------------------- wishlist and reviews ----

create table public.wishlist (
  user_id     uuid not null references auth.users(id) on delete cascade,
  product_id  bigint not null references public.products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  bigint not null references public.products(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  comment     text not null default '',
  approved    boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (product_id, user_id)
);

create index reviews_product_idx on public.reviews (product_id, approved);

-- ------------------------------------------------ promotions and content ---

create table public.coupons (
  id           bigint generated always as identity primary key,
  code         text not null unique,
  type         public.coupon_type not null,
  value        numeric(12, 2) not null check (value > 0),
  expires_at   timestamptz,
  usage_limit  integer,
  used_count   integer not null default 0,
  is_active    boolean not null default true
);

create table public.banners (
  id          bigint generated always as identity primary key,
  image_url   text not null,
  link        text,
  headline    text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true
);

create table public.messages (
  id          bigint generated always as identity primary key,
  name        text not null,
  email       text not null,
  message     text not null,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.settings (
  key    text primary key,
  value  jsonb not null
);
