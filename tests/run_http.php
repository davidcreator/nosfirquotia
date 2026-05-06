<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/Http/CsrfIntegrationTest.php';

$total = 0;

try {
    $total += run_http_csrf_integration_tests();
    echo '[OK] HTTP integration tests passed: ' . $total . PHP_EOL;
    exit(0);
} catch (Throwable $exception) {
    echo '[FAIL] ' . $exception->getMessage() . PHP_EOL;
    exit(1);
}

