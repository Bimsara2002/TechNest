import { useEffect, useRef, useState } from "react";

/**
 * Counts up to its value when it first appears.
 *
 * Capped at ~900ms and stepped with requestAnimationFrame so the number lands
 * quickly — a dashboard figure that takes three seconds to settle is just an
 * obstacle between the owner and their numbers.
 */
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    // A zero duration makes the first frame land on the final value, so the
    // reduced-motion path reuses the same code rather than setting state
    // synchronously inside the effect body.
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = calm ? 0 : duration;
    const start = performance.now();

    const tick = (now) => {
      const progress = ms === 0 ? 1 : Math.min(1, (now - start) / ms);
      // Ease-out so it decelerates into the final figure.
      setValue(Math.round(target * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return value;
}

export default function StatCard({ label, value, hint, format = (n) => n, Icon, tone = "brand" }) {
  const animated = useCountUp(value);

  const tones = {
    brand: "bg-brand-50 text-brand",
    success: "bg-emerald-50 text-emerald-600",
    warning: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon ? (
          <span className={`flex size-9 items-center justify-center rounded-xl ${tones[tone]}`}>
            <Icon className="size-5" />
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-2xl font-bold tabular-nums">{format(animated)}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
