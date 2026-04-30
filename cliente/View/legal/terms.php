<?php
$legalPageIcon = 'fa-solid fa-file-contract';
$legalPageDescription = 'Diretrizes gerais para uso da plataforma Quotia e responsabilidades de acesso.';
?>

<section class="aq-legal-shell">
    <?php require __DIR__ . '/_header.php'; ?>

    <article class="card border-0 shadow-sm">
        <div class="card-body p-4 p-lg-5 aq-legal-content">
            <p class="aq-legal-meta">Ultima atualizacao: <?= e(date('d/m/Y')) ?></p>

            <h2>1. Aceitacao</h2>
            <p>Ao utilizar o Quotia, o usuario declara que leu e concorda com estes Termos de Uso e com as politicas publicadas nesta plataforma.</p>

            <h2>2. Conta e acesso</h2>
            <ul>
                <li>Clientes devem criar conta para solicitar orcamentos.</li>
                <li>Administradores possuem niveis de acesso e permissoes conforme perfil.</li>
                <li>O usuario e responsavel por manter a confidencialidade de sua senha.</li>
            </ul>

            <h2>3. Orcamentos e validade</h2>
            <p>Os relatorios de orcamento emitidos no sistema possuem validade definida em plataforma e podem sofrer revisao em caso de mudanca de escopo, prazos, disponibilidade ou requisitos tecnicos.</p>

            <h2>4. Propriedade intelectual</h2>
            <p>Marcas, elementos visuais e conteudos do sistema pertencem aos seus titulares legais. E vedada reproducao indevida sem autorizacao.</p>

            <h2>5. Limitacao de responsabilidade</h2>
            <p>O sistema e disponibilizado com medidas de seguranca e boas praticas, porem eventos externos fora de controle razoavel podem afetar disponibilidade e desempenho.</p>
        </div>
    </article>
</section>
