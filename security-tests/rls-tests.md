# Testes RLS

1. Crie usuários A e B e obtenha JWTs separados.
2. Com A, insira `progress_logs` usando o próprio `user_id`: deve funcionar.
3. Com A, selecione a linha criada por B: deve retornar zero linhas.
4. Com A, tente inserir ou atualizar com `user_id` de B: deve falhar.
5. Crie um plano de B; tente incluir `meal_items` de A nesse plano: o trigger deve falhar com `42501`.
6. Consulte `pg_tables` e confirme `rowsecurity=true` e `forcerowsecurity=true`.

```sql
select tablename, rowsecurity, forcerowsecurity
from pg_tables where schemaname = 'public' order by tablename;
```
