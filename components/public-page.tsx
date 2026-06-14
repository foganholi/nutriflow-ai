import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export function PublicPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <><SiteHeader/><main className="container min-h-[70vh] py-16"><p className="text-sm font-black uppercase tracking-[.2em] text-emerald-600">{eyebrow}</p><h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">{title}</h1><div className="mt-10">{children}</div></main><SiteFooter/></>;
}
