import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function Messages() {
  return (
    <PagePlaceholder
      title="Contact messages"
      summary="Messages sent from the Contact form."
      step="Phase 2"
      features={["Read a message", "Mark as read"]}
    />
  );
}
