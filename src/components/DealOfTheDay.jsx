import Container from "./ui/Container.jsx";
import Button from "./ui/Button.jsx";
import Countdown from "./ui/Countdown.jsx";
import Tilt from "./ui/Tilt.jsx";
import Spotlight from "./ui/Spotlight.jsx";
import Magnetic from "./ui/Magnetic.jsx";
import Skeleton from "./ui/Skeleton.jsx";
import ProductImage from "./ProductImage.jsx";
import { CartIcon } from "./icons.jsx";
import { formatPrice } from "../lib/format.js";
import { dealOfTheDay } from "../lib/offers.js";
import { useProduct } from "../hooks/useProducts.js";
import { useCartStore } from "../store/cartStore.js";
import { useToast } from "../store/toastStore.js";

/** Scarcity bar. Capped at a 20-unit scale so a big restock cannot read as "full". */
function StockBar({ stock }) {
  const pct = Math.min(100, (stock / 20) * 100);

  return (
    <div className="mt-6 max-w-xs">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-semibold text-white">{stock} left in stock</span>
        <span className="text-white/60">Selling fast</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-linear-to-r from-amber-400 to-rose-500 transition-[width] duration-700 ease-out"
          style={{ width: `${Math.max(8, pct)}%` }}
        />
      </div>
    </div>
  );
}

export default function DealOfTheDay() {
  const { data: product, isPending, isError } = useProduct(dealOfTheDay.productId);
  const add = useCartStore((state) => state.add);
  const toast = useToast();

  // The whole block is promotional — if the product will not load there is
  // nothing useful to show, so drop the section rather than render an error.
  if (isError) return null;

  if (isPending) {
    return (
      <Container className="py-6">
        <Skeleton className="h-80 w-full rounded-3xl" />
      </Container>
    );
  }

  const hasDiscount =
    product.discount_price != null && product.discount_price < product.price;
  const payable = hasDiscount ? product.discount_price : product.price;
  const saving = hasDiscount ? product.price - product.discount_price : 0;
  const soldOut = product.stock <= 0;

  return (
    <Container className="py-6">
      <Spotlight className="overflow-hidden rounded-3xl bg-brand-dark text-white">
        {/* Pulsing glow behind the product */}
        <div
          aria-hidden="true"
          className="animate-glow pointer-events-none absolute -right-10 top-1/2 size-80 -translate-y-1/2 rounded-full bg-brand/30 blur-3xl"
        />

        <div className="relative grid items-center gap-8 p-6 sm:p-10 xl:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-200 ring-1 ring-inset ring-rose-400/30">
              <span className="size-1.5 animate-pulse rounded-full bg-rose-400" />
              {dealOfTheDay.eyebrow}
            </span>

            <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-4xl">
              {product.name}
            </h2>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold sm:text-4xl">
                {formatPrice(payable)}
              </span>
              {hasDiscount ? (
                <>
                  <span className="text-lg text-white/50 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="animate-pop rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold">
                    Save {formatPrice(saving)}
                  </span>
                </>
              ) : null}
            </div>

            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
                Offer ends in
              </p>
              <Countdown endsAt={dealOfTheDay.endsAt} light />
            </div>

            {!soldOut ? <StockBar stock={product.stock} /> : null}

            <div className="mt-7 flex flex-wrap gap-3">
              <Magnetic strength={0.25}>
                <Button
                  onClick={() => {
                    add(product.id);
                    toast(`${product.name} added to cart`);
                  }}
                  disabled={soldOut}
                >
                  <CartIcon className="size-4" />
                  {soldOut ? "Out of stock" : "Add to cart"}
                </Button>
              </Magnetic>

              <Button
                to={`/products/${product.id}`}
                variant="secondary"
                className="bg-white/10 text-white ring-white/20 backdrop-blur-sm hover:bg-white/15 hover:text-white hover:ring-white/40"
              >
                View details
              </Button>
            </div>
          </div>

          <Tilt max={11} scale={1.03} className="xl:justify-self-end">
            <div className="overflow-hidden rounded-3xl bg-white/5 ring-1 ring-white/10 transform-3d">
              <ProductImage
                product={product}
                className="depth-md aspect-square w-full max-w-sm p-6"
              />
            </div>
          </Tilt>
        </div>
      </Spotlight>
    </Container>
  );
}
