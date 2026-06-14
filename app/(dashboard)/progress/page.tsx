import { Plus } from "lucide-react";
import { ProgressChart } from "@/components/progress-chart";

export default function ProgressPage() {
  return <div className="mx-auto max-w-5xl"><div className="flex items-end justify-between"><div><p className="text-sm font-black text-emerald-600">EVOLUÇÃO</p><h1 className="mt-1 text-4xl font-black">Seu progresso</h1></div><button className="btn-primary"><Plus size={17}/> Novo registro</button></div><div className="mt-7 grid gap-4 sm:grid-cols-3">{[["Peso atual","70,8 kg","-2,0 kg no período"],["Cintura","81,8 cm","-2,2 cm no período"],["Consistência","82%","hábitos concluídos"]].map(([a,b,c])=><div className="card p-5" key={a}><p className="muted text-xs">{a}</p><p className="mt-1 text-2xl font-black">{b}</p><p className="mt-2 text-xs font-bold text-emerald-700">{c}</p></div>)}</div><section className="card mt-5 p-5"><h2 className="font-black">Evolução de peso</h2><p className="muted mt-1 text-sm">Mudanças graduais ao longo das últimas semanas.</p><ProgressChart/></section></div>;
}
