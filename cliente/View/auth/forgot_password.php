<section class="aq-client-auth-shell row justify-content-center">
    <div class="col-lg-5">
        <div class="card border-0 shadow-sm aq-client-auth-card">
            <div class="card-body p-4 p-lg-5">
                <span class="aq-client-auth-badge"><i class="fa-solid fa-key"></i></span>
                <h1 class="h3 mb-3">Recuperar senha</h1>
                <p class="text-muted mb-4">Informe o email cadastrado para receber o link de redefinicao.</p>
                <form method="post" action="<?= e(url('/cliente/esqueci-senha')) ?>" class="row g-3">
                    <div class="col-12">
                        <label class="form-label" for="forgotPasswordEmail">Email</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-envelope-open-text"></i></span>
                            <input type="email" class="form-control" id="forgotPasswordEmail" name="email" required autocomplete="email" value="<?= e((string) old('email')) ?>">
                        </div>
                    </div>
                    <div class="col-12 d-grid">
                        <button class="btn btn-primary btn-lg" type="submit">Enviar link de recuperacao</button>
                    </div>
                </form>
                <div class="mt-3 text-center aq-client-auth-links">
                    <small><a href="<?= e(url('/cliente/login')) ?>">Voltar ao login</a></small>
                </div>
            </div>
        </div>
    </div>
</section>
