<?php

declare(strict_types=1);

use NosfirQuotia\System\Library\Database;

define('NQ_ROOT', dirname(__DIR__));

require NQ_ROOT . '/vendor/autoload.php';
require NQ_ROOT . '/database/bootstrap_cli.php';

try {
    $db = new Database(nqLoadDbConfig(NQ_ROOT));

    $tableExists = static function (Database $database, string $table): bool {
        $row = $database->fetch(
            'SELECT COUNT(*) AS total
             FROM information_schema.TABLES
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = :table',
            ['table' => $table]
        );

        return (int) ($row['total'] ?? 0) > 0;
    };

    $normalizeReleaseVersion = static function (string $value): ?string {
        $raw = trim($value);
        if ($raw === '') {
            return null;
        }

        $toDate = static function (int $year, int $month, int $day): ?string {
            if (!checkdate($month, $day, $year)) {
                return null;
            }

            return sprintf('%02d/%02d/%04d', $day, $month, $year);
        };

        if (preg_match('/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/', $raw, $matches) === 1) {
            return $toDate((int) $matches[3], (int) $matches[2], (int) $matches[1]);
        }

        if (preg_match('/^([0-9]{4})[.\-\/]([0-9]{2})[.\-\/]([0-9]{2})(?:[^0-9].*)?$/', $raw, $matches) === 1) {
            return $toDate((int) $matches[1], (int) $matches[2], (int) $matches[3]);
        }

        if (preg_match('/^adhoc-([0-9]{4})([0-9]{2})([0-9]{2})(?:-[0-9]{6})?$/i', $raw, $matches) === 1) {
            return $toDate((int) $matches[1], (int) $matches[2], (int) $matches[3]);
        }

        if (preg_match('/^([0-9]{4})([0-9]{2})([0-9]{2})(?:[^0-9].*)?$/', $raw, $matches) === 1) {
            return $toDate((int) $matches[1], (int) $matches[2], (int) $matches[3]);
        }

        return null;
    };

    $updatedRunRows = 0;
    $updatedMigrationRows = 0;

    $db->transaction(static function (Database $database) use (
        $tableExists,
        $normalizeReleaseVersion,
        &$updatedRunRows,
        &$updatedMigrationRows
    ): void {
        if ($tableExists($database, 'schema_migration_releases')) {
            $releaseRows = $database->fetchAll(
                'SELECT id, release_version
                 FROM schema_migration_releases
                 WHERE COALESCE(release_version, \'\') <> \'\''
            );

            foreach ($releaseRows as $row) {
                $id = (int) ($row['id'] ?? 0);
                if ($id <= 0) {
                    continue;
                }

                $current = trim((string) ($row['release_version'] ?? ''));
                $normalized = $normalizeReleaseVersion($current);
                if ($normalized === null || hash_equals($current, $normalized)) {
                    continue;
                }

                $database->execute(
                    'UPDATE schema_migration_releases
                     SET release_version = :release_version
                     WHERE id = :id',
                    [
                        'release_version' => $normalized,
                        'id' => $id,
                    ]
                );
                $updatedRunRows++;
            }
        }

        if ($tableExists($database, 'schema_migrations')) {
            $migrationRows = $database->fetchAll(
                'SELECT id, release_version
                 FROM schema_migrations
                 WHERE COALESCE(release_version, \'\') <> \'\''
            );

            foreach ($migrationRows as $row) {
                $id = (int) ($row['id'] ?? 0);
                if ($id <= 0) {
                    continue;
                }

                $current = trim((string) ($row['release_version'] ?? ''));
                $normalized = $normalizeReleaseVersion($current);
                if ($normalized === null || hash_equals($current, $normalized)) {
                    continue;
                }

                $database->execute(
                    'UPDATE schema_migrations
                     SET release_version = :release_version
                     WHERE id = :id',
                    [
                        'release_version' => $normalized,
                        'id' => $id,
                    ]
                );
                $updatedMigrationRows++;
            }
        }
    });

    echo sprintf(
        "Normalizacao de release_version concluida. Runs atualizados: %d | Migracoes atualizadas: %d\n",
        $updatedRunRows,
        $updatedMigrationRows
    );
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}

