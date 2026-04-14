<?php

declare(strict_types=1);

use AureaQuotia\System\Library\Database;
use AureaQuotia\System\Library\ReferencePriceImporter;

define('AQ_ROOT', dirname(__DIR__));

require AQ_ROOT . '/vendor/autoload.php';

$configFile = AQ_ROOT . '/config/config.php';
if (!is_file($configFile)) {
    fwrite(STDERR, "Arquivo config/config.php nao encontrado.\n");
    exit(1);
}

$config = require $configFile;
$dbConfig = (array) ($config['db'] ?? []);

try {
    $db = new Database($dbConfig);
    ensureReferenceSchema($db, $dbConfig);

    $importer = new ReferencePriceImporter($db);
    $importer->importFromJson(AQ_ROOT . '/database/reference_prices_2025.json');

    $stats = $db->fetch(
        'SELECT
            (SELECT COUNT(*) FROM reference_price_catalogs) AS catalogs_total,
            (SELECT COUNT(*) FROM reference_price_items) AS items_total'
    );

    echo "Importacao concluida.\n";
    echo 'Catalogos: ' . (int) ($stats['catalogs_total'] ?? 0) . "\n";
    echo 'Itens: ' . (int) ($stats['items_total'] ?? 0) . "\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}

function ensureReferenceSchema(Database $db, array $dbConfig): void
{
    $dbName = (string) ($dbConfig['database'] ?? '');
    if ($dbName === '') {
        throw new RuntimeException('Nome do banco ausente na configuracao.');
    }

    $db->execute(
        'CREATE TABLE IF NOT EXISTS reference_price_catalogs (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(20) NOT NULL,
            name VARCHAR(255) NOT NULL,
            subtitle VARCHAR(255) NULL,
            display_order INT UNSIGNED NOT NULL DEFAULT 0,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_reference_catalog_code (code)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS reference_price_items (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            catalog_id INT UNSIGNED NOT NULL,
            display_order INT UNSIGNED NOT NULL DEFAULT 0,
            group_name VARCHAR(255) NULL,
            reference_code VARCHAR(30) NULL,
            service_name VARCHAR(255) NOT NULL,
            min_price DECIMAL(12, 2) NULL,
            max_price DECIMAL(12, 2) NULL,
            min_price_label VARCHAR(60) NOT NULL,
            max_price_label VARCHAR(60) NOT NULL,
            currency CHAR(3) NOT NULL DEFAULT \'BRL\',
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_reference_items_catalog FOREIGN KEY (catalog_id) REFERENCES reference_price_catalogs (id) ON DELETE CASCADE ON UPDATE CASCADE,
            INDEX idx_reference_items_catalog (catalog_id),
            INDEX idx_reference_items_code (reference_code),
            INDEX idx_reference_items_name (service_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $hasColumn = $db->fetch(
        'SELECT 1 AS has_column
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = :schema_name
           AND TABLE_NAME = \'quotes\'
           AND COLUMN_NAME = \'reference_price_item_id\'
         LIMIT 1',
        ['schema_name' => $dbName]
    );

    if ($hasColumn === null) {
        $db->execute(
            'ALTER TABLE quotes
             ADD COLUMN reference_price_item_id INT UNSIGNED NULL AFTER category_id'
        );
    }

    $hasConstraint = $db->fetch(
        'SELECT 1 AS has_fk
         FROM information_schema.TABLE_CONSTRAINTS
         WHERE TABLE_SCHEMA = :schema_name
           AND TABLE_NAME = \'quotes\'
           AND CONSTRAINT_TYPE = \'FOREIGN KEY\'
           AND CONSTRAINT_NAME = \'fk_quotes_reference_item\'
         LIMIT 1',
        ['schema_name' => $dbName]
    );

    if ($hasConstraint === null) {
        $db->execute(
            'ALTER TABLE quotes
             ADD CONSTRAINT fk_quotes_reference_item
             FOREIGN KEY (reference_price_item_id)
             REFERENCES reference_price_items (id)
             ON DELETE SET NULL
             ON UPDATE CASCADE'
        );
    }
}
