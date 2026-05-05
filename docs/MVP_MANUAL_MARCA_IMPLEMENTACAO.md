# MVP Manual da Marca - Implementacao Tecnica

## Linha do tempo
- 2026-04-18: criacao da ferramenta `Brand Manual Report (MVP)` com consolidacao local + export JSON/PDF.
- 2026-04-19: evolucao para persistencia backend e vinculo direto ao fluxo de `/admin/orcamentos/{id}`.
- 2026-04-20: implementacao do `Template Studio` com preview de brandbook em 8 paginas, impressao e export HTML standalone.
- 2026-04-20: endpoint admin para download seguro do JSON persistido do manual da marca por solicitacao.
- 2026-05-04: revisao de linguagem (PT-BR) e padronizacao UTF-8 nas interfaces e mensagens das ferramentas integradas.
- 2026-05-05: consolidacao final de responsividade mobile e legibilidade nas ferramentas via `admin/tools/compatibility.css`, com preservacao de cores semanticas e contraste do tema Quotia.

## Atualizacao desta documentacao (05/05/2026)
- Inclui registro da consolidacao visual/mobile e da camada de compatibilidade compartilhada.
- Formaliza os ajustes de contraste, espacos e tipografia nas ferramentas para reduzir divergencia entre layouts.
- Preserva regras semanticas de cor em blocos de status/qualidade e blocos OG com texto branco.
- Confirma validacoes tecnicas de consistencia de CSS (estrutura e regressao visual basica).

## Atualizacao anterior (04/05/2026)
- Inclui registro do ciclo de padronizacao textual/encoding.
- Confirma validacoes tecnicas executadas apos os ajustes (`php -l` e `node --check`).

## Objetivo desta frente
Disponibilizar um fluxo funcional de manual da marca com:
- consolidacao das ferramentas de identidade visual;
- exportacoes operacionais (JSON/PDF);
- templates prontos para aceleracao de brandbooks;
- capacidade de vincular/salvar o manual no contexto da solicitacao de orcamento.

## Escopo implementado (estado atual)

### 1) Ferramenta consolidada no painel admin
- Ferramenta: `Brand Manual Report (MVP)`.
- Slug/entrada: `brandmanual` (`/admin/ferramentas/brandmanual`).
- Arquivos:
  - `admin/tools/brandmanual/index.php`
  - `admin/tools/brandmanual/assets/css/style.css`
  - `admin/tools/brandmanual/assets/js/script.js`

### 1.1) Template Studio (novo nesta iteracao)
- Templates MVP disponiveis:
  - `mono_arc` (preto/branco editorial)
  - `cobalt_grid` (corporativo azul)
  - `crimson_blob` (organico com contraste)
- Renderizacao automatica de 8 paginas no preview:
  - capa
  - indice
  - paleta
  - tipografia
  - sistema de logo
  - aplicacoes (mockups)
  - diretriz digital (OG)
  - encerramento
- Novas saidas:
  - impressao direta do brandbook (`window.print`)
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

### 3) Persistencia de cache para integracao com orcamento
- Novo cache local do payload consolidado:
  - `brand_manual_mvp_latest_v1`
- Uso: importar automaticamente no formulario de `/admin/orcamentos/{id}`.

### 4) Vinculo no fluxo de orcamento (admin)
- Tela de solicitacao admin recebeu bloco `Manual da Marca (MVP)` com:
  - botao para abrir ferramenta de manual;
  - botao para importar ultimo payload do navegador;
  - textarea JSON para revisao/edicao;
  - validacao no backend ao salvar o relatorio.
- Persistencia no banco junto da geracao/atualizacao do relatorio.

## Persistencia backend (nova nesta iteracao)

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
  - unifica mensagens de warning para nao sobrescrever alertas.

## Integracoes de UI

### Area de ferramentas
- Cadastro da ferramenta no catalogo:
  - `admin/Model/ToolModel.php`
- Ajuste de layout iframe:
  - `admin/tools/compatibility.css`

### Mockups -> Manual
- Botao no relatorio de mockups para abrir manual:
  - `admin/tools/mockups/report.php`
  - `admin/tools/mockups/assets/js/report.js`

### Orcamento admin -> Persistencia manual
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

## Regras de validacao no backend
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
  - troca de template atualiza preview e payload (`template.*`)
  - impressao restringe saida ao painel `#brandbookPanel`
  - export HTML gera arquivo standalone com as paginas renderizadas

## Limitacoes conhecidas (estado atual)
- Persistencia de captura ainda depende da sessao local para gerar payload inicial (fonte primaria continua em `localStorage`).
- Nao existe versionamento historico por solicitacao (a tabela atual guarda ultima versao por `quote_request_id`).
- Nao ha exibicao do manual para o cliente no portal (`cliente/*`) nesta fase.
- `bgremove` e `ocimage` ainda nao publicam de forma nativa no `AQBrandKit` (OG entra via `ogImageSettings`).
- Export HTML usa fontes externas (Google Fonts) quando online; offline, o arquivo usa fallback local.

## Riscos e mitigacoes
- Risco: ambiente antigo sem upgrade.
  - Mitigacao: script `upgrade_brand_manual_mvp.php` + tentativa de `CREATE TABLE IF NOT EXISTS` no model.
- Risco: payload malformado enviado manualmente.
  - Mitigacao: validacao de tamanho e JSON no controller antes de persistir.
- Risco: warnings concorrentes (email/manual) no mesmo envio.
  - Mitigacao: consolidacao de warnings em uma unica mensagem flash.

## Proximos passos recomendados
1. Criar historico versionado (N:1) por `quote_request_id` em vez de sobrescrever.
2. Disponibilizar leitura controlada do manual no portal do cliente.
3. Evoluir para snapshots por ferramenta (`brand_project_snapshots`) quando entrar em fase 2.
