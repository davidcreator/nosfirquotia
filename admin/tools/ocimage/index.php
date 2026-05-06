<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';
require_once 'assets/common/header.php';
?>

<body class="aq-tool-fluid aq-tool-ocimage">
    <div class="container-grid">
        <div class="controls">
            <h1>🎨 Gerador de OG:Image</h1>
            
            <div class="form-group">
                <label>Templates Pré-definidos</label>
                <div class="template-selector">
                    <button class="template-btn active" data-template="gradient">Gradiente</button>
                    <button class="template-btn" data-template="minimal">Minimalista</button>
                    <button class="template-btn" data-template="bold">Negrito</button>
                    <button class="template-btn" data-template="tech">Tech</button>
                </div>
            </div>

            <div class="form-group">
                <label for="title">Título</label>
                <input type="text" id="title" placeholder="Título do seu conteúdo..." value="Crie Imagens Incríveis para Redes Sociais">
            </div>

            <div class="form-group">
                <label for="description">Descrição</label>
                <textarea id="description" placeholder="Descrição breve do conteúdo...">Gere imagens otimizadas para Facebook, Twitter, LinkedIn e Pinterest com este modelo responsivo.</textarea>
            </div>

            <div class="form-group">
                <label for="brand">Marca/Site</label>
                <input type="text" id="brand" placeholder="Seu site ou marca..." value="MeuSite.com">
            </div>

            <div class="form-group">
                <label for="imageUpload">Imagem de Fundo (Opcional)</label>
                <input type="file" id="imageUpload" accept="image/*" class="file-input">
                <div class="upload-area" id="uploadArea">
                    <div class="upload-content">
                        <span class="upload-icon">📁</span>
                        <span class="upload-text">Clique ou arraste uma imagem aqui</span>
                        <span class="upload-formats">PNG, JPG, GIF até 5MB</span>
                    </div>
                </div>
                <div class="image-actions">
                    <button type="button" class="remove-image-btn is-hidden" id="removeImageBtn">Remover Imagem</button>
                    <button type="button" class="edit-image-btn is-hidden" id="editImageBtn">Editar Imagem</button>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="primaryColor">Cor Primária</label>
                    <input type="color" id="primaryColor" class="color-input" value="#667eea">
                </div>
                <div class="form-group">
                    <label for="secondaryColor">Cor Secundária</label>
                    <input type="color" id="secondaryColor" class="color-input" value="#764ba2">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="imageOpacity">Opacidade da Imagem</label>
                    <input type="range" id="imageOpacity" min="0.1" max="1" step="0.1" value="0.8" class="slider">
                    <span class="slider-value">0.8</span>
                </div>
                <div class="form-group">
                    <label for="overlayOpacity">Opacidade do Overlay</label>
                    <input type="range" id="overlayOpacity" min="0" max="1" step="0.1" value="0.5" class="slider">
                    <span class="slider-value">0.5</span>
                </div>
            </div>

            <div class="button-group">
                <button type="button" class="update-btn" id="updatePreviewBtn">Atualizar Preview</button>
                <button type="button" class="export-btn" id="exportBtn">Exportar Imagem</button>
                <button type="button" class="code-btn" id="generateCodeBtn">Gerar Código HTML</button>
            </div>
        </div>

         <div class="preview">
        <h2>Preview da Imagem OG</h2>
        <div class="preview-content">
            <!-- OG Image Principal -->
            <div class="og-image" id="ogImage">
                <div class="og-content">
                    <div class="og-title" id="previewTitle">Crie Imagens Incríveis para Redes Sociais</div>
                    <div class="og-description" id="previewDescription">Gere imagens otimizadas para Facebook, Twitter, LinkedIn e Pinterest com este modelo responsivo.</div>
                    <div class="og-brand" id="previewBrand">MeuSite.com</div>
                </div>
            </div>

            <!-- Tabs das Redes Sociais -->
            <div class="social-tabs">
                <button type="button" class="social-tab facebook active" data-platform="facebook">
                    📘 Facebook
                </button>
                <button type="button" class="social-tab instagram" data-platform="instagram">
                    📸 Instagram
                </button>
                <button type="button" class="social-tab twitter" data-platform="twitter">
                    🐦 X (Twitter)
                </button>
                <button type="button" class="social-tab pinterest" data-platform="pinterest">
                    📌 Pinterest
                </button>
            </div>

            <!-- Facebook Preview -->
            <div id="facebook-preview" class="social-preview facebook-preview active">
                <div class="facebook-header">
                    <div class="facebook-avatar">MS</div>
                    <div class="facebook-user">
                        <div class="facebook-username">MeuSite</div>
                        <div class="facebook-time">2 min · 🌐</div>
                    </div>
                </div>
                <div class="facebook-post">
                    Confira este conteúdo incrível que preparamos para você! 🚀
                </div>
                <div class="facebook-link">
                    <div class="facebook-link-image" id="facebook-image"></div>
                    <div class="facebook-link-content">
                        <div class="facebook-link-url">meusite.com</div>
                        <div class="facebook-link-title" id="facebook-title">Crie Imagens Incríveis para Redes Sociais</div>
                        <div class="facebook-link-description" id="facebook-description">Gere imagens otimizadas para Facebook, Twitter, LinkedIn e Pinterest com este modelo responsivo.</div>
                    </div>
                </div>
            </div>

            <!-- Instagram Preview -->
            <div id="instagram-preview" class="social-preview instagram-preview">
                <div class="instagram-header">
                    <div class="instagram-avatar">MS</div>
                    <div class="instagram-username">meusite</div>
                </div>
                <div class="instagram-image" id="instagram-image"></div>
                <div class="instagram-actions">
                    <div class="instagram-icons">
                        <div class="instagram-icon">❤️</div>
                        <div class="instagram-icon">💬</div>
                        <div class="instagram-icon">📤</div>
                    </div>
                    <div class="instagram-caption">
                        <span class="instagram-username-caption">meusite</span>
                        <span id="instagram-caption-text">Crie Imagens Incríveis para Redes Sociais 🚀 Gere imagens otimizadas para Facebook, Twitter, LinkedIn e Pinterest com este modelo responsivo. #design #socialmedia #marketing</span>
                    </div>
                </div>
            </div>

            <!-- X (Twitter) Preview -->
            <div id="twitter-preview" class="social-preview twitter-preview">
                <div class="twitter-header">
                    <div class="twitter-avatar">MS</div>
                    <div class="twitter-content">
                        <div class="twitter-user">
                            <span class="twitter-name">MeuSite</span>
                            <span class="twitter-handle">@meusite</span>
                            <span class="twitter-time">· 2m</span>
                        </div>
                        <div class="twitter-text">
                            Acabamos de lançar uma ferramenta incrível para criação de imagens para redes sociais! 🎨✨
                        </div>
                        <div class="twitter-card">
                            <div class="twitter-card-image" id="twitter-image"></div>
                            <div class="twitter-card-content">
                                <div class="twitter-card-title" id="twitter-title">Crie Imagens Incríveis para Redes Sociais</div>
                                <div class="twitter-card-description" id="twitter-description">Gere imagens otimizadas para Facebook, Twitter, LinkedIn e Pinterest com este modelo responsivo.</div>
                                <div class="twitter-card-url">🔗 meusite.com</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pinterest Preview -->
            <div id="pinterest-preview" class="social-preview pinterest-preview">
                <div class="pinterest-image" id="pinterest-image">
                    <button class="pinterest-save-btn">Salvar</button>
                </div>
                <div class="pinterest-content">
                    <div class="pinterest-title" id="pinterest-title">Crie Imagens Incríveis para Redes Sociais</div>
                    <div class="pinterest-description" id="pinterest-description">Gere imagens otimizadas para Facebook, Twitter, LinkedIn e Pinterest com este modelo responsivo.</div>
                    <div class="pinterest-profile">
                        <div class="pinterest-avatar">MS</div>
                        <div class="pinterest-username">MeuSite</div>
                    </div>
                </div>
            </div>

            <!-- Informações sobre dimensões -->
            <div class="dimensions-info">
                <strong>Especificações OG:Image:</strong><br>
                • Dimensões: 1200x630px (proporção 1.91:1)<br>
                • Tamanho recomendado: menos de 8MB<br>
                • Formatos: JPG, PNG, GIF<br>
                • Compatível com: Facebook, Instagram, X (Twitter), Pinterest, LinkedIn, WhatsApp
            </div>
        </div>
    </div>

    <!-- Modal para código HTML -->
    <div class="modal" id="codeModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Código HTML Gerado</h3>
                <button type="button" class="close-btn" id="closeCodeModalBtn">&times;</button>
            </div>
            <div class="modal-body">
                <p>Cole este código no &lt;head&gt; da sua página:</p>
                <div class="code-container">
                    <pre id="generatedCode"></pre>
                    <button type="button" class="copy-btn" id="copyCodeBtn">Copiar Código</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Editor de Imagem -->
    <div class="image-editor-container is-hidden" id="imageEditor">
        <div class="image-editor-header">
            <h2 class="image-editor-title">Editor de Imagem</h2>
            <button class="image-editor-close" id="closeImageEditor">&times;</button>
        </div>
        
        <div class="image-editor-main">
            <div class="image-editor-canvas-container">
                <canvas id="imageEditorCanvas"></canvas>
            </div>
            
            <div class="image-editor-controls">
                <!-- Controles de Layout -->
                <div class="control-group">
                    <h3 class="control-group-title">Layout</h3>
                    
                    <div class="control-item">
                        <div class="control-buttons">
                            <button class="control-button" id="rotateLeftBtn">↺ Girar Esq</button>
                            <button class="control-button" id="rotateRightBtn">↻ Girar Dir</button>
                        </div>
                    </div>
                    
                    <div class="control-item">
                        <div class="control-buttons">
                            <button class="control-button" id="zoomInBtn">🔍+ Ampliar</button>
                            <button class="control-button" id="zoomOutBtn">🔍- Reduzir</button>
                        </div>
                    </div>
                    
                    <div class="control-item">
                        <div class="control-buttons">
                            <button class="control-button" id="resetLayoutBtn">↺ Resetar Layout</button>
                        </div>
                    </div>
                </div>
                
                <!-- Controles de Ajuste -->
                <div class="control-group">
                    <h3 class="control-group-title">Ajustes</h3>
                    
                    <div class="control-item">
                        <div class="control-label">
                            <span>Brilho</span>
                            <span class="control-value" id="brightnessValue">100%</span>
                        </div>
                        <input type="range" class="control-slider" id="brightnessSlider" min="0" max="200" value="100">
                    </div>
                    
                    <div class="control-item">
                        <div class="control-label">
                            <span>Contraste</span>
                            <span class="control-value" id="contrastValue">100%</span>
                        </div>
                        <input type="range" class="control-slider" id="contrastSlider" min="0" max="200" value="100">
                    </div>
                    
                    <div class="control-item">
                        <div class="control-label">
                            <span>Saturação</span>
                            <span class="control-value" id="saturationValue">100%</span>
                        </div>
                        <input type="range" class="control-slider" id="saturationSlider" min="0" max="200" value="100">
                    </div>
                    
                    <div class="control-item">
                        <div class="control-label">
                            <span>Desfoque</span>
                            <span class="control-value" id="blurValue">0px</span>
                        </div>
                        <input type="range" class="control-slider" id="blurSlider" min="0" max="10" value="0" step="0.1">
                    </div>
                </div>
                
                <!-- Controles de Recorte -->
                <div class="control-group">
                    <h3 class="control-group-title">Recorte</h3>
                    
                    <div class="control-item">
                        <div class="control-buttons">
                            <button class="control-button" id="toggleCropBtn">✂️ Modo de Recorte</button>
                        </div>
                    </div>
                    
                    <div class="control-item">
                        <div class="control-buttons">
                            <button class="control-button" id="applyCropBtn" disabled>Aplicar Recorte</button>
                        </div>
                    </div>
                </div>
                
                <!-- Botão de Reset -->
                <div class="control-group">
                    <div class="control-item">
                        <div class="control-buttons">
                            <button class="control-button danger" id="resetAllBtn">↺ Resetar Tudo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="image-editor-footer">
            <button class="editor-btn editor-btn-cancel" id="cancelImageEdit">Cancelar</button>
            <button class="editor-btn editor-btn-apply" id="applyImageEdit">Aplicar Alterações</button>
        </div>
    </div>
<?php require_once 'assets/common/footer.php'; ?>
