import { sampleProducts, categories } from "./sampleProducts.js";

/**
 * Data access for the catalogue.
 *
 * TEMPORARY: these read the in-memory sample array. At roadmap step 5 each
 * function body is replaced with a Supabase query — the signatures and return
 * shapes stay identical, so no hook, page or component changes.
 *
 * The small delay is deliberate: it keeps the loading states on every page
 * real and testable instead of theoretical. Remove it with the sample data.
 */
const FAKE_LATENCY_MS = 220;

const settle = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), FAKE_LATENCY_MS));

export const brands = [...new Set(sampleProducts.map((p) => p.brand))].sort();

export const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

/** Price actually charged, discount included. The one definition of "payable". */
export const payablePrice = (product) =>
  product.discount_price != null && product.discount_price < product.price
    ? product.discount_price
    : product.price;

export async function fetchProducts({
  q = "",
  category = "",
  brand = [],
  maxPrice = null,
  sort = "newest",
} = {}) {
  let rows = [...sampleProducts];

  const term = q.trim().toLowerCase();
  if (term) {
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term),
    );
  }

  if (category) rows = rows.filter((p) => p.category === category);
  if (brand.length > 0) rows = rows.filter((p) => brand.includes(p.brand));
  if (maxPrice != null) rows = rows.filter((p) => payablePrice(p) <= maxPrice);

  switch (sort) {
    case "price-asc":
      rows.sort((a, b) => payablePrice(a) - payablePrice(b));
      break;
    case "price-desc":
      rows.sort((a, b) => payablePrice(b) - payablePrice(a));
      break;
    case "rating":
      rows.sort((a, b) => b.rating - a.rating);
      break;
    default:
      rows.sort((a, b) => b.id - a.id);
  }

  return settle(rows);
}

export async function fetchProductById(id) {
  const product = sampleProducts.find((p) => String(p.id) === String(id));
  if (!product) throw new Error("Product not found");
  return settle(product);
}

export async function fetchRelatedProducts(product, limit = 4) {
  const rows = sampleProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
  return settle(rows);
}

/** Resolves cart entries ({id: qty}) into full lines with prices. */
export async function fetchCartLines(items) {
  const lines = Object.entries(items)
    .map(([id, quantity]) => {
      const product = sampleProducts.find((p) => String(p.id) === String(id));
      return product ? { product, quantity } : null;
    })
    .filter(Boolean);
  return settle(lines);
}

export const categoryList = categories;
