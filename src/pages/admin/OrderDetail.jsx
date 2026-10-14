import { useParams, Link } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import OrderTimeline from "../../components/OrderTimeline.jsx";
import { EmptyState, ErrorState } from "../../components/ui/States.jsx";
import { formatDate, formatPrice } from "../../lib/format.js";
import { orderTimeline, statusLabels, statusTones } from "../../lib/orders.js";
import { useOrder } from "../../hooks/useOrders.js";
import { useToast } from "../../store/toastStore.js";

export default function AdminOrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const { data: order, isPending, isError, error, refetch } = useOrder(id);

  if (isPending) {
    return (
      <div className="space-y-4 p-4 sm:p-6 xl:p-8">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 xl:p-8">
        {error?.message === "Order not found" ? (
          <EmptyState
            title="Order not found"
            message="That order does not exist."
            actionLabel="Back to orders"
            actionTo="/admin/orders"
          />
        ) : (
          <ErrorState onRetry={refetch} />
        )}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <Link
        to="/admin/orders"
        className="inline-flex min-h-11 items-center text-sm font-medium text-slate-500 transition-colors hover:text-brand"
      >
        ← Back to orders
      </Link>

      <div className="mt-2">
        <AdminHeader
          title={order.order_number}
          subtitle={`Placed ${formatDate(order.created_at)} by ${order.full_name}`}
        >
          <Badge tone={statusTones[order.status]}>{statusLabels[order.status]}</Badge>
        </AdminHeader>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
        <OrderTimeline status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr] xl:items-start">
        <section className="rounded-2xl bg-white ring-1 ring-slate-200">
          <h2 className="border-b border-slate-200 px-5 py-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Items
          </h2>
          <ul className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <li key={item.product_id} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.name}</p>
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
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Update status
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {[...orderTimeline, "cancelled"].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() =>
                    toast("Status changes are wired up in roadmap step 9", "info")
                  }
                  className={`inline-flex min-h-11 items-center justify-center rounded-xl px-3 text-sm font-medium transition-all duration-200 active:scale-95 ${
                    order.status === step
                      ? "bg-brand text-white"
                      : "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:ring-brand"
                  }`}
                >
                  {statusLabels[step]}
                </button>
              ))}
            </div>

            <p className="mt-3 text-xs text-slate-500">
              Cancelling lets you return the items to stock.
            </p>
          </section>

          <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Customer
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

            {order.note ? (
              <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                <span className="font-semibold">Note:</span> {order.note}
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
