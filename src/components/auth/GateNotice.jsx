import Button from "../ui/Button.jsx";
import { ShieldIcon } from "../icons.jsx";

/**
 * The card a guard shows when it will not let someone through: signed in but
 * not an admin, blocked, or the database not set up.
 *
 * Deliberately not a redirect. Bouncing a signed-in person to /login tells
 * them to do the one thing that will not help; saying what is wrong, and
 * offering the way out, does.
 */
export default function GateNotice({
  title,
  message,
  tone = "slate",
  actionLabel,
  actionTo,
  onAction,
  secondaryLabel,
  secondaryTo,
  children,
}) {
  const tones = {
    slate: "bg-slate-50 ring-slate-200 text-slate-600",
    danger: "bg-rose-50 ring-rose-100 text-rose-700",
    warning: "bg-amber-50 ring-amber-200 text-amber-800",
  };

  const icons = {
    slate: "bg-white text-slate-400 ring-1 ring-slate-200",
    danger: "bg-rose-100 text-rose-600",
    warning: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="flex min-h-[60dvh] items-center justify-center p-4">
      <div
        role="alert"
        className={`animate-scale-in w-full max-w-md rounded-2xl p-8 text-center ring-1 ${tones[tone] ?? tones.slate}`}
      >
        <span
          className={`mx-auto flex size-12 items-center justify-center rounded-full ${icons[tone] ?? icons.slate}`}
        >
          <ShieldIcon className="size-6" />
        </span>

        <h1 className="mt-4 text-lg font-semibold text-slate-900">{title}</h1>
        <p className="mt-1.5 text-sm leading-relaxed">{message}</p>

        {children}

        {actionLabel && (actionTo || onAction) ? (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {actionTo ? (
              <Button to={actionTo}>{actionLabel}</Button>
            ) : (
              <Button type="button" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
            {secondaryLabel && secondaryTo ? (
              <Button to={secondaryTo} variant="secondary">
                {secondaryLabel}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
