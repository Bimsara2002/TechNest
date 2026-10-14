import { useState } from "react";
import { Link } from "react-router-dom";
import Coverflow from "./Coverflow.jsx";
import {
  AccessoryIcon,
  AudioIcon,
  ChevronRightIcon,
  LaptopIcon,
  MobileIcon,
  TabletIcon,
  WatchIcon,
} from "./icons.jsx";
import { formatPrice } from "../lib/format.js";
import { payablePrice } from "../lib/products.js";
import { categories, sampleProducts } from "../lib/sampleProducts.js";

const icons = {
  mobiles: MobileIcon,
  laptops: LaptopIcon,
  tablets: TabletIcon,
  accessories: AccessoryIcon,
  audio: AudioIcon,
  watches: WatchIcon,
};

/**
 * One 3D carousel, switchable by category.
 *
 * Deliberately a single stage with tabs rather than a carousel per category:
 * six separate coverflows down one page would compete with each other and make
 * the page enormous on a phone.
 *
 * The tab strip carries an icon, a count and a "from" price, so a customer can
 * tell what a category holds and roughly what it costs before opening it —
 * which is the whole job of this section.
 */
const tabs = categories
  .map((category) => {
    const products = sampleProducts.filter((p) => p.category === category.slug);
    const prices = products.map(payablePrice);

    return {
      ...category,
      products,
      count: products.length,
      from: prices.length ? Math.min(...prices) : 0,
      // Only the first eight go on the carousel; the rest are a click away.
      featured: products.slice(0, 8),
    };
  })
  .filter((category) => category.count >= 2);

export default function ShowcaseCarousel() {
  const [active, setActive] = useState(tabs[0]?.slug ?? "");

  const current = tabs.find((tab) => tab.slug === active) ?? tabs[0];
  if (!current) return null;

  const ActiveIcon = icons[current.slug] ?? MobileIcon;

  return (
    <div>
      {/* Category tabs */}
      <div
        role="tablist"
        aria-label="Product categories"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0"
      >
        {tabs.map((tab) => {
          const Icon = icons[tab.slug] ?? MobileIcon;
          const selected = tab.slug === current.slug;

          return (
            <button
              key={tab.slug}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(tab.slug)}
              className={`group relative inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-2xl px-4 py-2 text-sm font-semibold transition-all duration-300 active:scale-95 ${
                selected
                  ? "bg-brand text-white shadow-lift"
                  : "bg-white/10 text-slate-300 ring-1 ring-inset ring-white/15 hover:bg-white/15 hover:text-white"
              }`}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-xl transition-colors duration-300 ${
                  selected ? "bg-white/20" : "bg-white/10 group-hover:bg-white/15"
                }`}
              >
                <Icon className="size-4" />
              </span>

              <span className="flex flex-col items-start leading-tight">
                <span>{tab.name}</span>
                <span
                  className={`text-[11px] font-medium ${selected ? "text-white/70" : "text-slate-400"}`}
                >
                  {tab.count} items
                </span>
              </span>

              {/* Active marker, scaling in from the centre */}
              <span
                aria-hidden="true"
                className={`absolute inset-x-5 -bottom-px h-0.5 rounded-full bg-white transition-transform duration-300 ${
                  selected ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* What the customer is looking at. Keyed so it re-animates per tab. */}
      <div
        key={current.slug}
        className="animate-fade-up mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-inset ring-white/10 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-lift">
            <ActiveIcon className="size-6" />
          </span>
          <div>
            <h3 className="text-lg font-bold leading-tight">{current.name}</h3>
            <p className="text-sm text-slate-400">{current.blurb}</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              From
            </p>
            <p className="text-lg font-bold">{formatPrice(current.from)}</p>
          </div>

          <Link
            to={`/products?category=${current.slug}`}
            className="group inline-flex min-h-11 items-center gap-1 rounded-xl bg-white px-4 text-sm font-semibold text-brand-dark transition-all hover:bg-brand-50 active:scale-95"
          >
            See all {current.count}
            <ChevronRightIcon className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Remounting on category change resets the carousel to its middle card
          instead of leaving it on an index the new list may not have. */}
      <div className="mt-8">
        <Coverflow key={current.slug} products={current.featured} category={current} />
      </div>
    </div>
  );
}
