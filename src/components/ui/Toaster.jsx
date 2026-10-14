import { useToastStore } from "../../store/toastStore.js";
import { CloseIcon, ShieldIcon } from "../icons.jsx";

const tones = {
  success: "bg-brand-dark text-white",
  error: "bg-rose-600 text-white",
  info: "bg-slate-800 text-white",
};

/**
 * Mounted once in the customer layout. Sits above the sticky mobile cart bar
 * and below the drawer, and is aria-live so screen readers announce it without
 * the message stealing focus.
 */
export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-45 flex flex-col items-center gap-2 px-4 sm:bottom-6"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-up pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl px-4 py-3 shadow-lift ${
            tones[toast.tone] ?? tones.info
          }`}
        >
          <ShieldIcon className="size-5 shrink-0 opacity-80" />
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            aria-label="Dismiss"
            className="-mr-1 inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-white/15"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
