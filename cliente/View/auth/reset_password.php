<section class="aq-entry aq-entry-auth">
    <div class="aq-entry-shell">
        <div class="aq-entry-grid">
            <section class="aq-entry-panel">
                <div class="aq-entry-brand">
                    <span class="aq-entry-brand-icon"><img src="<?= e(asset('image/quotia_logo.png')) ?>" alt="Quotia"></span>
                    <strong>Quotia</strong>
                </div>

                <h1>Defina sua nova senha e recupere o acesso da conta.</h1>
                <p class="aq-entry-lead">
                    Conta vinculada: <strong><?= e((string) ($email ?? '')) ?></strong>. Escolha uma senha forte para manter seu portal seguro.
                </p>

                <ul class="aq-entry-list">
                    <li><strong>Segurança ativa:</strong> Use combinações de letras, números e símbolos.</li>
                    <li><strong>Atualização imediata:</strong> A nova senha passa a valer assim que você confirmar.</li>
                    <li><strong>Retorno rápido:</strong> Após salvar, basta entrar novamente com as novas credenciais.</li>
                </ul>
            </section>

            <aside class="aq-entry-login">
                <h2>Redefinir senha</h2>
                <p>Cadastre sua nova senha para concluir a recuperação.</p>

                <form class="aq-entry-form aq-entry-form-grid" method="post" action="<?= e(url('/cliente/redefinir-senha')) ?>">
                    <?= csrf_field() ?>
                    <input type="hidden" name="token" value="<?= e((string) ($token ?? '')) ?>">

                    <div class="aq-entry-field">
                        <label for="resetPassword">Nova senha</label>
                        <input type="password" id="resetPassword" name="password" minlength="6" required autocomplete="new-password">
                    </div>

                    <div class="aq-entry-field">
                        <label for="resetPasswordConfirm">Confirmar nova senha</label>
                        <input type="password" id="resetPasswordConfirm" name="password_confirm" minlength="6" required autocomplete="new-password">
                    </div>

                    <button class="aq-entry-submit" type="submit">Salvar nova senha</button>
                </form>

                <div class="aq-entry-login-links">
                    <a class="forgot-link" href="<?= e(url('/cliente/login')) ?>">Voltar ao login</a>
                </div>
            </aside>
        </div>
    </div>
</section>
