const COLORS = [
    { key: 'red', label: 'Vermelho', hex: '#E53935', family: 'warm' },
    { key: 'orange', label: 'Laranja', hex: '#FB8C00', family: 'warm' },
    { key: 'yellow', label: 'Amarelo', hex: '#FDD835', family: 'warm' },
    { key: 'green', label: 'Verde', hex: '#43A047', family: 'cool' },
    { key: 'blue', label: 'Azul', hex: '#1E88E5', family: 'cool' },
    { key: 'purple', label: 'Roxo', hex: '#8E24AA', family: 'cool' },
    { key: 'pink', label: 'Rosa', hex: '#D81B60', family: 'warm' },
    { key: 'brown', label: 'Marrom', hex: '#6D4C41', family: 'neutral' },
    { key: 'black', label: 'Preto', hex: '#111827', family: 'neutral' },
    { key: 'white', label: 'Branco', hex: '#F8FAFC', family: 'neutral' },
];

const OBJECTIVE_RULES = {
    confianca: { blue: 4, green: 2, black: 1, white: 1 },
    atencao: { red: 4, orange: 3, yellow: 3, blue: 1 },
    acao: { red: 4, orange: 3, yellow: 2, blue: 1 },
    sofisticacao: { black: 4, purple: 4, pink: 2, white: 2 },
    equilibrio: { green: 4, blue: 3, brown: 2, white: 1 },
    diversao: { orange: 4, yellow: 3, pink: 3, red: 2, purple: 2 },
};

const SEGMENT_RULES = {
    general: { blue: 1, green: 1, black: 1 },
    saas: { blue: 3, purple: 2, green: 1, white: 1 },
    ecommerce: { orange: 3, red: 2, yellow: 2, blue: 1 },
    health: { green: 3, blue: 2, white: 2 },
    education: { blue: 3, yellow: 1, green: 1, white: 1 },
    finance: { blue: 3, green: 2, black: 2, white: 1 },
    fashion: { black: 3, purple: 2, pink: 2, white: 1 },
    industrial: { blue: 2, black: 2, brown: 2, orange: 1 },
    hospitality: { orange: 2, pink: 1, yellow: 1, blue: 1, green: 1 },
};

const CHANNEL_RULES = {
    multichannel: { blue: 1, green: 1, black: 1, white: 1 },
    digital: { blue: 2, purple: 1, green: 1, white: 1 },
    social: { pink: 2, red: 2, orange: 2, purple: 1 },
    performance: { orange: 3, red: 2, yellow: 2, blue: 1 },
    editorial: { black: 2, brown: 1, blue: 1, white: 1 },
    retail: { red: 2, orange: 2, yellow: 1, black: 1 },
    presentation: { blue: 2, green: 1, black: 1, white: 1 },
};

const PERSONA_RULES = {
    general: { blue: 1, green: 1, black: 1 },
    executive: { blue: 3, black: 2, white: 1 },
    analytical: { blue: 3, green: 2, white: 1 },
    creative: { purple: 3, pink: 2, orange: 2, yellow: 1 },
    pragmatic: { blue: 2, green: 2, black: 1, orange: 1 },
    premium: { black: 3, purple: 2, white: 2, brown: 1 },
    youth: { orange: 3, yellow: 2, pink: 2, blue: 1 },
};

const CHANNEL_CONTRAST_TARGETS = {
    multichannel: {
        minimumRatio: 4.5,
        recommendedRatio: 4.8,
        level: 'AA',
        label: 'Multicanal'
    },
    digital: {
        minimumRatio: 4.5,
        recommendedRatio: 5.0,
        level: 'AA',
        label: 'Site e Produto Digital'
    },
    social: {
        minimumRatio: 4.5,
        recommendedRatio: 4.7,
        level: 'AA',
        label: 'Redes Sociais'
    },
    performance: {
        minimumRatio: 4.5,
        recommendedRatio: 5.5,
        level: 'AA',
        label: 'Campanhas de Performance'
    },
    editorial: {
        minimumRatio: 7.0,
        recommendedRatio: 7.0,
        level: 'AAA',
        label: 'Materiais Editoriais'
    },
    retail: {
        minimumRatio: 4.5,
        recommendedRatio: 4.8,
        level: 'AA',
        label: 'Varejo e PDV'
    },
    presentation: {
        minimumRatio: 4.5,
        recommendedRatio: 5.2,
        level: 'AA',
        label: 'Apresentações Institucionais'
    }
};

const DEFAULT_DIMENSION_WEIGHTS = {
    objective: 1.42,
    productType: 1.0,
    messageFrame: 0.94,
    audience: 0.8,
    persona: 0.92,
    arousal: 0.9,
    context: 1.22,
    segment: 1.08,
    channel: 0.96,
};

const WARM = ['red', 'orange', 'yellow', 'pink'];
const COOL = ['blue', 'green', 'purple'];
const VALID_HARMONY_RULES = new Set([
    'monochromatic',
    'analogous',
    'complementary',
    'triadic',
    'tetradic',
    'splitComplementary',
]);
const STRATEGY_HARMONY_BY_OBJECTIVE = {
    confianca: { rule: 'analogous', spread: 28 },
    atencao: { rule: 'complementary', spread: 64 },
    acao: { rule: 'splitComplementary', spread: 36 },
    sofisticacao: { rule: 'monochromatic', spread: 22 },
    equilibrio: { rule: 'analogous', spread: 26 },
    diversao: { rule: 'triadic', spread: 34 },
};
const COLOR_PDF_TEMPLATE_KEY = 'aq_color_pdf_template_mode_v1';

let latestInputs = null;
let latestResult = null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('strategyForm');
    const resetBtn = document.getElementById('resetBtn');
    const palettePreview = document.getElementById('palettePreview');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    const pdfTemplateSelect = document.getElementById('colorPdfTemplate');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const inputs = getFormValues();
        const result = evaluateStrategy(inputs);
        renderResult(result, inputs, { sync: true });
    });

    resetBtn.addEventListener('click', () => {
        form.reset();
        const inputs = getFormValues();
        const result = evaluateStrategy(inputs);
        renderResult(result, inputs, {
            sync: false,
            statusMessage: 'Diagnóstico resetado. Gere a estratégia para sincronizar com as outras ferramentas.',
        });
    });

    palettePreview.addEventListener('click', (event) => {
        const button = event.target.closest('.copy-hex');
        if (!button) {
            return;
        }

        const hex = button.getAttribute('data-hex') || '';
        if (!hex) {
            return;
        }

        navigator.clipboard?.writeText(hex).then(() => {
            const old = button.textContent;
            button.textContent = 'Copiado';
            setTimeout(() => {
                button.textContent = old;
            }, 900);
        }).catch(() => {
            alert(`Copie manualmente: ${hex}`);
        });
    });

    exportJsonBtn.addEventListener('click', exportJson);
    exportPdfBtn.addEventListener('click', exportPdf);
    if (pdfTemplateSelect) {
        const mode = readColorPdfTemplateMode();
        pdfTemplateSelect.value = mode;
        syncColorPdfExportButton(mode);
        pdfTemplateSelect.addEventListener('change', (event) => {
            const nextMode = persistColorPdfTemplateMode(event?.target?.value);
            syncColorPdfExportButton(nextMode);
            const label = nextMode === 'mini' ? 'Mini Brand Guide' : 'Brandbook Completo';
            setExportStatus(`Modelo PDF selecionado: ${label}.`);
        });
    }

    const initialInputs = getFormValues();
    const initial = evaluateStrategy(initialInputs);
    renderResult(initial, initialInputs, {
        sync: false,
        statusMessage: 'Prévia inicial carregada. Gere a estratégia para atualizar o ecossistema.',
    });
});

function getFormValues() {
    return {
        objective: getSelectValue('objective'),
        productType: getSelectValue('productType'),
        messageFrame: getSelectValue('messageFrame'),
        audience: getSelectValue('audience'),
        persona: getSelectValue('persona'),
        arousal: getSelectValue('arousal'),
        contentDensity: getSelectValue('contentDensity'),
        market: getSelectValue('market'),
        context: getSelectValue('context'),
        segment: getSelectValue('segment'),
        channel: getSelectValue('channel'),
        paletteSize: getSelectValue('paletteSize'),
    };
}

function getSelectValue(id) {
    return document.getElementById(id)?.value || '';
}

function evaluateStrategy(inputs) {
    const scoreMap = Object.fromEntries(
        COLORS.map((color) => [color.key, { ...color, score: 0, reasons: [] }])
    );

    const recommendations = [];
    const warnings = [];
    const weightProfile = resolveWeightProfile(inputs);

    applyWeightedRuleMap(scoreMap, OBJECTIVE_RULES[inputs.objective] || {}, 'Objetivo da marca', weightProfile.objective);

    if (inputs.productType === 'utilitario') {
        applyWeightedRuleMap(scoreMap, { blue: 3, green: 3, black: 2, brown: 1 }, 'Perfil utilitario', weightProfile.productType);
    } else {
        applyWeightedRuleMap(scoreMap, { red: 3, purple: 3, pink: 3, orange: 2, yellow: 1 }, 'Perfil hedonico', weightProfile.productType);
    }

    if (inputs.messageFrame === 'gain') {
        applyWeightedRuleMap(scoreMap, { blue: 3, green: 2, purple: 1 }, 'Mensagem de ganho', weightProfile.messageFrame);
    } else if (inputs.messageFrame === 'prevention') {
        applyWeightedRuleMap(scoreMap, { red: 3, yellow: 1, black: 1 }, 'Mensagem de prevencao', weightProfile.messageFrame);
    }

    if (inputs.audience === 'masculino') {
        applyWeightedRuleMap(scoreMap, { blue: 2, green: 1, black: 1 }, 'Afinidade público masculino', weightProfile.audience);
    } else if (inputs.audience === 'feminino') {
        applyWeightedRuleMap(scoreMap, { purple: 2, pink: 2, red: 1, blue: 1 }, 'Afinidade público feminino', weightProfile.audience);
    } else {
        applyWeightedRuleMap(scoreMap, { blue: 1, green: 1, purple: 1 }, 'Público misto', weightProfile.audience);
    }

    const personaRules = PERSONA_RULES[inputs.persona] || PERSONA_RULES.general;
    applyWeightedRuleMap(scoreMap, personaRules, `Persona: ${describePersona(inputs.persona)}`, weightProfile.persona);

    if (inputs.arousal === 'high') {
        addBulkScore(scoreMap, WARM, 2 * weightProfile.arousal, 'Excitação alta');
        addBulkScore(scoreMap, ['blue'], 1 * weightProfile.arousal, 'Excitação alta com controle');
    } else if (inputs.arousal === 'low') {
        addBulkScore(scoreMap, COOL, 2 * weightProfile.arousal, 'Excitação baixa');
        addBulkScore(scoreMap, WARM, -1 * weightProfile.arousal, 'Reduzir excesso de excitação');
    } else {
        addBulkScore(scoreMap, ['blue', 'green'], 1 * weightProfile.arousal, 'Equilíbrio de excitação');
    }

    if (inputs.context === 'financas') {
        applyWeightedRuleMap(scoreMap, { blue: 3, green: 2, black: 1 }, 'Contexto financeiro', weightProfile.context);
    } else if (inputs.context === 'saude') {
        applyWeightedRuleMap(scoreMap, { green: 3, blue: 2, white: 2 }, 'Contexto de saúde', weightProfile.context);
    } else if (inputs.context === 'educacao') {
        applyWeightedRuleMap(scoreMap, { blue: 2, green: 1, yellow: 1 }, 'Contexto educacional', weightProfile.context);
    } else if (inputs.context === 'moda') {
        applyWeightedRuleMap(scoreMap, { black: 3, purple: 2, pink: 2 }, 'Contexto de moda', weightProfile.context);
    } else if (inputs.context === 'namoro') {
        applyWeightedRuleMap(scoreMap, { red: 3, pink: 2, purple: 1 }, 'Contexto de relacionamento', weightProfile.context);
    } else if (inputs.context === 'avaliacao') {
        applyWeightedRuleMap(scoreMap, { red: -3, blue: 2, green: 1 }, 'Contexto de avaliação/performance', weightProfile.context);
    } else {
        applyWeightedRuleMap(scoreMap, { blue: 1, green: 1 }, 'Contexto geral', weightProfile.context * 0.68);
    }

    if (inputs.market === 'eastasia') {
        addScore(scoreMap, 'blue', -2 * weightProfile.context, 'Ajuste cultural (Leste Asiatico)');
        warnings.push('No Leste Asiático, azul pode ter associações diferentes das ocidentais. Valide em pesquisa local.');
    } else if (inputs.market === 'global') {
        warnings.push('Para mercado global, valide a paleta por país e evite assumir significados universais.');
    }

    const segmentRules = SEGMENT_RULES[inputs.segment] || SEGMENT_RULES.general;
    applyWeightedRuleMap(scoreMap, segmentRules, `Segmento: ${describeSegment(inputs.segment)}`, weightProfile.segment);

    const channelRules = CHANNEL_RULES[inputs.channel] || CHANNEL_RULES.multichannel;
    applyWeightedRuleMap(scoreMap, channelRules, `Canal: ${describeChannel(inputs.channel)}`, weightProfile.channel);

    if (inputs.context === 'avaliacao' && getScore(scoreMap, 'red') > 0) {
        warnings.push('Em cenários de avaliação/performance, o vermelho pode elevar pressão e reduzir desempenho.');
    }

    const ranked = Object.values(scoreMap).sort((a, b) => b.score - a.score);
    const brandColorCount = getBrandColorCount(inputs);
    const palette = buildPalette(ranked, brandColorCount, inputs.objective);
    const confidence = calculateRecommendationConfidence({
        inputs,
        ranked,
        warnings,
        weightProfile
    });
    const contrastAudit = analyzeContrastByChannel(palette, inputs.channel);
    const abTests = buildAbTestSuggestions({ inputs, ranked, palette, confidence });
    const checklist = buildDeliveryChecklist({ inputs, confidence, warnings, contrastAudit });

    if (inputs.contentDensity === 'high') {
        recommendations.push('Conteúdo denso pede menos variação cromática: priorize 2-3 cores de marca.');
    } else if (inputs.contentDensity === 'low') {
        recommendations.push('Com layout limpo, você pode usar variação cromática maior sem sobrecarga visual.');
    }

    if (inputs.productType === 'utilitario') {
        recommendations.push('Produtos utilitários tendem a ganhar clareza com paleta contida e tons de confiança.');
    } else {
        recommendations.push('Produtos hedonicos aceitam maior expressividade cromatica e contrastes mais vivos.');
    }

    recommendations.push('Garanta contraste forte entre primeiro plano e fundo para elevar percepcao de harmonia e legibilidade.');
    recommendations.push('Significado da cor depende de experiência, cultura e contexto: teste com público real antes de fechar a identidade.');
    recommendations.push(`Perfil aplicado: ${describeSegment(inputs.segment)} + ${describeChannel(inputs.channel)} + ${describePersona(inputs.persona)} (confiança ${confidence.score}%).`);
    recommendations.push(
        `Meta de contraste para ${contrastAudit.profile.label}: mínimo ${contrastAudit.profile.minimumRatio.toFixed(1)}:1 e recomendado ${contrastAudit.profile.recommendedRatio.toFixed(1)}:1 (${contrastAudit.profile.level}).`
    );
    if (confidence.score < 60) {
        recommendations.push('Confiança moderada/baixa: valide a paleta com testes A/B e feedback de usuários.');
    } else {
        recommendations.push('Confiança consistente: avance para testes de contraste e aplicação em mockups.');
    }
    if (contrastAudit.hardFails.length) {
        warnings.push(
            `Contraste insuficiente em ${contrastAudit.hardFails.length} combinação(ões) para o canal ${contrastAudit.profile.label}.`
        );
        contrastAudit.hardFails.slice(0, 2).forEach((item) => {
            warnings.push(
                `${item.label}: ${item.ratio.toFixed(2)}:1 abaixo do mínimo ${item.minimum.toFixed(1)}:1.`
            );
        });
    } else if (contrastAudit.softFails.length) {
        recommendations.push(
            `Ajuste fino: ${contrastAudit.softFails.length} combinação(ões) acima do mínimo, mas abaixo da meta recomendada.`
        );
    } else {
        recommendations.push('Auditoria de contraste aprovada para o canal selecionado.');
    }

    const summary = `Top 3 cores: ${ranked.slice(0, 3).map((entry) => entry.label).join(', ')}. `
        + `Paleta de marca sugerida: ${brandColorCount} cor(es). `
        + `Confiança estimada: ${confidence.score}% (${confidence.label}). `
        + `Contraste aprovado em ${contrastAudit.passCount}/${contrastAudit.totalPairs} combinações.`;

    return {
        ranked,
        palette,
        recommendations,
        warnings,
        summary,
        confidence,
        weightProfile,
        abTests,
        checklist,
        contrastAudit
    };
}

function getBrandColorCount(inputs) {
    if (inputs.paletteSize !== 'auto') {
        return Number(inputs.paletteSize);
    }

    if (inputs.contentDensity === 'high' || inputs.productType === 'utilitario') {
        return 3;
    }

    if (inputs.contentDensity === 'low' && inputs.productType === 'hedonico') {
        return 5;
    }

    return 4;
}

function resolveWeightProfile(inputs = {}) {
    const profile = { ...DEFAULT_DIMENSION_WEIGHTS };

    if (String(inputs.context || '') === 'general') {
        profile.context *= 0.78;
    }

    if (String(inputs.segment || '') === 'general') {
        profile.segment *= 0.72;
    } else {
        profile.segment *= 1.06;
    }

    if (String(inputs.channel || '') === 'multichannel') {
        profile.channel *= 0.76;
    } else {
        profile.channel *= 1.08;
    }

    if (String(inputs.audience || '') === 'mixed') {
        profile.audience *= 0.9;
    }

    if (String(inputs.persona || '') === 'general') {
        profile.persona *= 0.75;
    } else {
        profile.persona *= 1.04;
    }

    if (String(inputs.messageFrame || '') === 'neutral') {
        profile.messageFrame *= 0.86;
    }

    return profile;
}

function applyWeightedRuleMap(scoreMap, rules, reason, weight = 1) {
    const factor = Number.isFinite(Number(weight)) ? Number(weight) : 1;
    Object.entries(rules || {}).forEach(([key, points]) => {
        addScore(scoreMap, key, Number(points) * factor, `${reason} x${factor.toFixed(2)}`);
    });
}

function describeSegment(segment) {
    const map = {
        general: 'Segmento Geral',
        saas: 'SaaS e Produtos Digitais',
        ecommerce: 'E-commerce e Varejo',
        health: 'Saúde e Bem-estar',
        education: 'Educação e Cursos',
        finance: 'Financas e Seguros',
        fashion: 'Moda e Lifestyle',
        industrial: 'Indústria e B2B',
        hospitality: 'Hospitalidade e Eventos'
    };
    return map[String(segment || '').trim()] || map.general;
}

function describeChannel(channel) {
    const map = {
        multichannel: 'Multicanal',
        digital: 'Site e Produto Digital',
        social: 'Redes Sociais',
        performance: 'Campanhas de Performance',
        editorial: 'Materiais Editoriais',
        retail: 'Varejo e PDV',
        presentation: 'Apresentações Institucionais'
    };
    return map[String(channel || '').trim()] || map.multichannel;
}

function describePersona(persona) {
    const map = {
        general: 'Persona Geral',
        executive: 'Executiva e decisora',
        analytical: 'Analitica e racional',
        creative: 'Criativa e exploratoria',
        pragmatic: 'Pragmatica e objetiva',
        premium: 'Premium e sofisticada',
        youth: 'Jovem e dinamica'
    };
    return map[String(persona || '').trim()] || map.general;
}

function calculateRecommendationConfidence({ inputs = {}, ranked = [], warnings = [], weightProfile = {} } = {}) {
    const topScore = Number(ranked?.[0]?.score || 0);
    const secondScore = Number(ranked?.[1]?.score || 0);
    const thirdScore = Number(ranked?.[2]?.score || 0);
    const spreadTop = Math.max(0, topScore - secondScore);
    const spreadTriad = Math.max(0, topScore - thirdScore);

    const spreadSignal = clamp01(spreadTop / 6);
    const dominanceSignal = clamp01(spreadTriad / 10);
    const strengthSignal = clamp01(Math.abs(topScore) / 18);
    const specificitySignal = calculateInputSpecificity(inputs);
    const warningSignal = clamp01(1 - (Math.min(3, warnings.length) * 0.22));

    const weightValues = Object.values(weightProfile || {}).filter((value) => Number.isFinite(Number(value)));
    const averageWeight = weightValues.length
        ? (weightValues.reduce((acc, value) => acc + Number(value), 0) / weightValues.length)
        : 1;
    const weightingSignal = clamp01((averageWeight - 0.65) / 0.75);

    const score = Math.round((
        (spreadSignal * 0.26)
        + (dominanceSignal * 0.18)
        + (strengthSignal * 0.16)
        + (specificitySignal * 0.22)
        + (warningSignal * 0.12)
        + (weightingSignal * 0.06)
    ) * 100);

    const boundedScore = Math.max(18, Math.min(97, score));
    const level = boundedScore >= 76
        ? 'high'
        : boundedScore >= 56
            ? 'medium'
            : 'low';
    const label = level === 'high'
        ? 'Alta'
        : level === 'medium'
            ? 'Media'
            : 'Baixa';

    const drivers = [
        `Sinal de separacao entre 1a e 2a cor: ${(spreadSignal * 100).toFixed(0)}%.`,
        `Especificidade do diagnóstico: ${(specificitySignal * 100).toFixed(0)}%.`,
        `Impacto de alertas de contexto: ${(warningSignal * 100).toFixed(0)}%.`,
    ];

    return {
        score: boundedScore,
        level,
        label,
        drivers
    };
}

function calculateInputSpecificity(inputs = {}) {
    let score = 0.58;

    if (String(inputs.context || '') !== 'general') {
        score += 0.1;
    }
    if (String(inputs.segment || '') !== 'general') {
        score += 0.1;
    }
    if (String(inputs.channel || '') !== 'multichannel') {
        score += 0.1;
    }
    if (String(inputs.messageFrame || '') !== 'neutral') {
        score += 0.05;
    }
    if (String(inputs.audience || '') !== 'mixed') {
        score += 0.04;
    }
    if (String(inputs.persona || '') !== 'general') {
        score += 0.04;
    }
    if (String(inputs.paletteSize || '') !== 'auto') {
        score += 0.03;
    }

    return clamp01(score);
}

function buildAbTestSuggestions({ inputs = {}, ranked = [], palette = [], confidence = {} } = {}) {
    const primary = ranked?.[0] || null;
    const secondary = ranked?.[1] || null;
    const accentRole = (Array.isArray(palette) ? palette : []).find((item) => String(item?.roleKey || '') === 'accent');
    const accentHex = accentRole?.hex || '#f59e0b';
    const primaryHex = primary?.hex || '#1e88e5';
    const secondaryHex = secondary?.hex || '#43a047';
    const contextLabel = String(inputs.context || 'general');
    const channelLabel = describeChannel(inputs.channel);
    const personaLabel = describePersona(inputs.persona);
    const confidenceScore = Math.round(Number(confidence?.score || 0));

    return [
        `Variante A (controle): CTA com ${primaryHex.toUpperCase()} e suporte em ${secondaryHex.toUpperCase()} para ${channelLabel}.`,
        `Variante B (desafio): CTA com ${accentHex.toUpperCase()} e fundo neutro para elevar atencao em contexto ${contextLabel}.`,
        `Meta de leitura: medir CTR, tempo na área crítica e taxa de conclusão por 7 dias (confiança atual ${confidenceScore}%, persona ${personaLabel}).`
    ];
}

function buildDeliveryChecklist({ inputs = {}, confidence = {}, warnings = [], contrastAudit = null } = {}) {
    const confidenceScore = Math.round(Number(confidence?.score || 0));
    const base = [
        'Validar contraste AA/AAA nos componentes de texto e botoes.',
        'Aplicar paleta em 3 pontos: navegação, CTA principal e estados de feedback.',
        'Criar mockups nos canais prioritarios antes da publicacao final.',
        `Registrar segmento (${describeSegment(inputs.segment)}) e canal (${describeChannel(inputs.channel)}) no BrandBook.`,
        'Sincronizar resultado com Color Palette, BrandBook e FinalFrame.'
    ];

    if (confidenceScore < 60) {
        base.push('Executar teste A/B com no mínimo 2 variações de CTA antes de consolidar a diretriz.');
    }

    if (Array.isArray(warnings) && warnings.length) {
        base.push('Revisar alertas de contexto antes da entrega final da identidade visual.');
    }

    if (contrastAudit?.profile) {
        base.push(
            `Alvo de contraste do canal ${contrastAudit.profile.label}: mínimo ${contrastAudit.profile.minimumRatio.toFixed(1)}:1, recomendado ${contrastAudit.profile.recommendedRatio.toFixed(1)}:1.`
        );
    }

    if (contrastAudit?.hardFails?.length) {
        base.push('Ajustar pares com contraste critico antes de publicar o brandbook.');
    }

    return base;
}

function getChannelContrastProfile(channel = 'multichannel') {
    const key = String(channel || '').trim();
    return CHANNEL_CONTRAST_TARGETS[key] || CHANNEL_CONTRAST_TARGETS.multichannel;
}

function analyzeContrastByChannel(palette = [], channel = 'multichannel') {
    const profile = {
        ...getChannelContrastProfile(channel),
        channel: String(channel || 'multichannel')
    };
    const minimum = Number(profile.minimumRatio || 4.5);
    const recommended = Math.max(minimum, Number(profile.recommendedRatio || minimum));

    const surface = resolvePaletteRoleHex(palette, 'surface', '#f8fafc');
    const text = resolvePaletteRoleHex(palette, 'text', '#111827');
    const primary = resolvePaletteRoleHex(palette, 'primary', '#1e88e5');
    const secondary = resolvePaletteRoleHex(palette, 'secondary', '#43a047');
    const accent = resolvePaletteRoleHex(palette, 'accent', '#f59e0b');

    const primaryReadable = pickReadableTextForBackground(primary);
    const secondaryReadable = pickReadableTextForBackground(secondary);
    const accentReadable = pickReadableTextForBackground(accent);

    const pairs = [
        buildContrastPair({
            id: 'text_surface',
            label: 'Texto principal sobre fundo base',
            fg: text,
            bg: surface,
            minimum,
            recommended
        }),
        buildContrastPair({
            id: 'cta_primary',
            label: 'CTA principal (texto em botao primario)',
            fg: primaryReadable.text,
            bg: primary,
            minimum,
            recommended
        }),
        buildContrastPair({
            id: 'cta_secondary',
            label: 'CTA secundario (texto em botao secundario)',
            fg: secondaryReadable.text,
            bg: secondary,
            minimum,
            recommended
        }),
        buildContrastPair({
            id: 'cta_accent',
            label: 'Destaque/acento (texto em bloco de acento)',
            fg: accentReadable.text,
            bg: accent,
            minimum,
            recommended
        })
    ];

    if (String(channel || '') === 'editorial' || String(channel || '') === 'presentation') {
        pairs.push(
            buildContrastPair({
                id: 'text_secondary',
                label: 'Texto corrido sobre area secundaria',
                fg: pickReadableTextForBackground(secondary).text,
                bg: secondary,
                minimum,
                recommended
            })
        );
    }

    const hardFails = pairs.filter((item) => item.ratio + 0.001 < item.minimum);
    const softFails = pairs.filter(
        (item) => item.ratio + 0.001 >= item.minimum && item.ratio + 0.001 < item.recommended
    );

    return {
        profile,
        pairs,
        hardFails,
        softFails,
        passCount: pairs.length - hardFails.length,
        totalPairs: pairs.length
    };
}

function buildContrastPair({ id, label, fg, bg, minimum, recommended }) {
    const ratio = getContrastRatio(fg, bg);
    return {
        id: String(id || '').trim(),
        label: String(label || '').trim(),
        fg: normalizeHexValue(fg, '#111827'),
        bg: normalizeHexValue(bg, '#f8fafc'),
        ratio,
        minimum: Number(minimum || 4.5),
        recommended: Number(recommended || minimum || 4.5),
        passMinimum: ratio + 0.001 >= Number(minimum || 4.5),
        passRecommended: ratio + 0.001 >= Number(recommended || minimum || 4.5)
    };
}

function resolvePaletteRoleHex(palette, roleKey, fallback) {
    const list = Array.isArray(palette) ? palette : [];
    const target = String(roleKey || '').trim().toLowerCase();
    const found = list.find((item) => String(item?.roleKey || '').trim().toLowerCase() === target);
    return normalizeHexValue(found?.hex, fallback);
}

function pickReadableTextForBackground(backgroundHex) {
    const bg = normalizeHexValue(backgroundHex, '#1e88e5');
    const white = '#f8fafc';
    const dark = '#111827';
    const whiteRatio = getContrastRatio(white, bg);
    const darkRatio = getContrastRatio(dark, bg);
    return whiteRatio >= darkRatio
        ? { text: white, ratio: whiteRatio }
        : { text: dark, ratio: darkRatio };
}

function getContrastRatio(hexA, hexB) {
    const lumA = getRelativeLuminance(hexA);
    const lumB = getRelativeLuminance(hexB);
    const lighter = Math.max(lumA, lumB);
    const darker = Math.min(lumA, lumB);
    return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(hex) {
    const rgb = hexToRgb(normalizeHexValue(hex, '#111827'));
    const channels = [rgb.r, rgb.g, rgb.b].map((value) => {
        const normalized = value / 255;
        if (normalized <= 0.03928) {
            return normalized / 12.92;
        }
        return ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function buildContrastAuditNotes(contrastAudit = null) {
    if (!contrastAudit || !Array.isArray(contrastAudit.pairs)) {
        return [];
    }
    return contrastAudit.pairs.map((item) => {
        const status = item.passMinimum ? (item.passRecommended ? 'OK' : 'AJUSTE') : 'CRITICO';
        return `[${status}] ${item.label}: ${item.ratio.toFixed(2)}:1 (min ${item.minimum.toFixed(1)}:1, alvo ${item.recommended.toFixed(1)}:1)`;
    });
}

function buildIntegratedRecommendations(result = {}) {
    const output = [];
    const seen = new Set();

    function pushItems(items, prefix = '', limit = 3) {
        if (!Array.isArray(items) || limit <= 0) {
            return;
        }
        let added = 0;
        for (let index = 0; index < items.length; index += 1) {
            if (added >= limit || output.length >= 18) {
                break;
            }
            const raw = String(items[index] || '').trim();
            if (!raw) {
                continue;
            }
            const key = raw.toLowerCase();
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            output.push(prefix ? `${prefix} ${raw}` : raw);
            added += 1;
        }
    }

    pushItems(result.recommendations, '', 7);
    pushItems(result.abTests, 'Teste A/B:', 3);
    pushItems(result.checklist, 'Checklist:', 5);
    pushItems(buildContrastAuditNotes(result.contrastAudit), 'Contraste:', 4);
    pushItems(result.warnings, 'Atencao:', 3);

    return output.slice(0, 18);
}

function clamp01(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return 0;
    }
    return Math.max(0, Math.min(1, numeric));
}

function buildPalette(ranked, brandColorCount, objective) {
    const selected = pickDistinctColors(ranked, brandColorCount);
    const primary = selected[0] || ranked[0];
    const secondary = selected[1] || ranked[1] || primary;
    const accent = selected[2] || pickAccent(ranked, primary);

    const darkObjective = objective === 'sofisticacao';
    const background = darkObjective ? { label: 'Fundo Premium', hex: '#0F172A' } : { label: 'Fundo Claro', hex: '#F8FAFC' };
    const text = isDark(background.hex) ? { label: 'Texto Principal', hex: '#F8FAFC' } : { label: 'Texto Principal', hex: '#111827' };

    const roles = [];
    selected.forEach((entry, index) => {
        const role = index === 0 ? 'Primária' : index === 1 ? 'Secundária' : index === 2 ? 'Acento' : `Apoio ${index - 2}`;
        const roleKey = index === 0
            ? 'primary'
            : index === 1
                ? 'secondary'
                : index === 2
                    ? 'accent'
                    : `support_${index - 2}`;
        roles.push({ role, roleKey, label: entry.label, hex: entry.hex });
    });

    if (!roles.some((item) => item.roleKey === 'accent') && accent) {
        roles.push({ role: 'Acento', roleKey: 'accent', label: accent.label, hex: accent.hex });
    }

    roles.push(
        { role: background.label, roleKey: 'surface', label: background.label, hex: background.hex },
        { role: text.label, roleKey: 'text', label: text.label, hex: text.hex }
    );

    return roles;
}

function pickDistinctColors(ranked, size) {
    const chosen = [];
    const families = new Set();

    ranked.forEach((entry) => {
        if (chosen.length >= size) {
            return;
        }

        const shouldPrefer = !families.has(entry.family) || families.size >= 3;
        if (shouldPrefer) {
            chosen.push(entry);
            families.add(entry.family);
        }
    });

    if (chosen.length < size) {
        ranked.forEach((entry) => {
            if (chosen.length >= size || chosen.some((picked) => picked.key === entry.key)) {
                return;
            }
            chosen.push(entry);
        });
    }

    return chosen;
}

function pickAccent(ranked, primary) {
    if (!primary) {
        return ranked[0] || null;
    }

    if (primary.family === 'cool') {
        return ranked.find((entry) => entry.family === 'warm') || ranked[1] || primary;
    }

    return ranked.find((entry) => entry.family === 'cool') || ranked[1] || primary;
}

function renderResult(result, inputs = null, options = {}) {
    latestResult = result;
    if (inputs) {
        latestInputs = inputs;
    }

    renderSummary(result.summary);
    renderConfidence(result.confidence, result.weightProfile);
    renderPalette(result.palette);
    renderScoreTable(result.ranked);
    renderNotes('recommendationsList', result.recommendations, 'Nenhuma recomendação adicional.');
    renderNotes('warningsList', result.warnings, 'Sem alertas especificos para o contexto informado.');
    renderNotes('abTestsList', result.abTests || [], 'Sem sugestoes A/B para o cenario atual.');
    renderNotes('deliveryChecklist', result.checklist || [], 'Sem checklist disponivel.');
    renderContrastAudit(result.contrastAudit);

    const shouldSync = Boolean(options && options.sync);
    const statusMessage = String(options && options.statusMessage ? options.statusMessage : '');
    if (!shouldSync) {
        if (statusMessage) {
            setExportStatus(statusMessage, Boolean(options && options.statusError));
        }
        return;
    }

    const synced = syncBrandKitFromStrategy(result, latestInputs || inputs || {});
    setExportStatus(
        synced
            ? 'Paleta sincronizada com o ecossistema (Color Palette, BrandBook e FinalFrame).'
            : 'Sincronização indisponível no momento.',
        !synced
    );
}

function renderSummary(text) {
    const summary = document.getElementById('strategySummary');
    summary.textContent = text;
}

function renderConfidence(confidence, weightProfile) {
    const container = document.getElementById('confidencePanel');
    if (!container) {
        return;
    }

    if (!confidence || typeof confidence !== 'object') {
        container.innerHTML = '';
        return;
    }

    const level = String(confidence.level || 'medium');
    const label = String(confidence.label || 'Media');
    const score = Number(confidence.score || 0);
    const drivers = Array.isArray(confidence.drivers) ? confidence.drivers.slice(0, 3) : [];
    const avgWeight = getAverageWeight(weightProfile);

    container.innerHTML = `
        <div class="confidence-head">
            <div>
                <p class="confidence-label">Índice de Confiança</p>
                <p class="confidence-score">${Math.round(score)}%</p>
            </div>
            <span class="confidence-chip ${level}">${label}</span>
        </div>
        <p class="confidence-meta">Peso médio do diagnóstico: x${avgWeight.toFixed(2)}. Segmento e canal ajustam a força das regras.</p>
        <ul class="confidence-list">
            ${drivers.map((item) => `<li>${item}</li>`).join('')}
        </ul>
    `;
}

function getAverageWeight(weightProfile) {
    const values = Object.values(weightProfile || {}).filter((value) => Number.isFinite(Number(value)));
    if (!values.length) {
        return 1;
    }
    return values.reduce((acc, value) => acc + Number(value), 0) / values.length;
}

function renderPalette(palette) {
    const container = document.getElementById('palettePreview');
    container.innerHTML = palette.map((item) => `
        <article class="swatch">
            <div class="swatch-color" data-swatch-color="${escapeHtml(item.hex)}"></div>
            <div class="swatch-info">
                <p class="swatch-role">${item.role}</p>
                <p class="swatch-meta">
                    <strong>${item.label}</strong>
                    <button class="copy-hex" type="button" data-hex="${item.hex}">${item.hex}</button>
                </p>
            </div>
        </article>
    `).join('');
    applyElementColors(container, '[data-swatch-color]', 'data-swatch-color');
}

function renderScoreTable(ranked) {
    const body = document.getElementById('scoreTableBody');
    body.innerHTML = ranked.map((entry) => `
        <tr>
            <td><span class="score-color" data-score-color="${escapeHtml(entry.hex)}"></span>${entry.label}</td>
            <td>${formatScore(entry.score)}</td>
            <td>${entry.reasons.slice(0, 3).join(' | ') || 'Sem regra aplicada'}</td>
        </tr>
    `).join('');
    applyElementColors(body, '[data-score-color]', 'data-score-color');
}

function applyElementColors(root, selector, attributeName) {
    if (!root || !selector || !attributeName) {
        return;
    }

    root.querySelectorAll(selector).forEach((element) => {
        const color = String(element.getAttribute(attributeName) || '').trim();
        if (color !== '') {
            element.style.background = color;
        }
    });
}

function renderNotes(targetId, notes, emptyMessage) {
    const list = document.getElementById(targetId);
    if (!list) {
        return;
    }

    const safeNotes = Array.isArray(notes) ? notes : [];
    if (!safeNotes.length) {
        list.innerHTML = `<li>${emptyMessage}</li>`;
        return;
    }

    list.innerHTML = safeNotes.map((item) => `<li>${item}</li>`).join('');
}

function renderContrastAudit(contrastAudit = null) {
    const summary = document.getElementById('contrastAuditSummary');
    const list = document.getElementById('contrastAuditList');
    if (!summary || !list) {
        return;
    }

    if (!contrastAudit || !Array.isArray(contrastAudit.pairs) || !contrastAudit.pairs.length) {
        summary.textContent = 'Configure o diagnóstico para gerar a auditoria de contraste.';
        list.innerHTML = '<li>Sem auditoria de contraste para o cenario atual.</li>';
        return;
    }

    summary.textContent = `Canal ${contrastAudit.profile.label}: ${contrastAudit.passCount}/${contrastAudit.totalPairs} pares acima do mínimo ${contrastAudit.profile.minimumRatio.toFixed(1)}:1 (${contrastAudit.profile.level}).`;
    const notes = buildContrastAuditNotes(contrastAudit);
    list.innerHTML = notes.map((item) => {
        const cssClass = item.startsWith('[OK]')
            ? 'contrast-ok'
            : item.startsWith('[AJUSTE]')
                ? 'contrast-adjust'
                : 'contrast-critical';
        return `<li class="${cssClass}">${item}</li>`;
    }).join('');
}

function syncBrandKitFromStrategy(result, inputs) {
    const api = window.AQBrandKit;
    if (!api || !result || !Array.isArray(result.palette)) {
        return false;
    }

    const roleMapByKey = {};
    const roleMapByName = {};
    result.palette.forEach((item) => {
        const roleKey = normalizeRoleKey(item?.roleKey || '');
        const roleName = normalizeRoleKey(item?.role || '');
        if (roleKey) {
            roleMapByKey[roleKey] = item;
        }
        if (roleName) {
            roleMapByName[roleName] = item;
        }
    });

    const strategyHarmony = resolveStrategyHarmonyProfile(inputs);

    const paletteColorsRaw = result.palette
        .filter((item) => normalizeRoleKey(item?.roleKey || '') !== 'text')
        .map((item) => normalizeHexValue(item?.hex, ''))
        .filter(Boolean);

    const rankedFallbackColors = Array.isArray(result.ranked)
        ? result.ranked
            .map((item) => normalizeHexValue(item?.hex, ''))
            .filter(Boolean)
            .slice(0, 6)
        : [];

    const primary = getRoleHex(roleMapByKey, roleMapByName, ['primary', 'primaria'], paletteColorsRaw[0] || '#1e88e5');
    const secondary = getRoleHex(roleMapByKey, roleMapByName, ['secondary', 'secundaria'], paletteColorsRaw[1] || '#43a047');
    const accent = getRoleHex(roleMapByKey, roleMapByName, ['accent', 'acento'], paletteColorsRaw[2] || '#f59e0b');
    const surface = getRoleHex(
        roleMapByKey,
        roleMapByName,
        ['surface', 'fundo_claro', 'fundo_premium', 'fundo'],
        '#f8fafc'
    );
    const textMain = getRoleHex(roleMapByKey, roleMapByName, ['text', 'texto_principal', 'texto'], '#111827');
    const rankedNeutral = pickNeutralFromRanking(result.ranked);
    const neutral = normalizeHexValue(rankedNeutral || textMain, '#111827');

    const brandPaletteColors = uniqueHexColors([
        primary,
        secondary,
        accent,
        ...paletteColorsRaw,
        ...rankedFallbackColors,
        neutral,
        surface,
    ]).slice(0, 12);

    api.syncColorPalette({
        baseColor: primary,
        type: strategyHarmony.rule,
        title: 'Paleta recomendada pelo Color Strategy Advisor',
        description: result.summary || 'Paleta recomendada para identidade visual.',
        colors: brandPaletteColors,
        harmony: strategyHarmony
    }, 'coloradvisor');

    api.saveColorPaletteState({
        baseColor: primary,
        type: strategyHarmony.rule,
        title: 'Color Strategy Advisor',
        description: result.summary || '',
        colors: brandPaletteColors,
        context: inputs?.context || '',
        objective: inputs?.objective || '',
        persona: inputs?.persona || 'general',
        segment: inputs?.segment || 'general',
        channel: inputs?.channel || 'multichannel',
        harmony: strategyHarmony
    }, 'coloradvisor');

    if (typeof api.syncBrandInsights === 'function') {
        const warmObjectives = new Set(['acao', 'atencao', 'diversao']);
        const trends = [
            {
                label: 'Color Strategy Signal',
                value: `Objetivo: ${String(inputs?.objective || 'geral')}`,
                detail: 'Paleta recomendada com base nas regras psicologicas e no contexto de mercado.'
            },
            {
                label: warmObjectives.has(String(inputs?.objective || ''))
                    ? 'High-Energy Campaigns'
                    : 'Trust and Clarity Systems',
                value: `Contexto: ${String(inputs?.context || 'geral')}`,
                detail: warmObjectives.has(String(inputs?.objective || ''))
                    ? 'Recomendado para campanhas com foco em resposta rápida e destaque visual.'
                    : 'Direção para interfaces de confiança e leitura constante.'
            }
        ];
        if (result?.confidence) {
            trends.push({
                label: 'Confiança da Recomendação',
                value: `${Math.round(Number(result.confidence.score || 0))}% (${String(result.confidence.label || 'Media')})`,
                detail: 'Índice calculado por separação de ranking, especificidade do diagnóstico e contexto.'
            });
        }
        if (Array.isArray(result?.abTests) && result.abTests.length) {
            trends.push({
                label: 'Teste A/B Recomendado',
                value: `Canal: ${describeChannel(inputs?.channel || 'multichannel')}`,
                detail: String(result.abTests[0] || '').slice(0, 220)
            });
        }
        if (result?.contrastAudit?.profile) {
            trends.push({
                label: 'Auditoria de Contraste',
                value: `${result.contrastAudit.passCount}/${result.contrastAudit.totalPairs} pares aprovados no canal`,
                detail: `Meta ${result.contrastAudit.profile.minimumRatio.toFixed(1)}:1 (${result.contrastAudit.profile.level}) para ${result.contrastAudit.profile.label}.`
            });
        }
        trends.push({
            label: 'Persona Prioritaria',
            value: describePersona(inputs?.persona || 'general'),
            detail: 'Ajuste de tom visual aplicado no ranking e na recomendação final.'
        });

        const combinations = [
            {
                label: 'Estrutura principal',
                value: `${primary.toUpperCase()} / ${secondary.toUpperCase()} / ${accent.toUpperCase()}`,
                detail: 'Aplicar regra 60-30-10 para manter consistência entre seções.'
            },
            {
                label: 'Base neutra',
                value: `${neutral.toUpperCase()} + ${surface.toUpperCase()}`,
                detail: 'Usar neutros para texto, fundos e equilíbrio da composição.'
            }
        ];

        const contrast = Array.isArray(result?.contrastAudit?.pairs) && result.contrastAudit.pairs.length
            ? result.contrastAudit.pairs.map((item) => ({
                color: item.bg,
                recommendedText: item.fg,
                ratio: Number(item.ratio.toFixed(2)),
                level: item.passRecommended ? `${result.contrastAudit.profile.level} +` : result.contrastAudit.profile.level
            }))
            : brandPaletteColors.slice(0, 8).map((hex) => ({
                color: hex,
                recommendedText: isDark(hex) ? '#F8FAFC' : '#111827',
                ratio: 4.5,
                level: 'AA'
            }));

        api.syncBrandInsights({
            paletteType: strategyHarmony.rule,
            summary: result.summary || 'Paleta recomendada pelo Color Strategy Advisor.',
            roles: {
                primary,
                secondary,
                accent,
                neutralLight: surface,
                neutralDark: neutral
            },
            colors: brandPaletteColors,
            combinations,
            trends,
            harmony: strategyHarmony,
            confidence: result.confidence || null,
            strategyProfile: {
                objective: String(inputs?.objective || 'confianca'),
                context: String(inputs?.context || 'general'),
                persona: String(inputs?.persona || 'general'),
                segment: String(inputs?.segment || 'general'),
                channel: String(inputs?.channel || 'multichannel')
            },
            contrastAudit: buildCompactContrastAudit(result?.contrastAudit),
            contrast,
            recommendations: buildIntegratedRecommendations(result)
        }, 'coloradvisor');
    }

    return true;
}

function resolveStrategyHarmonyProfile(inputs = {}) {
    const objective = String(inputs?.objective || '').trim();
    const fallback = { rule: 'analogous', spread: 28 };
    const raw = STRATEGY_HARMONY_BY_OBJECTIVE[objective] || fallback;
    const rule = VALID_HARMONY_RULES.has(String(raw.rule || '')) ? String(raw.rule) : fallback.rule;
    const spreadRaw = Number.parseInt(String(raw.spread ?? fallback.spread), 10);
    const spread = Number.isFinite(spreadRaw) ? Math.max(12, Math.min(120, spreadRaw)) : fallback.spread;
    return { rule, spread };
}

function normalizeRoleKey(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
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

function uniqueHexColors(values) {
    const seen = new Set();
    const output = [];
    (Array.isArray(values) ? values : []).forEach((value) => {
        const hex = normalizeHexValue(value, '');
        if (!hex || seen.has(hex.toLowerCase())) {
            return;
        }
        seen.add(hex.toLowerCase());
        output.push(hex);
    });
    return output;
}

function getRoleHex(roleMapByKey, roleMapByName, candidates, fallback) {
    const list = Array.isArray(candidates) ? candidates : [];
    for (let index = 0; index < list.length; index += 1) {
        const key = normalizeRoleKey(list[index]);
        if (!key) {
            continue;
        }
        const byKey = normalizeHexValue(roleMapByKey[key]?.hex, '');
        if (byKey) {
            return byKey;
        }
        const byName = normalizeHexValue(roleMapByName[key]?.hex, '');
        if (byName) {
            return byName;
        }
    }
    return normalizeHexValue(fallback, '#000000');
}

function pickNeutralFromRanking(ranked) {
    if (!Array.isArray(ranked)) {
        return '';
    }
    const neutral = ranked.find((item) => item?.family === 'neutral' && item?.key !== 'white');
    return normalizeHexValue(neutral?.hex, '');
}

function buildCompactContrastAudit(contrastAudit = null) {
    if (!contrastAudit || !Array.isArray(contrastAudit.pairs)) {
        return null;
    }
    const profile = contrastAudit.profile || {};
    return {
        profile: {
            channel: String(profile.channel || ''),
            label: String(profile.label || ''),
            minimumRatio: Number(profile.minimumRatio || 4.5),
            recommendedRatio: Number(profile.recommendedRatio || 4.5),
            level: String(profile.level || 'AA')
        },
        passCount: Number(contrastAudit.passCount || 0),
        totalPairs: Number(contrastAudit.totalPairs || 0),
        hardFailCount: Array.isArray(contrastAudit.hardFails) ? contrastAudit.hardFails.length : 0,
        softFailCount: Array.isArray(contrastAudit.softFails) ? contrastAudit.softFails.length : 0,
        pairs: contrastAudit.pairs.slice(0, 10).map((item) => ({
            id: String(item?.id || ''),
            label: String(item?.label || ''),
            fg: normalizeHexValue(item?.fg, '#111827'),
            bg: normalizeHexValue(item?.bg, '#f8fafc'),
            ratio: Number(Number(item?.ratio || 0).toFixed(2)),
            minimum: Number(item?.minimum || 4.5),
            recommended: Number(item?.recommended || 4.5),
            passMinimum: Boolean(item?.passMinimum),
            passRecommended: Boolean(item?.passRecommended)
        }))
    };
}

function applyRuleMap(scoreMap, rules, reason) {
    Object.entries(rules).forEach(([key, points]) => {
        addScore(scoreMap, key, points, reason);
    });
}

function addBulkScore(scoreMap, keys, points, reason) {
    keys.forEach((key) => addScore(scoreMap, key, points, reason));
}

function addScore(scoreMap, key, points, reason) {
    const color = scoreMap[key];
    const numericPoints = Number(points);
    if (!color || !Number.isFinite(numericPoints) || numericPoints === 0) {
        return;
    }

    color.score += numericPoints;
    color.reasons.push(`${reason} (${numericPoints > 0 ? '+' : ''}${formatScore(numericPoints)})`);
}

function getScore(scoreMap, key) {
    return scoreMap[key]?.score || 0;
}

function formatScore(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return '0.00';
    }
    return numeric.toFixed(2);
}

function isDark(hex) {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.45;
}

function exportJson() {
    if (!latestInputs || !latestResult) {
        setExportStatus('Nenhum resultado para exportar.', true);
        return;
    }

    const payload = buildExportPayload();
    const fileName = `color-strategy-${timestampForFile()}.json`;
    downloadTextFile(JSON.stringify(payload, null, 2), fileName, 'application/json');
    setExportStatus('JSON exportado com sucesso.');
}

function exportPdf() {
    if (!latestInputs || !latestResult) {
        setExportStatus('Nenhum resultado para exportar.', true);
        return;
    }

    const jsPDFCtor = window.jspdf?.jsPDF;
    if (!jsPDFCtor) {
        setExportStatus('Biblioteca de PDF indisponível no momento.', true);
        return;
    }

    const mode = readColorPdfTemplateMode();
    if (mode === 'mini') {
        exportPdfMini(jsPDFCtor);
        return;
    }

    const doc = new jsPDFCtor({ unit: 'pt', format: 'a4' });
    const pageWidth = 595.28;
    const margin = 40;
    const lineGap = 15;
    let y = 44;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(17);
    doc.text('Color Strategy Advisor - Relatório de Cores', margin, y);
    y += 18;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, margin, y);
    y += 18;

    y = writeSectionTitle(doc, 'Diagnóstico', margin, y);
    const inputLines = buildInputLines(latestInputs);
    inputLines.forEach((line) => {
        y = ensurePageSpace(doc, y, 24, margin);
        doc.text(`- ${line}`, margin, y);
        y += lineGap;
    });

    y += 6;
    y = writeSectionTitle(doc, 'Resumo Estratégico', margin, y);
    const summaryLines = doc.splitTextToSize(latestResult.summary, pageWidth - margin * 2);
    summaryLines.forEach((line) => {
        y = ensurePageSpace(doc, y, 24, margin);
        doc.text(line, margin, y);
        y += lineGap;
    });

    if (latestResult.confidence) {
        y += 6;
        y = writeSectionTitle(doc, 'Confiança da Recomendação', margin, y);
        y = ensurePageSpace(doc, y, 24, margin);
        doc.text(
            `Indice: ${Math.round(Number(latestResult.confidence.score || 0))}% (${String(latestResult.confidence.label || 'Media')})`,
            margin,
            y
        );
        y += 13;
        (Array.isArray(latestResult.confidence.drivers) ? latestResult.confidence.drivers : []).slice(0, 3).forEach((driver) => {
            y = ensurePageSpace(doc, y, 20, margin);
            doc.text(`- ${driver}`, margin, y);
            y += 12;
        });
    }

    y += 6;
    y = writeSectionTitle(doc, 'Paleta Recomendada', margin, y);
    latestResult.palette.forEach((item) => {
        y = ensurePageSpace(doc, y, 26, margin);
        const rgb = hexToRgb(item.hex);
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(margin, y - 10, 16, 16, 'F');
        doc.setTextColor(17, 24, 39);
        doc.text(`${item.role}: ${item.label} (${item.hex})`, margin + 24, y + 2);
        y += 20;
    });

    y += 8;
    y = writeSectionTitle(doc, 'Top Ranking de Cores', margin, y);
    latestResult.ranked.slice(0, 8).forEach((item, index) => {
        y = ensurePageSpace(doc, y, 24, margin);
        const reason = item.reasons.slice(0, 2).join(' | ');
        doc.text(`${index + 1}. ${item.label} - ${formatScore(item.score)} pts`, margin, y);
        y += 12;
        const reasonLines = doc.splitTextToSize(reason || 'Sem regra específica.', pageWidth - margin * 2 - 8);
        reasonLines.forEach((line) => {
            y = ensurePageSpace(doc, y, 20, margin);
            doc.setFontSize(9);
            doc.text(`   ${line}`, margin, y);
            y += 12;
            doc.setFontSize(10);
        });
        y += 3;
    });

    y += 4;
    y = writeSectionTitle(doc, 'Diretrizes', margin, y);
    latestResult.recommendations.forEach((note) => {
        y = ensurePageSpace(doc, y, 22, margin);
        const lines = doc.splitTextToSize(`- ${note}`, pageWidth - margin * 2);
        lines.forEach((line) => {
            doc.text(line, margin, y);
            y += 12;
            y = ensurePageSpace(doc, y, 20, margin);
        });
    });

    if (Array.isArray(latestResult.abTests) && latestResult.abTests.length) {
        y += 4;
        y = writeSectionTitle(doc, 'Teste A/B Sugerido', margin, y);
        latestResult.abTests.forEach((note) => {
            y = ensurePageSpace(doc, y, 22, margin);
            const lines = doc.splitTextToSize(`- ${note}`, pageWidth - margin * 2);
            lines.forEach((line) => {
                doc.text(line, margin, y);
                y += 12;
                y = ensurePageSpace(doc, y, 20, margin);
            });
        });
    }

    if (Array.isArray(latestResult.checklist) && latestResult.checklist.length) {
        y += 4;
        y = writeSectionTitle(doc, 'Checklist de Entrega', margin, y);
        latestResult.checklist.forEach((note) => {
            y = ensurePageSpace(doc, y, 22, margin);
            const lines = doc.splitTextToSize(`- ${note}`, pageWidth - margin * 2);
            lines.forEach((line) => {
                doc.text(line, margin, y);
                y += 12;
                y = ensurePageSpace(doc, y, 20, margin);
            });
        });
    }

    if (latestResult.contrastAudit?.pairs?.length) {
        y += 4;
        y = writeSectionTitle(doc, 'Auditoria de Contraste', margin, y);
        const profile = latestResult.contrastAudit.profile || {};
        y = ensurePageSpace(doc, y, 22, margin);
        doc.text(
            `Canal ${String(profile.label || 'Multicanal')} | meta minima ${Number(profile.minimumRatio || 4.5).toFixed(1)}:1 (${String(profile.level || 'AA')})`,
            margin,
            y
        );
        y += 12;
        buildContrastAuditNotes(latestResult.contrastAudit).forEach((note) => {
            y = ensurePageSpace(doc, y, 22, margin);
            const lines = doc.splitTextToSize(`- ${note}`, pageWidth - margin * 2);
            lines.forEach((line) => {
                doc.text(line, margin, y);
                y += 12;
                y = ensurePageSpace(doc, y, 20, margin);
            });
        });
    }

    if (latestResult.warnings.length) {
        y += 4;
        y = writeSectionTitle(doc, 'Alertas', margin, y);
        latestResult.warnings.forEach((note) => {
            y = ensurePageSpace(doc, y, 22, margin);
            const lines = doc.splitTextToSize(`- ${note}`, pageWidth - margin * 2);
            lines.forEach((line) => {
                doc.text(line, margin, y);
                y += 12;
                y = ensurePageSpace(doc, y, 20, margin);
            });
        });
    }

    y += 6;
    y = ensurePageSpace(doc, y, 34, margin);
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text('Base: davidcreator.com/psicologia-das-cores-como-a-cor-influencia-nossa-vida/', margin, y);
    y += 11;
    doc.text('Base: davidcreator.com/cores-no-mundo-do-marketing/', margin, y);

    const fileName = `color-strategy-full-${timestampForFile()}.pdf`;
    doc.save(fileName);
    setExportStatus('PDF exportado com sucesso (Brandbook Completo).');
}

function exportPdfMini(jsPDFCtor) {
    const doc = new jsPDFCtor({ unit: 'pt', format: 'a4' });
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 40;
    const contentWidth = pageWidth - (margin * 2);
    const inputs = latestInputs || {};
    const result = latestResult || {};
    const summary = String(result.summary || '').trim() || 'Sem resumo gerado para o mini guia.';
    const confidence = result.confidence || {};
    const essentials = buildInputLines(inputs).slice(0, 6);
    const topRank = (Array.isArray(result.ranked) ? result.ranked : []).slice(0, 3);
    const actions = (Array.isArray(result.recommendations) ? result.recommendations : []).slice(0, 4);
    let y = 44;

    doc.setFillColor(29, 78, 216);
    doc.rect(0, 0, pageWidth, 168, 'F');
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 164, pageWidth, 4, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('QUOTIA | Color Strategy Advisor', margin, 38);
    doc.setFontSize(29);
    doc.text('Mini Brand Guide', margin, 82);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('Versão objetiva para decisão rápida de paleta e handoff inicial.', margin, 106);

    doc.setFillColor(219, 234, 254);
    doc.roundedRect(pageWidth - margin - 172, 26, 172, 30, 8, 8, 'F');
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, pageWidth - margin - 162, 45);

    y = 208;
    doc.setFillColor(248, 251, 255);
    doc.setDrawColor(207, 222, 246);
    doc.roundedRect(margin, y, contentWidth, 184, 12, 12, 'FD');
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Resumo estratégico', margin + 14, y + 22);
    doc.setTextColor(17, 24, 39);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.2);
    const summaryLines = doc.splitTextToSize(summary, contentWidth - 28);
    summaryLines.slice(0, 8).forEach((line, index) => {
        doc.text(line, margin + 14, y + 40 + (index * 14));
    });

    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.2);
    doc.text(
        `Confiança: ${Math.round(Number(confidence.score || 0))}% (${String(confidence.label || 'Média')})`,
        margin + 14,
        y + 156
    );

    y = 406;
    y = writeSectionTitle(doc, 'Diagnóstico essencial', margin, y);
    y = writeMiniPdfBullets(doc, essentials, margin, y, pageWidth);

    y += 3;
    y = writeSectionTitle(doc, 'Paleta recomendada', margin, y);
    (Array.isArray(result.palette) ? result.palette : []).slice(0, 4).forEach((item) => {
        y = ensurePageSpace(doc, y, 26, margin);
        const rgb = hexToRgb(item.hex);
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(margin, y - 10, 16, 16, 'F');
        doc.setTextColor(17, 24, 39);
        doc.text(`${item.role}: ${item.label} (${item.hex})`, margin + 24, y + 2);
        y += 20;
    });

    y += 3;
    y = writeSectionTitle(doc, 'Top ranking e próximo passo', margin, y);
    const rankingRows = topRank.map((item, index) => `${index + 1}. ${item.label} (${item.hex}) - ${formatScore(item.score)} pts`);
    y = writeMiniPdfBullets(doc, [...rankingRows, ...actions], margin, y, pageWidth);

    doc.setDrawColor(212, 224, 245);
    doc.line(40, pageHeight - 34, pageWidth - 40, pageHeight - 34);
    doc.setTextColor(75, 98, 132);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.text('Quotia Color Strategy | Mini Brand Guide', 40, pageHeight - 19);
    doc.text('Página 1/1', pageWidth - 40, pageHeight - 19, { align: 'right' });

    const fileName = `color-strategy-mini-${timestampForFile()}.pdf`;
    doc.save(fileName);
    setExportStatus('PDF exportado com sucesso (Mini Brand Guide).');
}

function writeMiniPdfBullets(doc, rows, margin, y, pageWidth) {
    const maxWidth = pageWidth - (margin * 2);
    (Array.isArray(rows) ? rows : []).forEach((row) => {
        const raw = String(row || '').trim();
        if (!raw) {
            return;
        }
        const lines = doc.splitTextToSize(`- ${raw}`, maxWidth);
        lines.forEach((line) => {
            y = ensurePageSpace(doc, y, 20, margin);
            doc.text(line, margin, y);
            y += 12;
        });
    });
    return y;
}

function normalizeColorPdfTemplateMode(value) {
    return String(value || '').trim().toLowerCase() === 'mini' ? 'mini' : 'full';
}

function readColorPdfTemplateMode() {
    try {
        const stored = window.localStorage?.getItem(COLOR_PDF_TEMPLATE_KEY);
        if (String(stored || '').trim().toLowerCase() === 'mini') {
            return 'mini';
        }
    } catch (error) {
        /* noop */
    }

    const selectValue = String(document.getElementById('colorPdfTemplate')?.value || '').trim().toLowerCase();
    return selectValue === 'mini' ? 'mini' : 'full';
}

function persistColorPdfTemplateMode(value) {
    const normalized = normalizeColorPdfTemplateMode(value);
    const select = document.getElementById('colorPdfTemplate');
    if (select && select.value !== normalized) {
        select.value = normalized;
    }
    try {
        window.localStorage?.setItem(COLOR_PDF_TEMPLATE_KEY, normalized);
    } catch (error) {
        /* noop */
    }
    return normalized;
}

function syncColorPdfExportButton(mode) {
    const button = document.getElementById('exportPdfBtn');
    if (!(button instanceof HTMLButtonElement)) {
        return;
    }
    const normalized = normalizeColorPdfTemplateMode(mode);
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

function ensurePageSpace(doc, y, neededHeight, margin) {
    const maxY = 802;
    if (y + neededHeight <= maxY) {
        return y;
    }
    doc.addPage();
    return margin + 8;
}

function buildInputLines(inputs) {
    const dictionary = {
        objective: {
            confianca: 'Transmitir confiança',
            atencao: 'Ganhar atencao',
            acao: 'Estimular ação',
            sofisticacao: 'Posicionamento sofisticado',
            equilibrio: 'Bem-estar e equilíbrio',
            diversao: 'Energia e diversao',
        },
        productType: { utilitario: 'Utilitario', hedonico: 'Hedonico' },
        messageFrame: { gain: 'Ganho', prevention: 'Prevenção', neutral: 'Neutro' },
        audience: { mixed: 'Misto', masculino: 'Masculino', feminino: 'Feminino' },
        persona: {
            general: 'Geral',
            executive: 'Executiva e decisora',
            analytical: 'Analítica e racional',
            creative: 'Criativa e exploratoria',
            pragmatic: 'Pragmática e objetiva',
            premium: 'Premium e sofisticada',
            youth: 'Jovem e dinâmica'
        },
        arousal: { low: 'Baixo', medium: 'Médio', high: 'Alto' },
        contentDensity: { high: 'Alta', medium: 'Media', low: 'Baixa' },
        market: { brazil: 'Brasil/Latam', western: 'Ocidental', eastasia: 'Leste Asiático', global: 'Global' },
        context: {
            general: 'Geral',
            financas: 'Finanças/tecnologia',
            saude: 'Saúde e bem-estar',
            educacao: 'Educação',
            moda: 'Moda/beleza',
            namoro: 'Relacionamento/paixão',
            avaliacao: 'Avaliação/performance',
        },
        segment: {
            general: 'Geral',
            saas: 'SaaS e produtos digitais',
            ecommerce: 'E-commerce e varejo',
            health: 'Saúde e bem-estar',
            education: 'Educação e cursos',
            finance: 'Finanças e seguros',
            fashion: 'Moda e lifestyle',
            industrial: 'Indústria e B2B',
            hospitality: 'Hospitalidade e eventos'
        },
        channel: {
            multichannel: 'Multicanal',
            digital: 'Site e produto digital',
            social: 'Redes sociais',
            performance: 'Campanhas de performance',
            editorial: 'Materiais editoriais',
            retail: 'Varejo e PDV',
            presentation: 'Apresentações institucionais'
        },
        paletteSize: { auto: 'Automático', '2': '2', '3': '3', '4': '4', '5': '5' },
    };

    return [
        `Objetivo: ${dictionary.objective[inputs.objective] || inputs.objective}`,
        `Tipo de produto: ${dictionary.productType[inputs.productType] || inputs.productType}`,
        `Mensagem: ${dictionary.messageFrame[inputs.messageFrame] || inputs.messageFrame}`,
        `Público: ${dictionary.audience[inputs.audience] || inputs.audience}`,
        `Persona: ${dictionary.persona[inputs.persona] || inputs.persona}`,
        `Excitação: ${dictionary.arousal[inputs.arousal] || inputs.arousal}`,
        `Densidade de conteúdo: ${dictionary.contentDensity[inputs.contentDensity] || inputs.contentDensity}`,
        `Mercado: ${dictionary.market[inputs.market] || inputs.market}`,
        `Contexto: ${dictionary.context[inputs.context] || inputs.context}`,
        `Segmento: ${dictionary.segment[inputs.segment] || inputs.segment}`,
        `Canal principal: ${dictionary.channel[inputs.channel] || inputs.channel}`,
        `Tamanho da paleta: ${dictionary.paletteSize[inputs.paletteSize] || inputs.paletteSize}`,
    ];
}

function buildExportPayload() {
    const strategyHarmony = resolveStrategyHarmonyProfile(latestInputs || {});
    return {
        generated_at: new Date().toISOString(),
        tool: 'Color Strategy Advisor',
        inputs: latestInputs,
        result: {
            summary: latestResult.summary,
            palette_type: strategyHarmony.rule,
            harmony: strategyHarmony,
            confidence: latestResult.confidence || null,
            weight_profile: latestResult.weightProfile || null,
            palette: latestResult.palette,
            ranking: latestResult.ranked.map((item) => ({
                color: item.label,
                hex: item.hex,
                score: item.score,
                reasons: item.reasons,
            })),
            recommendations: latestResult.recommendations,
            ab_tests: latestResult.abTests || [],
            checklist: latestResult.checklist || [],
            contrast_audit: latestResult.contrastAudit || null,
            warnings: latestResult.warnings,
        },
        integration: {
            sync_mode: 'manual_generate_only',
            palette_type: strategyHarmony.rule,
            persona: latestInputs?.persona || 'general',
            segment: latestInputs?.segment || 'general',
            channel: latestInputs?.channel || 'multichannel',
        },
        sources: [
            'https://davidcreator.com/psicologia-das-cores-como-a-cor-influencia-nossa-vida/',
            'https://davidcreator.com/cores-no-mundo-do-marketing/',
        ],
    };
}

function downloadTextFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
}

function timestampForFile() {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const time = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    return `${date}-${time}`;
}

function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    return {
        r: parseInt(clean.slice(0, 2), 16),
        g: parseInt(clean.slice(2, 4), 16),
        b: parseInt(clean.slice(4, 6), 16),
    };
}

function setExportStatus(message, isError = false) {
    const status = document.getElementById('exportStatus');
    if (!status) {
        return;
    }

    status.textContent = message;
    status.style.color = isError ? '#991b1b' : '#475569';
}

