<section class="mb-3 d-flex justify-content-between align-items-center">
    <div>
        <h1 class="h3 mb-1">Solicitacao #<?= (int) $requestData['id'] ?></h1>
        <p class="text-muted mb-0"><?= e($requestData['project_title']) ?></p>
    </div>
    <div class="d-flex gap-2">
        <a class="btn btn-outline-info" href="<?= e(url('/admin/notificacoes-email')) ?>">Notificacoes Email</a>
        <a class="btn btn-outline-secondary" href="<?= e(url('/admin/orcamentos')) ?>">Voltar</a>
    </div>
</section>

<div class="row g-3 mb-3">
    <div class="col-lg-7">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
                <h2 class="h5 mb-3">Escopo enviado pelo cliente</h2>
                <p class="mb-3"><?= nl2br(e((string) $requestData['scope'])) ?></p>
                <p class="mb-1"><strong>Prazo desejado:</strong> <?= $requestData['desired_deadline_days'] ? (int) $requestData['desired_deadline_days'] . ' dias' : 'Nao informado' ?></p>
                <p class="mb-0"><strong>Disponibilidade desejada:</strong> <?= e((string) ($requestData['requested_availability'] ?? 'Nao informada')) ?></p>
            </div>
        </div>
    </div>
    <div class="col-lg-5">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
                <h2 class="h5 mb-3">Dados do cliente</h2>
                <p class="mb-1"><strong>Nome:</strong> <?= e($requestData['client_name']) ?></p>
                <p class="mb-1"><strong>Email:</strong> <?= e($requestData['client_email']) ?></p>
                <p class="mb-3"><strong>Telefone:</strong> <?= e((string) ($requestData['client_phone'] ?? 'Nao informado')) ?></p>
                <?php
                $requestStatusLabel = match ((string) $requestData['status']) {
                    'orcado' => 'Orcado',
                    'em_analise' => 'Em analise',
                    default => 'Pendente',
                };
                ?>
                <p class="mb-0"><strong>Status:</strong> <?= e($requestStatusLabel) ?></p>
            </div>
        </div>
    </div>
</div>

<section class="card border-0 shadow-sm mb-3">
    <div class="card-body py-3">
        <div class="row g-3 align-items-end">
            <div class="col-md-4 col-lg-3">
                <label class="form-label mb-1" for="companyProfileFilter">Filtro por perfil da empresa</label>
                <select class="form-select form-select-sm" id="companyProfileFilter" data-company-profile-select>
                    <option value="todos">Todos os perfis</option>
                    <option value="mei">MEI</option>
                    <option value="microempresa">Microempresa</option>
                    <option value="pequena">Pequena empresa</option>
                    <option value="media">Media empresa</option>
                    <option value="grande">Grande empresa</option>
                </select>
            </div>
            <div class="col-md-4 col-lg-3">
                <label class="form-label mb-1" for="serviceAreaFilter">Filtro por area</label>
                <select class="form-select form-select-sm" id="serviceAreaFilter" data-service-area-select>
                    <option value="all">Todas as areas</option>
                    <option value="design">Design</option>
                    <option value="development">Desenvolvimento</option>
                </select>
            </div>
            <div class="col-md-4 col-lg-6">
                <div class="small text-muted" data-company-profile-count aria-live="polite">
                    Filtros visuais e de geracao de relatorio por perfil e area.
                </div>
            </div>
        </div>
    </div>
</section>

<section class="card border-0 shadow-sm mb-3">
    <div class="card-body">
        <h2 class="h5 mb-3">Servicos solicitados</h2>
        <div class="table-responsive">
            <table class="table table-sm align-middle">
                <thead class="table-light">
                <tr>
                    <th>Servico</th>
                    <th>Area</th>
                    <th>Referencia</th>
                    <th>Faixa referencial</th>
                </tr>
                </thead>
                <tbody>
                <?php foreach ($services as $service): ?>
                    <?php
                    $serviceProfile = (string) ($service['company_profile'] ?? 'geral');
                    if ($serviceProfile === '') {
                        $serviceProfile = 'geral';
                    }
                    $serviceArea = (string) ($service['service_area'] ?? 'design');
                    $serviceAreaLabel = $serviceArea === 'development' ? 'Desenvolvimento' : 'Design';
                    $serviceAreaBadge = $serviceArea === 'development' ? 'text-bg-info' : 'text-bg-secondary';
                    ?>
                    <tr data-service-profile-row data-profile-context="requested" data-company-profile="<?= e($serviceProfile) ?>" data-service-area="<?= e($serviceArea) ?>">
                        <td><?= e($service['service_name']) ?></td>
                        <td><span class="badge <?= e($serviceAreaBadge) ?>"><?= e($serviceAreaLabel) ?></span></td>
                        <td><?= e((string) ($service['reference_code'] ?? '-')) ?></td>
                        <td>R$ <?= e((string) ($service['min_price_label'] ?? '-')) ?> a R$ <?= e((string) ($service['max_price_label'] ?? '-')) ?></td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</section>

<section class="card border-0 shadow-sm">
    <div class="card-body">
        <h2 class="h5 mb-3">Relatorio de Orcamento (validade 90 dias)</h2>
        <div class="alert alert-secondary">
            Utilize a base completa de referencia para apoiar a precificacao:
            <a href="<?= e(url('/admin/referencias')) ?>">Precos e Servicos</a>.
            Para padroes tributarios, acesse
            <a href="<?= e(url('/admin/tributos')) ?>">Central Fiscal</a>.
        </div>

        <?php if (!empty($requestData['report_id'])): ?>
            <div class="alert alert-success">
                Relatorio gerado em <?= e(date('d/m/Y H:i', strtotime((string) $requestData['report_created_at']))) ?>
                por <?= e((string) ($requestData['report_admin_name'] ?? 'Admin')) ?>.
                Valido ate <?= e(date('d/m/Y', strtotime((string) $requestData['valid_until']))) ?>.
                Total atual: <strong>R$ <?= number_format((float) ($requestData['total_value'] ?? 0), 2, ',', '.') ?></strong>.
            </div>
        <?php endif; ?>

        <form method="post" action="<?= e(url('/admin/orcamentos/' . (int) $requestData['id'] . '/gerar-relatorio')) ?>" class="row g-3" id="quoteReportForm">
            <input type="hidden" name="company_profile" id="companyProfileField" value="todos">
            <?php
            $reportItemsByService = [];
            foreach ($reportItems as $item) {
                $reportItemsByService[(int) ($item['reference_price_item_id'] ?? 0)] = $item;
            }

            $reportTaxesByKey = [];
            foreach ($reportTaxes as $taxRow) {
                $reportTaxesByKey[(string) ($taxRow['tax_key'] ?? '')] = $taxRow;
            }

            $taxDefinitions = [
                'imposto' => [
                    'label' => (string) ($taxSettings['imposto_label'] ?? 'Impostos'),
                    'percent' => (float) ($taxSettings['imposto_percent'] ?? 0),
                ],
                'taxa' => [
                    'label' => (string) ($taxSettings['taxa_label'] ?? 'Taxas'),
                    'percent' => (float) ($taxSettings['taxa_percent'] ?? 0),
                ],
                'encargo' => [
                    'label' => (string) ($taxSettings['encargo_label'] ?? 'Encargos tributarios'),
                    'percent' => (float) ($taxSettings['encargo_percent'] ?? 0),
                ],
            ];

            foreach ($taxDefinitions as $taxKey => $taxDefinition) {
                if (isset($reportTaxesByKey[$taxKey])) {
                    $taxDefinitions[$taxKey]['label'] = (string) ($reportTaxesByKey[$taxKey]['tax_label'] ?? $taxDefinition['label']);
                    $taxDefinitions[$taxKey]['percent'] = (float) ($reportTaxesByKey[$taxKey]['tax_percent'] ?? $taxDefinition['percent']);
                }
            }
            ?>

            <div class="col-12">
                <div class="table-responsive">
                    <table class="table align-middle">
                        <thead class="table-light">
                        <tr>
                            <th>Servico</th>
                            <th>Area</th>
                            <th>Valor (R$)</th>
                            <th>Prazo (dias)</th>
                            <th>Disponibilidade</th>
                            <th>Observacoes</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php foreach ($services as $service): ?>
                            <?php
                            $serviceId = (int) $service['id'];
                            $reportItem = $reportItemsByService[$serviceId] ?? null;
                            $defaultPrice = null;
                            if ($reportItem === null && $service['min_price'] !== null && $service['max_price'] !== null) {
                                $defaultPrice = ((float) $service['min_price'] + (float) $service['max_price']) / 2;
                            }
                            $serviceProfile = (string) ($service['company_profile'] ?? 'geral');
                            if ($serviceProfile === '') {
                                $serviceProfile = 'geral';
                            }
                            $serviceArea = (string) ($service['service_area'] ?? 'design');
                            $serviceAreaLabel = $serviceArea === 'development' ? 'Desenvolvimento' : 'Design';
                            $serviceAreaBadge = $serviceArea === 'development' ? 'text-bg-info' : 'text-bg-secondary';
                            ?>
                            <tr data-service-profile-row data-profile-context="report" data-company-profile="<?= e($serviceProfile) ?>" data-service-area="<?= e($serviceArea) ?>">
                                <td>
                                    <strong><?= e($service['service_name']) ?></strong><br>
                                    <small class="text-muted">Ref.: <?= e((string) ($service['reference_code'] ?? '-')) ?></small>
                                </td>
                                <td><span class="badge <?= e($serviceAreaBadge) ?>"><?= e($serviceAreaLabel) ?></span></td>
                                <td>
                                    <input
                                       type="number"
                                       step="0.01"
                                       min="0.01"
                                       class="form-control form-control-sm js-service-price"
                                       name="price_<?= $serviceId ?>"
                                       required
                                       value="<?= e((string) ($reportItem['price_value'] ?? ($defaultPrice !== null ? number_format($defaultPrice, 2, '.', '') : ''))) ?>"
                                    >
                                </td>
                                <td>
                                    <input type="number" min="1" class="form-control form-control-sm" name="deadline_<?= $serviceId ?>"
                                           value="<?= e((string) ($reportItem['deadline_days'] ?? '')) ?>">
                                </td>
                                <td>
                                    <input class="form-control form-control-sm" name="availability_<?= $serviceId ?>"
                                           value="<?= e((string) ($reportItem['availability_label'] ?? 'Disponivel')) ?>">
                                </td>
                                <td>
                                    <input class="form-control form-control-sm" name="notes_<?= $serviceId ?>"
                                           value="<?= e((string) ($reportItem['notes'] ?? '')) ?>">
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="col-12 mt-2">
                <h3 class="h6 text-uppercase text-muted mb-2">Tributos e Encargos</h3>
                <div class="table-responsive">
                    <table class="table table-sm align-middle mb-0">
                        <thead class="table-light">
                        <tr>
                            <th>Componente</th>
                            <th style="width: 160px;">Percentual (%)</th>
                            <th style="width: 200px;">Estimativa (R$)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php foreach ($taxDefinitions as $taxKey => $taxDefinition): ?>
                            <tr>
                                <td>
                                    <input
                                       class="form-control form-control-sm"
                                       name="tax_label_<?= e($taxKey) ?>"
                                       value="<?= e((string) $taxDefinition['label']) ?>"
                                    >
                                </td>
                                <td>
                                    <input
                                       type="number"
                                       min="0"
                                       max="100"
                                       step="0.01"
                                       class="form-control form-control-sm js-tax-percent"
                                       data-tax-key="<?= e($taxKey) ?>"
                                       name="tax_percent_<?= e($taxKey) ?>"
                                       value="<?= e(number_format((float) $taxDefinition['percent'], 2, '.', '')) ?>"
                                    >
                                </td>
                                <td class="text-end fw-semibold js-tax-amount" data-tax-key="<?= e($taxKey) ?>">R$ 0,00</td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                        <tfoot class="table-light">
                        <tr>
                            <th colspan="2">Subtotal dos servicos</th>
                            <th class="text-end" id="reportSubtotalAmount">R$ 0,00</th>
                        </tr>
                        <tr>
                            <th colspan="2">Total de tributos e encargos</th>
                            <th class="text-end" id="reportTaxesAmount">R$ 0,00</th>
                        </tr>
                        <tr>
                            <th colspan="2">Valor final do orcamento</th>
                            <th class="text-end" id="reportFinalAmount">R$ 0,00</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div class="col-md-4">
                <label class="form-label">Prazo total (dias)</label>
                <input type="number" min="1" class="form-control" name="total_deadline_days"
                       value="<?= e((string) ($requestData['total_deadline_days'] ?? '')) ?>">
            </div>
            <div class="col-md-8">
                <label class="form-label">Resumo de disponibilidade</label>
                <input class="form-control" name="availability_summary"
                       value="<?= e((string) ($requestData['availability_summary'] ?? '')) ?>"
                       placeholder="Ex.: Inicio em ate 5 dias uteis, execucao por etapas.">
            </div>
            <div class="col-12">
                <div class="form-check border rounded-3 p-3 bg-light">
                    <?php $showTaxDetails = !empty($requestData['show_tax_details']); ?>
                    <input class="form-check-input" type="checkbox" id="showTaxDetails" name="show_tax_details" value="1" <?= $showTaxDetails ? 'checked' : '' ?>>
                    <label class="form-check-label fw-semibold" for="showTaxDetails">Exibir impostos, taxas e encargos para o cliente</label>
                    <div class="small text-muted mt-1">Se desmarcado, o cliente vera apenas o valor final consolidado.</div>
                </div>
            </div>
            <div class="col-12">
                <label class="form-label">Observacoes gerais do relatorio</label>
                <textarea class="form-control" rows="3" name="report_notes"><?= e((string) ($requestData['report_notes'] ?? '')) ?></textarea>
            </div>
            <div class="col-12 d-flex justify-content-end">
                <button type="submit" class="btn btn-success">
                    <?= !empty($requestData['report_id']) ? 'Atualizar relatorio' : 'Gerar relatorio' ?>
                </button>
            </div>
        </form>
    </div>
</section>

<script>
(() => {
    const form = document.getElementById('quoteReportForm');
    if (!form) {
        return;
    }

    const profileSelect = document.querySelector('[data-company-profile-select]');
    const areaSelect = document.querySelector('[data-service-area-select]');
    const profileCountNode = document.querySelector('[data-company-profile-count]');
    const profileField = document.getElementById('companyProfileField');
    const profileRows = Array.from(document.querySelectorAll('[data-service-profile-row]'));
    const priceInputs = Array.from(form.querySelectorAll('.js-service-price'));
    const taxInputs = Array.from(form.querySelectorAll('.js-tax-percent'));
    const taxAmountNodes = Array.from(form.querySelectorAll('.js-tax-amount'));
    const subtotalNode = document.getElementById('reportSubtotalAmount');
    const taxesNode = document.getElementById('reportTaxesAmount');
    const finalNode = document.getElementById('reportFinalAmount');

    const normalizeProfile = (value) => String(value || 'geral').toLowerCase().trim();
    const toNumber = (value) => {
        const parsed = parseFloat(String(value).replace(',', '.'));
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const normalizeArea = (value) => String(value || 'design').toLowerCase().trim();
    const matchesProfile = (selectedProfile, rowProfile) => {
        if (selectedProfile === 'todos') {
            return true;
        }

        if (rowProfile === '' || rowProfile === 'geral') {
            return true;
        }

        return selectedProfile === rowProfile;
    };
    const matchesArea = (selectedArea, rowArea) => {
        if (selectedArea === 'all') {
            return true;
        }

        return selectedArea === rowArea;
    };

    const recalc = () => {
        let subtotal = 0;
        let taxesTotal = 0;

        for (const input of priceInputs) {
            if (input.disabled) {
                continue;
            }
            subtotal += toNumber(input.value);
        }

        for (const input of taxInputs) {
            const key = input.dataset.taxKey || '';
            const percent = Math.max(0, Math.min(100, toNumber(input.value)));
            const amount = subtotal * (percent / 100);
            taxesTotal += amount;

            const target = taxAmountNodes.find((node) => node.dataset.taxKey === key);
            if (target) {
                target.textContent = money(amount);
            }
        }

        const finalTotal = subtotal + taxesTotal;
        if (subtotalNode) subtotalNode.textContent = money(subtotal);
        if (taxesNode) taxesNode.textContent = money(taxesTotal);
        if (finalNode) finalNode.textContent = money(finalTotal);
    };

    const applyFilters = () => {
        const selectedProfile = normalizeProfile(profileSelect ? profileSelect.value : 'todos');
        const selectedArea = normalizeArea(areaSelect ? areaSelect.value : 'all');
        const selectedLabel = profileSelect
            ? (profileSelect.options[profileSelect.selectedIndex]?.text || 'Todos os perfis')
            : 'Todos os perfis';
        const selectedAreaLabel = areaSelect
            ? (areaSelect.options[areaSelect.selectedIndex]?.text || 'Todas as areas')
            : 'Todas as areas';
        let requestedVisible = 0;
        let reportVisible = 0;

        if (profileField) {
            profileField.value = selectedProfile;
        }

        for (const row of profileRows) {
            const rowProfile = normalizeProfile(row.dataset.companyProfile || 'geral');
            const rowContext = normalizeProfile(row.dataset.profileContext || '');
            const rowArea = normalizeArea(row.dataset.serviceArea || 'design');
            const visible = matchesProfile(selectedProfile, rowProfile) && matchesArea(selectedArea, rowArea);

            row.classList.toggle('d-none', !visible);

            if (rowContext === 'report') {
                const fields = Array.from(row.querySelectorAll('input, select, textarea'));
                for (const field of fields) {
                    field.disabled = !visible;
                    if (field.classList.contains('js-service-price')) {
                        field.required = visible;
                    }
                }

                if (visible) {
                    reportVisible++;
                }
            } else if (rowContext === 'requested' && visible) {
                requestedVisible++;
            }
        }

        if (profileCountNode) {
            profileCountNode.textContent = selectedLabel + ' | ' + selectedAreaLabel + ': '
                + requestedVisible + ' servicos exibidos na solicitacao e '
                + reportVisible + ' servicos ativos no relatorio.';
        }

        recalc();
    };

    [...priceInputs, ...taxInputs].forEach((input) => {
        input.addEventListener('input', recalc);
        input.addEventListener('change', recalc);
    });

    if (profileSelect) {
        profileSelect.addEventListener('change', applyFilters);
    }

    if (areaSelect) {
        areaSelect.addEventListener('change', applyFilters);
    }

    if (profileSelect || areaSelect) {
        applyFilters();
    } else {
        recalc();
    }
})();
</script>
