<section class="d-flex justify-content-between align-items-center mb-3">
    <h1 class="h3 mb-0">Solicitacoes e Relatorios</h1>
</section>

<div class="card border-0 shadow-sm">
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
                <th>Relatorio</th>
                <th>Validade</th>
                <th>Acao</th>
            </tr>
            </thead>
            <tbody>
            <?php foreach ($requests as $request): ?>
                <?php
                $statusLabel = match ((string) $request['status']) {
                    'orcado' => 'Orcado',
                    'em_analise' => 'Em analise',
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
