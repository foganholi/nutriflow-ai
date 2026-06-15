import Link from "next/link";
import { Apple, BarChart3, BookOpen, Home, ListChecks, LogOut, Settings, ShoppingBasket, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { logout } from "@/app/(auth)/actions";

const nav = [
  [Home, "Visão geral", "/dashboard"],
  [Sparkles, "Plano alimentar", "/meal-plan"],
  [ShoppingBasket, "Lista de compras", "/shopping-list"],
  [BarChart3, "Progresso", "/progress"],
  [ListChecks, "Hábitos", "/habits"],
  [Apple, "Alimentos", "/foods"],
  [BookOpen, "Conteúdo", "/education"],
  [Settings, "Configurações", "/settings"],
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[264px_1fr]">
      <aside className="tech-panel sticky top-0 hidden h-screen flex-col rounded-none border-y-0 border-l-0 p-5 md:flex">
        <div className="relative z-10 rounded-2xl bg-white p-3 text-slate-950 shadow-xl shadow-black/10"><Logo /></div>
        <div className="relative z-10 mt-6 flex items-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/5 px-3 py-2 text-[11px] font-bold uppercase tracking-[.16em] text-cyan-200">
          <Zap size={14} /> Nutrition OS
        </div>
        <nav className="relative z-10 mt-6 space-y-1" aria-label="Dashboard">
          {nav.map(([Icon, label, href]) => (
            <Link key={String(label)} href={String(href)} className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-bold text-indigo-100/75 transition hover:border-indigo-300/15 hover:bg-white/8 hover:text-white">
              <span className="grid size-8 place-items-center rounded-lg bg-white/5 text-cyan-300 transition group-hover:bg-indigo-500/25 group-hover:text-white"><Icon size={17}/></span>
              {String(label)}
            </Link>
          ))}
        </nav>
        <div className="relative z-10 mt-auto rounded-2xl border border-indigo-300/15 bg-white/6 p-4 text-white">
          <ShieldCheck size={20} className="text-cyan-300"/>
          <p className="mt-2 text-sm font-black">Ambiente protegido</p>
          <p className="mt-1 text-xs text-indigo-100/55">RLS, criptografia e privacidade por padrão.</p>
        </div>
        <form action={logout} className="relative z-10 mt-4">
          <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-indigo-100/65 transition hover:bg-white/8 hover:text-white"><LogOut size={17}/> Sair</button>
        </form>
      </aside>
      <main className="min-w-0 p-4 pb-24 md:p-8 lg:p-10">{children}</main>
      <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border border-indigo-200/30 bg-[#0b102b]/94 p-2 text-indigo-100 shadow-2xl shadow-indigo-950/30 backdrop-blur-2xl md:hidden" aria-label="Navegação móvel">
        {nav.slice(0, 5).map(([Icon, label, href]) => <Link key={String(label)} href={String(href)} className="flex min-w-14 flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-bold transition hover:bg-white/10 hover:text-cyan-300"><Icon size={19}/>{String(label)}</Link>)}
      </nav>
    </div>
  );
}
