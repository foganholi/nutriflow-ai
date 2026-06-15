# Arquitetura

## Visão geral

O NutriFlow AI usa Next.js App Router no front-end e na camada de aplicação. Supabase fornece
autenticação, PostgreSQL, RLS e Edge Functions. A Vercel é o destino planejado para hospedagem.

## Autenticação e autorização

- `@supabase/ssr` armazena sessões em cookies.
- `proxy.ts` atualiza tokens com `getClaims` e protege rotas privadas.
- Server Actions recuperam o usuário com `getUser`.
- RLS é a autoridade final para todas as linhas privadas.
- A role administrativa vem de `profiles.role`, nunca de metadados editáveis pelo usuário.

## Dados e regras

Onboarding, planos, refeições, compras, progresso, hábitos e favoritos são persistidos sob `user_id`.
Triggers verificam relações pai/filho e impõem o limite semanal do plano gratuito. Eventos de rate
limit ficam no schema privado e não são expostos pela Data API.

## Motor nutricional

`lib/nutrition-engine` é determinístico e funciona sem IA paga. Ele calcula IMC, Mifflin-St Jeor,
TDEE, alvo calórico moderado, macros, hidratação, refeições, substituições e listas de compras.
Restrições comuns adaptam sugestões e situações de risco geram alertas.

## Operações privilegiadas

Exclusão de conta e métricas agregadas ficam em Edge Functions autenticadas. A secret key existe
somente dentro do ambiente Supabase. O Next.js e o navegador usam apenas a chave publicável.
