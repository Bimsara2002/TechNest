import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Button from "../components/ui/Button.jsx";
import Reveal3D from "../components/ui/Reveal3D.jsx";
import Field, { Input } from "../components/ui/Field.jsx";
import { AuthNotice } from "../components/AuthShell.jsx";
import { UserIcon } from "../components/icons.jsx";
import { profileSchema } from "../lib/authSchemas.js";
import { useToast } from "../store/toastStore.js";

export default function Profile() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onBlur",
    defaultValues: { full_name: "", phone: "" },
  });

  const onSubmit = () => toast("Profiles save once accounts are wired up", "info");

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

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 space-y-4">
            <Field label="Full name" error={errors.full_name?.message} required>
              <Input {...register("full_name")} autoComplete="name" />
            </Field>

            <Field label="Phone number" error={errors.phone?.message} required>
              <Input {...register("phone")} type="tel" inputMode="tel" autoComplete="tel" />
            </Field>

            <Button type="submit" disabled={isSubmitting}>
              Save changes
            </Button>
          </form>

          <AuthNotice />
        </Reveal3D>

        <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <span className="flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand">
            <UserIcon className="size-6" />
          </span>
          <h2 className="mt-4 font-bold">Saved addresses</h2>
          <p className="mt-1 text-sm text-slate-600">
            Save several delivery addresses and pick one at checkout. Arriving in
            Phase 2, alongside accounts.
          </p>
        </Reveal3D>
      </div>
    </Container>
  );
}
