<?php

declare(strict_types=1);

use NosfirQuotia\System\Library\Database;

define('NQ_ROOT', dirname(__DIR__));

require NQ_ROOT . '/vendor/autoload.php';

$configFile = NQ_ROOT . '/config/config.php';
if (!is_file($configFile)) {
    fwrite(STDERR, "Arquivo config/config.php nao encontrado.\n");
    exit(1);
}

$config = require $configFile;
$dbConfig = (array) ($config['db'] ?? []);

try {
    $db = new Database($dbConfig);

    $db->execute(
        'CREATE TABLE IF NOT EXISTS brand_manual_reports (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            quote_request_id INT UNSIGNED NOT NULL,
            admin_user_id INT UNSIGNED NOT NULL,
            schema_version VARCHAR(60) NOT NULL DEFAULT \'brand_manual_mvp_v1\',
            tool_source VARCHAR(80) NOT NULL DEFAULT \'brandmanual_tool\',
            generated_at DATETIME NULL,
            payload_json LONGTEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
            CONSTRAINT fk_brand_manual_reports_request FOREIGN KEY (quote_request_id) REFERENCES quote_requests (id) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT fk_brand_manual_reports_admin FOREIGN KEY (admin_user_id) REFERENCES admin_users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
            UNIQUE KEY uq_brand_manual_reports_request (quote_request_id),
            INDEX idx_brand_manual_reports_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    echo "Upgrade do manual da marca (MVP) concluido com sucesso.\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}
