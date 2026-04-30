<section class="aq-client-auth-shell row justify-content-center">
    <div class="col-lg-6">
        <div class="card border-0 shadow-sm aq-client-auth-card">
            <div class="card-body p-4 p-lg-5">
                <span class="aq-client-auth-badge"><i class="fa-solid fa-user-plus"></i></span>
                <h1 class="h3 mb-3">Criar conta de Cliente</h1>
                <p class="text-muted mb-4">O cadastro e obrigatorio para solicitar um orcamento no Quotia.</p>
                <form method="post" action="<?= e(url('/cliente/cadastro')) ?>" class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label" for="registerName">Nome</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                            <input class="form-control" id="registerName" name="name" required autocomplete="name" value="<?= e((string) old('name')) ?>">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="registerPhone">Telefone (opcional)</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                            <input class="form-control" id="registerPhone" name="phone" autocomplete="tel" value="<?= e((string) old('phone')) ?>">
                        </div>
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="registerEmail">Email</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                            <input type="email" class="form-control" id="registerEmail" name="email" required autocomplete="email" value="<?= e((string) old('email')) ?>">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="registerPassword">Senha</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                            <input type="password" class="form-control" id="registerPassword" name="password" required autocomplete="new-password">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label" for="registerPasswordConfirm">Confirmar senha</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-shield-halved"></i></span>
                            <input type="password" class="form-control" id="registerPasswordConfirm" name="password_confirm" required autocomplete="new-password">
                        </div>
                    </div>
                    <div class="col-12 d-grid">
                        <button class="btn btn-primary btn-lg" type="submit">Criar conta</button>
                    </div>
                </form>
                <div class="mt-3 text-center aq-client-auth-links">
                    <small>Ja possui conta? <a href="<?= e(url('/cliente/login')) ?>">Entrar</a></small>
                </div>
            </div>
        </div>
    </div>
</section>
