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
            <p>Consolida cores, tipografia, mockups e diretriz digital em um Ãºnico relatÃ³rio para manual da marca.</p>
            <div class="hero-actions">
                <a class="btn ghost" href="../mockups/report.php">Abrir RelatÃ³rio de Mockups</a>
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
                <small>AtualizaÃ§Ã£o</small>
                <strong id="summaryUpdatedAt">-</strong>
            </article>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Template Studio (MVP)</h2>
                <span class="meta-tag" id="activeTemplateBadge">Template ativo</span>
            </div>
            <p class="muted">Escolha um template de brandbook para gerar paginas prontas em poucos cliques.</p>
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
                    <small>ComposiÃ§Ã£o orgÃ¢nica com contraste forte.</small>
                </button>
            </div>
            <section class="template-builder" id="templateBuilder">
                <div class="builder-head">
                    <h3>Template Builder (Drag and Drop)</h3>
                    <p class="muted">Crie templates customizados arrastando modulos para montar a estrutura do brandbook.</p>
                    <p class="builder-meta" id="templateBackupMeta">Backup: nenhum snapshot salvo.</p>
                    <p class="builder-meta" id="templateStrategyHint">Estrategia: ajuste modo e metodo para gerar estruturas inteligentes.</p>
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
                        <span>Modo de importacao</span>
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
                        <span>Metodo inteligente</span>
                        <select id="customTemplateSmartMethod">
                            <option value="smart_auto">Auto balanceado</option>
                            <option value="smart_identity">Foco identidade</option>
                            <option value="smart_showcase">Foco apresentacao</option>
                            <option value="smart_digital">Foco digital</option>
                        </select>
                    </label>
                    <label class="builder-field">
                        <span>Variacao mini brandbook</span>
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
                        <p class="muted">Selecione um bloco do canvas para editar nome, observacao e largura.</p>
                        <label class="builder-field">
                            <span>Bloco selecionado</span>
                            <input type="text" id="builderSelectedModuleLabel" readonly>
                        </label>
                        <label class="builder-field">
                            <span>Titulo customizado</span>
                            <input type="text" id="builderBlockTitleOverride" placeholder="Ex.: Diretrizes de Cor">
                        </label>
                        <label class="builder-field">
                            <span>Observacao do bloco</span>
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
                            <button type="button" class="btn ghost compact-icon-btn" id="builderClearBlockEditBtn" aria-label="Limpar personalizacao do bloco" title="Limpar personalizacao do bloco" data-tooltip="Limpar personalizacao do bloco">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v4h4"></path></svg>
                            </button>
                        </div>
                    </aside>
                </div>
                <section class="designer-studio" id="designerStudio">
                    <div class="builder-lane-head">
                        <h4>Design Studio Pro (Beta)</h4>
                        <small id="designStudioMeta">Sem pÃ¡gina ativa</small>
                    </div>
                    <label class="designer-toggle">
                        <input type="checkbox" id="useDesignStudioTemplate">
                        <span>Usar Design Studio no preview, render web e exportaÃ§Ãµes</span>
                    </label>
                    <p class="muted">Crie templates livres em canvas (estilo Figma), com elementos arrastÃ¡veis e importaÃ§Ã£o inteligente de JSON.</p>
                    <div class="designer-controls">
                        <label class="builder-field">
                            <span>PÃ¡gina ativa</span>
                            <select id="designPageSelect"></select>
                        </label>
                                                <div class="actions designer-tool-grid cols-4">
                            <button type="button" class="btn ghost icon-btn" id="addDesignPageBtn" aria-label="Nova pagina" title="Nova pagina" data-tooltip="Nova pagina">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"></rect><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" id="duplicateDesignPageBtn" aria-label="Duplicar pagina" title="Duplicar pagina" data-tooltip="Duplicar pagina">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="7" width="10" height="12" rx="2"></rect><rect x="5" y="5" width="10" height="12" rx="2"></rect></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" id="removeDesignPageBtn" aria-label="Remover pagina" title="Remover pagina" data-tooltip="Remover pagina">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M9 7V5h6v2"></path><rect x="6" y="7" width="12" height="12" rx="2"></rect><path d="M10 11v5"></path><path d="M14 11v5"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" id="buildSceneFromStructureBtn" aria-label="Gerar cena da estrutura" title="Gerar cena da estrutura" data-tooltip="Gerar cena da estrutura">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="7" height="6" rx="1.5"></rect><rect x="13" y="5" width="7" height="6" rx="1.5"></rect><rect x="4" y="13" width="7" height="6" rx="1.5"></rect><path d="M13 16h7"></path><path d="M16.5 13v6"></path></svg>
                            </button>
                        </div>
                    </div>
                    <div class="designer-controls">
                                                <div class="actions designer-tool-grid cols-6">
                            <button type="button" class="btn ghost icon-btn" data-design-add="title" aria-label="Adicionar titulo" title="Adicionar titulo" data-tooltip="Adicionar titulo">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14"></path><path d="M12 6v12"></path><path d="M8 18h8"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" data-design-add="text" aria-label="Adicionar texto" title="Adicionar texto" data-tooltip="Adicionar texto">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M5 12h10"></path><path d="M5 17h14"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" data-design-add="shape" aria-label="Adicionar bloco" title="Adicionar bloco" data-tooltip="Adicionar bloco">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"></rect></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" data-design-add="logo_box" aria-label="Adicionar logo box" title="Adicionar logo box" data-tooltip="Adicionar logo box">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4.5" y="5" width="15" height="14" rx="2"></rect><path d="M8 15l3-4 3 3 2-2 2 3"></path></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" data-design-add="color_row" aria-label="Adicionar paleta" title="Adicionar paleta" data-tooltip="Adicionar paleta">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="2.2"></circle><circle cx="12" cy="12" r="2.2"></circle><circle cx="17" cy="12" r="2.2"></circle></svg>
                            </button>
                            <button type="button" class="btn ghost icon-btn" data-design-add="mockup_slot" aria-label="Adicionar mockup slot" title="Adicionar mockup slot" data-tooltip="Adicionar mockup slot">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2"></rect><path d="M8 14l3-3 2 2 3-3 2 4"></path></svg>
                            </button>
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
                            <h4>Inspector de Elemento</h4>
                            <label class="builder-field">
                                <span>Elemento selecionado</span>
                                <input type="text" id="designElementMeta" readonly>
                            </label>
                            <label class="builder-field">
                                <span>ConteÃºdo</span>
                                <textarea id="designElementText" rows="3" placeholder="Use tokens como {{project.title}} e {{palette.1}}"></textarea>
                            </label>
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
                            <p class="builder-meta designer-shortcuts-note">
                                Atalhos: setas movem | Shift + setas move 10px | Alt + setas redimensiona | Delete remove.
                            </p>
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
                        <input type="file" id="importFigmaJsonFile" accept=".json,application/json" style="display:none;">
                        <input type="file" id="importDesignSceneFile" accept=".json,application/json" style="display:none;">
                    </div>
                </section>
                <div class="actions mt-compact icon-toolbar">
                    <button type="button" class="btn compact-icon-btn" id="createCustomTemplateBtn" aria-label="Salvar template custom" title="Salvar template custom" data-tooltip="Salvar template custom">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h11l3 3v11H5z"></path><path d="M8 5v6h8V5"></path><rect x="8" y="14" width="8" height="5" rx="1"></rect></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="resetBuilderBtn" aria-label="Restaurar estrutura padrao" title="Restaurar estrutura padrao" data-tooltip="Restaurar estrutura padrao">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v4h4"></path></svg>
                    </button>
                    <button type="button" class="btn ghost compact-icon-btn" id="applySmartTemplateBtn" aria-label="Aplicar metodo inteligente" title="Aplicar metodo inteligente" data-tooltip="Aplicar metodo inteligente">
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
                    <input type="file" id="importCustomTemplatesFile" accept=".json,application/json" style="display:none;">
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
                <h2>InformaÃ§Ãµes do Projeto</h2>
                <span class="meta-tag" id="projectMainTag">Sem tag</span>
            </div>
            <div class="project-grid">
                <article class="project-card">
                    <small>TÃ­tulo</small>
                    <strong id="projectTitle">NÃ£o definido</strong>
                </article>
                <article class="project-card">
                    <small>DescriÃ§Ã£o</small>
                    <p id="projectDescription">Sem descriÃ§Ã£o registrada.</p>
                </article>
                <article class="project-card">
                    <small>Tags de apoio</small>
                    <p id="projectSupportingTags">Sem tags de apoio.</p>
                </article>
            </div>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Playbook de ExecuÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o</h2>
                <span class="meta-tag" id="playbookScoreBadge">0% pronto</span>
            </div>
            <p class="muted">Defina regras operacionais para tornar o brandbook aplicÃƒÆ’Ã‚Â¡vel em tarefas reais de design, marketing e desenvolvimento.</p>
            <div class="playbook-grid">
                <label class="builder-field">
                    <span>Respiro do logo</span>
                    <input type="text" id="logoClearspaceInput" placeholder="Ex.: 1x altura do simbolo">
                </label>
                <label class="builder-field">
                    <span>Tamanho mÃƒÆ’Ã‚Â­nimo digital</span>
                    <input type="text" id="logoMinDigitalInput" placeholder="Ex.: 32px">
                </label>
                <label class="builder-field">
                    <span>Tamanho mÃƒÆ’Ã‚Â­nimo impresso</span>
                    <input type="text" id="logoMinPrintInput" placeholder="Ex.: 18mm">
                </label>
                <label class="builder-field">
                    <span>PrimÃƒÆ’Ã‚Â¡ria (%)</span>
                    <input type="number" min="0" max="100" id="ratioPrimaryInput" placeholder="60">
                </label>
                <label class="builder-field">
                    <span>SecundÃƒÆ’Ã‚Â¡ria (%)</span>
                    <input type="number" min="0" max="100" id="ratioSecondaryInput" placeholder="30">
                </label>
                <label class="builder-field">
                    <span>Acento (%)</span>
                    <input type="number" min="0" max="100" id="ratioAccentInput" placeholder="10">
                </label>
                <label class="builder-field">
                    <span>Palavras-chave da voz da marca</span>
                    <input type="text" id="voiceKeywordsInput" placeholder="Ex.: claro, confiavel, objetivo">
                </label>
                <label class="builder-field">
                    <span>Estilo de CTA</span>
                    <input type="text" id="ctaStyleInput" placeholder="Ex.: Verbo de acao + beneficio direto">
                </label>
                <label class="builder-field">
                    <span>DireÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de imagery</span>
                    <input type="text" id="imageryDirectionInput" placeholder="Ex.: fotos reais com fundo limpo">
                </label>
                <label class="builder-field">
                    <span>Estilo de iconografia</span>
                    <input type="text" id="iconStyleInput" placeholder="Ex.: icones simples com cantos suaves">
                </label>
                <label class="builder-field">
                    <span>ResponsÃƒÆ’Ã‚Â¡vel do brandbook</span>
                    <input type="text" id="ownerNameInput" placeholder="Ex.: Nome do responsavel">
                </label>
                <label class="builder-field">
                    <span>Ciclo de revisÃƒÆ’Ã‚Â£o (dias)</span>
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
                    <label><input type="checkbox" name="playbook_channels" value="presentation"> Apresentacao</label>
                </fieldset>
                <fieldset class="playbook-fieldset">
                    <legend>Ativos obrigatÃƒÆ’Ã‚Â³rios</legend>
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
                <p class="muted">Fonte principal: Brand Kit e sincronizaÃ§Ãµes do fluxo de ferramentas.</p>
                <div id="paletteGrid" class="palette-grid"></div>
            </div>
            <div>
                <h2>Sistema TipogrÃ¡fico</h2>
                <div id="typographySummary" class="typography-summary"></div>
            </div>
        </section>

        <section class="panel split">
            <div>
                <h2>Diretriz Digital (OG)</h2>
                <div id="ogSummary" class="og-summary"></div>
            </div>
            <div>
                <h2>ObservaÃ§Ãµes de IntegraÃ§Ã£o</h2>
                <ul id="integrationNotes" class="notes"></ul>
            </div>
        </section>

        <section class="panel">
            <h2>AplicaÃ§Ãµes em Mockups</h2>
            <p class="muted">Amostras encontradas no fluxo do editor. Selecione no mÃ³dulo de mockups para atualizar este painel.</p>
            <div id="mockupsGrid" class="mockups-grid"></div>
            <p id="mockupsEmpty" class="empty-note" style="display:none;">Nenhum mockup salvo no navegador atual.</p>
        </section>

        <section class="panel brandbook-panel" id="brandbookPanel">
            <div class="panel-header">
                <h2>PrÃ©-visualizaÃ§Ã£o RÃ¡pida do Brandbook</h2>
                <span class="meta-tag">8 pÃ¡ginas geradas</span>
            </div>
            <p class="muted">Template preenchido automaticamente com os dados do projeto para acelerar apresentaÃ§Ãµes de brandbook.</p>
            <div id="brandbookPreview" class="brandbook-preview"></div>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Payload Consolidado (MVP)</h2>
                <span class="meta-tag">JSON versionado</span>
            </div>
            <p class="muted">Use este payload para anexos operacionais, CRMs e futuras etapas de persistÃªncia em banco.</p>
            <textarea id="manualPayload" readonly></textarea>
            <div class="actions">
                <button type="button" class="btn" id="refreshBtn">Atualizar</button>
                <button type="button" class="btn ghost" id="copyBtn">Copiar JSON</button>
                <button type="button" class="btn ghost" id="downloadJsonBtn">Baixar JSON</button>
                <button type="button" class="btn" id="downloadPdfBtn">Baixar PDF (Render Visual)</button>
            </div>
            <p id="statusLine" class="status-line">Aguardando consolidaÃ§Ã£o de dados.</p>
        </section>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/script.js"></script>
    <script src="../shared/workflow-assistant.js"></script>
</body>
</html>
