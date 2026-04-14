# Documento LGPD - Aurea Quotia

Ultima atualizacao: 03/04/2026

## 1. Objetivo

Este documento estabelece as diretrizes de conformidade com a Lei Geral de Protecao de Dados Pessoais (LGPD - Lei no 13.709/2018) para o sistema Aurea Quotia, incluindo tratamento de dados de clientes e administradores.

## 2. Escopo

Aplica-se a:

- clientes cadastrados na plataforma;
- administradores com acesso ao painel;
- dados pessoais tratados em cadastros, solicitacoes, relatorios, comunicacoes e registros tecnicos.

## 3. Agentes de tratamento

- Controlador: operacao responsavel pelo sistema Aurea Quotia.
- Operadores: terceiros contratados para suporte tecnico, hospedagem e envio de comunicacoes, quando aplicavel.
- Encarregado (DPO): deve ser formalmente designado pelo controlador e divulgado em canal de atendimento ao titular.

## 4. Categorias de dados pessoais tratados

- Identificacao e contato:
  - nome, email, telefone.
- Credenciais:
  - senha criptografada (hash), tokens de recuperacao.
- Dados de solicitacao/orcamento:
  - titulo de projeto, escopo, servicos solicitados, prazos, observacoes.
- Dados de operacao e seguranca:
  - logs de envio de email, eventos de autenticacao, metadados de sessao e IP em fluxos criticos.

## 5. Finalidades do tratamento

- autenticacao e controle de acesso por perfil;
- recebimento e processamento de solicitacoes de orcamento;
- emissao de relatorios e comunicacao de status ao cliente;
- seguranca da informacao, prevencao a fraude e rastreabilidade;
- cumprimento de obrigacoes legais/regulatorias e exercicio regular de direitos.

## 6. Bases legais aplicaveis (LGPD)

As bases legais devem ser selecionadas conforme operacao concreta. Em regra:

- execucao de contrato e procedimentos preliminares (art. 7o, V);
- cumprimento de obrigacao legal ou regulatoria (art. 7o, II);
- exercicio regular de direitos em processo judicial, administrativo ou arbitral (art. 7o, VI);
- legitimo interesse, quando cabivel com avaliacao de impacto e salvaguardas (art. 7o, IX);
- consentimento, quando estritamente necessario (art. 7o, I).

## 7. Principios observados

Implementacao alinhada aos principios da LGPD, incluindo:

- finalidade;
- adequacao;
- necessidade;
- livre acesso;
- qualidade dos dados;
- transparencia;
- seguranca;
- prevencao;
- nao discriminacao;
- responsabilizacao e prestacao de contas.

## 8. Direitos dos titulares

Canal de atendimento deve viabilizar, quando aplicavel:

- confirmacao de tratamento;
- acesso aos dados;
- correcao;
- anonimizacao, bloqueio ou eliminacao;
- portabilidade;
- informacao sobre compartilhamento;
- revogacao de consentimento;
- revisao de decisoes automatizadas, quando houver.

## 9. Seguranca da informacao (medidas tecnicas)

No Aurea Quotia:

- controle de acesso por papeis e permissoes no admin;
- conta Administrador Geral com governanca de acessos;
- sessao com protecoes de cookie (HttpOnly, SameSite, Strict Mode);
- cabecalhos de seguranca HTTP (CSP, X-Frame-Options, nosniff, etc.);
- recuperacao de senha por token unico com expiracao;
- trilha de envio de emails com status de entrega/falha;
- sanitizacao de saida em views para mitigar XSS.

## 10. Retencao e descarte

- dados devem ser mantidos apenas pelo tempo necessario as finalidades e obrigacoes legais;
- apos prazo aplicavel, deve-se aplicar descarte seguro, anonimização ou bloqueio conforme politica interna.

## 11. Compartilhamento internacional e terceiros

- qualquer compartilhamento com terceiros deve ser formalizado contratualmente;
- transferencias internacionais devem observar bases legais e garantias adequadas da LGPD.

## 12. Resposta a incidentes

Em caso de incidente de seguranca com risco ou dano relevante:

- registrar evidencias e conter impacto;
- avaliar escopo e titulares afetados;
- comunicar autoridade competente e titulares quando exigido (art. 48 da LGPD);
- implementar plano de remediacao e melhoria continua.

## 13. Governanca e auditoria

- manter inventario de operacoes de tratamento;
- revisar periodicamente permissoes de admin;
- manter evidencias de consentimento de cookies e politicas publicadas;
- realizar treinamentos periodicos para equipe administrativa.

## 14. Politicas complementares do sistema

Este documento deve ser lido junto com:

- Termos de Uso;
- Politica de Uso;
- Politica de Privacidade e Captacao de Dados;
- Politica de Cookies.

## 15. Referencias oficiais

- Lei no 13.709/2018 (LGPD): https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- Autoridade Nacional de Protecao de Dados (ANPD): https://www.gov.br/anpd/pt-br
- Direitos dos titulares (FAQ ANPD): https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes/perguntas-frequentes/6-direitos-dos-titulares-de-dados
- Comunicacao de incidente de seguranca (ANPD): https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis

## 16. Observacao de conformidade

Este documento fornece diretrizes tecnicas e operacionais de conformidade. A validacao juridica final deve ser realizada por assessoria especializada, considerando o contexto do controlador e eventuais normas setoriais.
