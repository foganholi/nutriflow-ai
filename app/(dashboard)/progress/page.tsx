import { Plus } from "lucide-react";
import { addProgress } from "@/app/(dashboard)/actions";
import { ProgressChart } from "@/components/progress-chart";
import { requireUser } from "@/lib/auth";

export default async function ProgressPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: logs } = await supabase.from("progress_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: true }).limit(90);
  const latest = logs?.at(-1);
  const first = logs?.[0];
  const points = (logs ?? []).map((log) => ({
    date: new Date(log.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    weight: Number(log.weight_kg),
    waist: log.waist_cm ? Number(log.waist_cm) : null,
  }));
  const weightChange = latest && first ? Number(latest.weight_kg) - Number(first.weight_kg) : 0;
  const waistChange = latest?.waist_cm && first?.waist_cm ? Number(latest.waist_cm) - Number(first.waist_cm) : null;

  return (
    <div className="mx-auto max-w-5xl">
      <div><p className="text-sm font-black text-emerald-600">EVOLUÇÃO</p><h1 className="mt-1 text-4xl font-black">Seu progresso</h1></div>
      {params.saved && <p className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">Registro salvo com sucesso.</p>}
      {params.error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-900">Revise os valores informados.</p>}
      <form action={addProgress} className="card mt-7 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <label><span className="label">Peso (kg)</span><input className="input" name="weightKg" type="number" step="0.1" min="30" max="350" required /></label>
        <label><span className="label">Cintura (cm, opcional)</span><input className="input" name="waistCm" type="number" step="0.1" min="30" max="250" /></label>
        <label><span className="label">Energia</span><select className="input" name="energyLevel" defaultValue="3">{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}/5</option>)}</select></label>
        <label><span className="label">Humor</span><input className="input" name="mood" maxLength={100} placeholder="Como você está?" /></label>
        <label><span className="label">Fome</span><select className="input" name="hungerLevel" defaultValue="3">{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}/5</option>)}</select></label>
        <label><span className="label">Observações</span><input className="input" name="notes" maxLength={1000} /></label>
        <button className="btn-primary sm:col-span-2 lg:col-span-3"><Plus size={17} /> Salvar registro</button>
      </form>
      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[
          ["Peso atual", latest ? `${latest.weight_kg} kg` : "Sem registro", logs?.length ? `${weightChange > 0 ? "+" : ""}${weightChange.toFixed(1)} kg no período` : "Comece hoje"],
          ["Cintura", latest?.waist_cm ? `${latest.waist_cm} cm` : "Sem registro", waistChange == null ? "Opcional" : `${waistChange > 0 ? "+" : ""}${waistChange.toFixed(1)} cm no período`],
          ["Registros", String(logs?.length ?? 0), "histórico pessoal"],
        ].map(([label, value, detail]) => <div className="card p-5" key={label}><p className="muted text-xs">{label}</p><p className="mt-1 text-2xl font-black">{value}</p><p className="mt-2 text-xs font-bold text-emerald-700">{detail}</p></div>)}
      </div>
      <section className="card mt-5 p-5"><h2 className="font-black">Evolução de peso</h2><p className="muted mt-1 text-sm">Mudanças graduais ao longo do tempo.</p><ProgressChart data={points} /></section>
    </div>
  );
}
