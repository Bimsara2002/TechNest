import { z } from "zod";

/**
 * Admin product form rules. Mirrors the constraints in
 * supabase/migrations/0001_schema.sql, so the browser rejects what the
 * database would reject anyway — but the database stays the real enforcement.
 */

// Number inputs hand back strings, and an empty optional field arrives as "".
const optionalPrice = z.preprocess(
  (value) => (value === "" || value == null ? null : Number(value)),
  z
    .number({ message: "Enter a valid amount" })
    .positive("Must be more than zero")
    .nullable(),
);

export const productSchema = z
  .object({
    name: z.string().trim().min(3, "Give the product a name"),
    description: z
      .string()
      .trim()
      .min(10, "Write at least a sentence customers can read"),
    brand: z.string().trim().min(1, "Choose a brand"),
    category: z.string().trim().min(1, "Choose a category"),
    sku: z
      .string()
      .trim()
      .min(3, "SKU helps you find stock later")
      .max(32, "That SKU is too long"),
    price: z.preprocess(
      (value) => (value === "" || value == null ? Number.NaN : Number(value)),
      z.number({ message: "Enter a price" }).positive("Must be more than zero"),
    ),
    discount_price: optionalPrice,
    stock: z.preprocess(
      (value) => (value === "" || value == null ? Number.NaN : Number(value)),
      z
        .number({ message: "Enter a stock count" })
        .int("Whole numbers only")
        .min(0, "Cannot be negative"),
    ),
    is_active: z.boolean(),
    is_featured: z.boolean(),
    specs: z.array(
      z.object({
        key: z.string().trim(),
        value: z.string().trim(),
      }),
    ),
  })
  // Matches the discount_below_price check constraint: a "discount" above the
  // real price would render as a negative saving on the product card.
  .refine(
    (values) =>
      values.discount_price == null || values.discount_price < values.price,
    {
      message: "The discount must be lower than the price",
      path: ["discount_price"],
    },
  );

export const emptyProduct = {
  name: "",
  description: "",
  brand: "",
  category: "",
  sku: "",
  price: "",
  discount_price: "",
  stock: 0,
  is_active: true,
  is_featured: false,
  specs: [{ key: "", value: "" }],
};
