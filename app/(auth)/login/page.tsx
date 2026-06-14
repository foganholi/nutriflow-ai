import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { login } from "@/app/(auth)/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Boas-vindas de volta" subtitle="Acesse sua rotina alimentar com segurança.">
      {params.config === "missing" && <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Configure as variáveis do Supabase para usar autenticação.</p>}
      {params.error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">Não foi possível entrar. Revise os dados e tente novamente.</p>}
      {params.message && <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Confira seu e-mail para continuar.</p>}
      <form action={login} className="space-y-4">
        <div><label className="label" htmlFor="email">E-mail</label><input className="input" id="email" name="email" type="email" autoComplete="email" required /></div>
        <div><div className="flex justify-between"><label className="label" htmlFor="password">Senha</label><Link className="text-sm font-bold text-emerald-700" href="/forgot-password">Esqueci a senha</Link></div><input className="input" id="password" name="password" type="password" autoComplete="current-password" required /></div>
        <button className="btn-primary w-full" type="submit">Entrar</button>
      </form>
      <p className="muted mt-6 text-center text-sm">Ainda não tem conta? <Link className="font-black text-emerald-700" href="/register">Criar conta</Link></p>
    </AuthShell>
  );
}
