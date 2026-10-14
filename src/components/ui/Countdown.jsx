import { useEffect, useState } from "react";

/**
 * Live countdown to a deadline.
 *
 * A one-second interval is the one place in this app where state drives an
 * animation, and that is fine: it ticks once a second, not once a frame. The
 * digit boxes pop on change via a React key swap rather than a timer.
 */
function remainingFrom(endsAt) {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (!Number.isFinite(ms) || ms <= 0) return null;

  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    minutes: Math.floor((ms / 60_000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

function Cell({ value, label, light }) {
  const padded = String(value).padStart(2, "0");

  return (
    <div className="stage-3d text-center">
      <div
        className={`flex min-w-12 items-center justify-center rounded-xl px-2.5 py-2 text-xl font-bold tabular-nums shadow-card transform-3d sm:min-w-14 sm:text-2xl ${
          light ? "bg-white/15 text-white ring-1 ring-inset ring-white/20" : "bg-brand-dark text-white"
        }`}
      >
        {/* Keying on the value remounts the span, which replays the pop */}
        <span key={padded} className="animate-pop block">
          {padded}
        </span>
      </div>
      <p
        className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wide ${
          light ? "text-white/70" : "text-slate-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

export default function Countdown({ endsAt, light = false, onExpire }) {
  const [left, setLeft] = useState(() => remainingFrom(endsAt));

  useEffect(() => {
    if (!endsAt) return;

    const tick = () => {
      const next = remainingFrom(endsAt);
      setLeft(next);
      if (!next) onExpire?.();
    };

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt, onExpire]);

  if (!endsAt) return null;

  if (!left) {
    return (
      <p className={`text-sm font-semibold ${light ? "text-white/80" : "text-slate-500"}`}>
        This offer has ended.
      </p>
    );
  }

  return (
    <div
      className="flex items-start gap-2"
      role="timer"
      aria-label={`Offer ends in ${left.days} days, ${left.hours} hours, ${left.minutes} minutes`}
    >
      {left.days > 0 ? <Cell value={left.days} label="Days" light={light} /> : null}
      <Cell value={left.hours} label="Hours" light={light} />
      <Cell value={left.minutes} label="Mins" light={light} />
      <Cell value={left.seconds} label="Secs" light={light} />
    </div>
  );
}
