(function initAQWorkflowAssistant(window, document) {
    'use strict';

    const STORAGE_KEY = 'aq_tool_workflow_state_v1';
    const MOCKUPS_STORAGE_KEY = 'mockuphub_saved_edits_v1';
    const OG_SETTINGS_STORAGE_KEY = 'ogImageSettings';

    const body = document.body;
    if (!body || !body.classList.contains('aq-tool-fluid')) {
        return;
    }

    const context = detectContext();
    if (!context) {
        return;
    }

    // Color Palette already has its own dedicated workflow panel.
    if (context.key === 'colorpalette' && document.getElementById('workflowSteps')) {
        return;
    }

    const storage = createStorageDriver();
    const ui = mountAssistant(context);
    if (!ui) {
        return;
    }

    bindTrackers(context, markFlag);
    render();

    function render() {
        const flags = readFlags();
        const workflow = buildWorkflow(context, flags);
        const steps = Array.isArray(workflow.steps) ? workflow.steps : [];

        const completed = steps.filter((step) => Boolean(step.done)).length;
        const total = steps.length;
        const nextStep = steps.find((step) => !step.done) || null;

        ui.title.textContent = workflow.title || 'Fluxo Guiado';
        ui.summary.textContent = workflow.summary || 'Siga as etapas para manter consistência da ferramenta.';
        ui.progress.textContent = `${completed}/${total}`;
        ui.hint.textContent = workflow.hint || '';

        ui.steps.innerHTML = steps.map((step, index) => {
            const doneClass = step.done ? ' is-done' : '';
            const activeClass = !step.done && nextStep && nextStep.id === step.id ? ' is-active' : '';
            const stepNumber = index + 1;
            return `
                <article class="aq-workflow-step${doneClass}${activeClass}" data-step-id="${escapeHtml(step.id)}">
                    <span class="aq-workflow-step-index">${stepNumber}</span>
                    <div class="aq-workflow-step-body">
                        <strong>${escapeHtml(step.title || `Etapa ${stepNumber}`)}</strong>
                        <p>${escapeHtml(step.description || '')}</p>
                    </div>
                </article>
            `;
        }).join('');

        ui.primaryButton.textContent = nextStep
            ? (nextStep.actionLabel || `Executar: ${nextStep.title || 'próximo passo'}`)
            : 'Fluxo concluido';
        ui.primaryButton.disabled = !nextStep;
        ui.primaryButton.onclick = () => {
            if (!nextStep || typeof nextStep.action !== 'function') {
                return;
            }
            nextStep.action();
            // Re-render shortly after actions that may mutate DOM/state.
            window.setTimeout(render, 120);
        };

        ui.secondaryButton.textContent = workflow.secondaryLabel || 'Abrir BrandBook';
        ui.secondaryButton.onclick = () => {
            if (typeof workflow.secondaryAction === 'function') {
                workflow.secondaryAction();
                window.setTimeout(render, 120);
            }
        };
    }

    function buildWorkflow(currentContext, flags) {
        const key = currentContext.key;
        const helpers = {
            flags,
            snapshot: getBrandSnapshot(),
            hasBrandbookData: hasBrandbookData,
            hasSavedMockups: hasSavedMockups,
            hasImageSrc,
            hasHref,
            isVisible,
            textValue,
            metricCount,
            markFlag,
            navigateTo,
            clickSelector
        };

        if (key === 'coloradvisor') {
            return buildColorAdvisorFlow(helpers);
        }
        if (key === 'fontadvisor') {
            return buildFontAdvisorFlow(helpers);
        }
        if (key === 'bgremove') {
            return buildBgRemoveFlow(helpers);
        }
        if (key === 'ocimage') {
            return buildOgImageFlow(helpers);
        }
        if (key === 'brandmanual') {
            return buildBrandManualFlow(helpers);
        }
        if (key === 'brandbook') {
            return buildBrandBookFlow(helpers);
        }
        if (key === 'finalframe') {
            return buildFinalFrameFlow(helpers);
        }
        if (key === 'mockups_upload') {
            return buildMockupsUploadFlow(helpers);
        }
        if (key === 'mockups_editor') {
            return buildMockupsEditorFlow(helpers);
        }
        if (key === 'mockups_results') {
            return buildMockupsResultsFlow(helpers);
        }
        if (key === 'mockups_report') {
            return buildMockupsReportFlow(helpers);
        }
        return {
            title: 'Fluxo Guiado',
            summary: 'Fluxo genérico aplicado nesta ferramenta.',
            hint: '',
            secondaryLabel: 'Abrir BrandBook',
            secondaryAction: () => navigateTo('../brandbook/', 'opened_brandbook'),
            steps: []
        };
    }

    function buildColorAdvisorFlow(h) {
        const paletteReady = document.querySelectorAll('#palettePreview .swatch').length > 0;
        const synced = sourceHas(['coloradvisor'], [
            h.snapshot?.colorPalette?.source,
            h.snapshot?.brandKit?.palette?.source,
            h.snapshot?.brandInsights?.source
        ]);
        const exported = Boolean(h.flags.export_json || h.flags.export_pdf);

        return {
            title: 'Fluxo Guiado - Color Strategy Advisor',
            summary: 'Use o diagnóstico, gere a estratégia e consolide os dados no BrandBook.',
            hint: 'A lógica segue: diagnosticar -> gerar -> sincronizar -> exportar -> consolidar.',
            secondaryLabel: 'Abrir BrandBook',
            secondaryAction: () => h.navigateTo('../brandbook/', 'opened_brandbook'),
            steps: [
                {
                    id: 'diagnostic',
                    title: 'Ajustar diagnóstico',
                    description: 'Defina objetivo, público, contexto e densidade de conteúdo.',
                    done: Boolean(h.flags.form_touched),
                    actionLabel: 'Ir para diagnóstico',
                    action: () => focusSelector('#objective')
                },
                {
                    id: 'strategy',
                    title: 'Gerar estratégia',
                    description: 'Monte a paleta recomendada e ranking de cores.',
                    done: Boolean(h.flags.generated && paletteReady),
                    actionLabel: 'Gerar estratégia',
                    action: () => h.clickSelector('#strategyForm button[type="submit"]', 'generated')
                },
                {
                    id: 'sync',
                    title: 'Sincronizar Brand Kit',
                    description: 'Enviar paleta e insights para integração entre ferramentas.',
                    done: synced,
                    actionLabel: 'Atualizar estratégia',
                    action: () => h.clickSelector('#strategyForm button[type="submit"]', 'generated')
                },
                {
                    id: 'export',
                    title: 'Exportar resultado',
                    description: 'Gere JSON ou PDF para documentação rápida.',
                    done: exported,
                    actionLabel: 'Exportar JSON',
                    action: () => h.clickSelector('#exportJsonBtn', 'export_json')
                },
                {
                    id: 'consolidate',
                    title: 'Consolidar no BrandBook',
                    description: 'Validar tudo em um relatório único.',
                    done: Boolean(h.flags.opened_brandbook),
                    actionLabel: 'Abrir BrandBook',
                    action: () => h.navigateTo('../brandbook/', 'opened_brandbook')
                }
            ]
        };
    }

    function buildFontAdvisorFlow(h) {
        const rankingReady = document.querySelectorAll('#fontCards .font-card').length > 0;
        const synced = sourceHas(['fontadvisor'], [
            h.snapshot?.fontProfile?.source,
            h.snapshot?.brandKit?.typography?.source
        ]);
        const exported = Boolean(h.flags.exported_profile);

        return {
            title: 'Fluxo Guiado - Font Strategy Advisor',
            summary: 'Defina o perfil tipográfico e sincronize com o ecossistema de marca.',
            hint: 'Diagnóstico tipográfico -> recomendação -> sincronização -> exportação -> BrandBook.',
            secondaryLabel: 'Abrir BrandBook',
            secondaryAction: () => h.navigateTo('../brandbook/', 'opened_brandbook'),
            steps: [
                {
                    id: 'diagnostic',
                    title: 'Configurar diagnóstico',
                    description: 'Escolha segmento, tom, canal e nível de legibilidade.',
                    done: Boolean(h.flags.form_touched),
                    actionLabel: 'Ir para diagnóstico',
                    action: () => focusSelector('#industry')
                },
                {
                    id: 'generate',
                    title: 'Gerar recomendação',
                    description: 'Crie par tipográfico e ranking das melhores fontes.',
                    done: Boolean(h.flags.generated && rankingReady),
                    actionLabel: 'Gerar recomendação',
                    action: () => h.clickSelector('#generateFontStrategyBtn', 'generated')
                },
                {
                    id: 'sync',
                    title: 'Aplicar no Brand Kit',
                    description: 'Sincronize a tipografia para uso nas outras ferramentas.',
                    done: synced,
                    actionLabel: 'Aplicar ao Brand Kit',
                    action: () => h.clickSelector('#applyFontProfileBtn')
                },
                {
                    id: 'export',
                    title: 'Exportar perfil',
                    description: 'Baixe o JSON tipográfico para histórico do projeto.',
                    done: exported,
                    actionLabel: 'Exportar JSON',
                    action: () => h.clickSelector('#exportFontProfileBtn', 'exported_profile')
                },
                {
                    id: 'consolidate',
                    title: 'Consolidar no BrandBook',
                    description: 'Conferir combinação de fontes junto com cores e mockups.',
                    done: Boolean(h.flags.opened_brandbook),
                    actionLabel: 'Abrir BrandBook',
                    action: () => h.navigateTo('../brandbook/', 'opened_brandbook')
                }
            ]
        };
    }

    function buildBgRemoveFlow(h) {
        const uploaded = h.hasImageSrc('#originalImage');
        const processed = isActiveSection('#resultSection') && h.hasImageSrc('#processedImage');
        const adjusted = Boolean(h.flags.settings_changed || h.flags.brush_used);
        const exported = Boolean(h.flags.downloaded || h.hasHref('#downloadBtn') || h.hasHref('#downloadAdjustedBtn'));

        return {
            title: 'Fluxo Guiado - Background Remover',
            summary: 'Recorte, refine e consolide o resultado no relatório final.',
            hint: 'Upload -> ajuste de recorte -> resultado -> exportação -> FinalFrame.',
            secondaryLabel: 'Abrir FinalFrame',
            secondaryAction: () => h.navigateTo('../finalframe/', 'opened_finalframe'),
            steps: [
                {
                    id: 'upload',
                    title: 'Enviar imagem',
                    description: 'Carregue a arte principal para iniciar o recorte.',
                    done: uploaded,
                    actionLabel: 'Selecionar imagem',
                    action: () => clickSelectorSafe('#fileInput')
                },
                {
                    id: 'adjust',
                    title: 'Ajustar recorte',
                    description: 'Configure tolerância, modo e refinamentos manuais.',
                    done: adjusted,
                    actionLabel: 'Ir para ajustes',
                    action: () => focusSelector('#tolerance')
                },
                {
                    id: 'process',
                    title: 'Processar e validar',
                    description: 'Confirme o resultado final no painel comparativo.',
                    done: processed,
                    actionLabel: 'Reprocessar',
                    action: () => clickSelectorSafe('#applyAdjustBtn')
                },
                {
                    id: 'export',
                    title: 'Exportar recorte',
                    description: 'Baixe a versão pronta para aplicação em materiais.',
                    done: exported,
                    actionLabel: 'Baixar imagem',
                    action: () => {
                        if (!clickSelectorSafe('#downloadBtn')) {
                            clickSelectorSafe('#downloadAdjustedBtn');
                        }
                    }
                },
                {
                    id: 'handoff',
                    title: 'Consolidar no FinalFrame',
                    description: 'Abra o relatório final para validar o recorte junto aos demais módulos.',
                    done: Boolean(h.flags.opened_finalframe),
                    actionLabel: 'Abrir FinalFrame',
                    action: () => h.navigateTo('../finalframe/', 'opened_finalframe')
                }
            ]
        };
    }

    function buildOgImageFlow(h) {
        const title = textValue('#title');
        const description = textValue('#description');
        const brand = textValue('#brand');
        const contentReady = Boolean(h.flags.form_touched && title && description && brand);
        const visualReady = Boolean(h.flags.visual_touched);
        const ogSynced = isOgProfileReady(h.snapshot) || hasOgFallbackSettings();
        const exported = Boolean(h.flags.exported || h.flags.code_generated);

        return {
            title: 'Fluxo Guiado - OG Image',
            summary: 'Defina diretriz social, gere imagem OG e sincronize no ecossistema.',
            hint: 'Conteúdo -> visual -> sincronização OG -> exportação -> BrandBook.',
            secondaryLabel: 'Abrir BrandBook',
            secondaryAction: () => h.navigateTo('../brandbook/', 'opened_brandbook'),
            steps: [
                {
                    id: 'content',
                    title: 'Definir conteúdo',
                    description: 'Ajuste título, descrição e marca para o card social.',
                    done: contentReady,
                    actionLabel: 'Ir para título',
                    action: () => focusSelector('#title')
                },
                {
                    id: 'visual',
                    title: 'Ajustar visual',
                    description: 'Escolha template, cores e elementos de fundo.',
                    done: visualReady,
                    actionLabel: 'Atualizar pré-visualização',
                    action: () => {
                        if (!clickSelectorSafe('.update-btn')) {
                            clickSelectorSafe('#downloadButton');
                        }
                    }
                },
                {
                    id: 'sync',
                    title: 'Salvar diretriz OG',
                    description: 'Persistir configurações para uso no BrandBook.',
                    done: ogSynced,
                    actionLabel: 'Salvar configuração',
                    action: () => clickSelectorSafe('.update-btn')
                },
                {
                    id: 'export',
                    title: 'Exportar ativo',
                    description: 'Baixar imagem ou código para aplicação imediata.',
                    done: exported,
                    actionLabel: 'Exportar imagem',
                    action: () => {
                        if (!clickSelectorSafe('.export-btn')) {
                            clickSelectorSafe('#downloadButton');
                        }
                    }
                },
                {
                    id: 'consolidate',
                    title: 'Consolidar no BrandBook',
                    description: 'Validar diretriz OG junto com paleta e mockups.',
                    done: Boolean(h.flags.opened_brandbook),
                    actionLabel: 'Abrir BrandBook',
                    action: () => h.navigateTo('../brandbook/', 'opened_brandbook')
                }
            ]
        };
    }

    function buildBrandManualFlow(h) {
        const paletteReady = document.querySelectorAll('#paletteGrid .palette-item, #paletteGrid article, #paletteGrid div').length > 0;
        const mockupsReady = document.querySelectorAll('#mockupsGrid .mockup-card, #mockupsGrid article').length > 0;
        const integrationReady = paletteReady || mockupsReady;
        const exported = Boolean(
            h.flags.exported_json || h.flags.exported_pdf || h.flags.exported_html || h.flags.printed
        );
        const refreshed = Boolean(h.flags.refreshed || textValue('#statusLine') !== 'Aguardando consolidação de dados.');

        return {
            title: 'Fluxo Guiado - Brand Manual',
            summary: 'Consolide os dados de marca e gere materiais de apresentação.',
            hint: 'Atualizar -> template -> revisar integrações -> exportar -> BrandBook.',
            secondaryLabel: 'Abrir BrandBook',
            secondaryAction: () => h.navigateTo('../brandbook/', 'opened_brandbook'),
            steps: [
                {
                    id: 'refresh',
                    title: 'Atualizar dados',
                    description: 'Carregue snapshot mais recente de paleta, tipografia e mockups.',
                    done: refreshed,
                    actionLabel: 'Atualizar painel',
                    action: () => h.clickSelector('#refreshBtn', 'refreshed')
                },
                {
                    id: 'template',
                    title: 'Escolher template',
                    description: 'Selecione o layout base do brandbook para entrega.',
                    done: Boolean(h.flags.template_selected),
                    actionLabel: 'Selecionar template',
                    action: () => focusSelector('#templateGrid')
                },
                {
                    id: 'integrate',
                    title: 'Revisar integrações',
                    description: 'Verifique cores, tipografia e aplicações em mockups.',
                    done: integrationReady,
                    actionLabel: 'Ir para painel de integração',
                    action: () => scrollIntoViewSafe('#integrationNotes')
                },
                {
                    id: 'export',
                    title: 'Exportar material',
                    description: 'Gere JSON, PDF ou HTML standalone para entrega.',
                    done: exported,
                    actionLabel: 'Baixar JSON',
                    action: () => h.clickSelector('#downloadJsonBtn', 'exported_json')
                },
                {
                    id: 'consolidate',
                    title: 'Consolidar no BrandBook',
                    description: 'Cruze resultados finais no painel central da marca.',
                    done: Boolean(h.flags.opened_brandbook),
                    actionLabel: 'Abrir BrandBook',
                    action: () => h.navigateTo('../brandbook/', 'opened_brandbook')
                }
            ]
        };
    }

    function buildBrandBookFlow(h) {
        const colors = h.metricCount('#metricColorCount');
        const combinations = h.metricCount('#metricCombinationCount');
        const trends = h.metricCount('#metricTrendCount');
        const integrationItems = document.querySelectorAll('#integrationStatus li').length;
        const exported = Boolean(h.flags.payload_copied || h.flags.payload_downloaded);

        return {
            title: 'Fluxo Guiado - BrandBook',
            summary: 'Centralize as informações de marca e valide consistência do projeto.',
            hint: 'Atualizar -> revisar integração -> checar insights -> exportar -> manual.',
            secondaryLabel: 'Abrir Brand Manual',
            secondaryAction: () => h.navigateTo('../brandmanual/', 'opened_brandmanual'),
            steps: [
                {
                    id: 'refresh',
                    title: 'Atualizar relatório',
                    description: 'Recarregue dados consolidados do ecossistema.',
                    done: Boolean(h.flags.refreshed || colors > 0),
                    actionLabel: 'Atualizar relatório',
                    action: () => h.clickSelector('#refreshReportBtn', 'refreshed')
                },
                {
                    id: 'integration',
                    title: 'Revisar integração',
                    description: 'Validar estados de cor, fonte, mockups e OG.',
                    done: integrationItems > 0,
                    actionLabel: 'Ver integração',
                    action: () => scrollIntoViewSafe('#integrationStatus')
                },
                {
                    id: 'insights',
                    title: 'Checar insights',
                    description: 'Confirmar combinações e tendências alinhadas.',
                    done: combinations > 0 && trends > 0,
                    actionLabel: 'Ver insights',
                    action: () => scrollIntoViewSafe('#combinationList')
                },
                {
                    id: 'export',
                    title: 'Exportar payload',
                    description: 'Copiar ou baixar JSON consolidado do BrandBook.',
                    done: exported,
                    actionLabel: 'Copiar JSON',
                    action: () => h.clickSelector('#copyPayloadBtn', 'payload_copied')
                },
                {
                    id: 'handoff',
                    title: 'Abrir Brand Manual',
                    description: 'Levar consolidação para material final de apresentação.',
                    done: Boolean(h.flags.opened_brandmanual),
                    actionLabel: 'Abrir Brand Manual',
                    action: () => h.navigateTo('../brandmanual/', 'opened_brandmanual')
                }
            ]
        };
    }

    function buildFinalFrameFlow(h) {
        const payloadReady = Boolean(textValue('#finalframePayload'));
        const exported = Boolean(h.flags.exported_json || h.flags.copied_json);
        const hasBgremove = Boolean(h.snapshot?.bgremove?.hasResult);
        const hasMockups = Boolean(h.hasSavedMockups());

        return {
            title: 'Fluxo Guiado - FinalFrame',
            summary: 'Relatório final com visão integrada de marca, mockups, OG e recorte.',
            hint: 'Atualizar -> validar integrações -> exportar -> entregar.',
            secondaryLabel: 'Abrir Brand Manual',
            secondaryAction: () => h.navigateTo('../brandmanual/', 'opened_brandmanual'),
            steps: [
                {
                    id: 'refresh',
                    title: 'Atualizar consolidação',
                    description: 'Recarregue os dados mais recentes das ferramentas integradas.',
                    done: Boolean(h.flags.refreshed && payloadReady),
                    actionLabel: 'Atualizar relatório',
                    action: () => h.clickSelector('#refreshReportBtn', 'refreshed')
                },
                {
                    id: 'validate',
                    title: 'Validar integrações',
                    description: 'Confirme mockups e background remover presentes no pacote final.',
                    done: Boolean(hasBgremove && hasMockups),
                    actionLabel: 'Abrir mockups',
                    action: () => h.navigateTo('../mockups/editor.php', 'opened_mockups')
                },
                {
                    id: 'export',
                    title: 'Exportar JSON',
                    description: 'Baixe ou copie o payload consolidado para documentação e entrega.',
                    done: exported,
                    actionLabel: 'Baixar JSON',
                    action: () => h.clickSelector('#downloadPayloadBtn', 'exported_json')
                },
                {
                    id: 'handoff',
                    title: 'Fechar entrega',
                    description: 'Leve o pacote consolidado para o Brand Manual.',
                    done: Boolean(h.flags.opened_brandmanual),
                    actionLabel: 'Abrir Brand Manual',
                    action: () => h.navigateTo('../brandmanual/', 'opened_brandmanual')
                }
            ]
        };
    }

    function buildMockupsUploadFlow(h) {
        const previewVisible = isVisible('#previewWrap');
        const continueEnabled = String(getAttributeSafe('#continueBtn', 'aria-disabled')) === 'false';

        return {
            title: 'Fluxo Guiado - Mockups (Entrada)',
            summary: 'Valide a arte de entrada antes de seguir para edição e relatórios.',
            hint: 'Upload -> validação -> editor -> resultados -> consolidação.',
            secondaryLabel: 'Abrir BrandBook',
            secondaryAction: () => h.navigateTo('../brandbook/', 'opened_brandbook'),
            steps: [
                {
                    id: 'upload',
                    title: 'Enviar arquivo',
                    description: 'Carregue arte em alta resolução para validação técnica.',
                    done: previewVisible,
                    actionLabel: 'Selecionar arquivo',
                    action: () => clickSelectorSafe('#workFileInput')
                },
                {
                    id: 'validate',
                    title: 'Validar requisitos',
                    description: 'Confirmar formato, tamanho e resolução mínima.',
                    done: continueEnabled,
                    actionLabel: 'Ver validação',
                    action: () => scrollIntoViewSafe('#validationPanel')
                },
                {
                    id: 'editor',
                    title: 'Ir para editor',
                    description: 'Abrir ambiente de composição dos mockups.',
                    done: Boolean(h.flags.opened_editor),
                    actionLabel: 'Abrir editor',
                    action: () => h.navigateTo('./editor.php', 'opened_editor')
                },
                {
                    id: 'results',
                    title: 'Gerar resultados',
                    description: 'Validar vitrine final de mockups renderizados.',
                    done: Boolean(h.hasSavedMockups() || h.flags.opened_results),
                    actionLabel: 'Abrir resultados',
                    action: () => h.navigateTo('./results.php', 'opened_results')
                },
                {
                    id: 'consolidate',
                    title: 'Consolidar no BrandBook',
                    description: 'Conectar output dos mockups ao relatório central.',
                    done: Boolean(h.flags.opened_brandbook),
                    actionLabel: 'Abrir BrandBook',
                    action: () => h.navigateTo('../brandbook/', 'opened_brandbook')
                }
            ]
        };
    }

    function buildMockupsEditorFlow(h) {
        const briefingReady = Boolean(
            h.flags.form_touched
            || textValue('#workTitleInput')
            || textValue('#workMainTagInput')
            || textValue('#workDescriptionInput')
        );
        const editorVisible = isVisible('#editorSection');
        const saved = h.hasSavedMockups();

        return {
            title: 'Fluxo Guiado - Mockups (Editor)',
            summary: 'Componha, salve e encaminhe os mockups para aprovação e relatório.',
            hint: 'Briefing -> escolha do mockup -> salvar -> resultados -> relatório.',
            secondaryLabel: 'Abrir Relatório',
            secondaryAction: () => h.navigateTo('./report.php', 'opened_report'),
            steps: [
                {
                    id: 'briefing',
                    title: 'Preencher briefing',
                    description: 'Defina título, tags e descrição do trabalho.',
                    done: briefingReady,
                    actionLabel: 'Ir para briefing',
                    action: () => focusSelector('#workTitleInput')
                },
                {
                    id: 'select',
                    title: 'Selecionar mockup',
                    description: 'Abra um modelo e entre no modo de edição.',
                    done: editorVisible || Boolean(h.flags.selected_mockup),
                    actionLabel: 'Ir para biblioteca',
                    action: () => scrollIntoViewSafe('#mockupsGrid')
                },
                {
                    id: 'save',
                    title: 'Salvar composição',
                    description: 'Persistir mockups finalizados para resultados e relatório.',
                    done: saved || Boolean(h.flags.saved_mockup),
                    actionLabel: 'Salvar mockup',
                    action: () => clickSelectorSafe('button[onclick*="saveMockupChanges"]')
                },
                {
                    id: 'results',
                    title: 'Abrir resultados',
                    description: 'Revisar mockups em layout de vitrine para aprovação.',
                    done: Boolean(h.flags.opened_results || saved),
                    actionLabel: 'Ir para resultados',
                    action: () => clickSelectorSafe('button[onclick*="finalizeMockupsForReport"]')
                },
                {
                    id: 'report',
                    title: 'Gerar relatório',
                    description: 'Consolidar mockups no relatório de entrega/orçamento.',
                    done: Boolean(h.flags.opened_report),
                    actionLabel: 'Abrir relatório',
                    action: () => h.navigateTo('./report.php', 'opened_report')
                }
            ]
        };
    }

    function buildMockupsResultsFlow(h) {
        const cards = document.querySelectorAll('#resultsGrid .results-card').length;

        return {
            title: 'Fluxo Guiado - Mockups (Resultados)',
            summary: 'Revise o material final e avance para a etapa de consolidação.',
            hint: 'Carregar -> filtrar/revisar -> baixar amostra -> relatório -> BrandBook.',
            secondaryLabel: 'Abrir BrandBook',
            secondaryAction: () => h.navigateTo('../brandbook/', 'opened_brandbook'),
            steps: [
                {
                    id: 'load',
                    title: 'Carregar mockups',
                    description: 'Garantir que a grade de resultados foi montada.',
                    done: cards > 0,
                    actionLabel: 'Atualizar resultados',
                    action: () => h.clickSelector('#refreshResultsBtn', 'refreshed')
                },
                {
                    id: 'review',
                    title: 'Revisar exibição',
                    description: 'Use filtros e busca para validar o conjunto final.',
                    done: Boolean(h.flags.filtered || h.flags.refreshed),
                    actionLabel: 'Ir para filtros',
                    action: () => focusSelector('#resultsSearchInput')
                },
                {
                    id: 'download',
                    title: 'Baixar amostra',
                    description: 'Exportar pré-visualização principal para aprovação rápida.',
                    done: Boolean(h.flags.downloaded_sample),
                    actionLabel: 'Baixar amostra',
                    action: () => h.clickSelector('#downloadHeroBtn', 'downloaded_sample')
                },
                {
                    id: 'report',
                    title: 'Abrir relatório',
                    description: 'Enviar mockups selecionados para etapa de anexo.',
                    done: Boolean(h.flags.opened_report),
                    actionLabel: 'Abrir relatório',
                    action: () => h.navigateTo('./report.php', 'opened_report')
                },
                {
                    id: 'consolidate',
                    title: 'Consolidar no BrandBook',
                    description: 'Cruzar mockups com paleta e tipografia final.',
                    done: Boolean(h.flags.opened_brandbook),
                    actionLabel: 'Abrir BrandBook',
                    action: () => h.navigateTo('../brandbook/', 'opened_brandbook')
                }
            ]
        };
    }

    function buildMockupsReportFlow(h) {
        const total = h.metricCount('#reportTotalSaved');
        const selected = h.metricCount('#reportSelectedCount');
        const payloadReady = textValue('#reportPayload').length > 16;
        const exported = Boolean(h.flags.payload_downloaded || h.flags.payload_copied || h.flags.printed);

        return {
            title: 'Fluxo Guiado - Mockups (Relatório)',
            summary: 'Finalize anexos de mockup com dados de identidade visual.',
            hint: 'Revisar validade -> selecionar -> atualizar payload -> exportar -> manual.',
            secondaryLabel: 'Abrir BrandBook',
            secondaryAction: () => h.navigateTo('../brandbook/', 'opened_brandbook'),
            steps: [
                {
                    id: 'review',
                    title: 'Revisar validade',
                    description: 'Confirme status do relatório e volume de itens salvos.',
                    done: total > 0,
                    actionLabel: 'Atualizar resumo',
                    action: () => h.clickSelector('#refreshPayloadBtn', 'refreshed')
                },
                {
                    id: 'select',
                    title: 'Selecionar anexos',
                    description: 'Marque mockups que entram na entrega final.',
                    done: selected > 0,
                    actionLabel: 'Ir para lista',
                    action: () => scrollIntoViewSafe('#reportMockupsGrid')
                },
                {
                    id: 'payload',
                    title: 'Atualizar payload',
                    description: 'Gerar resumo JSON atual para anexo do projeto.',
                    done: payloadReady,
                    actionLabel: 'Atualizar payload',
                    action: () => h.clickSelector('#refreshPayloadBtn', 'refreshed')
                },
                {
                    id: 'export',
                    title: 'Exportar ou imprimir',
                    description: 'Baixar JSON, copiar resumo ou imprimir relatório.',
                    done: exported,
                    actionLabel: 'Baixar JSON',
                    action: () => h.clickSelector('#downloadPayloadBtn', 'payload_downloaded')
                },
                {
                    id: 'manual',
                    title: 'Abrir Brand Manual',
                    description: 'Levar material para documento institucional da marca.',
                    done: Boolean(h.flags.opened_brandmanual),
                    actionLabel: 'Abrir Brand Manual',
                    action: () => h.navigateTo('../brandmanual/', 'opened_brandmanual')
                }
            ]
        };
    }

    function detectContext() {
        if (body.classList.contains('aq-tool-colorpalette')) {
            return { key: 'colorpalette' };
        }
        if (body.classList.contains('aq-tool-coloradvisor')) {
            return { key: 'coloradvisor' };
        }
        if (body.classList.contains('aq-tool-fontadvisor')) {
            return { key: 'fontadvisor' };
        }
        if (body.classList.contains('aq-tool-bgremove')) {
            return { key: 'bgremove' };
        }
        if (body.classList.contains('aq-tool-ocimage')) {
            return { key: 'ocimage' };
        }
        if (body.classList.contains('aq-tool-brandmanual')) {
            return { key: 'brandmanual' };
        }
        if (body.classList.contains('aq-tool-brandbook')) {
            return { key: 'brandbook' };
        }
        if (body.classList.contains('aq-tool-finalframe')) {
            return { key: 'finalframe' };
        }
        if (body.classList.contains('aq-tool-mockups')) {
            if (body.classList.contains('mockup-upload-page')) {
                return { key: 'mockups_upload' };
            }
            if (body.classList.contains('mockup-results-page')) {
                return { key: 'mockups_results' };
            }
            if (body.classList.contains('mockup-report-page')) {
                return { key: 'mockups_report' };
            }
            if (document.getElementById('editorSection')) {
                return { key: 'mockups_editor' };
            }
        }
        return null;
    }

    function mountAssistant(currentContext) {
        const existing = document.getElementById('aqWorkflowAssistant');
        if (existing) {
            return collectUiRefs(existing);
        }

        const host = findHostElement();
        if (!host) {
            return null;
        }

        const panel = document.createElement('section');
        panel.id = 'aqWorkflowAssistant';
        panel.className = 'aq-workflow-assistant';
        panel.innerHTML = `
            <div class="aq-workflow-head">
                <div>
                    <h3 id="aqWorkflowTitle">Fluxo Guiado</h3>
                    <p id="aqWorkflowSummary">Siga as etapas para manter consistência da ferramenta.</p>
                </div>
                <span class="aq-workflow-progress" id="aqWorkflowProgress">0/0</span>
            </div>
            <div class="aq-workflow-steps" id="aqWorkflowSteps"></div>
            <div class="aq-workflow-actions">
                <button type="button" id="aqWorkflowPrimaryAction">Executar próximo passo</button>
                <button type="button" id="aqWorkflowSecondaryAction">Abrir BrandBook</button>
            </div>
            <p class="aq-workflow-hint" id="aqWorkflowHint"></p>
        `;

        insertPanel(host, panel, currentContext.key);
        return collectUiRefs(panel);
    }

    function collectUiRefs(root) {
        const title = root.querySelector('#aqWorkflowTitle');
        const summary = root.querySelector('#aqWorkflowSummary');
        const progress = root.querySelector('#aqWorkflowProgress');
        const steps = root.querySelector('#aqWorkflowSteps');
        const primaryButton = root.querySelector('#aqWorkflowPrimaryAction');
        const secondaryButton = root.querySelector('#aqWorkflowSecondaryAction');
        const hint = root.querySelector('#aqWorkflowHint');

        if (!title || !summary || !progress || !steps || !primaryButton || !secondaryButton || !hint) {
            return null;
        }

        return {
            root,
            title,
            summary,
            progress,
            steps,
            primaryButton,
            secondaryButton,
            hint
        };
    }

    function insertPanel(host, panel, contextKey) {
        if (contextKey === 'ocimage') {
            const controls = host.querySelector('.controls');
            if (controls && controls.parentElement === host) {
                controls.insertAdjacentElement('afterend', panel);
                return;
            }
        }

        const children = Array.from(host.children || []);
        const preferredAnchor = children.find((child) => (
            child.matches('.hero, .upload-intro, .work-intake')
        )) || null;

        if (preferredAnchor) {
            preferredAnchor.insertAdjacentElement('afterend', panel);
            return;
        }

        host.insertAdjacentElement('afterbegin', panel);
    }

    function findHostElement() {
        const selectors = [
            'main .upload-container',
            'main .results-container',
            'main .report-container',
            'main .brandbook-page',
            'main .font-advisor-page',
            'main .page',
            'main .container',
            'main',
            '.main-content',
            '.container-grid',
            '.container'
        ];

        for (let index = 0; index < selectors.length; index += 1) {
            const candidate = document.querySelector(selectors[index]);
            if (candidate) {
                return candidate;
            }
        }
        return null;
    }

    function bindTrackers(currentContext, mark) {
        const key = currentContext.key;

        if (key === 'coloradvisor') {
            bindFormTouch('#strategyForm', mark);
            bindOn('#strategyForm', 'submit', () => mark('generated'));
            bindOn('#resetBtn', 'click', () => mark('generated'));
            bindOn('#exportJsonBtn', 'click', () => mark('export_json'));
            bindOn('#exportPdfBtn', 'click', () => mark('export_pdf'));
            return;
        }

        if (key === 'fontadvisor') {
            bindFormTouch('#fontStrategyForm', mark);
            bindOn('#fontStrategyForm', 'submit', () => mark('generated'));
            bindOn('#generateFontStrategyBtn', 'click', () => mark('generated'));
            bindOn('#applyFontProfileBtn', 'click', () => mark('applied_brandkit'));
            bindOn('#exportFontProfileBtn', 'click', () => mark('exported_profile'));
            return;
        }

        if (key === 'bgremove') {
            ['#tolerance', '#bgColor', '#useBgColor', '#removeMode', '#feather', '#autoBg']
                .forEach((selector) => bindOn(selector, 'change', () => mark('settings_changed')));
            bindOn('#toggleBrushBtn', 'click', () => mark('brush_used'));
            bindOn('#applyAdjustBtn', 'click', () => {
                mark('brush_used');
                mark('downloaded');
            });
            bindOn('#optimizeBtn', 'click', () => mark('downloaded'));
            bindOn('#downloadBtn', 'click', () => mark('downloaded'));
            bindOn('#downloadAdjustedBtn', 'click', () => mark('downloaded'));
            bindOn('#fileInput', 'change', () => mark('uploaded'));
            bindOn('#openFinalFrameBtn', 'click', () => mark('opened_finalframe'));
            return;
        }

        if (key === 'ocimage') {
            ['#title', '#description', '#brand'].forEach((selector) => {
                bindOn(selector, 'input', () => mark('form_touched'));
            });
            ['#primaryColor', '#secondaryColor', '#imageOpacity', '#overlayOpacity', '#imageUpload']
                .forEach((selector) => bindOn(selector, 'input', () => mark('visual_touched')));
            bindOn('.template-selector', 'click', () => mark('visual_touched'));
            bindOn('.update-btn', 'click', () => mark('visual_touched'));
            bindOn('.export-btn', 'click', () => mark('exported'));
            bindOn('.code-btn', 'click', () => mark('code_generated'));
            bindOn('#downloadButton', 'click', () => mark('exported'));
            return;
        }

        if (key === 'brandmanual') {
            bindOn('#refreshBtn', 'click', () => mark('refreshed'));
            bindOn('#templateGrid', 'click', () => mark('template_selected'));
            bindOn('#createCustomTemplateBtn', 'click', () => mark('template_selected'));
            bindOn('#resetBuilderBtn', 'click', () => mark('template_selected'));
            bindOn('#applySmartTemplateBtn', 'click', () => mark('template_selected'));
            bindOn('#applyMiniPresetBtn', 'click', () => mark('template_selected'));
            bindOn('#duplicateCustomTemplateBtn', 'click', () => mark('template_selected'));
            bindOn('#removeCustomTemplateBtn', 'click', () => mark('template_selected'));
            bindOn('#importCustomTemplatesBtn', 'click', () => mark('template_selected'));
            bindOn('#importCustomTemplatesFile', 'change', () => mark('template_selected'));
            bindOn('#importCustomTemplatesMode', 'change', () => mark('template_selected'));
            bindOn('#customTemplateBookMode', 'change', () => mark('template_selected'));
            bindOn('#customTemplateSmartMethod', 'change', () => mark('template_selected'));
            bindOn('#customTemplateMiniVariant', 'change', () => mark('template_selected'));
            bindOn('#miniGuidePreset', 'change', () => mark('template_selected'));
            bindOn('#builderBlockTitleOverride', 'input', () => mark('template_selected'));
            bindOn('#builderBlockNote', 'input', () => mark('template_selected'));
            bindOn('#builderBlockSpan', 'change', () => mark('template_selected'));
            bindOn('#builderMoveBlockUpBtn', 'click', () => mark('template_selected'));
            bindOn('#builderMoveBlockDownBtn', 'click', () => mark('template_selected'));
            bindOn('#builderRemoveBlockBtn', 'click', () => mark('template_selected'));
            bindOn('#builderClearBlockEditBtn', 'click', () => mark('template_selected'));
            bindOn('#addDesignPageBtn', 'click', () => mark('template_selected'));
            bindOn('#duplicateDesignPageBtn', 'click', () => mark('template_selected'));
            bindOn('#removeDesignPageBtn', 'click', () => mark('template_selected'));
            bindOn('#buildSceneFromStructureBtn', 'click', () => mark('template_selected'));
            bindOn('#useDesignStudioTemplate', 'change', () => mark('template_selected'));
            bindOn('#designPageSelect', 'change', () => mark('template_selected'));
            bindOn('#designElementText', 'input', () => mark('template_selected'));
            bindOn('#designElementX', 'input', () => mark('template_selected'));
            bindOn('#designElementY', 'input', () => mark('template_selected'));
            bindOn('#designElementW', 'input', () => mark('template_selected'));
            bindOn('#designElementH', 'input', () => mark('template_selected'));
            bindOn('#designElementFontSize', 'input', () => mark('template_selected'));
            bindOn('#designElementAlign', 'change', () => mark('template_selected'));
            bindOn('#designElementColor', 'input', () => mark('template_selected'));
            bindOn('#designElementBg', 'input', () => mark('template_selected'));
            bindOn('#designElementRadius', 'input', () => mark('template_selected'));
            bindOn('#designElementOpacity', 'input', () => mark('template_selected'));
            bindOn('#duplicateDesignElementBtn', 'click', () => mark('template_selected'));
            bindOn('#removeDesignElementBtn', 'click', () => mark('template_selected'));
            bindOn('#resetDesignElementStyleBtn', 'click', () => mark('template_selected'));
            bindOn('#importFigmaJsonBtn', 'click', () => mark('template_selected'));
            bindOn('#figmaNamingPresetSelect', 'change', () => mark('template_selected'));
            bindOn('#figmaNamingCustomRules', 'input', () => mark('template_selected'));
            bindOn('#applyFigmaNamingPresetBtn', 'click', () => mark('template_selected'));
            bindOn('#resetFigmaNamingRulesBtn', 'click', () => mark('template_selected'));
            bindOn('#importFigmaJsonFile', 'change', () => mark('template_selected'));
            bindOn('#exportDesignSceneBtn', 'click', () => mark('exported_json'));
            bindOn('#importDesignSceneBtn', 'click', () => mark('template_selected'));
            bindOn('#importDesignSceneFile', 'change', () => mark('template_selected'));
            bindOn('#exportCustomTemplatesBtn', 'click', () => mark('exported_json'));
            bindOn('#createTemplateBackupBtn', 'click', () => mark('exported_json'));
            bindOn('#downloadTemplateBackupBtn', 'click', () => mark('exported_json'));
            bindOn('#restoreTemplateBackupBtn', 'click', () => mark('template_selected'));
            bindOn('#savePracticalSettingsBtn', 'click', () => mark('template_selected'));
            bindOn('#resetPracticalSettingsBtn', 'click', () => mark('template_selected'));
            bindOn('#copyCssTokensBtn', 'click', () => mark('copied'));
            bindOn('#downloadCssTokensBtn', 'click', () => mark('exported_json'));
            bindOn('#downloadExecutionBriefBtn', 'click', () => mark('exported_json'));
            bindOn('#downloadJsonBtn', 'click', () => mark('exported_json'));
            bindOn('#downloadPdfBtn', 'click', () => mark('exported_pdf'));
            bindOn('#downloadTemplateHtmlBtn', 'click', () => mark('exported_html'));
            bindOn('#openTemplateRenderBtn', 'click', () => mark('exported_html'));
            bindOn('#printTemplateBtn', 'click', () => mark('printed'));
            bindOn('#copyBtn', 'click', () => mark('copied'));
            return;
        }

        if (key === 'brandbook') {
            bindOn('#refreshReportBtn', 'click', () => mark('refreshed'));
            bindOn('#copyPayloadBtn', 'click', () => mark('payload_copied'));
            bindOn('#downloadPayloadBtn', 'click', () => mark('payload_downloaded'));
            return;
        }

        if (key === 'finalframe') {
            bindOn('#refreshReportBtn', 'click', () => mark('refreshed'));
            bindOn('#copyPayloadBtn', 'click', () => mark('copied_json'));
            bindOn('#downloadPayloadBtn', 'click', () => mark('exported_json'));
            bindOn('#openBrandBookBtn', 'click', () => mark('opened_brandbook'));
            bindOn('#applyBgRecommendationBtn', 'click', () => mark('opened_bgremove_recommended'));
            bindOn('#clearBgHistoryBtn', 'click', () => mark('history_cleared'));
            return;
        }

        if (key === 'mockups_upload') {
            bindOn('#workFileInput', 'change', () => mark('uploaded'));
            bindOn('#continueBtn', 'click', () => {
                if (String(getAttributeSafe('#continueBtn', 'aria-disabled')) === 'false') {
                    mark('opened_editor');
                }
            });
            return;
        }

        if (key === 'mockups_editor') {
            ['#workTitleInput', '#workMainTagInput', '#workSupportingTagsInput', '#workDescriptionInput']
                .forEach((selector) => bindOn(selector, 'input', () => mark('form_touched')));
            bindOn('#mockupsGrid', 'click', () => mark('selected_mockup'));
            bindOn('button[onclick*="saveMockupChanges"]', 'click', () => mark('saved_mockup'));
            bindOn('button[onclick*="finalizeMockupsForReport"]', 'click', () => mark('opened_results'));
            bindOn('button[onclick*="downloadMockup"]', 'click', () => mark('saved_mockup'));
            return;
        }

        if (key === 'mockups_results') {
            bindOn('#resultsSearchInput', 'input', () => mark('filtered'));
            bindOn('#resultsCategoryFilter', 'change', () => mark('filtered'));
            bindOn('#refreshResultsBtn', 'click', () => mark('refreshed'));
            bindOn('#downloadHeroBtn', 'click', () => mark('downloaded_sample'));
            bindOn('#resultsGrid', 'click', (event) => {
                if (event.target && event.target.closest('.results-download-btn')) {
                    mark('downloaded_sample');
                }
            });
            bindOn('#goToReportBtn', 'click', () => mark('opened_report'));
            return;
        }

        if (key === 'mockups_report') {
            bindOn('#refreshPayloadBtn', 'click', () => mark('refreshed'));
            bindOn('#copyPayloadBtn', 'click', () => mark('payload_copied'));
            bindOn('#downloadPayloadBtn', 'click', () => mark('payload_downloaded'));
            bindOn('#printReportBtn', 'click', () => mark('printed'));
            bindOn('#openBrandManualBtn', 'click', () => mark('opened_brandmanual'));
        }
    }

    function bindFormTouch(formSelector, mark) {
        const form = document.querySelector(formSelector);
        if (!form) {
            return;
        }
        form.addEventListener('input', () => mark('form_touched'));
        form.addEventListener('change', () => mark('form_touched'));
    }

    function bindOn(selector, eventName, handler) {
        const target = document.querySelector(selector);
        if (!target || typeof handler !== 'function') {
            return;
        }
        target.addEventListener(eventName, handler);
    }

    function markFlag(flagKey) {
        if (!flagKey) {
            return;
        }
        const flags = readFlags();
        if (flags[flagKey]) {
            return;
        }
        flags[flagKey] = true;
        writeFlags(flags);
        render();
    }

    function readFlags() {
        const scoped = storage.readScope(context.key);
        return isObject(scoped) ? scoped : {};
    }

    function writeFlags(nextFlags) {
        storage.writeScope(context.key, nextFlags);
    }

    function navigateTo(path, flagKey) {
        if (flagKey) {
            markFlag(flagKey);
        }
        window.location.href = path;
    }

    function clickSelector(selector, flagKey) {
        const clicked = clickSelectorSafe(selector);
        if (clicked && flagKey) {
            markFlag(flagKey);
        }
        return clicked;
    }

    function clickSelectorSafe(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            return false;
        }
        if (typeof element.click === 'function') {
            element.click();
            return true;
        }
        return false;
    }

    function focusSelector(selector) {
        const target = document.querySelector(selector);
        if (!target) {
            return false;
        }
        if (typeof target.focus === 'function') {
            target.focus();
        }
        scrollIntoViewSafe(selector);
        return true;
    }

    function scrollIntoViewSafe(selector) {
        const target = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (!target || typeof target.scrollIntoView !== 'function') {
            return false;
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        return true;
    }

    function hasImageSrc(selector) {
        const image = document.querySelector(selector);
        if (!image) {
            return false;
        }
        const src = String(image.getAttribute('src') || image.src || '').trim();
        return src !== '' && !src.endsWith('#');
    }

    function hasHref(selector) {
        const target = document.querySelector(selector);
        if (!target) {
            return false;
        }
        const href = String(target.getAttribute('href') || '').trim();
        return href !== '' && href !== '#';
    }

    function textValue(selector) {
        const target = document.querySelector(selector);
        if (!target) {
            return '';
        }
        if ('value' in target) {
            return String(target.value || '').trim();
        }
        return String(target.textContent || '').trim();
    }

    function metricCount(selector) {
        const raw = textValue(selector).replace(/[^\d]/g, '');
        const value = Number.parseInt(raw, 10);
        return Number.isFinite(value) ? value : 0;
    }

    function getAttributeSafe(selector, attribute) {
        const target = document.querySelector(selector);
        if (!target) {
            return null;
        }
        return target.getAttribute(attribute);
    }

    function isVisible(selectorOrElement) {
        const element = typeof selectorOrElement === 'string'
            ? document.querySelector(selectorOrElement)
            : selectorOrElement;
        if (!element) {
            return false;
        }
        if (element.hidden) {
            return false;
        }
        const style = window.getComputedStyle(element);
        if (!style) {
            return false;
        }
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    function isActiveSection(selector) {
        const target = document.querySelector(selector);
        if (!target) {
            return false;
        }
        return target.classList.contains('active') || isVisible(target);
    }

    function getBrandSnapshot() {
        const api = window.AQBrandKit;
        if (!api || typeof api.getIntegrationSnapshot !== 'function') {
            return null;
        }
        try {
            const snapshot = api.getIntegrationSnapshot();
            return isObject(snapshot) ? snapshot : null;
        } catch (error) {
            return null;
        }
    }

    function hasSavedMockups() {
        const saved = readJsonStorage(window.localStorage, MOCKUPS_STORAGE_KEY, []);
        return Array.isArray(saved) && saved.length > 0;
    }

    function isOgProfileReady(snapshot) {
        const source = String(snapshot?.ogProfile?.source || '').toLowerCase();
        return Boolean(snapshot?.ogProfile?.available) && source.includes('ocimage');
    }

    function hasOgFallbackSettings() {
        const value = readJsonStorage(window.localStorage, OG_SETTINGS_STORAGE_KEY, null);
        return Boolean(value && typeof value === 'object' && Object.keys(value).length > 0);
    }

    function hasBrandbookData() {
        const snapshot = getBrandSnapshot();
        if (snapshot) {
            const hasPalette = Boolean(snapshot.colorPalette?.updatedAt || snapshot.brandKit?.palette?.updatedAt);
            const hasTypography = Boolean(snapshot.fontProfile?.updatedAt || snapshot.brandKit?.typography?.updatedAt);
            const hasInsights = Boolean(snapshot.brandInsights?.updatedAt);
            return hasPalette || hasTypography || hasInsights;
        }

        const kit = readJsonStorage(window.localStorage, 'aq_brand_kit_v1', null);
        if (kit && typeof kit === 'object') {
            return Boolean(kit.updatedAt || kit.brandColors || kit.palette || kit.typography);
        }
        return false;
    }

    function sourceHas(candidates, values) {
        const expected = Array.isArray(candidates) ? candidates : [];
        const normalizedValues = Array.isArray(values) ? values : [];
        return normalizedValues.some((entry) => {
            const source = String(entry || '').toLowerCase();
            if (!source) {
                return false;
            }
            return expected.some((candidate) => source.includes(String(candidate || '').toLowerCase()));
        });
    }

    function createStorageDriver() {
        return {
            readScope(scope) {
                const raw = readJsonStorage(window.localStorage, STORAGE_KEY, {});
                if (!isObject(raw)) {
                    return {};
                }
                const scoped = raw[scope];
                return isObject(scoped) ? scoped : {};
            },
            writeScope(scope, payload) {
                const raw = readJsonStorage(window.localStorage, STORAGE_KEY, {});
                const next = isObject(raw) ? raw : {};
                next[scope] = isObject(payload) ? payload : {};
                writeJsonStorage(window.localStorage, STORAGE_KEY, next);
            }
        };
    }

    function readJsonStorage(storageRef, key, fallback) {
        if (!storageRef || typeof storageRef.getItem !== 'function') {
            return fallback;
        }
        try {
            const raw = storageRef.getItem(key);
            if (!raw) {
                return fallback;
            }
            return JSON.parse(raw);
        } catch (error) {
            return fallback;
        }
    }

    function writeJsonStorage(storageRef, key, value) {
        if (!storageRef || typeof storageRef.setItem !== 'function') {
            return false;
        }
        try {
            storageRef.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            return false;
        }
    }

    function isObject(value) {
        return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}(window, document));

