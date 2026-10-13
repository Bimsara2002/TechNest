/**
 * Hero illustration: a laptop with a phone and a watch in front of it, on a
 * brand gradient. Pure SVG, so it is sharp on every screen, costs no network
 * request and carries no image licence.
 *
 * Decorative only - the surrounding section carries the real heading text, so
 * this is aria-hidden rather than given alt text.
 */
export default function HeroArt({ className = "" }) {
  return (
    <svg
      viewBox="0 0 420 320"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="hero-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="hero-phone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <radialGradient id="hero-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient glow behind the devices */}
      <ellipse cx="210" cy="150" rx="190" ry="140" fill="url(#hero-glow)" />

      {/* Laptop */}
      <g className="animate-float" style={{ transformOrigin: "210px 150px" }}>
        <rect x="96" y="54" width="228" height="146" rx="10" fill="#0b1220" />
        <rect x="106" y="64" width="208" height="126" rx="5" fill="url(#hero-screen)" />
        {/* Screen content: a product grid, mirroring the real listing page */}
        <g fill="#ffffff" opacity="0.92">
          <rect x="120" y="78" width="54" height="7" rx="3.5" opacity="0.8" />
          <rect x="120" y="96" width="84" height="46" rx="5" opacity="0.28" />
          <rect x="212" y="96" width="84" height="46" rx="5" opacity="0.28" />
          <rect x="120" y="150" width="84" height="26" rx="5" opacity="0.18" />
          <rect x="212" y="150" width="84" height="26" rx="5" opacity="0.18" />
        </g>
        {/* Base */}
        <path d="M70 200h280l16 18H54z" fill="#111c33" />
        <rect x="186" y="204" width="48" height="5" rx="2.5" fill="#0b1220" />
      </g>

      {/* Phone, front left */}
      <g className="animate-float" style={{ transformOrigin: "88px 200px", animationDelay: "-2.2s" }}>
        <rect x="48" y="128" width="80" height="150" rx="14" fill="#0b1220" />
        <rect x="55" y="135" width="66" height="136" rx="9" fill="url(#hero-phone)" />
        <rect x="74" y="140" width="28" height="4" rx="2" fill="#0b1220" opacity="0.6" />
        <g fill="#ffffff" opacity="0.9">
          <rect x="63" y="155" width="50" height="34" rx="4" opacity="0.3" />
          <rect x="63" y="196" width="34" height="5" rx="2.5" opacity="0.75" />
          <rect x="63" y="207" width="24" height="5" rx="2.5" opacity="0.45" />
          <rect x="63" y="226" width="50" height="14" rx="7" opacity="0.85" />
        </g>
      </g>

      {/* Smart watch, front right */}
      <g className="animate-float" style={{ transformOrigin: "336px 224px", animationDelay: "-4.5s" }}>
        <rect x="306" y="186" width="60" height="76" rx="18" fill="#0b1220" />
        <rect x="313" y="193" width="46" height="62" rx="13" fill="url(#hero-phone)" />
        <path
          d="M336 212v12l8 5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>
    </svg>
  );
}
