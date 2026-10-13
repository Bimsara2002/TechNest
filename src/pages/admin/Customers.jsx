import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function Customers() {
  return (
    <PagePlaceholder
      title="Customers"
      summary="Who is buying from the shop."
      step="9"
      features={["Name, email, phone, join date, number of orders"]}
    />
  );
}
