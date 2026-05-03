(function initAQBrandKit(global) {
    if (!global || global.AQBrandKit) {
        return;
    }

    const BRAND_KIT_KEY = 'aq_brand_kit_v1';
    const COLOR_PALETTE_STATE_KEY = 'aq_color_palette_state_v1';
    const FONT_PROFILE_STATE_KEY = 'aq_font_profile_state_v1';
    const BRAND_INSIGHTS_STATE_KEY = 'aq_brand_insights_state_v1';
    const OG_PROFILE_STATE_KEY = 'aq_og_profile_state_v1';
    const BGREMOVE_STATE_KEY = 'aq_bgremove_state_v1';

    const DEFAULT_BRAND_KIT = {
        version: 1,
        updatedAt: null,
        source: 'system',
        brandColors: {
            primary: '#3498db',
            secondary: '#1f2937',
            accent: '#f59e0b',
            neutral: '#111827',
            updatedAt: null,
            source: 'system'
        },
        palette: {
            baseColor: '#3498db',
            type: 'monochromatic',
            title: 'Paleta base',
            description: 'Paleta padrao da marca.',
            colors: ['#3498db', '#1f2937', '#f59e0b', '#f8fafc', '#111827'],
            updatedAt: null,
            source: 'system'
        },
        typography: {
            primaryFontKey: 'montserrat',
            primaryFontName: 'Montserrat',
            secondaryFontKey: 'lora',
            secondaryFontName: 'Lora',
            pairingStyle: 'modern-serif',
            tone: 'equilibrado',
            notes: '',
            updatedAt: null,
            source: 'system'
        }
    };

    function nowIso() {
        return new Date().toISOString();
    }

    function isObject(value) {
        return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    }

    function safeParseJson(raw, fallback) {
        try {
            return JSON.parse(raw);
        } catch (error) {
            return fallback;
        }
    }

    function readState(key, fallback) {
        if (typeof localStorage === 'undefined') {
            return fallback;
        }
        const raw = localStorage.getItem(key);
        if (!raw) {
            return fallback;
        }
        return safeParseJson(raw, fallback);
    }

    function writeState(key, value) {
        if (typeof localStorage === 'undefined') {
            return false;
        }
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            return false;
        }
    }

    function normalizeHex(value, fallback = '#000000') {
        const normalized = String(value || '').trim().toLowerCase();
        if (/^#[0-9a-f]{6}$/.test(normalized)) {
            return normalized;
        }
        if (/^#[0-9a-f]{3}$/.test(normalized)) {
            return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
        }
        return fallback.toLowerCase();
    }

    function uniqueColors(colors) {
        if (!Array.isArray(colors)) {
            return [];
        }
        const seen = new Set();
        const result = [];
        colors.forEach((color) => {
            const normalized = normalizeHex(color, '');
            if (!normalized || seen.has(normalized)) {
                return;
            }
            seen.add(normalized);
            result.push(normalized);
        });
        return result;
    }

    function sanitizeNumber(value, fallback, min = null, max = null) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
            return fallback;
        }
        let next = parsed;
        if (Number.isFinite(min)) {
            next = Math.max(next, Number(min));
        }
        if (Number.isFinite(max)) {
            next = Math.min(next, Number(max));
        }
        return next;
    }

    function sanitizeText(value, maxLength = 300, fallback = '') {
        const text = typeof value === 'string' ? value.trim() : '';
        if (text === '') {
            return fallback;
        }
        return text.slice(0, maxLength);
    }

    function sanitizeInsightsRoles(rawRoles, fallbackRoles = {}) {
        const fallback = isObject(fallbackRoles) ? fallbackRoles : {};
        const roles = isObject(rawRoles) ? rawRoles : {};
        return {
            primary: normalizeHex(roles.primary, fallback.primary || '#3498db'),
            secondary: normalizeHex(roles.secondary, fallback.secondary || '#1f2937'),
            accent: normalizeHex(roles.accent, fallback.accent || '#f59e0b'),
            neutralLight: normalizeHex(roles.neutralLight, fallback.neutralLight || '#f8fafc'),
            neutralDark: normalizeHex(roles.neutralDark, fallback.neutralDark || '#111827')
        };
    }

    function sanitizeStringArray(value, maxItems = 16, maxLength = 140) {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .map((entry) => sanitizeText(entry, maxLength, ''))
            .filter(Boolean)
            .slice(0, maxItems);
    }

    function sanitizeBgRemoveState(rawState) {
        const fallback = {
            updatedAt: null,
            source: 'system',
            status: 'idle',
            hasUpload: false,
            hasResult: false,
            hasAdjusted: false,
            input: {
                name: '',
                size: 0,
                type: ''
            },
            settings: {
                tolerance: 15,
                bgColor: '#ffffff',
                useBgColor: false,
                mode: 'auto',
                feather: 1,
                autoBg: true,
                noiseClean: 45,
                fillHoles: 35,
                edgeTrim: 5,
                presetKey: 'auto',
                smartPreset: true
            },
            output: {
                original: '',
                processed: '',
                download: '',
                adjustedDownload: '',
                format: 'png'
            },
            meta: {}
        };

        const raw = isObject(rawState) ? rawState : {};
        const rawInput = isObject(raw.input) ? raw.input : {};
        const rawSettings = isObject(raw.settings) ? raw.settings : {};
        const rawOutput = isObject(raw.output) ? raw.output : {};

        return {
            ...fallback,
            ...raw,
            updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : fallback.updatedAt,
            source: sanitizeText(raw.source, 80, fallback.source),
            status: sanitizeText(raw.status, 40, fallback.status),
            hasUpload: Boolean(raw.hasUpload),
            hasResult: Boolean(raw.hasResult),
            hasAdjusted: Boolean(raw.hasAdjusted),
            input: {
                name: sanitizeText(rawInput.name, 180, ''),
                size: sanitizeNumber(rawInput.size, 0, 0, 1024 * 1024 * 1024),
                type: sanitizeText(rawInput.type, 100, '')
            },
            settings: {
                tolerance: sanitizeNumber(rawSettings.tolerance, fallback.settings.tolerance, 0, 255),
                bgColor: normalizeHex(rawSettings.bgColor, fallback.settings.bgColor),
                useBgColor: Boolean(rawSettings.useBgColor),
                mode: sanitizeText(rawSettings.mode, 30, fallback.settings.mode),
                feather: sanitizeNumber(rawSettings.feather, fallback.settings.feather, 0, 24),
                autoBg: Boolean(
                    Object.prototype.hasOwnProperty.call(rawSettings, 'autoBg')
                        ? rawSettings.autoBg
                        : fallback.settings.autoBg
                ),
                noiseClean: sanitizeNumber(rawSettings.noiseClean, fallback.settings.noiseClean, 0, 100),
                fillHoles: sanitizeNumber(rawSettings.fillHoles, fallback.settings.fillHoles, 0, 100),
                edgeTrim: sanitizeNumber(rawSettings.edgeTrim, fallback.settings.edgeTrim, 0, 100),
                presetKey: sanitizeText(rawSettings.presetKey, 40, fallback.settings.presetKey),
                smartPreset: Boolean(
                    Object.prototype.hasOwnProperty.call(rawSettings, 'smartPreset')
                        ? rawSettings.smartPreset
                        : fallback.settings.smartPreset
                )
            },
            output: {
                original: sanitizeText(rawOutput.original, 900, ''),
                processed: sanitizeText(rawOutput.processed, 900, ''),
                download: sanitizeText(rawOutput.download, 900, ''),
                adjustedDownload: sanitizeText(rawOutput.adjustedDownload, 900, ''),
                format: sanitizeText(rawOutput.format, 20, fallback.output.format)
            },
            meta: isObject(raw.meta) ? raw.meta : {}
        };
    }

    function sanitizeInsightsList(value, maxItems = 12) {
        if (!Array.isArray(value)) {
            return [];
        }

        return value
            .map((item) => {
                if (!isObject(item)) {
                    return null;
                }
                return {
                    label: sanitizeText(item.label, 90, ''),
                    value: sanitizeText(item.value, 200, ''),
                    detail: sanitizeText(item.detail, 280, '')
                };
            })
            .filter((item) => item && (item.label || item.value || item.detail))
            .slice(0, maxItems);
    }

    function mergeBrandKit(rawState) {
        const raw = isObject(rawState) ? rawState : {};
        const rawBrandColors = isObject(raw.brandColors) ? raw.brandColors : {};
        const rawPalette = isObject(raw.palette) ? raw.palette : {};
        const rawTypography = isObject(raw.typography) ? raw.typography : {};

        const merged = {
            version: 1,
            updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : DEFAULT_BRAND_KIT.updatedAt,
            source: typeof raw.source === 'string' ? raw.source : DEFAULT_BRAND_KIT.source,
            brandColors: {
                primary: normalizeHex(rawBrandColors.primary, DEFAULT_BRAND_KIT.brandColors.primary),
                secondary: normalizeHex(rawBrandColors.secondary, DEFAULT_BRAND_KIT.brandColors.secondary),
                accent: normalizeHex(rawBrandColors.accent, DEFAULT_BRAND_KIT.brandColors.accent),
                neutral: normalizeHex(rawBrandColors.neutral, DEFAULT_BRAND_KIT.brandColors.neutral),
                updatedAt: typeof rawBrandColors.updatedAt === 'string' ? rawBrandColors.updatedAt : DEFAULT_BRAND_KIT.brandColors.updatedAt,
                source: typeof rawBrandColors.source === 'string' ? rawBrandColors.source : DEFAULT_BRAND_KIT.brandColors.source
            },
            palette: {
                baseColor: normalizeHex(rawPalette.baseColor, DEFAULT_BRAND_KIT.palette.baseColor),
                type: typeof rawPalette.type === 'string' ? rawPalette.type : DEFAULT_BRAND_KIT.palette.type,
                title: typeof rawPalette.title === 'string' ? rawPalette.title : DEFAULT_BRAND_KIT.palette.title,
                description: typeof rawPalette.description === 'string' ? rawPalette.description : DEFAULT_BRAND_KIT.palette.description,
                colors: uniqueColors(rawPalette.colors).slice(0, 12),
                updatedAt: typeof rawPalette.updatedAt === 'string' ? rawPalette.updatedAt : DEFAULT_BRAND_KIT.palette.updatedAt,
                source: typeof rawPalette.source === 'string' ? rawPalette.source : DEFAULT_BRAND_KIT.palette.source
            },
            typography: {
                primaryFontKey: typeof rawTypography.primaryFontKey === 'string' ? rawTypography.primaryFontKey : DEFAULT_BRAND_KIT.typography.primaryFontKey,
                primaryFontName: typeof rawTypography.primaryFontName === 'string' ? rawTypography.primaryFontName : DEFAULT_BRAND_KIT.typography.primaryFontName,
                secondaryFontKey: typeof rawTypography.secondaryFontKey === 'string' ? rawTypography.secondaryFontKey : DEFAULT_BRAND_KIT.typography.secondaryFontKey,
                secondaryFontName: typeof rawTypography.secondaryFontName === 'string' ? rawTypography.secondaryFontName : DEFAULT_BRAND_KIT.typography.secondaryFontName,
                pairingStyle: typeof rawTypography.pairingStyle === 'string' ? rawTypography.pairingStyle : DEFAULT_BRAND_KIT.typography.pairingStyle,
                tone: typeof rawTypography.tone === 'string' ? rawTypography.tone : DEFAULT_BRAND_KIT.typography.tone,
                notes: typeof rawTypography.notes === 'string' ? rawTypography.notes : DEFAULT_BRAND_KIT.typography.notes,
                updatedAt: typeof rawTypography.updatedAt === 'string' ? rawTypography.updatedAt : DEFAULT_BRAND_KIT.typography.updatedAt,
                source: typeof rawTypography.source === 'string' ? rawTypography.source : DEFAULT_BRAND_KIT.typography.source
            }
        };

        if (!merged.palette.colors.length) {
            merged.palette.colors = [...DEFAULT_BRAND_KIT.palette.colors];
        }

        return merged;
    }

    function getBrandKit() {
        return mergeBrandKit(readState(BRAND_KIT_KEY, DEFAULT_BRAND_KIT));
    }

    function saveBrandKit(patch = {}, source = 'manual') {
        const current = getBrandKit();
        const timestamp = nowIso();
        const normalizedPatch = isObject(patch) ? patch : {};
        const next = {
            ...current,
            ...normalizedPatch,
            updatedAt: timestamp,
            source
        };

        if (isObject(normalizedPatch.brandColors)) {
            next.brandColors = {
                ...current.brandColors,
                ...normalizedPatch.brandColors,
                primary: normalizeHex(normalizedPatch.brandColors.primary, current.brandColors.primary),
                secondary: normalizeHex(normalizedPatch.brandColors.secondary, current.brandColors.secondary),
                accent: normalizeHex(normalizedPatch.brandColors.accent, current.brandColors.accent),
                neutral: normalizeHex(normalizedPatch.brandColors.neutral, current.brandColors.neutral),
                updatedAt: timestamp,
                source
            };
        }

        if (isObject(normalizedPatch.palette)) {
            const mergedColors = uniqueColors(normalizedPatch.palette.colors);
            next.palette = {
                ...current.palette,
                ...normalizedPatch.palette,
                baseColor: normalizeHex(normalizedPatch.palette.baseColor, current.palette.baseColor),
                colors: mergedColors.length ? mergedColors : current.palette.colors,
                updatedAt: timestamp,
                source
            };
        }

        if (isObject(normalizedPatch.typography)) {
            next.typography = {
                ...current.typography,
                ...normalizedPatch.typography,
                updatedAt: timestamp,
                source
            };
        }

        writeState(BRAND_KIT_KEY, next);
        return next;
    }

    function getColorPaletteState() {
        const fallback = {
            updatedAt: null,
            source: 'system',
            baseColor: '#3498db',
            type: 'monochromatic',
            title: 'Paleta base',
            description: 'Paleta padrao da marca.',
            colors: ['#3498db', '#1f2937', '#f59e0b']
        };
        const raw = readState(COLOR_PALETTE_STATE_KEY, fallback);
        return {
            ...fallback,
            ...raw,
            baseColor: normalizeHex(raw.baseColor, fallback.baseColor),
            colors: uniqueColors(raw.colors)
        };
    }

    function saveColorPaletteState(payload = {}, source = 'palette') {
        const current = getColorPaletteState();
        const patch = isObject(payload) ? payload : {};
        const timestamp = nowIso();
        const next = {
            ...current,
            ...patch,
            source,
            updatedAt: timestamp,
            baseColor: normalizeHex(patch.baseColor, current.baseColor),
            colors: uniqueColors(patch.colors).length ? uniqueColors(patch.colors) : current.colors
        };
        writeState(COLOR_PALETTE_STATE_KEY, next);
        return next;
    }

    function getFontProfileState() {
        const fallback = {
            updatedAt: null,
            source: 'system',
            tone: 'equilibrado',
            industry: 'geral',
            channel: 'digital',
            readability: 'alta',
            pairingStyle: 'modern-serif',
            primaryFontKey: 'montserrat',
            primaryFontName: 'Montserrat',
            secondaryFontKey: 'lora',
            secondaryFontName: 'Lora',
            notes: ''
        };
        const raw = readState(FONT_PROFILE_STATE_KEY, fallback);
        return {
            ...fallback,
            ...raw
        };
    }

    function saveFontProfileState(payload = {}, source = 'font-tool') {
        const current = getFontProfileState();
        const patch = isObject(payload) ? payload : {};
        const next = {
            ...current,
            ...patch,
            source,
            updatedAt: nowIso()
        };
        writeState(FONT_PROFILE_STATE_KEY, next);
        return next;
    }

    function getBrandInsightsState() {
        const fallback = {
            updatedAt: null,
            source: 'system',
            paletteType: 'monochromatic',
            summary: '',
            roles: {
                primary: '#3498db',
                secondary: '#1f2937',
                accent: '#f59e0b',
                neutralLight: '#f8fafc',
                neutralDark: '#111827'
            },
            colors: ['#3498db', '#1f2937', '#f59e0b', '#f8fafc', '#111827'],
            combinations: [],
            trends: [],
            contrast: [],
            recommendations: []
        };

        const raw = readState(BRAND_INSIGHTS_STATE_KEY, fallback);
        const next = {
            ...fallback,
            ...raw,
            paletteType: sanitizeText(raw.paletteType, 60, fallback.paletteType),
            summary: sanitizeText(raw.summary, 320, ''),
            roles: sanitizeInsightsRoles(raw.roles, fallback.roles),
            colors: uniqueColors(raw.colors).slice(0, 12),
            combinations: sanitizeInsightsList(raw.combinations, 16),
            trends: sanitizeInsightsList(raw.trends, 16),
            recommendations: sanitizeStringArray(raw.recommendations, 18, 220)
        };

        if (!next.colors.length) {
            next.colors = [...fallback.colors];
        }

        if (Array.isArray(raw.contrast)) {
            next.contrast = raw.contrast
                .map((item) => {
                    if (!isObject(item)) {
                        return null;
                    }
                    return {
                        color: normalizeHex(item.color, ''),
                        recommendedText: normalizeHex(item.recommendedText, ''),
                        ratio: sanitizeNumber(item.ratio, 0, 0, 30),
                        level: sanitizeText(item.level, 40, '')
                    };
                })
                .filter((item) => item && item.color)
                .slice(0, 18);
        } else {
            next.contrast = [];
        }

        return next;
    }

    function saveBrandInsightsState(payload = {}, source = 'insights') {
        const current = getBrandInsightsState();
        const patch = isObject(payload) ? payload : {};
        const timestamp = nowIso();
        const next = {
            ...current,
            ...patch,
            source,
            updatedAt: timestamp,
            paletteType: sanitizeText(patch.paletteType, 60, current.paletteType),
            summary: sanitizeText(patch.summary, 320, current.summary),
            roles: sanitizeInsightsRoles(patch.roles, current.roles),
            colors: uniqueColors(patch.colors).length ? uniqueColors(patch.colors).slice(0, 12) : current.colors,
            combinations: Array.isArray(patch.combinations) ? sanitizeInsightsList(patch.combinations, 16) : current.combinations,
            trends: Array.isArray(patch.trends) ? sanitizeInsightsList(patch.trends, 16) : current.trends,
            recommendations: Array.isArray(patch.recommendations)
                ? sanitizeStringArray(patch.recommendations, 18, 220)
                : current.recommendations
        };

        if (Array.isArray(patch.contrast)) {
            next.contrast = patch.contrast
                .map((item) => {
                    if (!isObject(item)) {
                        return null;
                    }
                    return {
                        color: normalizeHex(item.color, ''),
                        recommendedText: normalizeHex(item.recommendedText, ''),
                        ratio: sanitizeNumber(item.ratio, 0, 0, 30),
                        level: sanitizeText(item.level, 40, '')
                    };
                })
                .filter((item) => item && item.color)
                .slice(0, 18);
        }

        writeState(BRAND_INSIGHTS_STATE_KEY, next);
        return next;
    }

    function syncBrandInsights(payload = {}, source = 'insights') {
        const insights = saveBrandInsightsState(payload, source);
        const fallbackRoles = sanitizeInsightsRoles(insights.roles, {});
        const colors = uniqueColors([
            ...(Array.isArray(insights.colors) ? insights.colors : []),
            fallbackRoles.primary,
            fallbackRoles.secondary,
            fallbackRoles.accent,
            fallbackRoles.neutralLight,
            fallbackRoles.neutralDark
        ]).slice(0, 12);

        saveBrandKit({
            brandColors: {
                primary: fallbackRoles.primary,
                secondary: fallbackRoles.secondary,
                accent: fallbackRoles.accent,
                neutral: fallbackRoles.neutralDark
            },
            palette: {
                baseColor: fallbackRoles.primary,
                type: insights.paletteType || 'monochromatic',
                title: 'Paleta consolidada com insights',
                description: insights.summary || 'Paleta consolidada a partir de combinacoes e tendencias.',
                colors
            }
        }, source);

        return insights;
    }

    function getOgProfileState() {
        const fallback = {
            updatedAt: null,
            source: 'system',
            available: false,
            title: '',
            description: '',
            brand: '',
            template: '',
            url: '',
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            imageOpacity: 0.8,
            overlayOpacity: 0.5
        };

        const raw = readState(OG_PROFILE_STATE_KEY, fallback);
        return {
            ...fallback,
            ...raw,
            available: Boolean(raw.available),
            title: sanitizeText(raw.title, 180, ''),
            description: sanitizeText(raw.description, 500, ''),
            brand: sanitizeText(raw.brand, 160, ''),
            template: sanitizeText(raw.template, 80, ''),
            url: sanitizeText(raw.url, 280, ''),
            primaryColor: normalizeHex(raw.primaryColor, fallback.primaryColor),
            secondaryColor: normalizeHex(raw.secondaryColor, fallback.secondaryColor),
            imageOpacity: sanitizeNumber(raw.imageOpacity, fallback.imageOpacity, 0, 1),
            overlayOpacity: sanitizeNumber(raw.overlayOpacity, fallback.overlayOpacity, 0, 1)
        };
    }

    function saveOgProfileState(payload = {}, source = 'ocimage') {
        const current = getOgProfileState();
        const patch = isObject(payload) ? payload : {};
        const next = {
            ...current,
            ...patch,
            source,
            updatedAt: nowIso(),
            available: Boolean(
                typeof patch.available === 'boolean'
                    ? patch.available
                    : current.available
            ),
            title: sanitizeText(
                Object.prototype.hasOwnProperty.call(patch, 'title') ? patch.title : current.title,
                180,
                ''
            ),
            description: sanitizeText(
                Object.prototype.hasOwnProperty.call(patch, 'description') ? patch.description : current.description,
                500,
                ''
            ),
            brand: sanitizeText(
                Object.prototype.hasOwnProperty.call(patch, 'brand') ? patch.brand : current.brand,
                160,
                ''
            ),
            template: sanitizeText(
                Object.prototype.hasOwnProperty.call(patch, 'template') ? patch.template : current.template,
                80,
                ''
            ),
            url: sanitizeText(
                Object.prototype.hasOwnProperty.call(patch, 'url') ? patch.url : current.url,
                280,
                ''
            ),
            primaryColor: normalizeHex(
                Object.prototype.hasOwnProperty.call(patch, 'primaryColor') ? patch.primaryColor : current.primaryColor,
                current.primaryColor
            ),
            secondaryColor: normalizeHex(
                Object.prototype.hasOwnProperty.call(patch, 'secondaryColor') ? patch.secondaryColor : current.secondaryColor,
                current.secondaryColor
            ),
            imageOpacity: sanitizeNumber(
                Object.prototype.hasOwnProperty.call(patch, 'imageOpacity') ? patch.imageOpacity : current.imageOpacity,
                current.imageOpacity,
                0,
                1
            ),
            overlayOpacity: sanitizeNumber(
                Object.prototype.hasOwnProperty.call(patch, 'overlayOpacity') ? patch.overlayOpacity : current.overlayOpacity,
                current.overlayOpacity,
                0,
                1
            )
        };

        writeState(OG_PROFILE_STATE_KEY, next);
        return next;
    }

    function getBgRemoveState() {
        return sanitizeBgRemoveState(readState(BGREMOVE_STATE_KEY, {}));
    }

    function saveBgRemoveState(payload = {}, source = 'bgremove') {
        const current = getBgRemoveState();
        const patch = isObject(payload) ? payload : {};
        const next = sanitizeBgRemoveState({
            ...current,
            ...patch,
            source,
            updatedAt: nowIso(),
            input: {
                ...(isObject(current.input) ? current.input : {}),
                ...(isObject(patch.input) ? patch.input : {})
            },
            settings: {
                ...(isObject(current.settings) ? current.settings : {}),
                ...(isObject(patch.settings) ? patch.settings : {})
            },
            output: {
                ...(isObject(current.output) ? current.output : {}),
                ...(isObject(patch.output) ? patch.output : {})
            },
            meta: isObject(patch.meta)
                ? patch.meta
                : (isObject(current.meta) ? current.meta : {})
        });

        writeState(BGREMOVE_STATE_KEY, next);
        return next;
    }

    function syncColorPalette(payload = {}, source = 'palette') {
        const palette = saveColorPaletteState(payload, source);
        const colors = uniqueColors(palette.colors);
        const primary = normalizeHex(colors[0] || palette.baseColor || '#3498db', '#3498db');
        const secondary = normalizeHex(colors[1] || '#1f2937', '#1f2937');
        const accent = normalizeHex(colors[2] || '#f59e0b', '#f59e0b');
        const neutral = normalizeHex(colors[3] || '#111827', '#111827');
        return saveBrandKit({
            brandColors: { primary, secondary, accent, neutral },
            palette: {
                baseColor: palette.baseColor,
                type: palette.type,
                title: palette.title,
                description: palette.description,
                colors
            }
        }, source);
    }

    function syncTypography(payload = {}, source = 'font-tool') {
        const profile = saveFontProfileState(payload, source);
        return saveBrandKit({
            typography: {
                primaryFontKey: profile.primaryFontKey,
                primaryFontName: profile.primaryFontName,
                secondaryFontKey: profile.secondaryFontKey,
                secondaryFontName: profile.secondaryFontName,
                pairingStyle: profile.pairingStyle,
                tone: profile.tone,
                notes: profile.notes || ''
            }
        }, source);
    }

    function getIntegrationSnapshot() {
        return {
            brandKit: getBrandKit(),
            colorPalette: getColorPaletteState(),
            fontProfile: getFontProfileState(),
            brandInsights: getBrandInsightsState(),
            ogProfile: getOgProfileState(),
            bgremove: getBgRemoveState()
        };
    }

    function onStorageChange(callback) {
        if (typeof callback !== 'function') {
            return () => {};
        }
        const handler = (event) => {
            if (!event || !event.key) {
                return;
            }
            if (
                [
                    BRAND_KIT_KEY,
                    COLOR_PALETTE_STATE_KEY,
                    FONT_PROFILE_STATE_KEY,
                    BRAND_INSIGHTS_STATE_KEY,
                    OG_PROFILE_STATE_KEY,
                    BGREMOVE_STATE_KEY
                ].includes(event.key)
            ) {
                callback(getIntegrationSnapshot(), event);
            }
        };
        global.addEventListener('storage', handler);
        return () => global.removeEventListener('storage', handler);
    }

    global.AQBrandKit = {
        keys: {
            BRAND_KIT_KEY,
            COLOR_PALETTE_STATE_KEY,
            FONT_PROFILE_STATE_KEY,
            BRAND_INSIGHTS_STATE_KEY,
            OG_PROFILE_STATE_KEY,
            BGREMOVE_STATE_KEY
        },
        getBrandKit,
        saveBrandKit,
        getColorPaletteState,
        saveColorPaletteState,
        getFontProfileState,
        saveFontProfileState,
        getBrandInsightsState,
        saveBrandInsightsState,
        syncBrandInsights,
        getOgProfileState,
        saveOgProfileState,
        getBgRemoveState,
        saveBgRemoveState,
        syncColorPalette,
        syncTypography,
        getIntegrationSnapshot,
        normalizeHex,
        uniqueColors,
        onStorageChange
    };
}(window));
