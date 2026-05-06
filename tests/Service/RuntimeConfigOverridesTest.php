<?php

declare(strict_types=1);

use NosfirQuotia\System\Support\RuntimeConfigOverrides;

function run_runtime_config_overrides_tests(): int
{
    $tests = 0;

    $base = [
        'environment' => 'online',
        'app_url' => 'http://localhost',
        'installed' => false,
        'db' => [
            'host' => '127.0.0.1',
            'port' => 3306,
            'database' => 'quotia',
            'username' => 'root',
            'password' => '',
        ],
        'mail' => [
            'enabled' => true,
            'from_name' => 'Nosfir Quotia',
            'from_email' => 'no-reply@localhost',
        ],
        'security' => [
            'trusted_hosts' => [],
            'trusted_proxies' => [],
            'monitoring' => [
                'window_hours' => 24,
                'bucket_minutes' => 60,
                'thresholds' => [
                    'csrf_rejected' => 10,
                    'host_header_rejected' => 3,
                    'admin_login_blocked' => 3,
                    'client_login_blocked' => 3,
                ],
            ],
        ],
        'environments' => [
            'online' => ['installed' => true],
            'local' => ['installed' => true],
        ],
    ];

    $selected = RuntimeConfigOverrides::selectEnvironment(
        $base,
        ['NQ_ENVIRONMENT' => 'local']
    );
    test_assert_same('local', (string) ($selected['environment'] ?? ''), 'RuntimeConfigOverrides should select valid environment');
    $tests++;

    $ignored = RuntimeConfigOverrides::selectEnvironment(
        $base,
        ['NQ_ENVIRONMENT' => 'inexistente']
    );
    test_assert_same('online', (string) ($ignored['environment'] ?? ''), 'RuntimeConfigOverrides should ignore unknown environment');
    $tests++;

    $overridden = RuntimeConfigOverrides::apply(
        $base,
        [
            'NQ_APP_URL' => 'https://quotia.example.com',
            'NQ_INSTALLED' => 'true',
            'NQ_SECURITY_TRUSTED_HOSTS' => "quotia.example.com,www.quotia.example.com",
            'NQ_SECURITY_TRUSTED_PROXIES' => "10.0.0.0/8;192.168.0.0/16",
            'NQ_SECURITY_MONITORING_WINDOW_HOURS' => '48',
            'NQ_SECURITY_MONITORING_BUCKET_MINUTES' => '30',
            'NQ_SECURITY_THRESHOLD_CSRF_REJECTED' => '25',
            'NQ_SECURITY_THRESHOLD_HOST_HEADER_REJECTED' => '9',
            'NQ_SECURITY_THRESHOLD_ADMIN_LOGIN_BLOCKED' => '7',
            'NQ_SECURITY_THRESHOLD_CLIENT_LOGIN_BLOCKED' => '6',
            'NQ_DB_HOST' => 'db.internal',
            'NQ_DB_PORT' => '3307',
            'NQ_DB_DATABASE' => 'quotia_prod',
            'NQ_DB_USERNAME' => 'quotia_app',
            'NQ_DB_PASSWORD' => 'super-secret',
            'NQ_MAIL_ENABLED' => '0',
            'NQ_MAIL_FROM_NAME' => 'Quotia Producao',
            'NQ_MAIL_FROM_EMAIL' => 'noreply@quotia.example.com',
        ]
    );

    test_assert_same('https://quotia.example.com', (string) ($overridden['app_url'] ?? ''), 'RuntimeConfigOverrides should override app_url');
    test_assert_same(true, (bool) ($overridden['installed'] ?? false), 'RuntimeConfigOverrides should override installed flag');
    test_assert_same(['quotia.example.com', 'www.quotia.example.com'], (array) ($overridden['security']['trusted_hosts'] ?? []), 'RuntimeConfigOverrides should parse trusted hosts');
    test_assert_same(['10.0.0.0/8', '192.168.0.0/16'], (array) ($overridden['security']['trusted_proxies'] ?? []), 'RuntimeConfigOverrides should parse trusted proxies');
    test_assert_same(48, (int) ($overridden['security']['monitoring']['window_hours'] ?? 0), 'RuntimeConfigOverrides should override monitoring window');
    test_assert_same(30, (int) ($overridden['security']['monitoring']['bucket_minutes'] ?? 0), 'RuntimeConfigOverrides should override monitoring bucket');
    test_assert_same(25, (int) ($overridden['security']['monitoring']['thresholds']['csrf_rejected'] ?? 0), 'RuntimeConfigOverrides should override csrf threshold');
    test_assert_same(9, (int) ($overridden['security']['monitoring']['thresholds']['host_header_rejected'] ?? 0), 'RuntimeConfigOverrides should override host threshold');
    test_assert_same(7, (int) ($overridden['security']['monitoring']['thresholds']['admin_login_blocked'] ?? 0), 'RuntimeConfigOverrides should override admin threshold');
    test_assert_same(6, (int) ($overridden['security']['monitoring']['thresholds']['client_login_blocked'] ?? 0), 'RuntimeConfigOverrides should override client threshold');
    test_assert_same('db.internal', (string) ($overridden['db']['host'] ?? ''), 'RuntimeConfigOverrides should override db host');
    test_assert_same(3307, (int) ($overridden['db']['port'] ?? 0), 'RuntimeConfigOverrides should override db port');
    test_assert_same('quotia_prod', (string) ($overridden['db']['database'] ?? ''), 'RuntimeConfigOverrides should override db database');
    test_assert_same('quotia_app', (string) ($overridden['db']['username'] ?? ''), 'RuntimeConfigOverrides should override db username');
    test_assert_same('super-secret', (string) ($overridden['db']['password'] ?? ''), 'RuntimeConfigOverrides should override db password');
    test_assert_same(false, (bool) ($overridden['mail']['enabled'] ?? true), 'RuntimeConfigOverrides should override mail enabled');
    test_assert_same('Quotia Producao', (string) ($overridden['mail']['from_name'] ?? ''), 'RuntimeConfigOverrides should override mail from_name');
    test_assert_same('noreply@quotia.example.com', (string) ($overridden['mail']['from_email'] ?? ''), 'RuntimeConfigOverrides should override mail from_email');
    $tests += 18;

    $invalid = RuntimeConfigOverrides::apply(
        $base,
        [
            'NQ_DB_PORT' => 'abc',
            'NQ_SECURITY_MONITORING_WINDOW_HOURS' => '999',
            'NQ_SECURITY_MONITORING_BUCKET_MINUTES' => '2',
            'NQ_SECURITY_THRESHOLD_CSRF_REJECTED' => '-1',
            'NQ_MAIL_ENABLED' => 'talvez',
        ]
    );

    test_assert_same(3306, (int) ($invalid['db']['port'] ?? 0), 'RuntimeConfigOverrides should ignore invalid db port');
    test_assert_same(24, (int) ($invalid['security']['monitoring']['window_hours'] ?? 0), 'RuntimeConfigOverrides should ignore invalid monitoring window');
    test_assert_same(60, (int) ($invalid['security']['monitoring']['bucket_minutes'] ?? 0), 'RuntimeConfigOverrides should ignore invalid monitoring bucket');
    test_assert_same(10, (int) ($invalid['security']['monitoring']['thresholds']['csrf_rejected'] ?? 0), 'RuntimeConfigOverrides should ignore invalid threshold');
    test_assert_same(true, (bool) ($invalid['mail']['enabled'] ?? false), 'RuntimeConfigOverrides should ignore invalid mail enabled');
    $tests += 5;

    return $tests;
}
