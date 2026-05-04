<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';
require_once 'assets/common/header.php';
?>

<body class="aq-tool-fluid aq-tool-colorpalette">
    <div class="container">
        <header>
            <h1>🎨 Gerador de Paleta de Cores</h1>
            <p>Escolha uma cor base e descubra paletas harmoniosas</p>
        </header>

        <main>
            <div class="controls">
                <div class="color-input-section">
                    <label for="baseColor">Cor Base:</label>
                    <div class="color-picker-wrapper">
                        <input type="color" id="baseColor" value="#3498db">
                        <input type="text" id="hexInput" value="#3498db" placeholder="#000000">
                    </div>
                </div>
                
                <div class="image-upload-section">
                    <label for="imageUpload">Upload de Imagem:</label>
                    <div class="upload-wrapper">
                        <input type="file" id="imageUpload" accept="image/*" class="file-input">
                        <label for="imageUpload" class="upload-button">
                            <span class="material-symbols-outlined">upload</span>
                            Selecionar Imagem
                        </label>
                        <div class="file-name" id="fileName">Nenhum arquivo selecionado</div>
                    </div>
                </div>

                <div class="palette-type-section">
                    <label>Tipo de Paleta:</label>
                    <div class="palette-buttons">
                        <button class="palette-btn active" data-type="monochromatic">Monocromática</button>
                        <button class="palette-btn" data-type="analogous">Análoga</button>
                        <button class="palette-btn" data-type="complementary">Complementar</button>
                        <button class="palette-btn" data-type="triadic">Tríade</button>
                        <button class="palette-btn" data-type="tetradic">Tetrádica</button>
                        <button class="palette-btn" data-type="splitComplementary">Split-Complementar</button>
                    </div>
                </div>

                <div class="actions">
                    <button id="randomColor">Cor aleatória</button>
                    <button id="applyBrandColors">Aplicar como Cores da Marca</button>
                    <button id="exportPalette">Exportar Paleta</button>
                    <button id="exportCssTokens">Exportar Tokens CSS</button>
                </div>
                <p id="brandSyncStatus" class="brand-sync-status">Aguardando sincronização com o Brand Kit.</p>
            </div>

            <section class="workflow-assistant">
                <div class="workflow-head">
                    <h3>Fluxo Guiado da Ferramenta</h3>
                    <p id="workflowSummary">Organize o uso em 5 etapas para manter consistência entre paleta, acessibilidade e BrandBook.</p>
                </div>
                <div id="workflowSteps" class="workflow-steps"></div>
                <div class="workflow-actions">
                    <button type="button" id="workflowPrimaryAction" class="tool-button">Executar próximo passo</button>
                    <button type="button" id="workflowSecondaryAction" class="tool-button">Abrir BrandBook</button>
                </div>
            </section>

            <div class="image-preview-container" id="imagePreviewContainer">
                <div class="image-preview-wrapper">
                    <div class="image-preview" id="imagePreview">
                        <div class="upload-placeholder" id="uploadPlaceholder">
                            <span class="material-symbols-outlined">image</span>
                            <p>Faça upload de uma imagem para extrair cores</p>
                        </div>
                        <img id="previewImage" src="" alt="Preview" style="display: none;">
                        <div class="color-picker-tool" id="colorPickerTool">
                            <div class="color-picker-crosshair" id="colorPickerCrosshair"></div>
                            <div class="color-picker-info">
                                <div class="picked-color-preview" id="pickedColorPreview"></div>
                                <div class="picked-color-hex" id="pickedColorHex">#------</div>
                            </div>
                        </div>
                    </div>
                    <div class="image-controls">
                        <button id="activateColorPicker" class="tool-button">
                            <span class="material-symbols-outlined">colorize</span>
                            Selecionar Cor
                        </button>
                        <button id="detectDominantColors" class="tool-button">
                            <span class="material-symbols-outlined">palette</span>
                            Detectar Cores Dominantes
                        </button>
                    </div>
                </div>
                <div class="extracted-colors" id="extractedColors">
                    <h3>Cores Extraídas</h3>
                    <div class="extracted-colors-list" id="extractedColorsList"></div>
                </div>
            </div>
            
            <div class="palette-display" id="paletteDisplay">
                <div class="palette-info">
                    <h3 id="paletteTitle">Paleta Monocromática</h3>
                    <p id="paletteDescription">Variações de saturação e luminosidade da mesma cor.</p>
                </div>
                
                <div class="color-swatches" id="colorSwatches">
                    <!-- Cores serão geradas aqui -->
                </div>
            </div>

            <div class="color-details">
                <h3>Detalhes das Cores</h3>
                <div class="color-list" id="colorList">
                    <!-- Detalhes das cores serão exibidos aqui -->
                </div>
                <div class="project-guidance">
                    <section class="guidance-card">
                        <h4>Papeis sugeridos para projeto</h4>
                        <div id="roleSuggestions" class="role-suggestions"></div>
                    </section>
                    <section class="guidance-card">
                        <h4>Auditoria de contraste e legibilidade</h4>
                        <div id="contrastAudit" class="contrast-audit"></div>
                    </section>
                </div>
                <div class="insight-guidance">
                    <section class="guidance-card guidance-card-wide">
                        <h4>Combinações e tendências aplicadas</h4>
                        <p id="insightSummary" class="guidance-intro">Aguardando análise de combinações e tendências.</p>
                        <div class="insight-columns">
                            <div>
                                <h5>Combinações recomendadas</h5>
                                <div id="combinationSuggestions" class="insight-list"></div>
                            </div>
                            <div>
                                <h5>Tendências alinhadas</h5>
                                <div id="trendSuggestions" class="insight-list"></div>
                            </div>
                        </div>
                    </section>
                </div>
                <div class="adobe-lab">
                    <section class="guidance-card guidance-card-wide">
                        <h4>Recursos Avançados Inspirados no Adobe Color</h4>
                        <div class="adobe-grid">
                            <article class="adobe-panel">
                                <h5>Color Wheel e Harmonia</h5>
                                <canvas id="colorWheelCanvas" width="260" height="260" aria-label="Roda de cores"></canvas>
                                <p id="wheelInteractionHint" class="wheel-hint">
                                    Clique e arraste no círculo para ajustar matiz/saturação. Arraste os pontos da harmonia para rotação/abertura e use scroll para abrir/fechar a harmonia. Segure Shift para ajuste fino.
                                </p>
                                <p id="wheelPointerInfo" class="wheel-pointer-info">Base: #3498DB</p>
                                <div class="wheel-controls">
                                    <label for="wheelHarmonyRule">Regra de harmonia</label>
                                    <select id="wheelHarmonyRule">
                                        <option value="monochromatic">Monocromática</option>
                                        <option value="analogous">Análoga</option>
                                        <option value="complementary">Complementar</option>
                                        <option value="triadic">Tríade</option>
                                        <option value="tetradic">Tetrádica</option>
                                        <option value="splitComplementary">Split-complementar</option>
                                    </select>
                                    <label for="harmonySpread">Abertura da harmonia</label>
                                    <input type="range" id="harmonySpread" min="12" max="120" step="2" value="30">
                                    <span id="harmonySpreadValue">30deg</span>
                                    <label for="wheelBaseLightness">Luminosidade base</label>
                                    <input type="range" id="wheelBaseLightness" min="12" max="88" step="1" value="52">
                                    <span id="wheelBaseLightnessValue">52%</span>
                                    <button type="button" id="applyHarmonyRule" class="tool-button">Aplicar harmonia</button>
                                    <label for="wheelRotation">Rotação de harmonias</label>
                                    <input type="range" id="wheelRotation" min="-180" max="180" value="0">
                                    <div class="wheel-actions">
                                        <span id="wheelRotationValue">0deg</span>
                                        <button type="button" id="applyWheelRotation" class="tool-button">Aplicar rotação</button>
                                    </div>
                                    <div class="wheel-quick-actions">
                                        <button type="button" id="wheelRotateLeft" class="tool-button">-15deg</button>
                                        <button type="button" id="wheelRotateRight" class="tool-button">+15deg</button>
                                        <button type="button" id="wheelRandomizeHarmony" class="tool-button">Randomizar harmonia</button>
                                    </div>
                                    <label for="wheelDynamicsProfile">Perfil de composição</label>
                                    <select id="wheelDynamicsProfile">
                                        <option value="balanced">Equilibrado</option>
                                        <option value="vibrant">Vibrante</option>
                                        <option value="soft">Suave</option>
                                        <option value="highContrast">Alto contraste</option>
                                    </select>
                                    <label for="wheelDynamicsIntensity">Intensidade dinâmica</label>
                                    <input type="range" id="wheelDynamicsIntensity" min="0" max="100" step="1" value="55">
                                    <span id="wheelDynamicsIntensityValue">55%</span>
                                    <button type="button" id="applyDynamicsProfile" class="tool-button">Aplicar dinâmica</button>
                                </div>
                            </article>
                            <article class="adobe-panel">
                                <h5>Extrair Gradiente</h5>
                                <div class="gradient-controls">
                                    <div class="gradient-selects">
                                        <label for="gradientStart">Cor inicial</label>
                                        <select id="gradientStart"></select>
                                        <label for="gradientEnd">Cor final</label>
                                        <select id="gradientEnd"></select>
                                    </div>
                                    <label for="gradientAngle">Ângulo do gradiente</label>
                                    <input type="range" id="gradientAngle" min="0" max="360" value="135">
                                    <span id="gradientAngleValue">135deg</span>
                                </div>
                                <div id="gradientPreview" class="gradient-preview"></div>
                                <pre id="gradientCssCode" class="gradient-code"></pre>
                                <button type="button" id="copyGradientCss" class="tool-button">Copiar CSS do gradiente</button>
                            </article>
                            <article class="adobe-panel">
                                <h5>Accessibility Tools</h5>
                                <label for="colorVisionMode">Simulador de visão de cor</label>
                                <select id="colorVisionMode">
                                    <option value="normal">Normal</option>
                                    <option value="protanopia">Protanopia</option>
                                    <option value="deuteranopia">Deuteranopia</option>
                                    <option value="tritanopia">Tritanopia</option>
                                </select>
                                <div class="vision-severity">
                                    <label for="colorVisionSeverity">Severidade da simulação</label>
                                    <input type="range" id="colorVisionSeverity" min="0" max="100" value="100">
                                    <span id="colorVisionSeverityValue">100%</span>
                                </div>
                                <div class="vision-lock">
                                    <label class="vision-lock-toggle" for="lockPrimaryColor">
                                        <input type="checkbox" id="lockPrimaryColor" checked>
                                        <span>Travar cor primária da marca</span>
                                    </label>
                                    <small>Sugestões e ajuste automático mudam apenas cores de apoio.</small>
                                </div>
                                <div id="visionSwatches" class="vision-swatches"></div>
                                <ul id="visionConflicts" class="vision-conflicts"></ul>
                                <div class="vision-actions">
                                    <button type="button" id="autoFixConflicts" class="tool-button">Resolver conflitos automaticamente</button>
                                </div>
                                <div id="conflictSuggestions" class="conflict-suggestions"></div>
                            </article>
                            <article class="adobe-panel">
                                <h5>Biblioteca de Temas</h5>
                                <div class="theme-form">
                                    <input type="text" id="themeNameInput" placeholder="Nome do tema">
                                    <input type="text" id="themeTagsInput" placeholder="Tags (ex: fintech, moderno)">
                                </div>
                                <button type="button" id="saveThemeButton" class="tool-button">Salvar tema</button>
                                <div id="savedThemesList" class="saved-themes-list"></div>
                            </article>
                            <article class="adobe-panel">
                                <h5>Presets de Mercado</h5>
                                <label for="sectorPresetSelect">Setor do projeto</label>
                                <select id="sectorPresetSelect">
                                    <option value="none">Sem preset</option>
                                    <option value="saas">SaaS e Produtos Digitais</option>
                                    <option value="ecommerce">E-commerce e Varejo</option>
                                    <option value="health">Saúde e Bem-estar</option>
                                    <option value="education">Educação e Cursos</option>
                                    <option value="finance">Finanças e Seguros</option>
                                    <option value="fashion">Moda e Lifestyle</option>
                                </select>
                                <button type="button" id="applySectorPreset" class="tool-button">Aplicar preset</button>
                                <p id="sectorPresetHint" class="saved-theme-meta">Selecione um preset para gerar harmonia, combinações e tendências alinhadas ao setor.</p>
                            </article>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    </div>
<?php 
require_once 'assets/common/footer.php';
?>

