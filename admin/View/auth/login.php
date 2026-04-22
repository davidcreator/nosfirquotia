<section class="row justify-content-center">
    <div class="col-lg-5">
        <div class="card border-0 shadow-sm">
            <div class="card-body p-4 p-lg-5">
                <h1 class="h3 mb-3">Login Administrativo</h1>
                <p class="text-muted mb-4">Acesse para gerenciar orcamentos e categorias do Quotia.</p>
                <form method="post" action="<?= e(url('/admin/login')) ?>" class="row g-3">
                    <div class="col-12">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" required value="<?= e((string) old('email')) ?>">
                    </div>
                    <div class="col-12">
                        <label class="form-label">Senha</label>
                        <input type="password" class="form-control" name="password" required>
                    </div>
                    <div class="col-12 d-grid">
                        <button class="btn btn-primary btn-lg" type="submit">Entrar</button>
                    </div>
                </form>
                <div class="mt-3 text-center">
                    <small><a href="<?= e(url('/admin/esqueci-senha')) ?>">Esqueci minha senha</a></small>
                </div>
            </div>
        </div>
    </div>
</section>
