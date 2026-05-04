<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

$uploadCssPath = __DIR__ . '/assets/css/upload-entry.css';
$uploadCssVersion = is_file($uploadCssPath) ? (string) filemtime($uploadCssPath) : '1';
$uploadJsPath = __DIR__ . '/assets/js/upload-entry.js';
$uploadJsVersion = is_file($uploadJsPath) ? (string) filemtime($uploadJsPath) : '1';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MockupHub - Upload e Verificação</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/upload-entry.css?v=<?php echo htmlspecialchars($uploadCssVersion, ENT_QUOTES, 'UTF-8'); ?>">
    <link rel="stylesheet" href="../compatibility.css">
</head>
<body class="aq-tool-fluid aq-tool-mockups mockup-upload-page">
    <header class="upload-header">
        <div class="container upload-header-inner">
            <a class="upload-brand" href="./index.php">
                <i class="fas fa-layer-group" aria-hidden="true"></i>
                <span>MockupHub</span>
            </a>
            <a class="upload-header-link" href="./editor.php">Ir direto para o editor</a>
        </div>
    </header>

    <main class="upload-main">
        <div class="container upload-container">
            <section class="upload-intro">
                <h1>Add new work</h1>
                <p>Comece validando o arquivo que sera aplicado nos mockups.</p>
            </section>

            <section class="upload-options" aria-label="Acoes de entrada">
                <article class="upload-option-card is-primary" id="uploadCard">
                    <div class="upload-option-icon" aria-hidden="true">
                        <i class="fas fa-upload"></i>
                    </div>
                    <h2>Upload new work</h2>
                    <p>Envie uma imagem para verificar formato, peso e resolução mínima.</p>
                    <label for="workFileInput" class="upload-option-button">Selecionar arquivo</label>
                    <input type="file" id="workFileInput" accept=".png,.jpg,.jpeg,image/png,image/jpeg" hidden>
                    <p class="upload-option-note">Formatos aceitos: PNG, JPG e JPEG.</p>
                </article>

                <article class="upload-option-card">
                    <div class="upload-option-icon" aria-hidden="true">
                        <i class="fas fa-copy"></i>
                    </div>
                    <h2>Copy an existing work</h2>
                    <p>Duplique um projeto já existente para manter padrão visual e acelerar entregas.</p>
                    <a class="upload-option-link" href="./editor.php">Abrir biblioteca de mockups</a>
                </article>
            </section>

            <section class="upload-validation" id="validationPanel" aria-live="polite">
                <div class="upload-validation-content">
                    <h3>Verificação do arquivo</h3>
                    <p class="upload-validation-status" id="validationStatus">Selecione um arquivo para iniciar a verificação.</p>

                    <ul class="upload-validation-list">
                        <li data-check="format" class="is-pending">
                            <span class="state-dot" aria-hidden="true">-</span>
                            <span>Formato PNG ou JPG/JPEG</span>
                        </li>
                        <li data-check="size" class="is-pending">
                            <span class="state-dot" aria-hidden="true">-</span>
                            <span>Tamanho maximo de 40 MB</span>
                        </li>
                        <li data-check="resolution" class="is-pending">
                            <span class="state-dot" aria-hidden="true">-</span>
                            <span>Resolução mínima de 5000 x 5000 px</span>
                        </li>
                    </ul>

                    <div class="upload-validation-meta" id="validationMeta" hidden>
                        <p><strong>Arquivo:</strong> <span id="metaName">-</span></p>
                        <p><strong>Tamanho:</strong> <span id="metaSize">-</span></p>
                        <p><strong>Resolução:</strong> <span id="metaResolution">-</span></p>
                    </div>

                    <div class="upload-validation-actions">
                        <button type="button" class="btn-secondary" id="clearUploadBtn" disabled>Limpar</button>
                        <a href="./editor.php" class="btn-primary disabled" id="continueBtn" aria-disabled="true">Ir para o editor</a>
                    </div>
                </div>

                <div class="upload-validation-preview" id="previewWrap" hidden>
                    <img id="previewImage" alt="Preview do arquivo enviado">
                </div>
            </section>

            <section class="upload-info-grid">
                <article class="upload-info-card">
                    <h3>File requirements</h3>
                    <p>Recomendamos imagens em alta resolução com no mínimo 5000 x 5000 px para manter qualidade no mockup final.</p>
                </article>
                <article class="upload-info-card">
                    <h3>What is this?</h3>
                    <p>Esta etapa valida o arquivo antes da edição. Assim você evita retrabalho e garante encaixe correto no editor.</p>
                </article>
            </section>
        </div>
    </main>

    <script src="./assets/js/upload-entry.js?v=<?php echo htmlspecialchars($uploadJsVersion, ENT_QUOTES, 'UTF-8'); ?>"></script>
    <script src="../shared/workflow-assistant.js"></script>
</body>
</html>
