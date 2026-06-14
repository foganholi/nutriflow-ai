# Testes SQL Injection

- Testar `' OR 1=1 --` em campos de login, busca e observações.
- Confirmar respostas genéricas e nenhuma alteração de escopo.
- Consultas usam Supabase/PostgREST parametrizado; não concatenar SQL do usuário.
- Validar limites de tamanho e tipos com Zod e constraints do PostgreSQL.
