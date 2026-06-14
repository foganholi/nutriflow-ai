import { Download, RefreshCw } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { MealPlanCard } from "@/components/meal-plan-card";
import { demoPlan } from "@/lib/demo-data";

export default function MealPlanPage() {
  return <div className="mx-auto max-w-5xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-black text-emerald-600">PLANO PERSONALIZADO</p><h1 className="mt-1 text-4xl font-black">Seu dia alimentar</h1><p className="muted mt-2">{demoPlan.calories} kcal estimadas · {demoPlan.macros.protein}g proteína · {demoPlan.macros.carbs}g carboidratos</p></div><div className="flex gap-2"><button className="btn-secondary"><Download size={17}/> PDF</button><button className="btn-primary"><RefreshCw size={17}/> Regenerar</button></div></div>
    {demoPlan.warnings.map(w=><p key={w} className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{w}</p>)}
    <div className="mt-7 grid gap-4 md:grid-cols-2">{demoPlan.meals.map(meal=><MealPlanCard key={meal.name} meal={meal}/>)}</div><div className="mt-6"><Disclaimer/></div></div>;
}
