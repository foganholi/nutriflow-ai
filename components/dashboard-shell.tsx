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
        <div className="relative z-10 mt-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.035] px-3 py-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#a9d1d1]">
          <Zap size={14} /> Nutrition OS
        </div>
        <nav className="relative z-10 mt-6 space-y-1" aria-label="Dashboard">
          {nav.map(([Icon, label, href]) => (
            <Link key={String(label)} href={String(href)} className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-bold text-slate-200/75 transition hover:border-white/10 hover:bg-white/[.055] hover:text-white">
              <span className="grid size-8 place-items-center rounded-lg bg-white/5 text-[#9fcacc] transition group-hover:bg-white/10 group-hover:text-white"><Icon size={17}/></span>
              {String(label)}
            </Link>
          ))}
        </nav>
        <div className="relative z-10 mt-auto rounded-2xl border border-white/10 bg-white/[.035] p-4 text-white">
          <ShieldCheck size={20} className="text-[#9fcacc]"/>
          <p className="mt-2 text-sm font-black">Ambiente protegido</p>
          <p className="mt-1 text-xs text-slate-200/55">RLS, criptografia e privacidade por padrão.</p>
        </div>
        <form action={logout} className="relative z-10 mt-4">
          <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-200/65 transition hover:bg-white/[.055] hover:text-white"><LogOut size={17}/> Sair</button>
        </form>
      </aside>
      <main className="min-w-0 p-4 pb-24 md:p-8 lg:p-10">{children}</main>
      <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-2xl border border-slate-200/20 bg-[#1d2930]/96 p-2 text-slate-200 shadow-xl shadow-slate-950/20 backdrop-blur-xl md:hidden" aria-label="Navegação móvel">
        {nav.slice(0, 5).map(([Icon, label, href]) => <Link key={String(label)} href={String(href)} className="flex min-w-14 flex-col items-center gap-1 rounded-xl p-2 text-[10px] font-bold transition hover:bg-white/10 hover:text-[#9fcacc]"><Icon size={19}/>{String(label)}</Link>)}
      </nav>
    </div>
  );
}
