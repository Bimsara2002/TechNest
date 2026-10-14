import { Link } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Badge from "../components/ui/Badge.jsx";
import Stagger from "../components/ui/Stagger.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../components/ui/States.jsx";
import { ChevronRightIcon, TruckIcon } from "../components/icons.jsx";
import { formatDate, formatPrice } from "../lib/format.js";
import { statusLabels, statusTones } from "../lib/orders.js";
import { useOrders } from "../hooks/useOrders.js";

export default function Orders() {
  const { data: orders, isPending, isError, refetch } = useOrders();

  return (
    <Container className="py-6 xl:py-10">
      <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "My orders" }]} />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">My orders</h1>

      {isError ? (
        <div className="mt-8">
          <ErrorState title="Could not load your orders" onRetry={refetch} />
        </div>
      ) : isPending ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={TruckIcon}
            title="No orders yet"
            message="When you place your first order it will show up here, with its delivery status."
            actionLabel="Start shopping"
            actionTo="/products"
          />
        </div>
      ) : (
        <Stagger className="mt-6 space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="group flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift hover:ring-brand-100"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold tracking-wide">{order.order_number}</span>
                  <Badge tone={statusTones[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                  {order.payment_status === "paid" ? (
                    <Badge tone="success">Paid</Badge>
                  ) : null}
                </div>

                <p className="mt-1.5 text-sm text-slate-600">
                  {formatDate(order.created_at)} ·{" "}
                  {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </p>

                <p className="mt-0.5 truncate text-sm text-slate-500">
                  {order.items.map((item) => item.name).join(", ")}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">{formatPrice(order.total)}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand">
                  Details
                  <ChevronRightIcon className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </Stagger>
      )}
    </Container>
  );
}
