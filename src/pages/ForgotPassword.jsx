import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthShell, { AuthNotice } from "../components/AuthShell.jsx";
import Button from "../components/ui/Button.jsx";
import Field, { Input } from "../components/ui/Field.jsx";
import { forgotSchema } from "../lib/authSchemas.js";
import { useToast } from "../store/toastStore.js";

export default function ForgotPassword() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotSchema), mode: "onBlur" });

  const onSubmit = () => toast("Password reset arrives in roadmap step 4", "info");

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
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Email" error={errors.email?.message} required>
          <Input {...register("email")} type="email" autoComplete="email" />
        </Field>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Send reset link
        </Button>
      </form>

      <AuthNotice />
    </AuthShell>
  );
}
