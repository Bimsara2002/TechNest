import { brandLogos } from "../lib/brandLogoPaths.js";

/**
 * A brand mark, drawn with currentColor so one set works on the light strip
 * and the dark footer alike. Renders nothing for an unknown slug, which lets
 * callers fall back to a text wordmark.
 */
export default function BrandLogo({ slug, className = "h-6 w-auto" }) {
  const logo = brandLogos[slug];
  if (!logo) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label={logo.name}
      className={className}
    >
      <path d={logo.d} />
    </svg>
  );
}
