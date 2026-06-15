import { Orbit } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5 font-black tracking-tight">
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-[13px] bg-[#346f82] text-white shadow-md shadow-slate-900/10">
        <span className="absolute inset-px rounded-[13px] border border-white/25" />
        <Orbit className="transition-transform duration-500 group-hover:rotate-90" size={21} aria-hidden="true" />
      </span>
      <span className="text-lg">NutriFlow <span className="text-[#4b8990]">AI</span></span>
    </Link>
  );
}
