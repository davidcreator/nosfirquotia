# Background Remover - Removedor de Fundo de Imagens

Sistema completo para remoção de fundo de imagens usando PHP e JavaScript.

## 🚀 Recursos

- ✅ Upload de imagens (JPG, PNG)
- ✅ Remoção automática de fundo
- ✅ Controle de sensibilidade
- ✅ Drag & drop
- ✅ Interface responsiva
- ✅ Multi-idioma (PT, EN, ES)
- ✅ Download da imagem processada
- ✅ Limpeza automática de arquivos antigos
- ✅ Segurança e validações

## 📋 Requisitos

- PHP 7.4 ou superior
- GD Library habilitada
- Apache com mod_rewrite
- Permissões de escrita nas pastas uploads/ e processed/

## 🔧 Instalação

1. Clone ou baixe o projeto
2. Configure o Apache/Nginx para apontar para a pasta do projeto
3. Ajuste as permissões:
   ```bash
   chmod 755 uploads/
   chmod 755 processed/
   ```
4. Edite `config.php` e ajuste BASE_URL
5. Acesse via navegador

## 📁 Estrutura

- `index.php` - Página principal
- `upload.php` - Processa upload e remoção
- `download.php` - Gerencia downloads
- `config.php` - Configurações
- `assets/` - CSS e JavaScript
- `uploads/` - Imagens enviadas (temp)
- `processed/` - Imagens processadas
- `language/` - Traduções
- `includes/` - Componentes PHP

## ⚙️ Configuração

Edite `config.php` para personalizar:

```php
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // Tamanho máximo
define('ALLOWED_TYPES', ['image/jpeg', 'image/png']);
$_SESSION['lang'] = 'pt-BR'; // Idioma padrão
```

## 🔒 Segurança

- Validação de tipos MIME
- Proteção contra upload de scripts
- Arquivos .htaccess nas pastas sensíveis
- Limpeza automática de arquivos antigos
- Nomes únicos para arquivos
- Headers de segurança

## 🎨 Personalização

**CSS**: Edite `assets/css/style.css` para mudar cores e layout
**Idiomas**: Adicione novos arquivos em `language/`
**Algoritmo**: Ajuste a função `removeBackground()` em `includes/functions.php`

## 📝 Uso

1. Acesse a aplicação
2. Arraste uma imagem ou clique para selecionar
3. Ajuste a sensibilidade se necessário
4. Aguarde o processamento
5. Compare original com resultado
6. Faça download da imagem processada

## ⚠️ Limitações

- O algoritmo funciona melhor com fundos uniformes
- Imagens complexas podem precisar ajuste de sensibilidade
- Limite de 10MB por arquivo

## 🛠️ Melhorias Futuras

- Integração com APIs de IA (remove.bg, etc)
- Editor de ajustes finos
- Suporte a múltiplas imagens
- Histórico de processamentos
- Compartilhamento social

## 📄 Licença

Uso livre para projetos pessoais e comerciais.