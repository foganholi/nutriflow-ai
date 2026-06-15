import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-indigo-950/10 bg-white/30 py-10 backdrop-blur-xl dark:bg-indigo-950/10">
      <div className="container grid gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <Logo />
          <p className="muted mt-3 max-w-md text-sm">Ciência, segurança e praticidade para organizar sua alimentação.</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-semibold">
          <Link href="/privacy">Privacidade</Link>
          <Link href="/terms">Termos</Link>
          <Link href="/science">Fontes</Link>
          <a href="mailto:privacidade@nutriflow.ai">Contato</a>
        </div>
      </div>
    </footer>
  );
}
