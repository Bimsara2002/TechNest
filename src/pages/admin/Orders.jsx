import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../../components/ui/States.jsx";
import { formatDate, formatPrice } from "../../lib/format.js";
import { statusLabels, statusTones } from "../../lib/orders.js";
import { useOrders } from "../../hooks/useOrders.js";

const filters = ["all", "pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [status, setStatus] = useState("all");
  const navigate = useNavigate();
  const { data, isPending, isError, refetch } = useOrders();

  const rows = (data ?? []).filter((order) => status === "all" || order.status === status);

  const columns = [
    {
      key: "order",
      header: "Order",
      render: (order) => (
        <div>
          <p className="font-semibold">{order.order_number}</p>
          <p className="text-xs text-slate-500">{formatDate(order.created_at)}</p>
        </div>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (order) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{order.full_name}</p>
          <p className="truncate text-xs text-slate-500">
            {order.city} · {order.phone}
          </p>
        </div>
      ),
    },
    {
      key: "payment",
      header: "Payment",
      render: (order) => (
        <Badge tone={order.payment_status === "paid" ? "success" : "neutral"}>
          {order.payment_status === "paid" ? "Paid" : "Unpaid"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (order) => (
        <Badge tone={statusTones[order.status]}>{statusLabels[order.status]}</Badge>
      ),
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (order) => <span className="font-semibold">{formatPrice(order.total)}</span>,
    },
  ];

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader title="Orders" subtitle="Every order placed in the shop." />

      {/* Status filter chips */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStatus(value)}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-xl px-4 text-sm font-medium capitalize transition-all duration-200 ${
              status === value
                ? "bg-brand-dark text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-300"
            }`}
          >
            {value === "all" ? "All orders" : statusLabels[value]}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {isError ? (
          <ErrorState title="Could not load orders" onRetry={refetch} />
        ) : isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(order) => order.id}
            onRowClick={(order) => navigate(`/admin/orders/${order.id}`)}
            empty={
              <EmptyState
                title="No orders here"
                message={
                  status === "all"
                    ? "No orders have been placed yet."
                    : `No orders are currently ${statusLabels[status].toLowerCase()}.`
                }
              />
            }
          />
        )}
      </div>
    </div>
  );
}
