import { z } from "zod";

/**
 * Store settings validation.
 *
 * These values drive what customers are charged for delivery, so a typo here
 * is a pricing bug on every order. Numbers arrive from inputs as strings.
 */
const money = (label) =>
  z.preprocess(
    (value) => (value === "" || value == null ? Number.NaN : Number(value)),
    z
      .number({ message: `Enter ${label}` })
      .min(0, "Cannot be negative")
      .max(1_000_000, "That looks too high — check the figure"),
  );

export const settingsSchema = z
  .object({
    shop_name: z.string().trim().min(2, "The shop needs a name"),
    shop_phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+94|0)[\s-]?[1-9][\d\s-]{7,12}$/,
        "Enter a Sri Lankan number, like +94 11 000 0000",
      ),
    shop_email: z.string().trim().email("Enter a valid email address"),
    shop_address: z.string().trim().min(5, "Enter the full shop address"),
    delivery_fee: money("a delivery fee"),
    free_delivery_from: money("a free delivery threshold"),
    cod_enabled: z.boolean(),
    payhere_enabled: z.boolean(),
    bank_transfer_enabled: z.boolean(),
  })
  .refine((values) => values.free_delivery_from > values.delivery_fee, {
    message: "Free delivery should kick in above the delivery fee",
    path: ["free_delivery_from"],
  })
  .refine(
    (values) =>
      values.cod_enabled || values.payhere_enabled || values.bank_transfer_enabled,
    {
      message: "At least one payment method must stay switched on",
      path: ["cod_enabled"],
    },
  );
