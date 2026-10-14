import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthShell, { AuthError, AuthSuccess } from "../components/AuthShell.jsx";
import Button from "../components/ui/Button.jsx";
import Field, { Input } from "../components/ui/Field.jsx";
import { forgotSchema } from "../lib/authSchemas.js";
import { usePasswordReset } from "../hooks/useAuth.js";

export default function ForgotPassword() {
  const reset = usePasswordReset();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotSchema), mode: "onBlur" });

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We will email you a link to set a new one."
      footer={
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Back to sign in
        </Link>
      }
    >
      {reset.isSuccess ? (
        // Worded so it does not reveal whether that address has an account:
        // "no such user" would let anyone test which emails are registered.
        <AuthSuccess title={`If ${getValues("email")} has an account, the link is on its way`}>
          Open it on this device and you will be asked to choose a new password.
          Check your spam folder if it has not arrived in a few minutes.
        </AuthSuccess>
      ) : (
        <form
          onSubmit={handleSubmit(({ email }) => reset.mutate(email))}
          noValidate
          className="space-y-4"
        >
          <AuthError error={reset.error} />

          <Field label="Email" error={errors.email?.message} required>
            <Input {...register("email")} type="email" autoComplete="email" />
          </Field>

          <Button type="submit" disabled={reset.isPending} className="w-full">
            {reset.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
