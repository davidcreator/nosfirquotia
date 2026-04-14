<section class="card border-0 shadow-sm">
    <div class="card-body p-4">
        <h2 class="h4 mb-3">Passo 2: Permissoes de Escrita</h2>
        <p class="text-muted">Estas pastas/arquivos precisam de permissao de escrita para a instalacao.</p>

        <div class="table-responsive mb-4">
            <table class="table align-middle">
                <thead class="table-light">
                <tr>
                    <th>Caminho</th>
                    <th>Real path</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                <?php foreach ($checks as $check): ?>
                    <tr>
                        <td><?= e($check['label']) ?></td>
                        <td><code><?= e($check['detail']) ?></code></td>
                        <td>
                            <?php if ($check['status']): ?>
                                <span class="badge text-bg-success">Gravavel</span>
                            <?php else: ?>
                                <span class="badge text-bg-danger">Sem permissao</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-between">
            <a href="<?= e(url('/index.php?route=/install/step1')) ?>" class="btn btn-outline-secondary">Voltar</a>
            <form method="post" action="<?= e(url('/index.php?route=/install/step2')) ?>">
                <button class="btn btn-primary" type="submit" <?= !$canContinue ? 'disabled' : '' ?>>
                    Continuar para Passo 3
                </button>
            </form>
        </div>
    </div>
</section>
