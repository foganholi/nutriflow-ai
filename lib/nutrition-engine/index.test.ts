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
    expect(result.meals.flatMap((meal) => meal.items).some((item) => /lentilha|grão/i.test(item.name))).toBe(true);
  });
  it("adapts dairy for lactose restriction", () => {
    const result = generateMealPlan({ ...profile, mealsPerDay: 6, restrictions: ["intolerância à lactose"] });
    expect(result.meals).toHaveLength(6);
    const items = result.meals.flatMap((meal) => meal.items);
    expect(items.some((item) => /iogurte vegetal/i.test(item.name))).toBe(true);
    expect(items.some((item) => /iogurte natural/i.test(item.name))).toBe(false);
  });
  it("replaces egg-based meals for egg allergy", () => {
    const result = generateMealPlan({ ...profile, mealsPerDay: 6, allergies: ["ovo"] });
    expect(result.meals.flatMap((meal) => meal.items).some((item) => /omelete/i.test(item.name))).toBe(false);
  });
  it("creates distinct shopping modes", () => {
    const plan = generateMealPlan(profile);
    const economic = generateShoppingList(plan, "economic");
    const premium = generateShoppingList(plan, "premium");
    expect(economic.map((item) => item.name).join(" ")).not.toEqual(premium.map((item) => item.name).join(" "));
  });
  it("generates composed meals with a consistent calorie total", () => {
    const result = generateMealPlan({ ...profile, mealsPerDay: 6 });
    const items = result.meals.flatMap((meal) => meal.items);
    expect(result.meals.every((meal) => meal.items.length >= 2)).toBe(true);
    expect(result.meals.reduce((total, meal) => total + meal.calories, 0)).toBe(result.calories);
    expect(result.meals.every((meal) => meal.calories === meal.items.reduce((total, item) => total + item.calories, 0))).toBe(true);
    expect(items.reduce((total, item) => total + item.protein, 0)).toBe(result.macros.protein);
    expect(items.reduce((total, item) => total + item.carbs, 0)).toBe(result.macros.carbs);
    expect(items.reduce((total, item) => total + item.fat, 0)).toBe(result.macros.fat);
  });
  it("uses budget and cooking time when selecting foods", () => {
    const economic = generateMealPlan({ ...profile, budget: "low", cookingTime: "little", mealsPerDay: 5 });
    const premium = generateMealPlan({ ...profile, budget: "high", cookingTime: "plenty", mealsPerDay: 5 });
    const economicFoods = economic.meals.flatMap((meal) => meal.items.map((item) => item.name)).join(" ");
    const premiumFoods = premium.meals.flatMap((meal) => meal.items.map((item) => item.name)).join(" ");
    expect(economicFoods).toMatch(/frango|amendoim/i);
    expect(premiumFoods).toMatch(/peixe|castanhas/i);
    expect(economicFoods).not.toEqual(premiumFoods);
  });
  it("includes a preferred food in a moderate snack portion", () => {
    const result = generateMealPlan({ ...profile, preferredFoods: ["mamão"] });
    expect(result.meals.flatMap((meal) => meal.items).some((item) => /mamão/i.test(item.name))).toBe(true);
  });
});
