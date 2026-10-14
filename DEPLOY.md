# Deploying TechNest

Roadmap step 12. Takes about ten minutes the first time, and nothing after that
— every later push deploys itself.

Host: **Vercel**, free tier, with HTTPS included.

---

## Before you start

You need:

- The code pushed to GitHub (`github.com/Bimsara2002/TechNest`)
- A Vercel account — sign up **with GitHub** so the repo is already connected

You do **not** need Supabase yet. Nothing in the app imports the Supabase client
at the moment, so the site builds and runs without any keys. Add them later,
when the database exists (step 6 below).

---

## Step 1 — Push the current code

Vercel builds whatever is on GitHub, not what is on your laptop. If your last
push was a while ago, Vercel will happily deploy that old version and you will
wonder why the site looks wrong.

```bash
git status            # anything listed here is NOT on GitHub yet
git add -A
git commit -m "Describe what changed"
git push origin main
```

Check it landed: open the repo on GitHub and confirm the commit is at the top.

---

## Step 2 — Import the project

1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Under *Import Git Repository*, find **TechNest** and click **Import**
   - Not listed? Click *Adjust GitHub App Permissions* and grant access to the repo.

---

## Step 3 — Check the build settings

Vercel detects Vite and fills these in. Confirm rather than retype:

| Setting | Value |
| --- | --- |
| Framework Preset | **Vite** |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Root Directory | leave empty |

Leave *Environment Variables* empty for now.

Click **Deploy**.

---

## Step 4 — Check it actually works

The build takes about a minute, then you get a URL like
`technest-abc123.vercel.app`. Open it and check:

- [ ] The home page loads with the hero, offers and carousel
- [ ] Click into a product, then **refresh the page**. It must still work — if
      you get a 404, see Troubleshooting
- [ ] Open it on a real phone, not just a narrow browser window
- [ ] Add something to the cart, reload, and confirm the cart survives

From now on **every push to `main` redeploys automatically**. Pull requests get
their own preview URL, which is the safe way to review a change before it is
live.

---

## Step 5 — Custom domain (optional)

1. **Project → Settings → Domains → Add**
2. Enter your domain, e.g. `technest.lk`
3. Vercel shows one of two options:
   - **Nameservers** — change them at your registrar. Simplest, Vercel manages DNS.
   - **A / CNAME record** — add it at your registrar. Use this if your email or
     other services already depend on the current DNS.
4. HTTPS is issued automatically once DNS resolves — usually minutes, sometimes
   up to a day.

---

## Step 6 — Connect Supabase (once the database exists)

Two things, and forgetting either is the usual cause of "it works locally but
not live".

**6a. Add the environment variables**

*Project → Settings → Environment Variables*, for Production, Preview and
Development:

| Name | Where to find it |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon / public key |

Copy the **anon** key, never the service_role key. Anything prefixed `VITE_` is
compiled into the JavaScript bundle and is readable by every visitor.

> **Then redeploy.** Vite bakes environment variables in at build time, so an
> existing deployment will not pick up new values. *Deployments → ⋯ → Redeploy.*

**6b. Tell Supabase about the live URL**

Supabase → *Authentication → URL Configuration*:

- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: add both `https://your-domain.com/**` and your
  `*.vercel.app` URL

Skip this and sign-in links will redirect to `localhost`.

---

## Troubleshooting

**Deep links 404 on refresh** (`/products/5` works when clicked, breaks on
reload) — the SPA rewrite is missing. [`vercel.json`](vercel.json) in the repo
root handles this:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Make sure that file was committed and pushed.

**Build fails on the Node version** — Vite 8 needs Node `^20.19` or `>=22.12`.
*Settings → General → Node.js Version* → pick **22.x**.

**Blank white page, console shows a module error** — almost always a
case-sensitive import. Windows does not care about `Button.jsx` vs
`button.jsx`; Vercel's Linux builders do. Check the import matches the filename
exactly.

**Supabase works locally but not live** — you added the environment variables
but did not redeploy. See the note in step 6a.

**The site shows an old version** — the commit is not on GitHub. Run
`git status`; anything listed has not been pushed.

**Build works locally but fails on Vercel** — reproduce the clean build:

```bash
rm -rf node_modules dist
npm install
npm run build
```

This catches dependencies that are installed on your machine but missing from
`package.json`.

---

## Other hosts

Nothing here is Vercel-specific — it is a static Vite build. Any of these work:

| Host | Build command | Publish directory | SPA rewrite |
| --- | --- | --- | --- |
| **Netlify** | `npm run build` | `dist` | `_redirects` file with `/* /index.html 200` |
| **Cloudflare Pages** | `npm run build` | `dist` | Handled automatically for SPAs |
| **GitHub Pages** | `npm run build` | `dist` | Awkward — needs a `base` path in `vite.config.js` and a 404.html hack. Not recommended here. |

Vercel is what the feature guide specifies and has the least configuration.
