# Supabase setup

Roadmap step 3. Run these once to get from an empty Supabase project to
"database ready with 20 products".

## 1. Create the project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a
   new project. Pick the region closest to Sri Lanka (Singapore,
   `ap-southeast-1`) — it is the single biggest factor in how fast the shop
   feels for local customers.
2. Save the database password somewhere safe. It is not the same as the API keys.

## 2. Run the SQL, in order

Open **SQL Editor** in the dashboard and run each file's contents as a new query,
in this order. Order matters: policies reference tables, storage references
`is_admin()`.

| # | File | What it does |
| --- | --- | --- |
| 1 | `migrations/0001_schema.sql` | Tables, enums, indexes, the new-user trigger, `is_admin()` |
| 2 | `migrations/0002_policies.sql` | Row Level Security on every table |
| 3 | `migrations/0003_storage.sql` | `product-images` bucket and its policies |
| 4 | `seed.sql` | 6 categories, 11 brands, 20 products, shop settings |

Each file is safe to re-run except the migrations, which will complain that
objects already exist. `seed.sql` is fully idempotent.

## 3. Connect the app

In the dashboard go to **Project Settings → API** and copy:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public** key → `VITE_SUPABASE_ANON_KEY`

```bash
cp .env.example .env
# then paste both values into .env
```

Restart `npm run dev` afterwards — Vite only reads `.env` at startup.

> Copy the **anon** key, never the **service_role** key. Anything in a `VITE_`
> variable is compiled into the JavaScript bundle and is readable by every
> visitor.

## 4. Make yourself an admin

Every new account is a `customer`. There is no UI to promote someone, by
design — do it once in the SQL editor:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

Sign up through the app first, otherwise there is no row to update.

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
`set role = 'admin'`. `0002_policies.sql` grants update on only `full_name` and
`phone`.

**`is_admin()` is `SECURITY DEFINER`** so that reading `profiles.role` from
inside a `profiles` policy does not recurse.
