# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

TechNest — an online shop selling mobiles, laptops and gadgets in Sri Lanka. Customers
are predominantly on phones, so the phone layout is the primary design target, not an
afterthought.

## Commands

```bash
npm run dev       # Vite dev server with HMR (default http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # serve the built dist/ locally
npm run lint      # ESLint across all .js/.jsx
```

Requires Node 20.19+ or 22.12+ (Vite 8). There is **no test runner configured** — no
Vitest, no Jest, no test files. Do not invent `npm test` commands or write tests against
a framework that isn't installed; if tests are wanted, install and wire up the runner
first as its own change.

## Current state

Roadmap **step 1 is done**: Tailwind is active, every route in the page map exists,
both layouts render, and the build is clean. Everything below step 1 is still ahead.

- **Pages are placeholders.** Almost every file in `src/pages` renders
  `<PagePlaceholder>` listing what that page owes. Replacing one with a real
  implementation is the expected next move, not a regression. `NotFound` is real.
- **No Supabase client yet** — `src/lib` holds only `queryClient.js` and `format.js`.
  No `src/hooks` or `src/store` directory exists yet; create them when first needed.
- **No auth and no route guards.** The routes the guide marks "login needed"
  (`/checkout`, `/order-success/:id`, `/orders`, `/profile`, `/wishlist`) and the
  entire `/admin` branch are currently open to anyone. Step 4 adds the guards.
- **The header and footer are scaffolding**, not the real navigation. Step 2 replaces
  them with the hamburger-on-mobile navbar, laptop bar and cart count badge.
- `public/favicon.svg` and `public/icons.svg` are still Vite's artwork and need
  replacing before launch.

The authoritative feature spec is the TechNest Feature and Development Guide (the
numbered roadmap, page map, database tables and pre-launch checklist come from it).
Build in roadmap order and prefer MVP items over Phase 2 and Later ones.

## Architecture

Tailwind CSS v4 + React Router 7 + TanStack Query 5 + Zustand 5 + Supabase, all in
**JavaScript, not TypeScript** (`.jsx`, no `tsconfig.json`). Keep it that way unless
asked to migrate.

The layering that matters, because it is a hard rule rather than a convention:

```
src/lib/        Supabase client + raw data functions. The ONLY place
                supabase.from(...) / .auth / .storage may be called.
                Also queryClient.js and format.js.
src/hooks/      TanStack Query wrappers (useQuery/useMutation) around src/lib.
src/store/      Zustand stores for client-only state (cart, UI).
src/pages/      Customer route components.
src/pages/admin/ Admin route components (the /admin branch).
src/layouts/    CustomerLayout and AdminLayout — the two shells.
src/components/ Presentational + small composed UI.
```

`src/App.jsx` is the single route table for the whole site and mirrors the page map
in the feature guide. Customer routes nest inside `CustomerLayout`; everything under
`/admin` nests inside `AdminLayout`.

**Components and pages never import `supabase` directly.** They consume hooks from
`src/hooks`, which call into `src/lib`. This keeps query keys, error shapes and
retry behaviour in one layer instead of scattered through the UI.

Split the two kinds of state deliberately: **server data belongs to TanStack Query**
(products, stock, orders, user profile), **client-only state belongs to Zustand**
(cart contents, drawer/filter UI). Do not mirror fetched server data into Zustand.

Forms use react-hook-form with a zod schema via `@hookform/resolvers/zod`. Define the
zod schema as the single source of truth for a form's shape and reuse it for any
server-side validation rather than re-describing fields.

`public/icons.svg` is an SVG sprite referenced as
`<use href="/icons.svg#some-icon" />`. If you keep that pattern, add icons to the
sprite rather than inlining one-off SVGs.

## Conventions

- **Functional components only.** No class components, no `React.Component`.
- **Keep components small.** Prefer extracting a child component or a hook over growing
  a file past a few hundred lines or nesting deeply inside one return.
- **Mobile-first responsive.** Write the unprefixed (phone) styles first, then layer
  breakpoints upward. Three widths must be checked for every screen:
  **375px (phone, unprefixed)**, **768px (tablet, `md:`)** and
  **1280px (laptop, `xl:`)**. Never introduce horizontal page scroll at any of them.
- **Tap targets at least 44px tall** — `min-h-11` in Tailwind. Applies to every
  button, nav link and form control, because most customers are on a phone.
- **Every page handles loading, error and empty states.** All three, explicitly — a
  page that renders only the happy path is incomplete. "Empty" means a real, distinct
  state (no products matched, cart is empty, no orders yet), not a blank area. With
  TanStack Query this means handling `isPending` / `isError` / an empty result set
  before returning the populated view.

## Styling and brand

Tailwind v4 is configured **in CSS, not in a `tailwind.config.js`** — there is no
config file and adding one is not how v4 works. Define design tokens in an `@theme`
block in `src/index.css` so they become real utilities:

```css
@import "tailwindcss";

@theme {
  --color-brand-dark: #0f172a;   /* dark blue  — headers, footers, text */
  --color-brand: #2563eb;        /* bright blue — CTAs, links, accents */
}
```

Those two are the brand colours; use `bg-brand`, `text-brand-dark` etc. rather than
hard-coding the hex values in class names or inline styles.

## Money and locale

Prices are **Sri Lankan rupees, displayed with the `Rs.` prefix** (e.g. `Rs. 249,900`),
not `LKR` and not `$`. Route all price rendering through a single formatter in
`src/lib` instead of formatting inline, so grouping and the prefix stay consistent:

```js
export const formatPrice = (amount) =>
  `Rs. ${new Intl.NumberFormat("en-LK").format(amount)}`;
```

Store prices as numbers in the database and format only at render time.

## Domain rules

These are correctness rules, not style preferences — breaking one is a bug.

- **Order totals are calculated on the server, never in the browser.** Checkout sends
  only product ids and quantities to a Supabase database function; that function reads
  the real prices, checks stock, computes the total, writes the order and reduces
  stock. Any total rendered in React is display-only. This is what stops a customer
  editing a price.
- **`order_items` stores the price paid at purchase time.** Never join to the current
  product price when showing an old order — later price changes must not rewrite history.
- **Stock drops automatically when an order is placed.** Cancelling an order lets the
  admin return the items to stock; it does not happen by itself.
- **Order status** is one of: Pending, Confirmed, Packed, Shipped, Delivered, Cancelled.
  Only the system sets Pending; the admin drives the rest; a customer may cancel
  **only while Pending**. **Payment status** is Unpaid, Paid or Refunded.
- **Admin access is enforced twice.** The React guard hides `/admin`, and Row Level
  Security blocks the data even if someone guesses the URL. The UI check alone is
  never sufficient.
- **Validate twice.** The zod schema in the browser is for UX; database rules and
  constraints are the real enforcement.
- Guests may browse and fill a cart (stored in the browser), but must sign in to check
  out, and their cart has to survive that round trip.

## Secrets

Vite inlines every `VITE_`-prefixed variable into the client bundle as plain text, so
**a `VITE_` variable is public by definition.** Only the Supabase URL and the **anon**
key belong there, and they are only safe because Row Level Security is enabled on the
tables — so any new table needs RLS policies, not trust in the client.

A service-role key, or any other server-side secret, must never appear in a `VITE_`
variable, in `src/`, or in a committed file. Work that genuinely needs elevated
privileges belongs in a Supabase Edge Function or other server-side code, not in the
frontend. `.env` is git-ignored; `.env.example` documents the required names and is
committed with placeholder values only.
