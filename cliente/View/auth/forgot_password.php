<section class="aq-entry aq-entry-auth">
    <div class="aq-entry-shell">
        <div class="aq-entry-grid">
            <section class="aq-entry-panel">
                <div class="aq-entry-brand">
                    <span class="aq-entry-brand-icon"><img src="<?= e(asset('image/quotia_logo.png')) ?>" alt="Quotia"></span>
                    <strong>Quotia</strong>
                </div>

                <h1>Recupere o acesso da sua conta com segurança.</h1>
                <p class="aq-entry-lead">
                    Informe o email utilizado no cadastro para receber o link de redefinição e voltar ao portal rapidamente.
                </p>

                <ul class="aq-entry-list">
                    <li><strong>Fluxo protegido:</strong> O link é enviado somente para o email informado no cadastro.</li>
                    <li><strong>Token temporário:</strong> A redefinição possui validade limitada para maior segurança.</li>
                    <li><strong>Acesso restaurado:</strong> Depois de definir nova senha, você pode entrar normalmente.</li>
                </ul>

                <div class="aq-entry-actions">
                    <a class="btn btn-outline-primary btn-lg" href="<?= e(url('/cliente/login')) ?>">
                        <i class="fa-solid fa-right-to-bracket me-2"></i>
                        Voltar para login
                    </a>
                </div>
            </section>

            <aside class="aq-entry-login">
                <h2>Esqueci minha senha</h2>
                <p>Digite seu email para receber o link de redefinição.</p>

                <form class="aq-entry-form" method="post" action="<?= e(url('/cliente/esqueci-senha')) ?>">
                    <?= csrf_field() ?>
                    <label for="forgotPasswordEmail">Email</label>
                    <input type="email" id="forgotPasswordEmail" name="email" required autocomplete="email" value="<?= e((string) old('email')) ?>">

                    <button class="aq-entry-submit" type="submit">Enviar link de recuperação</button>
                </form>

                <div class="aq-entry-login-links">
                    <a class="forgot-link" href="<?= e(url('/cliente/login')) ?>">Voltar ao login</a>
                </div>
            </aside>
        </div>
    </div>
</section>
