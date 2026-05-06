<?php
$metaAppName = (string) ($appName ?? 'Nosfir Quotia');
$metaPageTitle = 'Instalacao - ' . $metaAppName;
$metaDescription = 'Instalador do Quotia para configuracao inicial do sistema.';
$metaPath = (string) ($currentPath ?? app()->request()->path());
$metaCanonicalUrl = absolute_url($metaPath);
$metaOgImagePath = asset('image/quotia_logo.png');
$metaOgImage = absolute_url($metaOgImagePath);
$metaFavicon = asset('image/quotia.png');
?>
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($metaPageTitle) ?></title>
    <meta name="description" content="<?= e($metaDescription) ?>">
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?= e($metaPageTitle) ?>">
    <meta property="og:description" content="<?= e($metaDescription) ?>">
    <meta property="og:url" content="<?= e($metaCanonicalUrl) ?>">
    <meta property="og:image" content="<?= e($metaOgImage) ?>">
    <meta property="og:image:alt" content="<?= e($metaAppName . ' Logo') ?>">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($metaPageTitle) ?>">
    <meta name="twitter:description" content="<?= e($metaDescription) ?>">
    <meta name="twitter:image" content="<?= e($metaOgImage) ?>">
    <meta name="csrf-token" content="<?= e(csrf_token()) ?>">
    <link rel="icon" type="image/png" href="<?= e($metaFavicon) ?>">
    <link rel="apple-touch-icon" href="<?= e($metaFavicon) ?>">
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="<?= e(asset('public/assets/css/app.css')) ?>" rel="stylesheet">
</head>
<body class="aq-install-bg">
<main class="container py-4 py-lg-5">
    <section class="text-center mb-4">
        <h1 class="h2 mb-2">Instalador Nosfir Quotia</h1>
        <p class="text-muted">Configuracao inicial em 4 passos no estilo OpenCart.</p>
    </section>

    <?php
    $steps = [
        1 => 'Requisitos',
        2 => 'Permissoes',
        3 => 'Banco e Admin',
        4 => 'Conclusao',
    ];
    ?>
    <section class="mb-4">
        <div class="d-flex flex-wrap justify-content-center gap-2">
            <?php foreach ($steps as $index => $label): ?>
                <?php
                $class = 'badge rounded-pill text-bg-secondary px-3 py-2';
                if (($step ?? 1) === $index) {
                    $class = 'badge rounded-pill text-bg-primary px-3 py-2';
                } elseif (($step ?? 1) > $index) {
                    $class = 'badge rounded-pill text-bg-success px-3 py-2';
                }
                ?>
                <span class="<?= $class ?>"><?= $index ?>. <?= e($label) ?></span>
            <?php endforeach; ?>
        </div>
    </section>

    <?php if ($message = flash('success')): ?>
        <div class="alert alert-success"><?= e((string) $message) ?></div>
    <?php endif; ?>
    <?php if ($message = flash('error')): ?>
        <div class="alert alert-danger"><?= e((string) $message) ?></div>
    <?php endif; ?>
    <?php if ($message = flash('warning')): ?>
        <div class="alert alert-warning"><?= e((string) $message) ?></div>
    <?php endif; ?>

    <?= $content ?>
</main>
</body>
</html>
