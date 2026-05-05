<section class="aq-admin-page-hero">
    <div class="row g-2 align-items-center">
        <div class="col-md-8">
            <h1 class="aq-admin-page-hero-title">Notificações de e-mail</h1>
            <p class="aq-admin-page-hero-subtitle">Historico de envio de emails do sistema para clientes e administradores.</p>
        </div>
        <div class="col-md-4">
            <div class="aq-admin-page-hero-meta">
                <a href="<?= e(url('/admin/orcamentos')) ?>" class="btn btn-sm btn-outline-light">Voltar para orçamentos</a>
            </div>
        </div>
    </div>
</section>

<section class="aq-admin-panel aq-admin-table-card">
    <div class="aq-admin-panel-header">
        <div>
            <h2 class="aq-admin-panel-title">Historico de mensagens</h2>
            <p class="aq-admin-panel-subtitle">Status de entrega e ocorrencias de notificacao.</p>
        </div>
    </div>
    <div class="aq-admin-panel-body">
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
