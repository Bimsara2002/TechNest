import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductFilters from "../components/ProductFilters.jsx";
import Stagger from "../components/ui/Stagger.jsx";
import { ProductCardSkeleton } from "../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../components/ui/States.jsx";
import { CloseIcon, SearchIcon } from "../components/icons.jsx";
import OfferRibbon from "../components/OfferRibbon.jsx";
import { offers } from "../lib/offers.js";
import { sortOptions } from "../lib/products.js";
import { categories } from "../lib/sampleProducts.js";
import { useProducts } from "../hooks/useProducts.js";

const PAGE_SIZE = 8;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  // The URL is the source of truth for filters, so a filtered list can be
  // shared, bookmarked and survives the back button.
  const filters = {
    q: params.get("q") ?? "",
    category: params.get("category") ?? "",
    brand: params.getAll("brand"),
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : null,
    sort: params.get("sort") ?? "newest",
  };

  const { data: products, isPending, isError, refetch } = useProducts(filters);

  const updateFilters = (patch) => {
    const next = new URLSearchParams(params);

    Object.entries(patch).forEach(([key, value]) => {
      next.delete(key);
      if (Array.isArray(value)) value.forEach((v) => next.append(key, v));
      else if (value !== "" && value != null) next.set(key, String(value));
    });

    setParams(next, { replace: true });
  };

  const clearFilters = () => setParams(filters.q ? { q: filters.q } : {}, { replace: true });

  // A new filter should show results from the top, not 24 items deep.
  const filterSignature = params.toString();
  const [lastSignature, setLastSignature] = useState(filterSignature);
  if (filterSignature !== lastSignature) {
    setLastSignature(filterSignature);
    setVisible(PAGE_SIZE);
  }

  // Lock background scroll while the mobile filter panel is open.
  useEffect(() => {
    if (!panelOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [panelOpen]);

  const activeCategory = categories.find((c) => c.slug === filters.category);
  const shown = products?.slice(0, visible) ?? [];
  const activeCount =
    (filters.category ? 1 : 0) + filters.brand.length + (filters.maxPrice != null ? 1 : 0);

  return (
    <Container className="py-6 xl:py-10">
      <Breadcrumbs
        trail={[
          { label: "Home", to: "/" },
          { label: "Shop", to: "/products" },
          ...(activeCategory ? [{ label: activeCategory.name }] : []),
        ]}
      />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {activeCategory ? activeCategory.name : "All products"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isPending
              ? "Loading products…"
              : `${products?.length ?? 0} product${products?.length === 1 ? "" : "s"}${
                  filters.q ? ` matching “${filters.q}”` : ""
                }`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            value={filters.sort}
            onChange={(event) => updateFilters({ sort: event.target.value })}
            className="min-h-11 rounded-xl bg-white px-3 text-sm font-medium ring-1 ring-slate-200 transition-colors hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-dark px-4 text-sm font-semibold text-white transition-transform active:scale-95 xl:hidden"
          >
            Filters
            {activeCount > 0 ? (
              <span className="animate-pop inline-flex min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs">
                {activeCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <OfferRibbon offer={offers.find((o) => o.id === "coupon")} />
      </div>

      <div className="mt-6 grid gap-8 xl:grid-cols-[232px_1fr]">
        {/* Sidebar filters from xl up */}
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onChange={updateFilters}
              onClear={clearFilters}
            />
          </div>
        </aside>

        <div>
          {isError ? (
            <ErrorState
              title="Could not load products"
              message="The catalogue did not come back. Check your connection and try again."
              onRetry={refetch}
            />
          ) : isPending ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={SearchIcon}
              title="No products found"
              message={
                filters.q
                  ? `Nothing matches “${filters.q}”. Try a different search or clear the filters.`
                  : "No products match these filters. Try widening them."
              }
              actionLabel="Clear filters"
              actionTo="/products"
            />
          ) : (
            <>
              <Stagger className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {shown.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Stagger>

              {visible < products.length ? (
                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="inline-flex min-h-11 items-center rounded-xl bg-white px-6 text-sm font-semibold ring-1 ring-slate-200 transition-all hover:ring-brand hover:text-brand active:scale-95"
                  >
                    Load more ({products.length - visible} left)
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter panel, sliding up from the bottom */}
      {panelOpen ? (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setPanelOpen(false)}
            className="animate-fade-in absolute inset-0 w-full cursor-default bg-brand-dark/60 backdrop-blur-sm"
          />

          <div className="animate-slide-up absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Close filters"
                className="inline-flex size-11 items-center justify-center rounded-xl transition-colors hover:bg-slate-100"
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <ProductFilters
              filters={filters}
              onChange={updateFilters}
              onClear={clearFilters}
            />

            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white transition-transform active:scale-95"
            >
              Show {products?.length ?? 0} results
            </button>
          </div>
        </div>
      ) : null}
    </Container>
  );
}
