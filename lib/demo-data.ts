import { generateMealPlan, type NutritionProfile } from "@/lib/nutrition-engine";

export const demoProfile: NutritionProfile = {
  age: 31, sex: "female", heightCm: 165, weightKg: 72, targetWeightKg: 66,
  goal: "lose_weight", activityLevel: "moderate", mealsPerDay: 5, budget: "low",
};
export const demoPlan = generateMealPlan(demoProfile);

export const foods = [
  ["Arroz integral", "Carboidratos", 124, 2.6, 25.8, 1.0, 2.7],
  ["Feijão carioca", "Leguminosas", 76, 4.8, 13.6, 0.5, 8.5],
  ["Peito de frango", "Proteínas", 159, 32, 0, 2.5, 0],
  ["Ovo cozido", "Proteínas", 146, 13.3, 0.6, 9.5, 0],
  ["Carne moída magra", "Proteínas", 219, 26, 0, 12, 0],
  ["Batata inglesa", "Carboidratos", 52, 1.2, 11.9, 0, 1.3],
  ["Mandioca cozida", "Carboidratos", 125, 0.6, 30, 0.3, 1.6],
  ["Aveia em flocos", "Cereais", 394, 13.9, 66.6, 8.5, 9.1],
  ["Banana prata", "Frutas", 98, 1.3, 26, 0.1, 2],
  ["Maçã", "Frutas", 56, 0.3, 15.2, 0, 1.3],
  ["Leite semidesnatado", "Laticínios", 42, 3.2, 4.8, 1, 0],
  ["Iogurte natural", "Laticínios", 51, 4.1, 1.9, 3, 0],
  ["Queijo minas", "Laticínios", 264, 17.4, 3.2, 20.2, 0],
  ["Alface", "Verduras", 15, 1.3, 2.9, 0.2, 1.3],
  ["Tomate", "Legumes", 15, 1.1, 3.1, 0.2, 1.2],
  ["Brócolis", "Legumes", 25, 2.1, 4.4, 0.5, 3.4],
  ["Macarrão cozido", "Carboidratos", 157, 5.8, 30.9, 0.9, 1.8],
  ["Tilápia grelhada", "Proteínas", 128, 26, 0, 2.7, 0],
  ["Lentilha cozida", "Leguminosas", 93, 6.3, 16.3, 0.5, 7.9],
  ["Grão-de-bico", "Leguminosas", 164, 8.9, 27.4, 2.6, 7.6],
] as const;
