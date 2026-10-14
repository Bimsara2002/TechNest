/**
 * Hand-authored icon set. Stroke-based on a 24x24 grid, inheriting
 * currentColor and sized by the caller's font-size or an explicit class.
 *
 * These replace the Vite template's sprite. Keeping them as components (rather
 * than an external icon package) keeps the bundle small and means no network
 * request or licence attribution for a public repo.
 */

function Svg({ children, className = "size-6", ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

/* ---- Category icons ---------------------------------------------------- */

export const MobileIcon = (props) => (
  <Svg {...props}>
    <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
    <path d="M10.5 18.5h3" />
  </Svg>
);

export const LaptopIcon = (props) => (
  <Svg {...props}>
    <rect x="4" y="4.5" width="16" height="11" rx="1.5" />
    <path d="M2 19.5h20" />
  </Svg>
);

export const TabletIcon = (props) => (
  <Svg {...props}>
    <rect x="4" y="2.5" width="16" height="19" rx="2" />
    <path d="M10.5 18.5h3" />
  </Svg>
);

export const AccessoryIcon = (props) => (
  <Svg {...props}>
    <path d="M9 3v5M15 3v5" />
    <rect x="6" y="8" width="12" height="6" rx="2" />
    <path d="M12 14v3a4 4 0 0 1-4 4" />
  </Svg>
);

export const AudioIcon = (props) => (
  <Svg {...props}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="2.5" y="13.5" width="4.5" height="7" rx="2" />
    <rect x="17" y="13.5" width="4.5" height="7" rx="2" />
  </Svg>
);

export const WatchIcon = (props) => (
  <Svg {...props}>
    <rect x="6" y="6" width="12" height="12" rx="3" />
    <path d="M9 6V3h6v3M9 18v3h6v-3M12 10v2.5l1.5 1" />
  </Svg>
);

/* ---- UI icons ---------------------------------------------------------- */

export const SearchIcon = (props) => (
  <Svg {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </Svg>
);

export const CartIcon = (props) => (
  <Svg {...props}>
    <path d="M2.5 3.5h2.2l2.3 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20 7.5H6" />
    <circle cx="9.5" cy="20" r="1.3" />
    <circle cx="17" cy="20" r="1.3" />
  </Svg>
);

export const MenuIcon = (props) => (
  <Svg {...props}>
    <path d="M3.5 6.5h17M3.5 12h17M3.5 17.5h17" />
  </Svg>
);

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
);

export const UserIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="8" r="3.75" />
    <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
  </Svg>
);

export const ChevronRightIcon = (props) => (
  <Svg {...props}>
    <path d="m9 5 7 7-7 7" />
  </Svg>
);

export const TruckIcon = (props) => (
  <Svg {...props}>
    <path d="M2.5 6.5h11v10h-11z" />
    <path d="M13.5 10h4l3 3v3.5h-7z" />
    <circle cx="6.5" cy="18.5" r="1.6" />
    <circle cx="17" cy="18.5" r="1.6" />
  </Svg>
);

export const ShieldIcon = (props) => (
  <Svg {...props}>
    <path d="M12 2.5 4.5 5.5v6c0 4.6 3.1 8.5 7.5 10 4.4-1.5 7.5-5.4 7.5-10v-6z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Svg>
);

export const CashIcon = (props) => (
  <Svg {...props}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.6" />
    <path d="M6 10v4M18 10v4" />
  </Svg>
);

export const PhoneIcon = (props) => (
  <Svg {...props}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  </Svg>
);

export const MailIcon = (props) => (
  <Svg {...props}>
    <rect x="2.5" y="5" width="19" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);

export const StarIcon = ({ className = "size-6", filled = false, ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
    {...rest}
  >
    <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.7l5.9-.8z" />
  </svg>
);

export const ArrowUpIcon = (props) => (
  <Svg {...props}>
    <path d="M12 19.5V5M5.5 11.5 12 5l6.5 6.5" />
  </Svg>
);

/* ---- Social ------------------------------------------------------------
   Filled marks rather than strokes, so they read at the small size used in
   the footer. */

export const FacebookIcon = ({ className = "size-5", ...rest }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...rest}>
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.29-.04-1.27-.12-2.41-.12-2.38 0-4.01 1.45-4.01 4.12v2.3H7.6V13h2.67v8z" />
  </svg>
);

export const WhatsAppIcon = ({ className = "size-5", ...rest }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...rest}>
    <path d="M12.04 2.5a9.4 9.4 0 0 0-8.1 14.1L2.5 21.5l5.05-1.32A9.4 9.4 0 1 0 12.04 2.5m0 1.74a7.66 7.66 0 1 1-3.9 14.25l-.28-.17-2.99.78.8-2.92-.19-.3A7.66 7.66 0 0 1 12.04 4.24m-3.3 3.6c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.54 2.02.78 2.43.63 2.87.59.44-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28s-1.42-.7-1.64-.78c-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06s-1.02-.38-1.94-1.2c-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.19-.46-.39-.4-.54-.41z" />
  </svg>
);

export const InstagramIcon = ({ className = "size-5", ...rest }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true" className={className} {...rest}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

/* ---- Brand mark -------------------------------------------------------- */

/**
 * The TechNest logo: a stylised nest (three arcs) cradling a device.
 * Uses the two brand colours directly so it reads on dark and light surfaces.
 */
export function Logo({ className = "size-8" }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={className}>
      <rect width="32" height="32" rx="8" fill="var(--color-brand-dark)" />
      <rect x="12.5" y="7.5" width="7" height="12" rx="2" fill="var(--color-brand)" />
      <path
        d="M7 18a9 9 0 0 0 18 0"
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4.5 21.5a11.5 11.5 0 0 0 23 0"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
