# TechNest

A mobile-first web storefront built with React and Vite.

> **Status: early scaffold.** The toolchain and dependencies are in place, but the
> application screens have not been built yet — `src/App.jsx` is still the Vite
> starter page. See [Roadmap](#roadmap).

## Tech stack

| Concern | Choice |
| --- | --- |
| UI framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Routing | React Router 7 |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 |
| Backend / auth / data | Supabase |
| Forms & validation | React Hook Form + Zod |
| Linting | ESLint 10 |

## Getting started

Requires [Node.js](https://nodejs.org) 20.19+ or 22.12+ (Vite 8 requirement).

```bash
git clone https://github.com/Bimsara2002/TechNest.git
cd TechNest
npm install
```

Copy the environment template and fill in your own Supabase project values:

```bash
cp .env.example .env
```

Then start the dev server:

```bash
npm run dev
```

Vite prints a local URL (default <http://localhost:5173>).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot module replacement |
| `npm run build` | Produce a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

## Environment variables

Defined in `.env` (git-ignored — never commit it). Only variables prefixed with
`VITE_` are exposed to the client bundle.

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

The anon key is safe to ship in a client bundle **only** when Row Level Security
is enabled on your Supabase tables. Never put a service-role key in a `VITE_`
variable.

## Project structure

```
shop/
├── public/          # Static assets served as-is
├── src/
│   ├── assets/      # Imported images and SVGs
│   ├── App.jsx      # Root component
│   ├── main.jsx     # Entry point, mounts React
│   └── index.css    # Global styles
├── index.html       # Vite HTML entry
└── vite.config.js   # Vite + React + Tailwind plugins
```

## Roadmap

- [ ] Import Tailwind in `src/index.css` (`@import "tailwindcss";`) — the plugin
      is registered in `vite.config.js` but no stylesheet imports it yet, so
      utility classes currently have no effect
- [ ] Mobile-first app shell with bottom navigation
- [ ] Routes: home, product listing, product detail, cart, account
- [ ] Supabase client setup and product data layer
- [ ] Cart state in Zustand with persistence
- [ ] Auth flow (sign up, sign in, session handling)
- [ ] Checkout

## License

No license has been chosen yet. Until one is added, all rights are reserved and
the code is not licensed for reuse.
