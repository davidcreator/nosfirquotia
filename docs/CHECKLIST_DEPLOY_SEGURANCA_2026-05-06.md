# Checklist de Deploy Seguro - Quotia

Data: 06/05/2026

## 1. Configuracao minima recomendada (producao)

No `config/config.php`, ajuste o ambiente ativo (`online`) com:

- `app_url` usando HTTPS e dominio publico canonico.
- `security.trusted_hosts` com todos os hosts validos (ex.: dominio raiz + `www`).
- `security.trusted_proxies` com IP/CIDR reais do proxy reverso (quando existir).
- usuario de banco dedicado (nao usar `root`).
- senha de banco forte (nao vazia).

Alternativamente, aplique esses valores por variaveis de ambiente no servidor:

- `NQ_ENVIRONMENT=online`
- `NQ_APP_URL`
- `NQ_SECURITY_TRUSTED_HOSTS`
- `NQ_SECURITY_TRUSTED_PROXIES`
- `NQ_SECURITY_MONITORING_WINDOW_HOURS`, `NQ_SECURITY_MONITORING_BUCKET_MINUTES`
- `NQ_DB_HOST`, `NQ_DB_PORT`, `NQ_DB_DATABASE`, `NQ_DB_USERNAME`, `NQ_DB_PASSWORD`

Exemplo:

```php
'app_url' => 'https://quotia.seudominio.com.br',
'security' => [
    'trusted_hosts' => [
        'quotia.seudominio.com.br',
        'www.quotia.seudominio.com.br',
    ],
    'trusted_proxies' => [
        '10.0.0.0/8',
    ],
],
```

Importante:

- valores de exemplo como `quotia.seudominio.com.br`, `10.0.0.0/8` e `__ALTERAR_EM_PRODUCAO__` devem ser trocados pelos dados reais antes do deploy.

## 2. Validacao obrigatoria antes do deploy

1. `composer audit:security-config -- --env=online`
2. `composer verify:release`
3. `composer audit:security-config:strict -- --env=online`

Atalhos equivalentes:

- `composer verify:release:online`
- `composer verify:release:strict:online`

Observacao:

- a auditoria considera overrides `NQ_*` ativos no ambiente de execucao.

No passo 3, qualquer aviso bloqueia o deploy.

## 3. Criticos de seguranca para fechar antes da publicacao

- `app_url` sem HTTPS.
- `app_url` apontando para host local/privado.
- `security.trusted_proxies` vazio em ambiente com proxy reverso.
- Banco com usuario `root`.
- Banco com senha vazia.

## 4. Evidencia de homologacao

Registrar no ticket/release:

- saida dos comandos de auditoria;
- hash/commit da release;
- data/hora da validacao;
- responsavel tecnico.
