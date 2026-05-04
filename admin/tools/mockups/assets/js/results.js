const RESULTS_SAVED_EDITS_KEY = 'mockuphub_saved_edits_v1';
const RESULTS_WORK_INFO_KEY = 'mockuphub_work_info_v1';
const RESULTS_RENDER_WIDTH = 1680;
const RESULTS_RENDER_HEIGHT = 1180;
const RESULTS_INTERSECTION_ROOT_MARGIN = '360px 0px 360px 0px';
const RESULTS_PAGE_REPORT_URL = './report.php';

const resultsState = {
    products: [],
    productsById: new Map(),
    heroProductId: null,
    workInfo: {
        title: '',
        mainTag: '',
        supportingTags: '',
        description: ''
    },
    liveRenderEnabled: false,
    renderedCount: 0,
    observer: null
};

document.addEventListener('DOMContentLoaded', () => {
    void initializeResultsPage();
});

async function initializeResultsPage() {
    bindResultsEvents();
    setResultsStatus('Preparando mockups para exibicao...');

    const hasArtwork = await ensureResultsArtworkContext();
    const savedEntries = readSavedEntries();
    const workInfo = readWorkInfo();
    resultsState.workInfo = workInfo;

    const catalog = getCatalogMockups();
    resultsState.liveRenderEnabled = hasArtwork && catalog.length > 0 && typeof buildMockupPreviewDataUrl === 'function';
    resultsState.products = buildResultsProducts(catalog, savedEntries, resultsState.liveRenderEnabled);
    resultsState.productsById = new Map(resultsState.products.map((product) => [product.id, product]));
    resultsState.renderedCount = 0;

    if (!resultsState.products.length) {
        showResultsEmptyState(true);
        setResultsStatus('Sem mockups salvos para montar os resultados.');
        return;
    }

    showResultsEmptyState(false);
    populateResultsCategoryFilter(resultsState.products);
    renderResultsHero(resultsState.products[0]);
    renderResultsGrid(resultsState.products);
    applyResultsFilters();
    setupResultsLazyRendering();

    if (resultsState.liveRenderEnabled) {
        setResultsStatus('Renderização em alta qualidade iniciada. As amostras serão refinadas conforme a rolagem.');
    } else {
        setResultsStatus('Exibindo amostras salvas. Para renderização completa em alta qualidade, abra os resultados a partir do editor com a arte carregada.');
    }
}

function bindResultsEvents() {
    document.getElementById('backToEditorBtn')?.addEventListener('click', () => {
        window.location.href = './editor.php';
    });

    document.getElementById('goToReportBtn')?.addEventListener('click', () => {
        window.location.href = RESULTS_PAGE_REPORT_URL;
    });

    document.getElementById('refreshResultsBtn')?.addEventListener('click', () => {
        resetLazyRenderingState();
        setupResultsLazyRendering(true);
    });

    document.getElementById('downloadHeroBtn')?.addEventListener('click', () => {
        const hero = resultsState.productsById.get(resultsState.heroProductId);
        if (!hero) {
            return;
        }
        downloadProductSample(hero);
    });

    document.getElementById('commentsTabBtn')?.addEventListener('click', () => {
        alert('Comentários ainda não foram habilitados nesta página.');
    });

    document.getElementById('resultsSearchInput')?.addEventListener('input', () => {
        applyResultsFilters();
    });

    document.getElementById('resultsCategoryFilter')?.addEventListener('change', () => {
        applyResultsFilters();
    });

    document.getElementById('resultsGrid')?.addEventListener('click', (event) => {
        const favoriteBtn = event.target.closest('.results-favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('is-active');
            favoriteBtn.setAttribute(
                'aria-label',
                favoriteBtn.classList.contains('is-active') ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
            );
            return;
        }

        const downloadBtn = event.target.closest('.results-download-btn');
        if (!downloadBtn) {
            return;
        }

        const productId = downloadBtn.dataset.productId;
        if (!productId) {
            return;
        }

        const product = resultsState.productsById.get(productId);
        if (!product) {
            return;
        }
        downloadProductSample(product);
    });
}

async function ensureResultsArtworkContext() {
    if (isArtworkReady()) {
        return true;
    }

    if (typeof restoreUploadFromBridge === 'function') {
        try {
            await restoreUploadFromBridge();
        } catch (error) {
            // segue com fallback de previews salvos
        }
    }

    if (isArtworkReady()) {
        return true;
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
        await delay(200 + (attempt * 120));
        if (isArtworkReady()) {
            return true;
        }
    }

    return false;
}

function isArtworkReady() {
    try {
        return Boolean(uploadedImage);
    } catch (error) {
        return false;
    }
}

function getCatalogMockups() {
    try {
        if (Array.isArray(allMockups)) {
            return allMockups;
        }
    } catch (error) {
        // sem catalogo global
    }

    if (Array.isArray(window.allMockups)) {
        return window.allMockups;
    }

    return [];
}

function readSavedEntries() {
    if (typeof getSavedMockupEdits === 'function') {
        return getSavedMockupEdits();
    }

    if (typeof localStorage === 'undefined') {
        return [];
    }

    try {
        const raw = localStorage.getItem(RESULTS_SAVED_EDITS_KEY);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.filter((entry) => entry && typeof entry === 'object');
    } catch (error) {
        return [];
    }
}

function readWorkInfo() {
    const fallback = {
        title: '',
        mainTag: '',
        supportingTags: '',
        description: ''
    };

    if (typeof localStorage === 'undefined') {
        return fallback;
    }

    try {
        const raw = localStorage.getItem(RESULTS_WORK_INFO_KEY);
        if (!raw) {
            return fallback;
        }

        const parsed = JSON.parse(raw);
        return {
            title: String(parsed.title || '').slice(0, 120),
            mainTag: String(parsed.mainTag || '').slice(0, 50),
            supportingTags: String(parsed.supportingTags || '').slice(0, 900),
            description: String(parsed.description || '').slice(0, 1800)
        };
    } catch (error) {
        return fallback;
    }
}

function buildResultsProducts(catalog, savedEntries, allowLiveRender) {
    const savedByMockupId = new Map(
        savedEntries
            .map((entry) => [Number(entry.mockupId), entry])
            .filter(([id]) => Number.isFinite(id))
    );

    if (allowLiveRender && catalog.length) {
        return catalog.map((mockup, index) => {
            const saved = savedByMockupId.get(Number(mockup.id)) || null;
            const pricing = buildProductPricing(mockup.id, index);
            return {
                id: `mockup_${mockup.id}`,
                mockupId: Number(mockup.id),
                title: String(mockup.title || `Mockup ${mockup.id}`),
                category: String(mockup.category || ''),
                categoryLabel: resolveCategoryLabel(mockup),
                orientation: String(mockup.orientation || ''),
                quality: String(mockup.quality || ''),
                imageSrc: normalizeDataImage(saved?.previewDataUrl || ''),
                liveRenderable: true,
                mockupRef: mockup,
                priceCurrent: pricing.current,
                priceOld: pricing.old,
                discount: pricing.discount,
                rendered: false
            };
        });
    }

    return savedEntries.map((entry, index) => {
        const pricing = buildProductPricing(entry.mockupId || entry.id || index, index);
        return {
            id: String(entry.id || `saved_${index}`),
            mockupId: Number(entry.mockupId || 0),
            title: String(entry.title || 'Mockup salvo'),
            category: String(entry.category || ''),
            categoryLabel: String(entry.categoryLabel || entry.category || 'Categoria'),
            orientation: String(entry.orientation || ''),
            quality: String(entry.quality || ''),
            imageSrc: normalizeDataImage(entry.previewDataUrl || ''),
            liveRenderable: false,
            mockupRef: null,
            priceCurrent: pricing.current,
            priceOld: pricing.old,
            discount: pricing.discount,
            rendered: true
        };
    });
}

function resolveCategoryLabel(mockup) {
    if (!mockup) {
        return 'Categoria';
    }

    try {
        if (typeof getCategoryLabel === 'function') {
            return getCategoryLabel(mockup.category);
        }
    } catch (error) {
        // segue fallback
    }

    return String(mockup.category || 'Categoria');
}

function buildProductPricing(seedValue, index) {
    const seed = deterministicSeed(`${seedValue}_${index}`);
    const discountOptions = [10, 15, 20, 25];
    const discount = discountOptions[seed % discountOptions.length];
    const rawCurrent = 12 + ((seed % 4200) / 100);
    const current = Math.round(rawCurrent * 100) / 100;
    const old = Math.round((current / (1 - (discount / 100))) * 100) / 100;
    return {
        current,
        old,
        discount
    };
}

function deterministicSeed(value) {
    const text = String(value || 'seed');
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) {
        hash = ((hash << 5) - hash) + text.charCodeAt(index);
        hash |= 0;
    }
    return Math.abs(hash);
}

function renderResultsHero(product) {
    if (!product) {
        return;
    }

    resultsState.heroProductId = product.id;

    const image = document.getElementById('resultsHeroImage');
    if (image) {
        image.src = getProductDisplayImage(product);
    }

    const title = document.getElementById('resultsHeroTitle');
    if (title) {
        title.textContent = resultsState.workInfo.title || product.title;
    }

    const byline = document.getElementById('resultsHeroByline');
    if (byline) {
        const mainTag = resultsState.workInfo.mainTag ? `#${resultsState.workInfo.mainTag}` : product.categoryLabel;
        byline.textContent = `Colecao completa em mockups realistas | ${mainTag}`;
    }

    const description = document.getElementById('resultsHeroDescription');
    if (description) {
        description.textContent = resultsState.workInfo.description
            || 'Página de resultados com amostras prontas para aprovação visual, publicação e envio ao cliente.';
    }

    const tags = document.getElementById('resultsHeroTags');
    if (tags) {
        const parsedTags = String(resultsState.workInfo.supportingTags || '')
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean)
            .slice(0, 6);
        const fallbackTags = [product.categoryLabel, product.orientation, product.quality].filter(Boolean);
        const tagList = parsedTags.length ? parsedTags : fallbackTags;
        tags.innerHTML = tagList
            .map((tag) => `<span class="results-tag">${escapeHtml(tag)}</span>`)
            .join('');
    }
}

function renderResultsGrid(products) {
    const grid = document.getElementById('resultsGrid');
    if (!grid) {
        return;
    }

    grid.innerHTML = products.map((product) => {
        const imageSrc = getProductDisplayImage(product);
        return `
            <article class="results-card" data-product-id="${escapeHtml(product.id)}" data-category="${escapeHtml(product.category || '')}" data-title="${escapeHtml(product.title.toLowerCase())}" data-live="${product.liveRenderable ? '1' : '0'}">
                <button type="button" class="results-favorite-btn" aria-label="Adicionar aos favoritos">
                    <i class="far fa-heart"></i>
                </button>
                <div class="results-card-media">
                    <img
                        id="resultsImage_${escapeHtml(product.id)}"
                        src="${escapeHtml(imageSrc)}"
                        alt="${escapeHtml(product.title)}"
                        loading="lazy"
                        decoding="async"
                    >
                </div>
                <div class="results-card-info">
                    <h3>${escapeHtml(product.title)}</h3>
                    <p class="results-card-meta">${escapeHtml(product.categoryLabel)}</p>
                    <strong class="results-card-price">${formatCurrencyBRL(product.priceCurrent)}</strong>
                    <p class="results-card-old-price">${formatCurrencyBRL(product.priceOld)} (${product.discount}% off)</p>
                    <button type="button" class="results-download-btn" data-product-id="${escapeHtml(product.id)}">
                        <i class="fas fa-download"></i>
                        Baixar amostra
                    </button>
                </div>
            </article>
        `;
    }).join('');
}

function setupResultsLazyRendering(forceRerender = false) {
    if (!resultsState.liveRenderEnabled) {
        return;
    }

    const cards = Array.from(document.querySelectorAll('.results-card[data-live="1"]'));
    if (!cards.length) {
        return;
    }

    if (resultsState.observer) {
        resultsState.observer.disconnect();
    }

    const renderCard = (card) => {
        const productId = card.dataset.productId;
        if (!productId) {
            return;
        }
        const product = resultsState.productsById.get(productId);
        if (!product || !product.liveRenderable) {
            return;
        }
        if (product.rendered && !forceRerender) {
            return;
        }

        const stateOverride = typeof resolveEditorStateForMockup === 'function'
            ? resolveEditorStateForMockup(product.mockupRef, { persistIfMissing: false })
            : null;
        const output = buildMockupPreviewDataUrl(product.mockupRef, RESULTS_RENDER_WIDTH, RESULTS_RENDER_HEIGHT, {
            showGuides: false,
            includeText: false,
            includeLogo: false,
            editorStateOverride: stateOverride
        });

        if (!output) {
            return;
        }

        const image = document.getElementById(`resultsImage_${product.id}`);
        if (image) {
            image.src = output;
        }
        product.imageSrc = output;
        product.rendered = true;
        resultsState.renderedCount += 1;

        if (resultsState.heroProductId === product.id) {
            const heroImage = document.getElementById('resultsHeroImage');
            if (heroImage) {
                heroImage.src = output;
            }
        }

        if (resultsState.renderedCount % 8 === 0) {
            setResultsStatus(`Renderização em andamento: ${resultsState.renderedCount} amostras refinadas.`);
        }
    };

    if (typeof IntersectionObserver !== 'undefined') {
        resultsState.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                renderCard(entry.target);
                resultsState.observer.unobserve(entry.target);
            });
        }, { rootMargin: RESULTS_INTERSECTION_ROOT_MARGIN });

        cards.forEach((card) => {
            resultsState.observer.observe(card);
        });
    } else {
        cards.slice(0, 24).forEach((card) => {
            renderCard(card);
        });
    }
}

function resetLazyRenderingState() {
    resultsState.renderedCount = 0;
    resultsState.products.forEach((product) => {
        if (product.liveRenderable) {
            product.rendered = false;
        }
    });
}

function applyResultsFilters() {
    const query = String(document.getElementById('resultsSearchInput')?.value || '')
        .trim()
        .toLowerCase();
    const category = String(document.getElementById('resultsCategoryFilter')?.value || 'all');

    let visibleCount = 0;
    document.querySelectorAll('.results-card').forEach((card) => {
        const cardTitle = String(card.dataset.title || '');
        const cardCategory = String(card.dataset.category || '');
        const matchQuery = !query || cardTitle.includes(query);
        const matchCategory = category === 'all' || cardCategory === category;
        const visible = matchQuery && matchCategory;
        card.style.display = visible ? '' : 'none';
        if (visible) {
            visibleCount += 1;
        }
    });

    const count = document.getElementById('resultsProductsCount');
    if (count) {
        count.textContent = String(visibleCount);
    }

    const hasAny = visibleCount > 0;
    const empty = document.getElementById('resultsEmptyState');
    if (empty) {
        empty.style.display = hasAny ? 'none' : 'block';
    }
}

function populateResultsCategoryFilter(products) {
    const select = document.getElementById('resultsCategoryFilter');
    if (!select) {
        return;
    }

    const categories = new Map();
    products.forEach((product) => {
        const key = String(product.category || '').trim();
        if (!key) {
            return;
        }
        if (!categories.has(key)) {
            categories.set(key, product.categoryLabel || key);
        }
    });

    categories.forEach((label, key) => {
        select.insertAdjacentHTML(
            'beforeend',
            `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`
        );
    });

    const count = document.getElementById('resultsProductsCount');
    if (count) {
        count.textContent = String(products.length);
    }
}

function getProductDisplayImage(product) {
    if (isDataImage(product.imageSrc)) {
        return product.imageSrc;
    }

    if (product.mockupRef && typeof generatePreviewSvg === 'function') {
        const svg = generatePreviewSvg(product.mockupRef);
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700">
            <rect width="900" height="700" fill="#f1f5f9"/>
            <rect x="140" y="90" width="620" height="520" rx="28" fill="#ffffff" stroke="#cbd5e1" stroke-width="8"/>
            <text x="450" y="345" text-anchor="middle" font-family="Segoe UI, Arial" font-size="36" fill="#475569">Preview indisponível</text>
        </svg>
    `);
}

function normalizeDataImage(value) {
    return isDataImage(value) ? value : '';
}

function isDataImage(value) {
    return String(value || '').startsWith('data:image/');
}

function downloadProductSample(product) {
    const source = getProductDisplayImage(product);
    if (!isDataImage(source)) {
        alert('Amostra indisponível para download neste item.');
        return;
    }

    const anchor = document.createElement('a');
    anchor.href = source;
    anchor.download = `resultado-${slugifyValue(product.title || `mockup-${product.mockupId}`)}.png`;
    anchor.click();
}

function setResultsStatus(message) {
    const status = document.getElementById('resultsStatusMessage');
    if (!status) {
        return;
    }
    status.textContent = String(message || '');
}

function showResultsEmptyState(visible) {
    const empty = document.getElementById('resultsEmptyState');
    const grid = document.getElementById('resultsGrid');
    if (empty) {
        empty.style.display = visible ? 'block' : 'none';
    }
    if (grid) {
        grid.style.display = visible ? 'none' : 'grid';
    }
}

function formatCurrencyBRL(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return 'R$ 0,00';
    }
    return numeric.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function slugifyValue(value) {
    return String(value || 'mockup')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 72) || 'mockup';
}

function delay(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, Math.max(0, Number(ms) || 0));
    });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
