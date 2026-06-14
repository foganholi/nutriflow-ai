# Checklist de segurança

- [ ] RLS ativo e forçado em todas as tabelas expostas
- [ ] Usuário A não lê, insere, altera ou exclui dados do usuário B
- [ ] `user_id` adulterado é recusado
- [ ] Relação pai/filho de outro usuário é recusada
- [ ] Usuário comum recebe redirecionamento em `/admin`
- [ ] Rotas privadas redirecionam visitantes
- [ ] Mensagens de auth não enumeram e-mails
- [ ] Nenhuma chave secreta em bundle, logs ou Git
- [ ] Headers validados em produção
- [ ] Exportação e exclusão LGPD testadas
