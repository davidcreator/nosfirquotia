<?php
$legalPageIcon = 'fa-solid fa-user-shield';
$legalPageDescription = 'Transparencia sobre coleta, uso e protecao dos dados tratados pela plataforma.';
?>

<section class="aq-legal-shell">
    <?php require __DIR__ . '/_header.php'; ?>

    <article class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5 aq-legal-content">
            <p class="aq-legal-meta">Ultima atualizacao: <?= e(date('d/m/Y')) ?></p>

            <h2>1. Dados coletados</h2>
            <ul>
                <li>Dados cadastrais: nome, email, telefone e credenciais de acesso.</li>
                <li>Dados de solicitacao: escopo, servicos selecionados, prazos e observacoes.</li>
                <li>Dados operacionais: logs tecnicos, eventos de seguranca e historico de comunicacao.</li>
            </ul>

            <h2>2. Finalidades de tratamento</h2>
            <ul>
                <li>Autenticacao e gestao de contas.</li>
                <li>Processamento de solicitacoes e emissao de orcamentos.</li>
                <li>Comunicacao com clientes e administradores sobre status dos orcamentos.</li>
                <li>Seguranca, prevencao a fraude e continuidade operacional.</li>
            </ul>

            <h2>3. Analise de dados</h2>
            <p>O sistema pode realizar analise de dados operacionais para melhoria de processo, qualidade de atendimento, seguranca e auditoria, respeitando a necessidade e a minimizacao de dados.</p>

            <h2>4. Compartilhamento</h2>
            <p>Dados podem ser compartilhados apenas quando necessario para execucao do servico, cumprimento de obrigacao legal/regulatoria, exercicio regular de direitos ou mediante consentimento valido quando aplicavel.</p>

            <h2>5. Retencao e descarte</h2>
            <p>Os dados sao mantidos pelo periodo necessario para cumprimento das finalidades e obrigacoes legais, com descarte seguro quando aplicavel.</p>
        </div>
    </article>
</section>
