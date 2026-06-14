import { ExternalLink } from "lucide-react";
import { PublicPage } from "@/components/public-page";
import { createClient } from "@/lib/supabase/server";

export default async function SciencePage() {
  const supabase = await createClient();
  const { data: sources } = await supabase.from("scientific_sources").select("*").eq("active", true).order("organization");
  return (
    <PublicPage eyebrow="Transparência" title="As referências por trás das orientações educacionais.">
      <div className="grid gap-4 md:grid-cols-2">
        {(sources ?? []).map((source) => (
          <article className="card p-6" key={source.id}>
            <p className="text-xs font-black text-emerald-600">{source.organization}</p>
            <h2 className="mt-2 text-xl font-black">{source.title}</h2>
            <p className="muted mt-3 text-sm leading-6">{source.summary}</p>
            {source.usage_notes && <p className="mt-3 text-xs"><b>Uso no app:</b> {source.usage_notes}</p>}
            <a className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-600" href={source.url} target="_blank" rel="noreferrer">Abrir fonte oficial <ExternalLink size={15} /></a>
          </article>
        ))}
      </div>
    </PublicPage>
  );
}
