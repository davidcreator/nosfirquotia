<?php $hasReport = !empty($requestData['report_id']); ?>
<?php $isQuoteExpired = $hasReport && !empty($requestData['valid_until']) && strtotime((string) $requestData['valid_until']) < time(); ?>
<?php $protectReport = $hasReport; ?>
<?php
$statusCode = (string) ($requestData['status'] ?? 'pendente');
$statusLabel = match ($statusCode) {
    'orcado' => 'Orcado',
    'em_analise' => 'Em analise',
    default => 'Pendente',
};
$statusClass = match ($statusCode) {
    'orcado' => 'aq-client-status aq-client-status-orcado',
    'em_analise' => 'aq-client-status aq-client-status-analise',
    default => 'aq-client-status aq-client-status-pending',
};
$statusIcon = match ($statusCode) {
    'orcado' => 'fa-solid fa-check',
    'em_analise' => 'fa-solid fa-magnifying-glass',
    default => 'fa-solid fa-clock',
};
?>

<section class="aq-client-page-head">
    <div>
        <h1 class="aq-client-page-title mb-1">Solicitacao #<?= (int) $requestData['id'] ?></h1>
        <p class="aq-client-page-subtitle mb-2"><?= e($requestData['project_title']) ?></p>
        <span class="<?= e($statusClass) ?>"><i class="<?= e($statusIcon) ?>"></i><?= e($statusLabel) ?></span>
    </div>
    <a class="btn btn-outline-secondary" href="<?= e(url('/orcamentos')) ?>">
        <i class="fa-solid fa-arrow-left me-1"></i>
        Voltar
    </a>
</section>

<div class="row g-3">
    <div class="col-lg-7">
        <div class="card border-0 shadow-sm aq-request-scope">
            <div class="card-body">
                <h2 class="h5 mb-3"><i class="fa-solid fa-file-lines me-2 text-primary"></i>Escopo solicitado</h2>
                <p class="mb-3"><?= nl2br(e((string) $requestData['scope'])) ?></p>
                <p class="mb-1"><strong>Prazo desejado:</strong> <?= $requestData['desired_deadline_days'] ? (int) $requestData['desired_deadline_days'] . ' dias' : 'Nao informado' ?></p>
                <p class="mb-0"><strong>Disponibilidade desejada:</strong> <?= e((string) ($requestData['requested_availability'] ?? 'Nao informado')) ?></p>
            </div>
        </div>
    </div>
    <div class="col-lg-5">
        <div class="card border-0 shadow-sm aq-request-services">
            <div class="card-body">
                <h2 class="h5 mb-3"><i class="fa-solid fa-list-check me-2 text-primary"></i>Servicos selecionados</h2>
                <?php if ($services === []): ?>
                    <p class="text-muted mb-0">Nenhum servico vinculado.</p>
                <?php else: ?>
                    <ul class="small mb-0">
                        <?php foreach ($services as $service): ?>
                            <li>
                                <?= e((string) ($service['reference_code'] ? '[' . $service['reference_code'] . '] ' : '') . $service['service_name']) ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

<section class="mt-3" data-quote-report-container="<?= $protectReport ? '1' : '0' ?>">
    <div class="card border-0 shadow-sm aq-request-report">
        <div class="card-body<?= $protectReport ? ' aq-quote-report-protected' : '' ?>">
            <h2 class="h5 mb-3"><i class="fa-solid fa-file-invoice-dollar me-2 text-primary"></i>Relatorio do Orcamento</h2>
            <?php if (empty($requestData['report_id'])): ?>
                <div class="alert alert-info mb-0">Seu pedido esta em analise. O admin ira gerar o relatorio em breve.</div>
            <?php else: ?>
                <?php $showTaxDetails = !empty($requestData['show_tax_details']); ?>
                <div class="alert alert-warning border small aq-quote-security-note">
                    Consulta habilitada. Copia de conteudo e impressao/PDF estao bloqueados para este relatorio.
                    <?php if ($isQuoteExpired): ?>
                        <strong class="d-block mt-1">Status: validade expirada, consulta apenas.</strong>
                    <?php endif; ?>
                </div>
                <?php if ($showTaxDetails): ?>
                    <p class="mb-1"><strong>Subtotal dos servicos:</strong> R$ <?= number_format((float) ($requestData['subtotal_value'] ?? 0), 2, ',', '.') ?></p>
                    <p class="mb-1"><strong>Total de tributos e encargos:</strong> R$ <?= number_format((float) ($requestData['taxes_total_value'] ?? 0), 2, ',', '.') ?></p>
                <?php endif; ?>
                <p class="mb-1"><strong>Valor total:</strong> R$ <?= number_format((float) $requestData['total_value'], 2, ',', '.') ?></p>
                <p class="mb-1"><strong>Prazo total estimado:</strong> <?= $requestData['total_deadline_days'] ? (int) $requestData['total_deadline_days'] . ' dias' : 'A combinar' ?></p>
                <p class="mb-1"><strong>Disponibilidade:</strong> <?= e((string) ($requestData['availability_summary'] ?? 'Nao informada')) ?></p>
                <p class="mb-3">
                    <strong>Validade:</strong>
                    <?= e(date('d/m/Y', strtotime((string) $requestData['valid_until']))) ?>
                    <span class="text-muted">(este orcamento e valido por 90 dias)</span>
                </p>

                <?php if ($showTaxDetails): ?>
                    <?php if ($reportTaxes === []): ?>
                        <div class="alert alert-light border small">Sem componentes tributarios adicionais neste relatorio.</div>
                    <?php else: ?>
                        <div class="table-responsive mb-3">
                            <table class="table table-sm align-middle aq-table-stack">
                                <thead class="table-light">
                                <tr>
                                    <th>Tributo/Encargo</th>
                                    <th>Percentual</th>
                                    <th>Valor</th>
                                </tr>
                                </thead>
                                <tbody>
                                <?php foreach ($reportTaxes as $tax): ?>
                                    <tr>
                                        <td data-label="Tributo/Encargo"><?= e((string) $tax['tax_label']) ?></td>
                                        <td data-label="Percentual"><?= number_format((float) $tax['tax_percent'], 2, ',', '.') ?>%</td>
                                        <td data-label="Valor">R$ <?= number_format((float) $tax['tax_amount'], 2, ',', '.') ?></td>
                                    </tr>
                                <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                <?php else: ?>
                    <div class="alert alert-light border small">
                        O admin optou por nao exibir o detalhamento de impostos, taxas e encargos para este relatorio.
                    </div>
                <?php endif; ?>

                <div class="table-responsive mb-3">
                    <table class="table table-sm align-middle aq-table-stack">
                        <thead class="table-light">
                        <tr>
                            <th>Servico</th>
                            <th>Valor</th>
                            <th>Prazo</th>
                            <th>Disponibilidade</th>
                            <th>Observacoes</th>
                        </tr>
                        </thead>
                        <tbody>
                        <?php foreach ($reportItems as $item): ?>
                            <tr>
                                <td data-label="Servico"><?= e($item['service_name']) ?></td>
                                <td data-label="Valor">R$ <?= number_format((float) $item['price_value'], 2, ',', '.') ?></td>
                                <td data-label="Prazo"><?= $item['deadline_days'] ? (int) $item['deadline_days'] . ' dias' : 'A combinar' ?></td>
                                <td data-label="Disponibilidade"><?= e((string) ($item['availability_label'] ?? '-')) ?></td>
                                <td data-label="Observacoes"><?= e((string) ($item['notes'] ?? '-')) ?></td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>

                <p class="mb-0"><strong>Observacoes gerais:</strong><br><?= nl2br(e((string) ($requestData['report_notes'] ?? 'Sem observacoes.'))) ?></p>
            <?php endif; ?>
        </div>
    </div>
</section>

<?php if ($protectReport): ?>
    <style>
        [data-quote-report-container="1"] .aq-quote-report-protected {
            user-select: none;
            -webkit-user-select: none;
        }

        @media print {
            body.aq-quote-print-block * {
                visibility: hidden !important;
            }

            body.aq-quote-print-block::before {
                content: "Impressao/PDF bloqueados para este relatorio.";
                visibility: visible !important;
                position: fixed;
                inset: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                padding: 24px;
                background: #ffffff;
                color: #991b1b;
                font-size: 20px;
                font-family: "Segoe UI", Arial, sans-serif;
            }
        }
    </style>
    <script>
        (function quoteReportProtection() {
            const root = document.querySelector('[data-quote-report-container="1"]');
            if (!root) {
                return;
            }

            document.body.classList.add('aq-quote-print-block');

            const copyMessage = 'Copia de conteudo bloqueada para este relatorio.';
            const printMessage = 'Impressao/PDF bloqueados para este relatorio.';
            let hasWarnedCopy = false;
            let hasWarnedPrint = false;

            const warnCopy = () => {
                if (!hasWarnedCopy) {
                    alert(copyMessage);
                    hasWarnedCopy = true;
                }
            };

            const warnPrint = () => {
                if (!hasWarnedPrint) {
                    alert(printMessage);
                    hasWarnedPrint = true;
                }
            };

            const blockCopyEvent = (event) => {
                event.preventDefault();
                warnCopy();
            };

            document.addEventListener('copy', blockCopyEvent, true);
            document.addEventListener('cut', blockCopyEvent, true);
            root.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                warnCopy();
            });

            document.addEventListener('keydown', (event) => {
                const key = String(event.key || '').toLowerCase();
                const withCtrlOrMeta = Boolean(event.ctrlKey || event.metaKey);
                if (!withCtrlOrMeta) {
                    return;
                }

                if (key === 'c' || key === 'x') {
                    event.preventDefault();
                    warnCopy();
                    return;
                }

                if (key === 'p') {
                    event.preventDefault();
                    warnPrint();
                }
            }, true);

            if (typeof window.print === 'function') {
                const nativePrint = window.print.bind(window);
                window.print = function blockedPrint() {
                    warnPrint();
                    return undefined;
                };
                window.__aqNativePrint = nativePrint;
            }
        }());
    </script>
<?php endif; ?>
