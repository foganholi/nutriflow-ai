import { Activity, Cpu, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { Disclaimer } from "@/components/disclaimer";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
      <section className="relative flex items-center justify-center overflow-hidden p-5 py-12">
        <div className="absolute left-[-8rem] top-[-8rem] size-80 rounded-full bg-violet-400/15 blur-3xl" />
        <div className="relative w-full max-w-md">
          <Logo />
          <h1 className="mt-10 text-4xl font-black tracking-[-.04em]">{title}</h1>
          <p className="muted mt-3">{subtitle}</p>
          <div className="glass mt-8 rounded-[24px] p-6">{children}</div>
        </div>
      </section>
      <aside className="tech-panel m-3 hidden rounded-[28px] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1.5 text-xs font-black uppercase tracking-[.18em] text-cyan-200"><Cpu size={15}/> Nutrição inteligente</div>
          <p className="mt-8 text-5xl font-black leading-[1.05] tracking-[-.05em]">Sua rotina.<br/>Seus dados.<br/><span className="bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">Um fluxo melhor.</span></p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[[Activity, "Rotina"], [Sparkles, "Plano"], [ShieldCheck, "Proteção"]].map(([Icon, label]) => <div className="rounded-2xl border border-white/10 bg-white/5 p-4" key={String(label)}><Icon className="text-cyan-300" size={20}/><p className="mt-3 text-xs font-bold text-indigo-100/70">{String(label)}</p></div>)}
          </div>
        </div>
        <div className="relative z-10"><Disclaimer compact inverse /></div>
      </aside>
    </main>
  );
}
