import { describe, expect, it } from "vitest";
import { calculateBMI, calculateBMR, calculateCalorieTarget, generateMealPlan, generateShoppingList, validateSafetyLimits } from ".";
import type { NutritionProfile } from "./types";

const profile: NutritionProfile = {
  age: 30, sex: "female", heightCm: 165, weightKg: 70, targetWeightKg: 64,
  goal: "lose_weight", activityLevel: "moderate", mealsPerDay: 4,
};

describe("nutrition engine", () => {
  it("calculates BMI", () => expect(calculateBMI(70, 175)).toBeCloseTo(22.86, 2));
  it("uses Mifflin-St Jeor", () => expect(calculateBMR(70, 165, 30, "female")).toBe(1420));
  it("keeps deficit moderate", () => expect(calculateCalorieTarget(2200, "lose_weight")).toBeGreaterThanOrEqual(1750));
  it("never returns calories below the conservative floor", () => {
    expect(validateSafetyLimits(profile, 900).safeCalories).toBe(1200);
  });
  it("blocks automatic plans for users below 14", () => {
    const result = generateMealPlan({ ...profile, age: 12 });
    expect(result.meals).toHaveLength(0);
    expect(result.warnings.join(" ")).toContain("bloqueada");
  });
  it("generates vegan choices when requested", () => {
    const result = generateMealPlan({ ...profile, restrictions: ["vegano"] });
    expect(result.meals.some((m) => /lentilha|grão/i.test(m.items[0].name))).toBe(true);
  });
  it("adapts dairy for lactose restriction", () => {
    const result = generateMealPlan({ ...profile, mealsPerDay: 6, restrictions: ["intolerância à lactose"] });
    expect(result.meals).toHaveLength(6);
    expect(result.meals.some((m) => /iogurte vegetal/i.test(m.items[0].name))).toBe(true);
    expect(result.meals.some((m) => /iogurte natural/i.test(m.items[0].name))).toBe(false);
  });
  it("replaces egg-based meals for egg allergy", () => {
    const result = generateMealPlan({ ...profile, mealsPerDay: 6, allergies: ["ovo"] });
    expect(result.meals.some((m) => /omelete/i.test(m.items[0].name))).toBe(false);
  });
  it("creates distinct shopping modes", () => {
    const plan = generateMealPlan(profile);
    const economic = generateShoppingList(plan, "economic");
    const premium = generateShoppingList(plan, "premium");
    expect(economic.map((item) => item.name).join(" ")).not.toEqual(premium.map((item) => item.name).join(" "));
  });
});
