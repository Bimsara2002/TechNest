import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Button from "../components/ui/Button.jsx";
import Reveal3D from "../components/ui/Reveal3D.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import Field, { Input, Select, Textarea } from "../components/ui/Field.jsx";
import CartSummary from "../components/CartSummary.jsx";
import ProductImage from "../components/ProductImage.jsx";
import { EmptyState, ErrorState } from "../components/ui/States.jsx";
import { CartIcon, CashIcon } from "../components/icons.jsx";
import { formatPrice } from "../lib/format.js";
import { payablePrice } from "../lib/products.js";
import { cartTotals } from "../lib/cart.js";
import { checkoutSchema, districts } from "../lib/orders.js";
import { useCartLines } from "../hooks/useProducts.js";
import { usePlaceOrder } from "../hooks/useOrders.js";
import { useCartStore } from "../store/cartStore.js";
import { useToast } from "../store/toastStore.js";

export default function Checkout() {
  const navigate = useNavigate();
  const toast = useToast();

  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);

  const { data: lines, isPending, isError, refetch } = useCartLines(items);
  const placeOrder = usePlaceOrder();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur", // validate when leaving a field, not on every keystroke
    defaultValues: { full_name: "", address: "", city: "", phone: "", note: "" },
  });

  if (Object.keys(items).length === 0) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={CartIcon}
          title="Nothing to check out"
          message="Your cart is empty, so there is nothing to order yet."
          actionLabel="Browse products"
          actionTo="/products"
        />
      </Container>
    );
  }

  const totals = lines ? cartTotals(lines) : null;

  const onSubmit = async (values) => {
    try {
      const order = await placeOrder.mutateAsync({
        details: values,
        items,
        deliveryFee: totals.deliveryFee,
      });
      clear();
      toast("Order placed successfully");
      navigate(`/order-success/${order.id}`, { replace: true });
    } catch (submitError) {
      toast(submitError.message ?? "Could not place the order", "error");
    }
  };

  return (
    <Container className="py-6 xl:py-10">
      <Breadcrumbs
        trail={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Checkout</h1>

      {isError ? (
        <div className="mt-8">
          <ErrorState onRetry={refetch} />
        </div>
      ) : isPending ? (
        <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_340px]">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-6 grid gap-8 xl:grid-cols-[1fr_340px] xl:items-start"
        >
          <div className="space-y-8">
            <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
              <h2 className="text-lg font-bold">Delivery details</h2>
              <p className="mt-1 text-sm text-slate-600">
                We deliver anywhere in Sri Lanka.
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Full name" error={errors.full_name?.message} required>
                    <Input {...register("full_name")} autoComplete="name" />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field
                    label="Delivery address"
                    error={errors.address?.message}
                    hint="House number, street and area"
                    required
                  >
                    <Textarea rows={3} {...register("address")} autoComplete="street-address" />
                  </Field>
                </div>

                <Field label="District" error={errors.city?.message} required>
                  <Select {...register("city")}>
                    <option value="">Choose a district</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label="Phone number"
                  error={errors.phone?.message}
                  hint="So the courier can reach you"
                  required
                >
                  <Input {...register("phone")} type="tel" inputMode="tel" autoComplete="tel" />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Order note (optional)" error={errors.note?.message}>
                    <Textarea rows={2} {...register("note")} placeholder="Landmark, delivery time…" />
                  </Field>
                </div>
              </div>
            </Reveal3D>

            <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
              <h2 className="text-lg font-bold">Payment method</h2>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-brand-50 p-4 ring-1 ring-brand-100">
                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                  className="mt-1 size-4 text-brand focus:ring-brand"
                />
                <span className="flex-1">
                  <span className="flex items-center gap-2 font-semibold">
                    <CashIcon className="size-5 text-brand" />
                    Cash on Delivery
                  </span>
                  <span className="mt-1 block text-sm text-slate-600">
                    Pay the courier in cash when your order arrives.
                  </span>
                </span>
              </label>

              <p className="mt-3 text-xs text-slate-500">
                Card payment through PayHere is coming soon.
              </p>
            </Reveal3D>

            <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
              <h2 className="text-lg font-bold">Review your order</h2>
              <ul className="mt-4 divide-y divide-slate-200">
                {lines.map(({ product, quantity }) => (
                  <li key={product.id} className="flex items-center gap-3 py-3">
                    <div className="shrink-0 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200">
                      <ProductImage product={product} className="size-14 p-1" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-slate-500">Qty {quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(payablePrice(product) * quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal3D>
          </div>

          <div className="xl:sticky xl:top-24">
            <CartSummary totals={totals}>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Placing order…
                  </>
                ) : (
                  `Place order · ${formatPrice(totals.total)}`
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-slate-500">
                The final total is confirmed by the shop before dispatch.
              </p>
            </CartSummary>
          </div>
        </form>
      )}
    </Container>
  );
}
