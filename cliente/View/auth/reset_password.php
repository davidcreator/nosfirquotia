<section class="aq-client-auth-shell row justify-content-center">
    <div class="col-lg-5">
        <div class="card border-0 shadow-sm aq-client-auth-card">
            <div class="card-body p-4 p-lg-5">
                <span class="aq-client-auth-badge"><i class="fa-solid fa-unlock-keyhole"></i></span>
                <h1 class="h3 mb-3">Redefinir senha</h1>
                <p class="text-muted mb-4">Conta: <strong><?= e((string) ($email ?? '')) ?></strong></p>
                <form method="post" action="<?= e(url('/cliente/redefinir-senha')) ?>" class="row g-3">
                    <input type="hidden" name="token" value="<?= e((string) ($token ?? '')) ?>">
                    <div class="col-12">
                        <label class="form-label" for="resetPassword">Nova senha</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                            <input type="password" class="form-control" id="resetPassword" name="password" minlength="6" required autocomplete="new-password">
                        </div>
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="resetPasswordConfirm">Confirmar nova senha</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-shield-halved"></i></span>
                            <input type="password" class="form-control" id="resetPasswordConfirm" name="password_confirm" minlength="6" required autocomplete="new-password">
                        </div>
                    </div>
                    <div class="col-12 d-grid">
                        <button class="btn btn-success btn-lg" type="submit">Salvar nova senha</button>
                    </div>
                </form>
                <div class="mt-3 text-center aq-client-auth-links">
                    <small><a href="<?= e(url('/cliente/login')) ?>">Voltar ao login</a></small>
                </div>
            </div>
        </div>
    </div>
</section>
