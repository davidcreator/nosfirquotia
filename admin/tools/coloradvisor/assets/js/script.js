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

const WARM = ['red', 'orange', 'yellow', 'pink'];
const COOL = ['blue', 'green', 'purple'];

let latestInputs = null;
let latestResult = null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('strategyForm');
    const resetBtn = document.getElementById('resetBtn');
    const palettePreview = document.getElementById('palettePreview');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const exportPdfBtn = document.getElementById('exportPdfBtn');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const inputs = getFormValues();
        const result = evaluateStrategy(inputs);
        renderResult(result, inputs);
    });

    resetBtn.addEventListener('click', () => {
        form.reset();
        const inputs = getFormValues();
        const result = evaluateStrategy(inputs);
        renderResult(result, inputs);
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

    const initialInputs = getFormValues();
    const initial = evaluateStrategy(initialInputs);
    renderResult(initial, initialInputs);
});

function getFormValues() {
    return {
        objective: getSelectValue('objective'),
        productType: getSelectValue('productType'),
        messageFrame: getSelectValue('messageFrame'),
        audience: getSelectValue('audience'),
        arousal: getSelectValue('arousal'),
        contentDensity: getSelectValue('contentDensity'),
        market: getSelectValue('market'),
        context: getSelectValue('context'),
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

    applyRuleMap(scoreMap, OBJECTIVE_RULES[inputs.objective] || {}, 'Objetivo da marca');

    if (inputs.productType === 'utilitario') {
        applyRuleMap(scoreMap, { blue: 3, green: 3, black: 2, brown: 1 }, 'Perfil utilitário');
    } else {
        applyRuleMap(scoreMap, { red: 3, purple: 3, pink: 3, orange: 2, yellow: 1 }, 'Perfil hedônico');
    }

    if (inputs.messageFrame === 'gain') {
        applyRuleMap(scoreMap, { blue: 3, green: 2, purple: 1 }, 'Mensagem de ganho');
    } else if (inputs.messageFrame === 'prevention') {
        applyRuleMap(scoreMap, { red: 3, yellow: 1, black: 1 }, 'Mensagem de prevenção');
    }

    if (inputs.audience === 'masculino') {
        applyRuleMap(scoreMap, { blue: 2, green: 1, black: 1 }, 'Afinidade público masculino');
    } else if (inputs.audience === 'feminino') {
        applyRuleMap(scoreMap, { purple: 2, pink: 2, red: 1, blue: 1 }, 'Afinidade público feminino');
    } else {
        applyRuleMap(scoreMap, { blue: 1, green: 1, purple: 1 }, 'Público misto');
    }

    if (inputs.arousal === 'high') {
        addBulkScore(scoreMap, WARM, 2, 'Excitação alta');
        addBulkScore(scoreMap, ['blue'], 1, 'Excitação alta com controle');
    } else if (inputs.arousal === 'low') {
        addBulkScore(scoreMap, COOL, 2, 'Excitação baixa');
        addBulkScore(scoreMap, WARM, -1, 'Reduzir excesso de excitação');
    } else {
        addBulkScore(scoreMap, ['blue', 'green'], 1, 'Equilíbrio de excitação');
    }

    if (inputs.context === 'financas') {
        applyRuleMap(scoreMap, { blue: 3, green: 2, black: 1 }, 'Contexto financeiro');
    } else if (inputs.context === 'saude') {
        applyRuleMap(scoreMap, { green: 3, blue: 2, white: 2 }, 'Contexto de saúde');
    } else if (inputs.context === 'educacao') {
        applyRuleMap(scoreMap, { blue: 2, green: 1, yellow: 1 }, 'Contexto educacional');
    } else if (inputs.context === 'moda') {
        applyRuleMap(scoreMap, { black: 3, purple: 2, pink: 2 }, 'Contexto de moda');
    } else if (inputs.context === 'namoro') {
        applyRuleMap(scoreMap, { red: 3, pink: 2, purple: 1 }, 'Contexto de relacionamento');
    } else if (inputs.context === 'avaliacao') {
        applyRuleMap(scoreMap, { red: -3, blue: 2, green: 1 }, 'Contexto de avaliação/performance');
    }

    if (inputs.market === 'eastasia') {
        addScore(scoreMap, 'blue', -2, 'Ajuste cultural (Leste Asiatico)');
        warnings.push('No Leste Asiático, azul pode ter associações diferentes das ocidentais. Valide em pesquisa local.');
    } else if (inputs.market === 'global') {
        warnings.push('Para mercado global, valide a paleta por país e evite assumir significados universais.');
    }

    if (inputs.context === 'avaliacao' && getScore(scoreMap, 'red') > 0) {
        warnings.push('Em cenários de avaliação/performance, o vermelho pode elevar pressão e reduzir desempenho.');
    }

    const ranked = Object.values(scoreMap).sort((a, b) => b.score - a.score);
    const brandColorCount = getBrandColorCount(inputs);
    const palette = buildPalette(ranked, brandColorCount, inputs.objective);

    if (inputs.contentDensity === 'high') {
        recommendations.push('Conteúdo denso pede menos variação cromática: priorize 2-3 cores de marca.');
    } else if (inputs.contentDensity === 'low') {
        recommendations.push('Com layout limpo, você pode usar variação cromática maior sem sobrecarga visual.');
    }

    if (inputs.productType === 'utilitario') {
        recommendations.push('Produtos utilitários tendem a ganhar clareza com paleta contida e tons de confiança.');
    } else {
        recommendations.push('Produtos hedônicos aceitam maior expressividade cromática e contrastes mais vivos.');
    }

    recommendations.push('Garanta contraste forte entre primeiro plano e fundo para elevar percepção de harmonia e legibilidade.');
    recommendations.push('Significado da cor depende de experiência, cultura e contexto: teste com público real antes de fechar a identidade.');

    const summary = `Top 3 cores: ${ranked.slice(0, 3).map((entry) => entry.label).join(', ')}. `
        + `Paleta de marca sugerida: ${brandColorCount} cor(es).`;

    return { ranked, palette, recommendations, warnings, summary };
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
        roles.push({ role, label: entry.label, hex: entry.hex });
    });

    if (!roles.find((item) => item.role === 'Acento') && accent) {
        roles.push({ role: 'Acento', label: accent.label, hex: accent.hex });
    }

    roles.push(
        { role: background.label, label: background.label, hex: background.hex },
        { role: text.label, label: text.label, hex: text.hex }
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

function renderResult(result, inputs = null) {
    latestResult = result;
    if (inputs) {
        latestInputs = inputs;
    }

    renderSummary(result.summary);
    renderPalette(result.palette);
    renderScoreTable(result.ranked);
    renderNotes('recommendationsList', result.recommendations, 'Nenhuma recomendação adicional.');
    renderNotes('warningsList', result.warnings, 'Sem alertas específicos para o contexto informado.');
    const synced = syncBrandKitFromStrategy(result, latestInputs || inputs || {});
    setExportStatus(synced ? 'Paleta sincronizada com Mockups e relatório geral.' : '');
}

function renderSummary(text) {
    const summary = document.getElementById('strategySummary');
    summary.textContent = text;
}

function renderPalette(palette) {
    const container = document.getElementById('palettePreview');
    container.innerHTML = palette.map((item) => `
        <article class="swatch">
            <div class="swatch-color" style="background:${item.hex};"></div>
            <div class="swatch-info">
                <p class="swatch-role">${item.role}</p>
                <p class="swatch-meta">
                    <strong>${item.label}</strong>
                    <button class="copy-hex" type="button" data-hex="${item.hex}">${item.hex}</button>
                </p>
            </div>
        </article>
    `).join('');
}

function renderScoreTable(ranked) {
    const body = document.getElementById('scoreTableBody');
    body.innerHTML = ranked.map((entry) => `
        <tr>
            <td><span class="score-color" style="background:${entry.hex};"></span>${entry.label}</td>
            <td>${entry.score}</td>
            <td>${entry.reasons.slice(0, 3).join(' | ') || 'Sem regra aplicada'}</td>
        </tr>
    `).join('');
}

function renderNotes(targetId, notes, emptyMessage) {
    const list = document.getElementById(targetId);
    if (!notes.length) {
        list.innerHTML = `<li>${emptyMessage}</li>`;
        return;
    }

    list.innerHTML = notes.map((item) => `<li>${item}</li>`).join('');
}

function syncBrandKitFromStrategy(result, inputs) {
    const api = window.AQBrandKit;
    if (!api || !result || !Array.isArray(result.palette)) {
        return false;
    }

    const roleMap = {};
    result.palette.forEach((item) => {
        const role = String(item.role || '').toLowerCase();
        if (role) {
            roleMap[role] = item;
        }
    });

    const colors = result.palette
        .map((item) => String(item.hex || '').trim())
        .filter((hex) => /^#[0-9a-fA-F]{6}$/.test(hex));

    const primary = roleMap.primaria?.hex || colors[0] || '#1e88e5';
    const secondary = roleMap.secundaria?.hex || colors[1] || '#43a047';
    const accent = roleMap.acento?.hex || colors[2] || '#f59e0b';
    const neutral = roleMap['texto principal']?.hex || '#111827';

    api.syncColorPalette({
        baseColor: primary,
        type: 'strategy',
        title: 'Paleta recomendada pelo Color Strategy Advisor',
        description: result.summary || 'Paleta recomendada para identidade visual.',
        colors
    }, 'coloradvisor');

    api.saveColorPaletteState({
        baseColor: primary,
        type: 'strategy',
        title: 'Color Strategy Advisor',
        description: result.summary || '',
        colors,
        context: inputs?.context || '',
        objective: inputs?.objective || ''
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

        const combinations = [
            {
                label: 'Estrutura principal',
                value: `${primary.toUpperCase()} / ${secondary.toUpperCase()} / ${accent.toUpperCase()}`,
                detail: 'Aplicar regra 60-30-10 para manter consistência entre seções.'
            },
            {
                label: 'Base neutra',
                value: neutral.toUpperCase(),
                detail: 'Usar para textos extensos, componentes de apoio e equilíbrio da composição.'
            }
        ];

        const contrast = colors.slice(0, 8).map((hex) => ({
            color: hex,
            recommendedText: isDark(hex) ? '#F8FAFC' : '#111827',
            ratio: 4.5,
            level: 'AA'
        }));

        api.syncBrandInsights({
            paletteType: 'strategy',
            summary: result.summary || 'Paleta recomendada pelo Color Strategy Advisor.',
            roles: {
                primary,
                secondary,
                accent,
                neutralLight: '#F8FAFC',
                neutralDark: neutral
            },
            colors,
            combinations,
            trends,
            contrast,
            recommendations: Array.isArray(result.recommendations)
                ? result.recommendations.slice(0, 6)
                : []
        }, 'coloradvisor');
    }

    return true;
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
    if (!color || points === 0) {
        return;
    }

    color.score += points;
    color.reasons.push(`${reason} (${points > 0 ? '+' : ''}${points})`);
}

function getScore(scoreMap, key) {
    return scoreMap[key]?.score || 0;
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
        doc.text(`${index + 1}. ${item.label} - ${item.score} pts`, margin, y);
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

    const fileName = `color-strategy-${timestampForFile()}.pdf`;
    doc.save(fileName);
    setExportStatus('PDF exportado com sucesso.');
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
            atencao: 'Ganhar atenção',
            acao: 'Estimular ação',
            sofisticacao: 'Posicionamento sofisticado',
            equilibrio: 'Bem-estar e equilíbrio',
            diversao: 'Energia e diversão',
        },
        productType: { utilitario: 'Utilitário', hedonico: 'Hedônico' },
        messageFrame: { gain: 'Ganho', prevention: 'Prevenção', neutral: 'Neutro' },
        audience: { mixed: 'Misto', masculino: 'Masculino', feminino: 'Feminino' },
        arousal: { low: 'Baixo', medium: 'Médio', high: 'Alto' },
        contentDensity: { high: 'Alta', medium: 'Média', low: 'Baixa' },
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
        paletteSize: { auto: 'Automático', '2': '2', '3': '3', '4': '4', '5': '5' },
    };

    return [
        `Objetivo: ${dictionary.objective[inputs.objective] || inputs.objective}`,
        `Tipo de produto: ${dictionary.productType[inputs.productType] || inputs.productType}`,
        `Mensagem: ${dictionary.messageFrame[inputs.messageFrame] || inputs.messageFrame}`,
        `Público: ${dictionary.audience[inputs.audience] || inputs.audience}`,
        `Excitação: ${dictionary.arousal[inputs.arousal] || inputs.arousal}`,
        `Densidade de conteúdo: ${dictionary.contentDensity[inputs.contentDensity] || inputs.contentDensity}`,
        `Mercado: ${dictionary.market[inputs.market] || inputs.market}`,
        `Contexto: ${dictionary.context[inputs.context] || inputs.context}`,
        `Tamanho da paleta: ${dictionary.paletteSize[inputs.paletteSize] || inputs.paletteSize}`,
    ];
}

function buildExportPayload() {
    return {
        generated_at: new Date().toISOString(),
        tool: 'Color Strategy Advisor',
        inputs: latestInputs,
        result: {
            summary: latestResult.summary,
            palette: latestResult.palette,
            ranking: latestResult.ranked.map((item) => ({
                color: item.label,
                hex: item.hex,
                score: item.score,
                reasons: item.reasons,
            })),
            recommendations: latestResult.recommendations,
            warnings: latestResult.warnings,
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

