import type { NutritionProfile } from "@/lib/nutrition-engine";

type ProfileRow = {
  age: number | null;
  sex: NutritionProfile["sex"] | null;
  height_cm: number | null;
  current_weight_kg: number | null;
  target_weight_kg: number | null;
  goal: NutritionProfile["goal"] | null;
  activity_level: NutritionProfile["activityLevel"] | null;
};

type PreferenceRow = {
  restrictions: string[] | null;
  allergies: string[] | null;
  preferred_foods?: string[] | null;
  disliked_foods?: string[] | null;
  budget_level: NutritionProfile["budget"] | null;
  meals_per_day: number | null;
  special_condition: boolean | null;
};

export function toNutritionProfile(profile: ProfileRow, preferences: PreferenceRow | null): NutritionProfile | null {
  if (
    profile.age == null ||
    profile.sex == null ||
    profile.height_cm == null ||
    profile.current_weight_kg == null ||
    profile.target_weight_kg == null ||
    profile.goal == null ||
    profile.activity_level == null
  ) return null;

  return {
    age: profile.age,
    sex: profile.sex,
    heightCm: Number(profile.height_cm),
    weightKg: Number(profile.current_weight_kg),
    targetWeightKg: Number(profile.target_weight_kg),
    goal: profile.goal,
    activityLevel: profile.activity_level,
    mealsPerDay: preferences?.meals_per_day ?? 4,
    restrictions: preferences?.restrictions ?? [],
    allergies: preferences?.allergies ?? [],
    preferredFoods: preferences?.preferred_foods ?? [],
    dislikedFoods: preferences?.disliked_foods ?? [],
    budget: preferences?.budget_level ?? "medium",
    clinicalCondition: preferences?.special_condition ?? false,
  };
}
