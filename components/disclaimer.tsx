import { ShieldCheck } from "lucide-react";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100 ${compact ? "p-3 text-xs" : "p-4 text-sm"}`}>
      <ShieldCheck className="mt-0.5 shrink-0 text-blue-600" size={18} aria-hidden="true" />
      <p>
        Este aplicativo oferece estimativas e apoio educacional. Não substitui nutricionista,
        médico ou outro profissional de saúde. Casos clínicos e necessidades específicas exigem orientação profissional.
      </p>
    </div>
  );
}
