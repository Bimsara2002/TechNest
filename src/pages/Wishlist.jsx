import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function Wishlist() {
  return (
    <PagePlaceholder
      title="Wishlist"
      summary="Products saved with the heart button."
      step="Phase 2"
      features={["Saved product list", "Move an item to the cart", "Empty state"]}
    />
  );
}
