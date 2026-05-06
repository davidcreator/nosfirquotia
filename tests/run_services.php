<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/Service/Fakes/FakeQuoteRepository.php';
require_once __DIR__ . '/Service/Fakes/FakeQuoteReportMailer.php';
require_once __DIR__ . '/Service/Fakes/FakeQuoteRequestRepository.php';
require_once __DIR__ . '/Service/QuoteReportServiceTest.php';
require_once __DIR__ . '/Service/TaxSettingsServiceTest.php';
require_once __DIR__ . '/Service/QuoteRequestServiceTest.php';
require_once __DIR__ . '/Service/AdminUserValidationServiceTest.php';
require_once __DIR__ . '/Service/CategoryValidationServiceTest.php';
require_once __DIR__ . '/Service/SecurityEventLoggerTest.php';
require_once __DIR__ . '/Service/SecurityEventMonitoringServiceTest.php';
require_once __DIR__ . '/Service/RequestTrustedProxyTest.php';
require_once __DIR__ . '/Service/RuntimeConfigOverridesTest.php';

$total = 0;

try {
    $total += run_quote_report_service_tests();
    $total += run_tax_settings_service_tests();
    $total += run_quote_request_service_tests();
    $total += run_admin_user_validation_service_tests();
    $total += run_category_validation_service_tests();
    $total += run_security_event_logger_tests();
    $total += run_security_event_monitoring_service_tests();
    $total += run_request_trusted_proxy_tests();
    $total += run_runtime_config_overrides_tests();

    echo '[OK] Service tests passed: ' . $total . PHP_EOL;
    exit(0);
} catch (Throwable $exception) {
    echo '[FAIL] ' . $exception->getMessage() . PHP_EOL;
    exit(1);
}
