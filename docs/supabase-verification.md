# Verificação do Supabase

Projeto: `xyypvhcrlebkplcrjhtl` (`sa-east-1`).

## Resultado

- 14 tabelas públicas com `relrowsecurity=true` e `relforcerowsecurity=true`.
- Security Advisor: zero alertas após as migrations.
- Policies privadas usam `auth.uid()` em `USING` e `WITH CHECK`.
- Função administrativa fica no schema privado.
- Chave configurada no cliente: somente `sb_publishable_*`.

## Teste de isolamento

Um teste transacional criou usuários A e B e um registro de progresso para cada um. Sob a role
`authenticated` e JWT do usuário A, a consulta retornou:

- Registros visíveis: 1
- Registros próprios: 1
- Registros do usuário B: 0

Uma tentativa de inserir uma linha usando manualmente o `user_id` de B falhou com PostgreSQL `42501`:
`new row violates row-level security policy for table "progress_logs"`.

O teste foi executado em transação revertida. A consulta posterior confirmou zero usuários residuais.

## Funções e administração

- `delete-account` e `admin-metrics` exigem JWT e retornaram HTTP `401` sem sessão.
- Usuário comum tentando inserir em `food_database` recebeu PostgreSQL `42501`.
- O teste administrativo foi revertido e deixou zero usuários/alimentos residuais.
- Catálogo atual: 20 alimentos e 6 fontes ativas.

## Advisors

Os únicos avisos de performance remanescentes são índices ainda não utilizados, comportamento esperado
em um banco recém-criado e sem tráfego.
