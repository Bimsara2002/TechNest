import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function AdminOrders() {
  return (
    <PagePlaceholder
      title="Orders"
      summary="Every order placed in the shop."
      step="9"
      features={[
        "Table: customer, date, total, payment, status",
        "Filter by status and date range",
        "Search by order number or customer",
      ]}
    />
  );
}
