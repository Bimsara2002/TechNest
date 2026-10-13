import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Client-only cart state. Persisted to localStorage so it survives a refresh
 * and the sign-in round trip at checkout (feature guide 3.5, 3.6).
 *
 * Deliberately stores ids and quantities, not product snapshots: prices and
 * stock are server data and belong to TanStack Query. The checkout function
 * re-reads the real prices server-side, so nothing here is ever trusted as money.
 */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: {}, // { [productId]: quantity }

      add: (productId, quantity = 1) =>
        set((state) => ({
          items: {
            ...state.items,
            [productId]: (state.items[productId] ?? 0) + quantity,
          },
        })),

      setQuantity: (productId, quantity) =>
        set((state) => {
          const next = { ...state.items };
          if (quantity > 0) next[productId] = quantity;
          else delete next[productId];
          return { items: next };
        }),

      remove: (productId) =>
        set((state) => {
          const next = { ...state.items };
          delete next[productId];
          return { items: next };
        }),

      clear: () => set({ items: {} }),

      count: () => Object.values(get().items).reduce((total, n) => total + n, 0),
    }),
    { name: "technest-cart" },
  ),
);

/** Subscribe to just the badge number, so the navbar re-renders only on change. */
export const useCartCount = () =>
  useCartStore((state) => Object.values(state.items).reduce((total, n) => total + n, 0));
