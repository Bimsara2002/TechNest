/**
 * Promotional offers — the shop's own campaigns, not third-party advertising.
 *
 * TEMPORARY: these become rows in the `banners` and `coupons` tables, managed
 * from /admin/banners and /admin/coupons. The shapes already match, so moving
 * to the database changes this file and nothing that renders it.
 *
 * End times are relative to page load so the countdowns always show something
 * live while the backend is still ahead. Real rows carry absolute timestamps.
 */
const hoursFromNow = (hours) => new Date(Date.now() + hours * 3600_000).toISOString();

export const offers = [
  {
    id: "flash",
    kind: "flash",
    eyebrow: "Flash deal",
    headline: "Galaxy S24 Ultra",
    subline: "Rs. 37,000 off while stock lasts",
    cta: "Grab the deal",
    link: "/products/2",
    productId: 2,
    endsAt: hoursFromNow(8),
    tone: "brand",
  },
  {
    id: "gaming",
    kind: "category",
    eyebrow: "Gaming week",
    headline: "RTX laptops from Rs. 298,000",
    subline: "Legion, TUF, Katana and Nitro in stock",
    cta: "Shop gaming",
    link: "/products?category=laptops",
    endsAt: hoursFromNow(52),
    tone: "dark",
  },
  {
    id: "coupon",
    kind: "coupon",
    eyebrow: "New customer",
    headline: "10% off your first order",
    subline: "Use code NEWNEST10 at checkout",
    code: "NEWNEST10",
    cta: "Start shopping",
    link: "/products",
    endsAt: hoursFromNow(120),
    tone: "accent",
  },
  {
    id: "delivery",
    kind: "shipping",
    eyebrow: "Always on",
    headline: "Free delivery over Rs. 50,000",
    subline: "Island-wide, with Cash on Delivery",
    cta: "See what qualifies",
    link: "/products",
    endsAt: null,
    tone: "brand",
  },
];

/** Short lines for the announcement ticker at the top of every page. */
export const announcements = [
  "Free delivery on orders over Rs. 50,000",
  "Use code NEWNEST10 for 10% off your first order",
  "Cash on Delivery anywhere in Sri Lanka",
  "Gaming week — RTX laptops from Rs. 298,000",
];

/** The one offer given the full countdown treatment on the home page. */
export const dealOfTheDay = offers[0];
