<?php

declare(strict_types=1);

use NosfirQuotia\System\Engine\Request;

function run_request_trusted_proxy_tests(): int
{
    $tests = 0;

    $untrusted = new Request(
        [],
        [],
        [
            'REQUEST_METHOD' => 'GET',
            'REQUEST_URI' => '/admin',
            'SCRIPT_NAME' => '/index.php',
            'SERVER_NAME' => 'internal.local',
            'SERVER_PORT' => '80',
            'REMOTE_ADDR' => '198.51.100.8',
            'HTTP_X_FORWARDED_FOR' => '203.0.113.10',
            'HTTP_X_FORWARDED_PROTO' => 'https',
            'HTTP_X_FORWARDED_HOST' => 'app.example.com',
            'HTTP_X_FORWARDED_PORT' => '8443',
        ],
        [],
        ['10.0.0.0/8']
    );

    test_assert_same('http', $untrusted->scheme(), 'Request should ignore X-Forwarded-Proto when remote is untrusted');
    test_assert_same('internal.local', $untrusted->host(), 'Request should ignore X-Forwarded-Host when remote is untrusted');
    test_assert_same('198.51.100.8', $untrusted->clientIp(), 'Request should keep REMOTE_ADDR when remote is untrusted');
    $tests += 3;

    $trusted = new Request(
        [],
        [],
        [
            'REQUEST_METHOD' => 'GET',
            'REQUEST_URI' => '/admin',
            'SCRIPT_NAME' => '/index.php',
            'SERVER_NAME' => 'internal.local',
            'SERVER_PORT' => '80',
            'REMOTE_ADDR' => '10.1.2.3',
            'HTTP_X_FORWARDED_FOR' => '203.0.113.10, 10.1.2.3',
            'HTTP_X_FORWARDED_PROTO' => 'https',
            'HTTP_X_FORWARDED_HOST' => 'app.example.com',
            'HTTP_X_FORWARDED_PORT' => '8443',
        ],
        [],
        ['10.0.0.0/8']
    );

    test_assert_same('https', $trusted->scheme(), 'Request should trust forwarded proto for trusted proxy');
    test_assert_same('app.example.com:8443', $trusted->host(), 'Request should trust forwarded host/port for trusted proxy');
    test_assert_same('203.0.113.10', $trusted->clientIp(), 'Request should resolve client IP from X-Forwarded-For');
    $tests += 3;

    $trustedForwardedHeader = new Request(
        [],
        [],
        [
            'REQUEST_METHOD' => 'GET',
            'REQUEST_URI' => '/admin',
            'SCRIPT_NAME' => '/index.php',
            'SERVER_NAME' => 'internal.local',
            'SERVER_PORT' => '80',
            'REMOTE_ADDR' => '10.2.3.4',
            'HTTP_FORWARDED' => 'for=203.0.113.77;proto=https;host=portal.example.net:9443',
            'HTTP_X_FORWARDED_HOST' => 'should-not-win.example',
            'HTTP_X_FORWARDED_PROTO' => 'http',
        ],
        [],
        ['10.0.0.0/8']
    );

    test_assert_same('https', $trustedForwardedHeader->scheme(), 'Request should prioritize Forwarded proto for trusted proxy');
    test_assert_same(
        'portal.example.net:9443',
        $trustedForwardedHeader->host(),
        'Request should prioritize Forwarded host for trusted proxy'
    );
    test_assert_same(
        '203.0.113.77',
        $trustedForwardedHeader->clientIp(),
        'Request should resolve client IP from Forwarded header'
    );
    $tests += 3;

    $trustedInvalidForwardedHost = new Request(
        [],
        [],
        [
            'REQUEST_METHOD' => 'GET',
            'REQUEST_URI' => '/admin',
            'SCRIPT_NAME' => '/index.php',
            'SERVER_NAME' => 'internal.local',
            'SERVER_PORT' => '80',
            'REMOTE_ADDR' => '10.9.8.7',
            'HTTP_X_FORWARDED_HOST' => 'evil.example.com/path',
            'HTTP_X_FORWARDED_PROTO' => 'https',
        ],
        [],
        ['10.0.0.0/8']
    );

    test_assert_same(
        'internal.local',
        $trustedInvalidForwardedHost->host(),
        'Request should ignore invalid forwarded host values and fallback to server host'
    );
    $tests++;

    return $tests;
}
