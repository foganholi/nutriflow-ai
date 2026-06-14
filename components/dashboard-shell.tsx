import Link from "next/link";
import { BarChart3, BookOpen, Home, ListChecks, LogOut, Settings, ShoppingBasket, Shield, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { logout } from "@/app/(auth)/actions";

const nav = [
  [Home, "Visão geral", "/dashboard"],
  [Sparkles, "Plano alimentar", "/meal-plan"],
  [ShoppingBasket, "Lista de compras", "/shopping-list"],
  [BarChart3, "Progresso", "/progress"],
  [ListChecks, "Hábitos", "/habits"],
  [BookOpen, "Conteúdo", "/education"],
  [Settings, "Configurações", "/settings"],
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-emerald-950/10 bg-white/70 p-5 dark:bg-[#0d1915] md:block">
        <Logo />
        <nav className="mt-10 space-y-1" aria-label="Dashboard">
          {nav.map(([Icon, label, href]) => <Link key={String(label)} href={String(href)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-emerald-950"><Icon size={18}/>{String(label)}</Link>)}
        </nav>
        <div className="mt-8 rounded-2xl bg-emerald-950 p-4 text-white"><Shield size={20} className="text-emerald-300"/><p className="mt-2 text-sm font-black">Seus dados, suas regras.</p><p className="mt-1 text-xs text-emerald-100/70">RLS e privacidade por padrão.</p></div>
        <form action={logout} className="mt-5"><button className="flex items-center gap-2 px-3 text-sm font-bold"><LogOut size={17}/> Sair</button></form>
      </aside>
      <main className="min-w-0 p-4 pb-24 md:p-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t bg-white p-2 dark:bg-[#0d1915] md:hidden" aria-label="Navegação móvel">
        {nav.slice(0,5).map(([Icon, label, href]) => <Link key={String(label)} href={String(href)} className="flex flex-col items-center gap-1 p-2 text-[10px] font-bold"><Icon size={19}/>{String(label)}</Link>)}
      </nav>
    </div>
  );
}
