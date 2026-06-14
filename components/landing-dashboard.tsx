import { Activity, Droplets, Flame, Target, TrendingDown } from "lucide-react";

export function LandingDashboard() {
  const meals = [
    ["Café da manhã", "Aveia, banana e iogurte", "420 kcal"],
    ["Almoço", "Arroz, feijão, frango e salada", "610 kcal"],
    ["Lanche", "Fruta e castanhas", "230 kcal"],
  ];
  return (
    <div className="glass relative rounded-[30px] p-4 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div><p className="text-xs font-bold text-emerald-600">SEU DIA</p><h3 className="text-xl font-black">Olá, Marina</h3></div>
        <span className="pill rounded-full px-3 py-1 text-xs font-bold">Plano equilibrado</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          [Flame, "1.860", "kcal"],
          [Target, "112g", "proteína"],
          [Droplets, "2,4L", "água"],
        ].map(([Icon, value, label]) => (
          <div key={String(label)} className="card p-3">
            <Icon className="mb-2 text-emerald-600" size={18} />
            <p className="font-black">{String(value)}</p><p className="muted text-[11px]">{String(label)}</p>
          </div>
        ))}
      </div>
      <div className="card mt-3 p-4">
        <div className="mb-3 flex justify-between"><b className="text-sm">Plano de hoje</b><span className="text-xs font-bold text-emerald-600">Ver tudo</span></div>
        <div className="space-y-3">
          {meals.map(([name, foods, kcal]) => (
            <div key={name} className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950"><Activity size={16}/></span>
              <div className="min-w-0 flex-1"><p className="text-xs font-bold">{name}</p><p className="muted truncate text-[11px]">{foods}</p></div>
              <span className="text-[11px] font-bold">{kcal}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl bg-white p-3 shadow-xl dark:bg-[#14231d] sm:flex">
        <span className="grid size-9 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950"><TrendingDown size={17}/></span>
        <div><p className="text-xs font-black">Progresso saudável</p><p className="muted text-[11px]">Metas moderadas e seguras</p></div>
      </div>
    </div>
  );
}
