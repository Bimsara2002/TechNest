/**
 * Minus / value / plus. Capped at the available stock, because the feature
 * guide requires a quantity selector that cannot exceed what is in stock.
 */
export default function QuantityStepper({ value, onChange, max = 99, min = 1, label = "Quantity" }) {
  const clamp = (next) => Math.min(max, Math.max(min, next));

  return (
    <div className="inline-flex items-center rounded-xl ring-1 ring-slate-200">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="inline-flex size-11 items-center justify-center rounded-l-xl text-lg font-semibold transition-colors hover:bg-slate-100 active:scale-90 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        &minus;
      </button>

      <span
        aria-live="polite"
        aria-label={`${label}: ${value}`}
        className="min-w-10 text-center text-sm font-semibold tabular-nums"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="inline-flex size-11 items-center justify-center rounded-r-xl text-lg font-semibold transition-colors hover:bg-slate-100 active:scale-90 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        +
      </button>
    </div>
  );
}
