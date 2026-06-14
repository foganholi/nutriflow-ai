import { Logo } from "@/components/logo";
import { Disclaimer } from "@/components/disclaimer";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center p-5 py-12">
        <div className="w-full max-w-md">
          <Logo />
          <h1 className="mt-10 text-4xl font-black tracking-tight">{title}</h1>
          <p className="muted mt-3">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
      <aside className="hidden bg-emerald-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <p className="text-5xl font-black leading-tight">Organize melhor.<br/><span className="text-emerald-300">Viva com mais clareza.</span></p>
        <Disclaimer compact />
      </aside>
    </main>
  );
}
