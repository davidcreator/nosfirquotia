const SAVED_EDITS_STORAGE_KEY = 'mockuphub_saved_edits_v1';
const REPORT_META_STORAGE_KEY = 'mockuphub_budget_report_meta_v1';
const REPORT_TTL_DAYS = 90;
const FORCE_BLOCK_COPY_AND_PRINT = true;

let currentAccessState = null;
let countdownInterval = null;
let hasShownCopyRestrictionAlert = false;

document.addEventListener('DOMContentLoaded', () => {
    bindReportEvents();
    renderReport();
});

function bindReportEvents() {
    const grid = document.getElementById('reportMockupsGrid');
    if (grid) {
        grid.addEventListener('click', handleGridClick);
        grid.addEventListener('change', handleGridChange);
    }

    document.getElementById('refreshPayloadBtn')?.addEventListener('click', refreshPayload);
    document.getElementById('copyPayloadBtn')?.addEventListener('click', copyPayload);
    document.getElementById('downloadPayloadBtn')?.addEventListener('click', downloadPayload);
    document.getElementById('printReportBtn')?.addEventListener('click', () => {
        if (isPrintBlocked()) {
            alert('Impressão/PDF bloqueados para este relatório.');
            return;
        }
        window.print();
    });
    document.getElementById('clearSavedBtn')?.addEventListener('click', clearSavedMockups);
    document.getElementById('backToEditorBtn')?.addEventListener('click', () => {
        window.location.href = './editor.php';
    });
    document.getElementById('openBrandManualBtn')?.addEventListener('click', () => {
        window.location.href = '../brandmanual/index.php';
    });

    document.addEventListener('copy', (event) => {
        if (!isCopyBlocked()) {
            return;
        }
        event.preventDefault();
        if (!hasShownCopyRestrictionAlert) {
            alert('Cópia de conteúdo bloqueada para este relatório.');
            hasShownCopyRestrictionAlert = true;
        }
    });

    document.addEventListener('cut', (event) => {
        if (!isCopyBlocked()) {
            return;
        }
        event.preventDefault();
    });

    document.addEventListener('keydown', (event) => {
        const key = String(event.key || '').toLowerCase();
        const withCtrlOrMeta = Boolean(event.ctrlKey || event.metaKey);
        if (!withCtrlOrMeta) {
            return;
        }

        if (key === 'c' && isCopyBlocked()) {
            event.preventDefault();
            return;
        }

        if (key === 'p' && isPrintBlocked()) {
            event.preventDefault();
            alert('Impressão/PDF bloqueados para este relatório.');
        }
    });
}

function getSavedMockupEdits() {
    if (typeof localStorage === 'undefined') {
        return [];
    }

    try {
        const raw = localStorage.getItem(SAVED_EDITS_STORAGE_KEY);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.filter((entry) => entry && typeof entry === 'object' && typeof entry.id === 'string');
    } catch (error) {
        return [];
    }
}

function persistSavedMockupEdits(entries) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(SAVED_EDITS_STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
        // Ignora erro de persistencia.
    }
}

function getReportMeta() {
    if (typeof localStorage === 'undefined') {
        return null;
    }
    try {
        const raw = localStorage.getItem(REPORT_META_STORAGE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
            return null;
        }
        return parsed;
    } catch (error) {
        return null;
    }
}

function persistReportMeta(meta) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(REPORT_META_STORAGE_KEY, JSON.stringify(meta));
    } catch (error) {
        // Ignora erro de persistencia.
    }
}

function ensureReportMeta(entries) {
    const now = new Date();
    const fallbackIssuedAt = deriveFallbackIssuedAt(entries);
    const existing = getReportMeta();
    const issuedAt = isValidDateString(existing?.issuedAt) ? existing.issuedAt : fallbackIssuedAt;
    const ttlDays = Number(existing?.ttlDays) > 0 ? Number(existing.ttlDays) : REPORT_TTL_DAYS;

    const meta = {
        issuedAt,
        ttlDays,
        lastViewedAt: now.toISOString(),
        updatedAt: now.toISOString()
    };
    persistReportMeta(meta);
    return meta;
}

function deriveFallbackIssuedAt(entries) {
    const oldest = entries
        .map((entry) => new Date(entry.savedAt || 0))
        .filter((date) => Number.isFinite(date.getTime()))
        .sort((a, b) => a.getTime() - b.getTime())[0];
    return (oldest || new Date()).toISOString();
}

function buildAccessState(meta) {
    const nowMs = Date.now();
    const issuedMs = new Date(meta.issuedAt).getTime();
    const ttlMs = meta.ttlDays * 24 * 60 * 60 * 1000;
    const expiresMs = issuedMs + ttlMs;
    const remainingMs = expiresMs - nowMs;

    return {
        issuedAt: new Date(issuedMs).toISOString(),
        expiresAt: new Date(expiresMs).toISOString(),
        ttlDays: meta.ttlDays,
        remainingMs,
        isExpired: remainingMs <= 0
    };
}

function renderReport() {
    const entries = getSavedMockupEdits().sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0));
    const grid = document.getElementById('reportMockupsGrid');
    const emptyState = document.getElementById('reportEmptyState');
    if (!grid || !emptyState) {
        return;
    }

    const meta = ensureReportMeta(entries);
    currentAccessState = buildAccessState(meta);
    renderValidityInfo();
    renderBrandingSummary(entries);
    applyAccessRestrictions();

    if (!entries.length) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        updateStats(entries, 0);
        refreshPayload();
        return;
    }

    emptyState.style.display = 'none';
    grid.innerHTML = entries.map((entry) => renderReportCard(entry)).join('');
    const selectedCount = getSelectedIds().size || entries.length;
    updateStats(entries, selectedCount);
    refreshPayload();
}

function renderValidityInfo() {
    const issuedAt = document.getElementById('reportIssuedAt');
    const expiresAt = document.getElementById('reportExpiresAt');
    const countdown = document.getElementById('reportCountdown');
    const notice = document.getElementById('reportRestrictionNotice');
    if (!currentAccessState) {
        return;
    }

    if (issuedAt) {
        issuedAt.textContent = formatDate(currentAccessState.issuedAt);
    }
    if (expiresAt) {
        expiresAt.textContent = formatDate(currentAccessState.expiresAt);
    }

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    const tick = () => {
        if (!countdown || !currentAccessState) {
            return;
        }
        const msLeft = new Date(currentAccessState.expiresAt).getTime() - Date.now();
        if (msLeft <= 0) {
            countdown.textContent = 'Prazo expirado';
            if (notice) {
                notice.classList.add('is-locked');
                notice.textContent = 'Prazo de 90 dias encerrado. O relatório está em modo consulta: copiar e gerar PDF/exportações estão bloqueados.';
            }
            currentAccessState.isExpired = true;
            currentAccessState.remainingMs = 0;
            applyAccessRestrictions();
            return;
        }
        countdown.textContent = formatCountdown(msLeft);
        if (notice) {
            if (FORCE_BLOCK_COPY_AND_PRINT) {
                notice.classList.add('is-locked');
                notice.textContent = `Cópia e impressão/PDF estão bloqueados. Restam ${formatCountdown(msLeft)} para expiração total do relatório.`;
            } else {
                notice.classList.remove('is-locked');
                notice.textContent = `Relatório em período ativo. Restam ${formatCountdown(msLeft)} para operações de exportação e cópia.`;
            }
        }
        currentAccessState.isExpired = false;
        currentAccessState.remainingMs = msLeft;
    };

    tick();
    countdownInterval = window.setInterval(tick, 1000);
}

function applyAccessRestrictions() {
    const readOnly = isReadOnlyExpired();
    document.body.classList.toggle('report-readonly', readOnly);
    document.body.classList.toggle('report-print-block', isPrintBlocked());

    toggleDisabled('copyPayloadBtn', isCopyBlocked());
    toggleDisabled('downloadPayloadBtn', readOnly);
    toggleDisabled('printReportBtn', isPrintBlocked());
    toggleDisabled('clearSavedBtn', readOnly);

    document.querySelectorAll('.report-include, .report-remove').forEach((element) => {
        element.disabled = readOnly;
    });
}

function renderBrandingSummary(entries) {
    const paletteTarget = document.getElementById('reportBrandPalette');
    const typographyTarget = document.getElementById('reportTypographySummary');
    if (!paletteTarget || !typographyTarget) {
        return;
    }

    const integration = getIntegrationContext(entries);
    const colors = integration.colors;
    const typography = integration.typography;

    if (!colors.length) {
        paletteTarget.innerHTML = '<p class="report-card-meta">Sem cores sincronizadas ainda.</p>';
    } else {
        paletteTarget.innerHTML = colors.map((item) => `
            <article class="report-color-item">
                <div class="report-color-swatch" data-swatch-color="${escapeHtml(item.hex)}"></div>
                <div class="report-color-meta">
                    <strong>${escapeHtml(item.role)}</strong>
                    <span>${escapeHtml(item.hex)}</span>
                </div>
            </article>
        `).join('');
        applyPaletteSwatchColors(paletteTarget);
    }

    const primaryFont = typography.primaryFontName || typography.fontName || 'Não definido';
    const secondaryFont = typography.secondaryFontName || typography.secondary || 'Não definido';
    const tone = typography.tone || typography.pairingStyle || 'Não definido';
    const source = typography.source || integration.source || 'sistema';

    typographyTarget.innerHTML = `
        <article class="report-typography-line">
            <small>Fonte principal</small>
            <strong>${escapeHtml(primaryFont)}</strong>
        </article>
        <article class="report-typography-line">
            <small>Fonte secundária</small>
            <strong>${escapeHtml(secondaryFont)}</strong>
        </article>
        <article class="report-typography-line">
            <small>Perfil tipografico</small>
            <strong>${escapeHtml(tone)}</strong>
        </article>
        <article class="report-typography-line">
            <small>Origem da sincronização</small>
            <strong>${escapeHtml(source)}</strong>
        </article>
    `;
}

function applyPaletteSwatchColors(root) {
    if (!root) {
        return;
    }

    root.querySelectorAll('[data-swatch-color]').forEach((element) => {
        const color = String(element.getAttribute('data-swatch-color') || '').trim();
        if (color !== '') {
            element.style.background = color;
        }
    });
}

function getIntegrationContext(entries) {
    const api = window.AQBrandKit;
    if (api?.getIntegrationSnapshot) {
        const snapshot = api.getIntegrationSnapshot();
        const brandKit = snapshot?.brandKit || {};
        const brandColors = brandKit.brandColors || {};
        const palette = brandKit.palette || snapshot?.colorPalette || {};
        const typography = brandKit.typography || snapshot?.fontProfile || {};

        const colors = api.uniqueColors([
            brandColors.primary,
            brandColors.secondary,
            brandColors.accent,
            brandColors.neutral,
            ...(Array.isArray(palette.colors) ? palette.colors : [])
        ]).slice(0, 6);

        return {
            colors: colors.map((hex, index) => ({
                role: ['Primária', 'Secundária', 'Acento', 'Neutra', 'Apoio 1', 'Apoio 2'][index] || `Apoio ${index - 1}`,
                hex
            })),
            typography,
            source: brandKit.source || snapshot?.fontProfile?.source || snapshot?.colorPalette?.source || 'sistema'
        };
    }

    const latestEntry = entries[0] || {};
    const fallbackColors = [];
    const branding = latestEntry.branding || {};
    if (branding.colors?.primary) fallbackColors.push({ role: 'Primária', hex: branding.colors.primary });
    if (branding.colors?.secondary) fallbackColors.push({ role: 'Secundária', hex: branding.colors.secondary });
    if (branding.colors?.text) fallbackColors.push({ role: 'Texto', hex: branding.colors.text });

    return {
        colors: fallbackColors,
        typography: {
            primaryFontName: branding.typography?.fontName || 'Não definido',
            secondaryFontName: branding.typography?.fontName || 'Não definido',
            source: 'mockups'
        },
        source: 'mockups'
    };
}

function renderReportCard(entry) {
    const title = escapeHtml(entry.title || 'Mockup salvo');
    const category = escapeHtml(entry.categoryLabel || entry.category || 'Categoria');
    const orientation = escapeHtml(entry.orientation || '-');
    const quality = escapeHtml(entry.quality || '-');
    const savedAt = formatDate(entry.savedAt);
    const fileInfo = formatImageInfo(entry.imageMeta);
    const preview = String(entry.previewDataUrl || '').startsWith('data:image/')
        ? entry.previewDataUrl
        : '';
    const checked = 'checked';
    const lockAttr = isReadOnlyExpired() ? 'disabled' : '';

    return `
        <article class="report-card" data-id="${escapeHtml(entry.id)}">
            <div class="report-card-media">
                ${preview ? `<img src="${preview}" alt="${title}">` : '<div class="report-card-placeholder">Sem preview</div>'}
            </div>
            <div class="report-card-content">
                <h4>${title}</h4>
                <p>${category} | ${orientation} | ${quality}</p>
                <p class="report-card-meta">${savedAt}${fileInfo ? ` | ${escapeHtml(fileInfo)}` : ''}</p>
                <div class="report-card-actions">
                    <label class="control-check">
                        <input type="checkbox" class="report-include" data-id="${escapeHtml(entry.id)}" ${checked} ${lockAttr}>
                        Incluir no relatório
                    </label>
                    <button type="button" class="btn-secondary report-remove" data-id="${escapeHtml(entry.id)}" ${lockAttr}>
                        <i class="fas fa-trash"></i>
                        Remover
                    </button>
                </div>
            </div>
        </article>
    `;
}

function handleGridClick(event) {
    if (isReadOnlyExpired()) {
        return;
    }

    const removeBtn = event.target.closest('.report-remove');
    if (!removeBtn) {
        return;
    }

    const id = removeBtn.dataset.id;
    if (!id) {
        return;
    }

    const current = getSavedMockupEdits();
    const next = current.filter((item) => item.id !== id);
    persistSavedMockupEdits(next);
    renderReport();
}

function handleGridChange(event) {
    if (isReadOnlyExpired()) {
        return;
    }

    const checkbox = event.target.closest('.report-include');
    if (!checkbox) {
        return;
    }
    refreshPayload();
    const entries = getSavedMockupEdits();
    updateStats(entries, getSelectedIds().size);
}

function clearSavedMockups() {
    if (isReadOnlyExpired()) {
        alert('Prazo expirado. O relatório está em modo consulta e não permite limpeza dos registros.');
        return;
    }

    const confirmed = window.confirm('Deseja realmente limpar todos os mockups salvos para relatório?');
    if (!confirmed) {
        return;
    }

    persistSavedMockupEdits([]);
    renderReport();
}

function getSelectedIds() {
    const checks = Array.from(document.querySelectorAll('.report-include:checked'));
    return new Set(checks.map((input) => input.dataset.id).filter(Boolean));
}

function getSelectedEntries(includePreviewData = false) {
    const entries = getSavedMockupEdits();
    const selectedIds = getSelectedIds();
    const activeIds = selectedIds.size ? selectedIds : new Set(entries.map((entry) => entry.id));

    return entries
        .filter((entry) => activeIds.has(entry.id))
        .map((entry) => {
            const payloadEntry = {
                id: entry.id,
                mockupId: entry.mockupId,
                title: entry.title,
                category: entry.category,
                categoryLabel: entry.categoryLabel,
                orientation: entry.orientation,
                quality: entry.quality,
                savedAt: entry.savedAt,
                imageMeta: entry.imageMeta || null,
                branding: entry.branding || null
            };
            if (includePreviewData) {
                payloadEntry.previewDataUrl = entry.previewDataUrl || null;
            }
            return payloadEntry;
        });
}

function buildReportPayload(includePreviewData = false) {
    const selected = getSelectedEntries(includePreviewData);
    const integration = getIntegrationContext(selected);
    return {
        generatedAt: new Date().toISOString(),
        totalItems: selected.length,
        source: 'mockuphub_report',
        validity: currentAccessState ? {
            issuedAt: currentAccessState.issuedAt,
            expiresAt: currentAccessState.expiresAt,
            ttlDays: currentAccessState.ttlDays,
            readOnly: currentAccessState.isExpired
        } : null,
        branding: {
            colors: integration.colors,
            typography: integration.typography,
            source: integration.source
        },
        items: selected
    };
}

function refreshPayload() {
    const field = document.getElementById('reportPayload');
    if (!field) {
        return;
    }
    const payload = buildReportPayload(false);
    field.value = JSON.stringify(payload, null, 2);
}

async function copyPayload() {
    if (isCopyBlocked()) {
        alert('Cópia do relatório foi desativada.');
        return;
    }

    const field = document.getElementById('reportPayload');
    if (!field || !field.value) {
        return;
    }

    try {
        await navigator.clipboard.writeText(field.value);
        alert('Resumo copiado para a área de transferência.');
    } catch (error) {
        field.select();
        document.execCommand('copy');
        alert('Resumo copiado.');
    }
}

function downloadPayload() {
    if (isReadOnlyExpired()) {
        alert('Prazo expirado. Exportação foi desativada para este relatório.');
        return;
    }

    const payload = buildReportPayload(true);
    if (!payload.items.length) {
        alert('Selecione ao menos um mockup para baixar o relatório.');
        return;
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatório-mockups-orçamento-${formatDateForFile(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function updateStats(entries, selectedCount) {
    const totalEl = document.getElementById('reportTotalSaved');
    const selectedEl = document.getElementById('reportSelectedCount');
    const updatedEl = document.getElementById('reportUpdatedAt');
    if (totalEl) {
        totalEl.textContent = String(entries.length);
    }
    if (selectedEl) {
        selectedEl.textContent = String(selectedCount);
    }
    if (updatedEl) {
        const newest = entries
            .map((entry) => new Date(entry.savedAt || 0))
            .filter((date) => Number.isFinite(date.getTime()))
            .sort((a, b) => b.getTime() - a.getTime())[0];
        updatedEl.textContent = newest ? formatDate(newest.toISOString()) : '-';
    }
}

function formatDate(raw) {
    const date = new Date(raw);
    if (!Number.isFinite(date.getTime())) {
        return '-';
    }
    return date.toLocaleString('pt-BR');
}

function formatDateForFile(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}-${hour}${minute}`;
}

function formatImageInfo(meta) {
    if (!meta || typeof meta !== 'object') {
        return '';
    }
    const name = typeof meta.name === 'string' ? meta.name : '';
    const size = Number(meta.size || 0);
    const sizeLabel = size > 0 ? `${(size / (1024 * 1024)).toFixed(2)} MB` : '';
    if (name && sizeLabel) {
        return `${name} (${sizeLabel})`;
    }
    return name || sizeLabel;
}

function formatCountdown(milliseconds) {
    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

function isReadOnlyExpired() {
    return Boolean(currentAccessState?.isExpired);
}

function isCopyBlocked() {
    return FORCE_BLOCK_COPY_AND_PRINT || isReadOnlyExpired();
}

function isPrintBlocked() {
    return FORCE_BLOCK_COPY_AND_PRINT || isReadOnlyExpired();
}

function toggleDisabled(id, shouldDisable) {
    const element = document.getElementById(id);
    if (element) {
        element.disabled = shouldDisable;
    }
}

function isValidDateString(value) {
    const date = new Date(value);
    return Number.isFinite(date.getTime());
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
