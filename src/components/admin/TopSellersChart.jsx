import { formatPrice } from "../../lib/format.js";

/**
 * Ranked horizontal bars. One hue for every bar on purpose: rank is already
 * encoded by position, and colouring by rank would make the colour meaningless
 * the moment the ranking changed.
 *
 * Horizontal rather than vertical because the labels are product names — they
 * would need rotating on a vertical axis, which is far harder to read.
 */
export default function TopSellersChart({ data, measure = "units" }) {
  const max = Math.max(...data.map((d) => d[measure]));

  return (
    <ul className="space-y-3">
      {data.map((item, index) => {
        const value = item[measure];
        const pct = (value / max) * 100;

        return (
          <li key={item.name} className="group">
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-sm font-medium">
                <span className="mr-2 text-xs tabular-nums text-slate-400">
                  {index + 1}
                </span>
                {item.name}
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums">
                {measure === "units" ? `${value} sold` : formatPrice(value)}
              </span>
            </div>

            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-700 ease-out group-hover:bg-brand-700"
                style={{ width: `${pct}%` }}
              />
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {measure === "units"
                ? formatPrice(item.revenue)
                : `${item.units} sold`}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
