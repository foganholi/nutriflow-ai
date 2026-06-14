# Testes de autenticação

- Cadastro exige termos, privacidade e consentimento.
- Login inválido retorna mensagem genérica.
- Recuperação retorna a mesma mensagem para e-mail existente ou inexistente.
- Logout remove sessão e bloqueia rota privada.
- Visitante em `/dashboard` é redirecionado.
- Usuário sem role `admin` em `/admin` é redirecionado.
- Confirmar e-mail antes de liberar conta em produção.
