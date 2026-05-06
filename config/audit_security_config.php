<?php

declare(strict_types=1);

$runtimeOverridesPath = dirname(__DIR__) . '/system/Support/RuntimeConfigOverrides.php';
if (is_file($runtimeOverridesPath)) {
    require_once $runtimeOverridesPath;
}

/** @var array<int, string> $argv */
$argv = isset($argv) && is_array($argv) ? $argv : [];
$options = parseAuditOptions($argv);

if ($options['help']) {
    printUsage();
    exit(0);
}

if ($options['errors'] !== []) {
    foreach ($options['errors'] as $error) {
        fwrite(STDERR, '[FAIL] ' . $error . "\n");
    }

    printUsage();
    exit(1);
}

$rootPath = dirname(__DIR__);
$configPath = $rootPath . '/config/config.php';
$configExamplePath = $rootPath . '/config/config.example.php';

$sourcePath = is_file($configPath) ? $configPath : $configExamplePath;
if (!is_file($sourcePath)) {
    fwrite(STDERR, "[FAIL] Nenhum arquivo de configuracao encontrado em config/config.php ou config/config.example.php.\n");
    exit(1);
}

$loaded = require $sourcePath;
if (!is_array($loaded)) {
    fwrite(STDERR, "[FAIL] Arquivo de configuracao invalido: {$sourcePath}\n");
    exit(1);
}

if (class_exists(\NosfirQuotia\System\Support\RuntimeConfigOverrides::class)) {
    /** @var class-string $runtimeClass */
    $runtimeClass = \NosfirQuotia\System\Support\RuntimeConfigOverrides::class;
    /** @var array<string, mixed> $loaded */
    $loaded = $runtimeClass::selectEnvironment($loaded);
}

$resolvedEnvironments = resolveEnvironments($loaded);
if ($resolvedEnvironments === []) {
    fwrite(STDERR, "[FAIL] Nao foi possivel resolver ambientes de configuracao.\n");
    exit(1);
}

$targetEnvironment = (string) ($options['environment'] ?? '');
if ($targetEnvironment !== '') {
    if (!isset($resolvedEnvironments[$targetEnvironment])) {
        fwrite(STDERR, "[FAIL] Ambiente solicitado em --env nao encontrado: {$targetEnvironment}\n");
        exit(1);
    }

    $resolvedEnvironments = [$targetEnvironment => $resolvedEnvironments[$targetEnvironment]];
}

$activeEnvironment = (string) ($loaded['environment'] ?? '');
$strict = (bool) ($options['strict'] ?? false);
$totalErrors = 0;
$totalWarnings = 0;
$runtimeOverrideApplied = false;

echo "=== Audit de Configuracao de Seguranca (Quotia) ===\n";
echo "Fonte: {$sourcePath}\n";
echo 'Modo: ' . ($strict ? 'estrito (avisos bloqueiam)' : 'padrao') . "\n";
if ($targetEnvironment !== '') {
    echo "Filtro de ambiente: {$targetEnvironment}\n";
}
echo "\n";

foreach ($resolvedEnvironments as $environmentName => $environmentConfig) {
    if (class_exists(\NosfirQuotia\System\Support\RuntimeConfigOverrides::class)) {
        $shouldApplyRuntimeOverrides = false;

        if ($targetEnvironment !== '' && $targetEnvironment === $environmentName) {
            $shouldApplyRuntimeOverrides = true;
        } elseif ($targetEnvironment === '' && $activeEnvironment !== '' && $activeEnvironment === $environmentName) {
            $shouldApplyRuntimeOverrides = true;
        }

        if ($shouldApplyRuntimeOverrides) {
            /** @var class-string $runtimeClass */
            $runtimeClass = \NosfirQuotia\System\Support\RuntimeConfigOverrides::class;
            $overridden = $runtimeClass::apply($environmentConfig);
            if ($overridden !== $environmentConfig) {
                $runtimeOverrideApplied = true;
            }

            $environmentConfig = $overridden;
        }
    }

    $isActive = $activeEnvironment !== '' && $activeEnvironment === $environmentName;
    $header = '[ENV] ' . $environmentName . ($isActive ? ' (ativo)' : '');
    echo $header . "\n";

    $audit = auditEnvironment($environmentName, $environmentConfig);

    if ($audit['notes'] === [] && $audit['warnings'] === [] && $audit['errors'] === []) {
        echo "  - [ok] Nenhum alerta encontrado.\n";
    }

    foreach ($audit['notes'] as $note) {
        echo '  - [info] ' . $note . "\n";
    }

    foreach ($audit['warnings'] as $warning) {
        echo '  - [warn] ' . $warning . "\n";
    }

    foreach ($audit['errors'] as $error) {
        echo '  - [erro] ' . $error . "\n";
    }

    $totalWarnings += count($audit['warnings']);
    $totalErrors += count($audit['errors']);

    echo "\n";
}

$blockingIssues = $totalErrors + ($strict ? $totalWarnings : 0);
echo "Resumo: {$totalErrors} erro(s), {$totalWarnings} aviso(s)\n";
if ($runtimeOverrideApplied) {
    echo "[INFO] Overrides de runtime por variavel de ambiente foram aplicados ao ambiente auditado.\n";
}
if ($blockingIssues > 0) {
    if ($strict && $totalWarnings > 0 && $totalErrors === 0) {
        echo "[FAIL] Modo estrito ativo: revise os avisos antes de publicar.\n";
    } else {
        echo "[FAIL] Corrija os erros antes de publicar em producao.\n";
    }

    exit(1);
}

echo "[OK] Configuracao passou sem erros bloqueantes.\n";
exit(0);

/**
 * @param array<int, string> $argv
 * @return array{strict: bool, environment: string, help: bool, errors: array<int, string>}
 */
function parseAuditOptions(array $argv): array
{
    $strict = false;
    $environment = '';
    $help = false;
    $errors = [];

    $count = count($argv);
    for ($i = 1; $i < $count; $i++) {
        $arg = trim((string) ($argv[$i] ?? ''));
        if ($arg === '') {
            continue;
        }

        if ($arg === '-h' || $arg === '--help') {
            $help = true;
            continue;
        }

        if ($arg === '--strict') {
            $strict = true;
            continue;
        }

        if (str_starts_with($arg, '--env=')) {
            $value = trim((string) substr($arg, strlen('--env=')));
            if ($value === '') {
                $errors[] = 'Valor vazio para --env.';
                continue;
            }

            $environment = $value;
            continue;
        }

        if ($arg === '--env') {
            $next = trim((string) ($argv[$i + 1] ?? ''));
            if ($next === '') {
                $errors[] = 'A opcao --env exige um valor.';
                continue;
            }

            $environment = $next;
            $i++;
            continue;
        }

        $errors[] = 'Opcao desconhecida: ' . $arg;
    }

    return [
        'strict' => $strict,
        'environment' => $environment,
        'help' => $help,
        'errors' => $errors,
    ];
}

function printUsage(): void
{
    echo "Uso:\n";
    echo "  php config/audit_security_config.php [--env=<nome>] [--strict]\n\n";
    echo "Opcoes:\n";
    echo "  --env=<nome>  Audita apenas um ambiente resolvido do config.\n";
    echo "  --strict      Avisos passam a bloquear (exit 1).\n";
    echo "  -h, --help    Exibe esta ajuda.\n";
}

/**
 * @param array<string, mixed> $config
 * @return array<string, array<string, mixed>>
 */
function resolveEnvironments(array $config): array
{
    $environments = $config['environments'] ?? null;
    if (!is_array($environments) || $environments === []) {
        $name = trim((string) ($config['environment'] ?? 'default'));
        if ($name === '') {
            $name = 'default';
        }

        return [$name => $config];
    }

    $base = $config;
    unset($base['environments']);

    $resolved = [];
    foreach ($environments as $name => $environmentConfig) {
        if (!is_string($name) || trim($name) === '') {
            continue;
        }

        $snapshot = $base;
        if (is_array($environmentConfig)) {
            $snapshot = array_replace_recursive($snapshot, $environmentConfig);
        }

        $resolved[$name] = $snapshot;
    }

    return $resolved;
}

/**
 * @param array<string, mixed> $environmentConfig
 * @return array{errors: array<int, string>, warnings: array<int, string>, notes: array<int, string>}
 */
function auditEnvironment(string $environmentName, array $environmentConfig): array
{
    $errors = [];
    $warnings = [];
    $notes = [];

    $installed = (bool) ($environmentConfig['installed'] ?? false);
    $isProductionLike = isLikelyProductionEnvironment($environmentName, $installed);
    $appUrlRaw = trim((string) ($environmentConfig['app_url'] ?? ''));

    if ($installed && $appUrlRaw === '') {
        $errors[] = 'Ambiente instalado sem app_url definida.';
    }

    $appUrlHost = '';
    $appUrlScheme = '';
    if ($appUrlRaw !== '') {
        $appUrlValidation = validateAppUrl($appUrlRaw);
        if ($appUrlValidation['ok']) {
            $appUrlHost = (string) ($appUrlValidation['host'] ?? '');
            $appUrlScheme = (string) ($appUrlValidation['scheme'] ?? '');
            $notes[] = 'app_url valida: ' . $appUrlRaw;

            if ($isProductionLike && $appUrlScheme !== 'https') {
                $warnings[] = 'Ambiente de producao deve preferir app_url com HTTPS.';
            }

            if ($isProductionLike && isLocalOrPrivateHost($appUrlHost)) {
                $warnings[] = 'app_url aponta para host local/privado (' . $appUrlHost . '). Revise antes de publicar.';
            }
        } else {
            $errors[] = 'app_url invalida: ' . $appUrlRaw;
        }
    }

    $trustedProxyValues = normalizeStringList(
        $environmentConfig['security']['trusted_proxies'] ?? ($environmentConfig['trusted_proxies'] ?? [])
    );

    $normalizedTrustedProxies = [];
    foreach ($trustedProxyValues as $proxyEntry) {
        $proxyValidation = validateTrustedProxyEntry($proxyEntry);
        if (!$proxyValidation['ok']) {
            $errors[] = 'Entrada invalida em security.trusted_proxies: ' . $proxyEntry;
            continue;
        }

        $normalizedTrustedProxies[] = (string) ($proxyValidation['normalized'] ?? $proxyEntry);
    }

    if ($normalizedTrustedProxies !== []) {
        $notes[] = 'security.trusted_proxies configurado com ' . count($normalizedTrustedProxies) . ' entrada(s).';
    } elseif ($isProductionLike) {
        $warnings[] = 'security.trusted_proxies esta vazio. Se houver reverse proxy, configure IP/CIDR confiavel.';
    }

    $trustedHostsRaw = normalizeStringList(
        $environmentConfig['security']['trusted_hosts'] ?? ($environmentConfig['allowed_hosts'] ?? [])
    );
    $normalizedTrustedHosts = [];
    foreach ($trustedHostsRaw as $hostEntry) {
        $normalizedHost = normalizeComparableHost($hostEntry);
        if ($normalizedHost === '') {
            $errors[] = 'Entrada invalida em security.trusted_hosts/allowed_hosts: ' . $hostEntry;
            continue;
        }

        $normalizedTrustedHosts[$normalizedHost] = $normalizedHost;
    }

    if ($normalizedTrustedHosts !== []) {
        $notes[] = 'trusted_hosts/allowed_hosts com ' . count($normalizedTrustedHosts) . ' host(s) valido(s).';
    }

    if ($appUrlHost !== '' && $normalizedTrustedHosts !== [] && !isset($normalizedTrustedHosts[$appUrlHost])) {
        $warnings[] = 'Host de app_url (' . $appUrlHost . ') nao esta em trusted_hosts/allowed_hosts.';
    }

    if ($isProductionLike && $normalizedTrustedHosts === [] && $appUrlHost === '') {
        $warnings[] = 'Sem trusted_hosts/allowed_hosts e sem host canonico de app_url para reforcar whitelist.';
    }

    $monitoringWindowHours = (int) ($environmentConfig['security']['monitoring']['window_hours'] ?? 24);
    if ($monitoringWindowHours < 1 || $monitoringWindowHours > 168) {
        $errors[] = 'security.monitoring.window_hours deve ficar entre 1 e 168.';
    }

    $monitoringBucketMinutes = (int) ($environmentConfig['security']['monitoring']['bucket_minutes'] ?? 60);
    if ($monitoringBucketMinutes < 5 || $monitoringBucketMinutes > 1440) {
        $errors[] = 'security.monitoring.bucket_minutes deve ficar entre 5 e 1440.';
    }

    $monitoringThresholdsRaw = $environmentConfig['security']['monitoring']['thresholds'] ?? [];
    if (!is_array($monitoringThresholdsRaw)) {
        $errors[] = 'security.monitoring.thresholds deve ser um array.';
    } else {
        foreach ($monitoringThresholdsRaw as $key => $value) {
            $name = trim((string) $key);
            if ($name === '') {
                $errors[] = 'security.monitoring.thresholds contem chave vazia.';
                continue;
            }

            if (!is_numeric($value) || (int) $value < 1) {
                $errors[] = 'Threshold invalido para ' . $name . ' (use inteiro >= 1).';
            }
        }

        $requiredMonitoringKeys = [
            'csrf_rejected',
            'host_header_rejected',
            'admin_login_blocked',
            'client_login_blocked',
        ];
        foreach ($requiredMonitoringKeys as $requiredKey) {
            if (!array_key_exists($requiredKey, $monitoringThresholdsRaw)) {
                $warnings[] = 'Threshold ausente para security.monitoring.thresholds.' . $requiredKey . '.';
            }
        }
    }

    $db = $environmentConfig['db'] ?? [];
    if (is_array($db)) {
        $dbHost = trim((string) ($db['host'] ?? ''));
        $dbName = trim((string) ($db['database'] ?? ''));
        if ($installed && ($dbHost === '' || $dbName === '')) {
            $errors[] = 'Ambiente instalado sem configuracao de banco completa (host/database).';
        }

        $dbUser = strtolower(trim((string) ($db['username'] ?? '')));
        $dbPassword = (string) ($db['password'] ?? '');
        if ($isProductionLike && $dbUser === 'root') {
            $warnings[] = 'Banco em producao com usuario root. Prefira usuario dedicado de menor privilegio.';
        }

        if ($isProductionLike && trim($dbPassword) === '') {
            $warnings[] = 'Banco em producao sem senha configurada.';
        }
    }

    return [
        'errors' => $errors,
        'warnings' => $warnings,
        'notes' => $notes,
    ];
}

/**
 * @return array{ok: bool, host?: string, scheme?: string}
 */
function validateAppUrl(string $url): array
{
    $url = trim($url);
    if ($url === '') {
        return ['ok' => false];
    }

    $parts = parse_url($url);
    if (!is_array($parts)) {
        return ['ok' => false];
    }

    $scheme = strtolower((string) ($parts['scheme'] ?? ''));
    $host = trim((string) ($parts['host'] ?? ''));
    $port = $parts['port'] ?? null;

    if (!in_array($scheme, ['http', 'https'], true) || $host === '') {
        return ['ok' => false];
    }

    if (isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment'])) {
        return ['ok' => false];
    }

    if ($port !== null && (!is_int($port) || $port < 1 || $port > 65535)) {
        return ['ok' => false];
    }

    $normalizedHost = normalizeComparableHost($host);
    if ($normalizedHost === '') {
        return ['ok' => false];
    }

    return ['ok' => true, 'host' => $normalizedHost, 'scheme' => $scheme];
}

/**
 * @return array{ok: bool, normalized?: string}
 */
function validateTrustedProxyEntry(string $value): array
{
    $value = trim($value);
    if ($value === '') {
        return ['ok' => false];
    }

    if (!str_contains($value, '/')) {
        return filter_var($value, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6) !== false
            ? ['ok' => true, 'normalized' => $value]
            : ['ok' => false];
    }

    [$networkRaw, $maskRaw] = explode('/', $value, 2);
    $network = trim($networkRaw);
    $maskRaw = trim($maskRaw);

    if ($network === '' || $maskRaw === '' || !ctype_digit($maskRaw)) {
        return ['ok' => false];
    }

    $isIpv4 = filter_var($network, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false;
    $isIpv6 = filter_var($network, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) !== false;
    if (!$isIpv4 && !$isIpv6) {
        return ['ok' => false];
    }

    $mask = (int) $maskRaw;
    $maxMask = $isIpv6 ? 128 : 32;
    if ($mask < 0 || $mask > $maxMask) {
        return ['ok' => false];
    }

    return ['ok' => true, 'normalized' => $network . '/' . $mask];
}

/**
 * @return array<int, string>
 */
function normalizeStringList(mixed $value): array
{
    $values = [];

    if (is_string($value)) {
        $parts = preg_split('/[\r\n,;]+/', $value) ?: [];
        foreach ($parts as $part) {
            $candidate = trim((string) $part);
            if ($candidate !== '') {
                $values[] = $candidate;
            }
        }

        return array_values(array_unique($values));
    }

    if (!is_array($value)) {
        return [];
    }

    foreach ($value as $item) {
        if (is_scalar($item) || (is_object($item) && method_exists($item, '__toString'))) {
            $candidate = trim((string) $item);
            if ($candidate !== '') {
                $values[] = $candidate;
            }
        }
    }

    return array_values(array_unique($values));
}

function normalizeComparableHost(string $value): string
{
    $value = trim(strtolower($value));
    if ($value === '') {
        return '';
    }

    if (preg_match('/[\s\/\\\\]/', $value) === 1) {
        return '';
    }

    $source = str_starts_with($value, 'http://') || str_starts_with($value, 'https://')
        ? $value
        : 'http://' . $value;

    $parts = parse_url($source);
    if (!is_array($parts) || !isset($parts['host'])) {
        return '';
    }

    if (isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment'])) {
        return '';
    }

    $host = strtolower(trim((string) $parts['host'], '.'));
    if ($host === '') {
        return '';
    }

    if ($host === 'localhost') {
        return $host;
    }

    if (filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6) !== false) {
        return $host;
    }

    if (filter_var($host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME) !== false) {
        return $host;
    }

    return '';
}

function isLikelyProductionEnvironment(string $name, bool $installed): bool
{
    $name = strtolower(trim($name));
    if (in_array($name, ['online', 'prod', 'production'], true)) {
        return true;
    }

    if (in_array($name, ['local', 'dev', 'development', 'test', 'testing', 'staging', 'homolog', 'qa'], true)) {
        return false;
    }

    return $installed;
}

function isLocalOrPrivateHost(string $host): bool
{
    $host = strtolower(trim($host));
    if ($host === '') {
        return false;
    }

    if ($host === 'localhost') {
        return true;
    }

    $ip = filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6);
    if ($ip !== false) {
        return filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) === false;
    }

    $localSuffixes = ['.local', '.internal', '.lan', '.home.arpa', '.test', '.example'];
    foreach ($localSuffixes as $suffix) {
        if (str_ends_with($host, $suffix)) {
            return true;
        }
    }

    return false;
}
