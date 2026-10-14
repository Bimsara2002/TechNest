import { useForm, useWatch } from "react-hook-form";
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import Reveal3D from "../../components/ui/Reveal3D.jsx";
import Button from "../../components/ui/Button.jsx";
import Field, { Input } from "../../components/ui/Field.jsx";
import { CashIcon } from "../../components/icons.jsx";
import { formatPrice } from "../../lib/format.js";
import { sampleSettings } from "../../lib/adminSampleData.js";
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

function Toggle({ label, description, checked, onChange, disabled }) {
  return (
    <label
      className={`flex items-start gap-3 rounded-xl p-3 transition-colors ${
        disabled ? "opacity-60" : "cursor-pointer hover:bg-slate-50"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="mt-0.5 size-4 rounded border-slate-300 text-brand focus:ring-brand"
      />
      <span className="text-sm">
        <span className="font-medium">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
      </span>
    </label>
  );
}

export default function Settings() {
  const toast = useToast();
  const { register, handleSubmit, control } = useForm({
    defaultValues: sampleSettings,
  });

  // useWatch rather than watch(): watch() returns a function React Compiler
  // cannot memoize, so it silently opts the whole component out of compilation.
  const values = useWatch({ control });

  const freeFrom = Number(values.free_delivery_from) || 0;
  const fee = Number(values.delivery_fee) || 0;

  const onSubmit = () => toast("Saving settings arrives in Phase 2", "info");

  return (
    <div className="p-4 sm:p-6 xl:p-8">
      <AdminHeader
        title="Store settings"
        subtitle="Shop details, delivery rules and payment methods."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1fr_320px] xl:items-start">
          <div className="space-y-6">
            <Panel title="Shop details" description="Shown in the footer and on invoices.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Shop name">
                    <Input {...register("shop_name")} />
                  </Field>
                </div>
                <Field label="Phone">
                  <Input {...register("shop_phone")} type="tel" />
                </Field>
                <Field label="Email">
                  <Input {...register("shop_email")} type="email" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Address">
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
                <Field label="Delivery fee (Rs.)">
                  <Input type="number" min="0" {...register("delivery_fee")} />
                </Field>
                <Field label="Free delivery from (Rs.)">
                  <Input type="number" min="0" {...register("free_delivery_from")} />
                </Field>
              </div>

              <p className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-900">
                Customers pay{" "}
                <span className="font-bold">{formatPrice(fee)}</span> for delivery,
                and nothing on orders over{" "}
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
                  checked={Boolean(values.cod_enabled)}
                  onChange={(event) =>
                    toast(
                      event.target.checked
                        ? "Cash on Delivery stays on until Phase 2"
                        : "Cash on Delivery cannot be turned off yet",
                      "info",
                    )
                  }
                />
                <Toggle
                  label="PayHere card payment"
                  description="Needs PayHere credentials in a Supabase Edge Function."
                  checked={Boolean(values.payhere_enabled)}
                  disabled
                  onChange={() => {}}
                />
                <Toggle
                  label="Bank transfer"
                  description="Customer uploads a payment slip for you to verify."
                  checked={Boolean(values.bank_transfer_enabled)}
                  disabled
                  onChange={() => {}}
                />
              </div>
            </Panel>
          </div>

          <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 xl:sticky xl:top-6">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <CashIcon className="size-5" />
            </span>
            <h2 className="mt-4 font-bold">Where these live</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Each row is a key in the <span className="font-mono text-xs">settings</span>{" "}
              table. Anyone can read it — the storefront needs the delivery fee
              before sign-in — so never put secrets here.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Payment credentials belong in a Supabase Edge Function, never in a{" "}
              <span className="font-mono text-xs">VITE_</span> variable.
            </p>
          </Reveal3D>
        </div>

        <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-md sm:-mx-6 xl:-mx-8">
          <Button type="submit">Save settings</Button>
        </div>
      </form>
    </div>
  );
}
