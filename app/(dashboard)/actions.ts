"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { generateMealPlan, generateShoppingList } from "@/lib/nutrition-engine";
import { toNutritionProfile } from "@/lib/profile";
import { onboardingSchema } from "@/lib/validators/onboarding";

const list = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);

export async function saveOnboarding(formData: FormData) {
  const parsed = onboardingSchema.safeParse({
    ...Object.fromEntries(formData),
    clinicalCondition: formData.get("clinicalCondition") === "true",
  });
  if (!parsed.success) redirect("/onboarding?error=invalid");

  const { supabase, user } = await requireUser();
  const data = parsed.data;
  const { error: profileError } = await supabase.from("profiles").update({
    full_name: data.fullName,
    age: data.age,
    sex: data.sex,
    height_cm: data.heightCm,
    current_weight_kg: data.weightKg,
    target_weight_kg: data.targetWeightKg,
    goal: data.goal,
    activity_level: data.activityLevel,
    consent_lgpd: true,
    consent_at: new Date().toISOString(),
  }).eq("id", user.id);
  if (profileError) redirect("/onboarding?error=save");

  const { error: preferencesError } = await supabase.from("nutrition_preferences").upsert({
    user_id: user.id,
    allergies: list(formData.get("allergies")),
    restrictions: list(formData.get("restrictions")),
    disliked_foods: list(formData.get("dislikedFoods")),
    preferred_foods: list(formData.get("preferredFoods")),
    budget_level: data.budget,
    cooking_time: formData.get("cookingTime") || "medium",
    meals_per_day: data.mealsPerDay,
    country_region: String(formData.get("countryRegion") || "Brasil").slice(0, 100),
    brazilian_food_mode: formData.get("brazilianFoodMode") !== "false",
    special_condition: data.clinicalCondition,
  }, { onConflict: "user_id" });
  if (preferencesError) redirect("/onboarding?error=save");

  const { count } = await supabase.from("habits").select("id", { count: "exact", head: true });
  if (!count) {
    await supabase.from("habits").insert([
      "Beber a meta de água",
      "Comer frutas",
      "Comer verduras",
      "Evitar ultraprocessados",
      "Fazer atividade física",
      "Dormir bem",
      "Registrar refeições",
    ].map((title) => ({ user_id: user.id, title, frequency: "daily" })));
  }

  await createAndPersistPlan();
  redirect("/dashboard?onboarding=complete");
}

export async function createAndPersistPlan() {
  const { supabase, user } = await requireUser();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const [{ data: profile }, { data: preferences }, { data: subscription }, { count: recentPlans }] = await Promise.all([
    supabase.from("profiles").select("age,sex,height_cm,current_weight_kg,target_weight_kg,goal,activity_level,consent_lgpd").eq("id", user.id).single(),
    supabase.from("nutrition_preferences").select("restrictions,allergies,preferred_foods,disliked_foods,budget_level,meals_per_day,special_condition").eq("user_id", user.id).maybeSingle(),
    supabase.from("subscriptions").select("plan,status").eq("user_id", user.id).single(),
    supabase.from("meal_plans").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", weekAgo),
  ]);
  if (subscription?.plan === "free" && subscription.status === "active" && (recentPlans ?? 0) >= 1) {
    redirect("/meal-plan?error=weekly-limit");
  }
  const nutritionProfile = profile?.consent_lgpd ? toNutritionProfile(profile, preferences) : null;
  if (!nutritionProfile) redirect("/onboarding");

  const plan = generateMealPlan(nutritionProfile);
  if (!plan.meals.length) redirect("/meal-plan?error=blocked");

  const { data: savedPlan, error } = await supabase.from("meal_plans").insert({
    user_id: user.id,
    title: `Plano de ${new Date().toLocaleDateString("pt-BR")}`,
    objective: nutritionProfile.goal,
    total_calories: plan.calories,
    protein_g: plan.macros.protein,
    carbs_g: plan.macros.carbs,
    fat_g: plan.macros.fat,
    safety_notes: plan.warnings.join("\n"),
    source_notes: plan.disclaimer,
  }).select("id").single();
  if (error || !savedPlan) redirect("/meal-plan?error=save");

  const mealItems = plan.meals.flatMap((meal) => meal.items.map((item) => ({
    user_id: user.id,
    meal_plan_id: savedPlan.id,
    meal_name: meal.name,
    food_name: item.name,
    quantity: item.quantity,
    calories: item.calories,
    protein_g: item.protein,
    carbs_g: item.carbs,
    fat_g: item.fat,
  })));
  const { error: itemsError } = await supabase.from("meal_items").insert(mealItems);
  if (itemsError) {
    await supabase.from("meal_plans").delete().eq("id", savedPlan.id);
    redirect("/meal-plan?error=save");
  }

  const { data: shoppingList } = await supabase.from("shopping_lists").insert({
    user_id: user.id,
    meal_plan_id: savedPlan.id,
    title: "Compras da semana",
    budget_mode: nutritionProfile.budget === "low" ? "economic" : nutritionProfile.budget === "high" ? "premium" : "balanced",
  }).select("id").single();
  if (shoppingList) {
    const items = generateShoppingList(plan).map((item) => ({
      user_id: user.id,
      shopping_list_id: shoppingList.id,
      category: item.category,
      item_name: item.name,
      quantity: item.quantity,
    }));
    await supabase.from("shopping_list_items").insert(items);
  }

  revalidatePath("/dashboard");
  revalidatePath("/meal-plan");
  revalidatePath("/shopping-list");
  redirect("/meal-plan?generated=true");
}

const progressSchema = z.object({
  weightKg: z.coerce.number().min(30).max(350),
  waistCm: z.union([z.coerce.number().min(30).max(250), z.literal("")]).optional(),
  energyLevel: z.coerce.number().int().min(1).max(5),
  mood: z.string().trim().max(100),
  hungerLevel: z.coerce.number().int().min(1).max(5),
  notes: z.string().trim().max(1000),
});

export async function addProgress(formData: FormData) {
  const parsed = progressSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/progress?error=invalid");
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("progress_logs").insert({
    user_id: user.id,
    weight_kg: parsed.data.weightKg,
    waist_cm: parsed.data.waistCm === "" ? null : parsed.data.waistCm,
    energy_level: parsed.data.energyLevel,
    mood: parsed.data.mood,
    hunger_level: parsed.data.hungerLevel,
    notes: parsed.data.notes,
  });
  if (error) redirect("/progress?error=save");
  await supabase.from("profiles").update({ current_weight_kg: parsed.data.weightKg }).eq("id", user.id);
  revalidatePath("/progress");
  revalidatePath("/dashboard");
  redirect("/progress?saved=true");
}

export async function toggleHabit(formData: FormData) {
  const habitId = z.string().uuid().safeParse(formData.get("habitId"));
  const completed = formData.get("completed") !== "true";
  if (!habitId.success) return;
  const { supabase, user } = await requireUser();
  await supabase.from("habit_logs").upsert({
    user_id: user.id,
    habit_id: habitId.data,
    completed,
    log_date: new Date().toISOString().slice(0, 10),
  }, { onConflict: "habit_id,log_date" });
  revalidatePath("/habits");
  revalidatePath("/dashboard");
}

export async function requestPasswordChange() {
  const { supabase, user } = await requireUser();
  if (user.email) {
    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });
  }
  redirect("/settings?password=sent");
}

export async function revokeNutritionConsent() {
  const { supabase, user } = await requireUser();
  await supabase.from("profiles").update({ consent_lgpd: false, consent_at: null }).eq("id", user.id);
  revalidatePath("/settings");
  redirect("/settings?consent=revoked");
}

export async function deleteAccount() {
  const { supabase } = await requireUser();
  const { error } = await supabase.functions.invoke("delete-account", { body: {} });
  if (error) redirect("/settings?delete=error");
  await supabase.auth.signOut();
  redirect("/?account=deleted");
}

export async function toggleFavoriteFood(formData: FormData) {
  const foodName = z.string().trim().min(1).max(150).safeParse(formData.get("foodName"));
  if (!foodName.success) return;
  const { supabase, user } = await requireUser();
  const { data: existing } = await supabase.from("favorite_foods").select("id").eq("user_id", user.id).eq("food_name", foodName.data).maybeSingle();
  if (existing) await supabase.from("favorite_foods").delete().eq("id", existing.id);
  else await supabase.from("favorite_foods").insert({ user_id: user.id, food_name: foodName.data });
  revalidatePath("/foods");
}

const sourceSchema = z.object({
  title: z.string().trim().min(3).max(200),
  organization: z.string().trim().min(2).max(150),
  url: z.string().url().max(500),
  summary: z.string().trim().min(10).max(1000),
  usageNotes: z.string().trim().max(1000),
});

export async function addScientificSource(formData: FormData) {
  const parsed = sourceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin?error=source");
  const { supabase } = await requireUser();
  const { error } = await supabase.from("scientific_sources").insert({
    title: parsed.data.title,
    organization: parsed.data.organization,
    url: parsed.data.url,
    summary: parsed.data.summary,
    usage_notes: parsed.data.usageNotes,
  });
  if (error) redirect("/admin?error=forbidden");
  revalidatePath("/science");
  revalidatePath("/admin");
  redirect("/admin?saved=source");
}

const foodSchema = z.object({
  name: z.string().trim().min(2).max(150),
  category: z.string().trim().min(2).max(100),
  calories: z.coerce.number().min(0).max(1000),
  proteinG: z.coerce.number().min(0).max(200),
  carbsG: z.coerce.number().min(0).max(200),
  fatG: z.coerce.number().min(0).max(200),
  fiberG: z.coerce.number().min(0).max(100),
  source: z.string().trim().min(2).max(300),
});

export async function addFood(formData: FormData) {
  const parsed = foodSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin?error=food");
  const { supabase } = await requireUser();
  const { error } = await supabase.from("food_database").upsert({
    name: parsed.data.name,
    category: parsed.data.category,
    calories: parsed.data.calories,
    protein_g: parsed.data.proteinG,
    carbs_g: parsed.data.carbsG,
    fat_g: parsed.data.fatG,
    fiber_g: parsed.data.fiberG,
    source: parsed.data.source,
  }, { onConflict: "name" });
  if (error) redirect("/admin?error=forbidden");
  revalidatePath("/foods");
  revalidatePath("/admin");
  redirect("/admin?saved=food");
}
