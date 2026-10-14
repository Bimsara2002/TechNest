# Supabase setup

Roadmap step 3. Run these once to get from an empty Supabase project to
"database ready with 20 products".

## 1. Create the project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a
   new project. Pick the region closest to Sri Lanka (Singapore,
   `ap-southeast-1`) — it is the single biggest factor in how fast the shop
   feels for local customers.
2. Save the database password somewhere safe. It is not the same as the API keys.

## 2. Apply the SQL

The Supabase CLI is a dev dependency, so there is nothing to install globally.

```bash
npm run db:login    # opens a browser, stores an access token
npm run db:link     # links this folder to the project, asks for the DB password
npm run db:seed     # applies every migration, then seed.sql
```

What lands, in order — the order matters, because policies reference tables and
storage references `is_admin()`:

| # | File | What it does |
| --- | --- | --- |
| 1 | `migrations/20261014090000_schema.sql` | Tables, enums, indexes, the new-user trigger, `is_admin()` |
| 2 | `migrations/20261014090100_policies.sql` | Row Level Security on every table |
| 3 | `migrations/20261014090200_storage.sql` | `product-images` bucket and its policies |
| 4 | `migrations/20261014090300_admin_accounts.sql` | The admin allowlist, `profiles.email`, admin-only role/block functions |
| 5 | `seed.sql` | 6 categories, 11 brands, 20 products, shop settings |

After the first run use `npm run db:push`, which applies only migrations the
remote has not seen. `npm run db:status` lists what is applied where.

**Migration file names must keep the 14-digit timestamp prefix.** That is how
the CLI orders them and records them in `supabase_migrations.schema_migrations`.
A file named `0001_schema.sql` can be skipped without an error, which looks like
`db push` succeeding while nothing happens.

<details>
<summary>No CLI? Paste them by hand instead</summary>

Open **SQL Editor** in the dashboard and run each file's contents as a new
query, in the order of the table above. Everything works the same; you just
have to track yourself what has already been run, and `schema_migrations` stays
empty, so a later `db push` would try to apply them again.
</details>

## 3. Connect the app

In the dashboard go to **Project Settings → API** and copy:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public** key → `VITE_SUPABASE_ANON_KEY`

> `VITE_SUPABASE_URL` is the project URL **and nothing else** —
> `https://abc123.supabase.co`, with no `/rest/v1` and no trailing slash.
> supabase-js appends its own paths, so a URL with `/rest/v1` on the end sends
> every query to `/rest/v1/rest/v1/…` and every sign-in to
> `/rest/v1/auth/v1/…`. They all fail with *"Invalid path specified in request
> URL"*, which reads like a bad key rather than a bad URL.
> `src/lib/supabase.js` now refuses to start on that mistake.

```bash
cp .env.example .env
# then paste both values into .env
```

Restart `npm run dev` afterwards — Vite only reads `.env` at startup.

> Copy the **anon** key, never the **service_role** key. Anything in a `VITE_`
> variable is compiled into the JavaScript bundle and is readable by every
> visitor.

## 4. Make yourself an admin

Handled by `20261014090300_admin_accounts.sql`: the shop's address is in the
`admin_allowlist` table, and the sign-up trigger reads it, so registering with
that address gives you `role = 'admin'` immediately. Nothing to run by hand.

See [ADMIN.md](../ADMIN.md) for the whole walkthrough, including how to add a
second admin.

## 5. Check the rules actually work

The pre-launch checklist asks for this, and it is worth doing now while the data
is fake. With a normal (non-admin) customer signed in:

| Test | Expected |
| --- | --- |
| Read products | Works |
| Read another customer's order | Returns nothing |
| `update profiles set role='admin'` on your own row | Permission denied on column `role` |
| Insert directly into `orders` | Denied — no insert policy exists for customers |
| Insert a review for a product you never bought | Denied |
| Read the `coupons` table | Returns nothing |

## Design notes

**Customers cannot insert orders.** There is deliberately no insert policy on
`orders`. Orders are created only by the `place_order()` function added in
roadmap step 8, which reads real prices from the database, checks stock and
computes the total server-side. Letting the browser insert an order row would
let a customer name their own total.

**`order_items.price` is the price paid at purchase time.** Never join to
`products.price` when displaying an old order — a later price change would
rewrite history.

**Role escalation is blocked by column grants, not just policies.** A policy
saying "you may update your own profile row" would otherwise allow
`set role = 'admin'`. `20261014090100_policies.sql` grants update on only `full_name` and
`phone`.

**`is_admin()` is `SECURITY DEFINER`** so that reading `profiles.role` from
inside a `profiles` policy does not recurse.
