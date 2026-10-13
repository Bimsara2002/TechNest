import ProductArt from "./art/ProductArt.jsx";

import s21 from "../assets/products/galaxy-s21-ultra.webp";
import s22 from "../assets/products/galaxy-s22-ultra.webp";
import s23 from "../assets/products/galaxy-s23-ultra.webp";
import s24 from "../assets/products/galaxy-s24-ultra.webp";
import s25 from "../assets/products/galaxy-s25-ultra.webp";

/**
 * Local photos, keyed by the `image` field in sampleProducts. This map goes
 * away at step 5: real products carry an `image_url` from Supabase Storage,
 * which the component already prefers over anything local.
 */
const localImages = {
  "galaxy-s21-ultra": s21,
  "galaxy-s22-ultra": s22,
  "galaxy-s23-ultra": s23,
  "galaxy-s24-ultra": s24,
  "galaxy-s25-ultra": s25,
};

/**
 * One seam for every product picture in the app, in priority order:
 * a real uploaded photo, then a bundled local photo, then the drawn
 * placeholder. Pages never branch on which one exists.
 */
export default function ProductImage({ product, className = "", eager = false }) {
  const src = product.image_url ?? localImages[product.image] ?? null;

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
