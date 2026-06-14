import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const { supabase, user } = await requireUser();
  const tables = [
    "profiles",
    "nutrition_preferences",
    "meal_plans",
    "meal_items",
    "shopping_lists",
    "shopping_list_items",
    "progress_logs",
    "habits",
    "habit_logs",
    "favorite_foods",
    "subscriptions",
  ] as const;
  const entries = await Promise.all(tables.map(async (table) => {
    const query = supabase.from(table).select("*");
    const { data, error } = table === "profiles"
      ? await query.eq("id", user.id)
      : await query.eq("user_id", user.id);
    return [table, error ? [] : data] as const;
  }));

  return NextResponse.json({
    exported_at: new Date().toISOString(),
    user_id: user.id,
    data: Object.fromEntries(entries),
  }, {
    headers: {
      "Content-Disposition": `attachment; filename="nutriflow-dados-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
