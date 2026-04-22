const SAVED_EDITS_STORAGE_KEY = 'mockuphub_saved_edits_v1';
const WORK_INFO_STORAGE_KEY = 'mockuphub_work_info_v1';
const OG_SETTINGS_STORAGE_KEY = 'ogImageSettings';
const BRAND_MANUAL_CACHE_KEY = 'brand_manual_mvp_latest_v1';
const BRAND_MANUAL_TEMPLATE_KEY = 'brand_manual_mvp_template_v1';
const DEFAULT_TEMPLATE_ID = 'mono_arc';

const COLOR_ROLE_LABELS = ['Primaria', 'Secundaria', 'Acento', 'Neutra', 'Apoio 1', 'Apoio 2', 'Apoio 3'];

const BRANDBOOK_PAGE_STRUCTURE = [
    { id: 'cover', label: 'Capa' },
    { id: 'index', label: 'Indice' },
    { id: 'palette', label: 'Paleta de Cores' },
    { id: 'typography', label: 'Tipografia' },
    { id: 'logo_system', label: 'Sistema de Logo' },
    { id: 'mockups', label: 'Aplicacoes' },
    { id: 'digital', label: 'Diretriz Digital' },
    { id: 'closing', label: 'Encerramento' }
];

const TEMPLATE_PRESETS = {
    mono_arc: {
        id: 'mono_arc',
        name: 'Monochrome Arc',
        themeClass: 'theme-mono',
        kicker: 'Brand Guidelines',
        fallbackPalette: ['#0f1117', '#f8fafc', '#d1d5db', '#6b7280', '#111827', '#9ca3af'],
        closing: 'Obrigado por construir com a gente.'
    },
    cobalt_grid: {
        id: 'cobalt_grid',
        name: 'Cobalt Grid',
        themeClass: 'theme-cobalt',
        kicker: 'Corporate Brandbook',
        fallbackPalette: ['#213fa9', '#f8fbff', '#1f2b45', '#4f6fca', '#8da5f1', '#dfe7ff'],
        closing: 'Obrigado por confiar no processo criativo.'
    },
    crimson_blob: {
        id: 'crimson_blob',
        name: 'Crimson Blob',
        themeClass: 'theme-crimson',
        kicker: 'Expressive Brand Guide',
        fallbackPalette: ['#cf132f', '#1f2a44', '#f9fbff', '#f04a61', '#f6b7c1', '#64748b'],
        closing: 'Obrigado por impulsionar uma marca marcante.'
    }
};

let currentContext = {
    payload: null,
    displayMockups: [],
    activeTemplateId: DEFAULT_TEMPLATE_ID,
    brandbookSheets: []
};

document.addEventListener('DOMContentLoaded', () => {
    restoreTemplateSelection();
    bindEvents();
    refreshManual();
});

function bindEvents() {
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        refreshManual();
    });

    document.getElementById('copyBtn')?.addEventListener('click', async () => {
        const field = document.getElementById('manualPayload');
        if (!field || !field.value) {
            setStatus('Nao ha payload para copiar.', 'warn');
            return;
        }
        try {
            await navigator.clipboard.writeText(field.value);
            setStatus('Payload copiado para a area de transferencia.', 'ok');
        } catch (error) {
            field.select();
            document.execCommand('copy');
            setStatus('Payload copiado com fallback.', 'ok');
        }
    });

    document.getElementById('downloadJsonBtn')?.addEventListener('click', () => {
        if (!currentContext.payload) {
            setStatus('Gere o manual antes de exportar.', 'warn');
            return;
        }
        const content = JSON.stringify(currentContext.payload, null, 2);
        downloadText(
            content,
            `manual-marca-mvp-${formatDateForFile(new Date())}.json`,
            'application/json;charset=utf-8'
        );
        setStatus('JSON exportado com sucesso.', 'ok');
    });

    document.getElementById('downloadPdfBtn')?.addEventListener('click', () => {
        exportPdfSummary();
    });

    document.getElementById('printTemplateBtn')?.addEventListener('click', () => {
        printTemplateBrandbook();
    });

    document.getElementById('downloadTemplateHtmlBtn')?.addEventListener('click', () => {
        exportBrandbookHtml();
    });

    document.getElementById('templateGrid')?.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        const card = target.closest('.template-card[data-template-id]');
        if (!(card instanceof HTMLElement)) {
            return;
        }

        const templateId = card.dataset.templateId || DEFAULT_TEMPLATE_ID;
        setActiveTemplate(templateId, {
            persist: true,
            rerender: true,
            announce: true
        });
    });
}

function restoreTemplateSelection() {
    let templateId = DEFAULT_TEMPLATE_ID;
    if (typeof localStorage !== 'undefined') {
        try {
            const stored = String(localStorage.getItem(BRAND_MANUAL_TEMPLATE_KEY) || '');
            if (Object.prototype.hasOwnProperty.call(TEMPLATE_PRESETS, stored)) {
                templateId = stored;
            }
        } catch (error) {
            templateId = DEFAULT_TEMPLATE_ID;
        }
    }

    setActiveTemplate(templateId, {
        persist: false,
        rerender: false,
        announce: false
    });
}

function setActiveTemplate(templateId, options = {}) {
    const settings = {
        persist: true,
        rerender: true,
        announce: false,
        ...options
    };

    const preset = getTemplatePreset(templateId);
    currentContext.activeTemplateId = preset.id;

    updateTemplateCardState(preset.id);
    setText('activeTemplateBadge', `Template ativo: ${preset.name}`);

    if (settings.persist && typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(BRAND_MANUAL_TEMPLATE_KEY, preset.id);
        } catch (error) {
            // Sem bloqueio: a tela continua funcional mesmo sem localStorage.
        }
    }

    if (settings.rerender && currentContext.payload) {
        const sheets = renderBrandbook(currentContext.payload, currentContext.displayMockups, preset.id);
        applyTemplateMetadata(currentContext.payload, preset, sheets.length);
        persistLatestManualPayload(currentContext.payload);
        renderPayload(currentContext.payload);

        if (settings.announce) {
            setStatus(`Template ${preset.name} aplicado ao brandbook.`, 'ok');
        }
    }
}

function getTemplatePreset(templateId) {
    if (Object.prototype.hasOwnProperty.call(TEMPLATE_PRESETS, templateId)) {
        return TEMPLATE_PRESETS[templateId];
    }
    return TEMPLATE_PRESETS[DEFAULT_TEMPLATE_ID];
}

function updateTemplateCardState(activeTemplateId) {
    const cards = document.querySelectorAll('.template-card[data-template-id]');
    cards.forEach((card) => {
        if (!(card instanceof HTMLElement)) {
            return;
        }

        const isActive = card.dataset.templateId === activeTemplateId;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
}

function refreshManual() {
    const context = createManualContext();
    currentContext.payload = context.payload;
    currentContext.displayMockups = context.displayMockups;

    renderSummary(context.payload, context.displayMockups);
    renderProject(context.payload.identity.project);
    renderPalette(context.payload.identity.colors);
    renderTypography(context.payload.identity.typography);
    renderOg(context.payload.applications.digital.og);
    renderMockups(context.displayMockups);
    renderNotes(context.payload.integrationNotes || []);

    const preset = getTemplatePreset(currentContext.activeTemplateId);
    const sheets = renderBrandbook(context.payload, context.displayMockups, preset.id);
    applyTemplateMetadata(context.payload, preset, sheets.length);

    persistLatestManualPayload(context.payload);
    renderPayload(context.payload);

    const issues = context.payload.integrationNotes.filter((note) => note.level === 'warn').length;
    if (issues > 0) {
        setStatus(`Manual atualizado com ${issues} alerta(s) de integracao.`, 'warn');
        return;
    }
    setStatus('Manual consolidado com sucesso.', 'ok');
}

function applyTemplateMetadata(payload, preset, generatedSheets) {
    if (!payload || typeof payload !== 'object') {
        return;
    }

    payload.template = {
        id: preset.id,
        name: preset.name,
        themeClass: preset.themeClass,
        generatedSheets: Number.isFinite(generatedSheets) ? generatedSheets : 0,
        structure: BRANDBOOK_PAGE_STRUCTURE.map((item, index) => ({
            id: item.id,
            label: item.label,
            page: index + 1
        }))
    };
}

function renderBrandbook(payload, displayMockups, templateId) {
    const target = document.getElementById('brandbookPreview');
    if (!target) {
        return [];
    }

    if (!payload || typeof payload !== 'object') {
        target.innerHTML = '<p class="muted">Sem payload consolidado para gerar o brandbook.</p>';
        return [];
    }

    const preset = getTemplatePreset(templateId);
    const sheets = createBrandbookSheets(payload, displayMockups, preset);
    const totalPages = sheets.length;

    target.innerHTML = sheets
        .map((sheet, index) => renderBrandbookSheet(sheet, preset, index + 1, totalPages))
        .join('');

    const panelBadge = document.querySelector('#brandbookPanel .panel-header .meta-tag');
    if (panelBadge) {
        panelBadge.textContent = `${totalPages} paginas geradas`;
    }

    currentContext.brandbookSheets = sheets;
    return sheets;
}

function createBrandbookSheets(payload, displayMockups, preset) {
    const project = payload?.identity?.project || {};
    const colors = resolveTemplateColors(payload?.identity?.colors, preset);
    const typography = payload?.identity?.typography || {};
    const og = payload?.applications?.digital?.og || {};
    const notes = Array.isArray(payload?.integrationNotes) ? payload.integrationNotes : [];

    const normalizedTag = normalizeTag(project.mainTag);
    const supportTags = Array.isArray(project.supportingTags)
        ? project.supportingTags.map((tag) => normalizeTag(tag)).filter(Boolean)
        : [];

    const selectedMockups = Array.isArray(displayMockups) ? displayMockups.slice(0, 6) : [];
    const totalMockups = Array.isArray(displayMockups) ? displayMockups.length : 0;

    const indexRows = BRANDBOOK_PAGE_STRUCTURE.map((item, index) => (
        `<span>${escapeHtml(item.label)}</span><strong>${String(index + 1).padStart(2, '0')}</strong>`
    )).join('');

    const coverSubtitle = supportTags.length
        ? supportTags.join(' | ')
        : '#identidade | #brandbook | #manual';

    return [
        {
            id: 'cover',
            label: 'Capa',
            kicker: preset.kicker,
            title: project.title || 'Projeto sem titulo',
            text: project.description || 'Manual de marca consolidado para uso interno e aprovacao.',
            contentHtml: `
                <div class="sheet-duo">
                    <article class="sheet-box">
                        <small>Tag principal</small>
                        <p class="sheet-text">${escapeHtml(normalizedTag || '#brand')}</p>
                    </article>
                    <article class="sheet-box">
                        <small>Template</small>
                        <p class="sheet-text">${escapeHtml(preset.name)}</p>
                    </article>
                </div>
                <p class="sheet-text">${escapeHtml(coverSubtitle)}</p>
            `
        },
        {
            id: 'index',
            label: 'Indice',
            kicker: 'Estrutura do Manual',
            title: 'Indice de Paginas',
            text: 'Sequencia pronta para revisao e apresentacao rapida de brandbook.',
            contentHtml: `
                <div class="sheet-index-grid">
                    ${indexRows}
                </div>
            `
        },
        {
            id: 'palette',
            label: 'Paleta',
            kicker: 'Sistema de Cores',
            title: 'Color Palette',
            text: 'Cores principais e de apoio para identidade visual consistente.',
            contentHtml: `
                <div class="sheet-color-grid">
                    ${buildSheetColorItems(colors)}
                </div>
            `
        },
        {
            id: 'typography',
            label: 'Tipografia',
            kicker: 'Sistema Tipografico',
            title: 'Typography',
            text: 'Combinacao principal definida para titulos, textos e elementos de apoio.',
            contentHtml: `
                <div class="sheet-duo">
                    <article class="sheet-font-card">
                        <small>Fonte principal</small>
                        <div class="sheet-font-name">${escapeHtml(typography.primaryFontName || 'Nao definido')}</div>
                        <p class="sheet-text">Uso recomendado para titulos e destaques.</p>
                    </article>
                    <article class="sheet-font-card">
                        <small>Fonte secundaria</small>
                        <div class="sheet-font-name">${escapeHtml(typography.secondaryFontName || 'Nao definido')}</div>
                        <p class="sheet-text">Uso recomendado para textos corridos e informativos.</p>
                    </article>
                </div>
                <article class="sheet-box">
                    <small>Pairing e tom</small>
                    <p class="sheet-text">Pairing: ${escapeHtml(typography.pairingStyle || 'Nao definido')}</p>
                    <p class="sheet-text">Tom: ${escapeHtml(typography.tone || 'Nao definido')}</p>
                </article>
            `
        },
        {
            id: 'logo_system',
            label: 'Logo',
            kicker: 'Regras de Marca',
            title: 'Logo System',
            text: 'Parametros para uso consistente do logotipo nas principais aplicacoes.',
            contentHtml: `
                <div class="sheet-duo">
                    <article class="sheet-box">
                        <small>Area de protecao</small>
                        <p class="sheet-text">Manter respiro minimo proporcional a altura do simbolo.</p>
                    </article>
                    <article class="sheet-box">
                        <small>Tamanho minimo</small>
                        <p class="sheet-text">Aplicacao digital sugerida com no minimo 32px de altura.</p>
                    </article>
                </div>
                <ul class="sheet-list">
                    <li>Evitar distorcoes, rotacoes e alteracoes de proporcao.</li>
                    <li>Preservar contraste sobre fundos claros e escuros.</li>
                    <li>Usar variacoes cromaticas aprovadas no sistema de cores.</li>
                </ul>
            `
        },
        {
            id: 'mockups',
            label: 'Aplicacoes',
            kicker: 'Mockups Consolidados',
            title: 'Aplicacoes Visuais',
            text: totalMockups > 0
                ? `${totalMockups} mockup(s) localizado(s) na sessao atual.`
                : 'Nenhum mockup salvo na sessao atual.',
            contentHtml: `
                <div class="sheet-mock-grid">
                    ${buildSheetMockCells(selectedMockups)}
                </div>
            `
        },
        {
            id: 'digital',
            label: 'Digital',
            kicker: 'Diretriz Online',
            title: 'Open Graph e Social',
            text: og.available
                ? 'Parametros de OG consolidados para publicacoes e compartilhamentos.'
                : 'Diretriz OG nao encontrada nesta sessao.',
            contentHtml: `
                <div class="sheet-duo">
                    <article class="sheet-box">
                        <small>Status OG</small>
                        <p class="sheet-text">${escapeHtml(og.available ? 'Configurado' : 'Pendente')}</p>
                        <p class="sheet-text">Template: ${escapeHtml(og.template || 'Nao definido')}</p>
                        <p class="sheet-text">Marca: ${escapeHtml(og.brand || 'Nao definido')}</p>
                    </article>
                    <article class="sheet-box">
                        <small>Paleta Digital</small>
                        <div class="sheet-color-grid">
                            ${buildSheetColorItems(resolveDigitalColors(og, colors))}
                        </div>
                    </article>
                </div>
                <ul class="sheet-list">
                    ${buildSheetNotes(notes)}
                </ul>
            `
        },
        {
            id: 'closing',
            label: 'Encerramento',
            kicker: 'Resumo Final',
            title: 'Thank You',
            text: preset.closing,
            contentHtml: `
                <article class="sheet-box">
                    <small>Metadados do MVP</small>
                    <p class="sheet-text">Schema: ${escapeHtml(payload.schema || 'brand_manual_mvp_v1')}</p>
                    <p class="sheet-text">Gerado em: ${escapeHtml(formatDate(payload.generatedAt))}</p>
                    <p class="sheet-text">Template: ${escapeHtml(preset.name)}</p>
                </article>
            `
        }
    ];
}

function renderBrandbookSheet(sheet, preset, pageNumber, pageTotal) {
    return `
        <article class="brandbook-sheet ${escapeHtml(preset.themeClass)}" data-sheet-id="${escapeHtml(sheet.id)}">
            <header class="sheet-header">
                <span>${escapeHtml(sheet.label)}</span>
                <span>${String(pageNumber).padStart(2, '0')}/${String(pageTotal).padStart(2, '0')}</span>
            </header>
            <div class="sheet-body">
                <p class="sheet-kicker">${escapeHtml(sheet.kicker)}</p>
                <h3 class="sheet-title">${escapeHtml(sheet.title)}</h3>
                <p class="sheet-text">${escapeHtml(sheet.text)}</p>
                ${sheet.contentHtml || ''}
            </div>
        </article>
    `;
}

function buildSheetColorItems(colors) {
    if (!Array.isArray(colors) || !colors.length) {
        return '<article class="sheet-color-item"><div class="sheet-color-meta"><strong>Sem cores</strong><small>Configure no Brand Kit</small></div></article>';
    }

    return colors.slice(0, 6).map((color) => `
        <article class="sheet-color-item">
            <div class="sheet-color-swatch" style="background:${escapeHtml(color.hex)}"></div>
            <div class="sheet-color-meta">
                <strong>${escapeHtml(color.role || 'Cor')}</strong>
                <small>${escapeHtml(color.hex || '-')}</small>
            </div>
        </article>
    `).join('');
}

function buildSheetMockCells(mockups) {
    if (!Array.isArray(mockups) || !mockups.length) {
        return Array.from({ length: 6 }).map((_, index) => `
            <article class="sheet-mock-cell">
                <span>Mockup ${index + 1}<br>Sem preview</span>
            </article>
        `).join('');
    }

    const filled = mockups.map((item) => {
        if (item.hasPreview && item.previewDataUrl) {
            return `
                <article class="sheet-mock-cell">
                    <img src="${escapeHtml(item.previewDataUrl)}" alt="${escapeHtml(item.title || 'Mockup')}" />
                </article>
            `;
        }

        return `
            <article class="sheet-mock-cell">
                <span>${escapeHtml((item.title || 'Mockup sem preview').slice(0, 54))}</span>
            </article>
        `;
    });

    while (filled.length < 6) {
        filled.push(`
            <article class="sheet-mock-cell">
                <span>Slot livre</span>
            </article>
        `);
    }

    return filled.slice(0, 6).join('');
}

function buildSheetNotes(notes) {
    if (!Array.isArray(notes) || !notes.length) {
        return '<li>Sem observacoes adicionais.</li>';
    }

    return notes.slice(0, 3).map((note) => `<li>${escapeHtml(note.message || '')}</li>`).join('');
}

function resolveDigitalColors(og, fallbackColors) {
    const resolved = [];

    if (og && og.available) {
        const primary = normalizeHex(og.primaryColor, '');
        const secondary = normalizeHex(og.secondaryColor, '');
        if (primary) {
            resolved.push({ role: 'OG Primaria', hex: primary });
        }
        if (secondary) {
            resolved.push({ role: 'OG Secundaria', hex: secondary });
        }
    }

    const fallback = Array.isArray(fallbackColors) ? fallbackColors : [];
    fallback.forEach((item) => {
        if (!item || !item.hex) {
            return;
        }
        if (resolved.some((entry) => entry.hex === item.hex)) {
            return;
        }
        resolved.push({ role: item.role || 'Apoio', hex: item.hex });
    });

    return resolved.slice(0, 3);
}

function resolveTemplateColors(colors, preset) {
    const valid = Array.isArray(colors)
        ? colors
            .filter((item) => item && typeof item === 'object')
            .map((item) => ({
                role: String(item.role || 'Cor').slice(0, 32),
                hex: normalizeHex(item.hex, '')
            }))
            .filter((item) => item.hex)
        : [];

    if (valid.length) {
        return valid.slice(0, 6);
    }

    return preset.fallbackPalette.map((hex, index) => ({
        role: COLOR_ROLE_LABELS[index] || `Apoio ${index + 1}`,
        hex
    }));
}

function normalizeTag(tag) {
    const clean = String(tag || '').trim();
    if (!clean) {
        return '';
    }
    if (clean.startsWith('#')) {
        return clean;
    }
    return `#${clean}`;
}

function printTemplateBrandbook() {
    if (!currentContext.brandbookSheets.length) {
        setStatus('Nao ha paginas de brandbook para imprimir.', 'warn');
        return;
    }

    window.print();
    setStatus('Modo de impressao aberto para o brandbook.', 'ok');
}

function exportBrandbookHtml() {
    if (!currentContext.payload || !currentContext.brandbookSheets.length) {
        setStatus('Gere o brandbook antes de exportar HTML.', 'warn');
        return;
    }

    const preset = getTemplatePreset(currentContext.activeTemplateId);
    const totalPages = currentContext.brandbookSheets.length;
    const sheetsHtml = currentContext.brandbookSheets
        .map((sheet, index) => renderBrandbookSheet(sheet, preset, index + 1, totalPages))
        .join('');

    const html = buildStandaloneBrandbookHtml({
        title: currentContext.payload?.identity?.project?.title || 'Brandbook',
        templateName: preset.name,
        generatedAt: currentContext.payload.generatedAt,
        sheetsHtml
    });

    downloadText(
        html,
        `brandbook-template-${preset.id}-${formatDateForFile(new Date())}.html`,
        'text/html;charset=utf-8'
    );

    setStatus('HTML standalone do brandbook exportado com sucesso.', 'ok');
}

function buildStandaloneBrandbookHtml(context) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(context.title)} - Brandbook MVP</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>${getStandaloneBrandbookCss()}</style>
</head>
<body>
    <header class="export-header">
        <h1>${escapeHtml(context.title)}</h1>
        <p>Template: ${escapeHtml(context.templateName)} | Gerado em: ${escapeHtml(formatDate(context.generatedAt))}</p>
    </header>
    <section class="brandbook-preview">
        ${context.sheetsHtml}
    </section>
</body>
</html>`;
}

function getStandaloneBrandbookCss() {
    return `
        * { box-sizing: border-box; }
        body {
            margin: 0;
            padding: 24px;
            background: #eef2ff;
            color: #101828;
            font-family: "Sora", "Segoe UI", Arial, sans-serif;
        }
        .export-header {
            margin-bottom: 16px;
            padding: 14px 16px;
            border-radius: 12px;
            background: #ffffff;
            border: 1px solid #dbe5f4;
        }
        .export-header h1 {
            margin: 0;
            font: 700 1.5rem "Fraunces", "Georgia", serif;
        }
        .export-header p {
            margin: 8px 0 0;
            font-size: 0.88rem;
            color: #475467;
        }
        .brandbook-preview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 12px;
        }
        .brandbook-sheet {
            position: relative;
            border-radius: 14px;
            overflow: hidden;
            border: 1px solid rgba(15, 23, 42, 0.15);
            box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
            aspect-ratio: 16 / 10;
            display: grid;
            grid-template-rows: auto 1fr;
        }
        .sheet-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;
            font-size: 0.69rem;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            position: relative;
            z-index: 2;
        }
        .sheet-body {
            position: relative;
            z-index: 2;
            padding: 18px 16px 14px;
            display: grid;
            gap: 10px;
            align-content: start;
        }
        .sheet-kicker {
            margin: 0;
            font-size: 0.73rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            opacity: 0.8;
        }
        .sheet-title {
            margin: 0;
            font: 700 1.35rem/1.1 "Fraunces", "Georgia", serif;
        }
        .sheet-text {
            margin: 0;
            font-size: 0.82rem;
            line-height: 1.45;
        }
        .sheet-list {
            margin: 0;
            padding-left: 18px;
            display: grid;
            gap: 4px;
            font-size: 0.78rem;
        }
        .sheet-duo {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
        }
        .sheet-box {
            border: 1px solid currentColor;
            border-radius: 10px;
            padding: 8px;
            min-height: 72px;
            opacity: 0.9;
        }
        .sheet-color-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
        }
        .sheet-color-item {
            border: 1px solid currentColor;
            border-radius: 10px;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.08);
        }
        .sheet-color-swatch {
            height: 54px;
        }
        .sheet-color-meta {
            padding: 6px;
            display: grid;
            gap: 2px;
            font-size: 0.72rem;
        }
        .sheet-font-card {
            border: 1px solid currentColor;
            border-radius: 10px;
            padding: 9px;
            background: rgba(255, 255, 255, 0.06);
            display: grid;
            gap: 4px;
        }
        .sheet-font-name {
            font-size: 0.95rem;
            font-weight: 700;
        }
        .sheet-mock-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 7px;
        }
        .sheet-mock-cell {
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid currentColor;
            min-height: 70px;
            background: rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .sheet-mock-cell img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .sheet-mock-cell span {
            font-size: 0.69rem;
            opacity: 0.74;
            padding: 8px;
            text-align: center;
        }
        .sheet-index-grid {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 4px 8px;
            font-size: 0.78rem;
        }
        .brandbook-sheet.theme-mono {
            color: #f8fafc;
            background: #0f1117;
        }
        .brandbook-sheet.theme-mono::before,
        .brandbook-sheet.theme-mono::after {
            content: "";
            position: absolute;
            border-radius: 999px;
            z-index: 1;
        }
        .brandbook-sheet.theme-mono::before {
            width: 132px;
            height: 132px;
            background: rgba(248, 250, 252, 0.95);
            right: -36px;
            top: -36px;
        }
        .brandbook-sheet.theme-mono::after {
            width: 52px;
            height: 52px;
            background: rgba(248, 250, 252, 0.92);
            left: -16px;
            bottom: -16px;
        }
        .brandbook-sheet.theme-cobalt {
            color: #f8fbff;
            background: linear-gradient(180deg, #213fa9 0%, #213fa9 53%, #f8fbff 53%, #f8fbff 100%);
        }
        .brandbook-sheet.theme-cobalt .sheet-body,
        .brandbook-sheet.theme-cobalt .sheet-header {
            color: #f8fbff;
        }
        .brandbook-sheet.theme-cobalt .sheet-box,
        .brandbook-sheet.theme-cobalt .sheet-font-card,
        .brandbook-sheet.theme-cobalt .sheet-color-item,
        .brandbook-sheet.theme-cobalt .sheet-mock-cell {
            color: #213fa9;
            background: #ffffff;
        }
        .brandbook-sheet.theme-cobalt .sheet-box .sheet-text,
        .brandbook-sheet.theme-cobalt .sheet-font-card .sheet-text,
        .brandbook-sheet.theme-cobalt .sheet-font-card .sheet-font-name,
        .brandbook-sheet.theme-cobalt .sheet-color-meta,
        .brandbook-sheet.theme-cobalt .sheet-mock-cell span {
            color: #1f2b45;
        }
        .brandbook-sheet.theme-crimson {
            color: #1f2a44;
            background: linear-gradient(180deg, #f9fbff 0%, #f9fbff 100%);
        }
        .brandbook-sheet.theme-crimson::before,
        .brandbook-sheet.theme-crimson::after {
            content: "";
            position: absolute;
            z-index: 1;
            border-radius: 58% 42% 47% 53%;
        }
        .brandbook-sheet.theme-crimson::before {
            width: 170px;
            height: 110px;
            background: #cf132f;
            left: -26px;
            top: -26px;
        }
        .brandbook-sheet.theme-crimson::after {
            width: 88px;
            height: 66px;
            background: #1f2a44;
            right: -24px;
            bottom: -18px;
        }
        .brandbook-sheet.theme-crimson .sheet-header {
            color: #cf132f;
        }
        .brandbook-sheet.theme-crimson .sheet-box,
        .brandbook-sheet.theme-crimson .sheet-font-card,
        .brandbook-sheet.theme-crimson .sheet-color-item,
        .brandbook-sheet.theme-crimson .sheet-mock-cell {
            color: #1f2a44;
            background: #ffffff;
        }
        @media print {
            body {
                background: #ffffff;
                padding: 0;
            }
            .export-header {
                display: none;
            }
            .brandbook-preview {
                display: block;
            }
            .brandbook-sheet {
                width: 100%;
                border-radius: 0;
                box-shadow: none;
                min-height: 980px;
                aspect-ratio: unset;
                break-after: page;
                page-break-after: always;
                margin: 0;
            }
        }
    `;
}

function persistLatestManualPayload(payload) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(BRAND_MANUAL_CACHE_KEY, JSON.stringify(payload));
    } catch (error) {
        // Se o storage estiver indisponivel, segue sem bloqueio da tela.
    }
}

function createManualContext() {
    const generatedAt = new Date().toISOString();
    const snapshot = getIntegrationSnapshot();
    const workInfo = getWorkInfo();
    const og = getOgSettings();
    const displayMockups = getDisplayMockups();

    const colors = resolveIdentityColors(snapshot, displayMockups);
    const typography = resolveIdentityTypography(snapshot, displayMockups);
    const project = resolveProjectInfo(workInfo, displayMockups);

    const integrationNotes = buildIntegrationNotes({
        hasSnapshot: Boolean(snapshot?.brandKit || snapshot?.colorPalette || snapshot?.fontProfile),
        colorCount: colors.length,
        hasTypography: typography.primaryFontName !== 'Nao definido' || typography.secondaryFontName !== 'Nao definido',
        mockupCount: displayMockups.length,
        hasOg: og.available
    });

    const payloadMockups = displayMockups.map((item) => ({
        id: item.id,
        mockupId: item.mockupId,
        title: item.title,
        category: item.category,
        categoryLabel: item.categoryLabel,
        orientation: item.orientation,
        quality: item.quality,
        savedAt: item.savedAt,
        imageMeta: item.imageMeta,
        hasPreview: item.hasPreview
    }));

    const payload = {
        schema: 'brand_manual_mvp_v1',
        generatedAt,
        source: 'brandmanual_tool',
        storageKeys: {
            brandKit: 'aq_brand_kit_v1',
            colorPalette: 'aq_color_palette_state_v1',
            fontProfile: 'aq_font_profile_state_v1',
            mockups: SAVED_EDITS_STORAGE_KEY,
            workInfo: WORK_INFO_STORAGE_KEY,
            ogSettings: OG_SETTINGS_STORAGE_KEY
        },
        identity: {
            project,
            colors,
            typography
        },
        applications: {
            mockups: {
                total: payloadMockups.length,
                items: payloadMockups
            },
            digital: {
                og
            }
        },
        integrationNotes
    };

    return {
        payload,
        displayMockups
    };
}

function getIntegrationSnapshot() {
    const api = window.AQBrandKit;
    if (!api || typeof api.getIntegrationSnapshot !== 'function') {
        return null;
    }

    const snapshot = api.getIntegrationSnapshot();
    return snapshot && typeof snapshot === 'object' ? snapshot : null;
}

function getWorkInfo() {
    const fallback = {
        title: '',
        mainTag: '',
        supportingTags: '',
        description: ''
    };
    const parsed = readStorageJson(WORK_INFO_STORAGE_KEY, fallback);
    return {
        title: String(parsed.title || '').slice(0, 120),
        mainTag: String(parsed.mainTag || '').slice(0, 50),
        supportingTags: String(parsed.supportingTags || '').slice(0, 900),
        description: String(parsed.description || '').slice(0, 1800)
    };
}

function getOgSettings() {
    const parsed = readStorageJson(OG_SETTINGS_STORAGE_KEY, null);
    if (!parsed || typeof parsed !== 'object') {
        return {
            available: false,
            title: '',
            description: '',
            brand: '',
            primaryColor: '',
            secondaryColor: '',
            imageOpacity: null,
            overlayOpacity: null,
            template: ''
        };
    }

    return {
        available: true,
        title: String(parsed.title || '').slice(0, 180),
        description: String(parsed.description || '').slice(0, 500),
        brand: String(parsed.brand || '').slice(0, 160),
        primaryColor: normalizeHex(parsed.primaryColor, ''),
        secondaryColor: normalizeHex(parsed.secondaryColor, ''),
        imageOpacity: sanitizeNumeric(parsed.imageOpacity, null),
        overlayOpacity: sanitizeNumeric(parsed.overlayOpacity, null),
        template: String(parsed.selectedTemplate || parsed.template || '').slice(0, 80)
    };
}

function getDisplayMockups() {
    const parsed = readStorageJson(SAVED_EDITS_STORAGE_KEY, []);
    if (!Array.isArray(parsed)) {
        return [];
    }

    return parsed
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry) => ({
            id: String(entry.id || ''),
            mockupId: Number(entry.mockupId || 0),
            title: String(entry.title || 'Mockup salvo').slice(0, 180),
            category: String(entry.category || '').slice(0, 60),
            categoryLabel: String(entry.categoryLabel || entry.category || 'Categoria').slice(0, 90),
            orientation: String(entry.orientation || '-').slice(0, 40),
            quality: String(entry.quality || '-').slice(0, 40),
            savedAt: String(entry.savedAt || ''),
            imageMeta: normalizeImageMeta(entry.imageMeta),
            hasPreview: isDataImage(entry.previewDataUrl),
            previewDataUrl: isDataImage(entry.previewDataUrl) ? entry.previewDataUrl : '',
            branding: entry.branding && typeof entry.branding === 'object' ? entry.branding : null
        }))
        .filter((entry) => entry.id !== '')
        .sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0))
        .slice(0, 60);
}

function resolveProjectInfo(workInfo, displayMockups) {
    const latestMockup = displayMockups[0] || null;
    const fallbackTitle = latestMockup ? latestMockup.title : 'Projeto sem titulo';

    const tags = String(workInfo.supportingTags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 20);

    return {
        title: workInfo.title || fallbackTitle,
        mainTag: workInfo.mainTag || (latestMockup ? latestMockup.categoryLabel : ''),
        supportingTags: tags,
        description: workInfo.description || 'Descricao nao registrada nesta sessao.'
    };
}

function resolveIdentityColors(snapshot, displayMockups) {
    const api = window.AQBrandKit;
    const unique = api && typeof api.uniqueColors === 'function'
        ? api.uniqueColors
        : (colors) => Array.from(new Set(colors.filter((color) => /^#[0-9a-fA-F]{6}$/.test(String(color)))));

    if (snapshot) {
        const brandKit = snapshot.brandKit || {};
        const brandColors = brandKit.brandColors || {};
        const paletteColors = Array.isArray(brandKit?.palette?.colors)
            ? brandKit.palette.colors
            : Array.isArray(snapshot?.colorPalette?.colors)
                ? snapshot.colorPalette.colors
                : [];

        const resolved = unique([
            normalizeHex(brandColors.primary, ''),
            normalizeHex(brandColors.secondary, ''),
            normalizeHex(brandColors.accent, ''),
            normalizeHex(brandColors.neutral, ''),
            ...paletteColors.map((color) => normalizeHex(color, ''))
        ]).slice(0, 7);

        if (resolved.length) {
            return resolved.map((hex, index) => ({
                role: COLOR_ROLE_LABELS[index] || `Apoio ${index - 2}`,
                hex,
                source: String(brandKit.source || snapshot?.colorPalette?.source || 'brandkit')
            }));
        }
    }

    const fallback = displayMockups[0]?.branding?.colors || {};
    const colors = [
        normalizeHex(fallback.primary, ''),
        normalizeHex(fallback.secondary, ''),
        normalizeHex(fallback.product, ''),
        normalizeHex(fallback.text, '')
    ].filter(Boolean);

    return Array.from(new Set(colors)).slice(0, 7).map((hex, index) => ({
        role: COLOR_ROLE_LABELS[index] || `Apoio ${index - 2}`,
        hex,
        source: 'mockups'
    }));
}

function resolveIdentityTypography(snapshot, displayMockups) {
    if (snapshot) {
        const brandKit = snapshot.brandKit || {};
        const typography = brandKit.typography || snapshot.fontProfile || {};
        return {
            primaryFontName: String(typography.primaryFontName || typography.fontName || 'Nao definido'),
            secondaryFontName: String(typography.secondaryFontName || typography.secondary || 'Nao definido'),
            pairingStyle: String(typography.pairingStyle || 'Nao definido'),
            tone: String(typography.tone || 'Nao definido'),
            notes: String(typography.notes || ''),
            source: String(typography.source || brandKit.source || snapshot?.fontProfile?.source || 'brandkit')
        };
    }

    const fallback = displayMockups[0]?.branding?.typography || {};
    return {
        primaryFontName: String(fallback.fontName || 'Nao definido'),
        secondaryFontName: String(fallback.fontName || 'Nao definido'),
        pairingStyle: 'Nao definido',
        tone: 'Nao definido',
        notes: '',
        source: 'mockups'
    };
}

function buildIntegrationNotes(context) {
    const notes = [];

    if (!context.hasSnapshot) {
        notes.push({
            level: 'warn',
            message: 'Brand Kit nao encontrado nesta sessao. O resumo usou dados de fallback do modulo de mockups.'
        });
    } else {
        notes.push({
            level: 'ok',
            message: 'Brand Kit encontrado: cores e tipografia sincronizadas foram consideradas no payload.'
        });
    }

    if (context.colorCount === 0) {
        notes.push({
            level: 'warn',
            message: 'Nenhuma cor consolidada. Gere paleta no Color Palette/Color Strategy e sincronize novamente.'
        });
    }

    if (!context.hasTypography) {
        notes.push({
            level: 'warn',
            message: 'Tipografia nao definida. Recomenda-se gerar combinacao no Font Strategy Advisor.'
        });
    }

    if (context.mockupCount === 0) {
        notes.push({
            level: 'warn',
            message: 'Sem mockups salvos. O manual pode ficar incompleto sem exemplos de aplicacao.'
        });
    } else {
        notes.push({
            level: 'ok',
            message: `Mockups localizados: ${context.mockupCount}.`
        });
    }

    if (!context.hasOg) {
        notes.push({
            level: 'warn',
            message: 'Diretriz OG nao encontrada. Abra OG Image Generator e salve configuracoes para incluir esta secao.'
        });
    } else {
        notes.push({
            level: 'ok',
            message: 'Diretriz OG encontrada e incorporada ao manual.'
        });
    }

    return notes;
}

function renderSummary(payload, displayMockups) {
    const colors = Array.isArray(payload?.identity?.colors) ? payload.identity.colors : [];
    const ogAvailable = Boolean(payload?.applications?.digital?.og?.available);
    const updatedAt = formatDate(payload?.generatedAt);

    setText('summaryColorCount', String(colors.length));
    setText('summaryMockupCount', String(displayMockups.length));
    setText('summaryOgStatus', ogAvailable ? 'Configurado' : 'Sem dados');
    setText('summaryUpdatedAt', updatedAt);
}

function renderProject(project) {
    if (!project || typeof project !== 'object') {
        return;
    }
    setText('projectTitle', project.title || 'Nao definido');
    setText('projectMainTag', project.mainTag ? `#${project.mainTag}` : 'Sem tag');
    setText('projectDescription', project.description || 'Sem descricao registrada.');
    setText(
        'projectSupportingTags',
        Array.isArray(project.supportingTags) && project.supportingTags.length
            ? project.supportingTags.join(', ')
            : 'Sem tags de apoio.'
    );
}

function renderPalette(colors) {
    const target = document.getElementById('paletteGrid');
    if (!target) {
        return;
    }
    if (!Array.isArray(colors) || !colors.length) {
        target.innerHTML = '<p class="muted">Sem cores consolidadas.</p>';
        return;
    }
    target.innerHTML = colors.map((item) => `
        <article class="palette-item">
            <div class="palette-swatch" style="background:${escapeHtml(item.hex)}"></div>
            <div class="palette-meta">
                <small>${escapeHtml(item.role || 'Cor')}</small>
                <strong>${escapeHtml(item.hex || '-')}</strong>
            </div>
        </article>
    `).join('');
}

function renderTypography(typography) {
    const target = document.getElementById('typographySummary');
    if (!target) {
        return;
    }

    const data = typography && typeof typography === 'object' ? typography : {};
    const lines = [
        { label: 'Fonte principal', value: data.primaryFontName || 'Nao definido' },
        { label: 'Fonte secundaria', value: data.secondaryFontName || 'Nao definido' },
        { label: 'Pairing', value: data.pairingStyle || 'Nao definido' },
        { label: 'Tom', value: data.tone || 'Nao definido' },
        { label: 'Origem', value: data.source || 'Nao definido' }
    ];

    if (data.notes) {
        lines.push({ label: 'Notas', value: data.notes });
    }

    target.innerHTML = lines.map((line) => `
        <article class="type-line">
            <small>${escapeHtml(line.label)}</small>
            <strong>${escapeHtml(line.value)}</strong>
        </article>
    `).join('');
}

function renderOg(og) {
    const target = document.getElementById('ogSummary');
    if (!target) {
        return;
    }

    if (!og || !og.available) {
        target.innerHTML = '<p class="muted">Sem configuracao de OG registrada nesta sessao.</p>';
        return;
    }

    const rows = [
        { label: 'Marca', value: og.brand || 'Nao definido' },
        { label: 'Titulo', value: og.title || 'Nao definido' },
        { label: 'Descricao', value: og.description || 'Nao definido' },
        { label: 'Template', value: og.template || 'Nao definido' },
        {
            label: 'Cores',
            value: [og.primaryColor, og.secondaryColor].filter(Boolean).join(' | ') || 'Nao definido'
        },
        {
            label: 'Opacidade',
            value: `Imagem ${og.imageOpacity ?? '-'} | Overlay ${og.overlayOpacity ?? '-'}`
        }
    ];

    target.innerHTML = rows.map((row) => `
        <article class="og-line">
            <small>${escapeHtml(row.label)}</small>
            <strong>${escapeHtml(row.value)}</strong>
        </article>
    `).join('');
}

function renderMockups(mockups) {
    const grid = document.getElementById('mockupsGrid');
    const empty = document.getElementById('mockupsEmpty');
    if (!grid || !empty) {
        return;
    }

    if (!Array.isArray(mockups) || !mockups.length) {
        grid.innerHTML = '';
        empty.style.display = '';
        return;
    }

    empty.style.display = 'none';
    grid.innerHTML = mockups.slice(0, 24).map((item) => `
        <article class="mockup-card">
            <div class="media">
                ${item.hasPreview
                    ? `<img src="${item.previewDataUrl}" alt="${escapeHtml(item.title)}">`
                    : '<div class="placeholder">Sem preview</div>'
                }
            </div>
            <div class="content">
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.categoryLabel)} | ${escapeHtml(item.orientation)} | ${escapeHtml(item.quality)}</p>
                <p>${escapeHtml(formatDate(item.savedAt))}</p>
            </div>
        </article>
    `).join('');
}

function renderNotes(notes) {
    const target = document.getElementById('integrationNotes');
    if (!target) {
        return;
    }
    if (!Array.isArray(notes) || !notes.length) {
        target.innerHTML = '<li>Sem observacoes adicionais.</li>';
        return;
    }

    target.innerHTML = notes.map((note) => `<li>${escapeHtml(note.message || '')}</li>`).join('');
}

function renderPayload(payload) {
    const field = document.getElementById('manualPayload');
    if (!field) {
        return;
    }
    field.value = JSON.stringify(payload, null, 2);
}

function exportPdfSummary() {
    if (!currentContext.payload) {
        setStatus('Gere o manual antes de exportar PDF.', 'warn');
        return;
    }

    const jsPDFCtor = window.jspdf?.jsPDF;
    if (!jsPDFCtor) {
        setStatus('Biblioteca de PDF indisponivel no momento.', 'warn');
        return;
    }

    const payload = currentContext.payload;
    const doc = new jsPDFCtor({ unit: 'pt', format: 'a4' });
    const pageWidth = 595.28;
    const margin = 40;
    const lineGap = 14;
    let y = 44;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.text('Brand Manual Report (MVP)', margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${formatDate(payload.generatedAt)}`, margin, y);
    y += 14;
    doc.text(`Template: ${payload.template?.name || getTemplatePreset(currentContext.activeTemplateId).name}`, margin, y);
    y += 16;

    y = writeSectionTitle(doc, 'Projeto', margin, y);
    y = writeParagraph(
        doc,
        [
            `Titulo: ${payload.identity.project.title}`,
            `Tag principal: ${payload.identity.project.mainTag || '-'}`,
            `Descricao: ${payload.identity.project.description}`,
            `Tags de apoio: ${(payload.identity.project.supportingTags || []).join(', ') || '-'}`
        ],
        margin,
        y,
        lineGap,
        pageWidth
    );

    y += 8;
    y = writeSectionTitle(doc, 'Sistema de Cores', margin, y);
    const colors = payload.identity.colors || [];
    if (!colors.length) {
        y = writeParagraph(doc, ['Sem cores consolidadas no momento.'], margin, y, lineGap, pageWidth);
    } else {
        colors.forEach((item) => {
            y = ensurePageSpace(doc, y, 24, margin);
            const rgb = hexToRgb(item.hex);
            doc.setFillColor(rgb.r, rgb.g, rgb.b);
            doc.rect(margin, y - 10, 16, 16, 'F');
            doc.setTextColor(17, 24, 39);
            doc.text(`${item.role}: ${item.hex}`, margin + 24, y + 2);
            y += 20;
        });
    }

    y += 8;
    y = writeSectionTitle(doc, 'Sistema Tipografico', margin, y);
    const type = payload.identity.typography || {};
    y = writeParagraph(
        doc,
        [
            `Fonte principal: ${type.primaryFontName || '-'}`,
            `Fonte secundaria: ${type.secondaryFontName || '-'}`,
            `Pairing: ${type.pairingStyle || '-'}`,
            `Tom: ${type.tone || '-'}`,
            `Origem: ${type.source || '-'}`
        ],
        margin,
        y,
        lineGap,
        pageWidth
    );

    y += 8;
    y = writeSectionTitle(doc, 'Diretriz Digital (OG)', margin, y);
    const og = payload.applications?.digital?.og || {};
    if (!og.available) {
        y = writeParagraph(doc, ['Nao ha configuracao OG registrada.'], margin, y, lineGap, pageWidth);
    } else {
        y = writeParagraph(
            doc,
            [
                `Marca: ${og.brand || '-'}`,
                `Titulo: ${og.title || '-'}`,
                `Template: ${og.template || '-'}`,
                `Cores: ${[og.primaryColor, og.secondaryColor].filter(Boolean).join(' | ') || '-'}`,
                `Opacidade: Imagem ${og.imageOpacity ?? '-'} / Overlay ${og.overlayOpacity ?? '-'}`
            ],
            margin,
            y,
            lineGap,
            pageWidth
        );
    }

    y += 8;
    y = writeSectionTitle(doc, 'Aplicacoes em Mockups', margin, y);
    const mockups = payload.applications?.mockups?.items || [];
    if (!mockups.length) {
        y = writeParagraph(doc, ['Nenhum mockup salvo para esta sessao.'], margin, y, lineGap, pageWidth);
    } else {
        mockups.slice(0, 12).forEach((item, index) => {
            y = ensurePageSpace(doc, y, 20, margin);
            doc.text(
                `${index + 1}. ${item.title} | ${item.categoryLabel || item.category || '-'} | ${formatDate(item.savedAt)}`,
                margin,
                y
            );
            y += lineGap;
        });
        if (mockups.length > 12) {
            y = writeParagraph(
                doc,
                [`... e mais ${mockups.length - 12} item(ns) no payload JSON.`],
                margin,
                y,
                lineGap,
                pageWidth
            );
        }
    }

    y += 8;
    y = writeSectionTitle(doc, 'Observacoes de Integracao', margin, y);
    (payload.integrationNotes || []).forEach((note) => {
        y = writeParagraph(doc, [`- ${note.message}`], margin, y, lineGap, pageWidth);
    });

    doc.save(`manual-marca-mvp-${formatDateForFile(new Date())}.pdf`);
    setStatus('PDF resumo exportado com sucesso.', 'ok');
}

function writeSectionTitle(doc, title, margin, y) {
    y = ensurePageSpace(doc, y, 28, margin);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(11, 27, 59);
    doc.text(title, margin, y);
    y += 12;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(17, 24, 39);
    return y;
}

function writeParagraph(doc, lines, margin, y, lineGap, pageWidth) {
    lines.forEach((line) => {
        const chunks = doc.splitTextToSize(String(line || ''), pageWidth - margin * 2);
        chunks.forEach((chunk) => {
            y = ensurePageSpace(doc, y, 18, margin);
            doc.text(chunk, margin, y);
            y += lineGap;
        });
    });
    return y;
}

function ensurePageSpace(doc, y, neededHeight, margin) {
    const maxY = 802;
    if (y + neededHeight <= maxY) {
        return y;
    }
    doc.addPage();
    return margin + 8;
}

function hexToRgb(hex) {
    const clean = String(hex || '').replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
        return { r: 24, g: 38, b: 66 };
    }
    return {
        r: parseInt(clean.slice(0, 2), 16),
        g: parseInt(clean.slice(2, 4), 16),
        b: parseInt(clean.slice(4, 6), 16)
    };
}

function downloadText(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
}

function readStorageJson(key, fallback) {
    if (typeof localStorage === 'undefined') {
        return fallback;
    }
    try {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return fallback;
        }
        return JSON.parse(raw);
    } catch (error) {
        return fallback;
    }
}

function normalizeImageMeta(meta) {
    if (!meta || typeof meta !== 'object') {
        return null;
    }
    return {
        name: String(meta.name || '').slice(0, 180),
        size: sanitizeNumeric(meta.size, 0)
    };
}

function sanitizeNumeric(value, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return numeric;
}

function isDataImage(value) {
    return String(value || '').startsWith('data:image/');
}

function normalizeHex(value, fallback = '#000000') {
    const api = window.AQBrandKit;
    if (api && typeof api.normalizeHex === 'function') {
        return api.normalizeHex(value, fallback);
    }

    const raw = String(value || '').trim().toLowerCase();
    if (/^#[0-9a-f]{6}$/.test(raw)) {
        return raw;
    }
    if (/^#[0-9a-f]{3}$/.test(raw)) {
        return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`;
    }
    return fallback;
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (!element) {
        return;
    }
    element.textContent = String(value || '');
}

function setStatus(message, tone = '') {
    const status = document.getElementById('statusLine');
    if (!status) {
        return;
    }
    status.textContent = message;
    status.classList.remove('ok', 'warn');
    if (tone === 'ok') {
        status.classList.add('ok');
    } else if (tone === 'warn') {
        status.classList.add('warn');
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
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}-${hour}${minute}${second}`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
