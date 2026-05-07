<?php

declare(strict_types=1);

use NosfirQuotia\System\Library\Database;

if (!defined('NQ_ROOT')) {
    define('NQ_ROOT', dirname(__DIR__, 2));
}

require_once NQ_ROOT . '/vendor/autoload.php';
require_once NQ_ROOT . '/database/bootstrap_cli.php';

/**
 * @return array{apply:bool,confirm:bool,run_id:?string}
 */
function nqRollbackParseOptions(array $argv): array
{
    $options = [
        'apply' => false,
        'confirm' => false,
        'run_id' => null,
    ];

    foreach (array_slice($argv, 1) as $argument) {
        if ($argument === '--help' || $argument === '-h') {
            nqRollbackPrintHelp();
            exit(0);
        }

        if ($argument === '--apply') {
            $options['apply'] = true;
            continue;
        }

        if ($argument === '--confirm') {
            $options['confirm'] = true;
            continue;
        }

        if (str_starts_with($argument, '--run-id=')) {
            $value = trim(substr($argument, 9));
            $options['run_id'] = $value !== '' ? $value : null;
            continue;
        }

        throw new RuntimeException('Argumento invalido para rollback: ' . $argument);
    }

    return $options;
}

function nqRollbackPrintHelp(): void
{
    echo "Uso:\n";
    echo "  php database/rollback/<migration_id>.php [--apply --confirm] [--run-id=<run_id>]\n";
    echo "\n";
    echo "Padrao: simulacao (somente plano, sem alterar banco).\n";
    echo "Para executar rollback real: informar simultaneamente --apply e --confirm.\n";
}

function nqRollbackGuardDestructiveApply(array $options, string $migrationId, string $description): void
{
    if (($options['apply'] ?? false) !== true) {
        echo "Rollback script: {$migrationId}\n";
        echo "Descricao: {$description}\n";
        echo "Modo simulacao ativo. Nenhuma alteracao foi aplicada.\n";
        echo "Para executar de fato: --apply --confirm\n";
        exit(0);
    }

    if (($options['confirm'] ?? false) !== true) {
        throw new RuntimeException('Rollback destrutivo bloqueado. Informe --confirm junto com --apply.');
    }
}

function nqRollbackCreateDatabase(): Database
{
    return new Database(nqLoadDbConfig(NQ_ROOT));
}

/**
 * @param array{run_id:?string} $options
 */
function nqRollbackRequireRunId(array $options): string
{
    $runId = trim((string) ($options['run_id'] ?? ''));
    if ($runId === '') {
        throw new RuntimeException('Este rollback exige --run-id=<run_id> para restaurar snapshots da execucao original.');
    }

    return $runId;
}

/**
 * @return array<int, array{entity_key:string,payload:array<string,mixed>}>
 */
function nqRollbackLoadSnapshots(Database $db, string $runId, string $migrationId): array
{
    if (!nqRollbackTableExists($db, 'schema_migration_rollback_snapshots')) {
        throw new RuntimeException('Tabela de snapshots de rollback nao encontrada: schema_migration_rollback_snapshots.');
    }

    $rows = $db->fetchAll(
        'SELECT entity_key, snapshot_json
         FROM schema_migration_rollback_snapshots
         WHERE run_id = :run_id
           AND migration_id = :migration_id
         ORDER BY id ASC',
        [
            'run_id' => $runId,
            'migration_id' => $migrationId,
        ]
    );

    $snapshots = [];
    foreach ($rows as $row) {
        $entityKey = trim((string) ($row['entity_key'] ?? ''));
        if ($entityKey === '') {
            continue;
        }

        $payloadRaw = (string) ($row['snapshot_json'] ?? '');
        $payload = json_decode($payloadRaw, true);
        if (!is_array($payload)) {
            throw new RuntimeException('Snapshot de rollback corrompido para entity_key=' . $entityKey . '.');
        }

        $snapshots[] = [
            'entity_key' => $entityKey,
            'payload' => $payload,
        ];
    }

    return $snapshots;
}

/**
 * @param array<int, array{entity_key:string,payload:array<string,mixed>}> $snapshots
 * @return array<string, array<string,mixed>>
 */
function nqRollbackIndexSnapshotsByEntityKey(array $snapshots): array
{
    $indexed = [];
    foreach ($snapshots as $snapshot) {
        $entityKey = trim((string) ($snapshot['entity_key'] ?? ''));
        if ($entityKey === '') {
            continue;
        }

        $payload = is_array($snapshot['payload'] ?? null) ? $snapshot['payload'] : [];
        $indexed[$entityKey] = $payload;
    }

    return $indexed;
}

/**
 * @param array<string, array<string,mixed>> $indexedSnapshots
 */
function nqRollbackRequireExistsFlag(array $indexedSnapshots, string $entityKey): bool
{
    if (!isset($indexedSnapshots[$entityKey])) {
        throw new RuntimeException('Snapshot obrigatorio nao encontrado: ' . $entityKey);
    }

    $payload = $indexedSnapshots[$entityKey];
    if (!array_key_exists('exists', $payload)) {
        throw new RuntimeException('Snapshot invalido (campo exists ausente): ' . $entityKey);
    }

    $value = $payload['exists'];
    if (is_bool($value)) {
        return $value;
    }

    if (is_int($value)) {
        return $value !== 0;
    }

    if (is_string($value)) {
        $normalized = strtolower(trim($value));
        if (in_array($normalized, ['1', 'true', 'yes', 'on'], true)) {
            return true;
        }
        if (in_array($normalized, ['0', 'false', 'no', 'off'], true)) {
            return false;
        }
    }

    throw new RuntimeException('Snapshot invalido (exists nao reconhecido): ' . $entityKey);
}

function nqRollbackTableExists(Database $db, string $tableName): bool
{
    $row = $db->fetch(
        'SELECT COUNT(*) AS total
         FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table_name',
        ['table_name' => $tableName]
    );

    return (int) ($row['total'] ?? 0) > 0;
}

function nqRollbackColumnExists(Database $db, string $tableName, string $columnName): bool
{
    $row = $db->fetch(
        'SELECT COUNT(*) AS total
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table_name
           AND COLUMN_NAME = :column_name',
        [
            'table_name' => $tableName,
            'column_name' => $columnName,
        ]
    );

    return (int) ($row['total'] ?? 0) > 0;
}

function nqRollbackIndexExists(Database $db, string $tableName, string $indexName): bool
{
    $row = $db->fetch(
        'SELECT COUNT(*) AS total
         FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table_name
           AND INDEX_NAME = :index_name',
        [
            'table_name' => $tableName,
            'index_name' => $indexName,
        ]
    );

    return (int) ($row['total'] ?? 0) > 0;
}

function nqRollbackForeignKeyExists(Database $db, string $tableName, string $constraintName): bool
{
    $row = $db->fetch(
        'SELECT COUNT(*) AS total
         FROM information_schema.TABLE_CONSTRAINTS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table_name
           AND CONSTRAINT_NAME = :constraint_name
           AND CONSTRAINT_TYPE = :constraint_type',
        [
            'table_name' => $tableName,
            'constraint_name' => $constraintName,
            'constraint_type' => 'FOREIGN KEY',
        ]
    );

    return (int) ($row['total'] ?? 0) > 0;
}

function nqRollbackDropTableIfExists(Database $db, string $tableName): void
{
    if (!nqRollbackTableExists($db, $tableName)) {
        return;
    }

    $db->execute('DROP TABLE `' . nqRollbackEscapeIdentifier($tableName) . '`');
}

function nqRollbackDropColumnIfExists(Database $db, string $tableName, string $columnName): void
{
    if (!nqRollbackColumnExists($db, $tableName, $columnName)) {
        return;
    }

    $db->execute(
        'ALTER TABLE `' . nqRollbackEscapeIdentifier($tableName) . '` DROP COLUMN `' . nqRollbackEscapeIdentifier($columnName) . '`'
    );
}

function nqRollbackDropIndexIfExists(Database $db, string $tableName, string $indexName): void
{
    if (!nqRollbackIndexExists($db, $tableName, $indexName)) {
        return;
    }

    $db->execute(
        'ALTER TABLE `' . nqRollbackEscapeIdentifier($tableName) . '` DROP INDEX `' . nqRollbackEscapeIdentifier($indexName) . '`'
    );
}

function nqRollbackDropForeignKeyIfExists(Database $db, string $tableName, string $constraintName): void
{
    if (!nqRollbackForeignKeyExists($db, $tableName, $constraintName)) {
        return;
    }

    $db->execute(
        'ALTER TABLE `' . nqRollbackEscapeIdentifier($tableName) . '` DROP FOREIGN KEY `' . nqRollbackEscapeIdentifier($constraintName) . '`'
    );
}

function nqRollbackEscapeIdentifier(string $identifier): string
{
    $value = trim($identifier);
    if ($value === '' || preg_match('/^[a-zA-Z0-9_]+$/', $value) !== 1) {
        throw new RuntimeException('Identificador SQL invalido: ' . $identifier);
    }

    return $value;
}
