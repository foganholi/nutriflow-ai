import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

const protectedRoutes = ["/dashboard", "/onboarding", "/meal-plan", "/shopping-list", "/progress", "/habits", "/settings", "/admin"];

export async function updateSession(request: NextRequest) {
  const isProtected = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  const demo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (!hasSupabaseEnv()) {
    if (isProtected && !demo) return NextResponse.redirect(new URL("/login?config=missing", request.url));
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  if (isProtected && !signedIn) return NextResponse.redirect(new URL("/login?next=" + encodeURIComponent(request.nextUrl.pathname), request.url));

  if (request.nextUrl.pathname.startsWith("/admin") && signedIn) {
    const { data: profile } = await supabase.from("profiles").select("role").single();
    if (profile?.role !== "admin") return NextResponse.redirect(new URL("/dashboard?error=forbidden", request.url));
  }
  return response;
}
