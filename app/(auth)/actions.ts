"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { emailSchema, loginSchema, registerSchema } from "@/lib/validators/auth";

const genericError = "/login?error=invalid";

export async function login(formData: FormData) {
  if (!hasSupabaseEnv()) redirect("/login?config=missing");
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect(genericError);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) redirect(genericError);
  redirect("/dashboard");
}

export async function register(formData: FormData) {
  if (!hasSupabaseEnv()) redirect("/register?config=missing");
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/register?error=invalid");
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  });
  if (error) redirect("/register?error=invalid");
  redirect("/login?message=check-email");
}

export async function forgotPassword(formData: FormData) {
  const email = emailSchema.safeParse(formData.get("email"));
  if (hasSupabaseEnv() && email.success) {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email.data, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });
  }
  redirect("/forgot-password?message=sent");
}

export async function logout() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
