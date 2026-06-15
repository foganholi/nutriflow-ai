"use client";

import { useSyncExternalStore } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Point = { date: string; weight: number; waist?: number | null };

export function ProgressChart({ data }: { data: Point[] }) {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  if (!mounted) return <div className="h-72 w-full animate-pulse rounded-xl bg-indigo-50 dark:bg-indigo-950/30" aria-label="Carregando gráfico" />;
  if (!data.length) return <div className="grid h-72 place-items-center rounded-xl border border-dashed border-indigo-200"><p className="muted text-sm">Registre seu primeiro progresso para visualizar o gráfico.</p></div>;
  return (
    <div className="h-72 w-full" aria-label="Gráfico de evolução de peso">
      <ResponsiveContainer minWidth={1} minHeight={1}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis domain={["dataMin - 1", "dataMax + 1"]} fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="weight" stroke="#346f82" strokeWidth={3} dot={{ r: 4, fill: "#78aeb2" }} name="Peso (kg)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
