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
                    <button id="randomColor">Cor aleatoria</button>
                    <button id="applyBrandColors">Aplicar como Cores da Marca</button>
                    <button id="exportPalette">Exportar Paleta</button>
                </div>
                <p id="brandSyncStatus" class="brand-sync-status">Aguardando sincronizacao com o Brand Kit.</p>
            </div>

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
            </div>
        </main>
    </div>
<?php 
require_once 'assets/common/footer.php';
?>

