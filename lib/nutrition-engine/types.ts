export type Goal = "lose_weight" | "gain_muscle" | "maintain" | "eat_better";
export type Sex = "female" | "male" | "not_informed";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very_active" | "athlete";

export interface NutritionProfile {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  mealsPerDay: number;
  restrictions?: string[];
  allergies?: string[];
  budget?: "low" | "medium" | "high";
  clinicalCondition?: boolean;
}

export interface Macros { protein: number; carbs: number; fat: number }
export interface MealItem {
  name: string; quantity: string; calories: number; protein: number; carbs: number; fat: number;
}
export interface Meal { name: string; items: MealItem[]; calories: number }
export interface MealPlan {
  calories: number; macros: Macros; meals: Meal[]; warnings: string[]; disclaimer: string;
}
