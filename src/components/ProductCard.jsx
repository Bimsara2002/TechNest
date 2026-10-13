import { Link } from "react-router-dom";
import ProductArt from "./art/ProductArt.jsx";
import Badge, { StockBadge } from "./ui/Badge.jsx";
import { CartIcon, StarIcon } from "./icons.jsx";
import { formatPrice } from "../lib/format.js";
import { useCartStore } from "../store/cartStore.js";

export default function ProductCard({ product }) {
  const add = useCartStore((state) => state.add);

  const hasDiscount =
    product.discount_price != null && product.discount_price < product.price;
  const payable = hasDiscount ? product.discount_price : product.price;
  const percentOff = hasDiscount
    ? Math.round((1 - product.discount_price / product.price) * 100)
    : 0;
  const soldOut = product.stock <= 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:ring-brand-100">
      <div className="relative overflow-hidden bg-slate-50">
        <ProductArt
          category={product.category}
          seed={product.id}
          className="aspect-square w-full transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {hasDiscount ? <Badge tone="danger">-{percentOff}%</Badge> : null}
          <StockBadge stock={product.stock} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {product.brand}
        </p>

        <h3 className="mt-1 font-semibold leading-snug">
          {/* Stretched link: the whole card is clickable, but only one link is
              in the accessibility tree and the Add button still works. */}
          <Link to={`/products/${product.id}`} className="before:absolute before:inset-0">
            {product.name}
          </Link>
        </h3>

        <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
          <StarIcon filled className="size-3.5 text-amber-400" />
          <span className="font-medium text-slate-700">{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
          <span className="text-lg font-bold">{formatPrice(payable)}</span>
          {hasDiscount ? (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          disabled={soldOut}
          onClick={() => add(product.id)}
          className="relative z-10 mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-dark text-sm font-semibold text-white transition-all duration-200 hover:bg-brand active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          <CartIcon className="size-4" />
          {soldOut ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
