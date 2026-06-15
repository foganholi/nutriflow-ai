import { BookOpen } from "lucide-react";
import { requireUser } from "@/lib/auth";

export default async function EducationPage() {
  const { supabase } = await requireUser();
  const { data: articles } = await supabase.from("educational_contents").select("*").eq("active", true).order("title");

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm font-black text-emerald-600">APRENDA</p>
      <h1 className="mt-1 text-4xl font-black">Educação alimentar</h1>
      <p className="muted mt-2">Conteúdo educativo, sem diagnósticos ou promessas de tratamento.</p>
      <div className="mt-7 grid gap-4 md:grid-cols-2">
        {(articles ?? []).map((article) => (
          <article className="card p-6" key={article.id}>
            <div className="flex items-center gap-2 text-xs font-black text-blue-600"><BookOpen size={15} /> LEITURA DE {article.reading_minutes} MIN</div>
            <h2 className="mt-3 text-xl font-black">{article.title}</h2>
            <p className="muted mt-3 text-sm leading-6">{article.summary}</p>
            <details className="mt-4"><summary className="cursor-pointer text-sm font-black text-emerald-700">Ler conteúdo</summary><p className="muted mt-3 whitespace-pre-line text-sm leading-7">{article.body}</p></details>
          </article>
        ))}
      </div>
    </div>
  );
}
