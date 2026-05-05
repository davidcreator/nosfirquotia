<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Font Strategy Advisor</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@400;600;700&family=Inter:wght@400;500;600;700;800&family=Lora:wght@400;500;600;700&family=Manrope:wght@500;600;700&family=Merriweather:wght@400;700&family=Montserrat:wght@500;700&family=Nunito+Sans:wght@400;600;700;800&family=Playfair+Display:wght@600;700&family=Poppins:wght@500;600;700&family=Roboto+Mono:wght@500;700&family=Roboto+Slab:wght@500;700&family=Source+Sans+3:wght@400;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../compatibility.css">
    <link rel="stylesheet" href="./assets/css/style.css">
</head>
<body class="aq-tool-fluid aq-tool-fontadvisor">
        <main id="fontAdvisorPage" class="font-advisor-page">
        <section class="hero">
            <p class="eyebrow">Tipografia para Marca</p>
            <h1>Font Strategy Advisor</h1>
            <p>Monte um sistema tipográfico completo para a marca: diagnóstico, recomendação de pares, plano de aplicação e sincronização com o ecossistema de relatórios.</p>
            <div class="hero-actions">
                <button type="button" class="ghost" id="presentationModeBtn" aria-pressed="false" title="Ativar modo apresentação (atalho: P)">
                    Ativar Modo Apresentação
                </button>
                <button type="button" class="ghost" id="printPresentationBtn" title="Imprimir apresentação tipográfica">
                    Imprimir Apresentação
                </button>
                <label class="presentation-preset-control">
                    Preset
                    <select id="presentationPreset" aria-label="Preset de apresentação">
                        <option value="standard" selected>Padrão</option>
                        <option value="executive">Deck Executivo</option>
                        <option value="workshop">Workshop</option>
                    </select>
                </label>
                <span class="hero-actions-hint">Atalho rápido: tecla P</span>
            </div>
            <div id="sessionStateBar" class="session-state-bar" aria-live="polite">
                <span class="session-state-item"><strong>Preset:</strong> <span id="sessionPresetState">Padrão</span></span>
                <span class="session-state-item"><strong>Apresentação:</strong> <span id="sessionPresentationState">Inativa</span></span>
                <span class="session-state-item"><strong>Ranking:</strong> <span id="sessionRankingState">Top 8 de 0 (pontuação)</span></span>
            </div>
        </section>

        <section class="panel panel-diagnostic">
            <h2>Diagnóstico Tipográfico</h2>
            <form id="fontStrategyForm" class="font-form">
                <label>
                    Segmento
                    <select id="industry" required>
                        <option value="geral">Geral</option>
                        <option value="tecnologia">Tecnologia</option>
                        <option value="moda">Moda / Beleza</option>
                        <option value="financeiro">Financeiro</option>
                        <option value="saude">Saúde / Bem-estar</option>
                        <option value="educacao">Educação</option>
                        <option value="gastronomia">Gastronomia</option>
                        <option value="criativo">Criativo / Agência</option>
                    </select>
                </label>

                <label>
                    Tom de voz
                    <select id="tone" required>
                        <option value="equilibrado">Equilibrado</option>
                        <option value="corporativo">Corporativo</option>
                        <option value="premium">Premium</option>
                        <option value="amigavel">Amigável</option>
                        <option value="inovador">Inovador</option>
                        <option value="editorial">Editorial</option>
                    </select>
                </label>

                <label>
                    Canal principal
                    <select id="channel" required>
                        <option value="digital">Digital</option>
                        <option value="impresso">Impresso</option>
                        <option value="hibrido">Híbrido</option>
                    </select>
                </label>

                <label>
                    Legibilidade desejada
                    <select id="readability" required>
                        <option value="alta">Alta</option>
                        <option value="media">Média</option>
                        <option value="expressiva">Expressiva</option>
                    </select>
                </label>

                <label>
                    Estilo de combinação
                    <select id="pairingStyle" required>
                        <option value="modern-serif">Moderno + Serifado</option>
                        <option value="sans-sans">Sans + Sans</option>
                        <option value="serif-sans">Serifado + Sans</option>
                        <option value="expressive-neutral">Expressiva + Neutra</option>
                    </select>
                </label>

                <label>
                    Personalidade da marca
                    <select id="brandPersonality">
                        <option value="sobria">Sóbria</option>
                        <option value="calorosa">Calorosa</option>
                        <option value="ousada">Ousada</option>
                        <option value="tecnica">Técnica</option>
                        <option value="artesanal">Artesanal</option>
                    </select>
                </label>

                <label>
                    Escala de conteúdo
                    <select id="contentScale">
                        <option value="longo">Longo (textos extensos)</option>
                        <option value="medio">Médio</option>
                        <option value="curto">Curto (impacto visual)</option>
                    </select>
                </label>

                <label>
                    Hierarquia visual
                    <select id="hierarchyStyle">
                        <option value="equilibrada">Equilibrada</option>
                        <option value="compacta">Compacta</option>
                        <option value="dramatica">Dramática</option>
                    </select>
                </label>

                <label>
                    Contraste tipográfico
                    <select id="fontContrast">
                        <option value="medio">Médio</option>
                        <option value="alto">Alto</option>
                        <option value="baixo">Baixo</option>
                    </select>
                </label>

                <label>
                    Texto de título (preview)
                    <input id="sampleHeadline" type="text" maxlength="140" placeholder="Ex: Sua marca com voz e presença">
                </label>

                <label>
                    Texto de apoio (preview)
                    <input id="sampleBody" type="text" maxlength="220" placeholder="Ex: Tipografia legível, elegante e consistente em todos os canais.">
                </label>

                <label class="span-all">
                    Observações do projeto
                    <textarea id="projectNotes" rows="3" placeholder="Ex: foco mobile, equipe comercial usa apresentações, público principal entre 25-40 anos."></textarea>
                </label>

                <div class="form-actions">
                    <button type="submit" id="generateFontStrategyBtn">Gerar recomendação</button>
                    <button type="button" class="ghost" id="applyFontProfileBtn">Aplicar ao Brand Kit</button>
                    <button type="button" class="ghost" id="exportFontProfileBtn">Exportar JSON</button>
                    <button type="button" class="ghost" id="exportFontProfilePdfBtn">Exportar PDF</button>
                    <label class="pdf-template-control">
                        Modelo PDF
                        <select id="fontPdfTemplate">
                            <option value="full">Brandbook Completo</option>
                            <option value="mini">Mini Brand Guide</option>
                        </select>
                    </label>
                    <button type="button" class="ghost" id="resetFontStrategyBtn">Resetar</button>
                </div>
            </form>
            <p id="fontSyncStatus" class="sync-status">Aguardando configuração do perfil tipográfico.</p>
        </section>

        <section class="panel panel-foundations">
            <h2>Essencial: Tipos de Fonte</h2>
            <div class="font-types-grid">
                <article class="font-type-card">
                    <h3>Sans Serif</h3>
                    <p>Sem terminais nas extremidades. Excelente para interfaces digitais e leitura rápida.</p>
                    <small>Uso comum: UI, app, dashboards, e-commerce.</small>
                </article>
                <article class="font-type-card">
                    <h3>Serif</h3>
                    <p>Com terminais clássicos. Passa tradição, autoridade e valor editorial.</p>
                    <small>Uso comum: título institucional, marcas premium, publicações.</small>
                </article>
                <article class="font-type-card">
                    <h3>Display</h3>
                    <p>Fonte de impacto para destaque visual. Deve ser usada com moderação.</p>
                    <small>Uso comum: campanhas, hero, chamadas principais.</small>
                </article>
                <article class="font-type-card">
                    <h3>Monospace</h3>
                    <p>Caracteres em largura fixa. Boa para tecnologia, dados e linguagem técnica.</p>
                    <small>Uso comum: labels técnicos, interfaces dev, códigos curtos.</small>
                </article>
            </div>
        </section>

        <section class="panel pairing-layout">
            <div class="pairing-focus">
                <h2>Combinação Recomendada</h2>
                <p class="summary" id="fontStrategySummary">Preencha o diagnóstico para gerar um par tipográfico recomendado.</p>
                <div id="fontConfidenceChip" class="confidence-chip medium">Confiança: média</div>
                <div class="pairing-preview" id="pairingPreview">
                    <p class="pairing-primary" id="pairingPrimarySample">Título de exemplo da marca</p>
                    <p class="pairing-secondary" id="pairingSecondarySample">Subtítulo e apoio visual com boa hierarquia para telas e materiais impressos.</p>
                    <button type="button" class="preview-cta" id="pairingCtaSample" tabindex="-1">Botão de chamada</button>
                    <p class="pairing-caption" id="pairingCaptionSample">Legenda de apoio com microtexto e detalhes de interface.</p>
                </div>
                <div class="pairing-meta" id="pairingMeta"></div>
            </div>
            <div class="pairing-library">
                <div class="pairing-library-grid">
                    <section class="pairing-library-block">
                        <h2>Ranking de Fontes</h2>
                        <div class="ranking-toolbar">
                            <label>
                                Mostrar
                                <select id="rankingCount">
                                    <option value="6">Top 6</option>
                                    <option value="8" selected>Top 8</option>
                                    <option value="10">Top 10</option>
                                    <option value="12">Top 12</option>
                                </select>
                            </label>
                            <label>
                                Ordenar por
                                <select id="rankingSort">
                                    <option value="score" selected>Pontuação</option>
                                    <option value="readability">Legibilidade</option>
                                </select>
                            </label>
                            <label>
                                Densidade
                                <select id="rankingDensity">
                                    <option value="compact" selected>Compacta</option>
                                    <option value="comfortable">Confortável</option>
                                </select>
                            </label>
                        </div>
                        <p id="rankingMeta" class="ranking-meta">Exibindo Top 8 por pontuação.</p>
                        <div id="fontCards" class="font-cards font-cards-wide"></div>
                    </section>
                    <section class="pairing-library-block">
                        <h3 class="panel-subtitle">Alternativas de Pairing</h3>
                        <div id="pairAlternatives" class="pair-alt-grid pair-alt-grid-wide"></div>
                    </section>
                </div>
            </div>
        </section>

        <section class="panel split execution-layout">
            <div class="execution-block">
                <h2>Plano de Aplicação</h2>
                <div id="applicationPlan" class="application-plan"></div>
            </div>
            <div class="execution-block">
                <h2>Riscos e Recomendações</h2>
                <div class="guidance-stack">
                    <section class="guidance-block">
                        <h3 class="panel-subtitle">Riscos</h3>
                        <ul id="riskAlerts" class="notes warning"></ul>
                    </section>
                    <section class="guidance-block">
                        <h3 class="panel-subtitle">Ações sugeridas</h3>
                        <ul id="usageGuidelines" class="notes"></ul>
                    </section>
                </div>
            </div>
        </section>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/script.js"></script>
    <script src="../shared/workflow-assistant.js"></script>
</body>
</html>
