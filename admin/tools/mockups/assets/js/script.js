const CATEGORY_ORDER = ['modelos', 'templates', 'embalagens', 'papelaria', 'vestuario', 'manual_marca', 'identidade_visual', 'redes_sociais', 'outdoor', 'indoor'];

const CATEGORY_DEFS = {
    modelos: {
        label: 'Modelos',
        theme: '#2563eb',
        entries: [
            ['Smartphone Premium', 'vertical', 'device', 'smartphone,mobile,app'],
            ['Laptop Ultrafino', 'horizontal', 'device', 'laptop,desktop,ui'],
            ['Tablet Pro', 'vertical', 'device', 'tablet,interface,ux'],
            ['Smartwatch Ativo', 'quadrada', 'device', 'smartwatch,wearable,fitness'],
            ['Monitor Curvo', 'horizontal', 'screen', 'monitor,dashboard,saas'],
            ['TV 4K Slim', 'horizontal', 'screen', 'tv,streaming,midia'],
            ['Console Portatil', 'horizontal', 'device', 'console,gamer,tecnologia'],
            ['Desktop All-in-One', 'horizontal', 'screen', 'desktop,corporativo,branding'],
            ['Headset VR', 'horizontal', 'device', 'vr,imersivo,3d'],
            ['Speaker Inteligente', 'quadrada', 'product', 'speaker,iot,gadget']
        ]
    },
    templates: {
        label: 'Templates',
        theme: '#7c3aed',
        entries: [
            ['Apresentação Corporativa', 'horizontal', 'paper', 'slide,corporativo,pitch'],
            ['Post Instagram', 'quadrada', 'frame', 'instagram,post,social'],
            ['Story Instagram', 'vertical', 'frame', 'story,instagram,campanha'],
            ['Banner de Campanha', 'horizontal', 'banner', 'banner,ads,midia'],
            ['Capa de Ebook', 'vertical', 'paper', 'ebook,capa,editorial'],
            ['Email Marketing', 'horizontal', 'screen', 'email,newsletter,crm'],
            ['Landing Page', 'horizontal', 'screen', 'landing,site,conversao'],
            ['Catálogo de Produto', 'vertical', 'paper', 'catálogo,produto,vendas'],
            ['Pitch Deck', 'horizontal', 'paper', 'deck,startup,investidor'],
            ['Infografico Vertical', 'vertical', 'paper', 'infografico,dados,visual']
        ]
    },
    embalagens: {
        label: 'Embalagens',
        theme: '#ea580c',
        entries: [
            ['Caixa Rigida', 'quadrada', 'box', 'caixa,produto,premium'],
            ['Caixa de Correio', 'horizontal', 'box', 'shipping,ecommerce,caixa'],
            ['Pote Cosmetico', 'quadrada', 'product', 'cosmetico,beleza,pote'],
            ['Squeeze de Aluminio', 'vertical', 'product', 'squeeze,evento,promocional'],
            ['Rotulo de Garrafa', 'vertical', 'product', 'rotulo,garrafa,bebida'],
            ['Sacola Boutique', 'vertical', 'bag', 'sacola,varejo,branding'],
            ['Envelope Kraft', 'horizontal', 'paper', 'envelope,kraft,envio'],
            ['Embalagem Snack', 'vertical', 'bag', 'snack,food,pouch'],
            ['Tubo de Produto', 'vertical', 'product', 'tubo,creme,skincare'],
            ['Display de Balcao', 'quadrada', 'stand', 'display,pdv,promocao']
        ]
    },
    papelaria: {
        label: 'Papelaria',
        theme: '#0891b2',
        entries: [
            ['Cartao de Visita', 'horizontal', 'paper', 'cartao,visita,branding'],
            ['Papel Timbrado', 'vertical', 'paper', 'timbrado,empresa,documento'],
            ['Envelope Executivo', 'horizontal', 'paper', 'envelope,executivo,marca'],
            ['Pasta Institucional', 'vertical', 'paper', 'pasta,apresentação,empresa'],
            ['Bloco de Notas', 'vertical', 'paper', 'bloco,escritorio,evento'],
            ['Carimbo Assinatura', 'horizontal', 'product', 'carimbo,assinatura,oficial'],
            ['Agenda Premium', 'vertical', 'paper', 'agenda,planner,papelaria'],
            ['Assinatura de Email', 'horizontal', 'screen', 'email,assinatura,corporativo'],
            ['Certificado Oficial', 'vertical', 'paper', 'certificado,premio,oficial'],
            ['Folder Trifold', 'horizontal', 'paper', 'folder,trifold,divulgação']
        ]
    },
    vestuario: {
        label: 'Vestuario',
        theme: '#16a34a',
        entries: [
            ['Camiseta Basica', 'vertical', 'fabric', 'camiseta,estampa,moda'],
            ['Moletom com Capuz', 'vertical', 'fabric', 'moletom,hoodie,urbano'],
            ['Regata Esportiva', 'vertical', 'fabric', 'regata,fitness,esporte'],
            ['Jaqueta Bomber', 'vertical', 'fabric', 'jaqueta,streetwear,moda'],
            ['Bone Snapback', 'quadrada', 'product', 'bone,acessorio,marca'],
            ['Ecobag de Tecido', 'vertical', 'bag', 'ecobag,sustentavel,varejo'],
            ['Avental Profissional', 'vertical', 'fabric', 'avental,cozinha,evento'],
            ['Meia Estampada', 'vertical', 'fabric', 'meia,acessorio,estampa'],
            ['Tenis Casual', 'horizontal', 'product', 'tenis,calcado,casual'],
            ['Uniforme Polo', 'vertical', 'fabric', 'uniforme,polo,empresa']
        ]
    },
    manual_marca: {
        label: 'Manual de Marca',
        theme: '#7c3aed',
        entries: [
            ['Capa do Manual de Marca', 'vertical', 'paper', 'manual de marca,capa,brandbook'],
            ['Conceito e Essencia da Marca', 'vertical', 'paper', 'conceito,proposito,essencia,brandbook'],
            ['Arquitetura da Marca', 'horizontal', 'paper', 'arquitetura,submarcas,sistema'],
            ['Area de Protecao do Logo', 'horizontal', 'paper', 'logo,área de segurança,aplicação'],
            ['Usos Incorretos do Logo', 'horizontal', 'paper', 'logo,restricoes,manual'],
            ['Paleta de Cores Oficial', 'horizontal', 'paper', 'paleta,cores,cmyk,rgb'],
            ['Tipografia Institucional', 'horizontal', 'paper', 'tipografia,fontes,manual'],
            ['Aplicação em Fundos', 'horizontal', 'paper', 'fundos,contraste,logo'],
            ['Iconografia e Elementos', 'horizontal', 'paper', 'icones,elementos visuais,grid'],
            ['Tom de Voz e Mensagens', 'vertical', 'paper', 'tom de voz,copy,comunicação']
        ]
    },
    identidade_visual: {
        label: 'Identidade Visual',
        theme: '#ea580c',
        entries: [
            ['Logo Principal Vertical', 'vertical', 'frame', 'logo,identidade visual,principal'],
            ['Logo Horizontal Institucional', 'horizontal', 'frame', 'logo,horizontal,assinatura'],
            ['Monograma e Simbolo', 'quadrada', 'frame', 'monograma,simbolo,marca'],
            ['Pattern Institucional', 'quadrada', 'frame', 'pattern,textura,identidade'],
            ['Kit Aplicações da Marca', 'horizontal', 'frame', 'aplicações,branding,apresentação'],
            ['Fachada Comercial', 'horizontal', 'sign', 'fachada,loja,sinalização,marca'],
            ['Uniforme Corporativo', 'vertical', 'fabric', 'uniforme,corporativo,aplicação'],
            ['Assinatura de Apresentação', 'horizontal', 'screen', 'apresentação,pitch,marca'],
            ['Kit de Icones da Marca', 'quadrada', 'frame', 'icones,sistema visual,ui'],
            ['Moodboard de Identidade', 'horizontal', 'paper', 'moodboard,direção criativa,identidade']
        ]
    },
    redes_sociais: {
        label: 'Redes Sociais',
        theme: '#2563eb',
        entries: [
            ['Post Feed Instagram', 'quadrada', 'screen', 'instagram,feed,post,social'],
            ['Carrossel Instagram', 'horizontal', 'screen', 'instagram,carrossel,social'],
            ['Story Instagram', 'vertical', 'screen', 'story,reels,instagram,vertical'],
            ['Capa Facebook', 'horizontal', 'screen', 'facebook,capa,cover'],
            ['Banner LinkedIn', 'horizontal', 'screen', 'linkedin,banner,corporativo'],
            ['Thumbnail YouTube', 'horizontal', 'screen', 'youtube,thumbnail,video'],
            ['Pin Pinterest', 'vertical', 'screen', 'pinterest,pin,inspiração'],
            ['Post X Twitter', 'horizontal', 'screen', 'twitter,x,post,campanha'],
            ['Capa TikTok', 'vertical', 'screen', 'tiktok,perfil,capa'],
            ['Anuncio Vertical Ads', 'vertical', 'screen', 'ads,meta,google,performance']
        ]
    },
    outdoor: {
        label: 'Outdoor',
        theme: '#dc2626',
        entries: [
            ['Outdoor Rodovia', 'horizontal', 'billboard', 'outdoor,campanha,rodovia'],
            ['Painel LED Urbano', 'horizontal', 'billboard', 'led,urbano,digital'],
            ['Busdoor Lateral', 'horizontal', 'billboard', 'busdoor,transporte,midia'],
            ['Backbus', 'horizontal', 'billboard', 'backbus,publicidade,rua'],
            ['Relogio de Rua', 'vertical', 'sign', 'relogio,rua,midia'],
            ['Totem de Evento', 'vertical', 'sign', 'totem,evento,feira'],
            ['Faixa Promocional', 'horizontal', 'banner', 'faixa,promocao,anuncio'],
            ['Placa de Obra', 'horizontal', 'sign', 'placa,obra,construcao'],
            ['Mupi Digital', 'vertical', 'billboard', 'mupi,digital,campanha'],
            ['Empena Predial', 'vertical', 'billboard', 'empena,fachada,impacto']
        ]
    },
    indoor: {
        label: 'Indoor',
        theme: '#ca8a04',
        entries: [
            ['Quadro de Parede', 'horizontal', 'frame', 'quadro,parede,decoração'],
            ['Placa de Recepcao', 'horizontal', 'sign', 'recepção,placa,sinalização'],
            ['Painel de Loja', 'horizontal', 'board', 'painel,loja,vendas'],
            ['Totem Interno', 'vertical', 'sign', 'totem,interno,evento'],
            ['Display de Mesa', 'vertical', 'stand', 'display,mesa,restaurante'],
            ['Adesivo de Vitrine', 'horizontal', 'frame', 'adesivo,vitrine,pdv'],
            ['Poster de Cinema', 'vertical', 'frame', 'poster,cinema,lancamento'],
            ['Menu Board', 'horizontal', 'board', 'menu,food,board'],
            ['Sinalização de Corredor', 'vertical', 'sign', 'wayfinding,corredor,direcao'],
            ['Banner Rollup', 'vertical', 'banner', 'rollup,banner,evento']
        ]
    }
};

const STYLE_VARIANTS = [
    { key: 'studio', label: 'Studio', scene: 'studio', quality: 'alta', color: 'colorido', score: 95 },
    { key: 'perspective', label: 'Perspective', scene: 'gradient', quality: 'alta', color: 'colorido', score: 88 },
    { key: 'minimal', label: 'Minimal', scene: 'paper', quality: 'media', color: 'preto-branco', score: 78 }
];

const CANVAS_PRESETS = {
    'feed-square': { width: 1080, height: 1080, label: 'Feed quadrado' },
    'feed-vertical': { width: 1080, height: 1350, label: 'Feed vertical' },
    story: { width: 1080, height: 1920, label: 'Story/Reels' },
    widescreen: { width: 1920, height: 1080, label: 'Widescreen' },
    presentation: { width: 1600, height: 900, label: 'Apresentação' },
    thumb: { width: 1280, height: 720, label: 'Miniatura' }
};

const FONT_MAP = {
    montserrat: '"Montserrat", "Segoe UI", Arial, sans-serif',
    poppins: '"Poppins", "Segoe UI", Arial, sans-serif',
    lora: '"Lora", Georgia, serif',
    bebas: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
    playfair: '"Playfair Display", Georgia, serif'
};

const DEFAULT_EDITOR_STATE = {
    canvasPreset: 'feed-square',
    positionX: 50,
    positionY: 50,
    scale: 1,
    imageLayoutMode: 'fit-fill',
    rotation: 0,
    opacity: 1,
    shadow: 12,
    radius: 16,
    flipHorizontal: false,
    flipVertical: false,
    filter: 'none',
    backgroundPreset: 'studio',
    bgColorStart: '#dbeafe',
    bgColorEnd: '#fee2e2',
    mockupProductColor: '#ffffff',
    showGuides: true,
    textEnabled: true,
    textPrimary: '',
    textSecondary: '',
    textFont: 'montserrat',
    textAlign: 'center',
    textColor: '#0f172a',
    textSize: 48,
    textPositionX: 50,
    textPositionY: 90,
    logoScale: 0.4,
    logoOpacity: 0.85,
    logoPositionX: 86,
    logoPositionY: 88,
    exportFormat: 'image/png',
    exportQuality: 92,
    exportScale: 1
};

const STORAGE_KEY = 'mockuphub_library_state_v2';
const EDITOR_STORAGE_KEY = 'mockuphub_editor_state_v3';
const PAGE_SIZE = 24;
const DEFAULT_COLLECTION_KEY = 'geral';
const SUPPORTED_UPLOAD_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/svg+xml']);
const SUPPORTED_UPLOAD_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg'];
const MAX_WORKING_IMAGE_DIMENSION = 8192;
const SAVED_EDITS_STORAGE_KEY = 'mockuphub_saved_edits_v1';
const MAX_SAVED_EDITS = 120;
const REPORT_PAGE_URL = './report.php';
const RESULTS_PAGE_URL = './results.php';
const BRAND_SYNC_FONTS = ['montserrat', 'poppins', 'lora', 'bebas', 'playfair'];
const WORK_INFO_STORAGE_KEY = 'mockuphub_work_info_v1';
const UPLOAD_VALIDATION_SESSION_KEY = 'mockuphub_upload_validation_v1';
const UPLOAD_BRIDGE_SESSION_KEY = 'mockuphub_upload_bridge_dataurl_v1';
const UPLOAD_BRIDGE_DB_NAME = 'mockuphub_upload_bridge_db';
const UPLOAD_BRIDGE_STORE_NAME = 'artwork';
const UPLOAD_BRIDGE_KEY = 'latest_artwork';
const UPLOAD_BRIDGE_ENDPOINT = './upload-bridge.php';
const EDITOR_STATE_BY_MOCKUP_STORAGE_KEY = 'mockuphub_editor_state_by_mockup_v1';

const mockupsData = buildMockupCatalog();
const allMockups = Object.values(mockupsData).flat();

let currentCategory = 'todos';
let currentMockups = [];
let filteredMockups = [];
let renderedCount = 0;
let selectedMockup = null;
let pendingPreviewMockupId = null;
let uploadedImage = null;
let uploadedImageFileMeta = null;
let uploadedLogo = null;
let canvas = null;
let ctx = null;
let editorState = { ...DEFAULT_EDITOR_STATE };
let editorStateByMockup = {};
let favoritesOnly = false;
let collectionFilterKey = 'all';
let listObserver = null;
let libraryState = createDefaultLibraryState();
let editorSaveTimer = null;
let thumbnailRefreshTimer = null;
let editorDockHome = null;
let hasPersistedEditorState = false;
let workInfoState = createDefaultWorkInfoState();

document.addEventListener('DOMContentLoaded', async () => {
    loadLibraryState();
    loadEditorState();
    loadEditorStateByMockup();
    loadWorkInfoState();
    applySharedBrandDefaults();
    initializeApp();
    bindEvents();
    initializeWorkIntakeForm();
    decorateCategoryButtons();
    refreshCollectionSelectors();
    loadMockups();
    renderCanvas();
    await restoreUploadFromBridge();
});

window.addEventListener('beforeunload', () => {
    saveUserSettings();
    saveLibraryState();
    persistSelectedMockupEditorState();
    saveEditorState();
    saveEditorStateByMockup();
    saveWorkInfoState();
});

function initializeApp() {
    editorDockHome = document.getElementById('editorDockHome');
    canvas = document.getElementById('mockupCanvas');
    if (!canvas) {
        return;
    }

    ctx = canvas.getContext('2d');
    applyCanvasPreset(editorState.canvasPreset);
    applyEditorStateToControls();
    updateExportQualityLabel();
    updateEditorMeta();
}

function bindEvents() {
    document.querySelectorAll('.nav-btn').forEach((btn) => {
        btn.addEventListener('click', () => switchCategory(btn.dataset.category));
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterMockups);
    }

    ['orientationFilter', 'qualityFilter', 'colorFilter', 'sortFilter'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', filterMockups);
        }
    });

    const favoritesToggle = document.getElementById('favoritesOnlyToggle');
    if (favoritesToggle) {
        favoritesToggle.addEventListener('click', () => {
            favoritesOnly = !favoritesOnly;
            favoritesToggle.classList.toggle('active', favoritesOnly);
            libraryState.favoritesOnly = favoritesOnly;
            saveLibraryState();
            filterMockups();
        });
        favoritesToggle.classList.toggle('active', favoritesOnly);
    }

    const collectionFilter = document.getElementById('collectionFilter');
    if (collectionFilter) {
        collectionFilter.addEventListener('change', () => {
            collectionFilterKey = collectionFilter.value || 'all';
            libraryState.collectionFilter = collectionFilterKey;
            saveLibraryState();
            filterMockups();
        });
    }

    const collectionTarget = document.getElementById('collectionTargetSelect');
    if (collectionTarget) {
        collectionTarget.addEventListener('change', () => {
            libraryState.activeCollection = collectionTarget.value || DEFAULT_COLLECTION_KEY;
            saveLibraryState();
        });
    }

    const createCollectionBtn = document.getElementById('createCollectionBtn');
    if (createCollectionBtn) {
        createCollectionBtn.addEventListener('click', createCollection);
    }

    const deleteCollectionBtn = document.getElementById('deleteCollectionBtn');
    if (deleteCollectionBtn) {
        deleteCollectionBtn.addEventListener('click', deleteCollection);
    }

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => renderNextPage());
    }

    const grid = document.getElementById('mockupsGrid');
    if (grid) {
        grid.addEventListener('click', handleGridAction);
    }

    [
        'canvasPreset',
        'backgroundPreset',
        'bgColorStart',
        'bgColorEnd',
        'mockupProductColor',
        'showGuides',
        'positionX',
        'positionY',
        'scaleRange',
        'imageLayoutMode',
        'rotationRange',
        'flipHorizontal',
        'flipVertical',
        'opacityRange',
        'shadowRange',
        'radiusRange',
        'filterSelect',
        'enableTextOverlay',
        'textPrimary',
        'textSecondary',
        'textFont',
        'textAlign',
        'textColor',
        'textSize',
        'textPositionX',
        'textPositionY',
        'logoScaleRange',
        'logoOpacityRange',
        'logoPositionX',
        'logoPositionY',
        'exportFormat',
        'exportQuality',
        'exportScale'
    ]
        .forEach((id) => {
            const el = document.getElementById(id);
            if (!el) {
                return;
            }
            el.addEventListener('input', updateMockup);
            el.addEventListener('change', updateMockup);
        });

    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }

    const logoInput = document.getElementById('logoInput');
    if (logoInput) {
        logoInput.addEventListener('change', handleLogoUpload);
    }

    const removeLogoBtn = document.getElementById('removeLogoBtn');
    if (removeLogoBtn) {
        removeLogoBtn.addEventListener('click', removeLogo);
    }

    const saveMockupChangesBtn = document.getElementById('saveMockupChangesBtn');
    if (saveMockupChangesBtn) {
        saveMockupChangesBtn.addEventListener('click', () => saveMockupChanges());
    }

    const downloadMockupBtn = document.getElementById('downloadMockupBtn');
    if (downloadMockupBtn) {
        downloadMockupBtn.addEventListener('click', downloadMockup);
    }

    const resetEditorBtn = document.getElementById('resetEditorBtn');
    if (resetEditorBtn) {
        resetEditorBtn.addEventListener('click', resetEditor);
    }

    const applyBrandKitBtn = document.getElementById('applyBrandKitBtn');
    if (applyBrandKitBtn) {
        applyBrandKitBtn.addEventListener('click', () => {
            applyBrandKitToEditor({ notify: true, force: true });
        });
    }

    const finalizeMockupsBtn = document.getElementById('finalizeMockupsBtn');
    if (finalizeMockupsBtn) {
        finalizeMockupsBtn.addEventListener('click', finalizeMockupsForReport);
    }

    const closeEditorBtn = document.getElementById('closeEditorBtn');
    if (closeEditorBtn) {
        closeEditorBtn.addEventListener('click', closeEditor);
    }

    const usePreviewedMockupBtn = document.getElementById('usePreviewedMockupBtn');
    if (usePreviewedMockupBtn) {
        usePreviewedMockupBtn.addEventListener('click', usePreviewedMockup);
    }

    const closePreviewModalBtn = document.getElementById('closePreviewModalBtn');
    if (closePreviewModalBtn) {
        closePreviewModalBtn.addEventListener('click', closeModal);
    }

    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    setupListObserver();
}

function handleGridAction(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const id = Number(button.dataset.id);
    if (!Number.isFinite(id)) {
        return;
    }

    const action = button.dataset.action;
    try {
        if (action === 'preview') {
            previewMockup(id);
            return;
        }

        if (action === 'edit') {
            selectMockup(id);
            return;
        }

        if (action === 'favorite') {
            toggleFavorite(id, button);
            return;
        }

        if (action === 'collection') {
            addToActiveCollection(id);
        }
    } catch (error) {
        console.error('Erro ao executar ação do card de mockup:', error);
        alert('Não foi possível concluir a ação do mockup. Atualize a página e tente novamente.');
    }
}

function switchCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.nav-btn').forEach((btn) => btn.classList.remove('active'));
    const active = document.querySelector(`[data-category="${category}"]`);
    if (active) {
        active.classList.add('active');
    }
    loadMockups();
}

function loadMockups() {
    currentMockups = currentCategory === 'todos'
        ? [...allMockups]
        : [...(mockupsData[currentCategory] || [])];

    updateCatalogHighlights(currentMockups.length, currentMockups.length);
    filterMockups();
}

function filterMockups() {
    const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
    const orientation = document.getElementById('orientationFilter')?.value || 'todas';
    const quality = document.getElementById('qualityFilter')?.value || 'todas';
    const color = document.getElementById('colorFilter')?.value || 'todas';
    const sort = document.getElementById('sortFilter')?.value || 'popularidade';

    filteredMockups = currentMockups
        .filter((mockup) => {
            const inSearch = mockup.title.toLowerCase().includes(search) ||
                mockup.description.toLowerCase().includes(search) ||
                mockup.tags.some((tag) => tag.includes(search));
            const inOrientation = orientation === 'todas' || mockup.orientation === orientation;
            const inQuality = quality === 'todas' || mockup.quality === quality;
            const inColor = color === 'todas' || mockup.color === color;
            const inFavorites = !favoritesOnly || isFavorite(mockup.id);
            const inCollection = collectionFilterKey === 'all'
                || (libraryState.collections[collectionFilterKey] || []).includes(mockup.id);

            return inSearch && inOrientation && inQuality && inColor && inFavorites && inCollection;
        })
        .sort((a, b) => sortComparator(a, b, sort));

    renderedCount = 0;
    clearMockupGrid();
    renderNextPage();
    updateCatalogHighlights(filteredMockups.length, currentMockups.length);
}

function sortComparator(a, b, sort) {
    if (sort === 'az') {
        return a.title.localeCompare(b.title, 'pt-BR');
    }
    if (sort === 'za') {
        return b.title.localeCompare(a.title, 'pt-BR');
    }
    return b.popularity - a.popularity;
}

function renderMockupCards(list) {
    const grid = document.getElementById('mockupsGrid');
    if (!grid) {
        return;
    }

    list.forEach((mockup) => {
        const card = document.createElement('article');
        card.className = 'mockup-card';
        card.dataset.mockupId = String(mockup.id);
        if (selectedMockup && selectedMockup.id === mockup.id) {
            card.classList.add('selected');
        }
        const thumbSrc = getMockupThumbSrc(mockup);
        const favoriteClass = isFavorite(mockup.id) ? 'active' : '';
        card.innerHTML = `
            <div class="mockup-image">
                <img class="mockup-thumb" loading="lazy" alt="${escapeHtml(mockup.title)}" src="${escapeHtml(thumbSrc)}">
                <span class="quality-badge quality-${mockup.quality}">${mockup.quality.toUpperCase()}</span>
            </div>
            <div class="mockup-info">
                <h3 class="mockup-title">${escapeHtml(mockup.title)}</h3>
                <p class="mockup-description">${escapeHtml(mockup.description)}</p>
                    <div class="card-meta-actions">
                        <div class="mockup-meta">
                            <span class="meta-badge">${escapeHtml(getCategoryLabel(mockup.category))}</span>
                            <span class="meta-badge">${escapeHtml(mockup.orientation)}</span>
                            <span class="meta-badge">${escapeHtml(mockup.color)}</span>
                        </div>
                    <div class="quick-actions">
                        <button type="button" class="btn-icon ${favoriteClass}" title="Favoritar" data-action="favorite" data-id="${mockup.id}">
                            <i class="fas fa-star"></i>
                        </button>
                        <button type="button" class="btn-icon" title="Adicionar na colecao ativa" data-action="collection" data-id="${mockup.id}">
                            <i class="fas fa-folder-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="mockup-tags">${mockup.tags.slice(0, 4).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
                <div class="mockup-actions">
                    <button type="button" class="btn-primary" data-action="preview" data-id="${mockup.id}"><i class="fas fa-eye"></i> Visualizar</button>
                    <button type="button" class="btn-secondary" data-action="edit" data-id="${mockup.id}"><i class="fas fa-pen"></i> Editar</button>
                </div>
            </div>`;
        grid.appendChild(card);
    });
}

function clearMockupGrid() {
    const grid = document.getElementById('mockupsGrid');
    if (grid) {
        moveEditorToDockHome();
        grid.innerHTML = '';
    }
}

function renderNextPage() {
    const grid = document.getElementById('mockupsGrid');
    if (!grid) {
        return;
    }

    if (!filteredMockups.length) {
        grid.innerHTML = '<p class="empty-state">Nenhum mockup encontrado para os filtros aplicados.</p>';
        updateLoaderInfo();
        return;
    }

    const nextItems = filteredMockups.slice(renderedCount, renderedCount + PAGE_SIZE);
    renderMockupCards(nextItems);
    renderedCount += nextItems.length;
    repositionOpenEditor();
    updateLoaderInfo();
}

function updateLoaderInfo() {
    const loader = document.getElementById('listLoader');
    const info = document.getElementById('loadMoreInfo');
    const button = document.getElementById('loadMoreBtn');
    if (!loader || !info || !button) {
        return;
    }

    const remaining = Math.max(0, filteredMockups.length - renderedCount);
    const hasMore = remaining > 0;

    loader.style.display = filteredMockups.length ? 'flex' : 'none';
    button.disabled = !hasMore;
    button.style.opacity = hasMore ? '1' : '0.6';
    button.style.cursor = hasMore ? 'pointer' : 'default';
    info.textContent = hasMore
        ? `${renderedCount} de ${filteredMockups.length} mockups exibidos.`
        : `Todos os ${filteredMockups.length} mockups foram carregados.`;
}

function updateCatalogHighlights(currentCount, baseCount) {
    const total = document.getElementById('totalMockupsCount');
    if (total) {
        total.textContent = String(allMockups.length);
    }

    const active = document.getElementById('currentCategoryCount');
    if (active) {
        active.textContent = String(currentCount);
    }

    const favoriteCount = document.getElementById('favoriteCount');
    if (favoriteCount) {
        favoriteCount.textContent = String(libraryState.favorites.length);
    }
}

function getMockupThumbSrc(mockup) {
    if (uploadedImage) {
        const previewState = getPreviewEditorStateForMockup(mockup);
        const composed = buildMockupPreviewDataUrl(mockup, 640, 420, {
            showGuides: false,
            includeText: false,
            includeLogo: false,
            editorStateOverride: previewState
        });
        if (composed) {
            return composed;
        }
    }

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(generateCardPreviewSvg(mockup))}`;
}

function refreshVisibleMockupThumbnails() {
    const grid = document.getElementById('mockupsGrid');
    if (!grid) {
        return;
    }

    grid.querySelectorAll('article.mockup-card[data-mockup-id]').forEach((card) => {
        const id = Number(card.dataset.mockupId);
        if (!Number.isFinite(id)) {
            return;
        }

        const mockup = findMockupById(id);
        const thumb = card.querySelector('img.mockup-thumb');
        if (!mockup || !thumb) {
            return;
        }

        thumb.src = getMockupThumbSrc(mockup);
    });
}

function scheduleVisibleMockupThumbnailsRefresh(delayMs = 160) {
    if (!uploadedImage) {
        return;
    }

    if (thumbnailRefreshTimer) {
        clearTimeout(thumbnailRefreshTimer);
    }

    thumbnailRefreshTimer = window.setTimeout(() => {
        refreshVisibleMockupThumbnails();
        thumbnailRefreshTimer = null;
    }, Math.max(0, Number(delayMs) || 0));
}

function decorateCategoryButtons() {
    document.querySelectorAll('.nav-btn').forEach((button) => {
        const old = button.querySelector('.nav-count');
        if (old) {
            old.remove();
        }
        const category = button.dataset.category;
        const count = category === 'todos' ? allMockups.length : (mockupsData[category] || []).length;
        const badge = document.createElement('span');
        badge.className = 'nav-count';
        badge.textContent = String(count);
        button.appendChild(badge);
    });
}

function setupListObserver() {
    const sentinel = document.getElementById('mockupListSentinel');
    if (!sentinel || typeof IntersectionObserver === 'undefined') {
        return;
    }

    if (listObserver) {
        listObserver.disconnect();
    }

    listObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            if (renderedCount < filteredMockups.length) {
                renderNextPage();
            }
        });
    }, { rootMargin: '200px 0px 200px 0px' });

    listObserver.observe(sentinel);
}

function isFavorite(mockupId) {
    return libraryState.favorites.includes(mockupId);
}

function toggleFavorite(mockupId, button = null) {
    if (isFavorite(mockupId)) {
        libraryState.favorites = libraryState.favorites.filter((id) => id !== mockupId);
        if (button) {
            button.classList.remove('active');
        }
    } else {
        libraryState.favorites.push(mockupId);
        if (button) {
            button.classList.add('active');
        }
    }

    saveLibraryState();
    updateCatalogHighlights(filteredMockups.length, currentMockups.length);

    if (favoritesOnly) {
        filterMockups();
    }
}

function addToActiveCollection(mockupId) {
    const activeCollection = libraryState.activeCollection || DEFAULT_COLLECTION_KEY;
    ensureCollection(activeCollection);

    const collection = libraryState.collections[activeCollection];
    if (!collection.includes(mockupId)) {
        collection.push(mockupId);
    }

    saveLibraryState();
    refreshCollectionSelectors();

    if (collectionFilterKey === activeCollection) {
        filterMockups();
    } else {
        updateCatalogHighlights(filteredMockups.length, currentMockups.length);
    }
}

function createCollection() {
    const input = document.getElementById('newCollectionName');
    const rawName = (input?.value || '').trim();
    if (!rawName) {
        alert('Informe um nome para a nova colecao.');
        return;
    }

    const key = slugify(rawName);
    if (!key) {
        alert('Nome de coleção inválido.');
        return;
    }

    if (libraryState.collections[key]) {
        alert('Ja existe uma colecao com esse nome.');
        return;
    }

    libraryState.collectionNames[key] = rawName;
    libraryState.collections[key] = [];
    libraryState.activeCollection = key;

    if (input) {
        input.value = '';
    }

    saveLibraryState();
    refreshCollectionSelectors();
}

function deleteCollection() {
    const current = libraryState.activeCollection || DEFAULT_COLLECTION_KEY;
    if (current === DEFAULT_COLLECTION_KEY) {
        alert('A coleção principal não pode ser removida.');
        return;
    }

    delete libraryState.collections[current];
    delete libraryState.collectionNames[current];

    if (collectionFilterKey === current) {
        collectionFilterKey = 'all';
    }

    libraryState.activeCollection = DEFAULT_COLLECTION_KEY;
    saveLibraryState();
    refreshCollectionSelectors();
    filterMockups();
}

function refreshCollectionSelectors() {
    ensureCollection(DEFAULT_COLLECTION_KEY);

    const filterSelect = document.getElementById('collectionFilter');
    const targetSelect = document.getElementById('collectionTargetSelect');
    const collections = Object.keys(libraryState.collections).sort((a, b) => {
        const aName = libraryState.collectionNames[a] || a;
        const bName = libraryState.collectionNames[b] || b;
        return aName.localeCompare(bName, 'pt-BR');
    });

    if (filterSelect) {
        filterSelect.innerHTML = '<option value="all">Todas</option>';
        collections.forEach((key) => {
            const count = (libraryState.collections[key] || []).length;
            const name = libraryState.collectionNames[key] || key;
            filterSelect.insertAdjacentHTML(
                'beforeend',
                `<option value="${escapeHtml(key)}">${escapeHtml(name)} (${count})</option>`
            );
        });

        if (!filterSelect.querySelector(`option[value="${collectionFilterKey}"]`)) {
            collectionFilterKey = 'all';
            libraryState.collectionFilter = 'all';
        }
        filterSelect.value = collectionFilterKey;
    }

    if (targetSelect) {
        targetSelect.innerHTML = '';
        collections.forEach((key) => {
            const name = libraryState.collectionNames[key] || key;
            targetSelect.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(key)}">${escapeHtml(name)}</option>`);
        });

        if (!targetSelect.querySelector(`option[value="${libraryState.activeCollection}"]`)) {
            libraryState.activeCollection = DEFAULT_COLLECTION_KEY;
        }

        targetSelect.value = libraryState.activeCollection;
    }
}

function ensureCollection(key) {
    if (!libraryState.collections[key]) {
        libraryState.collections[key] = [];
    }
    if (!libraryState.collectionNames[key]) {
        libraryState.collectionNames[key] = key === DEFAULT_COLLECTION_KEY ? 'Geral' : key;
    }
}

function createDefaultLibraryState() {
    return {
        favorites: [],
        favoritesOnly: false,
        collectionFilter: 'all',
        activeCollection: DEFAULT_COLLECTION_KEY,
        collectionNames: {
            [DEFAULT_COLLECTION_KEY]: 'Geral'
        },
        collections: {
            [DEFAULT_COLLECTION_KEY]: []
        }
    };
}

function loadLibraryState() {
    const fallback = createDefaultLibraryState();
    if (typeof localStorage === 'undefined') {
        libraryState = fallback;
        return;
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            libraryState = fallback;
            return;
        }

        const parsed = JSON.parse(raw);
        const rawCollections = typeof parsed.collections === 'object' && parsed.collections !== null ? parsed.collections : {};
        const normalizedCollections = {};
        Object.keys(rawCollections).forEach((key) => {
            const values = Array.isArray(rawCollections[key]) ? rawCollections[key] : [];
            normalizedCollections[key] = values.map((id) => Number(id)).filter(Number.isFinite);
        });

        libraryState = {
            favorites: Array.isArray(parsed.favorites) ? parsed.favorites.map((id) => Number(id)).filter(Number.isFinite) : [],
            favoritesOnly: Boolean(parsed.favoritesOnly),
            collectionFilter: typeof parsed.collectionFilter === 'string' ? parsed.collectionFilter : 'all',
            activeCollection: typeof parsed.activeCollection === 'string' ? parsed.activeCollection : DEFAULT_COLLECTION_KEY,
            collectionNames: typeof parsed.collectionNames === 'object' && parsed.collectionNames !== null ? parsed.collectionNames : {},
            collections: normalizedCollections
        };
    } catch (error) {
        libraryState = fallback;
    }

    ensureCollection(DEFAULT_COLLECTION_KEY);
    favoritesOnly = libraryState.favoritesOnly;
    collectionFilterKey = libraryState.collectionFilter;
}

function saveLibraryState() {
    if (typeof localStorage === 'undefined') {
        return;
    }

    try {
        libraryState.favoritesOnly = favoritesOnly;
        libraryState.collectionFilter = collectionFilterKey;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(libraryState));
    } catch (error) {
        // Ignora falhas de quota ou privacidade.
    }
}

function loadEditorState() {
    if (typeof localStorage === 'undefined') {
        editorState = normalizeEditorStateSnapshot(DEFAULT_EDITOR_STATE);
        hasPersistedEditorState = false;
        return;
    }

    try {
        const raw = localStorage.getItem(EDITOR_STORAGE_KEY);
        if (!raw) {
            editorState = normalizeEditorStateSnapshot(DEFAULT_EDITOR_STATE);
            hasPersistedEditorState = false;
            return;
        }

        const parsed = JSON.parse(raw);
        editorState = normalizeEditorStateSnapshot(parsed);
        hasPersistedEditorState = true;
    } catch (error) {
        editorState = normalizeEditorStateSnapshot(DEFAULT_EDITOR_STATE);
        hasPersistedEditorState = false;
    }
}

function saveEditorState() {
    if (typeof localStorage === 'undefined') {
        return;
    }

    try {
        localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(editorState));
    } catch (error) {
        // Ignora falhas de quota ou privacidade.
    }
}

function normalizeEditorStateSnapshot(snapshot) {
    const normalized = {
        ...DEFAULT_EDITOR_STATE,
        ...(snapshot && typeof snapshot === 'object' ? snapshot : {})
    };

    normalized.canvasPreset = CANVAS_PRESETS[normalized.canvasPreset]
        ? normalized.canvasPreset
        : DEFAULT_EDITOR_STATE.canvasPreset;
    normalized.backgroundPreset = String(normalized.backgroundPreset || DEFAULT_EDITOR_STATE.backgroundPreset);
    normalized.bgColorStart = normalizeHexColor(normalized.bgColorStart, DEFAULT_EDITOR_STATE.bgColorStart).toLowerCase();
    normalized.bgColorEnd = normalizeHexColor(normalized.bgColorEnd, DEFAULT_EDITOR_STATE.bgColorEnd).toLowerCase();
    normalized.mockupProductColor = normalizeHexColor(
        normalized.mockupProductColor,
        DEFAULT_EDITOR_STATE.mockupProductColor
    ).toLowerCase();

    normalized.positionX = clampNumber(normalized.positionX, 0, 100);
    normalized.positionY = clampNumber(normalized.positionY, 0, 100);
    normalized.scale = Math.max(0.05, Number(normalized.scale) || DEFAULT_EDITOR_STATE.scale);
    normalized.imageLayoutMode = resolveLayoutMode(normalized.imageLayoutMode);
    if (normalized.imageLayoutMode === 'fit-fill' && normalized.scale < 1) {
        normalized.scale = 1;
    }
    normalized.rotation = clampNumber(normalized.rotation, -180, 180);
    normalized.opacity = clampNumber(normalized.opacity, 0.2, 1);
    normalized.shadow = clampNumber(normalized.shadow, 0, 40);
    normalized.radius = clampNumber(normalized.radius, 0, 48);
    normalized.filter = String(normalized.filter || DEFAULT_EDITOR_STATE.filter);
    normalized.showGuides = Boolean(normalized.showGuides);
    normalized.flipHorizontal = Boolean(normalized.flipHorizontal);
    normalized.flipVertical = Boolean(normalized.flipVertical);

    normalized.textEnabled = Boolean(normalized.textEnabled);
    normalized.textPrimary = String(normalized.textPrimary || '').slice(0, 120);
    normalized.textSecondary = String(normalized.textSecondary || '').slice(0, 160);
    normalized.textFont = String(normalized.textFont || DEFAULT_EDITOR_STATE.textFont);
    normalized.textAlign = String(normalized.textAlign || DEFAULT_EDITOR_STATE.textAlign);
    normalized.textColor = normalizeHexColor(normalized.textColor, DEFAULT_EDITOR_STATE.textColor).toLowerCase();
    normalized.textSize = clampNumber(normalized.textSize, 22, 96);
    normalized.textPositionX = clampNumber(normalized.textPositionX, 0, 100);
    normalized.textPositionY = clampNumber(normalized.textPositionY, 0, 100);

    normalized.logoScale = clampNumber(normalized.logoScale, 0.1, 1.8);
    normalized.logoOpacity = clampNumber(normalized.logoOpacity, 0.1, 1);
    normalized.logoPositionX = clampNumber(normalized.logoPositionX, 0, 100);
    normalized.logoPositionY = clampNumber(normalized.logoPositionY, 0, 100);

    normalized.exportFormat = String(normalized.exportFormat || DEFAULT_EDITOR_STATE.exportFormat);
    normalized.exportQuality = clampNumber(normalized.exportQuality, 55, 100);
    normalized.exportScale = Math.max(1, Math.min(2, Number(normalized.exportScale) || DEFAULT_EDITOR_STATE.exportScale));

    return normalized;
}

function createInitialEditorStateForMockup(mockup) {
    const initial = normalizeEditorStateSnapshot({
        ...DEFAULT_EDITOR_STATE,
        backgroundPreset: editorState.backgroundPreset || DEFAULT_EDITOR_STATE.backgroundPreset,
        bgColorStart: editorState.bgColorStart || DEFAULT_EDITOR_STATE.bgColorStart,
        bgColorEnd: editorState.bgColorEnd || DEFAULT_EDITOR_STATE.bgColorEnd,
        mockupProductColor: editorState.mockupProductColor || workInfoState.productColor || DEFAULT_EDITOR_STATE.mockupProductColor,
        textFont: editorState.textFont || DEFAULT_EDITOR_STATE.textFont,
        textColor: editorState.textColor || DEFAULT_EDITOR_STATE.textColor,
        textEnabled: editorState.textEnabled,
        showGuides: editorState.showGuides,
        exportFormat: editorState.exportFormat || DEFAULT_EDITOR_STATE.exportFormat,
        exportQuality: editorState.exportQuality || DEFAULT_EDITOR_STATE.exportQuality,
        exportScale: editorState.exportScale || DEFAULT_EDITOR_STATE.exportScale
    });

    if (mockup) {
        initial.textPrimary = mockup.title;
        initial.textSecondary = `${getCategoryLabel(mockup.category)} | ${mockup.orientation}`;
    }

    return initial;
}

function loadEditorStateByMockup() {
    if (typeof localStorage === 'undefined') {
        editorStateByMockup = {};
        return;
    }

    try {
        const raw = localStorage.getItem(EDITOR_STATE_BY_MOCKUP_STORAGE_KEY);
        if (!raw) {
            editorStateByMockup = {};
            return;
        }

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') {
            editorStateByMockup = {};
            return;
        }

        const next = {};
        Object.keys(parsed).forEach((key) => {
            const id = Number(key);
            if (!Number.isFinite(id)) {
                return;
            }
            next[String(id)] = normalizeEditorStateSnapshot(parsed[key]);
        });
        editorStateByMockup = next;
    } catch (error) {
        editorStateByMockup = {};
    }
}

function saveEditorStateByMockup() {
    if (typeof localStorage === 'undefined') {
        return;
    }

    try {
        localStorage.setItem(EDITOR_STATE_BY_MOCKUP_STORAGE_KEY, JSON.stringify(editorStateByMockup));
    } catch (error) {
        // Ignora falhas de quota ou privacidade.
    }
}

function persistSelectedMockupEditorState() {
    const mockupId = Number(selectedMockup?.id);
    if (!Number.isFinite(mockupId)) {
        return;
    }

    editorStateByMockup[String(mockupId)] = normalizeEditorStateSnapshot(editorState);
}

function resolveEditorStateForMockup(mockup, options = {}) {
    if (!mockup || !Number.isFinite(Number(mockup.id))) {
        return normalizeEditorStateSnapshot(editorState);
    }

    const key = String(Number(mockup.id));
    const stored = editorStateByMockup[key];
    if (stored && typeof stored === 'object') {
        return normalizeEditorStateSnapshot(stored);
    }

    const initial = createInitialEditorStateForMockup(mockup);
    if (options.persistIfMissing) {
        editorStateByMockup[key] = initial;
        if (options.saveNow) {
            saveEditorStateByMockup();
        }
    }
    return initial;
}

function getPreviewEditorStateForMockup(mockup) {
    if (!mockup) {
        return normalizeEditorStateSnapshot(editorState);
    }

    const selectedId = Number(selectedMockup?.id);
    const mockupId = Number(mockup.id);
    if (Number.isFinite(selectedId) && selectedId === mockupId) {
        return normalizeEditorStateSnapshot(editorState);
    }

    return resolveEditorStateForMockup(mockup, { persistIfMissing: false });
}

function createDefaultWorkInfoState() {
    return {
        title: '',
        mainTag: '',
        supportingTags: '',
        description: '',
        backgroundColor: '#FFFFFF',
        productColor: '#FFFFFF'
    };
}

function loadWorkInfoState() {
    const fallback = createDefaultWorkInfoState();
    if (typeof localStorage === 'undefined') {
        workInfoState = fallback;
        return;
    }

    try {
        const raw = localStorage.getItem(WORK_INFO_STORAGE_KEY);
        if (!raw) {
            workInfoState = fallback;
            return;
        }

        const parsed = JSON.parse(raw);
        const resolvedProductColor = normalizeHexColor(
            parsed.productColor || parsed.backgroundColor,
            '#FFFFFF'
        );
        workInfoState = {
            title: String(parsed.title || '').slice(0, 120),
            mainTag: String(parsed.mainTag || '').slice(0, 50),
            supportingTags: String(parsed.supportingTags || '').slice(0, 900),
            description: String(parsed.description || '').slice(0, 1600),
            backgroundColor: resolvedProductColor,
            productColor: resolvedProductColor
        };
    } catch (error) {
        workInfoState = fallback;
    }
}

function saveWorkInfoState() {
    if (typeof localStorage === 'undefined') {
        return;
    }

    try {
        localStorage.setItem(WORK_INFO_STORAGE_KEY, JSON.stringify(workInfoState));
    } catch (error) {
        // Ignora falhas de quota.
    }
}

function initializeWorkIntakeForm() {
    const titleInput = document.getElementById('workTitleInput');
    const mainTagInput = document.getElementById('workMainTagInput');
    const supportingTagsInput = document.getElementById('workSupportingTagsInput');
    const descriptionInput = document.getElementById('workDescriptionInput');
    const colorInput = document.getElementById('workBackgroundColor');
    const hexInput = document.getElementById('workBackgroundHex');

    if (!titleInput && !mainTagInput && !supportingTagsInput && !descriptionInput && !colorInput && !hexInput) {
        return;
    }

    if (titleInput) {
        titleInput.value = workInfoState.title;
        titleInput.addEventListener('input', () => {
            workInfoState.title = String(titleInput.value || '').slice(0, 120);
            saveWorkInfoState();
        });
    }

    if (mainTagInput) {
        mainTagInput.value = workInfoState.mainTag;
        mainTagInput.addEventListener('input', () => {
            workInfoState.mainTag = String(mainTagInput.value || '').slice(0, 50);
            saveWorkInfoState();
        });
    }

    if (supportingTagsInput) {
        supportingTagsInput.value = workInfoState.supportingTags;
        supportingTagsInput.addEventListener('input', () => {
            workInfoState.supportingTags = String(supportingTagsInput.value || '').slice(0, 900);
            saveWorkInfoState();
        });
    }

    if (descriptionInput) {
        descriptionInput.value = workInfoState.description;
        descriptionInput.addEventListener('input', () => {
            workInfoState.description = String(descriptionInput.value || '').slice(0, 1600);
            saveWorkInfoState();
        });
    }

    if (colorInput) {
        colorInput.value = normalizeHexColor(workInfoState.backgroundColor, '#FFFFFF').toLowerCase();
        colorInput.addEventListener('input', () => {
            const normalized = normalizeHexColor(colorInput.value, workInfoState.backgroundColor);
            workInfoState.backgroundColor = normalized;
            if (hexInput) {
                hexInput.value = normalized.toUpperCase();
            }
            applyWorkBackgroundColorToEditor(normalized);
            saveWorkInfoState();
        });
    }

    if (hexInput) {
        hexInput.value = normalizeHexColor(workInfoState.backgroundColor, '#FFFFFF').toUpperCase();
        hexInput.addEventListener('input', () => {
            const value = String(hexInput.value || '').toUpperCase();
            hexInput.value = value.slice(0, 7);
        });
        hexInput.addEventListener('blur', () => {
            const normalized = normalizeHexColor(hexInput.value, workInfoState.backgroundColor);
            workInfoState.backgroundColor = normalized;
            hexInput.value = normalized.toUpperCase();
            if (colorInput) {
                colorInput.value = normalized.toLowerCase();
            }
            applyWorkBackgroundColorToEditor(normalized);
            saveWorkInfoState();
        });
    }

    const normalizedColor = normalizeHexColor(workInfoState.backgroundColor, '#FFFFFF');
    workInfoState.backgroundColor = normalizedColor;
    workInfoState.productColor = normalizedColor;
    applyWorkBackgroundColorToEditor(normalizedColor);
}

function syncWorkTitleFromFileName(fileName) {
    const titleInput = document.getElementById('workTitleInput');
    if (!titleInput || String(titleInput.value || '').trim()) {
        return;
    }

    const cleaned = String(fileName || '')
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!cleaned) {
        return;
    }

    titleInput.value = cleaned.slice(0, 120);
    workInfoState.title = titleInput.value;
    saveWorkInfoState();
}

function applyWorkBackgroundColorToEditor(hexColor) {
    const normalized = normalizeHexColor(hexColor, '#FFFFFF').toLowerCase();

    workInfoState.backgroundColor = normalized.toUpperCase();
    workInfoState.productColor = normalized.toUpperCase();

    const productColorControl = document.getElementById('mockupProductColor');
    if (productColorControl) {
        productColorControl.value = normalized;
    }

    editorState.mockupProductColor = normalized;
    scheduleEditorStateSave();
    renderCanvas();
    scheduleVisibleMockupThumbnailsRefresh(80);
}

function normalizeHexColor(rawValue, fallback = '#FFFFFF') {
    const value = String(rawValue || '').trim().replace(/[^#0-9a-fA-F]/g, '');
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
        return value.toUpperCase();
    }
    if (/^[0-9a-fA-F]{6}$/.test(value)) {
        return `#${value.toUpperCase()}`;
    }
    return String(fallback || '#FFFFFF').toUpperCase();
}

function openUploadBridgeDb() {
    if (typeof indexedDB === 'undefined') {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(UPLOAD_BRIDGE_DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(UPLOAD_BRIDGE_STORE_NAME)) {
                db.createObjectStore(UPLOAD_BRIDGE_STORE_NAME);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error('upload_bridge_open_failed'));
    });
}

async function runUploadBridgeTx(mode, operation) {
    const db = await openUploadBridgeDb();
    if (!db) {
        return null;
    }

    return new Promise((resolve, reject) => {
        const tx = db.transaction(UPLOAD_BRIDGE_STORE_NAME, mode);
        const store = tx.objectStore(UPLOAD_BRIDGE_STORE_NAME);
        let request = null;
        let result = null;

        try {
            request = operation(store) || null;
        } catch (error) {
            db.close();
            reject(error);
            return;
        }

        if (request) {
            request.onsuccess = () => {
                result = request.result;
            };
        }

        tx.oncomplete = () => {
            db.close();
            resolve(result);
        };
        tx.onerror = () => {
            db.close();
            reject(tx.error || new Error('upload_bridge_tx_failed'));
        };
        tx.onabort = () => {
            db.close();
            reject(tx.error || new Error('upload_bridge_tx_aborted'));
        };
    });
}

async function persistUploadToBridge(file) {
    if (!(file instanceof Blob)) {
        return false;
    }

    const payload = {
        blob: file,
        name: String(file.name || 'arte.png'),
        type: String(file.type || inferMimeFromExtension(file.name || 'arte.png')),
        lastModified: Number(file.lastModified || Date.now())
    };

    try {
        await runUploadBridgeTx('readwrite', (store) => store.put(payload, UPLOAD_BRIDGE_KEY));
        return true;
    } catch (error) {
        return false;
    }
}

async function readUploadFromBridge() {
    try {
        const payload = await runUploadBridgeTx('readonly', (store) => store.get(UPLOAD_BRIDGE_KEY));
        if (!payload || !(payload.blob instanceof Blob)) {
            return null;
        }

        const fileName = sanitizeFileName(payload.name || 'arte.png');
        const fileType = String(payload.type || payload.blob.type || 'image/png');
        const lastModified = Number(payload.lastModified || Date.now());
        return createFileLike(payload.blob, fileName, fileType, lastModified);
    } catch (error) {
        return null;
    }
}

async function readUploadFromSessionBridge() {
    try {
        const raw = sessionStorage.getItem(UPLOAD_BRIDGE_SESSION_KEY);
        if (!raw) {
            return null;
        }

        const payload = JSON.parse(raw);
        if (!payload || typeof payload.dataUrl !== 'string' || !payload.dataUrl.startsWith('data:image/')) {
            return null;
        }

        const response = await fetch(payload.dataUrl);
        const blob = await response.blob();
        const fileName = sanitizeFileName(payload.name || 'arte.png');
        const fileType = String(payload.type || blob.type || 'image/png');
        const lastModified = Number(payload.lastModified || Date.now());
        return createFileLike(blob, fileName, fileType, lastModified);
    } catch (error) {
        return null;
    }
}

async function readUploadFromServerBridge() {
    try {
        const response = await fetch(`${UPLOAD_BRIDGE_ENDPOINT}?action=read`, {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store'
        });

        if (!response.ok) {
            return null;
        }

        const metadata = await response.json();
        if (!metadata || !metadata.ok || typeof metadata.streamUrl !== 'string') {
            return null;
        }

        const streamResponse = await fetch(metadata.streamUrl, {
            method: 'GET',
            credentials: 'same-origin',
            cache: 'no-store'
        });

        if (!streamResponse.ok) {
            return null;
        }

        const blob = await streamResponse.blob();
        const fileName = sanitizeFileName(metadata.name || 'arte.png');
        const fileType = String(metadata.type || blob.type || 'image/png');
        const lastModified = Number(metadata.lastModified || Date.now());
        return createFileLike(blob, fileName, fileType, lastModified);
    } catch (error) {
        return null;
    }
}

function createFileLike(blob, fileName, fileType, lastModified) {
    const safeName = sanitizeFileName(fileName || 'arte.png');
    const safeType = String(fileType || blob?.type || inferMimeFromExtension(safeName));
    const safeLastModified = Number(lastModified || Date.now());

    if (typeof File !== 'undefined') {
        try {
            return new File([blob], safeName, { type: safeType, lastModified: safeLastModified });
        } catch (error) {
            // fallback para navegadores com restricao no construtor File.
        }
    }

    const fallbackBlob = blob instanceof Blob ? blob.slice(0, blob.size, safeType) : new Blob([blob], { type: safeType });
    try {
        Object.defineProperty(fallbackBlob, 'name', { value: safeName, configurable: true });
    } catch (error) {
        fallbackBlob.name = safeName;
    }
    try {
        Object.defineProperty(fallbackBlob, 'lastModified', { value: safeLastModified, configurable: true });
    } catch (error) {
        fallbackBlob.lastModified = safeLastModified;
    }
    return fallbackBlob;
}

async function clearUploadBridge() {
    try {
        await runUploadBridgeTx('readwrite', (store) => store.delete(UPLOAD_BRIDGE_KEY));
    } catch (error) {
        // Nada a fazer.
    }

    try {
        sessionStorage.removeItem(UPLOAD_BRIDGE_SESSION_KEY);
    } catch (error) {
        // Nada a fazer.
    }

    try {
        await fetch(`${UPLOAD_BRIDGE_ENDPOINT}?action=clear`, {
            method: 'POST',
            credentials: 'same-origin',
            cache: 'no-store'
        });
    } catch (error) {
        // Nada a fazer.
    }
}

async function restoreUploadFromBridge() {
    const bridgeReaders = [
        readUploadFromBridge,
        readUploadFromSessionBridge,
        readUploadFromServerBridge
    ];

    const expectsInitialUpload = hasPendingInitialUploadValidation();
    const maxAttempts = expectsInitialUpload ? 4 : 2;
    let restored = false;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        for (const readFromBridge of bridgeReaders) {
            let bridgedFile = null;
            try {
                bridgedFile = await readFromBridge();
            } catch (error) {
                bridgedFile = null;
            }

            if (!bridgedFile) {
                continue;
            }

            const applied = await processUploadedArtworkFile(bridgedFile, {
                persistToBridge: false,
                preserveScroll: false,
                skipFormatValidation: true
            });

            if (applied) {
                restored = true;
                break;
            }
        }

        if (restored) {
            break;
        }

        if (attempt < maxAttempts - 1) {
            await waitMilliseconds(220 + (attempt * 180));
        }
    }

    if (!restored) {
        if (expectsInitialUpload) {
            updateUploadFeedback({
                status: 'error',
                message: 'A imagem validada não foi restaurada automaticamente. Clique em "Trocar imagem" para reenviar.'
            });
        }
        try {
            sessionStorage.removeItem(UPLOAD_VALIDATION_SESSION_KEY);
        } catch (error) {
            // ignora falha de storage
        }
        return;
    }

    await clearUploadBridge();

    try {
        sessionStorage.removeItem(UPLOAD_VALIDATION_SESSION_KEY);
    } catch (error) {
        // ignora falha de storage
    }
}

function hasPendingInitialUploadValidation() {
    try {
        const raw = sessionStorage.getItem(UPLOAD_VALIDATION_SESSION_KEY);
        return Boolean(raw);
    } catch (error) {
        return false;
    }
}

function waitMilliseconds(duration) {
    const waitFor = Math.max(0, Number(duration) || 0);
    return new Promise((resolve) => {
        window.setTimeout(resolve, waitFor);
    });
}

function getBrandKitApi() {
    return window.AQBrandKit || null;
}

function applySharedBrandDefaults() {
    applyBrandKitToEditor({ notify: false, force: true, silentIfUnavailable: true });
}

function mapBrandFontToMockupFont(fontKeyOrName) {
    const normalized = String(fontKeyOrName || '').toLowerCase().trim();
    if (!normalized) {
        return DEFAULT_EDITOR_STATE.textFont;
    }
    if (BRAND_SYNC_FONTS.includes(normalized)) {
        return normalized;
    }

    if (normalized.includes('playfair')) return 'playfair';
    if (normalized.includes('bebas')) return 'bebas';
    if (normalized.includes('lora') || normalized.includes('merriweather') || normalized.includes('slab')) return 'lora';
    if (normalized.includes('poppins') || normalized.includes('manrope')) return 'poppins';
    if (normalized.includes('inter') || normalized.includes('montserrat') || normalized.includes('sans')) return 'montserrat';

    return DEFAULT_EDITOR_STATE.textFont;
}

function getMockupFontDisplayName(fontKey) {
    const labels = {
        montserrat: 'Montserrat',
        poppins: 'Poppins',
        lora: 'Lora',
        bebas: 'Bebas Neue',
        playfair: 'Playfair Display'
    };
    return labels[fontKey] || 'Montserrat';
}

function resolveReadableTextColor(primaryColor, fallback = DEFAULT_EDITOR_STATE.textColor) {
    const hex = String(primaryColor || '').replace('#', '');
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
        return fallback;
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.56 ? '#f8fafc' : '#0f172a';
}

function applyBrandKitToEditor(options = {}) {
    const notify = Boolean(options.notify);
    const force = Boolean(options.force);
    const silentIfUnavailable = Boolean(options.silentIfUnavailable);
    const api = getBrandKitApi();

    if (!api || !api.getIntegrationSnapshot) {
        if (notify && !silentIfUnavailable) {
            alert('Brand Kit indisponível no momento.');
        }
        return false;
    }

    const snapshot = api.getIntegrationSnapshot();
    const brandKit = snapshot?.brandKit || {};
    const colors = brandKit.brandColors || {};
    const paletteColors = Array.isArray(brandKit?.palette?.colors) ? brandKit.palette.colors : [];
    const typography = brandKit.typography || {};

    const primary = api.normalizeHex(colors.primary || paletteColors[0], editorState.bgColorStart || DEFAULT_EDITOR_STATE.bgColorStart);
    const secondary = api.normalizeHex(colors.secondary || paletteColors[1], editorState.bgColorEnd || DEFAULT_EDITOR_STATE.bgColorEnd);
    const accent = api.normalizeHex(colors.accent || paletteColors[2], editorState.textColor || DEFAULT_EDITOR_STATE.textColor);
    const neutral = api.normalizeHex(colors.neutral || paletteColors[3], editorState.textColor || DEFAULT_EDITOR_STATE.textColor);
    const fontKey = mapBrandFontToMockupFont(typography.primaryFontKey || typography.primaryFontName);

    if (!force && hasPersistedEditorState) {
        return false;
    }

    editorState.bgColorStart = primary;
    editorState.bgColorEnd = secondary;
    editorState.mockupProductColor = primary;
    editorState.textColor = resolveReadableTextColor(neutral, accent);
    editorState.textFont = fontKey;
    applyEditorStateToControls();
    updateEditorMeta();
    persistSelectedMockupEditorState();
    saveEditorState();
    saveEditorStateByMockup();
    renderCanvas();

    if (notify) {
        alert('Cores e tipografia da marca aplicadas ao editor de mockups.');
    }

    return true;
}

function syncBrandKitFromEditorState() {
    const api = getBrandKitApi();
    if (!api) {
        return;
    }

    const paletteColors = api.uniqueColors([
        editorState.mockupProductColor,
        editorState.bgColorStart,
        editorState.bgColorEnd,
        editorState.textColor
    ]);

    api.syncColorPalette({
        baseColor: editorState.mockupProductColor || editorState.bgColorStart,
        type: 'mockup-editor',
        title: 'Paleta aplicada no editor de mockups',
        description: 'Cores utilizadas na composicao de mockups.',
        colors: paletteColors
    }, 'mockups');

    api.syncTypography({
        pairingStyle: 'mockups-editor',
        tone: 'aplicado em mockups',
        notes: 'Fonte ativa no editor de mockups.',
        primaryFontKey: editorState.textFont,
        primaryFontName: getMockupFontDisplayName(editorState.textFont),
        secondaryFontKey: editorState.textFont,
        secondaryFontName: getMockupFontDisplayName(editorState.textFont)
    }, 'mockups');
}

function slugify(value) {
    return String(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function previewMockup(id) {
    const previewTarget = findMockupById(id);
    if (!previewTarget) {
        return;
    }
    pendingPreviewMockupId = previewTarget.id;

    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        const previewState = resolveEditorStateForMockup(previewTarget, { persistIfMissing: false });
        if (uploadedImage) {
            const composedPreview = buildMockupPreviewDataUrl(previewTarget, 1080, 720, {
                showGuides: false,
                includeText: true,
                includeLogo: true,
                editorStateOverride: previewState
            });
            previewImage.src = composedPreview || `data:image/svg+xml;charset=utf-8,${encodeURIComponent(generatePreviewSvg(previewTarget))}`;
        } else {
            previewImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(generatePreviewSvg(previewTarget))}`;
        }
    }

    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal() {
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function usePreviewedMockup() {
    const targetId = Number(pendingPreviewMockupId);
    if (!Number.isFinite(targetId)) {
        closeModal();
        return;
    }

    selectMockup(targetId);
}

function getEditorInlineAnchor() {
    return document.getElementById('editorInlineAnchor');
}

function moveEditorToDockHome() {
    const editor = document.getElementById('editorSection');
    const anchor = getEditorInlineAnchor();
    if (!editor) {
        return;
    }

    if (!editorDockHome) {
        editorDockHome = document.getElementById('editorDockHome');
    }
    if (!editorDockHome) {
        const container = document.querySelector('.main .container') || document.body;
        editorDockHome = document.createElement('div');
        editorDockHome.id = 'editorDockHome';
        container.appendChild(editorDockHome);
    }

    if (editorDockHome && editor.parentElement !== editorDockHome) {
        editorDockHome.appendChild(editor);
    }
    editor.classList.remove('editor-inline');

    if (anchor && anchor.parentElement) {
        anchor.parentElement.removeChild(anchor);
    }
}

function dockEditorBelowMockup(mockupId) {
    const editor = document.getElementById('editorSection');
    const grid = document.getElementById('mockupsGrid');
    if (!editor || !grid || !mockupId) {
        return false;
    }

    const card = grid.querySelector(`article.mockup-card[data-mockup-id="${mockupId}"]`);
    if (!card) {
        return false;
    }

    let anchor = getEditorInlineAnchor();
    if (!anchor) {
        anchor = document.createElement('div');
        anchor.id = 'editorInlineAnchor';
        anchor.className = 'editor-inline-anchor';
    }

    card.insertAdjacentElement('afterend', anchor);
    anchor.appendChild(editor);
    editor.classList.add('editor-inline');
    return true;
}

function highlightSelectedMockupCard() {
    const grid = document.getElementById('mockupsGrid');
    if (!grid) {
        return;
    }

    grid.querySelectorAll('article.mockup-card').forEach((card) => {
        const cardId = Number(card.dataset.mockupId);
        const isSelected = selectedMockup && selectedMockup.id === cardId;
        card.classList.toggle('selected', Boolean(isSelected));
    });
}

function repositionOpenEditor() {
    const editor = document.getElementById('editorSection');
    if (!editor || editor.style.display === 'none' || !selectedMockup) {
        return;
    }

    const docked = dockEditorBelowMockup(selectedMockup.id);
    if (!docked) {
        moveEditorToDockHome();
    }
    highlightSelectedMockupCard();
}

function selectMockup(id = null) {
    const previousMockupId = Number(selectedMockup?.id);
    if (Number.isFinite(previousMockupId)) {
        persistSelectedMockupEditorState();
    }

    selectedMockup = id ? findMockupById(id) : selectedMockup;
    if (!selectedMockup) {
        return;
    }
    pendingPreviewMockupId = selectedMockup.id;

    editorState = resolveEditorStateForMockup(selectedMockup, {
        persistIfMissing: true,
        saveNow: false
    });

    closeModal();
    const editor = document.getElementById('editorSection');
    if (editor) {
        editor.style.display = 'block';
    }
    const dockedInline = dockEditorBelowMockup(selectedMockup.id);
    if (!dockedInline) {
        moveEditorToDockHome();
    }
    highlightSelectedMockupCard();

    const title = document.getElementById('editorMockupTitle');
    if (title) {
        title.textContent = selectedMockup.title;
    }
    updateEditorMeta();
    applyEditorStateToControls();

    const hint = document.getElementById('editorHint');
    if (hint) {
        hint.textContent = uploadedImage
            ? 'Ajuste os controles para refinar o encaixe da arte no mockup.'
            : 'Faca upload de uma imagem para aplicar no mockup selecionado.';
    }

    persistSelectedMockupEditorState();
    saveEditorState();
    saveEditorStateByMockup();
    renderCanvas();
}

function closeEditor() {
    persistSelectedMockupEditorState();
    saveEditorState();
    saveEditorStateByMockup();

    const editor = document.getElementById('editorSection');
    if (editor) {
        editor.style.display = 'none';
        editor.classList.remove('editor-inline');
    }
    moveEditorToDockHome();
    document.querySelectorAll('article.mockup-card.selected').forEach((card) => card.classList.remove('selected'));
}

async function handleFileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
        return;
    }

    await processUploadedArtworkFile(file, {
        persistToBridge: true,
        preserveScroll: true
    });

    if (event.target) {
        event.target.value = '';
    }
}

async function processUploadedArtworkFile(file, options = {}) {
    if (!file) {
        return false;
    }

    const persistToBridge = options.persistToBridge !== false;
    const preserveScroll = options.preserveScroll !== false;
    const skipFormatValidation = options.skipFormatValidation === true;
    const scrollPositionBeforeUpload = window.scrollY || window.pageYOffset || 0;

    if (!skipFormatValidation && !isSupportedUploadFile(file)) {
        updateUploadFeedback({
            status: 'error',
            message: 'Formato não suportado. Envie PNG, JPEG ou SVG.'
        });
        return false;
    }

    try {
        const image = await loadArtworkImage(file);
        let previewSrc = '';
        try {
            previewSrc = await createPreviewDataUrl(file);
        } catch (previewError) {
            previewSrc = createPreviewDataUrlFromSource(image);
        }

        uploadedImage = image;
        uploadedImageFileMeta = {
            name: file.name,
            size: file.size,
            type: file.type || inferMimeFromExtension(file.name)
        };

        applySmartFitDefaultsForUpload();
        syncWorkTitleFromFileName(file.name);

        if (persistToBridge) {
            await persistUploadToBridge(file);
        }

        const sourceSize = resolveSourceImageSize(image, { preferOriginal: true });
        const width = sourceSize.width;
        const height = sourceSize.height;
        const wasOptimized = Boolean(image?._optimizedWidth && image?._optimizedHeight && (image._optimizedWidth !== width || image._optimizedHeight !== height));
        const isAppliedToEditor = Boolean(selectedMockup);
        const successMessage = isAppliedToEditor
            ? `Imagem carregada e aplicada ao mockup atual (${width}x${height}).`
            : `Imagem carregada com sucesso (${width}x${height}). Selecione um mockup em "Editar" para aplicar.`;
        const optimizationInfo = wasOptimized
            ? ` | Otimizada para edição: ${image._optimizedWidth}x${image._optimizedHeight}px`
            : '';

        updateUploadFeedback({
            status: 'success',
            message: successMessage,
            previewSrc,
            details: `${sanitizeFileName(file.name)} | ${width}x${height}px | ${formatBytes(file.size)}${optimizationInfo}`
        });

        const hint = document.getElementById('editorHint');
        if (hint) {
            hint.textContent = isAppliedToEditor
                ? 'Arte aplicada. Ajuste escala, posição, rotação e modos de repetição/espelhamento.'
                : 'Imagem pronta. Clique em "Editar" em um mockup para aplicar a arte.';
        }

        renderCanvas();
        refreshVisibleMockupThumbnails();
        window.requestAnimationFrame(() => {
            renderCanvas();
            refreshVisibleMockupThumbnails();
        });
        return true;
    } catch (error) {
        updateUploadFeedback({
            status: 'error',
            message: 'Não foi possível carregar a imagem. Verifique o arquivo e tente novamente.'
        });
        return false;
    } finally {
        if (preserveScroll) {
            window.requestAnimationFrame(() => {
                window.scrollTo({
                    top: scrollPositionBeforeUpload,
                    behavior: 'auto'
                });
            });
        }
    }
}

function updateUploadFeedback({ status = 'idle', message = '', previewSrc = '', details = '' } = {}) {
    const messageElement = document.getElementById('uploadStatusMessage');
    const preview = document.getElementById('uploadPreview');
    const previewPlaceholder = document.getElementById('uploadPreviewPlaceholder');
    const previewImage = document.getElementById('uploadedPreviewImage');
    const previewTitle = document.getElementById('uploadPreviewTitle');
    const previewInfo = document.getElementById('uploadPreviewInfo');
    const uploadBtn = document.querySelector('label.upload-btn[for="fileInput"]');

    if (uploadBtn) {
        if (status === 'success') {
            uploadBtn.innerHTML = '<i class="fas fa-check-circle"></i> Imagem carregada';
        } else {
            uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Fazer Upload de Imagem';
        }
    }

    if (messageElement) {
        messageElement.classList.remove('status-success', 'status-error');
        if (status === 'success') {
            messageElement.classList.add('status-success');
        } else if (status === 'error') {
            messageElement.classList.add('status-error');
        }
        messageElement.textContent = message || 'Formatos suportados: PNG, JPEG e SVG.';
    }

    if (!preview || !previewImage || !previewInfo) {
        return;
    }

    if (previewSrc) {
        preview.style.display = 'flex';
        if (previewPlaceholder) {
            previewPlaceholder.style.display = 'none';
        }
        previewImage.src = previewSrc;
        if (previewTitle) {
            previewTitle.textContent = status === 'success' ? 'Imagem carregada com sucesso' : 'Imagem selecionada';
        }
        previewInfo.textContent = details;
        return;
    }

    if (status === 'error' && uploadedImage) {
        return;
    }

    preview.style.display = 'none';
    if (previewPlaceholder) {
        previewPlaceholder.style.display = 'grid';
    }
    previewImage.removeAttribute('src');
    if (previewTitle) {
        previewTitle.textContent = 'Imagem carregada';
    }
    previewInfo.textContent = '';
}

function createPreviewDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const result = loadEvent.target?.result;
            if (typeof result === 'string' && result.startsWith('data:image/')) {
                resolve(result);
                return;
            }
            reject(new Error('preview_dataurl_invalid'));
        };
        reader.onerror = () => reject(new Error('preview_dataurl_error'));
        reader.readAsDataURL(file);
    });
}

function createPreviewDataUrlFromSource(source) {
    const sourceSize = resolveSourceImageSize(source, { preferOriginal: true });
    const sourceWidth = Number(sourceSize.width || 0);
    const sourceHeight = Number(sourceSize.height || 0);
    if (!sourceWidth || !sourceHeight) {
        return '';
    }

    const maxPreviewSide = 720;
    const ratio = Math.min(1, maxPreviewSide / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * ratio));
    const height = Math.max(1, Math.round(sourceHeight * ratio));
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = width;
    previewCanvas.height = height;
    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) {
        return '';
    }

    try {
        previewCtx.imageSmoothingEnabled = true;
        previewCtx.imageSmoothingQuality = 'high';
        previewCtx.drawImage(source, 0, 0, width, height);
        return previewCanvas.toDataURL('image/png');
    } catch (error) {
        return '';
    }
}

function sanitizeFileName(name) {
    return String(name || 'arquivo')
        .replace(/[<>:"/\\|?*]+/g, '-')
        .slice(0, 80);
}

function formatBytes(bytes) {
    const value = Number(bytes);
    if (!Number.isFinite(value) || value <= 0) {
        return '0 B';
    }
    if (value < 1024) {
        return `${value} B`;
    }
    if (value < 1024 * 1024) {
        return `${(value / 1024).toFixed(1)} KB`;
    }
    return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function inferMimeFromExtension(fileName) {
    const extension = extractFileExtension(fileName);
    if (extension === '.svg') {
        return 'image/svg+xml';
    }
    if (extension === '.png') {
        return 'image/png';
    }
    return 'image/jpeg';
}

function isSupportedUploadFile(file) {
    const mime = String(file.type || '').toLowerCase();
    if (SUPPORTED_UPLOAD_MIME_TYPES.has(mime)) {
        return true;
    }

    const extension = extractFileExtension(file.name);
    return SUPPORTED_UPLOAD_EXTENSIONS.includes(extension);
}

function extractFileExtension(fileName) {
    const normalized = String(fileName || '').toLowerCase().trim();
    const dotIndex = normalized.lastIndexOf('.');
    if (dotIndex < 0) {
        return '';
    }
    return normalized.slice(dotIndex);
}

function loadArtworkImage(file) {
    const extension = extractFileExtension(file.name);
    const mime = String(file.type || '').toLowerCase();
    const isSvg = mime === 'image/svg+xml' || extension === '.svg';

    if (isSvg) {
        return loadSvgArtwork(file);
    }

    return loadRasterArtwork(file);
}

function loadRasterArtwork(file) {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
            URL.revokeObjectURL(objectUrl);
            resolve(optimizeImageForEditor(image));
        };
        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('invalid_raster_image'));
        };
        image.src = objectUrl;
    });
}

function loadSvgArtwork(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            const rawSvgText = loadEvent.target?.result;
            const svgText = typeof rawSvgText === 'string' ? ensureSvgDimensions(rawSvgText) : '';
            if (typeof svgText !== 'string' || !svgText.toLowerCase().includes('<svg')) {
                reject(new Error('invalid_svg_text'));
                return;
            }

            const svgSize = extractSvgSize(svgText);
            const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
            const image = new Image();
            image.onload = () => {
                if (!image.naturalWidth && svgSize.width > 0) {
                    image._fallbackWidth = svgSize.width;
                }
                if (!image.naturalHeight && svgSize.height > 0) {
                    image._fallbackHeight = svgSize.height;
                }
                resolve(optimizeImageForEditor(image));
            };
            image.onerror = () => reject(new Error('invalid_svg_image'));
            image.src = svgDataUrl;
        };
        reader.onerror = () => reject(new Error('svg_read_error'));
        reader.readAsText(file);
    });
}

function ensureSvgDimensions(svgText) {
    const svgOpenTagMatch = String(svgText).match(/<svg\b[^>]*>/i);
    if (!svgOpenTagMatch) {
        return svgText;
    }

    const openTag = svgOpenTagMatch[0];
    const widthMatch = openTag.match(/\bwidth\s*=\s*['"]([^'"]+)['"]/i);
    const heightMatch = openTag.match(/\bheight\s*=\s*['"]([^'"]+)['"]/i);
    const hasValidWidth = parseSvgLength(widthMatch?.[1] || '') > 0;
    const hasValidHeight = parseSvgLength(heightMatch?.[1] || '') > 0;
    if (hasValidWidth && hasValidHeight) {
        return svgText;
    }

    const { width, height } = extractSvgSize(svgText);
    if (!(width > 0 && height > 0)) {
        return svgText;
    }

    const normalizedTag = openTag.replace(
        /<svg/i,
        `<svg width="${Math.round(width)}" height="${Math.round(height)}"`
    );
    return String(svgText).replace(openTag, normalizedTag);
}

function extractSvgSize(svgText) {
    const value = String(svgText || '');
    const viewBoxMatch = value.match(/\bviewBox\s*=\s*['"]([^'"]+)['"]/i);
    if (viewBoxMatch) {
        const parts = viewBoxMatch[1]
            .trim()
            .split(/[\s,]+/)
            .map((part) => Number(part));
        if (parts.length === 4 && Number.isFinite(parts[2]) && Number.isFinite(parts[3])) {
            return {
                width: Math.abs(parts[2]),
                height: Math.abs(parts[3])
            };
        }
    }

    const width = parseSvgLength(value.match(/\bwidth\s*=\s*['"]([^'"]+)['"]/i)?.[1] || '');
    const height = parseSvgLength(value.match(/\bheight\s*=\s*['"]([^'"]+)['"]/i)?.[1] || '');
    return {
        width,
        height
    };
}

function parseSvgLength(rawValue) {
    const value = String(rawValue || '').trim();
    if (!value || value.endsWith('%')) {
        return 0;
    }
    const parsed = Number.parseFloat(value.replace(',', '.'));
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return 0;
    }
    return parsed;
}

function applySmartFitDefaultsForUpload() {
    editorState.imageLayoutMode = 'fit-fill';
    editorState.scale = 1;
    editorState.positionX = 50;
    editorState.positionY = 50;
    editorState.rotation = 0;
    applyEditorStateToControls();
    scheduleEditorStateSave();
}

function resolveSourceImageSize(source, options = {}) {
    const preferOriginal = Boolean(options.preferOriginal);
    const width = Number(
        preferOriginal
            ? (source?._originalWidth || source?.naturalWidth || source?.width || source?._optimizedWidth || source?._fallbackWidth || 0)
            : (source?.naturalWidth || source?.width || source?._optimizedWidth || source?._fallbackWidth || source?._originalWidth || 0)
    );
    const height = Number(
        preferOriginal
            ? (source?._originalHeight || source?.naturalHeight || source?.height || source?._optimizedHeight || source?._fallbackHeight || 0)
            : (source?.naturalHeight || source?.height || source?._optimizedHeight || source?._fallbackHeight || source?._originalHeight || 0)
    );
    return {
        width: Number.isFinite(width) ? width : 0,
        height: Number.isFinite(height) ? height : 0
    };
}

function optimizeImageForEditor(image) {
    const sourceSize = resolveSourceImageSize(image);
    const sourceWidth = sourceSize.width;
    const sourceHeight = sourceSize.height;
    if (!sourceWidth || !sourceHeight) {
        return image;
    }

    const maxSide = Math.max(sourceWidth, sourceHeight);
    if (maxSide <= MAX_WORKING_IMAGE_DIMENSION) {
        image._originalWidth = sourceWidth;
        image._originalHeight = sourceHeight;
        image._optimizedWidth = sourceWidth;
        image._optimizedHeight = sourceHeight;
        return image;
    }

    const ratio = MAX_WORKING_IMAGE_DIMENSION / maxSide;
    const optimizedWidth = Math.max(1, Math.round(sourceWidth * ratio));
    const optimizedHeight = Math.max(1, Math.round(sourceHeight * ratio));
    const buffer = document.createElement('canvas');
    buffer.width = optimizedWidth;
    buffer.height = optimizedHeight;
    const bufferCtx = buffer.getContext('2d');
    if (!bufferCtx) {
        image._originalWidth = sourceWidth;
        image._originalHeight = sourceHeight;
        image._optimizedWidth = sourceWidth;
        image._optimizedHeight = sourceHeight;
        return image;
    }

    bufferCtx.imageSmoothingEnabled = true;
    bufferCtx.imageSmoothingQuality = 'high';
    bufferCtx.drawImage(image, 0, 0, optimizedWidth, optimizedHeight);
    buffer._originalWidth = sourceWidth;
    buffer._originalHeight = sourceHeight;
    buffer._optimizedWidth = optimizedWidth;
    buffer._optimizedHeight = optimizedHeight;
    return buffer;
}

function handleLogoUpload(event) {
    const file = event.target.files?.[0];
    if (!file) {
        return;
    }
    if (!isSupportedUploadFile(file)) {
        alert('Formato de logo não suportado. Envie PNG, JPEG ou SVG.');
        return;
    }

    loadArtworkImage(file)
        .then((image) => {
            uploadedLogo = image;
            scheduleEditorStateSave();
            renderCanvas();
        })
        .catch(() => {
            alert('Não foi possível carregar a logo selecionada.');
        });
}

function removeLogo() {
    uploadedLogo = null;
    const logoInput = document.getElementById('logoInput');
    if (logoInput) {
        logoInput.value = '';
    }
    renderCanvas();
}

function updateMockup() {
    syncControls();
    renderCanvas();
    scheduleVisibleMockupThumbnailsRefresh(140);
}

function syncControls() {
    const previousPreset = editorState.canvasPreset;

    editorState.canvasPreset = document.getElementById('canvasPreset')?.value || DEFAULT_EDITOR_STATE.canvasPreset;
    editorState.backgroundPreset = document.getElementById('backgroundPreset')?.value || DEFAULT_EDITOR_STATE.backgroundPreset;
    editorState.bgColorStart = document.getElementById('bgColorStart')?.value || DEFAULT_EDITOR_STATE.bgColorStart;
    editorState.bgColorEnd = document.getElementById('bgColorEnd')?.value || DEFAULT_EDITOR_STATE.bgColorEnd;
    editorState.mockupProductColor = normalizeHexColor(
        document.getElementById('mockupProductColor')?.value || editorState.mockupProductColor,
        DEFAULT_EDITOR_STATE.mockupProductColor
    ).toLowerCase();
    editorState.showGuides = Boolean(document.getElementById('showGuides')?.checked ?? DEFAULT_EDITOR_STATE.showGuides);

    editorState.positionX = Number(document.getElementById('positionX')?.value ?? DEFAULT_EDITOR_STATE.positionX);
    editorState.positionY = Number(document.getElementById('positionY')?.value ?? DEFAULT_EDITOR_STATE.positionY);
    editorState.scale = Number(document.getElementById('scaleRange')?.value ?? DEFAULT_EDITOR_STATE.scale);
    editorState.imageLayoutMode = document.getElementById('imageLayoutMode')?.value || DEFAULT_EDITOR_STATE.imageLayoutMode;
    if (editorState.imageLayoutMode === 'fit-fill' && editorState.scale < 1) {
        editorState.scale = 1;
        setControl('scaleRange', editorState.scale);
    }
    editorState.rotation = Number(document.getElementById('rotationRange')?.value ?? DEFAULT_EDITOR_STATE.rotation);
    editorState.flipHorizontal = Boolean(document.getElementById('flipHorizontal')?.checked ?? DEFAULT_EDITOR_STATE.flipHorizontal);
    editorState.flipVertical = Boolean(document.getElementById('flipVertical')?.checked ?? DEFAULT_EDITOR_STATE.flipVertical);
    editorState.opacity = Number(document.getElementById('opacityRange')?.value ?? DEFAULT_EDITOR_STATE.opacity);
    editorState.shadow = Number(document.getElementById('shadowRange')?.value ?? DEFAULT_EDITOR_STATE.shadow);
    editorState.radius = Number(document.getElementById('radiusRange')?.value ?? DEFAULT_EDITOR_STATE.radius);
    editorState.filter = document.getElementById('filterSelect')?.value || DEFAULT_EDITOR_STATE.filter;

    editorState.textEnabled = Boolean(document.getElementById('enableTextOverlay')?.checked ?? DEFAULT_EDITOR_STATE.textEnabled);
    editorState.textPrimary = String(document.getElementById('textPrimary')?.value || '').slice(0, 120);
    editorState.textSecondary = String(document.getElementById('textSecondary')?.value || '').slice(0, 160);
    editorState.textFont = document.getElementById('textFont')?.value || DEFAULT_EDITOR_STATE.textFont;
    editorState.textAlign = document.getElementById('textAlign')?.value || DEFAULT_EDITOR_STATE.textAlign;
    editorState.textColor = document.getElementById('textColor')?.value || DEFAULT_EDITOR_STATE.textColor;
    editorState.textSize = Number(document.getElementById('textSize')?.value ?? DEFAULT_EDITOR_STATE.textSize);
    editorState.textPositionX = Number(document.getElementById('textPositionX')?.value ?? DEFAULT_EDITOR_STATE.textPositionX);
    editorState.textPositionY = Number(document.getElementById('textPositionY')?.value ?? DEFAULT_EDITOR_STATE.textPositionY);

    editorState.logoScale = Number(document.getElementById('logoScaleRange')?.value ?? DEFAULT_EDITOR_STATE.logoScale);
    editorState.logoOpacity = Number(document.getElementById('logoOpacityRange')?.value ?? DEFAULT_EDITOR_STATE.logoOpacity);
    editorState.logoPositionX = Number(document.getElementById('logoPositionX')?.value ?? DEFAULT_EDITOR_STATE.logoPositionX);
    editorState.logoPositionY = Number(document.getElementById('logoPositionY')?.value ?? DEFAULT_EDITOR_STATE.logoPositionY);

    editorState.exportFormat = document.getElementById('exportFormat')?.value || DEFAULT_EDITOR_STATE.exportFormat;
    editorState.exportQuality = Number(document.getElementById('exportQuality')?.value ?? DEFAULT_EDITOR_STATE.exportQuality);
    editorState.exportScale = Number(document.getElementById('exportScale')?.value ?? DEFAULT_EDITOR_STATE.exportScale);

    if (previousPreset !== editorState.canvasPreset) {
        applyCanvasPreset(editorState.canvasPreset);
        updateEditorMeta();
    }

    updateExportQualityLabel();
    scheduleEditorStateSave();
}

function applyEditorStateToControls() {
    setControl('canvasPreset', editorState.canvasPreset);
    setControl('backgroundPreset', editorState.backgroundPreset);
    setControl('bgColorStart', editorState.bgColorStart);
    setControl('bgColorEnd', editorState.bgColorEnd);
    setControl('mockupProductColor', editorState.mockupProductColor);
    setControl('showGuides', editorState.showGuides);

    setControl('positionX', editorState.positionX);
    setControl('positionY', editorState.positionY);
    setControl('scaleRange', editorState.scale);
    setControl('imageLayoutMode', editorState.imageLayoutMode);
    setControl('rotationRange', editorState.rotation);
    setControl('flipHorizontal', editorState.flipHorizontal);
    setControl('flipVertical', editorState.flipVertical);
    setControl('opacityRange', editorState.opacity);
    setControl('shadowRange', editorState.shadow);
    setControl('radiusRange', editorState.radius);
    setControl('filterSelect', editorState.filter);

    setControl('enableTextOverlay', editorState.textEnabled);
    setControl('textPrimary', editorState.textPrimary);
    setControl('textSecondary', editorState.textSecondary);
    setControl('textFont', editorState.textFont);
    setControl('textAlign', editorState.textAlign);
    setControl('textColor', editorState.textColor);
    setControl('textSize', editorState.textSize);
    setControl('textPositionX', editorState.textPositionX);
    setControl('textPositionY', editorState.textPositionY);

    setControl('logoScaleRange', editorState.logoScale);
    setControl('logoOpacityRange', editorState.logoOpacity);
    setControl('logoPositionX', editorState.logoPositionX);
    setControl('logoPositionY', editorState.logoPositionY);

    setControl('exportFormat', editorState.exportFormat);
    setControl('exportQuality', editorState.exportQuality);
    setControl('exportScale', editorState.exportScale);
    updateExportQualityLabel();
}

function setControl(id, value) {
    const element = document.getElementById(id);
    if (element) {
        if (element.type === 'checkbox') {
            element.checked = Boolean(value);
        } else {
            element.value = String(value);
        }
    }
}

function applyCanvasPreset(presetKey) {
    if (!canvas) {
        return;
    }

    const resolvedKey = CANVAS_PRESETS[presetKey] ? presetKey : DEFAULT_EDITOR_STATE.canvasPreset;
    const preset = CANVAS_PRESETS[resolvedKey];
    editorState.canvasPreset = resolvedKey;
    canvas.width = preset.width;
    canvas.height = preset.height;
}

function getCanvasPreset(presetKey) {
    return CANVAS_PRESETS[presetKey] || CANVAS_PRESETS[DEFAULT_EDITOR_STATE.canvasPreset];
}

function updateExportQualityLabel() {
    const label = document.getElementById('exportQualityValue');
    if (label) {
        label.textContent = `${Math.round(editorState.exportQuality || DEFAULT_EDITOR_STATE.exportQuality)}%`;
    }
}

function updateEditorMeta() {
    const meta = document.getElementById('editorMockupMeta');
    if (!meta) {
        return;
    }

    const preset = getCanvasPreset(editorState.canvasPreset);
    if (!selectedMockup) {
        meta.textContent = `${preset.label} | ${preset.width}x${preset.height}`;
        return;
    }

    meta.textContent = `${getCategoryLabel(selectedMockup.category)} | ${selectedMockup.orientation} | ${selectedMockup.quality} | ${preset.width}x${preset.height}`;
}

function scheduleEditorStateSave() {
    if (editorSaveTimer) {
        clearTimeout(editorSaveTimer);
    }

    editorSaveTimer = window.setTimeout(() => {
        persistSelectedMockupEditorState();
        saveEditorState();
        saveEditorStateByMockup();
        editorSaveTimer = null;
    }, 220);
}

function resetEditor() {
    editorState = selectedMockup
        ? createInitialEditorStateForMockup(selectedMockup)
        : { ...DEFAULT_EDITOR_STATE };
    applyCanvasPreset(editorState.canvasPreset);
    applyEditorStateToControls();
    updateEditorMeta();
    persistSelectedMockupEditorState();
    saveEditorState();
    saveEditorStateByMockup();
    renderCanvas();
    scheduleVisibleMockupThumbnailsRefresh(80);
}

function renderCanvas(targetCanvas = canvas) {
    if (!targetCanvas) {
        return;
    }

    const targetCtx = targetCanvas.getContext('2d');
    if (!targetCtx) {
        return;
    }

    const baseWidth = canvas ? canvas.width : targetCanvas.width;
    const scaleFactor = baseWidth > 0 ? targetCanvas.width / baseWidth : 1;

    targetCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    drawBackground(targetCtx, targetCanvas, editorState.backgroundPreset);

    if (!selectedMockup) {
        drawCanvasMessage(
            targetCtx,
            targetCanvas,
            'Selecione um mockup para iniciar',
            'Depois faca upload da sua arte e ajuste os controles.',
            targetCanvas.width / 2,
            targetCanvas.height / 2,
            scaleFactor
        );
        return;
    }

    const frame = getFrameArea(selectedMockup.orientation, targetCanvas);
    drawFrame(targetCtx, frame, scaleFactor);
    drawReferenceModel(targetCtx, frame, selectedMockup, scaleFactor);

    if (uploadedImage) {
        drawImage(targetCtx, frame, selectedMockup);
    } else {
        drawCanvasMessage(
            targetCtx,
            targetCanvas,
            'Upload da arte',
            'Sua imagem sera aplicada nesta area.',
            frame.centerX,
            frame.centerY,
            scaleFactor
        );
    }

    if (editorState.showGuides) {
        drawGuides(targetCtx, frame, scaleFactor);
    }

    drawFrameOverlay(targetCtx, frame, selectedMockup, scaleFactor);
    drawTextOverlay(targetCtx, targetCanvas, scaleFactor, selectedMockup);
    drawLogo(targetCtx, targetCanvas, frame, scaleFactor);
}

function withTemporaryEditorState(stateOverride, callback) {
    if (!stateOverride || typeof stateOverride !== 'object') {
        return callback();
    }

    const previousState = editorState;
    editorState = normalizeEditorStateSnapshot(stateOverride);
    try {
        return callback();
    } finally {
        editorState = previousState;
    }
}

function buildMockupPreviewDataUrl(mockup, width = 1080, height = 720, options = {}) {
    if (!mockup) {
        return '';
    }

    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = width;
    previewCanvas.height = height;
    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) {
        return '';
    }

    const renderPreview = () => {
        try {
            drawBackground(previewCtx, previewCanvas, editorState.backgroundPreset);
            const frame = getFrameArea(mockup.orientation, previewCanvas);
            drawFrame(previewCtx, frame, 1);
            drawReferenceModel(previewCtx, frame, mockup, 1);

            if (uploadedImage) {
                drawImage(previewCtx, frame, mockup);
            } else {
                drawCanvasMessage(
                    previewCtx,
                    previewCanvas,
                    'Upload da arte',
                    'Sua imagem sera aplicada nesta area.',
                    frame.centerX,
                    frame.centerY,
                    1
                );
            }

            if (options.showGuides && editorState.showGuides) {
                drawGuides(previewCtx, frame, 1);
            }

            drawFrameOverlay(previewCtx, frame, mockup, 1);

            if (options.includeText) {
                drawTextOverlay(previewCtx, previewCanvas, 1, mockup);
            }
            if (options.includeLogo) {
                drawLogo(previewCtx, previewCanvas, frame, 1);
            }

            return previewCanvas.toDataURL('image/png');
        } catch (error) {
            console.error('Erro ao montar preview de mockup:', error);
            return '';
        }
    };

    return withTemporaryEditorState(options.editorStateOverride, renderPreview);
}

function drawBackground(context, surfaceCanvas, preset) {
    if (preset === 'dark') {
        const gradient = context.createLinearGradient(0, 0, surfaceCanvas.width, surfaceCanvas.height);
        gradient.addColorStop(0, '#111827');
        gradient.addColorStop(1, '#1f2937');
        context.fillStyle = gradient;
        context.fillRect(0, 0, surfaceCanvas.width, surfaceCanvas.height);
        return;
    }
    if (preset === 'gradient') {
        const gradient = context.createLinearGradient(0, 0, surfaceCanvas.width, surfaceCanvas.height);
        gradient.addColorStop(0, '#dbeafe');
        gradient.addColorStop(0.5, '#ede9fe');
        gradient.addColorStop(1, '#fee2e2');
        context.fillStyle = gradient;
        context.fillRect(0, 0, surfaceCanvas.width, surfaceCanvas.height);
        return;
    }
    if (preset === 'custom-solid') {
        context.fillStyle = editorState.bgColorStart || DEFAULT_EDITOR_STATE.bgColorStart;
        context.fillRect(0, 0, surfaceCanvas.width, surfaceCanvas.height);
        return;
    }
    if (preset === 'custom-gradient') {
        const gradient = context.createLinearGradient(0, 0, surfaceCanvas.width, surfaceCanvas.height);
        gradient.addColorStop(0, editorState.bgColorStart || DEFAULT_EDITOR_STATE.bgColorStart);
        gradient.addColorStop(1, editorState.bgColorEnd || DEFAULT_EDITOR_STATE.bgColorEnd);
        context.fillStyle = gradient;
        context.fillRect(0, 0, surfaceCanvas.width, surfaceCanvas.height);
        return;
    }
    if (preset === 'paper') {
        context.fillStyle = '#fefcf5';
        context.fillRect(0, 0, surfaceCanvas.width, surfaceCanvas.height);
        context.fillStyle = 'rgba(120, 113, 108, 0.04)';
        for (let x = 0; x < surfaceCanvas.width; x += 20) {
            context.fillRect(x, 0, 1, surfaceCanvas.height);
        }
        for (let y = 0; y < surfaceCanvas.height; y += 20) {
            context.fillRect(0, y, surfaceCanvas.width, 1);
        }
        return;
    }
    context.fillStyle = '#f8fafc';
    context.fillRect(0, 0, surfaceCanvas.width, surfaceCanvas.height);
}

function drawFrame(context, frame, scaleFactor = 1) {
    context.save();
    context.shadowColor = 'rgba(15, 23, 42, 0.28)';
    context.shadowBlur = editorState.shadow * scaleFactor;
    context.shadowOffsetY = Math.max(6 * scaleFactor, Math.floor(editorState.shadow / 2) * scaleFactor);
    context.fillStyle = '#ffffff';
    roundedRect(context, frame.x, frame.y, frame.width, frame.height, editorState.radius * scaleFactor);
    context.fill();
    context.restore();
}

function hexToRgb(hexColor, fallback = '#ffffff') {
    const normalized = normalizeHexColor(hexColor, fallback).replace('#', '');
    return {
        r: Number.parseInt(normalized.slice(0, 2), 16),
        g: Number.parseInt(normalized.slice(2, 4), 16),
        b: Number.parseInt(normalized.slice(4, 6), 16)
    };
}

function shiftRgb(rgb, amount) {
    const ratio = Math.max(-1, Math.min(1, Number(amount) || 0));
    const adjust = (value) => {
        const safe = Number.isFinite(value) ? value : 0;
        if (ratio >= 0) {
            return Math.round(safe + ((255 - safe) * ratio));
        }
        return Math.round(safe * (1 + ratio));
    };

    return {
        r: adjust(rgb.r),
        g: adjust(rgb.g),
        b: adjust(rgb.b)
    };
}

function toCssRgba(rgb, alpha = 1) {
    const safeAlpha = Math.max(0, Math.min(1, Number(alpha) || 0));
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${safeAlpha})`;
}

function getColorLuminance(rgb) {
    const r = Number.isFinite(rgb?.r) ? rgb.r : 0;
    const g = Number.isFinite(rgb?.g) ? rgb.g : 0;
    const b = Number.isFinite(rgb?.b) ? rgb.b : 0;
    return ((0.299 * r) + (0.587 * g) + (0.114 * b)) / 255;
}

function resolveMockupProductPalette(referenceType = 'generic') {
    const sourceColor = editorState.mockupProductColor
        || workInfoState.productColor
        || workInfoState.backgroundColor
        || DEFAULT_EDITOR_STATE.mockupProductColor;
    const base = hexToRgb(sourceColor, DEFAULT_EDITOR_STATE.mockupProductColor);
    const luminance = getColorLuminance(base);

    const keepLighterSurface = referenceType === 'paper' || referenceType === 'frame' || referenceType === 'device';
    const fillBase = keepLighterSurface ? shiftRgb(base, 0.16) : base;
    const fillAccent = shiftRgb(fillBase, luminance < 0.4 ? 0.12 : -0.08);
    const fillDeep = shiftRgb(fillBase, luminance < 0.4 ? -0.2 : -0.24);
    const stroke = luminance < 0.38
        ? shiftRgb(fillBase, 0.52)
        : shiftRgb(fillBase, -0.52);
    const detail = luminance < 0.38
        ? shiftRgb(fillBase, 0.32)
        : shiftRgb(fillBase, -0.28);
    const label = luminance < 0.5
        ? shiftRgb(fillBase, 0.68)
        : shiftRgb(fillBase, -0.72);

    return {
        fill: toCssRgba(fillBase, 0.96),
        fillAccent: toCssRgba(fillAccent, 0.95),
        fillDeep: toCssRgba(fillDeep, 0.9),
        stroke: toCssRgba(stroke, 0.72),
        detail: toCssRgba(detail, 0.64),
        label: toCssRgba(label, 0.82)
    };
}

function drawReferenceModel(context, frame, mockup, scaleFactor = 1) {
    if (!mockup) {
        return;
    }

    const referenceType = resolveMockupReferenceType(mockup);
    const palette = resolveMockupProductPalette(referenceType);
    context.save();
    roundedRect(context, frame.x, frame.y, frame.width, frame.height, editorState.radius * scaleFactor);
    context.clip();
    context.strokeStyle = palette.stroke;
    context.fillStyle = palette.fill;
    context.lineWidth = Math.max(1.2, 1.8 * scaleFactor);

    if (referenceType === 'shirt-front-back') {
        drawShirtFrontBackReference(context, frame, palette);
    } else if (referenceType === 'paper') {
        drawPaperReference(context, frame, palette);
    } else if (referenceType === 'device') {
        drawDeviceReference(context, frame, palette);
    } else if (referenceType === 'box') {
        drawBoxReference(context, frame, palette);
    } else if (referenceType === 'bag') {
        drawBagReference(context, frame, palette);
    } else if (referenceType === 'product') {
        drawProductReference(context, frame, palette);
    } else if (referenceType === 'signage') {
        drawSignageReference(context, frame, palette);
    } else if (referenceType === 'frame') {
        drawFrameReference(context, frame, palette);
    } else {
        drawGenericReference(context, frame, palette);
    }

    context.restore();
}

function resolveMockupReferenceType(mockup) {
    const category = String(mockup?.category || '').toLowerCase();
    const frameType = String(mockup?.frame || '').toLowerCase();
    const title = String(mockup?.title || '').toLowerCase();

    if (category === 'vestuario' || frameType === 'fabric') {
        return 'shirt-front-back';
    }
    if (frameType === 'paper') {
        return 'paper';
    }
    if (frameType === 'device' || frameType === 'screen') {
        return 'device';
    }
    if (frameType === 'box') {
        return 'box';
    }
    if (frameType === 'bag') {
        return 'bag';
    }
    if (frameType === 'product') {
        return 'product';
    }
    if (frameType === 'billboard' || frameType === 'sign' || frameType === 'board' || frameType === 'banner' || frameType === 'stand') {
        return 'signage';
    }
    if (frameType === 'frame') {
        return 'frame';
    }
    if (title.includes('manual') || title.includes('identidade')) {
        return 'paper';
    }
    return 'generic';
}

function resolveArtworkPlacementArea(frame, mockup) {
    const referenceType = resolveMockupReferenceType(mockup);

    if (referenceType === 'shirt-front-back') {
        const area = getReferenceContentRect(frame, 0.1);
        const gap = area.width * 0.06;
        const slotWidth = (area.width - gap) / 2;
        const slotHeight = area.height;
        return {
            x: area.x + (slotWidth * 0.2),
            y: area.y + (slotHeight * 0.24),
            width: slotWidth * 0.6,
            height: slotHeight * 0.52,
            radius: Math.max(8, frame.width * 0.02)
        };
    }

    if (referenceType === 'paper') {
        const area = getReferenceContentRect(frame, 0.1);
        return {
            x: area.x + (area.width * 0.26),
            y: area.y + (area.height * 0.16),
            width: area.width * 0.52,
            height: area.height * 0.66,
            radius: Math.max(6, frame.width * 0.012)
        };
    }

    if (referenceType === 'device') {
        const area = getReferenceContentRect(frame, 0.1);
        if (frame.width >= frame.height) {
            const laptopW = area.width * 0.64;
            const laptopH = area.height * 0.54;
            const lx = area.x + ((area.width - laptopW) / 2);
            const ly = area.y + (area.height * 0.12);
            return {
                x: lx + (laptopW * 0.08),
                y: ly + (laptopH * 0.08),
                width: laptopW * 0.84,
                height: laptopH * 0.78,
                radius: Math.max(8, frame.width * 0.016)
            };
        }

        const phoneW = area.width * 0.52;
        const phoneH = area.height * 0.84;
        const px = area.x + ((area.width - phoneW) / 2);
        const py = area.y + ((area.height - phoneH) / 2);
        return {
            x: px + (phoneW * 0.04),
            y: py + (phoneH * 0.06),
            width: phoneW * 0.92,
            height: phoneH * 0.9,
            radius: Math.max(14, frame.width * 0.03)
        };
    }

    if (referenceType === 'box') {
        const area = getReferenceContentRect(frame, 0.12);
        const w = area.width * 0.56;
        const h = area.height * 0.56;
        const depth = Math.min(w, h) * 0.24;
        const x = area.x + ((area.width - w) / 2);
        const y = area.y + ((area.height - h) / 2) + (depth * 0.4);
        return {
            x: x + (w * 0.08),
            y: y + (h * 0.08),
            width: w * 0.84,
            height: h * 0.84,
            radius: Math.max(6, frame.width * 0.012)
        };
    }

    if (referenceType === 'bag') {
        const area = getReferenceContentRect(frame, 0.16);
        const x = area.x + (area.width * 0.14);
        const y = area.y + (area.height * 0.14);
        const w = area.width * 0.72;
        const h = area.height * 0.76;
        return {
            x: x + (w * 0.18),
            y: y + (h * 0.32),
            width: w * 0.64,
            height: h * 0.48,
            radius: Math.max(10, frame.width * 0.02)
        };
    }

    if (referenceType === 'product') {
        const area = getReferenceContentRect(frame, 0.18);
        const w = area.width * 0.38;
        const h = area.height * 0.78;
        const x = area.x + ((area.width - w) / 2);
        const y = area.y + ((area.height - h) / 2);
        return {
            x: x + (w * 0.04),
            y: y + (h * 0.17),
            width: w * 0.92,
            height: h * 0.79,
            radius: Math.max(12, frame.width * 0.02)
        };
    }

    if (referenceType === 'signage') {
        const area = getReferenceContentRect(frame, 0.12);
        const boardW = area.width * 0.82;
        const boardH = area.height * 0.56;
        const bx = area.x + (area.width - boardW) / 2;
        const by = area.y + (area.height * 0.1);
        return {
            x: bx + (boardW * 0.08),
            y: by + (boardH * 0.12),
            width: boardW * 0.84,
            height: boardH * 0.76,
            radius: Math.max(8, frame.width * 0.015)
        };
    }

    if (referenceType === 'frame') {
        const area = getReferenceContentRect(frame, 0.16);
        const innerPad = Math.min(area.width, area.height) * 0.12;
        return {
            x: area.x + innerPad,
            y: area.y + innerPad,
            width: area.width - (innerPad * 2),
            height: area.height - (innerPad * 2),
            radius: Math.max(8, frame.width * 0.015)
        };
    }

    const generic = getReferenceContentRect(frame, 0.14);
    return {
        x: generic.x + (generic.width * 0.08),
        y: generic.y + (generic.height * 0.1),
        width: generic.width * 0.84,
        height: generic.height * 0.8,
        radius: Math.max(8, frame.width * 0.015)
    };
}

function ensureArtworkArea(area, fallbackFrame) {
    const x = Number.isFinite(area?.x) ? area.x : fallbackFrame.x;
    const y = Number.isFinite(area?.y) ? area.y : fallbackFrame.y;
    const width = Number.isFinite(area?.width) && area.width > 1 ? area.width : fallbackFrame.width;
    const height = Number.isFinite(area?.height) && area.height > 1 ? area.height : fallbackFrame.height;
    const radius = Number.isFinite(area?.radius)
        ? Math.max(0, Math.min(area.radius, width / 2, height / 2))
        : Math.max(0, Math.min(editorState.radius, width / 2, height / 2));

    return {
        x,
        y,
        width,
        height,
        radius,
        centerX: x + (width / 2),
        centerY: y + (height / 2)
    };
}

function getReferenceContentRect(frame, paddingRatio = 0.08) {
    const padX = frame.width * paddingRatio;
    const padY = frame.height * paddingRatio;
    return {
        x: frame.x + padX,
        y: frame.y + padY,
        width: Math.max(20, frame.width - (padX * 2)),
        height: Math.max(20, frame.height - (padY * 2))
    };
}

function drawShirtFrontBackReference(context, frame, palette) {
    const area = getReferenceContentRect(frame, 0.1);
    const gap = area.width * 0.06;
    const slotWidth = (area.width - gap) / 2;
    const slotHeight = area.height;

    drawSingleShirtReference(context, area.x, area.y, slotWidth, slotHeight, false, palette);
    drawSingleShirtReference(context, area.x + slotWidth + gap, area.y, slotWidth, slotHeight, true, palette);

    context.save();
    context.fillStyle = palette.label;
    context.font = `600 ${Math.max(10, Math.round(frame.width * 0.024))}px "Segoe UI", Arial, sans-serif`;
    context.textAlign = 'center';
    context.fillText('FRENTE', area.x + slotWidth / 2, area.y + slotHeight - 6);
    context.fillText('VERSO', area.x + slotWidth + gap + (slotWidth / 2), area.y + slotHeight - 6);
    context.restore();
}

function drawSingleShirtReference(context, x, y, width, height, isBack = false, palette = null) {
    const activePalette = palette || resolveMockupProductPalette('shirt-front-back');
    const top = y + (height * 0.1);
    const bottom = y + (height * 0.88);
    const left = x + (width * 0.08);
    const right = x + (width * 0.92);
    const chestLeft = x + (width * 0.24);
    const chestRight = x + (width * 0.76);
    const sleeveLeft = x + (width * 0.02);
    const sleeveRight = x + (width * 0.98);
    const shoulderY = y + (height * 0.24);
    const armpitY = y + (height * 0.38);

    context.save();
    context.fillStyle = isBack ? activePalette.fillAccent : activePalette.fill;
    context.beginPath();
    context.moveTo(chestLeft, shoulderY);
    context.lineTo(left, shoulderY + (height * 0.06));
    context.lineTo(sleeveLeft, armpitY);
    context.lineTo(left + (width * 0.1), armpitY + (height * 0.08));
    context.lineTo(chestLeft, armpitY);
    context.lineTo(chestLeft, bottom);
    context.lineTo(chestRight, bottom);
    context.lineTo(chestRight, armpitY);
    context.lineTo(right - (width * 0.1), armpitY + (height * 0.08));
    context.lineTo(sleeveRight, armpitY);
    context.lineTo(right, shoulderY + (height * 0.06));
    context.lineTo(chestRight, shoulderY);
    context.quadraticCurveTo(x + (width * 0.5), top, chestLeft, shoulderY);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();

    context.save();
    context.strokeStyle = activePalette.detail;
    context.lineWidth = Math.max(1, context.lineWidth * 0.9);
    if (isBack) {
        context.beginPath();
        context.moveTo(x + (width * 0.34), y + (height * 0.26));
        context.quadraticCurveTo(x + (width * 0.5), y + (height * 0.2), x + (width * 0.66), y + (height * 0.26));
        context.stroke();
    } else {
        context.beginPath();
        context.moveTo(x + (width * 0.38), y + (height * 0.25));
        context.quadraticCurveTo(x + (width * 0.5), y + (height * 0.18), x + (width * 0.62), y + (height * 0.25));
        context.stroke();
    }
    context.restore();
}

function drawPaperReference(context, frame, palette) {
    const area = getReferenceContentRect(frame, 0.1);
    const sheetW = area.width * 0.64;
    const sheetH = area.height * 0.76;

    context.save();
    context.fillStyle = palette.fillDeep;
    drawSkewSheet(context, area.x + (area.width * 0.12), area.y + (area.height * 0.18), sheetW, sheetH, -0.08);
    context.restore();

    context.save();
    context.fillStyle = palette.fill;
    drawSkewSheet(context, area.x + (area.width * 0.2), area.y + (area.height * 0.12), sheetW, sheetH, 0.06);
    context.restore();
}

function drawSkewSheet(context, x, y, width, height, skew = 0) {
    const skewOffset = width * skew;
    context.beginPath();
    context.moveTo(x + skewOffset, y);
    context.lineTo(x + width + skewOffset, y);
    context.lineTo(x + width - skewOffset, y + height);
    context.lineTo(x - skewOffset, y + height);
    context.closePath();
    context.fill();
    context.stroke();
}

function drawDeviceReference(context, frame, palette) {
    const area = getReferenceContentRect(frame, 0.1);
    if (frame.width >= frame.height) {
        const laptopW = area.width * 0.64;
        const laptopH = area.height * 0.54;
        const lx = area.x + (area.width - laptopW) / 2;
        const ly = area.y + (area.height * 0.12);
        context.save();
        context.fillStyle = palette.fill;
        roundedRect(context, lx, ly, laptopW, laptopH, 14);
        context.fill();
        context.stroke();
        context.restore();

        const baseW = laptopW * 1.1;
        const baseH = area.height * 0.12;
        context.save();
        context.fillStyle = palette.fillDeep;
        roundedRect(context, lx - ((baseW - laptopW) / 2), ly + laptopH + 6, baseW, baseH, 10);
        context.fill();
        context.stroke();
        context.restore();
    } else {
        const phoneW = area.width * 0.52;
        const phoneH = area.height * 0.84;
        const px = area.x + (area.width - phoneW) / 2;
        const py = area.y + (area.height - phoneH) / 2;
        context.save();
        context.fillStyle = palette.fill;
        roundedRect(context, px, py, phoneW, phoneH, 22);
        context.fill();
        context.stroke();
        context.restore();

        context.save();
        context.fillStyle = palette.detail;
        roundedRect(context, px + (phoneW * 0.36), py + (phoneH * 0.04), phoneW * 0.28, phoneH * 0.035, 8);
        context.fill();
        context.restore();
    }
}

function drawBoxReference(context, frame, palette) {
    const area = getReferenceContentRect(frame, 0.12);
    const w = area.width * 0.56;
    const h = area.height * 0.56;
    const depth = Math.min(w, h) * 0.24;
    const x = area.x + ((area.width - w) / 2);
    const y = area.y + ((area.height - h) / 2) + (depth * 0.4);

    context.save();
    context.fillStyle = palette.fill;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + w, y);
    context.lineTo(x + w, y + h);
    context.lineTo(x, y + h);
    context.closePath();
    context.fill();
    context.stroke();

    context.fillStyle = palette.fillAccent;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + depth, y - depth);
    context.lineTo(x + w + depth, y - depth);
    context.lineTo(x + w, y);
    context.closePath();
    context.fill();
    context.stroke();

    context.fillStyle = palette.fillDeep;
    context.beginPath();
    context.moveTo(x + w, y);
    context.lineTo(x + w + depth, y - depth);
    context.lineTo(x + w + depth, y + h - depth);
    context.lineTo(x + w, y + h);
    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
}

function drawBagReference(context, frame, palette) {
    const area = getReferenceContentRect(frame, 0.16);
    const x = area.x + (area.width * 0.14);
    const y = area.y + (area.height * 0.14);
    const w = area.width * 0.72;
    const h = area.height * 0.76;

    context.save();
    context.fillStyle = palette.fill;
    roundedRect(context, x, y + (h * 0.16), w, h * 0.84, 18);
    context.fill();
    context.stroke();
    context.restore();

    context.beginPath();
    context.moveTo(x + (w * 0.25), y + (h * 0.26));
    context.quadraticCurveTo(x + (w * 0.32), y, x + (w * 0.5), y);
    context.quadraticCurveTo(x + (w * 0.68), y, x + (w * 0.75), y + (h * 0.26));
    context.save();
    context.strokeStyle = palette.detail;
    context.stroke();
    context.restore();
}

function drawProductReference(context, frame, palette) {
    const area = getReferenceContentRect(frame, 0.18);
    const w = area.width * 0.38;
    const h = area.height * 0.78;
    const x = area.x + ((area.width - w) / 2);
    const y = area.y + ((area.height - h) / 2);

    context.save();
    context.fillStyle = palette.fill;
    roundedRect(context, x, y + (h * 0.14), w, h * 0.86, 20);
    context.fill();
    context.stroke();
    context.restore();

    context.save();
    context.fillStyle = palette.fillAccent;
    roundedRect(context, x + (w * 0.23), y, w * 0.54, h * 0.2, 8);
    context.fill();
    context.stroke();
    context.restore();
}

function drawSignageReference(context, frame, palette) {
    const area = getReferenceContentRect(frame, 0.12);
    const boardW = area.width * 0.82;
    const boardH = area.height * 0.56;
    const bx = area.x + (area.width - boardW) / 2;
    const by = area.y + (area.height * 0.1);

    context.save();
    context.fillStyle = palette.fill;
    roundedRect(context, bx, by, boardW, boardH, 14);
    context.fill();
    context.stroke();
    context.restore();

    context.save();
    context.strokeStyle = palette.detail;
    context.beginPath();
    context.moveTo(bx + (boardW * 0.2), by + boardH);
    context.lineTo(bx + (boardW * 0.13), area.y + area.height);
    context.moveTo(bx + (boardW * 0.8), by + boardH);
    context.lineTo(bx + (boardW * 0.87), area.y + area.height);
    context.stroke();
    context.restore();
}

function drawFrameReference(context, frame, palette) {
    const area = getReferenceContentRect(frame, 0.16);
    context.save();
    context.fillStyle = palette.fill;
    roundedRect(context, area.x, area.y, area.width, area.height, 12);
    context.fill();
    context.stroke();
    context.restore();

    const innerPad = Math.min(area.width, area.height) * 0.12;
    context.save();
    context.strokeStyle = palette.detail;
    roundedRect(context, area.x + innerPad, area.y + innerPad, area.width - (innerPad * 2), area.height - (innerPad * 2), 8);
    context.stroke();
    context.restore();
}

function drawGenericReference(context, frame, palette) {
    const area = getReferenceContentRect(frame, 0.14);
    context.save();
    context.fillStyle = palette.fill;
    roundedRect(context, area.x, area.y, area.width, area.height, 14);
    context.fill();
    context.stroke();
    context.restore();

    context.save();
    context.strokeStyle = palette.detail;
    context.beginPath();
    context.moveTo(area.x + (area.width * 0.12), area.y + (area.height * 0.8));
    context.lineTo(area.x + (area.width * 0.42), area.y + (area.height * 0.46));
    context.lineTo(area.x + (area.width * 0.6), area.y + (area.height * 0.62));
    context.lineTo(area.x + (area.width * 0.86), area.y + (area.height * 0.34));
    context.stroke();
    context.restore();
}

function drawImage(context, frame, mockup = selectedMockup) {
    const sourceSize = resolveSourceImageSize(uploadedImage);
    const sourceWidth = sourceSize.width;
    const sourceHeight = sourceSize.height;
    const placementArea = resolveArtworkPlacementArea(frame, mockup);
    const targetArea = ensureArtworkArea(placementArea, frame);

    if (!sourceWidth || !sourceHeight) {
        const surfaceCanvas = context.canvas || canvas;
        drawCanvasMessage(
            context,
            surfaceCanvas,
            'Arquivo carregado sem dimensoes validas',
            'Use PNG, JPEG ou SVG com dimensoes definidas.',
            targetArea.centerX,
            targetArea.centerY,
            1
        );
        return;
    }

    const mode = resolveLayoutMode(editorState.imageLayoutMode);
    const scaleFactor = Math.max(0.05, Number(editorState.scale) || DEFAULT_EDITOR_STATE.scale);
    const offsetReach = mode === 'fit-fill' ? 0.7 : 0.35;
    const requestedOffsetX = ((editorState.positionX - 50) / 50) * (targetArea.width * offsetReach);
    const requestedOffsetY = ((editorState.positionY - 50) / 50) * (targetArea.height * offsetReach);
    const isSingleImageMode = mode === 'cover' || mode === 'contain' || mode === 'fit-fill';
    const fitResult = isSingleImageMode
        ? resolveFittedImageGeometry(targetArea, sourceWidth, sourceHeight, mode, scaleFactor, requestedOffsetX, requestedOffsetY)
        : null;
    const appliedOffsetX = fitResult ? fitResult.offsetX : requestedOffsetX;
    const appliedOffsetY = fitResult ? fitResult.offsetY : requestedOffsetY;

    context.save();
    try {
        roundedRect(context, targetArea.x, targetArea.y, targetArea.width, targetArea.height, targetArea.radius);
        context.clip();
        context.globalAlpha = editorState.opacity;
        context.filter = resolveFilter(editorState.filter);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.translate(targetArea.centerX + appliedOffsetX, targetArea.centerY + appliedOffsetY);
        context.rotate((editorState.rotation * Math.PI) / 180);
        context.scale(editorState.flipHorizontal ? -1 : 1, editorState.flipVertical ? -1 : 1);

        if (fitResult) {
            context.drawImage(uploadedImage, -fitResult.width / 2, -fitResult.height / 2, fitResult.width, fitResult.height);
        } else {
            const tileBaseFit = Math.min(targetArea.width / sourceWidth, targetArea.height / sourceHeight);
            const tileWidth = Math.max(8, sourceWidth * tileBaseFit * scaleFactor);
            const tileHeight = Math.max(8, sourceHeight * tileBaseFit * scaleFactor);
            const mirrorX = mode === 'repeat-mirror-x' || mode === 'repeat-mirror-xy';
            const mirrorY = mode === 'repeat-mirror-y' || mode === 'repeat-mirror-xy';

            drawRepeatedPattern(context, targetArea, uploadedImage, tileWidth, tileHeight, mirrorX, mirrorY);
        }
    } catch (error) {
        const surfaceCanvas = context.canvas || canvas;
        console.error('Erro ao aplicar imagem no mockup:', error);
        drawCanvasMessage(
            context,
            surfaceCanvas,
            'Não foi possível renderizar essa imagem',
            'Tente ajustar escala/modo ou reenviar o arquivo.',
            targetArea.centerX,
            targetArea.centerY,
            1
        );
    } finally {
        context.restore();
    }
}

function resolveFittedImageGeometry(targetArea, sourceWidth, sourceHeight, mode, requestedScale, requestedOffsetX, requestedOffsetY) {
    const isFreeFillMode = mode === 'fit-fill';
    const baseFit = mode === 'cover' || isFreeFillMode
        ? Math.max(targetArea.width / sourceWidth, targetArea.height / sourceHeight)
        : Math.min(targetArea.width / sourceWidth, targetArea.height / sourceHeight);
    const effectiveScale = isFreeFillMode
        ? Math.max(1, requestedScale)
        : requestedScale;
    const width = sourceWidth * baseFit * effectiveScale;
    const height = sourceHeight * baseFit * effectiveScale;

    if (!isFreeFillMode) {
        return {
            width,
            height,
            offsetX: requestedOffsetX,
            offsetY: requestedOffsetY
        };
    }

    const maxOffsetX = Math.max(0, (width - targetArea.width) / 2);
    const maxOffsetY = Math.max(0, (height - targetArea.height) / 2);
    return {
        width,
        height,
        offsetX: clampNumber(requestedOffsetX, -maxOffsetX, maxOffsetX),
        offsetY: clampNumber(requestedOffsetY, -maxOffsetY, maxOffsetY)
    };
}

function drawFitFillBackdrop(context, image, targetArea, sourceWidth, sourceHeight) {
    const coverFit = Math.max(targetArea.width / sourceWidth, targetArea.height / sourceHeight);
    const backdropWidth = Math.max(targetArea.width, sourceWidth * coverFit);
    const backdropHeight = Math.max(targetArea.height, sourceHeight * coverFit);

    context.save();
    context.globalAlpha = Math.max(0.12, Math.min(0.34, editorState.opacity * 0.32));
    context.filter = 'blur(16px) saturate(1.08)';
    context.drawImage(image, -backdropWidth / 2, -backdropHeight / 2, backdropWidth, backdropHeight);
    context.restore();
}

function clampNumber(value, min, max) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return min;
    }
    return Math.min(max, Math.max(min, numeric));
}

function resolveLayoutMode(mode) {
    const allowed = new Set(['fit-fill', 'cover', 'contain', 'repeat', 'repeat-mirror-x', 'repeat-mirror-y', 'repeat-mirror-xy']);
    if (allowed.has(mode)) {
        return mode;
    }
    return 'fit-fill';
}

function drawRepeatedPattern(context, frame, image, tileWidth, tileHeight, mirrorX, mirrorY) {
    const coverageWidth = Math.max(frame.width, Math.hypot(frame.width, frame.height)) + (tileWidth * 4);
    const coverageHeight = Math.max(frame.height, Math.hypot(frame.width, frame.height)) + (tileHeight * 4);
    const startX = -coverageWidth / 2;
    const startY = -coverageHeight / 2;
    const endX = coverageWidth / 2;
    const endY = coverageHeight / 2;

    let row = 0;
    for (let y = startY; y <= endY + tileHeight; y += tileHeight) {
        let column = 0;
        for (let x = startX; x <= endX + tileWidth; x += tileWidth) {
            const tileMirrorX = mirrorX && (column % 2 === 1);
            const tileMirrorY = mirrorY && (row % 2 === 1);

            context.save();
            context.translate(x + (tileWidth / 2), y + (tileHeight / 2));
            context.scale(tileMirrorX ? -1 : 1, tileMirrorY ? -1 : 1);
            context.drawImage(image, -(tileWidth / 2), -(tileHeight / 2), tileWidth, tileHeight);
            context.restore();

            column += 1;
        }
        row += 1;
    }
}

function drawFrameOverlay(context, frame, mockup, scaleFactor = 1) {
    const color = CATEGORY_DEFS[mockup.category]?.theme || '#334155';
    context.save();
    context.strokeStyle = color;
    context.lineWidth = Math.max(2, 4 * scaleFactor);
    roundedRect(context, frame.x, frame.y, frame.width, frame.height, editorState.radius * scaleFactor);
    context.stroke();
    context.restore();
}

function drawGuides(context, frame, scaleFactor = 1) {
    context.save();
    context.strokeStyle = 'rgba(15, 23, 42, 0.2)';
    context.lineWidth = Math.max(1, 1.5 * scaleFactor);
    context.setLineDash([10 * scaleFactor, 8 * scaleFactor]);

    const thirdsX1 = frame.x + frame.width / 3;
    const thirdsX2 = frame.x + (frame.width * 2) / 3;
    const thirdsY1 = frame.y + frame.height / 3;
    const thirdsY2 = frame.y + (frame.height * 2) / 3;

    context.beginPath();
    context.moveTo(frame.centerX, frame.y);
    context.lineTo(frame.centerX, frame.y + frame.height);
    context.moveTo(frame.x, frame.centerY);
    context.lineTo(frame.x + frame.width, frame.centerY);
    context.moveTo(thirdsX1, frame.y);
    context.lineTo(thirdsX1, frame.y + frame.height);
    context.moveTo(thirdsX2, frame.y);
    context.lineTo(thirdsX2, frame.y + frame.height);
    context.moveTo(frame.x, thirdsY1);
    context.lineTo(frame.x + frame.width, thirdsY1);
    context.moveTo(frame.x, thirdsY2);
    context.lineTo(frame.x + frame.width, thirdsY2);
    context.stroke();
    context.restore();
}

function drawTextOverlay(context, surfaceCanvas, scaleFactor = 1, contextMockup = selectedMockup) {
    if (!editorState.textEnabled) {
        return;
    }

    const primaryText = String(editorState.textPrimary || contextMockup?.title || '').trim();
    const secondaryDefault = contextMockup
        ? `${getCategoryLabel(contextMockup.category)} | ${contextMockup.orientation}`
        : '';
    const secondaryText = String(editorState.textSecondary || secondaryDefault).trim();

    if (!primaryText && !secondaryText) {
        return;
    }

    const align = ['left', 'center', 'right'].includes(editorState.textAlign) ? editorState.textAlign : 'center';
    const x = (editorState.textPositionX / 100) * surfaceCanvas.width;
    const y = (editorState.textPositionY / 100) * surfaceCanvas.height;
    const titleSize = Math.max(18 * scaleFactor, editorState.textSize * scaleFactor);
    const subtitleSize = Math.max(14 * scaleFactor, titleSize * 0.38);
    const maxWidth = surfaceCanvas.width * 0.84;

    context.save();
    context.textAlign = align;
    context.textBaseline = 'alphabetic';
    context.fillStyle = editorState.textColor || DEFAULT_EDITOR_STATE.textColor;
    context.shadowColor = 'rgba(15, 23, 42, 0.3)';
    context.shadowBlur = 14 * scaleFactor;

    let cursorY = y;
    if (primaryText) {
        context.font = `700 ${Math.round(titleSize)}px ${resolveFontFamily(editorState.textFont)}`;
        const primaryResult = drawWrappedText(context, primaryText, x, cursorY, maxWidth, titleSize * 1.08, 2);
        cursorY = primaryResult.lastY + titleSize * 0.55;
    }

    if (secondaryText) {
        context.font = `500 ${Math.round(subtitleSize)}px ${resolveFontFamily(editorState.textFont)}`;
        context.fillStyle = applySecondaryTextColor(editorState.textColor || DEFAULT_EDITOR_STATE.textColor);
        drawWrappedText(context, secondaryText, x, cursorY, maxWidth, subtitleSize * 1.2, 2);
    }

    context.restore();
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines = 2) {
    const words = String(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let current = '';

    words.forEach((word) => {
        const trial = current ? `${current} ${word}` : word;
        if (context.measureText(trial).width <= maxWidth || !current) {
            current = trial;
            return;
        }
        lines.push(current);
        current = word;
    });

    if (current) {
        lines.push(current);
    }

    if (maxLines > 0 && lines.length > maxLines) {
        lines.length = maxLines;
        lines[maxLines - 1] = truncateToWidth(context, lines[maxLines - 1], maxWidth);
    }

    let lastY = y;
    lines.forEach((line, index) => {
        const drawY = y + (lineHeight * index);
        context.fillText(line, x, drawY, maxWidth);
        lastY = drawY;
    });

    return {
        lineCount: lines.length,
        lastY
    };
}

function truncateToWidth(context, text, maxWidth) {
    let output = String(text);
    if (context.measureText(output).width <= maxWidth) {
        return output;
    }

    while (output.length > 1 && context.measureText(`${output}...`).width > maxWidth) {
        output = output.slice(0, -1);
    }

    return `${output}...`;
}

function applySecondaryTextColor(baseColor) {
    const safe = /^#[0-9a-fA-F]{6}$/.test(baseColor) ? baseColor : '#334155';
    const r = Number.parseInt(safe.slice(1, 3), 16);
    const g = Number.parseInt(safe.slice(3, 5), 16);
    const b = Number.parseInt(safe.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.82)`;
}

function drawLogo(context, surfaceCanvas, frame, scaleFactor = 1) {
    if (!uploadedLogo) {
        return;
    }

    const anchorX = (editorState.logoPositionX / 100) * surfaceCanvas.width;
    const anchorY = (editorState.logoPositionY / 100) * surfaceCanvas.height;
    const baseWidth = frame.width * 0.24 * Math.max(0.1, editorState.logoScale);
    const width = Math.max(42 * scaleFactor, baseWidth);
    const height = width * (uploadedLogo.height / uploadedLogo.width);

    context.save();
    context.globalAlpha = Math.max(0.08, Math.min(1, editorState.logoOpacity));
    context.shadowColor = 'rgba(15, 23, 42, 0.2)';
    context.shadowBlur = 10 * scaleFactor;
    context.drawImage(uploadedLogo, anchorX - (width / 2), anchorY - (height / 2), width, height);
    context.restore();
}

function drawCanvasMessage(context, surfaceCanvas, line1, line2, x = surfaceCanvas.width / 2, y = surfaceCanvas.height / 2, scaleFactor = 1) {
    context.save();
    context.fillStyle = '#334155';
    context.font = `700 ${Math.round(30 * scaleFactor)}px Segoe UI`;
    context.textAlign = 'center';
    context.fillText(line1, x, y - (8 * scaleFactor));
    context.fillStyle = '#64748b';
    context.font = `500 ${Math.round(18 * scaleFactor)}px Segoe UI`;
    context.fillText(line2, x, y + (24 * scaleFactor));
    context.restore();
}

function getFrameArea(orientation, surfaceCanvas = canvas) {
    const cWidth = surfaceCanvas?.width || 1080;
    const cHeight = surfaceCanvas?.height || 1080;

    let width = cWidth * 0.7;
    let height = cHeight * 0.52;

    if (orientation === 'vertical') {
        width = cWidth * 0.42;
        height = cHeight * 0.7;
    } else if (orientation === 'quadrada') {
        const side = Math.min(cWidth * 0.56, cHeight * 0.56);
        width = side;
        height = side;
    }

    const maxFrameHeight = cHeight * 0.8;
    if (height > maxFrameHeight) {
        const ratio = maxFrameHeight / height;
        width *= ratio;
        height = maxFrameHeight;
    }

    const x = Math.round((cWidth - width) / 2);
    const y = Math.round(Math.max(cHeight * 0.08, ((cHeight - height) / 2) - (cHeight * 0.03)));
    return { x, y, width, height, centerX: x + width / 2, centerY: y + height / 2 };
}

function resolveFilter(filter) {
    if (filter === 'blur') return 'blur(2px)';
    if (filter === 'grayscale') return 'grayscale(100%)';
    if (filter === 'sepia') return 'sepia(100%)';
    if (filter === 'brightness') return 'brightness(135%)';
    if (filter === 'contrast') return 'contrast(140%)';
    return 'none';
}

function resolveFontFamily(fontKey) {
    return FONT_MAP[fontKey] || FONT_MAP.montserrat;
}

function roundedRect(context, x, y, width, height, radius) {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    context.beginPath();
    context.moveTo(x + r, y);
    context.lineTo(x + width - r, y);
    context.quadraticCurveTo(x + width, y, x + width, y + r);
    context.lineTo(x + width, y + height - r);
    context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    context.lineTo(x + r, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - r);
    context.lineTo(x, y + r);
    context.quadraticCurveTo(x, y, x + r, y);
    context.closePath();
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

function persistSavedMockupEdits(list) {
    if (typeof localStorage === 'undefined') {
        return;
    }

    try {
        localStorage.setItem(SAVED_EDITS_STORAGE_KEY, JSON.stringify(list.slice(0, MAX_SAVED_EDITS)));
    } catch (error) {
        alert('Não foi possível salvar mais mockups. Limpe alguns itens salvos para continuar.');
    }
}

function buildCurrentMockupSnapshot() {
    if (!canvas || !selectedMockup) {
        return null;
    }

    syncControls();
    renderCanvas();
    const previewDataUrl = buildCompactPreviewDataUrl(canvas);
    const now = new Date().toISOString();
    return {
        id: `mkp_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        mockupId: selectedMockup.id,
        title: selectedMockup.title,
        category: selectedMockup.category,
        categoryLabel: getCategoryLabel(selectedMockup.category),
        orientation: selectedMockup.orientation,
        quality: selectedMockup.quality,
        savedAt: now,
        previewDataUrl,
        editorState: { ...editorState },
        imageMeta: uploadedImageFileMeta ? { ...uploadedImageFileMeta } : null,
        branding: buildSnapshotBranding()
    };
}

function buildSnapshotBranding() {
    const api = getBrandKitApi();
    const branding = {
        colors: {
            product: editorState.mockupProductColor,
            primary: editorState.bgColorStart,
            secondary: editorState.bgColorEnd,
            text: editorState.textColor
        },
        typography: {
            fontKey: editorState.textFont,
            fontName: getMockupFontDisplayName(editorState.textFont)
        }
    };

    if (!api || !api.getIntegrationSnapshot) {
        return branding;
    }

    const snapshot = api.getIntegrationSnapshot();
    return {
        ...branding,
        sharedBrandKit: snapshot?.brandKit || null,
        sharedPalette: snapshot?.colorPalette || null,
        sharedTypography: snapshot?.fontProfile || null
    };
}

function buildCompactPreviewDataUrl(sourceCanvas) {
    const width = Number(sourceCanvas?.width || 0);
    const height = Number(sourceCanvas?.height || 0);
    if (!width || !height) {
        return '';
    }

    const maxSide = Math.max(width, height);
    const maxPreviewSide = 1280;
    const ratio = maxSide > maxPreviewSide ? (maxPreviewSide / maxSide) : 1;
    const previewWidth = Math.max(1, Math.round(width * ratio));
    const previewHeight = Math.max(1, Math.round(height * ratio));
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = previewWidth;
    previewCanvas.height = previewHeight;
    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) {
        return sourceCanvas.toDataURL('image/jpeg', 0.82);
    }

    previewCtx.imageSmoothingEnabled = true;
    previewCtx.imageSmoothingQuality = 'high';
    previewCtx.drawImage(sourceCanvas, 0, 0, previewWidth, previewHeight);
    return previewCanvas.toDataURL('image/jpeg', 0.86);
}

function saveMockupChanges(options = {}) {
    const silent = Boolean(options.silent);
    if (!selectedMockup) {
        if (!silent) {
            alert('Selecione um mockup antes de salvar as alterações.');
        }
        return false;
    }

    const snapshot = buildCurrentMockupSnapshot();
    if (!snapshot) {
        if (!silent) {
            alert('Não foi possível salvar o mockup no momento.');
        }
        return false;
    }

    const current = getSavedMockupEdits();
    const withoutSameMockup = current.filter((item) => Number(item.mockupId) !== Number(snapshot.mockupId));
    const next = [snapshot, ...withoutSameMockup].slice(0, MAX_SAVED_EDITS);
    persistSavedMockupEdits(next);
    syncBrandKitFromEditorState();

    if (!silent) {
        alert('Alterações salvas com sucesso. Use "Ir para relatório de orçamento" para anexar.');
    }
    return true;
}

function convertArtworkSourceToBlob(source, mimeType = 'image/png', quality = 0.94) {
    return new Promise((resolve, reject) => {
        if (!source) {
            reject(new Error('missing_source'));
            return;
        }

        if (source instanceof HTMLCanvasElement && typeof source.toBlob === 'function') {
            source.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                    return;
                }
                reject(new Error('canvas_blob_failed'));
            }, mimeType, quality);
            return;
        }

        const width = Number(source?.naturalWidth || source?.width || source?._optimizedWidth || source?._originalWidth || 0);
        const height = Number(source?.naturalHeight || source?.height || source?._optimizedHeight || source?._originalHeight || 0);
        if (!width || !height) {
            reject(new Error('invalid_source_dimensions'));
            return;
        }

        const maxSide = 2600;
        const ratio = Math.min(1, maxSide / Math.max(width, height));
        const targetWidth = Math.max(1, Math.round(width * ratio));
        const targetHeight = Math.max(1, Math.round(height * ratio));
        const buffer = document.createElement('canvas');
        buffer.width = targetWidth;
        buffer.height = targetHeight;
        const bufferCtx = buffer.getContext('2d');
        if (!bufferCtx) {
            reject(new Error('canvas_context_unavailable'));
            return;
        }

        bufferCtx.imageSmoothingEnabled = true;
        bufferCtx.imageSmoothingQuality = 'high';
        bufferCtx.drawImage(source, 0, 0, targetWidth, targetHeight);
        buffer.toBlob((blob) => {
            if (blob) {
                resolve(blob);
                return;
            }
            reject(new Error('buffer_blob_failed'));
        }, mimeType, quality);
    });
}

async function persistCurrentArtworkForResults() {
    if (!uploadedImage || typeof persistUploadToBridge !== 'function') {
        return false;
    }

    try {
        const blob = await convertArtworkSourceToBlob(uploadedImage, 'image/png', 0.96);
        const fileName = sanitizeFileName(uploadedImageFileMeta?.name || 'arte-mockup.png');
        const fileType = 'image/png';
        const fileLike = createFileLike(blob, fileName, fileType, Date.now());
        return await persistUploadToBridge(fileLike);
    } catch (error) {
        return false;
    }
}

async function finalizeMockupsForReport() {
    const savedBefore = getSavedMockupEdits();
    if (!savedBefore.length && selectedMockup) {
        saveMockupChanges({ silent: true });
    }

    const saved = getSavedMockupEdits();
    if (!saved.length) {
        alert('Salve ao menos um mockup antes de abrir o relatório de orçamento.');
        return;
    }

    await persistCurrentArtworkForResults();
    window.location.href = RESULTS_PAGE_URL;
}

function downloadMockup() {
    if (!canvas || !selectedMockup) {
        alert('Selecione um mockup antes de exportar.');
        return;
    }

    syncControls();
    renderCanvas();

    const exportScale = Math.max(1, Math.min(2, Number(editorState.exportScale) || 1));
    let sourceCanvas = canvas;

    if (exportScale > 1) {
        sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = Math.round(canvas.width * exportScale);
        sourceCanvas.height = Math.round(canvas.height * exportScale);
        renderCanvas(sourceCanvas);
    }

    const mimeType = getExportMime(editorState.exportFormat);
    const extension = getExportExtension(mimeType);
    const quality = Math.max(0.55, Math.min(1, Number(editorState.exportQuality) / 100));
    let dataUrl = mimeType === 'image/png'
        ? sourceCanvas.toDataURL(mimeType)
        : sourceCanvas.toDataURL(mimeType, quality);

    if (!dataUrl.startsWith(`data:${mimeType}`)) {
        dataUrl = sourceCanvas.toDataURL('image/png');
    }

    const a = document.createElement('a');
    const slug = slugify(selectedMockup.title) || 'projeto';
    a.download = `mockup-${slug}.${extension}`;
    a.href = dataUrl;
    a.click();
}

function getExportMime(selected) {
    if (selected === 'image/jpeg') {
        return 'image/jpeg';
    }
    if (selected === 'image/webp') {
        return 'image/webp';
    }
    return 'image/png';
}

function getExportExtension(mimeType) {
    if (mimeType === 'image/jpeg') {
        return 'jpg';
    }
    if (mimeType === 'image/webp') {
        return 'webp';
    }
    return 'png';
}

function saveUserSettings() {
    window.mockupHubSettings = {
        category: currentCategory,
        filters: {
            orientation: document.getElementById('orientationFilter')?.value || 'todas',
            quality: document.getElementById('qualityFilter')?.value || 'todas',
            color: document.getElementById('colorFilter')?.value || 'todas',
            sort: document.getElementById('sortFilter')?.value || 'popularidade',
            favoritesOnly,
            collectionFilter: collectionFilterKey
        },
        activeCollection: libraryState.activeCollection
    };
}

function findMockupById(id) {
    return allMockups.find((mockup) => mockup.id === id) || null;
}

function generateCardPreviewSvg(mockup) {
    return generateSceneSvg(mockup, 680, 420, false);
}

function generatePreviewSvg(mockup) {
    return generateSceneSvg(mockup, 1080, 720, true);
}

function generateSceneSvg(mockup, width, height, extended) {
    const theme = CATEGORY_DEFS[mockup.category]?.theme || '#334155';
    const categoryLabel = CATEGORY_DEFS[mockup.category]?.label || mockup.category;
    const frame = computePreviewFrame(mockup.orientation, width, height);
    const soft = '#f8fafc';
    const strong = '#e2e8f0';
    const bgA = mockup.scene === 'gradient' ? '#dbeafe' : soft;
    const bgB = mockup.scene === 'gradient' ? '#ede9fe' : strong;
    const bgC = mockup.scene === 'paper' ? '#f5efe0' : '#ffffff';
    const titleY = extended ? (height - 135) : (height - 36);
    const infoY = extended ? (height - 88) : (height - 16);

    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="${bgA}"/>
                    <stop offset="55%" stop-color="${bgB}"/>
                    <stop offset="100%" stop-color="${bgC}"/>
                </linearGradient>
                <linearGradient id="frameShade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="100%" stop-color="#f1f5f9"/>
                </linearGradient>
            </defs>
            <rect width="${width}" height="${height}" fill="url(#bg)"/>
            <rect x="${frame.x}" y="${frame.y}" width="${frame.w}" height="${frame.h}" rx="${frame.r}" fill="url(#frameShade)" stroke="${theme}" stroke-width="${extended ? 7 : 4}"/>
            <rect x="${frame.innerX}" y="${frame.innerY}" width="${frame.innerW}" height="${frame.innerH}" rx="${Math.max(8, frame.r - 6)}" fill="#ffffff" stroke="rgba(148,163,184,0.45)" stroke-width="2"/>
            <circle cx="${frame.innerX + frame.innerW * 0.16}" cy="${frame.innerY + frame.innerH * 0.18}" r="${Math.max(10, Math.round(frame.innerW * 0.05))}" fill="rgba(99,102,241,0.15)"/>
            <circle cx="${frame.innerX + frame.innerW * 0.82}" cy="${frame.innerY + frame.innerH * 0.72}" r="${Math.max(14, Math.round(frame.innerW * 0.07))}" fill="rgba(249,115,22,0.12)"/>
            <text x="${frame.innerX + frame.innerW / 2}" y="${frame.innerY + frame.innerH / 2 + 16}" text-anchor="middle" font-family="Segoe UI, Arial" font-size="${extended ? 86 : 52}" font-weight="700" fill="#334155">${escapeSvg(mockup.shortCode)}</text>
            <text x="${width / 2}" y="${titleY}" text-anchor="middle" font-family="Segoe UI, Arial" font-size="${extended ? 36 : 24}" font-weight="700" fill="#0f172a">${escapeSvg(mockup.title)}</text>
            <text x="${width / 2}" y="${infoY}" text-anchor="middle" font-family="Segoe UI, Arial" font-size="${extended ? 24 : 16}" fill="#475569">${escapeSvg(categoryLabel)} | ${escapeSvg(mockup.orientation)} | ${escapeSvg(mockup.quality)}</text>
        </svg>`;
}

function computePreviewFrame(orientation, width, height) {
    let w = Math.round(width * 0.75);
    let h = Math.round(height * 0.56);
    if (orientation === 'vertical') {
        w = Math.round(width * 0.42);
        h = Math.round(height * 0.68);
    } else if (orientation === 'quadrada') {
        w = Math.round(width * 0.52);
        h = Math.round(height * 0.52);
    }

    const x = Math.round((width - w) / 2);
    const y = Math.round((height - h) / 2) - (height > 500 ? 34 : 10);
    const r = Math.max(12, Math.round(Math.min(w, h) * 0.06));

    return {
        x,
        y,
        w,
        h,
        r,
        innerX: x + Math.round(w * 0.09),
        innerY: y + Math.round(h * 0.12),
        innerW: Math.round(w * 0.82),
        innerH: Math.round(h * 0.76)
    };
}

function buildMockupCatalog() {
    const catalog = {};
    let id = 1;
    CATEGORY_ORDER.forEach((category) => {
        const def = CATEGORY_DEFS[category];
        const items = [];
        def.entries.forEach(([title, orientation, frame, rawTags], idx) => {
            STYLE_VARIANTS.forEach((style, styleIdx) => {
                const tags = Array.from(new Set(`${rawTags},${category},${style.key},${orientation}`.split(',').map((tag) => tag.trim().toLowerCase())));
                items.push({
                    id,
                    category,
                    title: `${title} ${style.label}`,
                    description: `Mockup ${style.label.toLowerCase()} para ${title.toLowerCase()} com foco em apresentação profissional.`,
                    orientation,
                    frame,
                    quality: style.quality,
                    color: style.color,
                    scene: style.scene,
                    popularity: style.score - idx * 2 - styleIdx,
                    tags,
                    shortCode: shortCode(title, style.label)
                });
                id += 1;
            });
        });
        catalog[category] = items;
    });
    return catalog;
}

function shortCode(title, label) {
    const seed = title.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
    return `${seed}${label[0].toUpperCase()}`;
}

function getCategoryDefinition(category) {
    const def = CATEGORY_DEFS[category];
    if (def && typeof def.label === 'string') {
        return def;
    }
    return {
        label: 'Categoria',
        theme: '#334155'
    };
}

function getCategoryLabel(category) {
    return getCategoryDefinition(category).label;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeSvg(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
