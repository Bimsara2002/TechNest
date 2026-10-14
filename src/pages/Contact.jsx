import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Button from "../components/ui/Button.jsx";
import Reveal3D from "../components/ui/Reveal3D.jsx";
import Field, { Input, Textarea } from "../components/ui/Field.jsx";
import { MailIcon, PhoneIcon, TruckIcon } from "../components/icons.jsx";
import { contactSchema } from "../lib/authSchemas.js";
import { useToast } from "../store/toastStore.js";

const channels = [
  {
    Icon: PhoneIcon,
    title: "Call us",
    value: "+94 11 000 0000",
    href: "tel:+94110000000",
    note: "Weekdays 9am to 6pm",
  },
  {
    Icon: MailIcon,
    title: "Email",
    value: "hello@technest.lk",
    href: "mailto:hello@technest.lk",
    note: "We reply within a working day",
  },
  {
    Icon: TruckIcon,
    title: "Delivery",
    value: "Island-wide",
    note: "Usually 2 to 4 working days",
  },
];

export default function Contact() {
  const toast = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactSchema), mode: "onBlur" });

  const onSubmit = () => {
    // Step 10 writes this to the `messages` table, which already allows
    // inserts from guests.
    toast("Thanks! Your message is on its way.");
    reset();
  };

  return (
    <Container className="py-6 xl:py-10">
      <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "Contact" }]} />

      <div className="mt-4 max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Contact us</h1>
        <p className="mt-2 text-slate-600">
          Questions about a product, an order or a warranty claim? Send us a
          message and we will get back to you.
        </p>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px] xl:items-start">
        <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your name" error={errors.name?.message} required>
                <Input {...register("name")} autoComplete="name" />
              </Field>

              <Field label="Email" error={errors.email?.message} required>
                <Input {...register("email")} type="email" autoComplete="email" />
              </Field>
            </div>

            <Field
              label="Message"
              error={errors.message?.message}
              hint="Include an order number if your question is about an order"
              required
            >
              <Textarea rows={6} {...register("message")} />
            </Field>

            <Button type="submit" disabled={isSubmitting}>
              Send message
            </Button>
          </form>
        </Reveal3D>

        <Reveal3D className="space-y-3">
          {channels.map(({ Icon, title, value, href, note }) => (
            <div
              key={title}
              className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition-shadow duration-300 hover:shadow-card"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{title}</p>
                {href ? (
                  <a
                    href={href}
                    className="block truncate text-sm text-brand hover:underline"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm text-slate-700">{value}</p>
                )}
                <p className="mt-0.5 text-xs text-slate-500">{note}</p>
              </div>
            </div>
          ))}
        </Reveal3D>
      </div>
    </Container>
  );
}
