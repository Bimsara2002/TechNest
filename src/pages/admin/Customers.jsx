import AdminHeader from "../../components/admin/AdminHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../../components/ui/States.jsx";
import { UserIcon } from "../../components/icons.jsx";
import { formatDate, formatPrice } from "../../lib/format.js";
import { useOrders } from "../../hooks/useOrders.js";

/**
 * Derived from orders for now. At step 9 this reads the `profiles` table
 * directly, which is where join date and blocked status live.
 */
function customersFromOrders(orders) {
  const byPhone = new Map();

  orders.forEach((order) => {
    const existing = byPhone.get(order.phone);
    if (existing) {
      existing.orders += 1;
      existing.spent += order.total;
      if (new Date(order.created_at) < new Date(existing.since)) {
        existing.since = order.created_at;
      }
    } else {
      byPhone.set(order.phone, {
        phone: order.phone,
        name: order.full_name,
        city: order.city,
        orders: 1,
        spent: order.total,
        since: order.created_at,
      });
    }
  });

  return [...byPhone.values()].sort((a, b) => b.spent - a.spent);
}

export default function Customers() {
  const { data: orders, isPending, isError, refetch } = useOrders();
  const customers = orders ? customersFromOrders(orders) : [];

  const columns = [
    {
      key: "name",
      header: "Customer",
      render: (customer) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{customer.name}</p>
          <p className="truncate text-xs text-slate-500">{customer.city}</p>
        </div>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (customer) => (
        <a href={`tel:${customer.phone}`} className="text-brand hover:underline">
          {customer.phone}
        </a>
      ),
    },
    {
      key: "since",
      header: "First order",
      render: (customer) => formatDate(customer.since),
    },
    {
      key: "orders",
      header: "Orders",
      align: "right",
      render: (customer) => <span className="font-semibold">{customer.orders}</span>,
    },
    {
      key: "spent",
      header: "Total spent",
      align: "right",
      render: (customer) => (
        <span className="font-semibold">{formatPrice(customer.spent)}</span>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader title="Customers" subtitle="Everyone who has ordered from the shop." />

      <div className="mt-6">
        {isError ? (
          <ErrorState title="Could not load customers" onRetry={refetch} />
        ) : isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={customers}
            rowKey={(customer) => customer.phone}
            empty={
              <EmptyState
                icon={UserIcon}
                title="No customers yet"
                message="Customers appear here once they place their first order."
              />
            }
          />
        )}
      </div>
    </div>
  );
}
