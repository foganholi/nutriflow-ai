import { CheckCircle2, Circle } from "lucide-react";

export default function HabitsPage() {
  const habits = ["Beber a meta de água","Comer frutas","Comer verduras","Evitar ultraprocessados","Fazer atividade física","Dormir bem","Registrar refeições"];
  return <div className="mx-auto max-w-4xl"><p className="text-sm font-black text-emerald-600">CONSISTÊNCIA</p><h1 className="mt-1 text-4xl font-black">Hábitos de hoje</h1><p className="muted mt-2">Pequenas ações contam mais do que perfeição.</p><div className="mt-7 grid gap-3">{habits.map((h,i)=><button key={h} className="card flex items-center justify-between p-5 text-left"><span><b>{h}</b><span className="muted mt-1 block text-xs">Meta diária</span></span>{i<3?<CheckCircle2 className="text-emerald-600"/>:<Circle className="text-slate-300"/>}</button>)}</div></div>;
}
