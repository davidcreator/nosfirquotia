<section class="p-4 p-lg-5 rounded-4 aq-hero mb-4">
    <div class="row g-4 align-items-center">
        <div class="col-lg-8">
            <h1 class="display-6 fw-bold text-white mb-3">Solicite seu orcamento de Design de forma segura</h1>
            <p class="text-white-50 mb-4">
                No Quotia o cliente abre uma solicitacao com os servicos desejados.
                O time administrativo analisa o pedido e gera um relatorio com valores, prazos, disponibilidade e validade de 90 dias.
            </p>
            <?php if (!empty($clientUser)): ?>
                <a class="btn btn-light btn-lg" href="<?= e(url('/orcamento/novo')) ?>">Nova solicitacao</a>
            <?php else: ?>
                <a class="btn btn-light btn-lg" href="<?= e(url('/cliente/cadastro')) ?>">Criar conta para solicitar</a>
            <?php endif; ?>
        </div>
        <div class="col-lg-4">
            <div class="aq-highlight-card">
                <h2 class="h5">Fluxo rapido</h2>
                <ul class="mb-0">
                    <li>Cadastro e autenticacao do cliente</li>
                    <li>Solicitacao com servicos selecionados</li>
                    <li>Relatorio gerado pelo admin</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<section>
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0">Como funciona</h2>
        <?php if (!empty($clientUser)): ?>
            <a class="btn btn-outline-primary btn-sm" href="<?= e(url('/orcamentos')) ?>">Minhas solicitacoes</a>
        <?php else: ?>
            <a class="btn btn-outline-primary btn-sm" href="<?= e(url('/cliente/login')) ?>">Entrar</a>
        <?php endif; ?>
    </div>

    <div class="row g-3">
        <?php
        $steps = [
            ['Crie sua conta', 'O cadastro de cliente e obrigatorio para enviar solicitacoes.'],
            ['Escolha os servicos', 'Selecione os servicos que deseja cotar e detalhe seu projeto.'],
            ['Admin gera o relatorio', 'O admin define valores, prazos e disponibilidade por servico.'],
            ['Receba seu orcamento', 'Relatorio com validade de 90 dias, visivel na area do cliente.'],
        ];
        foreach ($steps as $step):
        ?>
            <div class="col-md-6 col-xl-3">
                <article class="card h-100 shadow-sm border-0">
                    <div class="card-body">
                        <h3 class="h6 fw-bold"><?= e($step[0]) ?></h3>
                        <p class="small text-muted mb-0"><?= e($step[1]) ?></p>
                    </div>
                </article>
            </div>
        <?php endforeach; ?>
    </div>
</section>
