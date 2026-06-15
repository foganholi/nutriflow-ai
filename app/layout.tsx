import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "NutriFlow AI", template: "%s | NutriFlow AI" },
  description: "Organize sua alimentação com ciência, segurança e praticidade.",
  openGraph: {
    title: "NutriFlow AI",
    description: "Planejamento alimentar e acompanhamento de hábitos com segurança.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
