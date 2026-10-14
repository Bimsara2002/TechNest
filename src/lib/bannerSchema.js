import { z } from "zod";

/**
 * Homepage banner validation.
 *
 * `link` is deliberately loose about scheme but strict about shape: an in-shop
 * destination must start with "/" so it routes client-side, and anything else
 * has to be a full URL. "products?category=mobiles" with no slash would
 * silently resolve against the current path.
 */
export const bannerSchema = z.object({
  headline: z
    .string()
    .trim()
    .min(3, "Give the banner a headline")
    .max(80, "Keep it under 80 characters so it fits on a phone"),

  image_url: z
    .string()
    .trim()
    .min(1, "Paste the image address")
    .url("That is not a valid image address"),

  link: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || value.startsWith("/") || /^https?:\/\//.test(value),
      "Start with / for a page in the shop, or https:// for somewhere else",
    ),

  sort_order: z.preprocess(
    (value) => (value === "" || value == null ? 0 : Number(value)),
    z.number().int("Whole numbers only").min(0, "Cannot be negative"),
  ),

  is_active: z.boolean(),
});
