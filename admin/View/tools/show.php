<section class="aq-tool-shell">
    <div class="aq-tool-topbar">
        <div class="aq-tool-title">
            <h1 class="h5 mb-1"><?= e($tool['name']) ?></h1>
            <p class="text-muted mb-0 small"><?= e($tool['description']) ?></p>
        </div>
        <div class="aq-tool-actions">
            <a class="btn btn-outline-primary btn-sm" href="<?= e(url('/admin/ferramentas')) ?>">Voltar para ferramentas</a>
            <a class="btn btn-outline-secondary btn-sm" href="<?= e($toolUrl) ?>" target="_blank" rel="noopener noreferrer">Abrir em nova aba</a>
        </div>
    </div>

    <div class="aq-tool-viewport">
        <iframe
            src="<?= e($toolUrl) ?>"
            title="<?= e($tool['name']) ?>"
            class="aq-tool-iframe"
            loading="lazy"
            referrerpolicy="same-origin"
        ></iframe>
    </div>
</section>
