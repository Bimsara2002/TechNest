/**
 * Stand-in for a product photograph until real images arrive in Supabase
 * Storage (feature guide 4.3).
 *
 * The silhouette follows the product's category and the background tint is
 * derived from the product id, so a grid looks varied but a given product
 * always renders the same tile. Swap this for an <img> fed by
 * products.image_url without touching any layout around it.
 */

const palettes = [
  ["#eff6ff", "#bfdbfe"],
  ["#eef2ff", "#c7d2fe"],
  ["#f0f9ff", "#bae6fd"],
  ["#f1f5f9", "#cbd5e1"],
  ["#ecfeff", "#a5f3fc"],
];

const shapes = {
  mobiles: (
    <g>
      <rect x="76" y="34" width="48" height="92" rx="8" fill="#0f172a" />
      <rect x="80" y="38" width="40" height="84" rx="5" fill="#2563eb" />
      <rect x="92" y="41" width="16" height="3" rx="1.5" fill="#0f172a" opacity="0.5" />
    </g>
  ),
  laptops: (
    <g>
      <rect x="48" y="44" width="104" height="66" rx="6" fill="#0f172a" />
      <rect x="54" y="50" width="92" height="54" rx="3" fill="#2563eb" />
      <path d="M36 110h128l10 12H26z" fill="#0f172a" />
    </g>
  ),
  tablets: (
    <g>
      <rect x="60" y="34" width="80" height="94" rx="8" fill="#0f172a" />
      <rect x="66" y="40" width="68" height="82" rx="4" fill="#2563eb" />
    </g>
  ),
  audio: (
    <g>
      <path
        d="M58 96V80a42 42 0 0 1 84 0v16"
        fill="none"
        stroke="#0f172a"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <rect x="44" y="90" width="26" height="40" rx="12" fill="#2563eb" />
      <rect x="130" y="90" width="26" height="40" rx="12" fill="#2563eb" />
    </g>
  ),
  watches: (
    <g>
      <rect x="74" y="52" width="52" height="56" rx="15" fill="#0f172a" />
      <rect x="80" y="58" width="40" height="44" rx="11" fill="#2563eb" />
      <path d="M86 34h28v18H86zM86 108h28v18H86z" fill="#0f172a" opacity="0.75" />
    </g>
  ),
  accessories: (
    <g>
      <rect x="62" y="68" width="76" height="40" rx="10" fill="#0f172a" />
      <path
        d="M86 68V44M114 68V44"
        stroke="#0f172a"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M100 108v10a16 16 0 0 1-16 16H68"
        fill="none"
        stroke="#2563eb"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </g>
  ),
};

/** Stable small hash so the same id always picks the same palette. */
function paletteFor(seed) {
  const text = String(seed ?? "");
  let total = 0;
  for (let i = 0; i < text.length; i += 1) total += text.charCodeAt(i);
  return palettes[total % palettes.length];
}

export default function ProductArt({ category = "mobiles", seed = 0, className = "" }) {
  const [from, to] = paletteFor(seed);
  const gradientId = `tile-${String(seed).replace(/\W/g, "")}`;

  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="200" height="160" fill={`url(#${gradientId})`} />
      {shapes[category] ?? shapes.mobiles}
    </svg>
  );
}
