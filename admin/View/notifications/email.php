<section class="mb-3 d-flex justify-content-between align-items-center">
    <div>
        <h1 class="h3 mb-1">Notificacoes de Email</h1>
        <p class="text-muted mb-0">Historico de envio de emails do sistema para clientes e administradores.</p>
    </div>
    <a href="<?= e(url('/admin/orcamentos')) ?>" class="btn btn-outline-secondary btn-sm">Voltar para orcamentos</a>
</section>

<section class="card border-0 shadow-sm">
    <div class="card-body">
        <?php if ($logs === []): ?>
            <div class="alert alert-info mb-0">Nenhuma notificacao de email registrada ate o momento.</div>
        <?php else: ?>
            <div class="table-responsive">
                <table class="table align-middle mb-0">
                    <thead class="table-light">
                    <tr>
                        <th>Data</th>
                        <th>Contexto</th>
                        <th>Destinatario</th>
                        <th>Assunto</th>
                        <th>Status</th>
                        <th>Detalhes</th>
                    </tr>
                    </thead>
                    <tbody>
                    <?php foreach ($logs as $log): ?>
                        <?php
                        $status = (string) $log['status'];
                        $badgeClass = match ($status) {
                            'sent' => 'text-bg-success',
                            'invalid_email' => 'text-bg-warning',
                            default => 'text-bg-danger',
                        };
                        ?>
                        <tr>
                            <td><?= e(date('d/m/Y H:i', strtotime((string) $log['created_at']))) ?></td>
                            <td>
                                <div><strong><?= e((string) $log['context_key']) ?></strong></div>
                                <?php if (!empty($log['related_type']) && !empty($log['related_id'])): ?>
                                    <small class="text-muted"><?= e((string) $log['related_type']) ?> #<?= (int) $log['related_id'] ?></small>
                                <?php endif; ?>
                            </td>
                            <td>
                                <div><?= e((string) ($log['recipient_name'] ?? '-')) ?></div>
                                <small class="text-muted"><?= e((string) $log['recipient_email']) ?></small>
                            </td>
                            <td><?= e((string) $log['subject']) ?></td>
                            <td><span class="badge <?= e($badgeClass) ?>"><?= e($status) ?></span></td>
                            <td><?= e((string) ($log['error_message'] ?? '-')) ?></td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>
    </div>
</section>
