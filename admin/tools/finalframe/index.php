<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FinalFrame Quotia</title>
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="../compatibility.css">
</head>
<body class="aq-tool-fluid aq-tool-finalframe">
    <main class="finalframe-page">
        <section class="hero">
            <div>
                <p class="eyebrow">Quotia Tools</p>
                <h1>FinalFrame</h1>
                <p class="hero-text">Relatorio final consolidado com identidade visual, OG, mockups e background remover em um unico payload.</p>
            </div>
            <div class="hero-actions">
                <button type="button" class="btn" id="refreshReportBtn">Atualizar relatorio</button>
                <button type="button" class="btn btn-ghost" id="copyPayloadBtn">Copiar JSON</button>
                <button type="button" class="btn btn-ghost" id="downloadPayloadBtn">Baixar JSON</button>
                <button type="button" class="btn btn-ghost" id="openBrandBookBtn">Abrir BrandBook</button>
            </div>
        </section>

        <section class="kpis">
            <article class="kpi-card">
                <small>Cores</small>
                <strong id="metricColorCount">0</strong>
            </article>
            <article class="kpi-card">
                <small>Tipografia</small>
                <strong id="metricFontStatus">Sem dados</strong>
            </article>
            <article class="kpi-card">
                <small>OG</small>
                <strong id="metricOgStatus">Sem dados</strong>
            </article>
            <article class="kpi-card">
                <small>Mockups</small>
                <strong id="metricMockupCount">0</strong>
            </article>
            <article class="kpi-card">
                <small>Recortes BG</small>
                <strong id="metricBgStatus">Sem dados</strong>
            </article>
            <article class="kpi-card">
                <small>Prontidao</small>
                <strong id="metricReadiness">0/6</strong>
            </article>
        </section>

        <section class="panel two-col">
            <article>
                <h2>Projeto</h2>
                <div id="projectInfoGrid" class="info-grid"></div>
            </article>
            <article>
                <h2>Integracao</h2>
                <ul id="integrationStatus" class="status-list"></ul>
            </article>
        </section>

        <section class="panel two-col">
            <article>
                <h2>Resumo da marca</h2>
                <div id="brandSummaryBlock" class="detail-stack"></div>
            </article>
            <article>
                <h2>Background Remover</h2>
                <div id="bgremoveBlock" class="detail-stack"></div>
            </article>
        </section>

        <section class="panel two-col">
            <article>
                <h2>Qualidade do recorte</h2>
                <div id="bgremoveQualityBlock" class="detail-stack"></div>
            </article>
            <article>
                <h2>Recomendacoes</h2>
                <div class="panel-actions">
                    <button type="button" class="btn btn-inline" id="applyBgRecommendationBtn">Aplicar no BG Remove</button>
                    <button type="button" class="btn btn-inline btn-outline" id="clearBgHistoryBtn">Limpar historico</button>
                </div>
                <ul id="bgremoveRecommendations" class="status-list"></ul>
            </article>
        </section>

        <section class="panel">
            <h2>Historico de qualidade do recorte</h2>
            <div id="bgremoveHistoryList" class="history-list"></div>
        </section>

        <section class="panel">
            <h2>Payload FinalFrame</h2>
            <textarea id="finalframePayload" readonly></textarea>
            <p id="statusLine" class="status-line">Pronto para consolidar dados.</p>
        </section>
    </main>

    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/script.js"></script>
    <script src="../shared/workflow-assistant.js"></script>
</body>
</html>
