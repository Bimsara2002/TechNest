import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/Button.jsx";
import Field, { Input, Select } from "../ui/Field.jsx";
import { AuthError } from "../AuthShell.jsx";
import { couponSchema } from "../../lib/couponSchema.js";
import { formatPrice } from "../../lib/format.js";

/** "2026-12-31T00:00:00Z" -> "2026-12-31", which is what <input type="date"> wants. */
const toDateInput = (value) => (value ? value.slice(0, 10) : "");

export default function CouponForm({ coupon, onSubmit, onCancel, error, isSaving }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    mode: "onBlur",
    defaultValues: {
      code: coupon?.code ?? "",
      type: coupon?.type ?? "percentage",
      value: coupon?.value ?? "",
      expires_at: toDateInput(coupon?.expires_at),
      usage_limit: coupon?.usage_limit ?? "",
      is_active: coupon?.is_active ?? true,
    },
  });

  // useWatch, not watch(): watch() returns a function React Compiler cannot
  // memoize, which silently opts the component out of compilation.
  const type = useWatch({ control, name: "type" });
  const value = useWatch({ control, name: "value" });

  const preview =
    type === "percentage"
      ? `${Number(value) || 0}% off the order`
      : `${formatPrice(Number(value) || 0)} off the order`;

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit(coupon?.id ? { ...values, id: coupon.id } : values),
      )}
      noValidate
      className="animate-scale-in rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6"
    >
      <h2 className="text-lg font-bold">
        {coupon ? `Edit ${coupon.code}` : "New coupon"}
      </h2>
      <p className="mt-1 text-sm text-slate-600">{preview}</p>

      <div className="mt-5 space-y-4">
        <AuthError error={error} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Code"
            error={errors.code?.message}
            hint="Customers type this at checkout"
            required
          >
            <Input
              {...register("code")}
              autoCapitalize="characters"
              className="font-mono uppercase"
              placeholder="NEWNEST10"
            />
          </Field>

          <Field label="Discount type" error={errors.type?.message} required>
            <Select {...register("type")}>
              <option value="percentage">Percentage off</option>
              <option value="fixed">Fixed amount off</option>
            </Select>
          </Field>

          <Field
            label={type === "percentage" ? "Percentage" : "Amount (Rs.)"}
            error={errors.value?.message}
            required
          >
            <Input
              {...register("value")}
              type="number"
              min="1"
              max={type === "percentage" ? "100" : undefined}
              step="1"
            />
          </Field>

          <Field
            label="Usage limit"
            error={errors.usage_limit?.message}
            hint="Leave blank for unlimited"
          >
            <Input {...register("usage_limit")} type="number" min="1" step="1" />
          </Field>

          <Field
            label="Expires on"
            error={errors.expires_at?.message}
            hint="Leave blank and it never expires"
          >
            <Input {...register("expires_at")} type="date" />
          </Field>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 self-end text-sm font-medium">
            <input
              type="checkbox"
              {...register("is_active")}
              className="size-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            Active — customers can use it now
          </label>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : coupon ? "Save changes" : "Create coupon"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
