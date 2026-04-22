<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brand Manual Report - MVP</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="../compatibility.css">
</head>
<body class="aq-tool-fluid aq-tool-brandmanual">
    <main class="page">
        <section class="hero">
            <p class="eyebrow">Nosfir Quotia Tools</p>
            <h1>Brand Manual Report (MVP)</h1>
            <p>Consolida cores, tipografia, mockups e diretriz digital em um unico relatorio para manual da marca.</p>
            <div class="hero-actions">
                <a class="btn ghost" href="../mockups/report.php">Abrir Relatorio de Mockups</a>
                <a class="btn ghost" href="../mockups/editor.php">Abrir Editor de Mockups</a>
            </div>
        </section>

        <section class="panel stats-grid" id="summaryCards">
            <article class="stat-card">
                <small>Cores mapeadas</small>
                <strong id="summaryColorCount">0</strong>
            </article>
            <article class="stat-card">
                <small>Mockups encontrados</small>
                <strong id="summaryMockupCount">0</strong>
            </article>
            <article class="stat-card">
                <small>Diretriz OG</small>
                <strong id="summaryOgStatus">Sem dados</strong>
            </article>
            <article class="stat-card">
                <small>Atualizacao</small>
                <strong id="summaryUpdatedAt">-</strong>
            </article>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Template Studio (MVP)</h2>
                <span class="meta-tag" id="activeTemplateBadge">Template ativo</span>
            </div>
            <p class="muted">Escolha um template de brandbook para gerar paginas prontas em poucos cliques.</p>
            <div class="template-grid" id="templateGrid">
                <button type="button" class="template-card is-active" data-template-id="mono_arc">
                    <span class="template-preview mono"></span>
                    <strong>Monochrome Arc</strong>
                    <small>Minimal editorial em preto e branco.</small>
                </button>
                <button type="button" class="template-card" data-template-id="cobalt_grid">
                    <span class="template-preview cobalt"></span>
                    <strong>Cobalt Grid</strong>
                    <small>Corporate azul com blocos e divisores.</small>
                </button>
                <button type="button" class="template-card" data-template-id="crimson_blob">
                    <span class="template-preview crimson"></span>
                    <strong>Crimson Blob</strong>
                    <small>Composicao organica com contraste forte.</small>
                </button>
            </div>
            <div class="actions mt-compact">
                <button type="button" class="btn" id="printTemplateBtn">Imprimir / PDF Brandbook</button>
                <button type="button" class="btn ghost" id="downloadTemplateHtmlBtn">Baixar HTML do Brandbook</button>
            </div>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Informacoes do Projeto</h2>
                <span class="meta-tag" id="projectMainTag">Sem tag</span>
            </div>
            <div class="project-grid">
                <article class="project-card">
                    <small>Titulo</small>
                    <strong id="projectTitle">Nao definido</strong>
                </article>
                <article class="project-card">
                    <small>Descricao</small>
                    <p id="projectDescription">Sem descricao registrada.</p>
                </article>
                <article class="project-card">
                    <small>Tags de apoio</small>
                    <p id="projectSupportingTags">Sem tags de apoio.</p>
                </article>
            </div>
        </section>

        <section class="panel split">
            <div>
                <h2>Sistema de Cores</h2>
                <p class="muted">Fonte principal: Brand Kit e sincronizacoes do fluxo de ferramentas.</p>
                <div id="paletteGrid" class="palette-grid"></div>
            </div>
            <div>
                <h2>Sistema Tipografico</h2>
                <div id="typographySummary" class="typography-summary"></div>
            </div>
        </section>

        <section class="panel split">
            <div>
                <h2>Diretriz Digital (OG)</h2>
                <div id="ogSummary" class="og-summary"></div>
            </div>
            <div>
                <h2>Observacoes de Integracao</h2>
                <ul id="integrationNotes" class="notes"></ul>
            </div>
        </section>

        <section class="panel">
            <h2>Aplicacoes em Mockups</h2>
            <p class="muted">Amostras encontradas no fluxo do editor. Selecione no modulo de mockups para atualizar este painel.</p>
            <div id="mockupsGrid" class="mockups-grid"></div>
            <p id="mockupsEmpty" class="empty-note" style="display:none;">Nenhum mockup salvo no navegador atual.</p>
        </section>

        <section class="panel brandbook-panel" id="brandbookPanel">
            <div class="panel-header">
                <h2>Preview Rapido do Brandbook</h2>
                <span class="meta-tag">8 paginas geradas</span>
            </div>
            <p class="muted">Template preenchido automaticamente com os dados do projeto para acelerar apresentacoes de brandbook.</p>
            <div id="brandbookPreview" class="brandbook-preview"></div>
        </section>

        <section class="panel">
            <div class="panel-header">
                <h2>Payload Consolidado (MVP)</h2>
                <span class="meta-tag">JSON versionado</span>
            </div>
            <p class="muted">Use este payload para anexos operacionais, CRMs e futuras etapas de persistencia em banco.</p>
            <textarea id="manualPayload" readonly></textarea>
            <div class="actions">
                <button type="button" class="btn" id="refreshBtn">Atualizar</button>
                <button type="button" class="btn ghost" id="copyBtn">Copiar JSON</button>
                <button type="button" class="btn ghost" id="downloadJsonBtn">Baixar JSON</button>
                <button type="button" class="btn" id="downloadPdfBtn">Baixar PDF (Resumo)</button>
            </div>
            <p id="statusLine" class="status-line">Aguardando consolidacao de dados.</p>
        </section>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/script.js"></script>
</body>
</html>
