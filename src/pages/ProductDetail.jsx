import { useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Button from "../components/ui/Button.jsx";
import Reveal3D from "../components/ui/Reveal3D.jsx";
import Stagger from "../components/ui/Stagger.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import QuantityStepper from "../components/ui/QuantityStepper.jsx";
import Showcase3D from "../components/Showcase3D.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { StockBadge } from "../components/ui/Badge.jsx";
import { EmptyState, ErrorState } from "../components/ui/States.jsx";
import { CartIcon, CashIcon, ShieldIcon, StarIcon, TruckIcon } from "../components/icons.jsx";
import { formatPrice } from "../lib/format.js";
import { categories } from "../lib/sampleProducts.js";
import { useProduct, useRelatedProducts } from "../hooks/useProducts.js";
import { useCartStore } from "../store/cartStore.js";
import { useToast } from "../store/toastStore.js";

const promises = [
  { Icon: TruckIcon, text: "Island-wide delivery" },
  { Icon: CashIcon, text: "Cash on Delivery" },
  { Icon: ShieldIcon, text: "Warranty included" },
];

function DetailSkeleton() {
  return (
    <div className="grid gap-10 xl:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isPending, isError, error, refetch } = useProduct(id);
  const { data: related } = useRelatedProducts(product);

  const add = useCartStore((state) => state.add);
  const toast = useToast();

  if (isPending) {
    return (
      <Container className="py-8">
        <DetailSkeleton />
      </Container>
    );
  }

  if (isError) {
    const missing = error?.message === "Product not found";

    return (
      <Container className="py-16">
        {missing ? (
          <EmptyState
            title="Product not found"
            message="This product may have been removed or is no longer available."
            actionLabel="Browse all products"
            actionTo="/products"
          />
        ) : (
          <ErrorState onRetry={refetch} />
        )}
      </Container>
    );
  }

  const hasDiscount =
    product.discount_price != null && product.discount_price < product.price;
  const payable = hasDiscount ? product.discount_price : product.price;
  const saving = hasDiscount ? product.price - product.discount_price : 0;
  const soldOut = product.stock <= 0;
  const category = categories.find((c) => c.slug === product.category);

  const addToCart = () => {
    add(product.id, quantity);
    toast(`${product.name} added to cart`);
  };

  return (
    <>
      <Container className="py-6 xl:py-10">
        <Breadcrumbs
          trail={[
            { label: "Home", to: "/" },
            { label: "Shop", to: "/products" },
            ...(category
              ? [{ label: category.name, to: `/products?category=${category.slug}` }]
              : []),
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-10 xl:grid-cols-2">
          {/* Gallery. product_images will add thumbnails here at step 6. */}
          <Reveal3D>
            <Showcase3D product={product} />
          </Reveal3D>

          <Reveal3D delay={80}>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              {product.brand}
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {product.name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 text-sm">
                <StarIcon filled className="size-4 text-amber-400" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-slate-500">({product.reviews} reviews)</span>
              </span>
              <StockBadge stock={product.stock} />
            </div>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(payable)}</span>
              {hasDiscount ? (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="animate-pop rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">
                    Save {formatPrice(saving)}
                  </span>
                </>
              ) : null}
            </div>

            <p className="mt-5 max-w-prose leading-relaxed text-slate-600">
              {product.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={Math.max(product.stock, 1)}
              />

              <Button onClick={addToCart} disabled={soldOut} className="flex-1 sm:flex-none">
                <CartIcon className="size-4" />
                {soldOut ? "Out of stock" : "Add to cart"}
              </Button>
            </div>

            {!soldOut && product.stock <= 3 ? (
              <p className="mt-3 text-sm font-medium text-amber-700">
                Only {product.stock} left in stock.
              </p>
            ) : null}

            <ul className="mt-8 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-3">
              {promises.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon className="size-5 shrink-0 text-brand" />
                  {text}
                </li>
              ))}
            </ul>
          </Reveal3D>
        </div>

        {/* Specifications */}
        <Reveal3D className="mt-14">
          <h2 className="text-xl font-bold tracking-tight">Specifications</h2>
          <dl className="mt-4 overflow-hidden rounded-2xl ring-1 ring-slate-200">
            {Object.entries(product.specs ?? {}).map(([key, value], index) => (
              <div
                key={key}
                className={`grid grid-cols-[1fr_1.4fr] gap-4 px-4 py-3 text-sm sm:grid-cols-[220px_1fr] ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                <dt className="font-medium text-slate-500">{key}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal3D>
      </Container>

      {/* Related */}
      {related && related.length > 0 ? (
        <Container className="pb-16">
          <Reveal3D>
            <h2 className="text-xl font-bold tracking-tight">You may also like</h2>
          </Reveal3D>
          <Stagger className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </Stagger>
        </Container>
      ) : null}
    </>
  );
}
