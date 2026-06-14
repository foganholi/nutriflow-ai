import { Disclaimer } from "@/components/disclaimer";
import { OnboardingForm } from "@/components/onboarding-form";
import { requireUser } from "@/lib/auth";

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const [{ data: profile }, { data: preferences }] = await Promise.all([
    supabase.from("profiles").select("full_name,age,sex,height_cm,current_weight_kg,target_weight_kg,goal,activity_level").eq("id", user.id).single(),
    supabase.from("nutrition_preferences").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-black text-emerald-600">PERFIL NUTRICIONAL</p>
      <h1 className="mt-2 text-4xl font-black">Vamos adaptar o NutriFlow a você</h1>
      <p className="muted mb-7 mt-3">Compartilhe apenas o necessário. Você poderá alterar ou excluir esses dados.</p>
      {params.error && <p className="mx-auto mb-4 max-w-3xl rounded-xl bg-red-50 p-3 text-sm text-red-900">Não foi possível salvar. Revise os dados e tente novamente.</p>}
      <OnboardingForm initial={{
        fullName: profile?.full_name ?? "",
        age: profile?.age ?? 30,
        sex: profile?.sex ?? "not_informed",
        heightCm: Number(profile?.height_cm ?? 170),
        weightKg: Number(profile?.current_weight_kg ?? 70),
        targetWeightKg: Number(profile?.target_weight_kg ?? 65),
        goal: profile?.goal ?? "eat_better",
        activityLevel: profile?.activity_level ?? "moderate",
        mealsPerDay: preferences?.meals_per_day ?? 4,
        budget: preferences?.budget_level ?? "medium",
        restrictionsText: preferences?.restrictions?.join(", ") ?? "",
        allergiesText: preferences?.allergies?.join(", ") ?? "",
        preferredFoodsText: preferences?.preferred_foods?.join(", ") ?? "",
        dislikedFoodsText: preferences?.disliked_foods?.join(", ") ?? "",
        cookingTime: preferences?.cooking_time ?? "medium",
        countryRegion: preferences?.country_region ?? "Brasil",
        brazilianFoodMode: preferences?.brazilian_food_mode ?? true,
        clinicalCondition: preferences?.special_condition ?? false,
      }} />
      <div className="mx-auto mt-5 max-w-3xl"><Disclaimer compact /></div>
    </div>
  );
}
