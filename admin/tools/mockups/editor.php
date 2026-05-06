<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';
require_once 'assets/common/header.php';
?>

<main class="main">
    <div class="container">
        <section class="work-intake">
            <div class="work-intake-header">
                <h1>Add new work</h1>
            </div>

            <div class="work-intake-grid">
                <aside class="work-intake-media">
                    <div class="work-intake-preview-surface">
                        <div class="upload-preview-placeholder" id="uploadPreviewPlaceholder">
                            <i class="fas fa-image" aria-hidden="true"></i>
                            <span>A preview da arte sera exibida aqui.</span>
                        </div>

                        <div class="upload-preview upload-preview-intake aq-hidden" id="uploadPreview">
                            <img id="uploadedPreviewImage" alt="Preview da imagem enviada">
                            <div class="upload-preview-meta">
                                <strong id="uploadPreviewTitle">Imagem carregada</strong>
                                <span id="uploadPreviewInfo"></span>
                            </div>
                        </div>
                    </div>

                    <label for="fileInput" class="upload-btn upload-btn-intake">
                        <i class="fas fa-upload"></i>
                        Trocar imagem
                    </label>
                    <input type="file" id="fileInput" class="aq-hidden" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml">
                    <p class="upload-status upload-status-intake" id="uploadStatusMessage">Formatos suportados: PNG, JPEG e SVG.</p>

                    <div class="work-intake-color">
                        <h3>Cor do produto <span class="work-intake-help">i</span></h3>
                        <div class="work-intake-color-row">
                            <input type="color" id="workBackgroundColor" value="#ffffff" aria-label="Cor interna do produto no mockup">
                            <input type="text" id="workBackgroundHex" value="#FFFFFF" maxlength="7" aria-label="Hexadecimal da cor interna do produto">
                        </div>
                    </div>
                </aside>

                <div class="work-intake-form-wrap">
                    <div class="work-intake-form-tabs" role="tablist" aria-label="Idioma do formulario">
                        <button type="button" class="work-intake-tab is-active" aria-selected="true">Portugues (Brasil)</button>
                    </div>

                    <div class="work-intake-form">
                        <div class="work-form-group">
                            <label for="workTitleInput">Título (obrigatório)</label>
                            <p>Use um título claro e descritivo para seu trabalho.</p>
                            <input type="text" id="workTitleInput" placeholder="Exemplo: Onda criativa da floresta" maxlength="120" required>
                        </div>

                        <div class="work-form-group">
                            <label for="workMainTagInput">Tag principal</label>
                            <p>Informe a palavra principal que melhor representa essa imagem.</p>
                            <input type="text" id="workMainTagInput" placeholder="Exemplo: montanha" maxlength="50">
                        </div>

                        <div class="work-form-group">
                            <label for="workSupportingTagsInput">Tags de apoio</label>
                            <p>Separe por virgulas (ate 14 tags).</p>
                            <input type="text" id="workSupportingTagsInput" placeholder="Exemplo: natureza, pintura, realista, paisagem" maxlength="900">
                        </div>

                        <div class="work-form-group">
                            <label for="workDescriptionInput">Descrição</label>
                            <p>Descreva rapidamente o objetivo ou conceito visual da arte.</p>
                            <textarea id="workDescriptionInput" rows="4" placeholder="Exemplo: Ilustração criada para campanha de redes sociais com foco em narrativa visual."></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="catalog-highlights">
            <article class="stat-card">
                <span class="stat-label">Total de mockups</span>
                <strong class="stat-value" id="totalMockupsCount">0</strong>
            </article>
            <article class="stat-card">
                <span class="stat-label">Categoria ativa</span>
                <strong class="stat-value" id="currentCategoryCount">0</strong>
            </article>
            <article class="stat-card">
                <span class="stat-label">Favoritos</span>
                <strong class="stat-value" id="favoriteCount">0</strong>
            </article>
        </section>

        <section class="filters">
            <div class="filter-group">
                <label>Orientação:</label>
                <select id="orientationFilter">
                    <option value="todas">Todas</option>
                    <option value="horizontal">Horizontal</option>
                    <option value="vertical">Vertical</option>
                    <option value="quadrada">Quadrada</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Qualidade:</label>
                <select id="qualityFilter">
                    <option value="todas">Todas</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baixa">Baixa</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Cor:</label>
                <select id="colorFilter">
                    <option value="todas">Todas</option>
                    <option value="colorido">Colorido</option>
                    <option value="preto-branco">Preto e branco</option>
                    <option value="sepia">Sepia</option>
                </select>
            </div>
            <div class="filter-group">
                <label>Ordenação:</label>
                <select id="sortFilter">
                    <option value="popularidade">Popularidade</option>
                    <option value="az">Título A-Z</option>
                    <option value="za">Título Z-A</option>
                </select>
            </div>
        </section>

        <section class="library-controls">
            <div class="library-filters">
                <button type="button" class="btn-secondary btn-toggle" id="favoritesOnlyToggle">
                    <i class="fas fa-star"></i>
                    Somente favoritos
                </button>
                <div class="filter-group">
                    <label>Colecao (filtro):</label>
                    <select id="collectionFilter">
                        <option value="all">Todas</option>
                    </select>
                </div>
            </div>
            <div class="collection-manager">
                <div class="filter-group">
                    <label>Colecao ativa:</label>
                    <select id="collectionTargetSelect"></select>
                </div>
                <input type="text" id="newCollectionName" placeholder="Nova colecao..." maxlength="40">
                <button type="button" class="btn-secondary" id="createCollectionBtn">
                    <i class="fas fa-folder-plus"></i>
                    Criar
                </button>
                <button type="button" class="btn-secondary" id="deleteCollectionBtn">
                    <i class="fas fa-folder-minus"></i>
                    Excluir
                </button>
            </div>
        </section>

        <section class="mockups-grid" id="mockupsGrid">
            <!-- Mockups carregados via JavaScript -->
        </section>

        <section class="list-loader aq-hidden" id="listLoader">
            <button type="button" class="btn-primary" id="loadMoreBtn">
                <i class="fas fa-plus"></i>
                Carregar mais mockups
            </button>
            <p class="list-loader-info" id="loadMoreInfo"></p>
        </section>
        <div id="mockupListSentinel" class="list-sentinel" aria-hidden="true"></div>
        <div id="editorDockHome"></div>

        <section class="editor-section aq-hidden" id="editorSection">
            <div class="editor-container">
                <div class="editor-sidebar">
                    <h3>Personalizar Mockup</h3>
                    <p class="editor-hint" id="editorHint">Selecione um mockup para iniciar a composicao.</p>

                    <div class="editor-controls">
                        <div class="control-panel">
                            <h4>Formato e Cenario</h4>
                            <div class="control-group">
                                <label>Tamanho do canvas:</label>
                                <select id="canvasPreset">
                                    <option value="feed-square">Feed quadrado (1080x1080)</option>
                                    <option value="feed-vertical">Feed vertical (1080x1350)</option>
                                    <option value="story">Story/Reels (1080x1920)</option>
                                    <option value="widescreen">Widescreen (1920x1080)</option>
                                    <option value="presentation">Apresentação (1600x900)</option>
                                    <option value="thumb">Miniatura (1280x720)</option>
                                </select>
                            </div>
                            <div class="control-group">
                                <label>Cenario:</label>
                                <select id="backgroundPreset">
                                    <option value="studio">Studio claro</option>
                                    <option value="dark">Studio escuro</option>
                                    <option value="gradient">Gradiente suave</option>
                                    <option value="paper">Textura papel</option>
                                    <option value="custom-solid">Cor solida customizada</option>
                                    <option value="custom-gradient">Gradiente customizado</option>
                                </select>
                            </div>
                            <div class="control-row">
                                <div class="control-group">
                                    <label>Cor base:</label>
                                    <input type="color" id="bgColorStart" value="#dbeafe">
                                </div>
                                <div class="control-group">
                                    <label>Cor secundária:</label>
                                    <input type="color" id="bgColorEnd" value="#fee2e2">
                                </div>
                            </div>
                            <div class="control-group">
                                <label>Cor interna do produto:</label>
                                <input type="color" id="mockupProductColor" value="#ffffff">
                            </div>
                            <label class="control-check">
                                <input type="checkbox" id="showGuides" checked>
                                Mostrar guias de alinhamento
                            </label>
                        </div>

                        <div class="control-panel">
                            <h4>Arte no Mockup</h4>
                            <div class="control-group">
                                <label>Posicao X:</label>
                                <input type="range" id="positionX" min="0" max="100" value="50">
                            </div>
                            <div class="control-group">
                                <label>Posicao Y:</label>
                                <input type="range" id="positionY" min="0" max="100" value="50">
                            </div>
                            <div class="control-group">
                                <label>Escala:</label>
                                <input type="range" id="scaleRange" min="0.5" max="2.5" step="0.1" value="1">
                            </div>
                            <div class="control-group">
                                <label>Preenchimento e repeticao:</label>
                                <select id="imageLayoutMode">
                                    <option value="fit-fill">Preencher mockup inteiro (estilo Redbubble)</option>
                                    <option value="cover">Cobrir quadro (cover)</option>
                                    <option value="contain">Conter no quadro (contain)</option>
                                    <option value="repeat">Repetir blocos</option>
                                    <option value="repeat-mirror-x">Repetir + espelho horizontal</option>
                                    <option value="repeat-mirror-y">Repetir + espelho vertical</option>
                                    <option value="repeat-mirror-xy">Repetir + espelho horizontal e vertical</option>
                                </select>
                            </div>
                            <div class="control-group">
                                <label>Rotação:</label>
                                <input type="range" id="rotationRange" min="-180" max="180" value="0">
                            </div>
                            <div class="control-row">
                                <label class="control-check">
                                    <input type="checkbox" id="flipHorizontal">
                                    Espelhar horizontal
                                </label>
                                <label class="control-check">
                                    <input type="checkbox" id="flipVertical">
                                    Espelhar vertical
                                </label>
                            </div>
                            <div class="control-group">
                                <label>Opacidade:</label>
                                <input type="range" id="opacityRange" min="0.2" max="1" step="0.05" value="1">
                            </div>
                            <div class="control-group">
                                <label>Sombra:</label>
                                <input type="range" id="shadowRange" min="0" max="40" step="1" value="12">
                            </div>
                            <div class="control-group">
                                <label>Raio da borda:</label>
                                <input type="range" id="radiusRange" min="0" max="48" step="1" value="16">
                            </div>
                            <div class="control-group">
                                <label>Filtro:</label>
                                <select id="filterSelect">
                                    <option value="none">Nenhum</option>
                                    <option value="blur">Desfoque</option>
                                    <option value="grayscale">Escala de cinza</option>
                                    <option value="sepia">Sepia</option>
                                    <option value="brightness">Brilho</option>
                                    <option value="contrast">Contraste</option>
                                </select>
                            </div>
                        </div>

                        <div class="control-panel">
                            <h4>Tipografia</h4>
                            <label class="control-check">
                                <input type="checkbox" id="enableTextOverlay" checked>
                                Exibir textos no mockup
                            </label>
                            <div class="control-group">
                                <label>Título:</label>
                                <input type="text" id="textPrimary" placeholder="Título principal do mockup">
                            </div>
                            <div class="control-group">
                                <label>Subtitulo:</label>
                                <input type="text" id="textSecondary" placeholder="Subtitulo complementar">
                            </div>
                            <div class="control-row">
                                <div class="control-group">
                                    <label>Fonte:</label>
                                    <select id="textFont">
                                        <option value="montserrat">Montserrat</option>
                                        <option value="poppins">Poppins</option>
                                        <option value="lora">Lora</option>
                                        <option value="bebas">Bebas Neue</option>
                                        <option value="playfair">Playfair Display</option>
                                    </select>
                                </div>
                                <div class="control-group">
                                    <label>Alinhamento:</label>
                                    <select id="textAlign">
                                        <option value="center">Centro</option>
                                        <option value="left">Esquerda</option>
                                        <option value="right">Direita</option>
                                    </select>
                                </div>
                            </div>
                            <div class="control-row">
                                <div class="control-group">
                                    <label>Cor:</label>
                                    <input type="color" id="textColor" value="#0f172a">
                                </div>
                                <div class="control-group">
                                    <label>Tamanho:</label>
                                    <input type="range" id="textSize" min="22" max="96" value="48">
                                </div>
                            </div>
                            <div class="control-group">
                                <label>Posicao horizontal do texto:</label>
                                <input type="range" id="textPositionX" min="0" max="100" value="50">
                            </div>
                            <div class="control-group">
                                <label>Posicao vertical do texto:</label>
                                <input type="range" id="textPositionY" min="0" max="100" value="90">
                            </div>
                        </div>

                        <div class="control-panel">
                            <h4>Logo e Marca Dagua</h4>
                            <div class="control-row">
                                <label for="logoInput" class="btn-secondary btn-inline">
                                    <i class="fas fa-image"></i>
                                    Upload Logo
                                </label>
                                <button type="button" class="btn-secondary btn-inline" id="removeLogoBtn">
                                    <i class="fas fa-trash-alt"></i>
                                    Remover Logo
                                </button>
                            </div>
                            <input type="file" id="logoInput" class="aq-hidden" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml">
                            <div class="control-group">
                                <label>Escala da logo:</label>
                                <input type="range" id="logoScaleRange" min="0.1" max="1.8" step="0.05" value="0.4">
                            </div>
                            <div class="control-group">
                                <label>Opacidade da logo:</label>
                                <input type="range" id="logoOpacityRange" min="0.1" max="1" step="0.05" value="0.85">
                            </div>
                            <div class="control-group">
                                <label>Posicao X da logo:</label>
                                <input type="range" id="logoPositionX" min="0" max="100" value="86">
                            </div>
                            <div class="control-group">
                                <label>Posicao Y da logo:</label>
                                <input type="range" id="logoPositionY" min="0" max="100" value="88">
                            </div>
                        </div>

                        <div class="control-panel">
                            <h4>Exportação</h4>
                            <div class="control-group">
                                <label>Formato:</label>
                                <select id="exportFormat">
                                    <option value="image/png">PNG</option>
                                    <option value="image/jpeg">JPG</option>
                                    <option value="image/webp">WEBP</option>
                                </select>
                            </div>
                            <div class="control-group">
                                <label>Qualidade: <span id="exportQualityValue">92%</span></label>
                                <input type="range" id="exportQuality" min="55" max="100" step="1" value="92">
                            </div>
                            <div class="control-group">
                                <label>Escala de exportação:</label>
                                <select id="exportScale">
                                    <option value="1">1x</option>
                                    <option value="2">2x</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="editor-actions">
                        <button type="button" class="btn-primary" id="saveMockupChangesBtn">
                            <i class="fas fa-save"></i> Salvar Alterações
                        </button>
                        <button type="button" class="btn-primary" id="downloadMockupBtn">
                            <i class="fas fa-download"></i> Baixar
                        </button>
                        <button type="button" class="btn-secondary" id="resetEditorBtn">
                            <i class="fas fa-undo"></i> Resetar
                        </button>
                        <button type="button" class="btn-secondary" id="applyBrandKitBtn">
                            <i class="fas fa-swatchbook"></i> Aplicar Cores/Fonte da Marca
                        </button>
                        <button type="button" class="btn-secondary" id="finalizeMockupsBtn">
                            <i class="fas fa-store"></i> Ir para Resultados dos Mockups
                        </button>
                        <button type="button" class="btn-secondary" id="closeEditorBtn">
                            <i class="fas fa-times"></i> Fechar
                        </button>
                    </div>
                </div>

                <div class="editor-preview">
                    <div class="editor-preview-header">
                        <h4 id="editorMockupTitle">Editor de mockup</h4>
                        <span id="editorMockupMeta">Selecione um modelo para editar.</span>
                    </div>
                    <canvas id="mockupCanvas"></canvas>
                </div>
            </div>
        </section>
    </div>
</main>
<?php
require_once 'assets/common/footer.php';
?>
