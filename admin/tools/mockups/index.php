<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';
require_once 'assets/common/header.php';
?>

<main class="main">
    <div class="container">
        <section class="hero">
            <h1>Crie Mockups Profissionais</h1>
            <p>Colecao completa com vestuario, papelaria, manual de marca, identidade visual, redes sociais e categorias extras do sistema.</p>
            <div class="upload-section">
                <label for="fileInput" class="upload-btn">
                    <i class="fas fa-upload"></i>
                    Fazer Upload de Imagem
                </label>
                <input type="file" id="fileInput" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" style="display: none;">
                <p class="upload-status" id="uploadStatusMessage">Formatos suportados: PNG, JPEG e SVG.</p>
                <div class="upload-preview" id="uploadPreview" style="display: none;">
                    <img id="uploadedPreviewImage" alt="Preview da imagem enviada">
                    <div class="upload-preview-meta">
                        <strong id="uploadPreviewTitle">Imagem carregada</strong>
                        <span id="uploadPreviewInfo"></span>
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
                <label>Orientacao:</label>
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
                <label>Ordenacao:</label>
                <select id="sortFilter">
                    <option value="popularidade">Popularidade</option>
                    <option value="az">Titulo A-Z</option>
                    <option value="za">Titulo Z-A</option>
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

        <section class="list-loader" id="listLoader" style="display: none;">
            <button type="button" class="btn-primary" id="loadMoreBtn">
                <i class="fas fa-plus"></i>
                Carregar mais mockups
            </button>
            <p class="list-loader-info" id="loadMoreInfo"></p>
        </section>
        <div id="mockupListSentinel" class="list-sentinel" aria-hidden="true"></div>
        <div id="editorDockHome"></div>

        <section class="editor-section" id="editorSection" style="display: none;">
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
                                    <option value="presentation">Apresentacao (1600x900)</option>
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
                                    <label>Cor secundaria:</label>
                                    <input type="color" id="bgColorEnd" value="#fee2e2">
                                </div>
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
                                    <option value="cover">Cobrir quadro (cover)</option>
                                    <option value="contain">Conter no quadro (contain)</option>
                                    <option value="repeat">Repetir blocos</option>
                                    <option value="repeat-mirror-x">Repetir + espelho horizontal</option>
                                    <option value="repeat-mirror-y">Repetir + espelho vertical</option>
                                    <option value="repeat-mirror-xy">Repetir + espelho horizontal e vertical</option>
                                </select>
                            </div>
                            <div class="control-group">
                                <label>Rotacao:</label>
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
                                <label>Titulo:</label>
                                <input type="text" id="textPrimary" placeholder="Titulo principal do mockup">
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
                            <input type="file" id="logoInput" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" style="display: none;">
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
                            <h4>Exportacao</h4>
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
                                <label>Escala de exportacao:</label>
                                <select id="exportScale">
                                    <option value="1">1x</option>
                                    <option value="2">2x</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="editor-actions">
                        <button type="button" class="btn-primary" onclick="saveMockupChanges()">
                            <i class="fas fa-save"></i> Salvar Alteracoes
                        </button>
                        <button type="button" class="btn-primary" onclick="downloadMockup()">
                            <i class="fas fa-download"></i> Baixar
                        </button>
                        <button type="button" class="btn-secondary" onclick="resetEditor()">
                            <i class="fas fa-undo"></i> Resetar
                        </button>
                        <button type="button" class="btn-secondary" onclick="applyBrandKitToEditor({ notify: true, force: true })">
                            <i class="fas fa-swatchbook"></i> Aplicar Cores/Fonte da Marca
                        </button>
                        <button type="button" class="btn-secondary" onclick="finalizeMockupsForReport()">
                            <i class="fas fa-file-invoice-dollar"></i> Ir para Relatorio de Orcamento
                        </button>
                        <button type="button" class="btn-secondary" onclick="closeEditor()">
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
