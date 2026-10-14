import { useEffect, useRef } from "react";
import Container from "./ui/Container.jsx";
import Button from "./ui/Button.jsx";
import Tilt from "./ui/Tilt.jsx";
import Magnetic from "./ui/Magnetic.jsx";
import Spotlight from "./ui/Spotlight.jsx";
import { ShieldIcon, TruckIcon } from "./icons.jsx";
import heroWide from "../assets/hero-wide.webp";
import heroNarrow from "../assets/hero-narrow.webp";

const stats = [
  { value: "500+", label: "Products" },
  { value: "24h", label: "Dispatch" },
  { value: "4.8★", label: "Rating" },
];

export default function HomeHero() {
  const imageRef = useRef(null);

  // Scroll parallax: the photo drifts at a fraction of page speed, which reads
  // as depth. Written as a CSS custom property from inside rAF so scrolling
  // never triggers a React render.
  useEffect(() => {
    const node = imageRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY, 700) * 0.18;
        node.style.setProperty("--py", `${offset}px`);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-brand-dark text-white">
      {/* Photograph, scaled slightly so the parallax drift never exposes an edge */}
      <picture>
        <source media="(min-width: 768px)" srcSet={heroWide} />
        <img
          ref={imageRef}
          src={heroNarrow}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full scale-110 object-cover will-change-transform transform-[translate3d(0,var(--py,0),0)]"
        />
      </picture>

      {/* Scrim. Heavier on phones, where the text sits directly over the devices. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-brand-dark via-brand-dark/85 to-brand-dark/40 md:to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-brand-dark to-transparent"
      />

      <Spotlight>
      <Container className="relative">
        <div className="grid items-center gap-10 py-16 xl:grid-cols-[1.1fr_1fr] xl:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
              Island-wide delivery &middot; Cash on Delivery
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl xl:text-6xl">
              The tech you want,
              <span className="block text-brand">delivered to your door.</span>
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
              Genuine mobiles, laptops, tablets and accessories with warranty on every
              item. Pay cash when it arrives.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic strength={0.3}>
                <Button to="/products">Shop now</Button>
              </Magnetic>
              <Button
                to="/products?category=laptops"
                variant="secondary"
                className="bg-white/10 text-white ring-white/20 backdrop-blur-sm hover:bg-white/15 hover:text-white hover:ring-white/40"
              >
                Browse laptops
              </Button>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="text-xl font-bold sm:text-2xl">{stat.value}</dd>
                  <p className="mt-0.5 text-xs text-slate-400">{stat.label}</p>
                </div>
              ))}
            </dl>
          </div>

          {/* Floating glass cards, tilting with the cursor over the photograph */}
          <div className="hidden xl:block xl:justify-self-end">
            <Tilt max={14} scale={1.03} className="w-64">
              <div className="animate-float rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-md transform-3d">
                <span className="depth-md flex size-11 items-center justify-center rounded-xl bg-brand text-white">
                  <TruckIcon className="size-5" />
                </span>
                <p className="depth-sm mt-3 font-semibold">Free delivery</p>
                <p className="mt-1 text-sm text-slate-300">
                  On every order above Rs. 50,000
                </p>
              </div>
            </Tilt>

            <Tilt max={14} scale={1.03} className="mt-5 ml-12 w-64">
              <div
                className="animate-float rounded-2xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-md transform-3d"
                style={{ animationDelay: "-3.5s" }}
              >
                <span className="depth-md flex size-11 items-center justify-center rounded-xl bg-white text-brand-dark">
                  <ShieldIcon className="size-5" />
                </span>
                <p className="depth-sm mt-3 font-semibold">Warranty included</p>
                <p className="mt-1 text-sm text-slate-300">
                  Genuine stock, backed by the shop
                </p>
              </div>
            </Tilt>
          </div>
        </div>
      </Container>
      </Spotlight>
    </section>
  );
}
