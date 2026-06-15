import { describe, expect, it } from "vitest";
import { onboardingSchema } from "./onboarding";

const valid = {
  fullName: "Pessoa Teste",
  age: 30,
  sex: "not_informed",
  heightCm: 170,
  weightKg: 70,
  targetWeightKg: 65,
  goal: "eat_better",
  activityLevel: "moderate",
  mealsPerDay: 4,
  trainingFrequency: 3,
  trainingType: "Caminhada",
  budget: "medium",
  clinicalCondition: false,
};

describe("onboarding validation", () => {
  it("accepts a valid minimized profile", () => {
    expect(onboardingSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects unsupported body measurements", () => {
    expect(onboardingSchema.safeParse({ ...valid, heightCm: 50 }).success).toBe(false);
    expect(onboardingSchema.safeParse({ ...valid, weightKg: 500 }).success).toBe(false);
  });

  it("rejects excessive training frequency", () => {
    expect(onboardingSchema.safeParse({ ...valid, trainingFrequency: 30 }).success).toBe(false);
  });
});
