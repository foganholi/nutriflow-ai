import { AuthShell } from "@/components/auth-shell";
import { updatePassword } from "@/app/(auth)/actions";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  return (
    <AuthShell title="Defina uma nova senha" subtitle="Use uma senha exclusiva e difícil de adivinhar.">
      {params.error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-900">A senha não atende aos requisitos ou o link expirou.</p>}
      <form action={updatePassword} className="space-y-4">
        <label><span className="label">Nova senha</span><input className="input" name="password" type="password" minLength={10} maxLength={72} autoComplete="new-password" required /></label>
        <p className="muted text-xs">Use 10 ou mais caracteres, com maiúscula, minúscula e número.</p>
        <button className="btn-primary w-full">Atualizar senha</button>
      </form>
    </AuthShell>
  );
}
