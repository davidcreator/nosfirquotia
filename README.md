# Nosfir Quotia

Sistema web para solicitação e geração de orçamentos na área de Design, construído em PHP com arquitetura MVCL.

## Atualizacao recente (05/05/2026)

- Consolidação da padronização visual e de legibilidade mobile nas ferramentas administrativas.
- Ajustes centralizados em `admin/tools/compatibility.css` para contraste, tipografia e espaços em telas pequenas.
- Preservação das cores semânticas (status/qualidade) e das variações OG onde o contexto visual exige destaque.
- Revisão de segurança de estilo para evitar regressão em blocos sensíveis do `brandbook`, `finalframe`, `brandmanual`, `mockups` e `ocimage`.
- Documentação técnica atualizada para refletir este ciclo.

## Atualização anterior (04/05/2026)

- Revisão textual nas telas administrativas e ferramentas para padronização PT-BR.
- Normalização de encoding UTF-8 em arquivos críticos de interface.
- Correção de acentuação em rótulos, mensagens, títulos e blocos de relatório.
- Validação técnica após ajustes:
  - `php -l` nos arquivos PHP alterados.
  - `node --check` nos arquivos JavaScript alterados.
- Documentação técnica atualizada para refletir esse ciclo de ajustes.

## Objetivo do sistema

O cliente **não monta orçamento** direto.  
Ele cria conta, envia uma solicitação com os serviços desejádos e aguarda análise.

O admin recebe a solicitação e gera um **relatório de orçamento** com:

- Valores por Serviço
- Prazos por Serviço
- Disponibilidade
- Impostos, taxas e encargos tributarios
- Opção de exibir ou ocultar detalhamento tributario para o cliente
- Valor total e prazo total
- Validade automática de **90 dias**
- Controle de acesso por niveis e permissoes no painel admin
- Notificação por email ao cliente quando o orçamento estiver pronto
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
- `cliente/`: autenticacao de cliente + solicitações + acompanhamento de relatórios
- `admin/`: login admin + análise de solicitações + emissão de relatório
- `install/`: instalador em 4 passos (estilo OpenCart)

## Tecnologias

- PHP 8.2+
- MySQL/MariaDB
- Composer (autoload PSR-4)
- `nikic/fast-route` para rotas
- Bootstrap 5 nas interfaces cliente e admin

## Fluxo funcional (como funciona)

1. Cliente cria conta (`/cliente/cadastro`) e faz login (`/cliente/login`)
2. Cliente abre solicitação em `/orcamento/novo`
3. Cliente seleciona os serviços que quer cotar (sem acesso ao cálculo do orçamento)
4. Admin acessa `/admin/orcamentos`, analisa e gera o relatório
5. Admin pode aplicar impostos/taxas/encargos no relatório e escolher se o cliente vera esse detalhamento
6. Sistema grava validade do relatório para 90 dias a partir da emissão
7. Cliente visualiza o relatório em sua area (`/orcamentos/{id}`)
8. Administrador Geral gerencia usuários admin, niveis e permissoes por módulo
9. Sistema registra notificações de email com status de envio, falha e email inválido

## Instalação

1. Instale dependencias:

```bash
composer install
```

2. Acesse o projeto no navegador.
3. O sistema redireciona para `/install`.
4. Conclua os 4 passos do instalador:
   - Requisitos
   - Permissoes
   - Banco e admin (com opção de importar `reference_prices_2025.json`)
   - Conclusao

## Base de referência de valores 2025

Origem: `Tabela de Referencia de Valores 2025.docx`

Arquivo estruturado:

- `database/reference_prices_2025.json`

Tabelas de referência:

- `reference_price_catalogs`
- `reference_price_items`

Importar/atualizar referência em banco já instalado:

```bash
php database/import_reference_prices.php
```

No passo 3 do instalador existe a opção:

- `Importar base de preços e serviços de referência (reference_prices_2025.json)` (marcada por padrão)

Se desmarcar, o sistema instala normalmente e a importação pode ser feita depois via script.

### Em ambiente online: se o instalador não abrir

Se ao acessar `/install` o sistema não entra no instalador, verifique:

1. `storage/installed.lock`:
   - Se existir antes da primeira Instalação, remova.
2. `config/config.php`:
   - Troque `'environment'` para o ambiente correto (`local` ou `online`).
   - No ambiente ativo, use `'installed' => false` para permitir Instalação.
   - Exemplo: `environments['online']['installed'] = false`.
   - Se ainda não existir, use `config/config.example.php` como base.
   - Migracao automática: se existir formato antigo e/ou `config-local.php` (ou `config local.php`), o `index.php` converte para o formato multiambiente automáticamente.
3. `vendor/`:
   - Garanta dependencias instaladas (`composer install` no servidor ou upload da pasta `vendor`).
4. Rewrite:
   - Confirme que `.htaccess` e `mod_rewrite` estão ativos no servidor.
5. Fallback sem rewrite:
   - Abra diretamente `index.php` com a rota na query:
   - `https://SEU-DOMINIO/index.php?route=/install`
   - Ou acesse `https://SEU-DOMINIO/install/index.php` (compatibilidade).
   - Tambem funciona para os passos:
   - `index.php?route=/install/step1`
   - `index.php?route=/install/step2`
   - `index.php?route=/install/step3`
   - `index.php?route=/install/step4`

## Upgrade para o novo fluxo cliente/admin (se banco antigo já existe)

Para criar as tabelas do fluxo atual sem reinstalar:

```bash
php database/upgrade_workflow_client_admin.php
```

Para ativar os recursos fiscais (impostos, taxas, encargos e exibição opcional no cliente) em banco já existente:

```bash
php database/upgrade_tax_features.php
```

Para ativar niveis de permissao e controle de acessos de usuários administrativos em banco já existente:

```bash
php database/upgrade_admin_permissions.php
```

Para ativar recursos de comunicação por email, recuperação de senha e logs de notificação:

```bash
php database/upgrade_communications_security.php
```

Para ativar persistência do Manual da Marca (MVP) no banco (vínculo por solicitação):

```bash
php database/upgrade_brand_manual_mvp.php
```

## Tabelas principais do fluxo atual

- `client_users`
- `quote_requests`
- `quote_request_items`
- `quote_reports`
- `quote_report_items`
- `quote_report_taxes`
- `brand_manual_reports`
- `tax_settings`
- `admin_users` (com nivel, status ativo/inativo e permissoes por módulo)
- `email_dispatch_logs`
- `password_resets`

## Rotas principais

- Home: `/`
- Cadastro cliente: `/cliente/cadastro`
- Login cliente: `/cliente/login`
- Recuperar senha cliente: `/cliente/esqueci-senha`
- Redefinir senha cliente: `/cliente/redefinir-senha?token=...`
- Nova solicitação: `/orcamento/novo`
- Minhas solicitações: `/orcamentos`
- Admin login: `/admin`
- Recuperar senha admin: `/admin/esqueci-senha`
- Redefinir senha admin: `/admin/redefinir-senha?token=...`
- Admin solicitações/relatórios: `/admin/orcamentos`
- Download do Manual da Marca salvo: `/admin/orcamentos/{id}/manual-marca.json`
- Admin notificações de email: `/admin/notificacoes-email`
- Admin base completa de preços/serviços: `/admin/referencias`
- Admin central fiscal: `/admin/tributos`
- Admin usuários e permissoes (somente Administrador Geral): `/admin/usuarios`
- Admin ferramentas de design: `/admin/ferramentas`
- Politicas e conformidade: `/termos-de-uso`, `/politica-de-uso`, `/politica-de-privacidade`, `/politica-de-cookies`, `/lgpd`
- Instalador: `/install`

## Area de ferramentas (admin)

- A area de ferramentas e exclusiva do admin autenticado.
- Cada projeto em `admin/tools/*` (ou em `Tools/*`, quando essa pasta existir na raiz) e listado no painel.
- Ferramentas com `index.php` sao abertas dentro do layout admin em iframe, mantendo identidade visual do Nosfir Quotia.
- Acesso direto aos projetos em `admin/tools` exige sessao admin.
- MVP ativo de manual da marca: `Brand Manual Report (MVP)` em `/admin/ferramentas/brandmanual`.
- O MVP consolida dados das chaves locais de integração (`AQBrandKit`, mockups e OG settings) e exporta JSON/PDF resumo.
- O módulo inclui `Template Studio` com 3 layouts de brandbook (`mono_arc`, `cobalt_grid`, `crimson_blob`), preview em 8 páginas, impressão e export HTML standalone.
- Em `/admin/orcamentos/{id}` e possível importar o ultimo payload do manual salvo no navegador e persistir no banco junto da geração/atualização do relatório.
- Em `/admin/orcamentos/{id}/manual-marca.json` e possível baixar o JSON persistido no banco para auditoria e anexos externos.

## Central Fiscal (admin)

- A tela `/admin/tributos` permite definir parâmetros padrão de:
  - Impostos
  - Taxas
  - Encargos tributarios
- Esses parâmetros sao usados por padrão na emissão de relatórios em `/admin/orcamentos/{id}`.
- Ao gerar o relatório, o admin escolhe se o cliente vai ver o detalhamento tributario.
- Se ocultado, o cliente recebe apenas o total consolidado; se exibido, recebe subtotal, componentes tributarios e total final.

## Notificacoes por Email

- Ao gerar/atualizar o relatório, o sistema envia email ao cliente com saudação e aviso de que o orçamento está pronto.
- O admin recebe retorno operacional pelo sistema:
  - enviado com sucesso;
  - falha de envio;
  - não enviado por email inválido.
- O histórico completo fica em `/admin/notificacoes-email`.

## Recuperacao de Senha por Email

- Cliente e admin podem solicitar redefinicao informando o email cadastrado.
- O sistema envia link com token unico e expiracao de 1 hora.
- Após redefinir a senha, o token é invalidado automaticamente.

## Segurança e Cookies

- Headers de segurança HTTP aplicados (CSP, nosniff, frame protection, referrer policy e permissions policy).
- Sessão com cookies seguros (`HttpOnly`, `SameSite=Lax`, `use_strict_mode`) e regeneração de sessão em login/logout.
- Banner de consentimento de cookies com opção:
  - Somente essenciais
  - Aceitar todos
- Politicas publicas de uso, termos, privacidade/captacao de dados, cookies e LGPD.

### Auditoria de configuração de segurança

Use o comando abaixo para validar configurações críticas antes de publicar:

```bash
composer audit:security-config
```

O script audita `app_url`, `security.trusted_proxies`, hosts confiáveis e limites de monitoramento.
Erros bloqueantes retornam `exit 1`; avisos permitem execução, mas devem ser revisados.
Quando variáveis `NQ_*` estiverem definidas no ambiente, a auditoria considera os overrides de runtime do ambiente auditado.

Modo estrito (avisos tambem bloqueiam):

```bash
composer audit:security-config:strict
```

Checklist automatizado de release (auditoria padrao + testes):

```bash
composer verify:release
```

Checklist estrito para pipeline de producao:

```bash
composer verify:release:strict
```

Checklist por ambiente online (sem auditar `local`):

```bash
composer verify:release:online
composer verify:release:strict:online
```

Guia operacional de deploy seguro:

- `docs/CHECKLIST_DEPLOY_SEGURANCA_2026-05-06.md`

Overrides por variavel de ambiente (sem expor credenciais no `config.php`):

- `NQ_ENVIRONMENT` (`local`/`online`)
- `NQ_APP_URL`
- `NQ_SECURITY_TRUSTED_HOSTS`
- `NQ_SECURITY_TRUSTED_PROXIES`
- `NQ_SECURITY_MONITORING_WINDOW_HOURS`
- `NQ_SECURITY_MONITORING_BUCKET_MINUTES`
- `NQ_SECURITY_THRESHOLD_CSRF_REJECTED`
- `NQ_SECURITY_THRESHOLD_HOST_HEADER_REJECTED`
- `NQ_SECURITY_THRESHOLD_ADMIN_LOGIN_BLOCKED`
- `NQ_SECURITY_THRESHOLD_CLIENT_LOGIN_BLOCKED`
- `NQ_DB_HOST`, `NQ_DB_PORT`, `NQ_DB_DATABASE`, `NQ_DB_USERNAME`, `NQ_DB_PASSWORD`
- `NQ_MAIL_ENABLED`, `NQ_MAIL_FROM_NAME`, `NQ_MAIL_FROM_EMAIL`

## Permissoes Admin

- O usuário criado no instalador é definido como `Administrador Geral`.
- O Administrador Geral possui acesso total ao painel e pode:
  - Criar novos usuários admin
  - Definir nivel de acesso
  - Ativar/desativar contas
  - Configurar permissoes por módulo
- Modulos com permissao granular:
  - Dashboard
  - Solicitações e Relatórios
  - Notificacoes de Email (no módulo de Solicitações)
  - Preços e Serviços
  - Tributos
  - Ferramentas
  - Catégorias
  - Usuarios e Permissoes

## Documento LGPD

- Documento técnico completo em `docs/LGPD.md`.
