import { useState } from "react";
import { Link } from "react-router-dom";
import Container from "./ui/Container.jsx";
import Reveal from "./ui/Reveal.jsx";
import {
  ArrowUpIcon,
  CashIcon,
  ChevronRightIcon,
  FacebookIcon,
  InstagramIcon,
  Logo,
  MailIcon,
  PhoneIcon,
  ShieldIcon,
  TruckIcon,
  WhatsAppIcon,
} from "./icons.jsx";
import { useToast } from "../store/toastStore.js";

const columns = [
  {
    title: "Shop",
    links: [
      { to: "/products?category=mobiles", label: "Mobiles" },
      { to: "/products?category=laptops", label: "Laptops" },
      { to: "/products?category=tablets", label: "Tablets" },
      { to: "/products?category=audio", label: "Audio" },
      { to: "/products", label: "All products" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/orders", label: "My orders" },
      { to: "/wishlist", label: "Wishlist" },
      { to: "/profile", label: "Profile" },
      { to: "/login", label: "Sign in" },
      { to: "/register", label: "Create account" },
    ],
  },
  {
    title: "Help",
    links: [
      { to: "/contact", label: "Contact us" },
      { to: "/faq", label: "FAQ" },
      { to: "/policies", label: "Delivery & returns" },
      { to: "/policies", label: "Warranty" },
      { to: "/about", label: "About TechNest" },
    ],
  },
];

const promises = [
  { Icon: TruckIcon, title: "Island-wide delivery", note: "Free over Rs. 50,000" },
  { Icon: CashIcon, title: "Cash on Delivery", note: "Pay when it arrives" },
  { Icon: ShieldIcon, title: "Warranty included", note: "On every item we sell" },
];

const socials = [
  { Icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/94110000000" },
  { Icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { Icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
];

function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-4 text-sm font-semibold text-white ring-1 ring-inset ring-white/15 transition-all hover:bg-white/15 active:scale-95"
    >
      <ArrowUpIcon className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
      Back to top
    </button>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const toast = useToast();

  const subscribe = (event) => {
    event.preventDefault();
    if (!email.trim()) return;
    // Step 10 writes this to the database; for now it acknowledges the intent
    // rather than pretending a list exists.
    toast("Thanks — we will email you when deals land");
    setEmail("");
  };

  return (
    <footer className="mt-20 bg-brand-dark text-slate-300">
      {/* Animated brand rule, so the footer starts with a deliberate edge */}
      <div
        aria-hidden="true"
        className="mesh-surface animate-gradient h-1 w-full"
      />

      {/* Promise strip */}
      <div className="border-b border-white/10">
        <Container>
          <ul className="grid gap-3 py-7 sm:grid-cols-3">
            {promises.map(({ Icon, title, note }) => (
              <li
                key={title}
                className="group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">{title}</span>
                  <span className="block text-xs text-slate-400">{note}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <Container>
        {/* Newsletter */}
        <Reveal className="border-b border-white/10 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-bold text-white">Deals, before they sell out</h2>
              <p className="mt-1 text-sm text-slate-400">
                One email a week. Offers and new stock, nothing else.
              </p>
            </div>

            <form onSubmit={subscribe} className="flex w-full max-w-sm gap-2">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.lk"
                className="h-11 min-w-0 flex-1 rounded-xl bg-white/10 px-3.5 text-sm text-white placeholder:text-slate-500 transition-all focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-brand"
              />
              <button
                type="submit"
                className="group inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-all hover:bg-brand-700 active:scale-95"
              >
                Join
                <ChevronRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </Reveal>

        {/* Columns */}
        <div className="grid gap-8 py-10 sm:grid-cols-2 xl:grid-cols-4">
          <Reveal>
            <Link to="/" className="group inline-flex items-center gap-2 text-lg font-bold text-white">
              <Logo className="size-8 transition-transform duration-500 group-hover:rotate-6" />
              <span>
                Tech<span className="text-brand">Nest</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Mobiles, laptops, tablets and accessories, delivered anywhere in Sri
              Lanka.
            </p>

            <ul className="mt-4 space-y-1 text-sm">
              <li>
                <a
                  href="tel:+94110000000"
                  className="group inline-flex min-h-11 items-center gap-2 transition-colors hover:text-white"
                >
                  <PhoneIcon className="size-4 text-brand transition-transform duration-300 group-hover:scale-110" />
                  +94 11 000 0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@technest.lk"
                  className="group inline-flex min-h-11 items-center gap-2 transition-colors hover:text-white"
                >
                  <MailIcon className="size-4 text-brand transition-transform duration-300 group-hover:scale-110" />
                  hello@technest.lk
                </a>
              </li>
            </ul>

            <ul className="mt-3 flex gap-2">
              {socials.map(({ Icon, label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex size-11 items-center justify-center rounded-xl bg-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand hover:text-white"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {columns.map((column, index) => (
            <Reveal key={column.title} delay={80 + index * 70}>
              <nav aria-label={column.title}>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
                  {column.title}
                </h2>
                <ul className="mt-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="group inline-flex min-h-11 items-center gap-1.5 text-sm transition-colors hover:text-white"
                      >
                        <ChevronRightIcon className="size-3 -ml-1 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} TechNest. All rights reserved.</p>
          <p>Prices in Sri Lankan Rupees (Rs.)</p>
          <BackToTop />
        </div>
      </Container>
    </footer>
  );
}
