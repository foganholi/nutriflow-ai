# Testes XSS

- Inserir `<script>alert(1)</script>` em nome e observações.
- Confirmar que React renderiza texto, sem execução.
- Inserir `<img src=x onerror=alert(1)>` e verificar CSP/ausência de HTML não sanitizado.
- Não usar `dangerouslySetInnerHTML` com conteúdo do usuário.
