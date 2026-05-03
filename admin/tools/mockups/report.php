<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

$mockupStylePath = __DIR__ . '/assets/css/style.css';
$mockupStyleVersion = is_file($mockupStylePath) ? (string) filemtime($mockupStylePath) : '1';
$reportJsPath = __DIR__ . '/assets/js/report.js';
$reportJsVersion = is_file($reportJsPath) ? (string) filemtime($reportJsPath) : '1';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MockupHub - Relatorio de Orcamento</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/style.css?v=<?php echo htmlspecialchars($mockupStyleVersion, ENT_QUOTES, 'UTF-8'); ?>">
    <link rel="stylesheet" href="../compatibility.css">
</head>
<body class="aq-tool-fluid aq-tool-mockups mockup-report-page">
    <header class="header">
        <div class="container">
            <div class="logo">
                <i class="fas fa-file-invoice-dollar"></i>
                <span>Relatorio de Orcamento</span>
            </div>
            <div class="search-container report-header-actions">
                <button type="button" class="btn-secondary" id="backToEditorBtn">
                    <i class="fas fa-arrow-left"></i>
                    Voltar ao Editor
                </button>
                <button type="button" class="btn-secondary" id="openBrandManualBtn">
                    <i class="fas fa-book-open"></i>
                    Abrir Manual da Marca (MVP)
                </button>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container report-container">
            <section class="hero report-hero">
                <h1>Mockups Salvos para Anexo</h1>
                <p>Selecione os mockups finais, gere o resumo e anexe ao relatorio de orcamento.</p>
                <div class="report-validity-box" id="reportValidityBox">
                    <div>
                        <strong>Emissao:</strong>
                        <span id="reportIssuedAt">-</span>
                    </div>
                    <div>
                        <strong>Valido ate:</strong>
                        <span id="reportExpiresAt">-</span>
                    </div>
                    <div>
                        <strong>Contagem:</strong>
                        <span id="reportCountdown">-</span>
                    </div>
                </div>
                <div class="report-actions">
                    <button type="button" class="btn-primary" id="downloadPayloadBtn">
                        <i class="fas fa-file-download"></i>
                        Baixar JSON do Relatorio
                    </button>
                    <button type="button" class="btn-secondary" id="printReportBtn">
                        <i class="fas fa-print"></i>
                        Imprimir / PDF
                    </button>
                    <button type="button" class="btn-secondary" id="clearSavedBtn">
                        <i class="fas fa-trash"></i>
                        Limpar Mockups Salvos
                    </button>
                </div>
            </section>

            <section class="report-branding">
                <h3>Resumo Geral de Identidade Visual</h3>
                <p class="report-export-hint">As informacoes abaixo integram Color Palette, Color Strategy Advisor, Font Strategy Advisor e Mockups.</p>
                <div class="report-branding-grid">
                    <article class="report-brand-card">
                        <h4>Cores da Marca</h4>
                        <div id="reportBrandPalette" class="report-brand-palette"></div>
                    </article>
                    <article class="report-brand-card">
                        <h4>Tipografia Recomendada</h4>
                        <div id="reportTypographySummary" class="report-typography-summary"></div>
                    </article>
                </div>
                <p id="reportRestrictionNotice" class="report-restriction-note"></p>
            </section>

            <section class="catalog-highlights">
                <article class="stat-card">
                    <span class="stat-label">Mockups salvos</span>
                    <strong class="stat-value" id="reportTotalSaved">0</strong>
                </article>
                <article class="stat-card">
                    <span class="stat-label">Selecionados para anexo</span>
                    <strong class="stat-value" id="reportSelectedCount">0</strong>
                </article>
                <article class="stat-card">
                    <span class="stat-label">Ultima atualizacao</span>
                    <strong class="stat-value" id="reportUpdatedAt">-</strong>
                </article>
            </section>

            <section class="report-empty-state" id="reportEmptyState" style="display: none;">
                <p>Nenhum mockup salvo ainda. Volte ao editor, finalize os ajustes e salve para anexar ao orcamento.</p>
            </section>

            <section class="report-grid" id="reportMockupsGrid"></section>

            <section class="report-export">
                <h3>Resumo para Relatorio de Orcamento</h3>
                <p class="report-export-hint">Use este resumo para anexar no seu fluxo de orcamento ou CRM.</p>
                <textarea id="reportPayload" readonly></textarea>
                <div class="report-actions">
                    <button type="button" class="btn-secondary" id="refreshPayloadBtn">
                        <i class="fas fa-rotate"></i>
                        Atualizar Resumo
                    </button>
                    <button type="button" class="btn-secondary" id="copyPayloadBtn">
                        <i class="fas fa-copy"></i>
                        Copiar Resumo
                    </button>
                </div>
            </section>
        </div>
    </main>

    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/report.js?v=<?php echo htmlspecialchars($reportJsVersion, ENT_QUOTES, 'UTF-8'); ?>"></script>
    <script src="../shared/workflow-assistant.js"></script>
</body>
</html>
