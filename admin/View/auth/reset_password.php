<section class="aq-admin-auth-card aq-admin-auth-card-split">
    <div class="aq-admin-auth-info">
        <div class="aq-admin-auth-brand">
            <span class="aq-admin-auth-brand-icon"><img src="<?= e(asset('image/quotia_logo_wt.png')) ?>" alt="Quotia"></span>
            <span class="aq-admin-auth-brand-text"><?= e($appName ?? 'Quotia') ?> Admin</span>
        </div>
        <h1><i class="fa-solid fa-user-lock"></i> Redefinir senha</h1>
        <p>Crie uma nova senha para restaurar o acesso administrativo com seguranca e continuidade operacional.</p>
        <ul class="aq-admin-auth-feature-list">
            <li><i class="fa-solid fa-circle-user"></i> Conta vinculada: <strong><?= e((string) ($email ?? '')) ?></strong></li>
            <li><i class="fa-solid fa-key"></i> Senha minima recomendada com 6 caracteres</li>
            <li><i class="fa-solid fa-shield-halved"></i> Alteracao validada por token temporario</li>
        </ul>
    </div>

    <form method="post" action="<?= e(url('/admin/redefinir-senha')) ?>" class="aq-admin-auth-form">
        <input type="hidden" name="token" value="<?= e((string) ($token ?? '')) ?>">

        <label for="adminResetPassword">Nova senha</label>
        <input
            type="password"
            id="adminResetPassword"
            name="password"
            minlength="6"
            required
            autocomplete="new-password"
            placeholder="Digite a nova senha"
        >

        <label for="adminResetPasswordConfirm">Confirmar nova senha</label>
        <input
            type="password"
            id="adminResetPasswordConfirm"
            name="password_confirm"
            minlength="6"
            required
            autocomplete="new-password"
            placeholder="Repita a nova senha"
        >

        <button class="btn btn-success" type="submit">
            <i class="fa-solid fa-floppy-disk"></i>
            Salvar nova senha
        </button>

        <div class="aq-admin-auth-links">
            <a href="<?= e(url('/admin')) ?>">Voltar para o login admin</a>
        </div>
    </form>
</section>
