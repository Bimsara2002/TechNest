import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button.jsx";
import Reveal3D from "../ui/Reveal3D.jsx";
import Field, { Input, Select, Textarea } from "../ui/Field.jsx";
import Tilt from "../ui/Tilt.jsx";
import ProductArt from "../art/ProductArt.jsx";
import { CloseIcon, TruckIcon } from "../icons.jsx";
import { categories } from "../../lib/sampleProducts.js";
import { brands } from "../../lib/products.js";
import { emptyProduct, productSchema } from "../../lib/productSchema.js";
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
 * Shared by Add product and Edit product. Saving is wired up at roadmap
 * step 9, together with the Supabase Storage upload behind the image panel.
 */
export default function ProductForm({ product, mode = "create" }) {
  const navigate = useNavigate();
  const toast = useToast();

  const defaults = product
    ? {
        ...emptyProduct,
        ...product,
        discount_price: product.discount_price ?? "",
        specs: Object.entries(product.specs ?? {}).map(([key, value]) => ({
          key,
          value: String(value),
        })),
      }
    : emptyProduct;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    mode: "onBlur",
    defaultValues: defaults,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "specs" });

  // useWatch rather than watch(): watch() returns a function React Compiler
  // cannot memoize, so it silently opts the whole component out of compilation.
  const watchedCategory = useWatch({ control, name: "category" });

  const onSubmit = () => {
    toast(
      mode === "create"
        ? "Saving products is wired up in roadmap step 9"
        : "Updating products is wired up in roadmap step 9",
      "info",
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_320px] xl:items-start">
        <div className="space-y-6">
          <Panel title="Basics" description="What the customer sees first.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Product name" error={errors.name?.message} required>
                  <Input {...register("name")} placeholder="Galaxy S25 Ultra 5G" />
                </Field>
              </div>

              <Field label="Brand" error={errors.brand?.message} required>
                <Select {...register("brand")}>
                  <option value="">Choose a brand</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Category" error={errors.category?.message} required>
                <Select {...register("category")}>
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <div className="sm:col-span-2">
                <Field
                  label="Description"
                  error={errors.description?.message}
                  hint="Written for a customer deciding, not a spec sheet"
                  required
                >
                  <Textarea rows={4} {...register("description")} />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel title="Pricing and stock" description="Prices are in rupees.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Price (Rs.)" error={errors.price?.message} required>
                <Input type="number" inputMode="numeric" min="0" {...register("price")} />
              </Field>

              <Field
                label="Discount price"
                error={errors.discount_price?.message}
                hint="Leave blank for none"
              >
                <Input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  {...register("discount_price")}
                />
              </Field>

              <Field label="Stock" error={errors.stock?.message} required>
                <Input type="number" inputMode="numeric" min="0" {...register("stock")} />
              </Field>

              <div className="sm:col-span-3">
                <Field
                  label="SKU"
                  error={errors.sku?.message}
                  hint="Your own code, e.g. TN-MOB-001"
                  required
                >
                  <Input {...register("sku")} />
                </Field>
              </div>
            </div>
          </Panel>

          <Panel
            title="Specifications"
            description="These become the spec table on the product page."
          >
            <ul className="space-y-3">
              {fields.map((field, index) => (
                <li key={field.id} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Field label={index === 0 ? "Name" : ""}>
                      <Input
                        placeholder="RAM"
                        {...register(`specs.${index}.key`)}
                      />
                    </Field>
                  </div>
                  <div className="flex-[1.4]">
                    <Field label={index === 0 ? "Value" : ""}>
                      <Input
                        placeholder="12GB"
                        {...register(`specs.${index}.value`)}
                      />
                    </Field>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    aria-label={`Remove specification ${index + 1}`}
                    className="mb-0.5 inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => append({ key: "", value: "" })}
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-brand transition-colors hover:text-brand-700"
            >
              + Add specification
            </button>
          </Panel>
        </div>

        {/* Sidebar: live preview, image, visibility */}
        <div className="space-y-6 xl:sticky xl:top-6">
          <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Preview
            </h2>
            <Tilt max={8} className="mt-4">
              <div className="overflow-hidden rounded-2xl bg-linear-to-br from-slate-50 to-slate-100 ring-1 ring-slate-200">
                <ProductArt
                  category={watchedCategory || "mobiles"}
                  seed={product?.id ?? "new"}
                  className="aspect-square w-full"
                />
              </div>
            </Tilt>
            <p className="mt-3 text-xs text-slate-500">
              The placeholder updates with the category. A real photo replaces it
              once uploaded.
            </p>
          </Reveal3D>

          <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Images
            </h2>

            <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center transition-colors hover:border-brand hover:bg-brand-50/40">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
                <TruckIcon className="size-5" />
              </span>
              <p className="mt-3 text-sm font-medium">Upload product photos</p>
              <p className="mt-1 text-xs text-slate-500">
                Goes to the product-images bucket. Wired up in step 9.
              </p>
            </div>
          </Reveal3D>

          <Reveal3D className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Visibility
            </h2>

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("is_active")}
                className="mt-0.5 size-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              <span className="text-sm">
                <span className="font-medium">Published</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Hidden products stay invisible to shoppers without being deleted.
                </span>
              </span>
            </label>

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("is_featured")}
                className="mt-0.5 size-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              <span className="text-sm">
                <span className="font-medium">Featured</span>
                <span className="mt-0.5 block text-xs text-slate-500">
                  Shows in the featured row on the home page.
                </span>
              </span>
            </label>
          </Reveal3D>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-slate-200 bg-white/95 p-4 backdrop-blur-md sm:-mx-6 xl:-mx-8">
        <Button type="submit" disabled={isSubmitting}>
          {mode === "create" ? "Create product" : "Save changes"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => navigate("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
