import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductImage from "./ProductImage.jsx";
import Badge, { StockBadge } from "./ui/Badge.jsx";
import Button from "./ui/Button.jsx";
import { CartIcon, ChevronRightIcon } from "./icons.jsx";
import { formatPrice } from "../lib/format.js";
import { payablePrice } from "../lib/products.js";
import { useCartStore } from "../store/cartStore.js";
import { useToast } from "../store/toastStore.js";

/** How far each card sits from the centre, by distance from the active one. */
function transformFor(offset) {
  const side = Math.sign(offset);
  const distance = Math.abs(offset);

  if (distance === 0) {
    return { transform: "translateX(0) translateZ(0) rotateY(0deg) scale(1)", opacity: 1, zIndex: 30 };
  }

  if (distance === 1) {
    return {
      transform: `translateX(${side * 62}%) translateZ(-190px) rotateY(${-side * 34}deg) scale(0.86)`,
      opacity: 0.75,
      zIndex: 20,
    };
  }

  if (distance === 2) {
    return {
      transform: `translateX(${side * 108}%) translateZ(-360px) rotateY(${-side * 40}deg) scale(0.72)`,
      opacity: 0.35,
      zIndex: 10,
    };
  }

  // Far enough away to be invisible; kept mounted so the transition is smooth.
  return {
    transform: `translateX(${side * 140}%) translateZ(-520px) rotateY(${-side * 45}deg) scale(0.6)`,
    opacity: 0,
    zIndex: 0,
  };
}

export default function Coverflow({ products, category }) {
  const [active, setActive] = useState(Math.floor(products.length / 2));
  const dragStart = useRef(null);
  const stageRef = useRef(null);
  const add = useCartStore((state) => state.add);
  const toast = useToast();

  const clamp = useCallback(
    (index) => Math.max(0, Math.min(products.length - 1, index)),
    [products.length],
  );

  const go = useCallback((delta) => setActive((i) => clamp(i + delta)), [clamp]);

  // Arrow keys work whenever the carousel itself has focus, so keyboard users
  // get the same control as a swipe.
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;

    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [go]);

  const onPointerDown = (event) => {
    dragStart.current = event.clientX;
  };

  const onPointerUp = (event) => {
    if (dragStart.current == null) return;
    const delta = event.clientX - dragStart.current;
    dragStart.current = null;
    // 48px threshold: far enough that a tap on a card is never read as a swipe.
    if (Math.abs(delta) > 48) go(delta < 0 ? 1 : -1);
  };

  const current = products[active];

  return (
    <div className="relative">
      <div
        ref={stageRef}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={category ? `${category.name} carousel` : "Product carousel"}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragStart.current = null;
        }}
        className="stage-3d relative h-105 touch-pan-y select-none focus:outline-none sm:h-115"
      >
        <div className="absolute inset-0 transform-3d">
          {products.map((product, index) => {
            const offset = index - active;
            const style = transformFor(offset);
            const isActive = offset === 0;
            const hasDiscount =
              product.discount_price != null && product.discount_price < product.price;

            return (
              <div
                key={product.id}
                aria-hidden={!isActive}
                style={{
                  transform: style.transform,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                  pointerEvents: Math.abs(offset) > 2 ? "none" : "auto",
                }}
                className="absolute left-1/2 top-0 w-60 -translate-x-1/2 transition-all duration-500 ease-out will-change-transform sm:w-72"
              >
                <div
                  onClick={() => !isActive && setActive(index)}
                  className={`overflow-hidden rounded-3xl bg-white ring-1 transition-shadow duration-500 ${
                    isActive
                      ? "shadow-lift ring-brand-100"
                      : "cursor-pointer shadow-card ring-slate-200"
                  }`}
                >
                  <div className="relative bg-linear-to-br from-slate-50 to-slate-100">
                    <ProductImage
                      product={product}
                      className="aspect-square w-full p-5"
                      eager={Math.abs(offset) <= 1}
                    />
                    <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                      {hasDiscount ? <Badge tone="danger">Deal</Badge> : null}
                      <StockBadge stock={product.stock} />
                    </div>
                  </div>

                  <div className="p-4 text-center">
                    <p className="truncate text-sm font-semibold">{product.name}</p>
                    <p className="mt-1 font-bold text-brand">
                      {formatPrice(payablePrice(product))}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        disabled={active === 0}
        aria-label="Previous product"
        className="absolute left-0 top-40 z-40 inline-flex size-11 items-center justify-center rounded-full bg-white text-brand-dark shadow-lift ring-1 ring-slate-200 transition-all hover:bg-brand hover:text-white active:scale-90 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-brand-dark"
      >
        <ChevronRightIcon className="size-5 rotate-180" />
      </button>

      <button
        type="button"
        onClick={() => go(1)}
        disabled={active === products.length - 1}
        aria-label="Next product"
        className="absolute right-0 top-40 z-40 inline-flex size-11 items-center justify-center rounded-full bg-white text-brand-dark shadow-lift ring-1 ring-slate-200 transition-all hover:bg-brand hover:text-white active:scale-90 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-brand-dark"
      >
        <ChevronRightIcon className="size-5" />
      </button>

      {/* Active product actions, announced to screen readers on change */}
      <div aria-live="polite" className="mt-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {current.brand}
        </p>
        <h3 className="mt-1 text-xl font-bold tracking-tight">{current.name}</h3>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <Button to={`/products/${current.id}`} variant="secondary">
            View details
          </Button>
          <Button
            onClick={() => {
              add(current.id);
              toast(`${current.name} added to cart`);
            }}
            disabled={current.stock <= 0}
          >
            <CartIcon className="size-4" />
            {current.stock <= 0 ? "Out of stock" : "Add to cart"}
          </Button>
        </div>
      </div>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {products.map((product, index) => (
          <button
            key={product.id}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Show ${product.name}`}
            aria-current={index === active}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === active ? "w-8 bg-brand" : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Swipe, drag or use the arrow keys
      </p>

      <div className="mt-2 text-center">
        <Link
          to={category ? `/products?category=${category.slug}` : "/products"}
          className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-brand-700"
        >
          See all {category ? category.name.toLowerCase() : "products"}
          <ChevronRightIcon className="size-4" />
        </Link>
      </div>
    </div>
  );
}
