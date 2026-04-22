<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($appName ?? 'Quotia') ?> - Admin</title>
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="<?= e(asset('public/assets/css/app.css')) ?>" rel="stylesheet">
</head>
<?php $isToolWorkspace = (bool) ($isToolWorkspace ?? false); ?>
<body class="aq-admin-bg<?= $isToolWorkspace ? ' aq-admin-tools-open' : '' ?>">
<?php if (!($isLoginPage ?? false)): ?>
    <?php
    $adminUserData = admin_user();
    $adminAccessLevel = (string) ($adminUserData['access_level'] ?? 'Administrador');
    $adminHomePath = app()->auth()->preferredAdminPath();
    ?>
    <nav class="navbar navbar-expand-lg navbar-dark aq-admin-navbar">
        <div class="container-fluid px-3 px-lg-4">
            <a class="navbar-brand fw-semibold" href="<?= e(url($adminHomePath)) ?>">Quotia Admin</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminMenu">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="adminMenu">
                <ul class="navbar-nav ms-auto">
                    <?php if (admin_can('dashboard.view')): ?>
                        <li class="nav-item"><a class="nav-link" href="<?= e(url('/admin/dashboard')) ?>">Dashboard</a></li>
                    <?php endif; ?>
                    <?php if (admin_can('quotes.manage')): ?>
                        <li class="nav-item"><a class="nav-link" href="<?= e(url('/admin/orcamentos')) ?>">Solicitacoes</a></li>
                        <li class="nav-item"><a class="nav-link" href="<?= e(url('/admin/notificacoes-email')) ?>">Notificacoes Email</a></li>
                    <?php endif; ?>
                    <?php if (admin_can('references.view')): ?>
                        <li class="nav-item"><a class="nav-link" href="<?= e(url('/admin/referencias')) ?>">Precos e Servicos</a></li>
                    <?php endif; ?>
                    <?php if (admin_can('taxes.manage')): ?>
                        <li class="nav-item"><a class="nav-link" href="<?= e(url('/admin/tributos')) ?>">Tributos</a></li>
                    <?php endif; ?>
                    <?php if (admin_can('tools.view')): ?>
                        <li class="nav-item"><a class="nav-link" href="<?= e(url('/admin/ferramentas')) ?>">Ferramentas</a></li>
                    <?php endif; ?>
                    <?php if (admin_can('categories.manage')): ?>
                        <li class="nav-item"><a class="nav-link" href="<?= e(url('/admin/categorias')) ?>">Categorias</a></li>
                    <?php endif; ?>
                    <?php if (admin_is_general()): ?>
                        <li class="nav-item"><a class="nav-link" href="<?= e(url('/admin/usuarios')) ?>">Usuarios e Permissoes</a></li>
                    <?php endif; ?>
                    <li class="nav-item"><span class="nav-link disabled"><?= e($adminAccessLevel) ?></span></li>
                    <li class="nav-item"><a class="nav-link" href="<?= e(url('/admin/logout')) ?>">Sair</a></li>
                </ul>
            </div>
        </div>
    </nav>
<?php endif; ?>

<?php if ($isToolWorkspace): ?>
    <main class="aq-admin-main aq-admin-main-tool">
        <?php if ($message = flash('success')): ?>
            <div class="alert alert-success m-2 mb-0"><?= e((string) $message) ?></div>
        <?php endif; ?>
        <?php if ($message = flash('error')): ?>
            <div class="alert alert-danger m-2 mb-0"><?= e((string) $message) ?></div>
        <?php endif; ?>
        <?php if ($message = flash('warning')): ?>
            <div class="alert alert-warning m-2 mb-0"><?= e((string) $message) ?></div>
        <?php endif; ?>
        <?= $content ?>
    </main>
<?php else: ?>
    <main class="aq-admin-main aq-admin-main-fluid px-3 px-lg-4 py-4 py-lg-4">
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

    <footer class="aq-admin-footer px-3 px-lg-4 pb-4">
        <div class="small text-muted d-flex flex-wrap gap-3 justify-content-center">
            <a href="<?= e(url('/termos-de-uso')) ?>">Termos de Uso</a>
            <a href="<?= e(url('/politica-de-uso')) ?>">Politica de Uso</a>
            <a href="<?= e(url('/politica-de-privacidade')) ?>">Privacidade e Dados</a>
            <a href="<?= e(url('/politica-de-cookies')) ?>">Cookies</a>
            <a href="<?= e(url('/lgpd')) ?>">LGPD</a>
        </div>
    </footer>
<?php endif; ?>

<div id="cookieConsentBanner" class="aq-cookie-banner d-none" role="dialog" aria-live="polite" aria-label="Consentimento de cookies">
    <div class="aq-cookie-content">
        <div>
            <strong>Consentimento de cookies</strong>
            <p class="mb-0 small">Cookies essenciais sao usados para autenticacao, seguranca e operacao do sistema.</p>
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
