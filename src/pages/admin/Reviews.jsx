import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function Reviews() {
  return (
    <PagePlaceholder
      title="Review moderation"
      summary="Customer reviews waiting for a decision."
      step="Phase 2"
      features={["Approve, hide or delete a review"]}
    />
  );
}
