<?php
$legalPageIcon = 'fa-solid fa-user-shield';
$legalPageDescription = 'Transparência sobre coleta, uso e proteção dos dados tratados pela plataforma.';
?>

<section class="aq-legal-shell">
    <?php require __DIR__ . '/_header.php'; ?>

    <article class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5 aq-legal-content">
            <p class="aq-legal-meta">Última atualização: <?= e(date('d/m/Y')) ?></p>

            <h2>1. Dados coletados</h2>
            <ul>
                <li>Dados cadastrais: nome, email, telefone e credenciais de acesso.</li>
                <li>Dados de solicitação: escopo, serviços selecionados, prazos e observações.</li>
                <li>Dados operacionais: logs técnicos, eventos de segurança e histórico de comunicação.</li>
            </ul>

            <h2>2. Finalidades de tratamento</h2>
            <ul>
                <li>Autenticação e gestão de contas.</li>
                <li>Processamento de solicitações e emissão de orçamentos.</li>
                <li>Comunicação com clientes e administradores sobre status dos orçamentos.</li>
                <li>Segurança, prevenção a fraude e continuidade operacional.</li>
            </ul>

            <h2>3. Análise de dados</h2>
            <p>O sistema pode realizar análise de dados operacionais para melhoria de processo, qualidade de atendimento, segurança e auditoria, respeitando a necessidade e a minimização de dados.</p>

            <h2>4. Compartilhamento</h2>
            <p>Dados podem ser compartilhados apenas quando necessário para execução do serviço, cumprimento de obrigação legal/regulatória, exercício regular de direitos ou mediante consentimento válido quando aplicável.</p>

            <h2>5. Retenção e descarte</h2>
            <p>Os dados são mantidos pelo período necessário para cumprimento das finalidades e obrigações legais, com descarte seguro quando aplicável.</p>
        </div>
    </article>
</section>
