import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  age: z.coerce.number().int().min(14).max(100),
  sex: z.enum(["female", "male", "not_informed"]),
  heightCm: z.coerce.number().min(120).max(230),
  weightKg: z.coerce.number().min(30).max(350),
  targetWeightKg: z.coerce.number().min(30).max(350),
  goal: z.enum(["lose_weight", "gain_muscle", "maintain", "eat_better"]),
  activityLevel: z.enum(["sedentary", "light", "moderate", "very_active", "athlete"]),
  mealsPerDay: z.coerce.number().int().min(3).max(6),
  trainingFrequency: z.coerce.number().int().min(0).max(14),
  trainingType: z.string().trim().max(150),
  budget: z.enum(["low", "medium", "high"]),
  clinicalCondition: z.boolean().default(false),
});
