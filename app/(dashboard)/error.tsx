"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function DashboardError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-xl place-items-center text-center">
      <div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-red-50 text-red-700"><AlertTriangle /></span><h1 className="mt-5 text-3xl font-black">Não foi possível carregar esta área</h1><p className="muted mt-3">Tente novamente. Se o problema continuar, encerre e refaça o login.</p><button className="btn-primary mt-6" onClick={reset}><RotateCcw size={17} /> Tentar novamente</button></div>
    </div>
  );
}
