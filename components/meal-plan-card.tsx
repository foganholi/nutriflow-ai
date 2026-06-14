import { RefreshCw } from "lucide-react";
import type { Meal } from "@/lib/nutrition-engine/types";

export function MealPlanCard({ meal }: { meal: Meal }) {
  return <article className="card p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-emerald-600">{meal.name}</p><h3 className="mt-1 font-black">{meal.items[0]?.name}</h3></div><span className="pill rounded-full px-3 py-1 text-xs font-bold">{meal.calories} kcal</span></div><p className="muted mt-2 text-sm">{meal.items[0]?.quantity}</p><div className="mt-4 flex gap-4 text-xs"><span><b>{meal.items[0]?.protein}g</b> proteína</span><span><b>{meal.items[0]?.carbs}g</b> carb.</span><span><b>{meal.items[0]?.fat}g</b> gord.</span></div><button className="mt-4 flex items-center gap-2 text-xs font-black text-emerald-700"><RefreshCw size={14}/> Ver substituições</button></article>;
}
