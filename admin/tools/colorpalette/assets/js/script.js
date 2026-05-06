class ColorPaletteGenerator {
    constructor() {
        // Elementos básicos da paleta
        this.baseColor = '#3498db';
        this.currentPaletteType = 'monochromatic';
        this.currentColors = [];
        this.allowedPaletteTypes = new Set([
            'monochromatic',
            'analogous',
            'complementary',
            'triadic',
            'tetradic',
            'splitComplementary'
        ]);
        
        // Elementos de upload e preview de imagem
        this.imageUpload = document.getElementById('imageUpload');
        this.fileName = document.getElementById('fileName');
        this.previewImage = document.getElementById('previewImage');
        this.uploadPlaceholder = document.getElementById('uploadPlaceholder');
        this.imagePreview = document.getElementById('imagePreview');
        
        // Elementos do color picker
        this.colorPickerTool = document.getElementById('colorPickerTool');
        this.colorPickerCrosshair = document.getElementById('colorPickerCrosshair');
        this.pickedColorPreview = document.getElementById('pickedColorPreview');
        this.pickedColorHex = document.getElementById('pickedColorHex');
        this.activateColorPicker = document.getElementById('activateColorPicker');
        
        // Elementos para cores extraídas
        this.detectDominantColors = document.getElementById('detectDominantColors');
        this.extractedColorsList = document.getElementById('extractedColorsList');
        this.applyBrandColorsButton = document.getElementById('applyBrandColors');
        this.brandSyncStatus = document.getElementById('brandSyncStatus');
        this.exportCssTokensButton = document.getElementById('exportCssTokens');
        this.roleSuggestions = document.getElementById('roleSuggestions');
        this.contrastAudit = document.getElementById('contrastAudit');
        this.combinationSuggestions = document.getElementById('combinationSuggestions');
        this.trendSuggestions = document.getElementById('trendSuggestions');
        this.insightSummary = document.getElementById('insightSummary');
        this.colorWheelCanvas = document.getElementById('colorWheelCanvas');
        this.wheelHarmonyRuleSelect = document.getElementById('wheelHarmonyRule');
        this.harmonySpreadInput = document.getElementById('harmonySpread');
        this.harmonySpreadValue = document.getElementById('harmonySpreadValue');
        this.applyHarmonyRuleButton = document.getElementById('applyHarmonyRule');
        this.wheelRotationInput = document.getElementById('wheelRotation');
        this.wheelRotationValue = document.getElementById('wheelRotationValue');
        this.applyWheelRotationButton = document.getElementById('applyWheelRotation');
        this.wheelBaseLightnessInput = document.getElementById('wheelBaseLightness');
        this.wheelBaseLightnessValue = document.getElementById('wheelBaseLightnessValue');
        this.wheelRotateLeftButton = document.getElementById('wheelRotateLeft');
        this.wheelRotateRightButton = document.getElementById('wheelRotateRight');
        this.wheelRandomizeHarmonyButton = document.getElementById('wheelRandomizeHarmony');
        this.wheelDynamicsProfileSelect = document.getElementById('wheelDynamicsProfile');
        this.wheelDynamicsIntensityInput = document.getElementById('wheelDynamicsIntensity');
        this.wheelDynamicsIntensityValue = document.getElementById('wheelDynamicsIntensityValue');
        this.applyDynamicsProfileButton = document.getElementById('applyDynamicsProfile');
        this.wheelPointerInfo = document.getElementById('wheelPointerInfo');
        this.gradientStartSelect = document.getElementById('gradientStart');
        this.gradientEndSelect = document.getElementById('gradientEnd');
        this.gradientAngleInput = document.getElementById('gradientAngle');
        this.gradientAngleValue = document.getElementById('gradientAngleValue');
        this.gradientPreview = document.getElementById('gradientPreview');
        this.gradientCssCode = document.getElementById('gradientCssCode');
        this.copyGradientCssButton = document.getElementById('copyGradientCss');
        this.colorVisionModeSelect = document.getElementById('colorVisionMode');
        this.colorVisionSeverityInput = document.getElementById('colorVisionSeverity');
        this.colorVisionSeverityValue = document.getElementById('colorVisionSeverityValue');
        this.lockPrimaryColorInput = document.getElementById('lockPrimaryColor');
        this.visionSwatches = document.getElementById('visionSwatches');
        this.visionConflicts = document.getElementById('visionConflicts');
        this.autoFixConflictsButton = document.getElementById('autoFixConflicts');
        this.conflictSuggestions = document.getElementById('conflictSuggestions');
        this.themeNameInput = document.getElementById('themeNameInput');
        this.themeTagsInput = document.getElementById('themeTagsInput');
        this.saveThemeButton = document.getElementById('saveThemeButton');
        this.savedThemesList = document.getElementById('savedThemesList');
        this.sectorPresetSelect = document.getElementById('sectorPresetSelect');
        this.applySectorPresetButton = document.getElementById('applySectorPreset');
        this.sectorPresetHint = document.getElementById('sectorPresetHint');
        this.workflowSummary = document.getElementById('workflowSummary');
        this.workflowSteps = document.getElementById('workflowSteps');
        this.workflowPrimaryAction = document.getElementById('workflowPrimaryAction');
        this.workflowSecondaryAction = document.getElementById('workflowSecondaryAction');
        this.savedThemesStorageKey = 'aq_color_palette_saved_themes_v1';
        this.latestConflictSuggestions = [];
        this.activeSectorProfile = null;
        this.didManualSync = false;
        this.isWheelDragging = false;
        this.pendingWheelPointer = null;
        this.wheelPointerRaf = null;
        this.pendingWheelHarmonyPointer = null;
        this.wheelHarmonyRaf = null;
        this.lastWheelGeometry = null;
        this.wheelGuidePoints = [];
        this.lastHarmonyControlPoints = [];
        this.wheelDragMode = null;
        this.activeHarmonyControl = null;
        this.lastWheelInteractionAt = 0;
        this.lastWheelHarmonyInteractionAt = 0;
        this.wheelDragDirty = false;
        this.wheelHarmonyDragDirty = false;
        
        // Canvas para processamento de imagem
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.isPickingColor = false;
        
        this.init();
    }

    init() {
        this.hydrateFromBrandKit();
        this.setupEventListeners();
        this.renderSavedThemes();
        this.syncHarmonyControlsWithPaletteType(true);
        this.updateSectorPresetHint();
        if (this.harmonySpreadInput && this.harmonySpreadValue) {
            this.harmonySpreadValue.textContent = `${this.harmonySpreadInput.value}deg`;
        }
        if (this.wheelRotationInput && this.wheelRotationValue) {
            this.wheelRotationValue.textContent = `${this.wheelRotationInput.value}deg`;
        }
        this.syncWheelLightnessWithBase();
        if (this.wheelDynamicsIntensityInput && this.wheelDynamicsIntensityValue) {
            this.wheelDynamicsIntensityValue.textContent = `${this.wheelDynamicsIntensityInput.value}%`;
        }
        if (this.gradientAngleInput && this.gradientAngleValue) {
            this.gradientAngleValue.textContent = `${this.gradientAngleInput.value}deg`;
        }
        if (this.colorVisionSeverityInput && this.colorVisionSeverityValue) {
            this.colorVisionSeverityValue.textContent = `${this.colorVisionSeverityInput.value}%`;
        }
        this.generatePalette();
        this.updateBrandSyncStatus('Paleta pronta para sincronização com o Brand Kit.');
        this.renderWorkflowAssistant();
    }

    setupEventListeners() {
        const baseColorInput = document.getElementById('baseColor');
        const hexInput = document.getElementById('hexInput');
        const paletteButtons = document.querySelectorAll('.palette-btn');
        const randomButton = document.getElementById('randomColor');
        const exportButton = document.getElementById('exportPalette');

        // Eventos para a paleta de cores básica
        baseColorInput.addEventListener('input', (e) => {
            this.baseColor = e.target.value;
            hexInput.value = this.baseColor;
            this.generatePalette();
        });

        hexInput.addEventListener('input', (e) => {
            const hex = e.target.value;
            if (this.isValidHex(hex)) {
                this.baseColor = hex;
                baseColorInput.value = hex;
                this.generatePalette();
            }
        });

        paletteButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                paletteButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPaletteType = btn.dataset.type;
                this.syncHarmonyControlsWithPaletteType(true);
                this.generatePalette();
            });
        });

        randomButton.addEventListener('click', () => {
            this.generateRandomColor();
        });

        exportButton.addEventListener('click', () => {
            this.exportPalette();
        });

        if (this.exportCssTokensButton) {
            this.exportCssTokensButton.addEventListener('click', () => {
                this.exportCssTokens();
            });
        }

        if (this.applyBrandColorsButton) {
            this.applyBrandColorsButton.addEventListener('click', () => {
                this.applyCurrentPaletteToBrandKit();
            });
        }

        // Eventos para upload de imagem
        this.imageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.fileName.textContent = file.name;
                this.loadImage(file);
            }
        });

        // Eventos para o color picker
        this.activateColorPicker.addEventListener('click', () => {
            this.toggleColorPicker();
        });

        this.imagePreview.addEventListener('mousemove', (e) => {
            if (this.isPickingColor && this.isPreviewImageVisible()) {
                this.updateColorPickerPosition(e);
            }
        });

        this.imagePreview.addEventListener('click', (e) => {
            if (this.isPickingColor && this.isPreviewImageVisible()) {
                this.pickColor(e);
            }
        });

        // Evento para detectar cores dominantes
        this.detectDominantColors.addEventListener('click', () => {
            if (this.isPreviewImageVisible()) {
                this.findDominantColors();
            } else {
                this.showNotification('Faça upload de uma imagem primeiro!');
            }
        });

        // Adicionar evento para arrastar e soltar imagens
        this.imagePreview.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.imagePreview.classList.add('drag-over');
        });

        this.imagePreview.addEventListener('dragleave', () => {
            this.imagePreview.classList.remove('drag-over');
        });

        this.imagePreview.addEventListener('drop', (e) => {
            e.preventDefault();
            this.imagePreview.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.imageUpload.files = e.dataTransfer.files;
                this.fileName.textContent = file.name;
                this.loadImage(file);
            }
        });

        if (this.wheelRotationInput && this.wheelRotationValue) {
            this.wheelRotationInput.addEventListener('input', () => {
                this.wheelRotationValue.textContent = `${this.wheelRotationInput.value}deg`;
            });
        }

        if (this.wheelHarmonyRuleSelect) {
            this.wheelHarmonyRuleSelect.addEventListener('change', () => {
                this.syncHarmonyControlsWithPaletteType(true, true);
                this.drawColorWheel(this.currentColors);
            });
        }

        if (this.harmonySpreadInput && this.harmonySpreadValue) {
            this.harmonySpreadInput.addEventListener('input', () => {
                this.harmonySpreadValue.textContent = `${this.harmonySpreadInput.value}deg`;
                this.drawColorWheel(this.currentColors);
            });
        }

        if (this.wheelBaseLightnessInput && this.wheelBaseLightnessValue) {
            this.wheelBaseLightnessInput.addEventListener('input', () => {
                this.wheelBaseLightnessValue.textContent = `${this.wheelBaseLightnessInput.value}%`;
                this.applyWheelLightness();
            });
        }

        if (this.applyHarmonyRuleButton) {
            this.applyHarmonyRuleButton.addEventListener('click', () => {
                this.applyHarmonyRule();
            });
        }

        if (this.sectorPresetSelect) {
            this.sectorPresetSelect.addEventListener('change', () => {
                const sectorKey = this.normalizeSectorPresetKey(this.sectorPresetSelect.value);
                if (sectorKey === 'none') {
                    this.activeSectorProfile = null;
                    this.updateSectorPresetHint();
                    const roleMap = this.buildRoleMap(this.currentColors);
                    this.renderTrendAndCombinationInsights(roleMap, this.currentColors);
                    this.renderWorkflowAssistant();
                    return;
                }
                const preset = this.getSectorPresetCatalog()[sectorKey];
                this.updateSectorPresetHint({
                    key: sectorKey,
                    label: preset?.label || 'Preset setorial',
                    description: preset?.description || ''
                });
                this.renderWorkflowAssistant();
            });
        }

        if (this.applySectorPresetButton) {
            this.applySectorPresetButton.addEventListener('click', () => {
                this.applySectorPreset();
            });
        }

        if (this.workflowPrimaryAction) {
            this.workflowPrimaryAction.addEventListener('click', () => {
                this.handleWorkflowPrimaryAction();
            });
        }

        if (this.workflowSecondaryAction) {
            this.workflowSecondaryAction.addEventListener('click', () => {
                this.openBrandBook();
            });
        }

        if (this.applyWheelRotationButton) {
            this.applyWheelRotationButton.addEventListener('click', () => {
                this.applyWheelRotation();
            });
        }

        if (this.wheelRotateLeftButton) {
            this.wheelRotateLeftButton.addEventListener('click', () => {
                this.rotateBaseHue(-15);
            });
        }

        if (this.wheelRotateRightButton) {
            this.wheelRotateRightButton.addEventListener('click', () => {
                this.rotateBaseHue(15);
            });
        }

        if (this.wheelRandomizeHarmonyButton) {
            this.wheelRandomizeHarmonyButton.addEventListener('click', () => {
                this.randomizeHarmonyDirection();
            });
        }

        if (this.wheelDynamicsIntensityInput && this.wheelDynamicsIntensityValue) {
            this.wheelDynamicsIntensityInput.addEventListener('input', () => {
                this.wheelDynamicsIntensityValue.textContent = `${this.wheelDynamicsIntensityInput.value}%`;
                this.drawColorWheel(this.currentColors);
            });
        }

        if (this.applyDynamicsProfileButton) {
            this.applyDynamicsProfileButton.addEventListener('click', () => {
                this.applyCurrentDynamicsProfile();
            });
        }

        if (this.wheelDynamicsProfileSelect) {
            this.wheelDynamicsProfileSelect.addEventListener('change', () => {
                this.drawColorWheel(this.currentColors);
            });
        }

        if (this.gradientAngleInput && this.gradientAngleValue) {
            this.gradientAngleInput.addEventListener('input', () => {
                this.gradientAngleValue.textContent = `${this.gradientAngleInput.value}deg`;
                this.renderGradientPreview();
            });
        }

        if (this.gradientStartSelect) {
            this.gradientStartSelect.addEventListener('change', () => {
                this.renderGradientPreview();
            });
        }

        if (this.gradientEndSelect) {
            this.gradientEndSelect.addEventListener('change', () => {
                this.renderGradientPreview();
            });
        }

        if (this.copyGradientCssButton) {
            this.copyGradientCssButton.addEventListener('click', () => {
                this.copyGradientCss();
            });
        }

        if (this.colorVisionModeSelect) {
            this.colorVisionModeSelect.addEventListener('change', () => {
                this.renderAccessibilityTools(this.currentColors);
            });
        }

        if (this.colorVisionSeverityInput && this.colorVisionSeverityValue) {
            this.colorVisionSeverityInput.addEventListener('input', () => {
                this.colorVisionSeverityValue.textContent = `${this.colorVisionSeverityInput.value}%`;
                this.renderAccessibilityTools(this.currentColors);
                this.drawColorWheel(this.currentColors);
            });
        }

        if (this.lockPrimaryColorInput) {
            this.lockPrimaryColorInput.addEventListener('change', () => {
                this.renderAccessibilityTools(this.currentColors);
                this.drawColorWheel(this.currentColors);
            });
        }

        if (this.autoFixConflictsButton) {
            this.autoFixConflictsButton.addEventListener('click', () => {
                this.autoFixAccessibilityConflicts();
            });
        }

        if (this.saveThemeButton) {
            this.saveThemeButton.addEventListener('click', () => {
                this.saveCurrentTheme();
            });
        }

        if (this.conflictSuggestions) {
            this.conflictSuggestions.addEventListener('click', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLElement)) {
                    return;
                }
                const button = target.closest('[data-conflict-apply]');
                if (button instanceof HTMLElement) {
                    const rawIndex = Number.parseInt(button.dataset.conflictApply || '', 10);
                    if (Number.isFinite(rawIndex)) {
                        this.applyConflictSuggestion(rawIndex);
                    }
                }
            });
        }

        if (this.savedThemesList) {
            this.savedThemesList.addEventListener('click', (event) => {
                const target = event.target;
                if (!(target instanceof HTMLElement)) {
                    return;
                }

                const loadButton = target.closest('[data-theme-load]');
                if (loadButton instanceof HTMLElement) {
                    this.applySavedTheme(loadButton.dataset.themeLoad || '');
                    return;
                }

                const deleteButton = target.closest('[data-theme-delete]');
                if (deleteButton instanceof HTMLElement) {
                    this.deleteSavedTheme(deleteButton.dataset.themeDelete || '');
                }
            });
        }

        this.setupWheelCanvasInteractions();
    }

    isValidHex(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }

    getWorkflowState() {
        const colors = this.uniqueHexColors(this.currentColors).slice(0, 10);
        const harmony = this.getHarmonyProfile();
        const sectorProfile = this.getSectorProfile();
        const hasSector = Boolean(sectorProfile?.key && sectorProfile.key !== 'none');
        const hasDirection = colors.length >= 5;
        const hasStrategy = hasSector || harmony.rule !== 'monochromatic';

        const mode = this.getAccessibilityMode();
        const severity = this.getAccessibilitySeverity();
        const accessibilityData = this.getAccessibilityConflictData(colors, mode, severity);
        const conflictCount = accessibilityData.conflicts.length;
        const accessibilityDone = mode !== 'normal' && conflictCount === 0;

        const savedThemesCount = this.getSavedThemes().length;
        const libraryDone = savedThemesCount > 0;
        const syncDone = this.didManualSync === true;

        const steps = [
            {
                key: 'palette',
                title: '1. Base',
                detail: hasDirection
                    ? `${colors.length} cores prontas para uso.`
                    : 'Defina cor base e gere a paleta.',
                done: hasDirection
            },
            {
                key: 'strategy',
                title: '2. Direção',
                detail: hasStrategy
                    ? (hasSector ? `Preset: ${sectorProfile.label}.` : `Harmonia: ${harmony.label}.`)
                    : 'Escolha preset setorial ou harmonia.',
                done: hasStrategy
            },
            {
                key: 'accessibility',
                title: '3. Acessibilidade',
                detail: accessibilityDone
                    ? `Sem conflitos em ${mode}.`
                    : (mode === 'normal'
                        ? 'Ative um modo de visão para validar.'
                        : `${conflictCount} conflito(s) para ajustar.`),
                done: accessibilityDone
            },
            {
                key: 'library',
                title: '4. Biblioteca',
                detail: libraryDone
                    ? `${savedThemesCount} tema(s) salvo(s).`
                    : 'Salve ao menos 1 tema reutilizavel.',
                done: libraryDone
            },
            {
                key: 'sync',
                title: '5. Ecossistema',
                detail: syncDone
                    ? 'Sincronizado com Brand Kit.'
                    : 'Aplicar cores da marca e revisar BrandBook.',
                done: syncDone
            }
        ];

        const nextStep = steps.find((step) => !step.done) || null;
        const completed = steps.filter((step) => step.done).length;
        return {
            steps,
            nextStep,
            completed,
            total: steps.length,
            mode,
            conflictCount
        };
    }

    renderWorkflowAssistant() {
        if (!this.workflowSteps || !this.workflowSummary) {
            return;
        }

        const state = this.getWorkflowState();
        const activeKey = state.nextStep?.key || '';

        this.workflowSteps.innerHTML = state.steps.map((step) => {
            const classList = [
                'workflow-step',
                step.done ? 'is-done' : '',
                !step.done && step.key === activeKey ? 'is-active' : ''
            ].filter(Boolean).join(' ');
            const statusText = step.done ? 'Concluida' : (step.key === activeKey ? 'Proximo passo' : 'Pendente');
            return `
                <article class="${classList}">
                    <strong>${this.escapeHtml(step.title)}</strong>
                    <span>${this.escapeHtml(step.detail)}</span>
                    <em>${statusText}</em>
                </article>
            `;
        }).join('');

        if (!state.nextStep) {
            this.workflowSummary.textContent = 'Fluxo concluído. Paleta pronta para publicação e documentação no BrandBook.';
        } else {
            this.workflowSummary.textContent = `Fluxo ${state.completed}/${state.total}. Proximo passo: ${state.nextStep.title}.`;
        }

        if (this.workflowPrimaryAction) {
            const labelMap = {
                palette: 'Gerar paleta',
                strategy: 'Definir direção',
                accessibility: 'Validar acessibilidade',
                library: 'Salvar tema',
                sync: 'Sincronizar marca'
            };
            this.workflowPrimaryAction.textContent = state.nextStep
                ? (labelMap[state.nextStep.key] || 'Executar próximo passo')
                : 'Fluxo concluído';
            this.workflowPrimaryAction.disabled = !state.nextStep;
        }
    }

    handleWorkflowPrimaryAction() {
        const state = this.getWorkflowState();
        if (!state.nextStep) {
            this.showNotification('Fluxo concluído. Abra o BrandBook para revisar o resultado.');
            return;
        }

        switch (state.nextStep.key) {
            case 'palette':
                this.generatePalette();
                this.showNotification('Paleta gerada com sucesso.');
                break;
            case 'strategy':
                if (this.sectorPresetSelect && this.normalizeSectorPresetKey(this.sectorPresetSelect.value) === 'none') {
                    this.sectorPresetSelect.value = 'saas';
                    this.applySectorPreset();
                } else {
                    this.applyHarmonyRule();
                }
                break;
            case 'accessibility':
                if (state.mode === 'normal' && this.colorVisionModeSelect) {
                    this.colorVisionModeSelect.value = 'deuteranopia';
                    this.renderAccessibilityTools(this.currentColors);
                    this.drawColorWheel(this.currentColors);
                    this.showNotification('Modo de visão ativado. Revise os conflitos e aplique ajustes.');
                } else {
                    this.autoFixAccessibilityConflicts();
                }
                break;
            case 'library':
                this.saveCurrentTheme();
                break;
            case 'sync':
                this.applyCurrentPaletteToBrandKit();
                break;
            default:
                break;
        }
    }

    openBrandBook() {
        window.location.href = '../brandbook/';
    }

    normalizeSectorPresetKey(value) {
        const raw = String(value || '').trim();
        if (raw === 'none') {
            return 'none';
        }
        const catalog = this.getSectorPresetCatalog();
        return Object.prototype.hasOwnProperty.call(catalog, raw) ? raw : 'none';
    }

    getSectorPresetCatalog() {
        return {
            saas: {
                label: 'SaaS e Produtos Digitais',
                rule: 'analogous',
                spread: 28,
                adjustments: { hue: -10, saturation: 8, lightness: -4 },
                description: 'Direção clean com confiança visual, ideal para dashboards e produto digital.'
            },
            ecommerce: {
                label: 'E-commerce e Varejo',
                rule: 'complementary',
                spread: 54,
                adjustments: { hue: 6, saturation: 12, lightness: 0 },
                description: 'Contraste forte para destaque de oferta, preço e botões de conversão.'
            },
            health: {
                label: 'Saúde e Bem-estar',
                rule: 'analogous',
                spread: 24,
                adjustments: { hue: 20, saturation: -8, lightness: 6 },
                description: 'Atmosfera calma com foco em confiança e leitura confortável.'
            },
            education: {
                label: 'Educação e Cursos',
                rule: 'triadic',
                spread: 30,
                adjustments: { hue: -4, saturation: 2, lightness: 4 },
                description: 'Diversidade de tons para trilhas, módulos e destaque pedagógico.'
            },
            finance: {
                label: 'Financas e Seguros',
                rule: 'splitComplementary',
                spread: 34,
                adjustments: { hue: -16, saturation: -4, lightness: -6 },
                description: 'Paleta de confiança com acentos de ação controlados para performance.'
            },
            fashion: {
                label: 'Moda e Lifestyle',
                rule: 'tetradic',
                spread: 26,
                adjustments: { hue: 12, saturation: 10, lightness: -2 },
                description: 'Expressão premium com variação cromática para campanhas e editoriais.'
            }
        };
    }

    tuneColorByPreset(hex, adjustments = {}) {
        const safeHex = this.normalizeHex(hex) || '#3498db';
        const [h, s, l] = this.hexToHsl(safeHex);
        const nextHue = h + Number(adjustments.hue || 0);
        const nextSat = Math.max(16, Math.min(92, s + Number(adjustments.saturation || 0)));
        const nextLight = Math.max(10, Math.min(90, l + Number(adjustments.lightness || 0)));
        return this.hslToHex(nextHue, nextSat, nextLight);
    }

    buildSectorProfile(key, overrides = {}) {
        const safeKey = this.normalizeSectorPresetKey(key);
        if (safeKey === 'none') {
            return null;
        }
        const preset = this.getSectorPresetCatalog()[safeKey];
        if (!preset) {
            return null;
        }
        return {
            key: safeKey,
            label: preset.label,
            rule: this.normalizeHarmonyRule(overrides.rule || preset.rule),
            spread: Math.max(12, Math.min(120, Number.isFinite(overrides.spread) ? overrides.spread : preset.spread)),
            description: preset.description,
            appliedAt: new Date().toISOString()
        };
    }

    getSectorProfile() {
        if (!this.activeSectorProfile || !this.activeSectorProfile.key) {
            return null;
        }
        const catalog = this.getSectorPresetCatalog();
        if (!Object.prototype.hasOwnProperty.call(catalog, this.activeSectorProfile.key)) {
            return null;
        }
        const rule = this.normalizeHarmonyRule(this.currentPaletteType || this.activeSectorProfile.rule);
        const spread = this.getHarmonySpread();
        return {
            ...this.activeSectorProfile,
            rule,
            spread: Math.max(12, Math.min(120, spread))
        };
    }

    getActiveSectorPresetConfig() {
        const profile = this.getSectorProfile();
        if (!profile) {
            return null;
        }
        const preset = this.getSectorPresetCatalog()[profile.key];
        return preset || null;
    }

    updateSectorPresetHint(profile = this.getSectorProfile()) {
        if (!this.sectorPresetHint) {
            return;
        }
        if (!profile || !profile.key) {
            this.sectorPresetHint.textContent = 'Selecione um preset para gerar harmonia, combinações e tendências alinhadas ao setor.';
            return;
        }
        this.sectorPresetHint.textContent = `${profile.label}: ${profile.description}`;
    }

    applySectorPreset() {
        const selectedKey = this.normalizeSectorPresetKey(this.sectorPresetSelect?.value || 'none');
        if (selectedKey === 'none') {
            this.activeSectorProfile = null;
            this.updateSectorPresetHint();
            const roleMap = this.buildRoleMap(this.currentColors);
            this.renderTrendAndCombinationInsights(roleMap, this.currentColors);
            this.renderWorkflowAssistant();
            this.showNotification('Preset setorial desativado.');
            return;
        }

        const preset = this.getSectorPresetCatalog()[selectedKey];
        if (!preset) {
            this.renderWorkflowAssistant();
            this.showNotification('Preset setorial inválido.');
            return;
        }

        const tunedBase = this.tuneColorByPreset(this.baseColor, preset.adjustments || {});
        this.baseColor = tunedBase;
        const baseInput = document.getElementById('baseColor');
        const hexInput = document.getElementById('hexInput');
        if (baseInput) {
            baseInput.value = tunedBase;
        }
        if (hexInput) {
            hexInput.value = tunedBase;
        }

        this.currentPaletteType = this.normalizeHarmonyRule(preset.rule);
        document.querySelectorAll('.palette-btn').forEach((button) => {
            button.classList.toggle('active', button.dataset.type === this.currentPaletteType);
        });
        if (this.wheelHarmonyRuleSelect) {
            this.wheelHarmonyRuleSelect.value = this.currentPaletteType;
        }
        if (this.harmonySpreadInput) {
            this.harmonySpreadInput.value = String(Math.max(12, Math.min(120, Number(preset.spread) || 30)));
        }
        this.syncHarmonyControlsWithPaletteType(true, true);

        this.activeSectorProfile = this.buildSectorProfile(selectedKey, {
            rule: this.currentPaletteType,
            spread: this.getHarmonySpread()
        });
        this.updateSectorPresetHint(this.activeSectorProfile);

        const colors = this.generateHarmonyPalette(this.currentPaletteType, this.getHarmonySpread());
        const title = `Preset ${preset.label}`;
        const description = `${preset.description} Regra ${this.getHarmonyProfile().label} com abertura de ${this.getHarmonySpread()}deg.`;
        this.applyPaletteRendering(colors, title, description, `Preset setorial ${preset.label} aplicado e sincronizado.`);
        this.showNotification(`Preset ${preset.label} aplicado com sucesso.`);
    }

    buildSectorCombinationSuggestions(sectorKey, roleMap) {
        switch (sectorKey) {
            case 'saas':
                return [
                    {
                        label: 'Arquitetura SaaS',
                        value: `${roleMap.primary.toUpperCase()} em navegação e ${roleMap.accent.toUpperCase()} para CTAs`,
                        detail: 'Mantenha fundo limpo e use cor de ação somente em eventos de conversão.'
                    },
                    {
                        label: 'Leitura de dashboard',
                        value: `${roleMap.neutralLight.toUpperCase()} com cards ${roleMap.secondary.toUpperCase()}`,
                        detail: 'Melhora escaneabilidade de metricas e reduz fadiga em uso continuo.'
                    }
                ];
            case 'ecommerce':
                return [
                    {
                        label: 'Hierarquia de compra',
                        value: `${roleMap.accent.toUpperCase()} em preço, selo e botão comprar`,
                        detail: 'Concentre contraste nos elementos de decisão para ganho de conversão.'
                    },
                    {
                        label: 'Vitrine visual',
                        value: `${roleMap.primary.toUpperCase()} em faixas com ${roleMap.neutralLight.toUpperCase()} de respiro`,
                        detail: 'Equilibra impacto de campanha sem poluir a experiência de produto.'
                    }
                ];
            case 'health':
                return [
                    {
                        label: 'Conforto de leitura',
                        value: `${roleMap.neutralLight.toUpperCase()} + ${roleMap.secondary.toUpperCase()}`,
                        detail: 'Priorize tons suaves e contraste consistente para conteúdo clínico.'
                    },
                    {
                        label: 'Sinalização positiva',
                        value: `${roleMap.accent.toUpperCase()} em estados de sucesso e progresso`,
                        detail: 'Use acento para reforçar orientação sem gerar ansiedade visual.'
                    }
                ];
            case 'education':
                return [
                    {
                        label: 'Mapa de trilhas',
                        value: `${roleMap.primary.toUpperCase()} para base e ${roleMap.accent.toUpperCase()} para nível`,
                        detail: 'Ajuda a separar módulos e progresso por blocos de aprendizado.'
                    },
                    {
                        label: 'Aprendizado ativo',
                        value: `${roleMap.secondary.toUpperCase()} em exercicios e feedback`,
                        detail: 'Cria ritmo visual para leitura, prática e revisão.'
                    }
                ];
            case 'finance':
                return [
                    {
                        label: 'Confiança operacional',
                        value: `${roleMap.primary.toUpperCase()} para navegação e ${roleMap.neutralDark.toUpperCase()} em dados`,
                        detail: 'Mantém seriedade e reduz ruído visual em telas de decisão.'
                    },
                    {
                        label: 'Destaque de ação',
                        value: `${roleMap.accent.toUpperCase()} apenas em eventos financeiros críticos`,
                        detail: 'Acento pontual melhora foco sem banalizar alertas importantes.'
                    }
                ];
            case 'fashion':
                return [
                    {
                        label: 'Editorial premium',
                        value: `${roleMap.neutralDark.toUpperCase()} com blocos ${roleMap.accent.toUpperCase()}`,
                        detail: 'Direção visual sofisticada para coleções, lookbooks e campanhas.'
                    },
                    {
                        label: 'Destaque de colecao',
                        value: `${roleMap.primary.toUpperCase()} + ${roleMap.secondary.toUpperCase()}`,
                        detail: 'Boa combinação para diferenciar linhas de produto sem perder unidade.'
                    }
                ];
            default:
                return [];
        }
    }

    buildSectorTrendSuggestions(sectorKey, roleMap) {
        switch (sectorKey) {
            case 'saas':
                return [
                    {
                        label: 'Product-Led Visuals',
                        value: `${roleMap.primary.toUpperCase()} com gradiente técnico`,
                        detail: 'Tendencia forte em plataformas B2B, IA aplicada e analytics.'
                    },
                    {
                        label: 'Action Minimal',
                        value: `${roleMap.accent.toUpperCase()} restrito aos gatilhos de ação`,
                        detail: 'Reduz ruído e aumenta previsibilidade da interface.'
                    }
                ];
            case 'ecommerce':
                return [
                    {
                        label: 'High-Contrast Commerce',
                        value: `${roleMap.accent.toUpperCase()} em ofertas de tempo limitado`,
                        detail: 'Visual orientado a urgencia e campanhas de alto giro.'
                    },
                    {
                        label: 'Story-driven Catalog',
                        value: `${roleMap.primary.toUpperCase()} em storytelling de categoria`,
                        detail: 'Aproxima branding e performance dentro da mesma vitrine.'
                    }
                ];
            case 'health':
                return [
                    {
                        label: 'Calm Clinical UI',
                        value: `${roleMap.neutralLight.toUpperCase()} + ${roleMap.primary.toUpperCase()}`,
                        detail: 'Tendencia de experiência acolhedora para serviços de saúde digital.'
                    },
                    {
                        label: 'Trust Micro-States',
                        value: `${roleMap.accent.toUpperCase()} em progresso e orientação`,
                        detail: 'Microestados claros melhoram adesao em jornadas longas.'
                    }
                ];
            case 'education':
                return [
                    {
                        label: 'Learning Journey Maps',
                        value: `${roleMap.secondary.toUpperCase()} para trilhas e badges`,
                        detail: 'Cores ajudam a mapear etapas e metas de aprendizado.'
                    },
                    {
                        label: 'Creator Classroom',
                        value: `${roleMap.accent.toUpperCase()} para atividades e feedback`,
                        detail: 'Visual mais dinamico para produtos educacionais modernos.'
                    }
                ];
            case 'finance':
                return [
                    {
                        label: 'Regulated Minimalism',
                        value: `${roleMap.neutralDark.toUpperCase()} com acentos controlados`,
                        detail: 'Direção dominante em bancos digitais, seguradoras e investimentos.'
                    },
                    {
                        label: 'Signal-first Design',
                        value: `${roleMap.accent.toUpperCase()} em alertas e recomendações`,
                        detail: 'Evidencia risco e oportunidade sem quebrar sobriedade visual.'
                    }
                ];
            case 'fashion':
                return [
                    {
                        label: 'Neo Editorial',
                        value: `${roleMap.primary.toUpperCase()} com contraste de superficies`,
                        detail: 'Referência atual para coleções, drops e campanhas premium.'
                    },
                    {
                        label: 'Lifestyle Contrast',
                        value: `${roleMap.accent.toUpperCase()} em chamadas de colecao`,
                        detail: 'Entrega identidade forte para social, landing e e-commerce.'
                    }
                ];
            default:
                return [];
        }
    }

    hydrateFromBrandKit() {
        const api = window.AQBrandKit;
        if (!api) {
            return;
        }

        const snapshot = api.getIntegrationSnapshot?.();
        const paletteState = snapshot?.colorPalette || {};
        const brandKitPalette = snapshot?.brandKit?.palette || {};

        const preferredBase = paletteState.baseColor
            || brandKitPalette.baseColor
            || snapshot?.brandInsights?.roles?.primary;
        if (this.isValidHex(preferredBase || '')) {
            this.baseColor = preferredBase;
            const baseColorInput = document.getElementById('baseColor');
            const hexInput = document.getElementById('hexInput');
            if (baseColorInput) {
                baseColorInput.value = this.baseColor;
            }
            if (hexInput) {
                hexInput.value = this.baseColor;
            }
        }

        const preferredType = String(
            paletteState.type
            || brandKitPalette.type
            || snapshot?.brandInsights?.paletteType
            || ''
        ).trim();
        if (preferredType && this.allowedPaletteTypes.has(preferredType)) {
            this.currentPaletteType = preferredType;
            document.querySelectorAll('.palette-btn').forEach((button) => {
                button.classList.toggle('active', button.dataset.type === preferredType);
            });
        }

        const rawHarmony = paletteState.harmony || snapshot?.brandInsights?.harmony || {};
        const harmonyRule = this.normalizeHarmonyRule(rawHarmony?.rule || this.currentPaletteType);
        if (this.wheelHarmonyRuleSelect) {
            this.wheelHarmonyRuleSelect.value = harmonyRule;
        }
        const spreadRaw = Number.parseInt(String(rawHarmony?.spread || ''), 10);
        if (this.harmonySpreadInput && Number.isFinite(spreadRaw)) {
            const clamped = Math.max(12, Math.min(120, spreadRaw));
            this.harmonySpreadInput.value = String(clamped);
            if (this.harmonySpreadValue) {
                this.harmonySpreadValue.textContent = `${clamped}deg`;
            }
        }

        const rawSectorProfile = paletteState.sectorProfile || snapshot?.brandInsights?.sectorProfile || {};
        const sectorKey = this.normalizeSectorPresetKey(rawSectorProfile?.key || this.sectorPresetSelect?.value || 'none');
        if (this.sectorPresetSelect) {
            this.sectorPresetSelect.value = sectorKey;
        }
        if (sectorKey !== 'none') {
            const spread = Number.parseInt(String(rawSectorProfile?.spread || ''), 10);
            this.activeSectorProfile = this.buildSectorProfile(sectorKey, {
                rule: rawSectorProfile?.rule || harmonyRule || this.currentPaletteType,
                spread: Number.isFinite(spread) ? spread : undefined
            });
        } else {
            this.activeSectorProfile = null;
        }
        this.updateSectorPresetHint();
    }

    publishPaletteState(colors, title, description) {
        const api = window.AQBrandKit;
        if (!api) {
            return;
        }

        const payload = {
            baseColor: this.baseColor,
            type: this.currentPaletteType,
            title,
            description,
            colors,
            harmony: this.getHarmonyProfile(),
            sectorProfile: this.getSectorProfile()
        };
        api.saveColorPaletteState(payload, 'colorpalette');
        api.syncColorPalette(payload, 'colorpalette');
    }

    applyCurrentPaletteToBrandKit() {
        const api = window.AQBrandKit;
        if (!api) {
            this.updateBrandSyncStatus('Não foi possível sincronizar: Brand Kit indisponível.', true);
            this.renderWorkflowAssistant();
            return;
        }

        const colors = Array.isArray(this.currentColors) && this.currentColors.length
            ? this.currentColors
            : [this.baseColor];

        api.syncColorPalette({
            baseColor: this.baseColor,
            type: this.currentPaletteType,
            title: `Paleta ${this.currentPaletteType}`,
            description: 'Paleta definida no Color Palette.',
            colors,
            harmony: this.getHarmonyProfile(),
            sectorProfile: this.getSectorProfile()
        }, 'colorpalette');

        const roleMap = this.buildRoleMap(colors);
        if (typeof api.saveBrandKit === 'function') {
            api.saveBrandKit({
                brandColors: {
                    primary: roleMap.primary,
                    secondary: roleMap.secondary,
                    accent: roleMap.accent,
                    neutral: roleMap.neutralDark
                }
            }, 'colorpalette');
        }

        this.updateBrandSyncStatus('Cores sincronizadas com sucesso em Mockups, relatório e Brand Kit.');
        this.didManualSync = true;
        this.renderWorkflowAssistant();
    }

    updateBrandSyncStatus(message, isError = false) {
        if (!this.brandSyncStatus) {
            return;
        }
        this.brandSyncStatus.textContent = message;
        this.brandSyncStatus.classList.remove('ok', 'error');
        this.brandSyncStatus.classList.add(isError ? 'error' : 'ok');
    }

    hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h * 360, s * 100, l * 100];
    }

    hslToHex(h, s, l) {
        h = ((h % 360) + 360) % 360;
        s = Math.max(0, Math.min(100, s)) / 100;
        l = Math.max(0, Math.min(100, l)) / 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;
        if (h >= 0 && h < 60) {
            r = c; g = x; b = 0;
        } else if (h >= 60 && h < 120) {
            r = x; g = c; b = 0;
        } else if (h >= 120 && h < 180) {
            r = 0; g = c; b = x;
        } else if (h >= 180 && h < 240) {
            r = 0; g = x; b = c;
        } else if (h >= 240 && h < 300) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    normalizeHex(hex) {
        const value = String(hex || '').trim().toLowerCase();
        if (/^#[0-9a-f]{6}$/.test(value)) {
            return value;
        }
        if (/^#[0-9a-f]{3}$/.test(value)) {
            return `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
        }
        return '';
    }

    uniqueHexColors(colors) {
        const output = [];
        const seen = new Set();

        (Array.isArray(colors) ? colors : []).forEach((color) => {
            const normalized = this.normalizeHex(color);
            if (!normalized || seen.has(normalized)) {
                return;
            }
            seen.add(normalized);
            output.push(normalized);
        });

        return output;
    }

    ensurePaletteSize(colors, targetSize = 5) {
        const next = [...colors];
        const [baseH, baseS, baseL] = this.hexToHsl(this.baseColor);

        let step = 0;
        while (next.length < targetSize && step < 18) {
            const hueOffset = ((step % 6) + 1) * 18;
            const satOffset = step % 2 === 0 ? -12 : 8;
            const lightOffset = step % 2 === 0 ? 18 : -18;
            const candidate = this.hslToHex(
                baseH + hueOffset,
                Math.max(18, Math.min(88, baseS + satOffset)),
                Math.max(12, Math.min(88, baseL + lightOffset))
            );

            const normalized = this.normalizeHex(candidate);
            if (normalized && !next.includes(normalized)) {
                next.push(normalized);
            }
            step += 1;
        }

        return next.slice(0, targetSize);
    }

    sanitizePaletteColors(colors) {
        const normalizedBase = this.normalizeHex(this.baseColor) || '#3498db';
        const uniqueColors = this.uniqueHexColors(colors);

        if (!uniqueColors.includes(normalizedBase)) {
            uniqueColors.unshift(normalizedBase);
        }

        return this.ensurePaletteSize(uniqueColors, 5);
    }

    getRelativeLuminance(hex) {
        const { r, g, b } = this.hexToRgb(hex);
        const channels = [r, g, b].map((channel) => {
            const normalized = channel / 255;
            return normalized <= 0.03928
                ? normalized / 12.92
                : Math.pow((normalized + 0.055) / 1.055, 2.4);
        });

        return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
    }

    getContrastRatio(hexA, hexB) {
        const l1 = this.getRelativeLuminance(hexA);
        const l2 = this.getRelativeLuminance(hexB);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    getContrastBadge(ratio) {
        if (ratio >= 7) {
            return { label: 'AAA', className: 'is-aaa' };
        }
        if (ratio >= 4.5) {
            return { label: 'AA', className: 'is-aa' };
        }
        if (ratio >= 3) {
            return { label: 'AA grande', className: 'is-large' };
        }
        return { label: 'Baixo', className: 'is-low' };
    }

    pickTextColor(backgroundHex) {
        const white = '#ffffff';
        const dark = '#0f172a';
        const whiteRatio = this.getContrastRatio(backgroundHex, white);
        const darkRatio = this.getContrastRatio(backgroundHex, dark);

        if (darkRatio >= whiteRatio) {
            return { text: dark, ratio: darkRatio, against: 'escuro' };
        }

        return { text: white, ratio: whiteRatio, against: 'claro' };
    }

    getHueDistance(colorA, colorB) {
        const [hA] = this.hexToHsl(colorA);
        const [hB] = this.hexToHsl(colorB);
        const delta = Math.abs(hA - hB);
        return Math.min(delta, 360 - delta);
    }

    buildRoleMap(colors) {
        const palette = this.uniqueHexColors(colors);
        const base = this.normalizeHex(this.baseColor) || palette[0] || '#3498db';
        const safePalette = palette.includes(base) ? palette : [base, ...palette];

        const byLightness = [...safePalette].sort((a, b) => this.hexToHsl(a)[2] - this.hexToHsl(b)[2]);
        const bySaturation = [...safePalette].sort((a, b) => this.hexToHsl(b)[1] - this.hexToHsl(a)[1]);
        const byHueDistance = [...safePalette].sort((a, b) => this.getHueDistance(b, base) - this.getHueDistance(a, base));

        const roleMap = {
            primary: base,
            secondary: base,
            accent: base,
            neutralLight: byLightness[byLightness.length - 1] || base,
            neutralDark: byLightness[0] || base
        };

        roleMap.accent = bySaturation.find((color) => color !== roleMap.primary) || roleMap.primary;
        roleMap.secondary = byHueDistance.find((color) => ![roleMap.primary, roleMap.accent].includes(color))
            || byLightness.find((color) => ![roleMap.primary, roleMap.accent].includes(color))
            || roleMap.primary;

        if (roleMap.neutralLight === roleMap.neutralDark && safePalette.length > 1) {
            roleMap.neutralLight = byLightness[byLightness.length - 1];
            roleMap.neutralDark = byLightness[0];
        }

        return roleMap;
    }

    renderRoleSuggestions(roleMap) {
        if (!this.roleSuggestions) {
            return;
        }

        const labels = [
            { key: 'primary', label: 'Primária' },
            { key: 'secondary', label: 'Secundária' },
            { key: 'accent', label: 'Acento' },
            { key: 'neutralLight', label: 'Neutra clara' },
            { key: 'neutralDark', label: 'Neutra escura' }
        ];

        this.roleSuggestions.innerHTML = labels.map((item) => {
            const color = roleMap[item.key];
            const textChoice = this.pickTextColor(color);
            const contrast = textChoice.ratio.toFixed(2);
            return `
                <article class="role-item" data-role-color="${color}" data-role-text="${textChoice.text}">
                    <div class="role-item-swatch">${item.label}</div>
                    <div class="role-item-meta">
                        <strong>${color.toUpperCase()}</strong>
                        <small>Texto ${textChoice.against} (${contrast}:1)</small>
                    </div>
                </article>
            `;
        }).join('');
        this.applyRoleSuggestionStyles(this.roleSuggestions);
    }

    renderContrastAudit(colors) {
        if (!this.contrastAudit) {
            return;
        }

        const payload = this.buildContrastPayload(colors);
        const rows = payload.map((item) => {
            const badge = this.getContrastBadge(item.ratio);

            return `
                <div class="contrast-row">
                    <div class="contrast-color">
                        <span class="contrast-swatch" data-color="${item.color}"></span>
                        <code>${item.color.toUpperCase()}</code>
                    </div>
                    <div class="contrast-values">
                        <span>Branco: ${item.whiteRatio.toFixed(2)}:1</span>
                        <span>Escuro: ${item.darkRatio.toFixed(2)}:1</span>
                    </div>
                    <span class="contrast-badge ${badge.className}">${badge.label}</span>
                </div>
            `;
        }).join('');

        this.contrastAudit.innerHTML = rows;
        this.applyElementColors(this.contrastAudit, '.contrast-swatch', 'data-color');
    }

    buildContrastPayload(colors) {
        return this.uniqueHexColors(colors).map((color) => {
            const whiteRatio = this.getContrastRatio(color, '#ffffff');
            const darkRatio = this.getContrastRatio(color, '#0f172a');
            const best = this.pickTextColor(color);
            const badge = this.getContrastBadge(best.ratio);

            return {
                color,
                recommendedText: best.text,
                ratio: Number(best.ratio.toFixed(2)),
                level: badge.label,
                whiteRatio: Number(whiteRatio.toFixed(2)),
                darkRatio: Number(darkRatio.toFixed(2))
            };
        });
    }

    getPaletteTemperature(colors) {
        const result = { warm: 0, cool: 0, neutral: 0, label: 'equilibrada' };
        this.uniqueHexColors(colors).forEach((color) => {
            const [h, s] = this.hexToHsl(color);
            if (s < 14) {
                result.neutral += 1;
                return;
            }
            if (h <= 70 || h >= 320) {
                result.warm += 1;
                return;
            }
            if (h >= 170 && h <= 290) {
                result.cool += 1;
                return;
            }
            result.neutral += 1;
        });

        if (result.warm >= result.cool + 2) {
            result.label = 'quente';
        } else if (result.cool >= result.warm + 2) {
            result.label = 'fria';
        }

        return result;
    }

    getPaletteEnergy(colors) {
        const unique = this.uniqueHexColors(colors);
        if (!unique.length) {
            return { averageSaturation: 0, level: 'suave' };
        }

        const averageSaturation = unique.reduce((sum, color) => {
            const [, s] = this.hexToHsl(color);
            return sum + s;
        }, 0) / unique.length;

        if (averageSaturation >= 66) {
            return { averageSaturation, level: 'vibrante' };
        }
        if (averageSaturation >= 38) {
            return { averageSaturation, level: 'equilibrada' };
        }
        return { averageSaturation, level: 'suave' };
    }

    buildCombinationSuggestions(roleMap, colors) {
        const list = [];
        const temperature = this.getPaletteTemperature(colors);
        const energy = this.getPaletteEnergy(colors);

        list.push({
            label: 'Regra 60-30-10',
            value: `${roleMap.primary.toUpperCase()} / ${roleMap.secondary.toUpperCase()} / ${roleMap.accent.toUpperCase()}`,
            detail: 'Use primária para fundo base, secundária para blocos e acento em CTAs e ícones.'
        });

        const primaryText = this.pickTextColor(roleMap.primary);
        const secondaryText = this.pickTextColor(roleMap.secondary);
        list.push({
            label: 'Par de leitura principal',
            value: `${roleMap.primary.toUpperCase()} + ${primaryText.text.toUpperCase()} (${primaryText.ratio.toFixed(2)}:1)`,
            detail: `Para seções de apoio, aplique ${roleMap.secondary.toUpperCase()} com ${secondaryText.text.toUpperCase()} para consistência visual.`
        });

        const harmonyMap = {
            monochromatic: {
                label: 'Monocromatico premium',
                detail: 'Ideal para interfaces minimalistas, dashboards e produtos B2B.'
            },
            analogous: {
                label: 'Anologo progressivo',
                detail: 'Transicoes suaves para storytelling visual e landing pages institucionais.'
            },
            complementary: {
                label: 'Contraste complementar',
                detail: 'Combina pares de alto impacto para campanhas, banners e destaque de ação.'
            },
            triadic: {
                label: 'Tríade dinâmica',
                detail: 'Boa para produtos criativos com seções bem separadas por função.'
            },
            tetradic: {
                label: 'Tetrade editorial',
                detail: 'Paleta rica para sistemas com múltiplas categorias de conteúdo.'
            },
            splitComplementary: {
                label: 'Split equilibrado',
                detail: 'Mantém impacto sem agressividade excessiva, ideal para produtos digitais.'
            }
        };
        const harmony = harmonyMap[this.currentPaletteType] || harmonyMap.monochromatic;
        list.push({
            label: harmony.label,
            value: `Temperatura ${temperature.label} | energia ${energy.level}`,
            detail: harmony.detail
        });

        if (temperature.label === 'quente') {
            list.push({
                label: 'Balanceamento de temperatura',
                value: `${roleMap.neutralDark.toUpperCase()} + ${roleMap.neutralLight.toUpperCase()}`,
                detail: 'Acrescente neutros para evitar fadiga visual em páginas longas.'
            });
        } else if (temperature.label === 'fria') {
            list.push({
                label: 'Aquecimento de interface',
                value: `${roleMap.accent.toUpperCase()} em pontos de ação`,
                detail: 'Use acento quente em botões para aumentar direcionamento de clique.'
            });
        } else {
            list.push({
                label: 'Direção equilibrada',
                value: `${roleMap.secondary.toUpperCase()} como apoio`,
                detail: 'Paleta neutra com acento controlado funciona bem para produtos multi-segmento.'
            });
        }

        const sectorProfile = this.getSectorProfile();
        if (sectorProfile?.key) {
            const sectorCombinations = this.buildSectorCombinationSuggestions(sectorProfile.key, roleMap);
            sectorCombinations.forEach((entry) => {
                list.push({
                    ...entry,
                    label: `[${sectorProfile.label}] ${entry.label}`
                });
            });
        }

        return list.slice(0, 6);
    }

    buildTrendSuggestions(roleMap, colors) {
        const trends = [];
        const temperature = this.getPaletteTemperature(colors);
        const energy = this.getPaletteEnergy(colors);
        const [baseHue] = this.hexToHsl(roleMap.primary);

        trends.push({
            label: 'UI Data-Driven',
            value: `Contraste ${roleMap.primary.toUpperCase()} + ${roleMap.neutralLight.toUpperCase()}`,
            detail: 'Tendencia para produtos SaaS: leitura forte, hierarquia clara e metricas em destaque.'
        });

        if (temperature.label === 'quente') {
            trends.push({
                label: 'Digital Warmth',
                value: `${roleMap.accent.toUpperCase()} em interações`,
                detail: 'Combinação quente para marcas próximas, creator economy e campanhas de conversão.'
            });
        } else if (temperature.label === 'fria') {
            trends.push({
                label: 'Calm Tech',
                value: `${roleMap.secondary.toUpperCase()} com gradientes suaves`,
                detail: 'Tendencia de tecnologia confiavel com aparencia clean e profissional.'
            });
        } else {
            trends.push({
                label: 'Neutral Premium',
                value: `${roleMap.neutralDark.toUpperCase()} + ${roleMap.accent.toUpperCase()}`,
                detail: 'Visual sofisticado para marcas premium e interfaces editoriais.'
            });
        }

        if (energy.level === 'vibrante') {
            trends.push({
                label: 'High-Energy Branding',
                value: 'Microblocos de acento + superficies claras',
                detail: 'Aproveita saturação alta para destacar ofertas e chamadas sem perder legibilidade.'
            });
        } else if (energy.level === 'suave') {
            trends.push({
                label: 'Soft Minimalism',
                value: `Base ${roleMap.neutralLight.toUpperCase()} com acento pontual`,
                detail: 'Direção minimalista para produtos premium e experiências focadas em conteúdo.'
            });
        } else {
            trends.push({
                label: 'Balanced Conversion',
                value: 'Estrutura neutra com CTA colorido',
                detail: 'Padrão atual em e-commerce e plataformas de serviço com foco em performance.'
            });
        }

        if (baseHue >= 180 && baseHue <= 250) {
            trends.push({
                label: 'Trust Gradient',
                value: `${roleMap.primary.toUpperCase()} -> ${roleMap.secondary.toUpperCase()}`,
                detail: 'Gradientes frios continuam fortes para fintech, IA e produtos corporativos.'
            });
        } else if (baseHue >= 20 && baseHue <= 70) {
            trends.push({
                label: 'Sunset Commerce',
                value: `${roleMap.primary.toUpperCase()} com ${roleMap.accent.toUpperCase()}`,
                detail: 'Combina calor e urgencia visual em campanhas de produto e varejo digital.'
            });
        }

        const sectorProfile = this.getSectorProfile();
        if (sectorProfile?.key) {
            const sectorTrends = this.buildSectorTrendSuggestions(sectorProfile.key, roleMap);
            sectorTrends.forEach((entry) => {
                trends.push({
                    ...entry,
                    label: `[${sectorProfile.label}] ${entry.label}`
                });
            });
        }

        return trends.slice(0, 6);
    }

    renderInsightCards(target, entries) {
        if (!target) {
            return;
        }

        if (!Array.isArray(entries) || !entries.length) {
            target.innerHTML = '<p class="insight-item"><strong>Sem dados</strong><span class="insight-meta">Gere uma paleta para ver recomendações.</span></p>';
            return;
        }

        target.innerHTML = entries.map((entry) => `
            <article class="insight-item">
                <strong>${entry.label}</strong>
                <span class="insight-meta">${entry.value}</span>
                <p>${entry.detail}</p>
            </article>
        `).join('');
    }

    renderTrendAndCombinationInsights(roleMap, colors) {
        const combinations = this.buildCombinationSuggestions(roleMap, colors);
        const trends = this.buildTrendSuggestions(roleMap, colors);
        const temperature = this.getPaletteTemperature(colors);
        const energy = this.getPaletteEnergy(colors);
        const sectorProfile = this.getSectorProfile();
        const sectorLine = sectorProfile?.label ? `Preset setorial ativo: ${sectorProfile.label}.` : 'Sem preset setorial ativo.';

        if (this.insightSummary) {
            this.insightSummary.textContent = `Paleta ${this.currentPaletteType} com temperatura ${temperature.label} e energia ${energy.level}. ${sectorLine} Essas recomendações já foram preparadas para o BrandBook.`;
        }

        this.renderInsightCards(this.combinationSuggestions, combinations);
        this.renderInsightCards(this.trendSuggestions, trends);

        const contrast = this.buildContrastPayload(colors);
        this.publishBrandInsights({
            roleMap,
            colors,
            combinations,
            trends,
            contrast,
            summary: this.insightSummary ? this.insightSummary.textContent : ''
        });
    }

    publishBrandInsights(payload) {
        const api = window.AQBrandKit;
        if (!api || typeof api.syncBrandInsights !== 'function') {
            return;
        }

        const data = payload && typeof payload === 'object' ? payload : {};
        const harmonyProfile = this.getHarmonyProfile();
        const sectorProfile = this.getSectorProfile();
        const recommendations = [
            'Aplique a regra 60-30-10 para manter consistência entre telas.',
            'Use o acento somente em pontos de ação para preservar hierarquia.',
            'Valide contraste AA/AAA nos componentes de texto e botões.'
        ];
        if (harmonyProfile.rule !== 'monochromatic') {
            recommendations.push(
                `Mantenha a regra ${harmonyProfile.label} com abertura de ${harmonyProfile.spread}deg para consistência entre telas.`
            );
        }
        if (sectorProfile?.label) {
            recommendations.push(
                `Padrão setorial aplicado: ${sectorProfile.label}. Garanta consistência entre campanha, produto e materiais de marca.`
            );
        }

        api.syncBrandInsights({
            paletteType: this.currentPaletteType,
            summary: String(data.summary || ''),
            roles: data.roleMap || {},
            colors: Array.isArray(data.colors) ? data.colors : [],
            combinations: Array.isArray(data.combinations) ? data.combinations : [],
            trends: Array.isArray(data.trends) ? data.trends : [],
            contrast: Array.isArray(data.contrast) ? data.contrast : [],
            recommendations,
            harmony: harmonyProfile,
            sectorProfile
        }, 'colorpalette');
    }

    syncWheelLightnessWithBase() {
        if (!this.wheelBaseLightnessInput || !this.wheelBaseLightnessValue) {
            return;
        }

        const [, , lightness] = this.hexToHsl(this.baseColor);
        const value = Math.max(12, Math.min(88, Math.round(lightness)));
        this.wheelBaseLightnessInput.value = String(value);
        this.wheelBaseLightnessValue.textContent = `${value}%`;
    }

    getWheelLightness() {
        const fallback = Math.round(this.hexToHsl(this.baseColor)[2]);
        const raw = Number.parseInt(this.wheelBaseLightnessInput?.value || String(fallback), 10);
        if (!Number.isFinite(raw)) {
            return Math.max(12, Math.min(88, fallback));
        }
        return Math.max(12, Math.min(88, raw));
    }

    applyWheelLightness() {
        const [h, s] = this.hexToHsl(this.baseColor);
        const next = this.hslToHex(h, s, this.getWheelLightness());
        this.baseColor = next;
        document.getElementById('baseColor').value = next;
        document.getElementById('hexInput').value = next;
        this.applyHarmonyRule({
            notify: false,
            statusMessage: 'Luminosidade base ajustada pela roda de cores.'
        });
    }

    getDynamicsProfile() {
        const raw = String(this.wheelDynamicsProfileSelect?.value || 'balanced').trim();
        const allowed = new Set(['balanced', 'vibrant', 'soft', 'highContrast']);
        return allowed.has(raw) ? raw : 'balanced';
    }

    getDynamicsIntensity() {
        const raw = Number.parseInt(this.wheelDynamicsIntensityInput?.value || '55', 10);
        if (!Number.isFinite(raw)) {
            return 0.55;
        }
        return Math.max(0, Math.min(1, raw / 100));
    }

    getDynamicsProfileLabel(profile = this.getDynamicsProfile()) {
        const labels = {
            balanced: 'Equilibrado',
            vibrant: 'Vibrante',
            soft: 'Suave',
            highContrast: 'Alto contraste'
        };
        return labels[profile] || labels.balanced;
    }

    applyCompositionDynamics(colors, options = {}) {
        const preserveBase = options.preserveBase !== false;
        const profile = this.getDynamicsProfile();
        const intensity = this.getDynamicsIntensity();
        const base = this.normalizeHex(this.baseColor) || '#3498db';
        const palette = this.uniqueHexColors(colors);
        if (!palette.length) {
            return this.ensurePaletteSize([base], 5);
        }

        if (intensity <= 0.01) {
            return this.ensurePaletteSize(this.uniqueHexColors([
                preserveBase ? base : palette[0],
                ...palette
            ]), 5);
        }

        const total = palette.length;
        const transformed = palette.map((color, index) => {
            const normalized = this.normalizeHex(color) || base;
            if (preserveBase && index === 0) {
                return base;
            }

            const [h, s, l] = this.hexToHsl(normalized);
            const ratio = total <= 1 ? 0 : index / (total - 1);
            let nextH = h;
            let nextS = s;
            let nextL = l;

            switch (profile) {
                case 'vibrant':
                    nextH = h + ((index - 2) * 4 * intensity);
                    nextS = s + ((14 + (ratio * 12)) * intensity);
                    nextL = l + ((ratio < 0.5 ? -10 : 9) * intensity);
                    break;
                case 'soft':
                    nextH = h + ((index - 2) * 2 * intensity);
                    nextS = s - ((16 + (ratio * 10)) * intensity);
                    nextL = l + ((12 - (ratio * 6)) * intensity);
                    break;
                case 'highContrast':
                    nextH = h + ((index % 2 === 0 ? -10 : 10) * intensity);
                    nextS = s + ((10 + (ratio * 8)) * intensity);
                    nextL = l + ((index % 2 === 0 ? -22 : 20) * intensity);
                    break;
                case 'balanced':
                default:
                    nextH = h + ((index - 2) * 3 * intensity);
                    nextS = s + ((index % 2 === 0 ? 8 : -5) * intensity);
                    nextL = l + ((index - 2) * 5 * intensity);
                    break;
            }

            nextS = Math.max(18, Math.min(96, nextS));
            nextL = Math.max(8, Math.min(92, nextL));
            return this.hslToHex(nextH, nextS, nextL);
        });

        const merged = preserveBase
            ? [base, ...transformed.slice(1)]
            : transformed;
        return this.ensurePaletteSize(this.uniqueHexColors(merged), 5);
    }

    applyCurrentDynamicsProfile() {
        const label = this.getDynamicsProfileLabel();
        const intensity = Math.round(this.getDynamicsIntensity() * 100);
        const currentTitle = String(document.getElementById('paletteTitle')?.textContent || 'Paleta Dinâmica');
        const currentDescription = String(document.getElementById('paletteDescription')?.textContent || '');
        const colors = this.applyCompositionDynamics(this.currentColors, { preserveBase: true });
        const title = `${currentTitle} - Dinâmica ${label}`;
        const description = `${currentDescription} Dinâmica ${label.toLowerCase()} aplicada em ${intensity}% de intensidade.`;
        this.applyPaletteRendering(colors, title, description, `Dinâmica ${label.toLowerCase()} aplicada com sucesso.`);
        this.showNotification(`Dinâmica ${label} aplicada na composição.`);
    }

    rotateBaseHue(offset = 0, options = {}) {
        const step = Number.isFinite(offset) ? offset : 0;
        if (step === 0) {
            return;
        }

        const [h, s, l] = this.hexToHsl(this.baseColor);
        const rotatedColor = this.hslToHex(h + step, s, l);
        this.baseColor = rotatedColor;
        document.getElementById('baseColor').value = rotatedColor;
        document.getElementById('hexInput').value = rotatedColor;

        this.applyHarmonyRule({
            notify: options.notify !== false,
            statusMessage: String(
                options.statusMessage
                || 'Rotação aplicada na harmonização das cores.'
            )
        });
    }

    randomizeHarmonyDirection() {
        const rules = Array.from(this.allowedPaletteTypes);
        if (!rules.length) {
            return;
        }
        const randomRule = rules[Math.floor(Math.random() * rules.length)];
        const defaultSpread = this.getDefaultHarmonySpread(randomRule);
        const randomSpread = Math.max(
            12,
            Math.min(120, defaultSpread + Math.floor((Math.random() * 34) - 10))
        );
        const randomIntensity = Math.floor((Math.random() * 56) + 35);
        const dynamicProfiles = ['balanced', 'vibrant', 'soft', 'highContrast'];
        const randomProfile = dynamicProfiles[Math.floor(Math.random() * dynamicProfiles.length)];

        if (this.wheelHarmonyRuleSelect) {
            this.wheelHarmonyRuleSelect.value = randomRule;
        }
        if (this.harmonySpreadInput) {
            this.harmonySpreadInput.value = String(randomSpread);
        }
        if (this.harmonySpreadValue) {
            this.harmonySpreadValue.textContent = `${randomSpread}deg`;
        }
        if (this.wheelDynamicsProfileSelect) {
            this.wheelDynamicsProfileSelect.value = randomProfile;
        }
        if (this.wheelDynamicsIntensityInput) {
            this.wheelDynamicsIntensityInput.value = String(randomIntensity);
        }
        if (this.wheelDynamicsIntensityValue) {
            this.wheelDynamicsIntensityValue.textContent = `${randomIntensity}%`;
        }

        this.currentPaletteType = this.normalizeHarmonyRule(randomRule);
        document.querySelectorAll('.palette-btn').forEach((button) => {
            button.classList.toggle('active', button.dataset.type === this.currentPaletteType);
        });
        this.applyHarmonyRule({
            notify: true,
            statusMessage: 'Nova composição randomizada e aplicada na paleta.'
        });
    }

    setupWheelCanvasInteractions() {
        if (!this.colorWheelCanvas) {
            return;
        }

        this.colorWheelCanvas.style.touchAction = 'none';
        this.colorWheelCanvas.style.cursor = 'crosshair';

        this.colorWheelCanvas.addEventListener('pointerdown', (event) => {
            const info = this.getWheelPointerInfo(event);
            if (!info) {
                return;
            }
            const handle = this.getHarmonyHandleAtPointer(info);
            if (handle) {
                this.isWheelDragging = true;
                this.wheelDragMode = handle.kind === 'spread' ? 'harmony-spread' : 'harmony-rotate';
                this.activeHarmonyControl = handle;
                this.colorWheelCanvas.setPointerCapture?.(event.pointerId);
                this.colorWheelCanvas.style.cursor = 'grabbing';
                this.queueWheelHarmonyUpdate(info);
                event.preventDefault();
                return;
            }

            if (info.distance > (info.outerRadius + 8)) {
                this.updateWheelCursor(info);
                return;
            }

            this.isWheelDragging = true;
            this.wheelDragMode = 'base';
            this.activeHarmonyControl = null;
            this.colorWheelCanvas.setPointerCapture?.(event.pointerId);
            this.colorWheelCanvas.style.cursor = 'grabbing';
            this.queueWheelPointerUpdate(info);
            event.preventDefault();
        });

        this.colorWheelCanvas.addEventListener('pointermove', (event) => {
            const info = this.getWheelPointerInfo(event);
            if (!this.isWheelDragging) {
                this.updateWheelCursor(info);
                return;
            }
            if (!info) {
                return;
            }

            if (this.wheelDragMode === 'base') {
                this.queueWheelPointerUpdate(info);
            } else {
                this.queueWheelHarmonyUpdate(info);
            }
            event.preventDefault();
        });

        const stopDrag = () => {
            if (this.isWheelDragging && this.wheelDragMode === 'base' && this.wheelDragDirty) {
                this.applyHarmonyRule({
                    notify: false,
                    statusMessage: 'Cor base ajustada interativamente na roda de cores.'
                });
                this.wheelDragDirty = false;
            }
            if (this.isWheelDragging && this.wheelDragMode !== 'base' && this.wheelHarmonyDragDirty) {
                this.applyHarmonyRule({
                    notify: false,
                    statusMessage: 'Harmonia ajustada interativamente pelos pontos da roda.'
                });
                this.wheelHarmonyDragDirty = false;
            }
            this.isWheelDragging = false;
            this.wheelDragMode = null;
            this.activeHarmonyControl = null;
            this.colorWheelCanvas.style.cursor = 'crosshair';
        };
        this.colorWheelCanvas.addEventListener('pointerup', stopDrag);
        this.colorWheelCanvas.addEventListener('pointercancel', stopDrag);
        this.colorWheelCanvas.addEventListener('pointerleave', stopDrag);

        this.colorWheelCanvas.addEventListener('wheel', (event) => {
            if (!this.harmonySpreadInput || !this.harmonySpreadValue) {
                return;
            }
            const currentSpread = this.getHarmonySpread();
            const step = this.getWheelSpreadStep(Boolean(event.shiftKey));
            const direction = event.deltaY < 0 ? 1 : -1;
            const rawSpread = Math.max(12, Math.min(120, currentSpread + (direction * step)));
            const nextSpread = this.snapByStep(rawSpread, step);
            if (nextSpread === currentSpread) {
                return;
            }
            this.harmonySpreadInput.value = String(nextSpread);
            this.harmonySpreadValue.textContent = `${nextSpread}deg`;
            this.applyHarmonyRule({
                notify: false,
                statusMessage: 'Abertura da harmonia ajustada pela roda de cores.'
            });
            event.preventDefault();
        }, { passive: false });
    }

    queueWheelPointerUpdate(info) {
        this.pendingWheelPointer = info;
        if (this.wheelPointerRaf !== null) {
            return;
        }

        this.wheelPointerRaf = window.requestAnimationFrame(() => {
            const payload = this.pendingWheelPointer;
            this.pendingWheelPointer = null;
            this.wheelPointerRaf = null;
            if (payload) {
                this.applyWheelPointerInteraction(payload);
            }
        });
    }

    queueWheelHarmonyUpdate(info) {
        this.pendingWheelHarmonyPointer = info;
        if (this.wheelHarmonyRaf !== null) {
            return;
        }

        this.wheelHarmonyRaf = window.requestAnimationFrame(() => {
            const payload = this.pendingWheelHarmonyPointer;
            this.pendingWheelHarmonyPointer = null;
            this.wheelHarmonyRaf = null;
            if (payload) {
                this.applyWheelHarmonyInteraction(payload);
            }
        });
    }

    applyWheelPointerInteraction(info) {
        if (!info) {
            return;
        }

        const fineMode = Boolean(info.shiftKey);
        const hueStep = this.getWheelAngleStep(fineMode);
        const satStep = this.getWheelSpreadStep(fineMode);
        const clampedDistance = Math.max(0, Math.min(info.maxPointRadius, info.distance));
        const rawSaturation = Math.max(
            12,
            Math.min(100, ((clampedDistance - 18) / Math.max(1, info.maxPointRadius - 18)) * 100)
        );
        const saturation = Math.max(12, Math.min(100, this.snapByStep(rawSaturation, satStep)));
        const lightness = this.getWheelLightness();
        const snappedHue = this.snapByStep(info.hue, hueStep);
        const nextHex = this.hslToHex(snappedHue, saturation, lightness);

        this.baseColor = nextHex;
        document.getElementById('baseColor').value = nextHex;
        document.getElementById('hexInput').value = nextHex;
        this.updateWheelPointerInfo(nextHex);
        this.wheelDragDirty = true;

        const now = Date.now();
        if (this.isWheelDragging && (now - this.lastWheelInteractionAt) < 80) {
            return;
        }

        this.lastWheelInteractionAt = now;
        this.applyHarmonyRule({
            notify: false,
            statusMessage: 'Cor base ajustada interativamente na roda de cores.'
        });
        this.wheelDragDirty = false;
    }

    applyWheelHarmonyInteraction(info) {
        if (!info || !this.activeHarmonyControl) {
            return;
        }

        const mode = this.wheelDragMode;
        const [baseHue, baseSat, baseLight] = this.hexToHsl(this.baseColor);
        const fineMode = Boolean(info.shiftKey);

        if (mode === 'harmony-rotate') {
            const hueStep = this.getWheelAngleStep(fineMode);
            const snappedHue = this.snapByStep(info.hue, hueStep);
            const nextHex = this.hslToHex(snappedHue, baseSat, baseLight);
            this.baseColor = nextHex;
            document.getElementById('baseColor').value = nextHex;
            document.getElementById('hexInput').value = nextHex;
            this.updateWheelPointerInfo(nextHex);
            this.wheelHarmonyDragDirty = true;

            const now = Date.now();
            if ((now - this.lastWheelHarmonyInteractionAt) < 85) {
                return;
            }
            this.lastWheelHarmonyInteractionAt = now;
            this.applyHarmonyRule({
                notify: false,
                statusMessage: 'Rotação da harmonia ajustada pelos pontos da roda.'
            });
            this.wheelHarmonyDragDirty = false;
            return;
        }

        const control = this.activeHarmonyControl;
        if (control.kind !== 'spread' || !Number.isFinite(control.multiplier) || control.multiplier === 0) {
            return;
        }

        const rawOffset = this.getSignedHueDelta(baseHue, info.hue);
        const expectedOffset = Number.isFinite(control.offset) ? control.offset : rawOffset;
        const normalizedOffset = this.normalizeAngleNear(rawOffset, expectedOffset);
        const spreadRaw = (normalizedOffset - control.constant) / control.multiplier;
        if (!Number.isFinite(spreadRaw)) {
            return;
        }

        const spreadStep = this.getWheelSpreadStep(fineMode);
        const nextSpread = this.snapByStep(
            Math.max(12, Math.min(120, Math.abs(spreadRaw))),
            spreadStep
        );
        if (this.harmonySpreadInput) {
            this.harmonySpreadInput.value = String(Math.round(nextSpread));
        }
        if (this.harmonySpreadValue) {
            this.harmonySpreadValue.textContent = `${Math.round(nextSpread)}deg`;
        }
        control.offset = normalizedOffset;
        this.wheelHarmonyDragDirty = true;
        this.updateWheelPointerInfo(this.baseColor);

        const now = Date.now();
        if ((now - this.lastWheelHarmonyInteractionAt) < 85) {
            return;
        }
        this.lastWheelHarmonyInteractionAt = now;
        this.applyHarmonyRule({
            notify: false,
            statusMessage: 'Abertura da harmonia ajustada pelos pontos da roda.'
        });
        this.wheelHarmonyDragDirty = false;
    }

    updateWheelCursor(info) {
        if (!this.colorWheelCanvas || this.isWheelDragging) {
            return;
        }
        if (!info) {
            this.colorWheelCanvas.style.cursor = 'crosshair';
            return;
        }

        const handle = this.getHarmonyHandleAtPointer(info);
        if (handle) {
            this.colorWheelCanvas.style.cursor = 'grab';
            return;
        }

        if (info.distance <= (info.outerRadius + 8)) {
            this.colorWheelCanvas.style.cursor = 'crosshair';
            return;
        }

        this.colorWheelCanvas.style.cursor = 'default';
    }

    getWheelPointerInfo(event) {
        if (!this.colorWheelCanvas) {
            return null;
        }
        const point = this.getCanvasRelativePoint(event);
        if (!point) {
            return null;
        }

        const geometry = this.lastWheelGeometry || this.getDefaultWheelGeometry();
        const dx = point.x - geometry.center;
        const dy = point.y - geometry.center;
        const distance = Math.sqrt((dx * dx) + (dy * dy));
        const angle = ((Math.atan2(dy, dx) * 180) / Math.PI) + 90;
        const hue = ((angle % 360) + 360) % 360;

        return {
            ...geometry,
            x: point.x,
            y: point.y,
            distance,
            hue,
            shiftKey: Boolean(event.shiftKey)
        };
    }

    getCanvasRelativePoint(event) {
        if (!this.colorWheelCanvas) {
            return null;
        }
        const rect = this.colorWheelCanvas.getBoundingClientRect();
        if (!rect.width || !rect.height) {
            return null;
        }
        const scaleX = this.colorWheelCanvas.width / rect.width;
        const scaleY = this.colorWheelCanvas.height / rect.height;
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }

    getDefaultWheelGeometry() {
        const size = this.colorWheelCanvas ? this.colorWheelCanvas.width : 260;
        const center = size / 2;
        const outerRadius = (size / 2) - 8;
        const innerRadius = outerRadius - 26;
        const maxPointRadius = Math.max(20, innerRadius - 18);
        return { center, outerRadius, innerRadius, maxPointRadius };
    }

    updateWheelPointerInfo(color = this.baseColor) {
        if (!this.wheelPointerInfo) {
            return;
        }
        const normalized = this.normalizeHex(color) || this.normalizeHex(this.baseColor) || '#3498db';
        const [h, s, l] = this.hexToHsl(normalized);
        const spreadText = this.wheelDragMode && this.wheelDragMode !== 'base'
            ? ` | Spread ${this.getHarmonySpread()}deg`
            : '';
        this.wheelPointerInfo.textContent = `Base: ${normalized.toUpperCase()} | H ${Math.round(h)}deg | S ${Math.round(s)}% | L ${Math.round(l)}%${spreadText}`;
    }

    normalizeHarmonyRule(value) {
        const raw = String(value || '').trim();
        return this.allowedPaletteTypes.has(raw) ? raw : 'monochromatic';
    }

    getDefaultHarmonySpread(rule) {
        const safeRule = this.normalizeHarmonyRule(rule);
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

    getSelectedHarmonyRule() {
        const fallback = this.currentPaletteType || 'monochromatic';
        return this.normalizeHarmonyRule(this.wheelHarmonyRuleSelect?.value || fallback);
    }

    getHarmonySpread() {
        const fallback = this.getDefaultHarmonySpread(this.getSelectedHarmonyRule());
        const raw = Number.parseInt(this.harmonySpreadInput?.value || String(fallback), 10);
        if (!Number.isFinite(raw)) {
            return fallback;
        }
        return Math.max(12, Math.min(120, raw));
    }

    syncHarmonyControlsWithPaletteType(forceSpread = false, preferSelected = false) {
        const typeRule = this.normalizeHarmonyRule(this.currentPaletteType);
        const selectedRule = this.normalizeHarmonyRule(this.wheelHarmonyRuleSelect?.value || typeRule);
        const finalRule = preferSelected ? selectedRule : typeRule;

        if (this.wheelHarmonyRuleSelect) {
            this.wheelHarmonyRuleSelect.value = finalRule;
        }

        if (this.harmonySpreadInput) {
            const defaultSpread = this.getDefaultHarmonySpread(finalRule);
            const currentSpread = Number.parseInt(this.harmonySpreadInput.value || '', 10);
            const shouldReset = forceSpread || !Number.isFinite(currentSpread);
            if (shouldReset) {
                this.harmonySpreadInput.value = String(defaultSpread);
            }
            if (this.harmonySpreadValue) {
                const value = shouldReset ? defaultSpread : this.getHarmonySpread();
                this.harmonySpreadValue.textContent = `${value}deg`;
            }
        }
    }

    getHarmonyProfile() {
        const rule = this.getSelectedHarmonyRule();
        const spread = this.getHarmonySpread();
        const labels = {
            monochromatic: 'Monocromatica',
            analogous: 'Analogica',
            complementary: 'Complementar',
            triadic: 'Triadica',
            tetradic: 'Tetradica',
            splitComplementary: 'Split-complementar'
        };
        return {
            rule,
            spread,
            label: labels[rule] || labels.monochromatic
        };
    }

    getHarmonyOffsets(rule, spread) {
        const safeRule = this.normalizeHarmonyRule(rule);
        const safeSpread = Math.max(12, Math.min(120, Number(spread) || this.getDefaultHarmonySpread(safeRule)));
        switch (safeRule) {
            case 'analogous':
                return [0, -safeSpread, safeSpread, -safeSpread * 2, safeSpread * 2];
            case 'complementary':
                return [0, 180, -safeSpread, safeSpread, 180 + Math.round(safeSpread / 2)];
            case 'triadic':
                return [0, 120, 240, 120 - safeSpread, 240 + safeSpread];
            case 'tetradic':
                return [0, 90, 180, 270, 90 + safeSpread];
            case 'splitComplementary':
                return [0, 180 - safeSpread, 180 + safeSpread, -safeSpread, safeSpread];
            case 'monochromatic':
            default:
                return [0, 0, 0, 0, 0];
        }
    }

    getSignedHueDelta(fromHue, toHue) {
        const from = Number.isFinite(fromHue) ? fromHue : 0;
        const to = Number.isFinite(toHue) ? toHue : 0;
        return ((to - from + 540) % 360) - 180;
    }

    snapByStep(value, step = 1) {
        const safeValue = Number.isFinite(value) ? value : 0;
        const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
        return Math.round(safeValue / safeStep) * safeStep;
    }

    getWheelAngleStep(isFine = false) {
        return isFine ? 1 : 5;
    }

    getWheelSpreadStep(isFine = false) {
        return isFine ? 1 : 2;
    }

    normalizeAngleNear(angle, reference) {
        let next = Number.isFinite(angle) ? angle : 0;
        const ref = Number.isFinite(reference) ? reference : 0;
        while ((next - ref) > 180) {
            next -= 360;
        }
        while ((next - ref) < -180) {
            next += 360;
        }
        return next;
    }

    getHarmonyHandleDescriptors(rule) {
        const safeRule = this.normalizeHarmonyRule(rule);
        const rotate = { kind: 'rotate', constant: 0, multiplier: 0 };
        const fixed = (constant) => ({ kind: 'rotate', constant, multiplier: 0 });
        const spread = (constant, multiplier) => ({ kind: 'spread', constant, multiplier });

        const map = {
            monochromatic: [rotate, fixed(0), fixed(0), fixed(0), fixed(0)],
            analogous: [rotate, spread(0, -1), spread(0, 1), spread(0, -2), spread(0, 2)],
            complementary: [rotate, fixed(180), spread(0, -1), spread(0, 1), spread(180, 0.5)],
            triadic: [rotate, fixed(120), fixed(240), spread(120, -1), spread(240, 1)],
            tetradic: [rotate, fixed(90), fixed(180), fixed(270), spread(90, 1)],
            splitComplementary: [rotate, spread(180, -1), spread(180, 1), spread(0, -1), spread(0, 1)]
        };

        return map[safeRule] || map.monochromatic;
    }

    getHarmonyHandleAtPointer(info) {
        if (!info || !Array.isArray(this.lastHarmonyControlPoints) || !this.lastHarmonyControlPoints.length) {
            return null;
        }

        for (let index = 0; index < this.lastHarmonyControlPoints.length; index += 1) {
            const point = this.lastHarmonyControlPoints[index];
            const radius = Number.isFinite(point.handleRadius) ? point.handleRadius : 6;
            const hitRadius = radius + 5;
            const dx = info.x - point.x;
            const dy = info.y - point.y;
            if ((dx * dx) + (dy * dy) <= (hitRadius * hitRadius)) {
                return { ...point };
            }
        }

        return null;
    }

    generateHarmonyPalette(rule, spread) {
        const safeRule = this.normalizeHarmonyRule(rule);
        const safeSpread = Math.max(12, Math.min(120, Number(spread) || this.getDefaultHarmonySpread(safeRule)));
        const [baseHue, baseSat, baseLight] = this.hexToHsl(this.baseColor);
        const colors = [];

        if (safeRule === 'monochromatic') {
            const range = Math.max(8, Math.round(safeSpread / 2));
            for (let i = -2; i <= 2; i += 1) {
                const toneLight = Math.max(10, Math.min(90, baseLight + (i * range)));
                const toneSat = Math.max(18, Math.min(92, baseSat - (Math.abs(i) * 7)));
                colors.push(this.hslToHex(baseHue, toneSat, toneLight));
            }
            return this.uniqueHexColors([this.baseColor, ...colors]).slice(0, 5);
        }

        const offsets = this.getHarmonyOffsets(safeRule, safeSpread);
        const tones = [
            { satScale: 1, lightShift: 0 },
            { satScale: 0.95, lightShift: -10 },
            { satScale: 0.88, lightShift: 12 },
            { satScale: 0.82, lightShift: -16 },
            { satScale: 0.76, lightShift: 18 }
        ];

        offsets.forEach((offset, index) => {
            const tone = tones[index] || tones[0];
            const nextSat = Math.max(18, Math.min(92, baseSat * tone.satScale));
            const nextLight = Math.max(8, Math.min(92, baseLight + tone.lightShift));
            colors.push(this.hslToHex(baseHue + offset, nextSat, nextLight));
        });

        const merged = this.uniqueHexColors([this.baseColor, ...colors]);
        if (merged.length < 5) {
            const filler = this.generateMonochromaticPalette();
            return this.uniqueHexColors([...merged, ...filler]).slice(0, 5);
        }
        return merged.slice(0, 5);
    }

    applyHarmonyRule(options = {}) {
        const notify = options.notify !== false;
        const statusMessage = String(
            options.statusMessage
            || 'Harmonia aplicada com sucesso na paleta.'
        );
        const rule = this.getSelectedHarmonyRule();
        const spread = this.getHarmonySpread();
        const colors = this.applyCompositionDynamics(
            this.generateHarmonyPalette(rule, spread),
            { preserveBase: true }
        );
        const dynamicsLabel = this.getDynamicsProfileLabel();
        const dynamicsIntensity = Math.round(this.getDynamicsIntensity() * 100);
        const labels = {
            monochromatic: 'Monocromatica',
            analogous: 'Analogica',
            complementary: 'Complementar',
            triadic: 'Triadica',
            tetradic: 'Tetradica',
            splitComplementary: 'Split-complementar'
        };

        this.currentPaletteType = rule;
        document.querySelectorAll('.palette-btn').forEach((button) => {
            button.classList.toggle('active', button.dataset.type === this.currentPaletteType);
        });

        const title = `Paleta ${labels[rule] || labels.monochromatic} (manual)`;
        const description = `Regra ${labels[rule] || labels.monochromatic} aplicada com abertura de ${spread}deg. Dinâmica ${dynamicsLabel.toLowerCase()} em ${dynamicsIntensity}%.`;
        this.applyPaletteRendering(colors, title, description, statusMessage);
        if (notify) {
            this.showNotification(`Harmonia ${labels[rule] || labels.monochromatic} aplicada.`);
        }
    }

    drawHarmonyGuides(ctx, center, radius) {
        if (!ctx) {
            return;
        }

        const profile = this.getHarmonyProfile();
        const offsets = this.getHarmonyOffsets(profile.rule, profile.spread);
        if (!offsets.length) {
            this.lastHarmonyControlPoints = [];
            return;
        }
        const descriptors = this.getHarmonyHandleDescriptors(profile.rule);

        const [baseHue] = this.hexToHsl(this.baseColor);
        const points = offsets.map((offset) => {
            const angle = ((baseHue + offset - 90) * Math.PI) / 180;
            const x = center + (Math.cos(angle) * radius);
            const y = center + (Math.sin(angle) * radius);
            return { x, y, offset };
        });

        this.lastHarmonyControlPoints = points.map((point, index) => {
            const descriptor = descriptors[index] || { kind: 'rotate', constant: 0, multiplier: 0 };
            return {
                index,
                x: point.x,
                y: point.y,
                hue: (baseHue + point.offset + 360) % 360,
                offset: point.offset,
                kind: descriptor.kind,
                constant: descriptor.constant,
                multiplier: descriptor.multiplier,
                handleRadius: index === 0 ? 8 : 6
            };
        });

        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.32)';
        ctx.lineWidth = 1;
        points.forEach((point) => {
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        });
        ctx.restore();

        ctx.beginPath();
        points.forEach((point, index) => {
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        if (points.length > 2) {
            ctx.closePath();
        }
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        this.lastHarmonyControlPoints.forEach((point) => {
            const isActive = this.isWheelDragging
                && this.activeHarmonyControl
                && point.index === this.activeHarmonyControl.index;
            const radiusSize = isActive ? point.handleRadius + 1.4 : point.handleRadius;
            ctx.beginPath();
            ctx.arc(point.x, point.y, radiusSize, 0, Math.PI * 2);
            if (isActive) {
                ctx.fillStyle = point.kind === 'spread' ? '#dbeafe' : '#e2e8f0';
            } else {
                ctx.fillStyle = point.index === 0 ? '#0f172a' : '#ffffff';
            }
            ctx.fill();
            ctx.strokeStyle = point.kind === 'spread' ? '#1e40af' : '#0f172a';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    applyWheelRotation() {
        if (!this.wheelRotationInput) {
            return;
        }

        const offset = Number.parseInt(this.wheelRotationInput.value, 10);
        if (!Number.isFinite(offset) || offset === 0) {
            this.showNotification('Defina uma rotação diferente de zero para aplicar.');
            return;
        }

        this.rotateBaseHue(offset, {
            notify: false,
            statusMessage: 'Rotação aplicada na harmonização das cores.'
        });
        this.wheelRotationInput.value = '0';
        if (this.wheelRotationValue) {
            this.wheelRotationValue.textContent = '0deg';
        }
        this.showNotification('Rotação aplicada na harmonização das cores.');
    }

    drawColorWheel(colors) {
        if (!this.colorWheelCanvas) {
            return;
        }

        const ctx = this.colorWheelCanvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const size = this.colorWheelCanvas.width;
        const center = size / 2;
        const outerRadius = (size / 2) - 8;
        const innerRadius = outerRadius - 26;
        const maxPointRadius = Math.max(20, innerRadius - 18);
        this.lastWheelGeometry = {
            center,
            outerRadius,
            innerRadius,
            maxPointRadius
        };

        ctx.clearRect(0, 0, size, size);

        for (let i = 0; i < 360; i += 1) {
            ctx.beginPath();
            ctx.strokeStyle = `hsl(${i} 100% 50%)`;
            ctx.lineWidth = outerRadius - innerRadius;
            ctx.arc(center, center, outerRadius - ((outerRadius - innerRadius) / 2), (i - 1) * Math.PI / 180, i * Math.PI / 180);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.fillStyle = '#ffffff';
        ctx.arc(center, center, innerRadius - 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#dbe7fa';
        ctx.stroke();

        this.drawHarmonyGuides(ctx, center, innerRadius - 9);

        const safeColors = this.uniqueHexColors(colors).slice(0, 10);
        const points = [];
        safeColors.forEach((color, index) => {
            const [h, s] = this.hexToHsl(color);
            const radial = 18 + (maxPointRadius - 18) * (Math.max(12, s) / 100);
            const angle = ((h - 90) * Math.PI) / 180;
            const x = center + Math.cos(angle) * radial;
            const y = center + Math.sin(angle) * radial;
            points.push({ x, y, color, index });

            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.lineTo(x, y);
            ctx.strokeStyle = 'rgba(30, 64, 175, 0.28)';
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(x, y, index === 0 ? 8 : 6, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
        });
        this.wheelGuidePoints = points;

        const mode = this.getAccessibilityMode();
        const severity = this.getAccessibilitySeverity();
        if (mode !== 'normal') {
            const data = this.getAccessibilityConflictData(safeColors, mode, severity);
            if (data.conflicts.length) {
                ctx.save();
                ctx.setLineDash([5, 4]);
                data.conflicts.slice(0, 12).forEach((conflict) => {
                    const start = points[conflict.a];
                    const end = points[conflict.b];
                    if (!start || !end) {
                        return;
                    }
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.lineWidth = 1.2;
                    ctx.strokeStyle = conflict.distance < 20
                        ? 'rgba(220, 38, 38, 0.95)'
                        : 'rgba(249, 115, 22, 0.92)';
                    ctx.stroke();
                });
                ctx.restore();
            }
        }

        ctx.beginPath();
        ctx.arc(center, center, 10, 0, Math.PI * 2);
        ctx.fillStyle = this.baseColor;
        ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.3;
        ctx.stroke();
        if (!this.isWheelDragging) {
            this.updateWheelPointerInfo(this.baseColor);
        }
    }

    refreshGradientOptions(colors) {
        if (!this.gradientStartSelect || !this.gradientEndSelect) {
            return;
        }

        const uniqueColors = this.uniqueHexColors(colors);
        if (!uniqueColors.length) {
            return;
        }

        const previousStart = this.gradientStartSelect.value;
        const previousEnd = this.gradientEndSelect.value;
        const options = uniqueColors.map((color, index) => (
            `<option value="${color}">Cor ${index + 1} - ${color.toUpperCase()}</option>`
        )).join('');

        this.gradientStartSelect.innerHTML = options;
        this.gradientEndSelect.innerHTML = options;

        const start = uniqueColors.includes(previousStart) ? previousStart : uniqueColors[0];
        let end = uniqueColors.includes(previousEnd) ? previousEnd : (uniqueColors[1] || uniqueColors[0]);
        if (end === start && uniqueColors.length > 1) {
            end = uniqueColors[1];
        }

        this.gradientStartSelect.value = start;
        this.gradientEndSelect.value = end;
        this.renderGradientPreview();
    }

    getSelectedGradientColors() {
        const fallback = this.currentColors.slice(0, 2);
        const start = this.gradientStartSelect?.value || fallback[0] || this.baseColor;
        const end = this.gradientEndSelect?.value || fallback[1] || fallback[0] || this.baseColor;
        return {
            start: this.normalizeHex(start) || this.baseColor,
            end: this.normalizeHex(end) || this.baseColor
        };
    }

    getGradientCss() {
        const angle = Number.parseInt(this.gradientAngleInput?.value || '135', 10);
        const safeAngle = Number.isFinite(angle) ? angle : 135;
        const colors = this.getSelectedGradientColors();
        return `linear-gradient(${safeAngle}deg, ${colors.start} 0%, ${colors.end} 100%)`;
    }

    renderGradientPreview() {
        const gradient = this.getGradientCss();
        if (this.gradientPreview) {
            this.gradientPreview.style.background = gradient;
        }
        if (this.gradientCssCode) {
            this.gradientCssCode.textContent = `background: ${gradient};`;
        }
    }

    copyGradientCss() {
        if (!this.gradientCssCode) {
            return;
        }
        this.copyToClipboard(this.gradientCssCode.textContent.trim(), 'CSS do gradiente copiado!');
    }

    clampByte(value) {
        return Math.max(0, Math.min(255, Math.round(value)));
    }

    simulateColorVision(hex, mode = 'normal', severity = 1) {
        const rgb = this.hexToRgb(hex);
        const matrices = {
            normal: [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ],
            protanopia: [
                [0.56667, 0.43333, 0],
                [0.55833, 0.44167, 0],
                [0, 0.24167, 0.75833]
            ],
            deuteranopia: [
                [0.625, 0.375, 0],
                [0.7, 0.3, 0],
                [0, 0.3, 0.7]
            ],
            tritanopia: [
                [0.95, 0.05, 0],
                [0, 0.43333, 0.56667],
                [0, 0.475, 0.525]
            ]
        };

        const matrix = matrices[mode] || matrices.normal;
        const simulatedRgb = {
            r: this.clampByte((matrix[0][0] * rgb.r) + (matrix[0][1] * rgb.g) + (matrix[0][2] * rgb.b)),
            g: this.clampByte((matrix[1][0] * rgb.r) + (matrix[1][1] * rgb.g) + (matrix[1][2] * rgb.b)),
            b: this.clampByte((matrix[2][0] * rgb.r) + (matrix[2][1] * rgb.g) + (matrix[2][2] * rgb.b))
        };

        const safeSeverity = Math.max(0, Math.min(1, Number.isFinite(severity) ? severity : 1));
        const r = this.clampByte((rgb.r * (1 - safeSeverity)) + (simulatedRgb.r * safeSeverity));
        const g = this.clampByte((rgb.g * (1 - safeSeverity)) + (simulatedRgb.g * safeSeverity));
        const b = this.clampByte((rgb.b * (1 - safeSeverity)) + (simulatedRgb.b * safeSeverity));
        return this.rgbToHex(r, g, b);
    }

    renderAccessibilityTools(colors) {
        if (!this.visionSwatches || !this.visionConflicts) {
            return;
        }

        const mode = this.getAccessibilityMode();
        const severity = this.getAccessibilitySeverity();
        const data = this.getAccessibilityConflictData(colors, mode, severity);
        const simulated = data.simulated;

        this.visionSwatches.innerHTML = simulated.map((hex) => `
            <article class="vision-swatch">
                <div class="vision-swatch-tone" data-color="${hex}"></div>
                <div class="vision-swatch-code">${hex.toUpperCase()}</div>
            </article>
        `).join('');
        this.applyElementColors(this.visionSwatches, '.vision-swatch-tone', 'data-color');

        if (mode === 'normal') {
            this.visionConflicts.innerHTML = '<li class="ok">Selecione um modo de daltonismo para avaliar conflitos.</li>';
            this.latestConflictSuggestions = [];
            this.renderConflictSuggestions([]);
            this.renderWorkflowAssistant();
            return;
        }

        const conflicts = data.conflicts;
        const suggestions = this.buildConflictSuggestions(data.palette, mode, severity, conflicts);
        this.latestConflictSuggestions = suggestions;
        this.renderConflictSuggestions(suggestions);

        if (!conflicts.length) {
            this.visionConflicts.innerHTML = '<li class="ok">Nenhum conflito crítico encontrado para este modo de visão.</li>';
            this.renderWorkflowAssistant();
            return;
        }

        this.visionConflicts.innerHTML = conflicts.slice(0, 8).map((item) => (
            `<li>Cor ${item.a + 1} e Cor ${item.b + 1} podem conflitar (${item.distance}). Ajuste brilho ou matiz.</li>`
        )).join('');
        this.renderWorkflowAssistant();
    }

    getAccessibilityMode() {
        return String(this.colorVisionModeSelect?.value || 'normal');
    }

    getAccessibilitySeverity() {
        const raw = Number.parseInt(this.colorVisionSeverityInput?.value || '100', 10);
        if (!Number.isFinite(raw)) {
            return 1;
        }
        return Math.max(0, Math.min(1, raw / 100));
    }

    isPrimaryColorLockEnabled() {
        return Boolean(this.lockPrimaryColorInput?.checked);
    }

    getPrimaryColorIndex(palette) {
        const safePalette = this.uniqueHexColors(palette);
        if (!safePalette.length) {
            return -1;
        }

        const roleMap = this.buildRoleMap(safePalette);
        const primaryHex = this.normalizeHex(roleMap.primary);
        const index = safePalette.findIndex((color) => this.normalizeHex(color) === primaryHex);
        return index >= 0 ? index : 0;
    }

    getAccessibilityConflictData(colors, mode = 'normal', severity = 1) {
        const palette = this.uniqueHexColors(colors).slice(0, 10);
        const simulated = palette.map((color) => this.simulateColorVision(color, mode, severity));
        const conflicts = [];

        if (mode !== 'normal') {
            for (let i = 0; i < simulated.length; i += 1) {
                for (let j = i + 1; j < simulated.length; j += 1) {
                    const distance = this.getColorDistance(simulated[i], simulated[j]);
                    if (distance < 38) {
                        conflicts.push({
                            a: i,
                            b: j,
                            distance: Math.round(distance)
                        });
                    }
                }
            }
        }

        return { palette, simulated, conflicts };
    }

    createConflictAdjustedColor(hex, seed = 0, intensity = 1) {
        const [h, s, l] = this.hexToHsl(hex);
        const safeSeed = Number.isFinite(seed) ? seed : 0;
        const safeIntensity = Number.isFinite(intensity) ? intensity : 1;
        const hueShift = (18 + ((safeSeed % 5) * 6)) * safeIntensity;
        const direction = safeSeed % 2 === 0 ? 1 : -1;
        const satShift = direction > 0 ? 6 : -6;
        const lightShift = l < 50 ? 14 : -14;

        const nextS = Math.max(22, Math.min(92, s + satShift));
        const nextL = Math.max(8, Math.min(92, l + lightShift));
        return this.hslToHex(h + (direction * hueShift), nextS, nextL);
    }

    buildConflictSuggestions(palette, mode, severity, conflicts) {
        const lockPrimary = this.isPrimaryColorLockEnabled();
        const primaryIndex = lockPrimary ? this.getPrimaryColorIndex(palette) : -1;
        const suggestions = [];
        const usedTargets = new Set();

        conflicts.forEach((conflict, index) => {
            if (suggestions.length >= 8) {
                return;
            }

            let sourceIndex = conflict.a;
            let targetIndex = conflict.b;

            if (lockPrimary && targetIndex === primaryIndex) {
                if (sourceIndex === primaryIndex) {
                    return;
                }
                targetIndex = sourceIndex;
                sourceIndex = conflict.b;
            }

            if (lockPrimary && targetIndex === primaryIndex) {
                return;
            }

            if (usedTargets.has(targetIndex)) {
                return;
            }

            const sourceColor = palette[sourceIndex];
            const originalColor = palette[targetIndex];
            if (!sourceColor || !originalColor) {
                return;
            }

            const recommendedColor = this.createConflictAdjustedColor(
                originalColor,
                index + targetIndex + (sourceIndex * 2),
                conflict.distance < 20 ? 1.25 : 1
            );

            if (recommendedColor === originalColor) {
                return;
            }

            const simulatedSource = this.simulateColorVision(sourceColor, mode, severity);
            const simulatedTargetBefore = this.simulateColorVision(originalColor, mode, severity);
            const simulatedTargetAfter = this.simulateColorVision(recommendedColor, mode, severity);
            const beforeDistance = Math.round(this.getColorDistance(simulatedSource, simulatedTargetBefore));
            const afterDistance = Math.round(this.getColorDistance(simulatedSource, simulatedTargetAfter));

            suggestions.push({
                id: suggestions.length,
                mode,
                severity,
                sourceIndex,
                targetIndex,
                sourceColor,
                originalColor,
                recommendedColor,
                beforeDistance,
                afterDistance,
                primaryLocked: lockPrimary
            });
            usedTargets.add(targetIndex);
        });

        return suggestions;
    }

    renderConflictSuggestions(suggestions) {
        if (!this.conflictSuggestions) {
            return;
        }

        if (!Array.isArray(suggestions) || !suggestions.length) {
            this.conflictSuggestions.innerHTML = '<p class="saved-theme-meta">Sem sugestões no momento.</p>';
            return;
        }

        this.conflictSuggestions.innerHTML = suggestions.map((item) => `
            <article class="conflict-suggestion-item">
                <strong>Cor ${item.targetIndex + 1}: ${item.originalColor.toUpperCase()} -> ${item.recommendedColor.toUpperCase()}</strong>
                <p>Conflito com Cor ${item.sourceIndex + 1}. Distancia simulada: ${item.beforeDistance} -> ${item.afterDistance}.</p>
                <div class="conflict-suggestion-meta">
                    <span class="conflict-suggestion-chip">Modo: ${this.escapeHtml(item.mode)} | Sev: ${Math.round((item.severity || 1) * 100)}%</span>
                    ${item.primaryLocked ? '<span class="conflict-suggestion-chip">Primária travada</span>' : ''}
                    <button type="button" data-conflict-apply="${item.id}">Aplicar sugestao</button>
                </div>
            </article>
        `).join('');
    }

    applyConflictSuggestion(index) {
        const suggestion = this.latestConflictSuggestions[index];
        if (!suggestion) {
            return;
        }

        const colors = this.uniqueHexColors(this.currentColors);
        if (!colors[suggestion.targetIndex]) {
            return;
        }

        if (this.isPrimaryColorLockEnabled()) {
            const primaryIndex = this.getPrimaryColorIndex(colors);
            if (suggestion.targetIndex === primaryIndex) {
                this.showNotification('Cor primária travada. Escolha outro ajuste.');
                return;
            }
        }

        colors[suggestion.targetIndex] = suggestion.recommendedColor;
        const title = `Paleta ${this.currentPaletteType} (acessivel)`;
        const description = `Ajuste aplicado para reduzir conflito de visão (${suggestion.mode} ${Math.round((suggestion.severity || 1) * 100)}%).`;
        this.applyPaletteRendering(colors, title, description, 'Ajuste de acessibilidade aplicado com sucesso.');
    }

    autoFixAccessibilityConflicts() {
        const mode = this.getAccessibilityMode();
        const severity = this.getAccessibilitySeverity();
        if (mode === 'normal') {
            this.showNotification('Selecione um modo de daltonismo para corrigir conflitos.');
            return;
        }

        let workingColors = this.uniqueHexColors(this.currentColors).slice(0, 10);
        if (!workingColors.length) {
            this.showNotification('Gere uma paleta antes de aplicar ajustes.');
            return;
        }

        const lockPrimary = this.isPrimaryColorLockEnabled();
        const primaryIndex = lockPrimary ? this.getPrimaryColorIndex(workingColors) : -1;
        let hasChanges = false;
        let skippedByPrimaryLock = false;
        for (let pass = 0; pass < 4; pass += 1) {
            const data = this.getAccessibilityConflictData(workingColors, mode, severity);
            if (!data.conflicts.length) {
                break;
            }

            data.conflicts.forEach((conflict, index) => {
                let sourceIndex = conflict.a;
                let targetIndex = conflict.b;

                if (lockPrimary && targetIndex === primaryIndex) {
                    if (sourceIndex === primaryIndex) {
                        skippedByPrimaryLock = true;
                        return;
                    }
                    targetIndex = sourceIndex;
                    sourceIndex = conflict.b;
                }

                if (lockPrimary && targetIndex === primaryIndex) {
                    skippedByPrimaryLock = true;
                    return;
                }

                const baseColor = workingColors[targetIndex];
                if (!baseColor) {
                    return;
                }

                const adjusted = this.createConflictAdjustedColor(
                    baseColor,
                    (pass * 10) + index + targetIndex + (sourceIndex * 2),
                    conflict.distance < 20 ? 1.35 : 1
                );
                if (adjusted !== baseColor) {
                    workingColors[targetIndex] = adjusted;
                    hasChanges = true;
                }
            });
        }

        if (!hasChanges) {
            this.showNotification(
                skippedByPrimaryLock
                    ? 'Conflitos restantes dependem da cor primária travada.'
                    : 'Nenhum ajuste automático necessário para esta simulação.'
            );
            return;
        }

        const title = `Paleta ${this.currentPaletteType} (acessibilidade)`;
        const description = `Paleta ajustada automaticamente para reduzir conflitos no modo ${mode} (${Math.round(severity * 100)}%).`;
        this.applyPaletteRendering(
            workingColors,
            title,
            description,
            'Conflitos de acessibilidade reduzidos automaticamente.'
        );
    }

    getSavedThemes() {
        if (typeof localStorage === 'undefined') {
            return [];
        }
        try {
            const raw = localStorage.getItem(this.savedThemesStorageKey);
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                return [];
            }
            return parsed
                .filter((item) => item && typeof item === 'object')
                .map((item) => ({
                    id: String(item.id || ''),
                    name: String(item.name || 'Tema sem nome'),
                    tags: String(item.tags || ''),
                    type: String(item.type || 'monochromatic'),
                    baseColor: this.normalizeHex(item.baseColor) || '#3498db',
                    colors: this.uniqueHexColors(item.colors).slice(0, 10),
                    createdAt: String(item.createdAt || '')
                }))
                .filter((item) => item.id !== '' && item.colors.length > 0)
                .slice(0, 60);
        } catch (error) {
            return [];
        }
    }

    persistSavedThemes(themes) {
        if (typeof localStorage === 'undefined') {
            return;
        }
        try {
            localStorage.setItem(this.savedThemesStorageKey, JSON.stringify(themes));
        } catch (error) {
            // Mantém o fluxo visual sem bloquear em caso de limite de storage.
        }
    }

    saveCurrentTheme() {
        const colors = this.uniqueHexColors(this.currentColors);
        if (!colors.length) {
            this.showNotification('Gere uma paleta antes de salvar um tema.');
            return;
        }

        const name = String(this.themeNameInput?.value || '').trim() || `Tema ${new Date().toLocaleDateString('pt-BR')}`;
        const tags = String(this.themeTagsInput?.value || '').trim();
        const nextTheme = {
            id: `theme_${Date.now()}`,
            name: name.slice(0, 80),
            tags: tags.slice(0, 180),
            type: this.currentPaletteType,
            baseColor: this.baseColor,
            colors: colors.slice(0, 10),
            createdAt: new Date().toISOString()
        };

        const themes = this.getSavedThemes();
        themes.unshift(nextTheme);
        this.persistSavedThemes(themes.slice(0, 40));
        this.renderSavedThemes();

        if (this.themeNameInput) {
            this.themeNameInput.value = '';
        }
        this.showNotification('Tema salvo na biblioteca local.');
    }

    renderSavedThemes() {
        if (!this.savedThemesList) {
            return;
        }

        const themes = this.getSavedThemes();
        if (!themes.length) {
            this.savedThemesList.innerHTML = '<p class="saved-theme-meta">Nenhum tema salvo ainda.</p>';
            this.renderWorkflowAssistant();
            return;
        }

        this.savedThemesList.innerHTML = themes.map((theme) => `
            <article class="saved-theme-item">
                <div class="saved-theme-header">
                    <strong>${this.escapeHtml(theme.name)}</strong>
                    <span class="saved-theme-meta">${this.escapeHtml(theme.type)}</span>
                </div>
                <p class="saved-theme-meta">${this.escapeHtml(theme.tags || 'Sem tags')} | ${this.formatThemeDate(theme.createdAt)}</p>
                <div class="saved-theme-palette">
                    ${theme.colors.slice(0, 5).map((color) => `<span class="saved-theme-chip" data-color="${color}"></span>`).join('')}
                </div>
                <div class="saved-theme-actions">
                    <button type="button" data-theme-load="${theme.id}">Carregar</button>
                    <button type="button" data-theme-delete="${theme.id}">Remover</button>
                </div>
            </article>
        `).join('');
        this.applyElementColors(this.savedThemesList, '.saved-theme-chip', 'data-color');
        this.renderWorkflowAssistant();
    }

    formatThemeDate(iso) {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) {
            return '-';
        }
        return date.toLocaleDateString('pt-BR');
    }

    applyElementColors(root, selector, attributeName = 'data-color') {
        if (!root || !selector) {
            return;
        }
        root.querySelectorAll(selector).forEach((element) => {
            const color = String(element.getAttribute(attributeName) || '').trim();
            if (!color) {
                return;
            }
            element.style.backgroundColor = color;
        });
    }

    applyRoleSuggestionStyles(root) {
        if (!root) {
            return;
        }
        root.querySelectorAll('.role-item').forEach((item) => {
            const roleColor = String(item.getAttribute('data-role-color') || '').trim();
            const roleText = String(item.getAttribute('data-role-text') || '').trim();
            if (roleColor) {
                item.style.setProperty('--role-color', roleColor);
            }
            if (roleText) {
                item.style.setProperty('--role-text', roleText);
            }
        });
    }

    escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    applySavedTheme(themeId) {
        const id = String(themeId || '').trim();
        if (!id) {
            return;
        }

        const theme = this.getSavedThemes().find((item) => item.id === id);
        if (!theme) {
            return;
        }

        this.baseColor = theme.baseColor;
        this.currentPaletteType = this.allowedPaletteTypes.has(theme.type) ? theme.type : 'monochromatic';
        document.getElementById('baseColor').value = this.baseColor;
        document.getElementById('hexInput').value = this.baseColor;
        document.querySelectorAll('.palette-btn').forEach((button) => {
            button.classList.toggle('active', button.dataset.type === this.currentPaletteType);
        });

        const title = `Tema salvo: ${theme.name}`;
        const description = theme.tags ? `Tags: ${theme.tags}` : 'Tema carregado da biblioteca local.';
        this.applyPaletteRendering(theme.colors, title, description, `Tema "${theme.name}" aplicado.`);
        this.showNotification(`Tema "${theme.name}" aplicado.`);
    }

    deleteSavedTheme(themeId) {
        const id = String(themeId || '').trim();
        if (!id) {
            return;
        }

        const themes = this.getSavedThemes().filter((item) => item.id !== id);
        this.persistSavedThemes(themes);
        this.renderSavedThemes();
        this.showNotification('Tema removido da biblioteca.');
    }

    refreshAdobeInspiredTools(colors) {
        this.drawColorWheel(colors);
        this.refreshGradientOptions(colors);
        this.renderAccessibilityTools(colors);
    }

    buildCssTokens(roleMap) {
        const tokenPairs = [
            ['--brand-primary', roleMap.primary],
            ['--brand-secondary', roleMap.secondary],
            ['--brand-accent', roleMap.accent],
            ['--brand-neutral-light', roleMap.neutralLight],
            ['--brand-neutral-dark', roleMap.neutralDark]
        ];

        const textTokens = tokenPairs.map(([name, value]) => {
            const text = this.pickTextColor(value).text;
            return [`${name}-text`, text];
        });

        const lines = [...tokenPairs, ...textTokens]
            .map(([name, value]) => `  ${name}: ${String(value).toUpperCase()};`)
            .join('\n');

        return `:root {\n${lines}\n}\n`;
    }

    downloadTextFile(content, fileName, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    }

    generateMonochromaticPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Gerar 5 variações de luminosidade
        for (let i = 0; i < 5; i++) {
            const newL = Math.max(10, Math.min(90, l + (i - 2) * 15));
            colors.push(this.hslToHex(h, s, newL));
        }
        
        return colors;
    }

    generateAnalogousPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Cores análogas: ±30° no matiz
        for (let i = -2; i <= 2; i++) {
            const newH = h + (i * 30);
            colors.push(this.hslToHex(newH, s, l));
        }
        
        return colors;
    }

    generateComplementaryPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Cor base
        colors.push(this.baseColor);
        
        // Cor complementar (180° oposta)
        const complementaryH = (h + 180) % 360;
        colors.push(this.hslToHex(complementaryH, s, l));
        
        // Variações da cor base
        colors.push(this.hslToHex(h, s, Math.max(10, l - 20)));
        colors.push(this.hslToHex(h, s, Math.min(90, l + 20)));
        
        // Variação da complementar
        colors.push(this.hslToHex(complementaryH, s, Math.max(10, l - 20)));
        
        return colors;
    }

    generateTriadicPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Cores em tríade: 120° de diferença
        for (let i = 0; i < 3; i++) {
            const newH = (h + (i * 120)) % 360;
            colors.push(this.hslToHex(newH, s, l));
            
            // Adicionar uma variação mais clara
            if (i < 2) {
                colors.push(this.hslToHex(newH, s * 0.7, Math.min(90, l + 15)));
            }
        }
        
        return colors;
    }

    generateTetradicPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Cores em tetrádica: 90° de diferença
        for (let i = 0; i < 4; i++) {
            const newH = (h + (i * 90)) % 360;
            colors.push(this.hslToHex(newH, s, l));
        }
        
        // Adicionar uma variação neutra
        colors.push(this.hslToHex(h, s * 0.3, l));
        
        return colors;
    }

    generateSplitComplementaryPalette() {
        const [h, s, l] = this.hexToHsl(this.baseColor);
        const colors = [];
        
        // Cor base
        colors.push(this.baseColor);
        
        // Split complementar: 150° e 210°
        const split1 = (h + 150) % 360;
        const split2 = (h + 210) % 360;
        
        colors.push(this.hslToHex(split1, s, l));
        colors.push(this.hslToHex(split2, s, l));
        
        // Variações
        colors.push(this.hslToHex(h, s * 0.7, Math.min(90, l + 15)));
        colors.push(this.hslToHex(split1, s * 0.7, Math.min(90, l + 15)));
        
        return colors;
    }

    applyPaletteRendering(colors, title, description, statusMessage = '') {
        const normalizedColors = this.sanitizePaletteColors(colors);
        const roleMap = this.buildRoleMap(normalizedColors);
        const orderedColors = this.uniqueHexColors([
            roleMap.primary,
            roleMap.secondary,
            roleMap.accent,
            roleMap.neutralLight,
            roleMap.neutralDark,
            ...normalizedColors
        ]).slice(0, 5);

        this.currentColors = [...orderedColors];
        this.didManualSync = false;
        this.syncWheelLightnessWithBase();
        this.syncHarmonyControlsWithPaletteType(false);
        this.publishPaletteState(this.currentColors, title, description);
        this.displayPalette(this.currentColors, title, description, roleMap);
        this.renderRoleSuggestions(roleMap);
        this.renderContrastAudit(this.currentColors);
        this.renderTrendAndCombinationInsights(roleMap, this.currentColors);
        this.refreshAdobeInspiredTools(this.currentColors);
        this.updateBrandSyncStatus(
            statusMessage || 'Paleta sincronizada automaticamente com Mockups e relatório geral.'
        );
        this.renderWorkflowAssistant();
    }

    generatePalette() {
        let colors = [];
        let title = '';
        let description = '';
        this.syncWheelLightnessWithBase();

        switch (this.currentPaletteType) {
            case 'monochromatic':
                colors = this.generateMonochromaticPalette();
                title = 'Paleta Monocromática';
                description = 'Variações de saturação e luminosidade da mesma cor.';
                break;
            case 'analogous':
                colors = this.generateAnalogousPalette();
                title = 'Paleta Análoga';
                description = 'Cores adjacentes no círculo cromático.';
                break;
            case 'complementary':
                colors = this.generateComplementaryPalette();
                title = 'Paleta Complementar';
                description = 'Cores opostas no círculo cromático.';
                break;
            case 'triadic':
                colors = this.generateTriadicPalette();
                title = 'Paleta Tríade';
                description = 'Três cores igualmente espaçadas no círculo cromático.';
                break;
            case 'tetradic':
                colors = this.generateTetradicPalette();
                title = 'Paleta Tetrádica';
                description = 'Quatro cores formando um retângulo no círculo cromático.';
                break;
            case 'splitComplementary':
                colors = this.generateSplitComplementaryPalette();
                title = 'Paleta Split-Complementar';
                description = 'Cor base mais duas cores adjacentes à complementar.';
                break;
            default:
                colors = this.generateMonochromaticPalette();
                title = 'Paleta Monocromatica';
                description = 'Variações de saturação e luminosidade da mesma cor.';
                this.currentPaletteType = 'monochromatic';
                break;
        }

        this.applyPaletteRendering(colors, title, description);
    }

    displayPalette(colors, title, description, roleMap = {}) {
        document.getElementById('paletteTitle').textContent = title;
        document.getElementById('paletteDescription').textContent = description;

        const swatchesContainer = document.getElementById('colorSwatches');
        const colorListContainer = document.getElementById('colorList');

        swatchesContainer.innerHTML = '';
        colorListContainer.innerHTML = '';

        colors.forEach((color, index) => {
            // Criar swatch
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.dataset.hex = color;
            swatch.addEventListener('click', () => this.copyToClipboard(color));
            swatchesContainer.appendChild(swatch);

            // Criar item de detalhes
            const [h, s, l] = this.hexToHsl(color);
            const rgb = this.hexToRgb(color);
            const recommendedText = this.pickTextColor(color);
            const contrastBadge = this.getContrastBadge(recommendedText.ratio);
            const roleName = Object.entries(roleMap).find(([, value]) => value === color)?.[0] || '';
            const roleLabelMap = {
                primary: 'Primária',
                secondary: 'Secundária',
                accent: 'Acento',
                neutralLight: 'Neutra clara',
                neutralDark: 'Neutra escura'
            };

            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';
            colorItem.style.borderLeftColor = color;
            colorItem.innerHTML = `
                <h4>Cor ${index + 1}</h4>
                <div class="color-values">
                    <div>HEX: ${color}</div>
                    <div>RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}</div>
                    <div>HSL: ${Math.round(h)}deg, ${Math.round(s)}%, ${Math.round(l)}%</div>
                    <div>Papel: ${roleLabelMap[roleName] || 'Apoio'}</div>
                    <div>Texto recomendado: ${recommendedText.text.toUpperCase()} (${recommendedText.ratio.toFixed(2)}:1)</div>
                    <div>Nivel: <span class="contrast-inline ${contrastBadge.className}">${contrastBadge.label}</span></div>
                </div>
            `;
            colorListContainer.appendChild(colorItem);
        });
    }

    hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

    generateRandomColor() {
        const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        this.baseColor = randomHex;
        document.getElementById('baseColor').value = randomHex;
        document.getElementById('hexInput').value = randomHex;
        this.generatePalette();
    }

    copyToClipboard(color, successMessage = '') {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(color).then(() => {
                this.showNotification(successMessage || `Cor ${color} copiada!`);
            });
            return;
        }

        const temp = document.createElement('input');
        temp.value = color;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        this.showNotification(successMessage || `Cor ${color} copiada!`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copied-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
    }
    
    isPreviewImageVisible() {
        if (!this.previewImage) {
            return false;
        }
        if (!this.previewImage.src) {
            return false;
        }
        return window.getComputedStyle(this.previewImage).display !== 'none';
    }

    // Metodos para manipulacao de imagem e extracao de cores
    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImage.src = e.target.result;
            this.previewImage.style.display = 'block';
            this.uploadPlaceholder.style.display = 'none';
            
            // Desativar o color picker se estiver ativo
            if (this.isPickingColor) {
                this.toggleColorPicker();
            }
        };
        reader.readAsDataURL(file);
    }
    
    toggleColorPicker() {
        this.isPickingColor = !this.isPickingColor;
        
        if (this.isPickingColor) {
            this.activateColorPicker.classList.add('active');
            this.colorPickerTool.style.display = 'block';
        } else {
            this.activateColorPicker.classList.remove('active');
            this.colorPickerTool.style.display = 'none';
        }
    }
    
    updateColorPickerPosition(e) {
        const rect = this.imagePreview.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.colorPickerCrosshair.style.left = `${x}px`;
        this.colorPickerCrosshair.style.top = `${y}px`;
        
        // Obter a cor sob o cursor
        const color = this.getPixelColor(x, y);
        this.pickedColorPreview.style.backgroundColor = color;
        this.pickedColorHex.textContent = color;
    }
    
    getPixelColor(x, y) {
        // Redimensionar o canvas para o tamanho da imagem exibida
        const rect = this.previewImage.getBoundingClientRect();
        const scaleX = this.previewImage.naturalWidth / rect.width;
        const scaleY = this.previewImage.naturalHeight / rect.height;
        
        // Calcular a posição real do pixel na imagem original
        const imgX = Math.floor(x * scaleX);
        const imgY = Math.floor(y * scaleY);
        
        // Desenhar a imagem no canvas e obter os dados do pixel
        this.canvas.width = this.previewImage.naturalWidth;
        this.canvas.height = this.previewImage.naturalHeight;
        this.ctx.drawImage(this.previewImage, 0, 0);
        
        const pixelData = this.ctx.getImageData(imgX, imgY, 1, 1).data;
        const [r, g, b] = pixelData;
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    pickColor(e) {
        const rect = this.imagePreview.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const color = this.getPixelColor(x, y);
        this.baseColor = color;
        document.getElementById('baseColor').value = color;
        document.getElementById('hexInput').value = color;
        
        this.generatePalette();
        this.addExtractedColor(color);
        this.showNotification(`Cor ${color} selecionada como cor base`);
    }
    
    addExtractedColor(color) {
        const colorElement = document.createElement('div');
        colorElement.className = 'extracted-color';
        colorElement.innerHTML = `
            <div class="extracted-color-swatch" data-color="${color}"></div>
            <div class="extracted-color-hex">${color}</div>
        `;
        this.applyElementColors(colorElement, '.extracted-color-swatch', 'data-color');
        
        // Adicionar evento de clique para usar como cor base
        colorElement.querySelector('.extracted-color-swatch').addEventListener('click', () => {
            this.baseColor = color;
            document.getElementById('baseColor').value = color;
            document.getElementById('hexInput').value = color;
            this.generatePalette();
            this.showNotification(`Cor ${color} selecionada como cor base`);
        });
        
        this.extractedColorsList.appendChild(colorElement);
    }
    
    findDominantColors() {
        // Limpar cores extraídas anteriormente
        this.extractedColorsList.innerHTML = '';
        
        try {
            // Usar Color Thief para extrair a paleta de cores
            const colorThief = new ColorThief();
            
            // Verificar se a imagem está completamente carregada
            if (!this.previewImage.complete) {
                this.previewImage.onload = () => this.findDominantColors();
                return;
            }
            
            // Obter a cor dominante
            const dominantColor = colorThief.getColor(this.previewImage);
            const dominantHex = this.rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2]);
            
            // Obter uma paleta de cores (até 8 cores)
            const palette = colorThief.getPalette(this.previewImage, 8);
            const paletteHex = palette.map(color => this.rgbToHex(color[0], color[1], color[2]));
            
            // Adicionar a cor dominante primeiro
            this.addExtractedColor(dominantHex);
            
            // Adicionar o restante da paleta
            paletteHex.forEach(color => {
                // Evitar duplicatas
                if (color !== dominantHex) {
                    this.addExtractedColor(color);
                }
            });
            
            // Usar a cor dominante como cor base
            this.baseColor = dominantHex;
            document.getElementById('baseColor').value = dominantHex;
            document.getElementById('hexInput').value = dominantHex;
            this.generatePalette();
            
            this.showNotification('Cores dominantes detectadas!');
        } catch (error) {
            console.error('Erro ao detectar cores dominantes:', error);
            
            // Fallback para o método anterior se Color Thief falhar
            this.findDominantColorsFallback();
        }
    }
    
    rgbToHex(r, g, b) {
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    findDominantColorsFallback() {
        // Método alternativo para extrair cores dominantes
        // Redimensionar o canvas para reduzir a quantidade de pixels a processar
        const maxDimension = 100;
        const aspectRatio = this.previewImage.naturalWidth / this.previewImage.naturalHeight;
        
        let width, height;
        if (aspectRatio > 1) {
            width = maxDimension;
            height = Math.floor(maxDimension / aspectRatio);
        } else {
            width = Math.floor(maxDimension * aspectRatio);
            height = maxDimension;
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.drawImage(this.previewImage, 0, 0, width, height);
        
        const imageData = this.ctx.getImageData(0, 0, width, height).data;
        const colorCounts = {};
        
        // Contar ocorrências de cada cor (agrupando cores semelhantes)
        for (let i = 0; i < imageData.length; i += 4) {
            const r = Math.floor(imageData[i] / 10) * 10;
            const g = Math.floor(imageData[i + 1] / 10) * 10;
            const b = Math.floor(imageData[i + 2] / 10) * 10;
            
            // Ignorar pixels transparentes
            if (imageData[i + 3] < 128) continue;
            
            const color = this.rgbToHex(r, g, b);
            colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
        
        // Converter para array e ordenar por frequência
        const sortedColors = Object.entries(colorCounts)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0]);
        
        // Filtrar cores muito semelhantes
        const distinctColors = this.filterSimilarColors(sortedColors.slice(0, 20));
        
        // Exibir as cores dominantes (limitando a 8)
        distinctColors.slice(0, 8).forEach(color => {
            this.addExtractedColor(color);
        });
        
        // Usar a cor mais dominante como cor base
        if (distinctColors.length > 0) {
            this.baseColor = distinctColors[0];
            document.getElementById('baseColor').value = distinctColors[0];
            document.getElementById('hexInput').value = distinctColors[0];
            this.generatePalette();
        }
        
        this.showNotification('Cores dominantes detectadas!');
    }
    
    filterSimilarColors(colors) {
        const distinctColors = [];
        
        for (const color of colors) {
            // Verificar se esta cor é significativamente diferente das já selecionadas
            let isDistinct = true;
            
            for (const existingColor of distinctColors) {
                const distance = this.getColorDistance(color, existingColor);
                if (distance < 30) { // Limiar de similaridade
                    isDistinct = false;
                    break;
                }
            }
            
            if (isDistinct) {
                distinctColors.push(color);
            }
            
            // Limitar a 8 cores distintas
            if (distinctColors.length >= 8) break;
        }
        
        return distinctColors;
    }
    
    getColorDistance(color1, color2) {
        // Converter cores para RGB
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        // Calcular distância euclidiana no espaço RGB
        return Math.sqrt(
            Math.pow(rgb1.r - rgb2.r, 2) +
            Math.pow(rgb1.g - rgb2.g, 2) +
            Math.pow(rgb1.b - rgb2.b, 2)
        );
    }

    exportPalette() {
        const colors = this.uniqueHexColors(this.currentColors);
        const roleMap = this.buildRoleMap(colors);
        const contrast = this.buildContrastPayload(colors).map((item) => ({
            color: item.color,
            recommendedText: item.recommendedText,
            ratio: item.ratio,
            level: item.level
        }));
        const combinations = this.buildCombinationSuggestions(roleMap, colors);
        const trends = this.buildTrendSuggestions(roleMap, colors);
        const summary = this.insightSummary ? this.insightSummary.textContent : '';

        const paletteData = {
            type: this.currentPaletteType,
            baseColor: this.normalizeHex(this.baseColor),
            harmony: this.getHarmonyProfile(),
            sectorProfile: this.getSectorProfile(),
            colors,
            roles: roleMap,
            combinations,
            trends,
            contrast,
            summary,
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(paletteData, null, 2);
        this.downloadTextFile(
            dataStr,
            `paleta-${this.currentPaletteType}-${Date.now()}.json`,
            'application/json'
        );
        this.showNotification('Paleta exportada com sucesso!');
    }

    exportCssTokens() {
        const colors = this.uniqueHexColors(this.currentColors);
        if (!colors.length) {
            this.showNotification('Gere uma paleta antes de exportar os tokens.');
            return;
        }

        const roleMap = this.buildRoleMap(colors);
        const cssTokens = this.buildCssTokens(roleMap);
        this.downloadTextFile(
            cssTokens,
            `paleta-${this.currentPaletteType}-tokens-${Date.now()}.css`,
            'text/css'
        );
        this.showNotification('Tokens CSS exportados com sucesso!');
    }
}

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    new ColorPaletteGenerator();
});

