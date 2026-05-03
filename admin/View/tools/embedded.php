<section class="aq-admin-page-hero aq-admin-tool-hero">
    <div class="row g-2 align-items-center">
        <div class="col-lg-8">
            <h1 class="aq-admin-page-hero-title"><?= e((string) $tool['name']) ?></h1>
            <p class="aq-admin-page-hero-subtitle"><?= e((string) $tool['description']) ?></p>
        </div>
        <div class="col-lg-4">
            <div class="aq-admin-page-hero-meta">
                <a class="btn btn-sm btn-outline-light" href="<?= e(url('/admin/ferramentas')) ?>">Voltar para ferramentas</a>
                <a class="btn btn-sm btn-outline-light" href="<?= e((string) $toolDirectUrl) ?>" target="_blank" rel="noopener noreferrer">Abrir rota direta</a>
            </div>
        </div>
    </div>
</section>

<?php $toolHostClass = trim((string) ($toolHostClass ?? 'aq-tool-fluid')); ?>
<section class="aq-admin-tool-embedded-host <?= e($toolHostClass) ?>">
    <?= $toolBodyHtml ?>
</section>
