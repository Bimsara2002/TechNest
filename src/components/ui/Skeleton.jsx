/**
 * Loading placeholder. The shimmer runs on a background gradient rather than
 * opacity so it stays cheap on low-end phones, and the reduced-motion rule in
 * index.css freezes it for anyone who asked for less movement.
 */
export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`shimmer-surface animate-shimmer rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

/** Matches the real ProductCard's shape so the grid does not jump on load. */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-3 h-6 w-24" />
      </div>
    </div>
  );
}
