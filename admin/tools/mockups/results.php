<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

$mockupStylePath = __DIR__ . '/assets/css/style.css';
$mockupStyleVersion = is_file($mockupStylePath) ? (string) filemtime($mockupStylePath) : '1';
$mockupScriptPath = __DIR__ . '/assets/js/script.js';
$mockupScriptVersion = is_file($mockupScriptPath) ? (string) filemtime($mockupScriptPath) : '1';
$resultsScriptPath = __DIR__ . '/assets/js/results.js';
$resultsScriptVersion = is_file($resultsScriptPath) ? (string) filemtime($resultsScriptPath) : '1';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MockupHub - Resultados dos Mockups</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/style.css?v=<?php echo htmlspecialchars($mockupStyleVersion, ENT_QUOTES, 'UTF-8'); ?>">
    <link rel="stylesheet" href="../compatibility.css">
</head>
<body class="aq-tool-fluid aq-tool-mockups mockup-results-page">
    <header class="header">
        <div class="container">
            <div class="logo">
                <i class="fas fa-store"></i>
                <span>Resultados dos Mockups</span>
            </div>
            <div class="search-container report-header-actions">
                <button type="button" class="btn-secondary" id="backToEditorBtn">
                    <i class="fas fa-arrow-left"></i>
                    Voltar ao Editor
                </button>
                <button type="button" class="btn-secondary" id="goToReportBtn">
                    <i class="fas fa-file-invoice-dollar"></i>
                    Abrir Relatorio
                </button>
            </div>
        </div>
    </header>

    <main class="main">
        <div class="container results-container">
            <section class="results-hero" id="resultsHeroSection">
                <div class="results-hero-media">
                    <img id="resultsHeroImage" alt="Arte principal aplicada no mockup">
                </div>
                <div class="results-hero-content">
                    <h1 id="resultsHeroTitle">Resultados dos Mockups</h1>
                    <p class="results-hero-byline" id="resultsHeroByline"></p>
                    <p class="results-hero-description" id="resultsHeroDescription"></p>
                    <div class="results-hero-tags" id="resultsHeroTags"></div>
                    <div class="results-hero-actions">
                        <button type="button" class="btn-primary" id="downloadHeroBtn">
                            <i class="fas fa-download"></i>
                            Baixar amostra principal
                        </button>
                        <button type="button" class="btn-secondary" id="refreshResultsBtn">
                            <i class="fas fa-rotate"></i>
                            Atualizar renderizacao
                        </button>
                    </div>
                </div>
            </section>

            <section class="results-toolbar">
                <div class="results-tabs">
                    <button type="button" class="results-tab is-active" id="shopTabBtn">
                        Shop <span id="resultsProductsCount">0</span> products
                    </button>
                    <button type="button" class="results-tab" id="commentsTabBtn">
                        Comments
                    </button>
                </div>
                <div class="results-filters">
                    <input type="text" id="resultsSearchInput" placeholder="Buscar produtos...">
                    <select id="resultsCategoryFilter">
                        <option value="all">Todas as categorias</option>
                    </select>
                </div>
            </section>

            <p class="results-status" id="resultsStatusMessage"></p>

            <section class="results-grid" id="resultsGrid"></section>

            <section class="results-empty" id="resultsEmptyState" style="display: none;">
                <h3>Sem mockups para exibir</h3>
                <p>Salve pelo menos um mockup no editor para montar a pagina de resultados.</p>
            </section>
        </div>
    </main>

    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/script.js?v=<?php echo htmlspecialchars($mockupScriptVersion, ENT_QUOTES, 'UTF-8'); ?>"></script>
    <script src="./assets/js/results.js?v=<?php echo htmlspecialchars($resultsScriptVersion, ENT_QUOTES, 'UTF-8'); ?>"></script>
</body>
</html>
