import { Download, KeyRound, LogOut, ShieldOff, Trash2 } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { deleteAccount, requestPasswordChange, revokeNutritionConsent } from "@/app/(dashboard)/actions";
import { requireUser } from "@/lib/auth";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase.from("profiles").select("full_name,consent_lgpd,consent_at").eq("id", user.id).single();

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-black text-emerald-600">CONTA E PRIVACIDADE</p>
      <h1 className="mt-1 text-4xl font-black">Configurações</h1>
      <div className="card mt-7 p-5"><p className="font-black">{profile?.full_name}</p><p className="muted text-sm">{user.email}</p><p className="muted mt-2 text-xs">Consentimento nutricional: {profile?.consent_lgpd ? `ativo desde ${new Date(profile.consent_at).toLocaleDateString("pt-BR")}` : "revogado"}</p></div>
      {params.password && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">Se o e-mail estiver apto, as instruções de senha foram enviadas.</p>}
      {params.consent && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">Consentimento revogado. Você pode excluir os dados ou consentir novamente no onboarding.</p>}
      {params.delete === "error" && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-900">Não foi possível excluir a conta agora. Tente novamente.</p>}
      <div className="mt-5 space-y-3">
        <form action={requestPasswordChange}><button className="card flex w-full items-center gap-4 p-5 text-left"><span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950"><KeyRound /></span><span className="flex-1"><b>Alterar senha</b><span className="muted block text-sm">Receba um link seguro por e-mail</span></span></button></form>
        <a href="/api/export/data" className="card flex w-full items-center gap-4 p-5 text-left"><span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950"><Download /></span><span className="flex-1"><b>Exportar meus dados</b><span className="muted block text-sm">Baixe os seus registros em JSON</span></span></a>
        {profile?.consent_lgpd && <form action={revokeNutritionConsent}><button className="card flex w-full items-center gap-4 p-5 text-left"><span className="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-700"><ShieldOff /></span><span className="flex-1"><b>Revogar consentimento</b><span className="muted block text-sm">Interrompe novos tratamentos nutricionais até novo consentimento</span></span></button></form>}
        <form action={deleteAccount}><button className="card flex w-full items-center gap-4 p-5 text-left"><span className="grid size-11 place-items-center rounded-xl bg-red-50 text-red-700"><Trash2 /></span><span className="flex-1"><b>Excluir minha conta</b><span className="muted block text-sm">Exclusão permanente dos dados vinculados</span></span></button></form>
      </div>
      <form action={logout}><button className="btn-secondary mt-5"><LogOut size={17} /> Sair da conta</button></form>
    </div>
  );
}
