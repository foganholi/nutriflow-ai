import { Heart } from "lucide-react";
import { foods } from "@/lib/demo-data";

export default function FoodsPage() {
  return <div className="mx-auto max-w-6xl"><p className="text-sm font-black text-emerald-600">BIBLIOTECA</p><h1 className="mt-1 text-4xl font-black">Alimentos brasileiros</h1><p className="muted mt-2">Valores aproximados por 100 g. Consulte a fonte original para uso técnico.</p><div className="card mt-7 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-emerald-950 text-white"><tr>{["Alimento","Categoria","kcal","Proteína","Carboidrato","Gordura","Fibra",""].map(h=><th key={h} className="p-4">{h}</th>)}</tr></thead><tbody>{foods.map(f=><tr key={f[0]} className="border-b border-emerald-950/5"><td className="p-4 font-black">{f[0]}</td>{f.slice(1).map((v,i)=><td className="p-4" key={i}>{i>0?`${v}${i===1?"":" g"}`:v}</td>)}<td className="p-4"><button aria-label={`Favoritar ${f[0]}`}><Heart size={17}/></button></td></tr>)}</tbody></table></div></div>;
}
