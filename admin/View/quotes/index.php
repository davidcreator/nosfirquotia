<section class="aq-admin-page-hero">
    <div class="row g-2 align-items-center">
        <div class="col-md-8">
            <h1 class="aq-admin-page-hero-title">Solicitacoes e relatorios</h1>
            <p class="aq-admin-page-hero-subtitle">Gestão central de pedidos, status de análise e emissão de propostas.</p>
        </div>
        <div class="col-md-4">
            <div class="aq-admin-page-hero-meta">
                <span class="aq-admin-link-chip"><i class="fa-solid fa-file-signature"></i> Fila ativa</span>
            </div>
        </div>
    </div>
</section>

<div class="aq-admin-panel aq-admin-table-card">
    <div class="aq-admin-panel-header">
        <div>
            <h2 class="aq-admin-panel-title">Lista de solicitacoes</h2>
            <p class="aq-admin-panel-subtitle">Acompanhe cada proposta ate a etapa de conclusao.</p>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table mb-0 align-middle">
            <thead class="table-light">
            <tr>
                <th>ID</th>
                <th>Projeto</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Servicos</th>
                <th>Status</th>
                <th>Relatório</th>
                <th>Validade</th>
                <th>Acao</th>
            </tr>
            </thead>
            <tbody>
            <?php foreach ($requests as $request): ?>
                <?php
                $statusLabel = match ((string) $request['status']) {
                    'orcado' => 'Orcado',
                    'em_analise' => 'Em análise',
                    default => 'Pendente',
                };
                ?>
                <tr>
                    <td>#<?= (int) $request['id'] ?></td>
                    <td><?= e($request['project_title']) ?></td>
                    <td><?= e($request['client_name']) ?></td>
                    <td><?= e($request['client_email']) ?></td>
                    <td><?= (int) $request['services_count'] ?></td>
                    <td><span class="badge text-bg-secondary"><?= e($statusLabel) ?></span></td>
                    <td>
                        <?php if (!empty($request['total_value'])): ?>
                            R$ <?= number_format((float) $request['total_value'], 2, ',', '.') ?>
                        <?php else: ?>
                            <span class="text-muted">Pendente</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <?php if (!empty($request['valid_until'])): ?>
                            <?= e(date('d/m/Y', strtotime((string) $request['valid_until']))) ?>
                        <?php else: ?>
                            <span class="text-muted">-</span>
                        <?php endif; ?>
                    </td>
                    <td>
                        <a class="btn btn-sm btn-outline-primary" href="<?= e(url('/admin/orcamentos/' . (int) $request['id'])) ?>">Detalhes</a>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
