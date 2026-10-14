import { useState } from "react";
import { brands, payablePrice } from "../lib/products.js";
import { categories, sampleProducts } from "../lib/sampleProducts.js";
import { formatPrice } from "../lib/format.js";
import { SearchIcon } from "./icons.jsx";

/**
 * Price ceiling derived from the catalogue rather than hardcoded. A fixed
 * 500,000 used to hide every laptop above it with no way to reach them.
 */
const PRICE_CEILING = Math.ceil(
  Math.max(...sampleProducts.map(payablePrice)) / 50000,
) * 50000;

const PRICE_STEP = 25000;

/** How many products each brand actually has, so the list is informative. */
const brandCounts = sampleProducts.reduce((acc, product) => {
  acc[product.brand] = (acc[product.brand] ?? 0) + 1;
  return acc;
}, {});

/**
 * Filter controls, rendered twice: as a sidebar from xl up and inside the
 * mobile slide-up panel. One component so the two can never drift apart.
 */
export default function ProductFilters({ filters, onChange, onClear }) {
  const [brandQuery, setBrandQuery] = useState("");

  const toggleBrand = (name) => {
    const next = filters.brand.includes(name)
      ? filters.brand.filter((b) => b !== name)
      : [...filters.brand, name];
    onChange({ brand: next });
  };

  const visibleBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(brandQuery.trim().toLowerCase()),
  );

  const activeCount =
    (filters.category ? 1 : 0) + filters.brand.length + (filters.maxPrice != null ? 1 : 0);

  return (
    <div className="space-y-7">
      <section>
        <h3 className="text-sm font-semibold">Category</h3>
        <ul className="mt-3 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onChange({ category: "" })}
              className={`flex min-h-11 w-full items-center rounded-lg px-3 text-sm transition-colors ${
                filters.category === ""
                  ? "bg-brand-50 font-semibold text-brand-700"
                  : "hover:bg-slate-100"
              }`}
            >
              All products
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <button
                type="button"
                onClick={() => onChange({ category: category.slug })}
                className={`flex min-h-11 w-full items-center rounded-lg px-3 text-sm transition-colors ${
                  filters.category === category.slug
                    ? "bg-brand-50 font-semibold text-brand-700"
                    : "hover:bg-slate-100"
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold">Brand</h3>
          {filters.brand.length > 0 ? (
            <button
              type="button"
              onClick={() => onChange({ brand: [] })}
              className="text-xs font-medium text-brand hover:underline"
            >
              Clear {filters.brand.length}
            </button>
          ) : null}
        </div>

        {/* Twenty brands is too many to scan, so the list is searchable and
            capped in height — otherwise it pushes the price filter off screen. */}
        <div className="relative mt-3">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={brandQuery}
            onChange={(event) => setBrandQuery(event.target.value)}
            placeholder={`Search ${brands.length} brands`}
            aria-label="Search brands"
            className="h-10 w-full rounded-lg bg-white pl-9 pr-3 text-sm ring-1 ring-slate-200 transition-shadow focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {visibleBrands.length === 0 ? (
          <p className="mt-3 px-3 text-sm text-slate-500">
            No brand matches “{brandQuery}”.
          </p>
        ) : (
          <ul className="mt-2 max-h-64 space-y-0.5 overflow-y-auto pr-1">
            {visibleBrands.map((brand) => (
              <li key={brand}>
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="size-4 shrink-0 rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span className="flex-1 truncate">{brand}</span>
                  <span className="text-xs text-slate-400">{brandCounts[brand] ?? 0}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold">Max price</h3>
        <input
          type="range"
          min={PRICE_STEP}
          max={PRICE_CEILING}
          step={PRICE_STEP}
          value={filters.maxPrice ?? PRICE_CEILING}
          onChange={(event) => {
            const value = Number(event.target.value);
            onChange({ maxPrice: value >= PRICE_CEILING ? null : value });
          }}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand"
          aria-label="Maximum price"
        />
        <p className="mt-2 text-sm text-slate-600">
          Up to{" "}
          <span className="font-semibold text-brand-dark">
            {filters.maxPrice == null ? "any price" : formatPrice(filters.maxPrice)}
          </span>
        </p>
      </section>

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand transition-colors hover:text-brand-700"
        >
          Clear all filters ({activeCount})
        </button>
      ) : null}
    </div>
  );
}
