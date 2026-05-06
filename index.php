<?php

declare(strict_types=1);

define('NQ_ROOT', __DIR__);

$autoload = NQ_ROOT . '/vendor/autoload.php';

if (!is_file($autoload)) {
    http_response_code(500);
    echo 'Dependencias ausentes. Execute: composer install';
    exit;
}

require $autoload;

use NosfirQuotia\System\Support\RuntimeConfigOverrides;

$configFile = NQ_ROOT . '/config/config.php';
$configExampleFile = NQ_ROOT . '/config/config.example.php';
$legacyConfigFiles = [
    NQ_ROOT . '/config/config-local.php',
    NQ_ROOT . '/config/config local.php',
];

if (is_file($configFile)) {
    $loaded = require $configFile;
    $config = is_array($loaded) ? $loaded : [];
    $config = migrateLegacyConfigIfNeeded($configFile, $config, $legacyConfigFiles);
} elseif (is_file($configExampleFile)) {
    $loaded = require $configExampleFile;
    $config = is_array($loaded) ? $loaded : [];
    $config['app_url'] = (string) ($config['app_url'] ?? '');
    $config['installed'] = false;
} else {
    $config = [
        'name' => 'Nosfir Quotia',
        'timezone' => 'America/Sao_Paulo',
        'app_url' => '',
        'security' => [
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
        'installed' => false,
        'db' => [
            'driver' => 'mysql',
            'host' => '127.0.0.1',
            'port' => 3306,
            'database' => '',
            'username' => '',
            'password' => '',
            'charset' => 'utf8mb4',
        ],
        'mail' => [
            'enabled' => true,
            'from_name' => 'Nosfir Quotia',
            'from_email' => 'no-reply@localhost',
        ],
    ];
}

$config = RuntimeConfigOverrides::selectEnvironment($config);
$config = resolveEnvironmentConfig($config);
$config = RuntimeConfigOverrides::apply($config);

$application = new NosfirQuotia\System\Engine\Application(NQ_ROOT, $config);
$application->run();

/**
 * Permite configurar varios ambientes no mesmo config:
 * - 'environment' => 'local' | 'online'
 * - 'environments' => ['local' => [...], 'online' => [...]]
 */
function resolveEnvironmentConfig(array $config): array
{
    $environments = $config['environments'] ?? null;
    if (!is_array($environments) || $environments === []) {
        return $config;
    }

    $active = (string) ($config['environment'] ?? '');
    $hasActive = $active !== '' && isset($environments[$active]) && is_array($environments[$active]);

    if (!$hasActive) {
        $firstKey = array_key_first($environments);
        $active = is_string($firstKey) && $firstKey !== '' ? $firstKey : 'online';
    }

    $selected = $environments[$active] ?? [];
    if (!is_array($selected)) {
        $selected = [];
    }

    $resolved = $config;
    unset($resolved['environments']);
    $resolved = array_replace_recursive($resolved, $selected);
    $resolved['active_environment'] = $active;

    return $resolved;
}

/**
 * Migra automaticamente:
 * - formato legado plano (installed/db/mail no topo)
 * - arquivo legado de ambiente local (config-local.php ou config local.php)
 * para o formato multiambiente em config/config.php.
 */
function migrateLegacyConfigIfNeeded(string $configPath, array $config, array $legacyPaths): array
{
    $legacyLocal = loadLegacyLocalConfig($legacyPaths);
    $environments = $config['environments'] ?? null;
    $hasEnvironments = is_array($environments) && $environments !== [];
    $hasLocalEnvironment = $hasEnvironments
        && isset($environments['local'])
        && is_array($environments['local']);

    $needsFormatMigration = !$hasEnvironments;
    $needsLegacyMerge = $legacyLocal !== null && !$hasLocalEnvironment;

    if (!$needsFormatMigration && !$needsLegacyMerge) {
        return $config;
    }

    $migrated = convertToMultiEnvironmentConfig($config, $legacyLocal);
    if (!writeConfigArray($configPath, $migrated)) {
        return $config;
    }

    return $migrated;
}

function convertToMultiEnvironmentConfig(array $config, ?array $legacyLocal): array
{
    $mailDefaults = [
        'enabled' => true,
        'from_name' => 'Nosfir Quotia',
        'from_email' => 'no-reply@localhost',
    ];

    $base = $config;
    unset($base['active_environment'], $base['installed'], $base['db'], $base['mail']);

    $environments = [];
    $active = (string) ($config['environment'] ?? '');

    if (isset($config['environments']) && is_array($config['environments']) && $config['environments'] !== []) {
        foreach ($config['environments'] as $key => $environmentConfig) {
            if (!is_string($key) || $key === '') {
                continue;
            }

            $normalizedSource = is_array($environmentConfig) ? $environmentConfig : [];
            $environments[$key] = normalizeEnvironmentConfig($normalizedSource, $mailDefaults);
        }

        if ($active === '' || !isset($environments[$active])) {
            $firstKey = array_key_first($environments);
            $active = is_string($firstKey) && $firstKey !== '' ? $firstKey : 'online';
        }
    } else {
        if ($active === '') {
            $active = 'online';
        }

        $environments[$active] = normalizeEnvironmentConfig($config, $mailDefaults);
    }

    if ($legacyLocal !== null && !isset($environments['local'])) {
        $environments['local'] = normalizeEnvironmentConfig($legacyLocal, $mailDefaults);
    }

    if (!isset($environments['local'])) {
        $environments['local'] = defaultLocalEnvironment($mailDefaults);
    }

    if (!isset($environments['online'])) {
        $environments['online'] = defaultOnlineEnvironment($mailDefaults);
    }

    if (!isset($environments[$active])) {
        $active = isset($environments['online']) ? 'online' : 'local';
    }

    $base['environment'] = $active;
    $base['environments'] = $environments;

    return $base;
}

function normalizeEnvironmentConfig(array $source, array $mailDefaults): array
{
    $dbDefaults = [
        'driver' => 'mysql',
        'host' => '127.0.0.1',
        'port' => 3306,
        'database' => '',
        'username' => '',
        'password' => '',
        'charset' => 'utf8mb4',
    ];

    $dbRaw = $source['db'] ?? [];
    if (!is_array($dbRaw)) {
        $dbRaw = [];
    }

    $mailRaw = $source['mail'] ?? [];
    if (!is_array($mailRaw)) {
        $mailRaw = [];
    }

    return [
        'installed' => (bool) ($source['installed'] ?? false),
        'db' => array_replace($dbDefaults, $dbRaw),
        'mail' => array_replace($mailDefaults, $mailRaw),
    ];
}

function defaultLocalEnvironment(array $mailDefaults): array
{
    return [
        'installed' => false,
        'db' => [
            'driver' => 'mysql',
            'host' => '127.0.0.1',
            'port' => 3306,
            'database' => '',
            'username' => 'root',
            'password' => '',
            'charset' => 'utf8mb4',
        ],
        'mail' => $mailDefaults,
    ];
}

function defaultOnlineEnvironment(array $mailDefaults): array
{
    return [
        'installed' => false,
        'db' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'port' => 3306,
            'database' => '',
            'username' => '',
            'password' => '',
            'charset' => 'utf8mb4',
        ],
        'mail' => $mailDefaults,
    ];
}

function loadLegacyLocalConfig(array $legacyPaths): ?array
{
    foreach ($legacyPaths as $path) {
        if (!is_string($path) || $path === '' || !is_file($path)) {
            continue;
        }

        $loaded = require $path;
        if (!is_array($loaded)) {
            continue;
        }

        if (isset($loaded['environments']) && is_array($loaded['environments']) && $loaded['environments'] !== []) {
            $selected = (string) ($loaded['environment'] ?? 'local');
            if (isset($loaded['environments'][$selected]) && is_array($loaded['environments'][$selected])) {
                return $loaded['environments'][$selected];
            }

            if (isset($loaded['environments']['local']) && is_array($loaded['environments']['local'])) {
                return $loaded['environments']['local'];
            }

            $firstKey = array_key_first($loaded['environments']);
            if (is_string($firstKey) && isset($loaded['environments'][$firstKey]) && is_array($loaded['environments'][$firstKey])) {
                return $loaded['environments'][$firstKey];
            }
        }

        if (isset($loaded['db']) || isset($loaded['installed']) || isset($loaded['mail'])) {
            return $loaded;
        }
    }

    return null;
}

function writeConfigArray(string $configPath, array $config): bool
{
    $content = "<?php\n\n";
    $content .= "declare(strict_types=1);\n\n";
    $content .= 'return ' . var_export($config, true) . ";\n";

    return @file_put_contents($configPath, $content) !== false;
}
