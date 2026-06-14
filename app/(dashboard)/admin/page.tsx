import { Database, FileText, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { addFood, addScientificSource } from "@/app/(dashboard)/actions";
import { requireUser } from "@/lib/auth";

type Metrics = { users: number; meal_plans: number; progress_logs: number; foods: number; scientific_sources: number };

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const { supabase } = await requireUser();
  const { data } = await supabase.functions.invoke<Metrics>("admin-metrics", { body: {} });
  const metrics = data ?? { users: 0, meal_plans: 0, progress_logs: 0, foods: 0, scientific_sources: 0 };
  const cards: Array<{ icon: LucideIcon; label: string; value: number }> = [
    { icon: Users, label: "Usuários", value: metrics.users },
    { icon: Sparkles, label: "Planos gerados", value: metrics.meal_plans },
    { icon: ShieldCheck, label: "Registros de progresso", value: metrics.progress_logs },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-black text-emerald-600">ACESSO RESTRITO</p>
      <h1 className="mt-1 text-4xl font-black">Administração</h1>
      <p className="muted mt-2">Somente métricas agregadas e conteúdo público. Dados nutricionais individuais não são exibidos.</p>
      {params.saved && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">Conteúdo salvo.</p>}
      {params.error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-900">Operação inválida ou não autorizada.</p>}
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {cards.map(({ icon: Icon, label, value }) => <div className="card p-5" key={label}><Icon className="text-emerald-600" /><p className="muted mt-4 text-xs">{label}</p><p className="text-3xl font-black">{value}</p></div>)}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <form action={addFood} className="card grid gap-3 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2"><Database className="text-emerald-600" /><h2 className="mt-2 text-xl font-black">Adicionar alimento</h2></div>
          <label className="sm:col-span-2"><span className="label">Nome</span><input className="input" name="name" required /></label>
          <label><span className="label">Categoria</span><input className="input" name="category" required /></label>
          <label><span className="label">Calorias/100g</span><input className="input" name="calories" type="number" step="0.1" min="0" required /></label>
          {[["proteinG", "Proteína"], ["carbsG", "Carboidrato"], ["fatG", "Gordura"], ["fiberG", "Fibra"]].map(([name, label]) => <label key={name}><span className="label">{label} (g)</span><input className="input" name={name} type="number" step="0.1" min="0" required /></label>)}
          <label className="sm:col-span-2"><span className="label">Fonte</span><input className="input" name="source" required /></label>
          <button className="btn-primary sm:col-span-2">Salvar alimento</button>
        </form>
        <form action={addScientificSource} className="card grid gap-3 p-6">
          <div><FileText className="text-blue-600" /><h2 className="mt-2 text-xl font-black">Adicionar fonte</h2></div>
          <label><span className="label">Título</span><input className="input" name="title" required /></label>
          <label><span className="label">Organização</span><input className="input" name="organization" required /></label>
          <label><span className="label">URL oficial</span><input className="input" name="url" type="url" required /></label>
          <label><span className="label">Resumo</span><textarea className="input min-h-20" name="summary" required /></label>
          <label><span className="label">Como é usada</span><textarea className="input min-h-16" name="usageNotes" /></label>
          <button className="btn-primary">Salvar fonte</button>
        </form>
      </div>
    </div>
  );
}
