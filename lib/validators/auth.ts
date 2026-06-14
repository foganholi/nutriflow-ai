import { z } from "zod";

export const emailSchema = z.string().trim().email().max(254);
export const passwordSchema = z.string()
  .min(10, "Use pelo menos 10 caracteres.")
  .max(72)
  .regex(/[a-z]/, "Inclua uma letra minúscula.")
  .regex(/[A-Z]/, "Inclua uma letra maiúscula.")
  .regex(/[0-9]/, "Inclua um número.");

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(72) });
export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: emailSchema,
  password: passwordSchema,
  terms: z.literal("on"),
  privacy: z.literal("on"),
  consent: z.literal("on"),
});
