import { useParams } from "react-router-dom";
import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <PagePlaceholder
      title="Order placed"
      summary={`Confirmation for order ${id}.`}
      step="8"
      features={["Order number", "Short next steps message", "Link to order details"]}
    />
  );
}
