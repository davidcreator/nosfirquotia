<?php
$legalPageIcon = 'fa-solid fa-cookie-bite';
$legalPageDescription = 'Informações sobre cookies essenciais, consentimento e preferências de navegação.';
?>

<section class="aq-legal-shell">
    <?php require __DIR__ . '/_header.php'; ?>

    <article class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5 aq-legal-content">
            <p class="aq-legal-meta">Última atualização: <?= e(date('d/m/Y')) ?></p>

            <h2>1. O que são cookies</h2>
            <p>Cookies são pequenos arquivos armazenados no navegador para manter funcionalidades e preferências de navegação.</p>

            <h2>2. Cookies essenciais</h2>
            <p>O Quotia utiliza cookies essenciais para autenticação de sessão, segurança e funcionamento básico da plataforma. Esses cookies são necessários para o serviço operar.</p>

            <h2>3. Cookie opcional de lembrança de e-mail</h2>
            <p>Quando o usuário marca a opção <strong>“Lembrar meu e-mail neste dispositivo”</strong> na tela de login, o sistema grava um cookie funcional apenas com o e-mail informado para facilitar novos acessos.</p>
            <p>Este cookie não armazena senha, token de autenticação permanente ou dados financeiros.</p>

            <h2>4. Consentimento</h2>
            <p>Ao acessar o sistema, o usuário pode definir preferência de consentimento de cookies. O consentimento é armazenado para registro de preferência.</p>

            <h2>5. Como gerenciar</h2>
            <p>Você pode alterar ou remover cookies pelas configurações do navegador. A desativação de cookies essenciais pode comprometer funcionalidades de login e segurança.</p>
        </div>
    </article>
</section>
