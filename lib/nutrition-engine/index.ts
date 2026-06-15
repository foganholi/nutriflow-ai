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

type FoodTuple = readonly [string, string, number, number, number, number];

const food = (name: string, quantity: string, calories: number, protein: number, carbs: number, fat: number): FoodTuple =>
  [name, quantity, calories, protein, carbs, fat];

function adaptFood(data: FoodTuple, profile: NutritionProfile, restrictionText: string): MealItem {
  let name = data[0];
  const [, quantity, calories, protein, carbs, fat] = data;
  const vegan = /vegan/.test(restrictionText);
  const vegetarian = vegan || /vegetarian/.test(restrictionText);
  const dairyFree = /lactose|leite|latic[ií]nio/.test(restrictionText);
  const glutenFree = /gl[uú]ten|gluten/.test(restrictionText);
  const eggFree = /ovo|egg/.test(restrictionText);

  if (dairyFree) name = name.replace(/iogurte natural|iogurte|leite/gi, (value) => value.toLowerCase() === "leite" ? "bebida vegetal" : "iogurte vegetal");
  if (glutenFree) name = name.replace(/aveia|pão integral|torrada integral/gi, "tapioca");
  if (vegetarian) name = name.replace(/frango|carne moída|peixe|sardinha/gi, "lentilha");
  if (eggFree) name = name.replace(/omelete|ovo cozido|ovos?/gi, "grão-de-bico temperado");

  const disliked = profile.dislikedFoods?.find((item) => name.toLowerCase().includes(item.toLowerCase()));
  if (disliked) name = `Alternativa do grupo de ${disliked}`;

  return { name, quantity, calories, protein, carbs, fat };
}

function buildMealTemplates(profile: NutritionProfile, restrictionText: string) {
  const vegan = /vegan/.test(restrictionText);
  const lowBudget = profile.budget === "low";
  const premium = profile.budget === "high";
  const quick = profile.cookingTime === "little";
  const brazilian = profile.brazilianFoodMode !== false;
  const preferred = profile.preferredFoods?.find((item) => item.trim().length > 1);

  const breakfastProtein = vegan
    ? food("Pasta de amendoim", "1 colher de sopa", 90, 4, 3, 8)
    : quick ? food("Iogurte natural", "1 pote", 120, 8, 14, 4) : food("Ovos mexidos", "2 unidades", 150, 13, 2, 10);
  const lunchProtein = vegan
    ? food("Lentilha cozida", "1 concha", 170, 12, 28, 1)
    : lowBudget ? food("Frango grelhado", "1 filé médio", 220, 38, 0, 7)
      : premium ? food("Peixe assado", "1 filé médio", 230, 36, 0, 9)
        : food("Frango grelhado", "1 filé médio", 220, 38, 0, 7);
  const dinnerProtein = vegan
    ? food("Grão-de-bico temperado", "1 concha", 210, 11, 34, 4)
    : quick ? food("Omelete com legumes", "2 ovos", 230, 16, 8, 15)
      : food("Carne moída magra", "1 porção", 240, 32, 4, 10);
  const staple = brazilian
    ? [food("Arroz", "4 colheres de sopa", 170, 3, 37, 1), food("Feijão", "1 concha", 120, 7, 21, 1)]
    : [food("Batata ou raiz cozida", "1 porção", 180, 4, 40, 1), food("Leguminosa", "1 concha", 130, 8, 22, 1)];

  return [
    [
      food(glutenFreeName(restrictionText, "Aveia com banana"), "1 tigela", 250, 7, 48, 5),
      breakfastProtein,
    ],
    [
      food(preferred ? `${preferred} em porção moderada` : "Fruta da estação", "1 unidade ou porção", 90, 1, 22, 0),
      lowBudget ? food("Amendoim torrado", "1 colher de sopa", 85, 4, 3, 7) : food("Castanhas", "1 porção pequena", 100, 3, 4, 9),
    ],
    [
      ...staple,
      lunchProtein,
      food("Salada e legumes variados", "metade do prato", 80, 3, 14, 2),
    ],
    [
      food(dairyName(restrictionText, "Iogurte natural"), "1 pote", 120, 8, 14, 4),
      food("Fruta da estação", "1 unidade", 90, 1, 22, 0),
    ],
    [
      dinnerProtein,
      quick ? food("Legumes congelados refogados", "1 porção", 110, 4, 18, 3) : food("Legumes e folhas", "metade do prato", 100, 4, 18, 2),
      food(brazilian ? "Mandioca ou batata" : "Batata ou cereal integral", "1 porção", 180, 3, 40, 1),
    ],
    [
      vegan ? food("Homus", "3 colheres de sopa", 130, 5, 14, 6) : food(dairyName(restrictionText, "Iogurte natural"), "1 pote", 120, 8, 14, 4),
      food("Fruta ou cenoura", "1 porção", 70, 1, 17, 0),
    ],
  ].map((meal) => meal.map((item) => adaptFood(item, profile, restrictionText)));
}

function glutenFreeName(restrictions: string, name: string) {
  return /gl[uú]ten|gluten/.test(restrictions) ? name.replace(/aveia/gi, "Tapioca") : name;
}

function dairyName(restrictions: string, name: string) {
  return /lactose|leite|latic[ií]nio|vegan/.test(restrictions) ? name.replace(/iogurte natural/gi, "Iogurte vegetal") : name;
}

function scaleItem(item: MealItem, scale: number): MealItem {
  return {
    ...item,
    quantity: scale > 1.12 ? `${item.quantity} (porção reforçada)` : scale < 0.88 ? `${item.quantity} (porção reduzida)` : item.quantity,
    calories: Math.round(item.calories * scale),
    protein: Math.round(item.protein * scale),
    carbs: Math.round(item.carbs * scale),
    fat: Math.round(item.fat * scale),
  };
}

function normalizeMealMacros(meals: Meal[], target: Macros) {
  const items = meals.flatMap((meal) => meal.items);
  for (const macro of ["protein", "carbs", "fat"] as const) {
    const current = items.reduce((sum, item) => sum + item[macro], 0);
    if (!current) continue;
    const factor = target[macro] / current;
    for (const item of items) item[macro] = Math.round(item[macro] * factor);
    const difference = target[macro] - items.reduce((sum, item) => sum + item[macro], 0);
    if (items[0]) items[0][macro] += difference;
  }
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
  const templates = buildMealTemplates(profile, restrictions);
  const names = ["Café da manhã", "Lanche da manhã", "Almoço", "Lanche da tarde", "Jantar", "Ceia"];
  const count = Math.min(6, Math.max(3, profile.mealsPerDay));
  const selected = templates.slice(0, count);
  const baseTotal = selected.flat().reduce((sum, item) => sum + item.calories, 0);
  const scale = safety.safeCalories / baseTotal;
  const meals: Meal[] = selected.map((items, index) => {
    const scaledItems = items.map((item) => scaleItem(item, scale));
    return { name: names[index], items: scaledItems, calories: scaledItems.reduce((sum, item) => sum + item.calories, 0) };
  });
  const calculatedTotal = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const difference = safety.safeCalories - calculatedTotal;
  if (meals[0]?.items[0] && difference) {
    meals[0].items[0].calories += difference;
    meals[0].calories += difference;
  }
  const macros = calculateMacros(safety.safeCalories, profile.weightKg, profile.goal);
  normalizeMealMacros(meals, macros);
  return {
    calories: safety.safeCalories,
    macros,
    meals,
    warnings: safety.warnings,
    disclaimer: "Valores aproximados para educação alimentar. Não substituem avaliação ou prescrição profissional.",
  };
}

export function suggestFoodSwaps(food: string, restrictions: string[] = []) {
  const normalized = food.toLowerCase();
  const joinedRestrictions = restrictions.join(" ").toLowerCase();
  const vegan = /vegan/.test(joinedRestrictions);
  const glutenFree = /gl[uú]ten|gluten/.test(joinedRestrictions);
  const dairyFree = /lactose|leite|latic[ií]nio|vegan/.test(joinedRestrictions);
  if (/frango|carne|peixe|ovo|omelete/.test(normalized)) return vegan
    ? ["Lentilha cozida", "Grão-de-bico temperado", "Tofu grelhado"]
    : ["Ovos ou omelete", "Peixe", "Frango ou carne magra"];
  if (/arroz|batata|mandioca|aveia|tapioca|cereal/.test(normalized)) return glutenFree
    ? ["Arroz", "Batata", "Mandioca ou tapioca"]
    : ["Arroz", "Batata ou mandioca", "Aveia ou pão integral"];
  if (/iogurte|leite|bebida vegetal/.test(normalized)) return dairyFree
    ? ["Iogurte vegetal", "Bebida de soja", "Homus com legumes"]
    : ["Iogurte natural", "Leite", "Queijo branco"];
  if (/fruta|banana|maçã/.test(normalized)) return ["Banana", "Maçã ou pera", "Fruta da estação"];
  if (/feijão|lentilha|grão-de-bico|leguminosa/.test(normalized)) return ["Feijão", "Lentilha", "Grão-de-bico"];
  if (/salada|legume|folha|cenoura/.test(normalized)) return ["Folhas variadas", "Legumes cozidos", "Vegetais da estação"];
  return ["Alimento equivalente do mesmo grupo", "Opção da estação", "Alternativa compatível com suas restrições"];
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
  const base = [
    { name: protein, quantity: mode === "premium" ? "2,5 kg variados" : "2 kg variados", category: "Proteínas" },
    { name: "Feijão ou leguminosa", quantity: "1 kg", category: "Proteínas" },
    { name: carb, quantity: "Porções para 7 dias", category: "Carboidratos" },
    { name: fruit, quantity: "14 unidades/porções", category: "Frutas" },
    { name: "Folhas e verduras", quantity: "4 maços ou unidades", category: "Verduras" },
    { name: "Tomate, cenoura e legumes", quantity: "2 kg variados", category: "Legumes" },
    { name: /iogurte vegetal/.test(joined) ? "Iogurte vegetal" : "Iogurte natural", quantity: "7 porções", category: "Laticínios e alternativas" },
    { name: mode === "economic" ? "Temperos básicos" : "Azeite, ervas e temperos", quantity: "Conforme necessidade", category: "Outros" },
  ];
  const planSpecific = plan.meals
    .flatMap((meal) => meal.items)
    .filter((item) => /tofu|homus|castanha|amendoim|bebida vegetal/i.test(item.name))
    .map((item) => ({ name: item.name, quantity: "Porções para 7 dias", category: "Itens do plano" }));
  return [...base, ...planSpecific.filter((item, index, items) => items.findIndex((candidate) => candidate.name === item.name) === index)];
}

export type { NutritionProfile, MealPlan, Macros };
