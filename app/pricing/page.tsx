import Link from "next/link";
import { Check, Clock3 } from "lucide-react";
import { PublicPage } from "@/components/public-page";

const plans = [
  { name: "Gratuito", price: "R$ 0", description: "Para começar a organizar a rotina.", features: ["Onboarding completo", "1 plano alimentar por semana", "3 versões da lista de compras", "Progresso e hábitos", "Biblioteca e conteúdo"] },
  { name: "Premium", price: "R$ 14,90/mês", description: "Estrutura preparada para a próxima fase.", features: ["Planos ilimitados", "PDF e substituições", "Histórico e gráficos completos", "Modo econômico e rotina corrida", "Receitas e lembretes"] },
  { name: "Profissional", price: "Em breve", description: "Futuro produto para nutricionistas.", features: ["Gestão de pacientes", "Convites e consentimento", "Relatórios profissionais", "Dashboard de acompanhamento", "Assinatura mensal"] },
];

export default function PricingPage() {
  return (
    <PublicPage eyebrow="Planos transparentes" title="Comece gratuitamente. Evolua quando fizer sentido.">
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, index) => (
          <article className={`card flex flex-col p-6 ${index === 1 ? "ring-2 ring-emerald-500" : ""}`} key={plan.name}>
            {index === 1 && <span className="pill self-start rounded-full px-3 py-1 text-xs font-black">PRÓXIMA FASE</span>}
            <h2 className="mt-4 text-2xl font-black">{plan.name}</h2><p className="mt-2 text-xl font-black text-emerald-600">{plan.price}</p><p className="muted mt-2 text-sm">{plan.description}</p>
            <div className="mt-6 flex-1 space-y-3">{plan.features.map((feature) => <p className="flex gap-2 text-sm" key={feature}><Check size={17} className="shrink-0 text-emerald-600" />{feature}</p>)}</div>
            <Link className={index === 0 ? "btn-primary mt-7 w-full" : "btn-secondary mt-7 w-full"} href={index === 0 ? "/register" : "#future"}>{index === 0 ? "Começar grátis" : "Em planejamento"}</Link>
          </article>
        ))}
      </div>
      <div id="future" className="mt-6 flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-950"><Clock3 className="shrink-0" size={20} /><p>Pagamentos não estão ativos. A tabela `subscriptions` e as regras de plano já estão prontas para integração futura com Mercado Pago, Stripe ou Asaas.</p></div>
    </PublicPage>
  );
}
