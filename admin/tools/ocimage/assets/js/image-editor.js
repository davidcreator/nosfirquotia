/**
 * Módulo de Edição de Imagem para OG Image Generator
 * Este módulo adiciona funcionalidades de ajuste e recorte de imagens
 */

let imageEditor = {
    // Elemento canvas para edição de imagem
    canvas: null,
    ctx: null,
    
    // Imagem original e atual
    originalImage: null,
    currentImage: null,
    
    // Estado da edição
    state: {
        scale: 1,
        rotate: 0,
        translateX: 0,
        translateY: 0,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        cropX: 0,
        cropY: 0,
        cropWidth: 0,
        cropHeight: 0,
        isCropping: false
    },
    
    // Estado do mouse para interação
    mouse: {
        startX: 0,
        startY: 0,
        isMoving: false,
        moveType: null // 'move', 'crop', 'resize'
    },
    
    // Inicializa o editor de imagem
    init: function(imageData) {
        // Cria o canvas se não existir
        if (!this.canvas) {
            this.canvas = document.getElementById('imageEditorCanvas');
            if (!this.canvas) {
                console.error('Canvas para editor de imagem não encontrado');
                return false;
            }
            this.ctx = this.canvas.getContext('2d');
        }
        
        // Carrega a imagem
        return this.loadImage(imageData);
    },
    
    // Carrega uma imagem no editor
    loadImage: function(imageData) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.originalImage = img;
                this.currentImage = img;
                
                // Redefine o estado
                this.resetState();
                
                // Ajusta o tamanho do canvas para a imagem
                this.canvas.width = 600;  // Largura fixa para o editor
                this.canvas.height = 400; // Altura fixa para o editor
                
                // Calcula o tamanho inicial para ajustar a imagem ao canvas
                this.fitImageToCanvas();
                
                // Desenha a imagem
                this.drawImage();
                
                // Configura os event listeners
                this.setupEventListeners();
                
                resolve(true);
            };
            
            img.onerror = () => {
                reject('Erro ao carregar a imagem');
            };
            
            img.src = imageData;
        });
    },
    
    // Ajusta a imagem para caber no canvas
    fitImageToCanvas: function() {
        if (!this.originalImage) return;
        
        const canvasRatio = this.canvas.width / this.canvas.height;
        const imageRatio = this.originalImage.width / this.originalImage.height;
        
        if (imageRatio > canvasRatio) {
            // Imagem mais larga que o canvas
            this.state.scale = this.canvas.width / this.originalImage.width * 0.9;
        } else {
            // Imagem mais alta que o canvas
            this.state.scale = this.canvas.height / this.originalImage.height * 0.9;
        }
        
        // Centraliza a imagem
        this.state.translateX = (this.canvas.width - (this.originalImage.width * this.state.scale)) / 2;
        this.state.translateY = (this.canvas.height - (this.originalImage.height * this.state.scale)) / 2;
        
        // Define a área de corte inicial como a imagem inteira
        this.state.cropWidth = this.originalImage.width;
        this.state.cropHeight = this.originalImage.height;
    },
    
    // Desenha a imagem no canvas com as transformações atuais
    drawImage: function() {
        if (!this.originalImage) return;
        
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Salva o contexto
        this.ctx.save();
        
        // Aplica as transformações
        this.ctx.translate(
            this.state.translateX + (this.originalImage.width * this.state.scale) / 2,
            this.state.translateY + (this.originalImage.height * this.state.scale) / 2
        );
        this.ctx.rotate(this.state.rotate * Math.PI / 180);
        this.ctx.scale(this.state.scale, this.state.scale);
        
        // Aplica os filtros
        this.ctx.filter = this.getFilterString();
        
        // Desenha a imagem
        this.ctx.drawImage(
            this.originalImage, 
            -this.originalImage.width / 2, 
            -this.originalImage.height / 2,
            this.originalImage.width,
            this.originalImage.height
        );
        
        // Restaura o contexto
        this.ctx.restore();
        
        // Desenha a área de corte se estiver no modo de corte
        if (this.state.isCropping) {
            this.drawCropArea();
        }
    },
    
    // Obtém a string de filtro CSS para aplicar à imagem
    getFilterString: function() {
        return `brightness(${this.state.brightness}%) `
             + `contrast(${this.state.contrast}%) `
             + `saturate(${this.state.saturation}%) `
             + `blur(${this.state.blur}px)`;
    },
    
    // Desenha a área de corte
    drawCropArea: function() {
        const x = this.state.translateX + this.state.cropX * this.state.scale;
        const y = this.state.translateY + this.state.cropY * this.state.scale;
        const width = this.state.cropWidth * this.state.scale;
        const height = this.state.cropHeight * this.state.scale;
        
        // Desenha um retângulo semi-transparente ao redor da área de corte
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Limpa a área de corte para mostrar a imagem original
        this.ctx.clearRect(x, y, width, height);
        
        // Desenha a borda da área de corte
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Desenha as alças de redimensionamento
        this.drawResizeHandles(x, y, width, height);
    },
    
    // Desenha as alças de redimensionamento da área de corte
    drawResizeHandles: function(x, y, width, height) {
        const handleSize = 10;
        this.ctx.fillStyle = '#ffffff';
        
        // Cantos
        this.ctx.fillRect(x - handleSize/2, y - handleSize/2, handleSize, handleSize); // Superior esquerdo
        this.ctx.fillRect(x + width - handleSize/2, y - handleSize/2, handleSize, handleSize); // Superior direito
        this.ctx.fillRect(x - handleSize/2, y + height - handleSize/2, handleSize, handleSize); // Inferior esquerdo
        this.ctx.fillRect(x + width - handleSize/2, y + height - handleSize/2, handleSize, handleSize); // Inferior direito
        
        // Meio das bordas
        this.ctx.fillRect(x + width/2 - handleSize/2, y - handleSize/2, handleSize, handleSize); // Superior
        this.ctx.fillRect(x + width/2 - handleSize/2, y + height - handleSize/2, handleSize, handleSize); // Inferior
        this.ctx.fillRect(x - handleSize/2, y + height/2 - handleSize/2, handleSize, handleSize); // Esquerdo
        this.ctx.fillRect(x + width - handleSize/2, y + height/2 - handleSize/2, handleSize, handleSize); // Direito
    },
    
    // Configura os event listeners para interação com o canvas
    setupEventListeners: function() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        
        // Touch events para dispositivos móveis
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleMouseDown({
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {}
            });
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleMouseMove({
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {}
            });
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleMouseUp();
        });
    },
    
    // Manipulador de evento mousedown
    handleMouseDown: function(e) {
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.mouse.startX = x;
        this.mouse.startY = y;
        this.mouse.isMoving = true;
        
        if (this.state.isCropping) {
            // Verifica se o clique foi em uma alça de redimensionamento
            const cropX = this.state.translateX + this.state.cropX * this.state.scale;
            const cropY = this.state.translateY + this.state.cropY * this.state.scale;
            const cropWidth = this.state.cropWidth * this.state.scale;
            const cropHeight = this.state.cropHeight * this.state.scale;
            
            const handleSize = 10;
            const handleHitboxSize = 20; // Área maior para facilitar o clique
            
            // Verifica cada alça
            if (Math.abs(x - cropX) < handleHitboxSize && Math.abs(y - cropY) < handleHitboxSize) {
                this.mouse.moveType = 'resize-nw'; // Noroeste
            } else if (Math.abs(x - (cropX + cropWidth)) < handleHitboxSize && Math.abs(y - cropY) < handleHitboxSize) {
                this.mouse.moveType = 'resize-ne'; // Nordeste
            } else if (Math.abs(x - cropX) < handleHitboxSize && Math.abs(y - (cropY + cropHeight)) < handleHitboxSize) {
                this.mouse.moveType = 'resize-sw'; // Sudoeste
            } else if (Math.abs(x - (cropX + cropWidth)) < handleHitboxSize && Math.abs(y - (cropY + cropHeight)) < handleHitboxSize) {
                this.mouse.moveType = 'resize-se'; // Sudeste
            } else if (Math.abs(x - (cropX + cropWidth/2)) < handleHitboxSize && Math.abs(y - cropY) < handleHitboxSize) {
                this.mouse.moveType = 'resize-n'; // Norte
            } else if (Math.abs(x - (cropX + cropWidth/2)) < handleHitboxSize && Math.abs(y - (cropY + cropHeight)) < handleHitboxSize) {
                this.mouse.moveType = 'resize-s'; // Sul
            } else if (Math.abs(x - cropX) < handleHitboxSize && Math.abs(y - (cropY + cropHeight/2)) < handleHitboxSize) {
                this.mouse.moveType = 'resize-w'; // Oeste
            } else if (Math.abs(x - (cropX + cropWidth)) < handleHitboxSize && Math.abs(y - (cropY + cropHeight/2)) < handleHitboxSize) {
                this.mouse.moveType = 'resize-e'; // Leste
            } else if (x >= cropX && x <= cropX + cropWidth && y >= cropY && y <= cropY + cropHeight) {
                this.mouse.moveType = 'move-crop'; // Mover área de corte
            } else {
                // Inicia uma nova área de corte
                this.state.cropX = (x - this.state.translateX) / this.state.scale;
                this.state.cropY = (y - this.state.translateY) / this.state.scale;
                this.state.cropWidth = 0;
                this.state.cropHeight = 0;
                this.mouse.moveType = 'resize-se';
            }
        } else {
            // Modo de movimentação da imagem
            this.mouse.moveType = 'move';
        }
    },
    
    // Manipulador de evento mousemove
    handleMouseMove: function(e) {
        if (!this.mouse.isMoving) return;
        
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const deltaX = x - this.mouse.startX;
        const deltaY = y - this.mouse.startY;
        
        if (this.state.isCropping) {
            // Manipulação da área de corte
            if (this.mouse.moveType === 'move-crop') {
                // Mover a área de corte
                this.state.cropX += deltaX / this.state.scale;
                this.state.cropY += deltaY / this.state.scale;
            } else if (this.mouse.moveType.startsWith('resize')) {
                // Redimensionar a área de corte
                const cropX = this.state.translateX + this.state.cropX * this.state.scale;
                const cropY = this.state.translateY + this.state.cropY * this.state.scale;
                
                if (this.mouse.moveType.includes('n')) {
                    const newY = cropY + deltaY;
                    const newHeight = (cropY + this.state.cropHeight * this.state.scale) - newY;
                    if (newHeight > 10) { // Evita altura negativa ou muito pequena
                        this.state.cropY = (newY - this.state.translateX) / this.state.scale;
                        this.state.cropHeight = newHeight / this.state.scale;
                    }
                }
                
                if (this.mouse.moveType.includes('s')) {
                    const newHeight = this.state.cropHeight * this.state.scale + deltaY;
                    if (newHeight > 10) { // Evita altura muito pequena
                        this.state.cropHeight = newHeight / this.state.scale;
                    }
                }
                
                if (this.mouse.moveType.includes('w')) {
                    const newX = cropX + deltaX;
                    const newWidth = (cropX + this.state.cropWidth * this.state.scale) - newX;
                    if (newWidth > 10) { // Evita largura negativa ou muito pequena
                        this.state.cropX = (newX - this.state.translateX) / this.state.scale;
                        this.state.cropWidth = newWidth / this.state.scale;
                    }
                }
                
                if (this.mouse.moveType.includes('e')) {
                    const newWidth = this.state.cropWidth * this.state.scale + deltaX;
                    if (newWidth > 10) { // Evita largura muito pequena
                        this.state.cropWidth = newWidth / this.state.scale;
                    }
                }
            }
        } else if (this.mouse.moveType === 'move') {
            // Mover a imagem
            this.state.translateX += deltaX;
            this.state.translateY += deltaY;
        }
        
        this.mouse.startX = x;
        this.mouse.startY = y;
        
        this.drawImage();
    },
    
    // Manipulador de evento mouseup
    handleMouseUp: function() {
        this.mouse.isMoving = false;
        this.mouse.moveType = null;
    },
    
    // Manipulador de evento wheel (para zoom)
    handleWheel: function(e) {
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Calcula a posição do mouse relativa à imagem
        const imageX = (mouseX - this.state.translateX) / this.state.scale;
        const imageY = (mouseY - this.state.translateY) / this.state.scale;
        
        // Ajusta a escala com base na direção do scroll
        const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;
        const newScale = this.state.scale * scaleFactor;
        
        // Limita a escala para evitar zoom excessivo
        if (newScale > 0.1 && newScale < 5) {
            this.state.scale = newScale;
            
            // Ajusta a posição para manter o ponto sob o cursor do mouse
            this.state.translateX = mouseX - imageX * this.state.scale;
            this.state.translateY = mouseY - imageY * this.state.scale;
            
            this.drawImage();
        }
    },
    
    // Redefine o estado para os valores padrão
    resetState: function() {
        this.state = {
            scale: 1,
            rotate: 0,
            translateX: 0,
            translateY: 0,
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            cropX: 0,
            cropY: 0,
            cropWidth: this.originalImage ? this.originalImage.width : 0,
            cropHeight: this.originalImage ? this.originalImage.height : 0,
            isCropping: false
        };
    },
    
    // Ativa/desativa o modo de corte
    toggleCropMode: function() {
        this.state.isCropping = !this.state.isCropping;
        
        if (this.state.isCropping) {
            // Se estiver ativando o modo de corte, define a área inicial como a imagem inteira
            this.state.cropX = 0;
            this.state.cropY = 0;
            this.state.cropWidth = this.originalImage.width;
            this.state.cropHeight = this.originalImage.height;
        }
        
        this.drawImage();
        return this.state.isCropping;
    },
    
    // Aplica o corte à imagem
    applyCrop: function() {
        if (!this.state.isCropping || !this.originalImage) return false;
        
        // Cria um canvas temporário para o corte
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Define o tamanho do canvas para a área de corte
        tempCanvas.width = this.state.cropWidth;
        tempCanvas.height = this.state.cropHeight;
        
        // Desenha apenas a parte recortada da imagem
        tempCtx.drawImage(
            this.originalImage,
            this.state.cropX, this.state.cropY,
            this.state.cropWidth, this.state.cropHeight,
            0, 0,
            this.state.cropWidth, this.state.cropHeight
        );
        
        // Cria uma nova imagem a partir do canvas recortado
        const newImage = new Image();
        newImage.onload = () => {
            // Substitui a imagem original pela recortada
            this.originalImage = newImage;
            
            // Redefine o estado
            this.state.isCropping = false;
            this.fitImageToCanvas();
            this.drawImage();
        };
        newImage.src = tempCanvas.toDataURL();
        
        return true;
    },
    
    // Ajusta o brilho da imagem
    setBrightness: function(value) {
        this.state.brightness = value;
        this.drawImage();
    },
    
    // Ajusta o contraste da imagem
    setContrast: function(value) {
        this.state.contrast = value;
        this.drawImage();
    },
    
    // Ajusta a saturação da imagem
    setSaturation: function(value) {
        this.state.saturation = value;
        this.drawImage();
    },
    
    // Ajusta o desfoque da imagem
    setBlur: function(value) {
        this.state.blur = value;
        this.drawImage();
    },
    
    // Rotaciona a imagem
    rotate: function(degrees) {
        this.state.rotate += degrees;
        this.drawImage();
    },
    
    // Obtém a imagem editada como Data URL
    getEditedImageDataURL: function() {
        return this.canvas.toDataURL('image/png');
    },
    
    // Obtém a imagem editada como Blob
    getEditedImageBlob: function(callback) {
        this.canvas.toBlob(callback, 'image/png');
    }
};