import { z } from "zod";

/**
 * Account form rules. Written once here and reused by the forms.
 *
 * These are for the person filling the form in: the real enforcement is
 * Supabase Auth (password length, address format, duplicate accounts) and the
 * database policies. Loosening a rule here never grants anything.
 */

const email = z.string().trim().min(1, "Email is required").email("Enter a valid email address");

const password = z
  .string()
  .min(8, "Use at least 8 characters")
  .max(72, "Passwords can be at most 72 characters");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(3, "Please enter your full name"),
    email,
    password,
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const forgotSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password, confirm: z.string() })
  .refine((values) => values.password === values.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const profileSchema = z.object({
  full_name: z.string().trim().min(3, "Please enter your full name"),
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+94|0)[1-9]\d{8}$/, "Enter a Sri Lankan number, like 0771234567"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email,
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more")
    .max(1000, "Please keep it under 1000 characters"),
});
