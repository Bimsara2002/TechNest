import { useParams } from "react-router-dom";
import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function OrderDetail() {
  const { id } = useParams();

  return (
    <PagePlaceholder
      title="Order details"
      summary={`Full record of order ${id}.`}
      step="8"
      features={[
        "Items, quantities and the prices paid at purchase time",
        "Delivery address and payment method",
      ]}
    />
  );
}
