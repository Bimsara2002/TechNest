import AdminHeader from "../../components/admin/AdminHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Reveal3D from "../../components/ui/Reveal3D.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import { formatDate, formatPrice } from "../../lib/format.js";
import { sampleCoupons } from "../../lib/adminSampleData.js";
import { useToast } from "../../store/toastStore.js";

export default function Coupons() {
  const toast = useToast();

  const columns = [
    {
      key: "code",
      header: "Code",
      render: (coupon) => (
        <span className="font-mono text-sm font-bold tracking-wide">{coupon.code}</span>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      render: (coupon) => (
        <span className="font-semibold">
          {coupon.type === "percentage"
            ? `${coupon.value}% off`
            : `${formatPrice(coupon.value)} off`}
        </span>
      ),
    },
    {
      key: "usage",
      header: "Used",
      render: (coupon) => {
        const limit = coupon.usage_limit;
        const pct = limit ? Math.min(100, (coupon.used_count / limit) * 100) : 0;

        return (
          <div className="min-w-32">
            <p className="text-sm font-medium tabular-nums">
              {coupon.used_count}
              {limit ? ` / ${limit}` : " (no limit)"}
            </p>
            {limit ? (
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            ) : null}
          </div>
        );
      },
    },
    {
      key: "expires",
      header: "Expires",
      render: (coupon) =>
        coupon.expires_at ? formatDate(coupon.expires_at) : "Never",
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      render: (coupon) => {
        const spent =
          coupon.usage_limit != null && coupon.used_count >= coupon.usage_limit;

        if (!coupon.is_active) return <Badge tone="neutral">Inactive</Badge>;
        if (spent) return <Badge tone="warning">Fully used</Badge>;
        return <Badge tone="success">Active</Badge>;
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Coupons"
        subtitle="Discount codes customers can enter at checkout."
      >
        <Button onClick={() => toast("Creating coupons arrives in Phase 2", "info")}>
          New coupon
        </Button>
      </AdminHeader>

      <Reveal3D className="mt-6">
        <DataTable
          columns={columns}
          rows={sampleCoupons}
          rowKey={(coupon) => coupon.id}
        />
      </Reveal3D>

      <Reveal3D className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
        <p className="font-semibold">Codes are validated on the server.</p>
        <p className="mt-1">
          The coupons table is admin-only, including reads — exposing it would let
          anyone list every active discount code. A code typed at checkout is
          checked inside the order function instead.
        </p>
      </Reveal3D>
    </div>
  );
}
