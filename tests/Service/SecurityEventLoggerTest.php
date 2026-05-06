<?php

declare(strict_types=1);

use NosfirQuotia\System\Library\SecurityEventLogger;

function run_security_event_logger_tests(): int
{
    $tests = 0;

    $tempRoot = rtrim(sys_get_temp_dir(), '/\\') . '/quotia-security-log-' . uniqid('', true);
    @mkdir($tempRoot, 0775, true);

    try {
        $redactionDir = $tempRoot . '/redaction';
        @mkdir($redactionDir, 0775, true);
        $logger = new SecurityEventLogger($redactionDir);
        $logger->warning(
            'csrf_rejected',
            [
                'ip' => '127.0.0.1',
                'reason' => 'token_invalid_or_missing',
                'password' => 'abc123',
                'token' => 'abc',
                'nested' => [
                    'cookie_header' => 'session=xyz',
                    'safe_field' => 'ok',
                ],
            ]
        );

        $logPath = $redactionDir . '/security-events.log';
        test_assert_true(is_file($logPath), 'SecurityEventLogger should create security-events.log');
        $tests++;

        $lines = file($logPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        test_assert_true(is_array($lines) && count($lines) >= 1, 'SecurityEventLogger should append at least one line');
        $tests++;

        $payload = json_decode((string) ($lines[0] ?? ''), true);
        test_assert_true(is_array($payload), 'SecurityEventLogger line should be valid JSON');
        test_assert_same('csrf_rejected', (string) ($payload['event'] ?? ''), 'SecurityEventLogger should keep event name');
        test_assert_same('[redacted]', (string) (($payload['context']['password'] ?? '')), 'password should be redacted');
        test_assert_same('[redacted]', (string) (($payload['context']['token'] ?? '')), 'token should be redacted');
        test_assert_same('[redacted]', (string) (($payload['context']['nested']['cookie_header'] ?? '')), 'cookie should be redacted');
        test_assert_same('ok', (string) (($payload['context']['nested']['safe_field'] ?? '')), 'safe field should be kept');
        $tests += 6;

        $rotationDir = $tempRoot . '/rotation';
        @mkdir($rotationDir, 0775, true);
        $rotationLogger = new SecurityEventLogger($rotationDir, 450, 30, 10);
        for ($i = 0; $i < 12; $i++) {
            $rotationLogger->info(
                'rotation_test',
                ['message' => str_repeat('x', 120), 'index' => $i]
            );
        }

        test_assert_true(
            is_file($rotationDir . '/security-events.log'),
            'SecurityEventLogger should keep active log after rotation'
        );
        $tests++;
        test_assert_true(
            count(security_archived_logs($rotationDir)) >= 1,
            'SecurityEventLogger should rotate archives when max size is reached'
        );
        $tests++;

        $dailyDir = $tempRoot . '/daily-rollover';
        @mkdir($dailyDir, 0775, true);
        $dailyActive = $dailyDir . '/security-events.log';
        file_put_contents($dailyActive, "{\"seed\":true}\n");
        @touch($dailyActive, time() - 86400);
        $dailyLogger = new SecurityEventLogger($dailyDir, 4096, 30, 10);
        $dailyLogger->info('daily_rollover', ['ok' => true]);

        test_assert_true(
            count(security_archived_logs($dailyDir)) >= 1,
            'SecurityEventLogger should rotate active file when day changes'
        );
        $tests++;

        $retentionDir = $tempRoot . '/retention';
        @mkdir($retentionDir, 0775, true);
        $oldArchive = $retentionDir . '/security-events-20000101-000000.log';
        file_put_contents($oldArchive, "{}\n");
        @touch($oldArchive, time() - (5 * 86400));
        $retentionLogger = new SecurityEventLogger($retentionDir, 2048, 1, 10);
        $retentionLogger->info('retention_check', ['ok' => true]);

        test_assert_true(!is_file($oldArchive), 'SecurityEventLogger should remove archives older than retention days');
        $tests++;

        $countLimitDir = $tempRoot . '/count-limit';
        @mkdir($countLimitDir, 0775, true);
        for ($i = 1; $i <= 5; $i++) {
            $archive = $countLimitDir . '/security-events-20260101-00000' . $i . '.log';
            file_put_contents($archive, "{}\n");
            @touch($archive, time() - (100 - $i));
        }
        $countLogger = new SecurityEventLogger($countLimitDir, 2048, 30, 2);
        $countLogger->warning('count_limit_check', ['ok' => true]);

        test_assert_true(
            count(security_archived_logs($countLimitDir)) <= 2,
            'SecurityEventLogger should keep only max archive file count'
        );
        $tests++;
    } finally {
        delete_tree($tempRoot);
    }

    return $tests;
}

/**
 * @return array<int, string>
 */
function security_archived_logs(string $dir): array
{
    $files = glob(rtrim($dir, '/\\') . '/security-events-*.log');
    if (!is_array($files)) {
        return [];
    }

    return array_values(array_filter($files, static fn (string $path): bool => is_file($path)));
}

function delete_tree(string $path): void
{
    if (!is_dir($path)) {
        if (is_file($path)) {
            @unlink($path);
        }

        return;
    }

    $items = scandir($path);
    if (!is_array($items)) {
        return;
    }

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }

        $fullPath = $path . DIRECTORY_SEPARATOR . $item;
        if (is_dir($fullPath)) {
            delete_tree($fullPath);
            continue;
        }

        @unlink($fullPath);
    }

    @rmdir($path);
}
