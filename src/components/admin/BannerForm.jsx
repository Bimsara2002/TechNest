import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../ui/Button.jsx";
import Field, { Input } from "../ui/Field.jsx";
import { AuthError } from "../AuthShell.jsx";
import { bannerSchema } from "../../lib/bannerSchema.js";

export default function BannerForm({ banner, onSubmit, onCancel, error, isSaving }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bannerSchema),
    mode: "onBlur",
    defaultValues: {
      headline: banner?.headline ?? "",
      image_url: banner?.image_url ?? "",
      link: banner?.link ?? "/products",
      sort_order: banner?.sort_order ?? 0,
      is_active: banner?.is_active ?? true,
    },
  });

  const imageUrl = useWatch({ control, name: "image_url" });
  const headline = useWatch({ control, name: "headline" });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit(banner?.id ? { ...values, id: banner.id } : values),
      )}
      noValidate
      className="animate-scale-in rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6"
    >
      <h2 className="text-lg font-bold">{banner ? "Edit banner" : "New banner"}</h2>
      <p className="mt-1 text-sm text-slate-600">
        Paste the address of an image you have already uploaded — to Supabase
        Storage, or anywhere else that serves it over https.
      </p>

      <div className="mt-5 grid gap-6 xl:grid-cols-[1fr_320px] xl:items-start">
        <div className="space-y-4">
          <AuthError error={error} />

          <Field label="Headline" error={errors.headline?.message} required>
            <Input {...register("headline")} placeholder="The tech you want, delivered" />
          </Field>

          <Field
            label="Image address"
            error={errors.image_url?.message}
            hint="Wide, around 1600 × 700, under 100 KB as WebP"
            required
          >
            <Input {...register("image_url")} type="url" placeholder="https://…" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Links to"
              error={errors.link?.message}
              hint="Leave blank for no link"
            >
              <Input {...register("link")} placeholder="/products?category=mobiles" />
            </Field>

            <Field
              label="Position"
              error={errors.sort_order?.message}
              hint="Lower numbers show first"
            >
              <Input {...register("sort_order")} type="number" min="0" step="1" />
            </Field>
          </div>

          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              {...register("is_active")}
              className="size-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            Live — show this on the home page
          </label>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : banner ? "Save changes" : "Add banner"}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Live preview. The image is loaded from whatever was typed, so a bad
            address shows as a broken frame here rather than on the home page. */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Preview
          </p>
          <div className="mesh-surface relative mt-2 flex aspect-16/7 items-end overflow-hidden rounded-2xl p-4 ring-1 ring-slate-200">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            ) : null}
            <p className="relative text-sm font-bold text-white drop-shadow">
              {headline || "Your headline here"}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
