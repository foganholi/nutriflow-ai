import { OnboardingForm } from "@/components/onboarding-form";
import { Disclaimer } from "@/components/disclaimer";

export default function OnboardingPage() {
  return <div className="mx-auto max-w-4xl"><p className="text-sm font-black text-emerald-600">PERFIL NUTRICIONAL</p><h1 className="mt-2 text-4xl font-black">Vamos adaptar o NutriFlow a você</h1><p className="muted mb-7 mt-3">Compartilhe apenas o necessário. Você poderá alterar ou excluir esses dados.</p><OnboardingForm/><div className="mx-auto mt-5 max-w-3xl"><Disclaimer compact/></div></div>;
}
