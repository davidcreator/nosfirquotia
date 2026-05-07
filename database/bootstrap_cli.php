<?php

declare(strict_types=1);

/**
 * @throws RuntimeException
 */
function nqLoadConfig(string $rootPath): array
{
    $configPath = $rootPath . '/config/config.php';
    if (!is_file($configPath)) {
        throw new RuntimeException('Arquivo config/config.php nao encontrado.');
    }

    $config = require $configPath;
    if (!is_array($config)) {
        throw new RuntimeException('config/config.php invalido.');
    }

    return $config;
}

/**
 * @throws RuntimeException
 */
function nqLoadDbConfig(string $rootPath): array
{
    $config = nqLoadConfig($rootPath);
    $dbConfig = [];

    if (isset($config['db']) && is_array($config['db'])) {
        $dbConfig = $config['db'];
    }

    $environment = trim((string) ($config['environment'] ?? ''));
    $environments = is_array($config['environments'] ?? null) ? $config['environments'] : [];

    if ($environment !== '' && isset($environments[$environment]['db']) && is_array($environments[$environment]['db'])) {
        $dbConfig = $environments[$environment]['db'];
    } elseif (isset($environments['online']['db']) && is_array($environments['online']['db'])) {
        $dbConfig = $environments['online']['db'];
    } elseif (isset($environments['local']['db']) && is_array($environments['local']['db'])) {
        $dbConfig = $environments['local']['db'];
    }

    if ($dbConfig === []) {
        throw new RuntimeException('Configuracao de banco nao encontrada no arquivo config/config.php.');
    }

    $resolved = array_merge(
        [
            'driver' => 'mysql',
            'host' => '127.0.0.1',
            'port' => 3306,
            'database' => '',
            'username' => '',
            'password' => '',
            'charset' => 'utf8mb4',
        ],
        $dbConfig
    );

    if (trim((string) $resolved['database']) === '' || trim((string) $resolved['username']) === '') {
        throw new RuntimeException('Configuracao de banco incompleta para execucao do script.');
    }

    return $resolved;
}
