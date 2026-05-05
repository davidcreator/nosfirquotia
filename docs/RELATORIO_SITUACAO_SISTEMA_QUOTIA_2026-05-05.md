# Relatório Técnico de Situação do Sistema Quotia

Data da análise: 05/05/2026  
Escopo: auditoria técnica estática do código, arquitetura, segurança, dados e operação

## 1. Resumo executivo

O sistema Quotia está funcional, com boa base arquitetural em PHP (camadas separadas, rotas claras, prepared statements e modelo de permissões), mas ainda possui riscos relevantes para ambiente de produção pública, principalmente em segurança de requisições e governança de configuração.

Classificação geral (situação atual): **Atenção**

- Confiabilidade funcional: Boa
- Organização de código: Boa
- Segurança operacional: Média para baixa
- Prontidão para escala/produção pública: Média (com pendências críticas de segurança)

## 2. Metodologia aplicada

Análise baseada em:

- Leitura da arquitetura principal (`system/`, `admin/`, `cliente/`, `install/`)
- Revisão de fluxo de autenticação, sessão e permissões
- Revisão de rotas e endpoints de escrita (POST)
- Revisão de integridade de dados (schema e modelo de escrita de relatórios)
- Revisão de superfície de ataque em ferramentas embutidas no admin
- Verificação de estrutura de testes e automação mínima
- Verificação de saúde sintática PHP por lint

Limitação: não houve teste de carga, pentest ativo nem validação de infraestrutura externa (rede/servidor/webserver).

## 3. Snapshot técnico do sistema

- Arquivos versionados no repositório: **1330**
- Arquivos PHP: **136**
- Rotas registradas: **50**
- Tabelas no `database/schema.sql`: **15**
- Lint PHP executado em **131** arquivos: **0 falhas**

Peso de frontend embarcado (estimado no repositório):

- `admin/View/js`: **785 arquivos**, ~**17.3 MB**
- `admin/tools`: **90 arquivos**, ~**8.1 MB**

Status do repositório no momento da análise:

- Alterado: `database/reference_prices_2025.json`
- Não rastreado: `database/schema_backup_20260505_170103.sql`

## 4. Pontos fortes identificados

1. Estrutura modular consistente
- Separação clara entre `system`, `admin`, `cliente`, `install`.

2. Uso de prepared statements
- Camada `Database` centraliza `prepare/execute` e reduz risco de SQL Injection no fluxo padrão.

3. Integridade relacional no banco
- `schema.sql` usa chaves estrangeiras, índices e constraints em pontos importantes do fluxo de orçamento.

4. Sessão com hardening básico
- `Session` habilita `session.use_strict_mode`, `HttpOnly`, `SameSite=Lax` e rotação de sessão.

5. Cabeçalhos de segurança já aplicados
- Há CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, COOP/CORP.

6. Recuperação de senha com práticas corretas
- Token com `random_bytes`, hash no banco e expiração com controle de frequência.

## 5. Achados críticos e prioritários

### 5.1 CRÍTICO - Ausência de proteção CSRF no fluxo transacional

Evidências:

- Rotas POST sensíveis em `system/routes.php:24`, `:26`, `:40`, `:45`, `:55`, `:59`, `:61`, `:62`.
- Formulários POST sem token anti-CSRF, por exemplo:
  - `admin/View/auth/login.php:16`
  - `cliente/View/requests/create.php:205`
  - `admin/View/quotes/show.php:158`
- Controladores consomem `POST` diretamente sem validação global de token:
  - `admin/Controller/AuthController.php:30-34`
  - `cliente/Controller/RequestController.php:29-53`
- `Request` não possui mecanismo nativo de CSRF (`system/Engine/Request.php:42-55`).

Impacto:

- Usuário autenticado pode ser induzido a executar ações sem intenção (envio de formulário, alterações administrativas, geração de relatórios etc.).

Recomendação:

- Implementar token CSRF por sessão e validação obrigatória para métodos de escrita (POST/PUT/PATCH/DELETE), preferencialmente em camada única (middleware/base controller).

### 5.2 ALTO - Configurações sensíveis versionadas no repositório

Evidências:

- `config/config.php` está rastreado pelo Git (`git ls-files config`).
- Também existem arquivos adicionais em `config/` com potencial de conter dados sensíveis.
- `.gitignore` não cobre `config/config.php` (`.gitignore:1-4`).

Impacto:

- Risco de exposição de credenciais/segredos em histórico Git, backups e compartilhamentos.

Recomendação:

- Migrar segredos para variáveis de ambiente ou arquivo local não versionado.
- Manter somente `config/config.example.php` como template público.
- Rotacionar credenciais após saneamento.

### 5.3 ALTO - Execução de ferramentas embutidas com superfície ampliada

Evidências:

- Inclusão dinâmica de entrypoint de ferramenta: `admin/Controller/ToolController.php:135`.
- Scripts do `<head>` da ferramenta são repassados: `ToolController.php:330-333`.
- HTML do corpo da ferramenta é renderizado bruto: `admin/View/tools/embedded.php:18`.

Impacto:

- Se qualquer ferramenta local for comprometida, a sessão administrativa fica exposta a XSS/RCE em contexto privilegiado.

Recomendação:

- Isolar ferramentas em domínio/subdomínio próprio ou sandbox mais restrito.
- Reduzir execução inline e endurecer política de scripts.
- Manter allowlist rígida e revisão de segurança por ferramenta.

## 6. Achados importantes (médio prazo)

### 6.1 MÉDIO - Operação de escrita complexa sem transação explícita

Evidências:

- `createOrUpdateReport` executa múltiplos `INSERT/DELETE/UPDATE` sem transação:
  - `admin/Model/QuoteModel.php:506-639`
- Wrapper de banco não expõe `beginTransaction/commit/rollBack`:
  - `system/Library/Database.php:12-81`

Impacto:

- Em falhas parciais, há risco de inconsistência entre relatório, itens, tributos e status da solicitação.

Recomendação:

- Adicionar suporte transacional no `Database` e envolver o fluxo de geração/atualização de relatório em transação atômica.

### 6.2 MÉDIO - Ausência de política de anti-bruteforce no login

Evidências:

- `Auth::attempt` valida credencial sem throttle/lockout (`system/Library/Auth.php:18-46`).
- `ClientAuth::attempt` também sem contenção (`system/Library/ClientAuth.php:17-27`).

Impacto:

- Maior exposição a tentativas automatizadas de credenciais.

Recomendação:

- Implementar limite por IP/email, atraso progressivo, janela de bloqueio temporária e observabilidade.

### 6.3 MÉDIO - Cobertura de testes automatizados inexistente

Evidências:

- `composer.json` sem scripts de teste (`composer.json:23-26`).
- Ausência de `phpunit.xml`/`tests/`.

Impacto:

- Aumenta chance de regressões em mudanças de regras de negócio e segurança.

Recomendação:

- Criar suíte mínima (smoke + integração) para autenticação, fluxo de orçamento, cálculo de tributos e geração de relatório.

### 6.4 MÉDIO - CSP ainda permissiva para inline

Evidências:

- `script-src` e `style-src` incluem `'unsafe-inline'` em `system/Engine/Application.php:227-228`.

Impacto:

- Reduz eficácia da CSP em cenários de XSS.

Recomendação:

- Migrar para nonce/hash progressivamente e reduzir código inline.

## 7. Achados secundários (baixo/médio)

1. Serviço de e-mail baseado em `mail()`
- Evidência: `system/Library/EmailService.php:77`.
- Risco: baixa confiabilidade de entrega/diagnóstico em produção sem SMTP transacional.

2. Dependência relevante de assets locais e ferramentas front-end
- Custos maiores de manutenção/atualização de libs estáticas e revisão de segurança contínua.

## 8. Prioridade de ação recomendada

### Janela 0-7 dias

1. Implementar proteção CSRF global.
2. Retirar arquivos de configuração sensíveis do versionamento.
3. Rotacionar credenciais após saneamento.
4. Aplicar rate limit básico em login admin e cliente.

### Janela 8-30 dias

1. Introduzir transações no fluxo de geração de relatório.
2. Endurecer embed de ferramentas administrativas.
3. Implantar logging de segurança (tentativas de login, CSRF inválido, ações administrativas).

### Janela 31-90 dias

1. Implantar suíte de testes automatizados.
2. Revisar CSP para nonce/hash (remoção gradual de inline).
3. Revisão de performance e limpeza de assets não utilizados.

## 9. Indicador de maturidade (estimado)

- Arquitetura e organização: **8/10**
- Segurança de aplicação: **5/10**
- Confiabilidade de dados: **6/10**
- Operação/DevEx: **5/10**
- Maturidade geral do produto: **6/10**

## 10. Conclusão

O Quotia possui uma base técnica sólida e funcional para evolução rápida. O principal gap para elevar o nível de produção está em controles de segurança transacional (CSRF e endurecimento do admin embutido), além de governança de segredos e consistência transacional no fluxo de orçamento/relatório. Com o plano acima, é viável reduzir o risco de forma significativa no curto prazo sem reescrever o sistema.
