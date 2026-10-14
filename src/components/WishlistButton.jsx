import { useWishlistStore, useIsWishlisted } from "../store/wishlistStore.js";
import { useToast } from "../store/toastStore.js";

/**
 * Heart toggle. The fill pops on activation — a 300ms spring that makes the
 * tap feel acknowledged without blocking anything.
 */
export default function WishlistButton({ product, className = "" }) {
  const toggle = useWishlistStore((state) => state.toggle);
  const saved = useIsWishlisted(product.id);
  const toast = useToast();

  return (
    <button
      type="button"
      onClick={(event) => {
        // The card is a stretched link; without this the click navigates.
        event.preventDefault();
        event.stopPropagation();
        toggle(product.id);
        toast(saved ? "Removed from wishlist" : "Saved to wishlist", "info");
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={`relative z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-sm ring-1 ring-slate-200 backdrop-blur-sm transition-all duration-200 hover:text-rose-500 active:scale-90 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`size-4.5 transition-colors duration-200 ${saved ? "animate-pop text-rose-500" : ""}`}
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 20.5 4.6 13a4.7 4.7 0 0 1 6.6-6.7l.8.8.8-.8A4.7 4.7 0 0 1 19.4 13z" />
      </svg>
    </button>
  );
}
