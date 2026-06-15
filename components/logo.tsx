import { Orbit } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5 font-black tracking-tight">
      <span className="relative grid size-10 place-items-center overflow-hidden rounded-[14px] bg-gradient-to-br from-violet-500 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-600/25">
        <span className="absolute inset-px rounded-[13px] border border-white/25" />
        <Orbit className="transition-transform duration-500 group-hover:rotate-90" size={21} aria-hidden="true" />
      </span>
      <span className="text-lg">NutriFlow <span className="text-gradient">AI</span></span>
    </Link>
  );
}
