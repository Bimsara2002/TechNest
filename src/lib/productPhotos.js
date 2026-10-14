/**
 * Per-product photography, wired up automatically by filename.
 *
 * ## How to add a product photo
 *
 * Drop a file into `src/assets/products/` named after the product's slug:
 *
 *     src/assets/products/acer-swift-go-14-oled.webp
 *
 * That is all. No import to write, no map to edit, no code change — Vite picks
 * it up at build time and the product starts using it. Run
 * `npm run photos:todo` to print every product still waiting for one, with the
 * exact filename it expects.
 *
 * Prefer WebP at roughly 800x800. A 2 MB JPEG straight off a camera will be
 * served as-is to customers on mobile data.
 */
const files = import.meta.glob("../assets/products/*.{webp,jpg,jpeg,png,avif}", {
  eager: true,
  import: "default",
});

/** { "acer-nitro-5-rtx-4060": "/assets/acer-nitro-5-....webp" } */
export const productPhotos = Object.fromEntries(
  Object.entries(files).map(([path, src]) => [
    path.split("/").pop().replace(/\.[^.]+$/, ""),
    src,
  ]),
);

/**
 * The filename a product's photo must use. Derived from brand and name so it
 * is stable and guessable — rename a product and the slug moves with it.
 */
export function productSlug(product) {
  const brand = product.brand.toLowerCase();
  const name = product.name.toLowerCase();

  // Several products already carry the brand ("Acer 65W Adapter"), which would
  // otherwise produce acer-acer-65w-adapter.
  const combined = name.startsWith(brand) ? name : `${brand}-${name}`;

  return combined.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** True when this exact product has its own photograph. */
export const hasOwnPhoto = (product) => Boolean(productPhotos[productSlug(product)]);
