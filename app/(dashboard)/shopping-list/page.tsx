import { Check, ShoppingBasket } from "lucide-react";
import { requireUser } from "@/lib/auth";

export default async function ShoppingListPage() {
  const { supabase, user } = await requireUser();
  const { data: list } = await supabase.from("shopping_lists").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const { data: items } = list
    ? await supabase.from("shopping_list_items").select("*").eq("shopping_list_id", list.id).order("category")
    : { data: [] };
  const categories = [...new Set((items ?? []).map((item) => item.category))];

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-black text-emerald-600">SEMANA ORGANIZADA</p>
      <h1 className="mt-1 text-4xl font-black">Lista de compras</h1>
      {list && <p className="muted mt-2">Modo {list.budget_mode === "economic" ? "econômico" : list.budget_mode === "premium" ? "premium" : "equilibrado"} · gerada com seu plano mais recente.</p>}
      {categories.length ? (
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <section className="card p-5" key={category}>
              <div className="flex items-center gap-2"><ShoppingBasket className="text-emerald-600" size={19} /><h2 className="font-black">{category}</h2></div>
              <div className="mt-4 space-y-3">
                {(items ?? []).filter((item) => item.category === category).map((item) => (
                  <label key={item.id} className="flex items-start gap-3 border-b border-emerald-950/5 pb-3 text-sm">
                    <input type="checkbox" className="mt-0.5 size-5 accent-emerald-600" />
                    <span><b>{item.item_name}</b><span className="muted block text-xs">{item.quantity}</span></span>
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : <div className="card mt-7 p-8 text-center"><Check className="mx-auto text-emerald-600" /><h2 className="mt-3 text-xl font-black">Sua lista aparecerá aqui</h2><p className="muted mt-2">Gere um plano alimentar para criar a lista automaticamente.</p></div>}
    </div>
  );
}
