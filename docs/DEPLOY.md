# Deploy

## Vercel

1. Crie uma conta em <https://vercel.com>.
2. Importe `foganholi/nutriflow-ai`.
3. Configure:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_DEMO_MODE=false`
4. Faça o primeiro deploy.
5. Use a URL final como `NEXT_PUBLIC_SITE_URL` e refaça o deploy.

## Supabase Auth

No painel de URL Configuration, defina a URL da Vercel como Site URL e permita:

- `https://SEU-DOMINIO/auth/confirm`
- `https://SEU-DOMINIO/reset-password`

Configure SMTP próprio antes de tráfego real. Ative CAPTCHA/Turnstile em cadastro, login e recuperação.
Revise os limites em Authentication > Rate Limits.

## Verificação pós-deploy

Execute headers, cadastro, confirmação, login, logout, recuperação, onboarding, PDF, exportação LGPD,
exclusão, acesso admin e testes RLS. Valide também Lighthouse em mobile e desktop.
