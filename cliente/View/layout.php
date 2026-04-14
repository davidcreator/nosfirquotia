<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($appName ?? 'Aurea Quotia') ?></title>
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="<?= e(asset('public/assets/css/app.css')) ?>" rel="stylesheet">
</head>
<body class="aq-client-bg">
<?php $clientUser = client_user(); ?>
<nav class="navbar navbar-expand-lg navbar-dark aq-client-navbar">
    <div class="container">
        <a class="navbar-brand fw-bold" href="<?= e(url('/')) ?>">Aurea Quotia</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#clientMenu">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="clientMenu">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item"><a class="nav-link" href="<?= e(url('/')) ?>">Inicio</a></li>
                <?php if ($clientUser): ?>
                    <li class="nav-item"><a class="nav-link" href="<?= e(url('/orcamento/novo')) ?>">Nova Solicitacao</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= e(url('/orcamentos')) ?>">Minhas Solicitacoes</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= e(url('/cliente/logout')) ?>">Sair</a></li>
                <?php else: ?>
                    <li class="nav-item"><a class="nav-link" href="<?= e(url('/cliente/cadastro')) ?>">Criar Conta</a></li>
                    <li class="nav-item"><a class="nav-link" href="<?= e(url('/cliente/login')) ?>">Entrar</a></li>
                <?php endif; ?>
                <li class="nav-item"><a class="nav-link" href="<?= e(url('/admin')) ?>">Admin</a></li>
            </ul>
        </div>
    </div>
</nav>

<main class="container py-4 py-lg-5">
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

<footer class="container pb-4">
    <div class="small text-muted d-flex flex-wrap gap-3 justify-content-center">
        <a href="<?= e(url('/termos-de-uso')) ?>">Termos de Uso</a>
        <a href="<?= e(url('/politica-de-uso')) ?>">Politica de Uso</a>
        <a href="<?= e(url('/politica-de-privacidade')) ?>">Privacidade e Dados</a>
        <a href="<?= e(url('/politica-de-cookies')) ?>">Cookies</a>
        <a href="<?= e(url('/lgpd')) ?>">LGPD</a>
    </div>
</footer>

<div id="cookieConsentBanner" class="aq-cookie-banner d-none" role="dialog" aria-live="polite" aria-label="Consentimento de cookies">
    <div class="aq-cookie-content">
        <div>
            <strong>Consentimento de cookies</strong>
            <p class="mb-0 small">Utilizamos cookies essenciais para seguranca, login e funcionamento da plataforma. Voce pode aceitar todos ou manter apenas os essenciais.</p>
        </div>
        <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-sm btn-outline-light" type="button" data-cookie-consent="essential">Somente essenciais</button>
            <button class="btn btn-sm btn-light" type="button" data-cookie-consent="all">Aceitar todos</button>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="<?= e(asset('public/assets/js/app.js')) ?>"></script>
</body>
</html>
