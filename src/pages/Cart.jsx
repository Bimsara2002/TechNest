import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function Cart() {
  return (
    <PagePlaceholder
      title="Cart"
      summary="Items the shopper has picked, kept in the browser so they survive a refresh."
      step="7"
      features={[
        "Item list with image, price, quantity controls, remove",
        "Cart persisted in the browser (Zustand)",
        "Quantity cannot exceed stock; warn when an item goes unavailable",
        "Summary: subtotal, delivery fee, total",
        "Sticky bottom bar on mobile, side panel on laptop",
        "Empty state with a Continue Shopping button",
      ]}
    />
  );
}
