(function initAQBrandKit(global) {
    if (!global || global.AQBrandKit) {
        return;
    }

    const BRAND_KIT_KEY = 'aq_brand_kit_v1';
    const COLOR_PALETTE_STATE_KEY = 'aq_color_palette_state_v1';
    const FONT_PROFILE_STATE_KEY = 'aq_font_profile_state_v1';

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
            fontProfile: getFontProfileState()
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
            if ([BRAND_KIT_KEY, COLOR_PALETTE_STATE_KEY, FONT_PROFILE_STATE_KEY].includes(event.key)) {
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
            FONT_PROFILE_STATE_KEY
        },
        getBrandKit,
        saveBrandKit,
        getColorPaletteState,
        saveColorPaletteState,
        getFontProfileState,
        saveFontProfileState,
        syncColorPalette,
        syncTypography,
        getIntegrationSnapshot,
        normalizeHex,
        uniqueColors,
        onStorageChange
    };
}(window));
