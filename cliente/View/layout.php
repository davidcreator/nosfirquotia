<?php
$metaAppName = (string) ($appName ?? 'Quotia');
$metaDescription = 'Quotia - Sistema para solicitação, análise e emissão de orçamentos de design.';
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
    <title><?= e($metaAppName) ?></title>
    <meta name="description" content="<?= e($metaDescription) ?>">
    <meta property="og:type" content="website">
    <meta property="og:title" content="<?= e($metaAppName) ?>">
    <meta property="og:description" content="<?= e($metaDescription) ?>">
    <meta property="og:url" content="<?= e($metaCanonicalUrl) ?>">
    <meta property="og:image" content="<?= e($metaOgImage) ?>">
    <meta property="og:image:alt" content="<?= e($metaAppName . ' Logo') ?>">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($metaAppName) ?>">
    <meta name="twitter:description" content="<?= e($metaDescription) ?>">
    <meta name="twitter:image" content="<?= e($metaOgImage) ?>">
    <meta name="csrf-token" content="<?= e(csrf_token()) ?>">
    <link rel="icon" type="image/png" href="<?= e($metaFavicon) ?>">
    <link rel="apple-touch-icon" href="<?= e($metaFavicon) ?>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="<?= e(asset('public/assets/vendor/reamur/css/all.min.css')) ?>" rel="stylesheet">
    <link href="<?= e(asset('public/assets/css/app.css')) ?>" rel="stylesheet">
    <link href="<?= e(asset('public/assets/css/client.css')) ?>" rel="stylesheet">
</head>
<body class="aq-client-theme aq-client-bg">
<?php
$clientUser = client_user();
$clientName = (string) ($clientUser['name'] ?? 'Cliente');
$currentClientPath = (string) ($currentPath ?? app()->request()->path());
$isActivePath = static function (string $path) use ($currentClientPath): bool {
    if ($path === '/') {
        return $currentClientPath === '/';
    }
    if ($currentClientPath === $path) {
        return true;
    }
    return str_starts_with($currentClientPath, $path . '/');
};
$clientAuthPaths = [
    '/cliente/login',
    '/cliente/cadastro',
    '/cliente/esqueci-senha',
    '/cliente/redefinir-senha',
];
$isClientAuthPage = in_array($currentClientPath, $clientAuthPaths, true);
$showClientNavbar = $currentClientPath !== '/' && !$isClientAuthPage;
?>
<div class="aq-client-shell">
<?php if ($showClientNavbar): ?>
    <nav class="navbar navbar-expand-lg navbar-dark aq-client-navbar" id="aqClientNavbar">
        <div class="container aq-client-navbar-inner">
            <a class="navbar-brand aq-client-brand" href="<?= e(url('/')) ?>">
                <span class="aq-client-brand-icon"><i class="fa-brands fa-reamurcms" aria-hidden="true"></i></span>
                <span>
                    <strong class="aq-client-brand-title">Quotia</strong>
                    <small class="aq-client-brand-subtitle">Portal do Cliente</small>
                </span>
            </a>
            <button class="navbar-toggler aq-client-navbar-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#clientMenu" aria-controls="clientMenu" aria-expanded="false" aria-label="Alternar navegação">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="clientMenu" data-client-nav-collapse>
                <ul class="navbar-nav ms-auto aq-client-nav-list">
                    <li class="nav-item">
                        <a class="nav-link aq-client-nav-link<?= $isActivePath('/') ? ' is-active' : '' ?>" href="<?= e(url('/')) ?>">
                            <i class="fa-solid fa-house"></i>
                            <span>Início</span>
                        </a>
                    </li>
                    <?php if ($clientUser): ?>
                        <li class="nav-item">
                            <a class="nav-link aq-client-nav-link<?= $isActivePath('/orcamento/novo') ? ' is-active' : '' ?>" href="<?= e(url('/orcamento/novo')) ?>">
                                <i class="fa-solid fa-pen-ruler"></i>
                                <span>Nova Solicitação</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link aq-client-nav-link<?= $isActivePath('/orcamentos') ? ' is-active' : '' ?>" href="<?= e(url('/orcamentos')) ?>">
                                <i class="fa-solid fa-list-check"></i>
                                <span>Minhas Solicitações</span>
                            </a>
                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link aq-client-nav-link<?= $isActivePath('/cliente/cadastro') ? ' is-active' : '' ?>" href="<?= e(url('/cliente/cadastro')) ?>">
                                <i class="fa-solid fa-user-plus"></i>
                                <span>Criar Conta</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link aq-client-nav-link<?= $isActivePath('/cliente/login') ? ' is-active' : '' ?>" href="<?= e(url('/cliente/login')) ?>">
                                <i class="fa-solid fa-right-to-bracket"></i>
                                <span>Entrar</span>
                            </a>
                        </li>
                    <?php endif; ?>
                    <li class="nav-item">
                        <a class="nav-link aq-client-nav-link<?= $isActivePath('/admin') ? ' is-active' : '' ?>" href="<?= e(url('/admin')) ?>">
                            <i class="fa-solid fa-shield"></i>
                            <span>Admin</span>
                        </a>
                    </li>
                    <?php if ($clientUser): ?>
                        <li class="nav-item ms-lg-2">
                            <a class="btn btn-sm aq-client-nav-logout" href="<?= e(url('/cliente/logout')) ?>">
                                <i class="fa-solid fa-right-from-bracket me-1"></i>
                                Sair
                            </a>
                        </li>
                    <?php endif; ?>
                </ul>
                <?php if ($clientUser): ?>
                    <div class="aq-client-user-chip ms-lg-3">
                        <span class="aq-client-user-avatar"><i class="fa-solid fa-user"></i></span>
                        <span class="aq-client-user-name"><?= e($clientName) ?></span>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </nav>
<?php endif; ?>

<main class="aq-client-main">
    <div class="container py-4 py-lg-5">
        <div class="aq-client-alert-stack">
            <?php if ($message = flash('success')): ?>
                <div class="alert alert-success"><?= e((string) $message) ?></div>
            <?php endif; ?>
            <?php if ($message = flash('error')): ?>
                <div class="alert alert-danger"><?= e((string) $message) ?></div>
            <?php endif; ?>
            <?php if ($message = flash('warning')): ?>
                <div class="alert alert-warning"><?= e((string) $message) ?></div>
            <?php endif; ?>
        </div>

        <?= $content ?>
    </div>
</main>

<footer class="aq-client-footer">
    <div class="container">
        <div class="aq-client-footer-links">
            <a href="<?= e(url('/termos-de-uso')) ?>">Termos de Uso</a>
            <a href="<?= e(url('/politica-de-uso')) ?>">Política de Uso</a>
            <a href="<?= e(url('/politica-de-privacidade')) ?>">Privacidade e Dados</a>
            <a href="<?= e(url('/politica-de-cookies')) ?>">Cookies</a>
            <a href="<?= e(url('/lgpd')) ?>">LGPD</a>
        </div>
    </div>
</footer>

<div id="cookieConsentBanner" class="aq-cookie-banner d-none" role="dialog" aria-live="polite" aria-label="Consentimento de cookies">
    <div class="aq-cookie-content">
        <div>
            <strong>Consentimento de cookies</strong>
            <p class="mb-0 small">Utilizamos cookies essenciais para segurança, login e funcionamento da plataforma. Você pode aceitar todos ou manter apenas os essenciais.</p>
        </div>
        <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-sm btn-outline-light" type="button" data-cookie-consent="essential">Somente essenciais</button>
            <button class="btn btn-sm btn-light" type="button" data-cookie-consent="all">Aceitar todos</button>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="<?= e(asset('public/assets/js/app.js')) ?>"></script>
</div>
</body>
</html>
