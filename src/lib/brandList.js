import { brands as stockedBrands } from "./products.js";

/**
 * Brands shown in the strip and the brand grid.
 *
 * `name` must match the `brand` field on products exactly — it is what the
 * /products?brand= filter matches on. `stocked` is derived rather than
 * hardcoded, so a brand lights up on its own as soon as a product carries it.
 */
const catalogue = [
  { slug: "apple", name: "Apple" },
  { slug: "samsung", name: "Samsung" },
  { slug: "xiaomi", name: "Xiaomi" },
  { slug: "google", name: "Google" },
  { slug: "oneplus", name: "OnePlus" },
  { slug: "oppo", name: "OPPO" },
  { slug: "vivo", name: "vivo" },
  { slug: "huawei", name: "Huawei" },
  { slug: "hp", name: "HP" },
  { slug: "dell", name: "Dell" },
  { slug: "lenovo", name: "Lenovo" },
  { slug: "asus", name: "Asus" },
  { slug: "acer", name: "Acer" },
  { slug: "msi", name: "MSI" },
  { slug: "sony", name: "Sony" },
  { slug: "jbl", name: "JBL" },
  { slug: "bose", name: "Bose" },
  { slug: "lg", name: "LG" },
  { slug: "razer", name: "Razer" },
  // No Simple Icons mark exists for Anker, so it renders as a wordmark.
  { slug: null, name: "Anker" },
];

/** Every brand we have a mark for, stocked or not. */
export const brandCatalogue = catalogue.map((brand) => ({
  ...brand,
  stocked: stockedBrands.includes(brand.name),
}));

/**
 * What the storefront actually shows: brands with something to sell.
 *
 * A grid where most tiles read "coming soon" makes the shop look emptier than
 * it is, so unstocked brands are simply absent. They reappear on their own as
 * soon as a product carries the name — nothing to remember to switch on.
 */
export const brandList = brandCatalogue.filter((brand) => brand.stocked);
