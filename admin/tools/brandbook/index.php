<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BrandBook Quotia</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="../compatibility.css">
</head>
<body class="aq-tool-fluid aq-tool-brandbook">
    <main class="brandbook-page">
        <section class="hero">
            <div>
                <p class="eyebrow">Quotia Tools</p>
                <h1>BrandBook</h1>
                <p class="hero-text">Relatório consolidado com cores, tendências, combinações, tipografia, OG e mockups sincronizados entre ferramentas.</p>
            </div>
            <div class="hero-actions">
                <button type="button" class="btn" id="refreshReportBtn">Atualizar relatório</button>
                <button type="button" class="btn btn-ghost" id="copyPayloadBtn">Copiar JSON</button>
                <button type="button" class="btn btn-ghost" id="downloadPayloadBtn">Baixar JSON</button>
            </div>
        </section>

        <section class="kpis">
            <article class="kpi-card">
                <small>Cores consolidadas</small>
                <strong id="metricColorCount">0</strong>
            </article>
            <article class="kpi-card">
                <small>Combinações</small>
                <strong id="metricCombinationCount">0</strong>
            </article>
            <article class="kpi-card">
                <small>Tendencias</small>
                <strong id="metricTrendCount">0</strong>
            </article>
            <article class="kpi-card">
                <small>Mockups</small>
                <strong id="metricMockupCount">0</strong>
            </article>
            <article class="kpi-card">
                <small>Status OG</small>
                <strong id="metricOgStatus">Sem dados</strong>
            </article>
            <article class="kpi-card">
                <small>Contraste</small>
                <strong id="metricContrastStatus">Sem dados</strong>
            </article>
        </section>

        <section class="panel two-col">
            <article>
                <h2>Projeto</h2>
                <div id="projectInfoGrid" class="info-grid"></div>
            </article>
            <article>
                <h2>Integração</h2>
                <ul id="integrationStatus" class="status-list"></ul>
            </article>
        </section>

        <section class="panel">
            <h2>Sistema de Cores</h2>
            <p id="paletteSummary" class="muted">Aguardando consolidação de cores.</p>
            <div id="paletteRoles" class="role-grid"></div>
            <div id="paletteSwatches" class="swatch-grid"></div>
        </section>

        <section class="panel two-col">
            <article>
                <h2>Combinações recomendadas</h2>
                <div id="combinationList" class="insight-list"></div>
            </article>
            <article>
                <h2>Tendencias alinhadas</h2>
                <div id="trendList" class="insight-list"></div>
            </article>
        </section>

        <section class="panel two-col">
            <article>
                <h2>Tipografia</h2>
                <div id="typographyBlock" class="detail-stack"></div>
            </article>
            <article>
                <h2>Diretriz OG</h2>
                <div id="ogBlock" class="detail-stack"></div>
            </article>
        </section>

        <section class="panel two-col">
            <article>
                <h2>Perfil Estratégico</h2>
                <div id="strategyProfileBlock" class="detail-stack"></div>
            </article>
            <article>
                <h2>Auditoria de Contraste</h2>
                <ul id="contrastAuditStatus" class="status-list"></ul>
            </article>
        </section>

        <section class="panel">
            <h2>Mockups recentes</h2>
            <div id="mockupList" class="mockup-list"></div>
        </section>

        <section class="panel">
            <h2>Payload consolidado</h2>
            <textarea id="brandbookPayload" readonly></textarea>
            <p id="statusLine" class="status-line">Pronto para consolidar dados.</p>
        </section>
    </main>

    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/script.js"></script>
    <script src="../shared/workflow-assistant.js"></script>
</body>
</html>

