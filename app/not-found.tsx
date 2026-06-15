import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return <main className="container grid min-h-screen place-items-center text-center"><div><SearchX className="mx-auto text-emerald-600" size={48} /><h1 className="mt-5 text-4xl font-black">Página não encontrada</h1><p className="muted mt-3">O endereço pode ter mudado ou não existir.</p><Link className="btn-primary mt-6" href="/">Voltar ao início</Link></div></main>;
}
