import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Saved products. Client-side for now and persisted per device; at Phase 2
 * this syncs to the `wishlist` table so it follows the account instead.
 */
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (productId) =>
        set((state) => ({
          ids: state.ids.includes(productId)
            ? state.ids.filter((id) => id !== productId)
            : [...state.ids, productId],
        })),

      has: (productId) => get().ids.includes(productId),

      clear: () => set({ ids: [] }),
    }),
    { name: "technest-wishlist" },
  ),
);

export const useIsWishlisted = (productId) =>
  useWishlistStore((state) => state.ids.includes(productId));
