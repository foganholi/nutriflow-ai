"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { saveOnboarding } from "@/app/(dashboard)/actions";
import { generateMealPlan, type NutritionProfile } from "@/lib/nutrition-engine";

type FormProfile = NutritionProfile & {
  fullName: string;
  restrictionsText: string;
  allergiesText: string;
  preferredFoodsText: string;
  dislikedFoodsText: string;
  cookingTime: "little" | "medium" | "plenty";
  countryRegion: string;
  brazilianFoodMode: boolean;
};

const defaults: FormProfile = {
  fullName: "",
  age: 30,
  sex: "not_informed",
  heightCm: 170,
  weightKg: 70,
  targetWeightKg: 65,
  goal: "eat_better",
  activityLevel: "moderate",
  mealsPerDay: 4,
  budget: "medium",
  restrictionsText: "",
  allergiesText: "",
  preferredFoodsText: "",
  dislikedFoodsText: "",
  cookingTime: "medium",
  countryRegion: "Brasil",
  brazilianFoodMode: true,
  clinicalCondition: false,
};

export function OnboardingForm({ initial }: { initial?: Partial<FormProfile> }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<FormProfile>({ ...defaults, ...initial });
  const nutritionProfile = useMemo<NutritionProfile>(() => ({
    ...profile,
    restrictions: profile.restrictionsText.split(",").map((item) => item.trim()).filter(Boolean),
    allergies: profile.allergiesText.split(",").map((item) => item.trim()).filter(Boolean),
  }), [profile]);
  const plan = useMemo(() => generateMealPlan(nutritionProfile), [nutritionProfile]);
  const set = <K extends keyof FormProfile>(key: K, value: FormProfile[K]) =>
    setProfile((current) => ({ ...current, [key]: value }));

  return (
    <form action={saveOnboarding} className="card mx-auto max-w-3xl p-5 md:p-8">
      <input type="hidden" name="fullName" value={profile.fullName} />
      <input type="hidden" name="age" value={profile.age} />
      <input type="hidden" name="sex" value={profile.sex} />
      <input type="hidden" name="heightCm" value={profile.heightCm} />
      <input type="hidden" name="weightKg" value={profile.weightKg} />
      <input type="hidden" name="targetWeightKg" value={profile.targetWeightKg} />
      <input type="hidden" name="goal" value={profile.goal} />
      <input type="hidden" name="activityLevel" value={profile.activityLevel} />
      <input type="hidden" name="mealsPerDay" value={profile.mealsPerDay} />
      <input type="hidden" name="budget" value={profile.budget} />
      <input type="hidden" name="clinicalCondition" value={String(profile.clinicalCondition)} />
      <input type="hidden" name="restrictions" value={profile.restrictionsText} />
      <input type="hidden" name="allergies" value={profile.allergiesText} />
      <input type="hidden" name="preferredFoods" value={profile.preferredFoodsText} />
      <input type="hidden" name="dislikedFoods" value={profile.dislikedFoodsText} />
      <input type="hidden" name="cookingTime" value={profile.cookingTime} />
      <input type="hidden" name="countryRegion" value={profile.countryRegion} />
      <input type="hidden" name="brazilianFoodMode" value={String(profile.brazilianFoodMode)} />

      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs font-bold">
          <span>Etapa {step + 1} de 3</span><span>{Math.round((step + 1) / 3 * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
          <div className="h-full bg-emerald-600 transition-all" style={{ width: `${(step + 1) / 3 * 100}%` }} />
        </div>
      </div>

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome"><input className="input" value={profile.fullName} onChange={(e) => set("fullName", e.target.value)} minLength={2} maxLength={100} required /></Field>
          <Field label="Idade"><input className="input" type="number" min="14" max="100" value={profile.age} onChange={(e) => set("age", Number(e.target.value))} required /></Field>
          <Field label="Sexo biológico"><select className="input" value={profile.sex} onChange={(e) => set("sex", e.target.value as FormProfile["sex"])}><option value="not_informed">Prefiro não informar</option><option value="female">Feminino</option><option value="male">Masculino</option></select></Field>
          <Field label="Altura (cm)"><input className="input" type="number" min="120" max="230" value={profile.heightCm} onChange={(e) => set("heightCm", Number(e.target.value))} required /></Field>
          <Field label="Peso atual (kg)"><input className="input" type="number" min="30" max="350" step="0.1" value={profile.weightKg} onChange={(e) => set("weightKg", Number(e.target.value))} required /></Field>
          <Field label="Peso desejado (kg)"><input className="input" type="number" min="30" max="350" step="0.1" value={profile.targetWeightKg} onChange={(e) => set("targetWeightKg", Number(e.target.value))} required /></Field>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Objetivo"><select className="input" value={profile.goal} onChange={(e) => set("goal", e.target.value as FormProfile["goal"])}><option value="lose_weight">Emagrecer</option><option value="gain_muscle">Ganhar massa</option><option value="maintain">Manter peso</option><option value="eat_better">Melhorar alimentação</option></select></Field>
          <Field label="Atividade"><select className="input" value={profile.activityLevel} onChange={(e) => set("activityLevel", e.target.value as FormProfile["activityLevel"])}><option value="sedentary">Sedentário</option><option value="light">Levemente ativo</option><option value="moderate">Moderadamente ativo</option><option value="very_active">Muito ativo</option><option value="athlete">Atleta</option></select></Field>
          <Field label="Refeições por dia"><select className="input" value={profile.mealsPerDay} onChange={(e) => set("mealsPerDay", Number(e.target.value))}>{[3, 4, 5, 6].map((number) => <option key={number}>{number}</option>)}</select></Field>
          <Field label="Orçamento"><select className="input" value={profile.budget} onChange={(e) => set("budget", e.target.value as FormProfile["budget"])}><option value="low">Baixo</option><option value="medium">Médio</option><option value="high">Alto</option></select></Field>
          <Field label="Tempo para cozinhar"><select className="input" value={profile.cookingTime} onChange={(e) => set("cookingTime", e.target.value as FormProfile["cookingTime"])}><option value="little">Pouco</option><option value="medium">Médio</option><option value="plenty">Bastante</option></select></Field>
          <Field label="País ou região"><input className="input" value={profile.countryRegion} onChange={(e) => set("countryRegion", e.target.value)} maxLength={100} /></Field>
          <Field label="Restrições (separe por vírgulas)"><input className="input" value={profile.restrictionsText} onChange={(e) => set("restrictionsText", e.target.value)} placeholder="Vegano, sem glúten" /></Field>
          <Field label="Alergias (separe por vírgulas)"><input className="input" value={profile.allergiesText} onChange={(e) => set("allergiesText", e.target.value)} placeholder="Amendoim, camarão" /></Field>
          <Field label="Alimentos preferidos"><input className="input" value={profile.preferredFoodsText} onChange={(e) => set("preferredFoodsText", e.target.value)} /></Field>
          <Field label="Alimentos que não gosta"><input className="input" value={profile.dislikedFoodsText} onChange={(e) => set("dislikedFoodsText", e.target.value)} /></Field>
          <label className="card flex gap-3 p-4 sm:col-span-2"><input type="checkbox" checked={profile.brazilianFoodMode} onChange={(e) => set("brazilianFoodMode", e.target.checked)} /><span><b>Priorizar comida brasileira simples</b><span className="muted mt-1 block text-sm">Arroz, feijão, ovos, raízes, frutas e preparos acessíveis.</span></span></label>
          <label className="card flex gap-3 p-4 sm:col-span-2"><input type="checkbox" checked={profile.clinicalCondition ?? false} onChange={(e) => set("clinicalCondition", e.target.checked)} /><span><b>Tenho condição especial, uso medicamentos, gestação ou histórico de transtorno alimentar.</b><span className="muted mt-1 block text-sm">Isso ativa alertas e recomendação de acompanhamento profissional.</span></span></label>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[["Calorias estimadas", `${plan.calories} kcal`], ["Proteínas", `${plan.macros.protein} g`], ["Água", `${Math.round(profile.weightKg * 35) / 1000} L`]].map(([label, value]) => <div className="card p-4" key={label}><p className="muted text-xs">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>)}
          </div>
          {plan.warnings.map((warning) => <div key={warning} className="mt-3 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-950"><ShieldAlert className="shrink-0" size={18} />{warning}</div>)}
          <p className="muted mt-5 text-sm">Ao salvar, o perfil, as preferências, os hábitos iniciais, o plano e a lista de compras serão protegidos pelo seu usuário.</p>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {step > 0 ? <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}><ArrowLeft size={17} />Voltar</button> : <span />}
        {step < 2
          ? <button type="button" className="btn-primary" onClick={() => setStep(step + 1)} disabled={step === 0 && profile.fullName.trim().length < 2}>Continuar<ArrowRight size={17} /></button>
          : <button className="btn-primary" type="submit">Salvar e criar meu plano<ArrowRight size={17} /></button>}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span className="label">{label}</span>{children}</label>;
}
