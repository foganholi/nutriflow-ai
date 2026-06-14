import Link from "next/link";
import { ArrowRight, CheckCircle2, Droplets, Flame, Scale, Target } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { MealPlanCard } from "@/components/meal-plan-card";
import { calculateBMI, classifyBMI, estimateWaterIntake } from "@/lib/nutrition-engine";
import { demoPlan, demoProfile } from "@/lib/demo-data";

export default function DashboardPage() {
  const bmi = calculateBMI(demoProfile.weightKg, demoProfile.heightCm);
  return <div className="mx-auto max-w-6xl"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-black text-emerald-600">DOMINGO, 14 DE JUNHO</p><h1 className="mt-1 text-4xl font-black">Olá, Marina.</h1><p className="muted mt-2">Seu plano de hoje está pronto.</p></div><Link href="/meal-plan" className="btn-primary">Gerar novo plano <ArrowRight size={17}/></Link></div>
    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[[Flame,"Meta diária",`${demoPlan.calories} kcal`],[Target,"Objetivo","Emagrecimento gradual"],[Scale,"IMC estimado",bmi.toFixed(1)],[Droplets,"Água estimada",`${estimateWaterIntake(demoProfile.weightKg)} L`]].map(([Icon,l,v])=><div className="card p-5" key={String(l)}><Icon className="text-emerald-600" size={21}/><p className="muted mt-4 text-xs">{String(l)}</p><p className="mt-1 font-black">{String(v)}</p></div>)}
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_.8fr]"><section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">Plano alimentar de hoje</h2><Link className="text-sm font-black text-emerald-700" href="/meal-plan">Ver completo</Link></div><div className="grid gap-3 sm:grid-cols-2">{demoPlan.meals.slice(0,4).map(m=><MealPlanCard key={m.name} meal={m}/>)}</div></section>
      <aside className="space-y-4"><div className="card p-5"><h2 className="font-black">Hábitos de hoje</h2><div className="mt-4 space-y-3">{["Beber água","Comer uma fruta","Incluir verduras","Movimentar o corpo"].map((h,i)=><label key={h} className="flex items-center gap-3 text-sm"><CheckCircle2 className={i<2?"text-emerald-600":"text-slate-300"} size={20}/>{h}</label>)}</div><Link href="/habits" className="btn-secondary mt-5 w-full">Abrir hábitos</Link></div><div className="card p-5"><p className="text-xs font-black text-blue-600">LEITURA CUIDADOSA</p><p className="mt-2 font-black">IMC: {classifyBMI(bmi)}</p><p className="muted mt-2 text-sm">É uma estimativa populacional e não avalia composição corporal.</p></div></aside></div>
    <div className="mt-6"><Disclaimer compact/></div>
  </div>;
}
