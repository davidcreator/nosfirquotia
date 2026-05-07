<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

$migrationId = '20260506_0006_release_version_format';
$description = 'Reversao da normalizacao de release_version por snapshot.';

try {
    $options = nqRollbackParseOptions($argv);
    nqRollbackGuardDestructiveApply($options, $migrationId, $description);

    $runId = nqRollbackRequireRunId($options);
    $db = nqRollbackCreateDatabase();

    $snapshots = nqRollbackLoadSnapshots($db, $runId, $migrationId);
    if ($snapshots === []) {
        throw new RuntimeException('Nenhum snapshot encontrado para rollback deste migration/run.');
    }

    $db->transaction(static function (NosfirQuotia\System\Library\Database $database) use ($snapshots): void {
        foreach ($snapshots as $snapshot) {
            $payload = $snapshot['payload'];
            $table = trim((string) ($payload['table'] ?? ''));
            $id = (int) ($payload['id'] ?? 0);
            if ($id <= 0) {
                continue;
            }

            $releaseVersion = isset($payload['release_version']) ? (string) $payload['release_version'] : null;

            if ($table === 'schema_migration_releases') {
                $database->execute(
                    'UPDATE schema_migration_releases
                     SET release_version = :release_version
                     WHERE id = :id',
                    [
                        'release_version' => $releaseVersion,
                        'id' => $id,
                    ]
                );
                continue;
            }

            if ($table === 'schema_migrations') {
                $database->execute(
                    'UPDATE schema_migrations
                     SET release_version = :release_version
                     WHERE id = :id',
                    [
                        'release_version' => $releaseVersion,
                        'id' => $id,
                    ]
                );
            }
        }
    });

    echo "Rollback {$migrationId} executado com sucesso usando snapshots do run {$runId}.\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}
