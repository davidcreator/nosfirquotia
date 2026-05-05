# Documento LGPD - Nosfir Quotia

Última atualização: 04/05/2026

## 1. Objetivo

Este documento estabelece as diretrizes de conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018) para o sistema Nosfir Quotia, incluindo o tratamento de dados de clientes e administradores.

## 2. Escopo

Aplica-se a:

- clientes cadastrados na plataforma;
- administradores com acesso ao painel;
- dados pessoais tratados em cadastros, solicitações, relatórios, comunicações e registros técnicos.

## 3. Agentes de tratamento

- Controlador: operação responsável pelo sistema Nosfir Quotia.
- Operadores: terceiros contratados para suporte técnico, hospedagem e envio de comunicações, quando aplicável.
- Encarregado (DPO): deve ser formalmente designado pelo controlador e divulgado em canal de atendimento ao titular.

## 4. Categorias de dados pessoais tratados

- Identificação e contato:
  - nome, e-mail, telefone.
- Credenciais:
  - senha criptografada (hash), tokens de recuperação.
- Dados de solicitação/orçamento:
  - título de projeto, escopo, serviços solicitados, prazos, observações.
- Dados de operação e segurança:
  - logs de envio de e-mail, eventos de autenticação, metadados de sessão e IP em fluxos críticos.

## 5. Finalidades do tratamento

- autenticação e controle de acesso por perfil;
- recebimento e processamento de solicitações de orçamento;
- emissão de relatórios e comunicação de status ao cliente;
- segurança da informação, prevenção a fraude e rastreabilidade;
- cumprimento de obrigações legais/regulatórias e exercício regular de direitos.

## 6. Bases legais aplicáveis (LGPD)

As bases legais devem ser selecionadas conforme a operação concreta. Em regra:

- execução de contrato e procedimentos preliminares (art. 7º, V);
- cumprimento de obrigação legal ou regulatória (art. 7º, II);
- exercício regular de direitos em processo judicial, administrativo ou arbitral (art. 7º, VI);
- legítimo interesse, quando cabível, com avaliação de impacto e salvaguardas (art. 7º, IX);
- consentimento, quando estritamente necessário (art. 7º, I).

## 7. Princípios observados

Implementação alinhada aos princípios da LGPD, incluindo:

- finalidade;
- adequação;
- necessidade;
- livre acesso;
- qualidade dos dados;
- transparência;
- segurança;
- prevenção;
- não discriminação;
- responsabilização e prestação de contas.

## 8. Direitos dos titulares

Canal de atendimento deve viabilizar, quando aplicável:

- confirmação de tratamento;
- acesso aos dados;
- correção;
- anonimização, bloqueio ou eliminação;
- portabilidade;
- informação sobre compartilhamento;
- revogação de consentimento;
- revisão de decisões automatizadas, quando houver.

## 9. Segurança da informação (medidas técnicas)

No Nosfir Quotia:

- controle de acesso por papéis e permissões no admin;
- conta Administrador Geral com governança de acessos;
- sessão com proteções de cookie (`HttpOnly`, `SameSite`, `Strict Mode`);
- cabeçalhos de segurança HTTP (CSP, X-Frame-Options, nosniff, etc.);
- recuperação de senha por token único com expiração;
- trilha de envio de e-mails com status de entrega/falha;
- sanitização de saída em views para mitigar XSS.

## 10. Retenção e descarte

- os dados devem ser mantidos apenas pelo tempo necessário às finalidades e obrigações legais;
- após o prazo aplicável, deve-se aplicar descarte seguro, anonimização ou bloqueio conforme política interna.

## 11. Compartilhamento internacional e terceiros

- qualquer compartilhamento com terceiros deve ser formalizado contratualmente;
- transferências internacionais devem observar bases legais e garantias adequadas da LGPD.

## 12. Resposta a incidentes

Em caso de incidente de segurança com risco ou dano relevante:

- registrar evidências e conter impacto;
- avaliar escopo e titulares afetados;
- comunicar autoridade competente e titulares quando exigido (art. 48 da LGPD);
- implementar plano de remediação e melhoria contínua.

## 13. Governança e auditoria

- manter inventário de operações de tratamento;
- revisar periodicamente permissões de admin;
- manter evidências de consentimento de cookies e políticas publicadas;
- realizar treinamentos periódicos para equipe administrativa.

## 14. Políticas complementares do sistema

Este documento deve ser lido junto com:

- Termos de Uso;
- Política de Uso;
- Política de Privacidade e Captação de Dados;
- Política de Cookies.

## 15. Referências oficiais

- Lei nº 13.709/2018 (LGPD): https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- Autoridade Nacional de Proteção de Dados (ANPD): https://www.gov.br/anpd/pt-br
- Direitos dos titulares (FAQ ANPD): https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes/perguntas-frequentes/6-direitos-dos-titulares-de-dados
- Comunicação de incidente de segurança (ANPD): https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis

## 16. Observação de conformidade

Este documento fornece diretrizes técnicas e operacionais de conformidade. A validação jurídica final deve ser realizada por assessoria especializada, considerando o contexto do controlador e eventuais normas setoriais.
