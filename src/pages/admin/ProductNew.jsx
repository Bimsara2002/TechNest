import { Link } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import ProductForm from "../../components/admin/ProductForm.jsx";

export default function ProductNew() {
  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <Link
        to="/admin/products"
        className="inline-flex min-h-11 items-center text-sm font-medium text-slate-500 transition-colors hover:text-brand"
      >
        ← Back to products
      </Link>

      <div className="mt-2">
        <AdminHeader
          title="Add product"
          subtitle="Everything a customer needs to decide, plus what you need to track stock."
        />
      </div>

      <ProductForm mode="create" />
    </div>
  );
}
