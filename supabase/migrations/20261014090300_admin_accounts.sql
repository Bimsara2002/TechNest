-- TechNest admin accounts
-- Roadmap step 4. Run after 20261014090200_storage.sql.
--
-- Decides WHO is an admin, and does it server-side. The browser never gets to
-- claim the role: it is written by a trigger from an allowlist the client
-- cannot read, and the only ways to change a role or block an account are the
-- SECURITY DEFINER functions at the bottom, which re-check is_admin()
-- themselves.
--
-- Safe to run twice.

-- ---------------------------------------------------------- allowlist ------

-- The shop's admin addresses. One row per owner; add a row to make someone
-- else an admin, and they get the role the moment they sign up.
create table if not exists public.admin_allowlist (
  email     text primary key,
  note      text,
  added_at  timestamptz not null default now()
);

alter table public.admin_allowlist enable row level security;

-- Deliberately NO policies. With row level security on and no policy at all,
-- neither anon nor authenticated can read or write this table through the API
-- - only the SECURITY DEFINER functions below see it. That keeps the owner's
-- address out of the public bundle, so nobody can look up which account to
-- attack.
revoke all on public.admin_allowlist from anon, authenticated;

-- The one admin login for this project.
--
-- NOTE: admin@gmail.com is a development login. It is not an inbox this
-- project controls, so password recovery and the confirmation email cannot be
-- delivered to it - create the account with "Auto Confirm User" in the
-- dashboard, or turn email confirmations off. Before the shop takes real
-- orders, add an address you actually own and remove this row.
insert into public.admin_allowlist (email, note)
values ('admin@gmail.com', 'Development admin login')
on conflict (email) do nothing;

-- ------------------------------------------------------- profile email ----

-- The admin Customers screen needs an address to show, and the allowlist check
-- needs one to match against. auth.users is not readable through the API, so
-- the address is mirrored here by the triggers below and kept in sync.
alter table public.profiles add column if not exists email text;

-- Not added to the `grant update (...)` list in 20261014090100_policies.sql, so the
-- account holder cannot edit it - changing an address goes through Supabase
-- Auth, which then fires the sync trigger.

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id
  and p.email is distinct from u.email;

-- --------------------------------------------------------- new sign-ups ----

-- Replaces the version in 20261014090000_schema.sql: same insert, plus the address and
-- the allowlist check. `lower()` on both sides because email case must not
-- decide whether someone is an admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    case
      when exists (
        select 1 from public.admin_allowlist a
        where lower(a.email) = lower(new.email)
      )
      then 'admin'::public.user_role
      else 'customer'::public.user_role
    end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Keeps profiles.email correct after an address change in Supabase Auth.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set email = new.email
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row execute function public.handle_user_email_change();

-- Covers the account that already exists: if the owner signed up before this
-- migration ran, the trigger above never saw them, so promote them now.
update public.profiles p
set role = 'admin'
from public.admin_allowlist a
where lower(a.email) = lower(p.email)
  and p.role <> 'admin';

-- ------------------------------------------------- admin-only column writes --

-- `role` and `blocked` are NOT in the column grants in 20261014090100_policies.sql, so
-- no amount of policy would let the API write them - that is what stops a
-- customer running `update profiles set role = 'admin'`. Admins therefore
-- change them through these functions, which check is_admin() in the database
-- rather than trusting the React guard.

create or replace function public.admin_set_blocked(target uuid, value boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only an admin may block or unblock an account'
      using errcode = '42501';
  end if;

  -- Blocking yourself would lock you out of the screen you did it from.
  if target = auth.uid() then
    raise exception 'You cannot block your own account'
      using errcode = '42501';
  end if;

  update public.profiles set blocked = value where id = target;

  if not found then
    raise exception 'No such account' using errcode = 'P0002';
  end if;
end;
$$;

create or replace function public.admin_set_role(target uuid, value public.user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only an admin may change a role'
      using errcode = '42501';
  end if;

  -- Demoting yourself could leave the shop with no admin at all, and there is
  -- no screen to undo it from afterwards.
  if target = auth.uid() then
    raise exception 'You cannot change your own role'
      using errcode = '42501';
  end if;

  update public.profiles set role = value where id = target;

  if not found then
    raise exception 'No such account' using errcode = 'P0002';
  end if;
end;
$$;

-- Postgres grants execute on new functions to public by default, which would
-- let an anonymous visitor call them. The is_admin() check inside would still
-- refuse, but there is no reason to expose them at all.
revoke all on function public.admin_set_blocked(uuid, boolean) from public;
revoke all on function public.admin_set_role(uuid, public.user_role) from public;

grant execute on function public.admin_set_blocked(uuid, boolean) to authenticated;
grant execute on function public.admin_set_role(uuid, public.user_role) to authenticated;

-- ----------------------------------------------------------- settings ------

-- The admin Settings screen has an address field; seed.sql predates it, and an
-- absent key would render as an empty required input.
insert into public.settings (key, value) values
  ('shop_address', '"128 Galle Road, Dehiwala, Colombo"'::jsonb)
on conflict (key) do nothing;

-- NOTE on `blocked`: it is set and displayed from here on, but nothing reads it
-- yet. It starts refusing checkout when place_order() lands in roadmap step 8 -
-- that function is the single place an order can be created, so it is the right
-- place to check. Do not try to enforce it in the browser.
