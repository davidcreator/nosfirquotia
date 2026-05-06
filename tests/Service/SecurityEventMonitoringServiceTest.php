<?php

declare(strict_types=1);

use NosfirQuotia\Admin\Service\SecurityEventMonitoringService;

function run_security_event_monitoring_service_tests(): int
{
    $tests = 0;

    $tmpDir = sys_get_temp_dir() . '/quotia-security-monitor-' . uniqid('', true);
    $created = @mkdir($tmpDir, 0775, true);
    test_assert_true($created || is_dir($tmpDir), 'SecurityEventMonitoringService test should create temp dir');
    $logPath = $tmpDir . '/security-events.log';

    $now = time();
    $events = [
        ['timestamp' => date('c', $now - 300), 'event' => 'csrf_rejected'],
        ['timestamp' => date('c', $now - 250), 'event' => 'csrf_rejected'],
        ['timestamp' => date('c', $now - 200), 'event' => 'csrf_rejected'],
        ['timestamp' => date('c', $now - 180), 'event' => 'admin_login_blocked'],
        ['timestamp' => date('c', $now - 100), 'event' => 'host_header_rejected'],
        ['timestamp' => date('c', $now - 48 * 3600), 'event' => 'csrf_rejected'],
    ];

    $lines = [];
    foreach ($events as $event) {
        $encoded = json_encode(
            [
                'timestamp' => $event['timestamp'],
                'level' => 'warning',
                'event' => $event['event'],
                'context' => [],
            ],
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );
        if (is_string($encoded)) {
            $lines[] = $encoded;
        }
    }

    $bytes = @file_put_contents($logPath, implode(PHP_EOL, $lines) . PHP_EOL);
    test_assert_true($bytes !== false, 'SecurityEventMonitoringService test should write fixture log');

    $service = new SecurityEventMonitoringService(
        $logPath,
        [
            'csrf_rejected' => 3,
            'host_header_rejected' => 1,
            'admin_login_blocked' => 2,
            'client_login_blocked' => 1,
        ]
    );

    $summary = $service->summarize(24);

    test_assert_same(24, (int) ($summary['window_hours'] ?? 0), 'SecurityEventMonitoringService should keep requested window');
    test_assert_true((int) ($summary['total_events'] ?? 0) >= 5, 'SecurityEventMonitoringService should count window events');

    $counts = $summary['counts'] ?? [];
    test_assert_same(3, (int) ($counts['csrf_rejected'] ?? 0), 'SecurityEventMonitoringService should count csrf_rejected');
    test_assert_same(1, (int) ($counts['host_header_rejected'] ?? 0), 'SecurityEventMonitoringService should count host_header_rejected');
    test_assert_same(1, (int) ($counts['admin_login_blocked'] ?? 0), 'SecurityEventMonitoringService should count admin_login_blocked');
    test_assert_same(0, (int) ($counts['client_login_blocked'] ?? 0), 'SecurityEventMonitoringService should count client_login_blocked');
    $tests += 6;

    $alerts = $summary['alerts'] ?? [];
    test_assert_true(is_array($alerts) && count($alerts) >= 2, 'SecurityEventMonitoringService should trigger expected alerts');
    test_assert_true(($summary['healthy'] ?? true) === false, 'SecurityEventMonitoringService should mark unhealthy when alerts exist');
    $tests += 2;

    $trend = $service->timeseries(24, 60);
    test_assert_same(24, (int) ($trend['window_hours'] ?? 0), 'SecurityEventMonitoringService timeseries should keep window');
    test_assert_same(60, (int) ($trend['bucket_minutes'] ?? 0), 'SecurityEventMonitoringService timeseries should keep bucket minutes');
    $trendEvents = is_array($trend['events'] ?? null) ? $trend['events'] : [];
    test_assert_true(in_array('csrf_rejected', $trendEvents, true), 'SecurityEventMonitoringService timeseries should include tracked events');
    $trendBuckets = is_array($trend['buckets'] ?? null) ? $trend['buckets'] : [];
    test_assert_true($trendBuckets !== [], 'SecurityEventMonitoringService timeseries should create buckets');

    $csrfTrendTotal = 0;
    foreach ($trendBuckets as $bucket) {
        if (!is_array($bucket)) {
            continue;
        }

        $bucketCounts = is_array($bucket['counts'] ?? null) ? $bucket['counts'] : [];
        $csrfTrendTotal += (int) ($bucketCounts['csrf_rejected'] ?? 0);
    }

    test_assert_same(3, $csrfTrendTotal, 'SecurityEventMonitoringService timeseries should aggregate csrf_rejected counts');
    $tests += 5;

    if (is_file($logPath)) {
        @unlink($logPath);
    }
    if (is_dir($tmpDir)) {
        @rmdir($tmpDir);
    }

    return $tests;
}
