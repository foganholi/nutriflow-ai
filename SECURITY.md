# Segurança do NutriFlow AI

## Visão geral

O projeto aplica defesa em profundidade: Supabase Auth, cookies SSR, validação Zod, privilégios mínimos,
Row Level Security (RLS), headers HTTP e coleta mínima. O aplicativo não registra conteúdo nutricional
sensível em logs de aplicação.

## Modelo de ameaças

- Acesso horizontal: usuário A tenta ler ou alterar dados do usuário B.
- Escalação vertical: usuário comum tenta acessar `/admin` ou alterar `role`.
- Troca de `user_id`, relações pai/filho adulteradas e chamadas diretas à API.
- XSS, injeção SQL, enumeração de e-mail, brute force e vazamento de secrets.
- Exposição acidental de dados sensíveis em logs, exportações ou métricas.

## Proteções

- RLS habilitado e forçado em todas as tabelas públicas.
- Policies `USING` e `WITH CHECK` baseadas em `(select auth.uid())`.
- Triggers validam o mesmo proprietário em relações pai/filho.
- Função de admin em schema `private`, sem confiar em `user_metadata`.
- `service_role` não existe em variáveis públicas nem no código cliente.
- CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, Referrer e Permissions Policy.
- Mensagens genéricas em login e recuperação de senha.
- Constraints de banco e validação Zod.
- Limite semanal e rate limit de planos/progresso reforçados por triggers no banco.
- Edge Functions privilegiadas validam a sessão com `@supabase/server` antes de usar o cliente administrativo.
- Supabase Auth aplica limites próprios; CAPTCHA deve ser habilitado antes do lançamento público.

## Riscos conhecidos

- CAPTCHA/Turnstile e SMTP próprio ainda dependem da configuração do painel de produção.
- Limites adicionais no WAF da Vercel continuam recomendados para endpoints públicos.
- Testes RLS reais exigem um projeto Supabase e dois usuários de teste isolados.

## Reporte

Envie detalhes de forma privada para `security@nutriflow.ai`. Não inclua dados pessoais reais.

## Checklist de produção

- Executar migrations e Supabase Security Advisor.
- Confirmar verificação de e-mail e proteção contra senhas vazadas.
- Configurar rate limit no Supabase Auth e na Vercel.
- Executar `npm audit`, `npm run security:secrets`, testes RLS e Playwright.
- Validar URLs permitidas, CORS, templates de e-mail e expiração de sessão.
