<section class="aq-client-auth-shell row justify-content-center">
    <div class="col-lg-5">
        <div class="card border-0 shadow-sm aq-client-auth-card">
            <div class="card-body p-4 p-lg-5">
                <span class="aq-client-auth-badge"><i class="fa-solid fa-user-check"></i></span>
                <h1 class="h3 mb-3">Entrar como Cliente</h1>
                <p class="text-muted mb-4">Acesse para solicitar orcamentos e acompanhar relatorios gerados pelo admin.</p>
                <form method="post" action="<?= e(url('/cliente/login')) ?>" class="row g-3">
                    <div class="col-12">
                        <label class="form-label" for="clientLoginEmail">Email</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-envelope"></i></span>
                            <input type="email" class="form-control" id="clientLoginEmail" name="email" required autocomplete="email" value="<?= e((string) old('email')) ?>">
                        </div>
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="clientLoginPassword">Senha</label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="fa-solid fa-lock"></i></span>
                            <input type="password" class="form-control" id="clientLoginPassword" name="password" required autocomplete="current-password">
                        </div>
                    </div>
                    <div class="col-12 d-grid">
                        <button class="btn btn-primary btn-lg" type="submit">Entrar</button>
                    </div>
                </form>
                <div class="mt-3 text-center aq-client-auth-links">
                    <small class="d-block">Nao tem conta? <a href="<?= e(url('/cliente/cadastro')) ?>">Criar agora</a></small>
                    <small class="d-block mt-1"><a href="<?= e(url('/cliente/esqueci-senha')) ?>">Esqueci minha senha</a></small>
                </div>
            </div>
        </div>
    </div>
</section>
