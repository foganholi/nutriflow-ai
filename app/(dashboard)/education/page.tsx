const articles = [
  ["Como montar um prato equilibrado","Combine vegetais, uma fonte de proteína, cereais ou raízes e feijões, respeitando fome, cultura e acesso."],
  ["Calorias e qualidade alimentar","Energia importa, mas saciedade, fibras, variedade e grau de processamento também influenciam a alimentação."],
  ["Proteínas no dia a dia","Distribuir fontes de proteína entre refeições pode facilitar adequação e saciedade."],
  ["Por que fibras importam","Frutas, hortaliças, feijões e cereais integrais contribuem para saciedade e saúde intestinal."],
  ["Hidratação sem complicação","Necessidades variam com clima, atividade e saúde. A cor da urina pode ser um sinal simples, com limitações."],
  ["Cuidado com dietas milagrosas","Promessas rápidas, exclusões amplas e regras rígidas merecem cautela. Resultados sustentáveis costumam ser graduais."],
];
export default function EducationPage(){return <div className="mx-auto max-w-5xl"><p className="text-sm font-black text-emerald-600">APRENDA</p><h1 className="mt-1 text-4xl font-black">Educação alimentar</h1><div className="mt-7 grid gap-4 md:grid-cols-2">{articles.map(([t,d])=><article className="card p-6" key={t}><p className="text-xs font-black text-blue-600">LEITURA DE 3 MIN</p><h2 className="mt-2 text-xl font-black">{t}</h2><p className="muted mt-3 text-sm leading-6">{d}</p></article>)}</div></div>}
