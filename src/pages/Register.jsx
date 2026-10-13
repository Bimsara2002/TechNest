import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function Register() {
  return (
    <PagePlaceholder
      title="Create account"
      summary="New customer sign up."
      step="4"
      features={[
        "Name, email, password (minimum 8 characters)",
        "Clear error message next to each field",
        "Creates the matching profiles row",
      ]}
    />
  );
}
