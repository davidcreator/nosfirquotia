# MVP Manual da Marca - Implementação Técnica

## Linha do tempo
- 2026-04-18: criação da ferramenta `Brand Manual Report (MVP)` com consolidação local + export JSON/PDF.
- 2026-04-19: evolução para persistência backend e vínculo direto ao fluxo de `/admin/orcamentos/{id}`.
- 2026-04-20: implementação do `Template Studio` com preview de brandbook em 8 páginas, impressão e export HTML standalone.
- 2026-04-20: endpoint admin para download seguro do JSON persistido do manual da marca por solicitação.
- 2026-05-04: Revisão de linguagem (PT-BR) e padronização UTF-8 nas interfaces e mensagens das ferramentas integradas.
- 2026-05-05: consolidação final de responsividade mobile e legibilidade nas ferramentas via `admin/tools/compatibility.css`, com preservação de cores semânticas e contraste do tema Quotia.

## Atualização desta documentação (05/05/2026)
- Inclui registro da consolidação visual/mobile e da camada de compatibilidade compartilhada.
- Formaliza os ajustes de contraste, espaços e tipografia nas ferramentas para reduzir divergência entre layouts.
- Preserva regras semânticas de cor em blocos de status/qualidade e blocos OG com texto branco.
- Confirma validações técnicas de consistência de CSS (estrutura e regressão visual básica).

## Atualização anterior (04/05/2026)
- Inclui registro do ciclo de padronização textual/encoding.
- Confirma validações técnicas executadas após os ajustes (`php -l` e `node --check`).

## Objetivo desta frente
Disponibilizar um fluxo funcional de manual da marca com:
- consolidação das ferramentas de identidade visual;
- exportações operacionais (JSON/PDF);
- templates prontos para aceleração de brandbooks;
- capacidade de vincular/salvar o manual no contexto da solicitação de orçamento.

## Escopo implementado (estado atual)

### 1) Ferramenta consolidada no painel admin
- Ferramenta: `Brand Manual Report (MVP)`.
- Slug/entrada: `brandmanual` (`/admin/ferramentas/brandmanual`).
- Arquivos:
  - `admin/tools/brandmanual/index.php`
  - `admin/tools/brandmanual/assets/css/style.css`
  - `admin/tools/brandmanual/assets/js/script.js`

### 1.1) Templaté Studio (novo nesta iteracao)
- Templatés MVP disponiveis:
  - `mono_arc` (preto/branco editorial)
  - `cobalt_grid` (corporativo azul)
  - `crimson_blob` (organico com contraste)
- Renderizacao automática de 8 páginas no preview:
  - capa
  - indice
  - paleta
  - tipografia
  - sistema de logo
  - aplicações (mockups)
  - diretriz digital (OG)
  - encerramento
- Novas saidas:
  - impressão direta do brandbook (`window.print`)
  - exportacao de HTML standalone do brandbook

### 2) Fontes de dados consolidadas
- `AQBrandKit` e estados relacionados:
  - `aq_brand_kit_v1`
  - `aq_color_palette_state_v1`
  - `aq_font_profile_state_v1`
- Mockups e contexto de trabalho:
  - `mockuphub_saved_edits_v1`
  - `mockuphub_work_info_v1`
- Diretriz digital OG:
  - `ogImageSettings`

### 3) Persistência de cache para integração com orçamento
- Novo cache local do payload consolidado:
  - `brand_manual_mvp_latest_v1`
- Uso: importar automáticamente no formulario de `/admin/orcamentos/{id}`.

### 4) Vínculo no fluxo de orçamento (admin)
- Tela de solicitação admin recebeu bloco `Manual da Marca (MVP)` com:
  - botao para abrir ferramenta de manual;
  - botao para importar ultimo payload do navegador;
  - textarea JSON para Revisão/edicao;
  - validação no backend ao salvar o relatório.
- Persistência no banco junto da geração/atualização do relatório.

## Persistência backend (nova nesta iteracao)

### Tabela adicionada
- `brand_manual_reports`
  - `id`
  - `quote_request_id` (UNIQUE)
  - `admin_user_id`
  - `schema_version`
  - `tool_source`
  - `generated_at`
  - `payload_json`
  - `created_at`
  - `updated_at`

### Scripts de banco
- Schema base atualizado:
  - `database/schema.sql` (inclui `brand_manual_reports`)
- Upgrade para bases existentes:
  - `database/upgrade_brand_manual_mvp.php`

### Modelo e controller
- `QuoteModel`:
  - `brandManual(int $requestId): ?array`
  - `saveBrandManualReport(...)`
  - `ensureBrandManualTable(): bool` (fallback seguro em runtime)
- `QuoteController`:
  - carrega dados do manual em `show()`;
  - valida JSON e metadados em `generateReport()`;
  - persiste manual quando payload informado;
  - unifica mensagens de warning para não sobrescrever alertas.

## Integrações de UI

### Área de ferramentas
- Cadastro da ferramenta no catálogo:
  - `admin/Model/ToolModel.php`
- Ajuste de layout iframe:
  - `admin/tools/compatibility.css`

### Mockups -> Manual
- Botao no relatório de mockups para abrir manual:
  - `admin/tools/mockups/report.php`
  - `admin/tools/mockups/assets/js/report.js`

### Orcamento admin -> Persistência manual
- Bloco de manual adicionado em:
  - `admin/View/quotes/show.php`
- Recursos:
  - importar payload do `brand_manual_mvp_latest_v1`;
  - baixar JSON salvo no banco via `/admin/orcamentos/{id}/manual-marca.json`;
  - limpar campo;
  - exibir metadados do ultimo manual salvo;
  - informar tamanho aproximado do payload.

## Estrutura do payload consolidado (schema atual)
- `schema`: `brand_manual_mvp_v1`
- `generatedAt`
- `source`
- `template`
  - `id`
  - `name`
  - `themeClass`
  - `generatedSheets`
  - `structure[]`
- `storageKeys`
- `identity`
  - `project`
  - `colors[]`
  - `typography`
- `applications`
  - `mockups`
  - `digital.og`
- `integrationNotes[]`

## Regras de validação no backend
- Campo opcional: `manual_brand_payload`.
- Quando preenchido:
  - limite de tamanho: 2 MB;
  - precisa ser JSON valido (`json_decode` com objeto/array);
  - extracao de metadados:
    - `schema` -> `schema_version`
    - `source` -> `tool_source`
    - `generatedAt` -> `generated_at` (normalizado para `Y-m-d H:i:s` quando valido)
- Quando vazio:
  - nenhuma alteracao no manual salvo previamente.

## Arquivos impactados

### Novos
- `admin/tools/brandmanual/index.php`
- `admin/tools/brandmanual/assets/css/style.css`
- `admin/tools/brandmanual/assets/js/script.js`
- `database/upgrade_brand_manual_mvp.php`
- `docs/MVP_MANUAL_MARCA_IMPLEMENTACAO.md`

### Alterados
- `admin/Model/ToolModel.php`
- `admin/tools/compatibility.css`
- `admin/tools/mockups/report.php`
- `admin/tools/mockups/assets/js/report.js`
- `admin/Controller/QuoteController.php`
- `admin/Model/QuoteModel.php`
- `admin/View/quotes/show.php`
- `database/schema.sql`
- `README.md`
- `docs/INTEGRACAO_MANUAL_MARCA.md`

## Validacoes executadas nesta iteracao
- `php -l` sem erros em:
  - `admin/tools/brandmanual/index.php`
  - `admin/tools/mockups/report.php`
  - `admin/Model/ToolModel.php`
  - `admin/Controller/QuoteController.php`
  - `admin/Model/QuoteModel.php`
  - `admin/View/quotes/show.php`
  - `database/upgrade_brand_manual_mvp.php`
- Parse JS sem erro:
  - `admin/tools/brandmanual/assets/js/script.js`
  - `admin/tools/mockups/assets/js/report.js`
- Validacao funcional manual:
  - troca de templaté atualiza preview e payload (`template.*`)
  - impressão restringe saida ao painel `#brandbookPanel`
  - export HTML gera arquivo standalone com as páginas renderizadas

## Limitacoes conhecidas (estado atual)
- Persistência de captura ainda depende da sessao local para gerar payload inicial (fonte primaria continua em `localStorage`).
- Não existe versionamento histórico por solicitação (a tabela atual guarda última versão por `quote_request_id`).
- Não ha exibição do manual para o cliente no portal (`cliente/*`) nesta fase.
- `bgremove` e `ocimage` ainda não publicam de forma nativa no `AQBrandKit` (OG entra via `ogImageSettings`).
- Export HTML usa fontes externas (Google Fonts) quando online; offline, o arquivo usa fallback local.

## Riscos e mitigacoes
- Risco: ambiente antigo sem upgrade.
  - Mitigação: script `upgrade_brand_manual_mvp.php` + tentativa de `CREATE TABLE IF NOT EXISTS` no model.
- Risco: payload malformado enviado manualmente.
  - Mitigação: validação de tamanho e JSON no controller antes de persistir.
- Risco: warnings concorrentes (email/manual) no mesmo envio.
  - Mitigação: consolidação de warnings em uma única mensagem flash.

## Proximos passos recomendados
1. Criar histórico versionado (N:1) por `quote_request_id` em vez de sobrescrever.
2. Disponibilizar leitura controlada do manual no portal do cliente.
3. Evoluir para snapshots por ferramenta (`brand_project_snapshots`) quando entrar em fase 2.

