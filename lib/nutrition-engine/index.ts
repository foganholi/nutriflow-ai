import type { ActivityLevel, Macros, Meal, MealItem, MealPlan, NutritionProfile, Sex } from "./types";

const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, very_active: 1.725, athlete: 1.9,
};

export function calculateBMI(weightKg: number, heightCm: number) {
  if (weightKg <= 0 || heightCm <= 0) throw new Error("Medidas inválidas.");
  return weightKg / ((heightCm / 100) ** 2);
}

export function classifyBMI(bmi: number) {
  if (bmi < 18.5) return "faixa abaixo da referência";
  if (bmi < 25) return "faixa de referência";
  if (bmi < 30) return "faixa acima da referência";
  return "faixa que merece atenção profissional";
}

export function calculateBMR(weightKg: number, heightCm: number, age: number, sex: Sex) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(base + (sex === "male" ? 5 : sex === "female" ? -161 : -78));
}

export function calculateTDEE(bmr: number, activity: ActivityLevel) {
  return Math.round(bmr * activityFactors[activity]);
}

export function calculateCalorieTarget(tdee: number, goal: NutritionProfile["goal"]) {
  const adjustment = goal === "lose_weight" ? -Math.min(450, tdee * 0.18) : goal === "gain_muscle" ? Math.min(300, tdee * 0.12) : 0;
  return Math.round(tdee + adjustment);
}

export function calculateMacros(calories: number, weightKg: number, goal: NutritionProfile["goal"]): Macros {
  const protein = Math.round(weightKg * (goal === "gain_muscle" ? 1.8 : goal === "lose_weight" ? 1.6 : 1.4));
  const fat = Math.round(Math.max(weightKg * 0.8, calories * 0.25 / 9));
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { protein, carbs, fat };
}

export function validateSafetyLimits(profile: NutritionProfile, calorieTarget: number) {
  const warnings: string[] = [];
  const minimum = profile.sex === "male" ? 1500 : 1200;
  if (profile.age < 18) warnings.push("Menores de idade precisam de acompanhamento responsável e profissional.");
  if (profile.age >= 65 && profile.goal === "lose_weight") warnings.push("Objetivos de perda de peso após 65 anos devem ser avaliados individualmente.");
  if (profile.clinicalCondition) warnings.push("Condições clínicas exigem orientação de nutricionista ou médico.");
  if (profile.activityLevel === "athlete" || (profile.trainingFrequency ?? 0) >= 7) warnings.push("Rotinas de treino intensas ou alto rendimento exigem avaliação profissional individual.");
  if (Math.abs(profile.weightKg - profile.targetWeightKg) / profile.weightKg > 0.25) warnings.push("A meta informada é ampla; trabalhe em etapas e reavalie com um profissional.");
  if (calorieTarget < minimum) warnings.push(`O cálculo foi elevado ao limite conservador de ${minimum} kcal. Não recomendamos dietas extremas.`);
  const bmi = calculateBMI(profile.weightKg, profile.heightCm);
  if (bmi < 18.5 || bmi >= 30) warnings.push("Seu IMC estimado está em uma faixa que merece avaliação individual. Esta classificação não é diagnóstico.");
  return { safeCalories: Math.max(calorieTarget, minimum), warnings, blocked: profile.age < 14 };
}

const foodSets = {
  standard: [
    ["Aveia com banana e iogurte", "1 tigela", 390, 18, 58, 10],
    ["Maçã e castanhas", "1 porção", 220, 5, 28, 11],
    ["Arroz, feijão, frango e salada", "1 prato equilibrado", 610, 43, 72, 16],
    ["Iogurte natural com fruta", "1 pote e 1 fruta", 210, 10, 30, 6],
    ["Omelete, mandioca e legumes", "1 prato", 480, 30, 48, 18],
    ["Iogurte natural", "1 pote", 130, 8, 14, 5],
  ],
  vegan: [
    ["Aveia, banana e bebida vegetal", "1 tigela", 370, 11, 67, 8],
    ["Fruta e pasta de amendoim", "1 porção", 230, 7, 30, 10],
    ["Arroz, feijão, lentilha e salada", "1 prato equilibrado", 590, 25, 94, 12],
    ["Fruta e sementes", "1 porção", 190, 6, 28, 8],
    ["Grão-de-bico, batata e legumes", "1 prato", 500, 21, 78, 12],
    ["Homus com cenoura", "1 porção", 150, 5, 19, 6],
  ],
} as const;

function itemFrom(data: readonly [string, string, number, number, number, number]): MealItem {
  return { name: data[0], quantity: data[1], calories: data[2], protein: data[3], carbs: data[4], fat: data[5] };
}

export function generateMealPlan(profile: NutritionProfile): MealPlan {
  const bmr = calculateBMR(profile.weightKg, profile.heightCm, profile.age, profile.sex);
  const target = calculateCalorieTarget(calculateTDEE(bmr, profile.activityLevel), profile.goal);
  const safety = validateSafetyLimits(profile, target);
  if (safety.blocked) {
    return {
      calories: safety.safeCalories, macros: calculateMacros(safety.safeCalories, profile.weightKg, profile.goal),
      meals: [], warnings: [...safety.warnings, "A geração automática foi bloqueada para esta idade."],
      disclaimer: "Procure acompanhamento de pediatra e nutricionista.",
    };
  }
  const restrictions = [...(profile.restrictions ?? []), ...(profile.allergies ?? [])].join(" ").toLowerCase();
  const isVegan = /vegan/.test(restrictions);
  const isVegetarian = isVegan || /vegetarian/.test(restrictions);
  const dairyFree = /lactose|leite|latic[ií]nio/.test(restrictions);
  const glutenFree = /gl[uú]ten|gluten/.test(restrictions);
  const eggFree = /ovo|egg/.test(restrictions);
  const choices = isVegan ? foodSets.vegan : foodSets.standard;
  const adapted = choices.map((food) => {
    let name = food[0] as string;
    if (dairyFree) name = name.replace(/iogurte natural|iogurte/gi, "iogurte vegetal");
    if (glutenFree) name = name.replace(/aveia/gi, "tapioca");
    if (isVegetarian) name = name.replace(/frango/gi, "lentilha");
    if (eggFree) name = name.replace(/omelete/gi, "grão-de-bico temperado");
    const disliked = profile.dislikedFoods?.find((item) => name.toLowerCase().includes(item.toLowerCase()));
    if (disliked) name = `Alternativa ao grupo de ${disliked}`;
    return [name, food[1], food[2], food[3], food[4], food[5]] as const;
  });
  const names = ["Café da manhã", "Lanche da manhã", "Almoço", "Lanche da tarde", "Jantar", "Ceia"];
  const count = Math.min(6, Math.max(3, profile.mealsPerDay));
  const baseTotal = adapted.slice(0, count).reduce((sum, food) => sum + food[2], 0);
  const scale = safety.safeCalories / baseTotal;
  const meals: Meal[] = adapted.slice(0, count).map((food, index) => {
    const item = itemFrom(food);
    item.calories = Math.round(item.calories * scale);
    return { name: names[index], items: [item], calories: item.calories };
  });
  return {
    calories: safety.safeCalories,
    macros: calculateMacros(safety.safeCalories, profile.weightKg, profile.goal),
    meals,
    warnings: safety.warnings,
    disclaimer: "Valores aproximados para educação alimentar. Não substituem avaliação ou prescrição profissional.",
  };
}

export function suggestFoodSwaps(food: string, restrictions: string[] = []) {
  const vegan = restrictions.some((r) => /vegan/i.test(r));
  const swaps: Record<string, string[]> = {
    frango: vegan ? ["lentilha", "grão-de-bico", "tofu"] : ["ovo", "peixe", "carne magra"],
    arroz: ["batata", "mandioca", "macarrão integral"],
    leite: ["bebida de soja", "iogurte sem lactose", "bebida de aveia"],
  };
  return swaps[food.toLowerCase()] ?? ["alimento equivalente do mesmo grupo"];
}

export function estimateWaterIntake(weightKg: number) {
  return Math.round(weightKg * 35 / 100) / 10;
}

export function generateShoppingList(plan: MealPlan, mode: "economic" | "balanced" | "premium" = "balanced") {
  const joined = plan.meals.flatMap((meal) => meal.items.map((item) => item.name)).join(" ").toLowerCase();
  const protein = /vegan|lentilha|grão-de-bico/.test(joined)
    ? mode === "premium" ? "Tofu e grão-de-bico" : "Feijão e lentilha"
    : mode === "economic" ? "Ovos e frango" : mode === "premium" ? "Peixe e cortes magros" : "Frango e ovos";
  const fruit = mode === "premium" ? "Frutas variadas da estação" : "Banana e maçã";
  const carb = mode === "economic" ? "Arroz, mandioca e aveia" : mode === "premium" ? "Arroz integral, quinoa e batata-doce" : "Arroz, batata e aveia";
  return [
    { name: protein, quantity: mode === "premium" ? "2,5 kg variados" : "2 kg variados", category: "Proteínas" },
    { name: "Feijão ou leguminosa", quantity: "1 kg", category: "Proteínas" },
    { name: carb, quantity: "Porções para 7 dias", category: "Carboidratos" },
    { name: fruit, quantity: "14 unidades/porções", category: "Frutas" },
    { name: "Folhas e verduras", quantity: "4 maços ou unidades", category: "Verduras" },
    { name: "Tomate, cenoura e legumes", quantity: "2 kg variados", category: "Legumes" },
    { name: /iogurte vegetal/.test(joined) ? "Iogurte vegetal" : "Iogurte natural", quantity: "7 porções", category: "Laticínios e alternativas" },
    { name: mode === "economic" ? "Temperos básicos" : "Azeite, ervas e temperos", quantity: "Conforme necessidade", category: "Outros" },
  ];
}

export type { NutritionProfile, MealPlan, Macros };
