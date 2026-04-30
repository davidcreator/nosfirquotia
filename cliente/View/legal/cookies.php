<?php
$legalPageIcon = 'fa-solid fa-cookie-bite';
$legalPageDescription = 'Informacoes sobre cookies essenciais, consentimento e preferencias de navegacao.';
?>

<section class="aq-legal-shell">
    <?php require __DIR__ . '/_header.php'; ?>

    <article class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5 aq-legal-content">
            <p class="aq-legal-meta">Ultima atualizacao: <?= e(date('d/m/Y')) ?></p>

            <h2>1. O que sao cookies</h2>
            <p>Cookies sao pequenos arquivos armazenados no navegador para manter funcionalidades e preferencias de navegacao.</p>

            <h2>2. Cookies essenciais</h2>
            <p>O Quotia utiliza cookies essenciais para autenticacao de sessao, seguranca e funcionamento basico da plataforma. Esses cookies sao necessarios para o servico operar.</p>

            <h2>3. Consentimento</h2>
            <p>Ao acessar o sistema, o usuario pode definir preferencia de consentimento de cookies. O consentimento e armazenado para registro de preferencia.</p>

            <h2>4. Como gerenciar</h2>
            <p>Voce pode alterar ou remover cookies pelas configuracoes do navegador. A desativacao de cookies essenciais pode comprometer funcionalidades de login e seguranca.</p>
        </div>
    </article>
</section>
