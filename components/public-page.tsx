import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export function PublicPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <><SiteHeader/><main className="container min-h-[70vh] py-16"><p className="inline-flex rounded-full border border-indigo-200/60 bg-indigo-50/70 px-3 py-1.5 text-xs font-black uppercase tracking-[.2em] text-indigo-600 dark:border-indigo-700/40 dark:bg-indigo-950/40 dark:text-cyan-300">{eyebrow}</p><h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-.04em] md:text-6xl">{title}</h1><div className="mt-10">{children}</div></main><SiteFooter/></>;
}
