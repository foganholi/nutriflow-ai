"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { generateMealPlan, type NutritionProfile } from "@/lib/nutrition-engine";

const initial: NutritionProfile = {
  age: 30, sex: "not_informed", heightCm: 170, weightKg: 70, targetWeightKg: 65,
  goal: "eat_better", activityLevel: "moderate", mealsPerDay: 4, budget: "medium",
};

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(initial);
  const plan = useMemo(() => generateMealPlan(profile), [profile]);
  const set = (key: keyof NutritionProfile, value: unknown) => setProfile((p) => ({ ...p, [key]: value }));
  const steps = [
    <div className="grid gap-4 sm:grid-cols-2" key="body">
      <Field label="Idade"><input className="input" type="number" min="14" max="100" value={profile.age} onChange={(e)=>set("age", Number(e.target.value))}/></Field>
      <Field label="Sexo biológico"><select className="input" value={profile.sex} onChange={(e)=>set("sex", e.target.value)}><option value="not_informed">Prefiro não informar</option><option value="female">Feminino</option><option value="male">Masculino</option></select></Field>
      <Field label="Altura (cm)"><input className="input" type="number" min="120" max="230" value={profile.heightCm} onChange={(e)=>set("heightCm", Number(e.target.value))}/></Field>
      <Field label="Peso atual (kg)"><input className="input" type="number" min="30" max="350" value={profile.weightKg} onChange={(e)=>set("weightKg", Number(e.target.value))}/></Field>
      <Field label="Peso desejado (kg)"><input className="input" type="number" min="30" max="350" value={profile.targetWeightKg} onChange={(e)=>set("targetWeightKg", Number(e.target.value))}/></Field>
    </div>,
    <div className="grid gap-4 sm:grid-cols-2" key="goals">
      <Field label="Objetivo"><select className="input" value={profile.goal} onChange={(e)=>set("goal", e.target.value)}><option value="lose_weight">Emagrecer</option><option value="gain_muscle">Ganhar massa</option><option value="maintain">Manter peso</option><option value="eat_better">Melhorar alimentação</option></select></Field>
      <Field label="Atividade"><select className="input" value={profile.activityLevel} onChange={(e)=>set("activityLevel", e.target.value)}><option value="sedentary">Sedentário</option><option value="light">Levemente ativo</option><option value="moderate">Moderadamente ativo</option><option value="very_active">Muito ativo</option><option value="athlete">Atleta</option></select></Field>
      <Field label="Refeições por dia"><select className="input" value={profile.mealsPerDay} onChange={(e)=>set("mealsPerDay", Number(e.target.value))}>{[3,4,5,6].map(n=><option key={n}>{n}</option>)}</select></Field>
      <Field label="Orçamento"><select className="input" value={profile.budget} onChange={(e)=>set("budget", e.target.value)}><option value="low">Baixo</option><option value="medium">Médio</option><option value="high">Alto</option></select></Field>
      <label className="card flex gap-3 p-4 sm:col-span-2"><input type="checkbox" checked={profile.clinicalCondition || false} onChange={(e)=>set("clinicalCondition", e.target.checked)}/><span><b>Tenho condição especial, uso medicamentos, gestação ou histórico de transtorno alimentar.</b><span className="muted mt-1 block text-sm">Isso ativa alertas e recomendação de acompanhamento profissional.</span></span></label>
    </div>,
    <div key="result">
      <div className="grid gap-3 sm:grid-cols-3">{[["Calorias estimadas", `${plan.calories} kcal`],["Proteínas", `${plan.macros.protein} g`],["Água", `${Math.round(profile.weightKg*35)/1000} L`]].map(([l,v])=><div className="card p-4" key={l}><p className="muted text-xs">{l}</p><p className="mt-1 text-2xl font-black">{v}</p></div>)}</div>
      {plan.warnings.map(w=><div key={w} className="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-950"><ShieldAlert size={18}/>{w}</div>)}
      <a className="btn-primary mt-6" href="/dashboard">Salvar e ir ao dashboard</a>
    </div>,
  ];
  return <div className="card mx-auto max-w-3xl p-5 md:p-8"><div className="mb-8"><div className="mb-2 flex justify-between text-xs font-bold"><span>Etapa {step+1} de 3</span><span>{Math.round((step+1)/3*100)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-emerald-100"><div className="h-full bg-emerald-600 transition-all" style={{width:`${(step+1)/3*100}%`}}/></div></div>{steps[step]}<div className="mt-8 flex justify-between">{step>0?<button className="btn-secondary" onClick={()=>setStep(step-1)}><ArrowLeft size={17}/>Voltar</button>:<span/>}{step<2&&<button className="btn-primary" onClick={()=>setStep(step+1)}>Continuar<ArrowRight size={17}/></button>}</div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span className="label">{label}</span>{children}</label>;
}
