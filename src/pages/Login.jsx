import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import AuthShell, { AuthNotice } from "../components/AuthShell.jsx";
import Button from "../components/ui/Button.jsx";
import Field, { Input } from "../components/ui/Field.jsx";
import { loginSchema } from "../lib/authSchemas.js";
import { useToast } from "../store/toastStore.js";

export default function Login() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  const onSubmit = () => toast("Sign in arrives in roadmap step 4", "info");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track your orders and check out faster."
      footer={
        <>
          New to TechNest?{" "}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Field label="Email" error={errors.email?.message} required>
          <Input {...register("email")} type="email" autoComplete="email" />
        </Field>

        <div>
          <Field label="Password" error={errors.password?.message} required>
            <Input {...register("password")} type="password" autoComplete="current-password" />
          </Field>
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-brand hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          Sign in
        </Button>
      </form>

      <AuthNotice />
    </AuthShell>
  );
}
