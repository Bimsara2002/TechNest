import { orderTimeline, statusLabels } from "../lib/orders.js";

/**
 * Pending → Confirmed → Packed → Shipped → Delivered as a progress line.
 * Cancelled is not a step on the line, so it gets its own message instead of
 * being forced into a sequence it never followed.
 */
export default function OrderTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700 ring-1 ring-rose-100">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = orderTimeline.indexOf(status);

  return (
    <ol className="flex items-start">
      {orderTimeline.map((step, index) => {
        const done = index <= currentIndex;
        const isLast = index === orderTimeline.length - 1;

        return (
          <li key={step} className="relative flex flex-1 flex-col items-center text-center">
            {/* Connector, drawn in from the left as progress advances */}
            {!isLast ? (
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-3.5 h-0.5 w-full bg-slate-200"
              >
                <span
                  className={`block h-full origin-left bg-brand transition-transform duration-700 ease-out ${
                    index < currentIndex ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </span>
            ) : null}

            <span
              className={`relative z-10 flex size-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500 ${
                done ? "bg-brand text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {done ? "✓" : index + 1}
            </span>

            <span
              className={`mt-2 text-[11px] font-medium sm:text-xs ${
                done ? "text-brand-dark" : "text-slate-400"
              }`}
            >
              {statusLabels[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
