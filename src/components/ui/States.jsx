import Button from "./Button.jsx";
import { SearchIcon, ShieldIcon } from "../icons.jsx";

/**
 * The three states CLAUDE.md requires on every page. Keeping them here means a
 * page cannot accidentally ship only the happy path, and the wording stays
 * consistent across the shop.
 */

/** Something went wrong fetching data. Always offers a way forward. */
export function ErrorState({
  title = "Something went wrong",
  message = "We could not load this just now. Please check your connection and try again.",
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="animate-scale-in mx-auto max-w-md rounded-2xl bg-rose-50 p-8 text-center ring-1 ring-rose-100"
    >
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <ShieldIcon className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-rose-900">{title}</h2>
      <p className="mt-1 text-sm text-rose-700">{message}</p>
      {onRetry ? (
        <Button onClick={onRetry} variant="secondary" className="mt-5">
          Try again
        </Button>
      ) : null}
    </div>
  );
}

/** No data - distinct from loading and from an error, and never a blank area. */
export function EmptyState({
  title = "Nothing here yet",
  message,
  actionLabel,
  actionTo,
  icon: Icon = SearchIcon,
}) {
  return (
    <div className="animate-scale-in mx-auto max-w-md rounded-2xl bg-slate-50 p-8 text-center ring-1 ring-slate-200">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      {message ? <p className="mt-1 text-sm text-slate-600">{message}</p> : null}
      {actionLabel && actionTo ? (
        <Button to={actionTo} className="mt-5">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

/** Centred spinner for areas too small or too varied for a skeleton. */
export function LoadingState({ label = "Loading" }) {
  return (
    <div role="status" aria-live="polite" className="flex justify-center py-16">
      <span className="size-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
