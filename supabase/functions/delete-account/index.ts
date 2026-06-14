import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "npm:@supabase/server";

const handler = {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    const userId = String(ctx.jwtClaims?.sub ?? "");
    if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

    const { error } = await ctx.supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) return Response.json({ error: "delete_failed" }, { status: 500 });

    return Response.json({ deleted: true });
  }),
};

export default handler;
