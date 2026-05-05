# Background Remover

Ferramenta para remoção de fundo de imagens com fluxo de upload, preview, ajustes e exportação.

## Recursos

- Upload de imagens (`JPG`, `PNG`, `WEBP` quando suportado)
- Pré-visualização da imagem original e resultado sem fundo
- Processamento automático com presets
- Ajustes finos de recorte e limpeza
- Download do resultado processado
- Suporte multilíngue (`PT-BR`, `EN`, `ES`)

## Requisitos

- PHP 8.1+ (recomendado: 8.2+)
- Extensão GD habilitada
- Permissão de escrita nas pastas temporárias da ferramenta

## Estrutura

- `index.php`: interface principal
- `upload.php`: endpoint de upload/processamento
- `download.php`: endpoint de download
- `optimize.php`: otimizações auxiliares
- `config.php`: configurações gerais
- `includes/functions.php`: regras de recorte e pós-processamento
- `assets/`: CSS/JS da interface
- `uploads/` e `processed/`: arquivos temporários/resultado

## Fluxo de uso

1. Faça upload da imagem.
2. Aguarde a análise inicial e geração do preview.
3. Ajuste parâmetros de refinamento, quando necessário.
4. Gere o resultado final.
5. Baixe a imagem processada.

## Segurança

- Validação de tipo MIME
- Limite de tamanho de arquivo
- Sanitização de entrada
- Nomes de arquivo únicos
- Limpeza periódica de arquivos temporários

## Limitações conhecidas

- Imagens com fundo muito complexo podem exigir ajustes manuais.
- Fotos com contraste baixo entre objeto e fundo podem gerar ruído.

## Próximos passos sugeridos

- Aprimorar presets inteligentes por cenário (produto, retrato, logo).
- Expandir integração com `AQBrandKit` e `FinalFrame`.
