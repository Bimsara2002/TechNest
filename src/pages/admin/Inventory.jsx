import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function Inventory() {
  return (
    <PagePlaceholder
      title="Inventory"
      summary="Stock for every product on one page."
      step="9"
      features={["Current stock levels", "Low stock warning limit per product (Phase 2)"]}
    />
  );
}
