<section class="aq-client-page-head">
    <div>
        <h1 class="aq-client-page-title">Minhas Solicitacoes</h1>
        <p class="aq-client-page-subtitle">Acompanhe os pedidos enviados e os relatorios emitidos pelo admin.</p>
    </div>
    <a class="btn btn-primary" href="<?= e(url('/orcamento/novo')) ?>">
        <i class="fa-solid fa-plus me-1"></i>
        Nova solicitacao
    </a>
</section>

<?php if ($requests === []): ?>
    <div class="alert alert-info">Voce ainda nao enviou solicitacoes de orcamento.</div>
<?php else: ?>
    <div class="card border-0 shadow-sm aq-client-table-wrap">
        <div class="card-body border-bottom py-3">
            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <h2 class="h5 mb-0">Historico de solicitacoes</h2>
                <span class="badge text-bg-light border"><?= count($requests) ?> registro(s)</span>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table mb-0 align-middle aq-table-stack">
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
                        <td data-label="ID">#<?= (int) $request['id'] ?></td>
                        <td data-label="Projeto"><?= e($request['project_title']) ?></td>
                        <td data-label="Servicos"><?= (int) $request['services_count'] ?></td>
                        <td data-label="Status">
                            <?php
                            $statusCode = (string) $request['status'];
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
                            <span class="<?= e($statusClass) ?>"><i class="<?= e($statusIcon) ?>"></i><?= e($statusLabel) ?></span>
                        </td>
                        <td data-label="Validade">
                            <?php if (!empty($request['valid_until'])): ?>
                                <?= e(date('d/m/Y', strtotime((string) $request['valid_until']))) ?>
                            <?php else: ?>
                                <span class="text-muted">Aguardando</span>
                            <?php endif; ?>
                        </td>
                        <td data-label="Acao">
                            <a class="btn btn-sm btn-outline-primary" href="<?= e(url('/orcamentos/' . (int) $request['id'])) ?>">
                                <i class="fa-solid fa-eye me-1"></i>
                                Detalhes
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
<?php endif; ?>
