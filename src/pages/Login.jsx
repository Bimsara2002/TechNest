import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthShell, { AuthError } from "../components/AuthShell.jsx";
import Button from "../components/ui/Button.jsx";
import Field, { Input } from "../components/ui/Field.jsx";
import { LoadingState } from "../components/ui/States.jsx";
import { loginSchema } from "../lib/authSchemas.js";
import { useAuth, useSignIn } from "../hooks/useAuth.js";
import { useToast } from "../store/toastStore.js";

export default function Login() {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isAdmin, isPending } = useAuth();
  const signIn = useSignIn();

  // Set by RequireAuth / RequireAdmin when they turned someone away, so a
  // successful sign-in resumes where they were going.
  const from = location.state?.from ?? null;
  const wantedAdmin = typeof from === "string" && from.startsWith("/admin");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  if (isPending) return <LoadingState label="Checking your account" />;

  // Already signed in: nothing to do here. Admins go to the dashboard, which
  // is almost always why an admin opens this page.
  if (isSignedIn) return <Navigate to={from ?? (isAdmin ? "/admin" : "/")} replace />;

  const onSubmit = (values) =>
    signIn.mutate(values, {
      onSuccess: ({ profile }) => {
        toast(`Welcome back${profile?.full_name ? `, ${profile.full_name}` : ""}`);
        navigate(from ?? (profile?.role === "admin" ? "/admin" : "/"), {
          replace: true,
        });
      },
    });

  return (
    <AuthShell
      title={wantedAdmin ? "Sign in to manage the shop" : "Welcome back"}
      subtitle={
        wantedAdmin
          ? "The admin area needs the shop's own account."
          : "Sign in to track your orders and check out faster."
      }
      footer={
        <>
          New to TechNest?{" "}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        // Clear the server's answer as soon as the form changes. Otherwise
        // "that email and password do not match" sits above a field that now
        // says "Email is required", and the two contradict each other.
        onChange={() => {
          if (signIn.isError) signIn.reset();
        }}
        noValidate
        className="space-y-4"
      >
        <AuthError error={signIn.error} />

        <Field label="Email" error={errors.email?.message} required>
          <Input {...register("email")} type="email" autoComplete="email" />
        </Field>

        <div>
          <Field label="Password" error={errors.password?.message} required>
            <Input
              {...register("password")}
              type="password"
              autoComplete="current-password"
            />
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

        <Button type="submit" disabled={signIn.isPending} className="w-full">
          {signIn.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
