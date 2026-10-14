import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { AuthError } from "../components/AuthShell.jsx";
import Button from "../components/ui/Button.jsx";
import Field, { Input } from "../components/ui/Field.jsx";
import { LoadingState } from "../components/ui/States.jsx";
import { resetPasswordSchema } from "../lib/authSchemas.js";
import { useAuth, useUpdatePassword } from "../hooks/useAuth.js";
import { useToast } from "../store/toastStore.js";

/**
 * Where the emailed reset link lands.
 *
 * Supabase puts a recovery token in the URL fragment and the client exchanges
 * it for a short-lived session (detectSessionInUrl in src/lib/supabase.js), so
 * by the time this renders there is a real session to change the password on.
 * No session means the link was stale, already used, or opened in a different
 * browser than the one asked to reset.
 */
export default function ResetPassword() {
  const toast = useToast();
  const navigate = useNavigate();
  const { isSignedIn, isPending } = useAuth();
  const update = useUpdatePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema), mode: "onBlur" });

  if (isPending) return <LoadingState label="Opening your reset link" />;

  if (!isSignedIn) {
    return (
      <AuthShell
        title="This link has expired"
        subtitle="Reset links are single use and only last an hour."
        footer={
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Back to sign in
          </Link>
        }
      >
        <p className="text-sm leading-relaxed text-slate-600">
          Ask for a new link and open it on this device — opening it in a
          different browser than the one you requested it from will not work.
        </p>
        <Button to="/forgot-password" className="mt-5 w-full">
          Send a new link
        </Button>
      </AuthShell>
    );
  }

  const onSubmit = ({ password }) =>
    update.mutate(password, {
      onSuccess: () => {
        toast("Password changed — you are signed in");
        navigate("/", { replace: true });
      },
    });

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Pick something you have not used here before."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <AuthError error={update.error} />

        <Field
          label="New password"
          error={errors.password?.message}
          hint="At least 8 characters"
          required
        >
          <Input {...register("password")} type="password" autoComplete="new-password" />
        </Field>

        <Field label="Confirm new password" error={errors.confirm?.message} required>
          <Input {...register("confirm")} type="password" autoComplete="new-password" />
        </Field>

        <Button type="submit" disabled={update.isPending} className="w-full">
          {update.isPending ? "Saving…" : "Save new password"}
        </Button>
      </form>
    </AuthShell>
  );
}
