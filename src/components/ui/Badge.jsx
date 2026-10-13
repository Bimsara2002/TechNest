const tones = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-700 ring-amber-200",
  danger: "bg-rose-50 text-rose-700 ring-rose-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * Stock status in the three states the feature guide names. Derived from the
 * number so the whole app labels stock the same way.
 */
export function StockBadge({ stock, lowStockAt = 3 }) {
  if (stock <= 0) return <Badge tone="danger">Out of stock</Badge>;
  if (stock <= lowStockAt) return <Badge tone="warning">Low stock</Badge>;
  return <Badge tone="success">In stock</Badge>;
}
