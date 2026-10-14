import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthShell, { AuthNotice } from "../components/AuthShell.jsx";
import Button from "../components/ui/Button.jsx";
import Field, { Input } from "../components/ui/Field.jsx";
import { registerSchema } from "../lib/authSchemas.js";
import { useToast } from "../store/toastStore.js";

export default function Register() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema), mode: "onBlur" });

  const onSubmit = () => toast("Accounts arrive in roadmap step 4", "info");

  return (
    <AuthShell
      title="Create your account"
      subtitle="It takes a minute, and your cart comes with you."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Full name" error={errors.full_name?.message} required>
          <Input {...register("full_name")} autoComplete="name" />
        </Field>

        <Field label="Email" error={errors.email?.message} required>
          <Input {...register("email")} type="email" autoComplete="email" />
        </Field>

        <Field
          label="Password"
          error={errors.password?.message}
          hint="At least 8 characters"
          required
        >
          <Input {...register("password")} type="password" autoComplete="new-password" />
        </Field>

        <Field label="Confirm password" error={errors.confirm?.message} required>
          <Input {...register("confirm")} type="password" autoComplete="new-password" />
        </Field>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>

      <AuthNotice />
    </AuthShell>
  );
}
