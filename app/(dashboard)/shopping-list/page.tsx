import Link from "next/link";
import { Check, ShoppingBasket } from "lucide-react";
import { toggleShoppingItem } from "@/app/(dashboard)/actions";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUser } from "@/lib/auth";

const modes = [
  ["economic", "Econômica"],
  ["balanced", "Equilibrada"],
  ["premium", "Premium"],
] as const;

export default async function ShoppingListPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const selectedMode = modes.some(([mode]) => mode === params.mode) ? params.mode! : "balanced";
  const { supabase, user } = await requireUser();
  const { data: plan } = await supabase.from("meal_plans").select("id").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const { data: lists } = plan
    ? await supabase.from("shopping_lists").select("*").eq("meal_plan_id", plan.id)
    : { data: [] };
  const list = (lists ?? []).find((entry) => entry.budget_mode === selectedMode);
  const { data: items } = list
    ? await supabase.from("shopping_list_items").select("*").eq("shopping_list_id", list.id).order("category")
    : { data: [] };
  const categories = [...new Set((items ?? []).map((item) => item.category))];
  const purchasedCount = (items ?? []).filter((item) => item.purchased).length;

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-sm font-black text-emerald-600">SEMANA ORGANIZADA</p>
      <h1 className="mt-1 text-4xl font-black">Lista de compras</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {modes.map(([mode, label]) => <Link key={mode} href={`/shopping-list?mode=${mode}`} className={selectedMode === mode ? "btn-primary" : "btn-secondary"}>{label}</Link>)}
      </div>
      {list && <p className="muted mt-4">{purchasedCount} de {items?.length ?? 0} itens marcados · alterações salvas automaticamente.</p>}
      {categories.length ? (
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <section className="card p-5" key={category}>
              <div className="flex items-center gap-2"><ShoppingBasket className="text-emerald-600" size={19} /><h2 className="font-black">{category}</h2></div>
              <div className="mt-4 space-y-3">
                {(items ?? []).filter((item) => item.category === category).map((item) => (
                  <form action={toggleShoppingItem} key={item.id}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <input type="hidden" name="purchased" value={String(item.purchased)} />
                    <button className="flex w-full items-start gap-3 border-b border-emerald-950/5 pb-3 text-left text-sm">
                      <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded border ${item.purchased ? "border-emerald-600 bg-emerald-600 text-white" : "border-emerald-300"}`}>{item.purchased && <Check size={13} />}</span>
                      <span className={item.purchased ? "line-through opacity-60" : ""}><b>{item.item_name}</b><span className="muted block text-xs">{item.quantity}</span></span>
                    </button>
                  </form>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : <div className="mt-7"><EmptyState icon={ShoppingBasket} title="Sua lista aparecerá aqui" description="Gere um plano alimentar para criar as três versões automaticamente." /></div>}
    </div>
  );
}
