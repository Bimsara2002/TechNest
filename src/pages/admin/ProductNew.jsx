import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function ProductNew() {
  return (
    <PagePlaceholder
      title="Add product"
      summary="Create a catalogue entry."
      step="9"
      features={[
        "Name, description, brand, category, price, discount price, stock, SKU",
        "Image upload to Supabase Storage",
        "Specification rows (RAM, storage, screen, battery, warranty)",
      ]}
    />
  );
}
