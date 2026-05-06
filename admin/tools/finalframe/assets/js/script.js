const SAVED_EDITS_STORAGE_KEY = 'mockuphub_saved_edits_v1';
const WORK_INFO_STORAGE_KEY = 'mockuphub_work_info_v1';
const OG_SETTINGS_STORAGE_KEY = 'ogImageSettings';
const BGREMOVE_STATE_KEY_FALLBACK = 'aq_bgremove_state_v1';
const BGREMOVE_QUALITY_HISTORY_KEY = 'finalframe_bgremove_quality_history_v1';

const STRATEGY_LABELS = {
    objective: {
        confianca: 'Transmitir confiança',
        atencao: 'Ganhar atenção',
        acao: 'Estimular ação',
        sofisticacao: 'Posicionamento sofisticado',
        equilibrio: 'Bem-estar e equilíbrio',
        diversao: 'Energia e diversão'
    },
    context: {
        general: 'Geral',
        financas: 'Finanças e tecnologia',
        saude: 'Saúde e bem-estar',
        educacao: 'Educação',
        moda: 'Moda e beleza',
        namoro: 'Relacionamento e paixão',
        avaliacao: 'Avaliação e performance'
    },
    persona: {
        general: 'Geral',
        executive: 'Executiva e decisora',
        analytical: 'Analítica e racional',
        creative: 'Criativa e exploratória',
        pragmatic: 'Pragmática e objetiva',
        premium: 'Premium e sofisticada',
        youth: 'Jovem e dinâmica'
    },
    segment: {
        general: 'Geral',
        saas: 'SaaS e Produtos Digitais',
        ecommerce: 'E-commerce e Varejo',
        health: 'Saúde e Bem-estar',
        education: 'Educação e Cursos',
        finance: 'Finanças e Seguros',
        fashion: 'Moda e Lifestyle',
        industrial: 'Indústria e B2B',
        hospitality: 'Hospitalidade e Eventos'
    },
    channel: {
        multichannel: 'Multicanal',
        digital: 'Site e Produto Digital',
        social: 'Redes Sociais',
        performance: 'Campanhas de Performance',
        editorial: 'Materiais Editoriais',
        retail: 'Varejo e PDV',
        presentation: 'Apresentações Institucionais'
    }
};

let latestPayload = null;
let latestContext = null;
let latestBgSuggestion = null;

document.addEventListener('DOMContentLoaded', () => {
    bindEvents();
    renderFinalFrame();

    const api = getBrandKitApi();
    if (api && typeof api.onStorageChange === 'function') {
        api.onStorageChange(() => renderFinalFrame());
    }

    window.addEventListener('storage', (event) => {
        if (!event || !event.key) return;
        if (
            event.key === SAVED_EDITS_STORAGE_KEY
            || event.key === WORK_INFO_STORAGE_KEY
            || event.key === OG_SETTINGS_STORAGE_KEY
            || event.key === BGREMOVE_STATE_KEY_FALLBACK
        ) {
            renderFinalFrame();
        }
    });
});

function bindEvents() {
    document.getElementById('refreshReportBtn')?.addEventListener('click', () => {
        renderFinalFrame();
    });

    document.getElementById('copyPayloadBtn')?.addEventListener('click', async () => {
        if (!latestPayload) {
            setStatus('Gere o relatório antes de copiar o JSON.', 'warn');
            return;
        }

        const content = JSON.stringify(latestPayload, null, 2);
        try {
            await navigator.clipboard.writeText(content);
            setStatus('Payload copiado para a área de transferência.', 'ok');
        } catch (error) {
            const target = document.getElementById('finalframePayload');
            if (target) {
                target.select();
                document.execCommand('copy');
                setStatus('Payload copiado com fallback.', 'ok');
                return;
            }
            setStatus('Não foi possível copiar automaticamente.', 'warn');
        }
    });

    document.getElementById('downloadPayloadBtn')?.addEventListener('click', () => {
        if (!latestPayload) {
            setStatus('Nenhum payload consolidado para download.', 'warn');
            return;
        }
        const fileName = `finalframe-${formatDateForFile(new Date())}.json`;
        downloadText(JSON.stringify(latestPayload, null, 2), fileName, 'application/json;charset=utf-8');
        setStatus('Arquivo JSON exportado com sucesso.', 'ok');
    });

    document.getElementById('openBrandBookBtn')?.addEventListener('click', () => {
        window.location.href = '../brandbook/';
    });

    document.getElementById('applyBgRecommendationBtn')?.addEventListener('click', () => {
        applyBgRecommendation();
    });

    document.getElementById('clearBgHistoryBtn')?.addEventListener('click', () => {
        clearBgremoveHistory();
        const empty = readBgremoveHistory();
        renderBgremoveHistory(empty);
        setStatus('Histórico de qualidade limpo.', 'ok');
    });
}

function renderFinalFrame() {
    const context = buildContext();
    latestContext = context;
    latestPayload = context.payload;
    latestBgSuggestion = context.bgremoveQuality?.suggestion || null;

    renderMetrics(context);
    renderProject(context.project);
    renderIntegration(context.integrationNotes);
    renderBrandSummary(context);
    renderBgremove(context.bgremove);
    renderBgremoveQuality(context.bgremoveQuality);
    renderBgremoveHistory(syncBgremoveHistory(context.bgremove, context.bgremoveQuality));
    renderPayload(context.payload);

    const warnCount = context.integrationNotes.filter((note) => note.level === 'warn').length;
    const errorCount = context.integrationNotes.filter((note) => note.level === 'error').length;
    if (errorCount > 0) {
        setStatus(`FinalFrame atualizado com ${errorCount} erro(s) de integração.`, 'error');
    } else if (warnCount > 0) {
        setStatus(`FinalFrame atualizado com ${warnCount} alerta(s) de integração.`, 'warn');
    } else {
        setStatus('Relatório FinalFrame atualizado com sucesso.', 'ok');
    }
}

function buildContext() {
    const generatedAt = new Date().toISOString();
    const snapshot = getIntegrationSnapshot();
    const mockups = getMockups();
    const workInfo = getWorkInfo();
    const project = resolveProject(workInfo, mockups);
    const brand = resolveBrand(snapshot);
    const typography = resolveTypography(snapshot);
    const og = resolveOg(snapshot);
    const bgremove = resolveBgremove(snapshot);
    const bgremoveQuality = buildBgremoveQuality(bgremove);
    const bgremoveHistory = readBgremoveHistory().slice(0, 12);

    const readinessSignals = {
        hasBrandKit: Boolean(snapshot?.brandKit?.updatedAt),
        hasColors: brand.paletteColors.length > 0,
        hasStrategyProfile: brand.strategyProfile.available,
        hasContrastAudit: brand.contrastAudit.available,
        hasTypography: typography.isConfigured,
        hasOg: og.available,
        hasMockups: mockups.length > 0,
        hasBgremove: bgremove.hasResult
    };
    const readinessDone = Object.values(readinessSignals).filter(Boolean).length;
    const readinessTotal = Object.keys(readinessSignals).length;

    const integrationNotes = buildIntegrationNotes({
        hasBrandKit: readinessSignals.hasBrandKit,
        hasColors: readinessSignals.hasColors,
        hasStrategyProfile: readinessSignals.hasStrategyProfile,
        hasContrastAudit: readinessSignals.hasContrastAudit,
        contrastHardFails: brand.contrastAudit.hardFailCount,
        hasTypography: readinessSignals.hasTypography,
        hasOg: readinessSignals.hasOg,
        hasMockups: readinessSignals.hasMockups,
        hasBgremove: readinessSignals.hasBgremove,
        bgremoveQualityScore: bgremoveQuality.score
    });

    const payload = {
        schema: 'finalframe_v1',
        generatedAt,
        source: 'finalframe_tool',
        storageKeys: {
            brandKit: 'aq_brand_kit_v1',
            colorPalette: 'aq_color_palette_state_v1',
            fontProfile: 'aq_font_profile_state_v1',
            brandInsights: 'aq_brand_insights_state_v1',
            ogProfile: 'aq_og_profile_state_v1',
            bgremove: BGREMOVE_STATE_KEY_FALLBACK,
            workInfo: WORK_INFO_STORAGE_KEY,
            mockups: SAVED_EDITS_STORAGE_KEY,
            ogSettings: OG_SETTINGS_STORAGE_KEY
        },
        project,
        identity: {
            paletteType: brand.paletteType,
            roleMap: brand.roleMap,
            paletteColors: brand.paletteColors,
            strategyProfile: brand.strategyProfile,
            confidence: brand.confidence,
            contrastAudit: brand.contrastAudit,
            typography: {
                primaryFontName: typography.primaryFontName,
                secondaryFontName: typography.secondaryFontName,
                pairingStyle: typography.pairingStyle,
                tone: typography.tone,
                industry: typography.industry,
                channel: typography.channel,
                readability: typography.readability,
                brandPersonality: typography.brandPersonality,
                contentScale: typography.contentScale,
                hierarchyStyle: typography.hierarchyStyle,
                fontContrast: typography.fontContrast,
                confidenceScore: typography.confidenceScore,
                confidenceLabel: typography.confidenceLabel,
                confidenceDrivers: typography.confidenceDrivers,
                usageGuidelines: typography.usageGuidelines,
                riskAlerts: typography.riskAlerts
            }
        },
        applications: {
            og,
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
            },
            bgremove: {
                status: bgremove.status,
                hasUpload: bgremove.hasUpload,
                hasResult: bgremove.hasResult,
                hasAdjusted: bgremove.hasAdjusted,
                input: bgremove.input,
                settings: bgremove.settings,
                output: bgremove.output,
                presetApplied: String(bgremove.meta?.presetApplied || ''),
                presetSource: String(bgremove.meta?.presetSource || ''),
                handoffTarget: String(bgremove.meta?.handoffTarget || ''),
                handoffAt: String(bgremove.meta?.handoffAt || ''),
                smartConfidence: Number.isFinite(Number(bgremove.meta?.smartConfidence))
                    ? Number(bgremove.meta.smartConfidence)
                    : null,
                quality: {
                    available: bgremoveQuality.available,
                    score: bgremoveQuality.score,
                    grade: bgremoveQuality.grade,
                    level: bgremoveQuality.level,
                    summary: bgremoveQuality.summary,
                    recommendations: bgremoveQuality.recommendations
                },
                suggestedSettings: bgremoveQuality.suggestion || null,
                qualityHistory: bgremoveHistory.map((entry) => ({
                    id: entry.id,
                    timestamp: entry.timestamp,
                    score: entry.score,
                    grade: entry.grade,
                    level: entry.level,
                    preset: entry.preset,
                    smartConfidence: entry.smartConfidence
                }))
            }
        },
        readiness: {
            done: readinessDone,
            total: readinessTotal,
            signals: readinessSignals
        },
        integrationNotes
    };

    return {
        snapshot,
        payload,
        project,
        brand,
        typography,
        og,
        mockups,
        bgremove,
        bgremoveQuality,
        bgremoveHistory,
        integrationNotes,
        readinessDone,
        readinessTotal
    };
}

function resolveProject(workInfo, mockups) {
    const latest = mockups[0] || null;
    const fallbackTitle = latest ? latest.title : 'Projeto sem título';
    const tags = String(workInfo.supportingTags || '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 20);

    return {
        title: String(workInfo.title || fallbackTitle),
        mainTag: String(workInfo.mainTag || (latest ? latest.categoryLabel : '')),
        supportingTags: tags,
        description: String(workInfo.description || 'Descrição não registrada nesta sessão.')
    };
}

function resolveBrand(snapshot) {
    const brandKit = snapshot?.brandKit || {};
    const paletteState = snapshot?.colorPalette || {};
    const insights = snapshot?.brandInsights || {};
    const brandColors = brandKit.brandColors || {};
    const roleMapRaw = insights.roles || {};
    const roleMap = {
        primary: normalizeHex(roleMapRaw.primary || brandColors.primary, '#18447f'),
        secondary: normalizeHex(roleMapRaw.secondary || brandColors.secondary, '#0e2750'),
        accent: normalizeHex(roleMapRaw.accent || brandColors.accent, '#116d80'),
        neutralLight: normalizeHex(roleMapRaw.neutralLight, '#f7fbff'),
        neutralDark: normalizeHex(roleMapRaw.neutralDark || brandColors.neutral, '#223249')
    };

    const paletteColors = uniqueColors([
        ...(Array.isArray(insights.colors) ? insights.colors : []),
        ...(Array.isArray(brandKit?.palette?.colors) ? brandKit.palette.colors : []),
        ...(Array.isArray(paletteState.colors) ? paletteState.colors : []),
        roleMap.primary,
        roleMap.secondary,
        roleMap.accent,
        roleMap.neutralLight,
        roleMap.neutralDark
    ]).slice(0, 14);

    const strategyProfile = resolveStrategyProfile(insights.strategyProfile, paletteState);
    const confidence = resolveStrategyConfidence(insights.confidence);
    const contrastAudit = resolveStrategyContrastAudit(
        insights.contrastAudit,
        insights.contrast,
        strategyProfile.channelLabel
    );

    return {
        paletteType: String(insights.paletteType || brandKit?.palette?.type || paletteState?.type || 'monochromatic'),
        roleMap,
        paletteColors,
        strategyProfile,
        confidence,
        contrastAudit
    };
}

function resolveStrategyProfile(rawProfile, paletteState = {}) {
    const raw = rawProfile && typeof rawProfile === 'object' ? rawProfile : {};
    const objective = String(raw.objective || paletteState.objective || '').trim();
    const context = String(raw.context || paletteState.context || '').trim();
    const persona = String(raw.persona || paletteState.persona || '').trim();
    const segment = String(raw.segment || paletteState.segment || '').trim();
    const channel = String(raw.channel || paletteState.channel || '').trim();

    return {
        objective,
        context,
        persona,
        segment,
        channel,
        objectiveLabel: STRATEGY_LABELS.objective[objective] || 'Não definido',
        contextLabel: STRATEGY_LABELS.context[context] || 'Não definido',
        personaLabel: STRATEGY_LABELS.persona[persona] || 'Não definido',
        segmentLabel: STRATEGY_LABELS.segment[segment] || 'Não definido',
        channelLabel: STRATEGY_LABELS.channel[channel] || STRATEGY_LABELS.channel.multichannel,
        available: [objective, context, persona, segment, channel].some(Boolean)
    };
}

function resolveStrategyConfidence(rawConfidence) {
    const score = Number(rawConfidence?.score);
    const level = String(rawConfidence?.level || '').trim();
    const label = String(rawConfidence?.label || '').trim();
    return {
        available: Number.isFinite(score) || Boolean(level) || Boolean(label),
        score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : null,
        level: level || 'medium',
        label: label || 'Média',
        drivers: Array.isArray(rawConfidence?.drivers)
            ? rawConfidence.drivers.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 6)
            : []
    };
}

function resolveStrategyContrastAudit(rawAudit, fallbackContrast, fallbackChannelLabel) {
    const hasRawAudit = Boolean(rawAudit && typeof rawAudit === 'object');
    const pairs = hasRawAudit && Array.isArray(rawAudit.pairs) && rawAudit.pairs.length
        ? rawAudit.pairs
            .map((item) => ({
                label: String(item?.label || item?.id || 'Par de contraste').trim(),
                ratio: Number(item?.ratio),
                minimum: Number(item?.minimum),
                recommended: Number(item?.recommended),
                passMinimum: Boolean(item?.passMinimum),
                passRecommended: Boolean(item?.passRecommended)
            }))
            .filter((item) => item.label && Number.isFinite(item.ratio))
            .slice(0, 18)
        : (Array.isArray(fallbackContrast) ? fallbackContrast : [])
            .map((item, index) => ({
                label: `Par ${index + 1}`,
                ratio: Number(item?.ratio),
                minimum: 4.5,
                recommended: 4.5,
                passMinimum: Number(item?.ratio) >= 4.5,
                passRecommended: Number(item?.ratio) >= 4.5
            }))
            .filter((item) => Number.isFinite(item.ratio))
            .slice(0, 12);

    const minimumRatio = Number.isFinite(Number(rawAudit?.profile?.minimumRatio))
        ? Number(rawAudit.profile.minimumRatio)
        : 4.5;
    const recommendedRatio = Number.isFinite(Number(rawAudit?.profile?.recommendedRatio))
        ? Number(rawAudit.profile.recommendedRatio)
        : minimumRatio;

    const hardFailCount = Number.isFinite(Number(rawAudit?.hardFailCount))
        ? Number(rawAudit.hardFailCount)
        : pairs.filter((item) => item.ratio < (Number.isFinite(item.minimum) ? item.minimum : minimumRatio)).length;
    const softFailCount = Number.isFinite(Number(rawAudit?.softFailCount))
        ? Number(rawAudit.softFailCount)
        : pairs.filter((item) => {
            const min = Number.isFinite(item.minimum) ? item.minimum : minimumRatio;
            const rec = Number.isFinite(item.recommended) ? item.recommended : recommendedRatio;
            return item.ratio >= min && item.ratio < rec;
        }).length;
    const totalPairs = Number.isFinite(Number(rawAudit?.totalPairs))
        ? Number(rawAudit.totalPairs)
        : pairs.length;
    const passCount = Number.isFinite(Number(rawAudit?.passCount))
        ? Number(rawAudit.passCount)
        : Math.max(0, totalPairs - hardFailCount);

    return {
        available: pairs.length > 0,
        channel: String(rawAudit?.profile?.channel || '').trim(),
        channelLabel: String(rawAudit?.profile?.label || fallbackChannelLabel || STRATEGY_LABELS.channel.multichannel),
        minimumRatio,
        recommendedRatio,
        level: String(rawAudit?.profile?.level || 'AA').trim() || 'AA',
        passCount,
        totalPairs,
        hardFailCount,
        softFailCount,
        pairs
    };
}

function resolveTypography(snapshot) {
    const brandKitTypography = snapshot?.brandKit?.typography || {};
    const fontProfile = snapshot?.fontProfile || {};
    const primaryFontName = String(brandKitTypography.primaryFontName || fontProfile.primaryFontName || 'Não definido');
    const secondaryFontName = String(brandKitTypography.secondaryFontName || fontProfile.secondaryFontName || 'Não definido');
    const pairingStyle = String(brandKitTypography.pairingStyle || fontProfile.pairingStyle || 'Não definido');
    const tone = String(brandKitTypography.tone || fontProfile.tone || 'Não definido');
    const confidenceRaw = Number(fontProfile.confidenceScore ?? brandKitTypography.confidenceScore);
    const confidenceScore = Number.isFinite(confidenceRaw)
        ? Math.max(0, Math.min(100, Math.round(confidenceRaw)))
        : null;
    const confidenceLabel = String(fontProfile.confidenceLabel || brandKitTypography.confidenceLabel || '');
    const confidenceDrivers = toStringArray(fontProfile.confidenceDrivers || brandKitTypography.confidenceDrivers, 6);
    const usageGuidelines = toStringArray(fontProfile.usageGuidelines || brandKitTypography.usageGuidelines, 8);
    const riskAlerts = toStringArray(fontProfile.riskAlerts || brandKitTypography.riskAlerts, 8);
    return {
        primaryFontName,
        secondaryFontName,
        pairingStyle,
        tone,
        industry: String(fontProfile.industry || brandKitTypography.industry || 'geral'),
        channel: String(fontProfile.channel || brandKitTypography.channel || 'digital'),
        readability: String(fontProfile.readability || brandKitTypography.readability || 'media'),
        brandPersonality: String(fontProfile.brandPersonality || brandKitTypography.brandPersonality || 'sobria'),
        contentScale: String(fontProfile.contentScale || brandKitTypography.contentScale || 'medio'),
        hierarchyStyle: String(fontProfile.hierarchyStyle || brandKitTypography.hierarchyStyle || 'equilibrada'),
        fontContrast: String(fontProfile.fontContrast || brandKitTypography.fontContrast || 'medio'),
        confidenceScore,
        confidenceLabel: confidenceLabel || (confidenceScore !== null ? 'Média' : ''),
        confidenceDrivers,
        usageGuidelines,
        riskAlerts,
        source: String(brandKitTypography.source || fontProfile.source || 'system'),
        isConfigured: primaryFontName !== 'Não definido' || secondaryFontName !== 'Não definido'
    };
}

function toStringArray(value, maxItems = 8) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .map((entry) => String(entry || '').trim())
        .filter(Boolean)
        .slice(0, maxItems);
}

function translateTypographyLabel(group, key) {
    const maps = {
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
        }
    };
    const source = maps[group] || {};
    const normalized = String(key || '').trim();
    return source[normalized] || normalized || '-';
}

function resolveOg(snapshot) {
    const profile = snapshot?.ogProfile || {};
    if (profile.available) {
        return {
            available: true,
            title: String(profile.title || ''),
            brand: String(profile.brand || ''),
            template: String(profile.template || ''),
            primaryColor: normalizeHex(profile.primaryColor, '#18447f'),
            secondaryColor: normalizeHex(profile.secondaryColor, '#116d80'),
            source: String(profile.source || 'ogprofile')
        };
    }

    const saved = readStorageJson(OG_SETTINGS_STORAGE_KEY, null);
    if (!saved || typeof saved !== 'object') {
        return {
            available: false,
            title: '',
            brand: '',
            template: '',
            primaryColor: '',
            secondaryColor: '',
            source: 'none'
        };
    }

    return {
        available: true,
        title: String(saved.title || ''),
        brand: String(saved.brand || ''),
        template: String(saved.selectedTemplate || saved.template || ''),
        primaryColor: normalizeHex(saved.primaryColor, '#18447f'),
        secondaryColor: normalizeHex(saved.secondaryColor, '#116d80'),
        source: 'localstorage'
    };
}

function resolveBgremove(snapshot) {
    const fromSnapshot = snapshot?.bgremove && typeof snapshot.bgremove === 'object'
        ? snapshot.bgremove
        : null;
    const fallback = readStorageJson(BGREMOVE_STATE_KEY_FALLBACK, {});
    const state = fromSnapshot || fallback || {};
    const input = state.input && typeof state.input === 'object' ? state.input : {};
    const settings = state.settings && typeof state.settings === 'object' ? state.settings : {};
    const output = state.output && typeof state.output === 'object' ? state.output : {};

    const normalized = {
        updatedAt: String(state.updatedAt || ''),
        source: String(state.source || 'system'),
        status: String(state.status || 'idle'),
        hasUpload: Boolean(state.hasUpload),
        hasResult: Boolean(state.hasResult),
        hasAdjusted: Boolean(state.hasAdjusted),
        input: {
            name: String(input.name || ''),
            size: Number.isFinite(Number(input.size)) ? Number(input.size) : 0,
            type: String(input.type || '')
        },
        settings: {
            tolerance: toInt(settings.tolerance, 15),
            mode: String(settings.mode || 'auto'),
            feather: toInt(settings.feather, 1),
            noiseClean: toInt(settings.noiseClean, 45),
            fillHoles: toInt(settings.fillHoles, 35),
            edgeTrim: toInt(settings.edgeTrim, 5),
            presetKey: String(settings.presetKey || 'auto'),
            smartPreset: Boolean(settings.smartPreset)
        },
        output: {
            original: sanitizeOutputRef(String(output.original || '')),
            processed: sanitizeOutputRef(String(output.processed || '')),
            download: sanitizeOutputRef(String(output.download || '')),
            adjustedDownload: sanitizeOutputRef(String(output.adjustedDownload || '')),
            format: String(output.format || 'png')
        },
        meta: state.meta && typeof state.meta === 'object' ? state.meta : {}
    };

    if (!normalized.hasResult) {
        normalized.hasResult = normalized.output.processed !== '';
    }
    return normalized;
}

function sanitizeOutputRef(value) {
    if (!value) return '';
    if (value.startsWith('data:')) {
        return 'inline-adjustment';
    }
    return value.slice(0, 900);
}

function buildIntegrationNotes(context) {
    const notes = [];
    notes.push(context.hasBrandKit
        ? { level: 'ok', message: 'Brand Kit detectado e sincronizado.' }
        : { level: 'warn', message: 'Brand Kit não detectado. Execute uma ferramenta de estratégia para sincronizar.' });

    notes.push(context.hasColors
        ? { level: 'ok', message: 'Sistema de cores consolidado para aplicação.' }
        : { level: 'warn', message: 'Sem cores consolidadas no snapshot atual.' });

    notes.push(context.hasStrategyProfile
        ? { level: 'ok', message: 'Perfil estratégico sincronizado (objetivo, persona, segmento e canal).' }
        : { level: 'warn', message: 'Perfil estratégico ausente. Gere estratégia no Color Strategy Advisor.' });

    if (context.hasContrastAudit) {
        if (context.contrastHardFails > 0) {
            notes.push({
                level: 'warn',
                message: `Auditoria de contraste detectou ${context.contrastHardFails} ponto(s) crítico(s).`
            });
        } else {
            notes.push({ level: 'ok', message: 'Auditoria de contraste sincronizada sem falhas críticas.' });
        }
    } else {
        notes.push({ level: 'warn', message: 'Auditoria de contraste não encontrada para o relatório final.' });
    }

    notes.push(context.hasTypography
        ? { level: 'ok', message: 'Tipografia definida para o projeto.' }
        : { level: 'warn', message: 'Tipografia não definida. Recomendado executar Font Strategy Advisor.' });

    notes.push(context.hasOg
        ? { level: 'ok', message: 'Diretriz OG detectada e pronta para uso.' }
        : { level: 'warn', message: 'Diretriz OG não encontrada. Atualize no OG Image Generator.' });

    notes.push(context.hasMockups
        ? { level: 'ok', message: 'Mockups salvos encontrados para o relatório.' }
        : { level: 'warn', message: 'Nenhum mockup salvo nesta sessão.' });

    notes.push(context.hasBgremove
        ? { level: 'ok', message: 'Recorte de fundo registrado e pronto para composição.' }
        : { level: 'warn', message: 'Background remover sem resultado consolidado no momento.' });

    if (context.hasBgremove) {
        if (context.bgremoveQualityScore >= 70) {
            notes.push({ level: 'ok', message: `Qualidade do recorte em bom nível (${context.bgremoveQualityScore}/100).` });
        } else if (context.bgremoveQualityScore >= 45) {
            notes.push({ level: 'warn', message: `Qualidade do recorte mediana (${context.bgremoveQualityScore}/100). Recomendado ajuste fino.` });
        } else {
            notes.push({ level: 'error', message: `Qualidade do recorte baixa (${context.bgremoveQualityScore}/100). Revisar preset e bordas.` });
        }
    }

    return notes;
}

function renderMetrics(context) {
    setText('metricColorCount', String(context.brand.paletteColors.length));
    setText('metricFontStatus', context.typography.isConfigured ? 'Configurado' : 'Sem dados');
    setText('metricOgStatus', context.og.available ? 'Configurado' : 'Sem dados');
    setText('metricMockupCount', String(context.mockups.length));
    setText(
        'metricBgStatus',
        context.bgremove.hasResult
            ? `${context.bgremoveQuality.score}/100`
            : 'Sem dados'
    );
    setText('metricReadiness', `${context.readinessDone}/${context.readinessTotal}`);
}

function renderProject(project) {
    const target = document.getElementById('projectInfoGrid');
    if (!target) return;

    target.innerHTML = [
        buildInfoCard('Título', project.title),
        buildInfoCard('Tag principal', project.mainTag ? `#${project.mainTag}` : 'Sem tag'),
        buildInfoCard('Descrição', project.description, true),
        buildInfoCard('Tags de apoio', project.supportingTags.length ? project.supportingTags.join(', ') : 'Sem tags', true)
    ].join('');
}

function renderIntegration(notes) {
    const list = document.getElementById('integrationStatus');
    if (!list) return;
    list.innerHTML = notes.map((note) => `
        <li class="${escapeHtml(note.level)}">${escapeHtml(note.message)}</li>
    `).join('');
}

function renderBrandSummary(context) {
    const target = document.getElementById('brandSummaryBlock');
    if (!target) return;

    const rows = [
        ['Paleta', context.brand.paletteType],
        ['Cores consolidadas', String(context.brand.paletteColors.length)],
        ['Cor primária', context.brand.roleMap.primary.toUpperCase()],
        ['Cor secundária', context.brand.roleMap.secondary.toUpperCase()],
        ['Acento', context.brand.roleMap.accent.toUpperCase()],
        ['Persona', context.brand.strategyProfile.personaLabel],
        ['Segmento', context.brand.strategyProfile.segmentLabel],
        ['Canal', context.brand.strategyProfile.channelLabel],
        ['Confiança', context.brand.confidence.available && Number.isFinite(context.brand.confidence.score)
            ? `${context.brand.confidence.score}% (${context.brand.confidence.label})`
            : 'Sem dados'],
        ['Contraste', context.brand.contrastAudit.available
            ? `${context.brand.contrastAudit.passCount}/${context.brand.contrastAudit.totalPairs} pares aprovados`
            : 'Sem dados'],
        ['Fonte primária', context.typography.primaryFontName],
        ['Fonte secundária', context.typography.secondaryFontName],
        ['Perfil tipográfico', translateTypographyLabel('brandPersonality', context.typography.brandPersonality)],
        ['Canal tipográfico', translateTypographyLabel('channel', context.typography.channel)],
        ['Legibilidade', translateTypographyLabel('readability', context.typography.readability)],
        ['Confiança tipográfica', context.typography.confidenceScore !== null
            ? `${context.typography.confidenceScore}% (${context.typography.confidenceLabel || 'Média'})`
            : 'Sem dados'],
        ['Template OG', context.og.template || 'Não definido']
    ];

    target.innerHTML = rows.map(([label, value]) => `
        <article class="detail-item">
            <small>${escapeHtml(label)}</small>
            <strong>${escapeHtml(String(value || '-'))}</strong>
        </article>
    `).join('');
}

function renderBgremove(bgremove) {
    const target = document.getElementById('bgremoveBlock');
    if (!target) return;

    if (!bgremove.hasUpload && !bgremove.hasResult) {
        target.innerHTML = `
            <article class="detail-item">
                <small>Status</small>
                <strong>Sem dados do Background Remover</strong>
                <p>Abra a ferramenta, processe uma imagem e volte para atualizar o FinalFrame.</p>
            </article>
        `;
        return;
    }

    const details = [
        ['Status', bgremove.status || 'idle'],
        ['Arquivo', bgremove.input.name || 'Não informado'],
        ['Modo', bgremove.settings.mode || 'auto'],
        ['Preset', bgremove.settings.presetKey || 'auto'],
        ['Tolerancia', String(bgremove.settings.tolerance)],
        ['Suavização', String(bgremove.settings.feather)],
        ['Limpeza de ruído', String(bgremove.settings.noiseClean)],
        ['Preencher falhas', String(bgremove.settings.fillHoles)],
        ['Refino de borda', String(bgremove.settings.edgeTrim)],
        ['Ajustado manual', bgremove.hasAdjusted ? 'Sim' : 'Não'],
        ['Última atualização', bgremove.updatedAt ? formatDate(bgremove.updatedAt) : 'Sem registro']
    ];
    if (bgremove.meta?.handoffAt) {
        details.push(['Handoff', `Enviado para ${bgremove.meta?.handoffTarget || 'finalframe'} em ${formatDate(bgremove.meta.handoffAt)}`]);
    }

    const previewHtml = buildBgPreview(bgremove.output.processed);
    const presetApplied = String(bgremove.meta?.presetApplied || '');
    const presetSource = String(bgremove.meta?.presetSource || '');
    const smartConfidence = Number(bgremove.meta?.smartConfidence);

    let metaLine = '';
    if (presetApplied || presetSource) {
        metaLine = `Preset aplicado: ${presetApplied || '-'} (${presetSource || 'manual'})`;
    }
    if (Number.isFinite(smartConfidence)) {
        const pct = Math.max(0, Math.min(100, Math.round(smartConfidence * 100)));
        metaLine = metaLine ? `${metaLine} | Confiança IA: ${pct}%` : `Confiança IA: ${pct}%`;
    }

    target.innerHTML = `
        ${details.map(([label, value]) => `
            <article class="detail-item">
                <small>${escapeHtml(label)}</small>
                <strong>${escapeHtml(String(value || '-'))}</strong>
            </article>
        `).join('')}
        ${metaLine ? `
            <article class="detail-item">
                <small>Análise do preset</small>
                <strong>${escapeHtml(metaLine)}</strong>
            </article>
        ` : ''}
        ${previewHtml}
    `;
}

function buildBgremoveQuality(bgremove) {
    const empty = {
        available: false,
        score: 0,
        grade: 'Sem dados',
        level: 'warn',
        summary: 'Sem análise disponível para o recorte.',
        factors: [],
        recommendations: [{ level: 'warn', message: 'Processe uma imagem no Background Remover para gerar a análise completa.' }]
    };

    if (!bgremove || !bgremove.hasResult) {
        return empty;
    }

    const settings = bgremove.settings && typeof bgremove.settings === 'object' ? bgremove.settings : {};
    const meta = bgremove.meta && typeof bgremove.meta === 'object' ? bgremove.meta : {};
    const signals = meta.smartSignals && typeof meta.smartSignals === 'object' ? meta.smartSignals : {};
    const smartScores = meta.smartScores && typeof meta.smartScores === 'object' ? meta.smartScores : {};
    const presetKey = String(meta.presetApplied || settings.presetKey || 'auto').toLowerCase();

    const factors = [];
    const addFactor = (label, value, weight, detail) => {
        const safeWeight = clampNumber(weight, 0.1, 4);
        const safeValue = clampNumber(value, 0, 100);
        factors.push({
            label,
            value: Math.round(safeValue),
            weight: safeWeight,
            detail: String(detail || '')
        });
    };

    addFactor('Recorte gerado', 100, 2.2, 'A imagem sem fundo foi processada com sucesso.');
    addFactor('Ajuste manual', bgremove.hasAdjusted ? 86 : 58, 0.7, bgremove.hasAdjusted ? 'Pincel aplicado para refinamento.' : 'Sem pincel manual aplicado.');

    const smartConfidence = toNumber(meta.smartConfidence, null);
    if (smartConfidence !== null) {
        addFactor('Confiança da IA', smartConfidence * 100, 2.5, 'Confiança da seleção de preset inteligente.');
    }

    const scoreFromPreset = toNumber(smartScores[presetKey], null);
    if (scoreFromPreset !== null) {
        addFactor('Aderência do preset', scoreFromPreset * 100, 1.8, `Preset aplicado: ${presetKey}.`);
    }

    const edgeDensity = toNumber(signals.edgeDensity, null);
    if (edgeDensity !== null) {
        addFactor(
            'Densidade de bordas',
            rangeWindowScore(edgeDensity, 0.03, 0.5, 0.10, 0.28) * 100,
            1.2,
            `Valor detectado: ${roundTo(edgeDensity, 3)}.`
        );
    }

    const borderUniformity = toNumber(signals.borderUniformity, null);
    if (borderUniformity !== null) {
        addFactor(
            'Uniformidade do fundo',
            borderUniformity * 100,
            1.1,
            `Uniformidade nas bordas: ${Math.round(borderUniformity * 100)}%.`
        );
    }

    const presetTargets = getPresetTargets(presetKey);
    const settingsScore = average([
        targetClosenessScore(toNumber(settings.noiseClean, 45), presetTargets.noiseClean, 40),
        targetClosenessScore(toNumber(settings.fillHoles, 35), presetTargets.fillHoles, 45),
        targetClosenessScore(toNumber(settings.edgeTrim, 5), presetTargets.edgeTrim, 10),
        targetClosenessScore(toNumber(settings.feather, 1), presetTargets.feather, 6)
    ]);
    addFactor('Equilíbrio de ajustes', settingsScore, 1.7, 'Comparação dos controles com a faixa recomendada.');

    const weightedTotal = factors.reduce((acc, factor) => acc + (factor.value * factor.weight), 0);
    const weightSum = factors.reduce((acc, factor) => acc + factor.weight, 0);
    const score = weightSum > 0 ? Math.round(weightedTotal / weightSum) : 0;

    let grade = 'Crítico';
    let level = 'error';
    if (score >= 85) {
        grade = 'Excelente';
        level = 'ok';
    } else if (score >= 70) {
        grade = 'Muito bom';
        level = 'ok';
    } else if (score >= 55) {
        grade = 'Bom';
        level = 'warn';
    } else if (score >= 40) {
        grade = 'Regular';
        level = 'warn';
    }

    const recommendations = buildBgremoveRecommendations({
        score,
        level,
        hasAdjusted: Boolean(bgremove.hasAdjusted),
        settings,
        meta,
        edgeDensity,
        smartConfidence
    });
    const suggestion = buildBgremoveSuggestion({
        settings,
        meta,
        score,
        edgeDensity,
        smartConfidence
    });

    return {
        available: true,
        score,
        grade,
        level,
        summary: `${grade} (${score}/100)`,
        factors,
        recommendations,
        suggestion
    };
}

function buildBgremoveRecommendations(context) {
    const recs = [];
    const pushRec = (level, message) => recs.push({ level, message: String(message) });

    if (context.smartConfidence !== null && context.smartConfidence < 0.12) {
        pushRec('warn', 'Confiança da IA baixa. Use Comparar presets no Background Remover e valide visualmente o melhor recorte.');
    }
    if (toNumber(context.settings.noiseClean, 45) < 35) {
        pushRec('warn', 'Aumente Limpeza de ruído para faixa de 45 a 65 para reduzir resíduos no fundo.');
    }
    if (toNumber(context.settings.fillHoles, 35) < 25) {
        pushRec('warn', 'Aumente Preencher falhas para faixa de 30 a 55 para fechar micro-buracos no objeto.');
    }
    if (toNumber(context.settings.edgeTrim, 5) < 4 && context.edgeDensity !== null && context.edgeDensity > 0.18) {
        pushRec('warn', 'Aumente Refino de borda para 6 a 10 para reduzir halo em bordas complexas.');
    }
    if (toNumber(context.settings.feather, 1) === 0) {
        pushRec('warn', 'Use Suavização entre 1 e 2 para evitar serrilhado perceptível nas bordas.');
    }
    if (!context.hasAdjusted) {
        pushRec('ok', 'Aplique ajuste manual com pincel nas areas finas para melhorar acabamento final.');
    }
    if (String(context.meta?.presetSource || '') === 'custom' && !Boolean(context.settings.smartPreset)) {
        pushRec('ok', 'Ative Preset inteligente para testar uma configuração automática antes do ajuste manual.');
    }

    if (!recs.length) {
        pushRec('ok', 'Recorte consistente. Manter configuração atual e seguir para composição no mockup/OG.');
    }
    return recs.slice(0, 7);
}

function buildBgremoveSuggestion(context) {
    const settings = context.settings && typeof context.settings === 'object' ? context.settings : {};
    const meta = context.meta && typeof context.meta === 'object' ? context.meta : {};
    const suggestion = {
        presetKey: String(meta.presetApplied || settings.presetKey || 'auto'),
        mode: String(settings.mode || 'auto'),
        tolerance: clampInt(settings.tolerance, 5, 50, 15),
        feather: clampInt(settings.feather, 0, 8, 1),
        noiseClean: clampInt(settings.noiseClean, 0, 100, 45),
        fillHoles: clampInt(settings.fillHoles, 0, 100, 35),
        edgeTrim: clampInt(settings.edgeTrim, 0, 20, 5),
        autoBg: Boolean(settings.autoBg),
        smartPreset: Boolean(settings.smartPreset)
    };
    const notes = [];
    const score = toNumber(context.score, 0);
    const smartConfidence = toNumber(context.smartConfidence, null);
    const edgeDensity = toNumber(context.edgeDensity, null);

    if (smartConfidence !== null && smartConfidence < 0.12) {
        suggestion.smartPreset = true;
        suggestion.presetKey = 'auto';
        notes.push('Confiança IA baixa: reavaliar preset automaticamente.');
    }

    if (score < 70) {
        suggestion.noiseClean = Math.max(suggestion.noiseClean, 50);
        suggestion.fillHoles = Math.max(suggestion.fillHoles, 38);
        suggestion.feather = Math.max(suggestion.feather, 1);
        notes.push('Elevar limpeza e fechamento para reduzir resíduos e falhas internas.');
    }

    if (score < 55) {
        suggestion.noiseClean = Math.max(suggestion.noiseClean, 60);
        suggestion.fillHoles = Math.max(suggestion.fillHoles, 45);
        suggestion.edgeTrim = Math.max(suggestion.edgeTrim, 6);
        notes.push('Qualidade baixa: reforcar limpeza e refino de borda.');
    } else if (edgeDensity !== null && edgeDensity > 0.18) {
        suggestion.edgeTrim = Math.max(suggestion.edgeTrim, 6);
        notes.push('Borda densa detectada: aumentar refino de borda.');
    }

    if (suggestion.feather === 0) {
        suggestion.feather = 1;
        notes.push('Suavização mínima aplicada para reduzir serrilhado.');
    }

    suggestion.presetKey = normalizePresetKey(suggestion.presetKey);
    suggestion.reason = notes.length
        ? notes.join(' ')
        : 'Parâmetros atuais mantidos por boa consistência do recorte.';
    return suggestion;
}

function renderBgremoveQuality(quality) {
    const qualityTarget = document.getElementById('bgremoveQualityBlock');
    const recsTarget = document.getElementById('bgremoveRecommendations');
    const applyButton = document.getElementById('applyBgRecommendationBtn');
    if (!qualityTarget || !recsTarget) return;

    if (!quality || !quality.available) {
        if (applyButton) {
            applyButton.disabled = true;
            applyButton.textContent = 'Aplicar no BG Remove';
        }
        qualityTarget.innerHTML = `
            <article class="detail-item">
                <small>Status</small>
                <strong>Sem análise de qualidade</strong>
                <p>Processar imagem no Background Remover para habilitar score e recomendações.</p>
            </article>
        `;
        recsTarget.innerHTML = `
            <li class="warn">Sem recomendações até existir um recorte processado.</li>
        `;
        return;
    }

    if (applyButton) {
        applyButton.disabled = false;
        const preset = normalizePresetKey(quality.suggestion?.presetKey || 'auto');
        applyButton.textContent = `Aplicar no BG Remove (${preset})`;
    }

    const factorItems = (Array.isArray(quality.factors) ? quality.factors : []).map((factor) => `
        <article class="quality-factor">
            <div class="quality-factor-head">
                <small>${escapeHtml(factor.label)}</small>
                <strong>${escapeHtml(String(factor.value))}/100</strong>
            </div>
            <div class="quality-meter" role="presentation">
                <span data-meter-width="${escapeHtml(String(clampNumber(Number(factor.value), 0, 100)))}"></span>
            </div>
            <p>${escapeHtml(String(factor.detail || ''))}</p>
        </article>
    `).join('');

    qualityTarget.innerHTML = `
        <article class="detail-item quality-summary ${escapeHtml(quality.level || 'warn')}">
            <small>Score geral</small>
            <strong>${escapeHtml(quality.grade)} - ${escapeHtml(String(quality.score))}/100</strong>
            <p>${escapeHtml(quality.summary)}</p>
        </article>
        ${quality.suggestion?.reason ? `
            <article class="detail-item">
                <small>Diretriz recomendada</small>
                <strong>${escapeHtml(String(quality.suggestion.reason || ''))}</strong>
            </article>
        ` : ''}
        ${factorItems}
    `;
    applyQualityMeterWidths(qualityTarget);

    const recs = Array.isArray(quality.recommendations) ? quality.recommendations : [];
    recsTarget.innerHTML = recs.map((item) => `
        <li class="${escapeHtml(item.level || 'warn')}">${escapeHtml(String(item.message || ''))}</li>
    `).join('');
}

function applyQualityMeterWidths(root) {
    if (!root) {
        return;
    }

    root.querySelectorAll('[data-meter-width]').forEach((element) => {
        const raw = Number(element.getAttribute('data-meter-width'));
        const width = clampNumber(Number.isFinite(raw) ? raw : 0, 0, 100);
        element.style.width = `${width}%`;
    });
}

function applyBgRecommendation() {
    if (!latestContext || !latestContext.bgremove || !latestContext.bgremoveQuality?.available) {
        setStatus('Não há recomendações de recorte para aplicar no momento.', 'warn');
        return;
    }
    const suggestion = latestBgSuggestion || latestContext.bgremoveQuality?.suggestion;
    if (!suggestion) {
        setStatus('Não foi possível montar sugestão automática para o BG Remove.', 'warn');
        return;
    }

    const params = new URLSearchParams();
    params.set('from', 'finalframe');
    params.set('preset', normalizePresetKey(suggestion.presetKey || 'auto'));
    params.set('mode', String(suggestion.mode || 'auto'));
    params.set('tolerance', String(clampInt(suggestion.tolerance, 5, 50, 15)));
    params.set('feather', String(clampInt(suggestion.feather, 0, 8, 1)));
    params.set('noiseClean', String(clampInt(suggestion.noiseClean, 0, 100, 45)));
    params.set('fillHoles', String(clampInt(suggestion.fillHoles, 0, 100, 35)));
    params.set('edgeTrim', String(clampInt(suggestion.edgeTrim, 0, 20, 5)));
    params.set('autoBg', suggestion.autoBg ? '1' : '0');
    params.set('smartPreset', suggestion.smartPreset ? '1' : '0');

    const api = getBrandKitApi();
    if (api && typeof api.saveBgRemoveState === 'function') {
        try {
            api.saveBgRemoveState({
                status: 'recommendation_handoff',
                meta: {
                    ...(latestContext.bgremove.meta || {}),
                    handoffTarget: 'bgremove',
                    handoffAt: new Date().toISOString(),
                    recommendationSource: 'finalframe'
                }
            }, 'finalframe');
        } catch (error) {
            // Ignore and continue redirect.
        }
    }

    window.location.href = `../bgremove/?${params.toString()}`;
}

function readBgremoveHistory() {
    const raw = readStorageJson(BGREMOVE_QUALITY_HISTORY_KEY, []);
    if (!Array.isArray(raw)) {
        return [];
    }
    return raw
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry) => ({
            id: String(entry.id || ''),
            timestamp: String(entry.timestamp || ''),
            fileName: String(entry.fileName || 'Arquivo sem nome'),
            score: clampInt(entry.score, 0, 100, 0),
            grade: String(entry.grade || 'Sem dados'),
            level: String(entry.level || 'warn'),
            preset: normalizePresetKey(entry.preset || 'auto'),
            smartConfidence: toNumber(entry.smartConfidence, null),
            adjusted: Boolean(entry.adjusted)
        }))
        .filter((entry) => entry.id !== '')
        .slice(0, 30);
}

function writeBgremoveHistory(history) {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(BGREMOVE_QUALITY_HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
    } catch (error) {
        // Ignore storage quota errors.
    }
}

function clearBgremoveHistory() {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.removeItem(BGREMOVE_QUALITY_HISTORY_KEY);
    } catch (error) {
        // Ignore storage errors.
    }
}

function createBgremoveHistoryEntry(bgremove, quality) {
    if (!quality || !quality.available || !bgremove || !bgremove.hasResult) {
        return null;
    }
    const processedRef = String(bgremove.output?.processed || '');
    const preset = String(bgremove.meta?.presetApplied || bgremove.settings?.presetKey || 'auto');
    const stamp = String(bgremove.updatedAt || new Date().toISOString());
    const id = `${stamp}|${processedRef}|${quality.score}|${preset}`.slice(0, 260);
    return {
        id,
        timestamp: stamp,
        fileName: String(bgremove.input?.name || 'Arquivo sem nome'),
        score: clampInt(quality.score, 0, 100, 0),
        grade: String(quality.grade || 'Sem dados'),
        level: String(quality.level || 'warn'),
        preset: normalizePresetKey(preset),
        smartConfidence: toNumber(bgremove.meta?.smartConfidence, null),
        adjusted: Boolean(bgremove.hasAdjusted)
    };
}

function syncBgremoveHistory(bgremove, quality) {
    const history = readBgremoveHistory();
    const entry = createBgremoveHistoryEntry(bgremove, quality);
    if (!entry) {
        return history;
    }

    const sameIndex = history.findIndex((item) => item.id === entry.id);
    if (sameIndex >= 0) {
        history[sameIndex] = entry;
        writeBgremoveHistory(history);
        return history;
    }

    const next = [entry, ...history].slice(0, 30);
    writeBgremoveHistory(next);
    return next;
}

function renderBgremoveHistory(history) {
    const target = document.getElementById('bgremoveHistoryList');
    if (!target) return;

    const list = Array.isArray(history) ? history : [];
    if (!list.length) {
        target.innerHTML = `
            <div class="history-empty">
                Nenhum registro ainda. Gere recortes no Background Remover para montar o histórico.
            </div>
        `;
        return;
    }

    target.innerHTML = list.slice(0, 12).map((entry) => {
        const confidence = Number.isFinite(entry.smartConfidence)
            ? `${Math.round(clampNumber(entry.smartConfidence, 0, 1) * 100)}%`
            : 'n/d';
        return `
            <article class="history-card ${escapeHtml(entry.level || 'warn')}">
                <div class="history-head">
                    <strong>${escapeHtml(entry.fileName)} - ${escapeHtml(String(entry.score))}/100 (${escapeHtml(entry.grade)})</strong>
                    <small>${escapeHtml(formatDate(entry.timestamp))}</small>
                </div>
                <p class="history-meta">
                    <span>Preset: ${escapeHtml(entry.preset)}</span>
                    <span>Confiança IA: ${escapeHtml(confidence)}</span>
                    <span>Ajuste manual: ${entry.adjusted ? 'sim' : 'não'}</span>
                </p>
            </article>
        `;
    }).join('');
}

function buildBgPreview(src) {
    if (!src || src === 'inline-adjustment') {
        return '';
    }
    return `
        <article class="detail-item">
            <small>Preview do recorte</small>
            <div class="bg-preview">
                <img src="${escapeHtml(src)}" alt="Preview do recorte sem fundo">
            </div>
        </article>
    `;
}

function renderPayload(payload) {
    const target = document.getElementById('finalframePayload');
    if (!target) return;
    target.value = JSON.stringify(payload, null, 2);
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

function setStatus(message, level = '') {
    const target = document.getElementById('statusLine');
    if (!target) return;
    target.textContent = message;
    target.classList.remove('ok', 'warn', 'error');
    if (level) target.classList.add(level);
}

function setText(id, value) {
    const target = document.getElementById(id);
    if (!target) return;
    target.textContent = value;
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
    if (!Array.isArray(raw)) return [];

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

function readStorageJson(key, fallback) {
    if (typeof localStorage === 'undefined') return fallback;
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
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
            if (!color || seen.has(color)) return false;
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
    if (/^#[0-9a-f]{6}$/.test(raw)) return raw;
    if (/^#[0-9a-f]{3}$/.test(raw)) {
        return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`;
    }
    return fallback.toLowerCase();
}

function toInt(value, fallback) {
    const parsed = Number.parseInt(String(value), 10);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return parsed;
}

function clampNumber(value, min, max) {
    const numeric = toNumber(value, min);
    return Math.min(max, Math.max(min, numeric));
}

function clampInt(value, min, max, fallback) {
    const parsed = Number.parseInt(String(value), 10);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(max, Math.max(min, parsed));
}

function targetClosenessScore(value, target, tolerance) {
    const safeTolerance = Math.max(1, toNumber(tolerance, 20));
    const distance = Math.abs(toNumber(value, target) - toNumber(target, 0));
    const ratio = Math.min(1, distance / safeTolerance);
    return Math.round((1 - ratio) * 100);
}

function rangeWindowScore(value, lowLimit, highLimit, idealMin, idealMax) {
    const v = toNumber(value, 0);
    const low = toNumber(lowLimit, 0);
    const high = Math.max(low + 0.001, toNumber(highLimit, 1));
    const iMin = clampNumber(idealMin, low, high);
    const iMax = clampNumber(idealMax, iMin, high);
    if (v >= iMin && v <= iMax) {
        return 1;
    }
    if (v < iMin) {
        const distance = iMin - v;
        const span = Math.max(0.001, iMin - low);
        return clampNumber(1 - (distance / span), 0, 1);
    }
    const distance = v - iMax;
    const span = Math.max(0.001, high - iMax);
    return clampNumber(1 - (distance / span), 0, 1);
}

function average(values) {
    const list = Array.isArray(values) ? values.filter((value) => Number.isFinite(Number(value))) : [];
    if (!list.length) return 0;
    const total = list.reduce((sum, value) => sum + Number(value), 0);
    return total / list.length;
}

function roundTo(value, precision = 2) {
    const numeric = toNumber(value, 0);
    const digits = Math.max(0, Math.min(8, toInt(precision, 2)));
    const base = 10 ** digits;
    return Math.round(numeric * base) / base;
}

function getPresetTargets(presetKey) {
    const key = normalizePresetKey(presetKey);
    const map = {
        auto: { noiseClean: 45, fillHoles: 35, edgeTrim: 5, feather: 1 },
        portrait: { noiseClean: 35, fillHoles: 50, edgeTrim: 3, feather: 2 },
        product: { noiseClean: 65, fillHoles: 30, edgeTrim: 8, feather: 1 },
        logo: { noiseClean: 80, fillHoles: 20, edgeTrim: 10, feather: 0 },
        soft: { noiseClean: 25, fillHoles: 55, edgeTrim: 2, feather: 3 },
        custom: { noiseClean: 45, fillHoles: 35, edgeTrim: 5, feather: 1 }
    };
    return map[key] || map.auto;
}

function normalizePresetKey(value) {
    const key = String(value || 'auto').toLowerCase();
    const allowed = new Set(['auto', 'portrait', 'product', 'logo', 'soft', 'custom']);
    return allowed.has(key) ? key : 'auto';
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDate(input) {
    if (!input) return '-';
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString('pt-BR');
}

function downloadText(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 250);
}

function formatDateForFile(date) {
    const d = date instanceof Date ? date : new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}-${hour}${minute}`;
}

