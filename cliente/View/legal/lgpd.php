<?php
$legalPageIcon = 'fa-solid fa-id-card-clip';
$legalPageDescription = 'Compromissos de conformidade com a Lei Geral de Protecao de Dados no Quotia.';
?>

<section class="aq-legal-shell">
    <?php require __DIR__ . '/_header.php'; ?>

    <article class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5 aq-legal-content">
            <p class="aq-legal-meta">Ultima atualizacao: <?= e(date('d/m/Y')) ?></p>

            <p>O Quotia adota diretrizes de tratamento de dados pessoais alinhadas a Lei Geral de Protecao de Dados (Lei 13.709/2018), com foco em finalidade, necessidade, transparencia, seguranca e responsabilidade.</p>

            <h2>Direitos do titular</h2>
            <ul>
                <li>Confirmacao e acesso aos dados pessoais tratados.</li>
                <li>Correcao de dados incompletos, inexatos ou desatualizados.</li>
                <li>Anonimizacao, bloqueio ou eliminacao quando aplicavel.</li>
                <li>Portabilidade e informacoes sobre compartilhamento.</li>
                <li>Revogacao de consentimento, quando essa for a base legal.</li>
            </ul>

            <h2>Seguranca e governanca</h2>
            <ul>
                <li>Controles de acesso por perfil e permissao.</li>
                <li>Registros de eventos relevantes (auditoria e notificacoes de email).</li>
                <li>Mecanismo de recuperacao de senha por token com prazo de expiracao.</li>
                <li>Protecoes tecnicas contra execucao indevida de scripts.</li>
            </ul>

            <h2>Documento completo</h2>
            <p>Consulte o documento completo de adequacao em <code>docs/LGPD.md</code>.</p>
        </div>
    </article>
</section>
