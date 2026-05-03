<section class="aq-admin-page-hero">
    <div class="row g-2 align-items-center">
        <div class="col-md-8">
            <h1 class="aq-admin-page-hero-title">Ferramentas de design</h1>
            <p class="aq-admin-page-hero-subtitle">Area administrativa para acessar utilitarios compativeis com o Quotia.</p>
        </div>
        <div class="col-md-4">
            <div class="aq-admin-page-hero-meta">
                <div class="aq-admin-page-hero-kpi"><strong><?= (int) $availableCount ?></strong> disponiveis</div>
                <div class="aq-admin-page-hero-kpi"><strong><?= (int) $pendingCount ?></strong> pendentes</div>
            </div>
        </div>
    </div>
</section>

<div class="row g-3">
    <?php if (admin_can('taxes.manage')): ?>
        <div class="col-md-6 col-xl-4">
            <article class="card border-0 shadow-sm h-100 aq-admin-tools-card">
                <div class="card-body d-flex flex-column">
                    <h2 class="h5 mb-2">Central Fiscal</h2>
                    <p class="text-muted small flex-grow-1">Governanca fiscal brasileira com regime tributario, retencoes, checklist legal e simulador de impacto no orcamento.</p>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <span class="badge text-bg-primary">Recurso nativo</span>
                        <a class="btn btn-sm btn-primary" href="<?= e(url('/admin/tributos')) ?>">Abrir</a>
                    </div>
                </div>
            </article>
        </div>
    <?php endif; ?>

    <?php foreach ($tools as $tool): ?>
        <div class="col-md-6 col-xl-4">
            <article class="card border-0 shadow-sm h-100 aq-admin-tools-card">
                <div class="card-body d-flex flex-column">
                    <h2 class="h5 mb-2"><?= e($tool['name']) ?></h2>
                    <p class="text-muted small flex-grow-1"><?= e($tool['description']) ?></p>
                    <div class="d-flex justify-content-between align-items-center mt-2">
                        <?php if ($tool['has_entrypoint']): ?>
                            <span class="badge text-bg-success">Compativel</span>
                            <a class="btn btn-sm btn-primary" href="<?= e(url('/admin/ferramentas/' . $tool['slug'])) ?>">Abrir</a>
                        <?php else: ?>
                            <span class="badge text-bg-warning">Pendente</span>
                            <button class="btn btn-sm btn-outline-secondary" disabled>Sem entrypoint</button>
                        <?php endif; ?>
                    </div>
                </div>
            </article>
        </div>
    <?php endforeach; ?>
</div>
