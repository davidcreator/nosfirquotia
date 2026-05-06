const SAVED_EDITS_STORAGE_KEY = 'mockuphub_saved_edits_v1';
const WORK_INFO_STORAGE_KEY = 'mockuphub_work_info_v1';
const OG_SETTINGS_STORAGE_KEY = 'ogImageSettings';
const BRAND_MANUAL_CACHE_KEY = 'brand_manual_mvp_latest_v1';
const BRAND_MANUAL_TEMPLATE_KEY = 'brand_manual_mvp_template_v1';
const BRAND_MANUAL_PDF_TEMPLATE_KEY = 'brand_manual_mvp_pdf_template_v1';
const BRAND_MANUAL_CUSTOM_TEMPLATE_KEY = 'brand_manual_mvp_custom_templates_v1';
const BRAND_MANUAL_CUSTOM_TEMPLATE_EXPORT_SCHEMA = 'brand_manual_custom_templates_v1';
const BRAND_MANUAL_CUSTOM_TEMPLATE_BACKUP_KEY = 'brand_manual_mvp_custom_templates_backup_v1';
const BRAND_MANUAL_CUSTOM_TEMPLATE_BACKUP_SCHEMA = 'brand_manual_custom_templates_backup_v1';
const BRAND_MANUAL_PRACTICAL_SETTINGS_KEY = 'brand_manual_mvp_practical_settings_v1';
const DEFAULT_TEMPLATE_ID = 'mono_arc';
const NOT_DEFINED_LABEL = 'Não definido';
const CUSTOM_TEMPLATE_ID_PREFIX = 'custom_';
const BOOK_MODE_COMPLETE = 'complete';
const BOOK_MODE_MINI = 'mini';
const SMART_TEMPLATE_METHOD_DEFAULT = 'smart_auto';
const MINI_GUIDE_VARIANT_DEFAULT = 'corporate';
const MINI_GUIDE_PRESET_NONE = 'none';
const TEMPLATE_COLOR_LIMIT = 6;
const TEMPLATE_COLOR_INPUT_IDS = [
    'customTemplateColor1',
    'customTemplateColor2',
    'customTemplateColor3',
    'customTemplateColor4',
    'customTemplateColor5',
    'customTemplateColor6'
];

const MINI_GUIDE_PRESETS = {
    brand_snapshot: {
        id: 'brand_snapshot',
        label: 'Brand Snapshot',
        smartMethod: 'smart_identity',
        miniGuideVariant: 'corporate',
        structure: ['mini_board', 'palette', 'typography', 'logo_system'],
        kicker: 'Mini Brand Snapshot',
        closing: 'Resumo rápido para alinhamento interno do projeto.'
    },
    pitch: {
        id: 'pitch',
        label: 'Pitch Deck',
        smartMethod: 'smart_identity',
        miniGuideVariant: 'editorial',
        structure: ['mini_board', 'palette', 'typography', 'closing'],
        kicker: 'Mini Pitch Brand Guide',
        closing: 'Estrutura objetiva para apresentação de proposta e validação.'
    },
    social_campaign: {
        id: 'social_campaign',
        label: 'Social Campaign',
        smartMethod: 'smart_showcase',
        miniGuideVariant: 'social',
        structure: ['mini_board', 'palette', 'mockups', 'digital'],
        kicker: 'Mini Social Campaign Guide',
        closing: 'Diretriz condensada para campanhas e desdobramentos sociais.'
    }
};

const COLOR_ROLE_LABELS = ['Primária', 'Secundária', 'Acento', 'Neutra', 'Apoio 1', 'Apoio 2', 'Apoio 3'];
const PLAYBOOK_CHANNELS = ['web', 'social', 'ads', 'print', 'presentation'];
const PLAYBOOK_ASSETS = ['logo_color', 'logo_reverse', 'logo_bw', 'palette_tokens', 'social_templates', 'pdf_manual'];
const BUILDER_SPAN_FULL = 12;
const BUILDER_SPAN_HALF = 6;
const DESIGN_STUDIO_SCHEMA = 'brand_manual_design_studio_v1';
const DESIGN_CANVAS_WIDTH = 1200;
const DESIGN_CANVAS_HEIGHT = 760;
const DESIGN_MIN_ELEMENT_SIZE = 24;
const DESIGN_ELEMENT_TYPES = [
    'title',
    'subtitle',
    'text',
    'bullet_list',
    'shape',
    'shape_rect',
    'shape_round_rect',
    'shape_parallelogram',
    'shape_trapezoid',
    'shape_ellipse',
    'shape_triangle',
    'shape_diamond',
    'shape_pentagon',
    'shape_hexagon',
    'shape_octagon',
    'shape_star',
    'shape_heart',
    'shape_cloud',
    'shape_line',
    'shape_arrow_right',
    'shape_arrow_left',
    'shape_arrow_up',
    'shape_arrow_down',
    'shape_chevron_right',
    'shape_chevron_left',
    'logo_box',
    'color_row',
    'mockup_slot',
    'cta_button',
    'divider',
    'stat_card',
    'tag_chip',
    'info_card',
    'quote_block',
    'timeline_step',
    'comparison_card'
];
const DESIGN_SHAPE_ONLY_TYPES = [
    'shape',
    'shape_rect',
    'shape_round_rect',
    'shape_parallelogram',
    'shape_trapezoid',
    'shape_ellipse',
    'shape_triangle',
    'shape_diamond',
    'shape_pentagon',
    'shape_hexagon',
    'shape_octagon',
    'shape_star',
    'shape_heart',
    'shape_cloud',
    'shape_line',
    'shape_arrow_right',
    'shape_arrow_left',
    'shape_arrow_up',
    'shape_arrow_down',
    'shape_chevron_right',
    'shape_chevron_left'
];
const DESIGN_TEXT_TOKEN_HINT = '{{project.title}}';
const DESIGN_KEYBOARD_NUDGE_STEP = 1;
const DESIGN_KEYBOARD_FAST_NUDGE_STEP = 10;
const DESIGN_RESIZE_BUTTON_STEP = 12;
const DESIGN_SNAP_GRID_SIZE = 20;
const DESIGN_SNAP_THRESHOLD = 8;
const DESIGN_SNAP_PRESETS = {
    precision: {
        id: 'precision',
        label: 'Precisão',
        gridEnabled: true,
        elementEnabled: true,
        gridSize: 8,
        threshold: 4
    },
    balanced: {
        id: 'balanced',
        label: 'Equilibrado',
        gridEnabled: true,
        elementEnabled: true,
        gridSize: DESIGN_SNAP_GRID_SIZE,
        threshold: DESIGN_SNAP_THRESHOLD
    },
    free: {
        id: 'free',
        label: 'Livre',
        gridEnabled: false,
        elementEnabled: false,
        gridSize: 24,
        threshold: 12
    }
};
const FIGMA_IMPORT_SCHEMA = 'figma_file_json_v1';
const DEFAULT_FIGMA_NAMING_PRESET_ID = 'balanced';
const FIGMA_NAMING_PRESETS = {
    balanced: {
        moduleAliases: {
            cover: ['cover', 'capa', 'hero', 'abertura'],
            mini_board: ['mini', 'snapshot', 'resumo'],
            index: ['indice', 'index', 'sumario', 'conteudo'],
            palette: ['palette', 'paleta', 'color', 'cores'],
            typography: ['typography', 'tipografia', 'font', 'fonts'],
            logo_system: ['logo', 'logotipo', 'marca'],
            mockups: ['mockup', 'mockups', 'aplicacao', 'application', 'showcase'],
            digital: ['digital', 'og', 'social', 'web'],
            playbook: ['playbook', 'execucao', 'guideline', 'guia'],
            closing: ['closing', 'encerramento', 'final', 'thank']
        },
        elementAliases: {
            title: ['title', 'headline', 'titulo', 'h1'],
            subtitle: ['subtitle', 'subtitulo', 'h2'],
            text: ['text', 'body', 'paragraph', 'descricao', 'copy'],
            bullet_list: ['list', 'bullet', 'checklist'],
            shape: ['shape', 'card', 'panel', 'bloco'],
            shape_rect: ['rect', 'rectangle', 'retangulo'],
            shape_ellipse: ['ellipse', 'circle', 'oval', 'elipse'],
            shape_triangle: ['triangle', 'triangulo'],
            shape_diamond: ['diamond', 'losango', 'rhombus'],
            shape_line: ['line', 'linha', 'divider'],
            logo_box: ['logo', 'logotipo', 'marca'],
            color_row: ['palette', 'paleta', 'color', 'swatch'],
            mockup_slot: ['mockup', 'photo', 'image', 'preview'],
            cta_button: ['cta', 'button', 'botao'],
            divider: ['divider', 'line', 'separador'],
            stat_card: ['kpi', 'stat', 'metric'],
            tag_chip: ['chip', 'tag', 'label'],
            info_card: ['info', 'content', 'card'],
            quote_block: ['quote', 'testimonial', 'citacao'],
            timeline_step: ['timeline', 'step', 'etapa'],
            comparison_card: ['comparison', 'compare', 'antes', 'depois']
        },
        ignoreKeywords: ['hidden', 'guide', 'guides', 'grid', 'temp', 'debug'],
        titleMinSize: 40
    },
    strict_brand: {
        moduleAliases: {
            cover: ['cover', 'capa'],
            mini_board: ['mini', 'snapshot'],
            index: ['indice', 'index'],
            palette: ['palette', 'paleta'],
            typography: ['typography', 'tipografia'],
            logo_system: ['logo', 'logotipo'],
            mockups: ['mockup', 'aplicacao'],
            digital: ['digital', 'og'],
            playbook: ['playbook', 'execucao'],
            closing: ['closing', 'encerramento']
        },
        elementAliases: {
            title: ['title', 'titulo', 'h1'],
            subtitle: ['subtitle', 'subtitulo', 'h2'],
            text: ['text', 'body', 'descricao'],
            bullet_list: ['list', 'bullet'],
            shape: ['shape', 'card'],
            shape_rect: ['rect', 'rectangle'],
            shape_ellipse: ['ellipse', 'circle'],
            shape_triangle: ['triangle'],
            shape_diamond: ['diamond', 'rhombus'],
            shape_line: ['line'],
            logo_box: ['logo'],
            color_row: ['palette', 'color'],
            mockup_slot: ['mockup'],
            cta_button: ['cta', 'button'],
            divider: ['divider', 'line'],
            stat_card: ['kpi', 'stat'],
            tag_chip: ['chip', 'tag'],
            info_card: ['info', 'content'],
            quote_block: ['quote', 'testimonial'],
            timeline_step: ['timeline', 'step'],
            comparison_card: ['comparison', 'compare']
        },
        ignoreKeywords: ['hidden', 'guide', 'grid', 'temp'],
        titleMinSize: 44
    },
    social_campaign: {
        moduleAliases: {
            cover: ['cover', 'hero'],
            mini_board: ['mini', 'snapshot'],
            index: ['index', 'agenda'],
            palette: ['color', 'palette'],
            typography: ['font', 'typography'],
            logo_system: ['logo'],
            mockups: ['post', 'story', 'mockup', 'social'],
            digital: ['social', 'digital', 'feed'],
            playbook: ['guideline', 'playbook'],
            closing: ['closing', 'cta', 'final']
        },
        elementAliases: {
            title: ['headline', 'title', 'hook'],
            subtitle: ['subtitle', 'subheadline'],
            text: ['caption', 'copy', 'text'],
            bullet_list: ['list', 'bullet', 'checklist'],
            shape: ['shape', 'card', 'sticker'],
            shape_rect: ['rect', 'rectangle'],
            shape_ellipse: ['ellipse', 'circle', 'oval'],
            shape_triangle: ['triangle'],
            shape_diamond: ['diamond', 'rhombus'],
            shape_line: ['line'],
            logo_box: ['logo', 'brand'],
            color_row: ['palette', 'color'],
            mockup_slot: ['post', 'story', 'mockup', 'image'],
            cta_button: ['cta', 'button'],
            divider: ['divider', 'line'],
            stat_card: ['kpi', 'metric'],
            tag_chip: ['chip', 'tag', 'sticker'],
            info_card: ['info', 'content', 'card'],
            quote_block: ['quote', 'testimonial'],
            timeline_step: ['timeline', 'step'],
            comparison_card: ['comparison', 'versus']
        },
        ignoreKeywords: ['hidden', 'guide', 'grid'],
        titleMinSize: 36
    },
    product_ui: {
        moduleAliases: {
            cover: ['cover', 'hero', 'landing'],
            mini_board: ['overview', 'snapshot'],
            index: ['index', 'toc'],
            palette: ['tokens', 'color', 'palette'],
            typography: ['type', 'font', 'typography'],
            logo_system: ['brand', 'logo'],
            mockups: ['screen', 'mockup', 'flow'],
            digital: ['ui', 'web', 'mobile'],
            playbook: ['rules', 'playbook'],
            closing: ['handoff', 'closing']
        },
        elementAliases: {
            title: ['headline', 'title', 'h1'],
            subtitle: ['subtitle', 'h2'],
            text: ['label', 'copy', 'body'],
            bullet_list: ['list', 'bullet', 'menu'],
            shape: ['container', 'card', 'panel', 'section'],
            shape_rect: ['rect', 'rectangle'],
            shape_ellipse: ['ellipse', 'circle', 'oval'],
            shape_triangle: ['triangle'],
            shape_diamond: ['diamond', 'rhombus'],
            shape_line: ['line', 'rule'],
            logo_box: ['logo', 'brand'],
            color_row: ['tokens', 'palette', 'swatch'],
            mockup_slot: ['screen', 'mockup', 'device'],
            cta_button: ['button', 'cta', 'action'],
            divider: ['divider', 'line', 'rule'],
            stat_card: ['kpi', 'stat', 'metric'],
            tag_chip: ['chip', 'tag', 'pill'],
            info_card: ['info', 'content', 'card'],
            quote_block: ['quote', 'testimonial'],
            timeline_step: ['timeline', 'step'],
            comparison_card: ['comparison', 'compare']
        },
        ignoreKeywords: ['hidden', 'guide', 'grid', 'measure'],
        titleMinSize: 34
    }
};
const BUILDER_MODULE_HINTS = {
    cover: 'Abertura do projeto e contexto da marca.',
    mini_board: 'Resumo rápido para apresentações curtas.',
    index: 'Navegação das páginas do brandbook.',
    palette: 'Paleta oficial com hierarquia de uso.',
    typography: 'Sistema tipográfico e aplicação.',
    logo_system: 'Regras de uso do logotipo e variações.',
    mockups: 'Aplicações visuais e cenários reais.',
    digital: 'Diretrizes para canais digitais e OG.',
    playbook: 'Plano operacional para execução da marca.',
    closing: 'Fechamento e próximos passos.'
};

const BRANDBOOK_PAGE_STRUCTURE = [
    { id: 'cover', label: 'Capa' },
    { id: 'mini_board', label: 'Mini Brand Guide' },
    { id: 'index', label: 'Índice' },
    { id: 'palette', label: 'Paleta de Cores' },
    { id: 'typography', label: 'Tipografia' },
    { id: 'logo_system', label: 'Sistema de Logo' },
    { id: 'mockups', label: 'Aplicações' },
    { id: 'digital', label: 'Diretriz Digital' },
    { id: 'playbook', label: 'Playbook de Execução' },
    { id: 'closing', label: 'Encerramento' }
];

const FULL_BRANDBOOK_STRUCTURE = [
    'cover',
    'index',
    'palette',
    'typography',
    'logo_system',
    'mockups',
    'digital',
    'playbook',
    'closing'
];

const MINI_BRANDBOOK_STRUCTURE = [
    'mini_board',
    'palette',
    'typography',
    'digital'
];

const TEMPLATE_PRESETS = {
    mono_arc: {
        id: 'mono_arc',
        name: 'Monochrome Arc',
        themeClass: 'theme-mono',
        bookMode: BOOK_MODE_COMPLETE,
        smartMethod: SMART_TEMPLATE_METHOD_DEFAULT,
        miniGuideVariant: MINI_GUIDE_VARIANT_DEFAULT,
        kicker: 'Brand Guidelines',
        fallbackPalette: ['#0f1117', '#f8fafc', '#d1d5db', '#6b7280', '#111827', '#9ca3af'],
        closing: 'Obrigado por construir com a gente.'
    },
    cobalt_grid: {
        id: 'cobalt_grid',
        name: 'Cobalt Grid',
        themeClass: 'theme-cobalt',
        bookMode: BOOK_MODE_COMPLETE,
        smartMethod: SMART_TEMPLATE_METHOD_DEFAULT,
        miniGuideVariant: MINI_GUIDE_VARIANT_DEFAULT,
        kicker: 'Corporate Brandbook',
        fallbackPalette: ['#213fa9', '#f8fbff', '#1f2b45', '#4f6fca', '#8da5f1', '#dfe7ff'],
        closing: 'Obrigado por confiar no processo criativo.'
    },
    crimson_blob: {
        id: 'crimson_blob',
        name: 'Crimson Blob',
        themeClass: 'theme-crimson',
        bookMode: BOOK_MODE_COMPLETE,
        smartMethod: SMART_TEMPLATE_METHOD_DEFAULT,
        miniGuideVariant: MINI_GUIDE_VARIANT_DEFAULT,
        kicker: 'Expressive Brand Guide',
        fallbackPalette: ['#cf132f', '#1f2a44', '#f9fbff', '#f04a61', '#f6b7c1', '#64748b'],
        closing: 'Obrigado por impulsionar uma marca marcante.'
    }
};

const TEMPLATE_THEME_MAP = {
    mono_arc: { themeClass: 'theme-mono', previewClass: 'mono' },
    cobalt_grid: { themeClass: 'theme-cobalt', previewClass: 'cobalt' },
    crimson_blob: { themeClass: 'theme-crimson', previewClass: 'crimson' }
};

let currentContext = {
    payload: null,
    displayMockups: [],
    activeTemplateId: DEFAULT_TEMPLATE_ID,
    brandbookSheets: [],
    practicalSettings: null,
    customTemplates: {},
    builderStructureIds: FULL_BRANDBOOK_STRUCTURE.slice(),
    builderModuleLayout: {},
    selectedBuilderModuleId: '',
    templatePaletteTouched: false,
    previewSync: {
        status: 'idle',
        source: 'init',
        updatedAt: '',
        pages: 0,
        message: 'Aguardando primeira sincronização.'
    },
    designStudio: null,
    designStudioEnabled: false,
    figmaNamingConfig: null,
    designStyleClipboard: null,
    designSnapSettings: {
        gridEnabled: true,
        elementEnabled: true,
        gridSize: DESIGN_SNAP_GRID_SIZE,
        threshold: DESIGN_SNAP_THRESHOLD
    },
    designDragState: {
        active: false,
        mode: 'move',
        resizeHandle: '',
        pointerId: null,
        pageId: '',
        elementId: '',
        pointerStartX: 0,
        pointerStartY: 0,
        elementStartX: 0,
        elementStartY: 0,
        elementStartW: 0,
        elementStartH: 0,
        selectionStartRects: {},
        lastShiftX: 0,
        lastShiftY: 0,
        marqueeStartX: 0,
        marqueeStartY: 0,
        marqueeEndX: 0,
        marqueeEndY: 0,
        marqueeAdditive: false,
        marqueeToggle: false,
        marqueeBaseSelectionIds: [],
        snapGuideX: null,
        snapGuideY: null,
        moved: false
    },
    dragState: {
        moduleId: '',
        sourceRole: '',
        sourceIndex: -1
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadCustomTemplates();
    currentContext.designStudio = createDefaultDesignStudio();
    currentContext.figmaNamingConfig = createDefaultFigmaNamingConfig();
    currentContext.practicalSettings = loadPracticalSettings();
    writePracticalSettingsToForm(currentContext.practicalSettings);
    renderPracticalPlaybook(currentContext.practicalSettings);
    syncCustomTemplateCards();
    updateBackupUiState();
    bindEvents();
    setupDesignStudioRibbon();
    setupDesignInspectorTabs();
    fillFigmaNamingConfigFields(currentContext.figmaNamingConfig);
    renderPreviewSyncBadge();
    restoreTemplateSelection();
    hydrateBrandManualPdfTemplateMode();
    refreshManual();
});

function bindEvents() {
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        refreshManual();
    });

    document.getElementById('copyBtn')?.addEventListener('click', async () => {
        const field = document.getElementById('manualPayload');
        if (!field || !field.value) {
            setStatus('Não há payload para copiar.', 'warn');
            return;
        }
        try {
            await navigator.clipboard.writeText(field.value);
            setStatus('Payload copiado para a área de transferência.', 'ok');
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
        const mode = readBrandManualPdfTemplateMode();
        if (mode === 'mini') {
            exportMiniBrandGuidePdf();
            return;
        }
        exportPdfBrandbookRender();
    });

    document.getElementById('brandManualPdfTemplate')?.addEventListener('change', (event) => {
        const mode = persistBrandManualPdfTemplateMode(event?.target?.value);
        syncBrandManualPdfActionButton(mode);
        setStatus(
            `Modelo PDF selecionado: ${mode === 'mini' ? 'Mini Brand Guide' : 'Brandbook Completo'}.`,
            'ok'
        );
    });

    document.getElementById('printTemplateBtn')?.addEventListener('click', () => {
        printTemplateBrandbook();
    });

    document.getElementById('downloadTemplateHtmlBtn')?.addEventListener('click', () => {
        exportBrandbookHtml();
    });

    document.getElementById('openTemplateRenderBtn')?.addEventListener('click', () => {
        openBrandbookWebRender();
    });

    document.getElementById('previewSyncTestBtn')?.addEventListener('click', () => {
        runPreviewSyncTest();
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

    document.getElementById('createCustomTemplateBtn')?.addEventListener('click', () => {
        saveCustomTemplateFromBuilder();
    });

    document.getElementById('resetBuilderBtn')?.addEventListener('click', () => {
        currentContext.builderStructureIds = getDefaultStructureIds(getSelectedBookMode());
        syncDesignStudioAfterStructureChange(true);
        renderTemplateBuilder();
        updateTemplateStrategyHint();
        refreshBrandbookPreviewFromBuilder();
        setStatus('Estrutura padrão restaurada no Template Builder.', 'ok');
    });

    document.getElementById('removeCustomTemplateBtn')?.addEventListener('click', () => {
        removeActiveCustomTemplate();
    });

    document.getElementById('duplicateCustomTemplateBtn')?.addEventListener('click', () => {
        duplicateActiveTemplate();
    });

    document.getElementById('applySmartTemplateBtn')?.addEventListener('click', () => {
        applySmartTemplateStructure();
    });

    document.getElementById('applyMiniPresetBtn')?.addEventListener('click', () => {
        applyMiniGuidePreset(getSelectedMiniPresetId(), { warnIfNone: true });
    });

    document.getElementById('exportCustomTemplatesBtn')?.addEventListener('click', () => {
        exportCustomTemplatesJson();
    });

    document.getElementById('createTemplateBackupBtn')?.addEventListener('click', () => {
        createManualTemplateBackup();
    });

    document.getElementById('restoreTemplateBackupBtn')?.addEventListener('click', () => {
        restoreTemplateBackup();
    });

    document.getElementById('downloadTemplateBackupBtn')?.addEventListener('click', () => {
        downloadTemplateBackupJson();
    });

    document.getElementById('importCustomTemplatesBtn')?.addEventListener('click', () => {
        const mode = getSelectedImportMode();
        if (mode === 'overwrite' && Object.keys(currentContext.customTemplates).length > 0) {
            const confirmed = window.confirm(
                'A importação em modo sobrescrever vai substituir todos os templates custom atuais. Deseja continuar?'
            );
            if (!confirmed) {
                setStatus('Importação cancelada pelo usuário.', 'warn');
                return;
            }
        }
        document.getElementById('importCustomTemplatesFile')?.click();
    });

    document.getElementById('importCustomTemplatesFile')?.addEventListener('change', async (event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || !input.files || !input.files[0]) {
            return;
        }
        const file = input.files[0];
        await importCustomTemplatesFromFile(file, getSelectedImportMode());
        input.value = '';
    });

    document.getElementById('customTemplateBookMode')?.addEventListener('change', () => {
        currentContext.builderStructureIds = getDefaultStructureIds(getSelectedBookMode());
        syncDesignStudioAfterStructureChange(true);
        renderTemplateBuilder();
        updateMiniGuideVariantFieldState();
        syncMiniVariantWithSmartMethod();
        syncMiniPresetFromCurrentState();
        updateTemplateStrategyHint();
        refreshBrandbookPreviewFromBuilder();
    });

    document.getElementById('customTemplateSmartMethod')?.addEventListener('change', () => {
        syncMiniVariantWithSmartMethod();
        syncMiniPresetFromCurrentState();
        updateTemplateStrategyHint();
        refreshBrandbookPreviewFromBuilder();
    });

    document.getElementById('customTemplateMiniVariant')?.addEventListener('change', () => {
        syncMiniPresetFromCurrentState();
        updateTemplateStrategyHint();
        refreshBrandbookPreviewFromBuilder();
    });

    document.getElementById('miniGuidePreset')?.addEventListener('change', () => {
        applyMiniGuidePreset(getSelectedMiniPresetId(), { warnIfNone: false });
    });

    ['customTemplateName', 'customTemplateKicker', 'customTemplateClosing'].forEach((fieldId) => {
        document.getElementById(fieldId)?.addEventListener('input', () => {
            refreshBrandbookPreviewFromBuilder();
        });
    });

    document.getElementById('customTemplateTheme')?.addEventListener('change', (event) => {
        const target = event.target;
        if (target instanceof HTMLSelectElement && !isTemplatePaletteTouched()) {
            syncTemplatePaletteFromTheme(target.value);
        }
        refreshBrandbookPreviewFromBuilder();
    });

    document.getElementById('customTemplateUsePaletteToggle')?.addEventListener('change', () => {
        refreshBrandbookPreviewFromBuilder();
    });

    TEMPLATE_COLOR_INPUT_IDS.forEach((fieldId) => {
        document.getElementById(fieldId)?.addEventListener('input', () => {
            setTemplatePaletteTouched(true);
            refreshBrandbookPreviewFromBuilder();
        });
        document.getElementById(fieldId)?.addEventListener('change', () => {
            setTemplatePaletteTouched(true);
            refreshBrandbookPreviewFromBuilder();
        });
    });

    document.getElementById('useProjectPaletteBtn')?.addEventListener('click', () => {
        syncTemplatePaletteFromProject();
    });

    document.getElementById('resetTemplatePaletteBtn')?.addEventListener('click', () => {
        resetTemplatePaletteFromTheme();
    });

    document.getElementById('builderBlockTitleOverride')?.addEventListener('input', () => {
        updateSelectedBuilderBlockLayout({
            labelOverride: valueOfField('builderBlockTitleOverride')
        });
    });

    document.getElementById('builderBlockNote')?.addEventListener('input', () => {
        updateSelectedBuilderBlockLayout({
            note: valueOfField('builderBlockNote')
        });
    });

    document.getElementById('builderBlockSpan')?.addEventListener('change', () => {
        updateSelectedBuilderBlockLayout({
            span: valueOfField('builderBlockSpan')
        });
    });

    document.getElementById('builderMoveBlockUpBtn')?.addEventListener('click', () => {
        moveSelectedBuilderBlock(-1);
    });

    document.getElementById('builderMoveBlockDownBtn')?.addEventListener('click', () => {
        moveSelectedBuilderBlock(1);
    });

    document.getElementById('builderRemoveBlockBtn')?.addEventListener('click', () => {
        removeSelectedBuilderBlock();
    });

    document.getElementById('builderClearBlockEditBtn')?.addEventListener('click', () => {
        clearSelectedBuilderBlockCustomization();
    });

    document.getElementById('designPageSelect')?.addEventListener('change', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLSelectElement)) {
            return;
        }
        selectDesignPage(target.value, true);
    });

    document.getElementById('addDesignPageBtn')?.addEventListener('click', () => {
        addDesignPage();
    });

    document.getElementById('duplicateDesignPageBtn')?.addEventListener('click', () => {
        duplicateActiveDesignPage();
    });

    document.getElementById('removeDesignPageBtn')?.addEventListener('click', () => {
        removeActiveDesignPage();
    });

    document.getElementById('buildSceneFromStructureBtn')?.addEventListener('click', () => {
        rebuildDesignStudioFromStructure();
    });

    document.getElementById('useDesignStudioTemplate')?.addEventListener('change', () => {
        const field = document.getElementById('useDesignStudioTemplate');
        currentContext.designStudioEnabled = Boolean(field instanceof HTMLInputElement && field.checked);
        refreshBrandbookPreviewFromBuilder();
    });

    document.getElementById('designerStudio')?.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const addButton = target.closest('[data-design-add]');
        if (!(addButton instanceof HTMLElement)) {
            return;
        }
        const type = String(addButton.dataset.designAdd || 'text');
        addDesignElement(type);
        closeAllDesignInsertLibraries();
    });

    document.getElementById('designElementText')?.addEventListener('input', () => {
        updateSelectedDesignElementFromInspector({ text: valueOfField('designElementText') });
    });
    document.getElementById('designElementX')?.addEventListener('input', () => {
        updateSelectedDesignElementFromInspector({ x: valueOfField('designElementX') });
    });
    document.getElementById('designElementY')?.addEventListener('input', () => {
        updateSelectedDesignElementFromInspector({ y: valueOfField('designElementY') });
    });
    document.getElementById('designElementW')?.addEventListener('input', () => {
        updateSelectedDesignElementFromInspector({ w: valueOfField('designElementW') });
    });
    document.getElementById('designElementH')?.addEventListener('input', () => {
        updateSelectedDesignElementFromInspector({ h: valueOfField('designElementH') });
    });
    document.getElementById('designElementFontSize')?.addEventListener('input', () => {
        updateSelectedDesignElementFromInspector({ fontSize: valueOfField('designElementFontSize') }, { applyToSelection: true });
    });
    document.getElementById('designElementAlign')?.addEventListener('change', () => {
        updateSelectedDesignElementFromInspector({ align: valueOfField('designElementAlign') }, { applyToSelection: true });
    });
    document.getElementById('designElementColor')?.addEventListener('input', () => {
        updateSelectedDesignElementFromInspector({ color: valueOfField('designElementColor') }, { applyToSelection: true });
    });
    document.getElementById('designElementBg')?.addEventListener('input', () => {
        updateSelectedDesignElementFromInspector({ bg: valueOfField('designElementBg') }, { applyToSelection: true });
    });
    document.getElementById('designElementRadius')?.addEventListener('input', () => {
        updateSelectedDesignElementFromInspector({ radius: valueOfField('designElementRadius') }, { applyToSelection: true });
    });
    document.getElementById('designElementOpacity')?.addEventListener('input', () => {
        updateSelectedDesignElementFromInspector({ opacity: valueOfField('designElementOpacity') }, { applyToSelection: true });
    });

    document.getElementById('designSelectAllBtn')?.addEventListener('click', () => {
        selectAllDesignElements();
    });
    document.getElementById('designClearSelectionBtn')?.addEventListener('click', () => {
        reduceDesignSelectionToPrimary();
    });
    document.getElementById('designSnapGridBtn')?.addEventListener('click', () => {
        toggleDesignSnapMode('grid');
    });
    document.getElementById('designSnapElementBtn')?.addEventListener('click', () => {
        toggleDesignSnapMode('element');
    });
    document.getElementById('designSnapGridSize')?.addEventListener('input', () => {
        updateDesignSnapSetting('gridSize', valueOfField('designSnapGridSize'));
    });
    document.getElementById('designSnapGridSize')?.addEventListener('change', () => {
        updateDesignSnapSetting('gridSize', valueOfField('designSnapGridSize'), { announce: true });
    });
    document.getElementById('designSnapThreshold')?.addEventListener('input', () => {
        updateDesignSnapSetting('threshold', valueOfField('designSnapThreshold'));
    });
    document.getElementById('designSnapThreshold')?.addEventListener('change', () => {
        updateDesignSnapSetting('threshold', valueOfField('designSnapThreshold'), { announce: true });
    });
    document.getElementById('designSnapResetBtn')?.addEventListener('click', () => {
        resetDesignSnapSettings({ announce: true });
    });
    document.querySelectorAll('[data-snap-preset]').forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) {
            return;
        }
        button.addEventListener('click', () => {
            const presetKey = String(button.dataset.snapPreset || 'balanced');
            applyDesignSnapPreset(presetKey, { announce: true });
        });
    });

    document.getElementById('duplicateDesignElementBtn')?.addEventListener('click', () => {
        duplicateSelectedDesignElement();
    });
    document.getElementById('removeDesignElementBtn')?.addEventListener('click', () => {
        removeSelectedDesignElement();
    });
    document.getElementById('resetDesignElementStyleBtn')?.addEventListener('click', () => {
        resetSelectedDesignElementStyle();
    });
    document.getElementById('designResizeWMinusBtn')?.addEventListener('click', () => {
        resizeSelectedDesignElement(-DESIGN_RESIZE_BUTTON_STEP, 0);
    });
    document.getElementById('designResizeWPlusBtn')?.addEventListener('click', () => {
        resizeSelectedDesignElement(DESIGN_RESIZE_BUTTON_STEP, 0);
    });
    document.getElementById('designResizeHMinusBtn')?.addEventListener('click', () => {
        resizeSelectedDesignElement(0, -DESIGN_RESIZE_BUTTON_STEP);
    });
    document.getElementById('designResizeHPlusBtn')?.addEventListener('click', () => {
        resizeSelectedDesignElement(0, DESIGN_RESIZE_BUTTON_STEP);
    });
    document.getElementById('designLayerBackBtn')?.addEventListener('click', () => {
        reorderSelectedDesignElement('backward');
    });
    document.getElementById('designLayerFrontBtn')?.addEventListener('click', () => {
        reorderSelectedDesignElement('forward');
    });
    document.getElementById('designLayerBottomBtn')?.addEventListener('click', () => {
        reorderSelectedDesignElement('to_back');
    });
    document.getElementById('designLayerTopBtn')?.addEventListener('click', () => {
        reorderSelectedDesignElement('to_front');
    });
    document.getElementById('designAlignLeftBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementToCanvas('left');
    });
    document.getElementById('designAlignCenterBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementToCanvas('center');
    });
    document.getElementById('designAlignRightBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementToCanvas('right');
    });
    document.getElementById('designAlignTopBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementToCanvas('top');
    });
    document.getElementById('designAlignMiddleBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementToCanvas('middle');
    });
    document.getElementById('designAlignBottomBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementToCanvas('bottom');
    });
    document.getElementById('designAlignSelLeftBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementsToSelection('left');
    });
    document.getElementById('designAlignSelCenterBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementsToSelection('center');
    });
    document.getElementById('designAlignSelRightBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementsToSelection('right');
    });
    document.getElementById('designAlignSelTopBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementsToSelection('top');
    });
    document.getElementById('designAlignSelMiddleBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementsToSelection('middle');
    });
    document.getElementById('designAlignSelBottomBtn')?.addEventListener('click', () => {
        alignSelectedDesignElementsToSelection('bottom');
    });
    document.getElementById('designDistributeHBtn')?.addEventListener('click', () => {
        distributeSelectedDesignElements('horizontal', 'edges');
    });
    document.getElementById('designDistributeVBtn')?.addEventListener('click', () => {
        distributeSelectedDesignElements('vertical', 'edges');
    });
    document.getElementById('designDistributeCenterHBtn')?.addEventListener('click', () => {
        distributeSelectedDesignElements('horizontal', 'centers');
    });
    document.getElementById('designDistributeCenterVBtn')?.addEventListener('click', () => {
        distributeSelectedDesignElements('vertical', 'centers');
    });
    document.getElementById('designCopyStyleBtn')?.addEventListener('click', () => {
        copySelectedDesignStyle();
    });
    document.getElementById('designPasteStyleBtn')?.addEventListener('click', () => {
        pasteSelectedDesignStyle();
    });
    document.getElementById('designToggleLockBtn')?.addEventListener('click', () => {
        toggleSelectedDesignElementLock();
    });

    document.getElementById('importFigmaJsonBtn')?.addEventListener('click', () => {
        document.getElementById('importFigmaJsonFile')?.click();
    });
    document.getElementById('figmaNamingPresetSelect')?.addEventListener('change', () => {
        persistFigmaNamingConfigFromForm();
    });
    document.getElementById('figmaNamingCustomRules')?.addEventListener('input', () => {
        persistFigmaNamingConfigFromForm();
    });
    document.getElementById('applyFigmaNamingPresetBtn')?.addEventListener('click', () => {
        const config = persistFigmaNamingConfigFromForm();
        const profile = buildFigmaNamingProfile(config);
        const moduleCount = Object.keys(profile.moduleAliases || {}).length;
        const elementCount = Object.keys(profile.elementAliases || {}).length;
        setStatus(`Preset de nomenclatura aplicado (${moduleCount} módulos | ${elementCount} tipos).`, 'ok');
    });
    document.getElementById('resetFigmaNamingRulesBtn')?.addEventListener('click', () => {
        currentContext.figmaNamingConfig = createDefaultFigmaNamingConfig();
        fillFigmaNamingConfigFields(currentContext.figmaNamingConfig);
        setStatus('Regras de nomenclatura resetadas para o preset padrão.', 'ok');
    });
    document.getElementById('importFigmaJsonFile')?.addEventListener('change', async (event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || !input.files || !input.files[0]) {
            return;
        }
        await importDesignStudioFromFigmaFile(input.files[0]);
        input.value = '';
    });

    document.getElementById('exportDesignSceneBtn')?.addEventListener('click', () => {
        exportDesignSceneJson();
    });
    document.getElementById('importDesignSceneBtn')?.addEventListener('click', () => {
        document.getElementById('importDesignSceneFile')?.click();
    });
    document.getElementById('importDesignSceneFile')?.addEventListener('change', async (event) => {
        const input = event.target;
        if (!(input instanceof HTMLInputElement) || !input.files || !input.files[0]) {
            return;
        }
        await importDesignSceneFile(input.files[0]);
        input.value = '';
    });

    initDesignStudioCanvasInteractions();
    initDesignStudioKeyboardInteractions();

    document.getElementById('savePracticalSettingsBtn')?.addEventListener('click', () => {
        savePracticalSettingsFromForm();
    });

    document.getElementById('resetPracticalSettingsBtn')?.addEventListener('click', () => {
        resetPracticalSettings();
    });

    document.getElementById('copyCssTokensBtn')?.addEventListener('click', async () => {
        await copyCssTokensToClipboard();
    });

    document.getElementById('downloadCssTokensBtn')?.addEventListener('click', () => {
        downloadCssTokensFile();
    });

    document.getElementById('downloadExecutionBriefBtn')?.addEventListener('click', () => {
        downloadExecutionBrief();
    });

    bindPracticalFieldEvents();

    initTemplateBuilderDnD();
}

function getSelectedImportMode() {
    const field = document.getElementById('importCustomTemplatesMode');
    const mode = String(field instanceof HTMLSelectElement ? field.value : 'merge').toLowerCase();
    return mode === 'overwrite' ? 'overwrite' : 'merge';
}

function getSelectedBookMode() {
    const field = document.getElementById('customTemplateBookMode');
    const value = String(field instanceof HTMLSelectElement ? field.value : BOOK_MODE_COMPLETE);
    return normalizeBookMode(value);
}

function getSelectedSmartMethod() {
    const field = document.getElementById('customTemplateSmartMethod');
    const value = String(field instanceof HTMLSelectElement ? field.value : SMART_TEMPLATE_METHOD_DEFAULT);
    return normalizeSmartMethod(value);
}

function getSelectedMiniGuideVariant() {
    const field = document.getElementById('customTemplateMiniVariant');
    const value = String(field instanceof HTMLSelectElement ? field.value : MINI_GUIDE_VARIANT_DEFAULT);
    return normalizeMiniGuideVariant(value);
}

function getSelectedMiniPresetId() {
    const field = document.getElementById('miniGuidePreset');
    const value = String(field instanceof HTMLSelectElement ? field.value : MINI_GUIDE_PRESET_NONE).toLowerCase();
    return Object.prototype.hasOwnProperty.call(MINI_GUIDE_PRESETS, value)
        ? value
        : MINI_GUIDE_PRESET_NONE;
}

function normalizeTemplatePalette(rawPalette, fallbackPalette = null) {
    const defaultPalette = Array.isArray(TEMPLATE_PRESETS[DEFAULT_TEMPLATE_ID]?.fallbackPalette)
        ? TEMPLATE_PRESETS[DEFAULT_TEMPLATE_ID].fallbackPalette
        : ['#0f1117', '#f8fafc', '#d1d5db', '#6b7280', '#111827', '#9ca3af'];
    const baseSource = Array.isArray(fallbackPalette) && fallbackPalette.length
        ? fallbackPalette
        : defaultPalette;
    const safeBase = [];

    for (let index = 0; index < TEMPLATE_COLOR_LIMIT; index += 1) {
        const defaultHex = normalizeHex(defaultPalette[index], '#0f1117');
        const fallbackHex = normalizeHex(baseSource[index], defaultHex);
        safeBase.push(fallbackHex);
    }

    const source = Array.isArray(rawPalette) ? rawPalette : [];
    return safeBase.map((fallbackHex, index) => normalizeHex(source[index], fallbackHex));
}

function getThemePresetFallbackPalette(themeClassOrKey = DEFAULT_TEMPLATE_ID) {
    const requested = String(themeClassOrKey || '').trim().toLowerCase();
    const resolvedThemeKey = Object.prototype.hasOwnProperty.call(TEMPLATE_PRESETS, requested)
        ? requested
        : getThemeKeyFromThemeClass(themeClassOrKey);
    const source = TEMPLATE_PRESETS[resolvedThemeKey] || TEMPLATE_PRESETS[DEFAULT_TEMPLATE_ID];
    return normalizeTemplatePalette(source?.fallbackPalette);
}

function setTemplatePaletteTouched(value = true) {
    currentContext.templatePaletteTouched = Boolean(value);
}

function isTemplatePaletteTouched() {
    return Boolean(currentContext.templatePaletteTouched);
}

function isTemplateColorOverrideEnabled() {
    const field = document.getElementById('customTemplateUsePaletteToggle');
    return Boolean(field instanceof HTMLInputElement && field.checked);
}

function applyTemplatePaletteToForm(palette) {
    const safePalette = normalizeTemplatePalette(palette);
    TEMPLATE_COLOR_INPUT_IDS.forEach((fieldId, index) => {
        const field = document.getElementById(fieldId);
        if (field instanceof HTMLInputElement) {
            field.value = safePalette[index];
        }
    });
}

function getTemplatePaletteFromForm(fallbackPalette = null) {
    const rawPalette = TEMPLATE_COLOR_INPUT_IDS.map((fieldId) => {
        const field = document.getElementById(fieldId);
        return field instanceof HTMLInputElement ? field.value : '';
    });
    return normalizeTemplatePalette(rawPalette, fallbackPalette);
}

function syncTemplatePaletteFromTheme(themeClassOrKey = DEFAULT_TEMPLATE_ID) {
    const palette = getThemePresetFallbackPalette(themeClassOrKey);
    applyTemplatePaletteToForm(palette);
    setTemplatePaletteTouched(false);
}

function syncTemplatePaletteFromProject() {
    const themeField = document.getElementById('customTemplateTheme');
    const basePalette = getThemePresetFallbackPalette(
        themeField instanceof HTMLSelectElement ? themeField.value : DEFAULT_TEMPLATE_ID
    );
    const projectPalette = Array.isArray(currentContext.payload?.identity?.colors)
        ? currentContext.payload.identity.colors
            .map((item) => normalizeHex(item?.hex, ''))
            .filter(Boolean)
            .slice(0, TEMPLATE_COLOR_LIMIT)
        : [];

    if (!projectPalette.length) {
        setStatus('O projeto ainda não possui cores para aplicar no template.', 'warn');
        return;
    }

    applyTemplatePaletteToForm(normalizeTemplatePalette(projectPalette, basePalette));
    setTemplatePaletteTouched(true);
    const forceToggle = document.getElementById('customTemplateUsePaletteToggle');
    if (forceToggle instanceof HTMLInputElement) {
        forceToggle.checked = true;
    }
    refreshBrandbookPreviewFromBuilder();
    setStatus('Paleta do projeto aplicada no template.', 'ok');
}

function resetTemplatePaletteFromTheme() {
    const themeField = document.getElementById('customTemplateTheme');
    syncTemplatePaletteFromTheme(
        themeField instanceof HTMLSelectElement ? themeField.value : DEFAULT_TEMPLATE_ID
    );
    refreshBrandbookPreviewFromBuilder();
    setStatus('Paleta base do tema restaurada no template.', 'ok');
}

function buildPalettePresetFromBuilder(themeKey = '', activePreset = null) {
    const safePreset = activePreset && typeof activePreset === 'object'
        ? activePreset
        : getTemplatePreset(currentContext.activeTemplateId);
    const resolvedThemeKey = Object.prototype.hasOwnProperty.call(TEMPLATE_PRESETS, String(themeKey || '').toLowerCase())
        ? String(themeKey || '').toLowerCase()
        : getThemeKeyFromThemeClass(safePreset.themeClass);
    const themeFallbackPalette = getThemePresetFallbackPalette(resolvedThemeKey);
    const fallbackPalette = getTemplatePaletteFromForm(
        Array.isArray(safePreset.fallbackPalette) && safePreset.fallbackPalette.length
            ? safePreset.fallbackPalette
            : themeFallbackPalette
    );

    return {
        fallbackPalette,
        colorOverrideEnabled: isTemplateColorOverrideEnabled(),
        colorOverride: fallbackPalette
    };
}

function getDefaultPracticalSettings() {
    return {
        logoClearspace: '1x altura do simbolo',
        logoMinDigital: '32px',
        logoMinPrint: '18mm',
        ratioPrimary: 60,
        ratioSecondary: 30,
        ratioAccent: 10,
        voiceKeywords: 'claro, confiável, objetivo',
        ctaStyle: 'Verbo de ação + benefício direto',
        imageryDirection: 'Fotos reais com fundo limpo e boa luz',
        iconStyle: 'Ícones simples com cantos suaves',
        channels: ['web', 'social'],
        requiredAssets: ['logo_color', 'logo_reverse', 'palette_tokens', 'pdf_manual'],
        ownerName: '',
        reviewCycleDays: 30
    };
}

function sanitizePracticalSettings(raw) {
    const defaults = getDefaultPracticalSettings();
    const source = raw && typeof raw === 'object' ? raw : {};

    const ratioPrimary = Math.max(0, Math.min(100, sanitizeNumeric(source.ratioPrimary, defaults.ratioPrimary)));
    const ratioSecondary = Math.max(0, Math.min(100, sanitizeNumeric(source.ratioSecondary, defaults.ratioSecondary)));
    let ratioAccent = Math.max(0, Math.min(100, sanitizeNumeric(source.ratioAccent, defaults.ratioAccent)));
    const ratioSum = ratioPrimary + ratioSecondary + ratioAccent;
    if (ratioSum !== 100 && ratioSum > 0) {
        ratioAccent = Math.max(0, Math.min(100, 100 - ratioPrimary - ratioSecondary));
    }

    const channels = Array.isArray(source.channels)
        ? source.channels.map((item) => String(item || '').trim().toLowerCase()).filter((item) => PLAYBOOK_CHANNELS.includes(item))
        : defaults.channels.slice();
    const requiredAssets = Array.isArray(source.requiredAssets)
        ? source.requiredAssets.map((item) => String(item || '').trim().toLowerCase()).filter((item) => PLAYBOOK_ASSETS.includes(item))
        : defaults.requiredAssets.slice();

    return {
        logoClearspace: String(source.logoClearspace || defaults.logoClearspace).trim().slice(0, 90),
        logoMinDigital: String(source.logoMinDigital || defaults.logoMinDigital).trim().slice(0, 90),
        logoMinPrint: String(source.logoMinPrint || defaults.logoMinPrint).trim().slice(0, 90),
        ratioPrimary,
        ratioSecondary,
        ratioAccent,
        voiceKeywords: String(source.voiceKeywords || defaults.voiceKeywords).trim().slice(0, 220),
        ctaStyle: String(source.ctaStyle || defaults.ctaStyle).trim().slice(0, 220),
        imageryDirection: String(source.imageryDirection || defaults.imageryDirection).trim().slice(0, 260),
        iconStyle: String(source.iconStyle || defaults.iconStyle).trim().slice(0, 180),
        channels: channels.length ? channels : defaults.channels.slice(),
        requiredAssets: requiredAssets.length ? requiredAssets : defaults.requiredAssets.slice(),
        ownerName: String(source.ownerName || '').trim().slice(0, 120),
        reviewCycleDays: Math.max(1, Math.min(365, sanitizeNumeric(source.reviewCycleDays, defaults.reviewCycleDays)))
    };
}

function loadPracticalSettings() {
    const parsed = readStorageJson(BRAND_MANUAL_PRACTICAL_SETTINGS_KEY, null);
    return sanitizePracticalSettings(parsed || getDefaultPracticalSettings());
}

function persistPracticalSettings(settings) {
    if (typeof localStorage === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(BRAND_MANUAL_PRACTICAL_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        // Ignore storage errors in practical settings.
    }
}

function getCheckedValues(groupName) {
    return Array.from(document.querySelectorAll(`input[name="${groupName}"]:checked`))
        .map((item) => String(item instanceof HTMLInputElement ? item.value : ''))
        .filter(Boolean);
}

function setCheckedValues(groupName, values) {
    const safe = new Set(Array.isArray(values) ? values : []);
    document.querySelectorAll(`input[name="${groupName}"]`).forEach((item) => {
        if (!(item instanceof HTMLInputElement)) {
            return;
        }
        item.checked = safe.has(item.value);
    });
}

function readPracticalSettingsFromForm() {
    return sanitizePracticalSettings({
        logoClearspace: valueOfField('logoClearspaceInput'),
        logoMinDigital: valueOfField('logoMinDigitalInput'),
        logoMinPrint: valueOfField('logoMinPrintInput'),
        ratioPrimary: valueOfField('ratioPrimaryInput'),
        ratioSecondary: valueOfField('ratioSecondaryInput'),
        ratioAccent: valueOfField('ratioAccentInput'),
        voiceKeywords: valueOfField('voiceKeywordsInput'),
        ctaStyle: valueOfField('ctaStyleInput'),
        imageryDirection: valueOfField('imageryDirectionInput'),
        iconStyle: valueOfField('iconStyleInput'),
        channels: getCheckedValues('playbook_channels'),
        requiredAssets: getCheckedValues('playbook_assets'),
        ownerName: valueOfField('ownerNameInput'),
        reviewCycleDays: valueOfField('reviewCycleDaysInput')
    });
}

function writePracticalSettingsToForm(settings) {
    const safe = sanitizePracticalSettings(settings);

    setFieldValue('logoClearspaceInput', safe.logoClearspace);
    setFieldValue('logoMinDigitalInput', safe.logoMinDigital);
    setFieldValue('logoMinPrintInput', safe.logoMinPrint);
    setFieldValue('ratioPrimaryInput', String(safe.ratioPrimary));
    setFieldValue('ratioSecondaryInput', String(safe.ratioSecondary));
    setFieldValue('ratioAccentInput', String(safe.ratioAccent));
    setFieldValue('voiceKeywordsInput', safe.voiceKeywords);
    setFieldValue('ctaStyleInput', safe.ctaStyle);
    setFieldValue('imageryDirectionInput', safe.imageryDirection);
    setFieldValue('iconStyleInput', safe.iconStyle);
    setFieldValue('ownerNameInput', safe.ownerName);
    setFieldValue('reviewCycleDaysInput', String(safe.reviewCycleDays));
    setCheckedValues('playbook_channels', safe.channels);
    setCheckedValues('playbook_assets', safe.requiredAssets);
}

function bindPracticalFieldEvents() {
    [
        '#logoClearspaceInput',
        '#logoMinDigitalInput',
        '#logoMinPrintInput',
        '#ratioPrimaryInput',
        '#ratioSecondaryInput',
        '#ratioAccentInput',
        '#voiceKeywordsInput',
        '#ctaStyleInput',
        '#imageryDirectionInput',
        '#iconStyleInput',
        '#ownerNameInput',
        '#reviewCycleDaysInput'
    ].forEach((selector) => {
        document.querySelector(selector)?.addEventListener('input', () => {
            handlePracticalSettingsLiveChange();
        });
    });

    document.querySelectorAll('input[name="playbook_channels"], input[name="playbook_assets"]').forEach((item) => {
        item.addEventListener('change', () => {
            handlePracticalSettingsLiveChange();
        });
    });
}

function handlePracticalSettingsLiveChange() {
    const settings = readPracticalSettingsFromForm();
    currentContext.practicalSettings = settings;
    renderPracticalPlaybook(settings, currentContext.payload, currentContext.displayMockups);
    refreshBrandbookPreviewFromBuilder();
}

function savePracticalSettingsFromForm() {
    const settings = readPracticalSettingsFromForm();
    currentContext.practicalSettings = settings;
    persistPracticalSettings(settings);
    renderPracticalPlaybook(settings, currentContext.payload, currentContext.displayMockups);
    refreshBrandbookPreviewFromBuilder();
    setStatus('Playbook de execução salvo com sucesso.', 'ok');
}

function resetPracticalSettings() {
    const defaults = getDefaultPracticalSettings();
    currentContext.practicalSettings = defaults;
    writePracticalSettingsToForm(defaults);
    persistPracticalSettings(defaults);
    renderPracticalPlaybook(defaults, currentContext.payload, currentContext.displayMockups);
    refreshBrandbookPreviewFromBuilder();
    setStatus('Playbook de execução restaurado para padrão.', 'ok');
}

function renderPracticalPlaybook(settings, payload = null, displayMockups = null) {
    const safe = sanitizePracticalSettings(settings);
    const checklistTarget = document.getElementById('playbookChecklist');
    const scoreBadge = document.getElementById('playbookScoreBadge');
    const scoreText = document.getElementById('playbookScoreText');

    const evaluation = evaluatePracticalCompleteness(
        safe,
        payload || currentContext.payload,
        Array.isArray(displayMockups) ? displayMockups : currentContext.displayMockups
    );

    if (checklistTarget) {
        checklistTarget.innerHTML = evaluation.items.map((item) => `
            <li class="${escapeHtml(item.done ? 'ok' : 'warn')}">${escapeHtml(item.label)}</li>
        `).join('');
    }

    const scoreLabel = `${evaluation.score}% pronto`;
    if (scoreBadge) {
        scoreBadge.textContent = scoreLabel;
    }
    if (scoreText) {
        scoreText.textContent = `Aplicabilidade: ${scoreLabel} | ${evaluation.completed}/${evaluation.total} checks concluídos`;
    }
}

function evaluatePracticalCompleteness(settings, payload, displayMockups) {
    const mockups = Array.isArray(displayMockups) ? displayMockups : [];
    const hasOg = Boolean(payload?.applications?.digital?.og?.available);
    const colorCount = Array.isArray(payload?.identity?.colors) ? payload.identity.colors.length : 0;

    const items = [
        { label: 'Regras de logo preenchidas (respiro e tamanho mínimo)', done: Boolean(settings.logoClearspace && settings.logoMinDigital) },
        { label: 'Proporção de uso de cor definida (primária/secundária/acento)', done: Number(settings.ratioPrimary) + Number(settings.ratioSecondary) + Number(settings.ratioAccent) === 100 },
        { label: 'Tom verbal documentado (palavras-chave e CTA)', done: Boolean(settings.voiceKeywords && settings.ctaStyle) },
        { label: 'Direção visual definida (imagery + iconografia)', done: Boolean(settings.imageryDirection && settings.iconStyle) },
        { label: 'Canais de entrega selecionados', done: Array.isArray(settings.channels) && settings.channels.length >= 2 },
        { label: 'Pacote mínimo de ativos selecionado', done: Array.isArray(settings.requiredAssets) && settings.requiredAssets.length >= 4 },
        { label: 'Paleta consolidada no projeto', done: colorCount >= 3 },
        { label: 'Mockups de aplicação disponíveis', done: mockups.length >= 2 },
        { label: 'Diretriz OG configurada', done: hasOg },
        { label: 'Responsável e ciclo de revisão definidos', done: Boolean(settings.ownerName && settings.reviewCycleDays >= 7) }
    ];

    const completed = items.filter((item) => item.done).length;
    const total = items.length;
    const score = total ? Math.round((completed / total) * 100) : 0;

    return { score, total, completed, items };
}

function buildCssTokens(settings, payload) {
    const safe = sanitizePracticalSettings(settings);
    const colors = Array.isArray(payload?.identity?.colors)
        ? payload.identity.colors.map((item) => normalizeHex(item?.hex, '')).filter(Boolean).slice(0, 6)
        : [];
    const typography = payload?.identity?.typography || {};

    const primary = colors[0] || '#0e4bd7';
    const secondary = colors[1] || '#1f2b45';
    const accent = colors[2] || '#cf132f';
    const neutral = colors[3] || '#f8fbff';

    return `:root {
  --brand-primary: ${primary};
  --brand-secondary: ${secondary};
  --brand-accent: ${accent};
  --brand-neutral: ${neutral};
  --font-primary: "${String(typography.primaryFontName || 'Sora')}";
  --font-secondary: "${String(typography.secondaryFontName || 'Fraunces')}";
  --logo-clearspace: "${safe.logoClearspace}";
  --logo-min-digital: "${safe.logoMinDigital}";
  --logo-min-print: "${safe.logoMinPrint}";
  --color-ratio-primary: ${safe.ratioPrimary}%;
  --color-ratio-secondary: ${safe.ratioSecondary}%;
  --color-ratio-accent: ${safe.ratioAccent}%;
}`;
}

async function copyCssTokensToClipboard() {
    const tokens = buildCssTokens(currentContext.practicalSettings || loadPracticalSettings(), currentContext.payload);
    try {
        await navigator.clipboard.writeText(tokens);
        setStatus('Tokens CSS copiados para área de transferência.', 'ok');
    } catch (error) {
        setStatus('Não foi possível copiar os tokens CSS automaticamente.', 'warn');
    }
}

function downloadCssTokensFile() {
    const tokens = buildCssTokens(currentContext.practicalSettings || loadPracticalSettings(), currentContext.payload);
    downloadText(
        tokens,
        `brand-tokens-${formatDateForFile(new Date())}.css`,
        'text/css;charset=utf-8'
    );
    setStatus('Arquivo de tokens CSS exportado com sucesso.', 'ok');
}

function buildExecutionBrief(settings, payload, displayMockups) {
    const safe = sanitizePracticalSettings(settings);
    const evaluation = evaluatePracticalCompleteness(safe, payload, displayMockups);

    return {
        schema: 'brand_execution_playbook_v1',
        generatedAt: new Date().toISOString(),
        applicability: {
            score: evaluation.score,
            completed: evaluation.completed,
            total: evaluation.total
        },
        ownership: {
            ownerName: safe.ownerName || 'Não definido',
            reviewCycleDays: safe.reviewCycleDays
        },
        logo: {
            clearspace: safe.logoClearspace,
            minDigital: safe.logoMinDigital,
            minPrint: safe.logoMinPrint
        },
        colors: {
            usageRatio: {
                primary: safe.ratioPrimary,
                secondary: safe.ratioSecondary,
                accent: safe.ratioAccent
            }
        },
        voice: {
            keywords: safe.voiceKeywords,
            ctaStyle: safe.ctaStyle
        },
        visualDirection: {
            imagery: safe.imageryDirection,
            icons: safe.iconStyle
        },
        channels: safe.channels.map((item) => formatChannelLabel(item)),
        requiredAssets: safe.requiredAssets.map((item) => formatAssetLabel(item)),
        checklist: evaluation.items
    };
}

function downloadExecutionBrief() {
    const brief = buildExecutionBrief(
        currentContext.practicalSettings || loadPracticalSettings(),
        currentContext.payload,
        currentContext.displayMockups
    );
    downloadText(
        JSON.stringify(brief, null, 2),
        `execution-playbook-${formatDateForFile(new Date())}.json`,
        'application/json;charset=utf-8'
    );
    setStatus('Execution brief exportado com sucesso.', 'ok');
}

function formatChannelLabel(channel) {
    if (channel === 'web') return 'Website';
    if (channel === 'social') return 'Social';
    if (channel === 'ads') return 'Ads';
    if (channel === 'print') return 'Impresso';
    if (channel === 'presentation') return 'Apresentação';
    return channel;
}

function formatAssetLabel(asset) {
    if (asset === 'logo_color') return 'Logo colorido';
    if (asset === 'logo_reverse') return 'Logo reverso';
    if (asset === 'logo_bw') return 'Logo preto/branco';
    if (asset === 'palette_tokens') return 'Tokens de paleta';
    if (asset === 'social_templates') return 'Templates sociais';
    if (asset === 'pdf_manual') return 'Manual PDF';
    return asset;
}

function valueOfField(id) {
    const field = document.getElementById(id);
    if (!field || !('value' in field)) {
        return '';
    }
    return String(field.value || '');
}

function setFieldValue(id, value) {
    const field = document.getElementById(id);
    if (!field || !('value' in field)) {
        return;
    }
    field.value = String(value || '');
}

function createLocalUid(prefix = 'id') {
    const stamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 8);
    return `${prefix}_${stamp}_${random}`;
}

function clampNumber(value, min, max, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.max(min, Math.min(max, numeric));
}

function normalizeDesignAlign(value, fallback = 'left') {
    const normalized = String(value || '').toLowerCase();
    if (normalized === 'center' || normalized === 'right') {
        return normalized;
    }
    return fallback;
}

function normalizeDesignElementType(value, fallback = 'text') {
    const normalized = String(value || '').toLowerCase();
    return DESIGN_ELEMENT_TYPES.includes(normalized) ? normalized : fallback;
}

function getDesignElementTypeLabel(type) {
    if (type === 'title') return 'Título';
    if (type === 'subtitle') return 'Subtítulo';
    if (type === 'bullet_list') return 'Lista';
    if (type === 'shape') return 'Bloco';
    if (type === 'shape_rect') return 'Retângulo';
    if (type === 'shape_round_rect') return 'Retângulo Arredondado';
    if (type === 'shape_parallelogram') return 'Paralelogramo';
    if (type === 'shape_trapezoid') return 'Trapézio';
    if (type === 'shape_ellipse') return 'Elipse';
    if (type === 'shape_triangle') return 'Triângulo';
    if (type === 'shape_diamond') return 'Losango';
    if (type === 'shape_pentagon') return 'Pentágono';
    if (type === 'shape_hexagon') return 'Hexágono';
    if (type === 'shape_octagon') return 'Octógono';
    if (type === 'shape_star') return 'Estrela';
    if (type === 'shape_heart') return 'Coração';
    if (type === 'shape_cloud') return 'Nuvem';
    if (type === 'shape_line') return 'Linha';
    if (type === 'shape_arrow_right') return 'Seta Direita';
    if (type === 'shape_arrow_left') return 'Seta Esquerda';
    if (type === 'shape_arrow_up') return 'Seta Cima';
    if (type === 'shape_arrow_down') return 'Seta Baixo';
    if (type === 'shape_chevron_right') return 'Chevron Direita';
    if (type === 'shape_chevron_left') return 'Chevron Esquerda';
    if (type === 'logo_box') return 'Logo Box';
    if (type === 'color_row') return 'Linha de Paleta';
    if (type === 'mockup_slot') return 'Slot de Mockup';
    if (type === 'cta_button') return 'Botão CTA';
    if (type === 'divider') return 'Divisor';
    if (type === 'stat_card') return 'Card Métrica';
    if (type === 'tag_chip') return 'Tag';
    if (type === 'info_card') return 'Info Card';
    if (type === 'quote_block') return 'Citação';
    if (type === 'timeline_step') return 'Etapa Timeline';
    if (type === 'comparison_card') return 'Comparação';
    return 'Texto';
}

function createDefaultDesignElement(type = 'text', position = {}) {
    const normalizedType = normalizeDesignElementType(type, 'text');
    const defaults = {
        title: {
            x: 80,
            y: 76,
            w: 760,
            h: 92,
            text: '{{project.title}}',
            fontSize: 56,
            color: '#142036',
            bg: '#ffffff',
            radius: 0,
            opacity: 100,
            align: 'left'
        },
        text: {
            x: 80,
            y: 190,
            w: 760,
            h: 110,
            text: '{{project.description}}',
            fontSize: 22,
            color: '#304364',
            bg: '#ffffff',
            radius: 0,
            opacity: 100,
            align: 'left'
        },
        subtitle: {
            x: 80,
            y: 168,
            w: 760,
            h: 58,
            text: 'Subtítulo estratégico',
            fontSize: 32,
            color: '#1f2b45',
            bg: '#ffffff',
            radius: 0,
            opacity: 100,
            align: 'left'
        },
        bullet_list: {
            x: 80,
            y: 320,
            w: 640,
            h: 180,
            text: 'Ponto 1\\nPonto 2\\nPonto 3',
            fontSize: 20,
            color: '#243a60',
            bg: '#ffffff',
            radius: 0,
            opacity: 100,
            align: 'left'
        },
        shape: {
            x: 80,
            y: 340,
            w: 460,
            h: 220,
            text: '',
            fontSize: 16,
            color: '#18355f',
            bg: '#eaf2ff',
            radius: 14,
            opacity: 100,
            align: 'left'
        },
        shape_rect: {
            x: 80,
            y: 340,
            w: 260,
            h: 150,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#eaf2ff',
            radius: 10,
            opacity: 100,
            align: 'left'
        },
        shape_round_rect: {
            x: 360,
            y: 340,
            w: 260,
            h: 150,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#eaf2ff',
            radius: 32,
            opacity: 100,
            align: 'left'
        },
        shape_parallelogram: {
            x: 640,
            y: 340,
            w: 240,
            h: 150,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#e8f1ff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_trapezoid: {
            x: 900,
            y: 340,
            w: 220,
            h: 150,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#e2edff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_ellipse: {
            x: 370,
            y: 340,
            w: 220,
            h: 140,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#e6f0ff',
            radius: 999,
            opacity: 100,
            align: 'center'
        },
        shape_triangle: {
            x: 620,
            y: 340,
            w: 200,
            h: 170,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#dfeaff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_diamond: {
            x: 850,
            y: 340,
            w: 170,
            h: 170,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#deebff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_pentagon: {
            x: 80,
            y: 520,
            w: 180,
            h: 170,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#e2edff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_hexagon: {
            x: 280,
            y: 520,
            w: 200,
            h: 170,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#deebff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_octagon: {
            x: 500,
            y: 520,
            w: 190,
            h: 170,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#deebff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_star: {
            x: 710,
            y: 520,
            w: 190,
            h: 170,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#dfebff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_heart: {
            x: 920,
            y: 520,
            w: 180,
            h: 170,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#e2edff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_cloud: {
            x: 80,
            y: 560,
            w: 240,
            h: 150,
            text: '',
            fontSize: 16,
            color: '#1d3968',
            bg: '#e8f1ff',
            radius: 62,
            opacity: 100,
            align: 'center'
        },
        shape_line: {
            x: 80,
            y: 540,
            w: 420,
            h: 24,
            text: '',
            fontSize: 14,
            color: '#2a4f8f',
            bg: '#ffffff',
            radius: 0,
            opacity: 100,
            align: 'left'
        },
        shape_arrow_right: {
            x: 520,
            y: 560,
            w: 270,
            h: 120,
            text: '',
            fontSize: 15,
            color: '#1d3968',
            bg: '#deebff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_arrow_left: {
            x: 810,
            y: 560,
            w: 270,
            h: 120,
            text: '',
            fontSize: 15,
            color: '#1d3968',
            bg: '#deebff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_arrow_up: {
            x: 80,
            y: 500,
            w: 120,
            h: 220,
            text: '',
            fontSize: 14,
            color: '#1d3968',
            bg: '#deebff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_arrow_down: {
            x: 220,
            y: 500,
            w: 120,
            h: 220,
            text: '',
            fontSize: 14,
            color: '#1d3968',
            bg: '#deebff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_chevron_right: {
            x: 360,
            y: 560,
            w: 150,
            h: 120,
            text: '',
            fontSize: 14,
            color: '#1d3968',
            bg: '#deebff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        shape_chevron_left: {
            x: 530,
            y: 560,
            w: 150,
            h: 120,
            text: '',
            fontSize: 14,
            color: '#1d3968',
            bg: '#deebff',
            radius: 0,
            opacity: 100,
            align: 'center'
        },
        logo_box: {
            x: 870,
            y: 76,
            w: 240,
            h: 140,
            text: 'LOGO',
            fontSize: 28,
            color: '#18355f',
            bg: '#f7faff',
            radius: 10,
            opacity: 100,
            align: 'center'
        },
        color_row: {
            x: 80,
            y: 610,
            w: 740,
            h: 70,
            text: '',
            fontSize: 14,
            color: '#1f2b45',
            bg: '#ffffff',
            radius: 10,
            opacity: 100,
            align: 'left'
        },
        mockup_slot: {
            x: 860,
            y: 250,
            w: 260,
            h: 300,
            text: 'Mockup',
            fontSize: 16,
            color: '#18355f',
            bg: '#edf3ff',
            radius: 12,
            opacity: 100,
            align: 'center'
        },
        cta_button: {
            x: 80,
            y: 540,
            w: 260,
            h: 56,
            text: 'Acessar Brandbook',
            fontSize: 18,
            color: '#f8fbff',
            bg: '#213fa9',
            radius: 12,
            opacity: 100,
            align: 'center'
        },
        divider: {
            x: 80,
            y: 520,
            w: 760,
            h: 28,
            text: '',
            fontSize: 14,
            color: '#4f6b94',
            bg: '#ffffff',
            radius: 0,
            opacity: 100,
            align: 'left'
        },
        stat_card: {
            x: 860,
            y: 120,
            w: 260,
            h: 150,
            text: '92%\\nconsistência visual',
            fontSize: 18,
            color: '#17355f',
            bg: '#edf3ff',
            radius: 14,
            opacity: 100,
            align: 'left'
        },
        tag_chip: {
            x: 80,
            y: 610,
            w: 220,
            h: 42,
            text: '#brand-governance',
            fontSize: 15,
            color: '#19388f',
            bg: '#dfe9ff',
            radius: 999,
            opacity: 100,
            align: 'center'
        },
        info_card: {
            x: 80,
            y: 240,
            w: 360,
            h: 170,
            text: 'Título do card\\nTexto de apoio com contexto.',
            fontSize: 18,
            color: '#17345f',
            bg: '#edf4ff',
            radius: 14,
            opacity: 100,
            align: 'left'
        },
        quote_block: {
            x: 470,
            y: 240,
            w: 420,
            h: 180,
            text: '"Marca forte nasce da consistência visual."\\nEquipe Quotia',
            fontSize: 20,
            color: '#183760',
            bg: '#f4f8ff',
            radius: 14,
            opacity: 100,
            align: 'left'
        },
        timeline_step: {
            x: 80,
            y: 450,
            w: 420,
            h: 110,
            text: 'Etapa 01\\nDefinir direção visual',
            fontSize: 17,
            color: '#1a3966',
            bg: '#eef4ff',
            radius: 12,
            opacity: 100,
            align: 'left'
        },
        comparison_card: {
            x: 530,
            y: 450,
            w: 460,
            h: 150,
            text: 'Antes | Depois\\nBaixa consistência | Sistema unificado',
            fontSize: 16,
            color: '#1a385f',
            bg: '#eef4ff',
            radius: 12,
            opacity: 100,
            align: 'left'
        }
    };
    const base = defaults[normalizedType] || defaults.text;
    return {
        id: createLocalUid('el'),
        type: normalizedType,
        x: clampNumber(position.x, 0, DESIGN_CANVAS_WIDTH - 24, base.x),
        y: clampNumber(position.y, 0, DESIGN_CANVAS_HEIGHT - 24, base.y),
        w: clampNumber(position.w, 24, DESIGN_CANVAS_WIDTH, base.w),
        h: clampNumber(position.h, 24, DESIGN_CANVAS_HEIGHT, base.h),
        text: String(position.text ?? base.text ?? '').slice(0, 800),
        fontSize: clampNumber(position.fontSize, 8, 120, base.fontSize),
        color: normalizeHex(position.color ?? base.color, '#142036'),
        bg: normalizeHex(position.bg ?? base.bg, '#ffffff'),
        radius: clampNumber(position.radius, 0, 120, base.radius),
        opacity: clampNumber(position.opacity, 5, 100, base.opacity),
        align: normalizeDesignAlign(position.align ?? base.align),
        locked: Boolean(position.locked ?? false)
    };
}

function setActiveDesignRibbonTab(tabId = 'home') {
    const ribbon = document.getElementById('designStudioRibbon');
    if (!(ribbon instanceof HTMLElement)) {
        return;
    }
    const tabs = Array.from(ribbon.querySelectorAll('[data-design-ribbon-tab]')).filter((item) => item instanceof HTMLButtonElement);
    const panels = Array.from(ribbon.querySelectorAll('[data-design-ribbon-panel]')).filter((item) => item instanceof HTMLElement);
    if (!tabs.length || !panels.length) {
        return;
    }

    const preferredTab = String(tabId || '').toLowerCase();
    const validTab = tabs.some((button) => String(button.dataset.designRibbonTab || '').toLowerCase() === preferredTab)
        ? preferredTab
        : String(tabs[0].dataset.designRibbonTab || 'home').toLowerCase();

    tabs.forEach((button) => {
        const key = String(button.dataset.designRibbonTab || '').toLowerCase();
        const isActive = key === validTab;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach((panel) => {
        const key = String(panel.dataset.designRibbonPanel || '').toLowerCase();
        const isActive = key === validTab;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
    });
    if (validTab !== 'insert') {
        closeAllDesignInsertLibraries();
    }
}

function getDesignInsertLibraries() {
    return [
        { key: 'text', toggleId: 'designInsertTextToggle', panelId: 'designInsertTextPanel' },
        { key: 'shapes', toggleId: 'designInsertShapesToggle', panelId: 'designInsertShapesPanel' },
        { key: 'elements', toggleId: 'designInsertElementsToggle', panelId: 'designInsertElementsPanel' },
        { key: 'media', toggleId: 'designInsertMediaToggle', panelId: 'designInsertMediaPanel' }
    ];
}

function setDesignInsertLibraryOpen(libraryKey, open) {
    const key = String(libraryKey || '').toLowerCase();
    const library = getDesignInsertLibraries().find((item) => item.key === key);
    if (!library) {
        return;
    }
    const panel = document.getElementById(library.panelId);
    const toggle = document.getElementById(library.toggleId);
    if (!(panel instanceof HTMLElement) || !(toggle instanceof HTMLButtonElement)) {
        return;
    }
    const isOpen = Boolean(open);
    panel.hidden = !isOpen;
    panel.classList.toggle('is-open', isOpen);
    toggle.classList.toggle('is-active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function closeAllDesignInsertLibraries(exceptKey = '') {
    const normalizedExcept = String(exceptKey || '').toLowerCase();
    getDesignInsertLibraries().forEach((library) => {
        if (normalizedExcept && library.key === normalizedExcept) {
            return;
        }
        setDesignInsertLibraryOpen(library.key, false);
    });
}

function setActiveDesignInspectorTab(tabId = 'content') {
    const inspector = document.querySelector('#designerStudio .designer-inspector');
    if (!(inspector instanceof HTMLElement)) {
        return;
    }
    const tabs = Array.from(inspector.querySelectorAll('[data-design-inspector-tab]')).filter((item) => item instanceof HTMLButtonElement);
    const panels = Array.from(inspector.querySelectorAll('[data-design-inspector-panel]')).filter((item) => item instanceof HTMLElement);
    if (!tabs.length || !panels.length) {
        return;
    }
    refreshDesignInspectorTabsAvailability();

    const preferredTab = String(tabId || '').toLowerCase();
    const visibleTabs = tabs.filter((button) => !button.hidden);
    const sourceTabs = visibleTabs.length ? visibleTabs : tabs;
    const validTab = sourceTabs.some((button) => String(button.dataset.designInspectorTab || '').toLowerCase() === preferredTab)
        ? preferredTab
        : String(sourceTabs[0].dataset.designInspectorTab || 'content').toLowerCase();

    tabs.forEach((button) => {
        const key = String(button.dataset.designInspectorTab || '').toLowerCase();
        const isActive = key === validTab;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach((panel) => {
        const key = String(panel.dataset.designInspectorPanel || '').toLowerCase();
        const isActive = key === validTab;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
    });
}

function refreshDesignInspectorTabsAvailability() {
    const inspector = document.querySelector('#designerStudio .designer-inspector');
    if (!(inspector instanceof HTMLElement)) {
        return;
    }
    const tabs = Array.from(inspector.querySelectorAll('[data-design-inspector-tab]')).filter((item) => item instanceof HTMLButtonElement);
    const panels = Array.from(inspector.querySelectorAll('[data-design-inspector-panel]')).filter((item) => item instanceof HTMLElement);
    if (!tabs.length || !panels.length) {
        return;
    }

    tabs.forEach((button) => {
        const key = String(button.dataset.designInspectorTab || '').toLowerCase();
        const panel = panels.find((item) => String(item.dataset.designInspectorPanel || '').toLowerCase() === key) || null;
        const hasContent = Boolean(panel?.querySelector('.builder-field, .actions .btn, .builder-meta'));
        button.hidden = !hasContent;
        button.disabled = !hasContent;
        if (panel) {
            panel.classList.toggle('is-empty', !hasContent);
        }
    });
}

function setupDesignInspectorTabs() {
    const inspector = document.querySelector('#designerStudio .designer-inspector');
    if (!(inspector instanceof HTMLElement)) {
        return;
    }
    if (inspector.dataset.tabsReady === '1') {
        return;
    }

    inspector.querySelectorAll('[data-design-inspector-tab]').forEach((tabButton) => {
        if (!(tabButton instanceof HTMLButtonElement)) {
            return;
        }
        tabButton.addEventListener('click', () => {
            setActiveDesignInspectorTab(tabButton.dataset.designInspectorTab || 'content');
        });
    });
    refreshDesignInspectorTabsAvailability();
    setActiveDesignInspectorTab('content');
    inspector.dataset.tabsReady = '1';
}

function mountDesignRibbonNode(targetId, node) {
    const target = document.getElementById(String(targetId || ''));
    if (!(target instanceof HTMLElement) || !(node instanceof HTMLElement)) {
        return false;
    }
    target.appendChild(node);
    return true;
}

function optimizeDesignRibbonCompactFields() {
    const ribbon = document.getElementById('designStudioRibbon');
    if (!(ribbon instanceof HTMLElement)) {
        return;
    }

    ribbon.querySelectorAll('.builder-field').forEach((field) => {
        if (!(field instanceof HTMLElement)) {
            return;
        }
        field.classList.add('is-ribbon-compact-field');
        const label = field.querySelector('span');
        const labelText = label ? String(label.textContent || '').trim() : '';
        const control = field.querySelector('input, select, textarea');
        if (!control || !(control instanceof HTMLElement) || !labelText) {
            return;
        }
        if (!control.getAttribute('title')) {
            control.setAttribute('title', labelText);
        }
        if (!control.getAttribute('aria-label')) {
            control.setAttribute('aria-label', labelText);
        }
    });

    ribbon.querySelectorAll('.designer-snap-preset[data-tooltip]').forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) {
            return;
        }
        const tooltip = String(button.dataset.tooltip || button.getAttribute('aria-label') || '').trim();
        if (!tooltip) {
            return;
        }
        button.setAttribute('title', tooltip);
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', tooltip);
        }
    });
}

function setupDesignInsertLibraries() {
    const studio = document.getElementById('designerStudio');
    if (!(studio instanceof HTMLElement)) {
        return;
    }
    if (studio.dataset.insertLibrariesReady === '1') {
        return;
    }

    const libraries = getDesignInsertLibraries().map((item) => ({
        ...item,
        toggle: document.getElementById(item.toggleId),
        panel: document.getElementById(item.panelId)
    })).filter((item) => item.toggle instanceof HTMLButtonElement && item.panel instanceof HTMLElement);

    if (!libraries.length) {
        return;
    }

    libraries.forEach((library) => {
        const toggle = library.toggle;
        const panel = library.panel;
        if (!(toggle instanceof HTMLButtonElement) || !(panel instanceof HTMLElement)) {
            return;
        }
        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                setDesignInsertLibraryOpen(library.key, false);
                return;
            }
            closeAllDesignInsertLibraries(library.key);
            setDesignInsertLibraryOpen(library.key, true);
        });

        panel.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) {
                return;
            }
            const addButton = target.closest('[data-design-add]');
            if (addButton) {
                closeAllDesignInsertLibraries();
            }
        });
    });

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const isInsideLibrary = libraries.some((library) => {
            const toggle = library.toggle;
            const panel = library.panel;
            return Boolean(toggle instanceof HTMLElement && panel instanceof HTMLElement && (toggle.contains(target) || panel.contains(target)));
        });
        if (isInsideLibrary) {
            return;
        }
        closeAllDesignInsertLibraries();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllDesignInsertLibraries();
        }
    });

    closeAllDesignInsertLibraries();
    studio.dataset.insertLibrariesReady = '1';
}

function setupDesignStudioRibbon() {
    const studio = document.getElementById('designerStudio');
    const ribbon = document.getElementById('designStudioRibbon');
    if (!(studio instanceof HTMLElement) || !(ribbon instanceof HTMLElement)) {
        return;
    }
    if (ribbon.dataset.ribbonReady === '1') {
        return;
    }

    let movedAny = false;
    const tryMount = (targetId, node) => {
        const moved = mountDesignRibbonNode(targetId, node);
        movedAny = movedAny || moved;
    };

    tryMount('designRibbonHomeCore', document.getElementById('designPageSelect')?.closest('.builder-field'));
    tryMount('designRibbonHomeCore', document.getElementById('addDesignPageBtn')?.closest('.actions'));
    tryMount('designRibbonHomeSnap', document.getElementById('designSnapResetBtn')?.closest('.designer-snap-panel'));

    tryMount('designRibbonInsertText', document.getElementById('designInsertSourceText'));
    tryMount('designRibbonInsertIllustrations', document.getElementById('designInsertSourceIllustrations'));
    tryMount('designRibbonInsertElements', document.getElementById('designInsertSourceElements'));
    tryMount('designRibbonInsertMedia', document.getElementById('designInsertSourceMedia'));

    tryMount('designRibbonArrangeEdit', document.getElementById('duplicateDesignElementBtn')?.closest('.actions'));
    tryMount('designRibbonArrangeResize', document.getElementById('designResizeWMinusBtn')?.closest('.actions'));
    tryMount('designRibbonArrangeLayer', document.getElementById('designLayerBackBtn')?.closest('.actions'));

    tryMount('designRibbonAlignCanvas', document.getElementById('designAlignLeftBtn')?.closest('.actions'));
    tryMount('designRibbonAlignSelection', document.getElementById('designAlignSelLeftBtn')?.closest('.actions'));

    tryMount('designRibbonStyleTools', document.getElementById('designCopyStyleBtn')?.closest('.actions'));
    tryMount('designRibbonStyleHints', studio.querySelector('.designer-shortcuts-note'));

    tryMount('designRibbonIntegrationMap', studio.querySelector('.designer-import .designer-mapping'));
    tryMount('designRibbonIntegrationIo', document.getElementById('importFigmaJsonBtn')?.closest('.actions'));
    tryMount('designRibbonTemplateOps', document.getElementById('createCustomTemplateBtn')?.closest('.icon-toolbar'));
    tryMount('designRibbonPublishOps', document.getElementById('printTemplateBtn')?.closest('.icon-toolbar'));

    const snapPresetBar = ribbon.querySelector('#designRibbonHomeSnap .designer-snap-presets');
    if (snapPresetBar instanceof HTMLElement) {
        ['designSnapGridBtn', 'designSnapElementBtn'].forEach((buttonId) => {
            const button = document.getElementById(buttonId);
            if (button instanceof HTMLElement) {
                snapPresetBar.appendChild(button);
            }
        });
    }

    if (movedAny) {
        studio.querySelectorAll('.designer-controls').forEach((block) => {
            if (block instanceof HTMLElement) {
                block.classList.add('is-ribbon-source-empty');
            }
        });
        const sourceImport = studio.querySelector('.designer-import');
        if (sourceImport instanceof HTMLElement) {
            sourceImport.classList.add('is-ribbon-source-empty');
        }
    }

    const shortcutsNote = ribbon.querySelector('#designRibbonStyleHints .designer-shortcuts-note');
    if (shortcutsNote instanceof HTMLElement) {
        const noteText = String(shortcutsNote.textContent || '').trim();
        if (noteText && !shortcutsNote.getAttribute('title')) {
            shortcutsNote.setAttribute('title', noteText);
        }
    }

    refreshDesignInspectorTabsAvailability();

    ribbon.querySelectorAll('[data-design-ribbon-tab]').forEach((tabButton) => {
        if (!(tabButton instanceof HTMLButtonElement)) {
            return;
        }
        tabButton.addEventListener('click', () => {
            setActiveDesignRibbonTab(tabButton.dataset.designRibbonTab || 'home');
        });
    });
    optimizeDesignRibbonCompactFields();
    setupDesignInsertLibraries();
    setActiveDesignRibbonTab('home');
    ribbon.dataset.ribbonReady = '1';
}

function createDefaultDesignPage(name = 'Página 1', moduleId = 'cover') {
    const title = createDefaultDesignElement('title');
    const text = createDefaultDesignElement('text');
    return {
        id: createLocalUid('page'),
        name: String(name || 'Página').slice(0, 80),
        moduleId: String(moduleId || ''),
        elements: [title, text]
    };
}

function createDefaultDesignStudio() {
    const page = createDefaultDesignPage('Página 1', 'cover');
    return sanitizeDesignStudio({
        schema: DESIGN_STUDIO_SCHEMA,
        source: 'manual',
        pages: [page],
        selectedPageId: page.id,
        selectedElementId: page.elements[0]?.id || '',
        selectedElementIds: page.elements[0]?.id ? [page.elements[0].id] : []
    });
}

function createDefaultFigmaNamingConfig() {
    return {
        presetId: DEFAULT_FIGMA_NAMING_PRESET_ID,
        customRulesText: ''
    };
}

function sanitizeFigmaNamingConfig(rawConfig) {
    const source = rawConfig && typeof rawConfig === 'object' ? rawConfig : {};
    const presetId = String(source.presetId || DEFAULT_FIGMA_NAMING_PRESET_ID);
    const safePresetId = Object.prototype.hasOwnProperty.call(FIGMA_NAMING_PRESETS, presetId)
        ? presetId
        : DEFAULT_FIGMA_NAMING_PRESET_ID;
    return {
        presetId: safePresetId,
        customRulesText: String(source.customRulesText || '').slice(0, 5000)
    };
}

function normalizeNameForMatching(value) {
    return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function parseKeywordList(value) {
    return String(value || '')
        .split(/[,\|]/g)
        .map((item) => normalizeNameForMatching(item))
        .filter(Boolean);
}

function getDefaultFigmaNamingProfile() {
    const preset = FIGMA_NAMING_PRESETS[DEFAULT_FIGMA_NAMING_PRESET_ID] || FIGMA_NAMING_PRESETS.balanced;
    return {
        moduleAliases: { ...(preset.moduleAliases || {}) },
        elementAliases: { ...(preset.elementAliases || {}) },
        ignoreKeywords: Array.isArray(preset.ignoreKeywords) ? preset.ignoreKeywords.slice() : [],
        titleMinSize: Number(preset.titleMinSize || 40)
    };
}

function parseCustomFigmaNamingRules(customRulesText) {
    const lines = String(customRulesText || '')
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && !line.startsWith('//'));

    const rules = {
        moduleAliases: {},
        elementAliases: {},
        ignoreKeywords: [],
        titleMinSize: null
    };

    lines.forEach((line) => {
        const parts = line.split('=');
        if (parts.length < 2) {
            return;
        }
        const left = normalizeNameForMatching(parts[0]);
        const rightRaw = parts.slice(1).join('=').trim();
        const values = parseKeywordList(rightRaw);
        if (!values.length && left !== 'title_min_size') {
            return;
        }

        if (left.startsWith('module.')) {
            const moduleId = left.replace('module.', '').trim().replace(/[-\s]+/g, '_');
            if (moduleId) {
                rules.moduleAliases[moduleId] = values;
            }
            return;
        }

        if (left.startsWith('element.')) {
            const elementType = left.replace('element.', '').trim().replace(/[-\s]+/g, '_');
            if (DESIGN_ELEMENT_TYPES.includes(elementType)) {
                rules.elementAliases[elementType] = values;
            }
            return;
        }

        if (left === 'ignore' || left === 'ignore_keywords') {
            rules.ignoreKeywords = values;
            return;
        }

        if (left === 'title_min_size' || left === 'title_size') {
            const numeric = Number.parseInt(rightRaw, 10);
            if (Number.isFinite(numeric)) {
                rules.titleMinSize = clampNumber(numeric, 10, 160, 40);
            }
        }
    });

    return rules;
}

function buildFigmaNamingProfile(config = currentContext.figmaNamingConfig) {
    const safeConfig = sanitizeFigmaNamingConfig(config);
    const basePreset = FIGMA_NAMING_PRESETS[safeConfig.presetId] || FIGMA_NAMING_PRESETS[DEFAULT_FIGMA_NAMING_PRESET_ID];
    const profile = {
        moduleAliases: {},
        elementAliases: {},
        ignoreKeywords: [],
        titleMinSize: clampNumber(basePreset?.titleMinSize, 10, 160, 40)
    };

    const moduleKeys = ['cover', 'mini_board', 'index', 'palette', 'typography', 'logo_system', 'mockups', 'digital', 'playbook', 'closing'];
    moduleKeys.forEach((moduleId) => {
        profile.moduleAliases[moduleId] = parseKeywordList((basePreset?.moduleAliases?.[moduleId] || []).join(','));
    });

    DESIGN_ELEMENT_TYPES.forEach((elementType) => {
        profile.elementAliases[elementType] = parseKeywordList((basePreset?.elementAliases?.[elementType] || []).join(','));
    });

    profile.ignoreKeywords = parseKeywordList((Array.isArray(basePreset?.ignoreKeywords) ? basePreset.ignoreKeywords : []).join(','));

    const custom = parseCustomFigmaNamingRules(safeConfig.customRulesText);
    Object.entries(custom.moduleAliases).forEach(([moduleId, aliases]) => {
        profile.moduleAliases[moduleId] = aliases;
    });
    Object.entries(custom.elementAliases).forEach(([elementType, aliases]) => {
        profile.elementAliases[elementType] = aliases;
    });
    if (custom.ignoreKeywords.length) {
        profile.ignoreKeywords = custom.ignoreKeywords;
    }
    if (Number.isFinite(custom.titleMinSize)) {
        profile.titleMinSize = clampNumber(custom.titleMinSize, 10, 160, 40);
    }

    return profile;
}

function persistFigmaNamingConfigFromForm() {
    const presetField = document.getElementById('figmaNamingPresetSelect');
    const rulesField = document.getElementById('figmaNamingCustomRules');
    const config = sanitizeFigmaNamingConfig({
        presetId: presetField instanceof HTMLSelectElement ? presetField.value : DEFAULT_FIGMA_NAMING_PRESET_ID,
        customRulesText: rulesField instanceof HTMLTextAreaElement ? rulesField.value : ''
    });
    currentContext.figmaNamingConfig = config;
    return config;
}

function fillFigmaNamingConfigFields(config = currentContext.figmaNamingConfig) {
    const safe = sanitizeFigmaNamingConfig(config);
    const presetField = document.getElementById('figmaNamingPresetSelect');
    const rulesField = document.getElementById('figmaNamingCustomRules');
    if (presetField instanceof HTMLSelectElement) {
        presetField.value = safe.presetId;
    }
    if (rulesField instanceof HTMLTextAreaElement) {
        rulesField.value = safe.customRulesText;
    }
    currentContext.figmaNamingConfig = safe;
}

function sanitizeDesignElement(rawElement) {
    const source = rawElement && typeof rawElement === 'object' ? rawElement : {};
    const type = normalizeDesignElementType(source.type, 'text');
    const defaultSize = {
        title: { w: 760, h: 90, fontSize: 56, radius: 0, align: 'left' },
        subtitle: { w: 760, h: 58, fontSize: 32, radius: 0, align: 'left' },
        text: { w: 760, h: 120, fontSize: 22, radius: 0, align: 'left' },
        bullet_list: { w: 640, h: 180, fontSize: 20, radius: 0, align: 'left' },
        shape: { w: 320, h: 140, fontSize: 18, radius: 14, align: 'left' },
        shape_rect: { w: 260, h: 150, fontSize: 16, radius: 10, align: 'left' },
        shape_round_rect: { w: 260, h: 150, fontSize: 16, radius: 32, align: 'left' },
        shape_parallelogram: { w: 240, h: 150, fontSize: 16, radius: 0, align: 'center' },
        shape_trapezoid: { w: 220, h: 150, fontSize: 16, radius: 0, align: 'center' },
        shape_ellipse: { w: 220, h: 140, fontSize: 16, radius: 999, align: 'center' },
        shape_triangle: { w: 200, h: 170, fontSize: 16, radius: 0, align: 'center' },
        shape_diamond: { w: 170, h: 170, fontSize: 16, radius: 0, align: 'center' },
        shape_pentagon: { w: 180, h: 170, fontSize: 16, radius: 0, align: 'center' },
        shape_hexagon: { w: 200, h: 170, fontSize: 16, radius: 0, align: 'center' },
        shape_octagon: { w: 190, h: 170, fontSize: 16, radius: 0, align: 'center' },
        shape_star: { w: 190, h: 170, fontSize: 16, radius: 0, align: 'center' },
        shape_heart: { w: 180, h: 170, fontSize: 16, radius: 0, align: 'center' },
        shape_cloud: { w: 240, h: 150, fontSize: 16, radius: 62, align: 'center' },
        shape_line: { w: 420, h: 24, fontSize: 14, radius: 0, align: 'left' },
        shape_arrow_right: { w: 270, h: 120, fontSize: 15, radius: 0, align: 'center' },
        shape_arrow_left: { w: 270, h: 120, fontSize: 15, radius: 0, align: 'center' },
        shape_arrow_up: { w: 120, h: 220, fontSize: 14, radius: 0, align: 'center' },
        shape_arrow_down: { w: 120, h: 220, fontSize: 14, radius: 0, align: 'center' },
        shape_chevron_right: { w: 150, h: 120, fontSize: 14, radius: 0, align: 'center' },
        shape_chevron_left: { w: 150, h: 120, fontSize: 14, radius: 0, align: 'center' },
        logo_box: { w: 240, h: 140, fontSize: 26, radius: 10, align: 'center' },
        color_row: { w: 740, h: 70, fontSize: 14, radius: 10, align: 'left' },
        mockup_slot: { w: 280, h: 300, fontSize: 16, radius: 12, align: 'center' },
        cta_button: { w: 260, h: 56, fontSize: 18, radius: 12, align: 'center' },
        divider: { w: 760, h: 28, fontSize: 14, radius: 0, align: 'left' },
        stat_card: { w: 260, h: 150, fontSize: 18, radius: 14, align: 'left' },
        tag_chip: { w: 220, h: 42, fontSize: 15, radius: 999, align: 'center' },
        info_card: { w: 360, h: 170, fontSize: 18, radius: 14, align: 'left' },
        quote_block: { w: 420, h: 180, fontSize: 20, radius: 14, align: 'left' },
        timeline_step: { w: 420, h: 110, fontSize: 17, radius: 12, align: 'left' },
        comparison_card: { w: 460, h: 150, fontSize: 16, radius: 12, align: 'left' }
    };
    const typeDefaults = defaultSize[type] || defaultSize.text;
    return {
        id: String(source.id || createLocalUid('el')),
        type,
        x: clampNumber(source.x, 0, 2400, 80),
        y: clampNumber(source.y, 0, 1600, 80),
        w: clampNumber(source.w, DESIGN_MIN_ELEMENT_SIZE, 2400, typeDefaults.w),
        h: clampNumber(source.h, DESIGN_MIN_ELEMENT_SIZE, 1600, typeDefaults.h),
        text: String(source.text || '').slice(0, 1200),
        fontSize: clampNumber(source.fontSize, 8, 160, typeDefaults.fontSize),
        color: normalizeHex(source.color, '#142036'),
        bg: normalizeHex(source.bg, '#ffffff'),
        radius: clampNumber(source.radius, 0, 999, typeDefaults.radius),
        opacity: clampNumber(source.opacity, 5, 100, 100),
        align: normalizeDesignAlign(source.align, typeDefaults.align),
        locked: Boolean(source.locked)
    };
}

function sanitizeDesignPage(rawPage, fallbackName = 'Página') {
    const source = rawPage && typeof rawPage === 'object' ? rawPage : {};
    const rawElements = Array.isArray(source.elements) ? source.elements : [];
    const elements = rawElements
        .map((item) => sanitizeDesignElement(item))
        .filter((item) => item && typeof item === 'object');

    if (!elements.length) {
        elements.push(createDefaultDesignElement('title'));
        elements.push(createDefaultDesignElement('text'));
    }

    return {
        id: String(source.id || createLocalUid('page')),
        name: String(source.name || fallbackName).trim().slice(0, 80) || fallbackName,
        moduleId: String(source.moduleId || '').slice(0, 50),
        elements
    };
}

function sanitizeDesignStudio(rawStudio, options = {}) {
    const settings = {
        ensurePage: true,
        ...options
    };
    const source = rawStudio && typeof rawStudio === 'object' ? rawStudio : {};
    const rawPages = Array.isArray(source.pages) ? source.pages : [];
    const pages = rawPages
        .map((page, index) => sanitizeDesignPage(page, `Página ${index + 1}`))
        .filter((page) => page && typeof page === 'object');

    if (!pages.length && settings.ensurePage) {
        pages.push(createDefaultDesignPage('Página 1', 'cover'));
    }

    const selectedPageIdRaw = String(source.selectedPageId || '');
    const safeSelectedPageId = pages.some((page) => page.id === selectedPageIdRaw)
        ? selectedPageIdRaw
        : (pages[0]?.id || '');

    const activePage = pages.find((page) => page.id === safeSelectedPageId) || null;
    const selectedElementIdRaw = String(source.selectedElementId || '');
    const safeSelectedElementId = activePage && activePage.elements.some((el) => el.id === selectedElementIdRaw)
        ? selectedElementIdRaw
        : (activePage?.elements?.[0]?.id || '');
    const rawSelectedIds = Array.isArray(source.selectedElementIds)
        ? source.selectedElementIds.map((item) => String(item || '').trim()).filter(Boolean)
        : [];
    const validElementIds = new Set(Array.isArray(activePage?.elements) ? activePage.elements.map((item) => item.id) : []);
    const safeSelectedIds = [];
    rawSelectedIds.forEach((id) => {
        if (!validElementIds.has(id)) {
            return;
        }
        if (!safeSelectedIds.includes(id)) {
            safeSelectedIds.push(id);
        }
    });
    if (safeSelectedElementId && validElementIds.has(safeSelectedElementId) && !safeSelectedIds.includes(safeSelectedElementId)) {
        safeSelectedIds.unshift(safeSelectedElementId);
    }
    if (!safeSelectedIds.length && safeSelectedElementId) {
        safeSelectedIds.push(safeSelectedElementId);
    }

    return {
        schema: DESIGN_STUDIO_SCHEMA,
        source: String(source.source || 'manual').slice(0, 40) || 'manual',
        pages,
        selectedPageId: safeSelectedPageId,
        selectedElementId: safeSelectedElementId,
        selectedElementIds: safeSelectedIds
    };
}

function getActiveDesignPage() {
    const studio = sanitizeDesignStudio(currentContext.designStudio, { ensurePage: false });
    if (!studio.pages.length) {
        return null;
    }
    const selectedId = String(studio.selectedPageId || '');
    return studio.pages.find((page) => page.id === selectedId) || studio.pages[0] || null;
}

function getSelectedDesignElement() {
    const page = getActiveDesignPage();
    if (!page) {
        return null;
    }
    const studio = sanitizeDesignStudio(currentContext.designStudio, { ensurePage: false });
    const selectedId = String(studio.selectedElementId || '');
    return page.elements.find((item) => item.id === selectedId) || page.elements[0] || null;
}

function getSelectedDesignElementIds(studioInput = currentContext.designStudio) {
    const studio = ensureDesignStudioSelection(sanitizeDesignStudio(studioInput, { ensurePage: false }));
    const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
    if (!page) {
        return [];
    }
    const allowed = new Set(page.elements.map((item) => item.id));
    const selectedIds = Array.isArray(studio.selectedElementIds)
        ? studio.selectedElementIds.filter((id) => allowed.has(id))
        : [];
    const primaryId = String(studio.selectedElementId || '');
    if (primaryId && allowed.has(primaryId) && !selectedIds.includes(primaryId)) {
        selectedIds.unshift(primaryId);
    }
    if (!selectedIds.length && primaryId && allowed.has(primaryId)) {
        selectedIds.push(primaryId);
    }
    return selectedIds;
}

function getSelectedDesignElements(studioInput = currentContext.designStudio) {
    const studio = ensureDesignStudioSelection(sanitizeDesignStudio(studioInput, { ensurePage: false }));
    const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
    if (!page) {
        return [];
    }
    const selectedIds = getSelectedDesignElementIds(studio);
    const selectedIdSet = new Set(selectedIds);
    return page.elements.filter((item) => selectedIdSet.has(item.id));
}

function getSelectedUnlockedDesignElements(studioInput = currentContext.designStudio) {
    return getSelectedDesignElements(studioInput).filter((item) => !item.locked);
}

function sanitizeDesignSnapSettings(rawSettings = currentContext.designSnapSettings) {
    const source = rawSettings && typeof rawSettings === 'object' ? rawSettings : {};
    return {
        gridEnabled: Boolean(source.gridEnabled),
        elementEnabled: Boolean(source.elementEnabled),
        gridSize: clampNumber(source.gridSize, 4, 120, DESIGN_SNAP_GRID_SIZE),
        threshold: clampNumber(source.threshold, 2, 24, DESIGN_SNAP_THRESHOLD)
    };
}

function updateDesignCanvasGridVisual(settingsInput = currentContext.designSnapSettings) {
    const canvas = document.getElementById('designStudioCanvas');
    if (!canvas) {
        return;
    }
    const settings = sanitizeDesignSnapSettings(settingsInput);
    const gridSize = Math.round(clampNumber(settings.gridSize, 4, 120, DESIGN_SNAP_GRID_SIZE));
    canvas.style.setProperty('--designer-grid-size', `${gridSize}px`);
    canvas.classList.toggle('is-grid-hidden', !settings.gridEnabled);
}

function getDesignSnapPreset(presetKey = 'balanced') {
    const key = String(presetKey || '').toLowerCase();
    return DESIGN_SNAP_PRESETS[key] || DESIGN_SNAP_PRESETS.balanced;
}

function matchDesignSnapPreset(settingsInput = currentContext.designSnapSettings) {
    const settings = sanitizeDesignSnapSettings(settingsInput);
    const presetEntries = Object.entries(DESIGN_SNAP_PRESETS);
    for (let index = 0; index < presetEntries.length; index += 1) {
        const [presetKey, preset] = presetEntries[index];
        if (
            settings.gridEnabled === Boolean(preset.gridEnabled)
            && settings.elementEnabled === Boolean(preset.elementEnabled)
            && Number(settings.gridSize) === Number(preset.gridSize)
            && Number(settings.threshold) === Number(preset.threshold)
        ) {
            return presetKey;
        }
    }
    return '';
}

function applyDesignSnapPreset(presetKey = 'balanced', options = {}) {
    const settings = {
        announce: false,
        ...options
    };
    const preset = getDesignSnapPreset(presetKey);
    currentContext.designSnapSettings = sanitizeDesignSnapSettings({
        ...currentContext.designSnapSettings,
        gridEnabled: Boolean(preset.gridEnabled),
        elementEnabled: Boolean(preset.elementEnabled),
        gridSize: Number(preset.gridSize),
        threshold: Number(preset.threshold)
    });
    renderDesignSnapControls();

    if (!settings.announce) {
        return;
    }
    if (!preset.gridEnabled && !preset.elementEnabled) {
        setStatus(`Preset ${preset.label} aplicado: snap desativado para movimento livre.`, 'ok');
        return;
    }
    setStatus(`Preset ${preset.label} aplicado (${currentContext.designSnapSettings.gridSize}px grade | ${currentContext.designSnapSettings.threshold}px sensibilidade).`, 'ok');
}

function updateDesignSnapSetting(settingKey, rawValue, options = {}) {
    const settings = {
        announce: false,
        ...options
    };
    const key = String(settingKey || '');
    if (!key || !['gridSize', 'threshold'].includes(key)) {
        return;
    }
    const previous = sanitizeDesignSnapSettings(currentContext.designSnapSettings);
    const next = sanitizeDesignSnapSettings({
        ...previous,
        [key]: rawValue
    });
    currentContext.designSnapSettings = next;
    renderDesignSnapControls();

    if (!settings.announce || previous[key] === next[key]) {
        return;
    }
    if (key === 'gridSize') {
        setStatus(`Grade de snap ajustada para ${next.gridSize}px.`, 'ok');
        return;
    }
    setStatus(`Sensibilidade de snap ajustada para ${next.threshold}px.`, 'ok');
}

function resetDesignSnapSettings(options = {}) {
    const settings = {
        announce: false,
        ...options
    };
    applyDesignSnapPreset('balanced', { announce: false });
    if (!settings.announce) {
        return;
    }
    setStatus('Ajustes de snap restaurados para o padrão.', 'ok');
}

function renderDesignSnapControls() {
    currentContext.designSnapSettings = sanitizeDesignSnapSettings(currentContext.designSnapSettings);
    const settings = currentContext.designSnapSettings;
    const gridBtn = document.getElementById('designSnapGridBtn');
    const elementBtn = document.getElementById('designSnapElementBtn');
    const gridSizeInput = document.getElementById('designSnapGridSize');
    const thresholdInput = document.getElementById('designSnapThreshold');
    const resetBtn = document.getElementById('designSnapResetBtn');
    const activePresetKey = matchDesignSnapPreset(settings);

    if (gridBtn instanceof HTMLButtonElement) {
        const label = settings.gridEnabled ? 'Snap grade ativo' : 'Snap grade desligado';
        gridBtn.classList.toggle('is-active', settings.gridEnabled);
        gridBtn.setAttribute('aria-label', label);
        gridBtn.setAttribute('title', label);
        gridBtn.setAttribute('data-tooltip', label);
    }
    if (elementBtn instanceof HTMLButtonElement) {
        const label = settings.elementEnabled ? 'Snap elementos ativo' : 'Snap elementos desligado';
        elementBtn.classList.toggle('is-active', settings.elementEnabled);
        elementBtn.setAttribute('aria-label', label);
        elementBtn.setAttribute('title', label);
        elementBtn.setAttribute('data-tooltip', label);
    }
    if (gridSizeInput instanceof HTMLInputElement) {
        gridSizeInput.value = String(Math.round(settings.gridSize));
        gridSizeInput.disabled = !settings.gridEnabled;
    }
    if (thresholdInput instanceof HTMLInputElement) {
        thresholdInput.value = String(Math.round(settings.threshold));
        thresholdInput.disabled = !settings.gridEnabled && !settings.elementEnabled;
    }
    if (resetBtn instanceof HTMLButtonElement) {
        const isDefault = settings.gridEnabled
            && settings.elementEnabled
            && Number(settings.gridSize) === DESIGN_SNAP_GRID_SIZE
            && Number(settings.threshold) === DESIGN_SNAP_THRESHOLD;
        resetBtn.disabled = isDefault;
    }
    document.querySelectorAll('[data-snap-preset]').forEach((button) => {
        if (!(button instanceof HTMLButtonElement)) {
            return;
        }
        const presetKey = String(button.dataset.snapPreset || '').toLowerCase();
        const isActive = Boolean(activePresetKey) && presetKey === activePresetKey;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    updateDesignCanvasGridVisual(settings);
}

function toggleDesignSnapMode(mode = 'grid') {
    const normalized = String(mode || '').toLowerCase();
    const settings = sanitizeDesignSnapSettings(currentContext.designSnapSettings);
    if (normalized === 'grid') {
        settings.gridEnabled = !settings.gridEnabled;
        currentContext.designSnapSettings = settings;
        renderDesignSnapControls();
        setStatus(settings.gridEnabled ? 'Snap de grade ativado.' : 'Snap de grade desativado.', 'ok');
        return;
    }
    if (normalized === 'element' || normalized === 'elements') {
        settings.elementEnabled = !settings.elementEnabled;
        currentContext.designSnapSettings = settings;
        renderDesignSnapControls();
        setStatus(settings.elementEnabled ? 'Snap entre elementos ativado.' : 'Snap entre elementos desativado.', 'ok');
    }
}

function ensureDesignStudioSelection(studio) {
    const safe = sanitizeDesignStudio(studio);
    const activePage = safe.pages.find((item) => item.id === safe.selectedPageId) || safe.pages[0] || null;
    if (!activePage) {
        return safe;
    }
    if (!safe.selectedPageId) {
        safe.selectedPageId = activePage.id;
    }
    const hasSelectedElement = activePage.elements.some((item) => item.id === safe.selectedElementId);
    if (!hasSelectedElement) {
        safe.selectedElementId = activePage.elements[0]?.id || '';
    }
    const elementIds = new Set(activePage.elements.map((item) => item.id));
    const selectedIds = Array.isArray(safe.selectedElementIds)
        ? safe.selectedElementIds.filter((id) => elementIds.has(id))
        : [];
    if (safe.selectedElementId && elementIds.has(safe.selectedElementId) && !selectedIds.includes(safe.selectedElementId)) {
        selectedIds.unshift(safe.selectedElementId);
    }
    if (!selectedIds.length && safe.selectedElementId) {
        selectedIds.push(safe.selectedElementId);
    }
    safe.selectedElementIds = selectedIds;
    return safe;
}

function restoreTemplateSelection() {
    let templateId = DEFAULT_TEMPLATE_ID;
    if (typeof localStorage !== 'undefined') {
        try {
            const stored = String(localStorage.getItem(BRAND_MANUAL_TEMPLATE_KEY) || '');
            const presets = getAllTemplatePresets();
            if (Object.prototype.hasOwnProperty.call(presets, stored)) {
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

function hydrateBrandManualPdfTemplateMode() {
    const select = document.getElementById('brandManualPdfTemplate');
    if (!(select instanceof HTMLSelectElement)) {
        return;
    }
    const mode = readBrandManualPdfTemplateMode();
    select.value = mode;
    syncBrandManualPdfActionButton(mode);
}

function normalizeBrandManualPdfTemplateMode(value) {
    return String(value || '').trim().toLowerCase() === 'mini' ? 'mini' : 'full';
}

function readBrandManualPdfTemplateMode() {
    try {
        const stored = String(localStorage.getItem(BRAND_MANUAL_PDF_TEMPLATE_KEY) || '').trim().toLowerCase();
        if (stored === 'mini') {
            return 'mini';
        }
    } catch (error) {
        // Sem bloqueio: fallback para o valor em tela.
    }

    const selectValue = String(document.getElementById('brandManualPdfTemplate')?.value || '').trim().toLowerCase();
    return selectValue === 'mini' ? 'mini' : 'full';
}

function persistBrandManualPdfTemplateMode(value) {
    const normalized = normalizeBrandManualPdfTemplateMode(value);
    const select = document.getElementById('brandManualPdfTemplate');
    if (select instanceof HTMLSelectElement) {
        select.value = normalized;
    }

    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(BRAND_MANUAL_PDF_TEMPLATE_KEY, normalized);
        } catch (error) {
            // Sem bloqueio.
        }
    }
    return normalized;
}

function syncBrandManualPdfActionButton(mode) {
    const button = document.getElementById('downloadPdfBtn');
    if (!(button instanceof HTMLButtonElement)) {
        return;
    }
    const normalized = normalizeBrandManualPdfTemplateMode(mode);
    const isMini = normalized === 'mini';
    const label = isMini ? 'Baixar Mini PDF' : 'Baixar PDF Completo';
    const title = isMini
        ? 'Exportar Mini Brand Guide em PDF'
        : 'Exportar Brandbook Completo em PDF';

    button.textContent = label;
    button.setAttribute('aria-label', title);
    button.setAttribute('title', title);
    button.dataset.pdfMode = normalized;
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
    hydrateBuilderFromTemplate(preset);
    fillBuilderFields(preset);
    renderTemplateBuilder();
    setText('activeTemplateBadge', `Template ativo: ${preset.name}`);

    if (settings.persist && typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem(BRAND_MANUAL_TEMPLATE_KEY, preset.id);
        } catch (error) {
            // Sem bloqueio: a tela continua funcional mesmo sem localStorage.
        }
    }

    if (settings.rerender && currentContext.payload) {
        const sheets = renderBrandbook(currentContext.payload, currentContext.displayMockups, preset.id, {
            source: 'template_select'
        });
        applyTemplateMetadata(currentContext.payload, preset, sheets.length);
        persistLatestManualPayload(currentContext.payload);
        renderPayload(currentContext.payload);

        if (settings.announce) {
            setStatus(`Template ${preset.name} aplicado ao brandbook.`, 'ok');
        }
    }
}

function getTemplatePreset(templateId) {
    const presets = getAllTemplatePresets();
    const fallbackPreset = presets[DEFAULT_TEMPLATE_ID] || TEMPLATE_PRESETS[DEFAULT_TEMPLATE_ID];

    const rawPreset = Object.prototype.hasOwnProperty.call(presets, templateId)
        ? presets[templateId]
        : fallbackPreset;

    const safeThemeKey = getThemeKeyFromThemeClass(rawPreset?.themeClass || fallbackPreset.themeClass);
    const safeThemeClass = TEMPLATE_THEME_MAP[safeThemeKey]?.themeClass || fallbackPreset.themeClass;
    const bookMode = resolveTemplateBookMode(rawPreset || fallbackPreset);
    const structureIds = ensureStructureForBookMode(
        sanitizeStructureIds(rawPreset?.structure, false, bookMode),
        bookMode
    );
    const layout = resolveTemplateLayoutMap(rawPreset || fallbackPreset, structureIds);
    const safeDesignStudio = sanitizeDesignStudio(rawPreset?.designStudio || fallbackPreset.designStudio, { ensurePage: false });
    const designStudio = safeDesignStudio.pages.length ? safeDesignStudio : null;
    const designStudioEnabled = Boolean(rawPreset?.designStudioEnabled || fallbackPreset.designStudioEnabled);
    const figmaNamingConfig = sanitizeFigmaNamingConfig(rawPreset?.figmaNamingConfig || fallbackPreset.figmaNamingConfig);
    const baseThemePreset = TEMPLATE_PRESETS[safeThemeKey] || TEMPLATE_PRESETS[DEFAULT_TEMPLATE_ID];
    const fallbackPalette = normalizeTemplatePalette(
        rawPreset?.fallbackPalette,
        baseThemePreset?.fallbackPalette || fallbackPreset.fallbackPalette
    );
    const colorOverrideEnabled = Boolean(rawPreset?.colorOverrideEnabled);
    const colorOverride = normalizeTemplatePalette(rawPreset?.colorOverride, fallbackPalette);

    return {
        ...fallbackPreset,
        ...rawPreset,
        themeClass: safeThemeClass,
        fallbackPalette,
        colorOverrideEnabled,
        colorOverride,
        bookMode,
        smartMethod: resolveTemplateSmartMethod(rawPreset || fallbackPreset),
        miniGuideVariant: resolveTemplateMiniGuideVariant(rawPreset || fallbackPreset),
        structure: structureIds.map((moduleId, index) => ({
            id: moduleId,
            label: getBuilderModuleDisplayLabel(moduleId, layout),
            page: index + 1
        })),
        layout,
        designStudio,
        designStudioEnabled,
        figmaNamingConfig
    };
}

function normalizePresetCandidate(rawPreset) {
    const fallbackPreset = getTemplatePreset(DEFAULT_TEMPLATE_ID);
    const safeThemeKey = getThemeKeyFromThemeClass(rawPreset?.themeClass || fallbackPreset.themeClass);
    const safeThemeClass = TEMPLATE_THEME_MAP[safeThemeKey]?.themeClass || fallbackPreset.themeClass;
    const bookMode = resolveTemplateBookMode(rawPreset || fallbackPreset);
    const smartMethod = resolveTemplateSmartMethod(rawPreset || fallbackPreset);
    const miniGuideVariant = resolveTemplateMiniGuideVariant(rawPreset || fallbackPreset);
    const structure = ensureStructureForBookMode(
        sanitizeStructureIds(rawPreset?.structure, false, bookMode),
        bookMode
    );
    const layout = resolveTemplateLayoutMap(rawPreset || fallbackPreset, structure);
    const safeDesignStudio = sanitizeDesignStudio(rawPreset?.designStudio || fallbackPreset.designStudio, { ensurePage: false });
    const designStudio = safeDesignStudio.pages.length ? safeDesignStudio : null;
    const designStudioEnabled = Boolean(rawPreset?.designStudioEnabled || fallbackPreset.designStudioEnabled);
    const figmaNamingConfig = sanitizeFigmaNamingConfig(rawPreset?.figmaNamingConfig || fallbackPreset.figmaNamingConfig);
    const baseThemePreset = TEMPLATE_PRESETS[safeThemeKey] || TEMPLATE_PRESETS[DEFAULT_TEMPLATE_ID];
    const fallbackPalette = normalizeTemplatePalette(
        rawPreset?.fallbackPalette,
        baseThemePreset?.fallbackPalette || fallbackPreset.fallbackPalette
    );
    const colorOverrideEnabled = Boolean(rawPreset?.colorOverrideEnabled);
    const colorOverride = normalizeTemplatePalette(rawPreset?.colorOverride, fallbackPalette);

    return {
        ...fallbackPreset,
        ...(rawPreset && typeof rawPreset === 'object' ? rawPreset : {}),
        themeClass: safeThemeClass,
        fallbackPalette,
        colorOverrideEnabled,
        colorOverride,
        bookMode,
        smartMethod,
        miniGuideVariant,
        structure: structure.map((moduleId, index) => ({
            id: moduleId,
            label: getBuilderModuleDisplayLabel(moduleId, layout),
            page: index + 1
        })),
        layout,
        designStudio,
        designStudioEnabled,
        figmaNamingConfig
    };
}

function getAllTemplatePresets() {
    return {
        ...TEMPLATE_PRESETS,
        ...currentContext.customTemplates
    };
}

function normalizeBookMode(mode) {
    return String(mode || '').toLowerCase() === BOOK_MODE_MINI
        ? BOOK_MODE_MINI
        : BOOK_MODE_COMPLETE;
}

function normalizeSmartMethod(method) {
    const value = String(method || '').toLowerCase();
    if (value === 'smart_identity' || value === 'smart_showcase' || value === 'smart_digital') {
        return value;
    }
    return SMART_TEMPLATE_METHOD_DEFAULT;
}

function normalizeMiniGuideVariant(variant) {
    const value = String(variant || '').toLowerCase();
    if (value === 'editorial' || value === 'social') {
        return value;
    }
    return MINI_GUIDE_VARIANT_DEFAULT;
}

function resolveTemplateBookMode(preset) {
    return normalizeBookMode(preset?.bookMode || BOOK_MODE_COMPLETE);
}

function resolveTemplateSmartMethod(preset) {
    return normalizeSmartMethod(preset?.smartMethod || SMART_TEMPLATE_METHOD_DEFAULT);
}

function resolveTemplateMiniGuideVariant(preset) {
    return normalizeMiniGuideVariant(preset?.miniGuideVariant || MINI_GUIDE_VARIANT_DEFAULT);
}

function getBookModeLabel(mode) {
    return normalizeBookMode(mode) === BOOK_MODE_MINI ? 'Mini Brandbook' : 'Brandbook Completo';
}

function getMiniGuideVariantLabel(variant) {
    const normalized = normalizeMiniGuideVariant(variant);
    if (normalized === 'editorial') {
        return 'Editorial';
    }
    if (normalized === 'social') {
        return 'Social';
    }
    return 'Corporativo';
}

function getMiniPresetLabel(presetId) {
    if (!Object.prototype.hasOwnProperty.call(MINI_GUIDE_PRESETS, presetId)) {
        return 'Sem preset';
    }
    return String(MINI_GUIDE_PRESETS[presetId].label || 'Preset');
}

function getAllModuleIds() {
    return BRANDBOOK_PAGE_STRUCTURE.map((item) => item.id);
}

function getDefaultStructureIds(bookMode = BOOK_MODE_COMPLETE) {
    const normalizedMode = normalizeBookMode(bookMode);
    const base = normalizedMode === BOOK_MODE_MINI
        ? MINI_BRANDBOOK_STRUCTURE
        : FULL_BRANDBOOK_STRUCTURE;
    const allowed = new Set(getAllModuleIds());
    return base.filter((moduleId) => allowed.has(moduleId));
}

function ensureStructureForBookMode(structureIds, bookMode = BOOK_MODE_COMPLETE) {
    const normalizedMode = normalizeBookMode(bookMode);
    const base = sanitizeStructureIds(structureIds, false);
    const defaults = getDefaultStructureIds(normalizedMode);
    const minCount = normalizedMode === BOOK_MODE_MINI ? 3 : 5;
    const next = base.slice();

    if (normalizedMode === BOOK_MODE_MINI && !next.includes('mini_board')) {
        next.unshift('mini_board');
    }

    defaults.forEach((moduleId) => {
        if (next.length >= minCount) {
            return;
        }
        if (!next.includes(moduleId)) {
            next.push(moduleId);
        }
    });

    return next.length ? next : defaults;
}

function getModuleById(moduleId) {
    return BRANDBOOK_PAGE_STRUCTURE.find((item) => item.id === moduleId) || null;
}

function getModuleLabelById(moduleId) {
    return getModuleById(moduleId)?.label || moduleId;
}

function getModuleHintById(moduleId) {
    return BUILDER_MODULE_HINTS[moduleId] || 'Bloco estrutural do brandbook.';
}

function normalizeBuilderSpan(span) {
    const parsed = Number.parseInt(String(span || BUILDER_SPAN_FULL), 10);
    return parsed === BUILDER_SPAN_HALF ? BUILDER_SPAN_HALF : BUILDER_SPAN_FULL;
}

function sanitizeBuilderLayoutEntry(rawEntry) {
    const source = rawEntry && typeof rawEntry === 'object' ? rawEntry : {};
    return {
        span: normalizeBuilderSpan(source.span),
        labelOverride: String(source.labelOverride || source.label || '').trim().slice(0, 60),
        note: String(source.note || source.description || '').trim().slice(0, 220)
    };
}

function sanitizeBuilderLayoutMap(rawMap) {
    const source = rawMap && typeof rawMap === 'object' ? rawMap : {};
    const allowed = new Set(getAllModuleIds());
    const next = {};

    Object.entries(source).forEach(([moduleId, rawEntry]) => {
        if (!allowed.has(moduleId)) {
            return;
        }
        const safeEntry = sanitizeBuilderLayoutEntry(rawEntry);
        if (!safeEntry.labelOverride && !safeEntry.note && safeEntry.span === BUILDER_SPAN_FULL) {
            return;
        }
        next[moduleId] = safeEntry;
    });

    return next;
}

function getBuilderLayoutForModule(moduleId, layoutMap = currentContext.builderModuleLayout) {
    const source = layoutMap && typeof layoutMap === 'object' ? layoutMap : {};
    const rawEntry = Object.prototype.hasOwnProperty.call(source, moduleId)
        ? source[moduleId]
        : null;
    return sanitizeBuilderLayoutEntry(rawEntry);
}

function resolveTemplateLayoutMap(preset, structureIds = getTemplateStructureIdsFromPreset(preset)) {
    const sanitized = sanitizeBuilderLayoutMap(preset?.layout || {});
    const allowed = new Set(sanitizeStructureIds(structureIds, false));
    const next = {};
    Object.entries(sanitized).forEach(([moduleId, entry]) => {
        if (allowed.has(moduleId)) {
            next[moduleId] = entry;
        }
    });
    return next;
}

function buildTemplateLayoutMap(structureIds, sourceLayout = currentContext.builderModuleLayout) {
    const activeIds = sanitizeStructureIds(structureIds, false);
    const source = sanitizeBuilderLayoutMap(sourceLayout);
    const next = {};

    activeIds.forEach((moduleId) => {
        const safeEntry = getBuilderLayoutForModule(moduleId, source);
        if (!safeEntry.labelOverride && !safeEntry.note && safeEntry.span === BUILDER_SPAN_FULL) {
            return;
        }
        next[moduleId] = safeEntry;
    });

    return next;
}

function getBuilderModuleDisplayLabel(moduleId, layoutMap = currentContext.builderModuleLayout) {
    const layout = getBuilderLayoutForModule(moduleId, layoutMap);
    return layout.labelOverride || getModuleLabelById(moduleId);
}

function getBuilderModuleNote(moduleId, layoutMap = currentContext.builderModuleLayout) {
    const layout = getBuilderLayoutForModule(moduleId, layoutMap);
    return layout.note || getModuleHintById(moduleId);
}

function setBuilderLayoutForModule(moduleId, patch = {}, options = {}) {
    const settings = {
        rerenderBuilder: true,
        rerenderPreview: true,
        ...options
    };
    if (!getModuleById(moduleId)) {
        return;
    }

    const nextMap = sanitizeBuilderLayoutMap(currentContext.builderModuleLayout);
    const merged = sanitizeBuilderLayoutEntry({
        ...getBuilderLayoutForModule(moduleId, nextMap),
        ...(patch && typeof patch === 'object' ? patch : {})
    });

    if (!merged.labelOverride && !merged.note && merged.span === BUILDER_SPAN_FULL) {
        delete nextMap[moduleId];
    } else {
        nextMap[moduleId] = merged;
    }

    currentContext.builderModuleLayout = nextMap;
    if (settings.rerenderBuilder) {
        renderTemplateBuilder();
    }
    if (settings.rerenderPreview) {
        refreshBrandbookPreviewFromBuilder();
    }
}

function sanitizeStructureIds(structure, useDefaultFallback = true, fallbackMode = BOOK_MODE_COMPLETE) {
    const allowed = new Set(getAllModuleIds());
    const rawItems = Array.isArray(structure) ? structure : [];
    const next = [];

    rawItems.forEach((item) => {
        const moduleId = typeof item === 'string'
            ? item
            : (item && typeof item === 'object' ? String(item.id || '') : '');
        if (!allowed.has(moduleId) || next.includes(moduleId)) {
            return;
        }
        next.push(moduleId);
    });

    if (!next.length && useDefaultFallback) {
        return getDefaultStructureIds(fallbackMode);
    }

    return next;
}

function getTemplateStructureIdsFromPreset(preset) {
    const bookMode = resolveTemplateBookMode(preset);
    if (!preset || typeof preset !== 'object') {
        return getDefaultStructureIds(bookMode);
    }
    const structure = sanitizeStructureIds(preset.structure, false, bookMode);
    if (!structure.length) {
        return getDefaultStructureIds(bookMode);
    }
    return ensureStructureForBookMode(structure, bookMode);
}

function getThemeKeyFromThemeClass(themeClass) {
    const entries = Object.entries(TEMPLATE_THEME_MAP);
    for (const [key, value] of entries) {
        if (value.themeClass === themeClass) {
            return key;
        }
    }
    return DEFAULT_TEMPLATE_ID;
}

function getPreviewClassFromThemeClass(themeClass) {
    const themeKey = getThemeKeyFromThemeClass(themeClass);
    return TEMPLATE_THEME_MAP[themeKey]?.previewClass || 'mono';
}

function buildCustomTemplateId(name, occupiedMap = null) {
    const map = occupiedMap && typeof occupiedMap === 'object'
        ? occupiedMap
        : currentContext.customTemplates;
    const slug = String(name || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 36);

    const base = `${CUSTOM_TEMPLATE_ID_PREFIX}${slug || 'template'}`;
    let nextId = base;
    let cursor = 2;
    while (Object.prototype.hasOwnProperty.call(map, nextId)) {
        nextId = `${base}-${cursor}`;
        cursor += 1;
    }
    return nextId;
}

function sanitizeCustomTemplate(id, rawTemplate) {
    if (!id || !String(id).startsWith(CUSTOM_TEMPLATE_ID_PREFIX) || !rawTemplate || typeof rawTemplate !== 'object') {
        return null;
    }

    const name = String(rawTemplate.name || '').trim().slice(0, 90);
    if (!name) {
        return null;
    }

    const themeClass = String(rawTemplate.themeClass || '').trim();
    const themeKey = getThemeKeyFromThemeClass(themeClass);
    const fallbackSource = TEMPLATE_PRESETS[themeKey] || TEMPLATE_PRESETS[DEFAULT_TEMPLATE_ID];
    const bookMode = normalizeBookMode(rawTemplate.bookMode || fallbackSource.bookMode || BOOK_MODE_COMPLETE);
    const smartMethod = normalizeSmartMethod(rawTemplate.smartMethod || fallbackSource.smartMethod || SMART_TEMPLATE_METHOD_DEFAULT);
    const miniGuideVariant = normalizeMiniGuideVariant(
        rawTemplate.miniGuideVariant || fallbackSource.miniGuideVariant || MINI_GUIDE_VARIANT_DEFAULT
    );
    const structureIds = sanitizeStructureIds(rawTemplate.structure, false, bookMode);
    const resolvedStructure = structureIds.length
        ? ensureStructureForBookMode(structureIds, bookMode)
        : getDefaultStructureIds(bookMode);
    const layout = resolveTemplateLayoutMap(rawTemplate, resolvedStructure);
    const safeDesignStudio = sanitizeDesignStudio(rawTemplate.designStudio, { ensurePage: false });
    const designStudio = safeDesignStudio.pages.length ? safeDesignStudio : null;
    const designStudioEnabled = Boolean(rawTemplate.designStudioEnabled && designStudio);
    const figmaNamingConfig = sanitizeFigmaNamingConfig(rawTemplate.figmaNamingConfig);
    const fallbackPalette = normalizeTemplatePalette(rawTemplate.fallbackPalette, fallbackSource.fallbackPalette);
    const colorOverrideEnabled = Boolean(rawTemplate.colorOverrideEnabled);
    const colorOverride = normalizeTemplatePalette(rawTemplate.colorOverride, fallbackPalette);

    return {
        id: String(id),
        name,
        custom: true,
        themeClass: TEMPLATE_THEME_MAP[themeKey].themeClass,
        bookMode,
        smartMethod,
        miniGuideVariant,
        kicker: String(rawTemplate.kicker || fallbackSource.kicker).trim().slice(0, 90),
        fallbackPalette,
        colorOverrideEnabled,
        colorOverride,
        closing: String(rawTemplate.closing || fallbackSource.closing).trim().slice(0, 180),
        structure: resolvedStructure.map((moduleId, index) => ({
            id: moduleId,
            label: getBuilderModuleDisplayLabel(moduleId, layout),
            page: index + 1
        })),
        layout,
        designStudio,
        designStudioEnabled,
        figmaNamingConfig
    };
}

function loadCustomTemplates() {
    const parsed = readStorageJson(BRAND_MANUAL_CUSTOM_TEMPLATE_KEY, {});
    const rawMap = parsed && typeof parsed === 'object' ? parsed : {};
    const nextMap = {};

    Object.entries(rawMap).forEach(([id, template]) => {
        const sanitized = sanitizeCustomTemplate(id, template);
        if (!sanitized) {
            return;
        }
        nextMap[sanitized.id] = sanitized;
    });

    currentContext.customTemplates = nextMap;
}

function persistCustomTemplates() {
    if (typeof localStorage === 'undefined') {
        return;
    }
    try {
        localStorage.setItem(BRAND_MANUAL_CUSTOM_TEMPLATE_KEY, JSON.stringify(currentContext.customTemplates));
    } catch (error) {
        // Ignore localStorage errors.
    }
    updateBackupUiState();
}

function syncCustomTemplateCards() {
    const grid = document.getElementById('templateGrid');
    if (!grid) {
        return;
    }

    grid.querySelectorAll('.template-card.is-custom').forEach((card) => card.remove());

    const customItems = Object.values(currentContext.customTemplates)
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR'));

    customItems.forEach((template) => {
        const previewClass = getPreviewClassFromThemeClass(template.themeClass);
        const modeLabel = getBookModeLabel(resolveTemplateBookMode(template));
        const variantLabel = resolveTemplateBookMode(template) === BOOK_MODE_MINI
            ? ` | ${getMiniGuideVariantLabel(resolveTemplateMiniGuideVariant(template))}`
            : '';
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'template-card is-custom';
        card.dataset.templateId = template.id;
        card.innerHTML = `
            <span class="template-preview ${escapeHtml(previewClass)}"></span>
            <span class="template-card-badge">Custom</span>
            <strong>${escapeHtml(template.name)}</strong>
            <small>${escapeHtml(template.kicker || 'Template customizado')}</small>
            <small>${escapeHtml(`${modeLabel}${variantLabel}`)}</small>
        `;
        grid.appendChild(card);
    });

    updateTemplateCardState(currentContext.activeTemplateId);
}

function hydrateBuilderFromTemplate(preset) {
    const structureIds = getTemplateStructureIdsFromPreset(preset);
    currentContext.builderStructureIds = structureIds;
    currentContext.builderModuleLayout = resolveTemplateLayoutMap(preset, structureIds);
    const selected = String(currentContext.selectedBuilderModuleId || '');
    currentContext.selectedBuilderModuleId = structureIds.includes(selected)
        ? selected
        : (structureIds[0] || '');
    hydrateDesignStudioFromTemplate(preset, structureIds);
}

function detectMiniPresetIdFromConfig(mode, smartMethod, variant, structure) {
    if (mode !== BOOK_MODE_MINI) {
        return MINI_GUIDE_PRESET_NONE;
    }

    const entries = Object.entries(MINI_GUIDE_PRESETS);
    for (let index = 0; index < entries.length; index += 1) {
        const [presetId, definition] = entries[index];
        const sameMethod = normalizeSmartMethod(definition.smartMethod) === smartMethod;
        const sameVariant = normalizeMiniGuideVariant(definition.miniGuideVariant) === variant;
        const expected = ensureStructureForBookMode(definition.structure || [], BOOK_MODE_MINI);
        const sameStructure = expected.length === structure.length && expected.every((item, pos) => item === structure[pos]);

        if (sameMethod && sameVariant && sameStructure) {
            return presetId;
        }
    }

    return MINI_GUIDE_PRESET_NONE;
}

function detectMiniPresetIdFromTemplate(preset) {
    return detectMiniPresetIdFromConfig(
        resolveTemplateBookMode(preset),
        resolveTemplateSmartMethod(preset),
        resolveTemplateMiniGuideVariant(preset),
        getTemplateStructureIdsFromPreset(preset)
    );
}

function fillBuilderFields(preset) {
    const safePreset = preset && typeof preset === 'object'
        ? preset
        : getTemplatePreset(DEFAULT_TEMPLATE_ID);
    const themeKey = getThemeKeyFromThemeClass(safePreset.themeClass);

    const nameField = document.getElementById('customTemplateName');
    const themeField = document.getElementById('customTemplateTheme');
    const kickerField = document.getElementById('customTemplateKicker');
    const closingField = document.getElementById('customTemplateClosing');
    const bookModeField = document.getElementById('customTemplateBookMode');
    const smartMethodField = document.getElementById('customTemplateSmartMethod');
    const miniVariantField = document.getElementById('customTemplateMiniVariant');
    const miniPresetField = document.getElementById('miniGuidePreset');
    const removeButton = document.getElementById('removeCustomTemplateBtn');
    const saveButton = document.getElementById('createCustomTemplateBtn');
    const restoreBackupButton = document.getElementById('restoreTemplateBackupBtn');
    const downloadBackupButton = document.getElementById('downloadTemplateBackupBtn');
    const useDesignStudioField = document.getElementById('useDesignStudioTemplate');
    const useTemplatePaletteToggle = document.getElementById('customTemplateUsePaletteToggle');

    if (nameField) {
        nameField.value = String(safePreset.name || '').slice(0, 90);
    }
    if (themeField) {
        themeField.value = themeKey;
    }
    if (kickerField) {
        kickerField.value = String(safePreset.kicker || '').slice(0, 90);
    }
    if (closingField) {
        closingField.value = String(safePreset.closing || '').slice(0, 180);
    }
    if (bookModeField) {
        bookModeField.value = resolveTemplateBookMode(safePreset);
    }
    if (smartMethodField) {
        smartMethodField.value = resolveTemplateSmartMethod(safePreset);
    }
    if (miniVariantField) {
        miniVariantField.value = resolveTemplateMiniGuideVariant(safePreset);
        miniVariantField.disabled = resolveTemplateBookMode(safePreset) !== BOOK_MODE_MINI;
    }
    if (miniPresetField) {
        miniPresetField.value = detectMiniPresetIdFromTemplate(safePreset);
    }
    const themeFallbackPalette = getThemePresetFallbackPalette(themeKey);
    const resolvedPalette = normalizeTemplatePalette(
        Array.isArray(safePreset.colorOverride) && safePreset.colorOverride.length
            ? safePreset.colorOverride
            : safePreset.fallbackPalette,
        themeFallbackPalette
    );
    applyTemplatePaletteToForm(resolvedPalette);
    setTemplatePaletteTouched(false);
    if (useTemplatePaletteToggle instanceof HTMLInputElement) {
        useTemplatePaletteToggle.checked = Boolean(safePreset.colorOverrideEnabled);
    }
    if (removeButton) {
        removeButton.disabled = !Boolean(safePreset.custom);
    }
    if (saveButton instanceof HTMLButtonElement) {
        const saveLabel = safePreset.custom
            ? 'Atualizar template custom'
            : 'Salvar template custom';
        if (saveButton.classList.contains('compact-icon-btn') || saveButton.classList.contains('icon-btn')) {
            saveButton.setAttribute('aria-label', saveLabel);
            saveButton.setAttribute('title', saveLabel);
            saveButton.setAttribute('data-tooltip', saveLabel);
        } else {
            saveButton.textContent = saveLabel;
        }
    }
    if (useDesignStudioField instanceof HTMLInputElement) {
        useDesignStudioField.checked = Boolean(safePreset.designStudioEnabled);
        currentContext.designStudioEnabled = useDesignStudioField.checked;
    }
    currentContext.figmaNamingConfig = sanitizeFigmaNamingConfig(safePreset.figmaNamingConfig || currentContext.figmaNamingConfig);
    fillFigmaNamingConfigFields(currentContext.figmaNamingConfig);
    if (restoreBackupButton || downloadBackupButton) {
        updateBackupUiState();
    }
    updateTemplateStrategyHint();
}

function renderTemplateBuilder() {
    const availableTarget = document.getElementById('availableModules');
    const activeTarget = document.getElementById('activeModules');
    if (!availableTarget || !activeTarget) {
        return;
    }

    const activeIds = sanitizeStructureIds(currentContext.builderStructureIds, false);
    currentContext.builderStructureIds = activeIds;
    const allIds = getAllModuleIds();
    const availableIds = allIds.filter((moduleId) => !activeIds.includes(moduleId));
    const selectedId = String(currentContext.selectedBuilderModuleId || '');
    currentContext.selectedBuilderModuleId = activeIds.includes(selectedId)
        ? selectedId
        : (activeIds[0] || '');

    activeTarget.innerHTML = buildCanvasBlocks(activeIds);
    availableTarget.innerHTML = buildAvailableModuleItems(availableIds);
    setText('builderCanvasCount', `${activeIds.length} bloco(s)`);
    renderBuilderInspector(activeIds);
    syncMiniPresetFromCurrentState();
}

function buildAvailableModuleItems(moduleIds) {
    const safeList = Array.isArray(moduleIds) ? moduleIds : [];
    if (!safeList.length) {
        return '<p class="module-empty">Todos os blocos já estão no canvas.</p>';
    }

    return safeList.map((moduleId) => `
        <div
            class="module-chip"
            draggable="true"
            data-module-id="${escapeHtml(moduleId)}"
            data-index="-1"
            data-list-role="available"
        >
            <span class="index">+</span>
            <span>${escapeHtml(getModuleLabelById(moduleId))}</span>
            <span class="handle">arrastar</span>
        </div>
    `).join('');
}

function buildCanvasBlocks(moduleIds) {
    const safeList = Array.isArray(moduleIds) ? moduleIds : [];
    if (!safeList.length) {
        return '<p class="module-empty">Arraste blocos da biblioteca para montar o template.</p>';
    }

    const selectedId = String(currentContext.selectedBuilderModuleId || '');
    return safeList.map((moduleId, index) => {
        const layout = getBuilderLayoutForModule(moduleId);
        const span = normalizeBuilderSpan(layout.span);
        const label = getBuilderModuleDisplayLabel(moduleId);
        const note = getBuilderModuleNote(moduleId);
        const isSelected = selectedId === moduleId;

        return `
            <article
                class="canvas-block module-chip${isSelected ? ' is-selected' : ''}"
                draggable="true"
                data-module-id="${escapeHtml(moduleId)}"
                data-index="${index}"
                data-list-role="active"
                data-span="${span}"
            >
                <div class="canvas-block-head">
                    <p class="canvas-block-label" data-field="label">${escapeHtml(label)}</p>
                    <span class="canvas-block-meta" data-field="meta">${String(index + 1).padStart(2, '0')} | ${span === BUILDER_SPAN_HALF ? '1/2' : '1/1'}</span>
                </div>
                <p class="canvas-block-note" data-field="note">${escapeHtml(note)}</p>
                <div class="canvas-block-actions">
                    <button type="button" data-builder-action="move_up">Subir</button>
                    <button type="button" data-builder-action="move_down">Descer</button>
                    <button type="button" data-builder-action="toggle_span">${span === BUILDER_SPAN_HALF ? 'Expandir' : 'Meia largura'}</button>
                    <button type="button" data-builder-action="remove">Remover</button>
                </div>
            </article>
        `;
    }).join('');
}

function renderBuilderInspector(activeIds = currentContext.builderStructureIds) {
    const normalizedActive = sanitizeStructureIds(activeIds, false);
    const selectedField = document.getElementById('builderSelectedModuleLabel');
    const titleField = document.getElementById('builderBlockTitleOverride');
    const noteField = document.getElementById('builderBlockNote');
    const spanField = document.getElementById('builderBlockSpan');
    const upButton = document.getElementById('builderMoveBlockUpBtn');
    const downButton = document.getElementById('builderMoveBlockDownBtn');
    const removeButton = document.getElementById('builderRemoveBlockBtn');
    const clearButton = document.getElementById('builderClearBlockEditBtn');

    const selectedId = String(currentContext.selectedBuilderModuleId || '');
    const hasSelection = normalizedActive.includes(selectedId);

    if (!hasSelection) {
        if (selectedField) {
            selectedField.value = '';
        }
        if (titleField) {
            titleField.value = '';
            titleField.disabled = true;
        }
        if (noteField) {
            noteField.value = '';
            noteField.disabled = true;
        }
        if (spanField) {
            spanField.value = String(BUILDER_SPAN_FULL);
            spanField.disabled = true;
        }
        [upButton, downButton, removeButton, clearButton].forEach((button) => {
            if (button instanceof HTMLButtonElement) {
                button.disabled = true;
            }
        });
        return;
    }

    const selectedIndex = normalizedActive.indexOf(selectedId);
    const layout = getBuilderLayoutForModule(selectedId);
    const hasCustomization = Boolean(layout.labelOverride || layout.note || layout.span !== BUILDER_SPAN_FULL);

    if (selectedField) {
        selectedField.value = getModuleLabelById(selectedId);
    }
    if (titleField) {
        titleField.value = layout.labelOverride;
        titleField.disabled = false;
    }
    if (noteField) {
        noteField.value = layout.note;
        noteField.disabled = false;
    }
    if (spanField) {
        spanField.value = String(layout.span);
        spanField.disabled = false;
    }
    if (upButton instanceof HTMLButtonElement) {
        upButton.disabled = selectedIndex <= 0;
    }
    if (downButton instanceof HTMLButtonElement) {
        downButton.disabled = selectedIndex < 0 || selectedIndex >= (normalizedActive.length - 1);
    }
    if (removeButton instanceof HTMLButtonElement) {
        removeButton.disabled = false;
    }
    if (clearButton instanceof HTMLButtonElement) {
        clearButton.disabled = !hasCustomization;
    }
}

function syncBuilderCanvasBlock(moduleId) {
    const block = document.querySelector(`.canvas-block[data-module-id="${cssEscape(moduleId)}"]`);
    if (!(block instanceof HTMLElement)) {
        return;
    }

    const layout = getBuilderLayoutForModule(moduleId);
    const span = normalizeBuilderSpan(layout.span);
    const label = getBuilderModuleDisplayLabel(moduleId);
    const note = getBuilderModuleNote(moduleId);
    const index = Number.parseInt(String(block.dataset.index || ''), 10);

    block.dataset.span = String(span);
    const labelNode = block.querySelector('[data-field="label"]');
    if (labelNode) {
        labelNode.textContent = label;
    }
    const noteNode = block.querySelector('[data-field="note"]');
    if (noteNode) {
        noteNode.textContent = note;
    }
    const metaNode = block.querySelector('[data-field="meta"]');
    if (metaNode) {
        const safeIndex = Number.isFinite(index) ? index + 1 : 1;
        metaNode.textContent = `${String(safeIndex).padStart(2, '0')} | ${span === BUILDER_SPAN_HALF ? '1/2' : '1/1'}`;
    }
    const toggleButton = block.querySelector('button[data-builder-action="toggle_span"]');
    if (toggleButton instanceof HTMLButtonElement) {
        toggleButton.textContent = span === BUILDER_SPAN_HALF ? 'Expandir' : 'Meia largura';
    }
}

function updateSelectedBuilderBlockLayout(patch = {}) {
    const selectedId = String(currentContext.selectedBuilderModuleId || '');
    if (!selectedId) {
        return;
    }
    setBuilderLayoutForModule(selectedId, patch, {
        rerenderBuilder: false,
        rerenderPreview: true
    });
    syncBuilderCanvasBlock(selectedId);
    renderBuilderInspector();
}

function clearSelectedBuilderBlockCustomization() {
    const selectedId = String(currentContext.selectedBuilderModuleId || '');
    if (!selectedId) {
        return;
    }
    setBuilderLayoutForModule(selectedId, {
        labelOverride: '',
        note: '',
        span: BUILDER_SPAN_FULL
    }, {
        rerenderBuilder: false,
        rerenderPreview: true
    });
    syncBuilderCanvasBlock(selectedId);
    renderBuilderInspector();
    setStatus('Personalização do bloco removida.', 'ok');
}

function moveSelectedBuilderBlock(direction) {
    const selectedId = String(currentContext.selectedBuilderModuleId || '');
    if (!selectedId) {
        return;
    }
    moveBuilderBlock(selectedId, direction);
}

function moveBuilderBlock(moduleId, direction) {
    const safeDirection = Number(direction);
    if (!Number.isFinite(safeDirection) || safeDirection === 0) {
        return;
    }
    const ids = sanitizeStructureIds(currentContext.builderStructureIds, false);
    const fromIndex = ids.indexOf(moduleId);
    if (fromIndex === -1) {
        return;
    }
    const toIndex = Math.max(0, Math.min(ids.length - 1, fromIndex + (safeDirection > 0 ? 1 : -1)));
    if (fromIndex === toIndex) {
        return;
    }

    const [item] = ids.splice(fromIndex, 1);
    ids.splice(toIndex, 0, item);
    currentContext.builderStructureIds = ids;
    currentContext.selectedBuilderModuleId = moduleId;
    syncDesignStudioAfterStructureChange();
    renderTemplateBuilder();
    refreshBrandbookPreviewFromBuilder();
}

function removeSelectedBuilderBlock() {
    const selectedId = String(currentContext.selectedBuilderModuleId || '');
    if (!selectedId) {
        return;
    }
    removeBuilderBlock(selectedId);
}

function removeBuilderBlock(moduleId) {
    const ids = sanitizeStructureIds(currentContext.builderStructureIds, false)
        .filter((id) => id !== moduleId);
    currentContext.builderStructureIds = ids;
    currentContext.selectedBuilderModuleId = ids[0] || '';
    syncDesignStudioAfterStructureChange();
    renderTemplateBuilder();
    refreshBrandbookPreviewFromBuilder();
}

function matchNamingKeywords(name, keywords = []) {
    const normalizedName = normalizeNameForMatching(name);
    const safeKeywords = Array.isArray(keywords) ? keywords : [];
    for (let index = 0; index < safeKeywords.length; index += 1) {
        const keyword = normalizeNameForMatching(safeKeywords[index]);
        if (!keyword) {
            continue;
        }
        if (normalizedName === keyword || normalizedName.includes(keyword)) {
            return {
                matched: true,
                score: keyword.length
            };
        }
    }
    return { matched: false, score: 0 };
}

function resolveModuleIdFromTitle(label, namingProfile = buildFigmaNamingProfile()) {
    const profile = namingProfile && typeof namingProfile === 'object'
        ? namingProfile
        : buildFigmaNamingProfile();
    const aliases = profile.moduleAliases && typeof profile.moduleAliases === 'object'
        ? profile.moduleAliases
        : {};

    let bestId = '';
    let bestScore = 0;
    Object.entries(aliases).forEach(([moduleId, keywords]) => {
        const hit = matchNamingKeywords(label, keywords);
        if (hit.matched && hit.score > bestScore) {
            bestId = moduleId;
            bestScore = hit.score;
        }
    });

    if (bestId) {
        return bestId;
    }

    const normalized = normalizeNameForMatching(label);
    if (normalized.includes('mini')) return 'mini_board';
    if (normalized.includes('indice') || normalized.includes('index')) return 'index';
    if (normalized.includes('paleta') || normalized.includes('cor')) return 'palette';
    if (normalized.includes('tipografia') || normalized.includes('font')) return 'typography';
    if (normalized.includes('logo')) return 'logo_system';
    if (normalized.includes('mockup') || normalized.includes('aplicacao')) return 'mockups';
    if (normalized.includes('digital') || normalized.includes('og') || normalized.includes('social')) return 'digital';
    if (normalized.includes('playbook') || normalized.includes('execucao')) return 'playbook';
    if (normalized.includes('encerramento') || normalized.includes('closing') || normalized.includes('final')) return 'closing';
    if (normalized.includes('capa') || normalized.includes('cover')) return 'cover';
    return '';
}

function createDesignStudioFromStructure(structureIds = currentContext.builderStructureIds) {
    const safeStructure = sanitizeStructureIds(structureIds, true, getSelectedBookMode());
    const pages = safeStructure.map((moduleId, index) => {
        const label = getModuleLabelById(moduleId);
        const page = createDefaultDesignPage(`${String(index + 1).padStart(2, '0')} - ${label}`, moduleId);
        const elements = [];

        elements.push(createDefaultDesignElement('title', {
            x: 80,
            y: 70,
            w: 860,
            h: 95,
            text: moduleId === 'cover' ? '{{project.title}}' : label,
            fontSize: moduleId === 'cover' ? 58 : 48
        }));

        elements.push(createDefaultDesignElement('text', {
            x: 80,
            y: 178,
            w: 860,
            h: 118,
            text: moduleId === 'cover'
                ? '{{project.description}}'
                : getModuleHintById(moduleId),
            fontSize: 22
        }));

        if (moduleId === 'cover') {
            elements.push(createDefaultDesignElement('subtitle', {
                x: 80,
                y: 290,
                w: 860,
                h: 56,
                text: '{{project.tag}}'
            }));
            elements.push(createDefaultDesignElement('cta_button', {
                x: 80,
                y: 620,
                text: 'Explorar diretrizes'
            }));
        }
        if (moduleId === 'index') {
            elements.push(createDefaultDesignElement('bullet_list', {
                x: 80,
                y: 320,
                w: 760,
                h: 260,
                text: 'Capa\\nPaleta\\nTipografia\\nLogo\\nAplicações'
            }));
        }

        if (moduleId === 'palette' || moduleId === 'digital') {
            elements.push(createDefaultDesignElement('color_row', {
                x: 80,
                y: 630,
                w: 860,
                h: 68
            }));
        }
        if (moduleId === 'palette') {
            elements.push(createDefaultDesignElement('stat_card', {
                x: 860,
                y: 320,
                text: '6\\ncores ativas'
            }));
        }
        if (moduleId === 'logo_system') {
            elements.push(createDefaultDesignElement('logo_box', {
                x: 860,
                y: 70,
                w: 260,
                h: 160,
                text: 'LOGO'
            }));
        }
        if (moduleId === 'mockups') {
            elements.push(createDefaultDesignElement('mockup_slot', {
                x: 760,
                y: 268,
                w: 360,
                h: 330
            }));
        }
        if (moduleId === 'playbook') {
            elements.push(createDefaultDesignElement('shape', {
                x: 80,
                y: 320,
                w: 1040,
                h: 240,
                text: 'Checklist operacional e regras de execução'
            }));
            elements.push(createDefaultDesignElement('bullet_list', {
                x: 100,
                y: 350,
                w: 700,
                h: 190,
                text: 'Canal definido\\nCTA validado\\nArquivos exportados\\nResponsável aprovado'
            }));
        }
        if (moduleId === 'digital') {
            elements.push(createDefaultDesignElement('tag_chip', {
                x: 80,
                y: 564,
                text: '#social #web #ads'
            }));
            elements.push(createDefaultDesignElement('divider', {
                x: 80,
                y: 530,
                w: 860
            }));
        }

        page.elements = elements;
        return page;
    });

    return sanitizeDesignStudio({
        schema: DESIGN_STUDIO_SCHEMA,
        source: 'structure',
        pages,
        selectedPageId: pages[0]?.id || '',
        selectedElementId: pages[0]?.elements?.[0]?.id || '',
        selectedElementIds: pages[0]?.elements?.[0]?.id ? [pages[0].elements[0].id] : []
    });
}

function syncDesignStudioAfterStructureChange(force = false) {
    const studio = sanitizeDesignStudio(currentContext.designStudio, { ensurePage: false });
    if (force || !studio.pages.length || studio.source === 'structure') {
        currentContext.designStudio = createDesignStudioFromStructure(currentContext.builderStructureIds);
        renderDesignStudioUi();
    }
}

function hydrateDesignStudioFromTemplate(preset, structureIds = currentContext.builderStructureIds) {
    const incoming = sanitizeDesignStudio(preset?.designStudio, { ensurePage: false });
    const studio = incoming.pages.length
        ? incoming
        : createDesignStudioFromStructure(structureIds);
    currentContext.designStudio = studio;
    currentContext.designStudioEnabled = Boolean(preset?.designStudioEnabled && incoming.pages.length);
    const toggle = document.getElementById('useDesignStudioTemplate');
    if (toggle instanceof HTMLInputElement) {
        toggle.checked = currentContext.designStudioEnabled;
    }
    renderDesignStudioUi();
}

function withDesignStudioMutation(mutator, options = {}) {
    const settings = {
        renderCanvas: true,
        renderInspector: true,
        renderSelect: true,
        refreshPreview: true,
        enableStudio: false,
        announce: '',
        announceTone: 'ok',
        ...options
    };

    const studio = ensureDesignStudioSelection(sanitizeDesignStudio(currentContext.designStudio));
    const nextStudio = mutator(studio) || studio;
    currentContext.designStudio = ensureDesignStudioSelection(sanitizeDesignStudio(nextStudio));
    if (settings.enableStudio && currentContext.designStudio.pages.length) {
        currentContext.designStudio.source = 'manual';
        currentContext.designStudioEnabled = true;
        const toggle = document.getElementById('useDesignStudioTemplate');
        if (toggle instanceof HTMLInputElement) {
            toggle.checked = true;
        }
    }

    if (settings.renderSelect || settings.renderCanvas || settings.renderInspector) {
        renderDesignStudioUi({
            renderSelect: settings.renderSelect,
            renderCanvas: settings.renderCanvas,
            renderInspector: settings.renderInspector
        });
    }
    if (settings.refreshPreview) {
        refreshBrandbookPreviewFromBuilder({
            syncDesignStudioCanvas: false,
            source: 'design_studio'
        });
    }
    if (settings.announce) {
        setStatus(settings.announce, settings.announceTone);
    }
}

function selectDesignPage(pageId, refreshPreview = false) {
    withDesignStudioMutation((studio) => {
        const exists = studio.pages.some((page) => page.id === pageId);
        if (!exists) {
            return studio;
        }
        studio.selectedPageId = pageId;
        const page = studio.pages.find((item) => item.id === pageId) || null;
        const firstId = page?.elements?.[0]?.id || '';
        studio.selectedElementId = firstId;
        studio.selectedElementIds = firstId ? [firstId] : [];
        return studio;
    }, {
        refreshPreview,
        renderSelect: true,
        renderCanvas: true,
        renderInspector: true
    });
}

function selectDesignElement(elementId, options = {}) {
    const settings = {
        refreshPreview: false,
        additive: false,
        toggle: false,
        ...options
    };
    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const exists = page.elements.some((item) => item.id === elementId);
        if (!exists) {
            return studio;
        }
        const currentIds = Array.isArray(studio.selectedElementIds)
            ? studio.selectedElementIds.map((id) => String(id || '')).filter(Boolean)
            : [];
        if (settings.additive) {
            const nextIds = currentIds.filter((id) => page.elements.some((item) => item.id === id));
            if (settings.toggle) {
                if (nextIds.includes(elementId) && nextIds.length > 1) {
                    studio.selectedElementIds = nextIds.filter((id) => id !== elementId);
                    studio.selectedElementId = studio.selectedElementIds[0] || elementId;
                    return studio;
                }
                if (!nextIds.includes(elementId)) {
                    nextIds.push(elementId);
                }
                const reordered = [elementId, ...nextIds.filter((id) => id !== elementId)];
                studio.selectedElementIds = reordered;
                studio.selectedElementId = elementId;
                return studio;
            }
            if (!nextIds.includes(elementId)) {
                nextIds.push(elementId);
            }
            studio.selectedElementIds = [elementId, ...nextIds.filter((id) => id !== elementId)];
            studio.selectedElementId = elementId;
            return studio;
        }
        studio.selectedElementId = elementId;
        studio.selectedElementIds = [elementId];
        return studio;
    }, {
        refreshPreview: settings.refreshPreview,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: true
    });
}

function selectAllDesignElements() {
    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page || !page.elements.length) {
            return studio;
        }
        const ids = page.elements.map((item) => item.id);
        studio.selectedElementId = ids[ids.length - 1] || ids[0] || '';
        studio.selectedElementIds = studio.selectedElementId
            ? [studio.selectedElementId, ...ids.filter((id) => id !== studio.selectedElementId)]
            : ids;
        return studio;
    }, {
        refreshPreview: false,
        enableStudio: true,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: true,
        announce: 'Todos os elementos da página foram selecionados.'
    });
}

function reduceDesignSelectionToPrimary() {
    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page || !page.elements.length) {
            return studio;
        }
        const selectedId = page.elements.some((item) => item.id === studio.selectedElementId)
            ? studio.selectedElementId
            : (page.elements[0]?.id || '');
        studio.selectedElementId = selectedId;
        studio.selectedElementIds = selectedId ? [selectedId] : [];
        return studio;
    }, {
        refreshPreview: false,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: true
    });
}

function getDesignCanvasSize() {
    const canvas = document.getElementById('designStudioCanvas');
    const width = canvas ? Math.max(DESIGN_CANVAS_WIDTH, canvas.clientWidth || DESIGN_CANVAS_WIDTH) : DESIGN_CANVAS_WIDTH;
    const height = canvas ? Math.max(DESIGN_CANVAS_HEIGHT, canvas.clientHeight || DESIGN_CANVAS_HEIGHT) : DESIGN_CANVAS_HEIGHT;
    return { width, height };
}

function findDesignElementById(studio, elementId) {
    const source = studio && typeof studio === 'object'
        ? studio
        : sanitizeDesignStudio(currentContext.designStudio);
    const pages = Array.isArray(source.pages) ? source.pages : [];
    const pageId = String(source.selectedPageId || '');
    const page = pages.find((item) => item.id === pageId) || pages[0] || null;
    if (!page) {
        return { page: null, index: -1, element: null };
    }
    const elements = Array.isArray(page.elements) ? page.elements : [];
    const index = elements.findIndex((item) => item.id === elementId);
    return {
        page,
        index,
        element: index >= 0 ? elements[index] : null
    };
}

function updateSelectedDesignElementFromInspector(patch = {}, options = {}) {
    const settings = {
        renderInspector: false,
        refreshPreview: true,
        allowLocked: false,
        applyToSelection: false,
        ...options
    };
    withDesignStudioMutation((studio) => {
        const safeStudio = ensureDesignStudioSelection(studio);
        const page = safeStudio.pages.find((item) => item.id === safeStudio.selectedPageId) || safeStudio.pages[0] || null;
        if (!page) {
            return safeStudio;
        }
        const selectedIds = settings.applyToSelection
            ? getSelectedDesignElementIds(safeStudio)
            : [String(safeStudio.selectedElementId || '')];
        const allowedIds = selectedIds
            .map((id) => String(id || '').trim())
            .filter(Boolean)
            .filter((id, index, list) => list.indexOf(id) === index);
        if (!allowedIds.length) {
            return safeStudio;
        }
        const nextSelection = [];
        let hasMutation = false;
        page.elements = page.elements.map((element) => {
            if (!allowedIds.includes(element.id)) {
                return element;
            }
            nextSelection.push(element.id);
            if (element.locked && !settings.allowLocked) {
                return element;
            }
            const merged = sanitizeDesignElement({
                ...element,
                ...(patch && typeof patch === 'object' ? patch : {})
            });
            if (
                merged.x !== element.x
                || merged.y !== element.y
                || merged.w !== element.w
                || merged.h !== element.h
                || merged.text !== element.text
                || merged.fontSize !== element.fontSize
                || merged.color !== element.color
                || merged.bg !== element.bg
                || merged.radius !== element.radius
                || merged.opacity !== element.opacity
                || merged.align !== element.align
                || merged.locked !== element.locked
                || merged.type !== element.type
            ) {
                hasMutation = true;
            }
            return merged;
        });
        if (!nextSelection.length) {
            const fallbackId = page.elements[0]?.id || '';
            safeStudio.selectedElementId = fallbackId;
            safeStudio.selectedElementIds = fallbackId ? [fallbackId] : [];
            return safeStudio;
        }
        const primaryId = allowedIds.includes(String(safeStudio.selectedElementId || ''))
            ? String(safeStudio.selectedElementId || '')
            : nextSelection[0];
        safeStudio.selectedElementId = primaryId;
        safeStudio.selectedElementIds = [
            primaryId,
            ...nextSelection.filter((id) => id !== primaryId)
        ];
        if (!hasMutation) {
            return safeStudio;
        }
        return safeStudio;
    }, {
        refreshPreview: settings.refreshPreview,
        enableStudio: true,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: settings.renderInspector
    });
}

function addDesignPage() {
    withDesignStudioMutation((studio) => {
        const position = studio.pages.length + 1;
        const moduleId = currentContext.builderStructureIds[position - 1] || '';
        const page = createDefaultDesignPage(`Página ${position}`, moduleId);
        studio.pages.push(page);
        const firstId = page.elements[0]?.id || '';
        studio.selectedPageId = page.id;
        studio.selectedElementId = firstId;
        studio.selectedElementIds = firstId ? [firstId] : [];
        return studio;
    }, {
        enableStudio: true,
        announce: 'Nova página criada no Design Studio.'
    });
}

function duplicateActiveDesignPage() {
    withDesignStudioMutation((studio) => {
        const current = studio.pages.find((page) => page.id === studio.selectedPageId) || null;
        if (!current) {
            return studio;
        }
        const copy = sanitizeDesignPage({
            ...current,
            id: createLocalUid('page'),
            name: `${current.name} Copy`,
            elements: current.elements.map((el) => ({
                ...el,
                id: createLocalUid('el'),
                x: clampNumber(el.x + 16, 0, DESIGN_CANVAS_WIDTH - 24, el.x),
                y: clampNumber(el.y + 16, 0, DESIGN_CANVAS_HEIGHT - 24, el.y)
            }))
        }, `${current.name} Copy`);
        studio.pages.push(copy);
        const firstId = copy.elements[0]?.id || '';
        studio.selectedPageId = copy.id;
        studio.selectedElementId = firstId;
        studio.selectedElementIds = firstId ? [firstId] : [];
        return studio;
    }, {
        enableStudio: true,
        announce: 'Página duplicada com sucesso.'
    });
}

function removeActiveDesignPage() {
    withDesignStudioMutation((studio) => {
        if (studio.pages.length <= 1) {
            setStatus('O Design Studio precisa manter ao menos uma página.', 'warn');
            return studio;
        }
        const selectedPageId = String(studio.selectedPageId || '');
        const nextPages = studio.pages.filter((page) => page.id !== selectedPageId);
        if (!nextPages.length) {
            return studio;
        }
        studio.pages = nextPages;
        const firstId = nextPages[0].elements?.[0]?.id || '';
        studio.selectedPageId = nextPages[0].id;
        studio.selectedElementId = firstId;
        studio.selectedElementIds = firstId ? [firstId] : [];
        return studio;
    }, {
        enableStudio: true,
        announce: 'Página removida do Design Studio.'
    });
}

function addDesignElement(type = 'text') {
    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const offset = page.elements.length * 14;
        const element = createDefaultDesignElement(type, {
            x: 80 + offset,
            y: 90 + offset
        });
        page.elements.push(element);
        studio.selectedElementId = element.id;
        studio.selectedElementIds = [element.id];
        return studio;
    }, {
        enableStudio: true,
        announce: `Elemento "${getDesignElementTypeLabel(type)}" adicionado ao canvas.`
    });
}

function duplicateSelectedDesignElement() {
    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const selectedIds = getSelectedDesignElementIds(studio);
        if (!selectedIds.length) {
            return studio;
        }
        const selectedSet = new Set(selectedIds);
        const clones = [];
        page.elements.forEach((element) => {
            if (!selectedSet.has(element.id) || element.locked) {
                return;
            }
            clones.push(sanitizeDesignElement({
                ...element,
                id: createLocalUid('el'),
                x: clampNumber(element.x + 18, 0, DESIGN_CANVAS_WIDTH - 24, element.x),
                y: clampNumber(element.y + 18, 0, DESIGN_CANVAS_HEIGHT - 24, element.y),
                locked: false
            }));
        });
        if (!clones.length) {
            return studio;
        }
        page.elements.push(...clones);
        const primaryCloneId = clones[clones.length - 1]?.id || clones[0].id;
        studio.selectedElementId = primaryCloneId;
        studio.selectedElementIds = [primaryCloneId, ...clones.map((item) => item.id).filter((id) => id !== primaryCloneId)];
        return studio;
    }, {
        enableStudio: true,
        announce: 'Elemento duplicado.'
    });
}

function removeSelectedDesignElement() {
    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const selectedIds = getSelectedDesignElementIds(studio);
        if (!selectedIds.length) {
            return studio;
        }
        const selectedSet = new Set(selectedIds);
        const removable = page.elements.filter((item) => selectedSet.has(item.id) && !item.locked);
        if (!removable.length) {
            return studio;
        }
        if (page.elements.length - removable.length < 1) {
            setStatus('A página precisa manter ao menos um elemento.', 'warn');
            return studio;
        }
        const removableSet = new Set(removable.map((item) => item.id));
        page.elements = page.elements.filter((item) => !removableSet.has(item.id));
        const firstId = page.elements[0]?.id || '';
        studio.selectedElementId = firstId;
        studio.selectedElementIds = firstId ? [firstId] : [];
        return studio;
    }, {
        enableStudio: true,
        announce: 'Elemento removido do canvas.'
    });
}

function resetSelectedDesignElementStyle() {
    const selectedIds = getSelectedDesignElementIds();
    if (!selectedIds.length) {
        return;
    }
    const hasUnlockedSelection = getSelectedDesignElements().some((item) => !item.locked);
    if (!hasUnlockedSelection) {
        return;
    }
    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const idSet = new Set(getSelectedDesignElementIds(studio));
        page.elements = page.elements.map((element) => {
            if (!idSet.has(element.id) || element.locked) {
                return element;
            }
            const base = createDefaultDesignElement(element.type, {
                x: element.x,
                y: element.y,
                w: element.w,
                h: element.h,
                text: element.text
            });
            return sanitizeDesignElement({
                ...element,
                fontSize: base.fontSize,
                color: base.color,
                bg: base.bg,
                radius: base.radius,
                opacity: base.opacity,
                align: base.align
            });
        });
        return studio;
    }, {
        enableStudio: true,
        announce: selectedIds.length > 1
            ? 'Estilo dos elementos selecionados foi resetado.'
            : 'Estilo do elemento resetado.'
    });
}

function moveSelectedDesignElement(deltaX = 0, deltaY = 0, options = {}) {
    const shiftX = Number.isFinite(deltaX) ? deltaX : 0;
    const shiftY = Number.isFinite(deltaY) ? deltaY : 0;
    if (!shiftX && !shiftY) {
        return;
    }
    const settings = {
        refreshPreview: false,
        renderInspector: true,
        ...options
    };

    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const selectedIds = getSelectedDesignElementIds(studio);
        if (!selectedIds.length) {
            return studio;
        }
        const idSet = new Set(selectedIds);
        const movable = page.elements.filter((item) => idSet.has(item.id) && !item.locked);
        if (!movable.length) {
            return studio;
        }
        const minX = Math.min(...movable.map((item) => item.x));
        const maxRight = Math.max(...movable.map((item) => item.x + item.w));
        const minY = Math.min(...movable.map((item) => item.y));
        const maxBottom = Math.max(...movable.map((item) => item.y + item.h));
        const boundedShiftX = clampNumber(
            shiftX,
            -minX,
            Math.max(0, DESIGN_CANVAS_WIDTH - maxRight),
            0
        );
        const boundedShiftY = clampNumber(
            shiftY,
            -minY,
            Math.max(0, DESIGN_CANVAS_HEIGHT - maxBottom),
            0
        );
        page.elements = page.elements.map((element) => {
            if (!idSet.has(element.id) || element.locked) {
                return element;
            }
            return sanitizeDesignElement({
                ...element,
                x: element.x + boundedShiftX,
                y: element.y + boundedShiftY
            });
        });
        return studio;
    }, {
        refreshPreview: settings.refreshPreview,
        enableStudio: true,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: settings.renderInspector
    });
}

function resizeSelectedDesignElement(deltaW = 0, deltaH = 0, options = {}) {
    const shiftW = Number.isFinite(deltaW) ? deltaW : 0;
    const shiftH = Number.isFinite(deltaH) ? deltaH : 0;
    if (!shiftW && !shiftH) {
        return;
    }
    const settings = {
        refreshPreview: true,
        renderInspector: true,
        ...options
    };

    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const selectedIds = getSelectedDesignElementIds(studio);
        if (!selectedIds.length) {
            return studio;
        }
        const idSet = new Set(selectedIds);
        page.elements = page.elements.map((element) => {
            if (!idSet.has(element.id) || element.locked) {
                return element;
            }
            const maxW = Math.max(24, DESIGN_CANVAS_WIDTH - Math.max(0, element.x));
            const maxH = Math.max(24, DESIGN_CANVAS_HEIGHT - Math.max(0, element.y));
            const nextW = clampNumber(element.w + shiftW, 24, maxW, element.w);
            const nextH = clampNumber(element.h + shiftH, 24, maxH, element.h);
            return sanitizeDesignElement({
                ...element,
                w: nextW,
                h: nextH
            });
        });
        return studio;
    }, {
        refreshPreview: settings.refreshPreview,
        enableStudio: true,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: settings.renderInspector
    });
}

function reorderSelectedDesignElement(mode = 'forward') {
    const action = String(mode || 'forward');
    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const selectedIds = getSelectedDesignElementIds(studio);
        if (!selectedIds.length) {
            return studio;
        }
        const selectedSet = new Set(selectedIds);
        const hasUnlocked = page.elements.some((item) => selectedSet.has(item.id) && !item.locked);
        if (!hasUnlocked) {
            return studio;
        }
        const elements = Array.isArray(page.elements) ? page.elements : [];
        const maxIndex = elements.length - 1;
        if (maxIndex <= 0) {
            return studio;
        }
        const isSelectedUnlocked = (item) => selectedSet.has(item.id) && !item.locked;
        const selectedIndices = elements
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => isSelectedUnlocked(item))
            .map(({ index }) => index);
        if (!selectedIndices.length) {
            return studio;
        }
        if (action === 'forward') {
            selectedIndices.slice().reverse().forEach((index) => {
                if (index >= maxIndex) {
                    return;
                }
                if (isSelectedUnlocked(elements[index + 1])) {
                    return;
                }
                const temp = elements[index];
                elements[index] = elements[index + 1];
                elements[index + 1] = temp;
            });
            return studio;
        }
        if (action === 'backward') {
            selectedIndices.forEach((index) => {
                if (index <= 0) {
                    return;
                }
                if (isSelectedUnlocked(elements[index - 1])) {
                    return;
                }
                const temp = elements[index];
                elements[index] = elements[index - 1];
                elements[index - 1] = temp;
            });
            return studio;
        }
        if (action === 'to_front') {
            const selected = elements.filter((item) => isSelectedUnlocked(item));
            const rest = elements.filter((item) => !isSelectedUnlocked(item));
            page.elements = [...rest, ...selected];
            return studio;
        }
        if (action === 'to_back') {
            const selected = elements.filter((item) => isSelectedUnlocked(item));
            const rest = elements.filter((item) => !isSelectedUnlocked(item));
            page.elements = [...selected, ...rest];
            return studio;
        }
        return studio;
    }, {
        refreshPreview: true,
        enableStudio: true,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: true,
        announce: 'Elementos alinhados pela seleção.'
    });
}

function alignSelectedDesignElementToCanvas(mode = 'left') {
    const action = String(mode || 'left');
    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const selectedIds = getSelectedDesignElementIds(studio);
        if (!selectedIds.length) {
            return studio;
        }
        const selectedSet = new Set(selectedIds);
        const alignable = page.elements.filter((item) => selectedSet.has(item.id) && !item.locked);
        if (!alignable.length) {
            return studio;
        }
        const minX = Math.min(...alignable.map((item) => item.x));
        const maxX = Math.max(...alignable.map((item) => item.x + item.w));
        const minY = Math.min(...alignable.map((item) => item.y));
        const maxY = Math.max(...alignable.map((item) => item.y + item.h));
        let shiftX = 0;
        let shiftY = 0;
        if (action === 'left') {
            shiftX = -minX;
        } else if (action === 'center') {
            const targetLeft = Math.round((DESIGN_CANVAS_WIDTH - (maxX - minX)) / 2);
            shiftX = targetLeft - minX;
        } else if (action === 'right') {
            shiftX = Math.max(0, DESIGN_CANVAS_WIDTH - maxX);
        } else if (action === 'top') {
            shiftY = -minY;
        } else if (action === 'middle') {
            const targetTop = Math.round((DESIGN_CANVAS_HEIGHT - (maxY - minY)) / 2);
            shiftY = targetTop - minY;
        } else if (action === 'bottom') {
            shiftY = Math.max(0, DESIGN_CANVAS_HEIGHT - maxY);
        }
        page.elements = page.elements.map((element) => {
            if (!selectedSet.has(element.id) || element.locked) {
                return element;
            }
            return sanitizeDesignElement({
                ...element,
                x: clampNumber(
                    element.x + shiftX,
                    0,
                    Math.max(0, DESIGN_CANVAS_WIDTH - element.w),
                    element.x
                ),
                y: clampNumber(
                    element.y + shiftY,
                    0,
                    Math.max(0, DESIGN_CANVAS_HEIGHT - element.h),
                    element.y
                )
            });
        });
        return studio;
    }, {
        refreshPreview: true,
        enableStudio: true,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: true,
        announce: targetAxis === 'horizontal'
            ? 'Elementos distribuídos horizontalmente.'
            : 'Elementos distribuídos verticalmente.'
    });
}

function alignSelectedDesignElementsToSelection(mode = 'left') {
    const action = String(mode || 'left');
    const unlocked = getSelectedUnlockedDesignElements();
    if (unlocked.length < 2) {
        setStatus('Selecione ao menos 2 elementos desbloqueados para alinhar entre si.', 'warn');
        return;
    }

    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const selectedSet = new Set(getSelectedDesignElementIds(studio));
        const alignable = page.elements.filter((item) => selectedSet.has(item.id) && !item.locked);
        if (alignable.length < 2) {
            return studio;
        }

        const minX = Math.min(...alignable.map((item) => item.x));
        const maxX = Math.max(...alignable.map((item) => item.x + item.w));
        const minY = Math.min(...alignable.map((item) => item.y));
        const maxY = Math.max(...alignable.map((item) => item.y + item.h));
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        page.elements = page.elements.map((element) => {
            if (!selectedSet.has(element.id) || element.locked) {
                return element;
            }
            let nextX = element.x;
            let nextY = element.y;

            if (action === 'left') {
                nextX = minX;
            } else if (action === 'center') {
                nextX = Math.round(centerX - (element.w / 2));
            } else if (action === 'right') {
                nextX = Math.round(maxX - element.w);
            } else if (action === 'top') {
                nextY = minY;
            } else if (action === 'middle') {
                nextY = Math.round(centerY - (element.h / 2));
            } else if (action === 'bottom') {
                nextY = Math.round(maxY - element.h);
            }

            return sanitizeDesignElement({
                ...element,
                x: clampNumber(nextX, 0, Math.max(0, DESIGN_CANVAS_WIDTH - element.w), element.x),
                y: clampNumber(nextY, 0, Math.max(0, DESIGN_CANVAS_HEIGHT - element.h), element.y)
            });
        });
        return studio;
    }, {
        refreshPreview: true,
        enableStudio: true,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: true
    });
}

function distributeSelectedDesignElements(axis = 'horizontal', strategy = 'edges') {
    const targetAxis = String(axis || 'horizontal').toLowerCase() === 'vertical'
        ? 'vertical'
        : 'horizontal';
    const targetStrategy = String(strategy || 'edges').toLowerCase() === 'centers'
        ? 'centers'
        : 'edges';
    const unlocked = getSelectedUnlockedDesignElements();
    if (unlocked.length < 3) {
        setStatus('Selecione ao menos 3 elementos desbloqueados para distribuir.', 'warn');
        return;
    }

    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        const selectedSet = new Set(getSelectedDesignElementIds(studio));
        const distributable = page.elements.filter((item) => selectedSet.has(item.id) && !item.locked);
        if (distributable.length < 3) {
            return studio;
        }

        const sorted = distributable.slice().sort((a, b) => (
            targetAxis === 'horizontal'
                ? ((a.x + (a.w / 2)) - (b.x + (b.w / 2)))
                : ((a.y + (a.h / 2)) - (b.y + (b.h / 2)))
        ));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        const nextPositionById = {};
        if (targetStrategy === 'centers') {
            const firstCenter = targetAxis === 'horizontal'
                ? (first.x + (first.w / 2))
                : (first.y + (first.h / 2));
            const lastCenter = targetAxis === 'horizontal'
                ? (last.x + (last.w / 2))
                : (last.y + (last.h / 2));
            const centerGap = (lastCenter - firstCenter) / (sorted.length - 1);

            sorted.forEach((item, index) => {
                if (index === 0) {
                    nextPositionById[item.id] = { x: item.x, y: item.y };
                    return;
                }
                if (index === sorted.length - 1) {
                    nextPositionById[item.id] = { x: last.x, y: last.y };
                    return;
                }
                const targetCenter = firstCenter + (centerGap * index);
                if (targetAxis === 'horizontal') {
                    nextPositionById[item.id] = {
                        x: Math.round(targetCenter - (item.w / 2)),
                        y: item.y
                    };
                } else {
                    nextPositionById[item.id] = {
                        x: item.x,
                        y: Math.round(targetCenter - (item.h / 2))
                    };
                }
            });
        } else {
            const start = targetAxis === 'horizontal' ? first.x : first.y;
            const end = targetAxis === 'horizontal' ? (last.x + last.w) : (last.y + last.h);
            const totalSize = sorted.reduce((acc, item) => acc + (targetAxis === 'horizontal' ? item.w : item.h), 0);
            const gap = (end - start - totalSize) / (sorted.length - 1);
            let cursor = start;

            sorted.forEach((item, index) => {
                if (index === 0) {
                    nextPositionById[item.id] = { x: item.x, y: item.y };
                    cursor = (targetAxis === 'horizontal' ? item.x + item.w : item.y + item.h) + gap;
                    return;
                }
                if (index === sorted.length - 1) {
                    nextPositionById[item.id] = {
                        x: targetAxis === 'horizontal' ? last.x : item.x,
                        y: targetAxis === 'horizontal' ? item.y : last.y
                    };
                    return;
                }
                if (targetAxis === 'horizontal') {
                    nextPositionById[item.id] = { x: Math.round(cursor), y: item.y };
                    cursor += item.w + gap;
                } else {
                    nextPositionById[item.id] = { x: item.x, y: Math.round(cursor) };
                    cursor += item.h + gap;
                }
            });
        }

        page.elements = page.elements.map((element) => {
            if (!selectedSet.has(element.id) || element.locked) {
                return element;
            }
            const nextPos = nextPositionById[element.id];
            if (!nextPos) {
                return element;
            }
            return sanitizeDesignElement({
                ...element,
                x: clampNumber(nextPos.x, 0, Math.max(0, DESIGN_CANVAS_WIDTH - element.w), element.x),
                y: clampNumber(nextPos.y, 0, Math.max(0, DESIGN_CANVAS_HEIGHT - element.h), element.y)
            });
        });
        return studio;
    }, {
        refreshPreview: true,
        enableStudio: true,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: true,
        announce: targetAxis === 'horizontal'
            ? (targetStrategy === 'centers'
                ? 'Elementos distribuídos por centros na horizontal.'
                : 'Elementos distribuídos horizontalmente.')
            : (targetStrategy === 'centers'
                ? 'Elementos distribuídos por centros na vertical.'
                : 'Elementos distribuídos verticalmente.')
    });
}

function copySelectedDesignStyle() {
    const selected = getSelectedDesignElement();
    if (!selected) {
        return;
    }
    currentContext.designStyleClipboard = {
        fontSize: selected.fontSize,
        color: selected.color,
        bg: selected.bg,
        radius: selected.radius,
        opacity: selected.opacity,
        align: selected.align
    };
    setStatus('Estilo do elemento copiado.', 'ok');
}

function pasteSelectedDesignStyle() {
    if (!currentContext.designStyleClipboard || typeof currentContext.designStyleClipboard !== 'object') {
        setStatus('Nenhum estilo copiado para aplicar.', 'warn');
        return;
    }
    updateSelectedDesignElementFromInspector({
        ...currentContext.designStyleClipboard
    }, {
        renderInspector: true,
        refreshPreview: true,
        applyToSelection: true
    });
    const count = getSelectedDesignElementIds().length;
    setStatus(count > 1 ? 'Estilo aplicado aos elementos selecionados.' : 'Estilo aplicado ao elemento selecionado.', 'ok');
}

function toggleSelectedDesignElementLock() {
    const selectedElements = getSelectedDesignElements();
    if (!selectedElements.length) {
        return;
    }
    const shouldLockAll = !selectedElements.every((item) => item.locked);
    updateSelectedDesignElementFromInspector({
        locked: shouldLockAll
    }, {
        renderInspector: true,
        refreshPreview: false,
        allowLocked: true,
        applyToSelection: true
    });
    const count = selectedElements.length;
    if (shouldLockAll) {
        setStatus(count > 1 ? 'Elementos selecionados bloqueados.' : 'Elemento bloqueado.', 'ok');
    } else {
        setStatus(count > 1 ? 'Elementos selecionados desbloqueados.' : 'Elemento desbloqueado.', 'ok');
    }
}

function shouldIgnoreDesignStudioShortcutTarget(target) {
    if (!(target instanceof Element)) {
        return false;
    }
    const editableSelector = 'input, textarea, select, button, [contenteditable="true"], [contenteditable=""]';
    if (target.matches(editableSelector)) {
        return true;
    }
    return Boolean(target.closest(editableSelector));
}

function initDesignStudioKeyboardInteractions() {
    window.addEventListener('keydown', (event) => {
        const key = String(event.key || '');
        if (!key) {
            return;
        }
        if (shouldIgnoreDesignStudioShortcutTarget(event.target)) {
            return;
        }

        const studioRoot = document.getElementById('designerStudio');
        const activeElement = document.activeElement;
        const activeInsideStudio = studioRoot instanceof HTMLElement
            && activeElement instanceof Element
            && studioRoot.contains(activeElement);
        if (!activeInsideStudio && activeElement && activeElement !== document.body) {
            return;
        }

        const selectAllShortcut = (event.ctrlKey || event.metaKey) && key.toLowerCase() === 'a';
        if (selectAllShortcut) {
            event.preventDefault();
            selectAllDesignElements();
            return;
        }
        if (key === 'Escape') {
            event.preventDefault();
            reduceDesignSelectionToPrimary();
            return;
        }

        const selected = getSelectedDesignElement();
        if (!selected) {
            return;
        }
        const selectedElements = getSelectedDesignElements();
        const hasUnlockedSelection = selectedElements.some((item) => !item.locked);

        const step = event.shiftKey ? DESIGN_KEYBOARD_FAST_NUDGE_STEP : DESIGN_KEYBOARD_NUDGE_STEP;
        const resizeMode = event.altKey;

        if (key === 'Delete' || key === 'Backspace') {
            if (!hasUnlockedSelection) {
                return;
            }
            event.preventDefault();
            removeSelectedDesignElement();
            return;
        }

        if (key === '[') {
            if (!hasUnlockedSelection) {
                return;
            }
            event.preventDefault();
            reorderSelectedDesignElement(event.shiftKey ? 'to_back' : 'backward');
            return;
        }
        if (key === ']') {
            if (!hasUnlockedSelection) {
                return;
            }
            event.preventDefault();
            reorderSelectedDesignElement(event.shiftKey ? 'to_front' : 'forward');
            return;
        }

        if (key === 'ArrowLeft') {
            if (!hasUnlockedSelection) {
                return;
            }
            event.preventDefault();
            if (resizeMode) {
                resizeSelectedDesignElement(-step, 0, { refreshPreview: false });
            } else {
                moveSelectedDesignElement(-step, 0, { refreshPreview: false });
            }
            return;
        }
        if (key === 'ArrowRight') {
            if (!hasUnlockedSelection) {
                return;
            }
            event.preventDefault();
            if (resizeMode) {
                resizeSelectedDesignElement(step, 0, { refreshPreview: false });
            } else {
                moveSelectedDesignElement(step, 0, { refreshPreview: false });
            }
            return;
        }
        if (key === 'ArrowUp') {
            if (!hasUnlockedSelection) {
                return;
            }
            event.preventDefault();
            if (resizeMode) {
                resizeSelectedDesignElement(0, -step, { refreshPreview: false });
            } else {
                moveSelectedDesignElement(0, -step, { refreshPreview: false });
            }
            return;
        }
        if (key === 'ArrowDown') {
            if (!hasUnlockedSelection) {
                return;
            }
            event.preventDefault();
            if (resizeMode) {
                resizeSelectedDesignElement(0, step, { refreshPreview: false });
            } else {
                moveSelectedDesignElement(0, step, { refreshPreview: false });
            }
            return;
        }
    });
}

function rebuildDesignStudioFromStructure() {
    withDesignStudioMutation(() => createDesignStudioFromStructure(currentContext.builderStructureIds), {
        enableStudio: true,
        announce: 'Design Studio regenerado com base na estrutura atual.'
    });
}

function renderDesignStudioUi(options = {}) {
    const settings = {
        renderSelect: true,
        renderCanvas: true,
        renderInspector: true,
        ...options
    };
    currentContext.designStudio = ensureDesignStudioSelection(sanitizeDesignStudio(currentContext.designStudio));
    if (settings.renderSelect) {
        renderDesignStudioPageSelect();
    }
    if (settings.renderCanvas) {
        renderDesignStudioCanvas();
    }
    if (settings.renderInspector) {
        renderDesignStudioInspector();
    }
    updateDesignStudioMeta();
    renderDesignSnapControls();
}

function updateDesignStudioMeta() {
    const target = document.getElementById('designStudioMeta');
    if (!target) {
        return;
    }
    const page = getActiveDesignPage();
    if (!page) {
        target.textContent = 'Sem página ativa';
        return;
    }
    const selectedCount = getSelectedDesignElementIds().length;
    target.textContent = `${page.name} | ${page.elements.length} elemento(s) | ${selectedCount} selecionado(s)`;
}

function renderDesignStudioPageSelect() {
    const select = document.getElementById('designPageSelect');
    if (!(select instanceof HTMLSelectElement)) {
        return;
    }
    const studio = sanitizeDesignStudio(currentContext.designStudio);
    select.innerHTML = studio.pages.map((page, index) => (
        `<option value="${escapeHtml(page.id)}">${escapeHtml(`${String(index + 1).padStart(2, '0')} - ${page.name}`)}</option>`
    )).join('');
    select.value = studio.selectedPageId || studio.pages[0]?.id || '';
}

function buildRgbaFromHex(hex, opacityPercent = 100) {
    const rgb = hexToRgb(normalizeHex(hex, '#ffffff'));
    const alpha = clampNumber(opacityPercent, 0, 100, 100) / 100;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(3)})`;
}

function resolveDesignTextTokens(input, payload = currentContext.payload, displayMockups = currentContext.displayMockups) {
    const text = String(input || '');
    if (!text.includes('{{')) {
        return text;
    }
    const colors = Array.isArray(payload?.identity?.colors) ? payload.identity.colors : [];
    const map = {
        'project.title': payload?.identity?.project?.title || NOT_DEFINED_LABEL,
        'project.description': payload?.identity?.project?.description || NOT_DEFINED_LABEL,
        'project.tag': normalizeTag(payload?.identity?.project?.mainTag) || NOT_DEFINED_LABEL,
        'template.name': String(valueOfField('customTemplateName') || getTemplatePreset(currentContext.activeTemplateId).name || 'Template'),
        'date': formatDate(new Date()),
        'palette.1': colors[0]?.hex || '#000000',
        'palette.2': colors[1]?.hex || '#334155',
        'palette.3': colors[2]?.hex || '#64748b',
        'palette.4': colors[3]?.hex || '#94a3b8',
        'typography.primary': payload?.identity?.typography?.primaryFontName || NOT_DEFINED_LABEL,
        'typography.secondary': payload?.identity?.typography?.secondaryFontName || NOT_DEFINED_LABEL,
        'mockups.count': String(Array.isArray(displayMockups) ? displayMockups.length : 0)
    };

    return text.replace(/\{\{\s*([a-z0-9._-]+)\s*\}\}/gi, (_, token) => {
        const key = String(token || '').toLowerCase();
        return Object.prototype.hasOwnProperty.call(map, key)
            ? String(map[key])
            : '';
    });
}

function buildDesignResizeHandlesHtml(isSelected, isLocked = false) {
    if (!isSelected || isLocked) {
        return '';
    }
    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    return handles.map((handle) => (
        `<span class="design-resize-handle handle-${handle}" data-design-resize-handle="${handle}" aria-hidden="true"></span>`
    )).join('');
}

function buildDesignLockBadgeHtml(isLocked = false) {
    if (!isLocked) {
        return '';
    }
    return `
        <span class="design-lock-badge" title="Elemento bloqueado" aria-hidden="true">
            <svg viewBox="0 0 24 24"><rect x="6" y="10" width="12" height="10" rx="2"></rect><path d="M8 10V8a4 4 0 0 1 8 0v2"></path></svg>
        </span>
    `;
}

function renderDesignStudioCanvas() {
    const canvas = document.getElementById('designStudioCanvas');
    if (!canvas) {
        return;
    }
    const studio = ensureDesignStudioSelection(sanitizeDesignStudio(currentContext.designStudio, { ensurePage: false }));
    const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
    if (!page) {
        canvas.innerHTML = '<p class="designer-empty">Crie uma página para iniciar.</p>';
        return;
    }

    const selectedIds = getSelectedDesignElementIds(studio);
    const selectedSet = new Set(selectedIds);
    const primarySelectedId = String(studio.selectedElementId || selectedIds[0] || '');
    const allowResizeHandles = selectedIds.length === 1;
    const firstMockup = Array.isArray(currentContext.displayMockups)
        ? currentContext.displayMockups.find((item) => item.hasPreview && item.previewDataUrl)
        : null;
    const activePreset = getTemplatePreset(currentContext.activeTemplateId);
    const palettePreset = {
        ...activePreset,
        ...buildPalettePresetFromBuilder(getThemeKeyFromThemeClass(activePreset.themeClass), activePreset)
    };
    const palette = resolveTemplateColors(currentContext.payload?.identity?.colors, palettePreset);

    canvas.innerHTML = page.elements.map((element) => {
        const resolvedText = resolveDesignTextTokens(element.text, currentContext.payload, currentContext.displayMockups);
        const isSelected = selectedSet.has(element.id);
        const isPrimary = primarySelectedId === element.id;
        const isLocked = Boolean(element.locked);
        const resizeHandles = buildDesignResizeHandlesHtml(isPrimary && allowResizeHandles, isLocked);
        const lockBadge = buildDesignLockBadgeHtml(isLocked);
        const baseStyle = [
            `left:${Math.round(element.x)}px`,
            `top:${Math.round(element.y)}px`,
            `width:${Math.round(element.w)}px`,
            `height:${Math.round(element.h)}px`,
            `font-size:${Math.round(element.fontSize)}px`,
            `color:${escapeHtml(element.color)}`,
            `background:${escapeHtml(buildRgbaFromHex(element.bg, element.opacity))}`,
            `border-radius:${Math.round(element.radius)}px`,
            `text-align:${escapeHtml(element.align)}`,
            `justify-content:${element.align === 'center' ? 'center' : (element.align === 'right' ? 'flex-end' : 'flex-start')}`
        ].join(';');

        if (element.type === 'color_row') {
            const swatches = (palette.length ? palette : [{ hex: '#0f172a' }, { hex: '#334155' }, { hex: '#64748b' }])
                .slice(0, 6)
                .map((item) => `<span data-color="${escapeHtml(item.hex)}"></span>`)
                .join('');
            return `
                <article
                    class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                    data-inline-style="${baseStyle}"
                    data-design-element-id="${escapeHtml(element.id)}"
                    data-design-element-type="${escapeHtml(element.type)}"
                >${swatches}${resizeHandles}${lockBadge}</article>
            `;
        }

        if (element.type === 'mockup_slot') {
            const content = firstMockup && firstMockup.previewDataUrl
                ? `<img src="${escapeHtml(firstMockup.previewDataUrl)}" alt="Mockup"/>`
                : `<div class="mockup-placeholder">${escapeHtml(resolvedText || 'Mockup Slot')}</div>`;
            return `
                <article
                    class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                    data-inline-style="${baseStyle}"
                    data-design-element-id="${escapeHtml(element.id)}"
                    data-design-element-type="${escapeHtml(element.type)}"
                >${content}${resizeHandles}${lockBadge}</article>
            `;
        }

        if (element.type === 'divider') {
            const dividerLabel = resolvedText ? `<small>${escapeHtml(resolvedText)}</small>` : '';
            return `
                <article
                    class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                    data-inline-style="${baseStyle}"
                    data-design-element-id="${escapeHtml(element.id)}"
                    data-design-element-type="${escapeHtml(element.type)}"
                ><span class="divider-line"></span>${dividerLabel}${resizeHandles}${lockBadge}</article>
            `;
        }

        if (element.type === 'bullet_list') {
            const lines = String(resolvedText || '')
                .split(/\r?\n|;/g)
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 8);
            const listItems = (lines.length ? lines : ['Item de lista']).map((item) => `<li>${escapeHtml(item)}</li>`).join('');
            return `
                <article
                    class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                    data-inline-style="${baseStyle}"
                    data-design-element-id="${escapeHtml(element.id)}"
                    data-design-element-type="${escapeHtml(element.type)}"
                ><ul>${listItems}</ul>${resizeHandles}${lockBadge}</article>
            `;
        }

        if (element.type === 'stat_card') {
            const parts = String(resolvedText || '').split(/\r?\n/g).filter(Boolean);
            const headline = parts[0] || '92%';
            const caption = parts.slice(1).join(' ') || 'consistência visual';
            return `
                <article
                    class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                    data-inline-style="${baseStyle}"
                    data-design-element-id="${escapeHtml(element.id)}"
                    data-design-element-type="${escapeHtml(element.type)}"
                ><strong>${escapeHtml(headline)}</strong><small>${escapeHtml(caption)}</small>${resizeHandles}${lockBadge}</article>
            `;
        }

        if (element.type === 'info_card') {
            const parts = String(resolvedText || '').split(/\r?\n/g).filter(Boolean);
            const heading = parts[0] || 'Título';
            const body = parts.slice(1).join(' ') || 'Texto de apoio.';
            return `
                <article
                    class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                    data-inline-style="${baseStyle}"
                    data-design-element-id="${escapeHtml(element.id)}"
                    data-design-element-type="${escapeHtml(element.type)}"
                ><strong>${escapeHtml(heading)}</strong><p>${escapeHtml(body)}</p>${resizeHandles}${lockBadge}</article>
            `;
        }

        if (element.type === 'quote_block') {
            const parts = String(resolvedText || '').split(/\r?\n/g).filter(Boolean);
            const quote = parts[0] || '"Mensagem da marca"';
            const author = parts.slice(1).join(' ') || 'Equipe';
            return `
                <article
                    class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                    data-inline-style="${baseStyle}"
                    data-design-element-id="${escapeHtml(element.id)}"
                    data-design-element-type="${escapeHtml(element.type)}"
                ><blockquote>${escapeHtml(quote)}</blockquote><cite>${escapeHtml(author)}</cite>${resizeHandles}${lockBadge}</article>
            `;
        }

        if (element.type === 'timeline_step') {
            const parts = String(resolvedText || '').split(/\r?\n/g).filter(Boolean);
            const phase = parts[0] || 'Etapa';
            const detail = parts.slice(1).join(' ') || 'Descrição da etapa';
            return `
                <article
                    class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                    data-inline-style="${baseStyle}"
                    data-design-element-id="${escapeHtml(element.id)}"
                    data-design-element-type="${escapeHtml(element.type)}"
                ><span class="timeline-dot" aria-hidden="true"></span><div class="timeline-copy"><strong>${escapeHtml(phase)}</strong><p>${escapeHtml(detail)}</p></div>${resizeHandles}${lockBadge}</article>
            `;
        }

        if (element.type === 'comparison_card') {
            const lines = String(resolvedText || '').split(/\r?\n/g).filter(Boolean);
            const headerParts = String(lines[0] || 'Antes | Depois').split('|').map((item) => item.trim()).filter(Boolean);
            const bodyParts = String(lines[1] || 'Item A | Item B').split('|').map((item) => item.trim()).filter(Boolean);
            const leftHeader = headerParts[0] || 'Antes';
            const rightHeader = headerParts[1] || 'Depois';
            const leftBody = bodyParts[0] || 'Contexto anterior';
            const rightBody = bodyParts[1] || 'Contexto otimizado';
            return `
                <article
                    class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                    data-inline-style="${baseStyle}"
                    data-design-element-id="${escapeHtml(element.id)}"
                    data-design-element-type="${escapeHtml(element.type)}"
                >
                    <div class="comparison-col"><strong>${escapeHtml(leftHeader)}</strong><p>${escapeHtml(leftBody)}</p></div>
                    <div class="comparison-col"><strong>${escapeHtml(rightHeader)}</strong><p>${escapeHtml(rightBody)}</p></div>
                    ${resizeHandles}${lockBadge}
                </article>
            `;
        }

        if (element.type === 'shape_line') {
            return `
                <article
                    class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                    data-inline-style="${baseStyle}"
                    data-design-element-id="${escapeHtml(element.id)}"
                    data-design-element-type="${escapeHtml(element.type)}"
                ><span class="shape-line-core"></span>${resizeHandles}${lockBadge}</article>
            `;
        }

        const contentText = DESIGN_SHAPE_ONLY_TYPES.includes(String(element.type || ''))
            ? (resolvedText || '')
            : (resolvedText || DESIGN_TEXT_TOKEN_HINT);
        return `
            <article
                class="design-element type-${escapeHtml(element.type)}${isSelected ? ' is-selected' : ''}${isPrimary ? ' is-primary-selected' : ''}${isLocked ? ' is-locked' : ''}"
                data-inline-style="${baseStyle}"
                data-design-element-id="${escapeHtml(element.id)}"
                data-design-element-type="${escapeHtml(element.type)}"
            >${escapeHtml(contentText)}${resizeHandles}${lockBadge}</article>
        `;
    }).join('');
    applyInlineStyleDataset(canvas);
}

function renderDesignStudioInspector() {
    currentContext.designStudio = ensureDesignStudioSelection(sanitizeDesignStudio(currentContext.designStudio));
    const metaField = document.getElementById('designElementMeta');
    const textField = document.getElementById('designElementText');
    const xField = document.getElementById('designElementX');
    const yField = document.getElementById('designElementY');
    const wField = document.getElementById('designElementW');
    const hField = document.getElementById('designElementH');
    const fontSizeField = document.getElementById('designElementFontSize');
    const alignField = document.getElementById('designElementAlign');
    const colorField = document.getElementById('designElementColor');
    const bgField = document.getElementById('designElementBg');
    const radiusField = document.getElementById('designElementRadius');
    const opacityField = document.getElementById('designElementOpacity');
    const duplicateBtn = document.getElementById('duplicateDesignElementBtn');
    const removeBtn = document.getElementById('removeDesignElementBtn');
    const resetBtn = document.getElementById('resetDesignElementStyleBtn');
    const resizeWMinusBtn = document.getElementById('designResizeWMinusBtn');
    const resizeWPlusBtn = document.getElementById('designResizeWPlusBtn');
    const resizeHMinusBtn = document.getElementById('designResizeHMinusBtn');
    const resizeHPlusBtn = document.getElementById('designResizeHPlusBtn');
    const layerBackBtn = document.getElementById('designLayerBackBtn');
    const layerFrontBtn = document.getElementById('designLayerFrontBtn');
    const layerBottomBtn = document.getElementById('designLayerBottomBtn');
    const layerTopBtn = document.getElementById('designLayerTopBtn');
    const alignLeftBtn = document.getElementById('designAlignLeftBtn');
    const alignCenterBtn = document.getElementById('designAlignCenterBtn');
    const alignRightBtn = document.getElementById('designAlignRightBtn');
    const alignTopBtn = document.getElementById('designAlignTopBtn');
    const alignMiddleBtn = document.getElementById('designAlignMiddleBtn');
    const alignBottomBtn = document.getElementById('designAlignBottomBtn');
    const alignSelLeftBtn = document.getElementById('designAlignSelLeftBtn');
    const alignSelCenterBtn = document.getElementById('designAlignSelCenterBtn');
    const alignSelRightBtn = document.getElementById('designAlignSelRightBtn');
    const alignSelTopBtn = document.getElementById('designAlignSelTopBtn');
    const alignSelMiddleBtn = document.getElementById('designAlignSelMiddleBtn');
    const alignSelBottomBtn = document.getElementById('designAlignSelBottomBtn');
    const distributeHBtn = document.getElementById('designDistributeHBtn');
    const distributeVBtn = document.getElementById('designDistributeVBtn');
    const distributeCenterHBtn = document.getElementById('designDistributeCenterHBtn');
    const distributeCenterVBtn = document.getElementById('designDistributeCenterVBtn');
    const copyStyleBtn = document.getElementById('designCopyStyleBtn');
    const pasteStyleBtn = document.getElementById('designPasteStyleBtn');
    const toggleLockBtn = document.getElementById('designToggleLockBtn');

    const selected = getSelectedDesignElement();
    const selectedIds = getSelectedDesignElementIds();
    const selectedElements = getSelectedDesignElements();
    const selectedCount = selectedIds.length;
    const lockedCount = selectedElements.filter((item) => item.locked).length;
    const isMulti = selectedCount > 1;
    const disable = !selected;
    const locked = Boolean(selected?.locked);
    const hasUnlockedSelection = selectedElements.some((item) => !item.locked);
    const unlockedSelectionCount = selectedElements.filter((item) => !item.locked).length;

    const contentAndBoxFields = [textField, xField, yField, wField, hField];
    contentAndBoxFields.forEach((field) => {
        if (field && 'disabled' in field) {
            field.disabled = disable || locked || isMulti;
        }
    });
    const styleFields = [fontSizeField, alignField, colorField, bgField, radiusField, opacityField];
    styleFields.forEach((field) => {
        if (field && 'disabled' in field) {
            field.disabled = disable || !hasUnlockedSelection;
        }
    });
    [
        duplicateBtn,
        removeBtn,
        resetBtn,
        resizeWMinusBtn,
        resizeWPlusBtn,
        resizeHMinusBtn,
        resizeHPlusBtn,
        layerBackBtn,
        layerFrontBtn,
        layerBottomBtn,
        layerTopBtn,
        alignLeftBtn,
        alignCenterBtn,
        alignRightBtn,
        alignTopBtn,
        alignMiddleBtn,
        alignBottomBtn
    ].forEach((button) => {
        if (button instanceof HTMLButtonElement) {
            button.disabled = disable || !hasUnlockedSelection;
        }
    });
    [
        alignSelLeftBtn,
        alignSelCenterBtn,
        alignSelRightBtn,
        alignSelTopBtn,
        alignSelMiddleBtn,
        alignSelBottomBtn
    ].forEach((button) => {
        if (button instanceof HTMLButtonElement) {
            button.disabled = disable || unlockedSelectionCount < 2;
        }
    });
    [distributeHBtn, distributeVBtn, distributeCenterHBtn, distributeCenterVBtn].forEach((button) => {
        if (button instanceof HTMLButtonElement) {
            button.disabled = disable || unlockedSelectionCount < 3;
        }
    });
    [copyStyleBtn].forEach((button) => {
        if (button instanceof HTMLButtonElement) {
            button.disabled = disable;
        }
    });
    if (pasteStyleBtn instanceof HTMLButtonElement) {
        pasteStyleBtn.disabled = disable || !hasUnlockedSelection || !currentContext.designStyleClipboard;
    }
    if (toggleLockBtn instanceof HTMLButtonElement) {
        toggleLockBtn.disabled = disable;
    }

    if (!selected) {
        if (metaField) metaField.value = '';
        if (textField) textField.value = '';
        if (xField) xField.value = '';
        if (yField) yField.value = '';
        if (wField) wField.value = '';
        if (hField) hField.value = '';
        if (fontSizeField) fontSizeField.value = '';
        if (colorField) colorField.value = '#142036';
        if (bgField) bgField.value = '#ffffff';
        if (radiusField) radiusField.value = '';
        if (opacityField) opacityField.value = '';
        if (toggleLockBtn instanceof HTMLButtonElement) {
            toggleLockBtn.classList.remove('is-active');
            toggleLockBtn.setAttribute('aria-label', 'Bloquear elemento');
            toggleLockBtn.setAttribute('title', 'Bloquear elemento');
            toggleLockBtn.setAttribute('data-tooltip', 'Bloquear elemento');
        }
        return;
    }

    if (isMulti) {
        if (metaField) metaField.value = `${selectedCount} elementos selecionados | ${lockedCount} bloqueado(s)`;
        if (textField) textField.value = '';
        if (xField) xField.value = '';
        if (yField) yField.value = '';
        if (wField) wField.value = '';
        if (hField) hField.value = '';
    } else {
        if (metaField) metaField.value = `${getDesignElementTypeLabel(selected.type)}${selected.locked ? ' | Bloqueado' : ''} | ${selected.id}`;
        if (textField) textField.value = selected.text || '';
        if (xField) xField.value = String(Math.round(selected.x));
        if (yField) yField.value = String(Math.round(selected.y));
        if (wField) wField.value = String(Math.round(selected.w));
        if (hField) hField.value = String(Math.round(selected.h));
    }
    if (fontSizeField) fontSizeField.value = String(Math.round(selected.fontSize));
    if (alignField instanceof HTMLSelectElement) alignField.value = selected.align;
    if (colorField) colorField.value = normalizeHex(selected.color, '#142036');
    if (bgField) bgField.value = normalizeHex(selected.bg, '#ffffff');
    if (radiusField) radiusField.value = String(Math.round(selected.radius));
    if (opacityField) opacityField.value = String(Math.round(selected.opacity));
    if (toggleLockBtn instanceof HTMLButtonElement) {
        const allLocked = selectedElements.length > 0 && selectedElements.every((item) => item.locked);
        const label = allLocked
            ? (isMulti ? 'Desbloquear seleção' : 'Desbloquear elemento')
            : (isMulti ? 'Bloquear seleção' : 'Bloquear elemento');
        toggleLockBtn.setAttribute('aria-label', label);
        toggleLockBtn.setAttribute('title', label);
        toggleLockBtn.setAttribute('data-tooltip', label);
        toggleLockBtn.classList.toggle('is-active', allLocked);
    }
}

function resetDesignDragState() {
    hideDesignMarqueeOverlay();
    hideDesignSnapGuides();
    currentContext.designDragState.active = false;
    currentContext.designDragState.mode = 'move';
    currentContext.designDragState.resizeHandle = '';
    currentContext.designDragState.pointerId = null;
    currentContext.designDragState.pageId = '';
    currentContext.designDragState.elementId = '';
    currentContext.designDragState.pointerStartX = 0;
    currentContext.designDragState.pointerStartY = 0;
    currentContext.designDragState.elementStartX = 0;
    currentContext.designDragState.elementStartY = 0;
    currentContext.designDragState.elementStartW = 0;
    currentContext.designDragState.elementStartH = 0;
    currentContext.designDragState.selectionStartRects = {};
    currentContext.designDragState.lastShiftX = 0;
    currentContext.designDragState.lastShiftY = 0;
    currentContext.designDragState.marqueeStartX = 0;
    currentContext.designDragState.marqueeStartY = 0;
    currentContext.designDragState.marqueeEndX = 0;
    currentContext.designDragState.marqueeEndY = 0;
    currentContext.designDragState.marqueeAdditive = false;
    currentContext.designDragState.marqueeToggle = false;
    currentContext.designDragState.marqueeBaseSelectionIds = [];
    currentContext.designDragState.snapGuideX = null;
    currentContext.designDragState.snapGuideY = null;
    currentContext.designDragState.moved = false;
}

function resolveResizeRectFromHandle(handle, dx, dy, startX, startY, startW, startH) {
    const minSize = DESIGN_MIN_ELEMENT_SIZE;
    let left = startX;
    let top = startY;
    let right = startX + startW;
    let bottom = startY + startH;

    if (handle.includes('w')) {
        left = clampNumber(startX + dx, 0, right - minSize, startX);
    }
    if (handle.includes('e')) {
        right = clampNumber(startX + startW + dx, left + minSize, DESIGN_CANVAS_WIDTH, startX + startW);
    }
    if (handle.includes('n')) {
        top = clampNumber(startY + dy, 0, bottom - minSize, startY);
    }
    if (handle.includes('s')) {
        bottom = clampNumber(startY + startH + dy, top + minSize, DESIGN_CANVAS_HEIGHT, startY + startH);
    }

    return {
        x: Math.round(left),
        y: Math.round(top),
        w: Math.round(Math.max(minSize, right - left)),
        h: Math.round(Math.max(minSize, bottom - top))
    };
}

function applyDesignResizeSnapFromDragState(rect, handle) {
    const state = currentContext.designDragState;
    const safeRect = rect && typeof rect === 'object'
        ? {
            x: Number(rect.x || 0),
            y: Number(rect.y || 0),
            w: Number(rect.w || DESIGN_MIN_ELEMENT_SIZE),
            h: Number(rect.h || DESIGN_MIN_ELEMENT_SIZE)
        }
        : {
            x: Number(state.elementStartX || 0),
            y: Number(state.elementStartY || 0),
            w: Number(state.elementStartW || DESIGN_MIN_ELEMENT_SIZE),
            h: Number(state.elementStartH || DESIGN_MIN_ELEMENT_SIZE)
        };
    const resizeHandle = String(handle || '').toLowerCase();
    const includesW = resizeHandle.includes('w');
    const includesE = resizeHandle.includes('e');
    const includesN = resizeHandle.includes('n');
    const includesS = resizeHandle.includes('s');
    if (!(includesW || includesE || includesN || includesS)) {
        state.snapGuideX = null;
        state.snapGuideY = null;
        updateDesignSnapGuides(null, null);
        return {
            x: Math.round(safeRect.x),
            y: Math.round(safeRect.y),
            w: Math.round(safeRect.w),
            h: Math.round(safeRect.h)
        };
    }

    currentContext.designSnapSettings = sanitizeDesignSnapSettings(currentContext.designSnapSettings);
    const snapSettings = currentContext.designSnapSettings;
    if (!snapSettings.gridEnabled && !snapSettings.elementEnabled) {
        state.snapGuideX = null;
        state.snapGuideY = null;
        updateDesignSnapGuides(null, null);
        return {
            x: Math.round(safeRect.x),
            y: Math.round(safeRect.y),
            w: Math.round(safeRect.w),
            h: Math.round(safeRect.h)
        };
    }

    const threshold = Number(snapSettings.threshold || DESIGN_SNAP_THRESHOLD);
    const gridSize = Number(snapSettings.gridSize || DESIGN_SNAP_GRID_SIZE);
    const pickBestSnap = (points, targets) => {
        let best = null;
        points.forEach((point) => {
            targets.forEach((target) => {
                const delta = Number(target) - Number(point);
                const abs = Math.abs(delta);
                if (abs > threshold) {
                    return;
                }
                if (!best || abs < best.abs) {
                    best = {
                        delta,
                        target: Number(target),
                        abs
                    };
                }
            });
        });
        return best;
    };

    let left = Number(safeRect.x);
    let top = Number(safeRect.y);
    let right = Number(safeRect.x) + Number(safeRect.w);
    let bottom = Number(safeRect.y) + Number(safeRect.h);
    const movedPointsX = [];
    const movedPointsY = [];
    if (includesW) movedPointsX.push(left);
    if (includesE) movedPointsX.push(right);
    if (includesN) movedPointsY.push(top);
    if (includesS) movedPointsY.push(bottom);

    let gridSnapX = null;
    let gridSnapY = null;
    if (snapSettings.gridEnabled) {
        const gridTargetsX = movedPointsX.map((point) => Math.round(point / gridSize) * gridSize);
        const gridTargetsY = movedPointsY.map((point) => Math.round(point / gridSize) * gridSize);
        gridSnapX = pickBestSnap(movedPointsX, gridTargetsX);
        gridSnapY = pickBestSnap(movedPointsY, gridTargetsY);
    }

    let objectSnapX = null;
    let objectSnapY = null;
    if (snapSettings.elementEnabled) {
        const page = getActiveDesignPage();
        const activeId = String(state.elementId || '');
        const others = Array.isArray(page?.elements)
            ? page.elements.filter((element) => element.id !== activeId)
            : [];
        if (others.length) {
            const targetPointsX = [];
            const targetPointsY = [];
            others.forEach((element) => {
                const ex = Number(element.x || 0);
                const ey = Number(element.y || 0);
                const ew = Number(element.w || DESIGN_MIN_ELEMENT_SIZE);
                const eh = Number(element.h || DESIGN_MIN_ELEMENT_SIZE);
                targetPointsX.push(ex, ex + (ew / 2), ex + ew);
                targetPointsY.push(ey, ey + (eh / 2), ey + eh);
            });
            objectSnapX = pickBestSnap(movedPointsX, targetPointsX);
            objectSnapY = pickBestSnap(movedPointsY, targetPointsY);
        }
    }

    const chooseSnap = (gridSnap, objectSnap) => {
        if (gridSnap && objectSnap) {
            return objectSnap.abs <= gridSnap.abs ? objectSnap : gridSnap;
        }
        return objectSnap || gridSnap || null;
    };

    const bestSnapX = chooseSnap(gridSnapX, objectSnapX);
    const bestSnapY = chooseSnap(gridSnapY, objectSnapY);
    if (bestSnapX) {
        if (includesW) {
            left += bestSnapX.delta;
        } else if (includesE) {
            right += bestSnapX.delta;
        }
    }
    if (bestSnapY) {
        if (includesN) {
            top += bestSnapY.delta;
        } else if (includesS) {
            bottom += bestSnapY.delta;
        }
    }

    const minSize = DESIGN_MIN_ELEMENT_SIZE;
    if (includesW) {
        left = clampNumber(left, 0, right - minSize, left);
    }
    if (includesE) {
        right = clampNumber(right, left + minSize, DESIGN_CANVAS_WIDTH, right);
    }
    if (includesN) {
        top = clampNumber(top, 0, bottom - minSize, top);
    }
    if (includesS) {
        bottom = clampNumber(bottom, top + minSize, DESIGN_CANVAS_HEIGHT, bottom);
    }

    const snappedRect = {
        x: Math.round(left),
        y: Math.round(top),
        w: Math.round(Math.max(minSize, right - left)),
        h: Math.round(Math.max(minSize, bottom - top))
    };

    state.snapGuideX = bestSnapX ? bestSnapX.target : null;
    state.snapGuideY = bestSnapY ? bestSnapY.target : null;
    updateDesignSnapGuides(state.snapGuideX, state.snapGuideY);
    return snappedRect;
}

function getDesignCanvasPointerCoords(event, canvas) {
    if (!canvas || !(event instanceof PointerEvent)) {
        return { x: 0, y: 0 };
    }
    const rect = canvas.getBoundingClientRect();
    const scrollWrap = canvas.closest('.designer-canvas-scroll');
    const scrollLeft = scrollWrap instanceof HTMLElement ? scrollWrap.scrollLeft : 0;
    const scrollTop = scrollWrap instanceof HTMLElement ? scrollWrap.scrollTop : 0;
    const rawX = (event.clientX - rect.left) + scrollLeft;
    const rawY = (event.clientY - rect.top) + scrollTop;
    const x = clampNumber(rawX, 0, DESIGN_CANVAS_WIDTH, 0);
    const y = clampNumber(rawY, 0, DESIGN_CANVAS_HEIGHT, 0);
    return {
        x: Math.round(x),
        y: Math.round(y)
    };
}

function buildNormalizedCanvasRect(x1, y1, x2, y2) {
    const left = Math.min(x1, x2);
    const right = Math.max(x1, x2);
    const top = Math.min(y1, y2);
    const bottom = Math.max(y1, y2);
    return {
        left,
        top,
        right,
        bottom,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top)
    };
}

function rectIntersects(a, b) {
    if (!a || !b) {
        return false;
    }
    return !(a.left > b.right || a.right < b.left || a.top > b.bottom || a.bottom < b.top);
}

function getDesignMarqueeOverlay(canvas, createIfMissing = false) {
    if (!canvas) {
        return null;
    }
    const existing = canvas.querySelector('.design-selection-marquee');
    if (existing instanceof HTMLElement) {
        return existing;
    }
    if (!createIfMissing) {
        return null;
    }
    const overlay = document.createElement('div');
    overlay.className = 'design-selection-marquee';
    overlay.setAttribute('aria-hidden', 'true');
    canvas.appendChild(overlay);
    return overlay;
}

function updateDesignMarqueeOverlay(canvas, startX, startY, endX, endY) {
    if (!canvas) {
        return;
    }
    const overlay = getDesignMarqueeOverlay(canvas, true);
    if (!(overlay instanceof HTMLElement)) {
        return;
    }
    const rect = buildNormalizedCanvasRect(startX, startY, endX, endY);
    overlay.style.display = 'block';
    overlay.style.left = `${Math.round(rect.left)}px`;
    overlay.style.top = `${Math.round(rect.top)}px`;
    overlay.style.width = `${Math.round(rect.width)}px`;
    overlay.style.height = `${Math.round(rect.height)}px`;
    canvas.classList.add('is-marquee-selecting');
}

function hideDesignMarqueeOverlay() {
    const canvas = document.getElementById('designStudioCanvas');
    if (!(canvas instanceof HTMLElement)) {
        return;
    }
    const overlay = getDesignMarqueeOverlay(canvas, false);
    if (overlay instanceof HTMLElement) {
        overlay.style.display = 'none';
        overlay.style.width = '0px';
        overlay.style.height = '0px';
    }
    canvas.classList.remove('is-marquee-selecting');
}

function getDesignSnapGuideElement(canvas, axis = 'x', createIfMissing = false) {
    if (!(canvas instanceof HTMLElement)) {
        return null;
    }
    const className = axis === 'y' ? 'guide-y' : 'guide-x';
    const existing = canvas.querySelector(`.design-snap-guide.${className}`);
    if (existing instanceof HTMLElement) {
        return existing;
    }
    if (!createIfMissing) {
        return null;
    }
    const guide = document.createElement('span');
    guide.className = `design-snap-guide ${className}`;
    guide.setAttribute('aria-hidden', 'true');
    canvas.appendChild(guide);
    return guide;
}

function updateDesignSnapGuides(x = null, y = null) {
    const canvas = document.getElementById('designStudioCanvas');
    if (!(canvas instanceof HTMLElement)) {
        return;
    }
    const guideX = getDesignSnapGuideElement(canvas, 'x', true);
    const guideY = getDesignSnapGuideElement(canvas, 'y', true);

    if (guideX instanceof HTMLElement) {
        if (Number.isFinite(Number(x))) {
            guideX.style.display = 'block';
            guideX.style.left = `${Math.round(Number(x))}px`;
        } else {
            guideX.style.display = 'none';
        }
    }
    if (guideY instanceof HTMLElement) {
        if (Number.isFinite(Number(y))) {
            guideY.style.display = 'block';
            guideY.style.top = `${Math.round(Number(y))}px`;
        } else {
            guideY.style.display = 'none';
        }
    }
}

function hideDesignSnapGuides() {
    updateDesignSnapGuides(null, null);
}

function applyDesignMoveFromDragState(deltaX = 0, deltaY = 0) {
    const state = currentContext.designDragState;
    const startRects = state.selectionStartRects && typeof state.selectionStartRects === 'object'
        ? state.selectionStartRects
        : {};
    const movableIds = Object.keys(startRects).filter((id) => !startRects[id]?.locked);
    if (!movableIds.length) {
        return false;
    }

    const selectedIds = Object.keys(startRects);
    const selectedSet = new Set(selectedIds);
    const minX = Math.min(...movableIds.map((id) => Number(startRects[id].x || 0)));
    const maxRight = Math.max(...movableIds.map((id) => Number(startRects[id].x || 0) + Number(startRects[id].w || DESIGN_MIN_ELEMENT_SIZE)));
    const minY = Math.min(...movableIds.map((id) => Number(startRects[id].y || 0)));
    const maxBottom = Math.max(...movableIds.map((id) => Number(startRects[id].y || 0) + Number(startRects[id].h || DESIGN_MIN_ELEMENT_SIZE)));
    const minShiftX = -minX;
    const maxShiftX = Math.max(0, DESIGN_CANVAS_WIDTH - maxRight);
    const minShiftY = -minY;
    const maxShiftY = Math.max(0, DESIGN_CANVAS_HEIGHT - maxBottom);
    let shiftX = clampNumber(Number(deltaX || 0), minShiftX, maxShiftX, 0);
    let shiftY = clampNumber(Number(deltaY || 0), minShiftY, maxShiftY, 0);

    currentContext.designSnapSettings = sanitizeDesignSnapSettings(currentContext.designSnapSettings);
    const snapSettings = currentContext.designSnapSettings;
    let snapGuideX = null;
    let snapGuideY = null;

    if (snapSettings.gridEnabled || snapSettings.elementEnabled) {
        const threshold = Number(snapSettings.threshold || DESIGN_SNAP_THRESHOLD);
        const gridSize = Number(snapSettings.gridSize || DESIGN_SNAP_GRID_SIZE);

        const groupLeft = minX + shiftX;
        const groupRight = maxRight + shiftX;
        const groupTop = minY + shiftY;
        const groupBottom = maxBottom + shiftY;
        const groupCenterX = (groupLeft + groupRight) / 2;
        const groupCenterY = (groupTop + groupBottom) / 2;
        const groupPointsX = [groupLeft, groupCenterX, groupRight];
        const groupPointsY = [groupTop, groupCenterY, groupBottom];

        const pickBestSnap = (points, targets) => {
            let best = null;
            points.forEach((point) => {
                targets.forEach((target) => {
                    const delta = Number(target) - Number(point);
                    const abs = Math.abs(delta);
                    if (abs > threshold) {
                        return;
                    }
                    if (!best || abs < best.abs) {
                        best = {
                            delta,
                            target: Number(target),
                            abs
                        };
                    }
                });
            });
            return best;
        };

        let gridSnapX = null;
        let gridSnapY = null;
        if (snapSettings.gridEnabled) {
            const gridTargetsX = groupPointsX.map((point) => Math.round(point / gridSize) * gridSize);
            const gridTargetsY = groupPointsY.map((point) => Math.round(point / gridSize) * gridSize);
            gridSnapX = pickBestSnap(groupPointsX, gridTargetsX);
            gridSnapY = pickBestSnap(groupPointsY, gridTargetsY);
        }

        let objectSnapX = null;
        let objectSnapY = null;
        if (snapSettings.elementEnabled) {
            const page = getActiveDesignPage();
            const others = Array.isArray(page?.elements)
                ? page.elements.filter((element) => !selectedSet.has(element.id))
                : [];
            if (others.length) {
                const targetPointsX = [];
                const targetPointsY = [];
                others.forEach((element) => {
                    targetPointsX.push(Number(element.x || 0));
                    targetPointsX.push(Number(element.x || 0) + (Number(element.w || DESIGN_MIN_ELEMENT_SIZE) / 2));
                    targetPointsX.push(Number(element.x || 0) + Number(element.w || DESIGN_MIN_ELEMENT_SIZE));
                    targetPointsY.push(Number(element.y || 0));
                    targetPointsY.push(Number(element.y || 0) + (Number(element.h || DESIGN_MIN_ELEMENT_SIZE) / 2));
                    targetPointsY.push(Number(element.y || 0) + Number(element.h || DESIGN_MIN_ELEMENT_SIZE));
                });
                objectSnapX = pickBestSnap(groupPointsX, targetPointsX);
                objectSnapY = pickBestSnap(groupPointsY, targetPointsY);
            }
        }

        const chooseSnap = (gridSnap, objectSnap) => {
            if (gridSnap && objectSnap) {
                return objectSnap.abs <= gridSnap.abs ? objectSnap : gridSnap;
            }
            return objectSnap || gridSnap || null;
        };

        const bestSnapX = chooseSnap(gridSnapX, objectSnapX);
        const bestSnapY = chooseSnap(gridSnapY, objectSnapY);
        if (bestSnapX) {
            shiftX += bestSnapX.delta;
            snapGuideX = bestSnapX.target;
        }
        if (bestSnapY) {
            shiftY += bestSnapY.delta;
            snapGuideY = bestSnapY.target;
        }
    }

    shiftX = clampNumber(shiftX, minShiftX, maxShiftX, shiftX);
    shiftY = clampNumber(shiftY, minShiftY, maxShiftY, shiftY);

    if (shiftX === state.lastShiftX && shiftY === state.lastShiftY) {
        return false;
    }
    state.lastShiftX = shiftX;
    state.lastShiftY = shiftY;
    state.snapGuideX = Number.isFinite(Number(snapGuideX)) ? Number(snapGuideX) : null;
    state.snapGuideY = Number.isFinite(Number(snapGuideY)) ? Number(snapGuideY) : null;

    const movableSet = new Set(movableIds);
    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page) {
            return studio;
        }
        page.elements = page.elements.map((element) => {
            if (!movableSet.has(element.id)) {
                return element;
            }
            const base = startRects[element.id];
            if (!base) {
                return element;
            }
            return sanitizeDesignElement({
                ...element,
                x: Number(base.x) + shiftX,
                y: Number(base.y) + shiftY
            });
        });
        return studio;
    }, {
        refreshPreview: false,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: true
    });
    updateDesignSnapGuides(state.snapGuideX, state.snapGuideY);
    return true;
}

function applyMarqueeSelectionFromDragState() {
    const state = currentContext.designDragState;
    const selectionRect = buildNormalizedCanvasRect(
        Number(state.marqueeStartX || 0),
        Number(state.marqueeStartY || 0),
        Number(state.marqueeEndX || 0),
        Number(state.marqueeEndY || 0)
    );

    withDesignStudioMutation((studio) => {
        const page = studio.pages.find((item) => item.id === studio.selectedPageId) || studio.pages[0] || null;
        if (!page || !page.elements.length) {
            return studio;
        }
        const orderedIds = page.elements.map((item) => item.id);
        const hitIds = page.elements
            .filter((element) => {
                const elementRect = {
                    left: Number(element.x || 0),
                    top: Number(element.y || 0),
                    right: Number(element.x || 0) + Number(element.w || DESIGN_MIN_ELEMENT_SIZE),
                    bottom: Number(element.y || 0) + Number(element.h || DESIGN_MIN_ELEMENT_SIZE)
                };
                return rectIntersects(selectionRect, elementRect);
            })
            .map((element) => element.id);

        const baseSelection = state.marqueeAdditive
            ? (Array.isArray(state.marqueeBaseSelectionIds) ? state.marqueeBaseSelectionIds : [])
                .filter((id) => orderedIds.includes(id))
            : [];

        const selectedSet = new Set(baseSelection);
        if (!state.marqueeAdditive) {
            selectedSet.clear();
        }
        if (state.marqueeAdditive && state.marqueeToggle) {
            hitIds.forEach((id) => {
                if (selectedSet.has(id)) {
                    selectedSet.delete(id);
                } else {
                    selectedSet.add(id);
                }
            });
        } else {
            hitIds.forEach((id) => selectedSet.add(id));
        }

        let orderedSelection = orderedIds.filter((id) => selectedSet.has(id));
        if (!orderedSelection.length) {
            const fallbackId = page.elements[0]?.id || '';
            studio.selectedElementId = fallbackId;
            studio.selectedElementIds = fallbackId ? [fallbackId] : [];
            return studio;
        }

        let primaryId = hitIds.length ? hitIds[hitIds.length - 1] : '';
        if (!primaryId || !orderedSelection.includes(primaryId)) {
            const currentPrimary = String(studio.selectedElementId || '');
            primaryId = orderedSelection.includes(currentPrimary)
                ? currentPrimary
                : orderedSelection[orderedSelection.length - 1];
        }
        studio.selectedElementId = primaryId;
        studio.selectedElementIds = [primaryId, ...orderedSelection.filter((id) => id !== primaryId)];
        return studio;
    }, {
        refreshPreview: false,
        renderSelect: false,
        renderCanvas: true,
        renderInspector: true
    });
}

function initDesignStudioCanvasInteractions() {
    const canvas = document.getElementById('designStudioCanvas');
    if (!canvas) {
        return;
    }

    canvas.addEventListener('pointerdown', (event) => {
        if (!(event instanceof PointerEvent)) {
            return;
        }
        if (event.button !== 0) {
            return;
        }
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const handleNode = target.closest('[data-design-resize-handle]');
        const elementNode = target.closest('[data-design-element-id]');
        const additive = Boolean(event.ctrlKey || event.metaKey || event.shiftKey);
        const toggleModifier = Boolean(event.ctrlKey || event.metaKey);

        if (!(elementNode instanceof HTMLElement)) {
            const pointer = getDesignCanvasPointerCoords(event, canvas);
            hideDesignSnapGuides();
            event.preventDefault();
            currentContext.designDragState.active = true;
            currentContext.designDragState.mode = 'marquee';
            currentContext.designDragState.pointerId = event.pointerId;
            currentContext.designDragState.pageId = String(getActiveDesignPage()?.id || '');
            currentContext.designDragState.elementId = '';
            currentContext.designDragState.pointerStartX = event.clientX;
            currentContext.designDragState.pointerStartY = event.clientY;
            currentContext.designDragState.marqueeStartX = pointer.x;
            currentContext.designDragState.marqueeStartY = pointer.y;
            currentContext.designDragState.marqueeEndX = pointer.x;
            currentContext.designDragState.marqueeEndY = pointer.y;
            currentContext.designDragState.marqueeAdditive = additive;
            currentContext.designDragState.marqueeToggle = toggleModifier;
            currentContext.designDragState.marqueeBaseSelectionIds = additive
                ? getSelectedDesignElementIds()
                : [];
            currentContext.designDragState.moved = false;
            updateDesignMarqueeOverlay(canvas, pointer.x, pointer.y, pointer.x, pointer.y);
            return;
        }

        const elementId = String(elementNode.dataset.designElementId || '');
        if (!elementId) {
            return;
        }

        if (additive && !(handleNode instanceof HTMLElement)) {
            selectDesignElement(elementId, {
                refreshPreview: false,
                additive: true,
                toggle: true
            });
            return;
        }

        const selectedIds = getSelectedDesignElementIds();
        const isAlreadySelected = selectedIds.includes(elementId);
        if (!isAlreadySelected) {
            selectDesignElement(elementId, { refreshPreview: false });
        }

        if (handleNode instanceof HTMLElement) {
            const current = getSelectedDesignElement();
            if (!current || current.locked) {
                return;
            }
            hideDesignSnapGuides();
            event.preventDefault();
            currentContext.designDragState.active = true;
            currentContext.designDragState.mode = 'resize';
            currentContext.designDragState.pointerId = event.pointerId;
            currentContext.designDragState.resizeHandle = String(handleNode.dataset.designResizeHandle || '').toLowerCase();
            currentContext.designDragState.pageId = String(getActiveDesignPage()?.id || '');
            currentContext.designDragState.elementId = current.id;
            currentContext.designDragState.pointerStartX = event.clientX;
            currentContext.designDragState.pointerStartY = event.clientY;
            currentContext.designDragState.elementStartX = current.x;
            currentContext.designDragState.elementStartY = current.y;
            currentContext.designDragState.elementStartW = current.w;
            currentContext.designDragState.elementStartH = current.h;
            currentContext.designDragState.lastShiftX = 0;
            currentContext.designDragState.lastShiftY = 0;
            currentContext.designDragState.moved = false;
            document.querySelectorAll(`#designStudioCanvas [data-design-element-id="${cssEscape(current.id)}"]`).forEach((item) => {
                item.classList.add('is-dragging');
            });
            return;
        }

        const selectedElements = getSelectedDesignElements();
        const hasMovableSelection = selectedElements.some((item) => !item.locked);
        if (!hasMovableSelection) {
            return;
        }
        const startRects = {};
        selectedElements.forEach((element) => {
            startRects[element.id] = {
                x: Number(element.x || 0),
                y: Number(element.y || 0),
                w: Number(element.w || DESIGN_MIN_ELEMENT_SIZE),
                h: Number(element.h || DESIGN_MIN_ELEMENT_SIZE),
                locked: Boolean(element.locked)
            };
        });

        event.preventDefault();
        currentContext.designDragState.active = true;
        currentContext.designDragState.mode = 'move';
        currentContext.designDragState.pointerId = event.pointerId;
        currentContext.designDragState.resizeHandle = '';
        currentContext.designDragState.pageId = String(getActiveDesignPage()?.id || '');
        currentContext.designDragState.elementId = elementId;
        currentContext.designDragState.pointerStartX = event.clientX;
        currentContext.designDragState.pointerStartY = event.clientY;
        currentContext.designDragState.selectionStartRects = startRects;
        currentContext.designDragState.lastShiftX = 0;
        currentContext.designDragState.lastShiftY = 0;
        currentContext.designDragState.moved = false;
        selectedElements
            .filter((element) => !element.locked)
            .forEach((element) => {
                document.querySelectorAll(`#designStudioCanvas [data-design-element-id="${cssEscape(element.id)}"]`).forEach((item) => {
                    item.classList.add('is-dragging');
                });
            });
    });

    window.addEventListener('pointermove', (event) => {
        if (!currentContext.designDragState.active) {
            return;
        }
        if (
            currentContext.designDragState.pointerId !== null
            && Number.isFinite(Number(currentContext.designDragState.pointerId))
            && event.pointerId !== currentContext.designDragState.pointerId
        ) {
            return;
        }
        const dx = event.clientX - currentContext.designDragState.pointerStartX;
        const dy = event.clientY - currentContext.designDragState.pointerStartY;
        const mode = String(currentContext.designDragState.mode || 'move');

        if (mode === 'marquee') {
            hideDesignSnapGuides();
            const pointer = getDesignCanvasPointerCoords(event, canvas);
            currentContext.designDragState.marqueeEndX = pointer.x;
            currentContext.designDragState.marqueeEndY = pointer.y;
            updateDesignMarqueeOverlay(
                canvas,
                currentContext.designDragState.marqueeStartX,
                currentContext.designDragState.marqueeStartY,
                pointer.x,
                pointer.y
            );
            if (Math.abs(pointer.x - currentContext.designDragState.marqueeStartX) >= 3 || Math.abs(pointer.y - currentContext.designDragState.marqueeStartY) >= 3) {
                currentContext.designDragState.moved = true;
            }
            return;
        }

        if (mode === 'resize') {
            const handle = String(currentContext.designDragState.resizeHandle || '');
            if (!handle) {
                hideDesignSnapGuides();
                return;
            }
            const baseRect = resolveResizeRectFromHandle(
                handle,
                dx,
                dy,
                currentContext.designDragState.elementStartX,
                currentContext.designDragState.elementStartY,
                currentContext.designDragState.elementStartW,
                currentContext.designDragState.elementStartH
            );
            const nextRect = applyDesignResizeSnapFromDragState(baseRect, handle);
            const hasChanged = (
                nextRect.x !== Math.round(currentContext.designDragState.elementStartX)
                || nextRect.y !== Math.round(currentContext.designDragState.elementStartY)
                || nextRect.w !== Math.round(currentContext.designDragState.elementStartW)
                || nextRect.h !== Math.round(currentContext.designDragState.elementStartH)
            );
            if (!hasChanged) {
                return;
            }
            currentContext.designDragState.moved = true;
            updateSelectedDesignElementFromInspector({
                x: nextRect.x,
                y: nextRect.y,
                w: nextRect.w,
                h: nextRect.h
            }, {
                renderInspector: true,
                refreshPreview: false
            });
            return;
        }

        const changed = applyDesignMoveFromDragState(dx, dy);
        if (changed && (currentContext.designDragState.lastShiftX !== 0 || currentContext.designDragState.lastShiftY !== 0)) {
            currentContext.designDragState.moved = true;
        }
    });

    window.addEventListener('pointerup', () => {
        if (!currentContext.designDragState.active) {
            return;
        }
        const mode = String(currentContext.designDragState.mode || 'move');
        const moved = Boolean(currentContext.designDragState.moved);
        const additive = Boolean(currentContext.designDragState.marqueeAdditive);
        if (mode === 'marquee') {
            if (moved) {
                applyMarqueeSelectionFromDragState();
            } else if (!additive) {
                reduceDesignSelectionToPrimary();
            }
        }
        resetDesignDragState();
        document.querySelectorAll('#designStudioCanvas .design-element.is-dragging').forEach((item) => {
            item.classList.remove('is-dragging');
        });
        if (moved && mode !== 'marquee') {
            refreshBrandbookPreviewFromBuilder();
        }
    });

    window.addEventListener('pointercancel', () => {
        if (!currentContext.designDragState.active) {
            return;
        }
        resetDesignDragState();
        document.querySelectorAll('#designStudioCanvas .design-element.is-dragging').forEach((item) => {
            item.classList.remove('is-dragging');
        });
    });
}

function exportDesignSceneJson() {
    const studio = sanitizeDesignStudio(currentContext.designStudio);
    if (!studio.pages.length) {
        setStatus('Não há cena para exportar no Design Studio.', 'warn');
        return;
    }
    const payload = {
        schema: DESIGN_STUDIO_SCHEMA,
        exportedAt: new Date().toISOString(),
        source: 'brandmanual_design_studio',
        scene: studio
    };
    downloadText(
        JSON.stringify(payload, null, 2),
        `brandmanual-design-scene-${formatDateForFile(new Date())}.json`,
        'application/json;charset=utf-8'
    );
    setStatus('Cena do Design Studio exportada com sucesso.', 'ok');
}

async function importDesignSceneFile(file) {
    try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const scene = parsed?.scene && typeof parsed.scene === 'object'
            ? parsed.scene
            : parsed;
        const sanitized = sanitizeDesignStudio(scene, { ensurePage: true });
        currentContext.designStudio = sanitized;
        currentContext.designStudioEnabled = true;
        const toggle = document.getElementById('useDesignStudioTemplate');
        if (toggle instanceof HTMLInputElement) {
            toggle.checked = true;
        }
        renderDesignStudioUi();
        refreshBrandbookPreviewFromBuilder();
        setStatus('Cena importada para o Design Studio.', 'ok');
    } catch (error) {
        setStatus('Arquivo de cena inválido. Verifique o JSON.', 'warn');
    }
}

function figmaColorToHex(color, fallback = '#1f2b45') {
    if (!color || typeof color !== 'object') {
        return fallback;
    }
    const r = clampNumber(Number(color.r) * 255, 0, 255, 31);
    const g = clampNumber(Number(color.g) * 255, 0, 255, 43);
    const b = clampNumber(Number(color.b) * 255, 0, 255, 69);
    const alpha = Number(color.a);
    if (Number.isFinite(alpha) && alpha <= 0.02) {
        return '#ffffff';
    }
    return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function collectFigmaFrames(root, namingProfile = buildFigmaNamingProfile()) {
    const frames = [];
    const profile = namingProfile && typeof namingProfile === 'object'
        ? namingProfile
        : buildFigmaNamingProfile();
    const queue = Array.isArray(root?.children) ? root.children.slice() : [];
    while (queue.length) {
        const node = queue.shift();
        if (!node || typeof node !== 'object') {
            continue;
        }
        const type = String(node.type || '').toUpperCase();
        const name = String(node.name || '');
        const shouldIgnore = matchNamingKeywords(name, profile.ignoreKeywords || []).matched;
        if (!shouldIgnore && (type === 'FRAME' || type === 'SECTION')) {
            frames.push(node);
        }
        if (Array.isArray(node.children) && node.children.length) {
            queue.push(...node.children);
        }
    }
    return frames;
}

function flattenFigmaPageNodes(frame, namingProfile = buildFigmaNamingProfile()) {
    const accepted = ['TEXT', 'RECTANGLE', 'ELLIPSE', 'INSTANCE', 'COMPONENT', 'VECTOR', 'IMAGE', 'FRAME', 'GROUP'];
    const profile = namingProfile && typeof namingProfile === 'object'
        ? namingProfile
        : buildFigmaNamingProfile();
    const nodes = [];
    const queue = Array.isArray(frame?.children) ? frame.children.slice() : [];
    while (queue.length && nodes.length < 80) {
        const node = queue.shift();
        if (!node || typeof node !== 'object') {
            continue;
        }
        const type = String(node.type || '').toUpperCase();
        const shouldIgnore = matchNamingKeywords(String(node.name || ''), profile.ignoreKeywords || []).matched;
        if (!shouldIgnore && accepted.includes(type)) {
            nodes.push(node);
        }
        if (Array.isArray(node.children) && node.children.length) {
            queue.push(...node.children);
        }
    }
    return nodes;
}

function getFigmaNodeBounds(node) {
    const box = node?.absoluteBoundingBox || node?.absoluteRenderBounds || null;
    if (box && Number.isFinite(box.x) && Number.isFinite(box.y) && Number.isFinite(box.width) && Number.isFinite(box.height)) {
        return {
            x: box.x,
            y: box.y,
            w: box.width,
            h: box.height
        };
    }
    return null;
}

function detectElementTypeFromFigmaNode(node, namingProfile = buildFigmaNamingProfile()) {
    const type = String(node?.type || '').toUpperCase();
    const name = String(node?.name || '');
    const profile = namingProfile && typeof namingProfile === 'object'
        ? namingProfile
        : buildFigmaNamingProfile();
    const aliases = profile.elementAliases && typeof profile.elementAliases === 'object'
        ? profile.elementAliases
        : {};

    let aliasBestType = '';
    let aliasBestScore = 0;
    DESIGN_ELEMENT_TYPES.forEach((elementType) => {
        const hit = matchNamingKeywords(name, aliases[elementType] || []);
        if (hit.matched && hit.score > aliasBestScore) {
            aliasBestType = elementType;
            aliasBestScore = hit.score;
        }
    });

    if (type === 'TEXT') {
        const fontSize = Number(node?.style?.fontSize || node?.styleOverrideTable?.fontSize || 0);
        if (aliasBestType) {
            return aliasBestType;
        }
        return fontSize >= clampNumber(profile.titleMinSize, 10, 160, 40) ? 'title' : 'text';
    }
    if (aliasBestType) {
        return aliasBestType;
    }

    const normalizedName = normalizeNameForMatching(name);
    if (type === 'ELLIPSE') {
        return 'shape_ellipse';
    }
    if (type === 'LINE') {
        return 'shape_line';
    }
    if (type === 'RECTANGLE') {
        if (normalizedName.includes('round') || normalizedName.includes('arredond')) {
            return 'shape_round_rect';
        }
        if (normalizedName.includes('parallelogram') || normalizedName.includes('paralelogram')) {
            return 'shape_parallelogram';
        }
        if (normalizedName.includes('trapezoid') || normalizedName.includes('trapez')) {
            return 'shape_trapezoid';
        }
        if (normalizedName.includes('diamond') || normalizedName.includes('losango') || normalizedName.includes('rhombus')) {
            return 'shape_diamond';
        }
        return 'shape_rect';
    }
    if (type === 'VECTOR' || type === 'POLYGON') {
        if (normalizedName.includes('triangle') || normalizedName.includes('triangulo')) {
            return 'shape_triangle';
        }
        if (normalizedName.includes('diamond') || normalizedName.includes('losango') || normalizedName.includes('rhombus')) {
            return 'shape_diamond';
        }
        if (normalizedName.includes('pentagon') || normalizedName.includes('pentagono')) {
            return 'shape_pentagon';
        }
        if (normalizedName.includes('hexagon') || normalizedName.includes('hexagono')) {
            return 'shape_hexagon';
        }
        if (normalizedName.includes('octagon') || normalizedName.includes('octogono')) {
            return 'shape_octagon';
        }
        if (normalizedName.includes('star') || normalizedName.includes('estrela')) {
            return 'shape_star';
        }
    }
    if (normalizedName.includes('heart') || normalizedName.includes('coracao')) {
        return 'shape_heart';
    }
    if (normalizedName.includes('cloud') || normalizedName.includes('nuvem')) {
        return 'shape_cloud';
    }
    if (normalizedName.includes('arrow') || normalizedName.includes('seta')) {
        if (normalizedName.includes('left') || normalizedName.includes('esquer')) return 'shape_arrow_left';
        if (normalizedName.includes('up') || normalizedName.includes('cima')) return 'shape_arrow_up';
        if (normalizedName.includes('down') || normalizedName.includes('baixo')) return 'shape_arrow_down';
        return 'shape_arrow_right';
    }
    if (normalizedName.includes('chevron')) {
        if (normalizedName.includes('left') || normalizedName.includes('esquer')) return 'shape_chevron_left';
        return 'shape_chevron_right';
    }
    if (normalizedName.includes('comparison') || normalizedName.includes('compare') || normalizedName.includes('antes') || normalizedName.includes('depois')) {
        return 'comparison_card';
    }
    if (normalizedName.includes('timeline') || normalizedName.includes('step') || normalizedName.includes('etapa')) {
        return 'timeline_step';
    }
    if (normalizedName.includes('quote') || normalizedName.includes('citacao') || normalizedName.includes('testimonial')) {
        return 'quote_block';
    }
    if (normalizedName.includes('info card') || normalizedName.includes('infocard') || normalizedName.includes('content card')) {
        return 'info_card';
    }
    if (normalizedName.includes('divider') || normalizedName.includes('line') || normalizedName.includes('separador')) {
        return 'divider';
    }
    if (normalizedName.includes('button') || normalizedName.includes('cta')) {
        return 'cta_button';
    }
    if (normalizedName.includes('list') || normalizedName.includes('bullet') || normalizedName.includes('check')) {
        return 'bullet_list';
    }
    if (normalizedName.includes('metric') || normalizedName.includes('stat') || normalizedName.includes('kpi')) {
        return 'stat_card';
    }
    if (normalizedName.includes('chip') || normalizedName.includes('tag')) {
        return 'tag_chip';
    }
    if (normalizedName.includes('mockup') || normalizedName.includes('photo') || normalizedName.includes('image')) {
        return 'mockup_slot';
    }
    if (normalizedName.includes('palette') || normalizedName.includes('color')) {
        return 'color_row';
    }
    if (normalizedName.includes('logo')) {
        return 'logo_box';
    }
    return 'shape_rect';
}

function mapFigmaNodeToDesignElement(node, transform, fallbackPos, namingProfile = buildFigmaNamingProfile()) {
    const type = detectElementTypeFromFigmaNode(node, namingProfile);
    const bounds = getFigmaNodeBounds(node);
    const x = bounds ? transform.offsetX + ((bounds.x - transform.minX) * transform.scale) : fallbackPos.x;
    const y = bounds ? transform.offsetY + ((bounds.y - transform.minY) * transform.scale) : fallbackPos.y;
    const w = bounds ? bounds.w * transform.scale : 280;
    const h = bounds ? bounds.h * transform.scale : 90;

    const text = String(node?.characters || node?.name || '').slice(0, 1200);
    const fill = Array.isArray(node?.fills) ? node.fills.find((item) => item?.type === 'SOLID' && item.color) : null;
    const stroke = Array.isArray(node?.strokes) ? node.strokes.find((item) => item?.type === 'SOLID' && item.color) : null;
    const base = createDefaultDesignElement(type, {
        x,
        y,
        w,
        h
    });

    return sanitizeDesignElement({
        ...base,
        text: DESIGN_SHAPE_ONLY_TYPES.includes(type) ? String(node?.name || '') : text,
        fontSize: Number(node?.style?.fontSize || base.fontSize),
        color: figmaColorToHex(node?.style?.fills?.[0]?.color || stroke?.color, base.color),
        bg: figmaColorToHex(fill?.color, base.bg),
        opacity: clampNumber((fill?.opacity ?? 1) * 100, 5, 100, base.opacity),
        radius: clampNumber(Number(node?.cornerRadius), 0, 160, base.radius),
        align: normalizeDesignAlign(node?.style?.textAlignHorizontal, base.align)
    });
}

function parseFigmaJsonToDesignStudio(parsed, namingProfile = buildFigmaNamingProfile()) {
    const profile = namingProfile && typeof namingProfile === 'object'
        ? namingProfile
        : buildFigmaNamingProfile();
    const root = parsed?.document && typeof parsed.document === 'object'
        ? parsed.document
        : (parsed?.nodes && typeof parsed.nodes === 'object'
            ? Object.values(parsed.nodes).find((item) => item && typeof item === 'object' && item.document)?.document
            : null);
    if (!root || typeof root !== 'object') {
        return null;
    }

    const frames = collectFigmaFrames(root, profile);
    if (!frames.length) {
        return null;
    }

    const pages = frames.slice(0, 18).map((frame, index) => {
        const frameName = String(frame.name || `Página ${index + 1}`);
        const moduleId = resolveModuleIdFromTitle(frameName, profile);
        const nodes = flattenFigmaPageNodes(frame, profile);
        const bounds = nodes
            .map((node) => getFigmaNodeBounds(node))
            .filter((box) => box && box.w > 2 && box.h > 2);

        let minX = 0;
        let minY = 0;
        let maxX = DESIGN_CANVAS_WIDTH;
        let maxY = DESIGN_CANVAS_HEIGHT;
        if (bounds.length) {
            minX = Math.min(...bounds.map((box) => box.x));
            minY = Math.min(...bounds.map((box) => box.y));
            maxX = Math.max(...bounds.map((box) => box.x + box.w));
            maxY = Math.max(...bounds.map((box) => box.y + box.h));
        }
        const sourceWidth = Math.max(1, maxX - minX);
        const sourceHeight = Math.max(1, maxY - minY);
        const scale = Math.min(
            (DESIGN_CANVAS_WIDTH - 120) / sourceWidth,
            (DESIGN_CANVAS_HEIGHT - 120) / sourceHeight,
            1
        );
        const transform = {
            minX,
            minY,
            scale,
            offsetX: 60,
            offsetY: 60
        };

        const elements = nodes.slice(0, 36).map((node, nodeIndex) => mapFigmaNodeToDesignElement(
            node,
            transform,
            { x: 80 + (nodeIndex * 10), y: 80 + (nodeIndex * 10) },
            profile
        ));

        if (!elements.length) {
            elements.push(createDefaultDesignElement('title', { text: frameName }));
            elements.push(createDefaultDesignElement('text', { text: '{{project.description}}' }));
        }

        return sanitizeDesignPage({
            id: createLocalUid('page'),
            name: frameName.slice(0, 80),
            moduleId,
            elements
        }, frameName.slice(0, 80));
    });

    return sanitizeDesignStudio({
        schema: FIGMA_IMPORT_SCHEMA,
        source: 'figma',
        pages,
        selectedPageId: pages[0]?.id || '',
        selectedElementId: pages[0]?.elements?.[0]?.id || '',
        selectedElementIds: pages[0]?.elements?.[0]?.id ? [pages[0].elements[0].id] : []
    });
}

async function importDesignStudioFromFigmaFile(file) {
    try {
        const raw = await file.text();
        const parsed = JSON.parse(raw);
        const config = persistFigmaNamingConfigFromForm();
        const profile = buildFigmaNamingProfile(config);
        const studio = parseFigmaJsonToDesignStudio(parsed, profile);
        if (!studio || !studio.pages.length) {
            setStatus('Não foi possível interpretar o JSON do Figma. Verifique se o arquivo contém frames.', 'warn');
            return;
        }
        currentContext.designStudio = studio;
        currentContext.designStudioEnabled = true;
        const toggle = document.getElementById('useDesignStudioTemplate');
        if (toggle instanceof HTMLInputElement) {
            toggle.checked = true;
        }
        renderDesignStudioUi();
        refreshBrandbookPreviewFromBuilder();
        setStatus(`${studio.pages.length} página(s) importada(s) do Figma com preset "${config.presetId}".`, 'ok');
    } catch (error) {
        setStatus('JSON do Figma inválido. Verifique o arquivo importado.', 'warn');
    }
}

function applySmartTemplateStructure() {
    const bookMode = getSelectedBookMode();
    const smartMethod = getSelectedSmartMethod();
    const suggested = getSmartStructureSuggestion(
        smartMethod,
        bookMode,
        currentContext.payload,
        currentContext.displayMockups
    );

    if (bookMode === BOOK_MODE_MINI) {
        const variantField = document.getElementById('customTemplateMiniVariant');
        if (variantField instanceof HTMLSelectElement && normalizeSmartMethod(smartMethod) !== SMART_TEMPLATE_METHOD_DEFAULT) {
            variantField.value = suggestMiniVariantForSmartMethod(smartMethod);
        }
    }

    currentContext.builderStructureIds = ensureStructureForBookMode(suggested, bookMode);
    syncDesignStudioAfterStructureChange();
    renderTemplateBuilder();
    updateMiniGuideVariantFieldState();
    updateTemplateStrategyHint();
    refreshBrandbookPreviewFromBuilder();
    setStatus(`Método inteligente aplicado (${getBookModeLabel(bookMode)}).`, 'ok');
}

function applyMiniGuidePreset(presetId = getSelectedMiniPresetId(), options = {}) {
    const settings = {
        warnIfNone: true,
        ...options
    };
    if (!Object.prototype.hasOwnProperty.call(MINI_GUIDE_PRESETS, presetId)) {
        if (settings.warnIfNone) {
            setStatus('Selecione um preset mini antes de aplicar.', 'warn');
        } else {
            updateTemplateStrategyHint();
        }
        return;
    }

    const definition = MINI_GUIDE_PRESETS[presetId];
    const bookModeField = document.getElementById('customTemplateBookMode');
    const smartMethodField = document.getElementById('customTemplateSmartMethod');
    const miniVariantField = document.getElementById('customTemplateMiniVariant');
    const kickerField = document.getElementById('customTemplateKicker');
    const closingField = document.getElementById('customTemplateClosing');

    if (bookModeField instanceof HTMLSelectElement) {
        bookModeField.value = BOOK_MODE_MINI;
    }
    if (smartMethodField instanceof HTMLSelectElement) {
        smartMethodField.value = normalizeSmartMethod(definition.smartMethod);
    }
    if (miniVariantField instanceof HTMLSelectElement) {
        miniVariantField.value = normalizeMiniGuideVariant(definition.miniGuideVariant);
    }
    if (kickerField instanceof HTMLInputElement) {
        kickerField.value = String(definition.kicker || '').slice(0, 90);
    }
    if (closingField instanceof HTMLInputElement) {
        closingField.value = String(definition.closing || '').slice(0, 180);
    }

    currentContext.builderStructureIds = ensureStructureForBookMode(definition.structure || [], BOOK_MODE_MINI);
    syncDesignStudioAfterStructureChange();
    renderTemplateBuilder();
    updateMiniGuideVariantFieldState();
    updateTemplateStrategyHint();
    refreshBrandbookPreviewFromBuilder();
    setStatus(`Preset mini aplicado: ${getMiniPresetLabel(presetId)}.`, 'ok');
}

function buildDraftPresetFromBuilder() {
    const activePreset = getTemplatePreset(currentContext.activeTemplateId);
    const themeField = document.getElementById('customTemplateTheme');
    const nameField = document.getElementById('customTemplateName');
    const kickerField = document.getElementById('customTemplateKicker');
    const closingField = document.getElementById('customTemplateClosing');

    const requestedThemeKey = String(themeField instanceof HTMLSelectElement ? themeField.value : '');
    const themeKey = Object.prototype.hasOwnProperty.call(TEMPLATE_PRESETS, requestedThemeKey)
        ? requestedThemeKey
        : getThemeKeyFromThemeClass(activePreset.themeClass);
    const themeDef = TEMPLATE_THEME_MAP[themeKey] || TEMPLATE_THEME_MAP[DEFAULT_TEMPLATE_ID];
    const basePreset = TEMPLATE_PRESETS[themeKey] || TEMPLATE_PRESETS[DEFAULT_TEMPLATE_ID];

    const bookMode = getSelectedBookMode();
    const smartMethod = getSelectedSmartMethod();
    const miniGuideVariant = getSelectedMiniGuideVariant();
    const structureIds = ensureStructureForBookMode(
        sanitizeStructureIds(currentContext.builderStructureIds, false, bookMode),
        bookMode
    );
    const layout = buildTemplateLayoutMap(structureIds);
    const designStudio = sanitizeDesignStudio(currentContext.designStudio, { ensurePage: false });
    const savedDesignStudio = designStudio.pages.length ? designStudio : null;
    const useDesignStudioField = document.getElementById('useDesignStudioTemplate');
    const designStudioEnabled = Boolean(
        useDesignStudioField instanceof HTMLInputElement
            ? useDesignStudioField.checked
            : currentContext.designStudioEnabled
    );
    const figmaNamingConfig = persistFigmaNamingConfigFromForm();
    const palettePreset = buildPalettePresetFromBuilder(themeKey, activePreset);

    return normalizePresetCandidate({
        ...activePreset,
        id: activePreset.id,
        name: String(nameField?.value || activePreset.name || 'Template').trim().slice(0, 90) || activePreset.name,
        themeClass: themeDef.themeClass,
        bookMode,
        smartMethod,
        miniGuideVariant,
        kicker: String(kickerField?.value || activePreset.kicker || basePreset.kicker).trim().slice(0, 90) || basePreset.kicker,
        fallbackPalette: palettePreset.fallbackPalette,
        colorOverrideEnabled: palettePreset.colorOverrideEnabled,
        colorOverride: palettePreset.colorOverride,
        closing: String(closingField?.value || activePreset.closing || basePreset.closing).trim().slice(0, 180) || basePreset.closing,
        structure: structureIds.map((moduleId, index) => ({
            id: moduleId,
            label: getBuilderModuleDisplayLabel(moduleId, layout),
            page: index + 1
        })),
        layout,
        designStudio: savedDesignStudio,
        designStudioEnabled,
        figmaNamingConfig
    });
}

function refreshBrandbookPreviewFromBuilder(options = {}) {
    const settings = {
        syncDesignStudioCanvas: true,
        source: 'builder',
        ...options
    };
    if (!currentContext.payload) {
        updatePreviewSyncBadge({
            status: 'warn',
            source: settings.source,
            pages: 0,
            message: 'Sem payload para atualizar o preview.'
        });
        return;
    }

    const practicalSettings = currentContext.practicalSettings || readPracticalSettingsFromForm();
    currentContext.practicalSettings = sanitizePracticalSettings(practicalSettings);
    if (!currentContext.payload.playbook || typeof currentContext.payload.playbook !== 'object') {
        currentContext.payload.playbook = {};
    }
    currentContext.payload.playbook.settings = currentContext.practicalSettings;
    const playbookEvaluation = evaluatePracticalCompleteness(
        currentContext.practicalSettings,
        currentContext.payload,
        currentContext.displayMockups
    );
    currentContext.payload.playbook.applicability = {
        score: playbookEvaluation.score,
        completed: playbookEvaluation.completed,
        total: playbookEvaluation.total
    };
    renderPracticalPlaybook(currentContext.practicalSettings, currentContext.payload, currentContext.displayMockups);

    const draftPreset = buildDraftPresetFromBuilder();
    const sheets = renderBrandbook(currentContext.payload, currentContext.displayMockups, draftPreset, {
        source: settings.source
    });
    applyTemplateMetadata(currentContext.payload, draftPreset, sheets.length);
    renderPayload(currentContext.payload);
    if (settings.syncDesignStudioCanvas) {
        renderDesignStudioUi({
            renderSelect: false,
            renderCanvas: true,
            renderInspector: false
        });
    }
}

function suggestMiniVariantForSmartMethod(method) {
    const normalizedMethod = normalizeSmartMethod(method);
    if (normalizedMethod === 'smart_showcase') {
        return 'social';
    }
    if (normalizedMethod === 'smart_digital') {
        return 'editorial';
    }
    return 'corporate';
}

function syncMiniVariantWithSmartMethod() {
    const variantField = document.getElementById('customTemplateMiniVariant');
    if (!(variantField instanceof HTMLSelectElement)) {
        return;
    }
    if (getSelectedBookMode() !== BOOK_MODE_MINI) {
        return;
    }
    const currentVariant = normalizeMiniGuideVariant(variantField.value);
    const recommended = suggestMiniVariantForSmartMethod(getSelectedSmartMethod());
    if (currentVariant === MINI_GUIDE_VARIANT_DEFAULT) {
        variantField.value = recommended;
    }
}

function updateMiniGuideVariantFieldState() {
    const variantField = document.getElementById('customTemplateMiniVariant');
    const presetField = document.getElementById('miniGuidePreset');
    if (!(variantField instanceof HTMLSelectElement)) {
        return;
    }
    const isMini = getSelectedBookMode() === BOOK_MODE_MINI;
    variantField.disabled = !isMini;
    if (!isMini) {
        variantField.value = MINI_GUIDE_VARIANT_DEFAULT;
        if (presetField instanceof HTMLSelectElement) {
            presetField.value = MINI_GUIDE_PRESET_NONE;
        }
    }
}

function syncMiniPresetFromCurrentState() {
    const presetField = document.getElementById('miniGuidePreset');
    if (!(presetField instanceof HTMLSelectElement)) {
        return;
    }
    const mode = getSelectedBookMode();
    const smartMethod = getSelectedSmartMethod();
    const variant = getSelectedMiniGuideVariant();
    const structure = ensureStructureForBookMode(
        sanitizeStructureIds(currentContext.builderStructureIds, false),
        mode
    );
    presetField.value = detectMiniPresetIdFromConfig(mode, smartMethod, variant, structure);
}

function getSmartStructureSuggestion(method, bookMode, payload, displayMockups) {
    const normalizedMethod = normalizeSmartMethod(method);
    const normalizedMode = normalizeBookMode(bookMode);
    const hasOg = Boolean(payload?.applications?.digital?.og?.available);
    const mockupCount = Array.isArray(displayMockups) ? displayMockups.length : 0;
    const colorCount = Array.isArray(payload?.identity?.colors) ? payload.identity.colors.length : 0;
    const hasTypography = Boolean(
        payload?.identity?.typography?.primaryFontName
        && payload.identity.typography.primaryFontName !== NOT_DEFINED_LABEL
    );

    if (normalizedMethod === 'smart_identity') {
        return normalizedMode === BOOK_MODE_MINI
            ? ['mini_board', 'palette', 'typography', 'logo_system']
            : ['cover', 'index', 'palette', 'typography', 'logo_system', 'playbook', 'closing'];
    }

    if (normalizedMethod === 'smart_showcase') {
        return normalizedMode === BOOK_MODE_MINI
            ? ['mini_board', 'mockups', 'palette', 'closing']
            : ['cover', 'index', 'palette', 'typography', 'mockups', 'digital', 'playbook', 'closing'];
    }

    if (normalizedMethod === 'smart_digital') {
        return normalizedMode === BOOK_MODE_MINI
            ? ['mini_board', 'digital', 'palette', 'closing']
            : ['cover', 'index', 'digital', 'palette', 'mockups', 'playbook', 'closing'];
    }

    if (normalizedMode === BOOK_MODE_MINI) {
        if (hasOg && mockupCount > 0) {
            return ['mini_board', 'palette', 'digital', 'mockups'];
        }
        if (colorCount >= 4 && hasTypography) {
            return ['mini_board', 'palette', 'typography', 'logo_system'];
        }
        return MINI_BRANDBOOK_STRUCTURE.slice();
    }

    if (mockupCount === 0) {
        return ['cover', 'index', 'palette', 'typography', 'logo_system', 'digital', 'playbook', 'closing'];
    }

    return FULL_BRANDBOOK_STRUCTURE.slice();
}

function updateTemplateStrategyHint() {
    const target = document.getElementById('templateStrategyHint');
    if (!target) {
        return;
    }
    const mode = getSelectedBookMode();
    const method = getSelectedSmartMethod();
    const miniVariant = getSelectedMiniGuideVariant();
    const miniPresetId = getSelectedMiniPresetId();
    const structureCount = sanitizeStructureIds(currentContext.builderStructureIds, false).length;

    const methodLabel = method === 'smart_identity'
        ? 'foco identidade'
        : method === 'smart_showcase'
            ? 'foco apresentação'
            : method === 'smart_digital'
                ? 'foco digital'
                : 'auto balanceado';

    const variantSegment = mode === BOOK_MODE_MINI
        ? ` | layout ${getMiniGuideVariantLabel(miniVariant)}`
        : '';
    const presetSegment = mode === BOOK_MODE_MINI && miniPresetId !== MINI_GUIDE_PRESET_NONE
        ? ` | preset ${getMiniPresetLabel(miniPresetId)}`
        : '';
    target.textContent = `Estratégia ativa: ${getBookModeLabel(mode)} | ${methodLabel}${variantSegment}${presetSegment} | ${structureCount} módulo(s).`;
}

function initTemplateBuilderDnD() {
    const builder = document.getElementById('templateBuilder');
    const availableTarget = document.getElementById('availableModules');
    const activeTarget = document.getElementById('activeModules');
    if (!builder || !availableTarget || !activeTarget) {
        return;
    }

    builder.addEventListener('click', (event) => {
        handleBuilderCanvasClick(event);
    });

    builder.addEventListener('dragstart', (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        const chip = target.closest('.module-chip');
        if (!(chip instanceof HTMLElement)) {
            return;
        }
        currentContext.dragState.moduleId = String(chip.dataset.moduleId || '');
        currentContext.dragState.sourceRole = String(chip.dataset.listRole || '');
        currentContext.dragState.sourceIndex = Number.parseInt(String(chip.dataset.index || '-1'), 10);
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', currentContext.dragState.moduleId);
        }
    });

    builder.addEventListener('dragend', () => {
        currentContext.dragState.moduleId = '';
        currentContext.dragState.sourceRole = '';
        currentContext.dragState.sourceIndex = -1;
        availableTarget.classList.remove('is-over');
        activeTarget.classList.remove('is-over');
    });

    [availableTarget, activeTarget].forEach((target) => {
        target.addEventListener('dragover', (event) => {
            event.preventDefault();
            target.classList.add('is-over');
            if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'move';
            }
        });
        target.addEventListener('dragleave', () => {
            target.classList.remove('is-over');
        });
        target.addEventListener('drop', (event) => {
            event.preventDefault();
            target.classList.remove('is-over');
            handleBuilderDrop(target, event);
        });
    });
}

function handleBuilderCanvasClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) {
        return;
    }

    const actionButton = target.closest('[data-builder-action]');
    const block = target.closest('.canvas-block[data-module-id]');
    if (!(block instanceof HTMLElement)) {
        return;
    }

    const moduleId = String(block.dataset.moduleId || '');
    if (!moduleId) {
        return;
    }

    if (actionButton instanceof HTMLButtonElement) {
        event.preventDefault();
        const action = String(actionButton.dataset.builderAction || '');
        if (action === 'move_up') {
            moveBuilderBlock(moduleId, -1);
            return;
        }
        if (action === 'move_down') {
            moveBuilderBlock(moduleId, 1);
            return;
        }
        if (action === 'remove') {
            removeBuilderBlock(moduleId);
            return;
        }
        if (action === 'toggle_span') {
            currentContext.selectedBuilderModuleId = moduleId;
            const currentSpan = getBuilderLayoutForModule(moduleId).span;
            const nextSpan = currentSpan === BUILDER_SPAN_HALF ? BUILDER_SPAN_FULL : BUILDER_SPAN_HALF;
            setBuilderLayoutForModule(moduleId, { span: nextSpan }, {
                rerenderBuilder: false,
                rerenderPreview: true
            });
            syncBuilderCanvasBlock(moduleId);
            renderBuilderInspector();
            return;
        }
    }

    currentContext.selectedBuilderModuleId = moduleId;
    renderTemplateBuilder();
}

function resolveBuilderDropInsertIndex(targetContainer, event, nextIds) {
    const maxIndex = nextIds.length;
    const hoverTarget = event.target instanceof Element
        ? event.target.closest('[data-list-role="active"][data-index]')
        : null;
    if (!(hoverTarget instanceof HTMLElement) || hoverTarget.parentElement !== targetContainer) {
        return maxIndex;
    }

    const rawIndex = Number.parseInt(String(hoverTarget.dataset.index || ''), 10);
    const safeIndex = Number.isFinite(rawIndex) ? rawIndex : maxIndex;
    const pointerX = typeof event.clientX === 'number' ? event.clientX : 0;
    const pointerY = typeof event.clientY === 'number' ? event.clientY : 0;
    const rect = hoverTarget.getBoundingClientRect();
    const centerX = rect.left + (rect.width / 2);
    const centerY = rect.top + (rect.height / 2);
    const nearCenterY = Math.abs(pointerY - centerY) <= Math.max(14, rect.height * 0.2);
    const shouldPlaceAfter = nearCenterY
        ? pointerX > centerX
        : pointerY > centerY;
    const insertAt = safeIndex + (shouldPlaceAfter ? 1 : 0);
    return Math.max(0, Math.min(nextIds.length, insertAt));
}

function handleBuilderDrop(targetContainer, event) {
    const moduleId = String(currentContext.dragState.moduleId || '');
    if (!moduleId) {
        return;
    }

    const targetRole = String(targetContainer.dataset.listRole || '');
    let nextIds = sanitizeStructureIds(currentContext.builderStructureIds, false);
    nextIds = nextIds.filter((id) => id !== moduleId);

    if (targetRole === 'active') {
        const insertAt = resolveBuilderDropInsertIndex(targetContainer, event, nextIds);
        nextIds.splice(insertAt, 0, moduleId);
        currentContext.selectedBuilderModuleId = moduleId;
    } else if (currentContext.selectedBuilderModuleId === moduleId) {
        currentContext.selectedBuilderModuleId = nextIds[0] || '';
    }

    currentContext.builderStructureIds = nextIds;
    syncDesignStudioAfterStructureChange();
    renderTemplateBuilder();
    refreshBrandbookPreviewFromBuilder();
}

function saveCustomTemplateFromBuilder() {
    const nameField = document.getElementById('customTemplateName');
    const themeField = document.getElementById('customTemplateTheme');
    const kickerField = document.getElementById('customTemplateKicker');
    const closingField = document.getElementById('customTemplateClosing');
    const bookMode = getSelectedBookMode();
    const smartMethod = getSelectedSmartMethod();
    const miniGuideVariant = getSelectedMiniGuideVariant();

    const name = String(nameField?.value || '').trim();
    if (!name) {
        setStatus('Defina um nome para salvar o template custom.', 'warn');
        return;
    }

    const structureIds = ensureStructureForBookMode(
        sanitizeStructureIds(currentContext.builderStructureIds, false),
        bookMode
    );
    if (structureIds.length < 3) {
        setStatus('Adicione pelo menos 3 módulos na estrutura para salvar o template.', 'warn');
        return;
    }

    const themeKey = String(themeField?.value || DEFAULT_TEMPLATE_ID);
    const baseThemeKey = Object.prototype.hasOwnProperty.call(TEMPLATE_PRESETS, themeKey) ? themeKey : DEFAULT_TEMPLATE_ID;
    const basePreset = TEMPLATE_PRESETS[baseThemeKey];
    const themeDef = TEMPLATE_THEME_MAP[baseThemeKey];

    const activePreset = getTemplatePreset(currentContext.activeTemplateId);
    const shouldUpdateCurrent = Boolean(activePreset.custom && activePreset.id);
    const templateId = shouldUpdateCurrent ? activePreset.id : buildCustomTemplateId(name);
    const layout = buildTemplateLayoutMap(structureIds);
    const designStudio = sanitizeDesignStudio(currentContext.designStudio, { ensurePage: false });
    const savedDesignStudio = designStudio.pages.length ? designStudio : null;
    const useDesignStudioField = document.getElementById('useDesignStudioTemplate');
    const designStudioEnabled = Boolean(
        useDesignStudioField instanceof HTMLInputElement
            ? useDesignStudioField.checked
            : currentContext.designStudioEnabled
    );
    const figmaNamingConfig = persistFigmaNamingConfigFromForm();
    const palettePreset = buildPalettePresetFromBuilder(baseThemeKey, activePreset);

    const customTemplate = {
        id: templateId,
        name: name.slice(0, 90),
        custom: true,
        themeClass: themeDef.themeClass,
        bookMode,
        smartMethod,
        miniGuideVariant,
        kicker: String(kickerField?.value || basePreset.kicker).trim().slice(0, 90) || basePreset.kicker,
        fallbackPalette: palettePreset.fallbackPalette,
        colorOverrideEnabled: palettePreset.colorOverrideEnabled,
        colorOverride: palettePreset.colorOverride,
        closing: String(closingField?.value || basePreset.closing).trim().slice(0, 180) || basePreset.closing,
        structure: structureIds.map((moduleId, index) => ({
            id: moduleId,
            label: getBuilderModuleDisplayLabel(moduleId, layout),
            page: index + 1
        })),
        layout,
        designStudio: savedDesignStudio,
        designStudioEnabled,
        figmaNamingConfig
    };

    currentContext.customTemplates[templateId] = customTemplate;
    persistCustomTemplates();
    syncCustomTemplateCards();

    setActiveTemplate(templateId, {
        persist: true,
        rerender: true,
        announce: false
    });

    setStatus(`Template custom "${customTemplate.name}" salvo com sucesso.`, 'ok');
}

function removeActiveCustomTemplate() {
    const activePreset = getTemplatePreset(currentContext.activeTemplateId);
    if (!activePreset.custom || !activePreset.id) {
        setStatus('Selecione um template custom para remover.', 'warn');
        return;
    }

    createTemplateBackupSnapshot('pre_remove_template');
    delete currentContext.customTemplates[activePreset.id];
    persistCustomTemplates();
    syncCustomTemplateCards();

    setActiveTemplate(DEFAULT_TEMPLATE_ID, {
        persist: true,
        rerender: true,
        announce: false
    });

    setStatus('Template custom removido com sucesso.', 'ok');
}

function duplicateActiveTemplate() {
    const sourcePreset = getTemplatePreset(currentContext.activeTemplateId);
    if (!sourcePreset || typeof sourcePreset !== 'object') {
        setStatus('Não foi possível duplicar o template ativo.', 'warn');
        return;
    }

    const structureIds = getTemplateStructureIdsFromPreset(sourcePreset);
    const themeKey = getThemeKeyFromThemeClass(sourcePreset.themeClass);
    const themeDef = TEMPLATE_THEME_MAP[themeKey] || TEMPLATE_THEME_MAP[DEFAULT_TEMPLATE_ID];
    const basePreset = TEMPLATE_PRESETS[themeKey] || TEMPLATE_PRESETS[DEFAULT_TEMPLATE_ID];

    const desiredName = `${String(sourcePreset.name || 'Template')} Copy`;
    const templateName = buildUniqueCustomTemplateName(desiredName);
    const templateId = buildCustomTemplateId(templateName);
    const fallbackPalette = normalizeTemplatePalette(sourcePreset.fallbackPalette, basePreset.fallbackPalette);
    const colorOverrideEnabled = Boolean(sourcePreset.colorOverrideEnabled);
    const colorOverride = normalizeTemplatePalette(sourcePreset.colorOverride, fallbackPalette);
    const layout = resolveTemplateLayoutMap(sourcePreset, structureIds);
    const designStudio = sanitizeDesignStudio(sourcePreset.designStudio, { ensurePage: false });
    const savedDesignStudio = designStudio.pages.length ? designStudio : null;
    const designStudioEnabled = Boolean(sourcePreset.designStudioEnabled && savedDesignStudio);
    const figmaNamingConfig = sanitizeFigmaNamingConfig(sourcePreset.figmaNamingConfig);

    const duplicatedTemplate = {
        id: templateId,
        name: templateName,
        custom: true,
        themeClass: themeDef.themeClass,
        bookMode: resolveTemplateBookMode(sourcePreset),
        smartMethod: resolveTemplateSmartMethod(sourcePreset),
        miniGuideVariant: resolveTemplateMiniGuideVariant(sourcePreset),
        kicker: String(sourcePreset.kicker || basePreset.kicker).trim().slice(0, 90) || basePreset.kicker,
        fallbackPalette,
        colorOverrideEnabled,
        colorOverride,
        closing: String(sourcePreset.closing || basePreset.closing).trim().slice(0, 180) || basePreset.closing,
        structure: structureIds.map((moduleId, index) => ({
            id: moduleId,
            label: getBuilderModuleDisplayLabel(moduleId, layout),
            page: index + 1
        })),
        layout,
        designStudio: savedDesignStudio,
        designStudioEnabled,
        figmaNamingConfig
    };

    currentContext.customTemplates[templateId] = duplicatedTemplate;
    persistCustomTemplates();
    syncCustomTemplateCards();

    setActiveTemplate(templateId, {
        persist: true,
        rerender: true,
        announce: false
    });

    setStatus(`Template duplicado: "${duplicatedTemplate.name}".`, 'ok');
}

function exportCustomTemplatesJson() {
    const templates = Object.values(currentContext.customTemplates)
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pt-BR'));

    if (!templates.length) {
        setStatus('Não há templates custom para exportar.', 'warn');
        return;
    }

    const payload = {
        schema: BRAND_MANUAL_CUSTOM_TEMPLATE_EXPORT_SCHEMA,
        exportedAt: new Date().toISOString(),
        source: 'brandmanual_template_studio',
        count: templates.length,
        templates
    };

    downloadText(
        JSON.stringify(payload, null, 2),
        `brandmanual-templates-custom-${formatDateForFile(new Date())}.json`,
        'application/json;charset=utf-8'
    );

    setStatus(`${templates.length} template(s) custom exportado(s).`, 'ok');
}

function createTemplateBackupSnapshot(reason = 'manual_backup') {
    const payload = {
        schema: BRAND_MANUAL_CUSTOM_TEMPLATE_BACKUP_SCHEMA,
        savedAt: new Date().toISOString(),
        reason: String(reason || 'manual_backup'),
        source: 'brandmanual_template_studio',
        count: Object.keys(currentContext.customTemplates || {}).length,
        templates: currentContext.customTemplates
    };

    if (typeof localStorage === 'undefined') {
        return null;
    }

    try {
        localStorage.setItem(BRAND_MANUAL_CUSTOM_TEMPLATE_BACKUP_KEY, JSON.stringify(payload));
        updateBackupUiState(payload);
        return payload;
    } catch (error) {
        return null;
    }
}

function readTemplateBackupSnapshot() {
    const parsed = readStorageJson(BRAND_MANUAL_CUSTOM_TEMPLATE_BACKUP_KEY, null);
    if (!parsed || typeof parsed !== 'object') {
        return null;
    }

    if (String(parsed.schema || '') !== BRAND_MANUAL_CUSTOM_TEMPLATE_BACKUP_SCHEMA) {
        return null;
    }

    const templates = parsed.templates && typeof parsed.templates === 'object'
        ? parsed.templates
        : {};

    return {
        schema: BRAND_MANUAL_CUSTOM_TEMPLATE_BACKUP_SCHEMA,
        savedAt: String(parsed.savedAt || ''),
        reason: String(parsed.reason || 'manual_backup'),
        source: String(parsed.source || 'brandmanual_template_studio'),
        count: Number(parsed.count || Object.keys(templates).length),
        templates
    };
}

function updateBackupUiState(snapshot = null) {
    const backup = snapshot && typeof snapshot === 'object'
        ? snapshot
        : readTemplateBackupSnapshot();
    const meta = document.getElementById('templateBackupMeta');
    const restoreBtn = document.getElementById('restoreTemplateBackupBtn');
    const downloadBtn = document.getElementById('downloadTemplateBackupBtn');

    const hasBackup = Boolean(backup && backup.templates && typeof backup.templates === 'object');
    const itemCount = hasBackup ? Object.keys(backup.templates).length : 0;

    if (meta) {
        if (!hasBackup) {
            meta.textContent = 'Backup: nenhum snapshot salvo.';
        } else {
            const dateLabel = backup.savedAt ? formatDate(backup.savedAt) : '-';
            meta.textContent = `Backup: ${itemCount} template(s) | ${dateLabel} | motivo: ${backup.reason}`;
        }
    }

    if (restoreBtn) {
        restoreBtn.disabled = !hasBackup || itemCount === 0;
    }
    if (downloadBtn) {
        downloadBtn.disabled = !hasBackup || itemCount === 0;
    }
}

function createManualTemplateBackup() {
    if (!Object.keys(currentContext.customTemplates || {}).length) {
        setStatus('Não há templates custom para backup.', 'warn');
        return;
    }
    const snapshot = createTemplateBackupSnapshot('manual_backup');
    if (!snapshot) {
        setStatus('Falha ao salvar backup local.', 'warn');
        return;
    }
    setStatus('Backup de templates custom criado com sucesso.', 'ok');
}

function restoreTemplateBackup() {
    const backup = readTemplateBackupSnapshot();
    if (!backup || !backup.templates || typeof backup.templates !== 'object') {
        setStatus('Nenhum backup disponível para restaurar.', 'warn');
        return;
    }

    const hasTemplates = Object.keys(backup.templates).length > 0;
    if (!hasTemplates) {
        setStatus('Backup encontrado, mas sem templates para restaurar.', 'warn');
        return;
    }

    const confirmed = window.confirm('Restaurar backup irá substituir os templates custom atuais. Deseja continuar?');
    if (!confirmed) {
        setStatus('Restauração de backup cancelada.', 'warn');
        return;
    }

    const nextMap = {};
    Object.entries(backup.templates).forEach(([id, template]) => {
        const sanitized = sanitizeCustomTemplate(id, template);
        if (sanitized) {
            nextMap[sanitized.id] = sanitized;
        }
    });

    if (!Object.keys(nextMap).length) {
        setStatus('Backup inválido: nenhum template restaurável.', 'warn');
        return;
    }

    currentContext.customTemplates = nextMap;
    persistCustomTemplates();
    syncCustomTemplateCards();

    const firstId = Object.keys(nextMap)[0] || DEFAULT_TEMPLATE_ID;
    setActiveTemplate(firstId, {
        persist: true,
        rerender: true,
        announce: false
    });

    setStatus(`Backup restaurado com ${Object.keys(nextMap).length} template(s).`, 'ok');
}

function downloadTemplateBackupJson() {
    const backup = readTemplateBackupSnapshot();
    if (!backup || !backup.templates || !Object.keys(backup.templates).length) {
        setStatus('Nenhum backup disponível para download.', 'warn');
        return;
    }

    downloadText(
        JSON.stringify(backup, null, 2),
        `brandmanual-templates-backup-${formatDateForFile(new Date())}.json`,
        'application/json;charset=utf-8'
    );
    setStatus('Backup exportado com sucesso.', 'ok');
}

async function importCustomTemplatesFromFile(file, mode = 'merge') {
    if (!(file instanceof File)) {
        setStatus('Arquivo de importação inválido.', 'warn');
        return;
    }
    const importMode = mode === 'overwrite' ? 'overwrite' : 'merge';

    let rawContent = '';
    try {
        rawContent = await file.text();
    } catch (error) {
        setStatus('Falha ao ler o arquivo de importação.', 'warn');
        return;
    }

    let parsed = null;
    try {
        parsed = JSON.parse(rawContent);
    } catch (error) {
        setStatus('JSON inválido. Verifique o arquivo de templates.', 'warn');
        return;
    }

    const candidates = collectImportedTemplateCandidates(parsed);
    if (!candidates.length) {
        setStatus('Nenhum template custom válido foi encontrado no arquivo.', 'warn');
        return;
    }

    if (importMode === 'overwrite' && Object.keys(currentContext.customTemplates).length) {
        createTemplateBackupSnapshot('pre_overwrite_import');
    }

    const nextMap = importMode === 'overwrite'
        ? {}
        : { ...currentContext.customTemplates };

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let lastImportedTemplateId = '';

    candidates.forEach((candidate, index) => {
        if (!candidate || typeof candidate !== 'object') {
            skippedCount += 1;
            return;
        }

        const rawName = String(candidate.name || '').trim();
        const safeName = rawName || `Template Importado ${index + 1}`;
        const resolvedId = resolveImportedTemplateId(candidate.id, safeName, nextMap, {
            allowExisting: importMode === 'merge'
        });

        const sanitized = sanitizeCustomTemplate(resolvedId, {
            ...candidate,
            name: safeName
        });

        if (!sanitized) {
            skippedCount += 1;
            return;
        }

        if (Object.prototype.hasOwnProperty.call(nextMap, sanitized.id)) {
            updatedCount += 1;
        } else {
            createdCount += 1;
        }

        nextMap[sanitized.id] = sanitized;
        lastImportedTemplateId = sanitized.id;
    });

    if (!createdCount && !updatedCount) {
        setStatus('Importação concluída sem templates aproveitáveis.', 'warn');
        return;
    }

    currentContext.customTemplates = nextMap;
    persistCustomTemplates();
    syncCustomTemplateCards();

    if (lastImportedTemplateId) {
        setActiveTemplate(lastImportedTemplateId, {
            persist: true,
            rerender: true,
            announce: false
        });
    } else {
        renderTemplateBuilder();
    }

    const detail = skippedCount ? ` (${skippedCount} ignorado(s)).` : '.';
    const modeLabel = importMode === 'overwrite' ? 'sobrescrever' : 'mesclar';
    setStatus(`Importação (${modeLabel}) concluída: ${createdCount} novo(s), ${updatedCount} atualizado(s)${detail}`, 'ok');
}

function collectImportedTemplateCandidates(parsed) {
    if (Array.isArray(parsed)) {
        return parsed;
    }

    if (!parsed || typeof parsed !== 'object') {
        return [];
    }

    if (Array.isArray(parsed.templates)) {
        return parsed.templates;
    }

    if (parsed.templates && typeof parsed.templates === 'object') {
        return Object.entries(parsed.templates).map(([id, template]) => ({
            ...(template && typeof template === 'object' ? template : {}),
            id: template && typeof template === 'object' && template.id ? template.id : id
        }));
    }

    if (parsed.customTemplates && typeof parsed.customTemplates === 'object') {
        return Object.entries(parsed.customTemplates).map(([id, template]) => ({
            ...(template && typeof template === 'object' ? template : {}),
            id: template && typeof template === 'object' && template.id ? template.id : id
        }));
    }

    return Object.entries(parsed)
        .filter(([id, template]) => String(id).startsWith(CUSTOM_TEMPLATE_ID_PREFIX) && template && typeof template === 'object')
        .map(([id, template]) => ({
            ...template,
            id: template.id || id
        }));
}

function normalizeCustomTemplateId(rawId) {
    const normalized = String(rawId || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (!normalized.startsWith(CUSTOM_TEMPLATE_ID_PREFIX)) {
        return '';
    }

    const suffix = normalized
        .slice(CUSTOM_TEMPLATE_ID_PREFIX.length)
        .replace(/_/g, '-')
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40);

    if (!suffix) {
        return '';
    }

    return `${CUSTOM_TEMPLATE_ID_PREFIX}${suffix}`;
}

function resolveImportedTemplateId(rawId, name, occupiedMap = null, options = {}) {
    const map = occupiedMap && typeof occupiedMap === 'object'
        ? occupiedMap
        : currentContext.customTemplates;
    const allowExisting = Boolean(options.allowExisting);
    const normalizedId = normalizeCustomTemplateId(rawId);
    if (normalizedId && (allowExisting || !Object.prototype.hasOwnProperty.call(map, normalizedId))) {
        return normalizedId;
    }

    if (normalizedId) {
        let cursor = 2;
        let candidate = `${normalizedId}-${cursor}`;
        while (Object.prototype.hasOwnProperty.call(map, candidate)) {
            cursor += 1;
            candidate = `${normalizedId}-${cursor}`;
        }
        return candidate;
    }

    return buildCustomTemplateId(name || 'Template Importado', map);
}

function buildUniqueCustomTemplateName(baseName) {
    const normalizedBase = String(baseName || 'Template Custom').trim().slice(0, 90) || 'Template Custom';
    const used = new Set(
        Object.values(currentContext.customTemplates)
            .map((item) => String(item.name || '').trim().toLowerCase())
            .filter(Boolean)
    );

    if (!used.has(normalizedBase.toLowerCase())) {
        return normalizedBase;
    }

    let cursor = 2;
    while (cursor < 500) {
        const candidate = `${normalizedBase} ${cursor}`.slice(0, 90);
        if (!used.has(candidate.toLowerCase())) {
            return candidate;
        }
        cursor += 1;
    }

    return `${normalizedBase} ${Date.now().toString().slice(-4)}`.slice(0, 90);
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
    currentContext.practicalSettings = sanitizePracticalSettings(
        context.payload?.playbook?.settings || currentContext.practicalSettings || loadPracticalSettings()
    );
    writePracticalSettingsToForm(currentContext.practicalSettings);
    renderPracticalPlaybook(currentContext.practicalSettings, context.payload, context.displayMockups);

    renderSummary(context.payload, context.displayMockups);
    renderProject(context.payload.identity.project);
    renderPalette(context.payload.identity.colors);
    renderTypography(context.payload.identity.typography);
    renderOg(context.payload.applications.digital.og);
    renderMockups(context.displayMockups);
    renderNotes(context.payload.integrationNotes || []);

    const preset = getTemplatePreset(currentContext.activeTemplateId);
    const sheets = renderBrandbook(context.payload, context.displayMockups, preset.id, {
        source: context.fromCache ? 'manual_cache' : 'manual_refresh'
    });
    applyTemplateMetadata(context.payload, preset, sheets.length);

    persistLatestManualPayload(context.payload);
    renderPayload(context.payload);

    if (context.fromCache) {
        updatePreviewSyncBadge({
            status: 'warn',
            source: 'manual_cache',
            pages: sheets.length,
            message: 'Preview montado com dados de cache local.'
        });
        setStatus('Manual carregado do cache local. Atualize as ferramentas para obter dados mais recentes.', 'warn');
        return;
    }

    const issues = context.payload.integrationNotes.filter((note) => note.level === 'warn').length;
    if (issues > 0) {
        updatePreviewSyncBadge({
            status: 'warn',
            source: 'manual_refresh',
            pages: sheets.length,
            message: `${issues} alerta(s) de integração detectado(s).`
        });
        setStatus(`Manual atualizado com ${issues} alerta(s) de integração.`, 'warn');
        return;
    }
    setStatus('Manual consolidado com sucesso.', 'ok');
}

function applyTemplateMetadata(payload, preset, generatedSheets) {
    if (!payload || typeof payload !== 'object') {
        return;
    }

    const bookMode = resolveTemplateBookMode(preset);
    const smartMethod = resolveTemplateSmartMethod(preset);
    const miniGuideVariant = resolveTemplateMiniGuideVariant(preset);
    const structureIds = getTemplateStructureIdsFromPreset(preset);
    const layoutMap = resolveTemplateLayoutMap(preset, structureIds);
    const designStudio = sanitizeDesignStudio(preset?.designStudio, { ensurePage: false });
    const figmaNamingConfig = sanitizeFigmaNamingConfig(preset?.figmaNamingConfig || currentContext.figmaNamingConfig);

    payload.template = {
        id: preset.id,
        name: preset.name,
        themeClass: preset.themeClass,
        bookMode,
        bookModeLabel: getBookModeLabel(bookMode),
        smartMethod,
        miniGuideVariant,
        miniGuideVariantLabel: getMiniGuideVariantLabel(miniGuideVariant),
        generatedSheets: Number.isFinite(generatedSheets) ? generatedSheets : 0,
        designStudioEnabled: Boolean(preset?.designStudioEnabled && designStudio.pages.length),
        layout: layoutMap,
        designStudio: designStudio.pages.length ? designStudio : null,
        figmaNamingConfig,
        structure: structureIds.map((moduleId, index) => ({
            id: moduleId,
            label: getBuilderModuleDisplayLabel(moduleId, layoutMap),
            note: getBuilderLayoutForModule(moduleId, layoutMap).note,
            span: getBuilderLayoutForModule(moduleId, layoutMap).span,
            page: index + 1
        }))
    };
}

function applyInlineStyleDataset(root) {
    if (!root) {
        return;
    }

    root.querySelectorAll('[data-inline-style]').forEach((element) => {
        const raw = String(element.getAttribute('data-inline-style') || '').trim();
        if (!raw) {
            return;
        }

        raw.split(';').forEach((chunk) => {
            const declaration = chunk.trim();
            if (!declaration) {
                return;
            }
            const separator = declaration.indexOf(':');
            if (separator <= 0) {
                return;
            }
            const prop = declaration.slice(0, separator).trim();
            const value = declaration.slice(separator + 1).trim();
            if (!prop || !value) {
                return;
            }
            element.style.setProperty(prop, value);
        });
    });

    root.querySelectorAll('[data-color]').forEach((element) => {
        const color = String(element.getAttribute('data-color') || '').trim();
        if (!color) {
            return;
        }
        element.style.backgroundColor = color;
    });
}

function renderBrandbook(payload, displayMockups, templateRef, options = {}) {
    const settings = {
        source: 'render',
        syncBadge: true,
        ...options
    };
    const target = document.getElementById('brandbookPreview');
    if (!target) {
        return [];
    }

    if (!payload || typeof payload !== 'object') {
        target.innerHTML = '<p class="muted">Sem payload consolidado para gerar o brandbook.</p>';
        if (settings.syncBadge) {
            updatePreviewSyncBadge({
                status: 'warn',
                source: settings.source,
                pages: 0,
                message: 'Render interrompido: payload indisponivel.'
            });
        }
        return [];
    }

    const preset = typeof templateRef === 'object' && templateRef !== null
        ? normalizePresetCandidate(templateRef)
        : getTemplatePreset(templateRef);
    const sheets = createBrandbookSheets(payload, displayMockups, preset);
    const totalPages = sheets.length;

    target.innerHTML = sheets
        .map((sheet, index) => renderBrandbookSheet(sheet, preset, index + 1, totalPages))
        .join('');
    applyInlineStyleDataset(target);

    const panelBadge = document.getElementById('brandbookPagesBadge');
    if (panelBadge) {
        panelBadge.textContent = `${totalPages} páginas | ${getBookModeLabel(resolveTemplateBookMode(preset))}`;
    }

    currentContext.brandbookSheets = sheets;
    if (settings.syncBadge) {
        updatePreviewSyncBadge({
            status: 'ok',
            source: settings.source,
            pages: totalPages,
            message: 'Preview sincronizado com os dados atuais.'
        });
    }
    return sheets;
}

function createBrandbookSheets(payload, displayMockups, preset) {
    const project = payload?.identity?.project || {};
    const colors = resolveTemplateColors(payload?.identity?.colors, preset);
    const typography = payload?.identity?.typography || {};
    const og = payload?.applications?.digital?.og || {};
    const notes = Array.isArray(payload?.integrationNotes) ? payload.integrationNotes : [];
    const playbookSettings = sanitizePracticalSettings(
        currentContext.practicalSettings || payload?.playbook?.settings || loadPracticalSettings()
    );
    const playbookEvaluation = evaluatePracticalCompleteness(playbookSettings, payload, displayMockups);
    const bookMode = resolveTemplateBookMode(preset);
    const smartMethod = resolveTemplateSmartMethod(preset);
    const miniGuideVariant = resolveTemplateMiniGuideVariant(preset);
    const structureIds = resolveOutputStructureIds(preset, payload, displayMockups);
    const layoutMap = resolveTemplateLayoutMap(preset, structureIds);
    const designStudio = sanitizeDesignStudio(preset?.designStudio, { ensurePage: false });

    if (designStudio.pages.length && Boolean(preset?.designStudioEnabled)) {
        return createBrandbookSheetsFromDesignStudio(
            payload,
            displayMockups,
            preset,
            designStudio,
            colors
        );
    }

    const normalizedTag = normalizeTag(project.mainTag);
    const supportTags = Array.isArray(project.supportingTags)
        ? project.supportingTags.map((tag) => normalizeTag(tag)).filter(Boolean)
        : [];

    const selectedMockups = Array.isArray(displayMockups) ? displayMockups.slice(0, 6) : [];
    const totalMockups = Array.isArray(displayMockups) ? displayMockups.length : 0;

    const indexRows = structureIds.map((moduleId, index) => (
        `<span>${escapeHtml(getBuilderModuleDisplayLabel(moduleId, layoutMap))}</span><strong>${String(index + 1).padStart(2, '0')}</strong>`
    )).join('');

    const coverSubtitle = supportTags.length
        ? supportTags.join(' | ')
        : '#identidade | #brandbook | #manual';

    const allSheets = [
        {
            id: 'cover',
            label: 'Capa',
            kicker: preset.kicker,
            title: project.title || 'Projeto sem título',
            text: project.description || 'Manual de marca consolidado para uso interno e aprovação.',
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
            id: 'mini_board',
            label: 'Mini Guide',
            kicker: 'Mini Brand Guide',
            title: project.title || 'Mini Brand Guide',
            text: 'Painel resumido para apresentar logos, tipografia e cores essenciais.',
            contentHtml: buildMiniGuideContent({
                projectTitle: project.title || 'Brand',
                presetName: preset.name,
                colors,
                typography,
                smartMethod,
                miniGuideVariant,
                bookMode
            })
        },
        {
            id: 'index',
            label: 'Índice',
            kicker: 'Estrutura do Manual',
            title: 'Índice de Páginas',
            text: 'Sequência pronta para revisão e apresentação rápida de brandbook.',
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
            kicker: 'Sistema Tipográfico',
            title: 'Typography',
            text: 'Combinação principal definida para títulos, textos e elementos de apoio.',
            contentHtml: `
                <div class="sheet-duo">
                    <article class="sheet-font-card">
                        <small>Fonte principal</small>
                        <div class="sheet-font-name">${escapeHtml(typography.primaryFontName || 'Não definido')}</div>
                        <p class="sheet-text">Uso recomendado para títulos e destaques.</p>
                    </article>
                    <article class="sheet-font-card">
                        <small>Fonte secundária</small>
                        <div class="sheet-font-name">${escapeHtml(typography.secondaryFontName || 'Não definido')}</div>
                        <p class="sheet-text">Uso recomendado para textos corridos e informativos.</p>
                    </article>
                </div>
                <article class="sheet-box">
                    <small>Pairing e tom</small>
                    <p class="sheet-text">Pairing: ${escapeHtml(typography.pairingStyle || 'Não definido')}</p>
                    <p class="sheet-text">Tom: ${escapeHtml(typography.tone || 'Não definido')}</p>
                </article>
            `
        },
        {
            id: 'logo_system',
            label: 'Logo',
            kicker: 'Regras de Marca',
            title: 'Logo System',
            text: 'Parâmetros para uso consistente do logotipo nas principais aplicações.',
            contentHtml: `
                <div class="sheet-duo">
                    <article class="sheet-box">
                        <small>Área de proteção</small>
                        <p class="sheet-text">Manter respiro mínimo proporcional à altura do símbolo.</p>
                    </article>
                    <article class="sheet-box">
                        <small>Tamanho mínimo</small>
                        <p class="sheet-text">Aplicação digital sugerida com no mínimo 32px de altura.</p>
                    </article>
                </div>
                <ul class="sheet-list">
                    <li>Evitar distorções, rotações e alterações de proporção.</li>
                    <li>Preservar contraste sobre fundos claros e escuros.</li>
                    <li>Usar variações cromáticas aprovadas no sistema de cores.</li>
                </ul>
            `
        },
        {
            id: 'mockups',
            label: 'Aplicações',
            kicker: 'Mockups Consolidados',
            title: 'Aplicações Visuais',
            text: totalMockups > 0
                ? `${totalMockups} mockup(s) localizado(s) na sessão atual.`
                : 'Nenhum mockup salvo na sessão atual.',
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
                ? 'Parâmetros de OG consolidados para publicações e compartilhamentos.'
                : 'Diretriz OG não encontrada nesta sessão.',
            contentHtml: `
                <div class="sheet-duo">
                    <article class="sheet-box">
                        <small>Status OG</small>
                        <p class="sheet-text">${escapeHtml(og.available ? 'Configurado' : 'Pendente')}</p>
                        <p class="sheet-text">Template: ${escapeHtml(og.template || 'Não definido')}</p>
                        <p class="sheet-text">Marca: ${escapeHtml(og.brand || 'Não definido')}</p>
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
            id: 'playbook',
            label: 'Playbook',
            kicker: 'Aplicação no Trabalho',
            title: 'Playbook de Execução',
            text: `Aplicabilidade atual: ${playbookEvaluation.score}% (${playbookEvaluation.completed}/${playbookEvaluation.total} checks).`,
            contentHtml: buildPlaybookSheetContent(playbookSettings, playbookEvaluation)
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

    const byId = new Map(allSheets.map((sheet) => [sheet.id, sheet]));
    const ordered = [];

    structureIds.forEach((moduleId) => {
        const sheet = byId.get(moduleId);
        if (sheet) {
            ordered.push(sheet);
        }
    });

    const shouldAppendMissing = !Boolean(preset?.custom) && bookMode === BOOK_MODE_COMPLETE;
    if (shouldAppendMissing) {
        const appendOrder = getDefaultStructureIds(BOOK_MODE_COMPLETE);
        appendOrder.forEach((moduleId) => {
            const sheet = byId.get(moduleId);
            if (sheet && !ordered.some((item) => item.id === sheet.id)) {
                ordered.push(sheet);
            }
        });
    }

    return ordered;
}

function createBrandbookSheetsFromDesignStudio(payload, displayMockups, preset, designStudio, colors) {
    const pages = Array.isArray(designStudio?.pages) ? designStudio.pages : [];
    const safePages = pages.length
        ? pages
        : createDesignStudioFromStructure(resolveOutputStructureIds(preset, payload, displayMockups)).pages;
    const project = payload?.identity?.project || {};
    const sheets = safePages.map((page, index) => {
        const moduleLabel = page.moduleId ? getModuleLabelById(page.moduleId) : 'Página Custom';
        const titleElement = page.elements.find((item) => item.type === 'title') || null;
        const title = titleElement
            ? resolveDesignTextTokens(titleElement.text, payload, displayMockups)
            : (project.title || page.name || `Página ${index + 1}`);
        const contentHtml = buildDesignStudioSceneHtml(page, payload, displayMockups, preset, colors);
        return {
            id: `scene_${page.id || index}`,
            label: page.name || `Página ${index + 1}`,
            kicker: moduleLabel,
            title: String(title || page.name || `Página ${index + 1}`).slice(0, 120),
            text: `Template livre | ${moduleLabel}`,
            contentHtml
        };
    });
    return sheets.length ? sheets : [{
        id: 'scene_empty',
        label: 'Cena',
        kicker: 'Design Studio',
        title: project.title || 'Template custom',
        text: 'Nenhuma página encontrada na cena.',
        contentHtml: '<p class="sheet-text">A cena customizada está vazia.</p>'
    }];
}

function buildDesignStudioSceneHtml(page, payload, displayMockups, preset, colors) {
    const elements = Array.isArray(page?.elements) ? page.elements : [];
    const palette = Array.isArray(colors) && colors.length
        ? colors.slice(0, 6)
        : resolveTemplateColors(payload?.identity?.colors, preset).slice(0, 6);
    const firstMockup = Array.isArray(displayMockups)
        ? displayMockups.find((item) => item.hasPreview && item.previewDataUrl)
        : null;

    const elementHtml = elements.map((element) => {
        const xPercent = Math.max(0, Math.min(100, (Number(element.x) / DESIGN_CANVAS_WIDTH) * 100));
        const yPercent = Math.max(0, Math.min(100, (Number(element.y) / DESIGN_CANVAS_HEIGHT) * 100));
        const wPercent = Math.max(2, Math.min(100, (Number(element.w) / DESIGN_CANVAS_WIDTH) * 100));
        const hPercent = Math.max(2, Math.min(100, (Number(element.h) / DESIGN_CANVAS_HEIGHT) * 100));
        const style = [
            `left:${xPercent.toFixed(3)}%`,
            `top:${yPercent.toFixed(3)}%`,
            `width:${wPercent.toFixed(3)}%`,
            `height:${hPercent.toFixed(3)}%`,
            `font-size:${Math.round(Number(element.fontSize) || 16)}px`,
            `color:${escapeHtml(element.color)}`,
            `background:${escapeHtml(buildRgbaFromHex(element.bg, element.opacity))}`,
            `border-radius:${Math.round(Number(element.radius) || 0)}px`,
            `text-align:${escapeHtml(element.align || 'left')}`,
            `justify-content:${element.align === 'center' ? 'center' : (element.align === 'right' ? 'flex-end' : 'flex-start')}`
        ].join(';');

        if (element.type === 'color_row') {
            const swatches = (palette.length ? palette : [{ hex: '#0f172a' }])
                .slice(0, 6)
                .map((item) => `<span data-color="${escapeHtml(item.hex)}"></span>`)
                .join('');
            return `<article class="scene-item type-color_row" data-inline-style="${style}">${swatches}</article>`;
        }

        if (element.type === 'mockup_slot') {
            const content = firstMockup && firstMockup.previewDataUrl
                ? `<img src="${escapeHtml(firstMockup.previewDataUrl)}" alt="Mockup"/>`
                : `<div class="scene-mockup-placeholder">${escapeHtml(resolveDesignTextTokens(element.text || 'Mockup', payload, displayMockups))}</div>`;
            return `<article class="scene-item type-mockup_slot" data-inline-style="${style}">${content}</article>`;
        }

        if (element.type === 'shape_line') {
            return `<article class="scene-item type-shape_line" data-inline-style="${style}"><span class="shape-line-core"></span></article>`;
        }

        if (element.type === 'info_card') {
            const parts = String(resolveDesignTextTokens(element.text, payload, displayMockups) || '').split(/\r?\n/g).filter(Boolean);
            const heading = parts[0] || 'Título';
            const body = parts.slice(1).join(' ') || 'Texto de apoio.';
            return `<article class="scene-item type-info_card" data-inline-style="${style}"><strong>${escapeHtml(heading)}</strong><p>${escapeHtml(body)}</p></article>`;
        }

        if (element.type === 'quote_block') {
            const parts = String(resolveDesignTextTokens(element.text, payload, displayMockups) || '').split(/\r?\n/g).filter(Boolean);
            const quote = parts[0] || '"Mensagem da marca"';
            const author = parts.slice(1).join(' ') || 'Equipe';
            return `<article class="scene-item type-quote_block" data-inline-style="${style}"><blockquote>${escapeHtml(quote)}</blockquote><cite>${escapeHtml(author)}</cite></article>`;
        }

        if (element.type === 'timeline_step') {
            const parts = String(resolveDesignTextTokens(element.text, payload, displayMockups) || '').split(/\r?\n/g).filter(Boolean);
            const phase = parts[0] || 'Etapa';
            const detail = parts.slice(1).join(' ') || 'Descrição da etapa';
            return `<article class="scene-item type-timeline_step" data-inline-style="${style}"><span class="timeline-dot" aria-hidden="true"></span><div class="timeline-copy"><strong>${escapeHtml(phase)}</strong><p>${escapeHtml(detail)}</p></div></article>`;
        }

        if (element.type === 'comparison_card') {
            const lines = String(resolveDesignTextTokens(element.text, payload, displayMockups) || '').split(/\r?\n/g).filter(Boolean);
            const headerParts = String(lines[0] || 'Antes | Depois').split('|').map((item) => item.trim()).filter(Boolean);
            const bodyParts = String(lines[1] || 'Item A | Item B').split('|').map((item) => item.trim()).filter(Boolean);
            const leftHeader = headerParts[0] || 'Antes';
            const rightHeader = headerParts[1] || 'Depois';
            const leftBody = bodyParts[0] || 'Contexto anterior';
            const rightBody = bodyParts[1] || 'Contexto otimizado';
            return `<article class="scene-item type-comparison_card" data-inline-style="${style}"><div class="comparison-col"><strong>${escapeHtml(leftHeader)}</strong><p>${escapeHtml(leftBody)}</p></div><div class="comparison-col"><strong>${escapeHtml(rightHeader)}</strong><p>${escapeHtml(rightBody)}</p></div></article>`;
        }

        const text = resolveDesignTextTokens(element.text, payload, displayMockups);
        return `<article class="scene-item type-${escapeHtml(element.type)}" data-inline-style="${style}">${escapeHtml(text || '')}</article>`;
    }).join('');

    return `
        <section class="design-scene-sheet">
            ${elementHtml || '<p class="sheet-text">Sem elementos na página.</p>'}
        </section>
    `;
}

function resolveOutputStructureIds(preset, payload, displayMockups) {
    const bookMode = resolveTemplateBookMode(preset);
    const base = getTemplateStructureIdsFromPreset(preset);
    const guaranteed = ensureStructureForBookMode(base, bookMode);

    if (!preset?.custom) {
        return bookMode === BOOK_MODE_MINI
            ? ensureStructureForBookMode(getSmartStructureSuggestion(
                resolveTemplateSmartMethod(preset),
                BOOK_MODE_MINI,
                payload,
                displayMockups
            ), BOOK_MODE_MINI)
            : guaranteed;
    }

    return guaranteed;
}

function buildMiniGuideContent(context) {
    const colors = Array.isArray(context.colors) ? context.colors.slice(0, 6) : [];
    const firstFont = String(context.typography?.primaryFontName || NOT_DEFINED_LABEL);
    const secondFont = String(context.typography?.secondaryFontName || NOT_DEFINED_LABEL);
    const title = String(context.projectTitle || 'BRAND').toUpperCase().slice(0, 34);
    const variant = normalizeMiniGuideVariant(context.miniGuideVariant || MINI_GUIDE_VARIANT_DEFAULT);
    const variantLabel = getMiniGuideVariantLabel(variant).toUpperCase();
    const methodLabel = context.smartMethod === 'smart_identity'
        ? 'IDENTITY'
        : context.smartMethod === 'smart_showcase'
            ? 'SHOWCASE'
            : context.smartMethod === 'smart_digital'
                ? 'DIGITAL'
                : 'AUTO';
    const accentLabel = variant === 'editorial'
        ? 'Tipografia editorial'
        : variant === 'social'
            ? 'Headline social'
            : 'Tipografia de acento';
    const leadLabel = variant === 'editorial'
        ? 'EDITORIAL GRID'
        : variant === 'social'
            ? 'SOCIAL KIT'
            : 'BRAND SYSTEM';

    const colorChips = colors.length
        ? colors.map((color) => `
            <span class="mini-color-dot" title="${escapeHtml(color.hex)}" data-color="${escapeHtml(color.hex)}"></span>
        `).join('')
        : '<span class="mini-color-empty">Sem cores definidas</span>';

    return `
        <div class="mini-guide-grid variant-${escapeHtml(variant)}">
            <article class="mini-guide-card primary">
                <header class="mini-guide-top">
                    <span>MINI BRAND GUIDE</span>
                    <span>${escapeHtml(methodLabel)}</span>
                </header>
                <p class="mini-variant-tag">${escapeHtml(variantLabel)}</p>
                <div class="mini-logo-blocks">
                    <div class="mini-logo-box">COLOR LOGO</div>
                    <div class="mini-logo-row">
                        <div class="mini-logo-box dark">BLACK LOGO</div>
                        <div class="mini-logo-box inverse">REVERSE LOGO</div>
                    </div>
                </div>
                <div class="mini-type-grid">
                    <div class="mini-type-box">
                        <small>${escapeHtml(leadLabel)}</small>
                        <strong>${escapeHtml(firstFont)}</strong>
                    </div>
                    <div class="mini-type-box">
                        <small>SECONDARY</small>
                        <strong>${escapeHtml(secondFont)}</strong>
                    </div>
                </div>
                <div class="mini-color-row">${colorChips}</div>
            </article>
            <article class="mini-guide-card accent">
                <header class="mini-guide-top">
                    <span>${escapeHtml(context.presetName || 'Template')}</span>
                    <span>${escapeHtml(getBookModeLabel(context.bookMode || BOOK_MODE_MINI))}</span>
                </header>
                <h4 class="mini-brand-name">${escapeHtml(title)}</h4>
                <div class="mini-logo-row">
                    <div class="mini-logo-box dark">${escapeHtml(title)}</div>
                    <div class="mini-logo-box inverse">${escapeHtml(title)}</div>
                </div>
                <div class="mini-accent-copy">
                    <small>${escapeHtml(accentLabel)}</small>
                    <strong>${escapeHtml(secondFont)}</strong>
                </div>
                <div class="mini-color-row">${colorChips}</div>
            </article>
        </div>
    `;
}

function buildPlaybookSheetContent(settings, evaluation) {
    const safe = sanitizePracticalSettings(settings);
    const channels = safe.channels.map((item) => formatChannelLabel(item)).join(' | ') || '-';
    const assets = safe.requiredAssets.map((item) => formatAssetLabel(item)).join(' | ') || '-';
    const topItems = Array.isArray(evaluation?.items) ? evaluation.items.slice(0, 4) : [];

    return `
        <div class="sheet-duo">
            <article class="sheet-box">
                <small>Regras de logo</small>
                <p class="sheet-text">Respiro: ${escapeHtml(safe.logoClearspace)}</p>
                <p class="sheet-text">Min digital: ${escapeHtml(safe.logoMinDigital)}</p>
                <p class="sheet-text">Min impresso: ${escapeHtml(safe.logoMinPrint)}</p>
            </article>
            <article class="sheet-box">
                <small>Distribuição de cor</small>
                <p class="sheet-text">Primária ${safe.ratioPrimary}% | Secundária ${safe.ratioSecondary}% | Acento ${safe.ratioAccent}%</p>
                <p class="sheet-text">Canais: ${escapeHtml(channels)}</p>
            </article>
        </div>
        <article class="sheet-box">
            <small>Guia de linguagem</small>
            <p class="sheet-text">Palavras-chave: ${escapeHtml(safe.voiceKeywords)}</p>
            <p class="sheet-text">CTA: ${escapeHtml(safe.ctaStyle)}</p>
            <p class="sheet-text">Direção visual: ${escapeHtml(safe.imageryDirection)}</p>
        </article>
        <article class="sheet-box">
            <small>Pacote de entrega</small>
            <p class="sheet-text">Ativos obrigatórios: ${escapeHtml(assets)}</p>
            <p class="sheet-text">Responsável: ${escapeHtml(safe.ownerName || 'Não definido')} | Revisão: ${safe.reviewCycleDays} dias</p>
        </article>
        <ul class="sheet-list">
            ${topItems.length
        ? topItems.map((item) => `<li>${escapeHtml(item.label)} - ${item.done ? 'OK' : 'Pendente'}</li>`).join('')
        : '<li>Checklist operacional indisponível.</li>'}
        </ul>
    `;
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
            <div class="sheet-color-swatch" data-color="${escapeHtml(color.hex)}"></div>
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
        return '<li>Sem observações adicionais.</li>';
    }

    return notes.slice(0, 3).map((note) => `<li>${escapeHtml(note.message || '')}</li>`).join('');
}

function resolveDigitalColors(og, fallbackColors) {
    const resolved = [];

    if (og && og.available) {
        const primary = normalizeHex(og.primaryColor, '');
        const secondary = normalizeHex(og.secondaryColor, '');
        if (primary) {
            resolved.push({ role: 'OG Primária', hex: primary });
        }
        if (secondary) {
            resolved.push({ role: 'OG Secundária', hex: secondary });
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
    const projectColors = Array.isArray(colors)
        ? colors
            .filter((item) => item && typeof item === 'object')
            .map((item) => ({
                role: String(item.role || 'Cor').slice(0, 32),
                hex: normalizeHex(item.hex, '')
            }))
            .filter((item) => item.hex)
        : [];

    const themeFallbackPalette = getThemePresetFallbackPalette(preset?.themeClass || DEFAULT_TEMPLATE_ID);
    const templatePalette = normalizeTemplatePalette(
        Array.isArray(preset?.colorOverride) && preset.colorOverride.length
            ? preset.colorOverride
            : preset?.fallbackPalette,
        themeFallbackPalette
    );
    const mappedTemplatePalette = templatePalette.map((hex, index) => ({
        role: COLOR_ROLE_LABELS[index] || `Apoio ${index + 1}`,
        hex
    }));

    if (Boolean(preset?.colorOverrideEnabled)) {
        return mappedTemplatePalette;
    }

    if (projectColors.length) {
        return projectColors.slice(0, TEMPLATE_COLOR_LIMIT);
    }

    return mappedTemplatePalette;
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
        setStatus('Não há páginas de brandbook para imprimir.', 'warn');
        return;
    }

    window.print();
    setStatus('Modo de impressão aberto para o brandbook.', 'ok');
}

function exportBrandbookHtml() {
    if (!currentContext.payload || !currentContext.brandbookSheets.length) {
        setStatus('Gere o brandbook antes de exportar HTML.', 'warn');
        return;
    }

    const preset = buildDraftPresetFromBuilder();
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

function openBrandbookWebRender() {
    if (!currentContext.payload || !currentContext.brandbookSheets.length) {
        setStatus('Gere o brandbook antes de abrir o render web.', 'warn');
        return;
    }

    const preset = buildDraftPresetFromBuilder();
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

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) {
        URL.revokeObjectURL(url);
        setStatus('Não foi possível abrir nova aba para o render web.', 'warn');
        return;
    }

    setTimeout(() => URL.revokeObjectURL(url), 60000);
    setStatus('Render web aberto em nova aba.', 'ok');
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
    <script>
    (function () {
        function applyInlineStyleDataset(root) {
            if (!root) return;
            root.querySelectorAll('[data-inline-style]').forEach(function (element) {
                const raw = String(element.getAttribute('data-inline-style') || '').trim();
                if (!raw) return;
                raw.split(';').forEach(function (chunk) {
                    const declaration = chunk.trim();
                    if (!declaration) return;
                    const separator = declaration.indexOf(':');
                    if (separator <= 0) return;
                    const prop = declaration.slice(0, separator).trim();
                    const value = declaration.slice(separator + 1).trim();
                    if (!prop || !value) return;
                    element.style.setProperty(prop, value);
                });
            });
            root.querySelectorAll('[data-color]').forEach(function (element) {
                const color = String(element.getAttribute('data-color') || '').trim();
                if (!color) return;
                element.style.backgroundColor = color;
            });
        }
        applyInlineStyleDataset(document);
    })();
    </script>
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
        .mini-guide-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 9px;
        }
        .mini-guide-card {
            border: 1px solid currentColor;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.08);
            padding: 8px;
            display: grid;
            gap: 8px;
            align-content: start;
        }
        .mini-guide-card.accent {
            background: rgba(255, 255, 255, 0.12);
        }
        .mini-guide-card.primary {
            position: relative;
        }
        .mini-variant-tag {
            margin: 0;
            display: inline-flex;
            align-items: center;
            width: fit-content;
            padding: 2px 7px;
            border-radius: 999px;
            font-size: 0.6rem;
            letter-spacing: 0.07em;
            font-weight: 700;
            border: 1px solid currentColor;
            opacity: 0.86;
        }
        .mini-guide-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.64rem;
            letter-spacing: 0.06em;
            font-weight: 700;
        }
        .mini-logo-blocks {
            display: grid;
            gap: 7px;
        }
        .mini-logo-row {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
        }
        .mini-logo-box {
            border: 1px solid currentColor;
            border-radius: 8px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 0.64rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            padding: 6px;
        }
        .mini-logo-box.dark {
            background: rgba(255, 255, 255, 0.86);
            color: #1f2a44;
        }
        .mini-logo-box.inverse {
            background: rgba(18, 26, 39, 0.84);
            color: #f8fbff;
        }
        .mini-type-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
        }
        .mini-type-box {
            border: 1px solid currentColor;
            border-radius: 8px;
            padding: 6px;
            display: grid;
            gap: 3px;
        }
        .mini-type-box small {
            font-size: 0.58rem;
            letter-spacing: 0.07em;
            opacity: 0.82;
        }
        .mini-type-box strong {
            font-size: 0.96rem;
            line-height: 1.1;
        }
        .mini-brand-name {
            margin: 0;
            font-size: 1.1rem;
            line-height: 1.1;
            letter-spacing: 0.03em;
        }
        .mini-accent-copy {
            border: 1px solid currentColor;
            border-radius: 8px;
            padding: 6px;
            display: grid;
            gap: 3px;
        }
        .mini-accent-copy small {
            font-size: 0.58rem;
            letter-spacing: 0.07em;
            opacity: 0.82;
        }
        .mini-accent-copy strong {
            font-size: 0.95rem;
            line-height: 1.15;
        }
        .mini-color-row {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
        }
        .mini-color-dot {
            width: 26px;
            height: 26px;
            border-radius: 999px;
            border: 1px solid rgba(17, 24, 39, 0.2);
        }
        .mini-color-empty {
            font-size: 0.72rem;
            opacity: 0.86;
        }
        .mini-guide-grid.variant-editorial .mini-guide-card {
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.06));
        }
        .mini-guide-grid.variant-editorial .mini-brand-name {
            font-family: "Fraunces", "Georgia", serif;
        }
        .mini-guide-grid.variant-social .mini-logo-box {
            border-style: dashed;
        }
        .mini-guide-grid.variant-social .mini-color-dot {
            transform: scale(1.06);
        }
        .design-scene-sheet {
            position: relative;
            width: 100%;
            aspect-ratio: 16 / 10;
            border: 1px dashed currentColor;
            border-radius: 12px;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.58);
        }
        .scene-item {
            position: absolute;
            border: 1px solid rgba(17, 24, 39, 0.2);
            padding: 8px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            line-height: 1.25;
            white-space: pre-wrap;
        }
        .scene-item.type-title {
            font-weight: 700;
            letter-spacing: 0.02em;
        }
        .scene-item.type-shape_ellipse {
            border-radius: 999px !important;
        }
        .scene-item.type-shape_triangle {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_diamond {
            clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_round_rect {
            border-radius: 32px !important;
        }
        .scene-item.type-shape_parallelogram {
            clip-path: polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_trapezoid {
            clip-path: polygon(14% 0%, 86% 0%, 100% 100%, 0% 100%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_pentagon {
            clip-path: polygon(50% 0%, 95% 35%, 78% 100%, 22% 100%, 5% 35%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_hexagon {
            clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_octagon {
            clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_star {
            clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_heart {
            clip-path: polygon(50% 93%, 24% 68%, 10% 47%, 11% 28%, 24% 16%, 40% 18%, 50% 30%, 60% 18%, 76% 16%, 89% 28%, 90% 47%, 76% 68%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_cloud {
            border-radius: 44% 56% 48% 52% / 58% 40% 60% 42% !important;
        }
        .scene-item.type-shape_arrow_right {
            clip-path: polygon(0% 26%, 66% 26%, 66% 0%, 100% 50%, 66% 100%, 66% 74%, 0% 74%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_arrow_left {
            clip-path: polygon(100% 26%, 34% 26%, 34% 0%, 0% 50%, 34% 100%, 34% 74%, 100% 74%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_arrow_up {
            clip-path: polygon(26% 100%, 26% 34%, 0% 34%, 50% 0%, 100% 34%, 74% 34%, 74% 100%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_arrow_down {
            clip-path: polygon(26% 0%, 26% 66%, 0% 66%, 50% 100%, 100% 66%, 74% 66%, 74% 0%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_chevron_right {
            clip-path: polygon(0% 0%, 46% 0%, 100% 50%, 46% 100%, 0% 100%, 55% 50%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_chevron_left {
            clip-path: polygon(100% 0%, 54% 0%, 0% 50%, 54% 100%, 100% 100%, 45% 50%);
            border-radius: 0 !important;
        }
        .scene-item.type-shape_line {
            border: 0;
            background: transparent !important;
            box-shadow: none;
            padding: 8px 0;
        }
        .scene-item.type-shape_line .shape-line-core {
            display: block;
            width: 100%;
            height: 2px;
            border-radius: 999px;
            background: currentColor;
            opacity: 0.6;
        }
        .scene-item.type-logo_box {
            border-style: dashed;
            justify-content: center;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 700;
        }
        .scene-item.type-color_row {
            display: grid;
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 6px;
            align-items: center;
            justify-items: center;
        }
        .scene-item.type-color_row span {
            width: 20px;
            height: 20px;
            border-radius: 999px;
            border: 1px solid rgba(17, 24, 39, 0.2);
        }
        .scene-item.type-mockup_slot {
            padding: 0;
            background: rgba(237, 243, 255, 0.95);
        }
        .scene-item.type-mockup_slot img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        .scene-item.type-info_card,
        .scene-item.type-quote_block {
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 6px;
        }
        .scene-item.type-info_card p,
        .scene-item.type-quote_block blockquote,
        .scene-item.type-quote_block cite {
            margin: 0;
        }
        .scene-item.type-quote_block blockquote {
            font-style: italic;
        }
        .scene-item.type-quote_block cite {
            font-size: 0.82em;
            color: #4d668e;
        }
        .scene-item.type-timeline_step {
            align-items: flex-start;
        }
        .scene-item.type-timeline_step .timeline-dot {
            width: 9px;
            height: 9px;
            border-radius: 999px;
            background: currentColor;
            margin-top: 5px;
            flex: 0 0 auto;
        }
        .scene-item.type-timeline_step .timeline-copy {
            display: grid;
            gap: 4px;
        }
        .scene-item.type-timeline_step .timeline-copy p {
            margin: 0;
            font-size: 0.82em;
            color: #4d668e;
        }
        .scene-item.type-comparison_card {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 7px;
        }
        .scene-item.type-comparison_card .comparison-col {
            border: 1px solid rgba(33, 63, 144, 0.2);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.55);
            padding: 6px;
            display: grid;
            gap: 4px;
        }
        .scene-item.type-comparison_card .comparison-col p {
            margin: 0;
            font-size: 0.8em;
            color: #4d668e;
        }
        .scene-mockup-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-size: 0.78rem;
            color: #4f6588;
            padding: 8px;
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
        @media (max-width: 640px) {
            .sheet-duo,
            .sheet-color-grid,
            .sheet-mock-grid,
            .mini-guide-grid,
            .mini-logo-row,
            .mini-type-grid {
                grid-template-columns: 1fr;
            }
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
        // Se o storage estiver indisponível, segue sem bloqueio da tela.
    }
}

function readCachedManualPayload() {
    const parsed = readStorageJson(BRAND_MANUAL_CACHE_KEY, null);
    if (!parsed || typeof parsed !== 'object') {
        return null;
    }
    const schema = String(parsed.schema || '');
    if (!schema.startsWith('brand_manual_mvp_')) {
        return null;
    }
    return parsed;
}

function getDisplayMockupsFromCachedPayload(payload) {
    const items = payload?.applications?.mockups?.items;
    if (!Array.isArray(items)) {
        return [];
    }
    return items
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
            previewDataUrl: isDataImage(entry.previewDataUrl) ? String(entry.previewDataUrl) : '',
            branding: null
        }))
        .filter((entry) => entry.id !== '')
        .sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0))
        .slice(0, 60);
}

function createManualContext() {
    const generatedAt = new Date().toISOString();
    const snapshot = getIntegrationSnapshot();
    const workInfo = getWorkInfo();
    const og = getOgSettings(snapshot);
    const displayMockups = getDisplayMockups();
    const practicalSettings = currentContext.practicalSettings || loadPracticalSettings();

    const colors = resolveIdentityColors(snapshot, displayMockups);
    const typography = resolveIdentityTypography(snapshot, displayMockups);
    const project = resolveProjectInfo(workInfo, displayMockups);

    const integrationNotes = buildIntegrationNotes({
        hasSnapshot: Boolean(snapshot?.brandKit || snapshot?.colorPalette || snapshot?.fontProfile),
        colorCount: colors.length,
        hasTypography: typography.primaryFontName !== NOT_DEFINED_LABEL || typography.secondaryFontName !== NOT_DEFINED_LABEL,
        mockupCount: displayMockups.length,
        hasOg: og.available
    });

    const payloadMockups = displayMockups.map((item, index) => ({
        id: item.id,
        mockupId: item.mockupId,
        title: item.title,
        category: item.category,
        categoryLabel: item.categoryLabel,
        orientation: item.orientation,
        quality: item.quality,
        savedAt: item.savedAt,
        imageMeta: item.imageMeta,
        hasPreview: item.hasPreview,
        previewDataUrl: item.hasPreview && index < 6 ? item.previewDataUrl : ''
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
            ogSettings: OG_SETTINGS_STORAGE_KEY,
            practicalSettings: BRAND_MANUAL_PRACTICAL_SETTINGS_KEY
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
        playbook: {
            settings: sanitizePracticalSettings(practicalSettings)
        },
        integrationNotes
    };

    const playbookEvaluation = evaluatePracticalCompleteness(
        payload.playbook.settings,
        payload,
        displayMockups
    );
    payload.playbook.applicability = {
        score: playbookEvaluation.score,
        completed: playbookEvaluation.completed,
        total: playbookEvaluation.total
    };

    if (playbookEvaluation.score < 70) {
        integrationNotes.push({
            level: 'warn',
            message: `Playbook de execução com aplicabilidade ${playbookEvaluation.score}%. Revise checklist operacional.`
        });
    } else {
        integrationNotes.push({
            level: 'ok',
            message: `Playbook de execução pronto (${playbookEvaluation.score}%).`
        });
    }

    const hasLocalData = Boolean(
        snapshot
        || displayMockups.length > 0
        || og.available
        || String(workInfo.title || '').trim()
        || String(workInfo.description || '').trim()
        || String(workInfo.mainTag || '').trim()
        || String(workInfo.supportingTags || '').trim()
    );

    if (!hasLocalData) {
        const cachedPayload = readCachedManualPayload();
        if (cachedPayload) {
            return {
                payload: cachedPayload,
                displayMockups: getDisplayMockupsFromCachedPayload(cachedPayload),
                fromCache: true
            };
        }
    }

    return {
        payload,
        displayMockups,
        fromCache: false
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

function getOgSettings(snapshot = null) {
    const profile = snapshot?.ogProfile && typeof snapshot.ogProfile === 'object'
        ? snapshot.ogProfile
        : null;
    const parsed = readStorageJson(OG_SETTINGS_STORAGE_KEY, null);
    const stored = parsed && typeof parsed === 'object' ? parsed : null;

    if (!profile?.available && !stored) {
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
        available: Boolean(profile?.available || stored),
        title: String(profile?.title || stored?.title || '').slice(0, 180),
        description: String(stored?.description || '').slice(0, 500),
        brand: String(profile?.brand || stored?.brand || '').slice(0, 160),
        primaryColor: normalizeHex(profile?.primaryColor || stored?.primaryColor, ''),
        secondaryColor: normalizeHex(profile?.secondaryColor || stored?.secondaryColor, ''),
        imageOpacity: sanitizeNumeric(profile?.imageOpacity ?? stored?.imageOpacity, null),
        overlayOpacity: sanitizeNumeric(profile?.overlayOpacity ?? stored?.overlayOpacity, null),
        template: String(profile?.template || stored?.selectedTemplate || stored?.template || '').slice(0, 80)
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
    const fallbackTitle = latestMockup ? latestMockup.title : 'Projeto sem título';

    const tags = String(workInfo.supportingTags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 20);

    return {
        title: workInfo.title || fallbackTitle,
        mainTag: workInfo.mainTag || (latestMockup ? latestMockup.categoryLabel : ''),
        supportingTags: tags,
        description: workInfo.description || 'Descrição não registrada nesta sessão.'
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
            primaryFontName: String(typography.primaryFontName || typography.fontName || NOT_DEFINED_LABEL),
            secondaryFontName: String(typography.secondaryFontName || typography.secondary || NOT_DEFINED_LABEL),
            pairingStyle: String(typography.pairingStyle || NOT_DEFINED_LABEL),
            tone: String(typography.tone || NOT_DEFINED_LABEL),
            notes: String(typography.notes || ''),
            source: String(typography.source || brandKit.source || snapshot?.fontProfile?.source || 'brandkit')
        };
    }

    const fallback = displayMockups[0]?.branding?.typography || {};
    return {
        primaryFontName: String(fallback.fontName || NOT_DEFINED_LABEL),
        secondaryFontName: String(fallback.fontName || NOT_DEFINED_LABEL),
        pairingStyle: NOT_DEFINED_LABEL,
        tone: NOT_DEFINED_LABEL,
        notes: '',
        source: 'mockups'
    };
}

function buildIntegrationNotes(context) {
    const notes = [];

    if (!context.hasSnapshot) {
        notes.push({
            level: 'warn',
            message: 'Brand Kit não encontrado nesta sessão. O resumo usou dados de fallback do módulo de mockups.'
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
            message: 'Tipografia não definida. Recomenda-se gerar combinação no Font Strategy Advisor.'
        });
    }

    if (context.mockupCount === 0) {
        notes.push({
            level: 'warn',
            message: 'Sem mockups salvos. O manual pode ficar incompleto sem exemplos de aplicação.'
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
            message: 'Diretriz OG não encontrada. Abra OG Image Generator e salve configurações para incluir esta seção.'
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
    setText('projectTitle', project.title || NOT_DEFINED_LABEL);
    setText('projectMainTag', project.mainTag ? `#${project.mainTag}` : 'Sem tag');
    setText('projectDescription', project.description || 'Sem descrição registrada.');
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
            <div class="palette-swatch" data-color="${escapeHtml(item.hex)}"></div>
            <div class="palette-meta">
                <small>${escapeHtml(item.role || 'Cor')}</small>
                <strong>${escapeHtml(item.hex || '-')}</strong>
            </div>
        </article>
    `).join('');
    applyInlineStyleDataset(target);
}

function renderTypography(typography) {
    const target = document.getElementById('typographySummary');
    if (!target) {
        return;
    }

    const data = typography && typeof typography === 'object' ? typography : {};
    const lines = [
        { label: 'Fonte principal', value: data.primaryFontName || NOT_DEFINED_LABEL },
        { label: 'Fonte secundária', value: data.secondaryFontName || NOT_DEFINED_LABEL },
        { label: 'Pairing', value: data.pairingStyle || NOT_DEFINED_LABEL },
        { label: 'Tom', value: data.tone || NOT_DEFINED_LABEL },
        { label: 'Origem', value: data.source || NOT_DEFINED_LABEL }
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
        target.innerHTML = '<p class="muted">Sem configuração de OG registrada nesta sessão.</p>';
        return;
    }

    const rows = [
        { label: 'Marca', value: og.brand || 'Não definido' },
        { label: 'Título', value: og.title || 'Não definido' },
        { label: 'Descrição', value: og.description || 'Não definido' },
        { label: 'Template', value: og.template || 'Não definido' },
        {
            label: 'Cores',
            value: [og.primaryColor, og.secondaryColor].filter(Boolean).join(' | ') || 'Não definido'
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
        target.innerHTML = '<li class="ok">Sem observações adicionais.</li>';
        return;
    }

    target.innerHTML = notes.map((note) => `
        <li class="${escapeHtml(note.level || 'ok')}">${escapeHtml(note.message || '')}</li>
    `).join('');
}

function renderPayload(payload) {
    const field = document.getElementById('manualPayload');
    if (!field) {
        return;
    }
    field.value = JSON.stringify(payload, null, 2);
}

function exportMiniBrandGuidePdf() {
    if (!currentContext.payload) {
        setStatus('Gere o manual antes de exportar PDF.', 'warn');
        return;
    }

    const jsPDFCtor = window.jspdf?.jsPDF;
    if (!jsPDFCtor) {
        setStatus('Biblioteca de PDF indisponível no momento.', 'warn');
        return;
    }

    const payload = currentContext.payload;
    const doc = new jsPDFCtor({ unit: 'pt', format: 'a4' });
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);
    const project = payload.identity?.project || {};
    const colors = Array.isArray(payload.identity?.colors) ? payload.identity.colors : [];
    const typography = payload.identity?.typography || {};
    const notes = (Array.isArray(payload.integrationNotes) ? payload.integrationNotes : [])
        .map((item) => String(item?.message || '').trim())
        .filter(Boolean)
        .slice(0, 4);
    let y = 44;

    doc.setFillColor(14, 75, 215);
    doc.rect(0, 0, pageWidth, 160, 'F');
    doc.setFillColor(10, 58, 168);
    doc.rect(0, 156, pageWidth, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13.5);
    doc.text('QUOTIA | Brand Manual Report', margin, 38);
    doc.setFontSize(28);
    doc.text('Mini Brand Guide', margin, 82);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.8);
    doc.text('Versão resumida para alinhamento rápido do projeto.', margin, 104);

    doc.setFillColor(219, 234, 254);
    doc.roundedRect(pageWidth - margin - 170, 26, 170, 30, 8, 8, 'F');
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Gerado em ${formatDate(payload.generatedAt)}`, pageWidth - margin - 160, 45);

    y = 196;
    doc.setFillColor(248, 251, 255);
    doc.setDrawColor(207, 222, 246);
    doc.roundedRect(margin, y, contentWidth, 210, 12, 12, 'FD');

    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Projeto', margin + 14, y + 24);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.1);
    const projectRows = [
        `Título: ${project.title || 'Não definido'}`,
        `Tag principal: ${project.mainTag || '-'}`,
        `Descricao: ${project.description || '-'}`,
        `Tags: ${(project.supportingTags || []).join(', ') || '-'}`
    ];
    let projectRowsY = y + 44;
    projectRows.forEach((line) => {
        const lines = doc.splitTextToSize(line, contentWidth - 28).slice(0, 2);
        lines.forEach((chunk) => {
            doc.text(chunk, margin + 14, projectRowsY);
            projectRowsY += 14;
        });
    });

    const confidenceText = `Template ativo: ${payload.template?.name || getTemplatePreset(currentContext.activeTemplateId).name}`;
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.2);
    doc.text(confidenceText, margin + 14, Math.min(y + 186, projectRowsY + 8));

    y = 426;
    y = writeSectionTitle(doc, 'Paleta essencial', margin, y);
    if (!colors.length) {
        y = writeParagraph(doc, ['Sem cores consolidadas no momento.'], margin, y, 13, pageWidth);
    } else {
        colors.slice(0, 4).forEach((item) => {
            y = ensurePageSpace(doc, y, 24, margin);
            const rgb = hexToRgb(item.hex);
            doc.setFillColor(rgb.r, rgb.g, rgb.b);
            doc.rect(margin, y - 10, 16, 16, 'F');
            doc.setTextColor(17, 24, 39);
            doc.text(`${item.role}: ${item.hex}`, margin + 24, y + 2);
            y += 20;
        });
    }

    y += 2;
    y = writeSectionTitle(doc, 'Tipografia', margin, y);
    y = writeParagraph(
        doc,
        [
            `Fonte principal: ${typography.primaryFontName || '-'}`,
            `Fonte secundaria: ${typography.secondaryFontName || '-'}`,
            `Pairing: ${typography.pairingStyle || '-'}`,
            `Tom: ${typography.tone || '-'}`
        ],
        margin,
        y,
        13,
        pageWidth
    );

    y += 2;
    y = writeSectionTitle(doc, 'Próximas ações', margin, y);
    const fallbackActions = [
        'Validar o render web do brandbook com o time.',
        'Aplicar tokens de cor e tipografia no projeto principal.',
        'Conferir mockups e canais prioritarios antes da entrega.'
    ];
    y = writeParagraph(doc, (notes.length ? notes : fallbackActions).map((item) => `- ${item}`), margin, y, 13, pageWidth);

    doc.setDrawColor(212, 224, 245);
    doc.line(40, pageHeight - 34, pageWidth - 40, pageHeight - 34);
    doc.setTextColor(75, 98, 132);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.text('Quotia Brand Manual | Mini Brand Guide', 40, pageHeight - 19);
    doc.text('Página 1/1', pageWidth - 40, pageHeight - 19, { align: 'right' });

    doc.save(`manual-marca-mvp-mini-${formatDateForFile(new Date())}.pdf`);
    setStatus('PDF mini exportado com sucesso.', 'ok');
}

async function exportPdfBrandbookRender() {
    if (!currentContext.payload || !currentContext.brandbookSheets.length) {
        setStatus('Gere o brandbook antes de exportar PDF.', 'warn');
        return;
    }

    const jsPDFCtor = window.jspdf?.jsPDF;
    if (!jsPDFCtor) {
        setStatus('Biblioteca de PDF indisponível no momento.', 'warn');
        return;
    }

    const renderFn = window.html2canvas;
    const sheetNodes = Array.from(document.querySelectorAll('#brandbookPreview .brandbook-sheet'));
    if (typeof renderFn !== 'function' || !sheetNodes.length) {
        setStatus('Renderizador visual indisponível. Gerando PDF resumo textual completo.', 'warn');
        exportPdfSummary();
        return;
    }

    setStatus('Gerando PDF visual do brandbook completo. Aguarde...', 'warn');
    const doc = new jsPDFCtor({
        unit: 'pt',
        format: 'a4',
        orientation: 'landscape',
        compress: true
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;

    try {
        for (let index = 0; index < sheetNodes.length; index += 1) {
            const node = sheetNodes[index];
            const canvas = await renderFn(node, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });

            const dataUrl = canvas.toDataURL('image/png', 0.98);
            const maxWidth = pageWidth - (margin * 2);
            const maxHeight = pageHeight - (margin * 2);

            const widthByHeight = (canvas.width * maxHeight) / canvas.height;
            const heightByWidth = (canvas.height * maxWidth) / canvas.width;

            const renderWidth = Math.min(maxWidth, widthByHeight);
            const renderHeight = Math.min(maxHeight, heightByWidth);
            const x = (pageWidth - renderWidth) / 2;
            const y = (pageHeight - renderHeight) / 2;

            doc.addImage(dataUrl, 'PNG', x, y, renderWidth, renderHeight, undefined, 'FAST');

            if (index < sheetNodes.length - 1) {
                doc.addPage('a4', 'landscape');
            }
        }

        doc.save(`brandbook-render-full-${formatDateForFile(new Date())}.pdf`);
        setStatus('PDF visual exportado com sucesso (Brandbook Completo).', 'ok');
    } catch (error) {
        setStatus('Falha ao gerar PDF visual. Exportando resumo textual completo como fallback.', 'warn');
        exportPdfSummary();
    }
}

function exportPdfSummary(mode = 'full') {
    if (!currentContext.payload) {
        setStatus('Gere o manual antes de exportar PDF.', 'warn');
        return;
    }

    const jsPDFCtor = window.jspdf?.jsPDF;
    if (!jsPDFCtor) {
        setStatus('Biblioteca de PDF indisponível no momento.', 'warn');
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
            `Título: ${payload.identity.project.title}`,
            `Tag principal: ${payload.identity.project.mainTag || '-'}`,
            `Descrição: ${payload.identity.project.description}`,
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
    y = writeSectionTitle(doc, 'Sistema Tipográfico', margin, y);
    const type = payload.identity.typography || {};
    y = writeParagraph(
        doc,
        [
            `Fonte principal: ${type.primaryFontName || '-'}`,
            `Fonte secundária: ${type.secondaryFontName || '-'}`,
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
        y = writeParagraph(doc, ['Não há configuração OG registrada.'], margin, y, lineGap, pageWidth);
    } else {
        y = writeParagraph(
            doc,
            [
                `Marca: ${og.brand || '-'}`,
                `Título: ${og.title || '-'}`,
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
    y = writeSectionTitle(doc, 'Aplicações em Mockups', margin, y);
    const mockups = payload.applications?.mockups?.items || [];
    if (!mockups.length) {
        y = writeParagraph(doc, ['Nenhum mockup salvo para esta sessão.'], margin, y, lineGap, pageWidth);
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
    y = writeSectionTitle(doc, 'Observações de Integração', margin, y);
    (payload.integrationNotes || []).forEach((note) => {
        y = writeParagraph(doc, [`- ${note.message}`], margin, y, lineGap, pageWidth);
    });

    const normalizedMode = String(mode || '').trim().toLowerCase() === 'mini' ? 'mini' : 'full';
    doc.save(`manual-marca-mvp-${normalizedMode}-${formatDateForFile(new Date())}.pdf`);
    setStatus(`PDF resumo exportado com sucesso (${normalizedMode === 'mini' ? 'Mini Brand Guide' : 'Brandbook Completo'}).`, 'ok');
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

function normalizePreviewSyncStatus(status) {
    const value = String(status || '').toLowerCase();
    if (value === 'ok' || value === 'warn' || value === 'idle') {
        return value;
    }
    return 'idle';
}

function renderPreviewSyncBadge() {
    const badge = document.getElementById('previewSyncBadge');
    const meta = document.getElementById('previewSyncMeta');
    const state = currentContext.previewSync && typeof currentContext.previewSync === 'object'
        ? currentContext.previewSync
        : {
            status: 'idle',
            source: 'init',
            updatedAt: '',
            pages: 0,
            message: 'Aguardando primeira sincronização.'
        };

    const status = normalizePreviewSyncStatus(state.status);
    const source = String(state.source || 'auto');
    const pages = Number.isFinite(state.pages) ? state.pages : 0;
    const updatedAtLabel = formatDate(state.updatedAt);
    const message = String(state.message || '').trim() || 'Sem detalhes.';

    if (badge) {
        badge.classList.remove('is-ok', 'is-warn', 'is-idle');
        badge.classList.add(`is-${status}`);
        badge.textContent = status === 'ok'
            ? 'Sync: ok'
            : status === 'warn'
                ? 'Sync: alerta'
                : 'Sync: aguardando';
        badge.setAttribute(
            'title',
            `${message} | Origem: ${source} | Última atualização: ${updatedAtLabel} | Páginas: ${pages}`
        );
    }

    if (meta) {
        meta.textContent = `Última atualização: ${updatedAtLabel} | Origem: ${source} | Páginas: ${pages}`;
    }
}

function updatePreviewSyncBadge(state = {}) {
    const sourceState = state && typeof state === 'object' ? state : {};
    const pages = Number.isFinite(sourceState.pages)
        ? Number(sourceState.pages)
        : Array.isArray(currentContext.brandbookSheets)
            ? currentContext.brandbookSheets.length
            : 0;

    currentContext.previewSync = {
        status: normalizePreviewSyncStatus(sourceState.status || currentContext.previewSync?.status || 'idle'),
        source: String(sourceState.source || currentContext.previewSync?.source || 'auto'),
        updatedAt: String(sourceState.updatedAt || new Date().toISOString()),
        pages,
        message: String(sourceState.message || currentContext.previewSync?.message || '').slice(0, 220)
    };
    renderPreviewSyncBadge();
}

function runPreviewSyncTest() {
    if (!currentContext.payload) {
        updatePreviewSyncBadge({
            status: 'warn',
            source: 'manual_test',
            pages: 0,
            message: 'Teste manual cancelado: sem payload para render.'
        });
        setStatus('Teste de sync cancelado: atualize o manual antes de testar.', 'warn');
        return;
    }

    updatePreviewSyncBadge({
        status: 'idle',
        source: 'manual_test',
        message: 'Executando teste manual de sincronização.'
    });

    refreshBrandbookPreviewFromBuilder({
        source: 'manual_test',
        syncDesignStudioCanvas: true
    });

    const pages = Array.isArray(currentContext.brandbookSheets)
        ? currentContext.brandbookSheets.length
        : 0;

    if (pages > 0) {
        setStatus(`Teste de sync concluído: ${pages} página(s) sincronizada(s).`, 'ok');
        return;
    }

    updatePreviewSyncBadge({
        status: 'warn',
        source: 'manual_test',
        pages: 0,
        message: 'Teste manual concluído sem páginas renderizadas.'
    });
    setStatus('Teste de sync concluído com alerta: nenhuma página renderizada.', 'warn');
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

function cssEscape(value) {
    const raw = String(value || '');
    if (window.CSS && typeof window.CSS.escape === 'function') {
        return window.CSS.escape(raw);
    }
    return raw.replace(/["\\]/g, '\\$&');
}
