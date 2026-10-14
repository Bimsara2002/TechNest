import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema } from "../../lib/settingsSchema.js";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import Reveal3D from "../../components/ui/Reveal3D.jsx";
import Button from "../../components/ui/Button.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import Field, { Input } from "../../components/ui/Field.jsx";
import { AuthError } from "../../components/AuthShell.jsx";
import { ErrorState } from "../../components/ui/States.jsx";
import { CashIcon } from "../../components/icons.jsx";
import { formatPrice } from "../../lib/format.js";
import { useSaveSettings, useSettings } from "../../hooks/useAdmin.js";
import { useToast } from "../../store/toastStore.js";

function Panel({ title, description, children }) {
  return (
    <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      {description ? (
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      ) : null}
      <div className="mt-5">{children}</div>
    </Reveal3D>
  );
}

/**
 * Spreads the remaining props onto the input so it can take a react-hook-form
 * `register()` directly. An earlier version took a `checked` prop and an
 * onChange that only raised a toast, which meant the value never actually
 * changed and the "keep one payment method on" rule could never fire.
 */
function Toggle({ label, description, disabled, ...rest }) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
        disabled ? "opacity-60" : "cursor-pointer hover:bg-slate-50"
      }`}
    >
      <input
        type="checkbox"
        disabled={disabled}
        className="mt-0.5 size-4 rounded border-slate-300 text-brand focus:ring-brand"
        {...rest}
      />
      <span className="text-sm">
        <span className="font-medium">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
      </span>
    </label>
  );
}

/**
 * Split from the page so the form mounts with the saved settings as its
 * defaultValues. Syncing them in from an effect after the fetch resolved would
 * overwrite whatever had already been typed.
 */
function SettingsForm({ settings }) {
  const toast = useToast();
  const save = useSaveSettings();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    mode: "onBlur",
    defaultValues: settings,
  });

  const values = useWatch({ control });

  const freeFrom = Number(values.free_delivery_from) || 0;
  const fee = Number(values.delivery_fee) || 0;

  const onSubmit = (next) =>
    save.mutate(next, {
      onSuccess: () => {
        toast("Settings saved");
        // Makes what was just saved the new baseline, so the button settles
        // back to "Saved" instead of still offering to save the same values.
        reset(next);
      },
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_320px] xl:items-start">
        <div className="space-y-6">
          <AuthError error={save.error} />

          <Panel title="Shop details" description="Shown in the footer and on invoices.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Shop name" error={errors.shop_name?.message} required>
                  <Input {...register("shop_name")} />
                </Field>
              </div>
              <Field label="Phone" error={errors.shop_phone?.message} required>
                <Input {...register("shop_phone")} type="tel" />
              </Field>
              <Field label="Email" error={errors.shop_email?.message} required>
                <Input {...register("shop_email")} type="email" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Address" error={errors.shop_address?.message} required>
                  <Input {...register("shop_address")} />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel
            title="Delivery"
            description="Applied at checkout and shown in the cart summary."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Delivery fee (Rs.)"
                error={errors.delivery_fee?.message}
                required
              >
                <Input type="number" min="0" {...register("delivery_fee")} />
              </Field>
              <Field
                label="Free delivery from (Rs.)"
                error={errors.free_delivery_from?.message}
                required
              >
                <Input type="number" min="0" {...register("free_delivery_from")} />
              </Field>
            </div>

            <p className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-900">
              Customers pay <span className="font-bold">{formatPrice(fee)}</span> for
              delivery, and nothing on orders over{" "}
              <span className="font-bold">{formatPrice(freeFrom)}</span>.
            </p>
          </Panel>

          <Panel
            title="Payment methods"
            description="Turn a method off and it disappears from checkout."
          >
            <div className="space-y-1">
              <Toggle
                label="Cash on Delivery"
                description="The main method. Customers pay the courier."
                {...register("cod_enabled")}
              />
              <Toggle
                label="PayHere card payment"
                description="Needs PayHere credentials in a Supabase Edge Function."
                disabled
                {...register("payhere_enabled")}
              />
              <Toggle
                label="Bank transfer"
                description="Customer uploads a payment slip for you to verify."
                disabled
                {...register("bank_transfer_enabled")}
              />
            </div>

            {/* Guards the schema rule that at least one method stays on */}
            {errors.cod_enabled ? (
              <p
                role="alert"
                className="animate-shake mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200"
              >
                {errors.cod_enabled.message}
              </p>
            ) : null}
          </Panel>
        </div>

        <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 xl:sticky xl:top-6">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
            <CashIcon className="size-5" />
          </span>
          <h2 className="mt-4 font-bold">Where these live</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Each row is a key in the{" "}
            <span className="font-mono text-xs">settings</span> table. Anyone can
            read it — the storefront needs the delivery fee before sign-in — so
            never put secrets here.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Payment credentials belong in a Supabase Edge Function, never in a{" "}
            <span className="font-mono text-xs">VITE_</span> variable.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Saving writes all the keys in one upsert, so the shop is never left
            with a new threshold and the old fee.
          </p>
        </Reveal3D>
      </div>

      <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-md sm:-mx-6 xl:-mx-8">
        <Button type="submit" disabled={save.isPending || !isDirty}>
          {save.isPending ? "Saving…" : isDirty ? "Save settings" : "Saved"}
        </Button>
      </div>
    </form>
  );
}

export default function Settings() {
  const { data: settings, isPending, isError, error, refetch } = useSettings();

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Store settings"
        subtitle="Shop details, delivery rules and payment methods."
      />

      {isError ? (
        <div className="mt-6">
          <ErrorState
            title="Could not load the settings"
            message={error?.message}
            onRetry={refetch}
          />
        </div>
      ) : isPending ? (
        <div className="mt-6 space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : (
        <SettingsForm settings={settings} />
      )}
    </div>
  );
}
