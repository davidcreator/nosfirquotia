<?php
$loginEmailValue = trim((string) old('email', (string) ($rememberedEmail ?? '')));
$rememberChecked = old('remember_email', !empty($rememberEmailChecked) ? '1' : '0');
$rememberChecked = in_array((string) $rememberChecked, ['1', 'true', 'on', 'sim', 'yes'], true);
?>
<section class="aq-admin-auth-card aq-admin-auth-card-split">
    <div class="aq-admin-auth-info">
        <div class="aq-admin-auth-brand">
            <span class="aq-admin-auth-brand-icon"><img src="<?= e(asset('image/quotia_logo_wt.png')) ?>" alt="Quotia"></span>
            <span class="aq-admin-auth-brand-text"><?= e($appName ?? 'Quotia') ?> Admin</span>
        </div>
        <h1><i class="fa-solid fa-lock"></i> Acesso administrativo</h1>
        <p>Área protegida para governança do sistema, curadoria de dados e controle de níveis hierárquicos de usuários.</p>
        <ul class="aq-admin-auth-feature-list">
            <li><i class="fa-solid fa-sitemap"></i> Controle hierarquico de grupos administrativos</li>
            <li><i class="fa-solid fa-users-gear"></i> Gestão de usuários e permissões por nível</li>
            <li><i class="fa-solid fa-shield-halved"></i> Acesso monitorado com trilha de segurança</li>
        </ul>
    </div>

    <form method="post" action="<?= e(url('/admin/login')) ?>" class="aq-admin-auth-form">
        <?= csrf_field() ?>
        <label for="adminLoginEmail">E-mail</label>
        <input type="email" id="adminLoginEmail" name="email" required autocomplete="username" value="<?= e($loginEmailValue) ?>" placeholder="nome@empresa.com">

        <label for="adminLoginPassword">Senha</label>
        <input type="password" id="adminLoginPassword" name="password" required autocomplete="current-password" placeholder="Digite sua senha">

        <div class="form-check mt-1">
            <input class="form-check-input" type="checkbox" id="adminRememberEmail" name="remember_email" value="1" <?= $rememberChecked ? 'checked' : '' ?>>
            <label class="form-check-label small" for="adminRememberEmail">Lembrar meu e-mail neste dispositivo</label>
        </div>

        <button class="btn btn-primary" type="submit">
            <i class="fa-solid fa-right-to-bracket"></i>
            Entrar no admin
        </button>

        <div class="aq-admin-auth-links">
            <a href="<?= e(url('/admin/esqueci-senha')) ?>">Esqueci minha senha</a>
        </div>
    </form>
</section>

