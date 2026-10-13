import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function Contact() {
  return (
    <PagePlaceholder
      title="Contact us"
      summary="How customers reach the shop."
      step="10"
      features={[
        "Message form saved to the messages table",
        "Phone, email and address",
        "Map",
      ]}
    />
  );
}
