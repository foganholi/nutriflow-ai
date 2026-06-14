import { Check, ShoppingBasket } from "lucide-react";
import { demoPlan } from "@/lib/demo-data";
import { generateShoppingList } from "@/lib/nutrition-engine";

export default function ShoppingListPage() {
  const list = generateShoppingList(demoPlan);
  return <div className="mx-auto max-w-4xl"><p className="text-sm font-black text-emerald-600">SEMANA ORGANIZADA</p><h1 className="mt-1 text-4xl font-black">Lista de compras</h1><div className="mt-5 flex flex-wrap gap-2">{["Econômica","Equilibrada","Premium"].map((m,i)=><button key={m} className={i===0?"btn-primary":"btn-secondary"}>{m}</button>)}</div><div className="mt-7 grid gap-4 md:grid-cols-2">{["Proteínas","Frutas","Outros"].map(cat=><section className="card p-5" key={cat}><div className="flex items-center gap-2"><ShoppingBasket className="text-emerald-600" size={19}/><h2 className="font-black">{cat}</h2></div><div className="mt-4 space-y-3">{list.filter(x=>x.category===cat).map((item,i)=><label key={i} className="flex items-start gap-3 border-b border-emerald-950/5 pb-3 text-sm"><span className="grid size-5 shrink-0 place-items-center rounded border border-emerald-300"><Check size={13}/></span><span><b>{item.name}</b><span className="muted block text-xs">{item.quantity}</span></span></label>)}</div></section>)}</div></div>;
}
