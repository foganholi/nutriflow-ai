# NutriFlow AI

Aplicação web de educação alimentar, planejamento de rotina e acompanhamento de hábitos. O produto
não substitui nutricionista ou médico e aplica alertas para situações que exigem avaliação profissional.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth/PostgreSQL/RLS, Zod, Recharts, Vitest e Playwright.

## Funcionalidades

- Landing, preços, ciência, privacidade e termos.
- Cadastro, login, confirmação e recuperação de senha.
- Onboarding persistente, dashboard, plano alimentar por regras, compras, progresso e hábitos.
- Biblioteca brasileira no PostgreSQL, favoritos, conteúdo educativo e admin protegido.
- Exportação de dados LGPD, PDF do plano, revogação de consentimento e exclusão de conta.
- RLS, grants mínimos, headers, validação e documentação de testes de segurança.

## Rodar localmente

```powershell
npm.cmd install
Copy-Item .env.example .env.local
npm.cmd run dev
```

Preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e `NEXT_PUBLIC_SITE_URL`.
Nunca use uma secret/service role key em variável `NEXT_PUBLIC_*`.

Para visualizar as telas privadas sem Supabase, use `NEXT_PUBLIC_DEMO_MODE=true` somente em ambiente
local. Em produção, mantenha `false`.

## Supabase

Projeto criado: [nutriflow-ai no Supabase](https://supabase.com/dashboard/project/xyypvhcrlebkplcrjhtl).

1. Crie um projeto e copie URL e publishable key no painel **Connect**.
2. Execute `supabase/migrations/20260614190000_initial_schema.sql` pelo SQL Editor ou CLI.
3. Ative confirmação de e-mail, configure Site URL/Redirect URLs e ajuste o template para `/auth/confirm`.
4. Execute o Security Advisor e os testes em `security-tests/`.

## Verificação

```powershell
npm.cmd run lint
npm.cmd run test
npm.cmd run build
npm.cmd run security:secrets
npm.cmd run test:e2e
```

## Deploy

Importe o repositório na Vercel, configure as mesmas variáveis e faça o deploy. Não configure chaves
secretas no cliente. Use as URLs de produção nas configurações de Auth do Supabase.

## Estrutura e próximos passos

Veja `docs/ARCHITECTURE.md`, `docs/DEPLOY.md`, `docs/SUPABASE.md`, `docs/BUSINESS_MODEL.md`,
`SECURITY.md`, `PRIVACY.md` e `TERMS.md`.
Antes de venda real: CAPTCHA, SMTP próprio, pagamentos, monitoramento com redaction e revisão
jurídica/clinico-nutricional.

## Estado das integrações

- GitHub: publicado em `foganholi/nutriflow-ai`.
- Supabase: projeto ativo em `sa-east-1`, migrations aplicadas e Security Advisor sem alertas.
- Edge Functions autenticadas: exclusão de conta e métricas administrativas agregadas.
- Vercel: pendente de criação/autenticação de uma conta.
