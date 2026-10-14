import { create } from "zustand";

/**
 * Transient "Added to cart" / "Order placed" messages (feature guide §5).
 * Not persisted: a toast that survived a refresh would be confusing.
 */
let nextId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  push: (message, tone = "success", duration = 2600) => {
    const id = ++nextId;
    set((state) => ({ toasts: [...state.toasts, { id, message, tone }] }));
    // Auto-dismiss. Stored outside React so the timer is not tied to a render.
    setTimeout(() => get().dismiss(id), duration);
    return id;
  },
}));

/** Convenience so components do not re-subscribe to the whole store. */
export const useToast = () => useToastStore((state) => state.push);
