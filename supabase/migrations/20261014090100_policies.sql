-- TechNest row level security
-- Run after 20261014090000_schema.sql.
--
-- Rule of thumb: the React app decides what to *show*; these policies decide
-- what anyone can actually *read or write*. Nothing below trusts the client.

alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.brands         enable row level security;
alter table public.products       enable row level security;
alter table public.product_images enable row level security;
alter table public.addresses      enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.wishlist       enable row level security;
alter table public.reviews        enable row level security;
alter table public.coupons        enable row level security;
alter table public.banners        enable row level security;
alter table public.messages       enable row level security;
alter table public.settings       enable row level security;

-- ------------------------------------------------------------- profiles ----

-- Column-level grants, not just policies. Without this a customer could run
-- `update profiles set role = 'admin' where id = auth.uid()` and the
-- "update your own row" policy would happily allow it. Only full_name and
-- phone are writable by the account holder; role and blocked are admin-only.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

create policy "Read own profile"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "Update own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Admins manage profiles"
  on public.profiles for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------ catalogue ----

-- Categories and brands are public reference data: anyone, signed in or not,
-- can read them. Only admins change them.
create policy "Anyone reads categories"
  on public.categories for select to anon, authenticated using (true);

create policy "Admins manage categories"
  on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Anyone reads brands"
  on public.brands for select to anon, authenticated using (true);

create policy "Admins manage brands"
  on public.brands for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Hidden products (is_active = false) stay invisible to shoppers, which is
-- what makes the admin "publish or hide" switch actually mean something.
create policy "Anyone reads active products"
  on public.products for select to anon, authenticated
  using (is_active or public.is_admin());

create policy "Admins manage products"
  on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Anyone reads images of active products"
  on public.product_images for select to anon, authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.products p
      where p.id = product_images.product_id and p.is_active
    )
  );

create policy "Admins manage product images"
  on public.product_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------ addresses ----

create policy "Own addresses"
  on public.addresses for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid());

-- --------------------------------------------------------------- orders ----

-- Customers may READ their own orders but may NOT insert one directly.
-- Orders are created only by the place_order() SECURITY DEFINER function
-- (roadmap step 8), which reads the real prices, checks stock and computes the
-- total server-side. If customers could insert rows here they could set their
-- own total, which is exactly the attack the feature guide calls out.
create policy "Read own orders"
  on public.orders for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- A customer may cancel, but only their own order and only while it is still
-- pending. The WITH CHECK pins the new status so this cannot be used to jump
-- an order to "delivered".
create policy "Cancel own pending order"
  on public.orders for update to authenticated
  using (user_id = auth.uid() and status = 'pending')
  with check (user_id = auth.uid() and status = 'cancelled');

create policy "Admins manage orders"
  on public.orders for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "Read own order items"
  on public.order_items for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

create policy "Admins manage order items"
  on public.order_items for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------- wishlist ----

create policy "Own wishlist"
  on public.wishlist for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- -------------------------------------------------------------- reviews ----

create policy "Anyone reads approved reviews"
  on public.reviews for select to anon, authenticated
  using (approved or user_id = auth.uid() or public.is_admin());

-- "Verified buyers only" enforced in the database, not just hidden in the UI:
-- the reviewer must have a delivered order containing this product.
create policy "Buyers review delivered purchases"
  on public.reviews for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.orders o
      join public.order_items oi on oi.order_id = o.id
      where o.user_id = auth.uid()
        -- Must be table-qualified. An unqualified `product_id` would resolve
        -- to oi.product_id inside this subquery, making the check always true
        -- and letting anyone with any delivered order review any product.
        and oi.product_id = reviews.product_id
        and o.status = 'delivered'
    )
  );

create policy "Edit own review"
  on public.reviews for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and approved = false);

create policy "Delete own review"
  on public.reviews for delete to authenticated
  using (user_id = auth.uid());

create policy "Admins moderate reviews"
  on public.reviews for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- -------------------------------------------------------------- coupons ----

-- Deliberately admin-only, including reads. A customer typing a code gets it
-- validated by the order function server-side; exposing the coupons table
-- would let anyone list every active discount code.
create policy "Admins manage coupons"
  on public.coupons for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- -------------------------------------------------------------- banners ----

create policy "Anyone reads active banners"
  on public.banners for select to anon, authenticated
  using (is_active or public.is_admin());

create policy "Admins manage banners"
  on public.banners for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------- messages ----

-- The contact form is open to guests, so anyone may insert. Only admins read.
create policy "Anyone sends a message"
  on public.messages for insert to anon, authenticated
  with check (true);

create policy "Admins read messages"
  on public.messages for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------- settings ----

-- Shop name, delivery fees and which payment methods are on are all needed by
-- the storefront before sign-in, so reads are public. Keep secrets out of this
-- table - it is readable by anyone with the anon key.
create policy "Anyone reads settings"
  on public.settings for select to anon, authenticated using (true);

create policy "Admins manage settings"
  on public.settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
