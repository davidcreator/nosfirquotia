<?php
$legalCurrentPath = (string) ($currentPath ?? app()->request()->path());
$legalPageTitle = (string) ($legalPageTitle ?? ($pageTitle ?? 'Documento legal'));
$legalPageDescription = (string) ($legalPageDescription ?? '');
$legalPageIcon = (string) ($legalPageIcon ?? 'fa-solid fa-file-lines');

$legalLinks = [
    ['path' => '/termos-de-uso', 'label' => 'Termos de Uso', 'icon' => 'fa-solid fa-file-contract'],
    ['path' => '/politica-de-uso', 'label' => 'Politica de Uso', 'icon' => 'fa-solid fa-scale-balanced'],
    ['path' => '/politica-de-privacidade', 'label' => 'Privacidade', 'icon' => 'fa-solid fa-user-shield'],
    ['path' => '/politica-de-cookies', 'label' => 'Cookies', 'icon' => 'fa-solid fa-cookie-bite'],
    ['path' => '/lgpd', 'label' => 'LGPD', 'icon' => 'fa-solid fa-id-card-clip'],
];
?>
<header class="card border-0 shadow-sm mb-3">
    <div class="card-body p-4 p-lg-5">
        <div class="d-flex align-items-start gap-3 flex-wrap">
            <span class="aq-legal-badge"><i class="<?= e($legalPageIcon) ?>"></i></span>
            <div>
                <h1 class="h3 mb-2"><?= e($legalPageTitle) ?></h1>
                <?php if ($legalPageDescription !== ''): ?>
                    <p class="text-muted mb-0"><?= e($legalPageDescription) ?></p>
                <?php endif; ?>
            </div>
        </div>

        <nav class="aq-legal-links mt-4" aria-label="Navegacao legal">
            <?php foreach ($legalLinks as $link): ?>
                <?php $isActive = $legalCurrentPath === $link['path']; ?>
                <a class="aq-legal-link<?= $isActive ? ' is-active' : '' ?>" href="<?= e(url((string) $link['path'])) ?>">
                    <i class="<?= e((string) $link['icon']) ?>"></i>
                    <span><?= e((string) $link['label']) ?></span>
                </a>
            <?php endforeach; ?>
        </nav>
    </div>
</header>
