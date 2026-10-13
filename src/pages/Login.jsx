import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function Login() {
  return (
    <PagePlaceholder
      title="Sign in"
      summary="Email and password sign in via Supabase Auth."
      step="4"
      features={[
        "Email and password form (react-hook-form + zod)",
        "Return to the page the customer came from",
        "Links to register and forgot password",
      ]}
    />
  );
}
