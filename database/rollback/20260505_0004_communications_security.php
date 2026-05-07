<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

$migrationId = '20260505_0004_communications_security';
$description = 'Reversao de comunicacao e recuperacao de senha (destrutivo).';

try {
    $options = nqRollbackParseOptions($argv);
    nqRollbackGuardDestructiveApply($options, $migrationId, $description);

    $db = nqRollbackCreateDatabase();
    $db->transaction(static function (NosfirQuotia\System\Library\Database $database): void {
        nqRollbackDropTableIfExists($database, 'password_resets');
        nqRollbackDropTableIfExists($database, 'email_dispatch_logs');
    });

    echo "Rollback {$migrationId} executado com sucesso.\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}

