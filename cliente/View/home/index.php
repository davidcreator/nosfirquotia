<section class="aq-entry">
    <div class="aq-entry-shell">
        <div class="aq-entry-grid">
            <section class="aq-entry-panel">
                <div class="aq-entry-brand">
                    <span class="aq-entry-brand-icon"><img src="<?= e(asset('image/quotia_logo.png')) ?>" alt="Quotia"></span>
                    <strong>Quotia</strong>
                </div>

                <h1>Solicite orcamentos de design com um fluxo simples, seguro e acompanhado em tempo real.</h1>
                <p class="aq-entry-lead">
                    O Quotia centraliza cadastro, solicitacao e acompanhamento do orcamento em um unico lugar.
                    Seu pedido passa por analise administrativa e retorna com valores, prazos e validade de 90 dias.
                </p>

                <ul class="aq-entry-list">
                    <li><strong>Solicitacao guiada:</strong> Escolha os servicos e descreva seu projeto com clareza.</li>
                    <li><strong>Analise administrativa:</strong> O admin valida escopo, disponibilidade e custos por item.</li>
                    <li><strong>Relatorio completo:</strong> Receba um resumo profissional com prazos e condicoes comerciais.</li>
                    <li><strong>Acesso continuo:</strong> Consulte suas solicitacoes em qualquer dispositivo, quando precisar.</li>
                </ul>

                <div class="aq-entry-actions">
                    <?php if (!empty($clientUser)): ?>
                        <a class="btn btn-primary btn-lg" href="<?= e(url('/orcamento/novo')) ?>">
                            <i class="fa-solid fa-pen-ruler me-2"></i>
                            Nova solicitacao
                        </a>
                        <a class="btn btn-outline-primary btn-lg" href="<?= e(url('/orcamentos')) ?>">
                            <i class="fa-solid fa-list-check me-2"></i>
                            Minhas solicitacoes
                        </a>
                    <?php endif; ?>
                </div>
            </section>

            <aside class="aq-entry-login">
                <?php if (!empty($clientUser)): ?>
                    <h2>Voce ja esta conectado</h2>
                    <p>Acesse suas solicitacoes e continue de onde parou no portal do cliente.</p>

                    <div class="aq-entry-connected">
                        <a class="btn btn-light" href="<?= e(url('/orcamento/novo')) ?>">
                            <i class="fa-solid fa-wand-magic-sparkles me-2"></i>
                            Criar nova solicitacao
                        </a>
                        <a class="btn btn-outline-light" href="<?= e(url('/orcamentos')) ?>">
                            <i class="fa-solid fa-file-invoice-dollar me-2"></i>
                            Ver historico de orcamentos
                        </a>
                        <a class="btn btn-outline-light" href="<?= e(url('/cliente/logout')) ?>">
                            <i class="fa-solid fa-right-from-bracket me-2"></i>
                            Encerrar sessao
                        </a>
                    </div>
                <?php else: ?>
                    <h2>Entrar na conta</h2>
                    <p>Acesse para editar pedidos, acompanhar status e consultar seus relatorios de orcamento.</p>

                    <form class="aq-entry-form" method="post" action="<?= e(url('/cliente/login')) ?>">
                        <label for="homeLoginEmail">Email</label>
                        <input id="homeLoginEmail" name="email" type="email" autocomplete="username" required value="<?= e((string) old('email')) ?>">

                        <label for="homeLoginPassword">Senha</label>
                        <input id="homeLoginPassword" name="password" type="password" autocomplete="current-password" required>

                        <button type="submit" class="aq-entry-submit">Entrar na conta</button>
                    </form>

                    <div class="aq-entry-login-links">
                        <a class="create-link" href="<?= e(url('/cliente/cadastro')) ?>">Criar conta</a>
                        <a class="forgot-link" href="<?= e(url('/cliente/esqueci-senha')) ?>">Esqueci minha senha</a>
                    </div>
                <?php endif; ?>
            </aside>
        </div>
    </div>
</section>
