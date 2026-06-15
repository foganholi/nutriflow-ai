import Link from "next/link";
import { ArrowRight, BadgeCheck, BrainCircuit, Check, Clock3, Coins, DatabaseZap, ListChecks, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Disclaimer } from "@/components/disclaimer";
import { LandingDashboard } from "@/components/landing-dashboard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const benefits = [
  [BrainCircuit, "Plano personalizado", "Estimativas adaptadas à sua rotina, objetivo, preferências e orçamento."],
  [ListChecks, "Tudo organizado", "Plano diário, substituições, hábitos e lista de compras em um só lugar."],
  [ShieldCheck, "Segurança primeiro", "Limites conservadores, alertas responsáveis e privacidade desde o design."],
  [Coins, "Comida que cabe no bolso", "Modo econômico com alimentos brasileiros simples e acessíveis."],
  [Clock3, "Feito para sua rotina", "Opções rápidas, marmitas e preparos compatíveis com seu tempo."],
  [Sparkles, "Evolução sem julgamento", "Acompanhe peso, medidas, energia e consistência com linguagem cuidadosa."],
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="grid-pattern overflow-hidden pb-24 pt-16 md:pb-32 md:pt-24">
          <div className="container relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
            <div className="relative">
              <span className="pill relative inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold"><BadgeCheck size={14}/> NUTRITION INTELLIGENCE PLATFORM</span>
              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.03] tracking-[-.05em] md:text-7xl">
                Sua alimentação em um <span className="text-gradient">novo sistema.</span>
              </h1>
              <p className="muted mt-6 max-w-2xl text-lg leading-8 md:text-xl">
                Uma central inteligente para transformar seus dados, preferências e rotina em um plano alimentar claro, adaptável e seguro.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary" href="/register">Criar meu plano <ArrowRight size={17}/></Link>
                <Link className="btn-secondary" href="/#como-funciona">Ver como funciona</Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                {["Sem cartão", "Plano gratuito", "Privacidade por padrão"].map((item) => <span key={item} className="flex items-center gap-1.5"><Check className="text-emerald-600" size={16}/>{item}</span>)}
              </div>
              <div className="mt-8 grid max-w-xl grid-cols-3 gap-2">
                {[[Zap, "Motor", "Adaptativo"], [DatabaseZap, "Dados", "Protegidos"], [BrainCircuit, "Insights", "Práticos"]].map(([Icon, label, value]) => <div className="rounded-2xl border border-slate-900/8 bg-white/45 p-3 dark:border-white/10 dark:bg-white/5" key={String(label)}><Icon className="text-[#4b8990]" size={17}/><p className="mt-2 text-[10px] font-black uppercase tracking-wider text-[#52727a]">{String(label)}</p><p className="text-xs font-bold">{String(value)}</p></div>)}
              </div>
            </div>
            <LandingDashboard />
          </div>
        </section>

        <section id="beneficios" className="py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center"><p className="text-sm font-black uppercase tracking-[.2em] text-[#346f82]">Inteligência aplicada à rotina</p><h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Tecnologia útil, sem perder o lado humano</h2></div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map(([Icon, title, text]) => (
                <article key={String(title)} className="card p-6 transition hover:-translate-y-1 hover:shadow-xl">
                  <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-[#e7efee] text-[#346f82] dark:bg-[#263438] dark:text-[#8fc2c4]"><Icon size={21}/></span>
                  <h3 className="text-lg font-black">{String(title)}</h3><p className="muted mt-2 text-sm leading-6">{String(text)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="tech-panel rounded-none border-x-0 py-24 text-white">
          <div className="container relative z-10"><p className="text-sm font-black uppercase tracking-[.2em] text-[#9fcacc]">Como funciona</p><h2 className="mt-3 text-4xl font-black">Do dado à ação em três etapas</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                ["01", "Conte sua rotina", "Informe objetivo, preferências, restrições, tempo e orçamento."],
                ["02", "Receba seu plano", "O motor aplica regras nutricionais conservadoras e cria opções realistas."],
                ["03", "Acompanhe e ajuste", "Registre hábitos e evolução. Recalcule quando sua rotina mudar."],
              ].map(([n,t,d]) => <div className="rounded-2xl border border-white/10 bg-white/[.035] p-6" key={n}><span className="text-5xl font-black text-[#8fc2c4]">{n}</span><h3 className="mt-3 text-xl font-black">{t}</h3><p className="mt-2 leading-7 text-slate-200/70">{d}</p></div>)}
            </div>
          </div>
        </section>

        <section className="py-24"><div className="container grid gap-8 lg:grid-cols-2">
          <div><p className="text-sm font-black uppercase tracking-[.2em] text-emerald-600">Base científica</p><h2 className="mt-3 text-4xl font-black">Informação confiável, sem promessas milagrosas.</h2><p className="muted mt-5 leading-7">As orientações educacionais usam referências públicas reconhecidas, como o Guia Alimentar para a População Brasileira, OMS, NHS e USDA.</p><Link className="btn-secondary mt-7" href="/science">Conhecer as fontes <ArrowRight size={17}/></Link></div>
          <Disclaimer />
        </div></section>

        <section className="pb-24">
          <div className="container grid gap-5 lg:grid-cols-2">
            <article className="tech-panel rounded-[28px] p-8 text-white">
              <div className="relative z-10"><ShieldCheck className="text-[#9fcacc]" size={30} />
              <p className="mt-6 text-sm font-black uppercase tracking-[.2em] text-[#9fcacc]">Privacidade como produto</p>
              <h2 className="mt-3 text-3xl font-black">Seus dados não são parte do cardápio.</h2>
              <p className="mt-4 leading-7 text-white/70">Acesso isolado por usuário, RLS no PostgreSQL, exportação, revogação de consentimento e exclusão de conta.</p>
              <Link className="btn-secondary mt-6" href="/privacy">Como protegemos seus dados</Link></div>
            </article>
            <article className="card p-8">
              <p className="text-sm font-black uppercase tracking-[.2em] text-emerald-600">Freemium transparente</p>
              <h2 className="mt-3 text-3xl font-black">Comece grátis. Evolua quando precisar.</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950/40"><p className="text-sm font-black">Gratuito</p><p className="mt-1 text-2xl font-black">R$ 0</p><p className="muted mt-2 text-xs">Um plano semanal, compras, progresso e biblioteca.</p></div>
                <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/40"><p className="text-sm font-black">Premium futuro</p><p className="mt-1 text-2xl font-black">R$ 14,90</p><p className="muted mt-2 text-xs">Planos ilimitados, PDF, histórico e modos avançados.</p></div>
              </div>
              <Link className="btn-primary mt-6" href="/pricing">Comparar planos <ArrowRight size={17} /></Link>
            </article>
          </div>
        </section>

        <section id="faq" className="pb-24"><div className="container max-w-3xl"><h2 className="text-center text-4xl font-black">Perguntas frequentes</h2><div className="mt-10 space-y-3">
          {[
            ["O NutriFlow substitui um nutricionista?", "Não. O produto organiza informações e oferece estimativas educacionais. Avaliação clínica e prescrição individual são atividades profissionais."],
            ["É possível usar com restrições alimentares?", "Sim, preferências e restrições filtram sugestões. Alergias graves e condições clínicas exigem validação profissional."],
            ["Meus dados ficam protegidos?", "O projeto usa autenticação, RLS por usuário, coleta mínima, exportação e exclusão de dados."],
          ].map(([q,a]) => <details key={q} className="card p-5"><summary className="cursor-pointer font-black">{q}</summary><p className="muted mt-3 text-sm leading-6">{a}</p></details>)}
        </div></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
