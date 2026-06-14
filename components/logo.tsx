import { Leaf } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
      <span className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
        <Leaf size={19} aria-hidden="true" />
      </span>
      <span>NutriFlow <span className="text-emerald-600">AI</span></span>
    </Link>
  );
}
