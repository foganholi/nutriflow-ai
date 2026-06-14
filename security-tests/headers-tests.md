# Testes de headers

```powershell
curl.exe -I https://SEU-DOMINIO
```

Confirmar CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
Referrer Policy e Permissions Policy. Revisar CSP antes de remover `unsafe-eval` do desenvolvimento.
