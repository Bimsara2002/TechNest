import { useParams } from "react-router-dom";
import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <PagePlaceholder
      title="Product detail"
      summary={`Everything about one product (id: ${id}).`}
      step="6"
      features={[
        "Image gallery: swipe on mobile, hover zoom on laptop",
        "Name, brand, price, discount price, stock status",
        "Specifications table (RAM, storage, screen, battery, warranty)",
        "Quantity selector capped at available stock",
        "Description, warranty period, return policy summary",
        "Related products from the same category",
      ]}
    />
  );
}
