# Integracao Das Ferramentas Para Manual Da Marca

## Objetivo
Mapear as ferramentas atuais do projeto e definir um caminho pratico para interligar tudo em um relatorio completo de Manual da Marca / Identidade Visual.

## Status Atual Da Implementacao
- MVP iniciado em 2026-04-18 com a ferramenta `Brand Manual Report (MVP)`.
- Vinculo com `/admin/orcamentos/{id}` implementado em 2026-04-19 (importacao local + persistencia no banco por solicitacao).
- Template Studio MVP implementado em 2026-04-20 com 3 temas visuais e geracao automatica de 8 paginas.
- Endpoint de download seguro implementado em 2026-04-20: `/admin/orcamentos/{id}/manual-marca.json`.
- Tabela `brand_manual_reports` adicionada com upgrade dedicado (`database/upgrade_brand_manual_mvp.php`).
- Documentacao tecnica detalhada da entrega em:
  - `docs/MVP_MANUAL_MARCA_IMPLEMENTACAO.md`

## Diagnostico Atual

### O que ja esta integrado
- `Color Palette` publica paleta e cores no `AQBrandKit`.
- `Color Strategy Advisor` gera recomendacao e sincroniza com `AQBrandKit`.
- `Font Strategy Advisor` gera perfil tipografico e sincroniza com `AQBrandKit`.
- `Mockups (editor)` consome cores/fontes do `AQBrandKit` e salva snapshots de aplicacoes.
- `Mockups (report)` consolida cores + tipografia + mockups em JSON para anexo.

### Como a integracao atual acontece
- Barramento atual: `localStorage` (cliente/navegador), via `admin/tools/shared/brand-kit.js`.
- Chaves principais:
  - `aq_brand_kit_v1`
  - `aq_color_palette_state_v1`
  - `aq_font_profile_state_v1`
  - `mockuphub_saved_edits_v1`
  - `mockuphub_work_info_v1`

### Ferramentas ainda isoladas
- `bgremove`: processa imagem no servidor, sem sincronizacao com `AQBrandKit`.
- `ocimage`: salva estado proprio (`ogImageSettings`), sem sincronizacao com `AQBrandKit`.

## Lacunas Para Um Relatorio Completo
- Persistencia: agora existe registro backend por `quote_request`, mas sem historico/versionamento (sobrescreve ultima versao).
- Multiusuario: existe vinculo por solicitacao, mas ainda sem trilha completa de snapshots por ferramenta.
- Versionamento: nao existe versao formal de manual (v1, v2, aprovacao, etc.).
- Anexo nativo ao orcamento: o fluxo admin ja recebe, salva e permite download do payload, mas ainda sem visualizacao no portal cliente.
- Assets finais: logo tratado, OG assets e aplicacoes nao estao unificados em uma estrutura de projeto.

## Possibilidade Real De Interligacao
Sim, e totalmente viavel com baixo risco de arquitetura, porque o projeto ja tem 70% da base pronta:
1. Barramento comum (`AQBrandKit`) ja existe.
2. Mockups ja gera consolidado para relatorio.
3. Estrutura admin/quote ja permite anexar novos dados no fluxo.

## Arquitetura Recomendada (Atualizada)

### Fase 1 (MVP rapido)
Concluida:
- Criar um "Brand Manual Report" unificado no modulo de ferramentas.
- Consumir:
  - `AQBrandKit` (cores + tipografia + contexto)
  - `mockuphub_saved_edits_v1` (aplicacoes)
  - `ogImageSettings` (diretriz digital)
- Exportar JSON + PDF com secoes padrao de manual.
- Gerar preview rapido de brandbook com templates (`mono_arc`, `cobalt_grid`, `crimson_blob`).
- Habilitar impressao e export HTML standalone do brandbook.
- Incluir botao para copiar/associar o payload ao orcamento.

### Fase 1.5 (persistencia inicial)
Concluida:
- Persistencia por solicitacao em `brand_manual_reports`.
- Importacao do payload direto na tela de `/admin/orcamentos/{id}`.

### Fase 2 (producao e escala)
Com persistencia real no backend:
- Criar tabelas para projeto de marca e versoes do manual.
- Salvar snapshots por etapa (cores, fontes, mockups, OG, logo).
- Vincular `brand_manual_report` a `quote_request_id` e opcionalmente `quote_report_id`.
- Permitir reabertura, revisao e aprovacao por versao.

## Modelo De Dados Sugerido
- `brand_projects`
  - `id`, `quote_request_id`, `client_user_id`, `status`, `created_at`, `updated_at`
- `brand_project_snapshots`
  - `id`, `brand_project_id`, `tool_slug`, `payload_json`, `created_by_admin_id`, `created_at`
- `brand_manual_reports`
  - `id`, `brand_project_id`, `version`, `title`, `summary_json`, `pdf_path`, `status`, `created_at`
- `brand_manual_assets`
  - `id`, `brand_project_id`, `asset_type`, `file_path`, `meta_json`, `created_at`

## Estrutura Do Relatorio Completo (Manual)
- Capa e identificacao do projeto
- Essencia da marca (resumo estrategico)
- Sistema de cores
  - paleta principal e apoio
  - funcoes por cor (primaria, secundaria, acento, neutra)
  - contraste e acessibilidade minima
- Sistema tipografico
  - fonte principal/secundaria
  - hierarquia recomendada
  - tons e contexto de uso
- Aplicacoes visuais (mockups)
  - principais pecas aprovadas
  - observacoes por peca
- Diretriz digital
  - variacoes OG/social
- Regras de consistencia
  - usos recomendados e nao recomendados
- Anexo tecnico
  - payload JSON versionado

## Backlog Tecnico Prioritario
1. Evoluir para historico/versionamento (N versoes por solicitacao).
2. Criar entidade `brand_project` e snapshots por ferramenta (`brand_project_snapshots`).
3. Gerar PDF final com layout institucional e anexos visuais.
4. Exibir manual (somente leitura) no portal cliente junto ao orcamento.

## Riscos E Mitigacoes
- Risco: perda de dados por limpeza de navegador.
  - Mitigacao: persistencia backend ja ativa por solicitacao; proxima etapa e salvar versoes historicas.
- Risco: divergencia entre versoes do manual.
  - Mitigacao: implementar versionamento formal (tabela historica por versao) na Fase 2.
- Risco: mistura de dados entre projetos simultaneos.
  - Mitigacao: chave de contexto por `brand_project_id` em toda captura.

## Recomendacao Final
Fase 1 e Fase 1.5 ja criaram um fluxo operacional util. O proximo passo recomendado e focar em versionamento backend e publicacao controlada para cliente, transformando o MVP em processo auditavel de ponta a ponta.
