const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const processingSection = document.getElementById('processingSection');
const resultSection = document.getElementById('resultSection');
const errorMessage = document.getElementById('errorMessage');
const toleranceInput = document.getElementById('tolerance');
const bgColorInput = document.getElementById('bgColor');
const useBgColorCheckbox = document.getElementById('useBgColor');
const removeMode = document.getElementById('removeMode');
const featherInput = document.getElementById('feather');
const autoBgCheckbox = document.getElementById('autoBg');

// Editor elements
const processedImgEl = document.getElementById('processedImage');
const editorCanvas = document.getElementById('editorCanvas');
const toggleBrushBtn = document.getElementById('toggleBrushBtn');
const brushSizeInput = document.getElementById('brushSize');
const brushModeSelect = document.getElementById('brushMode');
const applyAdjustBtn = document.getElementById('applyAdjustBtn');
const downloadAdjustedBtn = document.getElementById('downloadAdjustedBtn');
const editorTools = document.querySelector('.editor-tools');

// Optimizer elements
const optFormat = document.getElementById('optFormat');
const optQuality = document.getElementById('optQuality');
const optWidth = document.getElementById('optWidth');
const optimizeBtn = document.getElementById('optimizeBtn');

// Comparison slider elements
const compSlider = document.getElementById('comparisonSlider');
const compWrapper = document.querySelector('#comparisonSlider .comp-wrapper');
const compOverlay = document.getElementById('compOverlay');
const compHandle = document.getElementById('compHandle');
const compOriginal = document.getElementById('compOriginal');
const compProcessedEl = document.getElementById('compProcessed');
let compEventsBound = false;
let compSliding = false;

// Preview background controls
const previewBgMode = document.getElementById('previewBgMode');
const previewBgColor = document.getElementById('previewBgColor');
const previewSolidControls = document.getElementById('previewSolidControls');
const previewBackdropControls = document.getElementById('previewBackdropControls');
const previewBackdrop = document.getElementById('previewBackdrop');
const processedBox = document.getElementById('processedBox');

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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// File input
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Processar arquivo
function handleFile(file) {
    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        showError('Tipo de arquivo inválido. Use JPG ou PNG.');
        return;
    }
    
    // Validar tamanho
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showError('Arquivo muito grande. Máximo: 10MB');
        return;
    }
    
    uploadImage(file);
}

// Upload e processamento
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('tolerance', toleranceInput.value);
    if (useBgColorCheckbox && useBgColorCheckbox.checked) {
        formData.append('bgcolor', bgColorInput.value);
    }
    // Parâmetros avançados
    if (removeMode) formData.append('mode', removeMode.value);
    if (featherInput) formData.append('feather', featherInput.value);
    if (autoBgCheckbox) formData.append('autoBg', autoBgCheckbox.checked ? '1' : '0');
    
    // Mostrar seção de processamento
    showSection('processing');
    
    try {
        const response = await fetch('upload.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Mostrar resultado
            document.getElementById('originalImage').src = result.original;
            document.getElementById('processedImage').src = result.processed;
            document.getElementById('downloadBtn').href = 'download.php?file=' + result.processed.split('/').pop();
            // Preparar editor
            editorTools.style.display = 'flex';
            showSection('result');
            setupEditor(result.original, result.processed);
            initComparisonSlider(result.original, result.processed);
            applyPreviewBackgrounds();
        } else {
            showError(result.message);
            showSection('upload');
        }
    } catch (error) {
        showError('Erro ao processar imagem. Tente novamente.');
        showSection('upload');
    }
}

// Gerenciar seções
function showSection(section) {
    uploadSection.classList.remove('active');
    processingSection.classList.remove('active');
    resultSection.classList.remove('active');
    errorMessage.classList.remove('active');
    
    switch(section) {
        case 'upload':
            uploadSection.classList.add('active');
            break;
        case 'processing':
            processingSection.classList.add('active');
            break;
        case 'result':
            resultSection.classList.add('active');
            break;
    }
}

// Mostrar erro
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('active');
    setTimeout(() => {
        errorMessage.classList.remove('active');
    }, 5000);
}

// Resetar aplicação
function resetApp() {
    fileInput.value = '';
    showSection('upload');
}

// Inicializar
showSection('upload');

// ===== Magic Brush Editor =====
let isBrushing = false;
let brushSize = 25;
let brushMode = 'erase'; // 'erase' or 'restore'
let editorCtx;
let originalCanvas, originalCtx;

function setupEditor(originalSrc, processedSrc) {
    // Load images to prepare canvas sizes
    const processedImg = new Image();
    processedImg.crossOrigin = 'anonymous';
    processedImg.onload = () => {
        editorCanvas.width = processedImg.width;
        editorCanvas.height = processedImg.height;
        editorCtx = editorCanvas.getContext('2d');
        editorCtx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
        editorCtx.drawImage(processedImg, 0, 0);
        // Prepare original on hidden canvas for restore mode
        originalCanvas = document.createElement('canvas');
        originalCanvas.width = processedImg.width;
        originalCanvas.height = processedImg.height;
        originalCtx = originalCanvas.getContext('2d');
        const originalImg = new Image();
        originalImg.crossOrigin = 'anonymous';
        originalImg.onload = () => {
            originalCtx.drawImage(originalImg, 0, 0, originalCanvas.width, originalCanvas.height);
        };
        originalImg.src = originalSrc;
    };
    processedImg.src = processedSrc;
}

function setBrushUIActive(active) {
    if (active) {
        processedImgEl.style.display = 'none';
        editorCanvas.style.display = 'block';
        downloadAdjustedBtn.style.display = 'inline-block';
        if (compSlider) compSlider.style.display = 'none';
    } else {
        processedImgEl.style.display = 'block';
        editorCanvas.style.display = 'none';
        downloadAdjustedBtn.style.display = 'none';
        if (compSlider) compSlider.style.display = 'block';
    }
}

toggleBrushBtn?.addEventListener('click', () => {
    const active = editorCanvas.style.display !== 'block';
    setBrushUIActive(active);
});

brushSizeInput?.addEventListener('input', (e) => {
    brushSize = parseInt(e.target.value, 10) || 25;
});

brushModeSelect?.addEventListener('change', (e) => {
    brushMode = e.target.value;
});

function getCanvasPos(e) {
    const rect = editorCanvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (editorCanvas.width / rect.width);
    const y = (e.clientY - rect.top) * (editorCanvas.height / rect.height);
    return { x, y };
}

function drawBrush(x, y) {
    if (!editorCtx) return;
    if (brushMode === 'erase') {
        editorCtx.save();
        editorCtx.globalCompositeOperation = 'destination-out';
        editorCtx.beginPath();
        editorCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        editorCtx.fill();
        editorCtx.restore();
    } else {
        // restore from original image
        const diameter = brushSize;
        const sx = Math.max(0, x - diameter / 2);
        const sy = Math.max(0, y - diameter / 2);
        const sw = diameter;
        const sh = diameter;
        editorCtx.drawImage(originalCanvas, sx, sy, sw, sh, sx, sy, sw, sh);
    }
}

editorCanvas?.addEventListener('mousedown', (e) => {
    isBrushing = true;
    const { x, y } = getCanvasPos(e);
    drawBrush(x, y);
});

editorCanvas?.addEventListener('mousemove', (e) => {
    if (!isBrushing) return;
    const { x, y } = getCanvasPos(e);
    drawBrush(x, y);
});

window.addEventListener('mouseup', () => {
    isBrushing = false;
});

applyAdjustBtn?.addEventListener('click', () => {
    // Update displayed processed image with canvas content and set download link
    const dataUrl = editorCanvas.toDataURL('image/png');
    processedImgEl.src = dataUrl;
    setBrushUIActive(false);
    downloadAdjustedBtn.href = dataUrl;
    downloadAdjustedBtn.setAttribute('download', 'ajustado.png');
    if (compProcessedEl) {
        compProcessedEl.src = dataUrl;
        if (compSlider) compSlider.style.display = 'block';
    }
    applyPreviewBackgrounds();
});

// ===== Optimizer =====
optimizeBtn?.addEventListener('click', async () => {
    try {
        const currentProcessed = document.getElementById('processedImage').src;
        // If using data URL, skip server optimize
        if (currentProcessed.startsWith('data:')) {
            showError('Baixe ajustado via botão dedicado (imagem no navegador).');
            return;
        }
        const fileName = currentProcessed.split('/').pop();
        const formData = new FormData();
        formData.append('file', fileName);
        formData.append('format', optFormat.value);
        formData.append('quality', optQuality.value);
        if (optWidth.value) formData.append('maxWidth', optWidth.value);

        const resp = await fetch('optimize.php', { method: 'POST', body: formData });
        const data = await resp.json();
        if (data.success) {
            document.getElementById('processedImage').src = data.optimized;
            document.getElementById('downloadBtn').href = 'download.php?file=' + data.optimized.split('/').pop();
            if (compProcessedEl) compProcessedEl.src = data.optimized;
            applyPreviewBackgrounds();
        } else {
            showError(data.message || 'Falha na otimização');
        }
    } catch (err) {
        showError('Erro ao otimizar imagem');
    }
});

// ===== Before/After Comparison Slider =====
function setOverlayPercent(percent) {
    if (!compOverlay || !compHandle) return;
    const clamped = Math.max(0, Math.min(100, percent));
    compOverlay.style.width = clamped + '%';
    compHandle.style.left = clamped + '%';
}

function bindComparisonEvents() {
    if (!compWrapper) return;
    const getClientX = (e) => {
        if (e.touches && e.touches[0]) return e.touches[0].clientX;
        return e.clientX;
    };
    const onMove = (e) => {
        if (!compSliding) return;
        const rect = compWrapper.getBoundingClientRect();
        const x = getClientX(e) - rect.left;
        const percent = (x / rect.width) * 100;
        setOverlayPercent(percent);
        e.preventDefault();
    };
    const start = (e) => { compSliding = true; onMove(e); };
    const end = () => { compSliding = false; };

    compWrapper.addEventListener('mousedown', start);
    compWrapper.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
}

function initComparisonSlider(originalSrc, processedSrc) {
    if (!compSlider || !compOriginal || !compProcessedEl) return;
    compOriginal.src = originalSrc;
    compProcessedEl.src = processedSrc;
    compSlider.style.display = 'block';
    setOverlayPercent(50);
    if (!compEventsBound) {
        bindComparisonEvents();
        compEventsBound = true;
    }
}

// ===== Preview Background Logic =====
function clearBgClasses(el) {
    if (!el) return;
    el.classList.remove('bg-checker','bg-backdrop-gray','bg-backdrop-clouds','bg-backdrop-fabric','bg-backdrop-space','bg-backdrop-balls');
    el.style.backgroundImage = '';
    el.style.backgroundColor = '';
}

function applyPreviewBackgrounds() {
    if (!processedBox || !compOverlay) return;
    const mode = previewBgMode ? previewBgMode.value : 'checker';
    clearBgClasses(processedBox);
    clearBgClasses(compOverlay);
    if (mode === 'checker') {
        processedBox.classList.add('bg-checker');
        compOverlay.classList.add('bg-checker');
        previewSolidControls && (previewSolidControls.style.display = 'none');
        previewBackdropControls && (previewBackdropControls.style.display = 'none');
    } else if (mode === 'solid') {
        const color = previewBgColor ? previewBgColor.value : '#ffffff';
        processedBox.style.backgroundColor = color;
        compOverlay.style.backgroundColor = color;
        previewSolidControls && (previewSolidControls.style.display = 'inline-flex');
        previewBackdropControls && (previewBackdropControls.style.display = 'none');
    } else if (mode === 'backdrop') {
        const bd = previewBackdrop ? previewBackdrop.value : 'gray';
        const cls = 'bg-backdrop-' + bd;
        processedBox.classList.add(cls);
        compOverlay.classList.add(cls);
        previewSolidControls && (previewSolidControls.style.display = 'none');
        previewBackdropControls && (previewBackdropControls.style.display = 'inline-flex');
    }
}

previewBgMode?.addEventListener('change', applyPreviewBackgrounds);
previewBgColor?.addEventListener('input', () => {
    if (previewBgMode && previewBgMode.value === 'solid') applyPreviewBackgrounds();
});
previewBackdrop?.addEventListener('change', () => {
    if (previewBgMode && previewBgMode.value === 'backdrop') applyPreviewBackgrounds();
});

// ===== Refine Edges Overlay =====
const refineEdgesBtn = document.getElementById('refineEdgesBtn');
const edgeCanvas = document.getElementById('edgeCanvas');
const compEdgeCanvas = document.getElementById('compEdgeCanvas');
let refineOn = false;

function drawEdgesToCanvasFromSrc(src, targetCanvas, color = '#ff0066') {
    if (!targetCanvas || !src) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        targetCanvas.width = img.width;
        targetCanvas.height = img.height;
        const ctx = targetCanvas.getContext('2d');
        const off = document.createElement('canvas');
        off.width = img.width; off.height = img.height;
        const offCtx = off.getContext('2d');
        offCtx.drawImage(img, 0, 0);
        const data = offCtx.getImageData(0, 0, off.width, off.height);
        const out = ctx.createImageData(off.width, off.height);
        const w = off.width, h = off.height;
        const isEdge = (x, y) => {
            const idx = (y * w + x) * 4 + 3; // alpha channel index
            const a = data.data[idx];
            if (a === 0) return false;
            // Check 4-neighbors
            const neighbors = [
                (y > 0) ? data.data[((y-1) * w + x) * 4 + 3] : 255,
                (y < h-1) ? data.data[((y+1) * w + x) * 4 + 3] : 255,
                (x > 0) ? data.data[(y * w + (x-1)) * 4 + 3] : 255,
                (x < w-1) ? data.data[(y * w + (x+1)) * 4 + 3] : 255
            ];
            return neighbors.some(na => na === 0);
        };
        const [cr, cg, cb] = [
            parseInt(color.slice(1,3),16),
            parseInt(color.slice(3,5),16),
            parseInt(color.slice(5,7),16)
        ];
        for (let y = 1; y < h-1; y++) {
            for (let x = 1; x < w-1; x++) {
                if (isEdge(x,y)) {
                    const oi = (y * w + x) * 4;
                    out.data[oi] = cr;
                    out.data[oi+1] = cg;
                    out.data[oi+2] = cb;
                    out.data[oi+3] = 255;
                }
            }
        }
        ctx.putImageData(out, 0, 0);
    };
    img.src = src;
}

function toggleRefineOverlay() {
    refineOn = !refineOn;
    if (refineOn) {
        edgeCanvas && (edgeCanvas.style.display = 'block');
        compEdgeCanvas && (compEdgeCanvas.style.display = 'block');
        drawEdgesToCanvasFromSrc(processedImgEl?.src, edgeCanvas);
        drawEdgesToCanvasFromSrc(compProcessedEl?.src, compEdgeCanvas);
    } else {
        edgeCanvas && (edgeCanvas.style.display = 'none');
        compEdgeCanvas && (compEdgeCanvas.style.display = 'none');
    }
}

refineEdgesBtn?.addEventListener('click', toggleRefineOverlay);