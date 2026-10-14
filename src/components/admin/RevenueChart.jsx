import { useState } from "react";
import { formatCompactPrice, formatPrice } from "../../lib/format.js";

/**
 * Monthly revenue. Single series, so one hue and no legend — the title names
 * the measure. The brand dark is deliberately not used as a fill: it fails the
 * lightness and chroma checks for a data mark and reads as near-black.
 */
const W = 620;
const H = 260;
const PAD = { top: 18, right: 10, bottom: 34, left: 64 };

/** Rounded top corners only: the data-end is rounded, the baseline stays flat. */
function barPath(x, y, w, h, r = 4) {
  const radius = Math.max(0, Math.min(r, h, w / 2));
  return [
    `M${x},${y + h}`,
    `L${x},${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `L${x + w - radius},${y}`,
    `Q${x + w},${y} ${x + w},${y + radius}`,
    `L${x + w},${y + h}`,
    "Z",
  ].join(" ");
}

function niceMax(value) {
  const magnitude = 10 ** Math.floor(Math.log10(value));
  return Math.ceil(value / (magnitude / 2)) * (magnitude / 2);
}

export default function RevenueChart({ data }) {
  const [hovered, setHovered] = useState(null);

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const max = niceMax(Math.max(...data.map((d) => d.revenue)));
  const band = plotW / data.length;
  const barW = Math.min(46, band * 0.54);
  const peakIndex = data.reduce(
    (best, d, i) => (d.revenue > data[best].revenue ? i : best),
    0,
  );

  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const active = hovered == null ? null : data[hovered];

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Revenue by month. Highest was ${data[peakIndex].month} at ${formatPrice(data[peakIndex].revenue)}.`}
      >
        {/* Recessive gridlines, behind everything */}
        {ticks.map((tick) => {
          const y = PAD.top + plotH - (tick / max) * plotH;
          return (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[11px]"
              >
                {formatCompactPrice(tick)}
              </text>
            </g>
          );
        })}

        {data.map((d, index) => {
          const h = (d.revenue / max) * plotH;
          const x = PAD.left + index * band + (band - barW) / 2;
          const y = PAD.top + plotH - h;
          const isHovered = hovered === index;

          return (
            <g key={d.month}>
              {/* Hit target wider than the mark, per the interaction spec */}
              <rect
                x={PAD.left + index * band}
                y={PAD.top}
                width={band}
                height={plotH}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={`${d.month}: ${formatPrice(d.revenue)} from ${d.orders} orders`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                className="cursor-pointer focus:outline-none"
              />

              <path
                d={barPath(x, y, barW, h)}
                fill="#2563eb"
                className="transition-opacity duration-200"
                opacity={hovered == null || isHovered ? 1 : 0.45}
                pointerEvents="none"
              />

              {/* Selective direct label: the peak only, not every bar */}
              {index === peakIndex ? (
                <text
                  x={x + barW / 2}
                  y={y - 7}
                  textAnchor="middle"
                  className="fill-slate-700 text-[11px] font-semibold"
                  pointerEvents="none"
                >
                  {formatCompactPrice(d.revenue)}
                </text>
              ) : null}

              <text
                x={x + barW / 2}
                y={H - 12}
                textAnchor="middle"
                className="fill-slate-500 text-[11px]"
                pointerEvents="none"
              >
                {d.month}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={PAD.top + plotH}
          y2={PAD.top + plotH}
          stroke="#cbd5e1"
          strokeWidth="1"
        />
      </svg>

      {/* Tooltip */}
      {active ? (
        <div
          role="status"
          className="animate-scale-in pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-xl bg-brand-dark px-3 py-2 text-center text-white shadow-lift"
        >
          <p className="text-xs font-medium text-slate-300">{active.month}</p>
          <p className="text-sm font-bold">{formatPrice(active.revenue)}</p>
          <p className="text-xs text-slate-400">{active.orders} orders</p>
        </div>
      ) : null}
    </div>
  );
}
