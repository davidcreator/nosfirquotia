# Integracao Das Ferramentas Para Manual Da Marca

## Objetivo
Mapear as ferramentas atuais do projeto e definir um caminho prático para interligar tudo em um relatório completo de Manual da Marca / Identidade Visual.

## Status Atual Da Implementacao
- MVP iniciado em 2026-04-18 com a ferramenta `Brand Manual Report (MVP)`.
- Vínculo com `/admin/orcamentos/{id}` implementado em 2026-04-19 (importação local + persistência no banco por solicitação).
- Templaté Studio MVP implementado em 2026-04-20 com 3 temas visuais e geração automática de 8 páginas.
- Endpoint de download seguro implementado em 2026-04-20: `/admin/orcamentos/{id}/manual-marca.json`.
- Tabela `brand_manual_reports` adicionada com upgrade dedicado (`database/upgrade_brand_manual_mvp.php`).
- Revisão PT-BR + normalização UTF-8 aplicada em 2026-05-04 nas interfaces de apoio ao fluxo integrado.
- Camada de compatibilidade visual/mobile consolidada em 2026-05-05 para padronização de leitura, contraste e comportamento responsivo entre ferramentas.
- Documentação técnica detalhada da entrega em:
  - `docs/MVP_MANUAL_MARCA_IMPLEMENTACAO.md`

## Atualização desta documentação (05/05/2026)
- Registro da consolidação de UX responsiva e legibilidade entre ferramentas administrativas.
- Documentado o uso da folha compartilhada `admin/tools/compatibility.css` como camada de convergencia visual.
- Confirmada preservação de cores semânticas para status técnicos e blocos de qualidade.

## Atualizacao anterior (04/05/2026)
- Registro do ciclo de Correção de acentuacao e consistencia textual.
- Mantidas as chaves tecnicas internas (ex.: `confianca`, `avaliacao`) para evitar quebra de integração entre ferramentas.

## Diagnostico Atual

### O que já esta integrado
- `Color Palette` publica paleta e cores no `AQBrandKit`.
- `Color Strategy Advisor` gera recomendacao e sincroniza com `AQBrandKit`.
- `Font Strategy Advisor` gera perfil tipografico e sincroniza com `AQBrandKit`.
- `Mockups (editor)` consome cores/fontes do `AQBrandKit` e salva snapshots de aplicações.
- `Mockups (report)` consolida cores + tipografia + mockups em JSON para anexo.

### Como a integração atual acontece
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

## Lacunas Para Um Relatório Completo
- Persistência: agora existe registro backend por `quote_request`, mas sem histórico/versionamento (sobrescreve última versão).
- Multiusuário: existe vínculo por solicitação, mas ainda sem trilha completa de snapshots por ferramenta.
- Versionamento: não existe versão formal de manual (v1, v2, aprovação, etc.).
- Anexo nativo ao orçamento: o fluxo admin já recebe, salva e permite download do payload, mas ainda sem visualização no portal cliente.
- Assets finais: logo tratado, OG assets e aplicações não estão unificados em uma estrutura de projeto.

## Possibilidade Real De Interligação
Sim, é totalmente viável com baixo risco de arquitetura, porque o projeto já tem 70% da base pronta:
1. Barramento comum (`AQBrandKit`) já existe.
2. Mockups já gera consolidado para relatório.
3. Estrutura admin/quote já permite anexar novos dados no fluxo.

## Arquitetura Recomendada (Atualizada)

### Fase 1 (MVP rápido)
Concluída:
- Criar um "Brand Manual Report" unificado no módulo de ferramentas.
- Consumir:
  - `AQBrandKit` (cores + tipografia + contexto)
  - `mockuphub_saved_edits_v1` (aplicações)
  - `ogImageSettings` (diretriz digital)
- Exportar JSON + PDF com seções padrão de manual.
- Gerar preview rápido de brandbook com templates (`mono_arc`, `cobalt_grid`, `crimson_blob`).
- Habilitar impressão e export HTML standalone do brandbook.
- Incluir botão para copiar/associar o payload ao orçamento.

### Fase 1.5 (persistência inicial)
Concluida:
- Persistência por solicitação em `brand_manual_reports`.
- Importacao do payload direto na tela de `/admin/orcamentos/{id}`.

### Fase 2 (producao e escala)
Com persistência real no backend:
- Criar tabelas para projeto de marca e versões do manual.
- Salvar snapshots por etapa (cores, fontes, mockups, OG, logo).
- Vincular `brand_manual_report` a `quote_request_id` e opcionalmente `quote_report_id`.
- Permitir reabertura, Revisão e aprovação por versão.

## Modelo De Dados Sugerido
- `brand_projects`
  - `id`, `quote_request_id`, `client_user_id`, `status`, `created_at`, `updated_at`
- `brand_project_snapshots`
  - `id`, `brand_project_id`, `tool_slug`, `payload_json`, `created_by_admin_id`, `created_at`
- `brand_manual_reports`
  - `id`, `brand_project_id`, `version`, `title`, `summary_json`, `pdf_path`, `status`, `created_at`
- `brand_manual_assets`
  - `id`, `brand_project_id`, `asset_type`, `file_path`, `meta_json`, `created_at`

## Estrutura Do Relatório Completo (Manual)
- Capa e identificacao do projeto
- Essencia da marca (resumo estratégico)
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
  - variações OG/social
- Regras de consistencia
  - usos recomendados e não recomendados
- Anexo técnico
  - payload JSON versionado

## Backlog Tecnico Prioritario
1. Evoluir para histórico/versionamento (N versões por solicitação).
2. Criar entidade `brand_project` e snapshots por ferramenta (`brand_project_snapshots`).
3. Gerar PDF final com layout institucional e anexos visuais.
4. Exibir manual (somente leitura) no portal cliente junto ao orçamento.

## Riscos E Mitigacoes
- Risco: perda de dados por limpeza de navegador.
  - Mitigação: persistência backend já ativa por solicitação; proxima etapa e salvar versões historicas.
- Risco: divergencia entre versões do manual.
  - Mitigação: implementar versionamento formal (tabela historica por versão) na Fase 2.
- Risco: mistura de dados entre projetos simultaneos.
  - Mitigação: chave de contexto por `brand_project_id` em toda captura.

## Recomendacao Final
Fase 1 e Fase 1.5 já criaram um fluxo operacional útil. O próximo passo recomendado e focar em versionamento backend e publicação controlada para cliente, transformando o MVP em processo auditável de ponta a ponta.
