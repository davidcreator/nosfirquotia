<?php

declare(strict_types=1);

use NosfirQuotia\System\Library\Auth;
use NosfirQuotia\System\Library\Database;

define('NQ_ROOT', dirname(__DIR__));

require NQ_ROOT . '/vendor/autoload.php';

$configFile = NQ_ROOT . '/config/config.php';
if (!is_file($configFile)) {
    fwrite(STDERR, "Arquivo config/config.php não encontrado.\n");
    exit(1);
}

$config = require $configFile;
$dbConfig = (array) ($config['db'] ?? []);

try {
    $db = new Database($dbConfig);

    $hasColumn = static function (Database $database, string $table, string $column): bool {
        $row = $database->fetch(
            'SELECT COUNT(*) AS total
             FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = :table
               AND COLUMN_NAME = :column',
            [
                'table' => $table,
                'column' => $column,
            ]
        );

        return (int) ($row['total'] ?? 0) > 0;
    };

    if (!$hasColumn($db, 'admin_users', 'access_level')) {
        $db->execute("ALTER TABLE admin_users ADD COLUMN access_level VARCHAR(80) NOT NULL DEFAULT 'Administrador' AFTER password");
    }

    if (!$hasColumn($db, 'admin_users', 'is_general_admin')) {
        $db->execute('ALTER TABLE admin_users ADD COLUMN is_general_admin TINYINT(1) NOT NULL DEFAULT 0 AFTER access_level');
    }

    if (!$hasColumn($db, 'admin_users', 'is_active')) {
        $db->execute('ALTER TABLE admin_users ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1 AFTER is_general_admin');
    }

    if (!$hasColumn($db, 'admin_users', 'permissions_json')) {
        $db->execute('ALTER TABLE admin_users ADD COLUMN permissions_json LONGTEXT NULL AFTER is_active');
    }

    if (!$hasColumn($db, 'admin_users', 'created_by_admin_id')) {
        $db->execute('ALTER TABLE admin_users ADD COLUMN created_by_admin_id INT UNSIGNED NULL AFTER permissions_json');
    }

    if (!$hasColumn($db, 'admin_users', 'updated_at')) {
        $db->execute('ALTER TABLE admin_users ADD COLUMN updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP AFTER created_at');
    }

    $fkRow = $db->fetch(
        "SELECT COUNT(*) AS total
         FROM information_schema.TABLE_CONSTRAINTS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'admin_users'
           AND CONSTRAINT_NAME = 'fk_admin_users_creator'"
    );
    if ((int) ($fkRow['total'] ?? 0) === 0) {
        $db->execute(
            'ALTER TABLE admin_users
             ADD CONSTRAINT fk_admin_users_creator
             FOREIGN KEY (created_by_admin_id) REFERENCES admin_users (id)
             ON DELETE SET NULL ON UPDATE CASCADE'
        );
    }

    $idxRow = $db->fetch(
        "SELECT COUNT(*) AS total
         FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'admin_users'
           AND INDEX_NAME = 'idx_admin_users_active'"
    );
    if ((int) ($idxRow['total'] ?? 0) === 0) {
        $db->execute('CREATE INDEX idx_admin_users_active ON admin_users (is_active)');
    }

    $allPermissionsJson = json_encode(Auth::permissionKeys(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $firstAdmin = $db->fetch('SELECT id FROM admin_users ORDER BY id ASC LIMIT 1');
    if ($firstAdmin !== null) {
        $firstAdminId = (int) $firstAdmin['id'];
        $db->execute(
            'UPDATE admin_users
             SET
                is_general_admin = CASE WHEN id = :first_id_1 THEN 1 ELSE is_general_admin END,
                access_level = CASE WHEN id = :first_id_2 THEN :general_level ELSE COALESCE(NULLIF(access_level, \'\'), :default_level) END,
                is_active = CASE WHEN id = :first_id_3 THEN 1 ELSE is_active END,
                permissions_json = CASE WHEN id = :first_id_4 THEN :full_permissions ELSE COALESCE(permissions_json, :empty_permissions) END
             WHERE id = id',
            [
                'first_id_1' => $firstAdminId,
                'first_id_2' => $firstAdminId,
                'first_id_3' => $firstAdminId,
                'first_id_4' => $firstAdminId,
                'general_level' => 'Administrador Geral',
                'default_level' => 'Administrador',
                'full_permissions' => $allPermissionsJson,
                'empty_permissions' => json_encode([], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ]
        );
    }

    echo "Upgrade de permissoes admin concluido com sucesso.\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}

