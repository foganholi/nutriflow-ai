# Arquitetura

Next.js App Router entrega as páginas públicas, Server Components e ações de autenticação. `proxy.ts`
renova a sessão Supabase e protege rotas. O navegador usa apenas URL e chave publicável; autorização
real é feita no PostgreSQL por RLS.

O motor em `lib/nutrition-engine` é determinístico e funciona sem IA paga. Ele calcula estimativas,
aplica limites conservadores e gera refeições/substituições. Uma IA futura deve receber somente dados
minimizados e anônimos, com o motor local como fallback.

Vercel hospeda o front-end. Supabase fornece Auth e PostgreSQL. Pagamentos são uma extensão futura
ligada à tabela `subscriptions`.
