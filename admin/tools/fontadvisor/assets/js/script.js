const FONT_LIBRARY = [
    {
        key: 'inter',
        name: 'Inter',
        css: '"Inter", "Segoe UI", Arial, sans-serif',
        category: 'sans',
        tones: ['equilibrado', 'corporativo', 'inovador'],
        industries: ['geral', 'tecnologia', 'financeiro', 'educacao'],
        personality: ['sobria', 'tecnica'],
        channels: ['digital', 'hibrido'],
        readabilityScore: 94,
        longText: true,
        displayImpact: 2,
        compactSuitability: 4,
        strokeContrast: 'low',
        variable: true,
        notes: 'Excelente clareza em interfaces e sistemas complexos.'
    },
    {
        key: 'manrope',
        name: 'Manrope',
        css: '"Manrope", "Inter", Arial, sans-serif',
        category: 'sans',
        tones: ['inovador', 'premium', 'equilibrado'],
        industries: ['tecnologia', 'criativo', 'geral'],
        personality: ['tecnica', 'ousada'],
        channels: ['digital', 'hibrido'],
        readabilityScore: 90,
        longText: true,
        displayImpact: 3,
        compactSuitability: 4,
        strokeContrast: 'low',
        variable: true,
        notes: 'Visual moderno com boa legibilidade para UI e apresentações.'
    },
    {
        key: 'montserrat',
        name: 'Montserrat',
        css: '"Montserrat", "Segoe UI", Arial, sans-serif',
        category: 'sans',
        tones: ['equilibrado', 'premium', 'corporativo'],
        industries: ['geral', 'moda', 'financeiro', 'educacao'],
        personality: ['sobria', 'ousada'],
        channels: ['digital', 'hibrido', 'impresso'],
        readabilityScore: 86,
        longText: true,
        displayImpact: 3,
        compactSuitability: 4,
        strokeContrast: 'medium',
        variable: true,
        notes: 'Versátil para marca e campanhas com boa presença visual.'
    },
    {
        key: 'poppins',
        name: 'Poppins',
        css: '"Poppins", "Segoe UI", Arial, sans-serif',
        category: 'sans',
        tones: ['amigavel', 'inovador', 'equilibrado'],
        industries: ['geral', 'moda', 'criativo', 'gastronomia'],
        personality: ['calorosa', 'ousada'],
        channels: ['digital', 'hibrido'],
        readabilityScore: 84,
        longText: true,
        displayImpact: 3,
        compactSuitability: 3,
        strokeContrast: 'low',
        variable: true,
        notes: 'Boa para produtos digitais com tom acessível e contemporâneo.'
    },
    {
        key: 'space_grotesk',
        name: 'Space Grotesk',
        css: '"Space Grotesk", "Inter", Arial, sans-serif',
        category: 'sans',
        tones: ['inovador', 'editorial', 'premium'],
        industries: ['tecnologia', 'criativo', 'moda'],
        personality: ['ousada', 'tecnica'],
        channels: ['digital', 'hibrido'],
        readabilityScore: 81,
        longText: false,
        displayImpact: 4,
        compactSuitability: 3,
        strokeContrast: 'medium',
        variable: true,
        notes: 'Excelente para títulos fortes e identidade moderna.'
    },
    {
        key: 'nunito_sans',
        name: 'Nunito Sans',
        css: '"Nunito Sans", "Inter", Arial, sans-serif',
        category: 'sans',
        tones: ['amigavel', 'equilibrado', 'corporativo'],
        industries: ['educacao', 'saude', 'geral'],
        personality: ['calorosa', 'artesanal'],
        channels: ['digital', 'hibrido'],
        readabilityScore: 92,
        longText: true,
        displayImpact: 2,
        compactSuitability: 5,
        strokeContrast: 'low',
        variable: true,
        notes: 'Leitura confortável para fluxos com bastante conteúdo.'
    },
    {
        key: 'source_sans_3',
        name: 'Source Sans 3',
        css: '"Source Sans 3", "Segoe UI", Arial, sans-serif',
        category: 'sans',
        tones: ['equilibrado', 'corporativo', 'editorial'],
        industries: ['educacao', 'financeiro', 'geral', 'saude'],
        personality: ['sobria', 'tecnica'],
        channels: ['digital', 'hibrido', 'impresso'],
        readabilityScore: 95,
        longText: true,
        displayImpact: 2,
        compactSuitability: 5,
        strokeContrast: 'low',
        variable: true,
        notes: 'Uma das opções mais confiáveis para corpo de texto.'
    },
    {
        key: 'dm_sans',
        name: 'DM Sans',
        css: '"DM Sans", "Inter", Arial, sans-serif',
        category: 'sans',
        tones: ['equilibrado', 'premium', 'inovador'],
        industries: ['tecnologia', 'moda', 'geral'],
        personality: ['sobria', 'ousada'],
        channels: ['digital', 'hibrido'],
        readabilityScore: 87,
        longText: true,
        displayImpact: 3,
        compactSuitability: 4,
        strokeContrast: 'medium',
        variable: true,
        notes: 'Ótimo balanço entre elegância e funcionalidade digital.'
    },
    {
        key: 'merriweather',
        name: 'Merriweather',
        css: '"Merriweather", Georgia, serif',
        category: 'serif',
        tones: ['editorial', 'corporativo', 'equilibrado'],
        industries: ['educacao', 'financeiro', 'geral'],
        personality: ['sobria', 'artesanal'],
        channels: ['impresso', 'hibrido', 'digital'],
        readabilityScore: 89,
        longText: true,
        displayImpact: 3,
        compactSuitability: 3,
        strokeContrast: 'medium',
        variable: false,
        notes: 'Serif com excelente leitura para textos longos e relatórios.'
    },
    {
        key: 'playfair',
        name: 'Playfair Display',
        css: '"Playfair Display", Georgia, serif',
        category: 'serif',
        tones: ['premium', 'editorial', 'amigavel'],
        industries: ['moda', 'gastronomia', 'criativo'],
        personality: ['ousada', 'artesanal'],
        channels: ['impresso', 'hibrido'],
        readabilityScore: 70,
        longText: false,
        displayImpact: 5,
        compactSuitability: 2,
        strokeContrast: 'high',
        variable: false,
        notes: 'Muito forte para manchetes, menos indicada para leitura longa.'
    },
    {
        key: 'roboto_slab',
        name: 'Roboto Slab',
        css: '"Roboto Slab", Georgia, serif',
        category: 'serif',
        tones: ['corporativo', 'equilibrado', 'inovador'],
        industries: ['tecnologia', 'financeiro', 'educacao'],
        personality: ['tecnica', 'sobria'],
        channels: ['digital', 'hibrido', 'impresso'],
        readabilityScore: 83,
        longText: true,
        displayImpact: 3,
        compactSuitability: 4,
        strokeContrast: 'medium',
        variable: false,
        notes: 'Boa para títulos técnicos sem perder estabilidade visual.'
    },
    {
        key: 'lora',
        name: 'Lora',
        css: '"Lora", Georgia, serif',
        category: 'serif',
        tones: ['editorial', 'equilibrado', 'premium'],
        industries: ['educacao', 'moda', 'gastronomia', 'geral'],
        personality: ['artesanal', 'calorosa'],
        channels: ['impresso', 'hibrido', 'digital'],
        readabilityScore: 88,
        longText: true,
        displayImpact: 3,
        compactSuitability: 3,
        strokeContrast: 'medium',
        variable: true,
        notes: 'Combina bem com sans modernos para identidade editorial.'
    },
    {
        key: 'ibm_plex_serif',
        name: 'IBM Plex Serif',
        css: '"IBM Plex Serif", Georgia, serif',
        category: 'serif',
        tones: ['corporativo', 'inovador', 'editorial'],
        industries: ['tecnologia', 'financeiro', 'geral'],
        personality: ['tecnica', 'sobria'],
        channels: ['hibrido', 'impresso', 'digital'],
        readabilityScore: 86,
        longText: true,
        displayImpact: 3,
        compactSuitability: 4,
        strokeContrast: 'medium',
        variable: false,
        notes: 'Caráter institucional sólido para marcas B2B e tecnologia.'
    },
    {
        key: 'ibm_plex_sans',
        name: 'IBM Plex Sans',
        css: '"IBM Plex Sans", "Inter", Arial, sans-serif',
        category: 'sans',
        tones: ['corporativo', 'inovador', 'equilibrado'],
        industries: ['tecnologia', 'financeiro', 'educacao', 'geral'],
        personality: ['tecnica', 'sobria'],
        channels: ['digital', 'hibrido', 'impresso'],
        readabilityScore: 91,
        longText: true,
        displayImpact: 2,
        compactSuitability: 5,
        strokeContrast: 'low',
        variable: false,
        notes: 'Forte para design systems com grande volume de interface.'
    },
    {
        key: 'roboto_mono',
        name: 'Roboto Mono',
        css: '"Roboto Mono", Consolas, monospace',
        category: 'mono',
        tones: ['tecnica', 'inovador', 'corporativo'],
        industries: ['tecnologia', 'financeiro', 'criativo'],
        personality: ['tecnica', 'ousada'],
        channels: ['digital', 'hibrido'],
        readabilityScore: 73,
        longText: false,
        displayImpact: 3,
        compactSuitability: 4,
        strokeContrast: 'low',
        variable: false,
        notes: 'Excelente para labels, dados e estética tecnológica.'
    }
];

const PAIRING_STYLE_RULES = {
    'modern-serif': {
        primary: ['sans'],
        secondary: ['serif']
    },
    'sans-sans': {
        primary: ['sans'],
        secondary: ['sans']
    },
    'serif-sans': {
        primary: ['serif'],
        secondary: ['sans']
    },
    'expressive-neutral': {
        primary: ['serif', 'sans'],
        secondary: ['sans', 'mono']
    }
};

const LABELS = {
    industry: {
        geral: 'Geral',
        tecnologia: 'Tecnologia',
        moda: 'Moda / Beleza',
        financeiro: 'Financeiro',
        saude: 'Saúde / Bem-estar',
        educacao: 'Educação',
        gastronomia: 'Gastronomia',
        criativo: 'Criativo / Agência'
    },
    tone: {
        equilibrado: 'Equilibrado',
        corporativo: 'Corporativo',
        premium: 'Premium',
        amigavel: 'Amigável',
        inovador: 'Inovador',
        editorial: 'Editorial'
    },
    channel: {
        digital: 'Digital',
        impresso: 'Impresso',
        hibrido: 'Híbrido'
    },
    readability: {
        alta: 'Alta',
        media: 'Média',
        expressiva: 'Expressiva'
    },
    brandPersonality: {
        sobria: 'Sóbria',
        calorosa: 'Calorosa',
        ousada: 'Ousada',
        tecnica: 'Técnica',
        artesanal: 'Artesanal'
    },
    contentScale: {
        longo: 'Longo',
        medio: 'Médio',
        curto: 'Curto'
    },
    hierarchyStyle: {
        equilibrada: 'Equilibrada',
        compacta: 'Compacta',
        dramatica: 'Dramática'
    },
    fontContrast: {
        baixo: 'Baixo',
        medio: 'Médio',
        alto: 'Alto'
    },
    pairingStyle: {
        'modern-serif': 'Moderno + Serifado',
        'sans-sans': 'Sans + Sans',
        'serif-sans': 'Serifado + Sans',
        'expressive-neutral': 'Expressiva + Neutra'
    },
    category: {
        sans: 'Sans',
        serif: 'Serif',
        mono: 'Monospace'
    }
};

const FONT_PDF_TEMPLATE_KEY = 'aq_font_pdf_template_mode_v1';
const FONT_VIEW_PREFS_KEY = 'aq_font_view_prefs_v1';
const FONT_PRESENTATION_MODE_KEY = 'aq_font_presentation_mode_v1';
const FONT_PRESENTATION_PRESET_KEY = 'aq_font_presentation_preset_v1';
const DEFAULT_VIEW_PREFS = Object.freeze({
    count: 8,
    sort: 'score',
    density: 'compact'
});
let latestRecommendation = null;
let activePairSignature = '';
let viewPrefs = { ...DEFAULT_VIEW_PREFS };
let presentationMode = false;
let presentationPreset = 'standard';
let lastRankingView = {
    count: DEFAULT_VIEW_PREFS.count,
    total: 0,
    mode: DEFAULT_VIEW_PREFS.sort
};

document.addEventListener('DOMContentLoaded', () => {
    hydrateFromBrandKit();
    hydrateViewPrefs();
    hydratePresentationPreset();
    hydratePresentationMode();
    bindEvents();
    generateRecommendation({ silent: true, sync: true });
});

function bindEvents() {
    const form = document.getElementById('fontStrategyForm');
    form?.addEventListener('submit', (event) => {
        event.preventDefault();
        generateRecommendation({ silent: false, sync: true });
    });

    form?.addEventListener('change', () => {
        generateRecommendation({ silent: true, sync: true });
    });

    document.getElementById('sampleHeadline')?.addEventListener('input', () => {
        generateRecommendation({ silent: true, sync: true });
    });

    document.getElementById('sampleBody')?.addEventListener('input', () => {
        generateRecommendation({ silent: true, sync: true });
    });

    document.getElementById('applyFontProfileBtn')?.addEventListener('click', () => {
        applyTypographyToBrandKit({ silent: false });
    });

    document.getElementById('exportFontProfileBtn')?.addEventListener('click', exportFontProfile);
    document.getElementById('exportFontProfilePdfBtn')?.addEventListener('click', exportFontProfilePdf);
    document.getElementById('fontPdfTemplate')?.addEventListener('change', (event) => {
        const mode = normalizePdfTemplateMode(event?.target?.value);
        persistPdfTemplateMode(mode);
        syncFontPdfExportButton(mode);
        setSyncStatus(`Modelo PDF selecionado: ${mode === 'mini' ? 'Mini Brand Guide' : 'Brandbook Completo'}.`, 'ok');
    });
    syncFontPdfExportButton(readPdfTemplateMode());

    document.getElementById('resetFontStrategyBtn')?.addEventListener('click', () => {
        const formElement = document.getElementById('fontStrategyForm');
        formElement?.reset();
        setFieldValue('projectNotes', '');
        setFieldValue('sampleHeadline', '');
        setFieldValue('sampleBody', '');
        activePairSignature = '';
        generateRecommendation({ silent: false, sync: true });
        setSyncStatus('Perfil resetado e recomendação recalculada.', 'ok');
    });

    document.getElementById('rankingCount')?.addEventListener('change', () => {
        updateViewPrefsFromControls({ announce: true });
    });

    document.getElementById('rankingSort')?.addEventListener('change', () => {
        updateViewPrefsFromControls({ announce: true });
    });

    document.getElementById('rankingDensity')?.addEventListener('change', () => {
        updateViewPrefsFromControls({ announce: true });
    });

    document.getElementById('presentationModeBtn')?.addEventListener('click', () => {
        togglePresentationMode({ announce: true });
    });

    document.getElementById('printPresentationBtn')?.addEventListener('click', () => {
        printPresentationMode();
    });

    document.getElementById('presentationPreset')?.addEventListener('change', () => {
        updatePresentationPresetFromControl({ announce: true });
    });

    document.addEventListener('keydown', handlePresentationShortcut);

    const alternatives = document.getElementById('pairAlternatives');
    alternatives?.addEventListener('click', (event) => {
        const card = event.target.closest('.pair-alt-card');
        applyPairFromCard(card);
    });

    alternatives?.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        const card = event.target.closest('.pair-alt-card');
        if (!card) {
            return;
        }
        event.preventDefault();
        applyPairFromCard(card);
    });
}

function handlePresentationShortcut(event) {
    if (!event || event.defaultPrevented) {
        return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
    }

    const key = String(event.key || '').toLowerCase();
    if (key !== 'p') {
        return;
    }

    const target = event.target;
    if (
        target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || target instanceof HTMLSelectElement
        || Boolean(target?.isContentEditable)
    ) {
        return;
    }

    event.preventDefault();
    togglePresentationMode({ announce: true });
}

function applyPairFromCard(card) {
    if (!card) {
        return;
    }
    const signature = String(card.getAttribute('data-signature') || '').trim();
    if (!signature || !latestRecommendation) {
        return;
    }
    const match = latestRecommendation.pairOptions.find((item) => item.signature === signature);
    if (!match) {
        return;
    }

    activePairSignature = signature;
    latestRecommendation.selectedPair = match;
    latestRecommendation.plan = buildApplicationPlan(latestRecommendation.criteria, match);
    latestRecommendation.guidance = buildGuidance(
        latestRecommendation.criteria,
        match,
        latestRecommendation.confidence,
        latestRecommendation.ranking
    );

    renderRecommendation(latestRecommendation);
    saveDraftFontProfile();
    applyTypographyToBrandKit({ silent: true });
    setSyncStatus(`Par alternativo aplicado: ${match.primary.name} + ${match.secondary.name}.`, 'ok');
}

function hydrateFromBrandKit() {
    const api = window.AQBrandKit;
    if (!api || typeof api.getIntegrationSnapshot !== 'function') {
        return;
    }

    const snapshot = api.getIntegrationSnapshot();
    const profile = snapshot?.fontProfile || {};

    setFieldValue('industry', profile.industry || 'geral');
    setFieldValue('tone', profile.tone || 'equilibrado');
    setFieldValue('channel', profile.channel || 'digital');
    setFieldValue('readability', profile.readability || 'alta');
    setFieldValue('pairingStyle', profile.pairingStyle || 'modern-serif');
    setFieldValue('brandPersonality', profile.brandPersonality || 'sobria');
    setFieldValue('contentScale', profile.contentScale || 'longo');
    setFieldValue('hierarchyStyle', normalizeHierarchyStyle(profile.hierarchyStyle || 'equilibrada'));
    setFieldValue('fontContrast', profile.fontContrast || 'medio');
    setFieldValue('projectNotes', profile.notes || '');
    setFieldValue('sampleHeadline', profile.sampleHeadline || '');
    setFieldValue('sampleBody', profile.sampleBody || '');
    setFieldValue('fontPdfTemplate', readPdfTemplateMode());

    const selectedPair = profile.selectedPair || {};
    if (selectedPair.primaryKey && selectedPair.secondaryKey) {
        activePairSignature = `${selectedPair.primaryKey}|${selectedPair.secondaryKey}`;
    }
}

function normalizePresentationPreset(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'executive') return 'executive';
    if (normalized === 'workshop') return 'workshop';
    return 'standard';
}

function readPresentationPreset() {
    try {
        return normalizePresentationPreset(window.localStorage.getItem(FONT_PRESENTATION_PRESET_KEY));
    } catch (_error) {
        return 'standard';
    }
}

function persistPresentationPreset(value) {
    try {
        window.localStorage.setItem(FONT_PRESENTATION_PRESET_KEY, normalizePresentationPreset(value));
    } catch (_error) {
        // noop
    }
}

function syncPresentationPresetControl() {
    const control = document.getElementById('presentationPreset');
    if (!(control instanceof HTMLSelectElement)) {
        return;
    }
    control.value = normalizePresentationPreset(presentationPreset);
}

function applyPresentationPreset(preset, options = {}) {
    const persist = options.persist !== false;
    const announce = Boolean(options.announce);

    presentationPreset = normalizePresentationPreset(preset);
    const page = document.getElementById('fontAdvisorPage');
    if (page) {
        page.classList.toggle('executive-deck', presentationPreset === 'executive');
        page.classList.toggle('workshop-deck', presentationPreset === 'workshop');
    }

    syncPresentationPresetControl();

    if (persist) {
        persistPresentationPreset(presentationPreset);
    }

    updateSessionStateBar();

    if (announce) {
        let message = 'Preset padrão de apresentação ativado.';
        if (presentationPreset === 'executive') {
            message = 'Preset Deck Executivo ativado para apresentação.';
        } else if (presentationPreset === 'workshop') {
            message = 'Preset Workshop ativado para leitura coletiva.';
        }
        setSyncStatus(
            message,
            'ok'
        );
    }
}

function hydratePresentationPreset() {
    applyPresentationPreset(readPresentationPreset(), { persist: false, announce: false });
}

function updatePresentationPresetFromControl(options = {}) {
    const announce = Boolean(options.announce);
    const selected = getFieldValue('presentationPreset', 'standard');
    applyPresentationPreset(selected, { persist: true, announce });
}

function readPresentationMode() {
    try {
        return window.localStorage.getItem(FONT_PRESENTATION_MODE_KEY) === '1';
    } catch (_error) {
        return false;
    }
}

function persistPresentationMode(mode) {
    try {
        window.localStorage.setItem(FONT_PRESENTATION_MODE_KEY, mode ? '1' : '0');
    } catch (_error) {
        // noop
    }
}

function syncPresentationModeButton() {
    const button = document.getElementById('presentationModeBtn');
    if (!(button instanceof HTMLButtonElement)) {
        return;
    }
    const active = Boolean(presentationMode);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.textContent = active ? 'Sair do Modo Apresentação' : 'Ativar Modo Apresentação';
    button.setAttribute('title', active ? 'Sair do modo apresentação (atalho: P)' : 'Ativar modo apresentação (atalho: P)');
}

function applyPresentationMode(mode, options = {}) {
    const persist = options.persist !== false;
    const announce = Boolean(options.announce);

    presentationMode = Boolean(mode);
    const page = document.getElementById('fontAdvisorPage');
    if (page) {
        page.classList.toggle('presentation-mode', presentationMode);
    }

    syncPresentationModeButton();

    if (persist) {
        persistPresentationMode(presentationMode);
    }

    updateSessionStateBar();

    if (announce) {
        setSyncStatus(
            presentationMode
                ? 'Modo apresentação ativado: foco total nos resultados.'
                : 'Modo apresentação desativado: edição completa restaurada.',
            'ok'
        );
    }
}

function togglePresentationMode(options = {}) {
    applyPresentationMode(!presentationMode, options);
}

function hydratePresentationMode() {
    applyPresentationMode(readPresentationMode(), { persist: false, announce: false });
}

function printPresentationMode() {
    const page = document.getElementById('fontAdvisorPage');
    const wasPresentationActive = presentationMode;
    if (!wasPresentationActive) {
        applyPresentationMode(true, { persist: false, announce: false });
    }

    page?.classList.add('printing-presentation');
    setSyncStatus('Abrindo impressão da apresentação tipográfica...', 'ok');

    let restored = false;
    const restoreState = () => {
        if (restored) {
            return;
        }
        restored = true;
        page?.classList.remove('printing-presentation');
        if (!wasPresentationActive) {
            applyPresentationMode(false, { persist: false, announce: false });
        }
    };

    const afterPrintHandler = () => {
        restoreState();
        window.removeEventListener('afterprint', afterPrintHandler);
    };
    window.addEventListener('afterprint', afterPrintHandler);

    window.setTimeout(() => {
        try {
            window.print();
        } finally {
            window.setTimeout(() => {
                if (!restored) {
                    restoreState();
                }
            }, 1600);
        }
    }, 140);
}

function normalizeRankingCount(value) {
    const parsed = Number.parseInt(String(value || DEFAULT_VIEW_PREFS.count), 10);
    if ([6, 8, 10, 12].includes(parsed)) {
        return parsed;
    }
    return DEFAULT_VIEW_PREFS.count;
}

function normalizeRankingSort(value) {
    return value === 'readability' ? 'readability' : 'score';
}

function normalizeRankingDensity(value) {
    return value === 'comfortable' ? 'comfortable' : 'compact';
}

function readViewPrefs() {
    try {
        const raw = window.localStorage.getItem(FONT_VIEW_PREFS_KEY);
        if (!raw) {
            return { ...DEFAULT_VIEW_PREFS };
        }
        const parsed = JSON.parse(raw);
        return {
            count: normalizeRankingCount(parsed?.count),
            sort: normalizeRankingSort(parsed?.sort),
            density: normalizeRankingDensity(parsed?.density)
        };
    } catch (_error) {
        return { ...DEFAULT_VIEW_PREFS };
    }
}

function persistViewPrefs() {
    try {
        window.localStorage.setItem(FONT_VIEW_PREFS_KEY, JSON.stringify(viewPrefs));
    } catch (_error) {
        // noop
    }
}

function applyViewPrefsToControls() {
    setFieldValue('rankingCount', String(viewPrefs.count));
    setFieldValue('rankingSort', viewPrefs.sort);
    setFieldValue('rankingDensity', viewPrefs.density);
}

function hydrateViewPrefs() {
    viewPrefs = readViewPrefs();
    applyViewPrefsToControls();
    updateSessionStateBar({
        count: viewPrefs.count,
        total: 0,
        mode: viewPrefs.sort
    });
}

function applyRankingDensityClass(target) {
    if (!target) {
        return;
    }
    target.classList.toggle('is-comfortable', viewPrefs.density === 'comfortable');
}

function buildRankingView(ranking) {
    const list = Array.isArray(ranking) ? ranking.slice() : [];
    const sortMode = normalizeRankingSort(viewPrefs.sort);
    if (sortMode === 'readability') {
        list.sort((a, b) => {
            const readabilityDiff = Number(b.readabilityScore || 0) - Number(a.readabilityScore || 0);
            if (readabilityDiff !== 0) {
                return readabilityDiff;
            }
            return Number(b.score || 0) - Number(a.score || 0);
        });
    } else {
        list.sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
    }

    const count = Math.min(normalizeRankingCount(viewPrefs.count), list.length || DEFAULT_VIEW_PREFS.count);
    return {
        mode: sortMode,
        total: list.length,
        items: list.slice(0, count),
        count
    };
}

function renderRankingMeta(rankingView) {
    const meta = document.getElementById('rankingMeta');
    const modeLabel = rankingView.mode === 'readability' ? 'legibilidade' : 'pontua\u00E7\u00E3o';
    if (meta) {
        meta.textContent = `Exibindo Top ${rankingView.count} de ${rankingView.total} por ${modeLabel}.`;
    }
    updateSessionStateBar(rankingView);
}
function translatePresentationPresetLabel(preset) {
    if (preset === 'executive') return 'Deck Executivo';
    if (preset === 'workshop') return 'Workshop';
    return 'Padrão';
}

function updateSessionStateBar(rankingView = null) {
    if (rankingView && typeof rankingView === 'object') {
        const safeCount = Number.isFinite(Number(rankingView.count)) ? Number(rankingView.count) : lastRankingView.count;
        const safeTotal = Number.isFinite(Number(rankingView.total)) ? Number(rankingView.total) : lastRankingView.total;
        const safeMode = normalizeRankingSort(rankingView.mode || lastRankingView.mode);
        lastRankingView = {
            count: safeCount,
            total: safeTotal,
            mode: safeMode
        };
    }

    const presetTarget = document.getElementById('sessionPresetState');
    if (presetTarget) {
        presetTarget.textContent = translatePresentationPresetLabel(presentationPreset);
    }

    const presentationTarget = document.getElementById('sessionPresentationState');
    if (presentationTarget) {
        presentationTarget.textContent = presentationMode ? 'Ativa' : 'Inativa';
    }

    const rankingTarget = document.getElementById('sessionRankingState');
    if (rankingTarget) {
        const modeLabel = lastRankingView.mode === 'readability' ? 'legibilidade' : 'pontua\u00E7\u00E3o';
        rankingTarget.textContent = `Top ${lastRankingView.count} de ${lastRankingView.total} (${modeLabel})`;
    }
}

function updateViewPrefsFromControls(options = {}) {
    const announce = Boolean(options.announce);
    viewPrefs = {
        count: normalizeRankingCount(getFieldValue('rankingCount', String(DEFAULT_VIEW_PREFS.count))),
        sort: normalizeRankingSort(getFieldValue('rankingSort', DEFAULT_VIEW_PREFS.sort)),
        density: normalizeRankingDensity(getFieldValue('rankingDensity', DEFAULT_VIEW_PREFS.density))
    };
    persistViewPrefs();
    applyViewPrefsToControls();

    if (latestRecommendation) {
        renderRecommendation(latestRecommendation);
    } else {
        renderRankingMeta({
            count: viewPrefs.count,
            total: 0,
            mode: viewPrefs.sort
        });
    }

    if (announce) {
        const densityLabel = viewPrefs.density === 'comfortable' ? 'confortável' : 'compacta';
        const sortLabel = viewPrefs.sort === 'readability' ? 'legibilidade' : 'pontuação';
        setSyncStatus(`Visualização atualizada: Top ${viewPrefs.count}, ordenação por ${sortLabel}, densidade ${densityLabel}.`, 'ok');
    }
}

function generateRecommendation(options = {}) {
    const silent = Boolean(options.silent);
    const sync = options.sync !== false;
    const criteria = getFormValues();
    const ranking = rankFonts(criteria);
    const pairOptions = buildPairingOptions(ranking, criteria);
    const selectedPair = resolveSelectedPair(pairOptions);
    const confidence = calculateConfidence({ ranking, pairOptions, criteria });
    const plan = buildApplicationPlan(criteria, selectedPair);
    const guidance = buildGuidance(criteria, selectedPair, confidence, ranking);

    latestRecommendation = {
        generatedAt: new Date().toISOString(),
        criteria,
        ranking,
        pairOptions,
        selectedPair,
        confidence,
        plan,
        guidance
    };

    activePairSignature = selectedPair.signature;
    renderRecommendation(latestRecommendation);
    saveDraftFontProfile();

    if (sync) {
        applyTypographyToBrandKit({ silent: true });
    }

    if (!silent) {
        setSyncStatus('Recomendação tipográfica atualizada e sincronizada.', 'ok');
    }
}

function getFormValues() {
    return {
        industry: getFieldValue('industry', 'geral'),
        tone: getFieldValue('tone', 'equilibrado'),
        channel: getFieldValue('channel', 'digital'),
        readability: getFieldValue('readability', 'alta'),
        pairingStyle: getFieldValue('pairingStyle', 'modern-serif'),
        brandPersonality: getFieldValue('brandPersonality', 'sobria'),
        contentScale: getFieldValue('contentScale', 'longo'),
        hierarchyStyle: normalizeHierarchyStyle(getFieldValue('hierarchyStyle', 'equilibrada')),
        fontContrast: getFieldValue('fontContrast', 'medio'),
        sampleHeadline: getFieldValue('sampleHeadline', ''),
        sampleBody: getFieldValue('sampleBody', ''),
        notes: getFieldValue('projectNotes', '')
    };
}

function rankFonts(criteria) {
    const readabilityTargetMap = {
        alta: 92,
        media: 78,
        expressiva: 64
    };
    const targetReadability = readabilityTargetMap[criteria.readability] || 78;

    return FONT_LIBRARY
        .map((font) => {
            let score = 0;
            const reasons = [];

            if (font.tones.includes(criteria.tone)) {
                score += 5;
                reasons.push('Tom de voz alinhado');
            }
            if (font.industries.includes(criteria.industry) || criteria.industry === 'geral') {
                score += 4;
                reasons.push('Boa aderência ao segmento');
            }
            if (font.channels.includes(criteria.channel)) {
                score += 4;
                reasons.push('Canal principal compatível');
            } else if (criteria.channel === 'impresso') {
                score -= 2;
                reasons.push('Baixa afinidade com impresso');
            }

            const readabilityDelta = Math.abs(font.readabilityScore - targetReadability);
            const readabilityBonus = Math.max(-2, 4 - (readabilityDelta / 14));
            score += readabilityBonus;
            if (readabilityBonus >= 2.4) {
                reasons.push('Legibilidade forte para o objetivo');
            } else if (readabilityBonus <= 0) {
                reasons.push('Legibilidade abaixo do ideal');
            }

            if (font.personality.includes(criteria.brandPersonality)) {
                score += 3;
                reasons.push('Personalidade de marca compatível');
            }

            if (criteria.contentScale === 'longo') {
                if (font.longText) {
                    score += 3;
                    reasons.push('Indicada para textos longos');
                } else {
                    score -= 1.8;
                    reasons.push('Menos indicada para leitura extensa');
                }
            }

            if (criteria.contentScale === 'curto') {
                if (font.displayImpact >= 4) {
                    score += 2.6;
                    reasons.push('Forte presença para peças curtas');
                } else {
                    score += 0.4;
                }
            }

            if (criteria.hierarchyStyle === 'dramatica') {
                if (font.displayImpact >= 4) {
                    score += 2;
                    reasons.push('Ajuda a criar hierarquia dramática');
                }
            } else if (criteria.hierarchyStyle === 'compacta') {
                if (font.compactSuitability >= 4) {
                    score += 1.8;
                    reasons.push('Boa compactação para layout denso');
                }
            } else if (font.readabilityScore >= 82) {
                score += 1;
            }

            if (criteria.fontContrast === 'alto' && font.strokeContrast === 'high') {
                score += 2;
                reasons.push('Contraste tipográfico elevado');
            }
            if (criteria.fontContrast === 'baixo' && font.strokeContrast === 'low') {
                score += 2;
                reasons.push('Contraste suave entre traços');
            }
            if (criteria.fontContrast === 'medio' && (font.strokeContrast === 'medium' || font.strokeContrast === 'low')) {
                score += 1.2;
            }

            if ((criteria.channel === 'digital' || criteria.channel === 'hibrido') && font.variable) {
                score += 0.9;
                reasons.push('Suporte variável útil para performance');
            }

            if (criteria.tone === 'premium' && font.displayImpact >= 4) {
                score += 1.4;
            }
            if (criteria.tone === 'corporativo' && font.category === 'mono') {
                score -= 1.2;
            }
            if (criteria.readability === 'alta' && font.category === 'mono') {
                score -= 1;
            }

            return {
                ...font,
                score: roundTo(score, 2),
                reasons: reasons.slice(0, 6)
            };
        })
        .sort((a, b) => b.score - a.score);
}

function buildPairingOptions(ranking, criteria) {
    const rules = PAIRING_STYLE_RULES[criteria.pairingStyle] || PAIRING_STYLE_RULES['modern-serif'];
    const primaryCandidates = ranking.filter((font) => rules.primary.includes(font.category)).slice(0, 8);
    const secondaryCandidates = ranking.filter((font) => rules.secondary.includes(font.category)).slice(0, 8);
    const options = [];

    primaryCandidates.forEach((primary) => {
        secondaryCandidates.forEach((secondary) => {
            if (primary.key === secondary.key) {
                return;
            }
            const evaluation = evaluatePair(primary, secondary, criteria);
            options.push({
                primary,
                secondary,
                score: evaluation.score,
                reasons: evaluation.reasons,
                summary: `${primary.name} (títulos) + ${secondary.name} (texto corrido)`,
                signature: `${primary.key}|${secondary.key}`
            });
        });
    });

    if (!options.length) {
        const fallbackPrimary = ranking[0] || FONT_LIBRARY[0];
        const fallbackSecondary = ranking.find((item) => item.key !== fallbackPrimary.key) || FONT_LIBRARY[1];
        options.push({
            primary: fallbackPrimary,
            secondary: fallbackSecondary,
            score: roundTo((fallbackPrimary.score || 0) + ((fallbackSecondary.score || 0) * 0.65), 2),
            reasons: ['Par fallback por ausência de combinação direta'],
            summary: `${fallbackPrimary.name} + ${fallbackSecondary.name}`,
            signature: `${fallbackPrimary.key}|${fallbackSecondary.key}`
        });
    }

    const dedup = new Map();
    options
        .sort((a, b) => b.score - a.score)
        .forEach((item) => {
            if (!dedup.has(item.signature)) {
                dedup.set(item.signature, item);
            }
        });

    return Array.from(dedup.values()).slice(0, 6);
}

function evaluatePair(primary, secondary, criteria) {
    let score = Number(primary.score || 0) + (Number(secondary.score || 0) * 0.68);
    const reasons = [];

    if (primary.category !== secondary.category) {
        score += 1.8;
        reasons.push('Contraste entre famílias');
    } else if (criteria.pairingStyle === 'sans-sans') {
        score += 1.2;
        reasons.push('Dupla sans consistente');
    } else {
        score -= 1;
    }

    if (criteria.readability === 'alta') {
        if (secondary.longText) {
            score += 2.2;
            reasons.push('Texto de apoio com leitura confortável');
        } else {
            score -= 1.6;
            reasons.push('Texto de apoio pode cansar em leitura longa');
        }
    }

    if (criteria.channel === 'digital' && secondary.readabilityScore >= 84) {
        score += 1.1;
    }
    if (criteria.channel === 'impresso' && primary.strokeContrast === 'high') {
        score += 1;
    }

    const hierarchyDelta = Number(primary.displayImpact || 0) - Number(secondary.displayImpact || 0);
    if (criteria.hierarchyStyle === 'dramatica') {
        if (hierarchyDelta >= 1) {
            score += 1.6;
            reasons.push('Hierarquia visual forte entre título e corpo');
        } else {
            score -= 0.5;
        }
    }
    if (criteria.hierarchyStyle === 'compacta') {
        if (primary.compactSuitability >= 4 && secondary.compactSuitability >= 4) {
            score += 0.9;
        }
    }

    if (hasIntersection(primary.tones, secondary.tones)) {
        score += 0.7;
    }
    if (criteria.contentScale === 'curto' && primary.displayImpact >= 4) {
        score += 1.1;
    }
    if (criteria.contentScale === 'longo' && !secondary.longText) {
        score -= 1.4;
    }

    return {
        score: roundTo(score, 2),
        reasons: reasons.slice(0, 4)
    };
}

function resolveSelectedPair(pairOptions) {
    if (!Array.isArray(pairOptions) || pairOptions.length === 0) {
        const fallbackPrimary = FONT_LIBRARY[0];
        const fallbackSecondary = FONT_LIBRARY[1];
        return {
            primary: fallbackPrimary,
            secondary: fallbackSecondary,
            score: 0,
            reasons: ['Sem pares disponíveis no momento'],
            summary: `${fallbackPrimary.name} + ${fallbackSecondary.name}`,
            signature: `${fallbackPrimary.key}|${fallbackSecondary.key}`
        };
    }
    const found = pairOptions.find((pair) => pair.signature === activePairSignature);
    return found || pairOptions[0];
}

function calculateConfidence({ ranking = [], pairOptions = [], criteria = {} } = {}) {
    const topFont = Number(ranking?.[0]?.score || 0);
    const secondFont = Number(ranking?.[1]?.score || 0);
    const topPair = Number(pairOptions?.[0]?.score || 0);
    const secondPair = Number(pairOptions?.[1]?.score || 0);

    const fontSpread = clamp01((topFont - secondFont) / 6);
    const pairSpread = clamp01((topPair - secondPair) / 5);
    const specificity = calculateSpecificity(criteria);
    const coverage = calculateCoverage(ranking.slice(0, 5), criteria);

    let score = Math.round(((fontSpread * 0.32) + (pairSpread * 0.24) + (specificity * 0.22) + (coverage * 0.22)) * 100);
    score = Math.max(32, Math.min(96, score));

    const level = score >= 76 ? 'high' : score >= 56 ? 'medium' : 'low';
    const label = level === 'high' ? 'Alta' : level === 'medium' ? 'Média' : 'Baixa';
    const drivers = [
        `Vantagem da melhor fonte: ${roundTo(topFont - secondFont, 2)} pontos.`,
        `Vantagem do melhor par: ${roundTo(topPair - secondPair, 2)} pontos.`,
        specificity >= 0.74
            ? 'Diagnóstico detalhado aumenta a precisão da recomendação.'
            : 'Diagnóstico mais amplo reduz a precisão.',
        coverage >= 0.72
            ? 'Top fontes cobrem bem canal, legibilidade e personalidade.'
            : 'Cobertura parcial entre canal e estilo tipográfico.'
    ];

    return {
        score,
        level,
        label,
        drivers: drivers.slice(0, 4)
    };
}

function calculateSpecificity(criteria = {}) {
    let points = 0;
    const total = 9;

    if (criteria.industry && criteria.industry !== 'geral') points += 1;
    if (criteria.tone && criteria.tone !== 'equilibrado') points += 1;
    if (criteria.channel && criteria.channel !== 'digital') points += 1;
    if (criteria.readability && criteria.readability !== 'media') points += 1;
    if (criteria.brandPersonality && criteria.brandPersonality !== 'sobria') points += 1;
    if (criteria.contentScale && criteria.contentScale !== 'medio') points += 1;
    if (criteria.hierarchyStyle && criteria.hierarchyStyle !== 'equilibrada') points += 1;
    if (criteria.fontContrast && criteria.fontContrast !== 'medio') points += 1;
    if (String(criteria.notes || '').trim().length > 20) points += 1;

    return clamp01(points / total);
}

function calculateCoverage(topFonts = [], criteria = {}) {
    if (!Array.isArray(topFonts) || topFonts.length === 0) {
        return 0;
    }

    let hit = 0;
    topFonts.forEach((font) => {
        if (font.channels.includes(criteria.channel)) hit += 1;
        if (font.tones.includes(criteria.tone)) hit += 1;
        if (font.personality.includes(criteria.brandPersonality)) hit += 1;
        if (criteria.readability === 'alta' && font.readabilityScore >= 84) hit += 1;
        if (criteria.readability === 'media' && font.readabilityScore >= 74) hit += 1;
        if (criteria.readability === 'expressiva' && font.displayImpact >= 3) hit += 1;
    });

    const max = topFonts.length * 6;
    return clamp01(hit / max);
}

function buildApplicationPlan(criteria, pair) {
    const lineHeightMap = {
        longo: 1.65,
        medio: 1.54,
        curto: 1.44
    };
    const scalePresetMap = {
        compacta: { name: 'Minor Third', ratio: 1.2 },
        equilibrada: { name: 'Major Third', ratio: 1.25 },
        dramatica: { name: 'Perfect Fourth', ratio: 1.333 }
    };

    const bodyBaseSize = criteria.readability === 'alta' ? 17 : criteria.readability === 'media' ? 16 : 15;
    const headingWeight = criteria.hierarchyStyle === 'dramatica' ? 700 : criteria.hierarchyStyle === 'compacta' ? 600 : 650;
    const bodyWeight = criteria.readability === 'alta' ? 400 : 500;
    const ctaWeight = criteria.brandPersonality === 'sobria' ? 600 : 700;
    const scalePreset = scalePresetMap[criteria.hierarchyStyle] || scalePresetMap.equilibrada;
    const lineHeight = lineHeightMap[criteria.contentScale] || 1.54;
    const maxLineLength = criteria.channel === 'impresso' ? '65ch' : criteria.channel === 'hibrido' ? '68ch' : '72ch';

    const firstLevelSize = Math.round(bodyBaseSize * scalePreset.ratio * scalePreset.ratio * 10) / 10;
    const secondLevelSize = Math.round(bodyBaseSize * scalePreset.ratio * 10) / 10;

    return {
        headingWeight,
        bodyWeight,
        ctaWeight,
        bodyBaseSize,
        lineHeight,
        maxLineLength,
        scalePreset,
        tokens: [
            { label: 'Fonte para títulos', value: pair.primary.name },
            { label: 'Fonte para corpo', value: pair.secondary.name },
            { label: 'Peso sugerido (título)', value: String(headingWeight) },
            { label: 'Peso sugerido (corpo)', value: String(bodyWeight) },
            { label: 'Base do corpo', value: `${bodyBaseSize}px` },
            { label: 'Escala tipográfica', value: `${scalePreset.name} (${scalePreset.ratio})` },
            { label: 'Tamanho H2 sugerido', value: `${firstLevelSize}px` },
            { label: 'Tamanho H3 sugerido', value: `${secondLevelSize}px` },
            { label: 'Altura de linha', value: String(lineHeight) },
            { label: 'Linha máxima', value: maxLineLength },
            { label: 'Peso de CTA', value: String(ctaWeight) },
            { label: 'Contraste tipográfico', value: translateLabel('fontContrast', criteria.fontContrast) }
        ]
    };
}

function buildGuidance(criteria, pair, confidence, ranking) {
    const actions = [];
    const risks = [];

    if (criteria.channel === 'digital') {
        actions.push('Validar o par em telas pequenas (320px até 414px) com zoom de 100%.');
    }
    if (criteria.channel === 'impresso') {
        actions.push('Testar prova de impressão em papel fosco e couchê para confirmar contraste real.');
    }
    if (criteria.readability === 'alta') {
        actions.push('Manter tamanho mínimo de 16px no corpo e evitar blocos longos em caixa alta.');
    }
    if (criteria.pairingStyle === 'sans-sans') {
        actions.push('Usar diferenças claras de peso e tracking para separar título e corpo com duas sans.');
    }
    if (criteria.contentScale === 'longo') {
        actions.push('Aplicar largura máxima de linha entre 60ch e 72ch para leitura confortável.');
    }
    if (criteria.hierarchyStyle === 'dramatica') {
        actions.push('Reservar a tipografia principal de impacto para títulos e não para parágrafos longos.');
    }

    if (pair.primary.displayImpact >= 4 && criteria.readability === 'alta') {
        risks.push('Fonte de título muito expressiva pode reduzir consistência em layouts densos.');
    }
    if (!pair.secondary.longText && criteria.contentScale === 'longo') {
        risks.push('Fonte secundária escolhida não é ideal para textos extensos.');
    }
    if (criteria.channel === 'digital' && pair.secondary.readabilityScore < 80) {
        risks.push('Legibilidade em dispositivos menores pode ficar abaixo do esperado.');
    }
    if (criteria.fontContrast === 'alto' && pair.primary.strokeContrast !== 'high') {
        risks.push('Contraste de traço solicitado é alto, mas a fonte principal é de contraste moderado.');
    }
    if (confidence.score < 56) {
        risks.push('Confiabilidade baixa: faça teste A/B de tipografia antes de oficializar no brandbook.');
    }
    if (ranking[0] && ranking[1] && roundTo(ranking[0].score - ranking[1].score, 2) < 1.1) {
        risks.push('Top 2 fontes muito próximas: vale comparar visualmente as duas combinações principais.');
    }

    if (!risks.length) {
        risks.push('Sem alertas críticos. Avance para validação em mockups e documentação final.');
    }
    if (actions.length < 5) {
        actions.push('Criar tokens tipográficos no Design Studio Pro para reutilizar pesos, escalas e line-height.');
    }

    return {
        actions: uniqueTextList(actions, 10),
        risks: uniqueTextList(risks, 10)
    };
}

function renderRecommendation(payload) {
    const summary = document.getElementById('fontStrategySummary');
    const cards = document.getElementById('fontCards');
    const meta = document.getElementById('pairingMeta');

    if (!payload || !payload.selectedPair || !payload.ranking.length) {
        if (summary) {
            summary.textContent = 'N\u00E3o foi poss\u00EDvel montar recomenda\u00E7\u00E3o neste momento.';
        }
        renderRankingMeta({
            count: viewPrefs.count,
            total: 0,
            mode: viewPrefs.sort
        });
        return;
    }

    const selectedPair = payload.selectedPair;
    if (summary) {
        summary.textContent = `Par recomendado: ${selectedPair.summary}. Confiança: ${payload.confidence.score}% (${payload.confidence.label}).`;
    }

    if (meta) {
        meta.textContent = [
            `Estilo: ${translateLabel('pairingStyle', payload.criteria.pairingStyle)}`,
            `Segmento: ${translateLabel('industry', payload.criteria.industry)}`,
            `Canal: ${translateLabel('channel', payload.criteria.channel)}`,
            `Legibilidade: ${translateLabel('readability', payload.criteria.readability)}`,
            `Personalidade: ${translateLabel('brandPersonality', payload.criteria.brandPersonality)}`
        ].join(' | ');
    }

    renderConfidence(payload.confidence);
    renderPreview(payload);

    if (cards) {
        const rankingView = buildRankingView(payload.ranking);
        applyRankingDensityClass(cards);
        cards.innerHTML = rankingView.items.map((font, index) => renderFontCard(font, index)).join('');
        renderRankingMeta(rankingView);
    }

    renderPairAlternatives(payload.pairOptions, payload.selectedPair.signature);
    renderApplicationPlan(payload.plan);
    renderGuidance(payload.guidance);
}

function renderConfidence(confidence) {
    const chip = document.getElementById('fontConfidenceChip');
    if (!chip || !confidence) {
        return;
    }
    chip.classList.remove('high', 'medium', 'low');
    chip.classList.add(confidence.level || 'medium');
    chip.textContent = `Confiança: ${confidence.label.toLowerCase()} (${confidence.score}%)`;
}

function renderPreview(payload) {
    const selectedPair = payload.selectedPair;
    const plan = payload.plan || {};
    const previewPrimary = document.getElementById('pairingPrimarySample');
    const previewSecondary = document.getElementById('pairingSecondarySample');
    const previewCta = document.getElementById('pairingCtaSample');
    const previewCaption = document.getElementById('pairingCaptionSample');
    const preview = document.getElementById('pairingPreview');
    const colors = resolveBrandColors();

    const headline = String(payload.criteria.sampleHeadline || '').trim() || 'Sua marca com voz e consistência visual';
    const bodyText = String(payload.criteria.sampleBody || '').trim()
        || 'Sistema tipográfico preparado para conteúdo, interface e materiais institucionais em um fluxo único.';

    if (previewPrimary) {
        previewPrimary.style.fontFamily = selectedPair.primary.css;
        previewPrimary.style.color = colors.primary;
        previewPrimary.style.fontWeight = String(plan.headingWeight || 700);
        previewPrimary.textContent = headline;
    }

    if (previewSecondary) {
        previewSecondary.style.fontFamily = selectedPair.secondary.css;
        previewSecondary.style.color = colors.secondary;
        previewSecondary.style.fontWeight = String(plan.bodyWeight || 400);
        previewSecondary.style.lineHeight = String(plan.lineHeight || 1.54);
        previewSecondary.textContent = bodyText;
    }

    if (previewCta) {
        previewCta.style.fontFamily = selectedPair.secondary.css;
        previewCta.style.fontWeight = String(plan.ctaWeight || 600);
        previewCta.style.background = colors.primary;
        previewCta.style.color = pickReadableTextColor(colors.primary);
    }

    if (previewCaption) {
        previewCaption.style.fontFamily = selectedPair.secondary.css;
        previewCaption.textContent = `Par ativo: ${selectedPair.primary.name} + ${selectedPair.secondary.name} | Escala ${plan.scalePreset?.name || 'Major Third'}.`;
    }

    if (preview) {
        preview.style.background = `linear-gradient(145deg, ${colors.surface} 0%, ${colors.background} 100%)`;
        preview.style.borderColor = colors.accent;
    }
}

function renderFontCard(font, index) {
    const reasons = Array.isArray(font.reasons) && font.reasons.length
        ? font.reasons.slice(0, 3).join(' | ')
        : 'Sem regra específica aplicada.';

    return `
        <article class="font-card">
            <h4 style="font-family:${font.css};">${index + 1}. ${escapeHtml(font.name)}</h4>
            <p>${escapeHtml(translateLabel('category', font.category))} | Pontuação: ${escapeHtml(String(roundTo(font.score, 2)))}</p>
            <p>${escapeHtml(reasons)}</p>
            <div class="font-card-meta">
                <span class="font-badge">Legibilidade ${escapeHtml(String(font.readabilityScore))}</span>
                <span class="font-badge">${escapeHtml(font.channels.join(' / '))}</span>
            </div>
        </article>
    `;
}

function renderPairAlternatives(pairOptions, activeSignature) {
    const container = document.getElementById('pairAlternatives');
    if (!container) {
        return;
    }

    if (!Array.isArray(pairOptions) || !pairOptions.length) {
        container.innerHTML = '<p class="summary">Nenhuma alternativa disponível.</p>';
        return;
    }

    container.innerHTML = pairOptions.slice(0, 5).map((pair, index) => {
        const activeClass = pair.signature === activeSignature ? ' active' : '';
        const pressed = pair.signature === activeSignature ? 'true' : 'false';
        return `
            <article class="pair-alt-card${activeClass}" data-signature="${escapeHtml(pair.signature)}" role="button" tabindex="0" aria-pressed="${pressed}">
                <p class="pair-alt-title">${index + 1}. ${escapeHtml(pair.primary.name)} + ${escapeHtml(pair.secondary.name)}</p>
                <p class="pair-alt-meta">Score ${escapeHtml(String(roundTo(pair.score, 2)))} | ${escapeHtml(pair.reasons[0] || 'Combinação balanceada')}</p>
            </article>
        `;
    }).join('');
}

function renderApplicationPlan(plan) {
    const target = document.getElementById('applicationPlan');
    if (!target) {
        return;
    }

    const tokens = Array.isArray(plan?.tokens) ? plan.tokens : [];
    if (!tokens.length) {
        target.innerHTML = '<p class="summary">Sem plano de aplicação no momento.</p>';
        return;
    }

    target.innerHTML = tokens.map((item) => `
        <article class="plan-item">
            <small>${escapeHtml(String(item.label || '-'))}</small>
            <strong>${escapeHtml(String(item.value || '-'))}</strong>
        </article>
    `).join('');
}

function renderGuidance(guidance) {
    const riskTarget = document.getElementById('riskAlerts');
    const actionTarget = document.getElementById('usageGuidelines');
    if (!riskTarget || !actionTarget) {
        return;
    }

    const risks = Array.isArray(guidance?.risks) && guidance.risks.length
        ? guidance.risks
        : ['Sem alertas críticos no momento.'];
    const actions = Array.isArray(guidance?.actions) && guidance.actions.length
        ? guidance.actions
        : ['Sem ações sugeridas no momento.'];

    riskTarget.innerHTML = risks.map((item) => `<li>${escapeHtml(String(item))}</li>`).join('');
    actionTarget.innerHTML = actions.map((item) => `<li>${escapeHtml(String(item))}</li>`).join('');
}

function buildProfilePayload() {
    if (!latestRecommendation || !latestRecommendation.selectedPair) {
        return null;
    }

    const recommendation = latestRecommendation;
    const pair = recommendation.selectedPair;
    const criteria = recommendation.criteria;

    return {
        industry: criteria.industry,
        tone: criteria.tone,
        channel: criteria.channel,
        readability: criteria.readability,
        pairingStyle: criteria.pairingStyle,
        brandPersonality: criteria.brandPersonality,
        contentScale: criteria.contentScale,
        hierarchyStyle: criteria.hierarchyStyle,
        fontContrast: criteria.fontContrast,
        notes: criteria.notes || '',
        sampleHeadline: criteria.sampleHeadline || '',
        sampleBody: criteria.sampleBody || '',
        primaryFontKey: pair.primary.key,
        primaryFontName: pair.primary.name,
        secondaryFontKey: pair.secondary.key,
        secondaryFontName: pair.secondary.name,
        selectedPair: {
            primaryKey: pair.primary.key,
            secondaryKey: pair.secondary.key,
            signature: pair.signature,
            score: roundTo(pair.score, 2),
            summary: pair.summary,
            reasons: Array.isArray(pair.reasons) ? pair.reasons.slice(0, 4) : []
        },
        pairAlternatives: recommendation.pairOptions.slice(0, 5).map((item) => ({
            signature: item.signature,
            primaryKey: item.primary.key,
            primaryName: item.primary.name,
            secondaryKey: item.secondary.key,
            secondaryName: item.secondary.name,
            score: roundTo(item.score, 2),
            summary: item.summary
        })),
        confidenceScore: recommendation.confidence.score,
        confidenceLevel: recommendation.confidence.level,
        confidenceLabel: recommendation.confidence.label,
        confidenceDrivers: recommendation.confidence.drivers,
        applicationPlan: recommendation.plan,
        usageGuidelines: recommendation.guidance.actions,
        riskAlerts: recommendation.guidance.risks,
        ranking: recommendation.ranking.slice(0, 10).map((item) => ({
            key: item.key,
            name: item.name,
            score: roundTo(item.score, 2),
            category: item.category,
            readabilityScore: item.readabilityScore,
            reasons: Array.isArray(item.reasons) ? item.reasons.slice(0, 6) : []
        }))
    };
}

function applyTypographyToBrandKit(options = {}) {
    const silent = Boolean(options.silent);
    const api = window.AQBrandKit;
    if (!api || typeof api.syncTypography !== 'function') {
        if (!silent) {
            setSyncStatus('Integração do Brand Kit indisponível no momento.', 'error');
        }
        return;
    }

    const payload = buildProfilePayload();
    if (!payload) {
        if (!silent) {
            setSyncStatus('Gere uma recomendação antes de aplicar ao Brand Kit.', 'error');
        }
        return;
    }

    api.syncTypography(payload, 'fontadvisor');
    if (!silent) {
        setSyncStatus('Tipografia sincronizada com Brand Kit e relatórios.', 'ok');
    }
}

function saveDraftFontProfile() {
    const api = window.AQBrandKit;
    if (!api || typeof api.saveFontProfileState !== 'function') {
        return;
    }

    const payload = buildProfilePayload();
    if (!payload) {
        return;
    }
    api.saveFontProfileState(payload, 'fontadvisor');
}

function exportFontProfile() {
    if (!latestRecommendation) {
        setSyncStatus('Nenhuma recomendação para exportar.', 'error');
        return;
    }

    const payload = {
        generatedAt: latestRecommendation.generatedAt,
        tool: 'Font Strategy Advisor',
        criteria: latestRecommendation.criteria,
        confidence: latestRecommendation.confidence,
        selectedPair: {
            primary: {
                key: latestRecommendation.selectedPair.primary.key,
                name: latestRecommendation.selectedPair.primary.name,
                category: latestRecommendation.selectedPair.primary.category
            },
            secondary: {
                key: latestRecommendation.selectedPair.secondary.key,
                name: latestRecommendation.selectedPair.secondary.name,
                category: latestRecommendation.selectedPair.secondary.category
            },
            score: latestRecommendation.selectedPair.score,
            summary: latestRecommendation.selectedPair.summary,
            reasons: latestRecommendation.selectedPair.reasons
        },
        alternatives: latestRecommendation.pairOptions.slice(0, 5).map((item) => ({
            signature: item.signature,
            primary: item.primary.name,
            secondary: item.secondary.name,
            score: item.score,
            summary: item.summary
        })),
        applicationPlan: latestRecommendation.plan,
        guidance: latestRecommendation.guidance,
        ranking: latestRecommendation.ranking.slice(0, 10).map((item) => ({
            key: item.key,
            name: item.name,
            category: item.category,
            score: item.score,
            readabilityScore: item.readabilityScore,
            reasons: item.reasons
        }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `font-strategy-${timestampForFile(new Date())}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setSyncStatus('Perfil tipográfico exportado com sucesso.', 'ok');
}

function exportFontProfilePdf() {
    if (!latestRecommendation) {
        setSyncStatus('Nenhuma recomendação para exportar em PDF.', 'error');
        return;
    }

    const jsPDFCtor = window.jspdf?.jsPDF;
    if (!jsPDFCtor) {
        setSyncStatus('Biblioteca de PDF indisponivel no momento.', 'error');
        return;
    }

    const recommendation = latestRecommendation;
    const colors = resolveBrandColors();
    const doc = new jsPDFCtor({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const mode = readPdfTemplateMode();
    const modeLabel = mode === 'mini' ? 'Mini Brand Guide' : 'Brandbook Completo';

    drawPdfCoverPage(doc, recommendation, colors, {
        margin,
        pageWidth,
        pageHeight
    }, mode);

    doc.addPage();
    if (mode === 'mini') {
        renderMiniPdfBody(doc, recommendation, colors, { margin, pageWidth });
    } else {
        renderFullPdfBody(doc, recommendation, colors, { margin, pageWidth });
        doc.addPage();
        renderFullPdfAppendix(doc, recommendation, colors, { margin, pageWidth });
    }

    finalizePdfPages(doc, mode, colors);

    const suffix = mode === 'mini' ? 'mini' : 'full';
    const fileName = `font-strategy-${suffix}-${timestampForFile(new Date())}.pdf`;
    doc.save(fileName);
    setSyncStatus(`Perfil tipográfico exportado em PDF (${modeLabel}) com sucesso.`, 'ok');
}

function renderMiniPdfBody(doc, recommendation, colors, layout) {
    const margin = Number(layout?.margin || 40);
    const pageWidth = Number(layout?.pageWidth || 595.28);
    const pair = recommendation.selectedPair;
    const criteria = recommendation.criteria;
    const contentWidth = pageWidth - (margin * 2);
    let y = 44;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Mini Brand Guide - Aplicação Rápida', margin, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.4);
    setPdfTextColorHex(doc, '#4b6284');
    doc.text('Versão executiva para apresentar e aplicar o sistema tipográfico em poucos passos.', margin, y);
    y += 14;

    const cardY = y;
    const cardH = 124;
    setPdfFillColorHex(doc, '#f8fbff');
    doc.setDrawColor(207, 222, 246);
    doc.roundedRect(margin, cardY, contentWidth, cardH, 12, 12, 'FD');

    setPdfTextColorHex(doc, colors.secondary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.2);
    doc.text('Par principal', margin + 14, cardY + 22);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.3);
    doc.text(`${pair.primary.name} + ${pair.secondary.name}`, margin + 14, cardY + 38);

    setPdfTextColorHex(doc, colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    const titleLines = doc.splitTextToSize(
        String(criteria.sampleHeadline || '').trim() || 'Sistema tipográfico com consistência e impacto.',
        contentWidth - 28
    );
    titleLines.slice(0, 2).forEach((line, index) => {
        doc.text(line, margin + 14, cardY + 62 + (index * 18));
    });

    setPdfTextColorHex(doc, '#1e3a8a');
    setPdfFillColorHex(doc, colors.accent, '#dbeafe');
    doc.roundedRect(margin + 14, cardY + cardH - 34, 164, 22, 8, 8, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text(`Confiança ${recommendation.confidence.score}% (${recommendation.confidence.label})`, margin + 22, cardY + cardH - 19);

    drawPdfTinySwatch(doc, margin + contentWidth - 188, cardY + cardH - 32, colors.primary, 'Primaria');
    drawPdfTinySwatch(doc, margin + contentWidth - 118, cardY + cardH - 32, colors.secondary, 'Secundaria');
    drawPdfTinySwatch(doc, margin + contentWidth - 48, cardY + cardH - 32, colors.accent, 'Acento');

    y = cardY + cardH + 16;
    y = writePdfSectionTitle(doc, 'Mapa essencial', margin, y);
    y = writePdfBulletList(doc, [
        `Segmento: ${translateLabel('industry', criteria.industry)}`,
        `Tom: ${translateLabel('tone', criteria.tone)}`,
        `Canal prioritario: ${translateLabel('channel', criteria.channel)}`,
        `Legibilidade alvo: ${translateLabel('readability', criteria.readability)}`,
        `Direcao de pairing: ${translateLabel('pairingStyle', criteria.pairingStyle)}`
    ], margin, y, pageWidth);

    y += 2;
    y = writePdfSectionTitle(doc, 'Top 3 fontes para iniciar', margin, y);
    recommendation.ranking.slice(0, 3).forEach((item, index) => {
        const reason = Array.isArray(item.reasons) && item.reasons.length
            ? item.reasons[0]
            : 'Compatibilidade com diagnóstico atual.';
        y = writePdfBulletList(doc, [
            `${index + 1}. ${item.name} (${translateLabel('category', item.category)}) - Score ${roundTo(item.score, 2)}`,
            `Foco: ${reason}`
        ], margin, y, pageWidth, 9.7);
    });

    y += 2;
    y = writePdfSectionTitle(doc, 'Checklist de ativação', margin, y);
    const actions = (recommendation.guidance?.actions || []).slice(0, 5);
    y = writePdfBulletList(doc, actions, margin, y, pageWidth);
}

function renderFullPdfBody(doc, recommendation, colors, layout) {
    const margin = Number(layout?.margin || 40);
    const pageWidth = Number(layout?.pageWidth || 595.28);
    const pair = recommendation.selectedPair;
    const criteria = recommendation.criteria;
    let y = 44;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.text('Brandbook Completo - Estratégia Tipográfica', margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, y);
    y += 16;
    doc.text(`Par selecionado: ${pair.primary.name} + ${pair.secondary.name}`, margin, y);
    y += 16;

    y = writePdfSectionTitle(doc, 'Diagnóstico', margin, y);
    const diagnosticLines = [
        `Segmento: ${translateLabel('industry', criteria.industry)}`,
        `Tom de voz: ${translateLabel('tone', criteria.tone)}`,
        `Canal: ${translateLabel('channel', criteria.channel)}`,
        `Legibilidade: ${translateLabel('readability', criteria.readability)}`,
        `Estilo de combinação: ${translateLabel('pairingStyle', criteria.pairingStyle)}`,
        `Personalidade: ${translateLabel('brandPersonality', criteria.brandPersonality)}`,
        `Escala de conteúdo: ${translateLabel('contentScale', criteria.contentScale)}`,
        `Hierarquia: ${translateLabel('hierarchyStyle', criteria.hierarchyStyle)}`,
        `Contraste tipográfico: ${translateLabel('fontContrast', criteria.fontContrast)}`
    ];
    y = writePdfBulletList(doc, diagnosticLines, margin, y, pageWidth);

    if (String(criteria.notes || '').trim()) {
        y = ensurePdfSpace(doc, y, 40, margin);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.text('Observações do projeto', margin, y);
        y += 13;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const noteLines = doc.splitTextToSize(String(criteria.notes).trim(), pageWidth - (margin * 2));
        noteLines.forEach((line) => {
            y = ensurePdfSpace(doc, y, 20, margin);
            doc.text(line, margin, y);
            y += 12;
        });
    }

    y += 4;
    y = writePdfSectionTitle(doc, 'Par recomendado e confiança', margin, y);
    y = writePdfBulletList(doc, [
        `Resumo: ${pair.summary}`,
        `Pontuação do par: ${roundTo(pair.score, 2)}`,
        `Confiança: ${recommendation.confidence.score}% (${recommendation.confidence.label})`
    ], margin, y, pageWidth);

    if (Array.isArray(recommendation.confidence.drivers) && recommendation.confidence.drivers.length) {
        y = ensurePdfSpace(doc, y, 24, margin);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('Drivers de confiança', margin, y);
        y += 12;
        doc.setFont('helvetica', 'normal');
        y = writePdfBulletList(doc, recommendation.confidence.drivers.slice(0, 4), margin, y, pageWidth, 10);
    }

    y += 4;
    y = writePdfSectionTitle(doc, 'Top ranking de fontes (fase principal)', margin, y);
    recommendation.ranking.slice(0, 8).forEach((item, index) => {
        const reason = Array.isArray(item.reasons) && item.reasons.length
            ? item.reasons.slice(0, 2).join(' | ')
            : 'Sem regra específica.';
        y = writePdfBulletList(doc, [
            `${index + 1}. ${item.name} (${translateLabel('category', item.category)}) - Score ${roundTo(item.score, 2)} - Legibilidade ${item.readabilityScore}`,
            `Motivos: ${reason}`
        ], margin, y, pageWidth, 9.5);
    });

    y += 4;
    y = writePdfSectionTitle(doc, 'Plano de aplicação (fase 1)', margin, y);
    const planTokens = Array.isArray(recommendation.plan?.tokens) ? recommendation.plan.tokens : [];
    const tokenLines = planTokens.slice(0, 10).map((item) => `${item.label}: ${item.value}`);
    y = writePdfBulletList(doc, tokenLines, margin, y, pageWidth);

    y += 4;
    y = writePdfSectionTitle(doc, 'Riscos e ações sugeridas (go-live)', margin, y);
    const riskLines = (recommendation.guidance?.risks || []).slice(0, 5).map((item) => `Risco: ${item}`);
    const actionLines = (recommendation.guidance?.actions || []).slice(0, 5).map((item) => `Acao: ${item}`);
    y = writePdfBulletList(doc, [...riskLines, ...actionLines], margin, y, pageWidth);

    y += 4;
    y = writePdfSectionTitle(doc, 'Paleta da marca aplicada no preview', margin, y);
    y = ensurePdfSpace(doc, y, 32, margin);
    y = drawPdfSwatch(doc, margin, y, colors.primary, 'Primaria');
    y = drawPdfSwatch(doc, margin + 130, y - 22, colors.secondary, 'Secundaria');
    y = drawPdfSwatch(doc, margin + 260, y - 22, colors.accent, 'Acento');
}

function renderFullPdfAppendix(doc, recommendation, colors, layout) {
    const margin = Number(layout?.margin || 40);
    const pageWidth = Number(layout?.pageWidth || 595.28);
    const criteria = recommendation.criteria;
    const pair = recommendation.selectedPair;
    const planTokens = Array.isArray(recommendation.plan?.tokens) ? recommendation.plan.tokens : [];
    let y = 44;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.text('Anexo Técnico - Implementação', margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.2);
    doc.text('Detalhamento para design system, UI e materiais institucionais.', margin, y);
    y += 16;

    y = writePdfSectionTitle(doc, 'Estrutura sugerida de hierarquia', margin, y);
    const hierarchyLines = [
        `Display: ${pair.primary.name} em pesos 600-700`,
        `Titulos H1/H2: ${pair.primary.name} com tracking entre -1 e 0`,
        `Subtítulos: ${pair.secondary.name} peso 500`,
        `Corpo de texto: ${pair.secondary.name} peso 400-500`,
        `Legenda e metadados: ${pair.secondary.name} peso 400 com contraste alto`
    ];
    y = writePdfBulletList(doc, hierarchyLines, margin, y, pageWidth);

    y += 4;
    y = writePdfSectionTitle(doc, 'Matriz de aplicação por canal', margin, y);
    y = writePdfBulletList(doc, [
        `Digital: ${translateLabel('readability', criteria.readability)} | foco em performance e consistência.`,
        `Impresso: reforçar ${pair.primary.name} em títulos e ${pair.secondary.name} em corpo.`,
        `Social e anúncios: usar combinações curtas com contraste ${translateLabel('fontContrast', criteria.fontContrast)}.`,
        `Apresentações: manter escala regular e limitar a 2 famílias simultâneas.`
    ], margin, y, pageWidth);

    y += 4;
    y = writePdfSectionTitle(doc, 'Top ranking ampliado', margin, y);
    recommendation.ranking.slice(0, 12).forEach((item, index) => {
        const brief = Array.isArray(item.reasons) && item.reasons.length
            ? item.reasons[0]
            : 'Sem justificativa adicional.';
        y = writePdfBulletList(doc, [
            `${index + 1}. ${item.name} - Score ${roundTo(item.score, 2)} - ${brief}`
        ], margin, y, pageWidth, 9.5);
    });

    y += 4;
    y = writePdfSectionTitle(doc, 'Tokens recomendados para handoff', margin, y);
    const tokenLines = planTokens.slice(0, 14).map((item) => `${item.label}: ${item.value}`);
    y = writePdfBulletList(doc, tokenLines, margin, y, pageWidth, 9.6);

    y += 4;
    y = writePdfSectionTitle(doc, 'Checklist de QA tipográfico', margin, y);
    y = writePdfBulletList(doc, [
        'Validar contraste mínimo AA em componentes de texto.',
        'Conferir fallback das famílias em navegadores sem webfont.',
        'Checar consistência de pesos (400/500/600/700) entre web e PDF.',
        'Verificar overflow em cards, tabelas e headers com textos longos.',
        'Confirmar que exportadores (PDF/JSON) estao com os mesmos tokens ativos.'
    ], margin, y, pageWidth);
}

function writePdfSectionTitle(doc, title, margin, y) {
    y = ensurePdfSpace(doc, y, 26, margin);
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

function writePdfBulletList(doc, lines, margin, y, pageWidth, fontSize = 10) {
    const maxWidth = pageWidth - (margin * 2) - 8;
    const safeLines = Array.isArray(lines) ? lines : [];
    doc.setFontSize(fontSize);
    safeLines.forEach((line) => {
        const raw = String(line || '').trim();
        if (!raw) {
            return;
        }
        const wrapped = doc.splitTextToSize(`- ${raw}`, maxWidth);
        wrapped.forEach((chunk) => {
            y = ensurePdfSpace(doc, y, 20, margin);
            doc.text(chunk, margin, y);
            y += 12;
        });
    });
    doc.setFontSize(10);
    return y;
}

function drawPdfSwatch(doc, x, y, color, label) {
    const safeColor = normalizeHexValue(color, '#1d4ed8').replace('#', '');
    const r = parseInt(safeColor.slice(0, 2), 16);
    const g = parseInt(safeColor.slice(2, 4), 16);
    const b = parseInt(safeColor.slice(4, 6), 16);

    doc.setFillColor(r, g, b);
    doc.rect(x, y, 22, 22, 'F');
    doc.setDrawColor(180, 190, 210);
    doc.rect(x, y, 22, 22);
    doc.setTextColor(17, 24, 39);
    doc.text(`${label}: #${safeColor.toUpperCase()}`, x + 28, y + 15);
    return y + 22;
}

function ensurePdfSpace(doc, y, neededHeight, margin) {
    const maxY = 802;
    if (y + neededHeight <= maxY) {
        return y;
    }
    doc.addPage();
    return margin + 8;
}

function drawPdfCoverPage(doc, recommendation, colors, layout, mode = 'full') {
    const margin = Number(layout?.margin || 40);
    const pageWidth = Number(layout?.pageWidth || 595.28);
    const pageHeight = Number(layout?.pageHeight || 841.89);
    const pair = recommendation?.selectedPair || null;
    const criteria = recommendation?.criteria || {};
    const confidence = recommendation?.confidence || { score: 0, label: 'Média' };
    const generatedAt = recommendation?.generatedAt
        ? new Date(recommendation.generatedAt)
        : new Date();
    const generatedLabel = Number.isNaN(generatedAt.getTime())
        ? new Date().toLocaleString('pt-BR')
        : generatedAt.toLocaleString('pt-BR');

    if (mode === 'mini') {
        drawPdfMiniCoverPage(doc, recommendation, colors, {
            margin,
            pageWidth,
            pageHeight
        });
        return;
    }

    const headline = String(criteria.sampleHeadline || '').trim() || 'Sistema tipográfico consolidado';
    const body = String(criteria.sampleBody || '').trim()
        || 'Guia visual para manter consistência entre interface, materiais institucionais e campanhas.';
    const pairLabel = pair
        ? `${pair.primary.name} + ${pair.secondary.name}`
        : 'Par não definido';
    const quickRows = [
        'Formato: Brandbook Completo',
        `Segmento: ${translateLabel('industry', criteria.industry)}`,
        `Tom: ${translateLabel('tone', criteria.tone)}`,
        `Canal: ${translateLabel('channel', criteria.channel)}`,
        `Legibilidade: ${translateLabel('readability', criteria.readability)}`,
        `Estilo: ${translateLabel('pairingStyle', criteria.pairingStyle)}`
    ];
    const checklist = [
        `Personalidade: ${translateLabel('brandPersonality', criteria.brandPersonality)}`,
        `Escala de conteúdo: ${translateLabel('contentScale', criteria.contentScale)}`,
        `Hierarquia: ${translateLabel('hierarchyStyle', criteria.hierarchyStyle)}`,
        `Contraste tipográfico: ${translateLabel('fontContrast', criteria.fontContrast)}`
    ];

    const usableWidth = pageWidth - (margin * 2);
    const heroHeight = 184;
    const cardGap = 12;
    const mainCardWidth = 322;
    const sideCardWidth = usableWidth - mainCardWidth - cardGap;

    setPdfFillColorHex(doc, '#ffffff');
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    setPdfFillColorHex(doc, colors.primary);
    doc.rect(0, 0, pageWidth, heroHeight, 'F');
    setPdfFillColorHex(doc, colors.secondary);
    doc.rect(0, heroHeight - 5, pageWidth, 5, 'F');

    const heroTextColor = pickReadableTextColor(colors.primary);
    setPdfTextColorHex(doc, heroTextColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('QUOTIA | Font Strategy Advisor | Full Report', margin, 38);
    doc.setFontSize(31);
    doc.text('Brandbook Completo', margin, 86);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const heroSubtitle = doc.splitTextToSize(
        'Relatório completo para validação tipográfica, handoff e governança da marca.',
        usableWidth
    );
    heroSubtitle.forEach((line, index) => {
        doc.text(line, margin, 110 + (index * 13));
    });

    const tagX = pageWidth - margin - 158;
    setPdfFillColorHex(doc, '#dbeafe');
    doc.setDrawColor(255, 255, 255);
    doc.roundedRect(tagX, 26, 158, 30, 8, 8, 'FD');
    setPdfTextColorHex(doc, heroTextColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Gerado em ${generatedLabel}`, tagX + 10, 45);

    const mainCardX = margin;
    const mainCardY = 220;
    const mainCardHeight = 294;
    setPdfFillColorHex(doc, '#ffffff');
    doc.setDrawColor(207, 222, 246);
    doc.roundedRect(mainCardX, mainCardY, mainCardWidth, mainCardHeight, 12, 12, 'FD');

    setPdfTextColorHex(doc, colors.secondary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Pairing principal', mainCardX + 16, mainCardY + 24);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.2);
    doc.text(pairLabel, mainCardX + 16, mainCardY + 40);

    setPdfTextColorHex(doc, colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(21);
    const headlineLines = doc.splitTextToSize(headline, mainCardWidth - 32);
    headlineLines.slice(0, 3).forEach((line, index) => {
        doc.text(line, mainCardX + 16, mainCardY + 76 + (index * 24));
    });

    setPdfTextColorHex(doc, colors.secondary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const bodyLines = doc.splitTextToSize(body, mainCardWidth - 32);
    bodyLines.slice(0, 6).forEach((line, index) => {
        doc.text(line, mainCardX + 16, mainCardY + 154 + (index * 14));
    });

    const chipY = mainCardY + mainCardHeight - 54;
    setPdfFillColorHex(doc, colors.accent, '#dbeafe');
    doc.setDrawColor(189, 208, 240);
    doc.roundedRect(mainCardX + 16, chipY, 140, 26, 8, 8, 'FD');
    setPdfTextColorHex(doc, '#1e3a8a');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Confiança ${confidence.score}%`, mainCardX + 28, chipY + 17);

    const swatchY = chipY + 2;
    drawPdfTinySwatch(doc, mainCardX + 172, swatchY, colors.primary, 'Primária');
    drawPdfTinySwatch(doc, mainCardX + 244, swatchY, colors.secondary, 'Secundária');

    const sideX = mainCardX + mainCardWidth + cardGap;
    const sideCardHeight = 90;
    const side2Y = mainCardY + sideCardHeight + 10;
    const side3Y = side2Y + sideCardHeight + 10;

    drawPdfMetricCard(doc, {
        x: sideX,
        y: mainCardY,
        width: sideCardWidth,
        height: sideCardHeight,
        label: 'Índice de confiança',
        value: `${confidence.score}% (${confidence.label})`,
        accent: colors.primary
    });

    drawPdfMetricCard(doc, {
        x: sideX,
        y: side2Y,
        width: sideCardWidth,
        height: sideCardHeight,
        label: 'Direção tipográfica',
        value: translateLabel('pairingStyle', criteria.pairingStyle),
        accent: colors.secondary
    });

    drawPdfMetricCard(doc, {
        x: sideX,
        y: side3Y,
        width: sideCardWidth,
        height: sideCardHeight,
        label: 'Alternativas de pairing',
        value: String(Array.isArray(recommendation.pairOptions) ? recommendation.pairOptions.length : 0),
        accent: colors.primary
    });

    const panelY = 542;
    const panelHeight = 220;
    setPdfFillColorHex(doc, '#f8fbff');
    doc.setDrawColor(207, 222, 246);
    doc.roundedRect(margin, panelY, usableWidth, panelHeight, 12, 12, 'FD');

    setPdfTextColorHex(doc, colors.secondary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Snapshot rápido de decisão', margin + 16, panelY + 24);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    quickRows.forEach((line, index) => {
        doc.text(`- ${line}`, margin + 16, panelY + 44 + (index * 15));
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.6);
    doc.text('Checklist operacional', margin + 16, panelY + 132);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    checklist.forEach((line, index) => {
        doc.text(`- ${line}`, margin + 16, panelY + 150 + (index * 14));
    });
}

function drawPdfMiniCoverPage(doc, recommendation, colors, layout) {
    const margin = Number(layout?.margin || 40);
    const pageWidth = Number(layout?.pageWidth || 595.28);
    const pageHeight = Number(layout?.pageHeight || 841.89);
    const usableWidth = pageWidth - (margin * 2);
    const pair = recommendation?.selectedPair || null;
    const criteria = recommendation?.criteria || {};
    const confidence = recommendation?.confidence || { score: 0, label: 'Média' };
    const generatedAt = recommendation?.generatedAt
        ? new Date(recommendation.generatedAt)
        : new Date();
    const generatedLabel = Number.isNaN(generatedAt.getTime())
        ? new Date().toLocaleString('pt-BR')
        : generatedAt.toLocaleString('pt-BR');

    const headline = String(criteria.sampleHeadline || '').trim() || 'Mini brand guide pronto para uso.';
    const support = String(criteria.sampleBody || '').trim()
        || 'Guia rápido para aplicar tipografia com consistência em todos os canais.';
    const pairLabel = pair
        ? `${pair.primary.name} + ${pair.secondary.name}`
        : 'Par não definido';

    setPdfFillColorHex(doc, '#ffffff');
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    setPdfFillColorHex(doc, colors.primary);
    doc.roundedRect(margin, 64, usableWidth, 220, 18, 18, 'F');
    setPdfFillColorHex(doc, colors.secondary);
    doc.roundedRect(margin + 20, 84, usableWidth - 40, 182, 14, 14, 'F');

    setPdfTextColorHex(doc, pickReadableTextColor(colors.secondary));
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('QUOTIA | MINI BRAND GUIDE', margin + 38, 116);
    doc.setFontSize(29);
    doc.text('Tipografia Essencial', margin + 38, 154);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.6);
    doc.text(`Gerado em ${generatedLabel}`, margin + 38, 178);

    const subtitleLines = doc.splitTextToSize(
        'Documento compacto para aprovações rápidas e alinhamento entre design, produto e marketing.',
        usableWidth - 80
    );
    subtitleLines.slice(0, 3).forEach((line, index) => {
        doc.text(line, margin + 38, 198 + (index * 13));
    });

    setPdfFillColorHex(doc, '#ffffff');
    doc.setDrawColor(207, 222, 246);
    doc.roundedRect(margin, 320, usableWidth, 182, 12, 12, 'FD');

    setPdfTextColorHex(doc, colors.secondary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.4);
    doc.text('Resumo rápido', margin + 16, 344);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.2);
    doc.text(`Par principal: ${pairLabel}`, margin + 16, 362);
    doc.text(`Confiança: ${confidence.score}% (${confidence.label})`, margin + 16, 378);
    doc.text(`Segmento: ${translateLabel('industry', criteria.industry)}`, margin + 16, 394);
    doc.text(`Tom: ${translateLabel('tone', criteria.tone)}`, margin + 16, 410);
    doc.text(`Canal foco: ${translateLabel('channel', criteria.channel)}`, margin + 16, 426);

    const headlineLines = doc.splitTextToSize(headline, usableWidth - 220);
    setPdfTextColorHex(doc, colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15.4);
    headlineLines.slice(0, 2).forEach((line, index) => {
        doc.text(line, margin + 220, 360 + (index * 20));
    });
    setPdfTextColorHex(doc, '#334155');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const supportLines = doc.splitTextToSize(support, usableWidth - 220);
    supportLines.slice(0, 5).forEach((line, index) => {
        doc.text(line, margin + 220, 404 + (index * 13));
    });

    drawPdfTinySwatch(doc, margin + 16, 464, colors.primary, 'Primaria');
    drawPdfTinySwatch(doc, margin + 92, 464, colors.secondary, 'Secundaria');
    drawPdfTinySwatch(doc, margin + 176, 464, colors.accent, 'Acento');

    setPdfFillColorHex(doc, '#f8fbff');
    doc.setDrawColor(207, 222, 246);
    doc.roundedRect(margin, 528, usableWidth, 224, 12, 12, 'FD');
    setPdfTextColorHex(doc, colors.secondary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.4);
    doc.text('Checklist de decisão', margin + 16, 552);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const checkRows = [
        `Legibilidade: ${translateLabel('readability', criteria.readability)}`,
        `Pairing: ${translateLabel('pairingStyle', criteria.pairingStyle)}`,
        `Personalidade: ${translateLabel('brandPersonality', criteria.brandPersonality)}`,
        `Escala de conteúdo: ${translateLabel('contentScale', criteria.contentScale)}`,
        `Hierarquia: ${translateLabel('hierarchyStyle', criteria.hierarchyStyle)}`,
        `Contraste: ${translateLabel('fontContrast', criteria.fontContrast)}`
    ];
    checkRows.forEach((line, index) => {
        doc.text(`- ${line}`, margin + 16, 572 + (index * 16));
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.2);
    setPdfTextColorHex(doc, '#1e3a8a');
    doc.text('Proxima etapa: aplicar os tokens no Brand Kit e revisar o preview de manual.', margin + 16, 716);

    setPdfFillColorHex(doc, colors.secondary);
    doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
}

function finalizePdfPages(doc, mode, colors) {
    const modeLabel = mode === 'mini' ? 'Mini Brand Guide' : 'Brandbook Completo';
    const total = typeof doc.getNumberOfPages === 'function'
        ? doc.getNumberOfPages()
        : doc.internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let page = 1; page <= total; page += 1) {
        doc.setPage(page);
        doc.setDrawColor(212, 224, 245);
        doc.line(40, pageHeight - 34, pageWidth - 40, pageHeight - 34);
        setPdfTextColorHex(doc, '#4b6284');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.text(`Quotia Font Strategy | ${modeLabel}`, 40, pageHeight - 19);
        doc.text(`Página ${page}/${total}`, pageWidth - 40, pageHeight - 19, { align: 'right' });

        const swatchBaseX = pageWidth - 110;
        [colors.primary, colors.secondary, colors.accent].forEach((swatchColor, index) => {
            const rgb = hexToRgb(normalizeHexValue(swatchColor, '#1d4ed8'));
            const x = swatchBaseX + (index * 18);
            doc.setFillColor(rgb.r, rgb.g, rgb.b);
            doc.rect(x, pageHeight - 27, 12, 8, 'F');
            doc.setDrawColor(189, 208, 240);
            doc.rect(x, pageHeight - 27, 12, 8);
        });
    }
}

function drawPdfMetricCard(doc, config) {
    const x = Number(config?.x || 0);
    const y = Number(config?.y || 0);
    const width = Number(config?.width || 120);
    const height = Number(config?.height || 70);
    const label = String(config?.label || '');
    const value = String(config?.value || '-');
    const accent = String(config?.accent || '#1d4ed8');

    setPdfFillColorHex(doc, '#ffffff');
    doc.setDrawColor(207, 222, 246);
    doc.roundedRect(x, y, width, height, 10, 10, 'FD');

    setPdfFillColorHex(doc, accent, '#1d4ed8');
    doc.roundedRect(x + 10, y + 12, 4, height - 24, 2, 2, 'F');

    setPdfTextColorHex(doc, '#334155');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.6);
    doc.text(label, x + 22, y + 26);

    setPdfTextColorHex(doc, '#0f172a');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.2);
    const wrapped = doc.splitTextToSize(value, width - 34);
    wrapped.slice(0, 3).forEach((line, index) => {
        doc.text(line, x + 22, y + 46 + (index * 13));
    });
}

function setPdfFillColorHex(doc, hex, fallback = '#000000') {
    const rgb = hexToRgb(normalizeHexValue(hex, fallback));
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
}

function setPdfTextColorHex(doc, hex, fallback = '#000000') {
    const rgb = hexToRgb(normalizeHexValue(hex, fallback));
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
}

function drawPdfTinySwatch(doc, x, y, color, label) {
    const rgb = hexToRgb(normalizeHexValue(color, '#1d4ed8'));
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(x, y, 16, 16, 'F');
    doc.setDrawColor(180, 190, 210);
    doc.rect(x, y, 16, 16);
    setPdfTextColorHex(doc, '#334155');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(label, x + 20, y + 12);
}

function resolveBrandColors() {
    const fallback = {
        primary: '#1d4ed8',
        secondary: '#334155',
        accent: '#dbeafe',
        background: '#eef5ff',
        surface: '#ffffff'
    };
    const api = window.AQBrandKit;
    if (!api || typeof api.getIntegrationSnapshot !== 'function') {
        return fallback;
    }

    const snapshot = api.getIntegrationSnapshot();
    const colors = snapshot?.brandKit?.brandColors || {};
    return {
        primary: api.normalizeHex(colors.primary, fallback.primary),
        secondary: api.normalizeHex(colors.secondary, fallback.secondary),
        accent: api.normalizeHex(colors.accent, fallback.accent),
        background: api.normalizeHex(colors.accent, fallback.background),
        surface: api.normalizeHex(colors.neutral, fallback.surface)
    };
}

function pickReadableTextColor(background) {
    const dark = '#0f172a';
    const light = '#ffffff';
    const darkRatio = getContrastRatio(background, dark);
    const lightRatio = getContrastRatio(background, light);
    return darkRatio >= lightRatio ? dark : light;
}

function getContrastRatio(hexA, hexB) {
    const l1 = getRelativeLuminance(hexA);
    const l2 = getRelativeLuminance(hexB);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    const channels = [rgb.r, rgb.g, rgb.b].map((value) => {
        const normalized = value / 255;
        return normalized <= 0.03928
            ? normalized / 12.92
            : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function hexToRgb(hex) {
    const normalized = normalizeHexValue(hex, '#000000').replace('#', '');
    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16)
    };
}

function normalizeHexValue(value, fallback = '#000000') {
    const hex = String(value || '').trim();
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
        return hex;
    }
    if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
        return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return fallback;
}

function normalizeHierarchyStyle(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'dramatica' || raw === 'dramática') return 'dramatica';
    if (raw === 'compacta') return 'compacta';
    return 'equilibrada';
}

function normalizePdfTemplateMode(value) {
    return String(value || '').trim().toLowerCase() === 'mini' ? 'mini' : 'full';
}

function readPdfTemplateMode() {
    try {
        const stored = window.localStorage?.getItem(FONT_PDF_TEMPLATE_KEY);
        if (String(stored || '').trim().toLowerCase() === 'mini') {
            return 'mini';
        }
    } catch (error) {
        /* noop */
    }

    const selectValue = String(document.getElementById('fontPdfTemplate')?.value || '').trim().toLowerCase();
    return selectValue === 'mini' ? 'mini' : 'full';
}

function persistPdfTemplateMode(value) {
    const normalized = normalizePdfTemplateMode(value);
    const select = document.getElementById('fontPdfTemplate');
    if (select && select.value !== normalized) {
        select.value = normalized;
    }

    try {
        window.localStorage?.setItem(FONT_PDF_TEMPLATE_KEY, normalized);
    } catch (error) {
        /* noop: browser privacy mode/localStorage disabled */
    }
    return normalized;
}

function syncFontPdfExportButton(mode) {
    const button = document.getElementById('exportFontProfilePdfBtn');
    if (!(button instanceof HTMLButtonElement)) {
        return;
    }
    const normalized = normalizePdfTemplateMode(mode);
    const isMini = normalized === 'mini';
    const label = isMini ? 'Exportar Mini PDF' : 'Exportar PDF Completo';
    const title = isMini
        ? 'Exportar Mini Brand Guide em PDF'
        : 'Exportar Brandbook Completo em PDF';

    button.textContent = label;
    button.setAttribute('aria-label', title);
    button.setAttribute('title', title);
    button.dataset.pdfMode = normalized;
}

function translateLabel(group, key) {
    const source = LABELS[group] || {};
    const normalizedKey = String(key || '').trim();
    return source[normalizedKey] || normalizedKey || '-';
}

function getFieldValue(id, fallback = '') {
    const element = document.getElementById(id);
    if (!element) {
        return fallback;
    }
    const value = String(element.value || '').trim();
    return value || fallback;
}

function setFieldValue(id, value) {
    const element = document.getElementById(id);
    if (!element) {
        return;
    }
    const normalized = String(value || '').trim();

    if (element.tagName === 'SELECT') {
        if (!normalized) {
            return;
        }
        const hasOption = Array.from(element.options).some((option) => option.value === normalized);
        if (hasOption) {
            element.value = normalized;
        }
        return;
    }
    element.value = normalized;
}

function setSyncStatus(message, level = '') {
    const target = document.getElementById('fontSyncStatus');
    if (!target) {
        return;
    }
    target.textContent = String(message || '');
    target.classList.remove('ok', 'error');
    if (level === 'ok') target.classList.add('ok');
    if (level === 'error') target.classList.add('error');
}

function uniqueTextList(items, maxItems = 10) {
    const seen = new Set();
    const output = [];
    (Array.isArray(items) ? items : []).forEach((item) => {
        const text = String(item || '').trim();
        if (!text) return;
        const key = text.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        output.push(text);
    });
    return output.slice(0, maxItems);
}

function hasIntersection(a, b) {
    const set = new Set(Array.isArray(a) ? a : []);
    return (Array.isArray(b) ? b : []).some((item) => set.has(item));
}

function clamp01(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    return Math.min(1, Math.max(0, numeric));
}

function roundTo(value, precision = 2) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    const digits = Math.max(0, Math.min(6, Number(precision) || 2));
    const factor = 10 ** digits;
    return Math.round(numeric * factor) / factor;
}

function timestampForFile(date) {
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


