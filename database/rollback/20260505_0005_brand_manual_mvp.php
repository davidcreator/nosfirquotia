<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

$migrationId = '20260505_0005_brand_manual_mvp';
$description = 'Reversao de persistencia do manual da marca (destrutivo).';

try {
    $options = nqRollbackParseOptions($argv);
    nqRollbackGuardDestructiveApply($options, $migrationId, $description);

    $db = nqRollbackCreateDatabase();
    $db->transaction(static function (NosfirQuotia\System\Library\Database $database): void {
        nqRollbackDropTableIfExists($database, 'brand_manual_reports');
    });

    echo "Rollback {$migrationId} executado com sucesso.\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}

