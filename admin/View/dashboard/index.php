<section class="aq-admin-page-hero">
    <div class="row g-2 align-items-center">
        <div class="col-md-8">
            <h1 class="aq-admin-page-hero-title">Dashboard administrativo</h1>
            <p class="aq-admin-page-hero-subtitle">Bem-vindo, <?= e((string) ($adminUser['name'] ?? 'Administrador')) ?>. Veja os principais indicadores operacionais do Quotia.</p>
        </div>
        <div class="col-md-4">
            <div class="aq-admin-page-hero-meta">
                <span class="aq-admin-link-chip"><i class="fa-solid fa-chart-line"></i> Visão geral</span>
            </div>
        </div>
    </div>
</section>

<section class="row g-3 mb-4">
    <div class="col-md-6 col-xl-3">
        <article class="aq-stat-box aq-stat-box-primary">
            <small>Total de solicitações</small>
            <h2><?= (int) $stats['total_requests'] ?></h2>
            <p>Pedidos recebidos</p>
            <span class="aq-stat-icon"><i class="fa-solid fa-inbox"></i></span>
        </article>
    </div>
    <div class="col-md-6 col-xl-3">
        <article class="aq-stat-box aq-stat-box-warning">
            <small>Solicitações pendentes</small>
            <h2><?= (int) $stats['pending_requests'] ?></h2>
            <p>Aguardando análise</p>
            <span class="aq-stat-icon"><i class="fa-solid fa-hourglass-half"></i></span>
        </article>
    </div>
    <div class="col-md-6 col-xl-3">
        <article class="aq-stat-box aq-stat-box-success">
            <small>Relatórios gerados</small>
            <h2><?= (int) $stats['generated_reports'] ?></h2>
            <p>Orçamentos emitidos</p>
            <span class="aq-stat-icon"><i class="fa-solid fa-file-alt"></i></span>
        </article>
    </div>
    <div class="col-md-6 col-xl-3">
        <article class="aq-stat-box aq-stat-box-info">
            <small>Volume no mês</small>
            <h2>R$ <?= number_format((float) $stats['month_revenue'], 2, ',', '.') ?></h2>
            <p>Valor projetado</p>
            <span class="aq-stat-icon"><i class="fa-solid fa-dollar-sign"></i></span>
        </article>
    </div>
</section>

<section class="card border-0 shadow-sm mb-4 aq-admin-filter-bar">
    <div class="card-body d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <div>
            <small class="text-muted d-block">Base de referência carregada no banco</small>
            <strong><?= (int) $stats['reference_items'] ?> serviços disponíveis para orçamento</strong>
        </div>
        <div class="d-flex gap-2 flex-wrap">
            <?php if (admin_can('quotes.manage')): ?>
                <a class="btn btn-outline-success btn-sm" href="<?= e(url('/admin/notificacoes-email')) ?>">Notificações e-mail</a>
            <?php endif; ?>
            <?php if (admin_can('references.view')): ?>
                <a class="btn btn-outline-primary btn-sm" href="<?= e(url('/admin/referencias')) ?>">Ver preços e serviços</a>
            <?php endif; ?>
            <?php if (admin_can('taxes.manage')): ?>
                <a class="btn btn-outline-warning btn-sm" href="<?= e(url('/admin/tributos')) ?>">Central fiscal</a>
            <?php endif; ?>
            <?php if (admin_can('tools.view')): ?>
                <a class="btn btn-outline-secondary btn-sm" href="<?= e(url('/admin/ferramentas')) ?>">Ferramentas</a>
            <?php endif; ?>
        </div>
    </div>
</section>

<section class="aq-admin-panel aq-admin-table-card">
    <div class="aq-admin-panel-header">
        <div>
            <h2 class="aq-admin-panel-title">Últimas solicitações</h2>
            <p class="aq-admin-panel-subtitle">Pedidos recentes para acompanhamento rápido.</p>
        </div>
        <a class="btn btn-sm btn-outline-primary" href="<?= e(url('/admin/orcamentos')) ?>">Ver todos</a>
    </div>
    <div class="table-responsive">
        <table class="table mb-0 align-middle">
            <thead class="table-light">
            <tr>
                <th>ID</th>
                <th>Projeto</th>
                <th>Cliente</th>
                <th>Serviços</th>
                <th>Status</th>
                <th>Relatório</th>
            </tr>
            </thead>
            <tbody>
            <?php foreach ($recent as $quote): ?>
                <?php
                $statusLabel = match ((string) $quote['status']) {
                    'orcado' => 'Orçado',
                    'em_analise' => 'Em análise',
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
                            <span class="text-muted">Não gerado</span>
                        <?php endif; ?>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</section>

