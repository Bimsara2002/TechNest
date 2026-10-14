import { z } from "zod";

/**
 * Coupon validation.
 *
 * The browser copy is for the person typing; the real limits are the table's
 * own constraints (value > 0, unique code). A percentage over 100 would mean
 * paying the customer to shop, which is why that one is checked here too
 * rather than left to arithmetic later.
 */

const optionalNumber = z.preprocess(
  (value) => (value === "" || value == null ? null : Number(value)),
  z.number().int("Whole numbers only").min(1, "Must be at least 1").nullable(),
);

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "At least 3 characters")
      .max(24, "Keep it under 24 characters")
      .regex(/^[A-Za-z0-9]+$/, "Letters and numbers only — no spaces or dashes"),
    type: z.enum(["percentage", "fixed"]),
    value: z.preprocess(
      (value) => (value === "" || value == null ? Number.NaN : Number(value)),
      z.number({ message: "Enter a discount" }).positive("Must be more than zero"),
    ),
    // Empty means "never expires", which is a real choice rather than a gap.
    expires_at: z.string().trim(),
    usage_limit: optionalNumber,
    is_active: z.boolean(),
  })
  .refine((values) => values.type !== "percentage" || values.value <= 100, {
    message: "A percentage cannot be over 100",
    path: ["value"],
  });
