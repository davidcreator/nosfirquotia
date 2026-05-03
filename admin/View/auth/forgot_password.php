<section class="aq-admin-auth-card aq-admin-auth-card-split">
    <div class="aq-admin-auth-info">
        <div class="aq-admin-auth-brand">
            <span class="aq-admin-auth-brand-icon"><img src="<?= e(asset('image/quotia_logo_wt.png')) ?>" alt="Quotia"></span>
            <span class="aq-admin-auth-brand-text"><?= e($appName ?? 'Quotia') ?> Admin</span>
        </div>
        <h1><i class="fa-solid fa-key"></i> Recuperar acesso</h1>
        <p>Receba um link seguro para redefinir sua senha administrativa e retomar o controle da sua conta.</p>
        <ul class="aq-admin-auth-feature-list">
            <li><i class="fa-solid fa-envelope-circle-check"></i> Envio imediato para o email cadastrado</li>
            <li><i class="fa-solid fa-user-shield"></i> Processo protegido por token temporario</li>
            <li><i class="fa-solid fa-lock"></i> Nova senha aplicada com seguranca</li>
        </ul>
    </div>

    <form method="post" action="<?= e(url('/admin/esqueci-senha')) ?>" class="aq-admin-auth-form">
        <label for="adminForgotEmail">Email administrativo</label>
        <input
            type="email"
            id="adminForgotEmail"
            name="email"
            required
            autocomplete="email"
            value="<?= e((string) old('email')) ?>"
            placeholder="nome@empresa.com"
        >

        <button class="btn btn-primary" type="submit">
            <i class="fa-solid fa-paper-plane"></i>
            Enviar link de recuperacao
        </button>

        <div class="aq-admin-auth-links">
            <a href="<?= e(url('/admin')) ?>">Voltar para o login admin</a>
        </div>
    </form>
</section>
