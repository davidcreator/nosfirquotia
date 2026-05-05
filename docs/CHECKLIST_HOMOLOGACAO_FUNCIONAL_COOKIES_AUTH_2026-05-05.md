# Checklist de Homologação Funcional - Cookies, Login e Sanitização

- Sistema: Quotia
- Data: 2026-05-05
- Ambiente sugerido: navegador em janela anônima + ambiente normal

## Objetivo
Validar em interface os fluxos implementados de:
- consentimento e política de cookies;
- lembrança de e-mail no login (cliente/admin);
- segurança mínima de formulários (CSRF + sanitização de entradas críticas).

## Pré-condições
- Aplicação acessível localmente.
- Pelo menos 1 usuário cliente válido e 1 usuário admin válido.
- Limpar cookies/site data antes do início (para testar banner e persistência).

## Cenário 1 - Banner de consentimento de cookies
1. Acesse a home sem cookies prévios.
2. Verifique se o banner de consentimento aparece.
3. Clique em "Somente essenciais".
4. Recarregue a página.

Resultado esperado:
- Banner não reaparece após escolha.
- Preferência permanece salva no navegador.

## Cenário 2 - Página de política de cookies
1. Acesse `/politica-de-cookies`.
2. Verifique o conteúdo da seção sobre cookie de lembrança de e-mail.

Resultado esperado:
- Texto informa que o cookie funcional guarda apenas e-mail.
- Texto deixa explícito que senha/token não são armazenados.

## Cenário 3 - Login do cliente com "Lembrar meu e-mail"
1. Acesse `/cliente/login`.
2. Preencha e-mail válido e senha válida.
3. Marque "Lembrar meu e-mail neste dispositivo".
4. Faça login e depois logout.
5. Volte para `/cliente/login`.

Resultado esperado:
- Campo de e-mail aparece preenchido automaticamente.
- Senha nunca aparece preenchida automaticamente pelo sistema.

## Cenário 4 - Login do cliente sem lembrar e-mail
1. Em `/cliente/login`, desmarque "Lembrar meu e-mail".
2. Faça login e logout.
3. Retorne à tela de login.

Resultado esperado:
- E-mail não permanece salvo pelo sistema (campo vazio, salvo comportamento do navegador externo).

## Cenário 5 - Login admin com "Lembrar meu e-mail"
1. Acesse `/admin`.
2. Faça login com checkbox marcado.
3. Faça logout e volte ao `/admin`.

Resultado esperado:
- E-mail reaparece automaticamente na tela de login admin.
- Senha não é persistida pelo sistema.

## Cenário 6 - Recuperação de senha (cliente/admin)
1. Acesse `/cliente/esqueci-senha` e `/admin/esqueci-senha`.
2. Teste e-mail inválido (ex.: `aaa@@`).
3. Teste e-mail válido.

Resultado esperado:
- E-mail inválido exibe erro de validação.
- E-mail válido segue fluxo com mensagem neutra (sem vazar existência de conta).

## Cenário 7 - Reset de senha (cliente/admin)
1. Acesse o fluxo de redefinição com token válido.
2. Tente senha e confirmação diferentes.
3. Tente senha extremamente longa (acima do limite).
4. Tente senha válida.

Resultado esperado:
- Divergência de confirmação bloqueada.
- Senha fora do limite bloqueada.
- Senha válida aceita.

## Cenário 8 - CSRF em formulários principais
1. Abra formulário de login cliente/admin e inspecione o HTML.
2. Confirme presença de campo `_csrf_token`.
3. (Opcional técnico) Envie POST sem token em ferramenta HTTP.

Resultado esperado:
- Formularios incluem token CSRF.
- Requisições sem token válido são rejeitadas.

## Cenário 9 - Sanitização de entradas sensíveis
1. Em cadastro/login/formulários administrativos, tente entradas com espaços extremos e caracteres de controle.
2. Em campos textuais longos, tente extrapolar limites esperados.

Resultado esperado:
- Sistema normaliza/rejeita entradas inválidas sem quebrar a interface.
- Não há execução de conteúdo indevido em telas de retorno.

## Critério de Aprovação
A homologação é aprovada se:
- todos os cenários 1 a 9 passarem;
- não ocorrer erro 500;
- não houver persistência de senha em cookie do sistema.

## Registro de Execução (preencher)
- Responsável:
- Data/hora:
- Navegador:
- Resultado geral: Aprovado / Reprovado
- Observações:
