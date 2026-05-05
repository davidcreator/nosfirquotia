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

    echo "Upgrade de comunicação e segurança concluído com sucesso.\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}

