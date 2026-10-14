import AdminHeader from "../../components/admin/AdminHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import { StockBadge } from "../../components/ui/Badge.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../../components/ui/States.jsx";
import { useProducts } from "../../hooks/useProducts.js";

export default function Inventory() {
  const { data, isPending, isError, refetch } = useProducts({});

  // Lowest stock first: the whole point of this page is what needs restocking.
  const rows = [...(data ?? [])].sort((a, b) => a.stock - b.stock);

  const columns = [
    {
      key: "product",
      header: "Product",
      render: (product) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{product.name}</p>
          <p className="text-xs text-slate-500">{product.brand}</p>
        </div>
      ),
    },
    {
      key: "stock",
      header: "In stock",
      align: "right",
      render: (product) => (
        <span
          className={`font-bold tabular-nums ${
            product.stock === 0
              ? "text-rose-600"
              : product.stock <= 3
                ? "text-amber-600"
                : ""
          }`}
        >
          {product.stock}
        </span>
      ),
    },
    {
      key: "limit",
      header: "Low stock at",
      align: "right",
      render: () => <span className="tabular-nums text-slate-500">3</span>,
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (product) => <StockBadge stock={product.stock} />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Inventory"
        subtitle="Stock for every product, lowest first."
      />

      <div className="mt-6">
        {isError ? (
          <ErrorState title="Could not load inventory" onRetry={refetch} />
        ) : isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(product) => product.id}
            empty={<EmptyState title="No products yet" message="Add a product to see stock here." />}
          />
        )}
      </div>
    </div>
  );
}
