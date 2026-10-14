import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Reveal3D from "../components/ui/Reveal3D.jsx";
import Field, { Input } from "../components/ui/Field.jsx";
import { AuthError } from "../components/AuthShell.jsx";
import { ErrorState, LoadingState } from "../components/ui/States.jsx";
import { UserIcon } from "../components/icons.jsx";
import { profileSchema } from "../lib/authSchemas.js";
import { formatDate } from "../lib/format.js";
import { useAuth, useSignOut, useUpdateProfile } from "../hooks/useAuth.js";
import { useToast } from "../store/toastStore.js";

/**
 * Split out so the form is mounted with the loaded profile as its
 * defaultValues. Keeping it in the page would mean syncing the fields from an
 * effect once the fetch resolved, which fights react-hook-form and wipes
 * whatever the customer had already typed.
 */
function ProfileForm({ profile }) {
  const toast = useToast();
  const save = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: {
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
    },
  });

  const onSubmit = (values) =>
    save.mutate(values, {
      onSuccess: () => {
        toast("Details saved");
        reset(values); // what was saved becomes the new baseline for isDirty
      },
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
      <AuthError error={save.error} />

      <Field label="Full name" error={errors.full_name?.message} required>
        <Input {...register("full_name")} autoComplete="name" />
      </Field>

      <Field
        label="Phone number"
        error={errors.phone?.message}
        hint="Used by the courier on delivery day"
        required
      >
        <Input {...register("phone")} type="tel" inputMode="tel" autoComplete="tel" />
      </Field>

      {/* Email is changed through Supabase Auth, not this table: profiles.email
          is a mirror kept in step by a trigger, and is not writable here. */}
      <Field label="Email">
        <Input value={profile.email ?? ""} readOnly disabled />
      </Field>

      <Button type="submit" disabled={save.isPending || !isDirty}>
        {save.isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}

export default function Profile() {
  const toast = useToast();
  const { profile, isAdmin, isPending, isError, error } = useAuth();
  const signOut = useSignOut();

  return (
    <Container className="py-6 xl:py-10">
      <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "Profile" }]} />

      <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Your profile</h1>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px] xl:items-start">
        <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
          <h2 className="text-lg font-bold">Personal details</h2>
          <p className="mt-1 text-sm text-slate-600">
            Used on your orders so the courier can reach you.
          </p>

          {isPending ? (
            <LoadingState label="Loading your details" />
          ) : isError ? (
            <div className="mt-5">
              <ErrorState
                title="Could not load your details"
                message={error?.message}
              />
            </div>
          ) : !profile ? (
            // Signed in with no profile row: the sign-up trigger never ran.
            <p className="mt-5 rounded-xl bg-amber-50 px-3.5 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
              Your account has no profile row yet. Run the files in
              supabase/migrations in your Supabase SQL editor, then sign out and
              back in.
            </p>
          ) : (
            <ProfileForm profile={profile} />
          )}
        </Reveal3D>

        <div className="space-y-6">
          <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand">
              <UserIcon className="size-6" />
            </span>

            <h2 className="mt-4 font-bold">Your account</h2>

            {profile ? (
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Role</dt>
                  <dd>
                    <Badge tone={isAdmin ? "brand" : "neutral"}>
                      {isAdmin ? "Admin" : "Customer"}
                    </Badge>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Member since</dt>
                  <dd className="font-medium">{formatDate(profile.created_at)}</dd>
                </div>
              </dl>
            ) : null}

            {isAdmin ? (
              <Button to="/admin" variant="dark" className="mt-5 w-full">
                Open the admin area
              </Button>
            ) : null}

            <Button
              type="button"
              variant="secondary"
              className="mt-3 w-full"
              disabled={signOut.isPending}
              onClick={() =>
                signOut.mutate(undefined, {
                  onSuccess: () => toast("Signed out"),
                })
              }
            >
              {signOut.isPending ? "Signing out…" : "Sign out"}
            </Button>
          </Reveal3D>

          <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="font-bold">Saved addresses</h2>
            <p className="mt-1 text-sm text-slate-600">
              Save several delivery addresses and pick one at checkout. Arriving
              with checkout in roadmap step 8.
            </p>
            <Link
              to="/orders"
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand hover:underline"
            >
              See your orders
            </Link>
          </Reveal3D>
        </div>
      </div>
    </Container>
  );
}
