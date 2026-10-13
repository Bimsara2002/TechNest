import { Link } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import Reveal from "../components/ui/Reveal.jsx";
import HomeHero from "../components/HomeHero.jsx";
import CategoryTile from "../components/CategoryTile.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ChevronRightIcon } from "../components/icons.jsx";
import { categories, sampleProducts } from "../lib/sampleProducts.js";

/* Sample data for now - roadmap step 5 replaces these with Supabase queries. */
const phones = sampleProducts.filter((product) => product.category === "mobiles");
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
      <HomeHero />

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

      {/* ---- Phones -------------------------------------------------- */}
      <Container className="py-4">
        <Reveal>
          <SectionHeading
            title="Galaxy S Ultra lineup"
            subtitle="Five generations in stock, from the S21 to the brand new S25."
            to="/products?category=mobiles"
          />
        </Reveal>

        <Reveal className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
          {phones.map((product) => (
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
