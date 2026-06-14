import { Download, RefreshCw } from "lucide-react";
import { createAndPersistPlan } from "@/app/(dashboard)/actions";
import { Disclaimer } from "@/components/disclaimer";
import { MealPlanCard } from "@/components/meal-plan-card";
import { requireUser } from "@/lib/auth";
import type { Meal } from "@/lib/nutrition-engine/types";

export default async function MealPlanPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: plan } = await supabase.from("meal_plans").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const { data: items } = plan
    ? await supabase.from("meal_items").select("*").eq("meal_plan_id", plan.id).order("created_at")
    : { data: [] };

  const grouped = new Map<string, Meal>();
  for (const item of items ?? []) {
    const meal: Meal = grouped.get(item.meal_name) ?? { name: item.meal_name, items: [], calories: 0 };
    meal.items.push({
      name: item.food_name,
      quantity: item.quantity,
      calories: Number(item.calories ?? 0),
      protein: Number(item.protein_g ?? 0),
      carbs: Number(item.carbs_g ?? 0),
      fat: Number(item.fat_g ?? 0),
    });
    meal.calories += Number(item.calories ?? 0);
    grouped.set(item.meal_name, meal);
  }
  const meals = [...grouped.values()];
  const warnings = String(plan?.safety_notes ?? "").split("\n").filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black text-emerald-600">PLANO PERSONALIZADO</p>
          <h1 className="mt-1 text-4xl font-black">Seu dia alimentar</h1>
          {plan && <p className="muted mt-2">{plan.total_calories} kcal estimadas · {plan.protein_g}g proteína · {plan.carbs_g}g carboidratos</p>}
        </div>
        <div className="flex gap-2">
          <a className="btn-secondary" href="/api/export/meal-plan"><Download size={17} /> Exportar</a>
          <form action={createAndPersistPlan}><button className="btn-primary"><RefreshCw size={17} /> {plan ? "Regenerar" : "Gerar plano"}</button></form>
        </div>
      </div>
      {params.generated && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">Novo plano criado e salvo.</p>}
      {params.error === "weekly-limit" && <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">O plano gratuito permite uma geração a cada sete dias. Seu plano salvo continua disponível.</p>}
      {params.error && params.error !== "weekly-limit" && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-900">Não foi possível gerar o plano. Revise seu onboarding.</p>}
      {warnings.map((warning) => <p key={warning} className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{warning}</p>)}
      {meals.length
        ? <div className="mt-7 grid gap-4 md:grid-cols-2">{meals.map((meal) => <MealPlanCard key={meal.name} meal={meal} />)}</div>
        : <div className="card mt-7 p-8 text-center"><h2 className="text-xl font-black">Nenhum plano salvo</h2><p className="muted mt-2">Complete o onboarding para gerar estimativas personalizadas.</p></div>}
      <div className="mt-6"><Disclaimer /></div>
    </div>
  );
}
