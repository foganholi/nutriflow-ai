import { Activity, BrainCircuit, Droplets, Flame, Radio, Target, TrendingDown } from "lucide-react";

export function LandingDashboard() {
  const meals = [
    ["Café da manhã", "Aveia, banana e iogurte", "420 kcal"],
    ["Almoço", "Arroz, feijão, frango e salada", "610 kcal"],
    ["Lanche", "Fruta e castanhas", "230 kcal"],
  ];
  return (
    <div className="glass relative z-10 rounded-[30px] p-4 md:p-6">
      <div className="relative mb-5 flex items-center justify-between">
        <div><p className="flex items-center gap-1.5 text-xs font-bold text-[#346f82]"><Radio size={12}/> SISTEMA ATIVO</p><h3 className="text-xl font-black">Olá, Marina</h3></div>
        <span className="pill rounded-full px-3 py-1 text-xs font-bold">Plano adaptativo</span>
      </div>
      <div className="relative grid grid-cols-3 gap-2">
        {[[Flame, "1.860", "kcal"], [Target, "112g", "proteína"], [Droplets, "2,4L", "água"]].map(([Icon, value, label]) => (
          <div key={String(label)} className="card p-3"><Icon className="mb-2 text-[#4b8990]" size={18}/><p className="font-black">{String(value)}</p><p className="muted text-[11px]">{String(label)}</p></div>
        ))}
      </div>
      <div className="card relative mt-3 p-4">
        <div className="mb-3 flex justify-between"><b className="text-sm">Plano de hoje</b><span className="text-xs font-bold text-[#346f82]">Ver tudo</span></div>
        <div className="space-y-3">
          {meals.map(([name, foods, kcal]) => (
            <div key={name} className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-[#e9f0ef] text-[#346f82] dark:bg-[#273438]"><Activity size={16}/></span>
              <div className="min-w-0 flex-1"><p className="text-xs font-bold">{name}</p><p className="muted truncate text-[11px]">{foods}</p></div>
              <span className="text-[11px] font-bold">{kcal}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-[#fcfdfa]/95 p-3 shadow-lg shadow-slate-950/8 dark:border-slate-700 dark:bg-[#1d2529] sm:flex">
        <span className="grid size-9 place-items-center rounded-xl bg-[#e9f0ef] text-[#346f82] dark:bg-[#273438]"><TrendingDown size={17}/></span>
        <div><p className="text-xs font-black">Progresso saudável</p><p className="muted text-[11px]">Metas moderadas e seguras</p></div>
      </div>
      <div className="absolute -right-4 top-1/2 hidden items-center gap-2 rounded-xl border border-slate-200 bg-[#fcfdfa]/95 px-3 py-2 text-[11px] font-black text-[#346f82] shadow-md dark:border-slate-700 dark:bg-[#1d2529] dark:text-[#8fc2c4] sm:flex"><BrainCircuit size={15}/> AI insights</div>
    </div>
  );
}
