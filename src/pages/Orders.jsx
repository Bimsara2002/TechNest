import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function Orders() {
  return (
    <PagePlaceholder
      title="My orders"
      summary="Every order this customer has placed."
      step="8"
      features={[
        "List with date, total and a coloured status badge",
        "Empty state for customers with no orders yet",
      ]}
    />
  );
}
