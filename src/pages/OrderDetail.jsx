import { useParams } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Reveal3D from "../components/ui/Reveal3D.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import OrderTimeline from "../components/OrderTimeline.jsx";
import { EmptyState, ErrorState } from "../components/ui/States.jsx";
import { formatDate, formatPrice } from "../lib/format.js";
import { statusLabels, statusTones } from "../lib/orders.js";
import { useOrder } from "../hooks/useOrders.js";

export default function OrderDetail() {
  const { id } = useParams();
  const { data: order, isPending, isError, error, refetch } = useOrder(id);

  if (isPending) {
    return (
      <Container className="py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="py-16">
        {error?.message === "Order not found" ? (
          <EmptyState
            title="Order not found"
            message="That order does not exist, or it belongs to another account."
            actionLabel="Back to my orders"
            actionTo="/orders"
          />
        ) : (
          <ErrorState onRetry={refetch} />
        )}
      </Container>
    );
  }

  return (
    <Container className="py-6 xl:py-10">
      <Breadcrumbs
        trail={[
          { label: "Home", to: "/" },
          { label: "My orders", to: "/orders" },
          { label: order.order_number },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {order.order_number}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>

        <div className="flex gap-2">
          <Badge tone={statusTones[order.status]}>{statusLabels[order.status]}</Badge>
          <Badge tone={order.payment_status === "paid" ? "success" : "neutral"}>
            {order.payment_status === "paid" ? "Paid" : "Unpaid"}
          </Badge>
        </div>
      </div>

      <Reveal3D className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
        <OrderTimeline status={order.status} />
      </Reveal3D>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px] xl:items-start">
        <Reveal3D className="rounded-2xl bg-white ring-1 ring-slate-200">
          <h2 className="border-b border-slate-200 px-5 py-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Items
          </h2>
          <ul className="divide-y divide-slate-200">
            {order.items.map((item) => (
              <li key={item.product_id} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.name}</p>
                  {/* The price paid at purchase time, not today's price. */}
                  <p className="text-sm text-slate-500">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-slate-200 px-5 py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Delivery</span>
              <span className="font-semibold">
                {order.delivery_fee === 0 ? "Free" : formatPrice(order.delivery_fee)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </Reveal3D>

        <Reveal3D className="space-y-6">
          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Delivery address
            </h2>
            <address className="mt-3 text-sm not-italic leading-relaxed">
              <span className="font-semibold">{order.full_name}</span>
              <br />
              {order.address}
              <br />
              {order.city}
              <br />
              <a href={`tel:${order.phone}`} className="text-brand hover:underline">
                {order.phone}
              </a>
            </address>
          </div>

          <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Payment
            </h2>
            <p className="mt-3 text-sm">
              Cash on Delivery ·{" "}
              <span className="font-semibold">
                {order.payment_status === "paid" ? "Paid" : "Pay on arrival"}
              </span>
            </p>
          </div>

          <Button to="/products" variant="secondary" className="w-full">
            Continue shopping
          </Button>
        </Reveal3D>
      </div>
    </Container>
  );
}
