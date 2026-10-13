import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function Settings() {
  return (
    <PagePlaceholder
      title="Store settings"
      summary="Shop-wide configuration stored in the settings table."
      step="Phase 2"
      features={[
        "Shop name, logo, phone, email, address, social links",
        "Delivery fees and free delivery limit",
        "Turn payment methods on or off",
      ]}
    />
  );
}
