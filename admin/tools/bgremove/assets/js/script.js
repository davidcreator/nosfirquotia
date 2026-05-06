const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const processingSection = document.getElementById('processingSection');
const resultSection = document.getElementById('resultSection');
const errorMessage = document.getElementById('errorMessage');
const openFilePickerBtn = document.getElementById('openFilePickerBtn');
const resetAppBtn = document.getElementById('resetAppBtn');
const processingStatusEl = document.getElementById('processingStatus');
const processingElapsedEl = document.getElementById('processingElapsed');
const processingSpinnerEl = processingSection ? processingSection.querySelector('.spinner') : null;
const originalImageEl = document.getElementById('originalImage');
const downloadBtn = document.getElementById('downloadBtn');
const openFinalFrameBtn = document.getElementById('openFinalFrameBtn');
const toleranceInput = document.getElementById('tolerance');
const bgColorInput = document.getElementById('bgColor');
const useBgColorCheckbox = document.getElementById('useBgColor');
const removeMode = document.getElementById('removeMode');
const featherInput = document.getElementById('feather');
const autoBgCheckbox = document.getElementById('autoBg');
const noiseCleanInput = document.getElementById('noiseClean');
const fillHolesInput = document.getElementById('fillHoles');
const edgeTrimInput = document.getElementById('edgeTrim');
const qualityPresetSelect = document.getElementById('qualityPreset');
const smartPresetCheckbox = document.getElementById('smartPreset');
const showSmartDebugCheckbox = document.getElementById('showSmartDebug');
const comparePresetsBtn = document.getElementById('comparePresetsBtn');
const noiseCleanValueEl = document.getElementById('noiseCleanValue');
const fillHolesValueEl = document.getElementById('fillHolesValue');
const edgeTrimValueEl = document.getElementById('edgeTrimValue');
const presetResultInfoEl = document.getElementById('presetResultInfo');
const smartDebugPanelEl = document.getElementById('smartDebugPanel');
const presetCompareGridEl = document.getElementById('presetCompareGrid');
const resultBlockToggles = document.querySelectorAll('.result-block-toggle');
const resultBlocks = Array.from(document.querySelectorAll('.result-block'));
const expandAllBlocksBtn = document.getElementById('expandAllBlocksBtn');
const collapseAllBlocksBtn = document.getElementById('collapseAllBlocksBtn');
const resetBlocksBtn = document.getElementById('resetBlocksBtn');
const resultFlowStepButtons = Array.from(document.querySelectorAll('.result-flow-step-btn'));

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
let processingTickerId = null;
let processingStepsId = null;
let processingRafId = null;
let processingStartedAt = 0;
let processingStepIndex = 0;
let lastSelectedFile = null;
let presetCompareCache = [];
let lastResultMeta = null;

const PROCESSING_STEPS = [
    'Enviando imagem',
    'Analisando fundo',
    'Refinando recorte',
    'Gerando preview',
];

const QUALITY_PRESETS = {
    auto: { mode: 'auto', feather: 1, autoBg: true, noiseClean: 45, fillHoles: 35, edgeTrim: 5 },
    portrait: { mode: 'auto', feather: 2, autoBg: true, noiseClean: 35, fillHoles: 50, edgeTrim: 3 },
    product: { mode: 'rgb', feather: 1, autoBg: true, noiseClean: 65, fillHoles: 30, edgeTrim: 8 },
    logo: { mode: 'rgb', feather: 0, autoBg: false, noiseClean: 80, fillHoles: 20, edgeTrim: 10 },
    soft: { mode: 'auto', feather: 3, autoBg: true, noiseClean: 25, fillHoles: 55, edgeTrim: 2 },
};
const PRESET_LABELS = {
    auto: 'Auto equilibrado',
    portrait: 'Retrato',
    product: 'Produto',
    logo: 'Logo/icone',
    soft: 'Recorte suave',
    custom: 'Personalizado',
};
const PRESET_COMPARE_ORDER = ['auto', 'portrait', 'product', 'logo', 'soft'];
const RESULT_FLOW_STEPS = [
    { key: 'comparison', blockId: 'resultBlockComparison' },
    { key: 'adjust', blockId: 'resultBlockAdjust' },
    { key: 'export', blockId: 'resultBlockExport' },
];
const RESULT_FLOW_STEP_BLOCK_IDS = RESULT_FLOW_STEPS.map((step) => step.blockId);
const RESULT_BLOCKS_STATE_KEY = 'aq_bgremove_result_blocks_state_v1';
const BGREMOVE_STATE_KEY_FALLBACK = 'aq_bgremove_state_v1';
const RECOMMENDATION_SOURCE_KEY = 'finalframe';
const RESULT_BLOCK_DEFAULT_STATE = {
    resultBlockComparison: false,
    resultBlockPreview: true,
    resultBlockAdjust: true,
    resultBlockAnalysis: true,
    resultBlockExport: true,
};

let presetApplying = false;

function getBrandKitApi() {
    return window.AQBrandKit || null;
}

function writeBgremoveStateFallback(payload) {
    if (typeof window.localStorage === 'undefined') return;
    try {
        window.localStorage.setItem(BGREMOVE_STATE_KEY_FALLBACK, JSON.stringify(payload));
    } catch (error) {
        // Ignore localStorage errors.
    }
}

function sanitizeBgremoveStateRef(value) {
    const raw = String(value || '');
    if (!raw) return '';
    if (raw.startsWith('data:')) return 'inline-adjustment';
    return raw.slice(0, 900);
}

function buildBgremoveSyncPayload(status = 'updated', extra = {}) {
    const originalSrc = originalImageEl ? String(originalImageEl.src || '') : '';
    const processedSrc = processedImgEl ? String(processedImgEl.src || '') : '';
    const hasProcessedUrl = processedSrc !== '' && !processedSrc.endsWith('/');
    const hasAdjusted = processedSrc.startsWith('data:');
    const downloadHref = downloadBtn ? String(downloadBtn.href || '') : '';
    const adjustedDownloadHref = downloadAdjustedBtn ? String(downloadAdjustedBtn.href || '') : '';

    const basePayload = {
        status,
        hasUpload: Boolean(lastSelectedFile),
        hasResult: hasProcessedUrl,
        hasAdjusted,
        input: {
            name: lastSelectedFile ? String(lastSelectedFile.name || '') : '',
            size: lastSelectedFile ? Number(lastSelectedFile.size || 0) : 0,
            type: lastSelectedFile ? String(lastSelectedFile.type || '') : ''
        },
        settings: {
            tolerance: toleranceInput ? Number.parseInt(toleranceInput.value, 10) || 0 : 0,
            bgColor: bgColorInput ? bgColorInput.value : '#ffffff',
            useBgColor: useBgColorCheckbox ? !!useBgColorCheckbox.checked : false,
            mode: removeMode ? removeMode.value : 'auto',
            feather: featherInput ? Number.parseInt(featherInput.value, 10) || 0 : 0,
            autoBg: autoBgCheckbox ? !!autoBgCheckbox.checked : true,
            noiseClean: noiseCleanInput ? Number.parseInt(noiseCleanInput.value, 10) || 0 : 0,
            fillHoles: fillHolesInput ? Number.parseInt(fillHolesInput.value, 10) || 0 : 0,
            edgeTrim: edgeTrimInput ? Number.parseInt(edgeTrimInput.value, 10) || 0 : 0,
            presetKey: qualityPresetSelect ? qualityPresetSelect.value : 'custom',
            smartPreset: smartPresetCheckbox ? !!smartPresetCheckbox.checked : false
        },
        output: {
            original: sanitizeBgremoveStateRef(originalSrc),
            processed: sanitizeBgremoveStateRef(processedSrc),
            download: sanitizeBgremoveStateRef(downloadHref),
            adjustedDownload: sanitizeBgremoveStateRef(adjustedDownloadHref),
            format: optFormat ? String(optFormat.value || 'png') : 'png'
        },
        meta: lastResultMeta && typeof lastResultMeta === 'object' ? lastResultMeta : {}
    };

    const nextPayload = {
        ...basePayload,
        ...(extra && typeof extra === 'object' ? extra : {})
    };

    if (extra && typeof extra === 'object') {
        if (extra.input && typeof extra.input === 'object') {
            nextPayload.input = { ...basePayload.input, ...extra.input };
        }
        if (extra.settings && typeof extra.settings === 'object') {
            nextPayload.settings = { ...basePayload.settings, ...extra.settings };
        }
        if (extra.output && typeof extra.output === 'object') {
            nextPayload.output = { ...basePayload.output, ...extra.output };
        }
        if (extra.meta && typeof extra.meta === 'object') {
            nextPayload.meta = extra.meta;
        }
    }

    if (nextPayload.output && typeof nextPayload.output === 'object') {
        nextPayload.output.original = sanitizeBgremoveStateRef(nextPayload.output.original);
        nextPayload.output.processed = sanitizeBgremoveStateRef(nextPayload.output.processed);
        nextPayload.output.download = sanitizeBgremoveStateRef(nextPayload.output.download);
        nextPayload.output.adjustedDownload = sanitizeBgremoveStateRef(nextPayload.output.adjustedDownload);
    }

    return nextPayload;
}

function syncBgremoveState(status = 'updated', extra = {}) {
    const payload = buildBgremoveSyncPayload(status, extra);
    const api = getBrandKitApi();
    if (api && typeof api.saveBgRemoveState === 'function') {
        try {
            api.saveBgRemoveState(payload, 'bgremove');
            return payload;
        } catch (error) {
            // Continue to fallback below.
        }
    }
    writeBgremoveStateFallback({
        ...payload,
        source: 'bgremove',
        updatedAt: new Date().toISOString()
    });
    return payload;
}

function toolUrl(path) {
    const base = document.baseURI || window.location.href;
    return new URL(path, base).toString();
}

function extractFileName(pathOrUrl) {
    if (!pathOrUrl) return '';
    try {
        const parsed = new URL(pathOrUrl, document.baseURI || window.location.href);
        const parts = parsed.pathname.split('/').filter(Boolean);
        return decodeURIComponent(parts.pop() || '');
    } catch (error) {
        const clean = String(pathOrUrl).split('?')[0];
        const parts = clean.split('/').filter(Boolean);
        return decodeURIComponent(parts.pop() || '');
    }
}

function setInputValue(input, value) {
    if (!input) return;
    input.value = String(value);
}

function clampInt(value, min, max, fallback) {
    const parsed = Number.parseInt(String(value), 10);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.max(min, Math.min(max, parsed));
}

function parseBooleanParam(value, fallback = false) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === '') return fallback;
    if (['1', 'true', 'yes', 'on', 'sim'].includes(raw)) return true;
    if (['0', 'false', 'no', 'off', 'nao'].includes(raw)) return false;
    return fallback;
}

function normalizePresetKey(value) {
    const key = String(value || '').trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(QUALITY_PRESETS, key) ? key : 'custom';
}

function applyRecommendationQueryParams() {
    if (typeof window === 'undefined' || !window.location || !window.location.search) {
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const source = String(params.get('from') || '').toLowerCase();
    if (source !== RECOMMENDATION_SOURCE_KEY) {
        return;
    }

    const preset = normalizePresetKey(params.get('preset'));
    if (qualityPresetSelect) {
        qualityPresetSelect.value = preset === 'custom' ? 'custom' : preset;
        if (preset !== 'custom') {
            applyQualityPreset(preset);
        }
    }

    const mode = String(params.get('mode') || '').toLowerCase();
    if (removeMode && ['auto', 'rgb', 'hsv'].includes(mode)) {
        removeMode.value = mode;
    }
    if (toleranceInput) {
        setInputValue(toleranceInput, clampInt(params.get('tolerance'), 5, 50, 15));
    }
    if (featherInput) {
        setInputValue(featherInput, clampInt(params.get('feather'), 0, 8, 1));
    }
    if (noiseCleanInput) {
        setInputValue(noiseCleanInput, clampInt(params.get('noiseClean'), 0, 100, 45));
    }
    if (fillHolesInput) {
        setInputValue(fillHolesInput, clampInt(params.get('fillHoles'), 0, 100, 35));
    }
    if (edgeTrimInput) {
        setInputValue(edgeTrimInput, clampInt(params.get('edgeTrim'), 0, 20, 5));
    }
    if (autoBgCheckbox) {
        autoBgCheckbox.checked = parseBooleanParam(params.get('autoBg'), true);
    }
    if (smartPresetCheckbox) {
        smartPresetCheckbox.checked = parseBooleanParam(params.get('smartPreset'), true);
    }

    syncFineControlBadges();
    setPresetByCurrentState();
    syncBgremoveState('recommendation_loaded', {
        settings: {
            tolerance: toleranceInput ? Number.parseInt(toleranceInput.value, 10) || 15 : 15,
            mode: removeMode ? removeMode.value : 'auto',
            feather: featherInput ? Number.parseInt(featherInput.value, 10) || 1 : 1,
            autoBg: autoBgCheckbox ? !!autoBgCheckbox.checked : true,
            noiseClean: noiseCleanInput ? Number.parseInt(noiseCleanInput.value, 10) || 45 : 45,
            fillHoles: fillHolesInput ? Number.parseInt(fillHolesInput.value, 10) || 35 : 35,
            edgeTrim: edgeTrimInput ? Number.parseInt(edgeTrimInput.value, 10) || 5 : 5,
            presetKey: qualityPresetSelect ? qualityPresetSelect.value : 'custom',
            smartPreset: smartPresetCheckbox ? !!smartPresetCheckbox.checked : false
        }
    });

    showError('Ajustes recomendados carregados pelo FinalFrame. Agora envie uma imagem para processar.');
}

function syncFineControlBadges() {
    if (noiseCleanValueEl && noiseCleanInput) noiseCleanValueEl.textContent = noiseCleanInput.value;
    if (fillHolesValueEl && fillHolesInput) fillHolesValueEl.textContent = fillHolesInput.value;
    if (edgeTrimValueEl && edgeTrimInput) edgeTrimValueEl.textContent = edgeTrimInput.value;
}

function captureCurrentPresetState() {
    return {
        mode: removeMode ? removeMode.value : 'auto',
        feather: featherInput ? Number.parseInt(featherInput.value, 10) || 0 : 0,
        autoBg: autoBgCheckbox ? !!autoBgCheckbox.checked : true,
        noiseClean: noiseCleanInput ? Number.parseInt(noiseCleanInput.value, 10) || 0 : 0,
        fillHoles: fillHolesInput ? Number.parseInt(fillHolesInput.value, 10) || 0 : 0,
        edgeTrim: edgeTrimInput ? Number.parseInt(edgeTrimInput.value, 10) || 0 : 0,
    };
}

function inferMatchingPreset() {
    const current = captureCurrentPresetState();
    const keys = Object.keys(QUALITY_PRESETS);
    for (const key of keys) {
        const preset = QUALITY_PRESETS[key];
        if (
            preset.mode === current.mode &&
            preset.feather === current.feather &&
            preset.autoBg === current.autoBg &&
            preset.noiseClean === current.noiseClean &&
            preset.fillHoles === current.fillHoles &&
            preset.edgeTrim === current.edgeTrim
        ) {
            return key;
        }
    }
    return 'custom';
}

function setPresetByCurrentState() {
    if (!qualityPresetSelect || presetApplying) return;
    qualityPresetSelect.value = inferMatchingPreset();
}

function applyQualityPreset(presetKey) {
    const preset = QUALITY_PRESETS[presetKey];
    if (!preset) return;
    presetApplying = true;
    if (removeMode) removeMode.value = preset.mode;
    setInputValue(featherInput, preset.feather);
    if (autoBgCheckbox) autoBgCheckbox.checked = !!preset.autoBg;
    setInputValue(noiseCleanInput, preset.noiseClean);
    setInputValue(fillHolesInput, preset.fillHoles);
    setInputValue(edgeTrimInput, preset.edgeTrim);
    syncFineControlBadges();
    if (qualityPresetSelect) qualityPresetSelect.value = presetKey;
    presetApplying = false;
}

function getPresetLabel(presetKey) {
    return PRESET_LABELS[presetKey] || presetKey || 'n/d';
}

function readStoredResultBlockState() {
    try {
        const raw = window.localStorage.getItem(RESULT_BLOCKS_STATE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (error) {
        return null;
    }
}

function writeStoredResultBlockState() {
    if (!resultBlocks.length) return;
    const state = {};
    resultBlocks.forEach((blockEl) => {
        if (!blockEl || !blockEl.id) return;
        state[blockEl.id] = blockEl.classList.contains('is-collapsed');
    });
    try {
        window.localStorage.setItem(RESULT_BLOCKS_STATE_KEY, JSON.stringify(state));
    } catch (error) {
        // Ignore persistence errors (private mode or blocked storage).
    }
}

function clearStoredResultBlockState() {
    try {
        window.localStorage.removeItem(RESULT_BLOCKS_STATE_KEY);
    } catch (error) {
        // Ignore storage cleanup errors.
    }
}

function getDefaultCollapsedState(blockId) {
    return RESULT_BLOCK_DEFAULT_STATE[blockId] === true;
}

function setResultBlockCollapsed(blockEl, shouldCollapse, options = {}) {
    if (!blockEl) return;
    const persist = options.persist !== false;
    const toggle = blockEl.querySelector('.result-block-toggle');
    const icon = blockEl.querySelector('.result-block-icon');
    const collapsed = !!shouldCollapse;
    blockEl.classList.toggle('is-collapsed', collapsed);
    if (toggle) {
        toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
    if (icon) {
        icon.textContent = collapsed ? '+' : '-';
    }
    if (persist) {
        writeStoredResultBlockState();
    }
}

function expandResultBlockById(blockId, persist = false) {
    if (!blockId) return;
    const blockEl = document.getElementById(blockId);
    if (!blockEl) return;
    setResultBlockCollapsed(blockEl, false, { persist });
}

function setActiveResultFlowButton(targetBlockId) {
    resultFlowStepButtons.forEach((btn) => {
        const btnTarget = btn.getAttribute('data-step-target');
        const isActive = !!targetBlockId && btnTarget === targetBlockId;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (isActive) {
            btn.setAttribute('aria-current', 'step');
        } else {
            btn.removeAttribute('aria-current');
        }
    });
}

function getFlowStepByKey(stepKey) {
    return RESULT_FLOW_STEPS.find((step) => step.key === stepKey) || null;
}

function focusResultFlowStep(stepKey, options = {}) {
    const step = getFlowStepByKey(stepKey);
    if (!step) return;

    const persist = options.persist === true;
    const shouldScroll = options.scroll === true;
    const collapseOtherFlowBlocks = options.collapseOthers !== false;

    if (collapseOtherFlowBlocks) {
        RESULT_FLOW_STEP_BLOCK_IDS.forEach((blockId) => {
            const blockEl = document.getElementById(blockId);
            if (!blockEl) return;
            const shouldCollapse = blockId !== step.blockId;
            setResultBlockCollapsed(blockEl, shouldCollapse, { persist: false });
        });
        if (persist) {
            writeStoredResultBlockState();
        }
    } else {
        expandResultBlockById(step.blockId, persist);
    }

    setActiveResultFlowButton(step.blockId);

    if (shouldScroll) {
        const targetBlock = document.getElementById(step.blockId);
        if (targetBlock && typeof targetBlock.scrollIntoView === 'function') {
            targetBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

function setAllResultBlocksCollapsed(shouldCollapse) {
    resultBlocks.forEach((blockEl) => {
        setResultBlockCollapsed(blockEl, shouldCollapse, { persist: false });
    });
    writeStoredResultBlockState();
    if (shouldCollapse) {
        setActiveResultFlowButton('');
    } else {
        setActiveResultFlowButton('resultBlockComparison');
    }
}

function resetResultBlocksLayout() {
    clearStoredResultBlockState();
    resultBlocks.forEach((blockEl) => {
        const blockId = blockEl && blockEl.id ? blockEl.id : '';
        setResultBlockCollapsed(blockEl, getDefaultCollapsedState(blockId), { persist: false });
    });
    writeStoredResultBlockState();
}

function initResultBlockToggles() {
    const storedState = readStoredResultBlockState();
    resultBlockToggles.forEach((toggle) => {
        const blockEl = toggle.closest('.result-block');
        if (!blockEl) return;
        const blockId = blockEl.id || '';
        const hasStoredState = storedState && Object.prototype.hasOwnProperty.call(storedState, blockId);
        const shouldCollapse = hasStoredState ? !!storedState[blockId] : getDefaultCollapsedState(blockId);
        setResultBlockCollapsed(blockEl, shouldCollapse, { persist: false });
        toggle.addEventListener('click', () => {
            const isCollapsed = blockEl.classList.contains('is-collapsed');
            setResultBlockCollapsed(blockEl, !isCollapsed);
            if (RESULT_FLOW_STEP_BLOCK_IDS.includes(blockId) && !blockEl.classList.contains('is-collapsed')) {
                setActiveResultFlowButton(blockId);
            } else if (RESULT_FLOW_STEP_BLOCK_IDS.includes(blockId) && blockEl.classList.contains('is-collapsed')) {
                setActiveResultFlowButton('');
            }
        });
    });

    resultFlowStepButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const targetBlockId = btn.getAttribute('data-step-target');
            if (!targetBlockId) return;
            const targetStep = RESULT_FLOW_STEPS.find((step) => step.blockId === targetBlockId);
            if (!targetStep) return;
            focusResultFlowStep(targetStep.key, { collapseOthers: true, scroll: true, persist: true });
        });
    });

    expandAllBlocksBtn?.addEventListener('click', () => {
        setAllResultBlocksCollapsed(false);
    });

    collapseAllBlocksBtn?.addEventListener('click', () => {
        setAllResultBlocksCollapsed(true);
    });

    resetBlocksBtn?.addEventListener('click', () => {
        resetResultBlocksLayout();
        setActiveResultFlowButton('resultBlockComparison');
    });

    const firstExpandedFlowBlock = RESULT_FLOW_STEP_BLOCK_IDS.find((blockId) => {
        const blockEl = document.getElementById(blockId);
        return blockEl && !blockEl.classList.contains('is-collapsed');
    });
    setActiveResultFlowButton(firstExpandedFlowBlock || '');
}

function hidePresetComparison() {
    if (!presetCompareGridEl) return;
    presetCompareCache = [];
    presetCompareGridEl.innerHTML = '';
    presetCompareGridEl.style.display = 'none';
}

function hideSmartDebug() {
    if (!smartDebugPanelEl) return;
    smartDebugPanelEl.innerHTML = '';
    smartDebugPanelEl.style.display = 'none';
}

function applySmartScoreBarWidths(root) {
    if (!root) return;
    root.querySelectorAll('[data-score-width]').forEach((fillEl) => {
        const raw = Number.parseFloat(String(fillEl.getAttribute('data-score-width') || '0'));
        const safe = Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0;
        fillEl.style.width = `${safe}%`;
    });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDebugNumber(value, decimals = 3) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 'n/d';
    return value.toFixed(decimals);
}

function renderSmartDebug(meta) {
    if (!smartDebugPanelEl) return;
    if (!showSmartDebugCheckbox || !showSmartDebugCheckbox.checked) {
        hideSmartDebug();
        return;
    }
    if (!meta || meta.presetSource !== 'smart' || !meta.smartSignals || !meta.smartScores) {
        hideSmartDebug();
        return;
    }

    const signalLabels = [
        ['satMean', 'Saturação média'],
        ['valMean', 'Luminosidade média'],
        ['grayRatio', 'Razão de tons neutros'],
        ['edgeDensity', 'Densidade de bordas'],
        ['borderUniformity', 'Uniformidade do fundo'],
        ['uniqueNorm', 'Variedade normalizada'],
        ['uniqueBins', 'Variedade bruta (bins)'],
    ];

    const signalsRows = signalLabels.map(([key, label]) => {
        const raw = meta.smartSignals[key];
        const value = key === 'uniqueBins' ? escapeHtml(raw ?? 'n/d') : escapeHtml(formatDebugNumber(raw, 4));
        return `<li><span>${escapeHtml(label)}</span><strong>${value}</strong></li>`;
    }).join('');

    const scoreEntries = Object.entries(meta.smartScores)
        .filter(([, score]) => typeof score === 'number' && Number.isFinite(score))
        .sort((a, b) => b[1] - a[1]);

    const scoreRows = scoreEntries.map(([key, score]) => {
        const pct = Math.max(0, Math.min(100, Math.round(score * 100)));
        return `
            <div class="smart-score-row">
                <span>${escapeHtml(getPresetLabel(key))}</span>
                <div class="smart-score-bar"><div class="smart-score-fill" data-score-width="${pct}"></div></div>
                <strong>${pct}%</strong>
            </div>
        `;
    }).join('');

    const confidencePct = (typeof meta.smartConfidence === 'number' && Number.isFinite(meta.smartConfidence))
        ? Math.max(0, Math.min(100, Math.round(meta.smartConfidence * 100)))
        : null;
    const confidenceText = confidencePct === null ? 'n/d' : `${confidencePct}%`;

    smartDebugPanelEl.innerHTML = `
        <p class="smart-debug-title">Diagnóstico IA | Confiança da escolha: <strong>${escapeHtml(confidenceText)}</strong></p>
        <div class="smart-debug-grid">
            <section class="smart-debug-card">
                <h6>Sinais da imagem</h6>
                <ul class="smart-debug-list">${signalsRows}</ul>
            </section>
            <section class="smart-debug-card">
                <h6>Pontuação por preset</h6>
                <div class="smart-debug-list">${scoreRows}</div>
            </section>
        </div>
    `;
    applySmartScoreBarWidths(smartDebugPanelEl);
    smartDebugPanelEl.style.display = 'block';
}

function renderPresetInfo(result) {
    if (!presetResultInfoEl) return;
    const meta = result && result.meta ? result.meta : null;
    if (!meta) {
        presetResultInfoEl.style.display = 'none';
        presetResultInfoEl.textContent = '';
        renderSmartDebug(null);
        return;
    }
    const requestedLabel = getPresetLabel(meta.presetRequested);
    const appliedLabel = getPresetLabel(meta.presetApplied);
    let sourceLabel = 'ajuste customizado';
    if (meta.presetSource === 'smart') {
        sourceLabel = 'inteligente';
    } else if (meta.presetSource === 'manual') {
        sourceLabel = 'preset escolhido';
    } else if (meta.presetSource === 'fallback') {
        sourceLabel = 'fallback';
    }
    const parts = [`Preset solicitado: ${requestedLabel}`, `Preset aplicado: ${appliedLabel} (${sourceLabel})`];
    if (meta.presetSource === 'smart' && typeof meta.smartConfidence === 'number' && Number.isFinite(meta.smartConfidence)) {
        const pct = Math.max(0, Math.min(100, Math.round(meta.smartConfidence * 100)));
        parts.push(`Confiança: ${pct}%`);
    }
    presetResultInfoEl.textContent = parts.join(' | ');
    presetResultInfoEl.style.display = 'block';
    expandResultBlockById('resultBlockAnalysis');
    renderSmartDebug(meta);
}

function buildUploadFormData(file, overrides = {}) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('tolerance', overrides.tolerance ?? toleranceInput.value);
    if (useBgColorCheckbox && useBgColorCheckbox.checked) {
        formData.append('bgcolor', bgColorInput.value);
    }
    const mode = overrides.mode ?? (removeMode ? removeMode.value : 'auto');
    const feather = overrides.feather ?? (featherInput ? featherInput.value : '1');
    const autoBg = overrides.autoBg ?? (autoBgCheckbox ? (autoBgCheckbox.checked ? '1' : '0') : '1');
    const noiseClean = overrides.noiseClean ?? (noiseCleanInput ? noiseCleanInput.value : '45');
    const fillHoles = overrides.fillHoles ?? (fillHolesInput ? fillHolesInput.value : '35');
    const edgeTrim = overrides.edgeTrim ?? (edgeTrimInput ? edgeTrimInput.value : '5');
    const presetKey = overrides.presetKey ?? (qualityPresetSelect ? qualityPresetSelect.value : 'custom');
    const defaultSmart = (smartPresetCheckbox && smartPresetCheckbox.checked && presetKey === 'auto') ? '1' : '0';
    const smartPreset = overrides.smartPreset ?? defaultSmart;

    formData.append('mode', String(mode));
    formData.append('feather', String(feather));
    formData.append('autoBg', String(autoBg));
    formData.append('noiseClean', String(noiseClean));
    formData.append('fillHoles', String(fillHoles));
    formData.append('edgeTrim', String(edgeTrim));
    formData.append('presetKey', String(presetKey));
    formData.append('smartPreset', String(smartPreset));
    return formData;
}

async function sendUploadRequest(formData, timeoutMs = 90000) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(toolUrl('upload.php'), {
            method: 'POST',
            body: formData,
            signal: controller.signal,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const rawResponse = await response.text();
        let result = null;
        try {
            result = JSON.parse(rawResponse);
        } catch (parseError) {
            if (rawResponse.trim().startsWith('<') || rawResponse.toLowerCase().includes('<html')) {
                throw new Error('SESSION_OR_ROUTING_HTML_RESPONSE');
            }
            throw new Error('INVALID_JSON_RESPONSE');
        }
        return result;
    } finally {
        window.clearTimeout(timeoutId);
    }
}

function applyProcessingResult(result) {
    lastResultMeta = result && result.meta ? result.meta : null;
    const originalSrc = toolUrl(result.original || '');
    const processedSrc = toolUrl(result.processed || '');
    const processedFile = extractFileName(result.processed || processedSrc);
    if (!processedFile) {
        throw new Error('INVALID_PROCESSED_FILE');
    }
    if (originalImageEl) originalImageEl.src = originalSrc;
    if (processedImgEl) processedImgEl.src = processedSrc;
    if (downloadBtn) {
        downloadBtn.href = toolUrl('download.php?file=' + encodeURIComponent(processedFile));
    }
    editorTools.style.display = 'flex';
    setupEditor(originalSrc, processedSrc);
    initComparisonSlider(originalSrc, processedSrc);
    applyPreviewBackgrounds();
    renderPresetInfo(result);
    focusResultFlowStep('comparison', { collapseOthers: true, persist: false, scroll: false });
    syncBgremoveState('processed', {
        meta: lastResultMeta || {},
        output: {
            original: originalSrc,
            processed: processedSrc
        }
    });
}

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

openFilePickerBtn?.addEventListener('click', () => {
    fileInput?.click();
});

qualityPresetSelect?.addEventListener('change', () => {
    const selected = qualityPresetSelect.value;
    if (selected === 'custom') return;
    applyQualityPreset(selected);
});

const presetSensitiveInputs = [removeMode, featherInput, autoBgCheckbox, noiseCleanInput, fillHolesInput, edgeTrimInput];
presetSensitiveInputs.forEach((el) => {
    if (!el) return;
    const evt = el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(evt, () => {
        syncFineControlBadges();
        setPresetByCurrentState();
    });
});

showSmartDebugCheckbox?.addEventListener('change', () => {
    renderSmartDebug(lastResultMeta);
});

function getPresetRequestOverrides(presetKey, useSmart) {
    if (useSmart) {
        return {
            presetKey: presetKey || 'auto',
            smartPreset: '1',
        };
    }
    const preset = QUALITY_PRESETS[presetKey] || QUALITY_PRESETS.auto;
    return {
        mode: preset.mode,
        feather: preset.feather,
        autoBg: preset.autoBg ? '1' : '0',
        noiseClean: preset.noiseClean,
        fillHoles: preset.fillHoles,
        edgeTrim: preset.edgeTrim,
        presetKey,
        smartPreset: '0',
    };
}

function renderPresetComparison(results) {
    if (!presetCompareGridEl) return;
    presetCompareCache = results.slice();
    if (!results.length) {
        hidePresetComparison();
        return;
    }
    const cards = results.map((item, idx) => {
        const title = item.displayLabel || getPresetLabel(item.presetKey);
        const fileName = extractFileName(item.result.processed || '');
        const downloadHref = fileName ? toolUrl('download.php?file=' + encodeURIComponent(fileName)) : '#';
        return `
            <article class="preset-compare-card">
                <h5>${title}</h5>
                <img class="preset-compare-image" src="${toolUrl(item.result.processed || '')}" alt="${title}">
                <div class="preset-compare-actions">
                    <button type="button" class="btn btn-secondary" data-compare-apply="${idx}">Usar</button>
                    <a class="btn btn-success" href="${downloadHref}" download>Baixar</a>
                </div>
            </article>
        `;
    }).join('');
    presetCompareGridEl.innerHTML = cards;
    presetCompareGridEl.style.display = 'grid';
    expandResultBlockById('resultBlockAnalysis');
}

presetCompareGridEl?.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const applyIndex = target.getAttribute('data-compare-apply');
    if (applyIndex == null) return;
    const index = Number.parseInt(applyIndex, 10);
    if (!Number.isInteger(index) || index < 0 || index >= presetCompareCache.length) return;
    const selected = presetCompareCache[index];
    if (!selected || !selected.result) return;
    if (selected.isSmart) {
        if (qualityPresetSelect) qualityPresetSelect.value = 'auto';
        if (smartPresetCheckbox) smartPresetCheckbox.checked = true;
        applyQualityPreset('auto');
    } else {
        if (smartPresetCheckbox) smartPresetCheckbox.checked = false;
        if (selected.presetKey && selected.presetKey !== 'custom') {
            applyQualityPreset(selected.presetKey);
        }
    }
    showSection('result');
    applyProcessingResult(selected.result);
});

comparePresetsBtn?.addEventListener('click', async () => {
    const file = fileInput?.files?.[0] || lastSelectedFile;
    if (!file) {
        showError('Selecione uma imagem antes de comparar presets.');
        return;
    }
    showSection('processing');
    hidePresetComparison();

    const compareTasks = [];
    if (smartPresetCheckbox && smartPresetCheckbox.checked) {
        compareTasks.push({
            presetKey: 'auto',
            displayLabel: 'Inteligente',
            isSmart: true,
            overrides: getPresetRequestOverrides('auto', true),
        });
    }
    PRESET_COMPARE_ORDER.forEach((presetKey) => {
        compareTasks.push({
            presetKey,
            displayLabel: getPresetLabel(presetKey),
            isSmart: false,
            overrides: getPresetRequestOverrides(presetKey, false),
        });
    });

    const results = [];
    try {
        for (let i = 0; i < compareTasks.length; i++) {
            const task = compareTasks[i];
            if (processingStatusEl) {
                processingStatusEl.textContent = `Comparando ${task.displayLabel} (${i + 1}/${compareTasks.length})`;
            }
            const formData = buildUploadFormData(file, task.overrides);
            const result = await sendUploadRequest(formData, 120000);
            if (result && result.redirect) {
                showError(result.message || 'Sessão expirada. Redirecionando para login...');
                setTimeout(() => {
                    window.location.href = result.redirect;
                }, 1200);
                return;
            }
            if (result && result.success) {
                results.push({
                    ...task,
                    result,
                });
            }
        }

        if (!results.length) {
            showSection('upload');
            showError('Não foi possível comparar presets nesta imagem.');
            return;
        }

        const preferred = results[0];
        showSection('result');
        applyProcessingResult(preferred.result);
        renderPresetComparison(results);
    } catch (error) {
        if (error && error.name === 'AbortError') {
            showError('Comparação demorou demais. Tente uma imagem menor.');
        } else {
            showError('Falha ao comparar presets.');
        }
        showSection('upload');
    }
});

// Processar arquivo
function handleFile(file) {
    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const lowerName = String(file.name || '').toLowerCase();
    const hasAllowedExtension = /\.(jpe?g|png)$/i.test(lowerName);
    if (!allowedTypes.includes(file.type) && !hasAllowedExtension) {
        showError('Tipo de arquivo inválido. Use JPG ou PNG.');
        return;
    }

    // Validar tamanho
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showError('Arquivo muito grande. Máximo: 10MB');
        return;
    }
    lastSelectedFile = file;
    syncBgremoveState('uploaded', {
        input: {
            name: String(file.name || ''),
            size: Number(file.size || 0),
            type: String(file.type || '')
        }
    });
    hidePresetComparison();
    uploadImage(file);
}
// Upload e processamento
async function uploadImage(file) {
    // Mostrar seção de processamento
    showSection('processing');
    hidePresetComparison();

    const formData = buildUploadFormData(file);

    try {
        const result = await sendUploadRequest(formData);

        if (result.success) {
            showSection('result');
            applyProcessingResult(result);
        } else {
            if (result.redirect) {
                showError(result.message || 'Sessão expirada. Redirecionando para login...');
                setTimeout(() => {
                    window.location.href = result.redirect;
                }, 1200);
                return;
            }
            showError(result.message);
            showSection('upload');
        }
    } catch (error) {
        if (error && error.message === 'INVALID_PROCESSED_FILE') {
            showError('Arquivo processado inválido. Tente novamente.');
            showSection('upload');
            return;
        }
        if (error && error.name === 'AbortError') {
            showError('Processamento demorou demais. Tente uma imagem menor.');
            showSection('upload');
            return;
        }
        if (error && error.message === 'SESSION_OR_ROUTING_HTML_RESPONSE') {
            showError('Sessão expirada ou rota inválida do upload. Recarregue a página e tente novamente.');
        } else if (error && error.message === 'INVALID_JSON_RESPONSE') {
            showError('Resposta inválida do servidor ao processar imagem.');
        } else {
            showError('Erro ao processar imagem. Tente novamente.');
        }
        showSection('upload');
    }
}
// Gerenciar seções
function showSection(section) {
    if (section === 'processing') {
        startProcessingFeedback();
    } else {
        stopProcessingFeedback();
    }

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
            if (typeof resultSection.scrollIntoView === 'function') {
                window.requestAnimationFrame(() => {
                    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }
            break;
    }
}

function startProcessingFeedback() {
    stopProcessingFeedback();
    processingStartedAt = Date.now();
    processingStepIndex = 0;
    renderProcessingStep();
    renderProcessingElapsed();

    processingStepsId = window.setInterval(() => {
        processingStepIndex = (processingStepIndex + 1) % PROCESSING_STEPS.length;
        renderProcessingStep();
    }, 1800);

    processingTickerId = window.setInterval(() => {
        renderProcessingElapsed();
    }, 250);

    if (processingSpinnerEl) {
        let baseAngle = 0;
        const rotateSpinner = () => {
            baseAngle = (baseAngle + 8) % 360;
            processingSpinnerEl.style.transform = `rotate(${baseAngle}deg)`;
            processingRafId = window.requestAnimationFrame(rotateSpinner);
        };
        processingRafId = window.requestAnimationFrame(rotateSpinner);
    }
}

function stopProcessingFeedback() {
    if (processingTickerId) {
        window.clearInterval(processingTickerId);
        processingTickerId = null;
    }
    if (processingStepsId) {
        window.clearInterval(processingStepsId);
        processingStepsId = null;
    }
    if (processingRafId) {
        window.cancelAnimationFrame(processingRafId);
        processingRafId = null;
    }
    if (processingSpinnerEl) {
        processingSpinnerEl.style.transform = '';
    }
}

function renderProcessingStep() {
    if (!processingStatusEl) return;
    const step = PROCESSING_STEPS[processingStepIndex] || 'Processando';
    const dots = '.'.repeat(((processingStepIndex % 3) + 1));
    processingStatusEl.textContent = `${step}${dots}`;
}

function renderProcessingElapsed() {
    if (!processingElapsedEl || !processingStartedAt) return;
    const elapsedSec = Math.max(0, Math.floor((Date.now() - processingStartedAt) / 1000));
    processingElapsedEl.textContent = `${elapsedSec}s`;
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
    lastSelectedFile = null;
    lastResultMeta = null;
    if (originalImageEl) originalImageEl.removeAttribute('src');
    if (processedImgEl) processedImgEl.removeAttribute('src');
    if (compOriginal) compOriginal.removeAttribute('src');
    if (compProcessedEl) compProcessedEl.removeAttribute('src');
    if (downloadBtn) downloadBtn.removeAttribute('href');
    if (downloadAdjustedBtn) downloadAdjustedBtn.removeAttribute('href');
    hidePresetComparison();
    hideSmartDebug();
    if (presetResultInfoEl) {
        presetResultInfoEl.style.display = 'none';
        presetResultInfoEl.textContent = '';
    }
    setActiveResultFlowButton('resultBlockComparison');
    syncBgremoveState('idle', {
        hasUpload: false,
        hasResult: false,
        hasAdjusted: false,
        input: {
            name: '',
            size: 0,
            type: ''
        },
        output: {
            original: '',
            processed: '',
            download: '',
            adjustedDownload: '',
            format: optFormat ? String(optFormat.value || 'png') : 'png'
        },
        meta: {}
    });
    showSection('upload');
}

// Inicializar
initResultBlockToggles();
showSection('upload');
hidePresetComparison();
hideSmartDebug();
syncFineControlBadges();
if (qualityPresetSelect) {
    const presetKey = qualityPresetSelect.value || 'auto';
    if (presetKey !== 'custom' && QUALITY_PRESETS[presetKey]) {
        applyQualityPreset(presetKey);
    } else {
        setPresetByCurrentState();
    }
}
applyRecommendationQueryParams();
downloadBtn?.addEventListener('click', () => {
    syncBgremoveState('exported');
});
downloadAdjustedBtn?.addEventListener('click', () => {
    syncBgremoveState('exported_adjusted');
});
openFinalFrameBtn?.addEventListener('click', () => {
    const meta = lastResultMeta && typeof lastResultMeta === 'object' ? lastResultMeta : {};
    syncBgremoveState('handoff_finalframe', {
        meta: {
            ...meta,
            handoffTarget: 'finalframe',
            handoffAt: new Date().toISOString()
        }
    });
    window.location.href = '../finalframe/';
});
resetAppBtn?.addEventListener('click', resetApp);

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
    focusResultFlowStep('adjust', { collapseOthers: false, persist: false, scroll: false });
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
    focusResultFlowStep('export', { collapseOthers: true, persist: false, scroll: true });
    syncBgremoveState('adjusted', {
        output: {
            processed: dataUrl,
            adjustedDownload: dataUrl
        }
    });
});

// ===== Optimizer =====
optimizeBtn?.addEventListener('click', async () => {
    focusResultFlowStep('adjust', { collapseOthers: false, persist: false, scroll: false });
    syncBgremoveState('optimizing');
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 90000);
    try {
        const currentProcessed = processedImgEl ? processedImgEl.src : '';
        // If using data URL, skip server optimize
        if (currentProcessed.startsWith('data:')) {
            showError('Baixe ajustado via botao dedicado (imagem no navegador).');
            return;
        }
        const fileName = extractFileName(currentProcessed);
        if (!fileName) {
            showError('Arquivo processado não identificado.');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileName);
        formData.append('format', optFormat.value);
        formData.append('quality', optQuality.value);
        if (optWidth.value) formData.append('maxWidth', optWidth.value);

        const resp = await fetch(toolUrl('optimize.php'), {
            method: 'POST',
            body: formData,
            signal: controller.signal,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const data = await resp.json();
        if (data.success) {
            const optimizedSrc = toolUrl(data.optimized);
            const optimizedFile = extractFileName(data.optimized);
            if (processedImgEl) processedImgEl.src = optimizedSrc;
            if (downloadBtn && optimizedFile) {
                downloadBtn.href = toolUrl('download.php?file=' + encodeURIComponent(optimizedFile));
            }
            if (compProcessedEl) compProcessedEl.src = optimizedSrc;
            applyPreviewBackgrounds();
            focusResultFlowStep('export', { collapseOthers: true, persist: false, scroll: true });
            syncBgremoveState('optimized', {
                output: {
                    processed: optimizedSrc,
                    format: optFormat ? String(optFormat.value || 'png') : 'png'
                }
            });
        } else {
            showError(data.message || 'Falha na otimização');
        }
    } catch (err) {
        if (err && err.name === 'AbortError') {
            showError('Otimização demorou demais. Tente largura menor.');
        } else {
            showError('Erro ao otimizar imagem');
        }
    } finally {
        window.clearTimeout(timeoutId);
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
