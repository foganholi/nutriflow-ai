import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { register } from "@/app/(auth)/actions";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Crie sua conta" subtitle="Comece gratuitamente. Seus dados permanecem sob seu controle.">
      {(params.error || params.config) && <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{params.config ? "Configure o Supabase para concluir o cadastro." : "Não foi possível cadastrar. Revise todos os campos."}</p>}
      <form action={register} className="space-y-4">
        <div><label className="label" htmlFor="name">Nome</label><input className="input" id="name" name="name" autoComplete="name" minLength={2} maxLength={100} required /></div>
        <div><label className="label" htmlFor="email">E-mail</label><input className="input" id="email" name="email" type="email" autoComplete="email" required /></div>
        <div><label className="label" htmlFor="password">Senha</label><input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={10} maxLength={72} required /><p className="muted mt-1 text-xs">10+ caracteres, com maiúscula, minúscula e número.</p></div>
        <div className="space-y-3 text-sm">
          <label className="flex gap-2"><input name="terms" type="checkbox" required/> Aceito os <Link className="font-bold underline" href="/terms">termos de uso</Link>.</label>
          <label className="flex gap-2"><input name="privacy" type="checkbox" required/> Li a <Link className="font-bold underline" href="/privacy">política de privacidade</Link>.</label>
          <label className="flex gap-2"><input name="consent" type="checkbox" required/> Autorizo o uso dos dados nutricionais para gerar estimativas personalizadas.</label>
        </div>
        <button className="btn-primary w-full" type="submit">Criar conta gratuita</button>
      </form>
    </AuthShell>
  );
}
