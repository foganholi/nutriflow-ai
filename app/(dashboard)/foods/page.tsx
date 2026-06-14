import { Heart } from "lucide-react";
import { toggleFavoriteFood } from "@/app/(dashboard)/actions";
import { requireUser } from "@/lib/auth";

export default async function FoodsPage() {
  const { supabase, user } = await requireUser();
  const [{ data: foods }, { data: favorites }] = await Promise.all([
    supabase.from("food_database").select("*").order("name"),
    supabase.from("favorite_foods").select("food_name").eq("user_id", user.id),
  ]);
  const favoriteNames = new Set((favorites ?? []).map((item) => item.food_name));

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-black text-emerald-600">BIBLIOTECA</p>
      <h1 className="mt-1 text-4xl font-black">Alimentos brasileiros</h1>
      <p className="muted mt-2">Valores aproximados por 100 g. Consulte a fonte original para uso técnico.</p>
      <div className="card mt-7 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-emerald-950 text-white"><tr>{["Alimento", "Categoria", "kcal", "Proteína", "Carboidrato", "Gordura", "Fibra", ""].map((heading) => <th key={heading} className="p-4">{heading}</th>)}</tr></thead>
          <tbody>{(foods ?? []).map((food) => (
            <tr key={food.id} className="border-b border-emerald-950/5">
              <td className="p-4 font-black">{food.name}</td><td className="p-4">{food.category}</td><td className="p-4">{food.calories}</td><td className="p-4">{food.protein_g} g</td><td className="p-4">{food.carbs_g} g</td><td className="p-4">{food.fat_g} g</td><td className="p-4">{food.fiber_g} g</td>
              <td className="p-4"><form action={toggleFavoriteFood}><input type="hidden" name="foodName" value={food.name} /><button aria-label={`${favoriteNames.has(food.name) ? "Remover" : "Adicionar"} ${food.name} dos favoritos`}><Heart size={18} className={favoriteNames.has(food.name) ? "fill-red-500 text-red-500" : ""} /></button></form></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
