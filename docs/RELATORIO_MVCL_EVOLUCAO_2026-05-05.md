# Relatorio de Evolucao MVCL - Quotia

Data: 05/05/2026  
Escopo: evolucao arquitetural para MVCL com foco em separacao de camadas, tipagem de contratos, excecoes de dominio e testabilidade

## 1. Objetivo

Evoluir o sistema para uma estrutura MVCL mais madura, reduzindo acoplamento entre controller e regra de negocio, com contratos explicitos (DTOs), camada de repositorio e testes automatizados de servico.

## 2. Entregas implementadas

### 2.1 Camada de servico (L)

Servicos de negocio mantidos e ajustados para contratos tipados:

- `admin/Service/QuoteReportService.php`
- `admin/Service/TaxSettingsService.php`
- `cliente/Service/QuoteRequestService.php`

### 2.2 Controllers enxutos (C)

Controllers passaram a orquestrar comando/resultado:

- `admin/Controller/QuoteController.php`
- `admin/Controller/TaxController.php`
- `cliente/Controller/RequestController.php`

### 2.3 Repositorios (abstracao da persistencia)

Novos contratos e adaptadores sobre os models atuais:

- `admin/Repository/QuoteRepositoryInterface.php`
- `admin/Repository/QuoteModelRepository.php`
- `admin/Repository/TaxSettingsRepositoryInterface.php`
- `admin/Repository/TaxSettingsModelRepository.php`
- `cliente/Repository/QuoteRequestRepositoryInterface.php`
- `cliente/Repository/QuoteRequestModelRepository.php`

### 2.4 DTOs (contratos de entrada/saida)

DTOs de comando/resultado para tipagem forte entre camadas:

- `admin/DTO/GenerateQuoteReportCommand.php`
- `admin/DTO/GenerateQuoteReportResult.php`
- `admin/DTO/ValidateTaxSettingsCommand.php`
- `admin/DTO/ValidateTaxSettingsResult.php`
- `cliente/DTO/SubmitQuoteRequestCommand.php`
- `cliente/DTO/SubmitQuoteRequestResult.php`

### 2.5 Mailer por contrato

Desacoplamento do envio de email para facilitar testes:

- `admin/Service/QuoteReportMailerInterface.php`
- `admin/Service/EmailServiceQuoteReportMailer.php`

### 2.6 Confiabilidade transacional

Transacoes explicitas no fluxo critico de relatorio:

- `system/Library/Database.php` com `beginTransaction`, `commit`, `rollBack`, `inTransaction`
- `admin/Model/QuoteModel.php` com `createOrUpdateReport` atomico (commit/rollback)

### 2.7 Excecoes de dominio padronizadas

Foi adicionada uma base de excecoes de dominio e aplicacao nos servicos criticos:

- `system/Domain/Exception/DomainException.php`
- `system/Domain/Exception/DomainNotFoundException.php`
- `system/Domain/Exception/DomainValidationException.php`

Servicos atualizados para falhar com excecoes de dominio e retornar DTO consistente:

- `admin/Service/QuoteReportService.php`
- `admin/Service/TaxSettingsService.php`
- `cliente/Service/QuoteRequestService.php`

### 2.8 Container de dependencias (injecao centralizada)

Foi implementado um container leve para resolucao de dependencias e bindings de interfaces/repositorios/servicos:

- `system/Engine/Container.php`
- `system/Engine/Application.php`
- `system/Engine/Controller.php`

Controllers foram migrados para resolver dependencias por `make(...)`, reduzindo instanciacao direta via `new`:

- `admin/Controller/*`
- `cliente/Controller/*`
- `install/Controller/InstallController.php`

### 2.9 Telemetria de seguranca (auditoria estruturada)

Foi implementado logger de eventos de seguranca com persistencia em arquivo:

- `system/Library/SecurityEventLogger.php`
- destino: `storage/logs/security-events.log`

Eventos conectados:

- rejeicao de CSRF com contexto tecnico minimizado (sem token/senha em claro);
- bloqueios/falhas/sucesso de login (admin e cliente) com hash de e-mail;
- logout (admin e cliente);
- operacoes sensiveis de administracao:
  - criacao/atualizacao de usuarios admin;
  - criacao de categorias;
  - atualizacao de parametros fiscais;
  - geracao de relatorios de orcamento.

### 2.10 Rotacao e retencao automatica dos logs de seguranca

O logger de seguranca foi evoluido para ciclo de vida automatizado do arquivo:

- rotacao por tamanho maximo do arquivo ativo;
- rotacao automatica na virada do dia (rollover diario);
- retencao por janela de dias;
- limite maximo de arquivos de arquivo (archives).

Configuracoes disponiveis (com default seguro):

- `security.logs.security_events.max_active_file_bytes` (default `5242880`);
- `security.logs.security_events.retention_days` (default `30`);
- `security.logs.security_events.max_archive_files` (default `180`).

### 2.11 Endurecimento de CSP com nonce por requisicao

Foi implementada uma etapa de hardening de Content Security Policy para reduzir risco de XSS por script inline:

- `system/Engine/Application.php`
  - nonce criptografico por requisicao (`cspNonce()`);
  - `script-src` sem `unsafe-inline`, com whitelist de CDNs usadas pelo produto e ferramentas.
- `system/Engine/View.php`
  - injecao automatica de `nonce` em `<script>` e `<style>` durante o render final.
- `system/Support/helpers.php`
  - novos helpers `csp_nonce()` e `csp_nonce_attr()` para uso explicito em templates.

Compatibilidade:

- removido `unsafe-inline` de `style-src` e introduzido `style-src-elem` com nonce para blocos `<style>`.
- politica global de atributos inline endurecida para todo o sistema:
  - `style-src-attr 'none'`;
  - `script-src-attr 'none'`;
  - sem excecoes por rota/slug.
- `admin/tools/ocimage/index.php` foi migrado para remover `onclick` e `style` inline no HTML, com binding por IDs/data-attributes no JS.
- `admin/tools/bgremove/index.php` foi migrado para remover `onclick` inline (seletor de arquivo e reset), mantendo o fluxo por listeners no JS.
- `admin/tools/mockups/editor.php` e `admin/tools/mockups/assets/common/footer.php` foram migrados para remover `onclick` inline, com binding por IDs no `assets/js/script.js`.
- `admin/tools/mockups/*.php`, `admin/tools/coloradvisor/assets/js/script.js` e `admin/tools/fontadvisor/assets/js/script.js` foram ajustados para remover injeção de `style="..."` em HTML dinâmico/estático, mantendo estilos via classes e `element.style.*`.
- `admin/tools/brandbook/assets/js/script.js` e `admin/tools/finalframe/assets/js/script.js` foram ajustados para evitar `style="..."` em templates dinamicos sob politica estrita de `style-src-attr`.
- `admin/tools/bgremove/index.php`, `admin/tools/bgremove/assets/js/script.js` e `admin/tools/colorpalette/assets/js/script.js` foram atualizados para eliminar `style="..."` residual e operar com classes + `data-*` (aplicacao de estilo por `element.style.*`).
- `admin/tools/brandmanual/assets/js/script.js` e `admin/tools/ocimage/assets/js/script.js` foram migrados para eliminar `style="..."`/`style.cssText`, com aplicacao de estilo via `data-*` + `element.style.*`.
- `cliente/View/requests/create.php` e `admin/View/quotes/show.php` foram ajustados para remover `style="..."` remanescente em views principais.
- `public/assets/js/app.js` foi ajustado para aplicar `nonce` em `<style>` dinamico injetado no iframe de ferramentas.

### 2.12 Endurecimento de host confiavel para links absolutos

Foi implementado hardening para reduzir risco de Host Header Injection em metadados e fluxos de recuperacao de senha:

- `system/Engine/Request.php`
  - normalizacao e validacao de host/porta;
  - prioridade para `SERVER_NAME` + `SERVER_PORT` na composicao de host efetivo;
  - fallback validado de `HTTP_HOST` apenas quando necessario.
- `system/Engine/Application.php`
  - novo `fullBaseUrl()` centralizado com suporte a `app_url` em configuracao;
  - novo `absoluteUrl()` para compor URLs absolutas seguras;
  - verificacao de origem CSRF passou a usar origem canonica derivada de `fullBaseUrl()`.
- `system/Support/helpers.php`
  - novo helper `absolute_url(...)`.
- Controllers e views migrados para usar base canonica:
  - `admin/Controller/AuthController.php`
  - `cliente/Controller/AuthController.php`
  - `admin/Controller/QuoteController.php`
  - `admin/View/layout.php`
  - `cliente/View/layout.php`
  - `install/View/layout.php`
- `config/config.example.php`
  - adicao de `app_url` (opcional, recomendado em producao).

### 2.13 Validadores de entrada por caso de uso (Request Objects + Services)

Foi implementada a extracao de validacao de entrada para camada de servico com DTOs dedicados, reduzindo regra de negocio em controllers e padronizando erros:

- `admin/Service/AdminUserValidationService.php`
- `admin/DTO/ValidateAdminUserCreateCommand.php`
- `admin/DTO/ValidateAdminUserUpdateCommand.php`
- `admin/DTO/ValidateAdminUserResult.php`
- `admin/Service/CategoryValidationService.php`
- `admin/DTO/ValidateCategoryCreateCommand.php`
- `admin/DTO/ValidateCategoryCreateResult.php`
- `system/Domain/Exception/DomainErrorCodes.php` (novos codigos `admin_user_validation` e `category_validation`)

Controllers migrados para orquestracao enxuta:

- `admin/Controller/AdminUserController.php`
- `admin/Controller/CategoryController.php`

### 2.14 Expansao de testes CSRF para fluxos autenticados

A suite HTTP foi ampliada para cobrir cenarios autenticados em rotas sensiveis do admin, validando rejeicao sem token e aceite com token valido:

- rota `/admin/usuarios` (auth simulada em sessao de teste);
- rota `/admin/categorias` (auth simulada em sessao de teste).
- rota `/admin/orcamentos/{id}/gerar-relatorio` (auth simulada em sessao de teste);
- rota `/admin/usuarios/{id}` (atualizacao com auth simulada em sessao de teste).

### 2.15 Dashboard com monitoramento operacional de seguranca

Foi adicionado monitoramento de eventos de seguranca no dashboard administrativo com contagem por janela e alertas por limiar:

- `admin/Service/SecurityEventMonitoringService.php`
- `admin/Controller/DashboardController.php`
- `admin/View/dashboard/index.php`
- `system/Engine/Application.php` (binding do servico no container)
- `config/config.example.php` (novos thresholds e janela de monitoramento)

Eventos acompanhados:

- `csrf_rejected`
- `host_header_rejected`
- `admin_login_blocked`
- `client_login_blocked`

Comportamento:

- contabiliza eventos no intervalo configurado (`security.monitoring.window_hours`);
- dispara alertas quando contagens superam limites (`security.monitoring.thresholds.*`);
- exibe resumo e status de saude operacional no dashboard.

### 2.16 Expansao final de cobertura CSRF em fluxos sensiveis

A suite HTTP recebeu cobertura adicional para fluxos de recuperacao/redefinicao de senha e instalador, contemplando cenarios sem token (403) e com token valido (passagem no guard):

- Admin:
  - `/admin/esqueci-senha`
  - `/admin/redefinir-senha`
- Cliente:
  - `/cliente/esqueci-senha`
  - `/cliente/redefinir-senha`
- Instalador:
  - `/install/step1`
  - `/install/step3`

Para os cenarios de instalacao, os testes alternam temporariamente para modo "nao instalado" durante a execucao, com restauracao segura do lock ao final.

### 2.17 Hardening para proxy reverso confiavel (Forwarded / X-Forwarded-*)

Foi implementado suporte seguro a proxy reverso, habilitando leitura de cabecalhos encaminhados apenas quando a origem da requisicao estiver em lista confiavel (IP/CIDR):

- `system/Engine/Request.php`
  - suporte a `security.trusted_proxies` (IP/CIDR);
  - leitura segura de `Forwarded` e `X-Forwarded-*` (proto/host/port/ip);
  - fallback automatico para `REMOTE_ADDR`, `SERVER_NAME` e `HTTPS` quando nao confiavel;
  - novo `clientIp()` para telemetria consistente.
- `system/Engine/Application.php`
  - inicializacao do `Request` com lista de proxies confiaveis;
  - validacao de host confiavel passou a usar host efetivo da requisicao (incluindo proxy confiavel);
  - logs de seguranca passaram a usar IP canonico (`clientIp()`).
- `config/config.example.php` e `index.php`
  - novo bloco `security.trusted_proxies`.

Beneficio principal:

- evita spoof de `Forwarded`/`X-Forwarded-*` por clientes externos, preservando compatibilidade com ambientes de reverse proxy reais.

### 2.18 IP canonico unificado na camada de autenticacao e auditoria

Foi concluida a unificacao de captura de IP para `Request::clientIp()` nos pontos de autenticacao e telemetria de seguranca:

- `admin/Controller/BaseAdminController.php`
- `cliente/Controller/BaseClientController.php`
- `admin/Controller/AuthController.php`
- `cliente/Controller/AuthController.php`

Impacto:

- logs e bloqueios por IP (rate limit de login) agora respeitam proxy confiavel configurado;
- fluxos de recuperacao de senha passaram a registrar IP canonico (sem depender diretamente de `$_SERVER['REMOTE_ADDR']`).

### 2.19 Auditoria automatizada de configuracao de seguranca

Foi implementado um auditor de configuracao para reduzir risco operacional em deploy/homologacao:

- `config/audit_security_config.php`
- `composer audit:security-config`
- `composer audit:security-config:strict`

Validacoes realizadas por ambiente:

- `app_url` obrigatoria para ambiente instalado, com validacao de URL canonica;
- suporte a filtro por ambiente (`--env=<nome>`);
- modo estrito (`--strict`) para transformar avisos em bloqueio no pipeline;
- `security.trusted_proxies` com validacao de IP/CIDR;
- coerencia entre host canonico e `trusted_hosts/allowed_hosts` quando configurados;
- validacao dos limiares de `security.monitoring` (janela e thresholds);
- validacao basica de configuracao de banco para ambientes instalados;
- alertas operacionais para pontos de risco em producao (HTTP sem TLS, host local/privado em `app_url`, uso de `root` e senha vazia no banco).

Status atual validado na base local:

- auditoria sem erros bloqueantes e sem avisos (`0 erro(s)`, `0 aviso(s)`) no baseline atual;
- suites de regressao mantidas verdes apos padronizacao de `local`/`online` com host canonico e trusted hosts/proxies.

### 2.20 Pipeline de verificacao de release

Foi adicionado fluxo padronizado de verificacao para reduzir erro humano antes de deploy:

- `composer verify:release` (auditoria padrao + testes de servico + testes HTTP);
- `composer verify:release:strict` (auditoria estrita + testes de servico + testes HTTP).
- `composer verify:release:online` (escopo apenas ambiente online);
- `composer verify:release:strict:online` (escopo online com bloqueio por aviso).
- `docs/CHECKLIST_DEPLOY_SEGURANCA_2026-05-06.md` com roteiro operacional para publicacao.

### 2.21 Overrides de configuracao por ambiente em runtime

Foi implementada uma camada de override por variavel de ambiente para reduzir dependencia de credenciais/versionamento no `config.php`:

- `system/Support/RuntimeConfigOverrides.php`
- `index.php` (selecao de ambiente + aplicacao de overrides antes do bootstrap da aplicacao)

Capacidades:

- selecao dinamica de ambiente por `NQ_ENVIRONMENT`;
- override de `app_url`, `trusted_hosts`, `trusted_proxies` e thresholds de monitoramento;
- override de credenciais/conexao de banco (`NQ_DB_*`);
- override de parametros de email (`NQ_MAIL_*`);
- suporte a listas por CSV/`;`/quebra de linha para hosts e proxies.
- auditoria de seguranca passou a considerar overrides `NQ_*` no ambiente auditado (especialmente em `--env=online`).

Testes dedicados:

- `tests/Service/RuntimeConfigOverridesTest.php`
- `tests/http_router.php` reforcado para desacoplar `app_url`/`db` de overrides externos durante a suite HTTP.

### 2.22 Monitoramento com serie temporal de eventos de seguranca

Foi evoluido o monitoramento operacional para incluir serie temporal (buckets) no dashboard admin:

- `admin/Service/SecurityEventMonitoringService.php`
  - novo metodo `timeseries(windowHours, bucketMinutes)` para agregacao por janela;
  - bucket configuravel (`security.monitoring.bucket_minutes`, default `60`).
- `admin/Controller/DashboardController.php`
  - injecao de dados de tendencia com base na configuracao de monitoramento.
- `admin/View/dashboard/index.php`
  - nova tabela com ultimos buckets e contagem por evento (`csrf_rejected`, `host_header_rejected`, `admin_login_blocked`, `client_login_blocked`).
- `config/config.example.php`, `config/config.php`, `index.php`
  - novo parametro `security.monitoring.bucket_minutes`.
- `system/Support/RuntimeConfigOverrides.php`
  - novo override `NQ_SECURITY_MONITORING_BUCKET_MINUTES`.
- `config/audit_security_config.php`
  - validacao de faixa para `security.monitoring.bucket_minutes` (`5` a `1440`).
- `tests/Service/SecurityEventMonitoringServiceTest.php`
  - cobertura da agregacao por buckets.

### 2.23 Expansao de controles transacionais em fluxos criticos

Foi concluida uma nova etapa de confiabilidade de dados com foco em escrita critica:

- `system/Library/Database.php`
  - novo helper `transaction(callable)` para padronizar commit/rollback.
- `cliente/Model/RequestModel.php`
  - criacao de solicitacao + itens vinculados agora ocorre de forma atomica.
- `system/Library/PasswordResetService.php`
  - emissao de token de recuperacao protegida por transacao (invalidacao + novo token);
  - redefinicao de senha protegida por transacao e lock (`FOR UPDATE`) para evitar reutilizacao concorrente de token.
- `system/Library/ReferencePriceImporter.php`
  - importacao de catalogos/itens de referencia encapsulada em transacao para evitar base parcial em falhas.

Beneficio principal:

- reduz risco de estados inconsistentes em falhas intermediarias e em cenarios de concorrencia.

## 3. Testes automatizados adicionados

Suite de servicos com fakes (sem dependencia de banco):

- `tests/run_services.php`
- `tests/Service/QuoteReportServiceTest.php`
- `tests/Service/TaxSettingsServiceTest.php`
- `tests/Service/QuoteRequestServiceTest.php`
- `tests/Service/Fakes/*`

Script de execucao:

- `composer test:services`
- `composer test:http`

Resultado atual:

- `[OK] Service tests passed: 99`
- `[OK] HTTP integration tests passed: 110`

Cobertura HTTP de seguranca CSRF contempla:

- cenarios negativos (sem token, com resposta redirect e JSON 403);
- cenarios positivos (token valido de formulario + cookie de sessao nas rotas de login admin e cliente).
- cenarios positivos em rotas sensiveis alem de login (`/admin/tributos`, `/orcamento/enviar`);
- validacao de token via header (`X-CSRF-Token`);
- rejeicao por origem cruzada mesmo com token valido (`Origin` nao confiavel).
- verificacao de persistencia de eventos CSRF em `security-events.log`.
- validacao de CSP ativo no HTML (`script-src` com nonce, sem `unsafe-inline` para scripts);
- validacao de `style-src` sem `unsafe-inline` e separacao de politica em `style-src-elem`/`style-src-attr`;
- validacao de bloqueio global de `style-src-attr` e `script-src-attr` em rotas web e de ferramentas;
- validacao de propagacao do `nonce` em tags `<script>` renderizadas.
- validacao de resistencia a `Host` forjado em metadados canonicos (`og:url`) para evitar reflexao de dominio malicioso.
- cenarios autenticados de CSRF em rotas administrativas criticas (`/admin/usuarios` e `/admin/categorias`).
- cenarios autenticados adicionais de CSRF em rotas de escrita critica (`/admin/orcamentos/{id}/gerar-relatorio` e `/admin/usuarios/{id}`).
- cenarios CSRF em fluxos de senha (admin/cliente) e instalador (`/install/step1`, `/install/step3`).
- validacao unitaria de comportamento de proxy confiavel (`Forwarded` / `X-Forwarded-*`) com cenarios confiavel vs nao-confiavel.

## 4. Validacao tecnica

- Lint PHP: sem erros de sintaxe em todos os arquivos novos/alterados.
- Testes de servico: aprovados.
- Auditoria de configuracao de seguranca: aprovada sem erros bloqueantes (`composer audit:security-config`).
- Fluxo automatizado de release validado em modo padrao (`composer verify:release`).
- Fluxo estrito validado ponta a ponta (`composer verify:release:strict` e `composer verify:release:strict:online`), ambos sem alertas bloqueantes.

## 5. Impacto estimado nos indicadores

- Arquitetura e organizacao: **8.0 -> 9.5**
- Seguranca de aplicacao: **5.0 -> 8.8** (CSRF + validacao de origem + auditoria estruturada + ciclo de vida de logs + CSP com nonce + hardening de host confiavel + cobertura autenticada + monitoramento + hardening de proxy confiavel)
- Confiabilidade de dados: **6.0 -> 8.0** (transacoes expandidas para solicitacoes, reset de senha e importacao de referencia + testes)
- Operacao/DevEx: **5.0 -> 8.5** (container simples + testes executaveis + observabilidade com retencao + validadores dedicados + alerta operacional em dashboard + suporte seguro a proxy)
- Maturidade geral do produto: **6.0 -> 8.8**

## 6. Pendencias recomendadas (proxima fase)

1. Expandir transacoes para fluxos restantes de escrita critica no admin (cadastros auxiliares e ajustes de configuracao legados).
2. Eliminar injecoes dinamicas legadas que ainda dependam de estilo inline em scripts secundarios e demos embarcadas.
3. Expandir testes de seguranca para futuros endpoints administrativos/API (quando expostos).
4. Evoluir monitoramento para serie temporal e exportacao de metricas (alem do resumo em dashboard).
5. Definir `app_url` canonica em todos os ambientes produtivos.
6. Configurar e validar `security.trusted_proxies` em todos os ambientes com reverse proxy, alinhando com whitelist de host no servidor web/proxy.

## 7. Conclusao

O sistema avancou de uma base "MVC com regra no controller" para uma base mais alinhada a MVCL real, com separacao clara entre:

- **M** (Model/Persistencia),
- **V** (Views),
- **C** (Controllers de orquestracao),
- **L** (Logica em servicos com contratos e testes).

Essa etapa reduz risco de regressao, melhora manutencao e prepara o Quotia para evolucoes seguras em escala.
