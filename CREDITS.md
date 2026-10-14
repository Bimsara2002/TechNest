# Image credits

## Adding a real photo to a product

Drop a WebP into `src/assets/products/` named after the product's slug:

```
src/assets/products/acer-swift-go-14-oled.webp
```

It is picked up automatically — no import, no map, no code change. Run
`npm run photos:todo` (optionally `-- Acer`) to list every product still
waiting for one, with the exact filename it expects. This beats every
stand-in below.

## Two tiers of product photography — read this first

The catalogue deliberately has two kinds of image, and the difference matters
before anything is listed for sale:

| Tier | Where | Match |
| --- | --- | --- |
| **Curated** | `src/lib/sampleProducts.js`, images in `src/assets/products/` | Verified against the actual product — in many cases the brand is legible in the photo |
| **Breadth** | `src/lib/generatedProducts.js`, images in `src/assets/pool/` | **Category-representative only.** A real photograph of a laptop stands in for a laptop; it is not that specific model |

The breadth tier exists so every brand has a populated shelf while the shop is
being built. **Replace those images with supplier photography before selling.**
The pool images are genuine photographs under the Unsplash licence, so there is
no licensing problem — the issue is only that a customer could be shown a
different model than the one they are buying.

Both tiers live in files marked TEMPORARY and are replaced wholesale when a
real product feed arrives.

## Category photography — `src/assets/categories/`

Source: [Unsplash](https://unsplash.com). Downloaded, cropped to square and
converted to WebP; the originals are not redistributed.

The [Unsplash License](https://unsplash.com/license) grants free use for
commercial and non-commercial purposes with no permission required. Attribution
is appreciated rather than required, which is why this file exists.

| File | Unsplash photo id | Shows |
| --- | --- | --- |
| `mobiles.webp` | `photo-1634403665481-74948d815f03` | Smartphone on a plain background |
| `laptops.webp` | `photo-1611186871348-b1ce696e52c9` | Silver laptop, part-open, on grey |
| `tablets.webp` | `photo-1625864667534-aa5208d45a87` | Tablet and stylus on grey fabric |
| `audio.webp` | `photo-1618366712010-f4ae9c647dcb` | Over-ear wireless headphones |
| `watches.webp` | `photo-1624096104992-9b4fa3a279dd` | Smartwatch on white |
| `accessories.webp` | `photo-1627886107121-b7daaede3974` | USB charger and cable on a desk |

Each is served from `/src/assets`, not hotlinked from `images.unsplash.com`.
Hotlinking is what Unsplash's API guidelines discourage; self-hosting a
downloaded copy is fine.

To add photographer names, open
`https://unsplash.com/photos/<id>` for any row above and copy the credit.

## Brand product photography — `src/assets/pool/brand-*.webp`

Used ahead of the generic pool, so a brand shows its own hardware. Each was
checked by eye and the maker's mark is visible in the shot.

| File | Brand | Source | Licence |
| --- | --- | --- | --- |
| `brand-acer.webp` | Acer | Supplied by the shop owner (Nitro 5 render) | Manufacturer render — see note below |
| `brand-dell.webp` | Dell | Wikimedia Commons, `DELL_XPS_13_and_15_(37080596413).jpg` by Tinh tế Photo | **CC0** public domain |
| `brand-lenovo.webp` | Lenovo | Wikimedia Commons, `ThinkPad_T14.jpg` by Edvard10 | **CC0** public domain |
| `brand-google.webp` | Google | Unsplash | Unsplash Licence |
| `brand-bose*.webp` | Bose | Unsplash | Unsplash Licence |
| `brand-rgb*.webp` | Razer, MSI | Unsplash | Unsplash Licence |

Both Commons files are CC0, so no attribution is legally required — the table
records it anyway because it is the decent thing to do and it lets you re-check
the source later.

**Rejected on quality, not licence:** a real Xiaomi 14 Pro photo from Commons
was dropped because it is a shop-display snapshot with price tags, a cluttered
retail background and a Chinese spec screen. It would have looked worse than
the neutral stand-in it replaced. Brand-correct is not automatically better.

Manufacturer renders (the Acer, and the Samsung/Lenovo/Asus/MSI images supplied
by the owner) are used the way a retailer uses them — to illustrate products the
shop sells. They are not covered by the licences above; check with each
manufacturer before using them anywhere other than the storefront.

## Brand logos — `src/components/brandLogos.jsx`

Source: [Simple Icons](https://simpleicons.org). The icon files are released
under **CC0 1.0** (public domain), so the SVG artwork itself carries no
licensing restriction. They are inlined as path data rather than fetched, so the
brand strip costs no network requests.

**The logos remain trademarks of their respective owners.** A retailer showing a
manufacturer's mark to indicate the products it actually sells is ordinary
nominative use. Two things to keep to:

- Only display a brand's mark for products you genuinely stock. The strip and
  grid mark unstocked brands as "coming soon" and do not link them, which is
  why that distinction is in the code rather than a comment.
- Do not alter a mark's shape, or use one in a way that implies endorsement,
  partnership or authorised-reseller status unless that is actually the case.

Included: Acer, Apple, ASUS, Bose, Dell, Google, HP, Huawei, JBL, Lenovo, LG,
MSI, OnePlus, OPPO, Razer, Samsung, Sony, vivo, Xiaomi. Anker has no Simple
Icons mark and renders as a text wordmark.

## iPhone photography — `src/assets/products/iphone-*.webp`

Source: [Unsplash](https://unsplash.com), same licence as the category photos.

| File | Unsplash photo id |
| --- | --- |
| `iphone-16-pro.webp` | `photo-1726587912121-ea21fcc57ff8` |
| `iphone-16-pro-max.webp` | `photo-1727013884184-b313982327f3` |
| `iphone-17-pro.webp` | `photo-1763891378295-5d9bd5c48745` |
| `iphone-17-pro-max.webp` | `photo-1759588071781-2c3ba9128497` |

> **These are not official Apple product shots, and the exact model is not
> guaranteed.** Each was checked by eye and matches its generation's design —
> the 16-series images show the square camera island and titanium frame, the
> 17-series images show the wide camera plateau and aluminium unibody. But a
> Pro and a Pro Max differ only in size, which a single photo cannot settle.
>
> Before listing these for sale, replace them with product shots from your
> supplier or distributor. Showing a customer the wrong model is a refund
> request waiting to happen.

## Other product photography — Unsplash

| File | Product it illustrates | Match quality |
| --- | --- | --- |
| `macbook-air-m3.webp` | MacBook Air 13 M3 | Exact — "MacBook Air" is legible on the bezel |
| `ipad-10th-gen.webp` | iPad 10th Generation | Right brand and device type |
| `apple-watch-s9.webp` | Watch Series 9 45mm | Apple Watch, generation not confirmed |
| `galaxy-watch6.webp` | Galaxy Watch6 44mm | Samsung round smartwatch, model not confirmed |
| `sony-wh1000xm5.webp` | WH-1000XM5 Headphones | Sony WH-1000X series, exact model not confirmed |
| `galaxy-buds2-pro.webp` | Galaxy Buds2 Pro | Correct device type; no brand visible |
| `jbl-tune-770nc.webp` | Tune 770NC | Correct device type; no brand visible |

Brand-exact additions — the manufacturer's own logo is legible in each of these,
so there is no doubt what they show:

| File | Product | What confirms it |
| --- | --- | --- |
| `airpods-pro-2.webp` | AirPods Pro 2 | Box reads "AirPods Pro" |
| `airpods-4.webp` | AirPods 4 | Unmistakable AirPods shape |
| `macbook-pro-14.webp` | MacBook Pro 14 M4 | Apple laptop |
| `macbook-pro-16.webp` | MacBook Pro 16 M4 Max | Illuminated Apple logo |
| `jbl-clip-5.webp` | JBL Clip 5 | JBL logo on the grille |
| `jbl-flip-6.webp` | JBL Flip 6 | JBL logo on the grille |
| `jbl-pulse-5.webp` | JBL Pulse 5 | JBL logo on the end cap |
| `sony-srs-xb100.webp` | Sony SRS-XB100 | SONY on the strap |

Rule applied when picking these: **a photo is only used where its visible
branding does not contradict the product.** Two otherwise good shots were
rejected for failing it — one was legibly a "Baseus 70W GaN" adapter and one a
"gomi 10,000 mAh" power bank, neither of which could honestly illustrate the
Anker products they would have been labelling.

These five products therefore still use the drawn `ProductArt` placeholder:
Galaxy Tab S9 FE, Tab M11, 65W GaN Fast Charger, 20000mAh Power Bank,
7-in-1 USB-C Hub. A placeholder is better than a picture of a different
product.

## Supplied product photography — `src/assets/products/`

Samsung Galaxy S21–S25 Ultra, Lenovo Legion, Asus TUF, MSI Katana, Acer Nitro:
supplied by the shop owner. These are manufacturer product renders for items
TechNest sells (Samsung Galaxy S21–S25 Ultra, Lenovo Legion, Asus TUF, MSI
Katana, Acer Nitro). Normal practice for a retailer listing those products, but
they are **not** covered by the Unsplash licence above — check with each
manufacturer before using them outside the storefront.

## Hero banner — `src/assets/hero-*.webp`

Supplied by the shop owner.

## Icons and placeholder art

`src/components/icons.jsx`, `src/components/art/*` — drawn for this project.
No third-party licence applies.
