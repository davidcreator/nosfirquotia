<?php

declare(strict_types=1);

function run_http_csrf_integration_tests(): int
{
    $tests = 0;
    $root = dirname(__DIR__, 2);
    $lockPath = $root . '/storage/installed.lock';
    $securityLogPath = $root . '/storage/logs/security-events.log';
    $initialSecurityLines = security_log_line_count($securityLogPath);
    $createdLock = false;

    if (!is_file($lockPath)) {
        file_put_contents($lockPath, 'test-lock-' . date('c'));
        $createdLock = true;
    }

    $port = random_int(19080, 19999);
    $sessionPath = str_replace('\\', '/', $root . '/storage/sessions');
    if (!is_dir($sessionPath)) {
        mkdir($sessionPath, 0775, true);
    }

    $command = [
        PHP_BINARY,
        '-d',
        'session.save_path=' . $sessionPath,
        '-S',
        '127.0.0.1:' . $port,
        'tests/http_router.php',
    ];
    $serverStdoutPath = str_replace('\\', '/', $root . '/storage/logs/http-test-server.stdout.log');
    $serverStderrPath = str_replace('\\', '/', $root . '/storage/logs/http-test-server.stderr.log');
    $descriptors = [
        0 => ['pipe', 'r'],
        1 => ['file', $serverStdoutPath, 'a'],
        2 => ['file', $serverStderrPath, 'a'],
    ];
    $process = proc_open($command, $descriptors, $pipes, $root);

    if (!is_resource($process)) {
        if ($createdLock && is_file($lockPath)) {
            unlink($lockPath);
        }

        throw new RuntimeException('Falha ao iniciar servidor HTTP de integracao.');
    }

    try {
        $ready = false;
        $deadline = microtime(true) + 8;
        while (microtime(true) < $deadline) {
            $socket = @fsockopen('127.0.0.1', $port, $errno, $errstr, 0.3);
            if (is_resource($socket)) {
                fclose($socket);
                $ready = true;
                break;
            }

            usleep(120000);
        }

        test_assert_true($ready, 'Servidor HTTP de integracao nao ficou pronto.');
        $tests++;

        $r1 = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/orcamento/enviar',
            ['Content-Type: application/x-www-form-urlencoded'],
            http_build_query(['project_title' => 'Teste'])
        );
        test_assert_same(302, $r1['status'], 'POST /orcamento/enviar sem CSRF deve redirecionar');
        test_assert_true(
            str_ends_with((string) ($r1['headers']['location'] ?? ''), '/orcamento/novo'),
            'Redirect esperado para /orcamento/novo'
        );
        $tests += 2;

        $r2 = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/orcamentos/1/gerar-relatorio',
            ['Content-Type: application/x-www-form-urlencoded'],
            http_build_query(['price_1' => '1000'])
        );
        test_assert_same(302, $r2['status'], 'POST admin gerar-relatorio sem CSRF deve redirecionar');
        test_assert_true(
            str_ends_with((string) ($r2['headers']['location'] ?? ''), '/admin/orcamentos'),
            'Redirect esperado para /admin/orcamentos'
        );
        $tests += 2;

        $r3 = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/orcamentos/1/gerar-relatorio',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
            ],
            http_build_query(['price_1' => '1000'])
        );
        test_assert_same(403, $r3['status'], 'POST JSON sem CSRF deve retornar 403');
        $payload = json_decode((string) $r3['body'], true);
        test_assert_true(is_array($payload), 'Resposta JSON de CSRF deve ser objeto');
        test_assert_same('csrf_rejected', (string) ($payload['code'] ?? ''), 'Code esperado csrf_rejected');
        test_assert_same(false, (bool) ($payload['success'] ?? true), 'Campo success esperado false');
        $tests += 4;

        $r4Get = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/admin'
        );
        $cspHeader = (string) ($r4Get['headers']['content-security-policy'] ?? '');
        test_assert_true($cspHeader !== '', 'GET /admin deve enviar header Content-Security-Policy');
        test_assert_true(
            preg_match('/script-src[^;]*\'nonce-([^\']+)\'/i', $cspHeader) === 1,
            'CSP deve incluir nonce em script-src'
        );
        test_assert_true(
            !str_contains($cspHeader, "script-src 'self' 'unsafe-inline'"),
            "CSP nao deve usar 'unsafe-inline' em script-src"
        );
        test_assert_true(
            !str_contains($cspHeader, "style-src 'self' 'unsafe-inline'"),
            "CSP nao deve usar 'unsafe-inline' em style-src"
        );
        test_assert_true(
            preg_match('/style-src-elem[^;]*\'nonce-([^\']+)\'/i', $cspHeader) === 1,
            'CSP deve incluir nonce em style-src-elem'
        );
        test_assert_true(
            str_contains($cspHeader, "style-src-attr 'none'"),
            "CSP padrao deve bloquear style attributes inline"
        );
        test_assert_true(
            str_contains($cspHeader, "script-src-attr 'none'"),
            "CSP padrao deve bloquear event handlers inline"
        );
        test_assert_true(
            preg_match('/<script\b[^>]*\bnonce="[^"]+"/i', (string) $r4Get['body']) === 1,
            'HTML deve propagar nonce nos script tags'
        );
        $tests += 8;

        $r4SpoofedHostGet = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/admin',
            ['Host: evil.example']
        );
        test_assert_same(200, $r4SpoofedHostGet['status'], 'GET /admin com Host forjado deve responder normalmente');
        $spoofedOgUrl = extract_meta_property((string) $r4SpoofedHostGet['body'], 'og:url');
        test_assert_true($spoofedOgUrl !== '', 'GET /admin deve manter metadado og:url');
        test_assert_true(
            !str_contains($spoofedOgUrl, 'evil.example'),
            'Metadados nao devem refletir Host forjado na URL canonica'
        );
        $tests += 3;

        $r4ToolGet = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/admin/ferramentas/ocimage'
        );
        $toolCspHeader = (string) ($r4ToolGet['headers']['content-security-policy'] ?? '');
        test_assert_same(302, $r4ToolGet['status'], 'GET ferramenta sem auth deve redirecionar');
        test_assert_true(
            str_ends_with((string) ($r4ToolGet['headers']['location'] ?? ''), '/admin'),
            'Ferramenta sem auth deve redirecionar para /admin'
        );
        test_assert_true(
            str_contains($toolCspHeader, "style-src-attr 'none'"),
            'ocimage migrado deve bloquear style attributes inline'
        );
        test_assert_true(
            str_contains($toolCspHeader, "script-src-attr 'none'"),
            'Ferramenta migrada deve bloquear event handlers inline via script-src-attr'
        );
        $tests += 4;

        $r4BgremoveToolGet = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/admin/ferramentas/bgremove'
        );
        $bgremoveToolCspHeader = (string) ($r4BgremoveToolGet['headers']['content-security-policy'] ?? '');
        test_assert_same(302, $r4BgremoveToolGet['status'], 'GET bgremove sem auth deve redirecionar');
        test_assert_true(
            str_ends_with((string) ($r4BgremoveToolGet['headers']['location'] ?? ''), '/admin'),
            'bgremove sem auth deve redirecionar para /admin'
        );
        test_assert_true(
            str_contains($bgremoveToolCspHeader, "style-src-attr 'none'"),
            'bgremove migrado deve bloquear style attributes inline'
        );
        test_assert_true(
            str_contains($bgremoveToolCspHeader, "script-src-attr 'none'"),
            'bgremove migrado deve bloquear event handlers inline'
        );
        $tests += 4;

        $r4LegacyToolGet = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/admin/ferramentas/mockups'
        );
        $legacyToolCspHeader = (string) ($r4LegacyToolGet['headers']['content-security-policy'] ?? '');
        test_assert_same(302, $r4LegacyToolGet['status'], 'GET mockups sem auth deve redirecionar');
        test_assert_true(
            str_ends_with((string) ($r4LegacyToolGet['headers']['location'] ?? ''), '/admin'),
            'mockups sem auth deve redirecionar para /admin'
        );
        test_assert_true(
            str_contains($legacyToolCspHeader, "style-src-attr 'none'"),
            'mockups migrado deve bloquear style attributes inline'
        );
        test_assert_true(
            str_contains($legacyToolCspHeader, "script-src-attr 'none'"),
            'mockups migrado deve bloquear event handlers inline'
        );
        $tests += 4;

        $r4FinalframeToolGet = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/admin/ferramentas/finalframe'
        );
        $finalframeToolCspHeader = (string) ($r4FinalframeToolGet['headers']['content-security-policy'] ?? '');
        test_assert_same(302, $r4FinalframeToolGet['status'], 'GET finalframe sem auth deve redirecionar');
        test_assert_true(
            str_ends_with((string) ($r4FinalframeToolGet['headers']['location'] ?? ''), '/admin'),
            'finalframe sem auth deve redirecionar para /admin'
        );
        test_assert_true(
            str_contains($finalframeToolCspHeader, "style-src-attr 'none'"),
            'finalframe sem dependencias inline deve bloquear style attributes'
        );
        test_assert_true(
            str_contains($finalframeToolCspHeader, "script-src-attr 'none'"),
            'finalframe deve bloquear event handlers inline'
        );
        $tests += 4;

        $r4ColoradvisorToolGet = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/admin/ferramentas/coloradvisor'
        );
        $coloradvisorToolCspHeader = (string) ($r4ColoradvisorToolGet['headers']['content-security-policy'] ?? '');
        test_assert_same(302, $r4ColoradvisorToolGet['status'], 'GET coloradvisor sem auth deve redirecionar');
        test_assert_true(
            str_ends_with((string) ($r4ColoradvisorToolGet['headers']['location'] ?? ''), '/admin'),
            'coloradvisor sem auth deve redirecionar para /admin'
        );
        test_assert_true(
            str_contains($coloradvisorToolCspHeader, "style-src-attr 'none'"),
            'coloradvisor migrado deve bloquear style attributes inline'
        );
        test_assert_true(
            str_contains($coloradvisorToolCspHeader, "script-src-attr 'none'"),
            'coloradvisor deve bloquear event handlers inline'
        );
        $tests += 4;

        $r4ColorpaletteToolGet = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/admin/ferramentas/colorpalette'
        );
        $colorpaletteToolCspHeader = (string) ($r4ColorpaletteToolGet['headers']['content-security-policy'] ?? '');
        test_assert_same(302, $r4ColorpaletteToolGet['status'], 'GET colorpalette sem auth deve redirecionar');
        test_assert_true(
            str_ends_with((string) ($r4ColorpaletteToolGet['headers']['location'] ?? ''), '/admin'),
            'colorpalette sem auth deve redirecionar para /admin'
        );
        test_assert_true(
            str_contains($colorpaletteToolCspHeader, "style-src-attr 'none'"),
            'colorpalette migrado deve bloquear style attributes inline'
        );
        test_assert_true(
            str_contains($colorpaletteToolCspHeader, "script-src-attr 'none'"),
            'colorpalette deve bloquear event handlers inline'
        );
        $tests += 4;

        $r4BrandmanualToolGet = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/admin/ferramentas/brandmanual'
        );
        $brandmanualToolCspHeader = (string) ($r4BrandmanualToolGet['headers']['content-security-policy'] ?? '');
        test_assert_same(302, $r4BrandmanualToolGet['status'], 'GET brandmanual sem auth deve redirecionar');
        test_assert_true(
            str_ends_with((string) ($r4BrandmanualToolGet['headers']['location'] ?? ''), '/admin'),
            'brandmanual sem auth deve redirecionar para /admin'
        );
        test_assert_true(
            str_contains($brandmanualToolCspHeader, "style-src-attr 'none'"),
            'brandmanual migrado deve bloquear style attributes inline'
        );
        test_assert_true(
            str_contains($brandmanualToolCspHeader, "script-src-attr 'none'"),
            'brandmanual deve bloquear event handlers inline'
        );
        $tests += 4;

        $r4FontadvisorToolGet = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/admin/ferramentas/fontadvisor'
        );
        $fontadvisorToolCspHeader = (string) ($r4FontadvisorToolGet['headers']['content-security-policy'] ?? '');
        test_assert_same(302, $r4FontadvisorToolGet['status'], 'GET fontadvisor sem auth deve redirecionar');
        test_assert_true(
            str_ends_with((string) ($r4FontadvisorToolGet['headers']['location'] ?? ''), '/admin'),
            'fontadvisor sem auth deve redirecionar para /admin'
        );
        test_assert_true(
            str_contains($fontadvisorToolCspHeader, "style-src-attr 'none'"),
            'fontadvisor migrado deve bloquear style attributes inline'
        );
        test_assert_true(
            str_contains($fontadvisorToolCspHeader, "script-src-attr 'none'"),
            'fontadvisor deve bloquear event handlers inline'
        );
        $tests += 4;

        $adminCsrf = extract_csrf_token($r4Get['body']);
        $adminSessionCookie = extract_session_cookie($r4Get['headers']);
        test_assert_true($adminCsrf !== '', 'GET /admin deve expor token CSRF');
        test_assert_true($adminSessionCookie !== '', 'GET /admin deve retornar cookie de sessao');
        $r4Post = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/login',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['_csrf_token' => $adminCsrf])
        );
        test_assert_same(302, $r4Post['status'], 'POST /admin/login com CSRF valido deve passar no guard de CSRF');
        $tests += 3;

        $r4CrossOrigin = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/login',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
                'Origin: https://evil.example',
            ],
            http_build_query(['_csrf_token' => $adminCsrf])
        );
        test_assert_same(
            403,
            $r4CrossOrigin['status'],
            'POST /admin/login com origem cruzada deve ser rejeitado mesmo com token valido'
        );
        $crossOriginPayload = json_decode((string) $r4CrossOrigin['body'], true);
        test_assert_same(
            'csrf_rejected',
            (string) ($crossOriginPayload['code'] ?? ''),
            'Origem cruzada deve retornar code csrf_rejected'
        );
        $tests += 2;

        $r4TrustedHostOrigin = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/login',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
                'Origin: http://localhost',
            ],
            http_build_query(['_csrf_token' => $adminCsrf])
        );
        test_assert_same(
            302,
            $r4TrustedHostOrigin['status'],
            'POST /admin/login com Origin em trusted_hosts deve passar no guard de CSRF'
        );
        $tests++;

        $r4Taxes = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/tributos',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['_csrf_token' => $adminCsrf, 'imposto_label' => 'Impostos'])
        );
        test_assert_same(302, $r4Taxes['status'], 'POST /admin/tributos com CSRF valido deve passar no guard');
        test_assert_true(
            str_ends_with((string) ($r4Taxes['headers']['location'] ?? ''), '/admin'),
            'Sem auth, /admin/tributos deve redirecionar para /admin apos passar CSRF'
        );
        $tests += 2;

        $authenticatedAdminCsrf = bootstrap_admin_authenticated_session($sessionPath, $adminSessionCookie);

        $r4UsersMissingCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/usuarios',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['name' => 'Teste', 'email' => 'teste@example.com'])
        );
        test_assert_same(403, $r4UsersMissingCsrf['status'], 'POST /admin/usuarios autenticado sem CSRF deve retornar 403');
        $r4UsersMissingPayload = json_decode((string) $r4UsersMissingCsrf['body'], true);
        test_assert_same(
            'csrf_rejected',
            (string) ($r4UsersMissingPayload['code'] ?? ''),
            'POST /admin/usuarios sem CSRF deve retornar code csrf_rejected'
        );

        $r4UsersWithCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/usuarios',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['_csrf_token' => $authenticatedAdminCsrf])
        );
        test_assert_same(302, $r4UsersWithCsrf['status'], 'POST /admin/usuarios com CSRF valido deve passar no guard');
        test_assert_true(
            str_ends_with((string) ($r4UsersWithCsrf['headers']['location'] ?? ''), '/admin/usuarios'),
            'POST /admin/usuarios com CSRF valido deve atingir fluxo do controller'
        );
        $tests += 4;

        $r4CategoriesMissingCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/categorias',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['name' => 'Teste'])
        );
        test_assert_same(
            403,
            $r4CategoriesMissingCsrf['status'],
            'POST /admin/categorias autenticado sem CSRF deve retornar 403'
        );
        $r4CategoriesMissingPayload = json_decode((string) $r4CategoriesMissingCsrf['body'], true);
        test_assert_same(
            'csrf_rejected',
            (string) ($r4CategoriesMissingPayload['code'] ?? ''),
            'POST /admin/categorias sem CSRF deve retornar code csrf_rejected'
        );

        $r4CategoriesWithCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/categorias',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['_csrf_token' => $authenticatedAdminCsrf])
        );
        test_assert_same(302, $r4CategoriesWithCsrf['status'], 'POST /admin/categorias com CSRF valido deve passar no guard');
        test_assert_true(
            str_ends_with((string) ($r4CategoriesWithCsrf['headers']['location'] ?? ''), '/admin/categorias'),
            'POST /admin/categorias com CSRF valido deve atingir fluxo do controller'
        );
        $tests += 4;

        $r4QuoteMissingCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/orcamentos/1/gerar-relatorio',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['price_1' => '1000'])
        );
        test_assert_same(
            403,
            $r4QuoteMissingCsrf['status'],
            'POST /admin/orcamentos/{id}/gerar-relatorio autenticado sem CSRF deve retornar 403'
        );
        $r4QuoteMissingPayload = json_decode((string) $r4QuoteMissingCsrf['body'], true);
        test_assert_same(
            'csrf_rejected',
            (string) ($r4QuoteMissingPayload['code'] ?? ''),
            'POST /admin/orcamentos/{id}/gerar-relatorio sem CSRF deve retornar code csrf_rejected'
        );

        $r4QuoteWithCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/orcamentos/1/gerar-relatorio',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['_csrf_token' => $authenticatedAdminCsrf, 'price_1' => '1000'])
        );
        test_assert_same(
            302,
            $r4QuoteWithCsrf['status'],
            'POST /admin/orcamentos/{id}/gerar-relatorio com CSRF valido deve passar no guard'
        );
        test_assert_true(
            str_ends_with((string) ($r4QuoteWithCsrf['headers']['location'] ?? ''), '/admin/orcamentos'),
            'POST /admin/orcamentos/{id}/gerar-relatorio com CSRF valido deve atingir fluxo do controller'
        );
        $tests += 4;

        $r4UsersUpdateMissingCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/usuarios/999',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['name' => 'Teste'])
        );
        test_assert_same(
            403,
            $r4UsersUpdateMissingCsrf['status'],
            'POST /admin/usuarios/{id} autenticado sem CSRF deve retornar 403'
        );
        $r4UsersUpdateMissingPayload = json_decode((string) $r4UsersUpdateMissingCsrf['body'], true);
        test_assert_same(
            'csrf_rejected',
            (string) ($r4UsersUpdateMissingPayload['code'] ?? ''),
            'POST /admin/usuarios/{id} sem CSRF deve retornar code csrf_rejected'
        );

        $r4UsersUpdateWithCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/usuarios/999',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['_csrf_token' => $authenticatedAdminCsrf, 'name' => 'Teste'])
        );
        test_assert_same(302, $r4UsersUpdateWithCsrf['status'], 'POST /admin/usuarios/{id} com CSRF valido deve passar no guard');
        test_assert_true(
            str_ends_with((string) ($r4UsersUpdateWithCsrf['headers']['location'] ?? ''), '/admin/usuarios'),
            'POST /admin/usuarios/{id} com CSRF valido deve atingir fluxo do controller'
        );
        $tests += 4;

        $r4AdminForgotMissingCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/esqueci-senha',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['email' => 'admin@example.com'])
        );
        test_assert_same(
            403,
            $r4AdminForgotMissingCsrf['status'],
            'POST /admin/esqueci-senha sem CSRF deve retornar 403'
        );
        $r4AdminForgotMissingPayload = json_decode((string) $r4AdminForgotMissingCsrf['body'], true);
        test_assert_same(
            'csrf_rejected',
            (string) ($r4AdminForgotMissingPayload['code'] ?? ''),
            'POST /admin/esqueci-senha sem CSRF deve retornar code csrf_rejected'
        );

        $r4AdminForgotWithCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/esqueci-senha',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['_csrf_token' => $authenticatedAdminCsrf, 'email' => 'invalido'])
        );
        test_assert_same(302, $r4AdminForgotWithCsrf['status'], 'POST /admin/esqueci-senha com CSRF deve passar no guard');
        test_assert_true(
            str_ends_with((string) ($r4AdminForgotWithCsrf['headers']['location'] ?? ''), '/admin/esqueci-senha'),
            'POST /admin/esqueci-senha com CSRF deve atingir fluxo do controller'
        );
        $tests += 4;

        $r4AdminResetMissingCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/redefinir-senha',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['token' => 'abc', 'password' => '123456', 'password_confirm' => '123456'])
        );
        test_assert_same(
            403,
            $r4AdminResetMissingCsrf['status'],
            'POST /admin/redefinir-senha sem CSRF deve retornar 403'
        );
        $r4AdminResetMissingPayload = json_decode((string) $r4AdminResetMissingCsrf['body'], true);
        test_assert_same(
            'csrf_rejected',
            (string) ($r4AdminResetMissingPayload['code'] ?? ''),
            'POST /admin/redefinir-senha sem CSRF deve retornar code csrf_rejected'
        );

        $r4AdminResetWithCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/admin/redefinir-senha',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $adminSessionCookie,
            ],
            http_build_query(['_csrf_token' => $authenticatedAdminCsrf, 'token' => 'abc', 'password' => '123456', 'password_confirm' => '654321'])
        );
        test_assert_same(302, $r4AdminResetWithCsrf['status'], 'POST /admin/redefinir-senha com CSRF deve passar no guard');
        test_assert_true(
            str_starts_with((string) ($r4AdminResetWithCsrf['headers']['location'] ?? ''), '/admin/redefinir-senha?token='),
            'POST /admin/redefinir-senha com CSRF deve atingir fluxo do controller'
        );
        $tests += 4;

        $r5Get = http_request(
            'GET',
            'http://127.0.0.1:' . $port . '/cliente/login'
        );
        $clientCsrf = extract_csrf_token($r5Get['body']);
        $clientSessionCookie = extract_session_cookie($r5Get['headers']);
        test_assert_true($clientCsrf !== '', 'GET /cliente/login deve expor token CSRF');
        test_assert_true($clientSessionCookie !== '', 'GET /cliente/login deve retornar cookie de sessao');
        $r5Post = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/cliente/login',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $clientSessionCookie,
            ],
            http_build_query(['_csrf_token' => $clientCsrf])
        );
        test_assert_same(302, $r5Post['status'], 'POST /cliente/login com CSRF valido deve passar no guard de CSRF');
        $tests += 3;

        $r5HeaderToken = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/cliente/login',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $clientSessionCookie,
                'X-CSRF-Token: ' . $clientCsrf,
            ],
            http_build_query([])
        );
        test_assert_same(
            302,
            $r5HeaderToken['status'],
            'POST /cliente/login com token no header deve passar no guard de CSRF'
        );
        $tests++;

        $r5ClientForgotMissingCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/cliente/esqueci-senha',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $clientSessionCookie,
            ],
            http_build_query(['email' => 'cliente@example.com'])
        );
        test_assert_same(
            403,
            $r5ClientForgotMissingCsrf['status'],
            'POST /cliente/esqueci-senha sem CSRF deve retornar 403'
        );
        $r5ClientForgotMissingPayload = json_decode((string) $r5ClientForgotMissingCsrf['body'], true);
        test_assert_same(
            'csrf_rejected',
            (string) ($r5ClientForgotMissingPayload['code'] ?? ''),
            'POST /cliente/esqueci-senha sem CSRF deve retornar code csrf_rejected'
        );

        $r5ClientForgotWithCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/cliente/esqueci-senha',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $clientSessionCookie,
            ],
            http_build_query(['_csrf_token' => $clientCsrf, 'email' => 'invalido'])
        );
        test_assert_same(302, $r5ClientForgotWithCsrf['status'], 'POST /cliente/esqueci-senha com CSRF deve passar no guard');
        test_assert_true(
            str_ends_with((string) ($r5ClientForgotWithCsrf['headers']['location'] ?? ''), '/cliente/esqueci-senha'),
            'POST /cliente/esqueci-senha com CSRF deve atingir fluxo do controller'
        );
        $tests += 4;

        $r5ClientResetMissingCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/cliente/redefinir-senha',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $clientSessionCookie,
            ],
            http_build_query(['token' => 'abc', 'password' => '123456', 'password_confirm' => '123456'])
        );
        test_assert_same(
            403,
            $r5ClientResetMissingCsrf['status'],
            'POST /cliente/redefinir-senha sem CSRF deve retornar 403'
        );
        $r5ClientResetMissingPayload = json_decode((string) $r5ClientResetMissingCsrf['body'], true);
        test_assert_same(
            'csrf_rejected',
            (string) ($r5ClientResetMissingPayload['code'] ?? ''),
            'POST /cliente/redefinir-senha sem CSRF deve retornar code csrf_rejected'
        );

        $r5ClientResetWithCsrf = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/cliente/redefinir-senha',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json',
                'Cookie: ' . $clientSessionCookie,
            ],
            http_build_query(['_csrf_token' => $clientCsrf, 'token' => 'abc', 'password' => '123456', 'password_confirm' => '654321'])
        );
        test_assert_same(302, $r5ClientResetWithCsrf['status'], 'POST /cliente/redefinir-senha com CSRF deve passar no guard');
        test_assert_true(
            str_starts_with((string) ($r5ClientResetWithCsrf['headers']['location'] ?? ''), '/cliente/redefinir-senha?token='),
            'POST /cliente/redefinir-senha com CSRF deve atingir fluxo do controller'
        );
        $tests += 4;

        $r6Post = http_request(
            'POST',
            'http://127.0.0.1:' . $port . '/orcamento/enviar',
            [
                'Content-Type: application/x-www-form-urlencoded',
                'Cookie: ' . $clientSessionCookie,
            ],
            http_build_query(['_csrf_token' => $clientCsrf, 'project_title' => 'Teste'])
        );
        test_assert_same(302, $r6Post['status'], 'POST /orcamento/enviar com CSRF valido deve passar no guard');
        test_assert_true(
            str_ends_with((string) ($r6Post['headers']['location'] ?? ''), '/cliente/login'),
            'Sem auth, /orcamento/enviar deve redirecionar para /cliente/login apos passar CSRF'
        );
        $tests += 2;

        $installLockBackupPath = $lockPath . '.http-test-backup-' . uniqid('', true);
        $hadLockBeforeInstallPhase = is_file($lockPath);
        if ($hadLockBeforeInstallPhase) {
            $lockMoved = @rename($lockPath, $installLockBackupPath);
            test_assert_true($lockMoved, 'Nao foi possivel preparar modo nao-instalado para testes /install');
        }

        try {
            $rInstallGet = http_request(
                'GET',
                'http://127.0.0.1:' . $port . '/install/step1'
            );
            $installCsrf = extract_csrf_token($rInstallGet['body']);
            $installSessionCookie = extract_session_cookie($rInstallGet['headers']);
            test_assert_same(200, $rInstallGet['status'], 'GET /install/step1 deve responder 200 em modo nao-instalado');
            test_assert_true($installCsrf !== '', 'GET /install/step1 deve expor token CSRF');
            test_assert_true($installSessionCookie !== '', 'GET /install/step1 deve retornar cookie de sessao');
            $tests += 3;

            $rInstallStep1MissingCsrf = http_request(
                'POST',
                'http://127.0.0.1:' . $port . '/install/step1',
                [
                    'Content-Type: application/x-www-form-urlencoded',
                    'Accept: application/json',
                    'Cookie: ' . $installSessionCookie,
                ],
                http_build_query([])
            );
            test_assert_same(403, $rInstallStep1MissingCsrf['status'], 'POST /install/step1 sem CSRF deve retornar 403');
            $rInstallStep1MissingPayload = json_decode((string) $rInstallStep1MissingCsrf['body'], true);
            test_assert_same(
                'csrf_rejected',
                (string) ($rInstallStep1MissingPayload['code'] ?? ''),
                'POST /install/step1 sem CSRF deve retornar code csrf_rejected'
            );

            $rInstallStep1WithCsrf = http_request(
                'POST',
                'http://127.0.0.1:' . $port . '/install/step1',
                [
                    'Content-Type: application/x-www-form-urlencoded',
                    'Accept: application/json',
                    'Cookie: ' . $installSessionCookie,
                ],
                http_build_query(['_csrf_token' => $installCsrf])
            );
            test_assert_same(302, $rInstallStep1WithCsrf['status'], 'POST /install/step1 com CSRF deve passar no guard');
            test_assert_true(
                str_ends_with((string) ($rInstallStep1WithCsrf['headers']['location'] ?? ''), '/index.php?route=/install/step2'),
                'POST /install/step1 com CSRF deve atingir fluxo do controller'
            );
            $tests += 4;

            $installStep3Csrf = bootstrap_install_step3_session($sessionPath, $installSessionCookie);

            $rInstallStep3MissingCsrf = http_request(
                'POST',
                'http://127.0.0.1:' . $port . '/install/step3',
                [
                    'Content-Type: application/x-www-form-urlencoded',
                    'Accept: application/json',
                    'Cookie: ' . $installSessionCookie,
                ],
                http_build_query(['admin_pass' => '123456', 'admin_pass_confirm' => '123456'])
            );
            test_assert_same(403, $rInstallStep3MissingCsrf['status'], 'POST /install/step3 sem CSRF deve retornar 403');
            $rInstallStep3MissingPayload = json_decode((string) $rInstallStep3MissingCsrf['body'], true);
            test_assert_same(
                'csrf_rejected',
                (string) ($rInstallStep3MissingPayload['code'] ?? ''),
                'POST /install/step3 sem CSRF deve retornar code csrf_rejected'
            );

            $rInstallStep3WithCsrf = http_request(
                'POST',
                'http://127.0.0.1:' . $port . '/install/step3',
                [
                    'Content-Type: application/x-www-form-urlencoded',
                    'Accept: application/json',
                    'Cookie: ' . $installSessionCookie,
                ],
                http_build_query(
                    [
                        '_csrf_token' => $installStep3Csrf,
                        'db_host' => '127.0.0.1',
                        'db_port' => '3306',
                        'db_name' => 'teste',
                        'db_user' => 'root',
                        'db_pass' => '',
                        'admin_name' => 'Administrador',
                        'admin_email' => 'admin@example.com',
                        'admin_pass' => '123',
                        'admin_pass_confirm' => '123',
                    ]
                )
            );
            test_assert_same(302, $rInstallStep3WithCsrf['status'], 'POST /install/step3 com CSRF deve passar no guard');
            test_assert_true(
                str_ends_with((string) ($rInstallStep3WithCsrf['headers']['location'] ?? ''), '/index.php?route=/install/step3'),
                'POST /install/step3 com CSRF deve atingir fluxo do controller'
            );
            $tests += 4;
        } finally {
            if (is_file($lockPath)) {
                @unlink($lockPath);
            }

            if ($hadLockBeforeInstallPhase && is_file($installLockBackupPath)) {
                @rename($installLockBackupPath, $lockPath);
            } elseif (is_file($installLockBackupPath)) {
                @unlink($installLockBackupPath);
            }
        }

        $finalSecurityLines = security_log_line_count($securityLogPath);
        test_assert_true(
            $finalSecurityLines > $initialSecurityLines,
            'Eventos CSRF rejeitados devem ser persistidos no security-events.log'
        );
        test_assert_true(
            security_log_contains_event($securityLogPath, 'csrf_rejected'),
            'security-events.log deve conter evento csrf_rejected'
        );
        $tests += 2;
    } finally {
        proc_terminate($process);
        foreach ($pipes as $pipe) {
            if (is_resource($pipe)) {
                fclose($pipe);
            }
        }
        proc_close($process);

        if ($createdLock && is_file($lockPath)) {
            unlink($lockPath);
        }
    }

    return $tests;
}

function security_log_line_count(string $path): int
{
    if (!is_file($path)) {
        return 0;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return 0;
    }

    return count($lines);
}

function security_log_contains_event(string $path, string $event): bool
{
    if (!is_file($path)) {
        return false;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return false;
    }

    foreach ($lines as $line) {
        $decoded = json_decode((string) $line, true);
        if (!is_array($decoded)) {
            continue;
        }

        if ((string) ($decoded['event'] ?? '') === $event) {
            return true;
        }
    }

    return false;
}

function extract_csrf_token(string $html): string
{
    if (preg_match('/name="_csrf_token"\s+value="([^"]+)"/', $html, $match) === 1) {
        return trim((string) $match[1]);
    }

    return '';
}

function extract_meta_property(string $html, string $propertyName): string
{
    $propertyName = trim($propertyName);
    if ($propertyName === '') {
        return '';
    }

    $pattern = '/<meta\s+property="' . preg_quote($propertyName, '/') . '"\s+content="([^"]*)"/i';
    if (preg_match($pattern, $html, $match) === 1) {
        return trim((string) $match[1]);
    }

    return '';
}

/**
 * @param array<string, string> $headers
 */
function extract_session_cookie(array $headers): string
{
    $raw = (string) ($headers['set-cookie'] ?? '');
    if ($raw === '') {
        return '';
    }

    $pair = explode(';', $raw, 2)[0] ?? '';
    return trim($pair);
}

function bootstrap_admin_authenticated_session(string $sessionPath, string $sessionCookie): string
{
    $sessionId = extract_session_id_from_cookie($sessionCookie);
    test_assert_true($sessionId !== '', 'Cookie de sessao admin deve conter um session id');

    $secret = str_repeat('0123456789abcdef', 4);
    write_session_payload(
        $sessionPath,
        $sessionId,
        [
            '_flash' => [],
            '_csrf_secret' => $secret,
            'admin_user' => [
                'id' => 999001,
                'name' => 'HTTP Test Admin',
                'email' => 'http-admin@test.local',
                'access_level' => 'Administrador Geral',
                'is_general_admin' => true,
                'permissions' => [],
            ],
        ]
    );

    return build_csrf_token_from_secret($secret);
}

function bootstrap_install_step3_session(string $sessionPath, string $sessionCookie): string
{
    $sessionId = extract_session_id_from_cookie($sessionCookie);
    test_assert_true($sessionId !== '', 'Cookie de sessao install deve conter um session id');

    $secret = str_repeat('abcdef0123456789', 4);
    write_session_payload(
        $sessionPath,
        $sessionId,
        [
            '_flash' => [],
            '_csrf_secret' => $secret,
            'install.step1' => true,
            'install.step2' => true,
        ]
    );

    return build_csrf_token_from_secret($secret);
}

function extract_session_id_from_cookie(string $cookie): string
{
    $cookie = trim($cookie);
    if ($cookie === '') {
        return '';
    }

    $pair = explode(';', $cookie, 2)[0] ?? '';
    $parts = explode('=', $pair, 2);
    if (count($parts) !== 2) {
        return '';
    }

    return trim((string) $parts[1]);
}

/**
 * @param array<string, mixed> $payload
 */
function write_session_payload(string $sessionPath, string $sessionId, array $payload): void
{
    $sessionFile = rtrim(str_replace('\\', '/', $sessionPath), '/') . '/sess_' . $sessionId;
    $handler = (string) ini_get('session.serialize_handler');

    if ($handler === 'php_serialize') {
        $encoded = serialize($payload);
    } else {
        $encoded = encode_php_session_payload($payload);
    }

    $bytes = @file_put_contents($sessionFile, $encoded, LOCK_EX);
    test_assert_true($bytes !== false, 'Falha ao escrever sessao autenticada de teste');
}

/**
 * @param array<string, mixed> $payload
 */
function encode_php_session_payload(array $payload): string
{
    $encoded = '';

    foreach ($payload as $key => $value) {
        $key = (string) $key;
        if ($key === '' || str_contains($key, '|')) {
            continue;
        }

        $encoded .= $key . '|' . serialize($value);
    }

    return $encoded;
}

function build_csrf_token_from_secret(string $secret): string
{
    $issuedAt = time();
    $nonce = bin2hex(random_bytes_test_safe(12));
    $signature = hash_hmac('sha256', $issuedAt . '|' . $nonce, $secret);

    return $issuedAt . '.' . $nonce . '.' . $signature;
}

function random_bytes_test_safe(int $length): string
{
    try {
        return random_bytes($length);
    } catch (Throwable) {
        $buffer = '';
        while (strlen($buffer) < $length) {
            $buffer .= hash('sha256', uniqid('test_entropy_', true), true);
        }

        return substr($buffer, 0, $length);
    }
}

/**
 * @param array<int, string> $headers
 * @return array{status:int, headers:array<string,string>, body:string}
 */
function http_request(string $method, string $url, array $headers = [], string $body = ''): array
{
    $context = stream_context_create(
        [
            'http' => [
                'method' => strtoupper($method),
                'header' => implode("\r\n", $headers),
                'content' => $body,
                'ignore_errors' => true,
                'follow_location' => 0,
                'max_redirects' => 0,
                'timeout' => 10,
            ],
        ]
    );

    $responseBody = file_get_contents($url, false, $context);
    $responseHeaders = $http_response_header ?? [];

    $status = 0;
    $parsedHeaders = [];

    foreach ($responseHeaders as $index => $line) {
        if ($index === 0) {
            if (preg_match('/\s(\d{3})\s/', $line, $match) === 1) {
                $status = (int) $match[1];
            }
            continue;
        }

        $parts = explode(':', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $key = strtolower(trim($parts[0]));
        $value = trim($parts[1]);
        if ($key !== '') {
            $parsedHeaders[$key] = $value;
        }
    }

    return [
        'status' => $status,
        'headers' => $parsedHeaders,
        'body' => is_string($responseBody) ? $responseBody : '',
    ];
}
