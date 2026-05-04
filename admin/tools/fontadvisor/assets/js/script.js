const FONT_LIBRARY = [
    { key: 'inter', name: 'Inter', css: '"Inter", "Segoe UI", Arial, sans-serif', category: 'sans', vibe: ['tecnologia', 'corporativo', 'inovador'], readability: 'alta', channels: ['digital', 'hibrido'] },
    { key: 'manrope', name: 'Manrope', css: '"Manrope", "Inter", Arial, sans-serif', category: 'sans', vibe: ['inovador', 'criativo', 'premium'], readability: 'alta', channels: ['digital', 'hibrido'] },
    { key: 'montserrat', name: 'Montserrat', css: '"Montserrat", "Segoe UI", Arial, sans-serif', category: 'sans', vibe: ['equilibrado', 'moda', 'tecnologia'], readability: 'alta', channels: ['digital', 'hibrido'] },
    { key: 'poppins', name: 'Poppins', css: '"Poppins", "Segoe UI", Arial, sans-serif', category: 'sans', vibe: ['amigavel', 'criativo', 'moda'], readability: 'alta', channels: ['digital', 'hibrido'] },
    { key: 'merriweather', name: 'Merriweather', css: '"Merriweather", Georgia, serif', category: 'serif', vibe: ['editorial', 'corporativo', 'educacao'], readability: 'alta', channels: ['impresso', 'hibrido'] },
    { key: 'playfair', name: 'Playfair Display', css: '"Playfair Display", Georgia, serif', category: 'serif', vibe: ['premium', 'editorial', 'moda'], readability: 'media', channels: ['impresso', 'hibrido'] },
    { key: 'roboto_slab', name: 'Roboto Slab', css: '"Roboto Slab", Georgia, serif', category: 'serif', vibe: ['corporativo', 'financeiro', 'equilibrado'], readability: 'alta', channels: ['digital', 'hibrido'] },
    { key: 'roboto_mono', name: 'Roboto Mono', css: '"Roboto Mono", Consolas, monospace', category: 'mono', vibe: ['tecnologia', 'inovador', 'financeiro'], readability: 'media', channels: ['digital', 'hibrido'] }
];

let latestRecommendation = null;

document.addEventListener('DOMContentLoaded', () => {
    hydrateFromBrandKit();
    bindEvents();
    generateRecommendation();
});

function bindEvents() {
    document.getElementById('fontStrategyForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        generateRecommendation();
    });

    document.getElementById('applyFontProfileBtn')?.addEventListener('click', applyTypographyToBrandKit);
    document.getElementById('exportFontProfileBtn')?.addEventListener('click', exportFontProfile);
}

function hydrateFromBrandKit() {
    const api = window.AQBrandKit;
    if (!api) {
        return;
    }
    const snapshot = api.getIntegrationSnapshot?.();
    const profile = snapshot?.fontProfile || {};
    const tone = String(profile.tone || '');
    const channel = String(profile.channel || '');
    const readability = String(profile.readability || '');
    const pairingStyle = String(profile.pairingStyle || '');

    setFieldValue('tone', tone);
    setFieldValue('channel', channel);
    setFieldValue('readability', readability);
    setFieldValue('pairingStyle', pairingStyle);
    setFieldValue('projectNotes', profile.notes || '');
}

function generateRecommendation() {
    const criteria = getFormValues();
    const ranking = rankFonts(criteria);
    const pair = buildPairing(ranking, criteria.pairingStyle);

    latestRecommendation = {
        criteria,
        ranking,
        pair,
        generatedAt: new Date().toISOString()
    };

    renderRecommendation(latestRecommendation);
    saveDraftFontProfile();
    applyTypographyToBrandKit({ silent: true });
}

function getFormValues() {
    return {
        industry: getFieldValue('industry', 'geral'),
        tone: getFieldValue('tone', 'equilibrado'),
        channel: getFieldValue('channel', 'digital'),
        readability: getFieldValue('readability', 'alta'),
        pairingStyle: getFieldValue('pairingStyle', 'modern-serif'),
        notes: getFieldValue('projectNotes', '')
    };
}

function rankFonts(criteria) {
    return FONT_LIBRARY
        .map((font) => {
            let score = 0;
            const reasons = [];

            if (font.vibe.includes(criteria.tone)) {
                score += 4;
                reasons.push('alinha com tom');
            }

            if (font.vibe.includes(criteria.industry)) {
                score += 4;
                reasons.push('ajuste com segmento');
            }

            if (font.channels.includes(criteria.channel)) {
                score += 3;
                reasons.push('canal recomendado');
            }

            if (criteria.channel === 'hibrido' && font.channels.includes('hibrido')) {
                score += 2;
                reasons.push('equilibrio digital/impresso');
            }

            if (font.readability === criteria.readability) {
                score += 3;
                reasons.push('legibilidade compatível');
            } else if (criteria.readability === 'alta' && font.readability === 'media') {
                score -= 1;
                reasons.push('legibilidade menor que o desejado');
            }

            if (criteria.pairingStyle === 'sans-sans' && font.category === 'sans') {
                score += 2;
            }
            if (criteria.pairingStyle === 'serif-sans' && (font.category === 'serif' || font.category === 'sans')) {
                score += 1;
            }
            if (criteria.pairingStyle === 'expressive-neutral' && (font.category === 'serif' || font.category === 'mono')) {
                score += 2;
            }
            if (criteria.pairingStyle === 'modern-serif' && (font.category === 'sans' || font.category === 'serif')) {
                score += 1;
            }

            return { ...font, score, reasons };
        })
        .sort((a, b) => b.score - a.score);
}

function buildPairing(ranking, pairingStyle) {
    const top = ranking.slice(0, 6);
    const fallbackPrimary = top[0] || FONT_LIBRARY[0];
    const fallbackSecondary = top[1] || FONT_LIBRARY[1];
    let primary = fallbackPrimary;
    let secondary = fallbackSecondary;

    if (pairingStyle === 'sans-sans') {
        primary = top.find((item) => item.category === 'sans') || fallbackPrimary;
        secondary = top.find((item) => item.key !== primary.key && item.category === 'sans') || fallbackSecondary;
    } else if (pairingStyle === 'serif-sans') {
        primary = top.find((item) => item.category === 'serif') || fallbackPrimary;
        secondary = top.find((item) => item.key !== primary.key && item.category === 'sans') || fallbackSecondary;
    } else if (pairingStyle === 'expressive-neutral') {
        primary = top.find((item) => item.category === 'serif') || fallbackPrimary;
        secondary = top.find((item) => item.key !== primary.key && (item.category === 'sans' || item.category === 'mono')) || fallbackSecondary;
    } else {
        primary = top.find((item) => item.category === 'sans') || fallbackPrimary;
        secondary = top.find((item) => item.key !== primary.key && item.category === 'serif') || fallbackSecondary;
    }

    return {
        primary,
        secondary,
        summary: `${primary.name} (títulos) + ${secondary.name} (textos de apoio).`
    };
}

function renderRecommendation(payload) {
    const summary = document.getElementById('fontStrategySummary');
    const cards = document.getElementById('fontCards');
    const previewPrimary = document.getElementById('pairingPrimarySample');
    const previewSecondary = document.getElementById('pairingSecondarySample');
    const meta = document.getElementById('pairingMeta');

    if (!payload || !payload.pair || !payload.ranking) {
        if (summary) {
            summary.textContent = 'Não foi possível montar recomendação neste momento.';
        }
        return;
    }

    const primary = payload.pair.primary;
    const secondary = payload.pair.secondary;
    const topColors = resolveBrandColors();

    if (summary) {
        summary.textContent = `Par recomendado: ${payload.pair.summary}`;
    }

    if (previewPrimary) {
        previewPrimary.style.fontFamily = primary.css;
        previewPrimary.style.color = topColors.primary;
        previewPrimary.textContent = 'Identidade tipografica principal';
    }

    if (previewSecondary) {
        previewSecondary.style.fontFamily = secondary.css;
        previewSecondary.style.color = topColors.secondary;
        previewSecondary.textContent = 'Texto de apoio com contraste e leitura consistente em diferentes formatos.';
    }

    const preview = document.getElementById('pairingPreview');
    if (preview) {
        preview.style.background = `linear-gradient(145deg, ${topColors.surface} 0%, ${topColors.background} 100%)`;
    }

    if (meta) {
        meta.textContent = `Estilo: ${translatePairingStyle(payload.criteria.pairingStyle)} | Segmento: ${capitalize(payload.criteria.industry)} | Canal: ${capitalize(payload.criteria.channel)} | Legibilidade: ${capitalize(payload.criteria.readability)}.`;
    }

    if (cards) {
        cards.innerHTML = payload.ranking.slice(0, 6).map((font, index) => renderFontCard(font, index)).join('');
    }

    setSyncStatus('Recomendação atualizada. Se desejar, aplique ao Brand Kit.', 'ok');
}

function renderFontCard(font, index) {
    const reasons = Array.isArray(font.reasons) && font.reasons.length
        ? font.reasons.slice(0, 2).join(' | ')
        : 'Sem regra específica aplicada.';

    return `
        <article class="font-card">
            <h4 style="font-family:${font.css};">${index + 1}. ${font.name}</h4>
            <p>${capitalize(font.category)} | Pontuação: ${font.score}</p>
            <p>${escapeHtml(reasons)}</p>
            <div class="font-card-meta">
                <span class="font-badge">${escapeHtml(capitalize(font.readability))}</span>
                <span class="font-badge">${escapeHtml(font.channels.join(' / '))}</span>
            </div>
        </article>
    `;
}

function applyTypographyToBrandKit(options = {}) {
    const silent = Boolean(options.silent);
    if (!latestRecommendation || !latestRecommendation.pair) {
        if (!silent) {
            setSyncStatus('Gere uma recomendação antes de aplicar ao Brand Kit.', 'error');
        }
        return;
    }

    const api = window.AQBrandKit;
    if (!api) {
        if (!silent) {
            setSyncStatus('Integração do Brand Kit indisponível no momento.', 'error');
        }
        return;
    }

    const primary = latestRecommendation.pair.primary;
    const secondary = latestRecommendation.pair.secondary;
    const criteria = latestRecommendation.criteria;

    const profilePayload = {
        industry: criteria.industry,
        tone: criteria.tone,
        channel: criteria.channel,
        readability: criteria.readability,
        pairingStyle: criteria.pairingStyle,
        notes: criteria.notes || '',
        primaryFontKey: primary.key,
        primaryFontName: primary.name,
        secondaryFontKey: secondary.key,
        secondaryFontName: secondary.name
    };

    api.syncTypography(profilePayload, 'fontadvisor');
    if (!silent) {
        setSyncStatus('Tipografia sincronizada com Brand Kit e relatório geral.', 'ok');
    }
}

function saveDraftFontProfile() {
    if (!latestRecommendation) {
        return;
    }

    const api = window.AQBrandKit;
    if (!api) {
        return;
    }
    const primary = latestRecommendation.pair.primary;
    const secondary = latestRecommendation.pair.secondary;
    const criteria = latestRecommendation.criteria;

    api.saveFontProfileState({
        industry: criteria.industry,
        tone: criteria.tone,
        channel: criteria.channel,
        readability: criteria.readability,
        pairingStyle: criteria.pairingStyle,
        notes: criteria.notes || '',
        primaryFontKey: primary.key,
        primaryFontName: primary.name,
        secondaryFontKey: secondary.key,
        secondaryFontName: secondary.name
    }, 'fontadvisor');
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
        pair: {
            primary: {
                key: latestRecommendation.pair.primary.key,
                name: latestRecommendation.pair.primary.name,
                category: latestRecommendation.pair.primary.category
            },
            secondary: {
                key: latestRecommendation.pair.secondary.key,
                name: latestRecommendation.pair.secondary.name,
                category: latestRecommendation.pair.secondary.category
            },
            summary: latestRecommendation.pair.summary
        },
        ranking: latestRecommendation.ranking.slice(0, 8).map((item) => ({
            key: item.key,
            name: item.name,
            category: item.category,
            score: item.score,
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

function resolveBrandColors() {
    const fallback = {
        primary: '#1d4ed8',
        secondary: '#334155',
        background: '#eef5ff',
        surface: '#ffffff'
    };
    const api = window.AQBrandKit;
    if (!api) {
        return fallback;
    }
    const snapshot = api.getIntegrationSnapshot?.();
    const colors = snapshot?.brandKit?.brandColors || {};
    return {
        primary: api.normalizeHex(colors.primary, fallback.primary),
        secondary: api.normalizeHex(colors.secondary, fallback.secondary),
        background: api.normalizeHex(colors.accent, fallback.background),
        surface: api.normalizeHex(colors.neutral, fallback.surface)
    };
}

function setFieldValue(id, value) {
    const element = document.getElementById(id);
    if (!element) {
        return;
    }
    const normalized = String(value || '').trim();
    if (!normalized) {
        return;
    }
    const hasOption = Array.from(element.options || []).some((option) => option.value === normalized);
    if (hasOption || element.tagName === 'TEXTAREA') {
        element.value = normalized;
    }
}

function getFieldValue(id, fallback = '') {
    const element = document.getElementById(id);
    if (!element) {
        return fallback;
    }
    return String(element.value || fallback).trim();
}

function setSyncStatus(message, level = '') {
    const target = document.getElementById('fontSyncStatus');
    if (!target) {
        return;
    }
    target.textContent = message;
    target.classList.remove('ok', 'error');
    if (level === 'ok') {
        target.classList.add('ok');
    }
    if (level === 'error') {
        target.classList.add('error');
    }
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

function translatePairingStyle(style) {
    const labels = {
        'modern-serif': 'Moderno + Serifado',
        'sans-sans': 'Sans + Sans',
        'serif-sans': 'Serifado + Sans',
        'expressive-neutral': 'Expressiva + Neutra'
    };
    return labels[style] || style;
}

function capitalize(value) {
    const text = String(value || '').trim();
    if (!text) {
        return '-';
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

