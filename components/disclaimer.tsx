import { ShieldCheck } from "lucide-react";

export function Disclaimer({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-indigo-500/8 to-cyan-400/8 ${inverse ? "text-indigo-100" : "text-indigo-950 dark:border-cyan-300/15 dark:text-indigo-100"} ${compact ? "p-3 text-xs" : "p-4 text-sm"}`}>
      <ShieldCheck className="mt-0.5 shrink-0 text-cyan-500" size={18} aria-hidden="true" />
      <p>Este aplicativo oferece estimativas e apoio educacional. Não substitui nutricionista, médico ou outro profissional de saúde. Casos clínicos e necessidades específicas exigem orientação profissional.</p>
    </div>
  );
}
