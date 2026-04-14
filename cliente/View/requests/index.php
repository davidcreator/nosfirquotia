<section class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h1 class="h3 mb-1">Minhas Solicitacoes</h1>
        <p class="text-muted mb-0">Acompanhe os pedidos enviados e os relatorios emitidos pelo admin.</p>
    </div>
    <a class="btn btn-primary" href="<?= e(url('/orcamento/novo')) ?>">Nova solicitacao</a>
</section>

<?php if ($requests === []): ?>
    <div class="alert alert-info">Voce ainda nao enviou solicitacoes de orcamento.</div>
<?php else: ?>
    <div class="card border-0 shadow-sm">
        <div class="table-responsive">
            <table class="table mb-0 align-middle">
                <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Projeto</th>
                    <th>Servicos</th>
                    <th>Status</th>
                    <th>Validade</th>
                    <th>Acao</th>
                </tr>
                </thead>
                <tbody>
                <?php foreach ($requests as $request): ?>
                    <tr>
                        <td>#<?= (int) $request['id'] ?></td>
                        <td><?= e($request['project_title']) ?></td>
                        <td><?= (int) $request['services_count'] ?></td>
                        <td>
                            <?php
                            $statusLabel = match ((string) $request['status']) {
                                'orcado' => 'Orcado',
                                'em_analise' => 'Em analise',
                                default => 'Pendente',
                            };
                            ?>
                            <span class="badge text-bg-secondary"><?= e($statusLabel) ?></span>
                        </td>
                        <td>
                            <?php if (!empty($request['valid_until'])): ?>
                                <?= e(date('d/m/Y', strtotime((string) $request['valid_until']))) ?>
                            <?php else: ?>
                                <span class="text-muted">Aguardando</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <a class="btn btn-sm btn-outline-primary" href="<?= e(url('/orcamentos/' . (int) $request['id'])) ?>">Detalhes</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
<?php endif; ?>
