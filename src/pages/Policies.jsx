import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function Policies() {
  return (
    <PagePlaceholder
      title="Policies"
      summary="Required before launch, per the pre-launch checklist."
      step="10"
      features={[
        "Delivery policy",
        "Return policy",
        "Warranty",
        "Privacy policy",
        "Terms and conditions",
      ]}
    />
  );
}
