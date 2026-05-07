<?php

declare(strict_types=1);

use NosfirQuotia\System\Library\Database;

define('NQ_ROOT', dirname(__DIR__));

require NQ_ROOT . '/vendor/autoload.php';
require NQ_ROOT . '/database/bootstrap_cli.php';

try {
    $dbConfig = nqLoadDbConfig(NQ_ROOT);
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

    if (!$hasColumn($db, 'quote_reports', 'subtotal_value')) {
        $db->execute('ALTER TABLE quote_reports ADD COLUMN subtotal_value DECIMAL(12, 2) NOT NULL DEFAULT 0 AFTER admin_user_id');
    }

    if (!$hasColumn($db, 'quote_reports', 'taxes_total_value')) {
        $db->execute('ALTER TABLE quote_reports ADD COLUMN taxes_total_value DECIMAL(12, 2) NOT NULL DEFAULT 0 AFTER subtotal_value');
    }

    if (!$hasColumn($db, 'quote_reports', 'show_tax_details')) {
        $db->execute('ALTER TABLE quote_reports ADD COLUMN show_tax_details TINYINT(1) NOT NULL DEFAULT 0 AFTER report_notes');
    }

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

    $db->transaction(static function (Database $database): void {
        $database->execute(
            'INSERT INTO tax_settings (id)
             VALUES (1)
             ON DUPLICATE KEY UPDATE id = id'
        );
    });

    echo "Upgrade fiscal concluido com sucesso.\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}

