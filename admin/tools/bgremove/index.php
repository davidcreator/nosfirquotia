<?php
require_once 'config.php';
cleanOldFiles();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $lang['app_title']; ?> - <?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="../compatibility.css">
</head>
<body class="aq-tool-fluid aq-tool-bgremove">
    <div class="container">
        <section class="hero">
            <div class="hero-content">
                <h1 class="hero-title"><?php echo $lang['app_title']; ?></h1>
                <p class="hero-subtitle"><?php echo $lang['hero_tagline']; ?></p>
                <button class="btn btn-primary" onclick="document.getElementById('fileInput').click()">
                    <?php echo $lang['upload_btn']; ?>
                </button>
            </div>
        </section>

        <main class="main-content">
            <div id="uploadSection" class="upload-section active">
                <div class="upload-area" id="uploadArea">
                    <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <h3><?php echo $lang['upload_desc']; ?></h3>
                    <p class="upload-info"><?php echo $lang['max_size']; ?> | <?php echo $lang['allowed_formats']; ?></p>
                    <input type="file" id="fileInput" accept="image/jpeg,image/png,image/jpg" hidden>
                    <button class="btn btn-primary" onclick="document.getElementById('fileInput').click()">
                        <?php echo $lang['upload_btn']; ?>
                    </button>
                </div>

                <div class="tolerance-control">
                    <label><?php echo $lang['tolerance_label']; ?>:</label>
                    <input type="range" id="tolerance" min="5" max="50" value="15" step="5">
                    <div class="tolerance-labels">
                        <span><?php echo $lang['tolerance_low']; ?></span>
                        <span><?php echo $lang['tolerance_high']; ?></span>
                    </div>
                    <div class="picker-row" style="margin-top:15px; display:flex; gap:15px; align-items:center;">
                        <label for="bgColor" style="font-weight:600;">Cor do fundo:</label>
                        <input type="color" id="bgColor" value="#ffffff"/>
                        <label style="display:flex; align-items:center; gap:8px;">
                            <input type="checkbox" id="useBgColor"/>
                            Usar cor escolhida
                        </label>
                    </div>
                    <div class="advanced-controls" style="margin-top:15px; display:flex; gap:15px; align-items:center; flex-wrap:wrap;">
                        <label for="removeMode" style="font-weight:600;">Modo:</label>
                        <select id="removeMode">
                            <option value="hsv">HSV (robusto)</option>
                            <option value="rgb">RGB</option>
                        </select>
                        <label for="feather" style="font-weight:600;">Suavizar bordas:</label>
                        <input type="range" id="feather" min="0" max="10" value="2" step="1"/>
                        <label style="display:flex; align-items:center; gap:8px;">
                            <input type="checkbox" id="autoBg" checked/>
                            Detectar fundo automático
                        </label>
                    </div>
                </div>
                <div class="features-grid">
                    <h3 class="features-title"><?php echo $lang['features_title']; ?></h3>
                    <div class="features-cards">
                        <div class="feature-card">
                            <span class="feature-icon">🪄</span>
                            <h4><?php echo $lang['feature_brush']; ?></h4>
                        </div>
                        <div class="feature-card">
                            <span class="feature-icon">🎨</span>
                            <h4><?php echo $lang['feature_color']; ?></h4>
                        </div>
                        <div class="feature-card">
                            <span class="feature-icon">⚙️</span>
                            <h4><?php echo $lang['feature_opt']; ?></h4>
                        </div>
                        <div class="feature-card">
                            <span class="feature-icon">↔️</span>
                            <h4><?php echo $lang['feature_compare']; ?></h4>
                        </div>
                    </div>
                </div>
            </div>

            <div id="processingSection" class="processing-section">
                <div class="spinner"></div>
                <p><?php echo $lang['processing']; ?></p>
            </div>

            <div id="resultSection" class="result-section">
                <div class="preview-controls" id="previewControls" style="display:flex; gap:12px; align-items:center; justify-content:center; flex-wrap:wrap; margin-bottom:12px;">
                    <label for="previewBgMode"><strong><?php echo $lang['preview_bg_title'] ?? 'Pré-visualização de fundo'; ?>:</strong></label>
                    <select id="previewBgMode">
                        <option value="checker"><?php echo $lang['preview_bg_checker'] ?? 'Transparente (xadrez)'; ?></option>
                        <option value="solid"><?php echo $lang['preview_bg_solid'] ?? 'Sólido'; ?></option>
                        <option value="backdrop"><?php echo $lang['preview_bg_backdrop'] ?? 'Bastidores'; ?></option>
                    </select>
                    <div id="previewSolidControls" class="preview-extra" style="display:none; align-items:center; gap:8px;">
                        <label for="previewBgColor"><?php echo $lang['preview_bg_color'] ?? 'Cor do fundo'; ?>:</label>
                        <input type="color" id="previewBgColor" value="#ffffff"/>
                    </div>
                    <div id="previewBackdropControls" class="preview-extra" style="display:none; align-items:center; gap:8px;">
                        <label for="previewBackdrop"><?php echo $lang['preview_bg_backdrop_label'] ?? 'Cenário'; ?>:</label>
                        <select id="previewBackdrop">
                            <option value="gray"><?php echo $lang['backdrop_gray'] ?? 'Studio Cinza'; ?></option>
                            <option value="clouds"><?php echo $lang['backdrop_clouds'] ?? 'Nuvens'; ?></option>
                            <option value="fabric"><?php echo $lang['backdrop_fabric'] ?? 'Tecido'; ?></option>
                            <option value="space"><?php echo $lang['backdrop_space'] ?? 'Espaço'; ?></option>
                            <option value="balls"><?php echo $lang['backdrop_balls'] ?? 'Esferas'; ?></option>
                        </select>
                    </div>
                </div>
                <div class="comparison-slider" id="comparisonSlider" style="display:none;">
                    <div class="comp-wrapper">
                        <img id="compOriginal" alt="Original" class="comp-image" />
                        <div class="comp-overlay" id="compOverlay">
                            <img id="compProcessed" alt="Sem Fundo" class="comp-image" />
                            <canvas id="compEdgeCanvas" class="edge-canvas" style="display:none;"></canvas>
                        </div>
                        <div class="comp-handle" id="compHandle"></div>
                    </div>
                </div>
                <div class="image-comparison">
                    <div class="image-box">
                        <h4>Original</h4>
                        <img id="originalImage" alt="Original">
                    </div>
                    <div class="image-box processed-box" id="processedBox">
                        <h4>Sem Fundo</h4>
                        <img id="processedImage" alt="Processado" style="display:block;">
                        <canvas id="editorCanvas" style="display:none; max-width:100%; border-radius:10px;"></canvas>
                        <canvas id="edgeCanvas" class="edge-canvas" style="display:none;"></canvas>
                    </div>
                </div>
                <div class="editor-tools" style="display:none; gap:10px; justify-content:center; flex-wrap:wrap; margin-bottom:20px;">
                    <button class="btn btn-secondary" id="toggleBrushBtn">Ativar Pincel</button>
                    <label style="display:flex; align-items:center; gap:8px;">Tamanho
                        <input type="range" id="brushSize" min="5" max="100" value="25"/>
                    </label>
                    <label style="display:flex; align-items:center; gap:8px;">Modo
                        <select id="brushMode">
                            <option value="erase">Apagar</option>
                            <option value="restore">Restaurar</option>
                        </select>
                    </label>
                    <button class="btn btn-secondary" id="refineEdgesBtn">Refinar recorte</button>
                    <button class="btn btn-secondary" id="applyAdjustBtn">Aplicar Ajustes</button>
                    <a class="btn btn-success" id="downloadAdjustedBtn" download style="display:none;">Baixar Ajustado</a>
                </div>
                <div class="optimize-tools" style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-bottom:10px;">
                    <label style="display:flex; align-items:center; gap:8px;">Formato
                        <select id="optFormat">
                            <option value="png">PNG</option>
                            <option value="jpeg">JPEG</option>
                            <option value="webp">WebP</option>
                        </select>
                    </label>
                    <label style="display:flex; align-items:center; gap:8px;">Qualidade
                        <input type="range" id="optQuality" min="10" max="100" value="80"/>
                    </label>
                    <label style="display:flex; align-items:center; gap:8px;">Largura máx.
                        <input type="number" id="optWidth" min="100" step="50" placeholder="1200" style="width:100px;"/>
                    </label>
                    <button class="btn btn-secondary" id="optimizeBtn">Otimizar</button>
                </div>
                <div class="result-actions">
                    <a id="downloadBtn" class="btn btn-success" download>
                        <?php echo $lang['download_btn']; ?>
                    </a>
                    <button class="btn btn-secondary" onclick="resetApp()">
                        <?php echo $lang['try_another']; ?>
                    </button>
                </div>
            </div>

            <div id="errorMessage" class="error-message"></div>
        </main>

        <section class="use-cases">
            <h3 class="use-cases-title"><?php echo $lang['use_cases_title'] ?? 'Casos de uso'; ?></h3>
            <div class="use-cases-grid">
                <a href="#" class="use-card">
                    <span class="use-icon">🛍️</span>
                    <h4><?php echo $lang['use_case_ecom'] ?? 'E-commerce'; ?></h4>
                    <p><?php echo $lang['use_case_ecom_desc'] ?? 'Fotos de produto com fundo limpo e profissional.'; ?></p>
                </a>
                <a href="#" class="use-card">
                    <span class="use-icon">📣</span>
                    <h4><?php echo $lang['use_case_marketing'] ?? 'Marketing'; ?></h4>
                    <p><?php echo $lang['use_case_marketing_desc'] ?? 'Criativos mais claros para anúncios e banners.'; ?></p>
                </a>
                <a href="#" class="use-card">
                    <span class="use-icon">📸</span>
                    <h4><?php echo $lang['use_case_photo'] ?? 'Fotografia'; ?></h4>
                    <p><?php echo $lang['use_case_photo_desc'] ?? 'Retratos com recorte apurado para catálogos e portfólios.'; ?></p>
                </a>
                <a href="#" class="use-card">
                    <span class="use-icon">🎨</span>
                    <h4><?php echo $lang['use_case_design'] ?? 'Design'; ?></h4>
                    <p><?php echo $lang['use_case_design_desc'] ?? 'Montagens e composições com controle de bordas e máscaras.'; ?></p>
                </a>
                <a href="#" class="use-card">
                    <span class="use-icon">💬</span>
                    <h4><?php echo $lang['use_case_social'] ?? 'Social'; ?></h4>
                    <p><?php echo $lang['use_case_social_desc'] ?? 'Posts e thumbnails com fundo personalizado para engajar.'; ?></p>
                </a>
            </div>
        </section>

        <footer class="footer">
            <p>&copy; 2025 <?php echo APP_NAME; ?> v<?php echo APP_VERSION; ?></p>
        </footer>
    </div>

    <script src="assets/js/script.js"></script>
</body>
</html>
