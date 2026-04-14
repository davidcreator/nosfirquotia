# Aurea Quotia

Sistema web para solicitacao e geracao de orcamentos na area de Design, construido em PHP com arquitetura MVCL.

## Objetivo do sistema

O cliente **nao monta orcamento** direto.  
Ele cria conta, envia uma solicitacao com os servicos desejados e aguarda analise.

O admin recebe a solicitacao e gera um **relatorio de orcamento** com:

- Valores por servico
- Prazos por servico
- Disponibilidade
- Impostos, taxas e encargos tributarios
- Opcao de exibir ou ocultar detalhamento tributario para o cliente
- Valor total e prazo total
- Validade automatica de **90 dias**
- Controle de acesso por niveis e permissoes no painel admin
- Notificacao por email ao cliente quando o orcamento estiver pronto
- Recuperacao de senha por link enviado por email (cliente e admin)

## Arquitetura

Estrutura principal no estilo solicitado:

```
admin/
cliente/
system/
install/
config/
database/
public/
storage/
index.php
```

- `system/`: nucleo MVCL (Application, Router, Controller, Model, View, bibliotecas)
- `cliente/`: autenticacao de cliente + solicitacoes + acompanhamento de relatorios
- `admin/`: login admin + analise de solicitacoes + emissao de relatorio
- `install/`: instalador em 4 passos (estilo OpenCart)

## Tecnologias

- PHP 8.2+
- MySQL/MariaDB
- Composer (autoload PSR-4)
- `nikic/fast-route` para rotas
- Bootstrap 5 nas interfaces cliente e admin

## Fluxo funcional (como funciona)

1. Cliente cria conta (`/cliente/cadastro`) e faz login (`/cliente/login`)
2. Cliente abre solicitacao em `/orcamento/novo`
3. Cliente seleciona os servicos que quer cotar (sem acesso ao calculo do orcamento)
4. Admin acessa `/admin/orcamentos`, analisa e gera o relatorio
5. Admin pode aplicar impostos/taxas/encargos no relatorio e escolher se o cliente vera esse detalhamento
6. Sistema grava validade do relatorio para 90 dias a partir da emissao
7. Cliente visualiza o relatorio em sua area (`/orcamentos/{id}`)
8. Administrador Geral gerencia usuarios admin, niveis e permissoes por modulo
9. Sistema registra notificacoes de email com status de envio, falha e email invalido

## Instalacao

1. Instale dependencias:

```bash
composer install
```

2. Acesse o projeto no navegador.
3. O sistema redireciona para `/install`.
4. Conclua os 4 passos do instalador:
   - Requisitos
   - Permissoes
   - Banco e admin (com opcao de importar `reference_prices_2025.json`)
   - Conclusao

## Base de referencia de valores 2025

Origem: `Tabela de Referencia de Valores 2025.docx`

Arquivo estruturado:

- `database/reference_prices_2025.json`

Tabelas de referencia:

- `reference_price_catalogs`
- `reference_price_items`

Importar/atualizar referencia em banco ja instalado:

```bash
php database/import_reference_prices.php
```

No passo 3 do instalador existe a opcao:

- `Importar base de precos e servicos de referencia (reference_prices_2025.json)` (marcada por padrao)

Se desmarcar, o sistema instala normalmente e a importacao pode ser feita depois via script.

### Em ambiente online: se o instalador nao abrir

Se ao acessar `/install` o sistema nao entra no instalador, verifique:

1. `storage/installed.lock`:
   - Se existir antes da primeira instalacao, remova.
2. `config/config.php`:
   - Troque `'environment'` para o ambiente correto (`local` ou `online`).
   - No ambiente ativo, use `'installed' => false` para permitir instalacao.
   - Exemplo: `environments['online']['installed'] = false`.
   - Se ainda nao existir, use `config/config.example.php` como base.
   - Migracao automatica: se existir formato antigo e/ou `config-local.php` (ou `config local.php`), o `index.php` converte para o formato multiambiente automaticamente.
3. `vendor/`:
   - Garanta dependencias instaladas (`composer install` no servidor ou upload da pasta `vendor`).
4. Rewrite:
   - Confirme que `.htaccess` e `mod_rewrite` estao ativos no servidor.
5. Fallback sem rewrite:
   - Abra diretamente `index.php` com a rota na query:
   - `https://SEU-DOMINIO/index.php?route=/install`
   - Ou acesse `https://SEU-DOMINIO/install/index.php` (compatibilidade).
   - Tambem funciona para os passos:
   - `index.php?route=/install/step1`
   - `index.php?route=/install/step2`
   - `index.php?route=/install/step3`
   - `index.php?route=/install/step4`

## Upgrade para o novo fluxo cliente/admin (se banco antigo ja existe)

Para criar as tabelas do fluxo atual sem reinstalar:

```bash
php database/upgrade_workflow_client_admin.php
```

Para ativar os recursos fiscais (impostos, taxas, encargos e exibicao opcional no cliente) em banco ja existente:

```bash
php database/upgrade_tax_features.php
```

Para ativar niveis de permissao e controle de acessos de usuarios administrativos em banco ja existente:

```bash
php database/upgrade_admin_permissions.php
```

Para ativar recursos de comunicacao por email, recuperacao de senha e logs de notificacao:

```bash
php database/upgrade_communications_security.php
```

## Tabelas principais do fluxo atual

- `client_users`
- `quote_requests`
- `quote_request_items`
- `quote_reports`
- `quote_report_items`
- `quote_report_taxes`
- `tax_settings`
- `admin_users` (com nivel, status ativo/inativo e permissoes por modulo)
- `email_dispatch_logs`
- `password_resets`

## Rotas principais

- Home: `/`
- Cadastro cliente: `/cliente/cadastro`
- Login cliente: `/cliente/login`
- Recuperar senha cliente: `/cliente/esqueci-senha`
- Redefinir senha cliente: `/cliente/redefinir-senha?token=...`
- Nova solicitacao: `/orcamento/novo`
- Minhas solicitacoes: `/orcamentos`
- Admin login: `/admin`
- Recuperar senha admin: `/admin/esqueci-senha`
- Redefinir senha admin: `/admin/redefinir-senha?token=...`
- Admin solicitacoes/relatorios: `/admin/orcamentos`
- Admin notificacoes de email: `/admin/notificacoes-email`
- Admin base completa de precos/servicos: `/admin/referencias`
- Admin central fiscal: `/admin/tributos`
- Admin usuarios e permissoes (somente Administrador Geral): `/admin/usuarios`
- Admin ferramentas de design: `/admin/ferramentas`
- Politicas e conformidade: `/termos-de-uso`, `/politica-de-uso`, `/politica-de-privacidade`, `/politica-de-cookies`, `/lgpd`
- Instalador: `/install`

## Area de ferramentas (admin)

- A area de ferramentas e exclusiva do admin autenticado.
- Cada projeto em `admin/tools/*` (ou em `Tools/*`, quando essa pasta existir na raiz) e listado no painel.
- Ferramentas com `index.php` sao abertas dentro do layout admin em iframe, mantendo identidade visual do Aurea Quotia.
- Acesso direto aos projetos em `admin/tools` exige sessao admin.

## Central Fiscal (admin)

- A tela `/admin/tributos` permite definir parametros padrao de:
  - Impostos
  - Taxas
  - Encargos tributarios
- Esses parametros sao usados por padrao na emissao de relatorios em `/admin/orcamentos/{id}`.
- Ao gerar o relatorio, o admin escolhe se o cliente vai ver o detalhamento tributario.
- Se ocultado, o cliente recebe apenas o total consolidado; se exibido, recebe subtotal, componentes tributarios e total final.

## Notificacoes por Email

- Ao gerar/atualizar o relatorio, o sistema envia email ao cliente com saudacao e aviso de que o orcamento esta pronto.
- O admin recebe retorno operacional pelo sistema:
  - enviado com sucesso;
  - falha de envio;
  - nao enviado por email invalido.
- O historico completo fica em `/admin/notificacoes-email`.

## Recuperacao de Senha por Email

- Cliente e admin podem solicitar redefinicao informando o email cadastrado.
- O sistema envia link com token unico e expiracao de 1 hora.
- Apos redefinir a senha, o token e invalidado automaticamente.

## Seguranca e Cookies

- Headers de seguranca HTTP aplicados (CSP, nosniff, frame protection, referrer policy e permissions policy).
- Sessao com cookies seguros (`HttpOnly`, `SameSite=Lax`, `use_strict_mode`) e regeneracao de sessao em login/logout.
- Banner de consentimento de cookies com opcao:
  - Somente essenciais
  - Aceitar todos
- Politicas publicas de uso, termos, privacidade/captacao de dados, cookies e LGPD.

## Permissoes Admin

- O usuario criado no instalador e definido como `Administrador Geral`.
- O Administrador Geral possui acesso total ao painel e pode:
  - Criar novos usuarios admin
  - Definir nivel de acesso
  - Ativar/desativar contas
  - Configurar permissoes por modulo
- Modulos com permissao granular:
  - Dashboard
  - Solicitacoes e Relatorios
  - Notificacoes de Email (no modulo de Solicitacoes)
  - Precos e Servicos
  - Tributos
  - Ferramentas
  - Categorias
  - Usuarios e Permissoes

## Documento LGPD

- Documento tecnico completo em `docs/LGPD.md`.
