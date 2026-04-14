<section class="mb-4">
    <h1 class="h3 mb-1">Dashboard</h1>
    <p class="text-muted mb-0">Bem-vindo, <?= e((string) ($adminUser['name'] ?? 'Administrador')) ?>.</p>
</section>

<section class="row g-3 mb-4">
    <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
                <small class="text-muted">Total de solicitacoes</small>
                <div class="display-6 fw-semibold"><?= (int) $stats['total_requests'] ?></div>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
                <small class="text-muted">Solicitacoes pendentes</small>
                <div class="display-6 fw-semibold"><?= (int) $stats['pending_requests'] ?></div>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
                <small class="text-muted">Relatorios gerados</small>
                <div class="display-6 fw-semibold"><?= (int) $stats['generated_reports'] ?></div>
            </div>
        </div>
    </div>
    <div class="col-md-12">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body">
                <small class="text-muted">Volume de orcamentos no mes</small>
                <div class="display-6 fw-semibold">R$ <?= number_format((float) $stats['month_revenue'], 2, ',', '.') ?></div>
            </div>
        </div>
    </div>
    <div class="col-md-12">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-body d-flex justify-content-between align-items-center">
                <div>
                    <small class="text-muted d-block">Base de referencia carregada no banco</small>
                    <strong><?= (int) $stats['reference_items'] ?> servicos disponiveis para orcamento</strong>
                </div>
                <div class="d-flex gap-2">
                    <?php if (admin_can('quotes.manage')): ?>
                        <a class="btn btn-outline-success btn-sm" href="<?= e(url('/admin/notificacoes-email')) ?>">Notificacoes email</a>
                    <?php endif; ?>
                    <?php if (admin_can('references.view')): ?>
                        <a class="btn btn-outline-primary btn-sm" href="<?= e(url('/admin/referencias')) ?>">Ver precos e servicos</a>
                    <?php endif; ?>
                    <?php if (admin_can('taxes.manage')): ?>
                        <a class="btn btn-outline-warning btn-sm" href="<?= e(url('/admin/tributos')) ?>">Central fiscal</a>
                    <?php endif; ?>
                    <?php if (admin_can('tools.view')): ?>
                        <a class="btn btn-outline-secondary btn-sm" href="<?= e(url('/admin/ferramentas')) ?>">Ferramentas</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>

<section>
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 mb-0">Ultimas solicitacoes</h2>
        <a class="btn btn-sm btn-outline-primary" href="<?= e(url('/admin/orcamentos')) ?>">Ver todos</a>
    </div>
    <div class="card border-0 shadow-sm">
        <div class="table-responsive">
            <table class="table mb-0 align-middle">
                <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Projeto</th>
                    <th>Cliente</th>
                    <th>Servicos</th>
                    <th>Status</th>
                    <th>Relatorio</th>
                </tr>
                </thead>
                <tbody>
                <?php foreach ($recent as $quote): ?>
                    <?php
                    $statusLabel = match ((string) $quote['status']) {
                        'orcado' => 'Orcado',
                        'em_analise' => 'Em analise',
                        default => 'Pendente',
                    };
                    ?>
                    <tr>
                        <td>#<?= (int) $quote['id'] ?></td>
                        <td><?= e($quote['project_title']) ?></td>
                        <td><?= e($quote['client_name']) ?></td>
                        <td><?= (int) $quote['services_count'] ?></td>
                        <td><span class="badge text-bg-secondary"><?= e($statusLabel) ?></span></td>
                        <td>
                            <?php if (!empty($quote['total_value'])): ?>
                                R$ <?= number_format((float) $quote['total_value'], 2, ',', '.') ?>
                            <?php else: ?>
                                <span class="text-muted">Nao gerado</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</section>
