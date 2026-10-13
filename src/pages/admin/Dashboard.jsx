import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function Dashboard() {
  return (
    <PagePlaceholder
      title="Dashboard"
      summary="The shop at a glance."
      step="9"
      features={[
        "Summary cards: total orders, revenue, products, customers",
        "Today at a glance: orders and revenue",
        "Latest 10 orders with quick links",
        "Low stock list",
      ]}
    />
  );
}
