import { jsPDF } from "jspdf";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  const { supabase, user } = await requireUser();
  const { data: plan } = await supabase.from("meal_plans").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (!plan) return NextResponse.json({ error: "Nenhum plano disponível." }, { status: 404 });
  const { data: items } = await supabase.from("meal_items").select("*").eq("meal_plan_id", plan.id).order("created_at");

  const pdf = new jsPDF();
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text("NutriFlow AI - Plano alimentar", 18, 20);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("Estimativas educacionais. Não substituem avaliação profissional.", 18, 28);
  pdf.setFontSize(12);
  pdf.text(`Energia: ${plan.total_calories} kcal`, 18, 40);
  pdf.text(`Macros: ${plan.protein_g}g proteína | ${plan.carbs_g}g carboidratos | ${plan.fat_g}g gorduras`, 18, 47);

  let y = 60;
  for (const item of items ?? []) {
    if (y > 270) { pdf.addPage(); y = 20; }
    pdf.setFont("helvetica", "bold");
    pdf.text(String(item.meal_name).slice(0, 60), 18, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${String(item.food_name).slice(0, 70)} - ${String(item.quantity).slice(0, 40)} (${item.calories ?? 0} kcal)`, 24, y + 7);
    y += 17;
  }
  if (plan.safety_notes) {
    if (y > 240) { pdf.addPage(); y = 20; }
    pdf.setFont("helvetica", "bold");
    pdf.text("Avisos de segurança", 18, y);
    pdf.setFont("helvetica", "normal");
    const lines = pdf.splitTextToSize(String(plan.safety_notes), 170);
    pdf.text(lines, 18, y + 7);
  }

  const bytes = pdf.output("arraybuffer");
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="plano-nutriflow-${new Date().toISOString().slice(0, 10)}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
