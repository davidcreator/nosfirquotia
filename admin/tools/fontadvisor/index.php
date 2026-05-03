<?php
declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Font Strategy Advisor</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@500;600;700&family=Merriweather:wght@400;700&family=Montserrat:wght@500;700&family=Playfair+Display:wght@600;700&family=Poppins:wght@500;600;700&family=Roboto+Mono:wght@500;700&family=Roboto+Slab:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../compatibility.css">
    <link rel="stylesheet" href="./assets/css/style.css">
</head>
<body class="aq-tool-fluid aq-tool-fontadvisor">
    <main class="font-advisor-page">
        <section class="hero">
            <p class="eyebrow">Tipografia para Marca</p>
            <h1>Font Strategy Advisor</h1>
            <p>Escolha o tipo de fonte ideal para o projeto, gere combinacoes de familias e sincronize com o fluxo de identidade visual.</p>
        </section>

        <section class="panel">
            <h2>Diagnostico Tipografico</h2>
            <form id="fontStrategyForm" class="font-form">
                <label>
                    Segmento
                    <select id="industry" required>
                        <option value="geral">Geral</option>
                        <option value="tecnologia">Tecnologia</option>
                        <option value="moda">Moda / Beleza</option>
                        <option value="financeiro">Financeiro</option>
                        <option value="saude">Saude / Bem-estar</option>
                        <option value="educacao">Educacao</option>
                        <option value="gastronomia">Gastronomia</option>
                        <option value="criativo">Criativo / Agencia</option>
                    </select>
                </label>

                <label>
                    Tom de voz
                    <select id="tone" required>
                        <option value="equilibrado">Equilibrado</option>
                        <option value="corporativo">Corporativo</option>
                        <option value="premium">Premium</option>
                        <option value="amigavel">Amigavel</option>
                        <option value="inovador">Inovador</option>
                        <option value="editorial">Editorial</option>
                    </select>
                </label>

                <label>
                    Canal principal
                    <select id="channel" required>
                        <option value="digital">Digital</option>
                        <option value="impresso">Impresso</option>
                        <option value="hibrido">Hibrido</option>
                    </select>
                </label>

                <label>
                    Legibilidade desejada
                    <select id="readability" required>
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="expressiva">Expressiva</option>
                    </select>
                </label>

                <label>
                    Estilo de combinacao
                    <select id="pairingStyle" required>
                        <option value="modern-serif">Moderno + Serifado</option>
                        <option value="sans-sans">Sans + Sans</option>
                        <option value="serif-sans">Serifado + Sans</option>
                        <option value="expressive-neutral">Expressiva + Neutra</option>
                    </select>
                </label>

                <label>
                    Observacoes do projeto
                    <textarea id="projectNotes" rows="3" placeholder="Ex: marca jovem, foco mobile, precisa de destaque em embalagens."></textarea>
                </label>

                <div class="form-actions">
                    <button type="submit" id="generateFontStrategyBtn">Gerar recomendacao</button>
                    <button type="button" class="ghost" id="applyFontProfileBtn">Aplicar ao Brand Kit</button>
                    <button type="button" class="ghost" id="exportFontProfileBtn">Exportar JSON</button>
                </div>
            </form>
            <p id="fontSyncStatus" class="sync-status">Aguardando configuracao do perfil tipografico.</p>
        </section>

        <section class="panel">
            <h2>Essencial: Tipos de Fonte</h2>
            <div class="font-types-grid">
                <article class="font-type-card">
                    <h3>Sans Serif</h3>
                    <p>Sem terminais nas extremidades. Excelente para interfaces digitais e leitura rapida.</p>
                    <small>Uso comum: UI, app, dashboards, e-commerce.</small>
                </article>
                <article class="font-type-card">
                    <h3>Serif</h3>
                    <p>Com terminais classicos. Passa tradicao, autoridade e valor editorial.</p>
                    <small>Uso comum: titulo institucional, marcas premium, publicacoes.</small>
                </article>
                <article class="font-type-card">
                    <h3>Display</h3>
                    <p>Fonte de impacto para destaque visual. Deve ser usada com moderacao.</p>
                    <small>Uso comum: campanhas, hero, chamadas principais.</small>
                </article>
                <article class="font-type-card">
                    <h3>Monospace</h3>
                    <p>Caracteres em largura fixa. Boa para tecnologia, dados e linguagem tecnica.</p>
                    <small>Uso comum: labels tecnicos, interfaces dev, codigos curtos.</small>
                </article>
            </div>
        </section>

        <section class="panel split">
            <div>
                <h2>Combinacao Recomendada</h2>
                <p class="summary" id="fontStrategySummary">Preencha o diagnostico para gerar um par tipografico recomendado.</p>
                <div class="pairing-preview" id="pairingPreview">
                    <p class="pairing-primary" id="pairingPrimarySample">Titulo de exemplo da marca</p>
                    <p class="pairing-secondary" id="pairingSecondarySample">Subtitulo e apoio visual com boa hierarquia para telas e materiais impressos.</p>
                </div>
                <div class="pairing-meta" id="pairingMeta"></div>
            </div>
            <div>
                <h2>Ranking de Fontes</h2>
                <div id="fontCards" class="font-cards"></div>
            </div>
        </section>
    </main>

    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/script.js"></script>
    <script src="../shared/workflow-assistant.js"></script>
</body>
</html>
