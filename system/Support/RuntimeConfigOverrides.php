<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Support;

final class RuntimeConfigOverrides
{
    /**
     * @param array<string, mixed> $config
     * @param array<string, string|null>|null $env
     * @return array<string, mixed>
     */
    public static function selectEnvironment(array $config, ?array $env = null): array
    {
        $environment = trim((string) self::envValue('NQ_ENVIRONMENT', $env, null));
        if ($environment === '') {
            return $config;
        }

        $environments = $config['environments'] ?? null;
        if (!is_array($environments) || !isset($environments[$environment]) || !is_array($environments[$environment])) {
            return $config;
        }

        $config['environment'] = $environment;

        return $config;
    }

    /**
     * @param array<string, mixed> $config
     * @param array<string, string|null>|null $env
     * @return array<string, mixed>
     */
    public static function apply(array $config, ?array $env = null): array
    {
        $appUrl = self::envValue('NQ_APP_URL', $env, null);
        if ($appUrl !== null) {
            $config['app_url'] = trim($appUrl);
        }

        $installed = self::envBool('NQ_INSTALLED', $env);
        if ($installed !== null) {
            $config['installed'] = $installed;
        }

        $trustedHosts = self::envList('NQ_SECURITY_TRUSTED_HOSTS', $env);
        if ($trustedHosts !== null) {
            $config['security']['trusted_hosts'] = $trustedHosts;
        }

        $trustedProxies = self::envList('NQ_SECURITY_TRUSTED_PROXIES', $env);
        if ($trustedProxies !== null) {
            $config['security']['trusted_proxies'] = $trustedProxies;
        }

        $windowHours = self::envInt('NQ_SECURITY_MONITORING_WINDOW_HOURS', $env);
        if ($windowHours !== null && $windowHours >= 1 && $windowHours <= 168) {
            $config['security']['monitoring']['window_hours'] = $windowHours;
        }

        $bucketMinutes = self::envInt('NQ_SECURITY_MONITORING_BUCKET_MINUTES', $env);
        if ($bucketMinutes !== null && $bucketMinutes >= 5 && $bucketMinutes <= 1440) {
            $config['security']['monitoring']['bucket_minutes'] = $bucketMinutes;
        }

        $thresholdKeys = [
            'csrf_rejected' => 'NQ_SECURITY_THRESHOLD_CSRF_REJECTED',
            'host_header_rejected' => 'NQ_SECURITY_THRESHOLD_HOST_HEADER_REJECTED',
            'admin_login_blocked' => 'NQ_SECURITY_THRESHOLD_ADMIN_LOGIN_BLOCKED',
            'client_login_blocked' => 'NQ_SECURITY_THRESHOLD_CLIENT_LOGIN_BLOCKED',
        ];
        foreach ($thresholdKeys as $thresholdKey => $envKey) {
            $thresholdValue = self::envInt($envKey, $env);
            if ($thresholdValue !== null && $thresholdValue >= 1) {
                $config['security']['monitoring']['thresholds'][$thresholdKey] = $thresholdValue;
            }
        }

        $dbHost = self::envValue('NQ_DB_HOST', $env, null);
        if ($dbHost !== null) {
            $config['db']['host'] = trim($dbHost);
        }

        $dbPort = self::envInt('NQ_DB_PORT', $env);
        if ($dbPort !== null && $dbPort >= 1 && $dbPort <= 65535) {
            $config['db']['port'] = $dbPort;
        }

        $dbDatabase = self::envValue('NQ_DB_DATABASE', $env, null);
        if ($dbDatabase !== null) {
            $config['db']['database'] = trim($dbDatabase);
        }

        $dbUsername = self::envValue('NQ_DB_USERNAME', $env, null);
        if ($dbUsername !== null) {
            $config['db']['username'] = $dbUsername;
        }

        $dbPassword = self::envValue('NQ_DB_PASSWORD', $env, null);
        if ($dbPassword !== null) {
            $config['db']['password'] = $dbPassword;
        }

        $mailEnabled = self::envBool('NQ_MAIL_ENABLED', $env);
        if ($mailEnabled !== null) {
            $config['mail']['enabled'] = $mailEnabled;
        }

        $mailFromName = self::envValue('NQ_MAIL_FROM_NAME', $env, null);
        if ($mailFromName !== null) {
            $config['mail']['from_name'] = trim($mailFromName);
        }

        $mailFromEmail = self::envValue('NQ_MAIL_FROM_EMAIL', $env, null);
        if ($mailFromEmail !== null) {
            $config['mail']['from_email'] = trim($mailFromEmail);
        }

        return $config;
    }

    /**
     * @param array<string, string|null>|null $env
     */
    private static function envValue(string $key, ?array $env, ?string $default): ?string
    {
        if ($env !== null && array_key_exists($key, $env)) {
            $value = $env[$key];
            return $value === null ? null : (string) $value;
        }

        $value = getenv($key);
        if ($value !== false) {
            return (string) $value;
        }

        if (isset($_ENV[$key])) {
            return (string) $_ENV[$key];
        }

        if (isset($_SERVER[$key])) {
            return (string) $_SERVER[$key];
        }

        return $default;
    }

    /**
     * @param array<string, string|null>|null $env
     */
    private static function envBool(string $key, ?array $env): ?bool
    {
        $raw = self::envValue($key, $env, null);
        if ($raw === null) {
            return null;
        }

        $normalized = strtolower(trim($raw));
        if ($normalized === '') {
            return null;
        }

        if (in_array($normalized, ['1', 'true', 'on', 'yes', 'sim'], true)) {
            return true;
        }

        if (in_array($normalized, ['0', 'false', 'off', 'no', 'nao'], true)) {
            return false;
        }

        return null;
    }

    /**
     * @param array<string, string|null>|null $env
     */
    private static function envInt(string $key, ?array $env): ?int
    {
        $raw = self::envValue($key, $env, null);
        if ($raw === null) {
            return null;
        }

        $raw = trim($raw);
        if ($raw === '' || !preg_match('/^-?\d+$/', $raw)) {
            return null;
        }

        return (int) $raw;
    }

    /**
     * @param array<string, string|null>|null $env
     * @return array<int, string>|null
     */
    private static function envList(string $key, ?array $env): ?array
    {
        $raw = self::envValue($key, $env, null);
        if ($raw === null) {
            return null;
        }

        $parts = preg_split('/[\r\n,;]+/', $raw) ?: [];
        $values = [];
        foreach ($parts as $part) {
            $candidate = trim((string) $part);
            if ($candidate !== '') {
                $values[$candidate] = $candidate;
            }
        }

        return array_values($values);
    }
}
