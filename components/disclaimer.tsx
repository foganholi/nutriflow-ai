import { ShieldCheck } from "lucide-react";

export function Disclaimer({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-2xl border ${inverse ? "border-white/12 bg-white/[.035] text-slate-100" : "border-[#cedcda] bg-[#edf3f2] text-slate-800 dark:border-white/10 dark:bg-white/[.035] dark:text-slate-100"} ${compact ? "p-3 text-xs" : "p-4 text-sm"}`}>
      <ShieldCheck className="mt-0.5 shrink-0 text-[#4b8990]" size={18} aria-hidden="true" />
      <p>Este aplicativo oferece estimativas e apoio educacional. Não substitui nutricionista, médico ou outro profissional de saúde. Casos clínicos e necessidades específicas exigem orientação profissional.</p>
    </div>
  );
}
