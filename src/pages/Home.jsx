import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Reveal from "../components/ui/Reveal.jsx";
import Reveal3D from "../components/ui/Reveal3D.jsx";
import Stagger from "../components/ui/Stagger.jsx";
import Spotlight from "../components/ui/Spotlight.jsx";
import HomeHero from "../components/HomeHero.jsx";
import DealOfTheDay from "../components/DealOfTheDay.jsx";
import OfferDeck from "../components/OfferDeck.jsx";
import CategoryTile from "../components/CategoryTile.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ShowcaseCarousel from "../components/ShowcaseCarousel.jsx";
// Lazy: between them these carry ~37 KB of brand logo path data, and both sit
// well below the fold. Splitting keeps that off the critical path on a phone.
const BrandMarquee = lazy(() => import("../components/BrandMarquee.jsx"));
const BrandGrid = lazy(() => import("../components/BrandGrid.jsx"));
import { ChevronRightIcon } from "../components/icons.jsx";
import { categories, sampleProducts } from "../lib/sampleProducts.js";

/* Sample data for now - roadmap step 5 replaces these with Supabase queries. */
const laptops = sampleProducts.filter(
  (product) => product.category === "laptops" && product.image,
);
const deals = sampleProducts.filter((product) => product.discount_price != null).slice(0, 4);

function SectionHeading({ title, subtitle, to, light = false }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2
          className={`text-xl font-bold tracking-tight sm:text-2xl ${light ? "text-white" : ""}`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className={`mt-1 text-sm ${light ? "text-slate-400" : "text-slate-600"}`}>
            {subtitle}
          </p>
        ) : null}
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

      {/* ---- Deal of the day: live countdown -------------------------- */}
      <DealOfTheDay />

      {/* ---- Categories: flip tiles ---------------------------------- */}
      <Container className="py-12">
        <Reveal>
          <SectionHeading
            title="Shop by category"
            subtitle="Six categories, everything in stock and under warranty."
          />
        </Reveal>

        <Stagger
          step={70}
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6"
        >
          {categories.map((category) => (
            <CategoryTile key={category.slug} category={category} />
          ))}
        </Stagger>
      </Container>

      {/* ---- Phone lineup: 3D coverflow on a dark stage --------------- */}
      <Spotlight className="overflow-hidden bg-brand-dark py-14 text-white">
        {/* Drifting glows behind the carousel */}
        <div
          aria-hidden="true"
          className="animate-glow pointer-events-none absolute -left-20 top-10 size-80 rounded-full bg-brand/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="animate-glow pointer-events-none absolute -right-24 bottom-0 size-96 rounded-full bg-brand-700/30 blur-3xl"
          style={{ animationDelay: "-2.5s" }}
        />

        <Container className="relative">
          <Reveal>
            <SectionHeading
              light
              title="Explore the range"
              subtitle="Flip through every category — swipe, drag or use the arrow keys."
            />
          </Reveal>

          <Reveal3D className="mt-8">
            <ShowcaseCarousel />
          </Reveal3D>
        </Container>
      </Spotlight>

      {/* ---- Brands ---------------------------------------------------- */}
      <Container className="pt-10">
        <Reveal>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Brands we work with
          </p>
        </Reveal>
        <Suspense fallback={<div className="h-24" />}>
          <BrandMarquee />
        </Suspense>
      </Container>

      <Container className="pb-12">
        <Reveal>
          <SectionHeading
            title="Shop by brand"
            subtitle="Twenty brands, with more arriving as stock lands."
            to="/products"
          />
        </Reveal>

        <Reveal3D className="mt-6">
          <Suspense fallback={<div className="h-48" />}>
            <BrandGrid />
          </Suspense>
        </Reveal3D>
      </Container>

      {/* ---- Gaming laptops ------------------------------------------- */}
      <Container className="py-6">
        <Reveal>
          <SectionHeading
            title="Built for gaming"
            subtitle="RTX laptops in stock, every one under warranty."
            to="/products?category=laptops"
          />
        </Reveal>

        <Stagger className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {laptops.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Stagger>
      </Container>

      {/* ---- Offers: 3D card deck ------------------------------------- */}
      <Container className="py-10">
        <Reveal>
          <SectionHeading
            title="Offers right now"
            subtitle="Campaigns running this week. The deck pauses while you read it."
          />
        </Reveal>

        <Reveal3D className="mt-6">
          <OfferDeck />
        </Reveal3D>
      </Container>

      {/* ---- Deals ----------------------------------------------------- */}
      <Container className="py-12">
        <Reveal>
          <SectionHeading
            title="Deals right now"
            subtitle="Discounts while stocks last."
            to="/products"
          />
        </Reveal>

        <Stagger className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Stagger>
      </Container>
    </>
  );
}
