import { RefreshCw } from "lucide-react";
import { suggestFoodSwaps } from "@/lib/nutrition-engine";
import type { Meal } from "@/lib/nutrition-engine/types";

export function MealPlanCard({ meal, restrictions = [] }: { meal: Meal; restrictions?: string[] }) {
  const macros = meal.items.reduce((total, item) => ({
    protein: total.protein + item.protein,
    carbs: total.carbs + item.carbs,
    fat: total.fat + item.fat,
  }), { protein: 0, carbs: 0, fat: 0 });

  return (
    <article className="card p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-black uppercase tracking-wider text-emerald-600">{meal.name}</p>
        <span className="pill shrink-0 rounded-full px-3 py-1 text-xs font-bold">{meal.calories} kcal</span>
      </div>
      <div className="mt-4 space-y-3">
        {meal.items.map((item) => (
          <div className="border-b border-emerald-950/5 pb-3 last:border-0 last:pb-0" key={`${meal.name}-${item.name}`}>
            <h3 className="font-black">{item.name}</h3>
            <p className="muted mt-1 text-sm">{item.quantity} · {item.calories} kcal</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <span><b>{macros.protein}g</b> proteína</span>
        <span><b>{macros.carbs}g</b> carb.</span>
        <span><b>{macros.fat}g</b> gord.</span>
      </div>
      <details className="mt-4">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-black text-emerald-700">
          <RefreshCw size={14} /> Ver substituições
        </summary>
        <div className="mt-3 space-y-3 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-50">
          {meal.items.map((item) => (
            <div key={`swap-${meal.name}-${item.name}`}>
              <b>{item.name}:</b> {suggestFoodSwaps(item.name, restrictions).join(" · ")}
            </div>
          ))}
        </div>
      </details>
    </article>
  );
}
