<section class="row justify-content-center">
    <div class="col-lg-6">
        <div class="card border-0 shadow-sm">
            <div class="card-body p-4 p-lg-5">
                <h1 class="h3 mb-3">Criar conta de Cliente</h1>
                <p class="text-muted mb-4">O cadastro e obrigatorio para solicitar um orcamento no Nosfir Quotia.</p>
                <form method="post" action="<?= e(url('/cliente/cadastro')) ?>" class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">Nome</label>
                        <input class="form-control" name="name" required value="<?= e((string) old('name')) ?>">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Telefone (opcional)</label>
                        <input class="form-control" name="phone" value="<?= e((string) old('phone')) ?>">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" required value="<?= e((string) old('email')) ?>">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Senha</label>
                        <input type="password" class="form-control" name="password" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Confirmar senha</label>
                        <input type="password" class="form-control" name="password_confirm" required>
                    </div>
                    <div class="col-12 d-grid">
                        <button class="btn btn-primary btn-lg" type="submit">Criar conta</button>
                    </div>
                </form>
                <div class="mt-3 text-center">
                    <small>Ja possui conta? <a href="<?= e(url('/cliente/login')) ?>">Entrar</a></small>
                </div>
            </div>
        </div>
    </div>
</section>
