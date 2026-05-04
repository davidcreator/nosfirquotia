<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Color Strategy Advisor</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/style.css">
    <link rel="stylesheet" href="../compatibility.css">
</head>
<body class="aq-tool-fluid aq-tool-coloradvisor">
    <main class="page">
        <section class="hero">
            <p class="eyebrow">Design Intelligence</p>
            <h1>Color Strategy Advisor</h1>
            <p>Ferramenta de decisão para identidade visual baseada em psicologia das cores, objetivos de marketing e contexto de uso.</p>
        </section>

        <section class="panel">
            <h2>Diagnóstico da Marca</h2>
            <form id="strategyForm" class="form-grid">
                <label>
                    Objetivo principal
                    <select id="objective" required>
                        <option value="confianca">Transmitir confiança</option>
                        <option value="atencao">Ganhar atenção</option>
                        <option value="acao">Estimular ação</option>
                        <option value="sofisticacao">Posicionamento sofisticado</option>
                        <option value="equilibrio">Bem-estar e equilíbrio</option>
                        <option value="diversao">Energia e diversão</option>
                    </select>
                </label>

                <label>
                    Tipo de produto/serviço
                    <select id="productType">
                        <option value="utilitario">Utilitário</option>
                        <option value="hedonico">Hedônico</option>
                    </select>
                </label>

                <label>
                    Enquadramento da mensagem
                    <select id="messageFrame">
                        <option value="gain">Ganho (benefício)</option>
                        <option value="prevention">Prevenção (evitar perda)</option>
                        <option value="neutral">Neutro</option>
                    </select>
                </label>

                <label>
                    Público predominante
                    <select id="audience">
                        <option value="mixed">Misto</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                    </select>
                </label>

                <label>
                    Nível de excitação desejado
                    <select id="arousal">
                        <option value="low">Baixo (calmo)</option>
                        <option value="medium">Médio</option>
                        <option value="high">Alto (energético)</option>
                    </select>
                </label>

                <label>
                    Densidade de conteúdo
                    <select id="contentDensity">
                        <option value="high">Alta (muito texto/conteúdo)</option>
                        <option value="medium">Média</option>
                        <option value="low">Baixa (visual limpo)</option>
                    </select>
                </label>

                <label>
                    Mercado cultural
                    <select id="market">
                        <option value="brazil">Brasil/Latam</option>
                        <option value="western">Ocidental</option>
                        <option value="eastasia">Leste Asiático</option>
                        <option value="global">Global (multimercado)</option>
                    </select>
                </label>

                <label>
                    Contexto de uso principal
                    <select id="context">
                        <option value="general">Geral</option>
                        <option value="financas">Finanças/tecnologia</option>
                        <option value="saude">Saúde e bem-estar</option>
                        <option value="educacao">Educação</option>
                        <option value="moda">Moda/beleza</option>
                        <option value="namoro">Relacionamento/paixão</option>
                        <option value="avaliacao">Avaliação/performance</option>
                    </select>
                </label>

                <label>
                    Quantidade de cores
                    <select id="paletteSize">
                        <option value="auto">Automático</option>
                        <option value="2">2 cores</option>
                        <option value="3">3 cores</option>
                        <option value="4">4 cores</option>
                        <option value="5">5 cores</option>
                    </select>
                </label>

                <div class="actions">
                    <button type="submit">Gerar Estratégia de Cores</button>
                    <button type="button" id="resetBtn" class="ghost">Resetar</button>
                </div>
            </form>
        </section>

        <section class="panel">
            <h2>Paleta Recomendada</h2>
            <p id="strategySummary" class="summary">Preencha o diagnóstico e gere sua estratégia.</p>
            <div class="export-actions">
                <button type="button" id="exportJsonBtn" class="ghost">Exportar JSON</button>
                <button type="button" id="exportPdfBtn">Exportar PDF</button>
                <span id="exportStatus" class="export-status"></span>
            </div>
            <div id="palettePreview" class="palette-preview"></div>
        </section>

        <section class="panel split">
            <div>
                <h2>Ranking de Cores</h2>
                <table class="score-table">
                    <thead>
                        <tr>
                            <th>Cor</th>
                            <th>Pontos</th>
                            <th>Motivos</th>
                        </tr>
                    </thead>
                    <tbody id="scoreTableBody"></tbody>
                </table>
            </div>
            <div>
                <h2>Diretrizes</h2>
                <ul id="recommendationsList" class="notes"></ul>
                <h3>Alertas de contexto</h3>
                <ul id="warningsList" class="notes warning"></ul>
            </div>
        </section>

        <section class="panel">
            <h2>Base de Referência</h2>
            <ul class="sources">
                <li><a href="https://davidcreator.com/psicologia-das-cores-como-a-cor-influencia-nossa-vida/" target="_blank" rel="noopener noreferrer">Psicologia das cores: Como a cor influencia nossa vida</a></li>
                <li><a href="https://davidcreator.com/cores-no-mundo-do-marketing/" target="_blank" rel="noopener noreferrer">Cores no Mundo do Marketing</a></li>
            </ul>
        </section>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
    <script src="../shared/brand-kit.js"></script>
    <script src="./assets/js/script.js"></script>
    <script src="../shared/workflow-assistant.js"></script>
</body>
</html>

