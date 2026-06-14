import { AuthShell } from "@/components/auth-shell";
import { forgotPassword } from "@/app/(auth)/actions";

export default async function ForgotPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Recuperar senha" subtitle="Enviaremos instruções caso exista uma conta para o e-mail informado.">
      {params.message && <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">Se o e-mail estiver cadastrado, você receberá as instruções.</p>}
      <form action={forgotPassword} className="space-y-4">
        <div><label className="label" htmlFor="email">E-mail</label><input className="input" id="email" name="email" type="email" required /></div>
        <button className="btn-primary w-full">Enviar instruções</button>
      </form>
    </AuthShell>
  );
}
