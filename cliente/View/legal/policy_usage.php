<?php
$legalPageIcon = 'fa-solid fa-scale-balanced';
$legalPageDescription = 'Regras de conduta, segurança e boas práticas para uso legítimo do sistema.';
?>

<section class="aq-legal-shell">
    <?php require __DIR__ . '/_header.php'; ?>

    <article class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5 aq-legal-content">
            <p class="aq-legal-meta">Última atualização: <?= e(date('d/m/Y')) ?></p>

            <h2>1. Finalidade da plataforma</h2>
            <p>O Quotia é um sistema de solicitação, análise e emissão de orçamentos para serviços de design.</p>

            <h2>2. Condutas permitidas</h2>
            <ul>
                <li>Uso legítimo para solicitação de orçamentos e operação administrativa.</li>
                <li>Cadastro com informações verdadeiras, atualizadas e verificáveis.</li>
                <li>Respeito às regras de segurança, privacidade e propriedade intelectual.</li>
            </ul>

            <h2>3. Condutas proibidas</h2>
            <ul>
                <li>Tentativa de invasão, exploração de vulnerabilidades ou envio de scripts maliciosos.</li>
                <li>Uso automatizado abusivo (bots) sem autorização prévia.</li>
                <li>Uso de contas de terceiros, compartilhamento indevido de credenciais e fraude.</li>
            </ul>

            <h2>4. Medidas de segurança e conformidade</h2>
            <p>O sistema aplica controles técnicos e organizacionais para proteger dados pessoais e operacionais, incluindo monitoramento de eventos de segurança e rastreabilidade de operações críticas.</p>

            <h2>5. Medidas administrativas</h2>
            <p>Em caso de violação desta política, a conta poderá ser bloqueada, suspensa ou encerrada, sem prejuízo de medidas legais cabíveis.</p>
        </div>
    </article>
</section>
