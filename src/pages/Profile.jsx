import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function Profile() {
  return (
    <PagePlaceholder
      title="Profile"
      summary="Account details and saved delivery addresses."
      step="Phase 2"
      features={[
        "Edit name and phone number",
        "Change password",
        "Saved addresses, pick one at checkout",
      ]}
    />
  );
}
