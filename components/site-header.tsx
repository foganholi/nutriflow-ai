import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/8 bg-[#f8f9f6]/90 backdrop-blur-xl dark:bg-[#151b1e]/90">
      <div className="container flex h-18 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Principal">
          <Link href="/#beneficios">Benefícios</Link>
          <Link href="/science">Ciência</Link>
          <Link href="/pricing">Planos</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link className="hidden rounded-xl px-3 py-2 text-sm font-bold transition hover:bg-slate-200/60 sm:inline dark:hover:bg-slate-700/40" href="/login">Entrar</Link>
          <Link className="btn-primary !px-4 !py-2.5 text-sm" href="/register">Começar agora</Link>
        </div>
      </div>
    </header>
  );
}
