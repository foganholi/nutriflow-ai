begin;

insert into public.food_database(name, category, calories, protein_g, carbs_g, fat_g, fiber_g, source) values
('Arroz integral', 'Carboidratos', 124, 2.6, 25.8, 1.0, 2.7, 'TACO/valores aproximados'),
('Feijão carioca', 'Leguminosas', 76, 4.8, 13.6, 0.5, 8.5, 'TACO/valores aproximados'),
('Peito de frango', 'Proteínas', 159, 32, 0, 2.5, 0, 'TACO/valores aproximados'),
('Ovo cozido', 'Proteínas', 146, 13.3, 0.6, 9.5, 0, 'TACO/valores aproximados'),
('Carne moída magra', 'Proteínas', 219, 26, 0, 12, 0, 'TACO/valores aproximados'),
('Batata inglesa', 'Carboidratos', 52, 1.2, 11.9, 0, 1.3, 'TACO/valores aproximados'),
('Mandioca cozida', 'Carboidratos', 125, 0.6, 30, 0.3, 1.6, 'TACO/valores aproximados'),
('Aveia em flocos', 'Cereais', 394, 13.9, 66.6, 8.5, 9.1, 'TACO/valores aproximados'),
('Banana prata', 'Frutas', 98, 1.3, 26, 0.1, 2, 'TACO/valores aproximados'),
('Maçã', 'Frutas', 56, 0.3, 15.2, 0, 1.3, 'TACO/valores aproximados'),
('Leite semidesnatado', 'Laticínios', 42, 3.2, 4.8, 1, 0, 'TACO/valores aproximados'),
('Iogurte natural', 'Laticínios', 51, 4.1, 1.9, 3, 0, 'TACO/valores aproximados'),
('Queijo minas', 'Laticínios', 264, 17.4, 3.2, 20.2, 0, 'TACO/valores aproximados'),
('Alface', 'Verduras', 15, 1.3, 2.9, 0.2, 1.3, 'TACO/valores aproximados'),
('Tomate', 'Legumes', 15, 1.1, 3.1, 0.2, 1.2, 'TACO/valores aproximados'),
('Brócolis', 'Legumes', 25, 2.1, 4.4, 0.5, 3.4, 'TACO/valores aproximados'),
('Macarrão cozido', 'Carboidratos', 157, 5.8, 30.9, 0.9, 1.8, 'TACO/valores aproximados'),
('Tilápia grelhada', 'Proteínas', 128, 26, 0, 2.7, 0, 'TACO/valores aproximados'),
('Lentilha cozida', 'Leguminosas', 93, 6.3, 16.3, 0.5, 7.9, 'TACO/valores aproximados'),
('Grão-de-bico', 'Leguminosas', 164, 8.9, 27.4, 2.6, 7.6, 'TACO/valores aproximados')
on conflict (name) do update set category=excluded.category, calories=excluded.calories, protein_g=excluded.protein_g,
  carbs_g=excluded.carbs_g, fat_g=excluded.fat_g, fiber_g=excluded.fiber_g, source=excluded.source;

insert into public.scientific_sources(title, organization, url, summary, usage_notes) values
('Guia Alimentar para a População Brasileira', 'Ministério da Saúde', 'https://www.gov.br/saude/pt-br/assuntos/saude-brasil/publicacoes-para-promocao-a-saude/guia_alimentar_populacao_brasileira_2ed.pdf', 'Prioriza alimentos in natura, cultura alimentar e redução de ultraprocessados.', 'Base dos conteúdos educativos e do modo comida brasileira.'),
('Healthy diet', 'Organização Mundial da Saúde', 'https://www.who.int/news-room/fact-sheets/detail/healthy-diet', 'Referência geral sobre variedade, frutas, vegetais, sal, açúcares e gorduras.', 'Base de recomendações educacionais gerais.'),
('The Eatwell Guide', 'NHS', 'https://www.nhs.uk/live-well/eat-well/food-guidelines-and-food-labels/the-eatwell-guide/', 'Modelo educativo de equilíbrio entre grupos alimentares.', 'Apoio à composição visual de refeições.'),
('Dietary Guidelines for Americans', 'HHS e USDA', 'https://www.dietaryguidelines.gov/', 'Referência complementar sobre padrões alimentares e ciclos de vida.', 'Referência complementar de segurança.'),
('FoodData Central', 'USDA', 'https://fdc.nal.usda.gov/', 'Base pública internacional de composição nutricional.', 'Consulta complementar de nutrientes.'),
('Tabela TACO', 'NEPA/UNICAMP', 'https://www.nepa.unicamp.br/taco/', 'Composição de alimentos consumidos no Brasil.', 'Fonte principal dos valores aproximados da biblioteca.');

commit;
