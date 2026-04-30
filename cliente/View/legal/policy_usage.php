<?php
$legalPageIcon = 'fa-solid fa-scale-balanced';
$legalPageDescription = 'Regras de conduta, seguranca e boas praticas para uso legitimo do sistema.';
?>

<section class="aq-legal-shell">
    <?php require __DIR__ . '/_header.php'; ?>

    <article class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5 aq-legal-content">
            <p class="aq-legal-meta">Ultima atualizacao: <?= e(date('d/m/Y')) ?></p>

            <h2>1. Finalidade da plataforma</h2>
            <p>O Quotia e um sistema de solicitacao, analise e emissao de orcamentos para servicos de design.</p>

            <h2>2. Condutas permitidas</h2>
            <ul>
                <li>Uso legitimo para solicitacao de orcamentos e operacao administrativa.</li>
                <li>Cadastro com informacoes verdadeiras, atualizadas e verificaveis.</li>
                <li>Respeito as regras de seguranca, privacidade e propriedade intelectual.</li>
            </ul>

            <h2>3. Condutas proibidas</h2>
            <ul>
                <li>Tentativa de invasao, exploracao de vulnerabilidades ou envio de scripts maliciosos.</li>
                <li>Uso automatizado abusivo (bots) sem autorizacao previa.</li>
                <li>Uso de contas de terceiros, compartilhamento indevido de credenciais e fraude.</li>
            </ul>

            <h2>4. Medidas de seguranca e conformidade</h2>
            <p>O sistema aplica controles tecnicos e organizacionais para proteger dados pessoais e operacionais, incluindo monitoramento de eventos de seguranca e rastreabilidade de operacoes criticas.</p>

            <h2>5. Medidas administrativas</h2>
            <p>Em caso de violacao desta politica, a conta podera ser bloqueada, suspensa ou encerrada, sem prejuizo de medidas legais cabiveis.</p>
        </div>
    </article>
</section>
