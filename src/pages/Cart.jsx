import { Link } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Button from "../components/ui/Button.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import QuantityStepper from "../components/ui/QuantityStepper.jsx";
import ProductImage from "../components/ProductImage.jsx";
import CartSummary from "../components/CartSummary.jsx";
import { EmptyState, ErrorState } from "../components/ui/States.jsx";
import { CartIcon, CloseIcon } from "../components/icons.jsx";
import { formatPrice } from "../lib/format.js";
import { payablePrice } from "../lib/products.js";
import { cartTotals } from "../lib/cart.js";
import { useCartLines } from "../hooks/useProducts.js";
import { useCartStore } from "../store/cartStore.js";
import { useToast } from "../store/toastStore.js";

function CartLine({ line, onQuantity, onRemove }) {
  const { product, quantity } = line;
  const unit = payablePrice(product);
  const soldOut = product.stock <= 0;

  return (
    <li className="animate-fade-up flex gap-4 py-5">
      <Link
        to={`/products/${product.id}`}
        className="shrink-0 overflow-hidden rounded-xl bg-linear-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200"
      >
        <ProductImage product={product} className="size-24 p-2 sm:size-28" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {product.brand}
            </p>
            <h3 className="truncate font-semibold">
              <Link to={`/products/${product.id}`} className="transition-colors hover:text-brand">
                {product.name}
              </Link>
            </h3>
            <p className="mt-0.5 text-sm text-slate-600">{formatPrice(unit)} each</p>
          </div>

          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.name} from cart`}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        {soldOut ? (
          <p className="mt-2 text-sm font-medium text-rose-600">
            This item went out of stock — remove it to continue.
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          <QuantityStepper
            value={quantity}
            onChange={onQuantity}
            max={Math.max(product.stock, 1)}
          />
          <span className="font-bold">{formatPrice(unit * quantity)}</span>
        </div>
      </div>
    </li>
  );
}

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);
  const toast = useToast();

  const { data: lines, isPending, isError, refetch } = useCartLines(items);

  const empty = Object.keys(items).length === 0;

  if (empty) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={CartIcon}
          title="Your cart is empty"
          message="Browse the shop and add something you like — your cart is saved on this device."
          actionLabel="Continue shopping"
          actionTo="/products"
        />
      </Container>
    );
  }

  const totals = lines ? cartTotals(lines) : null;
  const hasSoldOut = lines?.some((line) => line.product.stock <= 0) ?? false;

  return (
    <Container className="py-6 xl:py-10">
      <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "Cart" }]} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Your cart</h1>
        <button
          type="button"
          onClick={() => {
            clear();
            toast("Cart cleared", "info");
          }}
          className="inline-flex min-h-11 items-center text-sm font-medium text-slate-500 transition-colors hover:text-rose-600"
        >
          Clear cart
        </button>
      </div>

      {isError ? (
        <div className="mt-8">
          <ErrorState
            title="Could not load your cart"
            message="Your saved items are still here. Retry to load their current prices."
            onRetry={refetch}
          />
        </div>
      ) : isPending ? (
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid gap-8 xl:grid-cols-[1fr_340px] xl:items-start">
          <ul className="divide-y divide-slate-200 rounded-2xl bg-white px-5 ring-1 ring-slate-200">
            {lines.map((line) => (
              <CartLine
                key={line.product.id}
                line={line}
                onQuantity={(q) => setQuantity(line.product.id, q)}
                onRemove={() => {
                  remove(line.product.id);
                  toast(`${line.product.name} removed`, "info");
                }}
              />
            ))}
          </ul>

          {/* Side panel on laptop, sticky bottom bar on phones */}
          <div className="hidden xl:sticky xl:top-24 xl:block">
            <CartSummary totals={totals}>
              <Button to="/checkout" disabled={hasSoldOut} className="w-full">
                Checkout
              </Button>
              {hasSoldOut ? (
                <p className="mt-2 text-center text-xs text-rose-600">
                  Remove the out-of-stock item to continue.
                </p>
              ) : null}
            </CartSummary>
          </div>

          <div className="xl:hidden">
            <CartSummary totals={totals} />
          </div>
        </div>
      )}

      {/* Sticky mobile checkout bar */}
      {totals && !isPending ? (
        <div className="animate-slide-up fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur-md xl:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Total</p>
              <p className="truncate text-lg font-bold">{formatPrice(totals.total)}</p>
            </div>
            <Button to="/checkout" disabled={hasSoldOut} className="flex-1">
              Checkout
            </Button>
          </div>
        </div>
      ) : null}

      {/* Spacer so the sticky bar never covers the last row */}
      <div className="h-24 xl:hidden" />
    </Container>
  );
}
