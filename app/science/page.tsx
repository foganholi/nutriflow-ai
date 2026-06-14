import { ExternalLink } from "lucide-react";
import { PublicPage } from "@/components/public-page";
const sources=[
  ["Guia Alimentar para a População Brasileira","Ministério da Saúde","https://www.gov.br/saude/pt-br/assuntos/saude-brasil/publicacoes-para-promocao-a-saude/guia_alimentar_populacao_brasileira_2ed.pdf","Base para priorizar alimentos in natura, cultura alimentar e redução de ultraprocessados."],
  ["Healthy diet","Organização Mundial da Saúde","https://www.who.int/news-room/fact-sheets/detail/healthy-diet","Referência geral sobre variedade, frutas, vegetais, sal, açúcares e gorduras."],
  ["The Eatwell Guide","NHS","https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/","Modelo educativo de equilíbrio entre grupos alimentares."],
  ["Dietary Guidelines for Americans","HHS e USDA","https://www.dietaryguidelines.gov/","Referência complementar sobre padrões alimentares e ciclos de vida."],
  ["FoodData Central","USDA","https://fdc.nal.usda.gov/","Base de composição nutricional para consulta e comparação."],
  ["Tabela TACO","NEPA/UNICAMP","https://www.nepa.unicamp.br/taco/","Valores aproximados de composição de alimentos consumidos no Brasil."],
];
export default function SciencePage(){return <PublicPage eyebrow="Transparência" title="As referências por trás das orientações educacionais."><div className="grid gap-4 md:grid-cols-2">{sources.map(([t,o,u,d])=><article className="card p-6" key={t}><p className="text-xs font-black text-emerald-600">{o}</p><h2 className="mt-2 text-xl font-black">{t}</h2><p className="muted mt-3 text-sm leading-6">{d}</p><a className="mt-5 inline-flex items-center gap-2 text-sm font-black text-blue-600" href={u} target="_blank" rel="noreferrer">Abrir fonte oficial <ExternalLink size={15}/></a></article>)}</div></PublicPage>}
