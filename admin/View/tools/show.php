<section class="aq-admin-page-hero aq-admin-tool-hero">
    <div class="row g-2 align-items-center">
        <div class="col-lg-8">
            <h1 class="aq-admin-page-hero-title"><?= e($tool['name']) ?></h1>
            <p class="aq-admin-page-hero-subtitle"><?= e($tool['description']) ?></p>
        </div>
        <div class="col-lg-4">
            <div class="aq-admin-page-hero-meta">
                <a class="btn btn-sm btn-outline-light" href="<?= e(url('/admin/ferramentas')) ?>">Voltar para ferramentas</a>
                <a class="btn btn-sm btn-outline-light" href="<?= e($toolUrl) ?>" target="_blank" rel="noopener noreferrer">Abrir em nova aba</a>
            </div>
        </div>
    </div>
</section>

<section class="aq-admin-panel aq-admin-tool-panel">
    <div class="aq-admin-panel-header">
        <div>
            <h2 class="aq-admin-panel-title">Workspace da ferramenta</h2>
            <p class="aq-admin-panel-subtitle">Padrao visual unificado com o painel administrativo.</p>
        </div>
    </div>
    <div class="aq-admin-panel-body aq-admin-tool-panel-body">
        <div class="aq-tool-frame-shell">
            <iframe
                id="aqToolFrame"
                src="<?= e($toolUrl) ?>"
                title="<?= e($tool['name']) ?>"
                class="aq-tool-iframe"
                loading="lazy"
                referrerpolicy="same-origin"
                data-admin-tool-frame
                data-tool-name="<?= e((string) $tool['name']) ?>"
                data-tool-list-url="<?= e(url('/admin/ferramentas')) ?>"
                data-tool-open-url="<?= e($toolUrl) ?>"
            ></iframe>
        </div>
    </div>
</section>
