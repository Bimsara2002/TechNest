import { useParams } from "react-router-dom";
import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function AdminOrderDetail() {
  const { id } = useParams();

  return (
    <PagePlaceholder
      title="Order details"
      summary={`Order ${id}: items, customer, delivery address and notes.`}
      step="9"
      features={[
        "Update status: Pending, Confirmed, Packed, Shipped, Delivered, Cancelled",
        "Cancelling can return the items to stock",
      ]}
    />
  );
}
