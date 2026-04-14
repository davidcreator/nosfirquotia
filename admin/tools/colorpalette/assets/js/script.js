class ColorPaletteGenerator {
    constructor() {
        // Elementos básicos da paleta
        this.baseColor = '#3498db';
        this.currentPaletteType = 'monochromatic';
        this.currentColors = [];
        
        // Elementos de upload e preview de imagem
        this.imageUpload = document.getElementById('imageUpload');
        this.fileName = document.getElementById('fileName');
        this.previewImage = document.getElementById('previewImage');
        this.uploadPlaceholder = document.getElementById('uploadPlaceholder');
        this.imagePreview = document.getElementById('imagePreview');
        
        // Elementos do color picker
        this.colorPickerTool = document.getElementById('colorPickerTool');
        this.colorPickerCrosshair = document.getElementById('colorPickerCrosshair');
        this.pickedColorPreview = document.getElementById('pickedColorPreview');
        this.pickedColorHex = document.getElementById('pickedColorHex');
        this.activateColorPicker = document.getElementById('activateColorPicker');
        
        // Elementos para cores extraídas
        this.detectDominantColors = document.getElementById('detectDominantColors');
        this.extractedColorsList = document.getElementById('extractedColorsList');
        this.applyBrandColorsButton = document.getElementById('applyBrandColors');
        this.brandSyncStatus = document.getElementById('brandSyncStatus');
        
        // Canvas para processamento de imagem
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.isPickingColor = false;
        
        this.init();
    }

    init() {
        this.hydrateFromBrandKit();
        this.setupEventListeners();
        this.generatePalette();
        this.updateBrandSyncStatus('Paleta pronta para sincronizacao com o Brand Kit.');
    }

    setupEventListeners() {
        const baseColorInput = document.getElementById('baseColor');
        const hexInput = document.getElementById('hexInput');
        const paletteButtons = document.querySelectorAll('.palette-btn');
        const randomButton = document.getElementById('randomColor');
        const exportButton = document.getElementById('exportPalette');

        // Eventos para a paleta de cores básica
        baseColorInput.addEventListener('input', (e) => {
            this.baseColor = e.target.value;
            hexInput.value = this.baseColor;
            this.generatePalette();
        });

        hexInput.addEventListener('input', (e) => {
            const hex = e.target.value;
            if (this.isValidHex(hex)) {
                this.baseColor = hex;
                baseColorInput.value = hex;
                this.generatePalette();
            }
        });

        paletteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                paletteButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPaletteType = btn.dataset.type;
                this.generatePalette();
            });
        });

        randomButton.addEventListener('click', () => {
            this.generateRandomColor();
        });

        exportButton.addEventListener('click', () => {
            this.exportPalette();
        });

        if (this.applyBrandColorsButton) {
            this.applyBrandColorsButton.addEventListener('click', () => {
                this.applyCurrentPaletteToBrandKit();
            });
        }

        // Eventos para upload de imagem
        this.imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.fileName.textContent = file.name;
                this.loadImage(file);
            }
        });

        // Eventos para o color picker
        this.activateColorPicker.addEventListener('click', () => {
            this.toggleColorPicker();
        });

        this.imagePreview.addEventListener('mousemove', (e) => {
            if (this.isPickingColor && this.previewImage.style.display !== 'none') {
                this.updateColorPickerPosition(e);
            }
        });

        this.imagePreview.addEventListener('click', (e) => {
            if (this.isPickingColor && this.previewImage.style.display !== 'none') {
                this.pickColor(e);
            }
        });

        // Evento para detectar cores dominantes
        this.detectDominantColors.addEventListener('click', () => {
            if (this.previewImage.style.display !== 'none') {
                this.findDominantColors();
            } else {
                this.showNotification('Faça upload de uma imagem primeiro!');
            }
        });

        // Adicionar evento para arrastar e soltar imagens
        this.imagePreview.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.imagePreview.classList.add('drag-over');
        });

        this.imagePreview.addEventListener('dragleave', () => {
            this.imagePreview.classList.remove('drag-over');
        });

        this.imagePreview.addEventListener('drop', (e) => {
            e.preventDefault();
            this.imagePreview.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.imageUpload.files = e.dataTransfer.files;
                this.fileName.textContent = file.name;
                this.loadImage(file);
            }
        });
    }

    isValidHex(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }

    hydrateFromBrandKit() {
        const api = window.AQBrandKit;
        if (!api) {
            return;
        }

        const snapshot = api.getIntegrationSnapshot?.();
        const paletteState = snapshot?.colorPalette || {};
        const brandKitPalette = snapshot?.brandKit?.palette || {};

        const preferredBase = paletteState.baseColor || brandKitPalette.baseColor;
        if (this.isValidHex(preferredBase || '')) {
            this.baseColor = preferredBase;
            const baseColorInput = document.getElementById('baseColor');
            const hexInput = document.getElementById('hexInput');
            if (baseColorInput) {
                baseColorInput.value = this.baseColor;
            }
            if (hexInput) {
                hexInput.value = this.baseColor;
            }
        }

        const preferredType = String(paletteState.type || brandKitPalette.type || '').trim();
        if (preferredType) {
            this.currentPaletteType = preferredType;
            document.querySelectorAll('.palette-btn').forEach((button) => {
                button.classList.toggle('active', button.dataset.type === preferredType);
            });
        }
    }

    publishPaletteState(colors, title, description) {
        const api = window.AQBrandKit;
        if (!api) {
            return;
        }

        const payload = {
            baseColor: this.baseColor,
            type: this.currentPaletteType,
            title,
            description,
            colors
        };
        api.saveColorPaletteState(payload, 'colorpalette');
        api.syncColorPalette(payload, 'colorpalette');
    }

    applyCurrentPaletteToBrandKit() {
        const api = window.AQBrandKit;
        if (!api) {
            this.updateBrandSyncStatus('Nao foi possivel sincronizar: Brand Kit indisponivel.', true);
            return;
        }

        const colors = Array.isArray(this.currentColors) && this.currentColors.length
            ? this.currentColors
            : [this.baseColor];

        api.syncColorPalette({
            baseColor: this.baseColor,
            type: this.currentPaletteType,
            title: `Paleta ${this.currentPaletteType}`,
            description: 'Paleta definida no Color Palette.',
            colors
        }, 'colorpalette');

        this.updateBrandSyncStatus('Cores sincronizadas com sucesso em Mockups e relatorio geral.');
    }

    updateBrandSyncStatus(message, isError = false) {
        if (!this.brandSyncStatus) {
            return;
        }
        this.brandSyncStatus.textContent = message;
        this.brandSyncStatus.classList.remove('ok', 'error');
        this.brandSyncStatus.classList.add(isError ? 'error' : 'ok');
    }

    hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h * 360, s * 100, l * 100];
    }

    hslToHex(h, s, l) {
        h = h % 360;
        s = Math.max(0, Math.min(100, s)) / 100;
        l = Math.max(0, Math.min(100, l)) / 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;
        if (h >= 0 && h < 60) {
            r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
            r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
            r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    generateMonochromaticPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Gerar 5 variações de luminosidade
        for (let i = 0; i < 5; i++) {
            const newL = Math.max(10, Math.min(90, l + (i - 2) * 15));
            colors.push(this.hslToHex(h, s, newL));
        }
        
        return colors;
    }

    generateAnalogousPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Cores análogas: ±30° no matiz
        for (let i = -2; i <= 2; i++) {
            const newH = h + (i * 30);
            colors.push(this.hslToHex(newH, s, l));
        }
        
        return colors;
    }

    generateComplementaryPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Cor base
        colors.push(this.baseColor);
        
        // Cor complementar (180° oposta)
        const complementaryH = (h + 180) % 360;
        colors.push(this.hslToHex(complementaryH, s, l));
        
        // Variações da cor base
        colors.push(this.hslToHex(h, s, Math.max(10, l - 20)));
        colors.push(this.hslToHex(h, s, Math.min(90, l + 20)));
        
        // Variação da complementar
        colors.push(this.hslToHex(complementaryH, s, Math.max(10, l - 20)));
        
        return colors;
    }

    generateTriadicPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Cores em tríade: 120° de diferença
        for (let i = 0; i < 3; i++) {
            const newH = (h + (i * 120)) % 360;
            colors.push(this.hslToHex(newH, s, l));
            
            // Adicionar uma variação mais clara
            if (i < 2) {
                colors.push(this.hslToHex(newH, s * 0.7, Math.min(90, l + 15)));
            }
        }
        
        return colors;
    }

    generateTetradicPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Cores em tetrádica: 90° de diferença
        for (let i = 0; i < 4; i++) {
            const newH = (h + (i * 90)) % 360;
            colors.push(this.hslToHex(newH, s, l));
        }
        
        // Adicionar uma variação neutra
        colors.push(this.hslToHex(h, s * 0.3, l));
        
        return colors;
    }

    generateSplitComplementaryPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Cor base
        colors.push(this.baseColor);
        
        // Split complementar: 150° e 210°
        const split1 = (h + 150) % 360;
        const split2 = (h + 210) % 360;
        
        colors.push(this.hslToHex(split1, s, l));
        colors.push(this.hslToHex(split2, s, l));
        
        // Variações
        colors.push(this.hslToHex(h, s * 0.7, Math.min(90, l + 15)));
        colors.push(this.hslToHex(split1, s * 0.7, Math.min(90, l + 15)));
        
        return colors;
    }

    generatePalette() {
        let colors = [];
        let title = '';
        let description = '';

        switch (this.currentPaletteType) {
            case 'monochromatic':
                colors = this.generateMonochromaticPalette();
                title = 'Paleta Monocromática';
                description = 'Variações de saturação e luminosidade da mesma cor.';
                break;
            case 'analogous':
                colors = this.generateAnalogousPalette();
                title = 'Paleta Análoga';
                description = 'Cores adjacentes no círculo cromático.';
                break;
            case 'complementary':
                colors = this.generateComplementaryPalette();
                title = 'Paleta Complementar';
                description = 'Cores opostas no círculo cromático.';
                break;
            case 'triadic':
                colors = this.generateTriadicPalette();
                title = 'Paleta Tríade';
                description = 'Três cores igualmente espaçadas no círculo cromático.';
                break;
            case 'tetradic':
                colors = this.generateTetradicPalette();
                title = 'Paleta Tetrádica';
                description = 'Quatro cores formando um retângulo no círculo cromático.';
                break;
            case 'splitComplementary':
                colors = this.generateSplitComplementaryPalette();
                title = 'Paleta Split-Complementar';
                description = 'Cor base mais duas cores adjacentes à complementar.';
                break;
        }

        this.currentColors = Array.isArray(colors) ? [...colors] : [];
        this.publishPaletteState(this.currentColors, title, description);
        this.displayPalette(colors, title, description);
        this.updateBrandSyncStatus('Paleta sincronizada automaticamente com Mockups e relatorio geral.');
    }

    displayPalette(colors, title, description) {
        document.getElementById('paletteTitle').textContent = title;
        document.getElementById('paletteDescription').textContent = description;

        const swatchesContainer = document.getElementById('colorSwatches');
        const colorListContainer = document.getElementById('colorList');

        swatchesContainer.innerHTML = '';
        colorListContainer.innerHTML = '';

        colors.forEach((color, index) => {
            // Criar swatch
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.dataset.hex = color;
            swatch.addEventListener('click', () => this.copyToClipboard(color));
            swatchesContainer.appendChild(swatch);

            // Criar item de detalhes
            const [h, s, l] = this.hexToHsl(color);
            const rgb = this.hexToRgb(color);
            
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';
            colorItem.style.borderLeftColor = color;
            colorItem.innerHTML = `
                <h4>Cor ${index + 1}</h4>
                <div class="color-values">
                    <div>HEX: ${color}</div>
                    <div>RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</div>
                    <div>HSL: ${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%</div>
                </div>
            `;
            colorListContainer.appendChild(colorItem);
        });
    }

    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    generateRandomColor() {
        const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        this.baseColor = randomHex;
        document.getElementById('baseColor').value = randomHex;
        document.getElementById('hexInput').value = randomHex;
        this.generatePalette();
    }

    copyToClipboard(color) {
        navigator.clipboard.writeText(color).then(() => {
            this.showNotification(`Cor ${color} copiada!`);
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copied-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
    }
    
    // Métodos para manipulação de imagem e extração de cores
    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.previewImage.style.display = 'block';
            this.uploadPlaceholder.style.display = 'none';
            
            // Desativar o color picker se estiver ativo
            if (this.isPickingColor) {
                this.toggleColorPicker();
            }
        };
        reader.readAsDataURL(file);
    }
    
    toggleColorPicker() {
        this.isPickingColor = !this.isPickingColor;
        
        if (this.isPickingColor) {
            this.activateColorPicker.classList.add('active');
            this.colorPickerTool.style.display = 'block';
        } else {
            this.activateColorPicker.classList.remove('active');
            this.colorPickerTool.style.display = 'none';
        }
    }
    
    updateColorPickerPosition(e) {
        const rect = this.imagePreview.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.colorPickerCrosshair.style.left = `${x}px`;
        this.colorPickerCrosshair.style.top = `${y}px`;
        
        // Obter a cor sob o cursor
        const color = this.getPixelColor(x, y);
        this.pickedColorPreview.style.backgroundColor = color;
        this.pickedColorHex.textContent = color;
    }
    
    getPixelColor(x, y) {
        // Redimensionar o canvas para o tamanho da imagem exibida
        const rect = this.previewImage.getBoundingClientRect();
        const scaleX = this.previewImage.naturalWidth / rect.width;
        const scaleY = this.previewImage.naturalHeight / rect.height;
        
        // Calcular a posição real do pixel na imagem original
        const imgX = Math.floor(x * scaleX);
        const imgY = Math.floor(y * scaleY);
        
        // Desenhar a imagem no canvas e obter os dados do pixel
        this.canvas.width = this.previewImage.naturalWidth;
        this.canvas.height = this.previewImage.naturalHeight;
        this.ctx.drawImage(this.previewImage, 0, 0);
        
        const pixelData = this.ctx.getImageData(imgX, imgY, 1, 1).data;
        const [r, g, b] = pixelData;
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    pickColor(e) {
        const rect = this.imagePreview.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const color = this.getPixelColor(x, y);
        this.baseColor = color;
        document.getElementById('baseColor').value = color;
        document.getElementById('hexInput').value = color;
        
        this.generatePalette();
        this.addExtractedColor(color);
        this.showNotification(`Cor ${color} selecionada como cor base`);
    }
    
    addExtractedColor(color) {
        const colorElement = document.createElement('div');
        colorElement.className = 'extracted-color';
        colorElement.innerHTML = `
            <div class="extracted-color-swatch" style="background-color: ${color}" data-color="${color}"></div>
            <div class="extracted-color-hex">${color}</div>
        `;
        
        // Adicionar evento de clique para usar como cor base
        colorElement.querySelector('.extracted-color-swatch').addEventListener('click', () => {
            this.baseColor = color;
            document.getElementById('baseColor').value = color;
            document.getElementById('hexInput').value = color;
            this.generatePalette();
            this.showNotification(`Cor ${color} selecionada como cor base`);
        });
        
        this.extractedColorsList.appendChild(colorElement);
    }
    
    findDominantColors() {
        // Limpar cores extraídas anteriormente
        this.extractedColorsList.innerHTML = '';
        
        try {
            // Usar Color Thief para extrair a paleta de cores
            const colorThief = new ColorThief();
            
            // Verificar se a imagem está completamente carregada
            if (!this.previewImage.complete) {
                this.previewImage.onload = () => this.findDominantColors();
                return;
            }
            
            // Obter a cor dominante
            const dominantColor = colorThief.getColor(this.previewImage);
            const dominantHex = this.rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);
            
            // Obter uma paleta de cores (até 8 cores)
            const palette = colorThief.getPalette(this.previewImage, 8);
            const paletteHex = palette.map(color => this.rgbToHex(color[0], color[1], color[2]));
            
            // Adicionar a cor dominante primeiro
            this.addExtractedColor(dominantHex);
            
            // Adicionar o restante da paleta
            paletteHex.forEach(color => {
                // Evitar duplicatas
                if (color !== dominantHex) {
                    this.addExtractedColor(color);
                }
            });
            
            // Usar a cor dominante como cor base
            this.baseColor = dominantHex;
            document.getElementById('baseColor').value = dominantHex;
            document.getElementById('hexInput').value = dominantHex;
            this.generatePalette();
            
            this.showNotification('Cores dominantes detectadas!');
        } catch (error) {
            console.error('Erro ao detectar cores dominantes:', error);
            
            // Fallback para o método anterior se Color Thief falhar
            this.findDominantColorsFallback();
        }
    }
    
    rgbToHex(r, g, b) {
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    findDominantColorsFallback() {
        // Método alternativo para extrair cores dominantes
        // Redimensionar o canvas para reduzir a quantidade de pixels a processar
        const maxDimension = 100;
        const aspectRatio = this.previewImage.naturalWidth / this.previewImage.naturalHeight;
        
        let width, height;
        if (aspectRatio > 1) {
            width = maxDimension;
            height = Math.floor(maxDimension / aspectRatio);
        } else {
            width = Math.floor(maxDimension * aspectRatio);
            height = maxDimension;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.drawImage(this.previewImage, 0, 0, width, height);
        
        const imageData = this.ctx.getImageData(0, 0, width, height).data;
        const colorCounts = {};
        
        // Contar ocorrências de cada cor (agrupando cores semelhantes)
        for (let i = 0; i < imageData.length; i += 4) {
            const r = Math.floor(imageData[i] / 10) * 10;
            const g = Math.floor(imageData[i + 1] / 10) * 10;
            const b = Math.floor(imageData[i + 2] / 10) * 10;
            
            // Ignorar pixels transparentes
            if (imageData[i + 3] < 128) continue;
            
            const color = this.rgbToHex(r, g, b);
            colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
        
        // Converter para array e ordenar por frequência
        const sortedColors = Object.entries(colorCounts)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
        
        // Filtrar cores muito semelhantes
        const distinctColors = this.filterSimilarColors(sortedColors.slice(0, 20));
        
        // Exibir as cores dominantes (limitando a 8)
        distinctColors.slice(0, 8).forEach(color => {
            this.addExtractedColor(color);
        });
        
        // Usar a cor mais dominante como cor base
        if (distinctColors.length > 0) {
            this.baseColor = distinctColors[0];
            document.getElementById('baseColor').value = distinctColors[0];
            document.getElementById('hexInput').value = distinctColors[0];
            this.generatePalette();
        }
        
        this.showNotification('Cores dominantes detectadas!');
    }
    
    filterSimilarColors(colors) {
        const distinctColors = [];
        
        for (const color of colors) {
            // Verificar se esta cor é significativamente diferente das já selecionadas
            let isDistinct = true;
            
            for (const existingColor of distinctColors) {
                const distance = this.getColorDistance(color, existingColor);
                if (distance < 30) { // Limiar de similaridade
                    isDistinct = false;
                    break;
                }
            }
            
            if (isDistinct) {
                distinctColors.push(color);
            }
            
            // Limitar a 8 cores distintas
            if (distinctColors.length >= 8) break;
        }
        
        return distinctColors;
    }
    
    getColorDistance(color1, color2) {
        // Converter cores para RGB
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        // Calcular distância euclidiana no espaço RGB
        return Math.sqrt(
            Math.pow(rgb1.r - rgb2.r, 2) +
            Math.pow(rgb1.g - rgb2.g, 2) +
            Math.pow(rgb1.b - rgb2.b, 2)
        );
    }

    exportPalette() {
        const colors = Array.from(document.querySelectorAll('.color-swatch'))
            .map(swatch => swatch.dataset.hex);
        
        const paletteData = {
            type: this.currentPaletteType,
            baseColor: this.baseColor,
            colors: colors,
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(paletteData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `paleta-${this.currentPaletteType}-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Paleta exportada com sucesso!');
    }
}

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    new ColorPaletteGenerator();
});
