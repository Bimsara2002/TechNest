import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Container from "./ui/Container.jsx";
import {
  CartIcon,
  CloseIcon,
  Logo,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "./icons.jsx";
import { useCartCount } from "../store/cartStore.js";

const links = [
  { to: "/products", label: "Shop" },
  { to: "/products?category=mobiles", label: "Mobiles" },
  { to: "/products?category=laptops", label: "Laptops" },
  { to: "/products?category=audio", label: "Audio" },
  { to: "/contact", label: "Contact" },
];

const drawerLinks = [
  ...links,
  { to: "/orders", label: "My orders" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/login", label: "Sign in" },
];

function CartButton({ count, className = "" }) {
  return (
    <Link
      to="/cart"
      className={`group relative inline-flex size-11 items-center justify-center rounded-xl transition-colors hover:bg-white/10 ${className}`}
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      <CartIcon className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
      {count > 0 ? (
        <span
          key={count}
          className="animate-pop absolute right-1 top-1 flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold leading-5 text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}

/** Underline that grows from the centre, rather than a colour change alone. */
const navLinkClass = ({ isActive }) =>
  `group relative inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
    isActive ? "text-white" : "text-slate-300 hover:text-white"
  }`;

function NavUnderline({ isActive }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-x-3 bottom-1.5 h-0.5 origin-center rounded-full bg-brand transition-transform duration-300 ${
        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 8,
  );
  const [term, setTerm] = useState("");
  const progressRef = useRef(null);
  const count = useCartCount();
  const location = useLocation();
  const navigate = useNavigate();

  // Close the drawer whenever the route changes, so tapping a link never
  // leaves the overlay covering the page it just opened. Derived during render
  // rather than in an effect, which avoids a second render pass and still
  // catches browser back/forward (location.key changes on every entry).
  const [lastLocationKey, setLastLocationKey] = useState(location.key);
  if (location.key !== lastLocationKey) {
    setLastLocationKey(location.key);
    setMenuOpen(false);
  }

  // Lock background scroll and wire Escape while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Elevation plus a reading-progress bar. The bar is a scaleX on a CSS custom
  // property written inside rAF, so scrolling never re-renders React — only
  // the boolean elevation flag does, and that changes at most once per sweep.
  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        progressRef.current?.style.setProperty("--progress", String(ratio));
        setScrolled(window.scrollY > 8);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = term.trim();
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-brand-dark/95 text-white backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-brand-dark/30" : ""
      }`}
    >
      <Container>
        <div className="flex items-center gap-2 py-2">
          <Link
            to="/"
            className="group inline-flex min-h-11 items-center gap-2 pr-2 text-lg font-bold tracking-tight"
          >
            <Logo className="size-8 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
            <span>
              Tech<span className="text-brand">Nest</span>
            </span>
          </Link>

          {/* Laptop navigation */}
          <nav aria-label="Main" className="ml-4 hidden xl:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.label}>
                  <NavLink to={link.to} className={navLinkClass} end={link.to === "/products"}>
                    {({ isActive }) => (
                      <>
                        {link.label}
                        <NavUnderline isActive={isActive} />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Search: inline from tablet up, full-width row on phones */}
          <form
            onSubmit={submitSearch}
            role="search"
            className="ml-auto hidden md:block md:w-52 xl:w-72"
          >
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <div className="group relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand" />
              <input
                id="site-search"
                type="search"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Search products"
                className="h-11 w-full rounded-xl bg-white/10 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 transition-all duration-300 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-brand xl:focus:w-80"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 md:ml-2">
            <Link
              to="/login"
              className="hidden size-11 items-center justify-center rounded-xl transition-all hover:bg-white/10 active:scale-90 md:inline-flex"
              aria-label="Account"
            >
              <UserIcon className="size-5" />
            </Link>

            <CartButton count={count} />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex size-11 items-center justify-center rounded-xl transition-all hover:bg-white/10 active:scale-90 xl:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <MenuIcon className="size-6" />
            </button>
          </div>
        </div>

        {/* Phone search row */}
        <form onSubmit={submitSearch} role="search" className="pb-2 md:hidden">
          <label className="sr-only" htmlFor="site-search-mobile">
            Search products
          </label>
          <div className="group relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-brand" />
            <input
              id="site-search-mobile"
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search phones, laptops, gadgets"
              className="h-11 w-full rounded-xl bg-white/10 pl-9 pr-3 text-sm text-white placeholder:text-slate-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </form>
      </Container>

      {/* Reading progress, pinned to the bottom edge of the bar.
          Written as `transform` rather than Tailwind's scale-x utility: v4
          compiles that to the standalone `scale` property, which
          transition-transform does not animate. */}
      <div
        ref={progressRef}
        aria-hidden="true"
        style={{ "--progress": 0, transform: "scaleX(var(--progress))" }}
        className="h-0.5 origin-left bg-linear-to-r from-brand to-brand-100 transition-transform duration-150 ease-out"
      />

      {/* Mobile drawer */}
      {menuOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="animate-fade-in absolute inset-0 w-full cursor-default bg-brand-dark/60 backdrop-blur-sm"
          />

          <nav
            aria-label="Mobile"
            className="animate-slide-in absolute right-0 top-0 flex h-full w-72 max-w-[85%] flex-col bg-brand-dark shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <span className="inline-flex items-center gap-2 font-semibold">
                <Logo className="size-7" />
                Menu
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex size-11 items-center justify-center rounded-xl transition-all hover:bg-white/10 active:scale-90"
                aria-label="Close menu"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto px-2 py-2">
              {drawerLinks.map((link, index) => (
                <li
                  key={link.label}
                  className="animate-slide-in"
                  // Staggered entrance, capped so the last item never lags.
                  style={{ animationDelay: `${Math.min(index * 45, 300)}ms` }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-brand text-white"
                          : "text-slate-200 hover:bg-white/10 hover:pl-4"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <p className="border-t border-white/10 px-4 py-3 text-xs text-slate-400">
              Cash on Delivery across Sri Lanka
            </p>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
