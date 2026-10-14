import { formatPrice } from "../lib/format.js";
import { FREE_DELIVERY_FROM } from "../lib/cart.js";

function Row({ label, value, strong = false, muted = false }) {
  return (
    <div className={`flex items-baseline justify-between gap-4 ${strong ? "text-base" : "text-sm"}`}>
      <span className={muted ? "text-slate-500" : "text-slate-600"}>{label}</span>
      <span className={strong ? "text-lg font-bold" : "font-semibold"}>{value}</span>
    </div>
  );
}

/**
 * Order summary, shared by the cart and the checkout review so the two can
 * never show different numbers. Display only — see lib/cart.js.
 */
export default function CartSummary({ totals, children }) {
  const progress = Math.min(100, (totals.subtotal / FREE_DELIVERY_FROM) * 100);

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Order summary
      </h2>

      <div className="mt-4 space-y-2.5">
        <Row label={`Subtotal (${totals.itemCount} items)`} value={formatPrice(totals.subtotal)} />
        <Row
          label="Delivery"
          value={totals.deliveryFee === 0 ? "Free" : formatPrice(totals.deliveryFee)}
        />
      </div>

      {/* Nudge toward free delivery. The bar animates its width on change. */}
      {!totals.qualifiesFree && totals.subtotal > 0 ? (
        <div className="mt-4 rounded-xl bg-brand-50 p-3">
          <p className="text-xs text-brand-900">
            Add{" "}
            <span className="font-bold">{formatPrice(totals.awayFromFree)}</span> more
            for free delivery
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-4 border-t border-slate-200 pt-4">
        <Row label="Total" value={formatPrice(totals.total)} strong />
        <p className="mt-1 text-xs text-slate-500">Prices include taxes.</p>
      </div>

      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}
