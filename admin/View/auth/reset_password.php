<section class="row justify-content-center">
    <div class="col-lg-5">
        <div class="card border-0 shadow-sm">
            <div class="card-body p-4 p-lg-5">
                <div class="aq-admin-auth-brand">
                    <span class="aq-admin-auth-brand-icon"><i class="fa-solid fa-key"></i></span>
                    <span class="aq-admin-auth-brand-text"><?= e($appName ?? 'Quotia') ?> Admin</span>
                </div>
                <h1 class="h3 mb-3">Redefinir senha admin</h1>
                <p class="text-muted mb-4">Conta: <strong><?= e((string) ($email ?? '')) ?></strong></p>
                <form method="post" action="<?= e(url('/admin/redefinir-senha')) ?>" class="row g-3">
                    <input type="hidden" name="token" value="<?= e((string) ($token ?? '')) ?>">
                    <div class="col-12">
                        <label class="form-label">Nova senha</label>
                        <div class="input-group">
                            <input type="password" class="form-control" name="password" minlength="6" required placeholder="Nova senha">
                            <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                        </div>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Confirmar nova senha</label>
                        <div class="input-group">
                            <input type="password" class="form-control" name="password_confirm" minlength="6" required placeholder="Confirme a nova senha">
                            <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                        </div>
                    </div>
                    <div class="col-12 d-grid">
                        <button class="btn btn-success btn-lg" type="submit">Salvar nova senha</button>
                    </div>
                </form>
                <div class="mt-3 text-center">
                    <small><a href="<?= e(url('/admin')) ?>">Voltar ao login admin</a></small>
                </div>
            </div>
        </div>
    </div>
</section>
