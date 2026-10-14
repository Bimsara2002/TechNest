import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Stagger from "../components/ui/Stagger.jsx";
import { ProductCardSkeleton } from "../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../components/ui/States.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { useWishlistStore } from "../store/wishlistStore.js";

export default function Wishlist() {
  const ids = useWishlistStore((state) => state.ids);
  const clear = useWishlistStore((state) => state.clear);

  // Fetch the whole catalogue and filter: with the real backend this becomes
  // a single `in` query against the saved ids.
  const { data: products, isPending, isError, refetch } = useProducts({});
  const saved = products?.filter((product) => ids.includes(product.id)) ?? [];

  return (
    <Container className="py-6 xl:py-10">
      <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "Wishlist" }]} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Wishlist</h1>
          <p className="mt-1 text-sm text-slate-600">
            {ids.length} saved item{ids.length === 1 ? "" : "s"}
          </p>
        </div>

        {ids.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="inline-flex min-h-11 items-center text-sm font-medium text-slate-500 transition-colors hover:text-rose-600"
          >
            Clear wishlist
          </button>
        ) : null}
      </div>

      {isError ? (
        <div className="mt-8">
          <ErrorState onRetry={refetch} />
        </div>
      ) : isPending ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Nothing saved yet"
            message="Tap the heart on any product to keep it here for later."
            actionLabel="Browse products"
            actionTo="/products"
          />
        </div>
      ) : (
        <Stagger className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {saved.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Stagger>
      )}
    </Container>
  );
}
