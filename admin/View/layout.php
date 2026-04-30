<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e($appName ?? 'Quotia') ?> - Admin</title>
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link href="<?= e(asset('public/assets/vendor/reamur/css/all.min.css')) ?>" rel="stylesheet">
    <link href="<?= e(asset('public/assets/vendor/reamur/css/theme-switcher.css')) ?>" rel="stylesheet">
    <link href="<?= e(asset('public/assets/css/app.css')) ?>" rel="stylesheet">
    <link href="<?= e(asset('public/assets/css/admin.css')) ?>" rel="stylesheet">
</head>
<?php
$isLoginPage = (bool) ($isLoginPage ?? false);
$isToolWorkspace = (bool) ($isToolWorkspace ?? false);
$currentAdminPath = (string) ($currentPath ?? app()->request()->path());
?>
<body class="aq-admin-theme aq-admin-bg<?= $isLoginPage ? ' aq-admin-auth-page' : '' ?><?= $isToolWorkspace ? ' aq-admin-tools-open' : '' ?>">
<?php if (!$isLoginPage): ?>
    <?php
    $adminUserData = admin_user();
    $adminName = (string) ($adminUserData['name'] ?? 'Administrador');
    $adminAccessLevel = (string) ($adminUserData['access_level'] ?? 'Administrador');
    $adminHomePath = app()->auth()->preferredAdminPath();

    $isActivePath = static function (string $pathPrefix) use ($currentAdminPath): bool {
        if ($currentAdminPath === $pathPrefix) {
            return true;
        }

        return str_starts_with($currentAdminPath, $pathPrefix . '/');
    };

    $menuItems = [];

    if (admin_can('dashboard.view')) {
        $menuItems[] = [
            'label' => 'Dashboard',
            'path' => '/admin/dashboard',
            'icon' => 'fa-solid fa-tachometer-alt',
            'active' => $isActivePath('/admin/dashboard'),
        ];
    }

    if (admin_can('quotes.manage')) {
        $menuItems[] = [
            'label' => 'Solicitacoes',
            'path' => '/admin/orcamentos',
            'icon' => 'fa-solid fa-file-signature',
            'active' => $isActivePath('/admin/orcamentos'),
        ];
        $menuItems[] = [
            'label' => 'Notificacoes Email',
            'path' => '/admin/notificacoes-email',
            'icon' => 'fa-solid fa-envelope-open-text',
            'active' => $isActivePath('/admin/notificacoes-email'),
        ];
    }

    if (admin_can('references.view')) {
        $menuItems[] = [
            'label' => 'Precos e Servicos',
            'path' => '/admin/referencias',
            'icon' => 'fa-solid fa-table',
            'active' => $isActivePath('/admin/referencias'),
        ];
    }

    if (admin_can('taxes.manage')) {
        $menuItems[] = [
            'label' => 'Central Fiscal',
            'path' => '/admin/tributos',
            'icon' => 'fa-solid fa-balance-scale',
            'active' => $isActivePath('/admin/tributos'),
        ];
    }

    if (admin_can('tools.view')) {
        $menuItems[] = [
            'label' => 'Ferramentas',
            'path' => '/admin/ferramentas',
            'icon' => 'fa-solid fa-tools',
            'active' => $isActivePath('/admin/ferramentas'),
        ];
    }

    if (admin_can('categories.manage')) {
        $menuItems[] = [
            'label' => 'Categorias',
            'path' => '/admin/categorias',
            'icon' => 'fa-solid fa-tags',
            'active' => $isActivePath('/admin/categorias'),
        ];
    }

    if (admin_is_general()) {
        $menuItems[] = [
            'label' => 'Usuarios e Permissoes',
            'path' => '/admin/usuarios',
            'icon' => 'fa-solid fa-users-cog',
            'active' => $isActivePath('/admin/usuarios'),
        ];
    }
    ?>
    <div class="aq-admin-app">
        <aside class="aq-admin-sidebar" id="aqAdminSidebar">
            <a class="aq-admin-brand" href="<?= e(url($adminHomePath)) ?>">
                <span class="aq-admin-brand-icon">
                    <i class="fa-brands fa-reamurcms" aria-hidden="true"></i>
                </span>
                <span class="aq-admin-brand-logo">
                    <img src="<?= e(asset('public/assets/vendor/reamur/image/reamurcms.png')) ?>" alt="Reamur">
                </span>
                <span class="aq-admin-brand-text"><?= e($appName ?? 'Quotia') ?> Admin</span>
            </a>

            <div class="aq-admin-user-panel">
                <div class="aq-admin-user-avatar">
                    <i class="fa-solid fa-user-shield"></i>
                </div>
                <div>
                    <div class="aq-admin-user-name"><?= e($adminName) ?></div>
                    <div class="aq-admin-user-role"><?= e($adminAccessLevel) ?></div>
                </div>
            </div>

            <nav class="aq-admin-menu">
                <ul class="aq-admin-menu-list">
                    <?php foreach ($menuItems as $item): ?>
                        <li class="aq-admin-menu-item">
                            <a
                                class="aq-admin-menu-link<?= !empty($item['active']) ? ' is-active' : '' ?>"
                                href="<?= e(url((string) $item['path'])) ?>"
                                title="<?= e((string) $item['label']) ?>"
                            >
                                <span class="aq-admin-menu-icon"><i class="<?= e((string) $item['icon']) ?>"></i></span>
                                <span class="aq-admin-menu-label"><?= e((string) $item['label']) ?></span>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </nav>
        </aside>

        <div class="aq-admin-main-shell">
            <nav class="aq-admin-topbar">
                <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-link aq-admin-toggle" data-admin-sidebar-toggle aria-label="Alternar menu lateral">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                    <div class="aq-admin-topbar-title">
                        <h1 class="aq-admin-topbar-heading mb-0">Painel Administrativo</h1>
                        <div class="aq-admin-topbar-meta">Quotia</div>
                    </div>
                </div>
                <div class="aq-admin-topbar-actions">
                    <button
                        type="button"
                        class="btn btn-outline-secondary btn-sm"
                        data-admin-sidebar-pin
                        aria-label="Fixar ou recolher menu lateral"
                    >
                        <i class="fa-solid fa-thumbtack"></i>
                    </button>
                    <?php if (admin_can('tools.view') && !$isToolWorkspace): ?>
                        <a class="btn btn-light btn-sm border" href="<?= e(url('/admin/ferramentas')) ?>">
                            <i class="fa-solid fa-grip me-1"></i>
                            Ferramentas
                        </a>
                    <?php endif; ?>
                    <a class="btn btn-outline-secondary btn-sm" href="<?= e(url('/admin/logout')) ?>">
                        <i class="fa-solid fa-sign-out-alt me-1"></i>
                        Sair
                    </a>
                </div>
            </nav>

            <main class="aq-admin-content<?= $isToolWorkspace ? ' aq-admin-content-tool' : '' ?>">
                <div class="aq-admin-page<?= $isToolWorkspace ? ' aq-admin-page-tool' : '' ?>">
                    <div class="aq-admin-alert-stack">
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

            <?php if (!$isToolWorkspace): ?>
                <footer class="aq-admin-footer">
                    <div class="aq-admin-footer-links">
                        <a href="<?= e(url('/termos-de-uso')) ?>">Termos de Uso</a>
                        <a href="<?= e(url('/politica-de-uso')) ?>">Politica de Uso</a>
                        <a href="<?= e(url('/politica-de-privacidade')) ?>">Privacidade e Dados</a>
                        <a href="<?= e(url('/politica-de-cookies')) ?>">Cookies</a>
                        <a href="<?= e(url('/lgpd')) ?>">LGPD</a>
                    </div>
                </footer>
            <?php endif; ?>
        </div>
    </div>
<?php else: ?>
    <main class="aq-admin-auth-shell">
        <div class="aq-admin-auth-wrap">
            <div class="aq-admin-alert-stack">
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

    <footer class="aq-admin-auth-footer">
        <div class="aq-admin-footer-links">
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
<script src="<?= e(asset('public/assets/vendor/reamur/js/theme-switcher.js')) ?>"></script>
<script src="<?= e(asset('public/assets/vendor/reamur/js/modal-fix.js')) ?>"></script>
</body>
</html>
