import ProductArt from "./art/ProductArt.jsx";
import { productPhotos, productSlug } from "../lib/productPhotos.js";

/**
 * One seam for every product picture in the app. Resolution order:
 *
 *   1. `image_url`            a real photo uploaded through the admin area
 *   2. its own slug file      src/assets/products/<brand>-<name>.webp
 *   3. a legacy `image` key   the hand-named curated files
 *   4. `imageSrc`             a brand or category stand-in
 *   5. ProductArt            the drawn placeholder
 *
 * Steps 1 and 2 are the only ones guaranteed to show the actual product; the
 * rest are stand-ins. Pages never branch on which applied — drop a correctly
 * named file into src/assets/products/ and that product upgrades itself.
 */
export default function ProductImage({ product, className = "", eager = false }) {
  const src =
    product.image_url ??
    productPhotos[productSlug(product)] ??
    productPhotos[product.image] ??
    product.imageSrc ??
    null;

  if (src) {
    return (
      <img
        src={src}
        // Decorative here: the product name is always rendered beside it as
        // real text, so repeating it would just make screen readers say it twice.
        alt=""
        width="800"
        height="800"
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`object-contain ${className}`}
      />
    );
  }

  return (
    <ProductArt category={product.category} seed={product.id} className={className} />
  );
}
