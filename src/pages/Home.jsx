import { Link } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import Reveal from "../components/ui/Reveal.jsx";
import HeroArt from "../components/art/HeroArt.jsx";
import CategoryTile from "../components/CategoryTile.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ChevronRightIcon } from "../components/icons.jsx";
import { categories, sampleProducts } from "../lib/sampleProducts.js";

/* Sample data for now - roadmap step 5 replaces these with Supabase queries. */
const featured = sampleProducts.slice(0, 4);
const deals = sampleProducts.filter((product) => product.discount_price != null).slice(0, 4);

function SectionHeading({ title, subtitle, to }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {to ? (
        <Link
          to={to}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-700"
        >
          View all
          <ChevronRightIcon className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ---- Hero ---------------------------------------------------- */}
      <section className="relative overflow-hidden bg-brand-dark text-white">
        {/* Decorative glow, kept behind the content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-brand/25 blur-3xl"
        />

        <Container className="relative">
          <div className="grid items-center gap-8 py-12 xl:grid-cols-2 xl:py-20">
            <div className="animate-fade-up">
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-inset ring-white/15">
                Island-wide delivery &middot; Cash on Delivery
              </span>

              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl xl:text-5xl">
                The tech you want,
                <span className="block text-brand">delivered to your door.</span>
              </h1>

              <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
                Genuine mobiles, laptops, tablets and accessories with warranty on every
                item. Pay cash when it arrives.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button to="/products" variant="primary">
                  Shop now
                </Button>
                <Button
                  to="/products?category=laptops"
                  variant="secondary"
                  className="bg-white/10 text-white ring-white/20 hover:bg-white/15 hover:text-white hover:ring-white/40"
                >
                  Browse laptops
                </Button>
              </div>

              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
                {[
                  { value: "500+", label: "Products" },
                  { value: "24h", label: "Dispatch" },
                  { value: "4.8★", label: "Customer rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-xl font-bold sm:text-2xl">{stat.value}</dd>
                    <p className="mt-0.5 text-xs text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </dl>
            </div>

            <div className="animate-fade-in xl:justify-self-end">
              <HeroArt className="mx-auto w-full max-w-md" />
            </div>
          </div>
        </Container>
      </section>

      {/* ---- Categories ---------------------------------------------- */}
      <Container className="py-12">
        <Reveal>
          <SectionHeading
            title="Shop by category"
            subtitle="Six categories, everything in stock and under warranty."
          />
        </Reveal>

        <Reveal className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => (
            <CategoryTile key={category.slug} category={category} />
          ))}
        </Reveal>
      </Container>

      {/* ---- Featured ------------------------------------------------ */}
      <Container className="py-4">
        <Reveal>
          <SectionHeading
            title="Featured this week"
            subtitle="Picked by our team."
            to="/products"
          />
        </Reveal>

        <Reveal className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Reveal>
      </Container>

      {/* ---- Promo band ---------------------------------------------- */}
      <Container className="py-12">
        <Reveal className="overflow-hidden rounded-3xl bg-linear-to-br from-brand-700 via-brand to-brand-900 p-8 text-white sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                No card? No problem.
              </h2>
              <p className="mt-2 max-w-md text-brand-100">
                Pay with cash when your order reaches your door, anywhere in Sri Lanka.
              </p>
            </div>
            <Button
              to="/products"
              variant="secondary"
              className="bg-white text-brand-dark hover:bg-brand-50 hover:text-brand-dark"
            >
              Start shopping
            </Button>
          </div>
        </Reveal>
      </Container>

      {/* ---- Deals --------------------------------------------------- */}
      <Container className="pb-16">
        <Reveal>
          <SectionHeading
            title="Deals right now"
            subtitle="Discounts while stocks last."
            to="/products"
          />
        </Reveal>

        <Reveal className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Reveal>
      </Container>
    </>
  );
}
