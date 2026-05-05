<?php

declare(strict_types=1);

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

    $firstAdmin = $db->fetch('SELECT id FROM admin_users ORDER BY id ASC LIMIT 1');
    if ($firstAdmin !== null) {
        $db->execute(
            'UPDATE admin_users
             SET
                is_general_admin = CASE WHEN id = :first_id_1 THEN 1 ELSE is_general_admin END,
                access_level = CASE WHEN id = :first_id_2 THEN :general_level ELSE COALESCE(NULLIF(access_level, \'\'), :default_level) END,
                is_active = CASE WHEN id = :first_id_3 THEN 1 ELSE is_active END
             WHERE id = id',
            [
                'first_id_1' => (int) $firstAdmin['id'],
                'first_id_2' => (int) $firstAdmin['id'],
                'first_id_3' => (int) $firstAdmin['id'],
                'general_level' => 'Administrador Geral',
                'default_level' => 'Administrador',
            ]
        );
    }

    if (!$hasColumn($db, 'design_categories', 'area_type')) {
        $db->execute("ALTER TABLE design_categories ADD COLUMN area_type VARCHAR(30) NOT NULL DEFAULT 'design' AFTER id");
    }

    $areaIndexRow = $db->fetch(
        "SELECT COUNT(*) AS total
         FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'design_categories'
           AND INDEX_NAME = 'idx_design_categories_area_type'"
    );
    if ((int) ($areaIndexRow['total'] ?? 0) === 0) {
        $db->execute('CREATE INDEX idx_design_categories_area_type ON design_categories (area_type)');
    }

    $db->execute("UPDATE design_categories SET area_type = 'design' WHERE area_type IS NULL OR TRIM(area_type) = ''");

    $defaultCategories = [
        ['design', 'Design Grafico', 'logos, identidade visual, cartazes', 350.00],
        ['design', 'Design UX/UI', 'interfaces de apps e websites', 750.00],
        ['design', 'Ilustracao Digital', 'arte digital e storyboards', 450.00],
        ['development', 'Desenvolvimento Web', 'sites, sistemas web e portais sob medida', 2500.00],
        ['development', 'Aplicativo Mobile', 'aplicativos Android e iOS com foco em produto digital', 5000.00],
        ['development', 'Software Desktop', 'sistemas desktop para operacao interna e produtividade', 3200.00],
        ['development', 'Integracoes e API', 'integracoes entre sistemas, automacoes e API REST', 2800.00],
    ];

    foreach ($defaultCategories as $category) {
        $name = (string) $category[1];
        $normalizedName = strtr(strtolower($name), [
            'á' => 'a', 'à' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a',
            'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
            'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
            'ó' => 'o', 'ò' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o',
            'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
            'ç' => 'c',
        ]);
        $slug = strtolower(trim((string) preg_replace('/[^a-z0-9]+/', '-', $normalizedName), '-'));
        if ($slug === '') {
            $slug = 'categoria';
        }

        $exists = $db->fetch(
            'SELECT id FROM design_categories WHERE slug = :slug LIMIT 1',
            ['slug' => $slug]
        );

        if ($exists !== null) {
            $db->execute(
                'UPDATE design_categories
                 SET area_type = :area_type
                 WHERE id = :id',
                [
                    'id' => (int) $exists['id'],
                    'area_type' => (string) $category[0],
                ]
            );
            continue;
        }

        $db->execute(
            'INSERT INTO design_categories (area_type, name, slug, description, base_price)
             VALUES (:area_type, :name, :slug, :description, :base_price)',
            [
                'area_type' => (string) $category[0],
                'name' => $name,
                'slug' => $slug,
                'description' => (string) $category[2],
                'base_price' => (float) $category[3],
            ]
        );
    }

    $db->execute(
        'CREATE TABLE IF NOT EXISTS client_users (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            email VARCHAR(190) NOT NULL UNIQUE,
            phone VARCHAR(40) NULL,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS quote_requests (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            client_user_id INT UNSIGNED NOT NULL,
            project_title VARCHAR(180) NOT NULL,
            scope TEXT NOT NULL,
            desired_deadline_days SMALLINT UNSIGNED NULL,
            requested_availability VARCHAR(150) NULL,
            status VARCHAR(30) NOT NULL DEFAULT \'pendente\',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT fk_quote_requests_client FOREIGN KEY (client_user_id) REFERENCES client_users (id) ON DELETE CASCADE ON UPDATE CASCADE,
            INDEX idx_quote_requests_status (status),
            INDEX idx_quote_requests_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS quote_request_items (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            quote_request_id INT UNSIGNED NOT NULL,
            reference_price_item_id INT UNSIGNED NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_quote_request_items_request FOREIGN KEY (quote_request_id) REFERENCES quote_requests (id) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT fk_quote_request_items_reference FOREIGN KEY (reference_price_item_id) REFERENCES reference_price_items (id) ON DELETE RESTRICT ON UPDATE CASCADE,
            UNIQUE KEY uq_quote_request_service (quote_request_id, reference_price_item_id),
            INDEX idx_quote_request_items_request (quote_request_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS quote_reports (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            quote_request_id INT UNSIGNED NOT NULL,
            admin_user_id INT UNSIGNED NOT NULL,
            subtotal_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
            taxes_total_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
            total_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
            total_deadline_days SMALLINT UNSIGNED NULL,
            availability_summary VARCHAR(180) NULL,
            report_notes TEXT NULL,
            show_tax_details TINYINT(1) NOT NULL DEFAULT 0,
            valid_until DATE NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT fk_quote_reports_request FOREIGN KEY (quote_request_id) REFERENCES quote_requests (id) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT fk_quote_reports_admin FOREIGN KEY (admin_user_id) REFERENCES admin_users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
            UNIQUE KEY uq_quote_reports_request (quote_request_id),
            INDEX idx_quote_reports_valid_until (valid_until),
            INDEX idx_quote_reports_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS quote_report_items (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            quote_report_id INT UNSIGNED NOT NULL,
            reference_price_item_id INT UNSIGNED NULL,
            service_name VARCHAR(255) NOT NULL,
            price_value DECIMAL(12, 2) NOT NULL DEFAULT 0,
            deadline_days SMALLINT UNSIGNED NULL,
            availability_label VARCHAR(120) NULL,
            notes TEXT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_quote_report_items_report FOREIGN KEY (quote_report_id) REFERENCES quote_reports (id) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT fk_quote_report_items_reference FOREIGN KEY (reference_price_item_id) REFERENCES reference_price_items (id) ON DELETE SET NULL ON UPDATE CASCADE,
            INDEX idx_quote_report_items_report (quote_report_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS quote_report_taxes (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            quote_report_id INT UNSIGNED NOT NULL,
            tax_key VARCHAR(30) NOT NULL,
            tax_label VARCHAR(150) NOT NULL,
            tax_percent DECIMAL(6, 2) NOT NULL DEFAULT 0,
            tax_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_quote_report_taxes_report FOREIGN KEY (quote_report_id) REFERENCES quote_reports (id) ON DELETE CASCADE ON UPDATE CASCADE,
            INDEX idx_quote_report_taxes_report (quote_report_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS tax_settings (
            id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
            imposto_label VARCHAR(120) NOT NULL DEFAULT \'Impostos\',
            imposto_percent DECIMAL(6, 2) NOT NULL DEFAULT 0,
            taxa_label VARCHAR(120) NOT NULL DEFAULT \'Taxas\',
            taxa_percent DECIMAL(6, 2) NOT NULL DEFAULT 0,
            encargo_label VARCHAR(120) NOT NULL DEFAULT \'Encargos tributarios\',
            encargo_percent DECIMAL(6, 2) NOT NULL DEFAULT 0,
            legal_notes TEXT NULL,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->execute(
        'INSERT INTO tax_settings (id)
         VALUES (1)
         ON DUPLICATE KEY UPDATE id = id'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS email_dispatch_logs (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            context_key VARCHAR(80) NOT NULL,
            recipient_name VARCHAR(180) NULL,
            recipient_email VARCHAR(190) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            body_preview VARCHAR(255) NULL,
            status VARCHAR(30) NOT NULL,
            error_message VARCHAR(255) NULL,
            related_type VARCHAR(40) NULL,
            related_id INT UNSIGNED NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_email_dispatch_status (status),
            INDEX idx_email_dispatch_context (context_key),
            INDEX idx_email_dispatch_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS password_resets (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_type VARCHAR(20) NOT NULL,
            user_id INT UNSIGNED NOT NULL,
            email VARCHAR(190) NOT NULL,
            token_hash CHAR(64) NOT NULL,
            expires_at DATETIME NOT NULL,
            used_at DATETIME NULL,
            requested_ip VARCHAR(64) NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_password_resets_token (token_hash),
            INDEX idx_password_resets_user (user_type, user_id),
            INDEX idx_password_resets_email (email),
            INDEX idx_password_resets_expires (expires_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    echo "Upgrade de workflow concluido com sucesso.\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}

