import { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import CouponForm from "../../components/admin/CouponForm.jsx";
import Reveal3D from "../../components/ui/Reveal3D.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Button from "../../components/ui/Button.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import { EmptyState, ErrorState } from "../../components/ui/States.jsx";
import { CashIcon } from "../../components/icons.jsx";
import { formatDate, formatPrice } from "../../lib/format.js";
import {
  useCoupons,
  useDeleteCoupon,
  useSaveCoupon,
} from "../../hooks/useAdmin.js";
import { useToast } from "../../store/toastStore.js";

export default function Coupons() {
  // null = closed, "new" = blank form, a coupon = editing that one.
  const [editing, setEditing] = useState(null);
  const toast = useToast();
  const { data: coupons, isPending, isError, error, refetch } = useCoupons();
  const save = useSaveCoupon();
  const remove = useDeleteCoupon();

  const close = () => {
    setEditing(null);
    save.reset(); // so a failed save does not show its error next time
  };

  const onSubmit = (values) =>
    save.mutate(values, {
      onSuccess: () => {
        toast(values.id ? "Coupon saved" : `Coupon ${values.code.toUpperCase()} created`);
        close();
      },
    });

  const onDelete = (coupon) => {
    if (
      !window.confirm(
        `Delete ${coupon.code}? Customers who have not used it yet will no longer be able to.`,
      )
    ) {
      return;
    }

    remove.mutate(coupon.id, {
      onSuccess: () => {
        toast(`${coupon.code} deleted`);
        if (editing?.id === coupon.id) close();
      },
      onError: (deleteError) => toast(deleteError.message, "error"),
    });
  };

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
      render: (coupon) => (coupon.expires_at ? formatDate(coupon.expires_at) : "Never"),
    },
    {
      key: "status",
      header: "Status",
      render: (coupon) => {
        const spent =
          coupon.usage_limit != null && coupon.used_count >= coupon.usage_limit;
        const expired =
          coupon.expires_at != null && new Date(coupon.expires_at) < new Date();

        if (!coupon.is_active) return <Badge tone="neutral">Inactive</Badge>;
        if (expired) return <Badge tone="neutral">Expired</Badge>;
        if (spent) return <Badge tone="warning">Fully used</Badge>;
        return <Badge tone="success">Active</Badge>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (coupon) => (
        <div className="flex flex-wrap justify-end gap-1">
          <button
            type="button"
            onClick={() => setEditing(coupon)}
            className="inline-flex min-h-11 items-center rounded-xl px-3 text-xs font-semibold text-brand transition-colors hover:bg-brand-50"
          >
            Edit
          </button>
          <button
            type="button"
            disabled={remove.isPending}
            onClick={() => onDelete(coupon)}
            className="inline-flex min-h-11 items-center rounded-xl px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Coupons"
        subtitle="Discount codes customers can enter at checkout."
      >
        {editing ? null : <Button onClick={() => setEditing("new")}>New coupon</Button>}
      </AdminHeader>

      {editing ? (
        <div className="mt-6">
          <CouponForm
            // Remounts on a different row so the fields reload rather than
            // keeping the previous coupon's values.
            key={editing === "new" ? "new" : editing.id}
            coupon={editing === "new" ? null : editing}
            onSubmit={onSubmit}
            onCancel={close}
            error={save.error}
            isSaving={save.isPending}
          />
        </div>
      ) : null}

      <div className="mt-6">
        {isError ? (
          <ErrorState
            title="Could not load coupons"
            message={error?.message}
            onRetry={refetch}
          />
        ) : isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <Reveal3D>
            <DataTable
              columns={columns}
              rows={coupons}
              rowKey={(coupon) => coupon.id}
              empty={
                <EmptyState
                  icon={CashIcon}
                  title="No coupons yet"
                  message="Create a code and it is live at checkout as soon as it is active."
                />
              }
            />
          </Reveal3D>
        )}
      </div>

      <Reveal3D className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
        <p className="font-semibold">Codes are validated on the server.</p>
        <p className="mt-1">
          The coupons table is admin-only, including reads — exposing it would let
          anyone list every active discount code. A code typed at checkout is
          checked inside the order function instead, which is also what
          increments the used count.
        </p>
      </Reveal3D>
    </div>
  );
}
