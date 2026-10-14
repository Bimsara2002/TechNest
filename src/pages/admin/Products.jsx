import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Button from "../../components/ui/Button.jsx";
import { StockBadge } from "../../components/ui/Badge.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import ProductImage from "../../components/ProductImage.jsx";
import { EmptyState, ErrorState } from "../../components/ui/States.jsx";
import { SearchIcon } from "../../components/icons.jsx";
import { formatPrice } from "../../lib/format.js";
import { payablePrice } from "../../lib/products.js";
import { useProducts } from "../../hooks/useProducts.js";

export default function AdminProducts() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { data, isPending, isError, refetch } = useProducts({ q: term });

  const columns = [
    {
      key: "product",
      header: "Product",
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="hidden shrink-0 overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200 xl:block">
            <ProductImage product={product} className="size-10 p-0.5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{product.name}</p>
            <p className="text-xs text-slate-500">{product.brand}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      render: (product) => (
        <div>
          <span className="font-semibold">{formatPrice(payablePrice(product))}</span>
          {product.discount_price ? (
            <span className="ml-1 text-xs text-slate-400 line-through">
              {formatPrice(product.price)}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      align: "right",
      render: (product) => (
        <span className="font-semibold tabular-nums">{product.stock}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (product) => <StockBadge stock={product.stock} />,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: () => <span className="text-sm font-semibold text-brand">Edit</span>,
    },
  ];

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader title="Products" subtitle="The catalogue customers can see.">
        <Button to="/admin/products/new">Add product</Button>
      </AdminHeader>

      <div className="relative mt-6 max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search by name or brand"
          aria-label="Search products"
          className="min-h-11 w-full rounded-xl bg-white pl-9 pr-3 text-sm ring-1 ring-slate-200 transition-shadow focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div className="mt-5">
        {isError ? (
          <ErrorState title="Could not load products" onRetry={refetch} />
        ) : isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={data}
            rowKey={(product) => product.id}
            onRowClick={(product) => navigate(`/admin/products/${product.id}/edit`)}
            empty={
              <EmptyState
                title="No products match"
                message={`Nothing found for “${term}”. Try a different search.`}
              />
            }
          />
        )}
      </div>
    </div>
  );
}
