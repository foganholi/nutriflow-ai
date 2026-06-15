# Supabase

Projeto: `xyypvhcrlebkplcrjhtl`, região `sa-east-1`.

## Aplicação das migrations

As migrations em `supabase/migrations` devem ser executadas em ordem. Em desenvolvimento com CLI:

```powershell
npx.cmd supabase login
npx.cmd supabase link --project-ref xyypvhcrlebkplcrjhtl
npx.cmd supabase db push
```

## Segurança

- Todas as tabelas expostas usam RLS.
- Tabelas privadas usam `auth.uid()` em `USING` e `WITH CHECK`.
- Funções `security definer` ficam no schema `private`.
- Relações pai/filho são verificadas por trigger.
- Limites de plano e escrita sensível são reforçados no banco.
- Funções `delete-account` e `admin-metrics` usam `@supabase/server` com `auth: "user"`.
- Nessas funções, `verify_jwt=false` é intencional: o SDK valida a sessão e aceita as publishable keys atuais.

## Configuração de Auth

Ative confirmação de e-mail, proteção contra senhas vazadas, CAPTCHA e limites adequados. Use SMTP
próprio em produção. Nunca copie secret/service-role keys para variáveis `NEXT_PUBLIC_*`.

## Advisors

Execute Security Advisor após toda alteração DDL. Avisos de índices não usados são esperados enquanto
o banco não tiver tráfego suficiente para estatísticas úteis.
