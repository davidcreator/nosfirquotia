<section class="aq-entry aq-entry-auth">
    <div class="aq-entry-shell">
        <div class="aq-entry-grid">
            <section class="aq-entry-panel">
                <div class="aq-entry-brand">
                    <span class="aq-entry-brand-icon"><img src="<?= e(asset('image/quotia_logo.png')) ?>" alt="Quotia"></span>
                    <strong>Quotia</strong>
                </div>

                <h1>Crie sua conta para solicitar orcamentos de forma profissional e organizada.</h1>
                <p class="aq-entry-lead">
                    Com seu cadastro ativo, voce pode abrir novas solicitacoes, acompanhar analises e manter historico completo de orcamentos.
                </p>

                <ul class="aq-entry-list">
                    <li><strong>Conta unica:</strong> Use seu acesso para concentrar todas as demandas em um so ambiente.</li>
                    <li><strong>Processo guiado:</strong> O Quotia ajuda voce a descrever melhor os servicos desejados.</li>
                    <li><strong>Visao completa:</strong> Veja resposta do admin com valores, prazo e condicoes de validade.</li>
                </ul>

                <div class="aq-entry-actions">
                    <a class="btn btn-outline-primary btn-lg" href="<?= e(url('/cliente/login')) ?>">
                        <i class="fa-solid fa-right-to-bracket me-2"></i>
                        Ja tenho conta
                    </a>
                </div>
            </section>

            <aside class="aq-entry-login">
                <h2>Criar conta</h2>
                <p>Preencha os dados abaixo para liberar seu acesso no portal do cliente.</p>

                <form class="aq-entry-form aq-entry-form-grid" method="post" action="<?= e(url('/cliente/cadastro')) ?>">
                    <div class="aq-entry-form-row aq-entry-form-row-2">
                        <div class="aq-entry-field">
                            <label for="registerName">Nome</label>
                            <input id="registerName" name="name" required autocomplete="name" placeholder="Ex.: Maria da Silva" value="<?= e((string) old('name')) ?>">
                        </div>
                        <div class="aq-entry-field">
                            <label for="registerPhone">Telefone (opcional)</label>
                            <input id="registerPhone" name="phone" autocomplete="tel" inputmode="numeric" maxlength="15" data-phone-mask="br" placeholder="Somente numeros: 11999998888" value="<?= e((string) old('phone')) ?>">
                        </div>
                    </div>

                    <div class="aq-entry-field">
                        <label for="registerEmail">Email</label>
                        <input type="email" id="registerEmail" name="email" required autocomplete="email" placeholder="exemplo@dominio.com" value="<?= e((string) old('email')) ?>">
                    </div>

                    <div class="aq-entry-form-row aq-entry-form-row-2">
                        <div class="aq-entry-field">
                            <label for="registerPassword">Senha</label>
                            <input type="password" id="registerPassword" name="password" required autocomplete="new-password" placeholder="Minimo de 6 caracteres">
                        </div>
                        <div class="aq-entry-field">
                            <label for="registerPasswordConfirm">Confirmar senha</label>
                            <input type="password" id="registerPasswordConfirm" name="password_confirm" required autocomplete="new-password" placeholder="Repita a senha">
                        </div>
                    </div>

                    <button class="aq-entry-submit" type="submit">Criar conta</button>
                </form>

                <div class="aq-entry-login-links">
                    <a class="forgot-link" href="<?= e(url('/cliente/login')) ?>">Voltar para login</a>
                </div>
            </aside>
        </div>
    </div>
</section>
