import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, Circle, Droplets, Flame, Scale, Target } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { MealPlanCard } from "@/components/meal-plan-card";
import { requireUser } from "@/lib/auth";
import { calculateBMI, classifyBMI, estimateWaterIntake } from "@/lib/nutrition-engine";
import type { Meal } from "@/lib/nutrition-engine/types";
import { toNutritionProfile } from "@/lib/profile";

const goalLabels = {
  lose_weight: "Emagrecimento gradual",
  gain_muscle: "Ganho de massa",
  maintain: "Manutenção de peso",
  eat_better: "Melhorar alimentação",
};

export default async function DashboardPage() {
  const { supabase, user } = await requireUser();
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: profile }, { data: preferences }, { data: plan }, { data: habits }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("nutrition_preferences").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("meal_plans").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("habits").select("id,title").eq("user_id", user.id).eq("active", true).order("created_at").limit(4),
  ]);
  const nutritionProfile = profile ? toNutritionProfile(profile, preferences) : null;
  if (!nutritionProfile) redirect("/onboarding");

  const [{ data: items }, { data: habitLogs }] = await Promise.all([
    plan ? supabase.from("meal_items").select("*").eq("meal_plan_id", plan.id).order("created_at") : Promise.resolve({ data: [] }),
    supabase.from("habit_logs").select("habit_id,completed").eq("user_id", user.id).eq("log_date", today),
  ]);
  const completed = new Set((habitLogs ?? []).filter((log) => log.completed).map((log) => log.habit_id));
  const grouped = new Map<string, Meal>();
  for (const item of items ?? []) {
    const meal: Meal = grouped.get(item.meal_name) ?? { name: item.meal_name, items: [], calories: 0 };
    meal.items.push({ name: item.food_name, quantity: item.quantity, calories: Number(item.calories ?? 0), protein: Number(item.protein_g ?? 0), carbs: Number(item.carbs_g ?? 0), fat: Number(item.fat_g ?? 0) });
    meal.calories += Number(item.calories ?? 0);
    grouped.set(item.meal_name, meal);
  }
  const bmi = calculateBMI(nutritionProfile.weightKg, nutritionProfile.heightCm);
  const firstName = String(profile.full_name ?? "Olá").split(" ")[0];
  const formattedDate = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(new Date());

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-black uppercase text-emerald-600">{formattedDate}</p><h1 className="mt-1 text-4xl font-black">Olá, {firstName}.</h1><p className="muted mt-2">{plan ? "Seu plano mais recente está pronto." : "Gere seu primeiro plano alimentar."}</p></div>
        <Link href="/meal-plan" className="btn-primary">Abrir plano <ArrowRight size={17} /></Link>
      </div>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [Flame, "Meta diária", plan ? `${plan.total_calories} kcal` : "A calcular"],
          [Target, "Objetivo", goalLabels[nutritionProfile.goal]],
          [Scale, "IMC estimado", bmi.toFixed(1)],
          [Droplets, "Água estimada", `${estimateWaterIntake(nutritionProfile.weightKg)} L`],
        ].map(([Icon, label, value]) => <div className="card p-5" key={String(label)}><Icon className="text-emerald-600" size={21} /><p className="muted mt-4 text-xs">{String(label)}</p><p className="mt-1 font-black">{String(value)}</p></div>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_.8fr]">
        <section>
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">Plano alimentar de hoje</h2><Link className="text-sm font-black text-emerald-700" href="/meal-plan">Ver completo</Link></div>
          {[...grouped.values()].length
            ? <div className="grid gap-3 sm:grid-cols-2">{[...grouped.values()].slice(0, 4).map((meal) => <MealPlanCard key={meal.name} meal={meal} />)}</div>
            : <div className="card p-6"><p className="font-black">Nenhum plano salvo.</p><p className="muted mt-2 text-sm">Abra o gerador para começar.</p></div>}
        </section>
        <aside className="space-y-4">
          <div className="card p-5">
            <h2 className="font-black">Hábitos de hoje</h2>
            <div className="mt-4 space-y-3">{(habits ?? []).map((habit) => <div key={habit.id} className="flex items-center gap-3 text-sm">{completed.has(habit.id) ? <CheckCircle2 className="text-emerald-600" size={20} /> : <Circle className="text-slate-300" size={20} />}{habit.title}</div>)}</div>
            <Link href="/habits" className="btn-secondary mt-5 w-full">Abrir hábitos</Link>
          </div>
          <div className="card p-5"><p className="text-xs font-black text-blue-600">LEITURA CUIDADOSA</p><p className="mt-2 font-black">IMC: {classifyBMI(bmi)}</p><p className="muted mt-2 text-sm">É uma estimativa populacional e não avalia composição corporal.</p></div>
        </aside>
      </div>
      <div className="mt-6"><Disclaimer compact /></div>
    </div>
  );
}
