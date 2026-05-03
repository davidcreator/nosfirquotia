<section class="aq-entry aq-entry-auth">
    <div class="aq-entry-shell">
        <div class="aq-entry-grid">
            <section class="aq-entry-panel">
                <div class="aq-entry-brand">
                    <span class="aq-entry-brand-icon"><img src="<?= e(asset('image/quotia_logo.png')) ?>" alt="Quotia"></span>
                    <strong>Quotia</strong>
                </div>

                <h1>Acesse sua conta para enviar, revisar e acompanhar seus orcamentos.</h1>
                <p class="aq-entry-lead">
                    O portal do cliente foi desenhado para manter seu processo de solicitacao organizado, transparente e com historico completo.
                </p>

                <ul class="aq-entry-list">
                    <li><strong>Acompanhamento em tempo real:</strong> Consulte o status das suas solicitacoes sem depender de contato manual.</li>
                    <li><strong>Relatorios centralizados:</strong> Visualize valores, prazos e validade em um unico lugar.</li>
                    <li><strong>Fluxo seguro:</strong> Seus dados de acesso e solicitacoes ficam protegidos na plataforma.</li>
                </ul>

                <div class="aq-entry-actions">
                    <a class="btn btn-primary btn-lg" href="<?= e(url('/cliente/cadastro')) ?>">
                        <i class="fa-solid fa-user-plus me-2"></i>
                        Criar conta
                    </a>
                    <a class="btn btn-outline-primary btn-lg" href="<?= e(url('/')) ?>">
                        <i class="fa-solid fa-house me-2"></i>
                        Voltar ao inicio
                    </a>
                </div>
            </section>

            <aside class="aq-entry-login">
                <h2>Entrar na conta</h2>
                <p>Informe seu email e senha para continuar no portal do cliente.</p>

                <form class="aq-entry-form" method="post" action="<?= e(url('/cliente/login')) ?>">
                    <label for="clientLoginEmail">Email</label>
                    <input type="email" id="clientLoginEmail" name="email" required autocomplete="email" value="<?= e((string) old('email')) ?>">

                    <label for="clientLoginPassword">Senha</label>
                    <input type="password" id="clientLoginPassword" name="password" required autocomplete="current-password">

                    <button class="aq-entry-submit" type="submit">Entrar</button>
                </form>

                <div class="aq-entry-login-links">
                    <a class="create-link" href="<?= e(url('/cliente/cadastro')) ?>">Criar conta</a>
                    <a class="forgot-link" href="<?= e(url('/cliente/esqueci-senha')) ?>">Esqueci minha senha</a>
                </div>
            </aside>
        </div>
    </div>
</section>
