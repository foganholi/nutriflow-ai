import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "npm:@supabase/server";

const handler = {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    const { data: profile } = await ctx.supabase.from("profiles").select("role").single();
    if (profile?.role !== "admin") return Response.json({ error: "forbidden" }, { status: 403 });

    const [users, plans, progress, foods, sources] = await Promise.all([
      ctx.supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      ctx.supabaseAdmin.from("meal_plans").select("id", { count: "exact", head: true }),
      ctx.supabaseAdmin.from("progress_logs").select("id", { count: "exact", head: true }),
      ctx.supabaseAdmin.from("food_database").select("id", { count: "exact", head: true }),
      ctx.supabaseAdmin.from("scientific_sources").select("id", { count: "exact", head: true }),
    ]);

    return Response.json({
      users: users.count ?? 0,
      meal_plans: plans.count ?? 0,
      progress_logs: progress.count ?? 0,
      foods: foods.count ?? 0,
      scientific_sources: sources.count ?? 0,
    });
  }),
};

export default handler;
