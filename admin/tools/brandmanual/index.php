<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brand Manual Report - MVP</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="../compatibility.css">
</head>
<body class="aq-tool-fluid aq-tool-brandmanual">
    <main class="page">
        <section class="hero">
            <p class="eyebrow">Nosfir Quotia Tools</p>
            <h1>Brand Manual Report (MVP)</h1>
            <p>Consolida cores, tipografia, mockups e diretriz digital em um único relatório para manual da marca.</p>
            <div class="hero-actions">
                <a class="btn ghost" href="../mockups/report.php">Abrir Relatório de Mockups</a>
                <a class="btn ghost" href="../mockups/editor.php">Abrir Editor de Mockups</a>
            </div>
        </section>

        <section class="panel stats-grid" id="summaryCards">
            <article class="stat-card">
                <small>Cores mapeadas</small>
                <strong id="summaryColorCount">0</strong>
            </article>
            <article class="stat-card">
                <small>Mockups encontrados</small>
                <strong id="summaryMockupCount">0</strong>
            </article>
            <article class="stat-card">
                <small>Diretriz OG</small>
                <strong id="summaryOgStatus">Sem dados</strong>
            </article>
            <article class="stat-card">
                <small>Atualização</small>
                <strong id="summaryUpdatedAt">-</strong>
            </article>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Template Studio (MVP)</h2>
                <span class="meta-tag" id="activeTemplateBadge">Template ativo</span>
            </div>
            <p class="muted">Escolha um template de brandbook para gerar páginas prontas em poucos cliques.</p>
            <div class="template-grid" id="templateGrid">
                <button type="button" class="template-card is-active" data-template-id="mono_arc">
                    <span class="template-preview mono"></span>
                    <strong>Monochrome Arc</strong>
                    <small>Editorial minimalista em preto e branco.</small>
                </button>
                <button type="button" class="template-card" data-template-id="cobalt_grid">
                    <span class="template-preview cobalt"></span>
                    <strong>Cobalt Grid</strong>
                    <small>Estilo corporativo azul com blocos e divisores.</small>
                </button>
                <button type="button" class="template-card" data-template-id="crimson_blob">
                    <span class="template-preview crimson"></span>
                    <strong>Crimson Blob</strong>
                    <small>Composição orgânica com contraste forte.</small>
                </button>
            </div>
            <section class="template-builder" id="templateBuilder">
                <div class="builder-head">
                    <h3>Template Builder (Drag and Drop)</h3>
                    <p class="muted">Crie templates customizados arrastando módulos para montar a estrutura do brandbook.</p>
                    <p class="builder-meta" id="templateBackupMeta">Backup: nenhum snapshot salvo.</p>
                    <p class="builder-meta" id="templateStrategyHint">Estratégia: ajuste modo e método para gerar estruturas inteligentes.</p>
                </div>
                <div class="builder-form">
                    <label class="builder-field">
                        <span>Nome do template</span>
                        <input type="text" id="customTemplateName" placeholder="Ex.: Quotia Studio Pro">
                    </label>
                    <label class="builder-field">
                        <span>Tema visual base</span>
                        <select id="customTemplateTheme">
                            <option value="mono_arc">Monochrome Arc</option>
                            <option value="cobalt_grid">Cobalt Grid</option>
                            <option value="crimson_blob">Crimson Blob</option>
                        </select>
                    </label>
                    <label class="builder-field">
                        <span>Kicker</span>
                        <input type="text" id="customTemplateKicker" placeholder="Ex.: Quotia Brand Framework">
                    </label>
                    <label class="builder-field">
                        <span>Mensagem final</span>
                        <input type="text" id="customTemplateClosing" placeholder="Ex.: Obrigado por construir com a gente.">
                    </label>
                    <label class="builder-field">
                        <span>Modo de importação</span>
                        <select id="importCustomTemplatesMode">
                            <option value="merge">Mesclar com existentes</option>
                            <option value="overwrite">Sobrescrever existentes</option>
                        </select>
                    </label>
                    <label class="builder-field">
                        <span>Modo do brandbook</span>
                        <select id="customTemplateBookMode">
                            <option value="complete">Brandbook completo</option>
                            <option value="mini">Mini brandbook</option>
                        </select>
                    </label>
                    <label class="builder-field">
                        <span>Método inteligente</span>
                        <select id="customTemplateSmartMethod">
                            <option value="smart_auto">Auto balanceado</option>
                            <option value="smart_identity">Foco identidade</option>
                            <option value="smart_showcase">Foco apresentação</option>
                            <option value="smart_digital">Foco digital</option>
                        </select>
                    </label>
                    <label class="builder-field">
                        <span>Variação mini brandbook</span>
                        <select id="customTemplateMiniVariant">
                            <option value="corporate">Corporativo</option>
                            <option value="editorial">Editorial</option>
                            <option value="social">Social</option>
                        </select>
                    </label>
                    <label class="builder-field">
                        <span>Preset mini brandbook</span>
                        <select id="miniGuidePreset">
                            <option value="none">Selecione um preset</option>
                            <option value="brand_snapshot">Brand Snapshot</option>
                            <option value="pitch">Pitch Deck</option>
                            <option value="social_campaign">Social Campaign</option>
                        </select>
                    </label>
                </div>
                <section class="template-palette-config" id="templatePaletteConfig">
                    <div class="template-palette-config-head">
                        <h4>Paleta do template</h4>
                        <label class="template-palette-toggle">
                            <input type="checkbox" id="customTemplateUsePaletteToggle">
                            <span>Forçar paleta do template no preview e exportações</span>
                        </label>
                    </div>
                    <p class="muted">Personalize as cores do template para reutilizar em qualquer projeto.</p>
                    <div class="template-palette-grid" id="customTemplatePaletteGrid">
                        <label class="builder-field">
                            <span>Primaria</span>
                            <input type="color" id="customTemplateColor1" value="#0f1117">
                        </label>
                        <label class="builder-field">
                            <span>Secundaria</span>
                            <input type="color" id="customTemplateColor2" value="#f8fafc">
                        </label>
                        <label class="builder-field">
                            <span>Acento</span>
                            <input type="color" id="customTemplateColor3" value="#d1d5db">
                        </label>
                        <label class="builder-field">
                            <span>Neutra</span>
                            <input type="color" id="customTemplateColor4" value="#6b7280">
                        </label>
                        <label class="builder-field">
                            <span>Apoio 1</span>
                            <input type="color" id="customTemplateColor5" value="#111827">
                        </label>
                        <label class="builder-field">
                            <span>Apoio 2</span>
                            <input type="color" id="customTemplateColor6" value="#9ca3af">
                        </label>
                    </div>
                    <div class="actions icon-toolbar">
                        <button type="button" class="btn ghost compact-icon-btn" id="useProjectPaletteBtn" aria-label="Usar cores do projeto" title="Usar cores do projeto" data-tooltip="Usar cores do projeto">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9"></path><path d="M12 3v9h9"></path><circle cx="8" cy="12" r="1.2"></circle><circle cx="12" cy="8" r="1.2"></circle><circle cx="16" cy="12" r="1.2"></circle></svg>
                        </button>
                        <button type="button" class="btn ghost compact-icon-btn" id="resetTemplatePaletteBtn" aria-label="Restaurar paleta do tema" title="Restaurar paleta do tema" data-tooltip="Restaurar paleta do tema">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v4h4"></path></svg>
                        </button>
                    </div>
                </section>
                <div class="builder-editor-layout">
                    <article class="builder-lane builder-lane-library">
                        <h4>Biblioteca de blocos</h4>
                        <p class="muted">Arraste os blocos para o canvas para montar o template.</p>
                        <div id="availableModules" class="module-list drop-list module-list-library" data-list-role="available"></div>
                    </article>
                    <article class="builder-lane builder-lane-canvas">
                        <div class="builder-lane-head">
                            <h4>Canvas do template</h4>
                            <small id="builderCanvasCount">0 bloco(s)</small>
                        </div>
                        <div id="activeModules" class="module-canvas drop-list" data-list-role="active"></div>
                    </article>
                    <aside class="builder-lane builder-lane-inspector" id="builderInspector">
                        <h4>Editor do bloco</h4>
                        <p class="muted">Selecione um bloco do canvas para editar nome, observação e largura.</p>
                        <label class="builder-field">
                            <span>Bloco selecionado</span>
                            <input type="text" id="builderSelectedModuleLabel" readonly>
                        </label>
                        <label class="builder-field">
                            <span>Título customizado</span>
                            <input type="text" id="builderBlockTitleOverride" placeholder="Ex.: Diretrizes de Cor">
                        </label>
                        <label class="builder-field">
                            <span>Observação do bloco</span>
                            <textarea id="builderBlockNote" rows="4" placeholder="Ex.: Focar em contraste AA e exemplos de uso."></textarea>
                        </label>
                        <label class="builder-field">
                            <span>Largura no canvas</span>
                            <select id="builderBlockSpan">
                                <option value="12">Largura total</option>
                                <option value="6">Meia largura</option>
                            </select>
                        </label>
                        <div class="actions icon-toolbar">
                            <button type="button" class="btn ghost compact-icon-btn" id="builderMoveBlockUpBtn" aria-label="Mover bloco para cima" title="Mover bloco para cima" data-tooltip="Mover bloco para cima">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M8 9l4-4 4 4"></path></svg>
                            </button>
                            <button type="button" class="btn ghost compact-icon-btn" id="builderMoveBlockDownBtn" aria-label="Mover bloco para baixo" title="Mover bloco para baixo" data-tooltip="Mover bloco para baixo">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M8 15l4 4 4-4"></path></svg>
                            </button>
                            <button type="button" class="btn ghost compact-icon-btn" id="builderRemoveBlockBtn" aria-label="Remover bloco do canvas" title="Remover bloco do canvas" data-tooltip="Remover bloco do canvas">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M9 7V5h6v2"></path><rect x="6" y="7" width="12" height="12" rx="2"></rect><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>
                            </button>
                            <button type="button" class="btn ghost compact-icon-btn" id="builderClearBlockEditBtn" aria-label="Limpar personalização do bloco" title="Limpar personalização do bloco" data-tooltip="Limpar personalização do bloco">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v4h4"></path></svg>
                            </button>
                        </div>
                    </aside>
                </div>
                <section class="designer-studio" id="designerStudio">
                    <div class="builder-lane-head">
                        <h4>Design Studio Pro (Beta)</h4>
                        <small id="designStudioMeta">Sem página ativa</small>
                    </div>
                    <label class="designer-toggle">
                        <input type="checkbox" id="useDesignStudioTemplate">
                        <span>Usar Design Studio no preview, render web e exportações</span>
                    </label>
                    <p class="muted">Crie templates livres em canvas (estilo Figma), com elementos arrastáveis e importação inteligente de JSON.</p>
                    <div class="designer-ribbon" id="designStudioRibbon">
                        <div class="designer-ribbon-tabs" role="tablist" aria-label="Guias do Design Studio">
                            <button type="button" class="designer-ribbon-tab is-active" data-design-ribbon-tab="home" role="tab" aria-selected="true">Página Inicial</button>
                            <button type="button" class="designer-ribbon-tab" data-design-ribbon-tab="insert" role="tab" aria-selected="false">Inserir</button>
                            <button type="button" class="designer-ribbon-tab" data-design-ribbon-tab="arrange" role="tab" aria-selected="false">Organizar</button>
                            <button type="button" class="designer-ribbon-tab" data-design-ribbon-tab="align" role="tab" aria-selected="false">Alinhar</button>
                            <button type="button" class="designer-ribbon-tab" data-design-ribbon-tab="style" role="tab" aria-selected="false">Estilo</button>
                            <button type="button" class="designer-ribbon-tab" data-design-ribbon-tab="integration" role="tab" aria-selected="false">Integração</button>
                        </div>
                        <div class="designer-ribbon-body">
                            <section class="designer-ribbon-panel is-active" data-design-ribbon-panel="home" role="tabpanel">
                                <div class="designer-ribbon-strip">
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonHomeCore"></div>
                                        <p class="designer-ribbon-group-label">Página e Seleção</p>
                                    </article>
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonHomeSnap"></div>
                                        <p class="designer-ribbon-group-label">Snap</p>
                                    </article>
                                </div>
                            </section>
                            <section class="designer-ribbon-panel" data-design-ribbon-panel="insert" role="tabpanel" hidden>
                                <div class="designer-ribbon-strip">
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonInsertText"></div>
                                        <p class="designer-ribbon-group-label">Texto</p>
                                    </article>
                                    <article class="designer-ribbon-group is-wide">
                                        <div class="designer-ribbon-tools" id="designRibbonInsertIllustrations"></div>
                                        <p class="designer-ribbon-group-label">Ilustrações</p>
                                    </article>
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonInsertElements"></div>
                                        <p class="designer-ribbon-group-label">Elementos</p>
                                    </article>
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonInsertMedia"></div>
                                        <p class="designer-ribbon-group-label">Mídia</p>
                                    </article>
                                </div>
                            </section>
                            <section class="designer-ribbon-panel" data-design-ribbon-panel="arrange" role="tabpanel" hidden>
                                <div class="designer-ribbon-strip">
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonArrangeEdit"></div>
                                        <p class="designer-ribbon-group-label">Editar</p>
                                    </article>
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonArrangeResize"></div>
                                        <p class="designer-ribbon-group-label">Dimensões</p>
                                    </article>
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonArrangeLayer"></div>
                                        <p class="designer-ribbon-group-label">Camadas</p>
                                    </article>
                                </div>
                            </section>
                            <section class="designer-ribbon-panel" data-design-ribbon-panel="align" role="tabpanel" hidden>
                                <div class="designer-ribbon-strip">
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonAlignCanvas"></div>
                                        <p class="designer-ribbon-group-label">No Canvas</p>
                                    </article>
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonAlignSelection"></div>
                                        <p class="designer-ribbon-group-label">Na Seleção</p>
                                    </article>
                                </div>
                            </section>
                            <section class="designer-ribbon-panel" data-design-ribbon-panel="style" role="tabpanel" hidden>
                                <div class="designer-ribbon-strip">
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonStyleTools"></div>
                                        <p class="designer-ribbon-group-label">Estilos</p>
                                    </article>
                                    <article class="designer-ribbon-group is-wide">
                                        <div class="designer-ribbon-tools" id="designRibbonStyleHints"></div>
                                        <p class="designer-ribbon-group-label">Atalhos</p>
                                    </article>
                                </div>
                            </section>
                            <section class="designer-ribbon-panel" data-design-ribbon-panel="integration" role="tabpanel" hidden>
                                <div class="designer-ribbon-strip">
                                    <article class="designer-ribbon-group is-wide">
                                        <div class="designer-ribbon-tools" id="designRibbonIntegrationMap"></div>
                                        <p class="designer-ribbon-group-label">Figma e Nomenclatura</p>
                                    </article>
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonIntegrationIo"></div>
                                        <p class="designer-ribbon-group-label">Cena</p>
                                    </article>
                                    <article class="designer-ribbon-group is-wide">
                                        <div class="designer-ribbon-tools" id="designRibbonTemplateOps"></div>
                                        <p class="designer-ribbon-group-label">Templates Custom</p>
                                    </article>
                                    <article class="designer-ribbon-group">
                                        <div class="designer-ribbon-tools" id="designRibbonPublishOps"></div>
                                        <p class="designer-ribbon-group-label">Publicação</p>
                                    </article>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div class="designer-controls">
                        <label class="builder-field">
                            <span>Página ativa</span>
                            <select id="designPageSelect"></select>
                        </label>
                                                <div class="actions designer-tool-grid cols-8">
                            <button type="button" class="btn ghost icon-btn" id="addDesignPageBtn" aria-label="Nova página" title="Nova página" data-tooltip="Nova página">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" id="duplicateDesignPageBtn" aria-label="Duplicar página" title="Duplicar página" data-tooltip="Duplicar página">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="7" width="10" height="12" rx="2"></rect><rect x="5" y="5" width="10" height="12" rx="2"></rect></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" id="removeDesignPageBtn" aria-label="Remover página" title="Remover página" data-tooltip="Remover página">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M9 7V5h6v2"></path><rect x="6" y="7" width="12" height="12" rx="2"></rect><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" id="buildSceneFromStructureBtn" aria-label="Gerar cena da estrutura" title="Gerar cena da estrutura" data-tooltip="Gerar cena da estrutura">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="7" height="6" rx="1.5"></rect><rect x="13" y="5" width="7" height="6" rx="1.5"></rect><rect x="4" y="13" width="7" height="6" rx="1.5"></rect><path d="M13 16h7"></path><path d="M16.5 13v6"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" id="designSelectAllBtn" aria-label="Selecionar tudo" title="Selecionar tudo" data-tooltip="Selecionar tudo">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"></rect><path d="M9 12l2.5 2.5L16 10"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" id="designClearSelectionBtn" aria-label="Limpar seleção múltipla" title="Limpar seleção múltipla" data-tooltip="Limpar seleção múltipla">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"></rect><path d="M8 8l8 8"></path><path d="M16 8l-8 8"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn is-active" id="designSnapGridBtn" aria-label="Snap grade ativo" title="Snap grade ativo" data-tooltip="Snap grade ativo">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M4 10h16"></path><path d="M4 16h16"></path><path d="M10 4v16"></path><path d="M16 4v16"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn is-active" id="designSnapElementBtn" aria-label="Snap elementos ativo" title="Snap elementos ativo" data-tooltip="Snap elementos ativo">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h5v5H7z"></path><path d="M12 12h5v5h-5z"></path><path d="M12 9h3"></path><path d="M9 12v3"></path><path d="M5 5l2 2"></path></svg>
                            </button>
                        </div>
                        <div class="designer-snap-panel">
                            <div class="designer-snap-row">
                                <p class="designer-snap-title">Ajuste Snap</p>
                                <button type="button" class="btn ghost icon-btn designer-snap-reset" id="designSnapResetBtn" aria-label="Restaurar snap padrão" title="Restaurar snap padrão" data-tooltip="Restaurar snap padrão">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v4h4"></path></svg>
                                </button>
                            </div>
                            <div class="designer-grid-2 designer-snap-grid">
                                <label class="builder-field">
                                    <span>Grade (px)</span>
                                    <input type="number" id="designSnapGridSize" min="4" max="120" step="1" inputmode="numeric">
                                </label>
                                <label class="builder-field">
                                    <span>Sensibilidade (px)</span>
                                    <input type="number" id="designSnapThreshold" min="2" max="24" step="1" inputmode="numeric">
                                </label>
                            </div>
                            <div class="designer-snap-presets" role="group" aria-label="Presets de snap">
                                <button type="button" class="btn ghost designer-snap-preset" data-snap-preset="precision" aria-label="Preset precisão" title="Preset precisão" data-tooltip="Preset precisão">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6"></circle><path d="M12 2v4"></path><path d="M12 18v4"></path><path d="M2 12h4"></path><path d="M18 12h4"></path></svg>
                                </button>
                                <button type="button" class="btn ghost designer-snap-preset" data-snap-preset="balanced" aria-label="Preset equilibrado" title="Preset equilibrado" data-tooltip="Preset equilibrado">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M4 10h16"></path><path d="M4 16h16"></path><path d="M10 4v16"></path><path d="M16 4v16"></path></svg>
                                </button>
                                <button type="button" class="btn ghost designer-snap-preset" data-snap-preset="free" aria-label="Preset livre" title="Preset livre" data-tooltip="Preset livre">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16c2.2-4.2 5.5-7.2 9-7 2.6.2 4.2 2.6 7 2.6"></path><circle cx="4" cy="16" r="1.2"></circle><circle cx="20" cy="11.6" r="1.2"></circle></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="designer-controls designer-insert-source">
                        <div class="designer-insert-source-group" id="designInsertSourceText">
                            <p class="designer-insert-source-label">Texto</p>
                            <div class="designer-insert-library-head">
                                <button type="button" class="btn ghost designer-office-main-btn" id="designInsertTextToggle" aria-expanded="false" aria-controls="designInsertTextPanel" title="Abrir biblioteca de texto">
                                    <span class="designer-office-main-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24"><path d="M5 6h14"></path><path d="M7 11h10"></path><path d="M9 16h6"></path></svg>
                                    </span>
                                    <span class="designer-office-main-copy">
                                        <strong>Texto</strong>
                                        <small>Tipografia</small>
                                    </span>
                                    <span class="designer-office-main-caret" aria-hidden="true">
                                        <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"></path></svg>
                                    </span>
                                </button>
                                <div class="actions designer-tool-grid designer-library-quick-row">
                                    <button type="button" class="btn ghost icon-btn" data-design-add="title" aria-label="Adicionar título" title="Adicionar título" data-tooltip="Adicionar título">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14"></path><path d="M12 6v12"></path><path d="M8 18h8"></path></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="subtitle" aria-label="Adicionar subtitulo" title="Adicionar subtitulo" data-tooltip="Adicionar subtitulo">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M7 12h10"></path><path d="M9 17h6"></path></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="text" aria-label="Adicionar texto" title="Adicionar texto" data-tooltip="Adicionar texto">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M5 12h10"></path><path d="M5 17h14"></path></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="cta_button" aria-label="Adicionar botao CTA" title="Adicionar botao CTA" data-tooltip="Adicionar botao CTA">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="3"></rect><path d="M9 12h6"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div class="designer-insert-library" id="designInsertTextPanel" hidden>
                                <section class="designer-insert-library-group">
                                    <p class="designer-insert-library-title">Titulos e Copy</p>
                                    <div class="designer-insert-library-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="title" aria-label="Adicionar título" title="Adicionar título">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14"></path><path d="M12 6v12"></path><path d="M8 18h8"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="subtitle" aria-label="Adicionar subtitulo" title="Adicionar subtitulo">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M7 12h10"></path><path d="M9 17h6"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="text" aria-label="Adicionar texto" title="Adicionar texto">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M5 12h10"></path><path d="M5 17h14"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="bullet_list" aria-label="Adicionar lista" title="Adicionar lista">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6.5" cy="7" r="1.2"></circle><circle cx="6.5" cy="12" r="1.2"></circle><circle cx="6.5" cy="17" r="1.2"></circle><path d="M10 7h8"></path><path d="M10 12h8"></path><path d="M10 17h8"></path></svg>
                                        </button>
                                    </div>
                                </section>
                                <section class="designer-insert-library-group">
                                    <p class="designer-insert-library-title">Apoio</p>
                                    <div class="designer-insert-library-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="cta_button" aria-label="Adicionar botao CTA" title="Adicionar botao CTA">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="3"></rect><path d="M9 12h6"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="divider" aria-label="Adicionar divisor" title="Adicionar divisor">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18"></path><circle cx="12" cy="12" r="1.2"></circle></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="tag_chip" aria-label="Adicionar tag" title="Adicionar tag">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5-7h9v14h-9z"></path><circle cx="12.5" cy="9" r="1.1"></circle></svg>
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div class="designer-insert-source-group" id="designInsertSourceIllustrations">
                            <p class="designer-insert-source-label">Ilustrações</p>
                            <div class="designer-insert-illustrations-head designer-insert-library-head">
                                <button type="button" class="btn ghost designer-office-main-btn" id="designInsertShapesToggle" aria-expanded="false" aria-controls="designInsertShapesPanel" title="Abrir biblioteca de formas">
                                    <span class="designer-office-main-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24"><rect x="4" y="6" width="7" height="7" rx="1.2"></rect><circle cx="17.5" cy="9.5" r="3.5"></circle><path d="M8 17h12"></path><path d="M14 14l4 3-4 3"></path></svg>
                                    </span>
                                    <span class="designer-office-main-copy">
                                        <strong>Formas</strong>
                                        <small>Primitivas</small>
                                    </span>
                                    <span class="designer-office-main-caret" aria-hidden="true">
                                        <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"></path></svg>
                                    </span>
                                </button>
                                <div class="actions designer-tool-grid designer-shape-quick-row">
                                    <button type="button" class="btn ghost icon-btn" data-design-add="shape_rect" aria-label="Retangulo" title="Retangulo" data-tooltip="Retangulo">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="1.5"></rect></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="shape_round_rect" aria-label="Retangulo arredondado" title="Retangulo arredondado" data-tooltip="Retangulo arredondado">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="4"></rect></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="shape_ellipse" aria-label="Elipse" title="Elipse" data-tooltip="Elipse">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="8" ry="5.5"></ellipse></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="shape_triangle" aria-label="Triangulo" title="Triangulo" data-tooltip="Triangulo">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l8 14H4z"></path></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="shape_diamond" aria-label="Losango" title="Losango" data-tooltip="Losango">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l8 8-8 8-8-8z"></path></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="shape_line" aria-label="Linha" title="Linha" data-tooltip="Linha">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div class="designer-shape-gallery" id="designInsertShapesPanel" hidden>
                                <section class="designer-shape-gallery-group">
                                    <p class="designer-shape-gallery-title">Formas usadas recentemente</p>
                                    <div class="designer-shape-gallery-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_rect" aria-label="Retangulo" title="Retangulo">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="1.5"></rect></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_round_rect" aria-label="Retangulo arredondado" title="Retangulo arredondado">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="4"></rect></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_ellipse" aria-label="Elipse" title="Elipse">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="8" ry="5.5"></ellipse></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_triangle" aria-label="Triangulo" title="Triangulo">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l8 14H4z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_hexagon" aria-label="Hexagono" title="Hexagono">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8l4 8-4 8H8l-4-8z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_star" aria-label="Estrela" title="Estrela">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2l-5.6 3 1.1-6.2L3 9.6l6.2-.9z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_arrow_right" aria-label="Seta direita" title="Seta direita">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14"></path><path d="M13 7l7 5-7 5"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_line" aria-label="Linha" title="Linha">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16"></path></svg>
                                        </button>
                                    </div>
                                </section>
                                <section class="designer-shape-gallery-group">
                                    <p class="designer-shape-gallery-title">Linhas</p>
                                    <div class="designer-shape-gallery-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_line" aria-label="Linha reta" title="Linha reta">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="divider" aria-label="Divisor" title="Divisor">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18"></path><circle cx="12" cy="12" r="1.1"></circle></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_arrow_right" aria-label="Linha com seta direita" title="Linha com seta direita">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h14"></path><path d="M14 8l6 4-6 4"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_arrow_left" aria-label="Linha com seta esquerda" title="Linha com seta esquerda">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H6"></path><path d="M10 8l-6 4 6 4"></path></svg>
                                        </button>
                                    </div>
                                </section>
                                <section class="designer-shape-gallery-group">
                                    <p class="designer-shape-gallery-title">Retangulos</p>
                                    <div class="designer-shape-gallery-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_rect" aria-label="Retangulo" title="Retangulo">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10"></rect></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_round_rect" aria-label="Retangulo arredondado" title="Retangulo arredondado">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="4"></rect></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_parallelogram" aria-label="Paralelogramo" title="Paralelogramo">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 6h13l-3 12H4z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_trapezoid" aria-label="Trapezio" title="Trapezio">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h8l4 12H4z"></path></svg>
                                        </button>
                                    </div>
                                </section>
                                <section class="designer-shape-gallery-group">
                                    <p class="designer-shape-gallery-title">Formas Basicas</p>
                                    <div class="designer-shape-gallery-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_ellipse" aria-label="Elipse" title="Elipse">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="8" ry="5.5"></ellipse></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_triangle" aria-label="Triangulo" title="Triangulo">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l8 14H4z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_diamond" aria-label="Losango" title="Losango">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l8 8-8 8-8-8z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_pentagon" aria-label="Pentagono" title="Pentagono">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l8 6-3 10H7L4 10z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_hexagon" aria-label="Hexagono" title="Hexagono">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8l4 8-4 8H8l-4-8z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_octagon" aria-label="Octogono" title="Octogono">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6l6 6v6l-6 6H9l-6-6V9z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_star" aria-label="Estrela" title="Estrela">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.2l-5.6 3 1.1-6.2L3 9.6l6.2-.9z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_heart" aria-label="Coração" title="Coração">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_cloud" aria-label="Nuvem" title="Nuvem">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18h10a4 4 0 0 0 .6-7.9A5.5 5.5 0 0 0 7.8 8.2 3.8 3.8 0 0 0 7 18z"></path></svg>
                                        </button>
                                    </div>
                                </section>
                                <section class="designer-shape-gallery-group">
                                    <p class="designer-shape-gallery-title">Setas Largas</p>
                                    <div class="designer-shape-gallery-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_arrow_left" aria-label="Seta esquerda" title="Seta esquerda">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H8"></path><path d="M11 7l-7 5 7 5"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_arrow_right" aria-label="Seta direita" title="Seta direita">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h12"></path><path d="M13 7l7 5-7 5"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_arrow_up" aria-label="Seta cima" title="Seta cima">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V8"></path><path d="M7 11l5-7 5 7"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_arrow_down" aria-label="Seta baixo" title="Seta baixo">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12"></path><path d="M7 13l5 7 5-7"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_chevron_left" aria-label="Chevron esquerda" title="Chevron esquerda">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-8 7 8 7"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_chevron_right" aria-label="Chevron direita" title="Chevron direita">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l8 7-8 7"></path></svg>
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div class="designer-insert-source-group" id="designInsertSourceElements">
                            <p class="designer-insert-source-label">Elementos</p>
                            <div class="designer-insert-library-head">
                                <button type="button" class="btn ghost designer-office-main-btn" id="designInsertElementsToggle" aria-expanded="false" aria-controls="designInsertElementsPanel" title="Abrir biblioteca de elementos">
                                    <span class="designer-office-main-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24"><rect x="4" y="5" width="7" height="6" rx="1.4"></rect><rect x="13" y="5" width="7" height="6" rx="1.4"></rect><rect x="4" y="13" width="7" height="6" rx="1.4"></rect><rect x="13" y="13" width="7" height="6" rx="1.4"></rect></svg>
                                    </span>
                                    <span class="designer-office-main-copy">
                                        <strong>Elementos</strong>
                                        <small>Cards e Blocos</small>
                                    </span>
                                    <span class="designer-office-main-caret" aria-hidden="true">
                                        <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"></path></svg>
                                    </span>
                                </button>
                                <div class="actions designer-tool-grid designer-library-quick-row">
                                    <button type="button" class="btn ghost icon-btn" data-design-add="stat_card" aria-label="Adicionar card de metrica" title="Adicionar card de metrica" data-tooltip="Card de metrica">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 15v-4"></path><path d="M12 15V9"></path><path d="M16 15v-2"></path></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="info_card" aria-label="Adicionar info card" title="Adicionar info card" data-tooltip="Info card">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 9h8"></path><path d="M8 13h6"></path><path d="M8 16h5"></path></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="quote_block" aria-label="Adicionar citação" title="Adicionar citação" data-tooltip="Citação">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9h4v4H7z"></path><path d="M13 9h4v4h-4z"></path><path d="M7 13c0 2-1.2 3-3 3"></path><path d="M13 13c0 2-1.2 3-3 3"></path></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="comparison_card" aria-label="Adicionar comparação" title="Adicionar comparação" data-tooltip="Comparação">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="7" height="12" rx="1.5"></rect><rect x="13" y="6" width="7" height="12" rx="1.5"></rect><path d="M11 12h2"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div class="designer-insert-library" id="designInsertElementsPanel" hidden>
                                <section class="designer-insert-library-group">
                                    <p class="designer-insert-library-title">Blocos Base</p>
                                    <div class="designer-insert-library-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape" aria-label="Adicionar bloco" title="Adicionar bloco">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_rect" aria-label="Adicionar retangulo" title="Adicionar retangulo">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="10" rx="1.5"></rect></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_ellipse" aria-label="Adicionar elipse" title="Adicionar elipse">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="12" rx="8" ry="5.5"></ellipse></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_triangle" aria-label="Adicionar triangulo" title="Adicionar triangulo">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l8 14H4z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_diamond" aria-label="Adicionar losango" title="Adicionar losango">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4l8 8-8 8-8-8z"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="shape_line" aria-label="Adicionar linha" title="Adicionar linha">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16"></path></svg>
                                        </button>
                                    </div>
                                </section>
                                <section class="designer-insert-library-group">
                                    <p class="designer-insert-library-title">Cards</p>
                                    <div class="designer-insert-library-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="stat_card" aria-label="Adicionar card de metrica" title="Adicionar card de metrica">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 15v-4"></path><path d="M12 15V9"></path><path d="M16 15v-2"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="info_card" aria-label="Adicionar info card" title="Adicionar info card">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 9h8"></path><path d="M8 13h6"></path><path d="M8 16h5"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="quote_block" aria-label="Adicionar citação" title="Adicionar citação">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9h4v4H7z"></path><path d="M13 9h4v4h-4z"></path><path d="M7 13c0 2-1.2 3-3 3"></path><path d="M13 13c0 2-1.2 3-3 3"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="timeline_step" aria-label="Adicionar etapa de timeline" title="Adicionar etapa de timeline">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2"></circle><path d="M8 12h11"></path><path d="M14 9h5"></path><path d="M14 15h5"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="comparison_card" aria-label="Adicionar comparação" title="Adicionar comparação">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="7" height="12" rx="1.5"></rect><rect x="13" y="6" width="7" height="12" rx="1.5"></rect><path d="M11 12h2"></path></svg>
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div class="designer-insert-source-group" id="designInsertSourceMedia">
                            <p class="designer-insert-source-label">Mídia</p>
                            <div class="designer-insert-library-head">
                                <button type="button" class="btn ghost designer-office-main-btn" id="designInsertMediaToggle" aria-expanded="false" aria-controls="designInsertMediaPanel" title="Abrir biblioteca de mídia">
                                    <span class="designer-office-main-icon" aria-hidden="true">
                                        <svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M8 14l3-3 2 2 3-3 2 4"></path></svg>
                                    </span>
                                    <span class="designer-office-main-copy">
                                        <strong>Mídia</strong>
                                        <small>Marca e Mockups</small>
                                    </span>
                                    <span class="designer-office-main-caret" aria-hidden="true">
                                        <svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"></path></svg>
                                    </span>
                                </button>
                                <div class="actions designer-tool-grid designer-library-quick-row">
                                    <button type="button" class="btn ghost icon-btn" data-design-add="logo_box" aria-label="Adicionar logo box" title="Adicionar logo box" data-tooltip="Logo box">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="5" width="15" height="14" rx="2"></rect><path d="M8 15l3-4 3 3 2-2 2 3"></path></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="color_row" aria-label="Adicionar paleta" title="Adicionar paleta" data-tooltip="Paleta">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="2.2"></circle><circle cx="12" cy="12" r="2.2"></circle><circle cx="17" cy="12" r="2.2"></circle></svg>
                                    </button>
                                    <button type="button" class="btn ghost icon-btn" data-design-add="mockup_slot" aria-label="Adicionar mockup slot" title="Adicionar mockup slot" data-tooltip="Mockup slot">
                                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M8 14l3-3 2 2 3-3 2 4"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div class="designer-insert-library" id="designInsertMediaPanel" hidden>
                                <section class="designer-insert-library-group">
                                    <p class="designer-insert-library-title">Identidade</p>
                                    <div class="designer-insert-library-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="logo_box" aria-label="Adicionar logo box" title="Adicionar logo box">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="5" width="15" height="14" rx="2"></rect><path d="M8 15l3-4 3 3 2-2 2 3"></path></svg>
                                        </button>
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="color_row" aria-label="Adicionar paleta" title="Adicionar paleta">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="2.2"></circle><circle cx="12" cy="12" r="2.2"></circle><circle cx="17" cy="12" r="2.2"></circle></svg>
                                        </button>
                                    </div>
                                </section>
                                <section class="designer-insert-library-group">
                                    <p class="designer-insert-library-title">Aplicações</p>
                                    <div class="designer-insert-library-grid">
                                        <button type="button" class="btn ghost icon-btn designer-shape-cell" data-design-add="mockup_slot" aria-label="Adicionar mockup slot" title="Adicionar mockup slot">
                                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M8 14l3-3 2 2 3-3 2 4"></path></svg>
                                        </button>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                    <div class="designer-layout">
                        <article class="builder-lane designer-canvas-wrap">
                            <h4>Canvas Visual</h4>
                            <div class="designer-canvas-scroll">
                                <div id="designStudioCanvas" class="designer-canvas"></div>
                            </div>
                        </article>
                                                <aside class="builder-lane designer-inspector">
                            <div class="designer-inspector-head">
                                <h4>Inspector de Elemento</h4>
                                <p class="builder-meta">Painel contextual para ajustes do elemento selecionado.</p>
                            </div>
                            <div class="designer-inspector-tabs" role="tablist" aria-label="Guias do inspector">
                                <button type="button" class="btn ghost designer-inspector-tab icon-btn is-active" data-design-inspector-tab="content" aria-selected="true" aria-label="Guia conteúdo" title="Guia conteúdo" data-tooltip="Conteúdo">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M5 12h10"></path><path d="M5 17h14"></path></svg>
                                </button>
                                <button type="button" class="btn ghost designer-inspector-tab icon-btn" data-design-inspector-tab="transform" aria-selected="false" aria-label="Guia transformação" title="Guia transformação" data-tooltip="Transformação">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18"></path><path d="M12 3v18"></path><path d="M7 8l-4 4 4 4"></path><path d="M17 8l4 4-4 4"></path><path d="M8 7l4-4 4 4"></path><path d="M8 17l4 4 4-4"></path></svg>
                                </button>
                                <button type="button" class="btn ghost designer-inspector-tab icon-btn" data-design-inspector-tab="appearance" aria-selected="false" aria-label="Guia aparência" title="Guia aparência" data-tooltip="Aparência">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18h1.2a2.8 2.8 0 0 0 0-5.6h-.6A2.6 2.6 0 0 1 10 12.8 2.8 2.8 0 0 1 12.8 10H15a6 6 0 0 0-3-7z"></path><circle cx="7" cy="10" r="1"></circle><circle cx="9.5" cy="7" r="1"></circle><circle cx="13" cy="6.2" r="1"></circle></svg>
                                </button>
                                <button type="button" class="btn ghost designer-inspector-tab icon-btn" data-design-inspector-tab="actions" aria-selected="false" aria-label="Guia ações" title="Guia ações" data-tooltip="Ações">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4"></path><path d="M12 17v4"></path><path d="M4.9 4.9l2.8 2.8"></path><path d="M16.3 16.3l2.8 2.8"></path><path d="M3 12h4"></path><path d="M17 12h4"></path><path d="M4.9 19.1l2.8-2.8"></path><path d="M16.3 7.7l2.8-2.8"></path><circle cx="12" cy="12" r="3.2"></circle></svg>
                                </button>
                            </div>
                            <div class="designer-inspector-body">
                                <section class="designer-inspector-panel is-active" data-design-inspector-panel="content">
                                    <div class="designer-inspector-group">
                                        <div class="designer-inspector-group-head">
                                            <span class="designer-inspector-group-icon" role="img" aria-label="Conteúdo e metadados" title="Conteúdo e metadados" data-tooltip="Conteúdo e metadados">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M5 12h10"></path><path d="M5 17h14"></path></svg>
                                            </span>
                                        </div>
                                        <label class="builder-field">
                                            <span>Elemento selecionado</span>
                                            <input type="text" id="designElementMeta" readonly>
                                        </label>
                                        <label class="builder-field">
                                            <span>Conteúdo</span>
                                            <textarea id="designElementText" rows="3" placeholder="Use tokens como {{project.title}} e {{palette.1}}"></textarea>
                                        </label>
                                    </div>
                                </section>
                                <section class="designer-inspector-panel" data-design-inspector-panel="transform" hidden>
                                    <div class="designer-inspector-group">
                                        <div class="designer-inspector-group-head">
                                            <span class="designer-inspector-group-icon" role="img" aria-label="Posicao e tamanho" title="Posicao e tamanho" data-tooltip="Posicao e tamanho">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18"></path><path d="M12 3v18"></path><path d="M7 8l-4 4 4 4"></path><path d="M17 8l4 4-4 4"></path><path d="M8 7l4-4 4 4"></path><path d="M8 17l4 4 4-4"></path></svg>
                                            </span>
                                        </div>
                                        <div class="designer-grid-2">
                                            <label class="builder-field">
                                                <span>X</span>
                                                <input type="number" id="designElementX" min="0" step="1">
                                            </label>
                                            <label class="builder-field">
                                                <span>Y</span>
                                                <input type="number" id="designElementY" min="0" step="1">
                                            </label>
                                            <label class="builder-field">
                                                <span>Largura</span>
                                                <input type="number" id="designElementW" min="20" step="1">
                                            </label>
                                            <label class="builder-field">
                                                <span>Altura</span>
                                                <input type="number" id="designElementH" min="20" step="1">
                                            </label>
                                        </div>
                                    </div>
                                    <div class="designer-inspector-group">
                                        <div class="designer-inspector-group-head">
                                            <span class="designer-inspector-group-icon" role="img" aria-label="Ajuste rápido" title="Ajuste rápido" data-tooltip="Ajuste rápido">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path><path d="M4 7h5"></path><path d="M15 17h5"></path></svg>
                                            </span>
                                        </div>
                                        <div class="actions designer-tool-grid cols-4">
                                            <button type="button" class="btn ghost icon-btn" id="designResizeWMinusBtn" aria-label="Diminuir largura" title="Diminuir largura" data-tooltip="Diminuir largura">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18"></path><path d="M7 8l-4 4 4 4"></path><path d="M17 8l4 4-4 4"></path><path d="M10 12h4"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designResizeWPlusBtn" aria-label="Aumentar largura" title="Aumentar largura" data-tooltip="Aumentar largura">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18"></path><path d="M7 8l-4 4 4 4"></path><path d="M17 8l4 4-4 4"></path><path d="M12 10v4"></path><path d="M10 12h4"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designResizeHMinusBtn" aria-label="Diminuir altura" title="Diminuir altura" data-tooltip="Diminuir altura">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"></path><path d="M8 7l4-4 4 4"></path><path d="M8 17l4 4 4-4"></path><path d="M10 12h4"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designResizeHPlusBtn" aria-label="Aumentar altura" title="Aumentar altura" data-tooltip="Aumentar altura">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"></path><path d="M8 7l4-4 4 4"></path><path d="M8 17l4 4 4-4"></path><path d="M12 10v4"></path><path d="M10 12h4"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="designer-inspector-group">
                                        <div class="designer-inspector-group-head">
                                            <span class="designer-inspector-group-icon" role="img" aria-label="Camadas e alinhamento" title="Camadas e alinhamento" data-tooltip="Camadas e alinhamento">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="4" rx="1.5"></rect><rect x="6" y="11" width="12" height="4" rx="1.5"></rect><rect x="8" y="16" width="8" height="4" rx="1.5"></rect></svg>
                                            </span>
                                        </div>
                                        <div class="actions designer-tool-grid cols-4">
                                            <button type="button" class="btn ghost icon-btn" id="designLayerBackBtn" aria-label="Enviar para tras" title="Enviar para tras" data-tooltip="Enviar para tras">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="12" y="7" width="8" height="8" rx="1.5"></rect><rect x="4" y="9" width="8" height="8" rx="1.5"></rect><path d="M9 5L5 8l4 3"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designLayerFrontBtn" aria-label="Trazer para frente" title="Trazer para frente" data-tooltip="Trazer para frente">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="8" height="8" rx="1.5"></rect><rect x="12" y="9" width="8" height="8" rx="1.5"></rect><path d="M15 5l4 3-4 3"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designLayerBottomBtn" aria-label="Enviar para o fundo" title="Enviar para o fundo" data-tooltip="Enviar para o fundo">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="13" y="7" width="7" height="7" rx="1.5"></rect><rect x="5" y="10" width="7" height="7" rx="1.5"></rect><path d="M11 4L6 8l5 4"></path><path d="M8 4L3 8l5 4"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designLayerTopBtn" aria-label="Trazer para o topo" title="Trazer para o topo" data-tooltip="Trazer para o topo">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="7" height="7" rx="1.5"></rect><rect x="12" y="10" width="7" height="7" rx="1.5"></rect><path d="M13 4l5 4-5 4"></path><path d="M16 4l5 4-5 4"></path></svg>
                                            </button>
                                        </div>
                                        <div class="actions designer-tool-grid cols-6">
                                            <button type="button" class="btn ghost icon-btn" id="designAlignLeftBtn" aria-label="Alinhar a esquerda" title="Alinhar a esquerda" data-tooltip="Alinhar a esquerda">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4v16"></path><path d="M8 8h10"></path><path d="M8 12h7"></path><path d="M8 16h12"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designAlignCenterBtn" aria-label="Centralizar horizontal" title="Centralizar horizontal" data-tooltip="Centralizar horizontal">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16"></path><path d="M6 8h12"></path><path d="M8 12h8"></path><path d="M5 16h14"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designAlignRightBtn" aria-label="Alinhar a direita" title="Alinhar a direita" data-tooltip="Alinhar a direita">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 4v16"></path><path d="M6 8h10"></path><path d="M9 12h7"></path><path d="M4 16h12"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designAlignTopBtn" aria-label="Alinhar no topo" title="Alinhar no topo" data-tooltip="Alinhar no topo">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16"></path><path d="M8 8v10"></path><path d="M12 8v7"></path><path d="M16 8v12"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designAlignMiddleBtn" aria-label="Centralizar vertical" title="Centralizar vertical" data-tooltip="Centralizar vertical">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16"></path><path d="M8 6v12"></path><path d="M12 8v8"></path><path d="M16 5v14"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designAlignBottomBtn" aria-label="Alinhar na base" title="Alinhar na base" data-tooltip="Alinhar na base">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16"></path><path d="M8 6v10"></path><path d="M12 9v7"></path><path d="M16 4v12"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="designer-inspector-group">
                                        <div class="designer-inspector-group-head">
                                            <span class="designer-inspector-group-icon" role="img" aria-label="Seleção múltipla" title="Seleção múltipla" data-tooltip="Seleção múltipla">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="7" height="7" rx="1.5"></rect><rect x="13" y="6" width="7" height="7" rx="1.5"></rect><rect x="8.5" y="14" width="7" height="7" rx="1.5"></rect></svg>
                                            </span>
                                        </div>
                                        <div class="actions designer-tool-grid cols-10">
                                            <button type="button" class="btn ghost icon-btn" id="designAlignSelLeftBtn" aria-label="Alinhar seleção pela esquerda" title="Alinhar seleção pela esquerda" data-tooltip="Alinhar seleção pela esquerda">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4v16"></path><rect x="8" y="6" width="4" height="4" rx="1"></rect><rect x="8" y="12" width="8" height="4" rx="1"></rect></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designAlignSelCenterBtn" aria-label="Centralizar seleção na horizontal" title="Centralizar seleção na horizontal" data-tooltip="Centralizar seleção na horizontal">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16"></path><rect x="8" y="6" width="8" height="4" rx="1"></rect><rect x="10" y="12" width="4" height="4" rx="1"></rect></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designAlignSelRightBtn" aria-label="Alinhar seleção pela direita" title="Alinhar seleção pela direita" data-tooltip="Alinhar seleção pela direita">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 4v16"></path><rect x="12" y="6" width="4" height="4" rx="1"></rect><rect x="8" y="12" width="8" height="4" rx="1"></rect></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designAlignSelTopBtn" aria-label="Alinhar seleção no topo" title="Alinhar seleção no topo" data-tooltip="Alinhar seleção no topo">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16"></path><rect x="6" y="8" width="4" height="8" rx="1"></rect><rect x="12" y="8" width="4" height="4" rx="1"></rect></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designAlignSelMiddleBtn" aria-label="Centralizar seleção na vertical" title="Centralizar seleção na vertical" data-tooltip="Centralizar seleção na vertical">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16"></path><rect x="6" y="8" width="4" height="8" rx="1"></rect><rect x="12" y="10" width="4" height="4" rx="1"></rect></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designAlignSelBottomBtn" aria-label="Alinhar seleção na base" title="Alinhar seleção na base" data-tooltip="Alinhar seleção na base">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16"></path><rect x="6" y="8" width="4" height="8" rx="1"></rect><rect x="12" y="12" width="4" height="4" rx="1"></rect></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designDistributeHBtn" aria-label="Distribuir horizontal" title="Distribuir horizontal" data-tooltip="Distribuir horizontal">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="3" height="10" rx="1"></rect><rect x="10.5" y="7" width="3" height="10" rx="1"></rect><rect x="17" y="7" width="3" height="10" rx="1"></rect><path d="M7 12h3.2"></path><path d="M13.5 12H17"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designDistributeVBtn" aria-label="Distribuir vertical" title="Distribuir vertical" data-tooltip="Distribuir vertical">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="4" width="10" height="3" rx="1"></rect><rect x="7" y="10.5" width="10" height="3" rx="1"></rect><rect x="7" y="17" width="10" height="3" rx="1"></rect><path d="M12 7v3.2"></path><path d="M12 13.5V17"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designDistributeCenterHBtn" aria-label="Distribuir centros na horizontal" title="Distribuir centros na horizontal" data-tooltip="Distribuir centros na horizontal">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="3" height="10" rx="1"></rect><rect x="10.5" y="6" width="3" height="12" rx="1"></rect><rect x="17" y="8" width="3" height="8" rx="1"></rect><circle cx="5.5" cy="12" r="0.8"></circle><circle cx="12" cy="12" r="0.8"></circle><circle cx="18.5" cy="12" r="0.8"></circle><path d="M6.3 12h4.9"></path><path d="M12.8 12h4.9"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designDistributeCenterVBtn" aria-label="Distribuir centros na vertical" title="Distribuir centros na vertical" data-tooltip="Distribuir centros na vertical">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="4" width="10" height="3" rx="1"></rect><rect x="6" y="10.5" width="12" height="3" rx="1"></rect><rect x="8" y="17" width="8" height="3" rx="1"></rect><circle cx="12" cy="5.5" r="0.8"></circle><circle cx="12" cy="12" r="0.8"></circle><circle cx="12" cy="18.5" r="0.8"></circle><path d="M12 6.3v4.9"></path><path d="M12 12.8v4.9"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </section>
                                <section class="designer-inspector-panel" data-design-inspector-panel="appearance" hidden>
                                    <div class="designer-inspector-group">
                                        <div class="designer-inspector-group-head">
                                            <span class="designer-inspector-group-icon" role="img" aria-label="Texto e estilo" title="Texto e estilo" data-tooltip="Texto e estilo">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M12 7v10"></path><path d="M9 17h6"></path><circle cx="18" cy="17" r="2"></circle></svg>
                                            </span>
                                        </div>
                                        <div class="designer-grid-2">
                                            <label class="builder-field">
                                                <span>Fonte (px)</span>
                                                <input type="number" id="designElementFontSize" min="8" max="96" step="1">
                                            </label>
                                            <label class="builder-field">
                                                <span>Alinhamento</span>
                                                <select id="designElementAlign">
                                                    <option value="left">Esquerda</option>
                                                    <option value="center">Centro</option>
                                                    <option value="right">Direita</option>
                                                </select>
                                            </label>
                                            <label class="builder-field">
                                                <span>Cor texto</span>
                                                <input type="color" id="designElementColor" value="#142036">
                                            </label>
                                            <label class="builder-field">
                                                <span>Cor fundo</span>
                                                <input type="color" id="designElementBg" value="#ffffff">
                                            </label>
                                            <label class="builder-field">
                                                <span>Arredondamento</span>
                                                <input type="number" id="designElementRadius" min="0" max="80" step="1">
                                            </label>
                                            <label class="builder-field">
                                                <span>Opacidade (%)</span>
                                                <input type="number" id="designElementOpacity" min="5" max="100" step="1">
                                            </label>
                                        </div>
                                    </div>
                                    <div class="designer-inspector-group">
                                        <div class="designer-inspector-group-head">
                                            <span class="designer-inspector-group-icon" role="img" aria-label="Clipboard de estilo" title="Clipboard de estilo" data-tooltip="Clipboard de estilo">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="10" height="10" rx="2"></rect><rect x="5" y="5" width="10" height="10" rx="2"></rect></svg>
                                            </span>
                                        </div>
                                        <div class="actions designer-tool-grid cols-3">
                                            <button type="button" class="btn ghost icon-btn" id="designCopyStyleBtn" aria-label="Copiar estilo" title="Copiar estilo" data-tooltip="Copiar estilo">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="10" height="10" rx="2"></rect><rect x="5" y="5" width="10" height="10" rx="2"></rect></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designPasteStyleBtn" aria-label="Colar estilo" title="Colar estilo" data-tooltip="Colar estilo">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10v4H7z"></path><rect x="5" y="8" width="14" height="12" rx="2"></rect><path d="M9 12h6"></path><path d="M9 16h4"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="designToggleLockBtn" aria-label="Bloquear elemento" title="Bloquear elemento" data-tooltip="Bloquear elemento">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="10" width="12" height="10" rx="2"></rect><path d="M8 10V8a4 4 0 0 1 8 0v2"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </section>
                                <section class="designer-inspector-panel" data-design-inspector-panel="actions" hidden>
                                    <div class="designer-inspector-group">
                                        <div class="designer-inspector-group-head">
                                            <span class="designer-inspector-group-icon" role="img" aria-label="Operações" title="Operações" data-tooltip="Operações">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4"></path><path d="M12 17v4"></path><path d="M4.9 4.9l2.8 2.8"></path><path d="M16.3 16.3l2.8 2.8"></path><path d="M3 12h4"></path><path d="M17 12h4"></path><path d="M4.9 19.1l2.8-2.8"></path><path d="M16.3 7.7l2.8-2.8"></path><circle cx="12" cy="12" r="3.2"></circle></svg>
                                            </span>
                                        </div>
                                        <div class="actions designer-tool-grid cols-3">
                                            <button type="button" class="btn ghost icon-btn" id="duplicateDesignElementBtn" aria-label="Duplicar elemento" title="Duplicar elemento" data-tooltip="Duplicar elemento">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="10" height="10" rx="2"></rect><rect x="5" y="5" width="10" height="10" rx="2"></rect></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="removeDesignElementBtn" aria-label="Remover elemento" title="Remover elemento" data-tooltip="Remover elemento">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M9 7V5h6v2"></path><rect x="6" y="7" width="12" height="12" rx="2"></rect><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>
                                            </button>
                                            <button type="button" class="btn ghost icon-btn" id="resetDesignElementStyleBtn" aria-label="Resetar estilo" title="Resetar estilo" data-tooltip="Resetar estilo">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v4h4"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="designer-inspector-group">
                                        <div class="designer-inspector-group-head">
                                            <span class="designer-inspector-group-icon" role="img" aria-label="Atalhos" title="Atalhos" data-tooltip="Atalhos">
                                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="7" width="17" height="10" rx="2"></rect><path d="M6.5 10h1.5"></path><path d="M9.5 10H11"></path><path d="M12.5 10H14"></path><path d="M15.5 10H17"></path><path d="M6.5 14h6"></path><path d="M14 14h3"></path></svg>
                                            </span>
                                        </div>
                                        <p class="builder-meta designer-shortcuts-note">
                                            Ctrl/Cmd + clique (multi) | arraste no fundo para selecionar area | Ctrl/Cmd + A (selecionar tudo) | Esc (limpar multi) | setas movem | Shift + setas move 10px | Alt + setas redimensiona | Delete remove | snap tambem no resize.
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </aside>
                    </div>
                    <div class="designer-import">
                        <div class="designer-mapping">
                            <label class="builder-field">
                                <span>Preset de Nomenclatura (Figma)</span>
                                <select id="figmaNamingPresetSelect">
                                    <option value="balanced">Balanced (Recomendado)</option>
                                    <option value="strict_brand">Strict Brand</option>
                                    <option value="social_campaign">Social Campaign</option>
                                    <option value="product_ui">Product UI</option>
                                </select>
                            </label>
                            <label class="builder-field">
                                <span>Regras customizadas (opcional)</span>
                                <textarea id="figmaNamingCustomRules" rows="4" placeholder="module.cover = capa,cover,hero&#10;element.mockup_slot = mockup,photo,image&#10;ignore = hidden,guide,temp&#10;title_min_size = 42"></textarea>
                            </label>
                                                        <div class="actions designer-tool-grid cols-2">
                                <button type="button" class="btn ghost icon-btn" id="applyFigmaNamingPresetBtn" aria-label="Aplicar preset de nomenclatura" title="Aplicar preset de nomenclatura" data-tooltip="Aplicar preset de nomenclatura">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4 10-10"></path></svg>
                                </button>
                                <button type="button" class="btn ghost icon-btn" id="resetFigmaNamingRulesBtn" aria-label="Resetar regras de nomenclatura" title="Resetar regras de nomenclatura" data-tooltip="Resetar regras de nomenclatura">
                                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v4h4"></path></svg>
                                </button>
                            </div>
                        </div>
                                                <div class="actions designer-tool-grid cols-3">
                            <button type="button" class="btn ghost icon-btn" id="importFigmaJsonBtn" aria-label="Importar JSON Figma" title="Importar JSON Figma" data-tooltip="Importar JSON Figma">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"></path><path d="M8 11l4 4 4-4"></path><rect x="4" y="17" width="16" height="4" rx="1"></rect></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" id="exportDesignSceneBtn" aria-label="Exportar cena" title="Exportar cena" data-tooltip="Exportar cena">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V9"></path><path d="M8 13l4-4 4 4"></path><rect x="4" y="3" width="16" height="4" rx="1"></rect></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" id="importDesignSceneBtn" aria-label="Importar cena" title="Importar cena" data-tooltip="Importar cena">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"></path><path d="M8 11l4 4 4-4"></path><rect x="4" y="17" width="16" height="4" rx="1"></rect><path d="M5 17h14"></path></svg>
                            </button>
                        </div>
                        <input type="file" id="importFigmaJsonFile" class="aq-hidden" accept=".json,application/json">
                        <input type="file" id="importDesignSceneFile" class="aq-hidden" accept=".json,application/json">
                    </div>
                </section>
                <div class="actions mt-compact icon-toolbar">
                    <button type="button" class="btn compact-icon-btn" id="createCustomTemplateBtn" aria-label="Salvar template custom" title="Salvar template custom" data-tooltip="Salvar template custom">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h11l3 3v11H5z"></path><path d="M8 5v6h8V5"></path><rect x="8" y="14" width="8" height="5" rx="1"></rect></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="resetBuilderBtn" aria-label="Restaurar estrutura padrão" title="Restaurar estrutura padrão" data-tooltip="Restaurar estrutura padrão">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v4h4"></path></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="applySmartTemplateBtn" aria-label="Aplicar método inteligente" title="Aplicar método inteligente" data-tooltip="Aplicar método inteligente">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.2L20 9l-4 4 .9 6L12 16.9 7.1 19l.9-6-4-4 5.4-.8z"></path></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="applyMiniPresetBtn" aria-label="Aplicar preset mini" title="Aplicar preset mini" data-tooltip="Aplicar preset mini">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M8 10h8"></path><path d="M8 14h5"></path></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="duplicateCustomTemplateBtn" aria-label="Duplicar template ativo" title="Duplicar template ativo" data-tooltip="Duplicar template ativo">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="10" height="10" rx="2"></rect><rect x="5" y="5" width="10" height="10" rx="2"></rect></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="removeCustomTemplateBtn" aria-label="Remover template ativo" title="Remover template ativo" data-tooltip="Remover template ativo">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M9 7V5h6v2"></path><rect x="6" y="7" width="12" height="12" rx="2"></rect><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="exportCustomTemplatesBtn" aria-label="Exportar templates custom" title="Exportar templates custom" data-tooltip="Exportar templates custom">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V9"></path><path d="M8 13l4-4 4 4"></path><rect x="4" y="3" width="16" height="4" rx="1"></rect></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="importCustomTemplatesBtn" aria-label="Importar templates custom" title="Importar templates custom" data-tooltip="Importar templates custom">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"></path><path d="M8 11l4 4 4-4"></path><rect x="4" y="17" width="16" height="4" rx="1"></rect></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="createTemplateBackupBtn" aria-label="Criar backup" title="Criar backup" data-tooltip="Criar backup">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v14H5z"></path><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="restoreTemplateBackupBtn" aria-label="Restaurar backup" title="Restaurar backup" data-tooltip="Restaurar backup">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v4h4"></path><path d="M12 8v5l3 2"></path></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="downloadTemplateBackupBtn" aria-label="Baixar backup" title="Baixar backup" data-tooltip="Baixar backup">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"></path><path d="M8 11l4 4 4-4"></path><rect x="4" y="17" width="16" height="4" rx="1"></rect><path d="M6 17h12"></path></svg>
                    </button>
                    <input type="file" id="importCustomTemplatesFile" class="aq-hidden" accept=".json,application/json">
                </div>
            </section>
            <div class="actions mt-compact icon-toolbar">
                <button type="button" class="btn compact-icon-btn" id="printTemplateBtn" aria-label="Imprimir ou exportar PDF" title="Imprimir ou exportar PDF" data-tooltip="Imprimir ou exportar PDF">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="6"></rect><rect x="5" y="10" width="14" height="8" rx="2"></rect><rect x="7" y="14" width="10" height="7"></rect></svg>
                </button>
                <button type="button" class="btn ghost compact-icon-btn" id="openTemplateRenderBtn" aria-label="Abrir render web" title="Abrir render web" data-tooltip="Abrir render web">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="M2 12h20"></path><path d="M12 4a12 12 0 0 1 0 16"></path><path d="M12 4a12 12 0 0 0 0 16"></path></svg>
                </button>
                <button type="button" class="btn ghost compact-icon-btn" id="downloadTemplateHtmlBtn" aria-label="Baixar HTML do brandbook" title="Baixar HTML do brandbook" data-tooltip="Baixar HTML do brandbook">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8l-4 4 4 4"></path><path d="M17 8l4 4-4 4"></path><path d="M10 20h4"></path><path d="M11 4h2l-2 12h2"></path></svg>
                </button>
            </div>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Informações do Projeto</h2>
                <span class="meta-tag" id="projectMainTag">Sem tag</span>
            </div>
            <div class="project-grid">
                <article class="project-card">
                    <small>Título</small>
                    <strong id="projectTitle">Não definido</strong>
                </article>
                <article class="project-card">
                    <small>Descrição</small>
                    <p id="projectDescription">Sem descrição registrada.</p>
                </article>
                <article class="project-card">
                    <small>Tags de apoio</small>
                    <p id="projectSupportingTags">Sem tags de apoio.</p>
                </article>
            </div>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Playbook de Execução</h2>
                <span class="meta-tag" id="playbookScoreBadge">0% pronto</span>
            </div>
            <p class="muted">Defina regras operacionais para tornar o brandbook aplicável em tarefas reais de design, marketing e desenvolvimento.</p>
            <div class="playbook-grid">
                <label class="builder-field">
                    <span>Respiro do logo</span>
                    <input type="text" id="logoClearspaceInput" placeholder="Ex.: 1x altura do simbolo">
                </label>
                <label class="builder-field">
                    <span>Tamanho mínimo digital</span>
                    <input type="text" id="logoMinDigitalInput" placeholder="Ex.: 32px">
                </label>
                <label class="builder-field">
                    <span>Tamanho mínimo impresso</span>
                    <input type="text" id="logoMinPrintInput" placeholder="Ex.: 18mm">
                </label>
                <label class="builder-field">
                    <span>Primária (%)</span>
                    <input type="number" min="0" max="100" id="ratioPrimaryInput" placeholder="60">
                </label>
                <label class="builder-field">
                    <span>Secundária (%)</span>
                    <input type="number" min="0" max="100" id="ratioSecondaryInput" placeholder="30">
                </label>
                <label class="builder-field">
                    <span>Acento (%)</span>
                    <input type="number" min="0" max="100" id="ratioAccentInput" placeholder="10">
                </label>
                <label class="builder-field">
                    <span>Palavras-chave da voz da marca</span>
                    <input type="text" id="voiceKeywordsInput" placeholder="Ex.: claro, confiável, objetivo">
                </label>
                <label class="builder-field">
                    <span>Estilo de CTA</span>
                    <input type="text" id="ctaStyleInput" placeholder="Ex.: Verbo de ação + benefício direto">
                </label>
                <label class="builder-field">
                    <span>Direção de imagery</span>
                    <input type="text" id="imageryDirectionInput" placeholder="Ex.: fotos reais com fundo limpo">
                </label>
                <label class="builder-field">
                    <span>Estilo de iconografia</span>
                    <input type="text" id="iconStyleInput" placeholder="Ex.: ícones simples com cantos suaves">
                </label>
                <label class="builder-field">
                    <span>Responsável do brandbook</span>
                    <input type="text" id="ownerNameInput" placeholder="Ex.: Nome do responsável">
                </label>
                <label class="builder-field">
                    <span>Ciclo de revisão (dias)</span>
                    <input type="number" min="1" max="365" id="reviewCycleDaysInput" placeholder="30">
                </label>
            </div>
            <div class="playbook-grid">
                <fieldset class="playbook-fieldset">
                    <legend>Canais de entrega</legend>
                    <label><input type="checkbox" name="playbook_channels" value="web"> Website</label>
                    <label><input type="checkbox" name="playbook_channels" value="social"> Social</label>
                    <label><input type="checkbox" name="playbook_channels" value="ads"> Ads</label>
                    <label><input type="checkbox" name="playbook_channels" value="print"> Impresso</label>
                    <label><input type="checkbox" name="playbook_channels" value="presentation"> Apresentação</label>
                </fieldset>
                <fieldset class="playbook-fieldset">
                    <legend>Ativos obrigatórios</legend>
                    <label><input type="checkbox" name="playbook_assets" value="logo_color"> Logo colorido</label>
                    <label><input type="checkbox" name="playbook_assets" value="logo_reverse"> Logo reverso</label>
                    <label><input type="checkbox" name="playbook_assets" value="logo_bw"> Logo preto/branco</label>
                    <label><input type="checkbox" name="playbook_assets" value="palette_tokens"> Tokens de paleta</label>
                    <label><input type="checkbox" name="playbook_assets" value="social_templates"> Templates sociais</label>
                    <label><input type="checkbox" name="playbook_assets" value="pdf_manual"> Manual PDF</label>
                </fieldset>
            </div>
            <ul id="playbookChecklist" class="notes"></ul>
            <p id="playbookScoreText" class="muted">Aplicabilidade: 0% pronto.</p>
            <div class="actions">
                <button type="button" class="btn" id="savePracticalSettingsBtn">Salvar Playbook</button>
                <button type="button" class="btn ghost" id="resetPracticalSettingsBtn">Resetar Playbook</button>
                <button type="button" class="btn ghost" id="copyCssTokensBtn">Copiar Tokens CSS</button>
                <button type="button" class="btn ghost" id="downloadCssTokensBtn">Baixar Tokens CSS</button>
                <button type="button" class="btn ghost" id="downloadExecutionBriefBtn">Baixar Execution Brief</button>
            </div>
        </section>

        <section class="panel split">
            <div>
                <h2>Sistema de Cores</h2>
                <p class="muted">Fonte principal: Brand Kit e sincronizações do fluxo de ferramentas.</p>
                <div id="paletteGrid" class="palette-grid"></div>
            </div>
            <div>
                <h2>Sistema Tipográfico</h2>
                <div id="typographySummary" class="typography-summary"></div>
            </div>
        </section>

        <section class="panel split">
            <div>
                <h2>Diretriz Digital (OG)</h2>
                <div id="ogSummary" class="og-summary"></div>
            </div>
            <div>
                <h2>Observações de Integração</h2>
                <ul id="integrationNotes" class="notes"></ul>
            </div>
        </section>

        <section class="panel">
            <h2>Aplicações em Mockups</h2>
            <p class="muted">Amostras encontradas no fluxo do editor. Selecione no módulo de mockups para atualizar este painel.</p>
            <div id="mockupsGrid" class="mockups-grid"></div>
            <p id="mockupsEmpty" class="empty-note aq-hidden">Nenhum mockup salvo no navegador atual.</p>
        </section>

        <section class="panel brandbook-panel" id="brandbookPanel">
            <div class="panel-header">
                <h2>Pré-visualização Rápida do Brandbook</h2>
                <div class="preview-head-meta">
                    <span class="meta-tag" id="brandbookPagesBadge">8 páginas geradas</span>
                    <span class="sync-badge is-idle" id="previewSyncBadge" title="Diagnóstico de sincronização">Sync: aguardando</span>
                </div>
            </div>
            <p class="muted">Template preenchido automaticamente com os dados do projeto para acelerar apresentações de brandbook.</p>
            <p class="sync-meta" id="previewSyncMeta">Última atualização: -</p>
            <div class="sync-actions">
                <button type="button" class="btn ghost sync-test-btn" id="previewSyncTestBtn">Forçar teste de sync</button>
            </div>
            <div id="brandbookPreview" class="brandbook-preview"></div>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Payload Consolidado (MVP)</h2>
                <span class="meta-tag">JSON versionado</span>
            </div>
            <p class="muted">Use este payload para anexos operacionais, CRMs e futuras etapas de persistência em banco.</p>
            <textarea id="manualPayload" readonly></textarea>
            <div class="actions">
                <button type="button" class="btn" id="refreshBtn">Atualizar</button>
                <button type="button" class="btn ghost" id="copyBtn">Copiar JSON</button>
                <button type="button" class="btn ghost" id="downloadJsonBtn">Baixar JSON</button>
                <button type="button" class="btn" id="downloadPdfBtn">Baixar PDF</button>
                <label class="pdf-template-control">
                    Modelo PDF
                    <select id="brandManualPdfTemplate">
                        <option value="full">Brandbook Completo</option>
                        <option value="mini">Mini Brand Guide</option>
                    </select>
                </label>
            </div>
            <p id="statusLine" class="status-line">Aguardando consolidação de dados.</p>
        </section>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/script.js"></script>
    <script src="../shared/workflow-assistant.js"></script>
</body>
</html>

