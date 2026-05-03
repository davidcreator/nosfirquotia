// Templates de cores predefinidos
const templates = {
    gradient: {
        primary: '#667eea',
        secondary: '#764ba2',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    minimal: {
        primary: '#2d3748',
        secondary: '#4a5568',
        background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)'
    },
    bold: {
        primary: '#e53e3e',
        secondary: '#c53030',
        background: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)'
    },
    tech: {
        primary: '#1a202c',
        secondary: '#2d3748',
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
    }
};

// Configurações para o contador de caracteres
const CHAR_LIMITS = {
    TITLE: {
        MIN_RECOMMENDED: 30,
        MAX_RECOMMENDED: 60,
        ABSOLUTE_MAX: 90
    },
    DESCRIPTION: {
        MIN_RECOMMENDED: 55,
        MAX_RECOMMENDED: 200,
        ABSOLUTE_MAX: 300
    }
};

// Variáveis globais
let currentBackgroundImage = null;
let currentImageFile = null;
const OG_SETTINGS_STORAGE_KEY = 'ogImageSettings';

function getBrandKitApi() {
    return window.AQBrandKit || null;
}

function normalizeOgHex(value, fallback = '#667eea') {
    const normalized = String(value || '').trim().toLowerCase();
    if (/^#[0-9a-f]{6}$/.test(normalized)) {
        return normalized;
    }
    if (/^#[0-9a-f]{3}$/.test(normalized)) {
        return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
    }
    return String(fallback || '#667eea').toLowerCase();
}

function getActiveTemplateId() {
    const active = document.querySelector('.template-btn.active');
    if (!active) {
        return '';
    }
    return String(active.getAttribute('data-template') || '').trim();
}

function buildOgProfilePayload(partial = {}) {
    const patch = partial && typeof partial === 'object' ? partial : {};
    const titleElement = document.getElementById('title');
    const descriptionElement = document.getElementById('description');
    const brandElement = document.getElementById('brand');
    const primaryColorElement = document.getElementById('primaryColor');
    const secondaryColorElement = document.getElementById('secondaryColor');
    const imageOpacityElement = document.getElementById('imageOpacity');
    const overlayOpacityElement = document.getElementById('overlayOpacity');

    const title = Object.prototype.hasOwnProperty.call(patch, 'title')
        ? patch.title
        : (titleElement ? titleElement.value : '');
    const description = Object.prototype.hasOwnProperty.call(patch, 'description')
        ? patch.description
        : (descriptionElement ? descriptionElement.value : '');
    const brand = Object.prototype.hasOwnProperty.call(patch, 'brand')
        ? patch.brand
        : (brandElement ? brandElement.value : '');
    const primaryColor = Object.prototype.hasOwnProperty.call(patch, 'primaryColor')
        ? patch.primaryColor
        : (primaryColorElement ? primaryColorElement.value : '#667eea');
    const secondaryColor = Object.prototype.hasOwnProperty.call(patch, 'secondaryColor')
        ? patch.secondaryColor
        : (secondaryColorElement ? secondaryColorElement.value : '#764ba2');
    const imageOpacity = Object.prototype.hasOwnProperty.call(patch, 'imageOpacity')
        ? patch.imageOpacity
        : (imageOpacityElement ? imageOpacityElement.value : '0.8');
    const overlayOpacity = Object.prototype.hasOwnProperty.call(patch, 'overlayOpacity')
        ? patch.overlayOpacity
        : (overlayOpacityElement ? overlayOpacityElement.value : '0.5');
    const template = Object.prototype.hasOwnProperty.call(patch, 'template')
        ? patch.template
        : getActiveTemplateId();

    const hasContent = Boolean(String(title || '').trim() || String(description || '').trim() || String(brand || '').trim());

    return {
        available: Object.prototype.hasOwnProperty.call(patch, 'available')
            ? Boolean(patch.available)
            : hasContent,
        title: String(title || '').slice(0, 180),
        description: String(description || '').slice(0, 500),
        brand: String(brand || '').slice(0, 160),
        template: String(template || '').slice(0, 80),
        primaryColor: normalizeOgHex(primaryColor, '#667eea'),
        secondaryColor: normalizeOgHex(secondaryColor, '#764ba2'),
        imageOpacity: Number.parseFloat(imageOpacity),
        overlayOpacity: Number.parseFloat(overlayOpacity)
    };
}

function syncOgProfileState(partial = {}) {
    const api = getBrandKitApi();
    if (!api || typeof api.saveOgProfileState !== 'function') {
        return false;
    }

    const payload = buildOgProfilePayload(partial);
    api.saveOgProfileState(payload, 'ocimage');
    return true;
}

// Função para atualizar o contador de caracteres
function updateCharacterCounter(fieldId, limits) {
    try {
        const field = document.getElementById(fieldId);
        
        if (!field) {
            console.error(`Elemento de campo ${fieldId} não encontrado`);
            return;
        }
        
        const charCount = field.value.length;
        
        // Cria ou atualiza o contador se não existir
        let counterContainer = document.getElementById(`${fieldId}-counter`);
        if (!counterContainer) {
            counterContainer = createCharacterCounter(fieldId, limits);
            if (field.parentNode) {
                field.parentNode.insertBefore(counterContainer, field.nextSibling);
            } else {
                console.error(`Elemento pai do campo ${fieldId} não encontrado`);
                return;
            }
        }
        
        // Atualiza o contador
        const counterText = counterContainer.querySelector('.counter-text');
        const progressBar = counterContainer.querySelector('.progress-bar');
        const progressFill = counterContainer.querySelector('.progress-fill');
        
        if (!counterText || !progressBar || !progressFill) {
            console.error(`Elementos do contador para ${fieldId} não encontrados`);
            return;
        }
    
    counterText.textContent = `${charCount} caracteres`;
    
    // Calcula a porcentagem e define o status
    let percentage = 0;
    let status = 'below';
    let statusText = 'Abaixo do recomendado';
    let color = '#ef4444'; // Vermelho
    
    if (charCount < limits.MIN_RECOMMENDED) {
        percentage = (charCount / limits.MIN_RECOMMENDED) * 33.33;
        status = 'below';
        statusText = 'Abaixo do recomendado';
        color = '#ef4444'; // Vermelho
    } else if (charCount <= limits.MAX_RECOMMENDED) {
        percentage = 33.33 + ((charCount - limits.MIN_RECOMMENDED) / (limits.MAX_RECOMMENDED - limits.MIN_RECOMMENDED)) * 33.33;
        status = 'optimal';
        statusText = 'Quantidade ideal';
        color = '#10b981'; // Verde
    } else if (limits.ABSOLUTE_MAX && charCount <= limits.ABSOLUTE_MAX) {
        percentage = 66.66 + ((charCount - limits.MAX_RECOMMENDED) / (limits.ABSOLUTE_MAX - limits.MAX_RECOMMENDED)) * 33.34;
        status = 'warning';
        statusText = 'Aceitável (máximo)';
        color = '#f59e0b'; // Amarelo/Laranja
    } else {
        percentage = 100;
        status = 'above';
        statusText = limits.ABSOLUTE_MAX ? 'Acima do limite máximo' : 'Acima do recomendado';
        color = '#dc2626'; // Vermelho escuro
    }
    
    // Atualiza a barra de progresso
    progressFill.style.width = `${Math.min(percentage, 100)}%`;
    progressFill.style.backgroundColor = color;
    
    // Atualiza o status
    const statusElement = counterContainer.querySelector('.status-text');
    if (statusElement) {
        statusElement.textContent = statusText;
        statusElement.style.color = color;
    }
    
    // Atualiza as classes CSS
    counterContainer.className = `character-counter ${status}`;
    
    // Atualiza as informações sobre os limites
    const limitsInfo = counterContainer.querySelector('.limits-info');
    if (limitsInfo) {
        const maxText = limits.ABSOLUTE_MAX ? `, máximo ${limits.ABSOLUTE_MAX}` : '';
        limitsInfo.textContent = `Recomendado: ${limits.MIN_RECOMMENDED}-${limits.MAX_RECOMMENDED}${maxText} caracteres`;
    }
    } catch (error) {
        console.error(`Erro ao atualizar contador para ${fieldId}:`, error);
    }
}

// Função para atualizar o contador de caracteres da descrição (compatibilidade)
function updateDescriptionCounter() {
    updateCharacterCounter('description', CHAR_LIMITS.DESCRIPTION);
}

// Função para atualizar o contador de caracteres do título
function updateTitleCounter() {
    updateCharacterCounter('title', CHAR_LIMITS.TITLE);
}

// Função para criar o elemento do contador de caracteres
function createCharacterCounter(fieldId, limits) {
    const counterContainer = document.createElement('div');
    counterContainer.id = `${fieldId}-counter`;
    counterContainer.className = 'character-counter';
    
    const maxText = limits.ABSOLUTE_MAX ? `, máximo ${limits.ABSOLUTE_MAX}` : '';
    
    counterContainer.innerHTML = `
        <div class="counter-header">
            <span class="counter-text">0 caracteres</span>
            <span class="status-text">Abaixo do recomendado</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill"></div>
            <div class="progress-markers">
                <div class="marker min-marker" style="left: 33.33%"></div>
                <div class="marker max-marker" style="left: 66.66%"></div>
                ${limits.ABSOLUTE_MAX ? '<div class="marker absolute-marker" style="left: 100%"></div>' : ''}
            </div>
        </div>
        <div class="limits-info">Recomendado: ${limits.MIN_RECOMMENDED}-${limits.MAX_RECOMMENDED}${maxText} caracteres</div>
    `;
    
    // Adiciona os estilos CSS se não existirem
    addCharacterCounterStyles();
    
    return counterContainer;
}

// Função para adicionar estilos CSS do contador
function addCharacterCounterStyles() {
    if (document.getElementById('character-counter-styles')) {
        return; // Estilos já foram adicionados
    }
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'character-counter-styles';
    styleSheet.textContent = `
        .character-counter {
            margin-top: 8px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            font-size: 14px;
            transition: all 0.2s ease;
        }
        
        .character-counter.below {
            border-color: #fecaca;
            background: #fef2f2;
        }
        
        .character-counter.optimal {
            border-color: #bbf7d0;
            background: #f0fdf4;
        }
        
        .character-counter.warning {
            border-color: #fed7aa;
            background: #fffbeb;
        }
        
        .character-counter.above {
            border-color: #fca5a5;
            background: #fef2f2;
        }
        
        .counter-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .counter-text {
            font-weight: 500;
            color: #374151;
        }
        
        .status-text {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .progress-bar {
            position: relative;
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        
        .progress-fill {
            height: 100%;
            border-radius: 3px;
            transition: all 0.3s ease;
        }
        
        .progress-markers {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            pointer-events: none;
        }
        
        .marker {
            position: absolute;
            top: 0;
            width: 2px;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            transform: translateX(-50%);
        }
        
        .limits-info {
            color: #6b7280;
            font-size: 12px;
            text-align: center;
        }
    `;
    
    document.head.appendChild(styleSheet);
}

// Função para atualizar o preview principal e das redes sociais
function updatePreview() {
    try {
        // Obtém os elementos de input
        const titleElement = document.getElementById('title');
        const descriptionElement = document.getElementById('description');
        const brandElement = document.getElementById('brand');
        const primaryColorElement = document.getElementById('primaryColor');
        const secondaryColorElement = document.getElementById('secondaryColor');
        const imageOpacityElement = document.getElementById('imageOpacity');
        const overlayOpacityElement = document.getElementById('overlayOpacity');
        
        // Obtém os valores ou usa valores padrão
        const title = titleElement ? titleElement.value : '';
        const description = descriptionElement ? descriptionElement.value : '';
        const brand = brandElement ? brandElement.value : '';
        const primaryColor = primaryColorElement ? primaryColorElement.value : '#667eea';
        const secondaryColor = secondaryColorElement ? secondaryColorElement.value : '#764ba2';
        const imageOpacity = imageOpacityElement ? imageOpacityElement.value : '0.5';
        const overlayOpacity = overlayOpacityElement ? overlayOpacityElement.value : '0.5';

        // Atualiza o conteúdo do preview principal
        const previewTitleElement = document.getElementById('previewTitle');
        const previewDescriptionElement = document.getElementById('previewDescription');
        const previewBrandElement = document.getElementById('previewBrand');
        
        if (previewTitleElement) previewTitleElement.textContent = title;
        if (previewDescriptionElement) previewDescriptionElement.textContent = description;
        if (previewBrandElement) previewBrandElement.textContent = brand;

        // Atualiza os valores dos sliders
        const sliders = document.querySelectorAll('.slider');
        if (sliders && sliders.length > 0) {
            sliders.forEach(slider => {
                if (slider && slider.parentElement) {
                    const valueSpan = slider.parentElement.querySelector('.slider-value');
                    if (valueSpan) {
                        valueSpan.textContent = slider.value;
                    }
                }
            });
        }

        // Atualiza o background da imagem principal
        const ogImage = document.getElementById('ogImage');
        let backgroundStyle = '';
    
    if (ogImage) {
        if (currentBackgroundImage) {
            // Se há uma imagem de fundo
            ogImage.style.backgroundImage = `url(${currentBackgroundImage})`;
            ogImage.style.backgroundSize = 'cover';
            ogImage.style.backgroundPosition = 'center';
            ogImage.style.backgroundRepeat = 'no-repeat';
            
            // Ajusta a opacidade da imagem através do filtro
            ogImage.style.filter = `brightness(${imageOpacity})`;
            
            // Atualiza o overlay
            backgroundStyle = `linear-gradient(rgba(${hexToRgb(primaryColor)}, ${overlayOpacity}), rgba(${hexToRgb(secondaryColor)}, ${overlayOpacity})), url(${currentBackgroundImage})`;
            ogImage.style.background = backgroundStyle;
        } else {
            // Se não há imagem de fundo, usa apenas o gradiente
            ogImage.style.backgroundImage = 'none';
            backgroundStyle = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
            ogImage.style.background = backgroundStyle;
            ogImage.style.filter = 'none';
        }
    } else {
        console.error('Elemento ogImage não encontrado');
        backgroundStyle = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
    }
    
    // Atualiza todos os previews das redes sociais
    updateSocialPreviews(title, description, brand, backgroundStyle);
    } catch (error) {
        console.error('Erro ao atualizar preview:', error);
    }
}

// Função para atualizar previews das redes sociais
function updateSocialPreviews(title, description, brand, backgroundStyle) {
    try {
        // Atualiza Facebook
        updateFacebookPreview(title, description, brand, backgroundStyle);
        
        // Atualiza Instagram
        updateInstagramPreview(title, description, brand, backgroundStyle);
        
        // Atualiza Twitter/X
        updateTwitterPreview(title, description, brand, backgroundStyle);
        
        // Atualiza Pinterest
        updatePinterestPreview(title, description, brand, backgroundStyle);
    } catch (error) {
        console.error('Erro ao atualizar previews sociais:', error);
    }
}

// Função para atualizar preview do Facebook
function updateFacebookPreview(title, description, brand, backgroundStyle) {
    try {
        const facebookTitle = document.getElementById('facebook-title');
        const facebookDescription = document.getElementById('facebook-description');
        const facebookImage = document.getElementById('facebook-image');
        const facebookUrl = document.querySelector('.facebook-link-url');
        
        if (facebookTitle) facebookTitle.textContent = title || 'Título da página';
        if (facebookDescription) facebookDescription.textContent = description || 'Descrição da página';
        if (facebookImage) {
            facebookImage.style.background = backgroundStyle;
            facebookImage.style.backgroundSize = 'cover';
            facebookImage.style.backgroundPosition = 'center';
        }
        if (facebookUrl) facebookUrl.textContent = brand.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    } catch (error) {
        console.error('Erro ao atualizar preview do Facebook:', error);
    }
}

// Função para atualizar preview do Instagram
function updateInstagramPreview(title, description, brand, backgroundStyle) {
    try {
        // Selecionar os elementos do DOM
        const instagramImage = document.querySelector('.instagram-post .post-image');
        const instagramCaption = document.querySelector('.instagram-post .caption');
        const instagramUsername = document.querySelector('.instagram-post .username');
        
        // Verificar se os elementos existem antes de usá-los
        if (instagramImage) {
            // Aplicar o estilo de background
            if (backgroundStyle) {
                instagramImage.style.background = backgroundStyle;
            }
            
            // Adicionar o título como texto sobreposto se necessário
            const existingText = instagramImage.querySelector('.overlay-text');
            if (existingText) {
                existingText.textContent = title;
            } else if (title) {
                const overlayText = document.createElement('div');
                overlayText.className = 'overlay-text';
                overlayText.textContent = title;
                overlayText.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-weight: bold;
                    font-size: 18px;
                    text-align: center;
                    padding: 10px;
                    background: rgba(0, 0, 0, 0.5);
                    border-radius: 8px;
                `;
                instagramImage.appendChild(overlayText);
            }
        }
        
        if (instagramCaption) {
            const hashtags = generateHashtags(title, description);
            instagramCaption.textContent = `${title} 🚀 ${description} ${hashtags}`;
        }
        
        if (instagramUsername) {
            instagramUsername.textContent = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
        }
    } catch (error) {
        console.error('Erro ao atualizar preview do Instagram:', error);
    }
}// Função para atualizar preview do Instagram
function updateInstagramPreview(title, description, brand, backgroundStyle) {
    try {
        console.log('Atualizando preview do Instagram...', { title, description, brand });
        
        // Selecionar os elementos do DOM com fallbacks
        const instagramImage = document.querySelector('.instagram-post .post-image') || 
                              document.querySelector('.instagram-preview .post-image') ||
                              document.querySelector('#instagram-image');
        
        const instagramCaption = document.querySelector('.instagram-post .caption') || 
                                document.querySelector('.instagram-preview .caption') ||
                                document.querySelector('#instagram-caption');
        
        const instagramUsername = document.querySelector('.instagram-post .username') || 
                                 document.querySelector('.instagram-preview .username') ||
                                 document.querySelector('#instagram-username');
        
        // Verificar se pelo menos um elemento foi encontrado
        if (!instagramImage && !instagramCaption && !instagramUsername) {
            console.warn('Nenhum elemento do Instagram encontrado no DOM');
            return;
        }
        
        // Atualizar imagem do post
        if (instagramImage) {
            console.log('Atualizando imagem do Instagram');
            
            // Garantir que o container tenha posição relativa
            instagramImage.style.position = 'relative';
            instagramImage.style.overflow = 'hidden';
            
            // Aplicar o estilo de background
            if (backgroundStyle) {
                instagramImage.style.background = backgroundStyle;
                instagramImage.style.backgroundSize = 'cover';
                instagramImage.style.backgroundPosition = 'center';
                instagramImage.style.backgroundRepeat = 'no-repeat';
            }
            
            // Definir dimensões padrão se não estiverem definidas
            if (!instagramImage.style.width) {
                instagramImage.style.width = '100%';
                instagramImage.style.aspectRatio = '1 / 1'; // Quadrado para Instagram
                instagramImage.style.minHeight = '300px';
            }
            
            // Gerenciar texto sobreposto
            const existingText = instagramImage.querySelector('.overlay-text');
            if (title && title.trim()) {
                if (existingText) {
                    existingText.textContent = title;
                } else {
                    const overlayText = document.createElement('div');
                    overlayText.className = 'overlay-text';
                    overlayText.textContent = title;
                    overlayText.style.cssText = `
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: white;
                        font-weight: bold;
                        font-size: clamp(16px, 4vw, 24px);
                        text-align: center;
                        padding: 15px 20px;
                        background: rgba(0, 0, 0, 0.7);
                        border-radius: 12px;
                        max-width: 80%;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        backdrop-filter: blur(10px);
                        line-height: 1.4;
                        word-wrap: break-word;
                        z-index: 10;
                    `;
                    instagramImage.appendChild(overlayText);
                }
            } else if (existingText) {
                // Remover texto sobreposto se não houver título
                existingText.remove();
            }
        }
        
        // Atualizar caption do post
        if (instagramCaption) {
            console.log('Atualizando caption do Instagram');
            
            let captionText = '';
            
            // Construir a caption
            if (title && title.trim()) {
                captionText += `${title} 🚀\n\n`;
            }
            
            if (description && description.trim()) {
                captionText += `${description}\n\n`;
            }
            
            // Gerar hashtags
            const hashtags = generateHashtags(title, description);
            if (hashtags) {
                captionText += hashtags;
            }
            
            // Aplicar texto à caption
            instagramCaption.textContent = captionText.trim();
            
            // Estilizar caption
            instagramCaption.style.cssText = `
                font-size: 14px;
                line-height: 1.5;
                color: #262626;
                margin-top: 12px;
                white-space: pre-line;
                max-height: 150px;
                overflow-y: auto;
                padding: 8px 0;
            `;
        }
        
        // Atualizar username
        if (instagramUsername) {
            console.log('Atualizando username do Instagram');
            
            let username = '';
            if (brand && brand.trim()) {
                // Converter para formato de username válido
                username = brand.toLowerCase()
                    .replace(/[^a-z0-9._]/g, '')
                    .replace(/^[._]|[._]$/g, '') // Remover pontos/underscores do início e fim
                    .substring(0, 30); // Limitar a 30 caracteres
                
                // Garantir que não seja vazio
                if (!username) {
                    username = 'usuario';
                }
            } else {
                username = 'usuario';
            }
            
            instagramUsername.textContent = `@${username}`;
            
            // Estilizar username
            instagramUsername.style.cssText = `
                font-weight: bold;
                color: #262626;
                font-size: 14px;
                margin-bottom: 8px;
            `;
        }
        
        // Adicionar indicadores visuais se necessário
        addInstagramInteractionElements();
        
        console.log('Preview do Instagram atualizado com sucesso');
        
    } catch (error) {
        console.error('Erro ao atualizar preview do Instagram:', error);
        
        // Tentar recuperar graciosamente
        const errorContainer = document.querySelector('.instagram-post') || 
                              document.querySelector('.instagram-preview');
        if (errorContainer) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'instagram-error';
            errorMessage.textContent = 'Erro ao carregar preview do Instagram';
            errorMessage.style.cssText = `
                padding: 20px;
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                color: #6c757d;
                text-align: center;
                font-size: 14px;
            `;
            errorContainer.innerHTML = '';
            errorContainer.appendChild(errorMessage);
        }
    }
}

// Função para gerar hashtags inteligentes
function generateHashtags(title, description) {
    try {
        const text = `${title || ''} ${description || ''}`.toLowerCase();
        
        // Palavras comuns a serem ignoradas
        const stopWords = ['o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do', 'das', 'dos', 
                          'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com', 'sem', 'sobre', 'entre', 
                          'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
        
        // Extrair palavras-chave
        const words = text.split(/[\s,.-]+/)
            .filter(word => word.length > 2)
            .filter(word => !stopWords.includes(word))
            .map(word => word.replace(/[^a-z0-9]/g, ''))
            .filter(word => word.length > 2);
        
        // Remover duplicatas e limitar
        const uniqueWords = [...new Set(words)].slice(0, 8);
        
        // Adicionar hashtags padrão relevantes
        const defaultHashtags = ['design', 'creative', 'brand', 'marketing', 'digital'];
        const finalHashtags = [...uniqueWords, ...defaultHashtags]
            .slice(0, 10)
            .map(word => `#${word}`);
        
        return finalHashtags.join(' ');
        
    } catch (error) {
        console.error('Erro ao gerar hashtags:', error);
        return '#design #creative #brand';
    }
}

// Função para adicionar elementos de interação do Instagram
function addInstagramInteractionElements() {
    try {
        const instagramContainer = document.querySelector('.instagram-post') || 
                                 document.querySelector('.instagram-preview');
        
        if (!instagramContainer) return;
        
        // Verificar se já existem elementos de interação
        if (instagramContainer.querySelector('.instagram-interactions')) return;
        
        // Criar container de interações
        const interactionsContainer = document.createElement('div');
        interactionsContainer.className = 'instagram-interactions';
        interactionsContainer.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-top: 1px solid #efefef;
            margin-top: 12px;
        `;
        
        // Botões de ação
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'instagram-actions';
        actionsContainer.style.cssText = `
            display: flex;
            gap: 16px;
            align-items: center;
        `;
        
        // Ícones de ação (coração, comentário, compartilhar)
        const actions = [
            { icon: '♥', label: 'Curtir' },
            { icon: '💬', label: 'Comentar' },
            { icon: '📤', label: 'Compartilhar' }
        ];
        
        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.icon;
            button.title = action.label;
            button.style.cssText = `
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 4px;
                opacity: 0.7;
                transition: opacity 0.2s;
            `;
            button.addEventListener('mouseenter', () => button.style.opacity = '1');
            button.addEventListener('mouseleave', () => button.style.opacity = '0.7');
            
            actionsContainer.appendChild(button);
        });
        
        // Contador de curtidas
        const likesContainer = document.createElement('div');
        likesContainer.className = 'instagram-likes';
        likesContainer.textContent = '1,234 curtidas';
        likesContainer.style.cssText = `
            font-size: 14px;
            font-weight: bold;
            color: #262626;
            margin-top: 8px;
        `;
        
        interactionsContainer.appendChild(actionsContainer);
        
        const captionContainer = instagramContainer.querySelector('.caption');
        if (captionContainer) {
            captionContainer.parentNode.insertBefore(interactionsContainer, captionContainer);
            captionContainer.parentNode.insertBefore(likesContainer, captionContainer);
        } else {
            instagramContainer.appendChild(interactionsContainer);
            instagramContainer.appendChild(likesContainer);
        }
        
    } catch (error) {
        console.error('Erro ao adicionar elementos de interação:', error);
    }
}

// Função para resetar preview do Instagram
function resetInstagramPreview() {
    try {
        const instagramContainer = document.querySelector('.instagram-post') || 
                                 document.querySelector('.instagram-preview');
        
        if (instagramContainer) {
            // Remover elementos dinâmicos
            const overlayText = instagramContainer.querySelector('.overlay-text');
            const interactions = instagramContainer.querySelector('.instagram-interactions');
            const likes = instagramContainer.querySelector('.instagram-likes');
            const error = instagramContainer.querySelector('.instagram-error');
            
            [overlayText, interactions, likes, error].forEach(element => {
                if (element) element.remove();
            });
            
            // Resetar estilos
            const image = instagramContainer.querySelector('.post-image');
            if (image) {
                image.style.background = '';
            }
            
            const caption = instagramContainer.querySelector('.caption');
            if (caption) {
                caption.textContent = '';
            }
            
            const username = instagramContainer.querySelector('.username');
            if (username) {
                username.textContent = '@usuario';
            }
        }
        
    } catch (error) {
        console.error('Erro ao resetar preview do Instagram:', error);
    }
}

// Função para atualizar preview do Twitter/X
function updateTwitterPreview(title, description, brand, backgroundStyle) {
    try {
        const twitterTitle = document.getElementById('twitter-title');
        const twitterDescription = document.getElementById('twitter-description');
        const twitterImage = document.getElementById('twitter-image');
        const twitterUrl = document.querySelector('.twitter-card-url');
        const twitterName = document.querySelector('.twitter-name');
        const twitterHandle = document.querySelector('.twitter-handle');
        
        if (twitterTitle) twitterTitle.textContent = title || 'Título da página';
        if (twitterDescription) twitterDescription.textContent = description || 'Descrição da página';
        if (twitterImage) {
            twitterImage.style.background = backgroundStyle;
            twitterImage.style.backgroundSize = 'cover';
            twitterImage.style.backgroundPosition = 'center';
        }
        if (twitterUrl) twitterUrl.textContent = `🔗 ${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        if (twitterName) twitterName.textContent = brand || 'MeuSite';
        if (twitterHandle) twitterHandle.textContent = `@${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    } catch (error) {
        console.error('Erro ao atualizar preview do Twitter/X:', error);
    }
}

// Função para atualizar preview do Pinterest
function updatePinterestPreview(title, description, brand, backgroundStyle) {
    try {
        const pinterestTitle = document.getElementById('pinterest-title');
        const pinterestDescription = document.getElementById('pinterest-description');
        const pinterestImage = document.getElementById('pinterest-image');
        const pinterestUsername = document.querySelector('.pinterest-username');
        
        if (pinterestTitle) pinterestTitle.textContent = title || 'Título da página';
        if (pinterestDescription) pinterestDescription.textContent = description || 'Descrição da página';
        if (pinterestImage) {
            pinterestImage.style.background = backgroundStyle;
            pinterestImage.style.backgroundSize = 'cover';
            pinterestImage.style.backgroundPosition = 'center';
        }
        if (pinterestUsername) {
            pinterestUsername.textContent = brand.toLowerCase().replace(/[^a-z0-9]/g, '');
        }
    } catch (error) {
        console.error('Erro ao atualizar preview do Pinterest:', error);
    }
}

// Função auxiliar para converter hex para RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '0, 0, 0';
}

// Função para gerar hashtags baseadas no título e descrição
function generateHashtags(title, description) {
    try {
        // Verifica se title e description são strings válidas
        const titleStr = title || '';
        const descriptionStr = description || '';
        
        const words = (titleStr + ' ' + descriptionStr).toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .split(' ')
            .filter(word => word.length > 3)
            .slice(0, 5);
        
        return words.map(word => `#${word}`).join(' ');
    } catch (error) {
        console.error('Erro ao gerar hashtags:', error);
        return '';
    }
}

// Função para carregar imagem de fundo
function loadBackgroundImage(input) {
    try {
        if (!input) {
            console.error('Input de arquivo não encontrado');
            return;
        }
        
        const file = input.files[0];
        if (!file) {
            console.log('Nenhum arquivo selecionado');
            return;
        }
        
        // Verifica o tamanho do arquivo (limite de 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('O arquivo é muito grande. O tamanho máximo permitido é 5MB.');
            return;
        }
        
        // Verifica o tipo do arquivo
        if (!file.type.match('image.*')) {
            alert('Por favor, selecione uma imagem válida (PNG, JPG, GIF).');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            currentBackgroundImage = e.target.result;
            updatePreview();
        };
        reader.onerror = function() {
            console.error('Erro ao ler o arquivo');
            alert('Ocorreu um erro ao ler o arquivo. Tente novamente.');
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Erro ao carregar imagem de fundo:', error);
        alert('Ocorreu um erro ao carregar a imagem.');
    }
}

// Função para remover imagem de fundo
function removeBackgroundImage() {
    try {
        currentBackgroundImage = null;
        const fileInput = document.getElementById('backgroundImage');
        if (fileInput) {
            fileInput.value = '';
        } else {
            console.warn('Elemento de input de arquivo não encontrado');
        }
        updatePreview();
    } catch (error) {
        console.error('Erro ao remover imagem de fundo:', error);
        alert('Ocorreu um erro ao remover a imagem de fundo.');
    }
}

// Função para resetar todos os campos
function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('brand').value = '';
    document.getElementById('primaryColor').value = '#1a73e8';
    document.getElementById('secondaryColor').value = '#34a853';
    document.getElementById('imageOpacity').value = '1';
    document.getElementById('overlayOpacity').value = '0.5';
    
    removeBackgroundImage();
    updatePreview();
}

// Função para download da imagem
function downloadImage(format = 'png') {
    try {
        const ogImage = document.getElementById('ogImage');
        if (!ogImage) {
            console.error('Elemento ogImage não encontrado');
            alert('Não foi possível encontrar a imagem para download.');
            return;
        }
        
        // Cria um canvas para capturar a imagem
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Não foi possível obter o contexto 2D do canvas');
            alert('Seu navegador não suporta a funcionalidade de download de imagem.');
            return;
        }
        
        // Define o tamanho do canvas (1200x630 é o tamanho padrão para OG image)
        canvas.width = 1200;
        canvas.height = 630;
        
        // Cria uma imagem temporária do elemento
        html2canvas(ogImage, {
            canvas: canvas,
            width: 1200,
            height: 630,
            scale: 1,
            useCORS: true,
            allowTaint: true
        }).then(function(canvas) {
            try {
                // Cria o link de download
                const link = document.createElement('a');
                link.download = `og-image.${format}`;
                link.href = canvas.toDataURL(`image/${format}`);
                link.click();
            } catch (innerError) {
                console.error('Erro ao criar link de download:', innerError);
                alert('Ocorreu um erro ao gerar o arquivo para download.');
            }
        }).catch(function(error) {
            console.error('Erro ao renderizar a imagem:', error);
            alert('Ocorreu um erro ao processar a imagem para download.');
        });
    } catch (error) {
        console.error('Erro ao iniciar download da imagem:', error);
        alert('Ocorreu um erro ao preparar a imagem para download.');
    }
}

// Função para alternar entre os previews das redes sociais
function showPreview(platform) {
    // Remove a classe 'active' de todas as abas
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Esconde todos os previews
    document.querySelectorAll('.social-preview').forEach(preview => {
        preview.classList.remove('active');
        preview.style.display = 'none';
    });
    
    // Ativa a aba clicada
    const activeButton = document.querySelector(`[onclick="showPreview('${platform}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Mostra o preview correspondente
    const activePreview = document.getElementById(`${platform}-preview`);
    if (activePreview) {
        activePreview.classList.add('active');
        activePreview.style.display = 'block';
    }
}

// Event listeners para inicializar o sistema
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona event listeners para todos os inputs
    const inputs = ['title', 'description', 'brand', 'primaryColor', 'secondaryColor', 'imageOpacity', 'overlayOpacity'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePreview);
        }
    });
    
    // Event listener para upload de imagem
    const backgroundImageInput = document.getElementById('backgroundImage');
    if (backgroundImageInput) {
        backgroundImageInput.addEventListener('change', function() {
            loadBackgroundImage(this);
        });
    }
    
    // Event listener para botão de reset
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', resetForm);
    }
    
    // Event listener para botão de download
    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => downloadImage('png'));
    }
    
    // Atualiza o preview inicial
    updatePreview();
    
    // Mostra o primeiro preview por padrão (pode ser 'facebook', 'instagram', etc.)
    showPreview('facebook');
});

// Função para copiar HTML das meta tags
function copyMetaTags() {
    try {
        const titleElement = document.getElementById('title');
        const descriptionElement = document.getElementById('description');
        const brandElement = document.getElementById('brand');
        
        if (!titleElement || !descriptionElement || !brandElement) {
            console.error('Elementos de formulário não encontrados');
            alert('Erro ao copiar meta tags. Elementos não encontrados.');
            return;
        }
        
        const title = titleElement.value || '';
        const description = descriptionElement.value || '';
        const brand = brandElement.value || 'meusite';
        const url = `https://${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        
        const metaTags = `
<!-- Open Graph Meta Tags -->
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${url}/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${url}/og-image.png" />
<meta name="twitter:site" content="@${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}" />
        `.trim();
        
        navigator.clipboard.writeText(metaTags).then(() => {
            // Feedback visual de que foi copiado
            const copyButton = document.getElementById('copyMetaButton');
            if (copyButton) {
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copiado!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 2000);
            }
        }).catch(error => {
            console.error('Erro ao copiar para a área de transferência:', error);
            alert('Não foi possível copiar as meta tags. Verifique as permissões do navegador.');
        });
    } catch (error) {
        console.error('Erro ao gerar meta tags:', error);
        alert('Ocorreu um erro ao gerar as meta tags.');
    }
}

// Função para carregar imagem de fundo
function loadBackgroundImage(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentBackgroundImage = e.target.result;
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
}

// Função para remover imagem de fundo
function removeBackgroundImage() {
    currentBackgroundImage = null;
    const fileInput = document.getElementById('backgroundImage');
    if (fileInput) {
        fileInput.value = '';
    }
    updatePreview();
}

// Função para resetar todos os campos
function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('brand').value = '';
    document.getElementById('primaryColor').value = '#1a73e8';
    document.getElementById('secondaryColor').value = '#34a853';
    document.getElementById('imageOpacity').value = '1';
    document.getElementById('overlayOpacity').value = '0.5';
    
    removeBackgroundImage();
    updatePreview();
}

// Função para download da imagem
function downloadImage(format = 'png') {
    const ogImage = document.getElementById('ogImage');
    if (!ogImage) return;
    
    // Cria um canvas para capturar a imagem
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Define o tamanho do canvas (1200x630 é o tamanho padrão para OG image)
    canvas.width = 1200;
    canvas.height = 630;
    
    // Cria uma imagem temporária do elemento
    html2canvas(ogImage, {
        canvas: canvas,
        width: 1200,
        height: 630,
        scale: 1,
        useCORS: true,
        allowTaint: true
    }).then(function(canvas) {
        // Cria o link de download
        const link = document.createElement('a');
        link.download = `og-image.${format}`;
        link.href = canvas.toDataURL(`image/${format}`);
        link.click();
    });
}

// Event listeners para inicializar o sistema
document.addEventListener('DOMContentLoaded', function() {
    // Adiciona event listeners para todos os inputs
    const inputs = ['title', 'description', 'brand', 'primaryColor', 'secondaryColor', 'imageOpacity', 'overlayOpacity'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePreview);
        }
    });
    
    // Event listener para upload de imagem
    const backgroundImageInput = document.getElementById('backgroundImage');
    if (backgroundImageInput) {
        backgroundImageInput.addEventListener('change', function() {
            loadBackgroundImage(this);
        });
    }
    
    // Event listener para botão de reset
    const resetButton = document.getElementById('resetButton');
    if (resetButton) {
        resetButton.addEventListener('click', resetForm);
    }
    
    // Event listener para botão de download
    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => downloadImage('png'));
    }
    
    // Atualiza o preview inicial
    updatePreview();
});

// Função para copiar HTML das meta tags
function copyMetaTags() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const brand = document.getElementById('brand').value;
    const url = `https://${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    
    const metaTags = `
<!-- Open Graph Meta Tags -->
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="${url}/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter Card Meta Tags -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${url}/og-image.png" />
<meta name="twitter:site" content="@${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}" />
    `.trim();
    
    navigator.clipboard.writeText(metaTags).then(() => {
        // Feedback visual de que foi copiado
        const copyButton = document.getElementById('copyMetaButton');
        if (copyButton) {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copiado!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        }
    }).catch(error => {
        console.error('Erro ao copiar meta tags:', error);
        alert('Ocorreu um erro ao copiar as meta tags.');
    });
}

// Função para aplicar um template predefinido
function applyTemplate(templateName) {
    const template = templates[templateName];
    if (!template) {
        return;
    }
    
    // Atualiza os valores dos inputs de cor
    document.getElementById('primaryColor').value = template.primary;
    document.getElementById('secondaryColor').value = template.secondary;
    
    // Remove a classe active de todos os botões
    document.querySelectorAll('.template-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona a classe active ao botão clicado
    document.querySelector(`[data-template="${templateName}"]`).classList.add('active');
    
    // Atualiza o preview
    updatePreview();
    saveSettings();
}

// Função para lidar com o upload de imagem
function handleImageUpload(file) {
    try {
        if (!file) return;
        
        // Valida o tipo de arquivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem.');
            return;
        }
        
        // Valida o tamanho do arquivo (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('O arquivo deve ter no máximo 5MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                currentBackgroundImage = e.target.result;
                currentImageFile = file;
                
                // Atualiza a área de upload
                const uploadArea = document.getElementById('uploadArea');
                if (uploadArea) {
                    uploadArea.innerHTML = `
                        <div class="upload-content">
                            <span class="upload-icon">✅</span>
                            <span class="upload-text">Imagem carregada: ${file.name}</span>
                            <span class="upload-formats">Clique para trocar a imagem</span>
                        </div>
                    `;
                } else {
                    console.warn('Elemento uploadArea não encontrado');
                }
                
                // Mostra os botões de ação
                const removeBtn = document.getElementById('removeImageBtn');
                const editBtn = document.getElementById('editImageBtn');
                
                if (removeBtn) removeBtn.style.display = 'block';
                if (editBtn) editBtn.style.display = 'block';
                
                // Atualiza o preview
                updatePreview();
            } catch (innerError) {
                console.error('Erro ao processar imagem carregada:', innerError);
                alert('Ocorreu um erro ao processar a imagem.');
            }
        };
        reader.onerror = function(error) {
            console.error('Erro ao ler o arquivo:', error);
            alert('Ocorreu um erro ao ler o arquivo de imagem.');
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Erro ao manipular upload de imagem:', error);
        alert('Ocorreu um erro ao processar o upload da imagem.');
    }
}

// Função para remover a imagem
function removeImage() {
    try {
        currentBackgroundImage = null;
        currentImageFile = null;
        
        // Restaura a área de upload
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <div class="upload-content">
                    <span class="upload-icon">📁</span>
                    <span class="upload-text">Clique ou arraste uma imagem aqui</span>
                    <span class="upload-formats">PNG, JPG, GIF até 5MB</span>
                </div>
            `;
        } else {
            console.warn('Elemento uploadArea não encontrado');
        }
        
        // Esconde os botões de ação
        const removeBtn = document.getElementById('removeImageBtn');
        const editBtn = document.getElementById('editImageBtn');
        
        if (removeBtn) removeBtn.style.display = 'none';
        if (editBtn) editBtn.style.display = 'none';
        
        // Atualiza o preview
        updatePreview();
    } catch (error) {
        console.error('Erro ao remover imagem:', error);
        alert('Ocorreu um erro ao remover a imagem.');
    }
}



// Função para exportar a imagem
function exportImage() {
    const ogImage = document.getElementById('ogImage');
    
    if (!ogImage) {
        console.error('Elemento ogImage não encontrado');
        alert('Erro ao exportar a imagem. Elemento não encontrado.');
        return;
    }
    
    // Configura o html2canvas para capturar com alta qualidade
    html2canvas(ogImage, {
        scale: 2, // Aumenta a qualidade
        width: 1200,
        height: 630,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        // Cria um link de download
        const link = document.createElement('a');
        link.download = `og-image-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    }).catch(error => {
        console.error('Erro ao exportar imagem:', error);
        alert('Erro ao exportar a imagem. Tente novamente.');
    });
}

// Função para gerar o código HTML
function generateCode() {
    const titleElement = document.getElementById('title');
    const descriptionElement = document.getElementById('description');
    
    if (!titleElement || !descriptionElement) {
        console.error('Elementos de título ou descrição não encontrados');
        alert('Erro ao gerar código. Elementos não encontrados.');
        return;
    }
    
    const title = titleElement.value || '';
    const description = descriptionElement.value || '';
    const imageUrl = 'https://seusite.com/og-image.png'; // URL onde a imagem será hospedada
    
    const code = `<!-- Meta tags para Open Graph (Facebook, LinkedIn, WhatsApp) -->
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://seusite.com" />

<!-- Meta tags para Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${imageUrl}" />

<!-- Meta tags gerais -->
<meta name="description" content="${escapeHtml(description)}" />
<meta name="title" content="${escapeHtml(title)}" />`;

    // Mostra o código no modal
    const generatedCodeElement = document.getElementById('generatedCode');
    const codeModalElement = document.getElementById('codeModal');
    
    if (!generatedCodeElement || !codeModalElement) {
        console.error('Elementos do modal não encontrados');
        alert('Erro ao exibir o código gerado. Elementos não encontrados.');
        return;
    }
    
    generatedCodeElement.textContent = code;
    codeModalElement.style.display = 'block';
}

// Função para escapar HTML
function escapeHtml(text) {
    try {
        if (text === null || text === undefined) {
            return '';
        }
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    } catch (error) {
        console.error('Erro ao escapar HTML:', error);
        return '';
    }
}

// Função para copiar o código
function copyCode() {
    const generatedCodeElement = document.getElementById('generatedCode');
    
    if (!generatedCodeElement) {
        console.error('Elemento de código gerado não encontrado');
        alert('Erro ao copiar o código. Elemento não encontrado.');
        return;
    }
    
    const code = generatedCodeElement.textContent;
    navigator.clipboard.writeText(code).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        
        if (!copyBtn) {
            console.error('Botão de cópia não encontrado');
            return;
        }
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copiado!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '#3b82f6';
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar código:', err);
        alert('Erro ao copiar o código. Tente selecionar e copiar manualmente.');
    });
}

// Função para fechar o modal
function closeModal() {
    const codeModalElement = document.getElementById('codeModal');
    
    if (!codeModalElement) {
        console.error('Elemento do modal não encontrado');
        return;
    }
    
    codeModalElement.style.display = 'none';
}

// Função para salvar configurações no localStorage
function saveSettings() {
    try {
        const titleElement = document.getElementById('title');
        const descriptionElement = document.getElementById('description');
        const brandElement = document.getElementById('brand');
        const primaryColorElement = document.getElementById('primaryColor');
        const secondaryColorElement = document.getElementById('secondaryColor');
        const imageOpacityElement = document.getElementById('imageOpacity');
        const overlayOpacityElement = document.getElementById('overlayOpacity');
        
        const settings = {
            title: titleElement ? titleElement.value : '',
            description: descriptionElement ? descriptionElement.value : '',
            brand: brandElement ? brandElement.value : '',
            primaryColor: primaryColorElement ? primaryColorElement.value : '#667eea',
            secondaryColor: secondaryColorElement ? secondaryColorElement.value : '#764ba2',
            imageOpacity: imageOpacityElement ? imageOpacityElement.value : '0.5',
            overlayOpacity: overlayOpacityElement ? overlayOpacityElement.value : '0.5',
            selectedTemplate: getActiveTemplateId()
        };
        
        localStorage.setItem(OG_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
        syncOgProfileState({
            ...settings,
            template: getActiveTemplateId(),
            available: true
        });
    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
    }
}

// Função para carregar configurações do localStorage
function loadSettings() {
    try {
        const savedSettings = localStorage.getItem(OG_SETTINGS_STORAGE_KEY);
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            const titleElement = document.getElementById('title');
            const descriptionElement = document.getElementById('description');
            const brandElement = document.getElementById('brand');
            const primaryColorElement = document.getElementById('primaryColor');
            const secondaryColorElement = document.getElementById('secondaryColor');
            const imageOpacityElement = document.getElementById('imageOpacity');
            const overlayOpacityElement = document.getElementById('overlayOpacity');
            
            if (titleElement) titleElement.value = settings.title || '';
            if (descriptionElement) descriptionElement.value = settings.description || '';
            if (brandElement) brandElement.value = settings.brand || '';
            if (primaryColorElement) primaryColorElement.value = settings.primaryColor || '#667eea';
            if (secondaryColorElement) secondaryColorElement.value = settings.secondaryColor || '#764ba2';
            if (imageOpacityElement) imageOpacityElement.value = settings.imageOpacity || '0.5';
            if (overlayOpacityElement) overlayOpacityElement.value = settings.overlayOpacity || '0.5';

            const selectedTemplate = String(settings.selectedTemplate || settings.template || '').trim();
            if (selectedTemplate !== '') {
                document.querySelectorAll('.template-btn').forEach((button) => {
                    button.classList.toggle('active', button.getAttribute('data-template') === selectedTemplate);
                });
            }
            
            updatePreview();
            updateTitleCounter(); // Atualiza o contador do título após carregar
            updateDescriptionCounter(); // Atualiza o contador da descrição após carregar
            syncOgProfileState({
                ...settings,
                template: settings.selectedTemplate || settings.template || getActiveTemplateId(),
                available: true
            });
        }
    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
    }
}

// Função para resetar todas as configurações
function resetSettings() {
    if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
        try {
            const titleElement = document.getElementById('title');
            const descriptionElement = document.getElementById('description');
            const brandElement = document.getElementById('brand');
            const primaryColorElement = document.getElementById('primaryColor');
            const secondaryColorElement = document.getElementById('secondaryColor');
            const imageOpacityElement = document.getElementById('imageOpacity');
            const overlayOpacityElement = document.getElementById('overlayOpacity');
            
            if (titleElement) titleElement.value = '';
            if (descriptionElement) descriptionElement.value = '';
            if (brandElement) brandElement.value = '';
            if (primaryColorElement) primaryColorElement.value = '#667eea';
            if (secondaryColorElement) secondaryColorElement.value = '#764ba2';
            if (imageOpacityElement) imageOpacityElement.value = '0.5';
            if (overlayOpacityElement) overlayOpacityElement.value = '0.5';
        
            removeImage();
            
            // Remove classes active dos templates
            const templateButtons = document.querySelectorAll('.template-btn');
            if (templateButtons && templateButtons.length > 0) {
                templateButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
            }
            
            // Remove do localStorage
            localStorage.removeItem(OG_SETTINGS_STORAGE_KEY);
            syncOgProfileState({
                available: false,
                title: '',
                description: '',
                brand: '',
                template: '',
                primaryColor: '#667eea',
                secondaryColor: '#764ba2',
                imageOpacity: 0.8,
                overlayOpacity: 0.5
            });
            
            updatePreview();
            updateTitleCounter(); // Atualiza o contador do título após resetar
            updateDescriptionCounter(); // Atualiza o contador da descrição após resetar
        } catch (error) {
            console.error('Erro ao resetar configurações:', error);
        }
    }
}

// Função para validar campos obrigatórios
function validateFields() {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    
    if (!title) {
        alert('O título é obrigatório!');
        document.getElementById('title').focus();
        return false;
    }
    
    if (!description) {
        alert('A descrição é obrigatória!');
        document.getElementById('description').focus();
        return false;
    }
    
    // Validação adicional para o comprimento do título
    if (title.length < CHAR_LIMITS.TITLE.MIN_RECOMMENDED) {
        const confirmProceed = confirm(`O título tem apenas ${title.length} caracteres. Para melhor otimização de SEO, recomendamos pelo menos ${CHAR_LIMITS.TITLE.MIN_RECOMMENDED} caracteres. Deseja continuar mesmo assim?`);
        if (!confirmProceed) {
            document.getElementById('title').focus();
            return false;
        }
    }
    
    if (title.length > CHAR_LIMITS.TITLE.ABSOLUTE_MAX) {
        alert(`O título tem ${title.length} caracteres, mas o máximo recomendado é ${CHAR_LIMITS.TITLE.ABSOLUTE_MAX} caracteres. Por favor, reduza o tamanho do título.`);
        document.getElementById('title').focus();
        return false;
    }
    
    // Validação adicional para o comprimento da descrição
    if (description.length < CHAR_LIMITS.DESCRIPTION.MIN_RECOMMENDED) {
        const confirmProceed = confirm(`A descrição tem apenas ${description.length} caracteres. Para melhor otimização de SEO, recomendamos pelo menos ${CHAR_LIMITS.DESCRIPTION.MIN_RECOMMENDED} caracteres. Deseja continuar mesmo assim?`);
        if (!confirmProceed) {
            document.getElementById('description').focus();
            return false;
        }
    }
    
    return true;
}

// Função para debounce (evitar muitas chamadas seguidas)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para inicializar os event listeners
function initializeEventListeners() {
    try {
        // Função auxiliar para adicionar event listener com verificação de existência
        function addEventListenerIfExists(id, event, handler) {
            try {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener(event, handler);
                } else {
                    console.warn(`Elemento com ID '${id}' não encontrado para adicionar evento '${event}'`);
                }
            } catch (error) {
                console.error(`Erro ao adicionar evento '${event}' ao elemento '${id}':`, error);
            }
        }

        // Event listeners para os botões de template
        try {
            const templateButtons = document.querySelectorAll('.template-btn');
            if (templateButtons && templateButtons.length > 0) {
                templateButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        try {
                            applyTemplate(btn.dataset.template);
                        } catch (error) {
                            console.error('Erro ao aplicar template:', error);
                        }
                    });
                });
            } else {
                console.warn('Nenhum botão de template encontrado');
            }
        } catch (error) {
            console.error('Erro ao configurar event listeners para botões de template:', error);
        }

        // Event listeners para os campos de input com debounce
        const debouncedUpdate = debounce(() => {
            updatePreview();
            saveSettings();
        }, 300);

        // Event listener específico para o campo de título
        const debouncedTitleUpdate = debounce(() => {
            updatePreview();
            updateTitleCounter();
            saveSettings();
        }, 150); // Menor delay para atualização mais responsiva do contador

        // Event listener específico para o campo de descrição
        const debouncedDescriptionUpdate = debounce(() => {
            updatePreview();
            updateDescriptionCounter();
            saveSettings();
        }, 150); // Menor delay para atualização mais responsiva do contador

        addEventListenerIfExists('title', 'input', debouncedTitleUpdate);
        addEventListenerIfExists('description', 'input', debouncedDescriptionUpdate);
        addEventListenerIfExists('brand', 'input', debouncedUpdate);
        addEventListenerIfExists('primaryColor', 'change', debouncedUpdate);
        addEventListenerIfExists('secondaryColor', 'change', debouncedUpdate);
        addEventListenerIfExists('imageOpacity', 'input', debouncedUpdate);
        addEventListenerIfExists('overlayOpacity', 'input', debouncedUpdate);

        // Event listeners para upload de imagem
        const fileInput = document.getElementById('imageUpload');
        const uploadArea = document.getElementById('uploadArea');
        const removeBtn = document.getElementById('removeImageBtn');
        const editBtn = document.getElementById('editImageBtn');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    handleImageUpload(e.target.files[0]);
                }
            });
        }

        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            // Drag and drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                if (e.dataTransfer.files.length > 0) {
                    handleImageUpload(e.dataTransfer.files[0]);
                }
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', removeImage);
        }
        
        // Event listener para o botão de editar imagem
        if (editBtn) {
            editBtn.addEventListener('click', openImageEditor);
        }

        // Event listeners para botões de ação
        addEventListenerIfExists('exportBtn', 'click', () => {
            if (validateFields()) {
                exportImage();
            }
        });

        addEventListenerIfExists('generateCodeBtn', 'click', () => {
            if (validateFields()) {
                generateCode();
            }
        });
        
        // Event listeners para o editor de imagem
        // Verificamos se o elemento imageEditor existe antes de inicializar os listeners
        if (document.getElementById('imageEditor')) {
            initializeImageEditorListeners();
        }

        // Event listener para fechar modal clicando fora
        const codeModal = document.getElementById('codeModal');
        if (codeModal) {
            codeModal.addEventListener('click', (e) => {
                if (e.target === codeModal) {
                    closeModal();
                }
            });
        }

        // Event listener para ESC fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Event listener para o botão de fechar do modal
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        // Event listener para o botão de copiar código
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', copyCode);
        }

        // Event listener para botão de reset (se existir)
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetSettings);
        }

    } catch (error) {
        console.error('Erro ao inicializar event listeners:', error);
    }
}

// Função para inicializar a aplicação
function initializeApp() {
    try {
        // Carrega as configurações salvas
        loadSettings();
        
        // Inicializa os event listeners
        initializeEventListeners();
        
        // Faz o preview inicial
        updatePreview();
        
        // Inicializa o contador de caracteres
        updateCharacterCounter();
        syncOgProfileState();
        
        // Adiciona listener para salvar antes de sair da página
        window.addEventListener('beforeunload', saveSettings);
    } catch (error) {
        console.error('Erro ao inicializar a aplicação:', error);
        alert('Ocorreu um erro ao inicializar a aplicação. Algumas funcionalidades podem não estar disponíveis.');
    }
}
// Função para abrir o editor de imagem
function openImageEditor() {
    try {
        if (!currentBackgroundImage) {
            alert('Nenhuma imagem carregada para editar.');
            return;
        }
        
        // Exibe o editor de imagem
        const editorContainer = document.getElementById('imageEditor');
        if (!editorContainer) {
            console.error('Elemento do editor de imagem não encontrado');
            alert('Não foi possível encontrar o editor de imagem.');
            return;
        }
        
        editorContainer.style.display = 'flex';
        
        // Verifica se o objeto imageEditor está disponível
        if (!imageEditor) {
            console.error('Objeto imageEditor não está disponível');
            alert('Erro ao inicializar o editor de imagem. Tente recarregar a página.');
            editorContainer.style.display = 'none';
            return;
        }
    } catch (error) {
        console.error('Erro ao abrir o editor de imagem:', error);
        alert('Ocorreu um erro ao abrir o editor de imagem.');
    }
    
    // Inicializa o editor com a imagem atual
    imageEditor.init(currentBackgroundImage).then(() => {
        console.log('Editor de imagem inicializado com sucesso');
    }).catch(error => {
        console.error('Erro ao inicializar o editor de imagem:', error);
        alert('Erro ao carregar a imagem no editor. Tente novamente.');
        editorContainer.style.display = 'none';
    });
}

// Função para inicializar os event listeners do editor de imagem
function initializeImageEditorListeners() {
    try {
        // Função auxiliar para adicionar event listener com verificação de existência
        function addEventListenerIfExists(id, event, handler) {
            try {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener(event, handler);
                } else {
                    console.warn(`Elemento com ID '${id}' não encontrado para adicionar evento '${event}' no editor de imagem`);
                }
            } catch (error) {
                console.error(`Erro ao adicionar evento '${event}' ao elemento '${id}' no editor de imagem:`, error);
            }
        }
        
        // Botões de fechar e cancelar
        addEventListenerIfExists('closeImageEditor', 'click', closeImageEditor);
        addEventListenerIfExists('cancelImageEdit', 'click', closeImageEditor);
        
        // Botão de aplicar alterações
        addEventListenerIfExists('applyImageEdit', 'click', applyImageEdits);
        
        // Controles de layout
        addEventListenerIfExists('rotateLeftBtn', 'click', () => {
            try {
                imageEditor.rotate(-90);
            } catch (error) {
                console.error('Erro ao rotacionar imagem para esquerda:', error);
            }
        });
        addEventListenerIfExists('rotateRightBtn', 'click', () => {
            try {
                imageEditor.rotate(90);
            } catch (error) {
                console.error('Erro ao rotacionar imagem para direita:', error);
            }
        });
        addEventListenerIfExists('zoomInBtn', 'click', () => {
            try {
                imageEditor.state.scale *= 1.1;
                imageEditor.drawImage();
            } catch (error) {
                console.error('Erro ao aumentar zoom da imagem:', error);
            }
        });
        addEventListenerIfExists('zoomOutBtn', 'click', () => {
            try {
                imageEditor.state.scale *= 0.9;
                imageEditor.drawImage();
            } catch (error) {
                console.error('Erro ao diminuir zoom da imagem:', error);
            }
        });
        addEventListenerIfExists('resetLayoutBtn', 'click', () => {
            try {
                imageEditor.fitImageToCanvas();
                imageEditor.drawImage();
            } catch (error) {
                console.error('Erro ao resetar layout da imagem:', error);
            }
        });
        
        // Controles de ajuste
        try {
            const brightnessSlider = document.getElementById('brightnessSlider');
            const contrastSlider = document.getElementById('contrastSlider');
            const saturationSlider = document.getElementById('saturationSlider');
            const blurSlider = document.getElementById('blurSlider');
            
            if (brightnessSlider) {
                brightnessSlider.addEventListener('input', () => {
                    try {
                        const value = brightnessSlider.value;
                        const brightnessValue = document.getElementById('brightnessValue');
                        if (brightnessValue) {
                            brightnessValue.textContent = value + '%';
                        }
                        imageEditor.setBrightness(value);
                    } catch (error) {
                        console.error('Erro ao ajustar brilho da imagem:', error);
                    }
                });
            } else {
                console.warn('Slider de brilho não encontrado');
            }
            
            if (contrastSlider) {
                contrastSlider.addEventListener('input', () => {
                    try {
                        const value = contrastSlider.value;
                        const contrastValue = document.getElementById('contrastValue');
                        if (contrastValue) {
                            contrastValue.textContent = value + '%';
                        }
                        imageEditor.setContrast(value);
                    } catch (error) {
                        console.error('Erro ao ajustar contraste da imagem:', error);
                    }
                });
            } else {
                console.warn('Slider de contraste não encontrado');
            }
            
            if (saturationSlider) {
                saturationSlider.addEventListener('input', () => {
                    try {
                        const value = saturationSlider.value;
                        const saturationValue = document.getElementById('saturationValue');
                        if (saturationValue) {
                            saturationValue.textContent = value + '%';
                        }
                        imageEditor.setSaturation(value);
                    } catch (error) {
                        console.error('Erro ao ajustar saturação da imagem:', error);
                    }
                });
            } else {
                console.warn('Slider de saturação não encontrado');
            }
            
            if (blurSlider) {
                blurSlider.addEventListener('input', () => {
                    try {
                        const value = blurSlider.value;
                        const blurValue = document.getElementById('blurValue');
                        if (blurValue) {
                            blurValue.textContent = value + 'px';
                        }
                        imageEditor.setBlur(value);
                    } catch (error) {
                        console.error('Erro ao ajustar desfoque da imagem:', error);
                    }
                });
            } else {
                console.warn('Slider de desfoque não encontrado');
            }
        } catch (error) {
            console.error('Erro ao configurar controles de ajuste do editor de imagem:', error);
        }
        
        // Controles de recorte
        try {
            const toggleCropBtn = document.getElementById('toggleCropBtn');
            const applyCropBtn = document.getElementById('applyCropBtn');
            
            if (toggleCropBtn && applyCropBtn) {
                toggleCropBtn.addEventListener('click', () => {
                    try {
                        const isCropping = imageEditor.toggleCropMode();
                        applyCropBtn.disabled = !isCropping;
                        toggleCropBtn.textContent = isCropping ? '❌ Cancelar Recorte' : '✂️ Modo de Recorte';
                    } catch (error) {
                        console.error('Erro ao alternar modo de recorte:', error);
                        alert('Erro ao ativar o modo de recorte. Tente novamente.');
                    }
                });
                
                applyCropBtn.addEventListener('click', () => {
                    try {
                        imageEditor.applyCrop();
                        applyCropBtn.disabled = true;
                        toggleCropBtn.textContent = '✂️ Modo de Recorte';
                    } catch (error) {
                        console.error('Erro ao aplicar recorte:', error);
                        alert('Erro ao aplicar o recorte. Tente novamente.');
                    }
                });
            } else {
                console.warn('Botões de recorte não encontrados');
            }
        } catch (error) {
            console.error('Erro ao configurar controles de recorte:', error);
        }
        
        // Botão de reset
        addEventListenerIfExists('resetAllBtn', 'click', () => {
            if (confirm('Tem certeza que deseja resetar todas as edições?')) {
                try {
                    imageEditor.resetState();
                    imageEditor.fitImageToCanvas();
                    imageEditor.drawImage();
                    
                    // Reseta os sliders
                    const brightnessSlider = document.getElementById('brightnessSlider');
                    const contrastSlider = document.getElementById('contrastSlider');
                    const saturationSlider = document.getElementById('saturationSlider');
                    const blurSlider = document.getElementById('blurSlider');
                    
                    if (brightnessSlider) brightnessSlider.value = 100;
                    if (contrastSlider) contrastSlider.value = 100;
                    if (saturationSlider) saturationSlider.value = 100;
                    if (blurSlider) blurSlider.value = 0;
                    
                    // Atualiza os valores exibidos
                    const brightnessValue = document.getElementById('brightnessValue');
                    const contrastValue = document.getElementById('contrastValue');
                    const saturationValue = document.getElementById('saturationValue');
                    const blurValue = document.getElementById('blurValue');
                    
                    if (brightnessValue) brightnessValue.textContent = '100%';
                    if (contrastValue) contrastValue.textContent = '100%';
                    if (saturationValue) saturationValue.textContent = '100%';
                    if (blurValue) blurValue.textContent = '0px';
                    
                    // Reseta o modo de recorte
                    const toggleCropBtn = document.getElementById('toggleCropBtn');
                    const applyCropBtn = document.getElementById('applyCropBtn');
                    
                    if (applyCropBtn) applyCropBtn.disabled = true;
                    if (toggleCropBtn) toggleCropBtn.textContent = '✂️ Modo de Recorte';
                } catch (error) {
                    console.error('Erro ao resetar edições da imagem:', error);
                    alert('Ocorreu um erro ao resetar as edições. Tente novamente.');
                }
            }
        });
        
    } catch (error) {
        console.error('Erro ao inicializar event listeners do editor de imagem:', error);
    }
}

// Função para fechar o editor de imagem
function closeImageEditor() {
    try {
        const editorContainer = document.getElementById('imageEditor');
        if (editorContainer) {
            editorContainer.style.display = 'none';
        } else {
            console.warn('Elemento do editor de imagem não encontrado ao tentar fechar');
        }
    } catch (error) {
        console.error('Erro ao fechar o editor de imagem:', error);
    }
}

// Função para aplicar as edições da imagem
function applyImageEdits() {
    // Verifica se o objeto imageEditor está disponível
    if (!imageEditor) {
        console.error('Objeto imageEditor não está disponível');
        closeImageEditor();
        return;
    }
    
    try {
        // Obtém a imagem editada como Data URL
        const editedImageDataURL = imageEditor.getEditedImageDataURL();
        
        // Atualiza a imagem de fundo
        currentBackgroundImage = editedImageDataURL;
        
        // Atualiza o preview
        updatePreview();
        
        // Fecha o editor
        closeImageEditor();
    } catch (error) {
        console.error('Erro ao aplicar edições da imagem:', error);
        alert('Ocorreu um erro ao aplicar as edições. Tente novamente.');
        closeImageEditor();
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeApp);

// Função para verificar se html2canvas está disponível
function checkDependencies() {
    try {
        if (typeof html2canvas === 'undefined') {
            console.error('html2canvas não encontrado. Certifique-se de incluir a biblioteca.');
            
            // Tenta carregar dinamicamente
            try {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                script.onload = () => {
                    console.log('html2canvas carregado com sucesso!');
                };
                script.onerror = () => {
                    console.error('Erro ao carregar html2canvas');
                    alert('Não foi possível carregar a biblioteca necessária para exportar imagens. Algumas funcionalidades podem estar indisponíveis.');
                };
                document.head.appendChild(script);
            } catch (loadError) {
                console.error('Erro ao tentar carregar dinamicamente html2canvas:', loadError);
                alert('Não foi possível carregar a biblioteca necessária para exportar imagens. Algumas funcionalidades podem estar indisponíveis.');
            }
        }
    } catch (error) {
        console.error('Erro ao verificar dependências:', error);
    }
}

// Verifica dependências ao carregar
checkDependencies();
