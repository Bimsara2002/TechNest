import { Link, useParams } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import ProductForm from "../../components/admin/ProductForm.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../../components/ui/States.jsx";
import { useProduct } from "../../hooks/useProducts.js";

export default function ProductEdit() {
  const { id } = useParams();
  const { data: product, isPending, isError, error, refetch } = useProduct(id);

  if (isPending) {
    return (
      <div className="space-y-4 p-4 sm:p-6 xl:p-8">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 xl:p-8">
        {error?.message === "Product not found" ? (
          <EmptyState
            title="Product not found"
            message="That product does not exist, or it has been deleted."
            actionLabel="Back to products"
            actionTo="/admin/products"
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
        to="/admin/products"
        className="inline-flex min-h-11 items-center text-sm font-medium text-slate-500 transition-colors hover:text-brand"
      >
        ← Back to products
      </Link>

      <div className="mt-2">
        <AdminHeader title={product.name} subtitle={`SKU ${product.sku ?? "—"}`}>
          <Badge tone={product.stock > 0 ? "success" : "danger"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Badge>
        </AdminHeader>
      </div>

      <ProductForm product={product} mode="edit" />
    </div>
  );
}
