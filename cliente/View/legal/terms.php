<?php
$legalPageIcon = 'fa-solid fa-file-contract';
$legalPageDescription = 'Diretrizes gerais para uso da plataforma Quotia e responsabilidades de acesso.';
?>

<section class="aq-legal-shell">
    <?php require __DIR__ . '/_header.php'; ?>

    <article class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5 aq-legal-content">
            <p class="aq-legal-meta">Última atualização: <?= e(date('d/m/Y')) ?></p>

            <h2>1. Aceitação</h2>
            <p>Ao utilizar o Quotia, o usuário declara que leu e concorda com estes Termos de Uso e com as políticas publicadas nesta plataforma.</p>

            <h2>2. Conta e acesso</h2>
            <ul>
                <li>Clientes devem criar conta para solicitar orçamentos.</li>
                <li>Administradores possuem níveis de acesso e permissões conforme perfil.</li>
                <li>O usuário é responsável por manter a confidencialidade de sua senha.</li>
            </ul>

            <h2>3. Orçamentos e validade</h2>
            <p>Os relatórios de orçamento emitidos no sistema possuem validade definida em plataforma e podem sofrer revisão em caso de mudança de escopo, prazos, disponibilidade ou requisitos técnicos.</p>

            <h2>4. Propriedade intelectual</h2>
            <p>Marcas, elementos visuais e conteúdos do sistema pertencem aos seus titulares legais. É vedada reprodução indevida sem autorização.</p>

            <h2>5. Limitação de responsabilidade</h2>
            <p>O sistema é disponibilizado com medidas de segurança e boas práticas, porém eventos externos fora de controle razoável podem afetar disponibilidade e desempenho.</p>
        </div>
    </article>
</section>
