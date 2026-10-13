import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function AdminProducts() {
  return (
    <PagePlaceholder
      title="Products"
      summary="The catalogue, managed by the shop owner."
      step="9"
      features={[
        "Searchable, filterable table: image, name, price, stock, status",
        "Edit and delete (delete asks for confirmation)",
        "Publish or hide without deleting",
      ]}
    />
  );
}
