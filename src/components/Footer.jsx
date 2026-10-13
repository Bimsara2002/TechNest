import { Link } from "react-router-dom";
import Container from "./ui/Container.jsx";
import { CashIcon, Logo, MailIcon, PhoneIcon, ShieldIcon, TruckIcon } from "./icons.jsx";

const columns = [
  {
    title: "Shop",
    links: [
      { to: "/products?category=mobiles", label: "Mobiles" },
      { to: "/products?category=laptops", label: "Laptops" },
      { to: "/products?category=tablets", label: "Tablets" },
      { to: "/products?category=audio", label: "Audio" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/orders", label: "My orders" },
      { to: "/wishlist", label: "Wishlist" },
      { to: "/profile", label: "Profile" },
      { to: "/login", label: "Sign in" },
    ],
  },
  {
    title: "Help",
    links: [
      { to: "/contact", label: "Contact us" },
      { to: "/faq", label: "FAQ" },
      { to: "/policies", label: "Delivery & returns" },
      { to: "/about", label: "About TechNest" },
    ],
  },
];

const promises = [
  { Icon: TruckIcon, text: "Island-wide delivery" },
  { Icon: CashIcon, text: "Cash on Delivery" },
  { Icon: ShieldIcon, text: "Warranty on every item" },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-brand-dark text-slate-300">
      {/* Promise strip */}
      <div className="border-b border-white/10">
        <Container>
          <ul className="grid gap-3 py-6 sm:grid-cols-3">
            {promises.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-medium text-white">{text}</span>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <Container>
        <div className="grid gap-8 py-10 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold text-white">
              <Logo className="size-8" />
              <span>
                Tech<span className="text-brand">Nest</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Mobiles, laptops, tablets and accessories, delivered anywhere in Sri Lanka.
            </p>

            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="tel:+94110000000"
                  className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-white"
                >
                  <PhoneIcon className="size-4 text-brand" />
                  +94 11 000 0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@technest.lk"
                  className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-white"
                >
                  <MailIcon className="size-4 text-brand" />
                  hello@technest.lk
                </a>
              </li>
            </ul>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
                {column.title}
              </h2>
              <ul className="mt-3">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="inline-flex min-h-11 items-center text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} TechNest. All rights reserved.</p>
          <p>Prices in Sri Lankan Rupees (Rs.)</p>
        </div>
      </Container>
    </footer>
  );
}
