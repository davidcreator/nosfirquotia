<section class="card border-0 shadow-sm">
    <div class="card-body p-4">
        <h2 class="h4 mb-3">Passo 3: Configuracao do Banco e Admin</h2>
        <p class="text-muted mb-4">Informe os dados do banco MySQL e o usuario administrador inicial.</p>

        <form method="post" action="<?= e(url('/index.php?route=/install/step3')) ?>" class="row g-3">
            <div class="col-12">
                <h3 class="h6 text-uppercase text-muted">Banco de Dados</h3>
            </div>
            <div class="col-md-6">
                <label class="form-label">Host</label>
                <input class="form-control" name="db_host" required value="<?= e((string) old('db_host', '127.0.0.1')) ?>">
            </div>
            <div class="col-md-3">
                <label class="form-label">Porta</label>
                <input type="number" class="form-control" name="db_port" required value="<?= e((string) old('db_port', '3306')) ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label">Nome do banco</label>
                <input class="form-control" name="db_name" required value="<?= e((string) old('db_name')) ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label">Usuario do banco</label>
                <input class="form-control" name="db_user" required value="<?= e((string) old('db_user')) ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label">Senha do banco</label>
                <input type="password" class="form-control" name="db_pass" value="<?= e((string) old('db_pass')) ?>">
            </div>

            <div class="col-12 mt-3">
                <h3 class="h6 text-uppercase text-muted">Administrador Geral (instalador)</h3>
            </div>
            <div class="col-md-6">
                <label class="form-label">Nome</label>
                <input class="form-control" name="admin_name" required value="<?= e((string) old('admin_name')) ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" name="admin_email" required value="<?= e((string) old('admin_email')) ?>">
            </div>
            <div class="col-md-6">
                <label class="form-label">Senha</label>
                <input type="password" class="form-control" name="admin_pass" required>
            </div>
            <div class="col-md-6">
                <label class="form-label">Confirmar senha</label>
                <input type="password" class="form-control" name="admin_pass_confirm" required>
            </div>

            <?php $importReference = old('import_reference_prices', '1'); ?>
            <div class="col-12">
                <div class="form-check border rounded-3 p-3 bg-light">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="importReferencePrices"
                        name="import_reference_prices"
                        value="1"
                        <?= $importReference ? 'checked' : '' ?>
                    >
                    <label class="form-check-label fw-semibold" for="importReferencePrices">
                        Importar base de preços e serviços de referência (arquivo `reference_prices_2025.json`)
                    </label>
                    <div class="small text-muted mt-1">
                        Recomendado para o admin gerar orçamentos com valores mínimos e máximos de referência.
                    </div>
                </div>
            </div>

            <div class="col-12 d-flex justify-content-between mt-4">
                <a href="<?= e(url('/index.php?route=/install/step2')) ?>" class="btn btn-outline-secondary">Voltar</a>
                <button class="btn btn-success" type="submit">Instalar sistema</button>
            </div>
        </form>
    </div>
</section>

