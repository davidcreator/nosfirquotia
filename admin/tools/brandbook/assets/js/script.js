const SAVED_EDITS_STORAGE_KEY = 'mockuphub_saved_edits_v1';
const WORK_INFO_STORAGE_KEY = 'mockuphub_work_info_v1';
const OG_SETTINGS_STORAGE_KEY = 'ogImageSettings';

const ROLE_ORDER = [
    ['primary', 'Primária'],
    ['secondary', 'Secundária'],
    ['accent', 'Acento'],
    ['neutralLight', 'Neutra clara'],
    ['neutralDark', 'Neutra escura']
];

const HARMONY_LABELS = {
    monochromatic: 'Monocromática',
    analogous: 'Análoga',
    complementary: 'Complementar',
    triadic: 'Tríade',
    tetradic: 'Tetrádica',
    splitComplementary: 'Split-complementar'
};

const SECTOR_LABELS = {
    none: 'Sem preset',
    saas: 'SaaS e Produtos Digitais',
    ecommerce: 'E-commerce e Varejo',
    health: 'Saúde e Bem-estar',
    education: 'Educação e Cursos',
    finance: 'Finanças e Seguros',
    fashion: 'Moda e Lifestyle'
};

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
            setStatus('Gere o relatório antes de copiar o JSON.', 'warn');
            return;
        }

        const content = JSON.stringify(latestPayload, null, 2);
        try {
            await navigator.clipboard.writeText(content);
            setStatus('Payload copiado para a área de transferência.', 'ok');
        } catch (error) {
            const target = document.getElementById('brandbookPayload');
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
    renderInsightList('combinationList', context.combinations, 'Sem combinações no momento.');
    renderInsightList('trendList', context.trends, 'Sem tendências no momento.');
    renderTypography(context.typography);
    renderOg(context.og);
    renderStrategyProfile(context.strategyProfile, context.confidence);
    renderContrastAudit(context.contrastAudit);
    renderMockups(context.mockups);
    renderPayload(context.payload);

    const warnCount = context.integrationNotes.filter((note) => note.level === 'warn').length;
    if (warnCount > 0) {
        setStatus(`Relatório atualizado com ${warnCount} alerta(s) de integração.`, 'warn');
    } else {
        setStatus('Relatório do BrandBook atualizado com sucesso.', 'ok');
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
        hasStrategyProfile: insights.strategyProfile.available,
        hasContrastAudit: insights.contrastAudit.available,
        contrastHardFails: insights.contrastAudit.hardFailCount,
        colorCount: colorSystem.paletteColors.length,
        hasTypography: typography.primaryFontName !== 'Não definido' || typography.secondaryFontName !== 'Não definido',
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
            strategyProfile: insights.strategyProfile,
            confidence: insights.confidence,
            paletteSummary: insights.summary,
            roleMap: colorSystem.roleMap,
            paletteColors: colorSystem.paletteColors,
            typography
        },
        strategy: {
            combinations: insights.combinations,
            trends: insights.trends,
            contrastAudit: insights.contrastAudit,
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
        recommendations: insights.recommendations,
        strategyProfile: insights.strategyProfile,
        confidence: insights.confidence,
        contrastAudit: insights.contrastAudit
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
    const strategyProfile = resolveStrategyProfile(snapshot);
    const confidence = resolveStrategyConfidence(brandInsights.confidence);
    const contrastAudit = resolveStrategyContrastAudit(brandInsights.contrastAudit, brandInsights.contrast);

    const combinations = Array.isArray(brandInsights.combinations) && brandInsights.combinations.length
        ? sanitizeInsightList(brandInsights.combinations, 8)
        : buildFallbackCombinations(colorSystem);
    const trends = Array.isArray(brandInsights.trends) && brandInsights.trends.length
        ? sanitizeInsightList(brandInsights.trends, 8)
        : buildFallbackTrends(colorSystem);
    const summary = String(brandInsights.summary || '').trim() || (
        `Paleta ${colorSystem.paletteType} com ${colorSystem.paletteColors.length} cor(es) consolidada para aplicações digitais e materiais de marca.`
    );
    const recommendations = Array.isArray(brandInsights.recommendations) && brandInsights.recommendations.length
        ? brandInsights.recommendations.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 8)
        : [
            'Priorize contraste AA/AAA em textos e componentes de ação.',
            'Use a regra 60-30-10 para distribuir pesos visuais entre seções.',
            'Mantenha o acento para destaques e chamadas, evitando excesso visual.'
        ];

    const harmonyLabel = colorSystem?.harmony?.label || HARMONY_LABELS.monochromatic;
    const harmonySpread = Number.isFinite(colorSystem?.harmony?.spread) ? colorSystem.harmony.spread : 24;
    if (recommendations.length < 8) {
        recommendations.push(`Preserve a regra ${harmonyLabel} com abertura de ${harmonySpread}deg para manter consistência da identidade visual.`);
    }
    const sectorLabel = colorSystem?.sectorProfile?.label || SECTOR_LABELS.none;
    if (colorSystem?.sectorProfile?.key && colorSystem.sectorProfile.key !== 'none' && recommendations.length < 8) {
        recommendations.push(`Preset setorial ativo: ${sectorLabel}. Alinhe campanhas, interface e materiais do BrandBook nesse direcionamento.`);
    }
    if (strategyProfile.available && recommendations.length < 10) {
        recommendations.push(
            `Perfil estratégico ativo: ${strategyProfile.personaLabel} no canal ${strategyProfile.channelLabel} para o segmento ${strategyProfile.segmentLabel}.`
        );
    }
    if (contrastAudit.available) {
        if (contrastAudit.hardFailCount > 0 && recommendations.length < 10) {
            recommendations.push(
                `Ajuste obrigatório: ${contrastAudit.hardFailCount} pares de contraste abaixo do mínimo para ${contrastAudit.channelLabel}.`
            );
        } else if (recommendations.length < 10) {
            recommendations.push(
                `Contraste validado para ${contrastAudit.channelLabel}: ${contrastAudit.passCount}/${contrastAudit.totalPairs} pares em conformidade.`
            );
        }
    }

    return {
        summary,
        combinations,
        trends,
        recommendations,
        strategyProfile,
        confidence,
        contrastAudit
    };
}

function resolveStrategyProfile(snapshot) {
    const brandInsights = snapshot?.brandInsights || {};
    const colorPalette = snapshot?.colorPalette || {};
    const raw = brandInsights.strategyProfile || {};
    const objective = String(raw.objective || colorPalette.objective || '').trim();
    const context = String(raw.context || colorPalette.context || '').trim();
    const persona = String(raw.persona || colorPalette.persona || '').trim();
    const segment = String(raw.segment || colorPalette.segment || '').trim();
    const channel = String(raw.channel || colorPalette.channel || '').trim();

    const objectiveLabel = STRATEGY_LABELS.objective[objective] || 'Não definido';
    const contextLabel = STRATEGY_LABELS.context[context] || 'Não definido';
    const personaLabel = STRATEGY_LABELS.persona[persona] || 'Não definido';
    const segmentLabel = STRATEGY_LABELS.segment[segment] || 'Não definido';
    const channelLabel = STRATEGY_LABELS.channel[channel] || 'Não definido';

    return {
        objective,
        context,
        persona,
        segment,
        channel,
        objectiveLabel,
        contextLabel,
        personaLabel,
        segmentLabel,
        channelLabel,
        available: [objective, context, persona, segment, channel].some(Boolean)
    };
}

function resolveStrategyConfidence(rawConfidence) {
    const score = Number(rawConfidence?.score);
    const level = String(rawConfidence?.level || '').trim();
    const label = String(rawConfidence?.label || '').trim();
    const hasScore = Number.isFinite(score);
    return {
        available: hasScore || Boolean(level) || Boolean(label),
        score: hasScore ? Math.max(0, Math.min(100, Math.round(score))) : null,
        level: level || 'medium',
        label: label || 'Média',
        drivers: Array.isArray(rawConfidence?.drivers)
            ? rawConfidence.drivers.map((item) => String(item || '').trim()).filter(Boolean).slice(0, 6)
            : []
    };
}

function resolveStrategyContrastAudit(rawAudit, fallbackContrast) {
    const pairsFromAudit = Array.isArray(rawAudit?.pairs) ? rawAudit.pairs : [];
    const pairs = pairsFromAudit.length
        ? pairsFromAudit
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

    const minimumRatioRaw = Number(rawAudit?.profile?.minimumRatio);
    const recommendedRatioRaw = Number(rawAudit?.profile?.recommendedRatio);
    const minimumRatio = Number.isFinite(minimumRatioRaw) ? minimumRatioRaw : 4.5;
    const recommendedRatio = Number.isFinite(recommendedRatioRaw) ? recommendedRatioRaw : minimumRatio;

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
        channelLabel: String(rawAudit?.profile?.label || STRATEGY_LABELS.channel.multichannel),
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

function buildFallbackCombinations(colorSystem) {
    const roleMap = colorSystem.roleMap;
    return [
        {
            label: 'Estrutura 60-30-10',
            value: `${roleMap.primary.toUpperCase()} / ${roleMap.secondary.toUpperCase()} / ${roleMap.accent.toUpperCase()}`,
            detail: 'Aplicar primária como base, secundária em blocos e acento em interações principais.'
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
            detail: 'Tendência forte em sistemas SaaS com foco em legibilidade e performance.'
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
            detail: 'Direção com energia para campanhas de venda e crescimento.'
        });
    } else {
        trends.push({
            label: 'Editorial Balance',
            value: `${roleMap.neutralDark.toUpperCase()} com acentos pontuais`,
            detail: 'Visual equilibrado para marcas premium e conteúdo institucional.'
        });
    }

    if (saturation < 38) {
        trends.push({
            label: 'Soft Minimalism',
            value: `${roleMap.neutralLight.toUpperCase()} como superficie`,
            detail: 'Tendência minimalista para interfaces limpas e foco em conteúdo.'
        });
    } else {
        trends.push({
            label: 'High-Energy Blocks',
            value: `${roleMap.accent.toUpperCase()} em componentes críticos`,
            detail: 'Destaque de ação com energia cromática controlada.'
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
    const confidenceRaw = Number(fontProfile.confidenceScore ?? brandKitTypography.confidenceScore);
    const confidenceScore = Number.isFinite(confidenceRaw)
        ? Math.max(0, Math.min(100, Math.round(confidenceRaw)))
        : null;
    const confidenceLabel = String(fontProfile.confidenceLabel || brandKitTypography.confidenceLabel || '');
    const confidenceDrivers = toStringArray(fontProfile.confidenceDrivers || brandKitTypography.confidenceDrivers, 6);
    const usageGuidelines = toStringArray(fontProfile.usageGuidelines || brandKitTypography.usageGuidelines, 8);
    const riskAlerts = toStringArray(fontProfile.riskAlerts || brandKitTypography.riskAlerts, 8);
    const pairAlternatives = Array.isArray(fontProfile.pairAlternatives)
        ? fontProfile.pairAlternatives
        : (Array.isArray(brandKitTypography.pairAlternatives) ? brandKitTypography.pairAlternatives : []);

    return {
        primaryFontName: String(brandKitTypography.primaryFontName || fontProfile.primaryFontName || 'Não definido'),
        secondaryFontName: String(brandKitTypography.secondaryFontName || fontProfile.secondaryFontName || 'Não definido'),
        pairingStyle: String(brandKitTypography.pairingStyle || fontProfile.pairingStyle || 'Não definido'),
        tone: String(brandKitTypography.tone || fontProfile.tone || 'Não definido'),
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
        pairAlternativesCount: pairAlternatives.length,
        notes: String(brandKitTypography.notes || fontProfile.notes || ''),
        source: String(brandKitTypography.source || fontProfile.source || 'brandkit')
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
        ? { level: 'ok', message: 'Brand Kit detectado e usado na consolidação.' }
        : { level: 'warn', message: 'Brand Kit não detectado. Relatório usando fallback local.' });

    notes.push(context.hasInsights
        ? { level: 'ok', message: 'Insights de combinações e tendências disponíveis para o BrandBook.' }
        : { level: 'warn', message: 'Sem insights consolidados. Gere paleta no Color Palette para enriquecer o relatório.' });

    notes.push(context.hasStrategyProfile
        ? { level: 'ok', message: 'Perfil estratégico (objetivo, persona, segmento e canal) sincronizado.' }
        : { level: 'warn', message: 'Perfil estratégico não encontrado. Gere estratégia no Color Strategy Advisor.' });

    if (context.hasContrastAudit) {
        if (context.contrastHardFails > 0) {
            notes.push({
                level: 'warn',
                message: `Auditoria de contraste com ${context.contrastHardFails} ponto(s) crítico(s). Ajuste antes de publicar.`
            });
        } else {
            notes.push({ level: 'ok', message: 'Auditoria de contraste sincronizada sem falhas críticas.' });
        }
    } else {
        notes.push({ level: 'warn', message: 'Auditoria de contraste não encontrada no snapshot atual.' });
    }

    notes.push(context.colorCount > 0
        ? { level: 'ok', message: `Sistema de cores consolidado com ${context.colorCount} cor(es).` }
        : { level: 'warn', message: 'Nenhuma cor consolidada encontrada.' });

    notes.push(context.hasTypography
        ? { level: 'ok', message: 'Tipografia detectada no fluxo de integração.' }
        : { level: 'warn', message: 'Tipografia não definida. Recomendado executar Font Strategy Advisor.' });

    notes.push(context.mockupCount > 0
        ? { level: 'ok', message: `Mockups encontrados: ${context.mockupCount}.` }
        : { level: 'warn', message: 'Sem mockups salvos nesta sessão.' });

    notes.push(context.hasOg
        ? { level: 'ok', message: 'Diretriz OG detectada e pronta para uso no projeto.' }
        : { level: 'warn', message: 'Diretriz OG não encontrada. Abra o OG Image Generator e salve configurações.' });

    return notes;
}

function renderMetrics(context) {
    setText('metricColorCount', String(context.paletteColors.length));
    setText('metricCombinationCount', String(context.combinations.length));
    setText('metricTrendCount', String(context.trends.length));
    setText('metricMockupCount', String(context.mockups.length));
    setText('metricOgStatus', context.og.available ? 'Configurado' : 'Sem dados');
    setText(
        'metricContrastStatus',
        context.contrastAudit.available
            ? `${context.contrastAudit.passCount}/${context.contrastAudit.totalPairs}`
            : 'Sem dados'
    );
}

function renderProject(project) {
    const target = document.getElementById('projectInfoGrid');
    if (!target) {
        return;
    }

    target.innerHTML = [
        buildInfoCard('Título', project.title),
        buildInfoCard('Tag principal', project.mainTag ? `#${project.mainTag}` : 'Sem tag'),
        buildInfoCard('Descrição', project.description, true),
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
    const strategyLine = context?.strategyProfile?.available
        ? ` Perfil: ${context.strategyProfile.personaLabel} | ${context.strategyProfile.segmentLabel} | ${context.strategyProfile.channelLabel}.`
        : '';
    const confidenceLine = context?.confidence?.available && Number.isFinite(context.confidence.score)
        ? ` Confiança: ${context.confidence.score}% (${context.confidence.label}).`
        : '';
    const contrastLine = context?.contrastAudit?.available
        ? ` Contraste: ${context.contrastAudit.passCount}/${context.contrastAudit.totalPairs} pares aprovados.`
        : '';
    const summary = `${context.paletteSummary} Regra ativa: ${harmonyLabel} (${harmonySpread}deg). Setor: ${sectorLabel}.${strategyLine}${confidenceLine}${contrastLine}`;
    setText('paletteSummary', summary);

    const roleTarget = document.getElementById('paletteRoles');
    if (roleTarget) {
        roleTarget.innerHTML = ROLE_ORDER.map(([key, label]) => {
            const color = normalizeHex(context.roleMap[key], '#1d4ed8');
            const textColor = pickTextColor(color);
            return `
                <article class="role-card">
                    <div class="role-chip" data-role-color="${escapeHtml(color)}" data-role-text="${escapeHtml(textColor)}">${escapeHtml(label)}</div>
                    <div class="role-meta">
                        <strong>${escapeHtml(color.toUpperCase())}</strong>
                    </div>
                </article>
            `;
        }).join('');
        applyRoleChipColors(roleTarget);
    }

    const swatchTarget = document.getElementById('paletteSwatches');
    if (swatchTarget) {
        swatchTarget.innerHTML = context.paletteColors.map((hex) => `
            <article class="swatch-card">
                <div class="swatch-color" data-swatch-color="${escapeHtml(hex)}"></div>
                <code>${escapeHtml(hex.toUpperCase())}</code>
            </article>
        `).join('');
        applyPaletteSwatchColors(swatchTarget);
    }
}

function applyRoleChipColors(root) {
    if (!root) {
        return;
    }

    root.querySelectorAll('.role-chip[data-role-color]').forEach((element) => {
        const roleColor = String(element.getAttribute('data-role-color') || '').trim();
        const roleText = String(element.getAttribute('data-role-text') || '').trim();
        if (roleColor !== '') {
            element.style.setProperty('--role-color', roleColor);
        }
        if (roleText !== '') {
            element.style.setProperty('--role-text', roleText);
        }
    });
}

function applyPaletteSwatchColors(root) {
    if (!root) {
        return;
    }

    root.querySelectorAll('.swatch-color[data-swatch-color]').forEach((element) => {
        const color = String(element.getAttribute('data-swatch-color') || '').trim();
        if (color !== '') {
            element.style.background = color;
        }
    });
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
        ['Fonte primária', typography.primaryFontName],
        ['Fonte secundária', typography.secondaryFontName],
        ['Pairing', typography.pairingStyle],
        ['Tom', typography.tone],
        ['Segmento', translateTypographyLabel('industry', typography.industry)],
        ['Canal', translateTypographyLabel('channel', typography.channel)],
        ['Legibilidade', translateTypographyLabel('readability', typography.readability)],
        ['Personalidade', translateTypographyLabel('brandPersonality', typography.brandPersonality)],
        ['Escala de conteúdo', translateTypographyLabel('contentScale', typography.contentScale)],
        ['Hierarquia', translateTypographyLabel('hierarchyStyle', typography.hierarchyStyle)],
        ['Contraste tipográfico', translateTypographyLabel('fontContrast', typography.fontContrast)],
        ['Confiança', typography.confidenceScore !== null
            ? `${typography.confidenceScore}% (${typography.confidenceLabel || 'Média'})`
            : 'Sem dados'],
        ['Alternativas de par', String(typography.pairAlternativesCount || 0)],
        ['Diretrizes sugeridas', typography.usageGuidelines.length ? String(typography.usageGuidelines.length) : 'Sem dados'],
        ['Alertas tipográficos', typography.riskAlerts.length ? String(typography.riskAlerts.length) : 'Sem dados'],
        ['Notas', typography.notes || 'Sem observações']
    ];

    target.innerHTML = `
        ${rows.map(([label, value]) => `
            <article class="detail-item">
                <small>${escapeHtml(label)}</small>
                <strong>${escapeHtml(String(value || '-'))}</strong>
            </article>
        `).join('')}
        ${typography.confidenceDrivers.length ? `
            <article class="detail-item">
                <small>Drivers de confiança</small>
                <strong>${escapeHtml(typography.confidenceDrivers.slice(0, 3).join(' | '))}</strong>
            </article>
        ` : ''}
    `;
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
        ['Marca', og.brand || 'Não definido'],
        ['Template', og.template || 'Não definido'],
        ['Título', og.title || 'Não definido'],
        ['Descrição', og.description || 'Não definido'],
        ['Cores', [og.primaryColor, og.secondaryColor].filter(Boolean).join(' | ') || 'Não definido'],
        ['Opacidade', `Imagem ${og.imageOpacity ?? '-'} | Overlay ${og.overlayOpacity ?? '-'}`]
    ];

    target.innerHTML = rows.map(([label, value]) => `
        <article class="detail-item">
            <small>${escapeHtml(label)}</small>
            <strong>${escapeHtml(String(value || '-'))}</strong>
        </article>
    `).join('');
}

function renderStrategyProfile(strategyProfile, confidence) {
    const target = document.getElementById('strategyProfileBlock');
    if (!target) {
        return;
    }

    if (!strategyProfile?.available) {
        target.innerHTML = `
            <article class="detail-item">
                <small>Status</small>
                <strong>Sem perfil estratégico sincronizado</strong>
            </article>
        `;
        return;
    }

    const rows = [
        ['Objetivo', strategyProfile.objectiveLabel],
        ['Contexto', strategyProfile.contextLabel],
        ['Persona', strategyProfile.personaLabel],
        ['Segmento', strategyProfile.segmentLabel],
        ['Canal', strategyProfile.channelLabel],
        ['Confiança', confidence?.available && Number.isFinite(confidence?.score)
            ? `${confidence.score}% (${confidence.label || 'Média'})`
            : 'Sem dados']
    ];

    const drivers = Array.isArray(confidence?.drivers) ? confidence.drivers : [];
    target.innerHTML = `
        ${rows.map(([label, value]) => `
            <article class="detail-item">
                <small>${escapeHtml(label)}</small>
                <strong>${escapeHtml(String(value || 'Não definido'))}</strong>
            </article>
        `).join('')}
        ${drivers.length ? `
            <article class="detail-item">
                <small>Drivers de confiança</small>
                <strong>${escapeHtml(drivers.slice(0, 3).join(' | '))}</strong>
            </article>
        ` : ''}
    `;
}

function renderContrastAudit(contrastAudit) {
    const target = document.getElementById('contrastAuditStatus');
    if (!target) {
        return;
    }

    if (!contrastAudit?.available) {
        target.innerHTML = `
            <li class="warn">Sem auditoria de contraste no snapshot atual.</li>
        `;
        return;
    }

    const headerLevel = contrastAudit.hardFailCount > 0
        ? 'error'
        : contrastAudit.softFailCount > 0
            ? 'warn'
            : 'ok';

    const headerText = contrastAudit.hardFailCount > 0
        ? `Canal ${contrastAudit.channelLabel}: ${contrastAudit.hardFailCount} falha(s) crítica(s), ${contrastAudit.passCount}/${contrastAudit.totalPairs} pares aprovados.`
        : contrastAudit.softFailCount > 0
            ? `Canal ${contrastAudit.channelLabel}: sem falhas críticas, mas ${contrastAudit.softFailCount} ajuste(s) fino(s).`
            : `Canal ${contrastAudit.channelLabel}: ${contrastAudit.passCount}/${contrastAudit.totalPairs} pares aprovados sem falhas críticas.`;

    const rows = (Array.isArray(contrastAudit.pairs) ? contrastAudit.pairs : []).slice(0, 8).map((item) => {
        const level = item.passMinimum ? (item.passRecommended ? 'ok' : 'warn') : 'error';
        const min = Number.isFinite(item.minimum) ? item.minimum : contrastAudit.minimumRatio;
        const rec = Number.isFinite(item.recommended) ? item.recommended : contrastAudit.recommendedRatio;
        return {
            level,
            message: `${item.label}: ${Number(item.ratio || 0).toFixed(2)}:1 (mín ${Number(min).toFixed(1)}:1, alvo ${Number(rec).toFixed(1)}:1)`
        };
    });

    target.innerHTML = [
        `<li class="${headerLevel}">${escapeHtml(headerText)}</li>`,
        ...rows.map((row) => `<li class="${row.level}">${escapeHtml(row.message)}</li>`)
    ].join('');
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

