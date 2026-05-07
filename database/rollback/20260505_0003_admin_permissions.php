<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

$migrationId = '20260505_0003_admin_permissions';
$description = 'Reversao de permissoes administrativas por snapshot.';

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
            $adminId = (int) ($payload['id'] ?? 0);
            if ($adminId <= 0) {
                continue;
            }

            $database->execute(
                'UPDATE admin_users
                 SET
                    access_level = :access_level,
                    is_general_admin = :is_general_admin,
                    is_active = :is_active,
                    permissions_json = :permissions_json,
                    updated_at = :updated_at
                 WHERE id = :id',
                [
                    'access_level' => isset($payload['access_level']) ? (string) $payload['access_level'] : null,
                    'is_general_admin' => (int) ($payload['is_general_admin'] ?? 0),
                    'is_active' => (int) ($payload['is_active'] ?? 0),
                    'permissions_json' => isset($payload['permissions_json']) ? (string) $payload['permissions_json'] : null,
                    'updated_at' => isset($payload['updated_at']) ? (string) $payload['updated_at'] : null,
                    'id' => $adminId,
                ]
            );
        }
    });

    echo "Rollback {$migrationId} executado com sucesso usando snapshots do run {$runId}.\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}
