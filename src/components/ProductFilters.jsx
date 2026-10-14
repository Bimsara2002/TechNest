import { brands } from "../lib/products.js";
import { categories } from "../lib/sampleProducts.js";
import { formatPrice } from "../lib/format.js";

const PRICE_CEILING = 500000;

/**
 * Filter controls, rendered twice: as a sidebar from xl up and inside the
 * mobile slide-up panel. One component so the two can never drift apart.
 */
export default function ProductFilters({ filters, onChange, onClear }) {
  const toggleBrand = (name) => {
    const next = filters.brand.includes(name)
      ? filters.brand.filter((b) => b !== name)
      : [...filters.brand, name];
    onChange({ brand: next });
  };

  const active =
    filters.category || filters.brand.length > 0 || filters.maxPrice != null;

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
        <h3 className="text-sm font-semibold">Brand</h3>
        <ul className="mt-3 space-y-1">
          {brands.map((brand) => (
            <li key={brand}>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm transition-colors hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={filters.brand.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="size-4 rounded border-slate-300 text-brand focus:ring-brand"
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-sm font-semibold">Max price</h3>
        <input
          type="range"
          min={10000}
          max={PRICE_CEILING}
          step={5000}
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

      {active ? (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-brand transition-colors hover:text-brand-700"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );
}
