import { Link } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import StatCard from "../../components/admin/StatCard.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Stagger from "../../components/ui/Stagger.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { ErrorState } from "../../components/ui/States.jsx";
import { CartIcon, CashIcon, TruckIcon, UserIcon } from "../../components/icons.jsx";
import { formatDate, formatPrice } from "../../lib/format.js";
import { statusLabels, statusTones } from "../../lib/orders.js";
import { useOrders } from "../../hooks/useOrders.js";
import { useProducts } from "../../hooks/useProducts.js";

export default function Dashboard() {
  const orders = useOrders();
  const products = useProducts({});

  if (orders.isError || products.isError) {
    return (
      <div className="p-4 sm:p-6">
        <ErrorState
          title="Could not load the dashboard"
          onRetry={() => {
            orders.refetch();
            products.refetch();
          }}
        />
      </div>
    );
  }

  const loading = orders.isPending || products.isPending;

  const revenue = orders.data?.reduce((sum, order) => sum + order.total, 0) ?? 0;
  const lowStock =
    products.data?.filter((p) => p.stock > 0 && p.stock <= 3) ?? [];
  const outOfStock = products.data?.filter((p) => p.stock === 0) ?? [];
  const recent = orders.data?.slice(0, 5) ?? [];

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Dashboard"
        subtitle="How the shop is doing right now."
      />

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total orders"
            value={orders.data.length}
            Icon={CartIcon}
            hint="All time"
          />
          <StatCard
            label="Revenue"
            value={revenue}
            format={formatPrice}
            Icon={CashIcon}
            tone="success"
            hint="All time"
          />
          <StatCard
            label="Products"
            value={products.data.length}
            Icon={TruckIcon}
            hint={`${outOfStock.length} out of stock`}
          />
          <StatCard
            label="Needs restocking"
            value={lowStock.length + outOfStock.length}
            Icon={UserIcon}
            tone="warning"
            hint="At or below the low-stock limit"
          />
        </Stagger>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr] xl:items-start">
        {/* Recent orders */}
        <section className="rounded-2xl bg-white ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold">Recent orders</h2>
            <Link
              to="/admin/orders"
              className="text-sm font-semibold text-brand hover:underline"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">
              No orders yet. They will appear here as customers buy.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((order) => (
                <li key={order.id}>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{order.order_number}</p>
                      <p className="truncate text-xs text-slate-500">
                        {order.full_name} · {formatDate(order.created_at)}
                      </p>
                    </div>
                    <Badge tone={statusTones[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                    <span className="w-24 text-right text-sm font-semibold">
                      {formatPrice(order.total)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Low stock */}
        <section className="rounded-2xl bg-white ring-1 ring-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold">Low stock</h2>
            <Link
              to="/admin/inventory"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Inventory
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : lowStock.length + outOfStock.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">
              Everything is well stocked.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {[...outOfStock, ...lowStock].map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-3 px-5 py-3 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {product.name}
                  </span>
                  <Badge tone={product.stock === 0 ? "danger" : "warning"}>
                    {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
