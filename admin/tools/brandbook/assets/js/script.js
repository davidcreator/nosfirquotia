const SAVED_EDITS_STORAGE_KEY = 'mockuphub_saved_edits_v1';
const WORK_INFO_STORAGE_KEY = 'mockuphub_work_info_v1';
const OG_SETTINGS_STORAGE_KEY = 'ogImageSettings';

const ROLE_ORDER = [
    ['primary', 'Primaria'],
    ['secondary', 'Secundaria'],
    ['accent', 'Acento'],
    ['neutralLight', 'Neutra clara'],
    ['neutralDark', 'Neutra escura']
];

const HARMONY_LABELS = {
    monochromatic: 'Monocromatica',
    analogous: 'Analogica',
    complementary: 'Complementar',
    triadic: 'Triadica',
    tetradic: 'Tetradica',
    splitComplementary: 'Split-complementar'
};

const SECTOR_LABELS = {
    none: 'Sem preset',
    saas: 'SaaS e Produtos Digitais',
    ecommerce: 'E-commerce e Varejo',
    health: 'Saude e Bem-estar',
    education: 'Educacao e Cursos',
    finance: 'Financas e Seguros',
    fashion: 'Moda e Lifestyle'
};

let latestPayload = null;

document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    renderBrandBook();

    const api = getBrandKitApi();
    if (api && typeof api.onStorageChange === 'function') {
        api.onStorageChange(() => renderBrandBook());
    }
});

function bindEvents() {
    document.getElementById('refreshReportBtn')?.addEventListener('click', () => {
        renderBrandBook();
    });

    document.getElementById('copyPayloadBtn')?.addEventListener('click', async () => {
        if (!latestPayload) {
            setStatus('Gere o relatorio antes de copiar o JSON.', 'warn');
            return;
        }

        const content = JSON.stringify(latestPayload, null, 2);
        try {
            await navigator.clipboard.writeText(content);
            setStatus('Payload copiado para a area de transferencia.', 'ok');
        } catch (error) {
            const target = document.getElementById('brandbookPayload');
            if (target) {
                target.select();
                document.execCommand('copy');
                setStatus('Payload copiado com fallback.', 'ok');
                return;
            }
            setStatus('Nao foi possivel copiar automaticamente.', 'warn');
        }
    });

    document.getElementById('downloadPayloadBtn')?.addEventListener('click', () => {
        if (!latestPayload) {
            setStatus('Nenhum payload consolidado para download.', 'warn');
            return;
        }

        const fileName = `brandbook-${formatDateForFile(new Date())}.json`;
        downloadText(JSON.stringify(latestPayload, null, 2), fileName, 'application/json;charset=utf-8');
        setStatus('Arquivo JSON exportado com sucesso.', 'ok');
    });
}

function renderBrandBook() {
    const context = buildContext();
    latestPayload = context.payload;

    renderMetrics(context);
    renderProject(context.project);
    renderIntegration(context.integrationNotes);
    renderColorSystem(context);
    renderInsightList('combinationList', context.combinations, 'Sem combinacoes no momento.');
    renderInsightList('trendList', context.trends, 'Sem tendencias no momento.');
    renderTypography(context.typography);
    renderOg(context.og);
    renderMockups(context.mockups);
    renderPayload(context.payload);

    const warnCount = context.integrationNotes.filter((note) => note.level === 'warn').length;
    if (warnCount > 0) {
        setStatus(`Relatorio atualizado com ${warnCount} alerta(s) de integracao.`, 'warn');
    } else {
        setStatus('Relatorio BrandBook atualizado com sucesso.', 'ok');
    }
}

function buildContext() {
    const generatedAt = new Date().toISOString();
    const snapshot = getIntegrationSnapshot();
    const workInfo = getWorkInfo();
    const mockups = getMockups();
    const project = resolveProject(workInfo, mockups);
    const colorSystem = resolveColorSystem(snapshot);
    const insights = resolveInsights(snapshot, colorSystem);
    const typography = resolveTypography(snapshot);
    const og = resolveOg(snapshot);

    const integrationNotes = buildIntegrationNotes({
        hasSnapshot: Boolean(snapshot?.brandKit || snapshot?.colorPalette || snapshot?.fontProfile),
        hasInsights: insights.combinations.length > 0 || insights.trends.length > 0,
        colorCount: colorSystem.paletteColors.length,
        hasTypography: typography.primaryFontName !== 'Nao definido' || typography.secondaryFontName !== 'Nao definido',
        mockupCount: mockups.length,
        hasOg: og.available
    });

    const payload = {
        schema: 'brandbook_v1',
        generatedAt,
        source: 'brandbook_tool',
        storageKeys: {
            brandKit: 'aq_brand_kit_v1',
            colorPalette: 'aq_color_palette_state_v1',
            fontProfile: 'aq_font_profile_state_v1',
            brandInsights: 'aq_brand_insights_state_v1',
            ogProfile: 'aq_og_profile_state_v1',
            workInfo: WORK_INFO_STORAGE_KEY,
            mockups: SAVED_EDITS_STORAGE_KEY,
            ogSettings: OG_SETTINGS_STORAGE_KEY
        },
        identity: {
            project,
            paletteType: colorSystem.paletteType,
            harmony: colorSystem.harmony,
            sectorProfile: colorSystem.sectorProfile,
            paletteSummary: insights.summary,
            roleMap: colorSystem.roleMap,
            paletteColors: colorSystem.paletteColors,
            typography
        },
        strategy: {
            combinations: insights.combinations,
            trends: insights.trends,
            recommendations: insights.recommendations
        },
        applications: {
            digital: {
                og
            },
            mockups: {
                total: mockups.length,
                items: mockups.map((item) => ({
                    id: item.id,
                    title: item.title,
                    categoryLabel: item.categoryLabel,
                    orientation: item.orientation,
                    quality: item.quality,
                    savedAt: item.savedAt
                }))
            }
        },
        integrationNotes
    };

    return {
        generatedAt,
        snapshot,
        project,
        mockups,
        typography,
        og,
        integrationNotes,
        payload,
        paletteType: colorSystem.paletteType,
        harmony: colorSystem.harmony,
        sectorProfile: colorSystem.sectorProfile,
        paletteSummary: insights.summary,
        roleMap: colorSystem.roleMap,
        paletteColors: colorSystem.paletteColors,
        combinations: insights.combinations,
        trends: insights.trends,
        recommendations: insights.recommendations
    };
}

function resolveColorSystem(snapshot) {
    const brandKit = snapshot?.brandKit || {};
    const brandInsights = snapshot?.brandInsights || {};
    const colorPalette = snapshot?.colorPalette || {};
    const brandColors = brandKit.brandColors || {};
    const roleMapRaw = brandInsights.roles || {};
    const roleMap = {
        primary: normalizeHex(roleMapRaw.primary || brandColors.primary, '#3498db'),
        secondary: normalizeHex(roleMapRaw.secondary || brandColors.secondary, '#1f2937'),
        accent: normalizeHex(roleMapRaw.accent || brandColors.accent, '#f59e0b'),
        neutralLight: normalizeHex(roleMapRaw.neutralLight, '#f8fafc'),
        neutralDark: normalizeHex(roleMapRaw.neutralDark || brandColors.neutral, '#111827')
    };

    const colors = uniqueColors([
        ...(Array.isArray(brandInsights.colors) ? brandInsights.colors : []),
        ...(Array.isArray(brandKit?.palette?.colors) ? brandKit.palette.colors : []),
        roleMap.primary,
        roleMap.secondary,
        roleMap.accent,
        roleMap.neutralLight,
        roleMap.neutralDark
    ]).slice(0, 12);

    const paletteType = String(
        brandInsights.paletteType
        || brandKit?.palette?.type
        || colorPalette?.type
        || 'monochromatic'
    );
    const harmony = resolveHarmonyProfile(snapshot, paletteType);
    const sectorProfile = resolveSectorProfile(snapshot);

    return {
        roleMap,
        paletteColors: colors,
        paletteType,
        harmony,
        sectorProfile
    };
}

function resolveInsights(snapshot, colorSystem) {
    const brandInsights = snapshot?.brandInsights || {};
    const combinations = Array.isArray(brandInsights.combinations) && brandInsights.combinations.length
        ? sanitizeInsightList(brandInsights.combinations, 8)
        : buildFallbackCombinations(colorSystem);
    const trends = Array.isArray(brandInsights.trends) && brandInsights.trends.length
        ? sanitizeInsightList(brandInsights.trends, 8)
        : buildFallbackTrends(colorSystem);
    const summary = String(brandInsights.summary || '').trim() || (
        `Paleta ${colorSystem.paletteType} com ${colorSystem.paletteColors.length} cor(es) consolidada para aplicacoes digitais e materiais de marca.`
    );
    const recommendations = Array.isArray(brandInsights.recommendations) && brandInsights.recommendations.length
        ? brandInsights.recommendations.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 8)
        : [
            'Priorize contraste AA/AAA em textos e componentes de acao.',
            'Use a regra 60-30-10 para distribuir pesos visuais entre secoes.',
            'Mantenha o acento para destaques e chamadas, evitando excesso visual.'
        ];

    const harmonyLabel = colorSystem?.harmony?.label || HARMONY_LABELS.monochromatic;
    const harmonySpread = Number.isFinite(colorSystem?.harmony?.spread) ? colorSystem.harmony.spread : 24;
    if (recommendations.length < 8) {
        recommendations.push(`Preserve a regra ${harmonyLabel} com abertura de ${harmonySpread}deg para manter consistencia da identidade visual.`);
    }
    const sectorLabel = colorSystem?.sectorProfile?.label || SECTOR_LABELS.none;
    if (colorSystem?.sectorProfile?.key && colorSystem.sectorProfile.key !== 'none' && recommendations.length < 8) {
        recommendations.push(`Preset setorial ativo: ${sectorLabel}. Alinhe campanhas, interface e materiais do BrandBook nesse direcionamento.`);
    }

    return {
        summary,
        combinations,
        trends,
        recommendations
    };
}

function buildFallbackCombinations(colorSystem) {
    const roleMap = colorSystem.roleMap;
    return [
        {
            label: 'Estrutura 60-30-10',
            value: `${roleMap.primary.toUpperCase()} / ${roleMap.secondary.toUpperCase()} / ${roleMap.accent.toUpperCase()}`,
            detail: 'Aplicar primaria como base, secundaria em blocos e acento em interacoes principais.'
        },
        {
            label: 'Plano de superficie',
            value: `${roleMap.neutralLight.toUpperCase()} + ${roleMap.neutralDark.toUpperCase()}`,
            detail: 'Combinar neutros garante leitura consistente para paineis e tabelas.'
        }
    ];
}

function buildFallbackTrends(colorSystem) {
    const roleMap = colorSystem.roleMap;
    const [hue, saturation] = hexToHsl(roleMap.primary);
    const trends = [
        {
            label: 'Data-Driven UI',
            value: `${roleMap.primary.toUpperCase()} com fundos claros`,
            detail: 'Tendencia forte em sistemas SaaS com foco em legibilidade e performance.'
        }
    ];

    if (hue >= 180 && hue <= 250) {
        trends.push({
            label: 'Trust Gradient',
            value: `${roleMap.primary.toUpperCase()} -> ${roleMap.secondary.toUpperCase()}`,
            detail: 'Gradientes frios continuam relevantes para tecnologia e financeiro.'
        });
    } else if (hue >= 20 && hue <= 75) {
        trends.push({
            label: 'Sunset Conversion',
            value: `${roleMap.primary.toUpperCase()} com ${roleMap.accent.toUpperCase()}`,
            detail: 'Direcao com energia para campanhas de venda e crescimento.'
        });
    } else {
        trends.push({
            label: 'Editorial Balance',
            value: `${roleMap.neutralDark.toUpperCase()} com acentos pontuais`,
            detail: 'Visual equilibrado para marcas premium e conteudo institucional.'
        });
    }

    if (saturation < 38) {
        trends.push({
            label: 'Soft Minimalism',
            value: `${roleMap.neutralLight.toUpperCase()} como superficie`,
            detail: 'Tendencia minimalista para interfaces limpas e foco em conteudo.'
        });
    } else {
        trends.push({
            label: 'High-Energy Blocks',
            value: `${roleMap.accent.toUpperCase()} em componentes criticos`,
            detail: 'Destaque de acao com energia cromatica controlada.'
        });
    }

    return trends.slice(0, 8);
}

function sanitizeInsightList(items, maxItems) {
    return items
        .map((item) => ({
            label: String(item?.label || '').trim(),
            value: String(item?.value || '').trim(),
            detail: String(item?.detail || '').trim()
        }))
        .filter((item) => item.label || item.value || item.detail)
        .slice(0, maxItems);
}

function resolveTypography(snapshot) {
    const brandKitTypography = snapshot?.brandKit?.typography || {};
    const fontProfile = snapshot?.fontProfile || {};
    return {
        primaryFontName: String(brandKitTypography.primaryFontName || fontProfile.primaryFontName || 'Nao definido'),
        secondaryFontName: String(brandKitTypography.secondaryFontName || fontProfile.secondaryFontName || 'Nao definido'),
        pairingStyle: String(brandKitTypography.pairingStyle || fontProfile.pairingStyle || 'Nao definido'),
        tone: String(brandKitTypography.tone || fontProfile.tone || 'Nao definido'),
        notes: String(brandKitTypography.notes || fontProfile.notes || ''),
        source: String(brandKitTypography.source || fontProfile.source || 'brandkit')
    };
}

function resolveOg(snapshot) {
    const profile = snapshot?.ogProfile || {};
    if (profile.available) {
        return {
            available: true,
            title: String(profile.title || ''),
            description: String(profile.description || ''),
            brand: String(profile.brand || ''),
            template: String(profile.template || ''),
            primaryColor: normalizeHex(profile.primaryColor, '#667eea'),
            secondaryColor: normalizeHex(profile.secondaryColor, '#764ba2'),
            imageOpacity: sanitizeNumber(profile.imageOpacity, 0.8),
            overlayOpacity: sanitizeNumber(profile.overlayOpacity, 0.5),
            source: String(profile.source || 'ogprofile')
        };
    }

    const saved = readStorageJson(OG_SETTINGS_STORAGE_KEY, null);
    if (!saved || typeof saved !== 'object') {
        return {
            available: false,
            title: '',
            description: '',
            brand: '',
            template: '',
            primaryColor: '',
            secondaryColor: '',
            imageOpacity: null,
            overlayOpacity: null,
            source: 'none'
        };
    }

    return {
        available: true,
        title: String(saved.title || ''),
        description: String(saved.description || ''),
        brand: String(saved.brand || ''),
        template: String(saved.selectedTemplate || saved.template || ''),
        primaryColor: normalizeHex(saved.primaryColor, '#667eea'),
        secondaryColor: normalizeHex(saved.secondaryColor, '#764ba2'),
        imageOpacity: sanitizeNumber(saved.imageOpacity, 0.8),
        overlayOpacity: sanitizeNumber(saved.overlayOpacity, 0.5),
        source: 'localstorage'
    };
}

function resolveProject(workInfo, mockups) {
    const latest = mockups[0] || null;
    const fallbackTitle = latest ? latest.title : 'Projeto sem titulo';
    const tags = String(workInfo.supportingTags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 20);

    return {
        title: String(workInfo.title || fallbackTitle),
        mainTag: String(workInfo.mainTag || (latest ? latest.categoryLabel : '')),
        supportingTags: tags,
        description: String(workInfo.description || 'Descricao nao registrada nesta sessao.')
    };
}

function getWorkInfo() {
    const raw = readStorageJson(WORK_INFO_STORAGE_KEY, {});
    return {
        title: String(raw.title || '').slice(0, 120),
        mainTag: String(raw.mainTag || '').slice(0, 50),
        supportingTags: String(raw.supportingTags || '').slice(0, 900),
        description: String(raw.description || '').slice(0, 1800)
    };
}

function getMockups() {
    const raw = readStorageJson(SAVED_EDITS_STORAGE_KEY, []);
    if (!Array.isArray(raw)) {
        return [];
    }

    return raw
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
            id: String(item.id || ''),
            title: String(item.title || 'Mockup salvo').slice(0, 180),
            categoryLabel: String(item.categoryLabel || item.category || 'Categoria').slice(0, 80),
            orientation: String(item.orientation || '-').slice(0, 40),
            quality: String(item.quality || '-').slice(0, 40),
            savedAt: String(item.savedAt || '')
        }))
        .filter((item) => item.id !== '')
        .sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0))
        .slice(0, 20);
}

function buildIntegrationNotes(context) {
    const notes = [];
    notes.push(context.hasSnapshot
        ? { level: 'ok', message: 'Brand Kit detectado e usado na consolidacao.' }
        : { level: 'warn', message: 'Brand Kit nao detectado. Relatorio usando fallback local.' });

    notes.push(context.hasInsights
        ? { level: 'ok', message: 'Insights de combinacoes e tendencias disponiveis para o BrandBook.' }
        : { level: 'warn', message: 'Sem insights consolidados. Gere paleta no Color Palette para enriquecer o relatorio.' });

    notes.push(context.colorCount > 0
        ? { level: 'ok', message: `Sistema de cores consolidado com ${context.colorCount} cor(es).` }
        : { level: 'warn', message: 'Nenhuma cor consolidada encontrada.' });

    notes.push(context.hasTypography
        ? { level: 'ok', message: 'Tipografia detectada no fluxo de integracao.' }
        : { level: 'warn', message: 'Tipografia nao definida. Recomendado executar Font Strategy Advisor.' });

    notes.push(context.mockupCount > 0
        ? { level: 'ok', message: `Mockups encontrados: ${context.mockupCount}.` }
        : { level: 'warn', message: 'Sem mockups salvos nesta sessao.' });

    notes.push(context.hasOg
        ? { level: 'ok', message: 'Diretriz OG detectada e pronta para uso no projeto.' }
        : { level: 'warn', message: 'Diretriz OG nao encontrada. Abra o OG Image Generator e salve configuracoes.' });

    return notes;
}

function renderMetrics(context) {
    setText('metricColorCount', String(context.paletteColors.length));
    setText('metricCombinationCount', String(context.combinations.length));
    setText('metricTrendCount', String(context.trends.length));
    setText('metricMockupCount', String(context.mockups.length));
    setText('metricOgStatus', context.og.available ? 'Configurado' : 'Sem dados');
}

function renderProject(project) {
    const target = document.getElementById('projectInfoGrid');
    if (!target) {
        return;
    }

    target.innerHTML = [
        buildInfoCard('Titulo', project.title),
        buildInfoCard('Tag principal', project.mainTag ? `#${project.mainTag}` : 'Sem tag'),
        buildInfoCard('Descricao', project.description, true),
        buildInfoCard('Tags de apoio', project.supportingTags.length ? project.supportingTags.join(', ') : 'Sem tags', true)
    ].join('');
}

function buildInfoCard(label, value, isParagraph = false) {
    const safeValue = escapeHtml(String(value || ''));
    return `
        <article class="info-card">
            <small>${escapeHtml(label)}</small>
            ${isParagraph ? `<p>${safeValue}</p>` : `<strong>${safeValue}</strong>`}
        </article>
    `;
}

function renderIntegration(notes) {
    const list = document.getElementById('integrationStatus');
    if (!list) {
        return;
    }

    list.innerHTML = notes.map((note) => `
        <li class="${escapeHtml(note.level)}">${escapeHtml(note.message)}</li>
    `).join('');
}

function renderColorSystem(context) {
    const harmonyLabel = context?.harmony?.label || HARMONY_LABELS.monochromatic;
    const harmonySpread = Number.isFinite(context?.harmony?.spread) ? context.harmony.spread : 24;
    const sectorLabel = context?.sectorProfile?.label || SECTOR_LABELS.none;
    const summary = `${context.paletteSummary} Regra ativa: ${harmonyLabel} (${harmonySpread}deg). Setor: ${sectorLabel}.`;
    setText('paletteSummary', summary);

    const roleTarget = document.getElementById('paletteRoles');
    if (roleTarget) {
        roleTarget.innerHTML = ROLE_ORDER.map(([key, label]) => {
            const color = normalizeHex(context.roleMap[key], '#1d4ed8');
            const textColor = pickTextColor(color);
            return `
                <article class="role-card">
                    <div class="role-chip" style="--role-color:${color};--role-text:${textColor};">${escapeHtml(label)}</div>
                    <div class="role-meta">
                        <strong>${escapeHtml(color.toUpperCase())}</strong>
                    </div>
                </article>
            `;
        }).join('');
    }

    const swatchTarget = document.getElementById('paletteSwatches');
    if (swatchTarget) {
        swatchTarget.innerHTML = context.paletteColors.map((hex) => `
            <article class="swatch-card">
                <div class="swatch-color" style="background:${escapeHtml(hex)};"></div>
                <code>${escapeHtml(hex.toUpperCase())}</code>
            </article>
        `).join('');
    }
}

function resolveHarmonyProfile(snapshot, paletteType) {
    const rawHarmony = snapshot?.colorPalette?.harmony || snapshot?.brandInsights?.harmony || {};
    const rule = normalizeHarmonyRule(rawHarmony?.rule || paletteType);
    const rawSpread = Number.parseInt(String(rawHarmony?.spread || ''), 10);
    const spread = Number.isFinite(rawSpread)
        ? Math.max(12, Math.min(120, rawSpread))
        : getDefaultHarmonySpread(rule);

    return {
        rule,
        spread,
        label: HARMONY_LABELS[rule] || HARMONY_LABELS.monochromatic
    };
}

function resolveSectorProfile(snapshot) {
    const raw = snapshot?.colorPalette?.sectorProfile || snapshot?.brandInsights?.sectorProfile || {};
    const key = normalizeSectorKey(raw?.key || 'none');
    return {
        key,
        label: SECTOR_LABELS[key] || SECTOR_LABELS.none
    };
}

function normalizeSectorKey(value) {
    const raw = String(value || '').trim();
    return Object.prototype.hasOwnProperty.call(SECTOR_LABELS, raw) ? raw : 'none';
}

function normalizeHarmonyRule(value) {
    const raw = String(value || '').trim();
    return Object.prototype.hasOwnProperty.call(HARMONY_LABELS, raw) ? raw : 'monochromatic';
}

function getDefaultHarmonySpread(rule) {
    const safeRule = normalizeHarmonyRule(rule);
    const map = {
        monochromatic: 24,
        analogous: 28,
        complementary: 64,
        triadic: 34,
        tetradic: 26,
        splitComplementary: 34
    };
    return map[safeRule] || 30;
}

function renderInsightList(targetId, items, emptyMessage) {
    const target = document.getElementById(targetId);
    if (!target) {
        return;
    }

    if (!Array.isArray(items) || !items.length) {
        target.innerHTML = `<article class="insight-card"><strong>${escapeHtml(emptyMessage)}</strong></article>`;
        return;
    }

    target.innerHTML = items.map((item) => `
        <article class="insight-card">
            <strong>${escapeHtml(item.label || 'Insight')}</strong>
            <span class="meta">${escapeHtml(item.value || '-')}</span>
            <p>${escapeHtml(item.detail || '')}</p>
        </article>
    `).join('');
}

function renderTypography(typography) {
    const target = document.getElementById('typographyBlock');
    if (!target) {
        return;
    }

    const rows = [
        ['Fonte primaria', typography.primaryFontName],
        ['Fonte secundaria', typography.secondaryFontName],
        ['Pairing', typography.pairingStyle],
        ['Tom', typography.tone],
        ['Notas', typography.notes || 'Sem observacoes']
    ];

    target.innerHTML = rows.map(([label, value]) => `
        <article class="detail-item">
            <small>${escapeHtml(label)}</small>
            <strong>${escapeHtml(String(value || '-'))}</strong>
        </article>
    `).join('');
}

function renderOg(og) {
    const target = document.getElementById('ogBlock');
    if (!target) {
        return;
    }

    if (!og.available) {
        target.innerHTML = `
            <article class="detail-item">
                <small>Status</small>
                <strong>Sem diretriz OG configurada</strong>
            </article>
        `;
        return;
    }

    const rows = [
        ['Marca', og.brand || 'Nao definido'],
        ['Template', og.template || 'Nao definido'],
        ['Titulo', og.title || 'Nao definido'],
        ['Descricao', og.description || 'Nao definido'],
        ['Cores', [og.primaryColor, og.secondaryColor].filter(Boolean).join(' | ') || 'Nao definido'],
        ['Opacidade', `Imagem ${og.imageOpacity ?? '-'} | Overlay ${og.overlayOpacity ?? '-'}`]
    ];

    target.innerHTML = rows.map(([label, value]) => `
        <article class="detail-item">
            <small>${escapeHtml(label)}</small>
            <strong>${escapeHtml(String(value || '-'))}</strong>
        </article>
    `).join('');
}

function renderMockups(mockups) {
    const target = document.getElementById('mockupList');
    if (!target) {
        return;
    }

    if (!mockups.length) {
        target.innerHTML = '<article class="mockup-item"><div><strong>Sem mockups salvos.</strong><span>Abra a ferramenta de mockups para gerar exemplos aplicados.</span></div></article>';
        return;
    }

    target.innerHTML = mockups.slice(0, 8).map((item) => `
        <article class="mockup-item">
            <div>
                <strong>${escapeHtml(item.title)}</strong>
                <span>${escapeHtml(item.categoryLabel)} | ${escapeHtml(item.orientation)} | ${escapeHtml(formatDate(item.savedAt))}</span>
            </div>
            <span class="mockup-badge">${escapeHtml(item.quality || '-')}</span>
        </article>
    `).join('');
}

function renderPayload(payload) {
    const target = document.getElementById('brandbookPayload');
    if (!target) {
        return;
    }
    target.value = JSON.stringify(payload, null, 2);
}

function setStatus(message, level = '') {
    const target = document.getElementById('statusLine');
    if (!target) {
        return;
    }
    target.textContent = message;
    target.classList.remove('ok', 'warn', 'error');
    if (level) {
        target.classList.add(level);
    }
}

function getIntegrationSnapshot() {
    const api = getBrandKitApi();
    if (!api || typeof api.getIntegrationSnapshot !== 'function') {
        return null;
    }
    const snapshot = api.getIntegrationSnapshot();
    return snapshot && typeof snapshot === 'object' ? snapshot : null;
}

function getBrandKitApi() {
    return window.AQBrandKit || null;
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

function uniqueColors(colors) {
    const api = getBrandKitApi();
    if (api && typeof api.uniqueColors === 'function') {
        return api.uniqueColors(colors);
    }
    const seen = new Set();
    return (Array.isArray(colors) ? colors : [])
        .map((color) => normalizeHex(color, ''))
        .filter((color) => {
            if (!color || seen.has(color)) {
                return false;
            }
            seen.add(color);
            return true;
        });
}

function normalizeHex(value, fallback = '#000000') {
    const api = getBrandKitApi();
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
    return String(fallback || '#000000').toLowerCase();
}

function pickTextColor(backgroundHex) {
    const white = '#ffffff';
    const dark = '#0f172a';
    const whiteRatio = getContrastRatio(backgroundHex, white);
    const darkRatio = getContrastRatio(backgroundHex, dark);
    return darkRatio >= whiteRatio ? dark : white;
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
    const clean = normalizeHex(hex, '#000000').replace('#', '');
    return {
        r: parseInt(clean.slice(0, 2), 16),
        g: parseInt(clean.slice(2, 4), 16),
        b: parseInt(clean.slice(4, 6), 16)
    };
}

function hexToHsl(hex) {
    const { r, g, b } = hexToRgb(hex);
    const nr = r / 255;
    const ng = g / 255;
    const nb = b / 255;
    const max = Math.max(nr, ng, nb);
    const min = Math.min(nr, ng, nb);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case nr:
                h = (ng - nb) / d + (ng < nb ? 6 : 0);
                break;
            case ng:
                h = (nb - nr) / d + 2;
                break;
            default:
                h = (nr - ng) / d + 4;
                break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function sanitizeNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function setText(id, value) {
    const target = document.getElementById(id);
    if (!target) {
        return;
    }
    target.textContent = String(value || '');
}

function downloadText(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}

function formatDate(value) {
    if (!value) {
        return '-';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
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
