# Admin access

How to sign in to `/admin`, and what stops anyone else from doing it.

## The login

| | |
|---|---|
| **Email** | `admin@gmail.com` |
| **Password** | `admin123` |

The email is what makes an account an admin, and it is set in one place — the
`admin_allowlist` table, seeded by
`supabase/migrations/20261014090300_admin_accounts.sql`. The password is not stored
anywhere in this project; you type it into Supabase in step 2, and it is
written to the database as a hash. It is listed above only so you do not have
to guess it.

> **This is a development login.** `admin@gmail.com` is not an inbox you
> control, so password-reset and confirmation emails cannot reach it — which is
> why step 2 creates the account with confirmation skipped. And since this
> repository is public, both values above are readable by anyone. Before the
> shop takes a real order, add an address you own to the allowlist, sign in
> with it, and remove this one.

---

## Setting it up, once

### 1. Build the database

The database is empty until you do this, and nothing below works without it.
The Supabase CLI is already a dev dependency — nothing to install globally.

```bash
npm run db:login
```

Opens a browser, asks you to approve, and stores an access token on this
machine. One time per machine, not per project.

```bash
npm run db:link
```

Links this folder to project `jghzwjplpfqjzbkeneyw` and asks for your
**database password**. That is the one you set when the project was created —
not your Supabase account password and not the anon key. Forgotten it? Reset it
at **Project Settings → Database → Database password → Reset**; nothing else in
the project breaks when you do.

```bash
npm run db:seed
```

Applies all four migrations and then `seed.sql`. Expect a list of file names and
`Finished supabase db push.`

Check it worked:

```bash
npm run db:status
```

Every migration should show a version under both **Local** and **Remote**. A
version missing from Remote was not applied.

<details>
<summary>Rather paste SQL into the dashboard?</summary>

Open **SQL Editor** → **New query** and run each file's contents in this order:

1. `supabase/migrations/20261014090000_schema.sql`
2. `supabase/migrations/20261014090100_policies.sql`
3. `supabase/migrations/20261014090200_storage.sql`
4. `supabase/migrations/20261014090300_admin_accounts.sql`
5. `supabase/seed.sql`

Each should finish with *Success. No rows returned*. This leaves
`supabase_migrations.schema_migrations` empty, so a later `npm run db:push`
will try to apply them again and fail on "already exists" — pick one approach
and stay with it.
</details>

### 2. Create the account

Do this **in the Supabase dashboard**, not through the shop's register page.
Supabase emails a confirmation link to new accounts, and nobody here can open
the one sent to `admin@gmail.com`.

1. **Authentication** → **Users** → **Add user** → *Create new user*
2. Email: `admin@gmail.com`
3. Password: `admin123`
4. Tick **Auto Confirm User** — this is the important one. Without it the
   account exists but cannot sign in, and sign-in fails with *"Confirm your
   email first"*.
5. **Create user**

As the row is created, the `handle_new_user()` trigger checks the allowlist and
sets `role = 'admin'`. There is no promote button to find afterwards.

<details>
<summary>Prefer to use the shop's own /register page?</summary>

Turn confirmations off first: **Authentication** → **Sign In / Providers** →
**Email** → switch off **Confirm email**, and save. Then `/register` signs you
straight in with no inbox involved.

Fine while building. Turn it back on before real customers register, or anyone
can sign up claiming any address.
</details>

### 3. Sign in

Go to `/login`, enter `admin@gmail.com` / `admin123`. An admin signing in lands
on `/admin` directly rather than the home page.

From then on the account menu in the navbar (top right, the circle with your
initial) has an **Admin dashboard** entry, and `/admin` has your name and a
sign-out button at the bottom of the sidebar.

---

## If it does not work

| What you see | What it means |
|---|---|
| **"Database not set up"** | Step 1 has not been run, or only partly. Run `npm run db:status` to see what is missing. |
| **`Cannot find project ref. Have you run supabase link?`** | `npm run db:link` has not been run in this folder, or `supabase/.temp` was deleted. Run it again. |
| **`failed SASL auth` / wrong password on link** | That is the database password, not your account password. Reset it under Project Settings → Database. |
| **`db push` says nothing to apply, but tables are missing** | A migration file lost its 14-digit timestamp prefix, so the CLI skipped it. Check `ls supabase/migrations`. |
| **"Admins only"** | You are signed in, but on a different account than the allowlisted one. Check which email the account menu shows. |
| **"That email and password do not match an account"** | No account with that address, or the wrong password. Deliberately does not say which — naming it would let anyone test which addresses are registered. |
| **"Confirm your email first"** | You created the account without ticking **Auto Confirm User**. Fix it in Authentication → Users → the user → **Confirm email**. No need to delete and start again. |
| **"Invalid path specified in request URL"** | `VITE_SUPABASE_URL` has a path on it. It must be the project URL only, with no `/rest/v1`. |
| Your account has no profile row | `20261014090000_schema.sql` ran after the account was created, so the trigger never saw it. Re-run `20261014090300_admin_accounts.sql` — it promotes anyone already on the allowlist. |
| Forgot the password | "Forgot your password?" cannot help here — the reset email goes to an inbox you do not own. Reset it in Authentication → Users → the user → **Reset password**. |

Changes to `.env` need `npm run dev` restarted; Vite only reads it at startup.

---

## Adding another admin

Add a row, and they get the role the next time they register:

```sql
insert into public.admin_allowlist (email, note)
values ('someone@example.lk', 'Warehouse manager');
```

For someone who **already has an account**, promote them from
**/admin/customers** — find them in the list and use *Make admin*. That calls
the `admin_set_role()` database function, which re-checks that *you* are an
admin before it writes.

To revoke, use *Make customer* on the same screen, and delete their allowlist
row so a re-registration does not hand it back.

### Replacing the development login before launch

```sql
-- 1. Allow your real address
insert into public.admin_allowlist (email, note)
values ('you@yourdomain.lk', 'Shop owner');

-- 2. Register with it through /register, confirm the email, sign in.
--    Check /admin loads before going further.

-- 3. Then retire the development one
delete from public.admin_allowlist where email = 'admin@gmail.com';
```

Demote the old account from **/admin/customers** (*Make customer*), or delete
the user in Authentication → Users. Do it in that order — removing the only
admin before the new one works leaves nobody who can reach `/admin`, and the
only way back is the SQL editor.

---

## Why this is safe

Hiding a link protects nothing, so the role is enforced in three places and the
browser is trusted in none of them.

**The role is written by the database, never sent by the browser.** The
`handle_new_user()` trigger sets it from `admin_allowlist` while the account is
being created. The client is not consulted.

**The allowlist cannot be read by the client at all.** It has Row Level
Security enabled and *no policies*, which means neither `anon` nor
`authenticated` can select from it through the API. Only the `SECURITY DEFINER`
functions see it. So the admin address is not discoverable from the shipped
bundle.

**A customer cannot promote themselves.** `20261014090100_policies.sql` grants update on
only `full_name` and `phone`:

```sql
grant update (full_name, phone) on public.profiles to authenticated;
```

`role` and `blocked` are not grantable columns for `authenticated`, so
`update profiles set role = 'admin'` is refused at the column level — before
any policy is even consulted. That is also why admins change roles through
`admin_set_role()` rather than a plain update.

**The screens and the data are guarded separately.** `RequireAdmin` keeps
`/admin` off the screen; every admin table additionally carries an
`is_admin()` policy, so loading the admin JavaScript by hand returns empty
lists. Either check alone would be a hole.

**`admin_set_role()` and `admin_set_blocked()` refuse your own row.** Blocking
yourself would lock you out of the screen you did it from, and demoting
yourself could leave the shop with no admin and no way back.

---

## What the admin area can actually do today

Reads and writes the real database:

| Screen | Status |
|---|---|
| **Customers** | Live. Every account, with search, block/unblock and role changes. |
| **Messages** | Live. The contact form writes here; mark read/unread and delete. |
| **Coupons** | Live. Create, edit and delete discount codes. |
| **Banners** | Live. Create, edit, reorder, show/hide. |
| **Settings** | Live. Shop details, delivery rules and payment methods. |

Still reading the sample catalogue, because the products themselves are not in
Supabase yet (roadmap step 5):

| Screen | Waiting on |
|---|---|
| Dashboard, Products, Inventory, Categories, Orders | Step 5 — products and orders in the database |
| Reviews | Steps 5 and 8 — a review needs a product and a delivered order |
| Reports | Step 8 — the figures are aggregates over real orders |

These screens work and are honest about where their numbers come from; they
just cannot show real data until there is real data to show.
