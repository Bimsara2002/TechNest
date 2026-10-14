import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthShell, { AuthError, AuthSuccess } from "../components/AuthShell.jsx";
import Button from "../components/ui/Button.jsx";
import Field, { Input } from "../components/ui/Field.jsx";
import { LoadingState } from "../components/ui/States.jsx";
import { registerSchema } from "../lib/authSchemas.js";
import { useAuth, useSignUp } from "../hooks/useAuth.js";
import { useToast } from "../store/toastStore.js";

export default function Register() {
  const toast = useToast();
  const navigate = useNavigate();
  const { isSignedIn, isPending } = useAuth();
  const signUp = useSignUp();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema), mode: "onBlur" });

  if (isPending) return <LoadingState label="Checking your account" />;
  if (isSignedIn) return <Navigate to="/" replace />;

  const onSubmit = (values) =>
    signUp.mutate(values, {
      onSuccess: ({ session }) => {
        // A session only comes back when "Confirm email" is off in Supabase.
        // With it on - the default - the account exists but cannot sign in
        // until the link is opened, so say that instead of redirecting.
        if (session) {
          toast("Account created — welcome to TechNest");
          navigate("/", { replace: true });
        }
      },
    });

  // Rendered once the account exists but still needs confirming.
  const awaitingConfirmation = signUp.isSuccess && !signUp.data?.session;

  if (awaitingConfirmation) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="One more step and the account is live."
        footer={
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Back to sign in
          </Link>
        }
      >
        <AuthSuccess title={`We sent a confirmation link to ${getValues("email")}`}>
          Open it to finish creating your account, then sign in. The link expires
          after 24 hours — if it does, just register again.
        </AuthSuccess>
      </AuthShell>
    );
  }

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => {
          if (signUp.isError) signUp.reset();
        }}
        noValidate
        className="space-y-4"
      >
        <AuthError error={signUp.error} />

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

        <Button type="submit" disabled={signUp.isPending} className="w-full">
          {signUp.isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
