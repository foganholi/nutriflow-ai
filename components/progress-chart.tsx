"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "01/05", weight: 72.8, waist: 84 },
  { date: "08/05", weight: 72.2, waist: 83.5 },
  { date: "15/05", weight: 71.9, waist: 83 },
  { date: "22/05", weight: 71.4, waist: 82.5 },
  { date: "29/05", weight: 71.1, waist: 82 },
  { date: "05/06", weight: 70.8, waist: 81.8 },
];

export function ProgressChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-72 w-full animate-pulse rounded-xl bg-emerald-50 dark:bg-emerald-950/30" aria-label="Carregando gráfico" />;
  return <div className="h-72 w-full" aria-label="Gráfico de evolução de peso"><ResponsiveContainer minWidth={1} minHeight={1}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" opacity={.25}/><XAxis dataKey="date" fontSize={12}/><YAxis domain={["dataMin - 1","dataMax + 1"]} fontSize={12}/><Tooltip/><Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={3} dot={{r:4}} name="Peso (kg)"/></LineChart></ResponsiveContainer></div>;
}
