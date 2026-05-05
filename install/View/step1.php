<section class="card border-0 shadow-sm">
    <div class="card-body p-4">
        <h2 class="h4 mb-3">Passo 1: Validacao de Requisitos</h2>
        <p class="text-muted">Confira se o ambiente do servidor esta pronto para executar o Nosfir Quotia.</p>

        <div class="table-responsive mb-4">
            <table class="table align-middle">
                <thead class="table-light">
                <tr>
                    <th>Item</th>
                    <th>Detalhes</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                <?php foreach ($checks as $check): ?>
                    <tr>
                        <td><?= e($check['label']) ?></td>
                        <td><?= e($check['detail']) ?></td>
                        <td>
                            <?php if ($check['status']): ?>
                                <span class="badge text-bg-success">OK</span>
                            <?php else: ?>
                                <span class="badge text-bg-danger">Falhou</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <form method="post" action="<?= e(url('/index.php?route=/install/step1')) ?>" class="d-flex justify-content-end">
            <?= csrf_field() ?>
            <button class="btn btn-primary" type="submit" <?= !$canContinue ? 'disabled' : '' ?>>
                Continuar para Passo 2
            </button>
        </form>
    </div>
</section>
