<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

$migrationId = '20260505_0002_tax_features';
$description = 'Reversao de recursos fiscais por snapshot de schema.';

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
    $quoteReportTaxesExisted = nqRollbackRequireExistsFlag($indexedSnapshots, 'meta:table:quote_report_taxes');
    $taxSettingsExisted = nqRollbackRequireExistsFlag($indexedSnapshots, 'meta:table:tax_settings');
    $subtotalValueExisted = nqRollbackRequireExistsFlag($indexedSnapshots, 'meta:column:quote_reports:subtotal_value');
    $taxesTotalValueExisted = nqRollbackRequireExistsFlag($indexedSnapshots, 'meta:column:quote_reports:taxes_total_value');
    $showTaxDetailsExisted = nqRollbackRequireExistsFlag($indexedSnapshots, 'meta:column:quote_reports:show_tax_details');

    $db->transaction(static function (NosfirQuotia\System\Library\Database $database) use (
        $quoteReportTaxesExisted,
        $taxSettingsExisted,
        $subtotalValueExisted,
        $taxesTotalValueExisted,
        $showTaxDetailsExisted
    ): void {
        if (!$quoteReportTaxesExisted) {
            nqRollbackDropTableIfExists($database, 'quote_report_taxes');
        }

        if (!$taxSettingsExisted) {
            nqRollbackDropTableIfExists($database, 'tax_settings');
        }

        if (!$showTaxDetailsExisted) {
            nqRollbackDropColumnIfExists($database, 'quote_reports', 'show_tax_details');
        }

        if (!$taxesTotalValueExisted) {
            nqRollbackDropColumnIfExists($database, 'quote_reports', 'taxes_total_value');
        }

        if (!$subtotalValueExisted) {
            nqRollbackDropColumnIfExists($database, 'quote_reports', 'subtotal_value');
        }
    });

    echo "Rollback {$migrationId} executado com sucesso usando snapshots do run {$runId}.\n";
    exit(0);
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}
