<?php
$legalPageIcon = 'fa-solid fa-id-card-clip';
$legalPageDescription = 'Compromissos de conformidade com a Lei Geral de Proteção de Dados no Quotia.';
?>

<section class="aq-legal-shell">
    <?php require __DIR__ . '/_header.php'; ?>

    <article class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5 aq-legal-content">
            <p class="aq-legal-meta">Última atualização: <?= e(date('d/m/Y')) ?></p>

            <p>O Quotia adota diretrizes de tratamento de dados pessoais alinhadas à Lei Geral de Proteção de Dados (Lei 13.709/2018), com foco em finalidade, necessidade, transparência, segurança e responsabilidade.</p>

            <h2>Direitos do titular</h2>
            <ul>
                <li>Confirmação e acesso aos dados pessoais tratados.</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
                <li>Anonimização, bloqueio ou eliminação quando aplicável.</li>
                <li>Portabilidade e informações sobre compartilhamento.</li>
                <li>Revogação de consentimento, quando essa for a base legal.</li>
            </ul>

            <h2>Segurança e governança</h2>
            <ul>
                <li>Controles de acesso por perfil e permissão.</li>
                <li>Registros de eventos relevantes (auditoria e notificações de email).</li>
                <li>Mecanismo de recuperação de senha por token com prazo de expiração.</li>
                <li>Proteções técnicas contra execução indevida de scripts.</li>
            </ul>

            <h2>Documento completo</h2>
            <p>Consulte o documento completo de adequação em <code>docs/LGPD.md</code>.</p>
        </div>
    </article>
</section>
