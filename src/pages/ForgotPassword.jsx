import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function ForgotPassword() {
  return (
    <PagePlaceholder
      title="Reset password"
      summary="Send a reset link by email."
      step="4"
      features={["Email field", "Confirmation message once the link is sent"]}
    />
  );
}
