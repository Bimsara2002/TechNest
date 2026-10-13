import { useParams } from "react-router-dom";
import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function ProductEdit() {
  const { id } = useParams();

  return (
    <PagePlaceholder
      title="Edit product"
      summary={`Change product ${id}. Same form as Add product, pre-filled.`}
      step="9"
    />
  );
}
