<section class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h1 class="h3 mb-1">Base de Precos e Servicos</h1>
        <p class="text-muted mb-0">Tabela de referencia para Design e Desenvolvimento.</p>
    </div>
    <div class="text-end">
        <div><strong><?= (int) $totals['catalogs_total'] ?></strong> catalogos</div>
        <div><strong><?= (int) $totals['items_total'] ?></strong> servicos</div>
    </div>
</section>

<div class="card border-0 shadow-sm mb-3">
    <div class="card-body">
        <div class="row g-3">
            <div class="col-md-8">
                <label class="form-label" for="referenceSearch">Buscar servico</label>
                <input id="referenceSearch" class="form-control" placeholder="Digite codigo, grupo ou nome do servico">
            </div>
            <div class="col-md-4">
                <label class="form-label" for="referenceAreaFilter">Area</label>
                <select id="referenceAreaFilter" class="form-select">
                    <option value="all">Todas as areas</option>
                    <option value="design">Design</option>
                    <option value="development">Desenvolvimento</option>
                </select>
            </div>
            <div class="col-12">
                <p class="small text-muted mb-0" id="referenceFilterSummary">Exibindo todos os servicos da base.</p>
            </div>
        </div>
    </div>
</div>

<div class="accordion" id="referenceAccordion">
    <?php $catalogIndex = 0; foreach ($catalogs as $catalog): $catalogIndex++; ?>
        <?php
        $catalogArea = (string) ($catalog['area'] ?? 'design');
        $catalogAreaLabel = match ($catalogArea) {
            'development' => 'Desenvolvimento',
            'mixed' => 'Misto',
            default => 'Design',
        };
        $catalogAreaBadge = match ($catalogArea) {
            'development' => 'text-bg-info',
            'mixed' => 'text-bg-warning',
            default => 'text-bg-secondary',
        };
        ?>
        <div class="accordion-item border rounded-3 mb-2 shadow-sm" data-reference-catalog data-catalog-area="<?= e($catalogArea) ?>">
            <h2 class="accordion-header" id="refHead<?= $catalogIndex ?>">
                <button class="accordion-button <?= $catalogIndex > 1 ? 'collapsed' : '' ?>" type="button"
                        data-bs-toggle="collapse" data-bs-target="#refCollapse<?= $catalogIndex ?>">
                    <?= e($catalog['label']) ?>
                    <span class="ms-2 badge text-bg-secondary"><?= count($catalog['items']) ?></span>
                    <span class="ms-2 badge <?= e($catalogAreaBadge) ?>"><?= e($catalogAreaLabel) ?></span>
                </button>
            </h2>
            <div id="refCollapse<?= $catalogIndex ?>" class="accordion-collapse collapse <?= $catalogIndex === 1 ? 'show' : '' ?>"
                 data-bs-parent="#referenceAccordion">
                <div class="accordion-body">
                    <div class="table-responsive">
                        <table class="table table-sm align-middle reference-table">
                            <thead class="table-light">
                            <tr>
                                <th>Codigo</th>
                                <th>Grupo</th>
                                <th>Servico</th>
                                <th>Area</th>
                                <th>Minimo</th>
                                <th>Maximo</th>
                            </tr>
                            </thead>
                            <tbody>
                            <?php foreach ($catalog['items'] as $item): ?>
                                <?php
                                $serviceArea = (string) ($item['service_area'] ?? 'design');
                                $serviceAreaLabel = $serviceArea === 'development' ? 'Desenvolvimento' : 'Design';
                                $serviceAreaBadge = $serviceArea === 'development' ? 'text-bg-info' : 'text-bg-secondary';
                                ?>
                                <tr class="reference-row" data-service-area="<?= e($serviceArea) ?>">
                                    <td><?= e((string) ($item['reference_code'] ?? '-')) ?></td>
                                    <td><?= e((string) ($item['group_name'] ?? '-')) ?></td>
                                    <td><?= e($item['service_name']) ?></td>
                                    <td><span class="badge <?= e($serviceAreaBadge) ?>"><?= e($serviceAreaLabel) ?></span></td>
                                    <td>R$ <?= e((string) ($item['min_price_label'] ?? '-')) ?></td>
                                    <td>R$ <?= e((string) ($item['max_price_label'] ?? '-')) ?></td>
                                </tr>
                            <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('referenceSearch');
    const areaFilter = document.getElementById('referenceAreaFilter');
    const summary = document.getElementById('referenceFilterSummary');
    const catalogs = Array.from(document.querySelectorAll('[data-reference-catalog]'));
    if (!input || !areaFilter) return;

    const applyFilters = function () {
        const term = input.value.trim().toLowerCase();
        const area = String(areaFilter.value || 'all').toLowerCase();
        const rows = Array.from(document.querySelectorAll('.reference-row'));
        let visibleServices = 0;

        rows.forEach((row) => {
            const text = row.textContent.toLowerCase();
            const serviceArea = String(row.dataset.serviceArea || 'design').toLowerCase();
            const matchesTerm = term === '' || text.includes(term);
            const matchesArea = area === 'all' || serviceArea === area;
            const isVisible = matchesTerm && matchesArea;
            row.classList.toggle('d-none', !isVisible);

            if (isVisible) {
                visibleServices += 1;
            }
        });

        catalogs.forEach((catalog) => {
            const visibleRows = catalog.querySelectorAll('.reference-row:not(.d-none)').length;
            catalog.classList.toggle('d-none', visibleRows === 0);
        });

        if (summary) {
            const areaLabel = area === 'development' ? 'Desenvolvimento' : (area === 'design' ? 'Design' : 'Todas as areas');
            summary.textContent = areaLabel + ': ' + visibleServices + (visibleServices === 1 ? ' servico visivel.' : ' servicos visiveis.');
        }
    };

    input.addEventListener('input', applyFilters);
    areaFilter.addEventListener('change', applyFilters);
    applyFilters();
});
</script>
