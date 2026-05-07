<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

$migrationId = '20260505_0001_workflow_client_admin';
$description = 'Reversao do workflow base cliente/admin por snapshot de schema e dados.';

try {
    $options = nqRollbackParseOptions($argv);
    nqRollbackGuardDestructiveApply($options, $migrationId, $description);

    $runId = nqRollbackRequireRunId($options);
    $db = nqRollbackCreateDatabase();

    $snapshots = nqRollbackLoadSnapshots($db, $runId, $migrationId);
    if ($snapshots === []) {
        throw new RuntimeException('Nenhum snapshot encontrado para rollback deste migration/run.');
    }

    $indexedSnapshots = nqRollbackIndexSnapshotsByEntityKey($snapshots);

    $wasExisting = static function (string $key) use ($indexedSnapshots): bool {
        return nqRollbackRequireExistsFlag($indexedSnapshots, $key);
    };

    $db->transaction(static function (NosfirQuotia\System\Library\Database $database) use ($indexedSnapshots, $wasExisting): void {
        $createdTables = [
            'client_users',
            'quote_requests',
            'quote_request_items',
            'quote_reports',
            'quote_report_items',
            'quote_report_taxes',
            'tax_settings',
            'email_dispatch_logs',
            'password_resets',
        ];
        foreach ($createdTables as $tableName) {
            if (!$wasExisting('meta:table:' . $tableName)) {
                nqRollbackDropTableIfExists($database, $tableName);
            }
        }

        if (!$wasExisting('meta:index:design_categories:idx_design_categories_area_type')) {
            nqRollbackDropIndexIfExists($database, 'design_categories', 'idx_design_categories_area_type');
        }
        if (!$wasExisting('meta:column:design_categories:area_type')) {
            nqRollbackDropColumnIfExists($database, 'design_categories', 'area_type');
        }

        if (!$wasExisting('meta:fk:admin_users:fk_admin_users_creator')) {
            nqRollbackDropForeignKeyIfExists($database, 'admin_users', 'fk_admin_users_creator');
        }
        if (!$wasExisting('meta:index:admin_users:idx_admin_users_active')) {
            nqRollbackDropIndexIfExists($database, 'admin_users', 'idx_admin_users_active');
        }

        $adminColumns = [
            'created_by_admin_id',
            'permissions_json',
            'is_active',
            'is_general_admin',
            'access_level',
            'updated_at',
        ];
        foreach ($adminColumns as $columnName) {
            if (!$wasExisting('meta:column:admin_users:' . $columnName)) {
                nqRollbackDropColumnIfExists($database, 'admin_users', $columnName);
            }
        }

        if (nqRollbackTableExists($database, 'admin_users') && nqRollbackColumnExists($database, 'admin_users', 'id')) {
            $firstAdminSnapshot = $indexedSnapshots['data:first_admin'] ?? null;
            if (is_array($firstAdminSnapshot) && (int) ($firstAdminSnapshot['exists'] ?? 0) === 1) {
                $adminId = (int) ($firstAdminSnapshot['id'] ?? 0);
                $fields = is_array($firstAdminSnapshot['fields'] ?? null) ? $firstAdminSnapshot['fields'] : [];

                if ($adminId > 0 && $fields !== []) {
                    $allowed = ['access_level', 'is_general_admin', 'is_active', 'permissions_json', 'updated_at'];
                    $setParts = [];
                    $params = ['id' => $adminId];

                    foreach ($allowed as $columnName) {
                        if (!array_key_exists($columnName, $fields)) {
                            continue;
                        }

                        if (!nqRollbackColumnExists($database, 'admin_users', $columnName)) {
                            continue;
                        }

                        $setParts[] = '`' . nqRollbackEscapeIdentifier($columnName) . '` = :' . $columnName;
                        $params[$columnName] = $fields[$columnName];
                    }

                    if ($setParts !== []) {
                        $database->execute(
                            'UPDATE `admin_users`
                             SET ' . implode(', ', $setParts) . '
                             WHERE `id` = :id',
                            $params
                        );
                    }
                }
            }
        }

        if (nqRollbackTableExists($database, 'design_categories') && nqRollbackColumnExists($database, 'design_categories', 'slug')) {
            $slugs = [
                'design-grafico',
                'design-ux-ui',
                'ilustracao-digital',
                'desenvolvimento-web',
                'aplicativo-mobile',
                'software-desktop',
                'integracoes-e-api',
            ];

            foreach ($slugs as $slug) {
                $snapshotKey = 'data:design_category_slug:' . $slug;
                $snapshot = $indexedSnapshots[$snapshotKey] ?? null;
                if (!is_array($snapshot)) {
                    continue;
                }

                $existsBefore = (int) ($snapshot['exists'] ?? 0) === 1;
                if (!$existsBefore) {
                    $database->execute(
                        'DELETE FROM `design_categories`
                         WHERE `slug` = :slug',
                        ['slug' => $slug]
                    );
                    continue;
                }

                $fields = is_array($snapshot['fields'] ?? null) ? $snapshot['fields'] : [];
                if ($fields === []) {
                    continue;
                }

                $fields['slug'] = is_string($fields['slug'] ?? null) && trim((string) $fields['slug']) !== ''
                    ? (string) $fields['slug']
                    : $slug;

                $mutable = ['slug', 'name', 'description', 'base_price', 'area_type'];
                $insertColumns = [];
                $insertPlaceholders = [];
                $updateParts = [];
                $params = [];

                foreach ($mutable as $columnName) {
                    if (!array_key_exists($columnName, $fields)) {
                        continue;
                    }

                    if (!nqRollbackColumnExists($database, 'design_categories', $columnName)) {
                        continue;
                    }

                    $insertColumns[] = '`' . nqRollbackEscapeIdentifier($columnName) . '`';
                    $insertPlaceholders[] = ':' . $columnName;
                    $params[$columnName] = $fields[$columnName];

                    if ($columnName !== 'slug') {
                        $updateParts[] = '`' . nqRollbackEscapeIdentifier($columnName) . '` = VALUES(`' . nqRollbackEscapeIdentifier($columnName) . '`)';
                    }
                }

                if ($insertColumns === [] || !isset($params['slug'])) {
                    continue;
                }

                $database->execute(
                    'INSERT INTO `design_categories` (' . implode(', ', $insertColumns) . ')
                     VALUES (' . implode(', ', $insertPlaceholders) . ')
                     ON DUPLICATE KEY UPDATE ' . ($updateParts !== [] ? implode(', ', $updateParts) : '`slug` = VALUES(`slug`)'),
                    $params
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

