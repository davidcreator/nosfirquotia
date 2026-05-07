<?php

declare(strict_types=1);

use NosfirQuotia\System\Library\Database;

define('NQ_ROOT', dirname(__DIR__));

require NQ_ROOT . '/vendor/autoload.php';
require NQ_ROOT . '/database/bootstrap_cli.php';

try {
    $options = nqParseMigrationOptions($argv);

    if ($options['mode'] === 'snapshot_coverage_env_check') {
        nqRunSnapshotCoverageEnvCheck($options);
        exit(0);
    }

    $manifest = nqLoadMigrationManifest(NQ_ROOT . '/database/migrations_manifest.php', NQ_ROOT);

    if ($options['mode'] === 'snapshot_coverage_report') {
        nqRunSnapshotCoverageReport($manifest, $options);
        exit(0);
    }

    $db = new Database(nqLoadDbConfig(NQ_ROOT));
    nqEnsureMigrationsTable($db);
    nqEnsureMigrationAuditSchema($db);

    $lockName = 'nq_schema_migration_runner';
    $acquired = nqAcquireMigrationLock($db, $lockName, 10);
    if (!$acquired) {
        throw new RuntimeException('Nao foi possivel adquirir lock de migracao. Outra execucao pode estar em andamento.');
    }

    try {
        $applied = nqLoadAppliedMigrations($db);
        $statusRows = nqBuildMigrationStatusRows($manifest, $applied);
        $unknownAppliedIds = nqFindUnknownAppliedMigrationIds($applied, $statusRows);

        if ($unknownAppliedIds !== []) {
            fwrite(
                STDERR,
                'Aviso: migracoes aplicadas fora do manifesto atual: ' . implode(', ', $unknownAppliedIds) . "\n"
            );
        }

        if ($options['mode'] === 'status') {
            nqPrintMigrationStatus($statusRows);
            exit(0);
        }

        if ($options['mode'] === 'history') {
            nqPrintMigrationReleaseHistory($db, 30);
            exit(0);
        }

        if ($options['mode'] === 'rollback_plan') {
            nqPrintRollbackPlan($db, $options['run_id']);
            exit(0);
        }

        if ($options['mode'] === 'snapshot_backfill') {
            nqRunSnapshotBackfill($db, $manifest, $options);
            exit(0);
        }

        if ($options['mode'] === 'rollback_audit') {
            nqRunRollbackAudit($manifest, (bool) ($options['strict'] ?? false));
            exit(0);
        }

        if ($options['mode'] === 'snapshot_coverage_audit') {
            nqRunSnapshotCoverageAudit(
                $db,
                $manifest,
                (bool) ($options['strict'] ?? false),
                is_string($options['run_id'] ?? null) ? $options['run_id'] : null
            );
            exit(0);
        }

        $drifts = array_values(array_filter(
            $statusRows,
            static fn (array $row): bool => $row['status'] === 'drift'
        ));

        if ($drifts !== [] && !$options['allow_drift']) {
            nqPrintMigrationStatus($statusRows);
            throw new RuntimeException('Foram detectadas migracoes com checksum divergente. Use --allow-drift para ignorar nesta execucao.');
        }

        $pending = nqResolvePendingMigrations($statusRows, $options['target']);
        $releaseContext = nqResolveReleaseContext($options);
        $backupAudit = nqResolveBackupAuditData(
            $db,
            $options,
            count($pending) > 0,
            (bool) $options['dry_run']
        );
        $releaseContext['backup_ref'] = $backupAudit['backup_ref'];
        $releaseContext['backup_verified_at'] = $backupAudit['backup_verified_at'];

        echo 'Release: ' . $releaseContext['release_version'] . ' | Autor: ' . $releaseContext['release_author'] . ' | Origem: ' . $releaseContext['release_source'] . "\n";
        if ($releaseContext['release_notes'] !== null && $releaseContext['release_notes'] !== '') {
            echo 'Notas: ' . $releaseContext['release_notes'] . "\n";
        }
        if ($releaseContext['backup_ref'] !== null && $releaseContext['backup_ref'] !== '') {
            $line = 'Backup: ' . $releaseContext['backup_ref'];
            if ($releaseContext['backup_verified_at'] !== null && $releaseContext['backup_verified_at'] !== '') {
                $line .= ' (validado em ' . $releaseContext['backup_verified_at'] . ')';
            }
            echo $line . "\n";
        }

        if ($pending === []) {
            if ($options['dry_run']) {
                echo "Nenhuma migracao pendente.\n";
                exit(0);
            }

            if (nqHasExplicitReleaseMetadata($options)) {
                $emptyRunId = nqCreateMigrationReleaseRun($db, $releaseContext, 0);
                nqFinalizeMigrationReleaseRun(
                    $db,
                    $emptyRunId,
                    'success',
                    0,
                    null,
                    null
                );
                echo "Nenhuma migracao pendente. Run de auditoria registrado: {$emptyRunId}\n";
            } else {
                echo "Nenhuma migracao pendente.\n";
            }
            exit(0);
        }

        echo 'Migracoes pendentes: ' . count($pending) . "\n";

        if ($options['dry_run']) {
            foreach ($pending as $migration) {
                echo '- [DRY-RUN] ' . $migration['id'] . ' :: ' . $migration['name'] . "\n";
            }
            exit(0);
        }

        $runId = nqCreateMigrationReleaseRun($db, $releaseContext, count($pending));
        echo "Run de auditoria: {$runId}\n";

        $appliedCount = 0;
        $sequenceNo = 0;
        $currentMigration = null;
        $runFinalized = false;

        try {
            foreach ($pending as $migration) {
                $currentMigration = $migration;
                $sequenceNo++;
                echo 'Aplicando ' . $migration['id'] . ' :: ' . $migration['name'] . " ...\n";

                $capturedSnapshots = nqCaptureMigrationRollbackSnapshot($db, $runId, $migration);
                if ($capturedSnapshots > 0) {
                    echo 'Snapshot de rollback capturado: ' . $capturedSnapshots . " registro(s)\n";
                }

                $startedAt = microtime(true);
                $result = nqRunMigrationScript($migration['absolute_script']);
                $runtimeMs = (int) round((microtime(true) - $startedAt) * 1000);

                if ($result['exit_code'] !== 0) {
                    nqRecordMigrationReleaseItem(
                        $db,
                        $runId,
                        $sequenceNo,
                        $migration,
                        'failed',
                        $runtimeMs,
                        $result['output']
                    );

                    $output = trim($result['output']);
                    if ($output !== '') {
                        fwrite(STDERR, $output . "\n");
                    }

                    throw new RuntimeException(
                        sprintf('Falha ao executar %s (exit=%d).', $migration['script'], $result['exit_code'])
                    );
                }

                nqMarkMigrationApplied(
                    $db,
                    $migration,
                    $runtimeMs,
                    $result['output'],
                    $runId,
                    $releaseContext
                );

                nqRecordMigrationReleaseItem(
                    $db,
                    $runId,
                    $sequenceNo,
                    $migration,
                    'applied',
                    $runtimeMs,
                    $result['output']
                );

                if (trim($result['output']) !== '') {
                    echo trim($result['output']) . "\n";
                }

                echo 'OK (' . $runtimeMs . " ms)\n";
                $appliedCount++;
            }

            nqFinalizeMigrationReleaseRun(
                $db,
                $runId,
                'success',
                $appliedCount,
                null,
                null
            );
            $runFinalized = true;
        } catch (Throwable $exception) {
            nqFinalizeMigrationReleaseRun(
                $db,
                $runId,
                'failed',
                $appliedCount,
                is_array($currentMigration) ? (string) ($currentMigration['id'] ?? null) : null,
                $exception->getMessage()
            );
            $runFinalized = true;
            throw $exception;
        } finally {
            if (!$runFinalized) {
                nqFinalizeMigrationReleaseRun(
                    $db,
                    $runId,
                    'failed',
                    $appliedCount,
                    is_array($currentMigration) ? (string) ($currentMigration['id'] ?? null) : null,
                    'Execucao encerrada sem status final explicito.'
                );
            }
        }

        echo "Migracoes aplicadas nesta execucao: {$appliedCount}\n";
        exit(0);
    } finally {
        nqReleaseMigrationLock($db, $lockName);
    }
} catch (Throwable $exception) {
    fwrite(STDERR, 'Erro: ' . $exception->getMessage() . "\n");
    exit(1);
}

/**
 * @return array{
 *   mode:string,
 *   dry_run:bool,
 *   target:?string,
 *   run_id:?string,
 *   migration_id:?string,
 *   overwrite_snapshot:bool,
 *   strict:bool,
 *   allow_drift:bool,
 *   require_backup:bool,
 *   release_version:?string,
 *   release_author:?string,
 *   release_source:?string,
 *   release_notes:?string,
 *   backup_ref:?string,
 *   backup_file:?string,
 *   output_file:?string,
 *   env_name:?string,
 *   all_envs:bool
 * }
 */
function nqParseMigrationOptions(array $argv): array
{
    $options = [
        'mode' => 'up',
        'dry_run' => false,
        'target' => null,
        'run_id' => null,
        'migration_id' => null,
        'overwrite_snapshot' => false,
        'strict' => false,
        'allow_drift' => false,
        'require_backup' => false,
        'release_version' => null,
        'release_author' => null,
        'release_source' => null,
        'release_notes' => null,
        'backup_ref' => null,
        'backup_file' => null,
        'output_file' => null,
        'env_name' => null,
        'all_envs' => false,
    ];

    foreach (array_slice($argv, 1) as $argument) {
        if ($argument === '--help' || $argument === '-h') {
            nqPrintMigrationHelp();
            exit(0);
        }

        if ($argument === 'status' || $argument === '--status') {
            $options['mode'] = 'status';
            continue;
        }

        if ($argument === 'history' || $argument === '--history') {
            $options['mode'] = 'history';
            continue;
        }

        if ($argument === 'rollback-plan' || $argument === '--rollback-plan') {
            $options['mode'] = 'rollback_plan';
            continue;
        }

        if ($argument === 'snapshot-backfill' || $argument === '--snapshot-backfill') {
            $options['mode'] = 'snapshot_backfill';
            continue;
        }

        if ($argument === 'rollback-audit' || $argument === '--rollback-audit') {
            $options['mode'] = 'rollback_audit';
            continue;
        }

        if ($argument === 'snapshot-coverage-audit' || $argument === '--snapshot-coverage-audit') {
            $options['mode'] = 'snapshot_coverage_audit';
            continue;
        }

        if ($argument === 'snapshot-coverage-report' || $argument === '--snapshot-coverage-report') {
            $options['mode'] = 'snapshot_coverage_report';
            continue;
        }

        if ($argument === 'snapshot-coverage-env-check' || $argument === '--snapshot-coverage-env-check') {
            $options['mode'] = 'snapshot_coverage_env_check';
            continue;
        }

        if ($argument === 'up') {
            $options['mode'] = 'up';
            continue;
        }

        if ($argument === '--dry-run') {
            $options['dry_run'] = true;
            continue;
        }

        if ($argument === '--allow-drift') {
            $options['allow_drift'] = true;
            continue;
        }

        if ($argument === '--require-backup') {
            $options['require_backup'] = true;
            continue;
        }

        if ($argument === '--overwrite-snapshot') {
            $options['overwrite_snapshot'] = true;
            continue;
        }

        if ($argument === '--strict') {
            $options['strict'] = true;
            continue;
        }

        if (str_starts_with($argument, '--release=')) {
            $value = trim(substr($argument, 10));
            $options['release_version'] = $value !== '' ? $value : null;
            continue;
        }

        if (str_starts_with($argument, '--author=')) {
            $value = trim(substr($argument, 9));
            $options['release_author'] = $value !== '' ? $value : null;
            continue;
        }

        if (str_starts_with($argument, '--source=')) {
            $value = trim(substr($argument, 9));
            $options['release_source'] = $value !== '' ? $value : null;
            continue;
        }

        if (str_starts_with($argument, '--notes=')) {
            $value = trim(substr($argument, 8));
            $options['release_notes'] = $value !== '' ? $value : null;
            continue;
        }

        if (str_starts_with($argument, '--backup-ref=')) {
            $value = trim(substr($argument, 13));
            $options['backup_ref'] = $value !== '' ? $value : null;
            continue;
        }

        if (str_starts_with($argument, '--backup-file=')) {
            $value = trim(substr($argument, 14));
            $options['backup_file'] = $value !== '' ? $value : null;
            continue;
        }

        if (str_starts_with($argument, '--output=')) {
            $value = trim(substr($argument, 9));
            $options['output_file'] = $value !== '' ? $value : null;
            continue;
        }

        if (str_starts_with($argument, '--env=')) {
            $value = trim(substr($argument, 6));
            $options['env_name'] = $value !== '' ? $value : null;
            continue;
        }

        if ($argument === '--all-envs') {
            $options['all_envs'] = true;
            continue;
        }

        if (str_starts_with($argument, '--run-id=')) {
            $value = trim(substr($argument, 9));
            $options['run_id'] = $value !== '' ? $value : null;
            continue;
        }

        if (str_starts_with($argument, '--migration-id=')) {
            $value = trim(substr($argument, 15));
            $options['migration_id'] = $value !== '' ? $value : null;
            continue;
        }

        if (str_starts_with($argument, '--target=')) {
            $target = trim(substr($argument, 9));
            $options['target'] = $target !== '' ? $target : null;
            continue;
        }

        throw new RuntimeException('Argumento invalido: ' . $argument . '. Use --help para ver opcoes.');
    }

    if ($options['all_envs'] && is_string($options['env_name']) && trim($options['env_name']) !== '') {
        throw new RuntimeException('Use apenas uma opcao de ambiente: --env=<nome> ou --all-envs.');
    }

    if (
        !in_array($options['mode'], ['snapshot_coverage_report', 'snapshot_coverage_env_check'], true)
        && (
            $options['all_envs']
            || (is_string($options['env_name']) && trim($options['env_name']) !== '')
        )
    ) {
        throw new RuntimeException('As opcoes --env/--all-envs sao suportadas apenas em snapshot-coverage-report e snapshot-coverage-env-check.');
    }

    return $options;
}

function nqPrintMigrationHelp(): void
{
    echo "Uso:\n";
    echo "  php database/migrate.php [up] [--dry-run] [--target=<migration_id>] [--allow-drift] [--release=<versao>] [--author=<autor>] [--source=<origem>] [--notes=<notas>] [--require-backup] [--backup-ref=<id>] [--backup-file=<arquivo>]\n";
    echo "  php database/migrate.php status\n";
    echo "  php database/migrate.php history\n";
    echo "  php database/migrate.php rollback-plan [--run-id=<run_id>]\n";
    echo "  php database/migrate.php snapshot-backfill --run-id=<run_id> [--migration-id=<migration_id>] [--overwrite-snapshot]\n";
    echo "  php database/migrate.php rollback-audit [--strict]\n";
    echo "  php database/migrate.php snapshot-coverage-audit [--strict] [--run-id=<run_id>]\n";
    echo "  php database/migrate.php snapshot-coverage-report [--run-id=<run_id>] [--output=<arquivo.md>] [--env=<nome>|--all-envs]\n";
    echo "  php database/migrate.php snapshot-coverage-env-check [--env=<nome>|--all-envs] [--strict]\n";
    echo "\n";
    echo "Opcoes:\n";
    echo "  status         Lista estado das migracoes (applied/pending/drift)\n";
    echo "  history        Lista historico de releases executadas\n";
    echo "  rollback-plan  Exibe roteiro assistido de rollback para um run (ultimo run bem-sucedido por padrao)\n";
    echo "  snapshot-backfill  Preenche snapshots faltantes para rollback por run legado\n";
    echo "  rollback-audit  Valida cobertura de rollback do manifesto de migracoes\n";
    echo "  snapshot-coverage-audit  Valida cobertura real de snapshots por run/migracao aplicada\n";
    echo "  snapshot-coverage-report  Gera dashboard historico de conformidade em Markdown\n";
    echo "  snapshot-coverage-env-check  Valida conectividade de ambientes alvo para report multiambiente\n";
    echo "  --dry-run      Mostra o plano sem executar scripts\n";
    echo "  --target=ID    Aplica migracoes pendentes ate o ID informado (inclusive)\n";
    echo "  --allow-drift  Ignora divergencia de checksum em migracoes ja aplicadas\n";
    echo "  --release=V    Versao da release no formato dd/mm/aaaa\n";
    echo "  --author=N     Autor/responsavel da execucao da release\n";
    echo "  --source=S     Origem da execucao (ex.: cli, ci, deploy)\n";
    echo "  --notes=T      Notas livres da release (resumo da mudanca)\n";
    echo "  --require-backup  Exige validacao de backup antes de aplicar migracoes\n";
    echo "  --backup-ref=R    Referencia do backup (snapshot/chamado/ID externo)\n";
    echo "  --backup-file=F   Caminho local do arquivo de backup para validacao automatica\n";
    echo "  --run-id=ID       Run de release para rollback-plan/snapshot-backfill\n";
    echo "  --migration-id=ID Limita snapshot-backfill a uma migracao especifica\n";
    echo "  --output=ARQ      Caminho do arquivo .md para snapshot-coverage-report\n";
    echo "  --env=NOME        Ambiente de configuracao alvo para snapshot-coverage-report\n";
    echo "  --all-envs        Consolida snapshot-coverage-report para todos os ambientes do config\n";
    echo "  --overwrite-snapshot  Sobrescreve snapshot existente durante backfill\n";
    echo "  --strict       Em audits/reports, trata avisos/pendencias como bloqueantes\n";
    echo "\n";
    echo "Fallback por ambiente:\n";
    echo "  NQ_RELEASE_VERSION, NQ_RELEASE_AUTHOR, NQ_RELEASE_SOURCE, NQ_RELEASE_NOTES\n";
    echo "  NQ_REQUIRE_BACKUP, NQ_RELEASE_BACKUP_REF, NQ_RELEASE_BACKUP_FILE\n";
    echo "  snapshot-coverage-report DB overrides: NQ_DB_HOST_<ENV>, NQ_DB_PORT_<ENV>, NQ_DB_DATABASE_<ENV>, NQ_DB_USERNAME_<ENV>, NQ_DB_PASSWORD_<ENV>\n";
    echo "  senha vazia explicita: NQ_DB_PASSWORD_<ENV>_EMPTY=1 (e NQ_DB_PASSWORD_EMPTY=1 para ambiente ativo)\n";
    echo "  (para ambiente ativo em modo unico: NQ_DB_HOST, NQ_DB_PORT, NQ_DB_DATABASE, NQ_DB_USERNAME, NQ_DB_PASSWORD)\n";
}

/**
 * @param array{
 *   release_version:?string,
 *   release_author:?string,
 *   release_source:?string,
 *   release_notes:?string,
 *   backup_ref:?string,
 *   backup_file:?string
 * } $options
 */
function nqHasExplicitReleaseMetadata(array $options): bool
{
    $optionCandidates = [
        $options['release_version'] ?? null,
        $options['release_author'] ?? null,
        $options['release_source'] ?? null,
        $options['release_notes'] ?? null,
        $options['backup_ref'] ?? null,
        $options['backup_file'] ?? null,
    ];

    foreach ($optionCandidates as $candidate) {
        if (is_string($candidate) && trim($candidate) !== '') {
            return true;
        }
    }

    $envCandidates = [
        getenv('NQ_RELEASE_VERSION'),
        getenv('NQ_RELEASE_AUTHOR'),
        getenv('NQ_RELEASE_SOURCE'),
        getenv('NQ_RELEASE_NOTES'),
        getenv('NQ_RELEASE_BACKUP_REF'),
        getenv('NQ_RELEASE_BACKUP_FILE'),
    ];

    foreach ($envCandidates as $candidate) {
        if ($candidate !== false && trim((string) $candidate) !== '') {
            return true;
        }
    }

    return false;
}

/**
 * @param array{
 *   release_version:?string,
 *   release_author:?string,
 *   release_source:?string,
 *   release_notes:?string,
 *   backup_ref:?string,
 *   backup_file:?string,
 *   require_backup:bool
 * } $options
 * @return array{
 *   release_version:string,
 *   release_author:string,
  *   release_source:string,
 *   release_notes:?string,
 *   backup_ref:?string,
 *   backup_verified_at:?string
 * }
 */
function nqResolveReleaseContext(array $options): array
{
    $releaseVersionRaw = nqFirstNonEmptyString(
        [
            $options['release_version'] ?? null,
            getenv('NQ_RELEASE_VERSION') !== false ? (string) getenv('NQ_RELEASE_VERSION') : null,
        ],
        date('d/m/Y')
    );
    if ($releaseVersionRaw === null) {
        throw new RuntimeException('Versao de release nao informada.');
    }

    $releaseVersion = nqValidateReleaseVersion($releaseVersionRaw);

    $releaseAuthor = nqFirstNonEmptyString(
        [
            $options['release_author'] ?? null,
            getenv('NQ_RELEASE_AUTHOR') !== false ? (string) getenv('NQ_RELEASE_AUTHOR') : null,
        ],
        nqExecutionUser()
    );

    $releaseSource = nqFirstNonEmptyString(
        [
            $options['release_source'] ?? null,
            getenv('NQ_RELEASE_SOURCE') !== false ? (string) getenv('NQ_RELEASE_SOURCE') : null,
        ],
        'cli'
    );

    $releaseNotes = nqFirstNonEmptyString(
        [
            $options['release_notes'] ?? null,
            getenv('NQ_RELEASE_NOTES') !== false ? (string) getenv('NQ_RELEASE_NOTES') : null,
        ],
        null
    );

    return [
        'release_version' => $releaseVersion,
        'release_author' => $releaseAuthor,
        'release_source' => $releaseSource,
        'release_notes' => $releaseNotes,
        'backup_ref' => null,
        'backup_verified_at' => null,
    ];
}

function nqValidateReleaseVersion(string $releaseVersion): string
{
    $value = trim($releaseVersion);
    if (!preg_match('/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/', $value, $matches)) {
        throw new RuntimeException(
            'Formato de release invalido. Use dd/mm/aaaa (ex.: 06/05/2026).'
        );
    }

    $day = (int) $matches[1];
    $month = (int) $matches[2];
    $year = (int) $matches[3];

    if (!checkdate($month, $day, $year)) {
        throw new RuntimeException(
            'Data de release invalida. Use uma data real no formato dd/mm/aaaa (ex.: 06/05/2026).'
        );
    }

    return $value;
}

/**
 * @param array<int, ?string> $candidates
 */
function nqFirstNonEmptyString(array $candidates, ?string $fallback): ?string
{
    foreach ($candidates as $candidate) {
        if (!is_string($candidate)) {
            continue;
        }

        $value = trim($candidate);
        if ($value !== '') {
            return $value;
        }
    }

    if ($fallback === null) {
        return null;
    }

    $fallback = trim($fallback);

    return $fallback !== '' ? $fallback : null;
}

function nqExecutionUser(): string
{
    $candidates = [
        getenv('USERNAME') !== false ? (string) getenv('USERNAME') : null,
        getenv('USER') !== false ? (string) getenv('USER') : null,
        get_current_user(),
    ];

    foreach ($candidates as $candidate) {
        if (!is_string($candidate)) {
            continue;
        }

        $value = trim($candidate);
        if ($value !== '') {
            return $value;
        }
    }

    return 'unknown';
}

/**
 * @param array{
 *   require_backup:bool,
 *   backup_ref:?string,
 *   backup_file:?string
 * } $options
 * @return array{
 *   backup_ref:?string,
 *   backup_verified_at:?string
 * }
 */
function nqResolveBackupAuditData(Database $db, array $options, bool $hasPendingMigrations, bool $dryRun): array
{
    $backupRef = nqFirstNonEmptyString(
        [
            $options['backup_ref'] ?? null,
            getenv('NQ_RELEASE_BACKUP_REF') !== false ? (string) getenv('NQ_RELEASE_BACKUP_REF') : null,
        ],
        null
    );

    $backupFile = nqFirstNonEmptyString(
        [
            $options['backup_file'] ?? null,
            getenv('NQ_RELEASE_BACKUP_FILE') !== false ? (string) getenv('NQ_RELEASE_BACKUP_FILE') : null,
        ],
        null
    );

    $requireBackup = nqShouldRequireBackup($options);

    $backupVerifiedAt = null;
    if ($backupFile !== null) {
        $resolvedPath = realpath($backupFile);
        if ($resolvedPath === false || !is_file($resolvedPath)) {
            throw new RuntimeException('Backup file invalido. Arquivo nao encontrado: ' . $backupFile);
        }

        if (!is_readable($resolvedPath)) {
            throw new RuntimeException('Backup file invalido. Arquivo sem permissao de leitura: ' . $resolvedPath);
        }

        $size = filesize($resolvedPath);
        if (!is_int($size) || $size <= 0) {
            throw new RuntimeException('Backup file invalido. Arquivo vazio ou inacessivel: ' . $resolvedPath);
        }

        if ($backupRef === null) {
            $backupRef = basename($resolvedPath);
        }

        $nowRow = $db->fetch('SELECT CURRENT_TIMESTAMP AS backup_verified_at');
        $backupVerifiedAt = trim((string) ($nowRow['backup_verified_at'] ?? ''));
        if ($backupVerifiedAt === '') {
            $backupVerifiedAt = date('Y-m-d H:i:s');
        }
    }

    if ($requireBackup && $hasPendingMigrations && !$dryRun) {
        if ($backupFile === null) {
            throw new RuntimeException(
                'Backup obrigatorio: informe --backup-file=<arquivo> valido (ou NQ_RELEASE_BACKUP_FILE) para validacao automatica antes de aplicar migracoes.'
            );
        }
    }

    return [
        'backup_ref' => $backupRef,
        'backup_verified_at' => $backupVerifiedAt,
    ];
}

/**
 * @param array{require_backup:bool} $options
 */
function nqShouldRequireBackup(array $options): bool
{
    if (($options['require_backup'] ?? false) === true) {
        return true;
    }

    $raw = getenv('NQ_REQUIRE_BACKUP');
    if ($raw === false) {
        return false;
    }

    $value = strtolower(trim((string) $raw));

    return in_array($value, ['1', 'true', 'yes', 'on'], true);
}

/**
 * @return array<int, array{
 *   id:string,
 *   name:string,
 *   script:string,
 *   absolute_script:string,
 *   checksum:string,
 *   rollback_strategy:string,
 *   rollback_script:string,
 *   rollback_absolute_script:string,
 *   rollback_requires_snapshot:bool
 * }>
 */
function nqLoadMigrationManifest(string $manifestPath, string $rootPath): array
{
    if (!is_file($manifestPath)) {
        throw new RuntimeException('Manifesto de migracoes nao encontrado: ' . $manifestPath);
    }

    $manifest = require $manifestPath;
    if (!is_array($manifest)) {
        throw new RuntimeException('Manifesto de migracoes invalido.');
    }

    $normalized = [];
    $ids = [];

    foreach ($manifest as $index => $migration) {
        if (!is_array($migration)) {
            throw new RuntimeException('Entrada invalida no manifesto de migracoes na posicao ' . $index . '.');
        }

        $id = trim((string) ($migration['id'] ?? ''));
        $name = trim((string) ($migration['name'] ?? ''));
        $script = trim((string) ($migration['script'] ?? ''));
        $rollbackStrategy = strtolower(trim((string) ($migration['rollback_strategy'] ?? 'snapshot')));
        if (!in_array($rollbackStrategy, ['snapshot', 'destructive', 'manual'], true)) {
            throw new RuntimeException('rollback_strategy invalida para migracao ' . $id . '. Use snapshot|destructive|manual.');
        }

        $defaultRollbackScript = 'database/rollback/' . $id . '.php';
        $rollbackScript = trim((string) ($migration['rollback_script'] ?? $defaultRollbackScript));
        if ($rollbackScript === '') {
            throw new RuntimeException('rollback_script invalido para migracao ' . $id . '.');
        }

        $rollbackRequiresSnapshot = array_key_exists('rollback_requires_snapshot', $migration)
            ? (bool) $migration['rollback_requires_snapshot']
            : $rollbackStrategy === 'snapshot';

        if ($id === '' || $name === '' || $script === '') {
            throw new RuntimeException('Migracao invalida no manifesto (id/name/script obrigatorios).');
        }

        if (isset($ids[$id])) {
            throw new RuntimeException('ID de migracao duplicado no manifesto: ' . $id);
        }
        $ids[$id] = true;

        $absoluteScript = $rootPath . '/' . ltrim(str_replace('\\', '/', $script), '/');
        if (!is_file($absoluteScript)) {
            throw new RuntimeException('Script de migracao nao encontrado: ' . $script);
        }

        $rollbackAbsoluteScript = $rootPath . '/' . ltrim(str_replace('\\', '/', $rollbackScript), '/');
        if (!is_file($rollbackAbsoluteScript)) {
            throw new RuntimeException('Script de rollback nao encontrado para migracao ' . $id . ': ' . $rollbackScript);
        }

        $checksum = hash_file('sha256', $absoluteScript);
        if (!is_string($checksum) || $checksum === '') {
            throw new RuntimeException('Nao foi possivel calcular checksum da migracao: ' . $script);
        }

        $normalized[] = [
            'id' => $id,
            'name' => $name,
            'script' => $script,
            'absolute_script' => $absoluteScript,
            'checksum' => $checksum,
            'rollback_strategy' => $rollbackStrategy,
            'rollback_script' => $rollbackScript,
            'rollback_absolute_script' => $rollbackAbsoluteScript,
            'rollback_requires_snapshot' => $rollbackRequiresSnapshot,
        ];
    }

    return $normalized;
}

function nqEnsureMigrationsTable(Database $db): void
{
    $db->execute(
        'CREATE TABLE IF NOT EXISTS schema_migrations (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            migration_id VARCHAR(120) NOT NULL,
            migration_name VARCHAR(255) NOT NULL,
            script_path VARCHAR(255) NOT NULL,
            checksum CHAR(64) NOT NULL,
            runtime_ms INT UNSIGNED NOT NULL DEFAULT 0,
            output_excerpt TEXT NULL,
            applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_schema_migrations_id (migration_id),
            INDEX idx_schema_migrations_applied_at (applied_at)
         ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );
}

function nqEnsureMigrationAuditSchema(Database $db): void
{
    nqEnsureTableColumn(
        $db,
        'schema_migrations',
        'release_run_id',
        'ALTER TABLE schema_migrations ADD COLUMN release_run_id CHAR(36) NULL AFTER output_excerpt'
    );

    nqEnsureTableColumn(
        $db,
        'schema_migrations',
        'release_version',
        'ALTER TABLE schema_migrations ADD COLUMN release_version VARCHAR(120) NULL AFTER release_run_id'
    );

    nqEnsureTableColumn(
        $db,
        'schema_migrations',
        'release_author',
        'ALTER TABLE schema_migrations ADD COLUMN release_author VARCHAR(120) NULL AFTER release_version'
    );

    nqEnsureTableColumn(
        $db,
        'schema_migrations',
        'release_source',
        'ALTER TABLE schema_migrations ADD COLUMN release_source VARCHAR(120) NULL AFTER release_author'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS schema_migration_releases (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            run_id CHAR(36) NOT NULL,
            release_version VARCHAR(120) NOT NULL,
            release_author VARCHAR(120) NULL,
            release_source VARCHAR(120) NOT NULL DEFAULT \'cli\',
            release_notes TEXT NULL,
            backup_ref VARCHAR(255) NULL,
            backup_verified_at DATETIME NULL,
            planned_migrations INT UNSIGNED NOT NULL DEFAULT 0,
            applied_migrations INT UNSIGNED NOT NULL DEFAULT 0,
            status VARCHAR(20) NOT NULL DEFAULT \'running\',
            failed_migration_id VARCHAR(120) NULL,
            error_message VARCHAR(500) NULL,
            executed_host VARCHAR(160) NULL,
            php_binary VARCHAR(255) NULL,
            started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            finished_at DATETIME NULL,
            UNIQUE KEY uq_schema_migration_releases_run (run_id),
            INDEX idx_schema_migration_releases_version (release_version),
            INDEX idx_schema_migration_releases_status (status),
            INDEX idx_schema_migration_releases_started (started_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    nqEnsureTableColumn(
        $db,
        'schema_migration_releases',
        'backup_ref',
        'ALTER TABLE schema_migration_releases ADD COLUMN backup_ref VARCHAR(255) NULL AFTER release_notes'
    );

    nqEnsureTableColumn(
        $db,
        'schema_migration_releases',
        'backup_verified_at',
        'ALTER TABLE schema_migration_releases ADD COLUMN backup_verified_at DATETIME NULL AFTER backup_ref'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS schema_migration_release_items (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            run_id CHAR(36) NOT NULL,
            sequence_no INT UNSIGNED NOT NULL,
            migration_id VARCHAR(120) NOT NULL,
            migration_name VARCHAR(255) NOT NULL,
            script_path VARCHAR(255) NOT NULL,
            checksum CHAR(64) NOT NULL,
            status VARCHAR(20) NOT NULL,
            runtime_ms INT UNSIGNED NULL,
            output_excerpt TEXT NULL,
            executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_schema_migration_release_items_run (run_id),
            INDEX idx_schema_migration_release_items_migration (migration_id),
            INDEX idx_schema_migration_release_items_executed (executed_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    $db->execute(
        'CREATE TABLE IF NOT EXISTS schema_migration_rollback_snapshots (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            run_id CHAR(36) NOT NULL,
            migration_id VARCHAR(120) NOT NULL,
            entity_key VARCHAR(191) NOT NULL,
            snapshot_json LONGTEXT NOT NULL,
            snapshot_origin VARCHAR(20) NOT NULL DEFAULT \'runtime\',
            captured_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_schema_migration_rollback_snapshots_entity (run_id, migration_id, entity_key),
            INDEX idx_schema_migration_rollback_snapshots_run (run_id),
            INDEX idx_schema_migration_rollback_snapshots_migration (migration_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
    );

    nqEnsureTableColumn(
        $db,
        'schema_migration_rollback_snapshots',
        'snapshot_origin',
        'ALTER TABLE schema_migration_rollback_snapshots ADD COLUMN snapshot_origin VARCHAR(20) NOT NULL DEFAULT \'runtime\' AFTER snapshot_json'
    );
}

function nqEnsureTableColumn(Database $db, string $tableName, string $columnName, string $alterSql): void
{
    if (nqTableHasColumn($db, $tableName, $columnName)) {
        return;
    }

    try {
        $db->execute($alterSql);
    } catch (Throwable $exception) {
        if (nqTableHasColumn($db, $tableName, $columnName)) {
            return;
        }

        if (str_contains(strtolower($exception->getMessage()), 'duplicate column')) {
            return;
        }

        throw $exception;
    }
}

function nqTableExists(Database $db, string $tableName): bool
{
    $row = $db->fetch(
        'SELECT COUNT(*) AS total
         FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table_name',
        [
            'table_name' => $tableName,
        ]
    );

    return (int) ($row['total'] ?? 0) > 0;
}

function nqTableHasColumn(Database $db, string $tableName, string $columnName): bool
{
    $row = $db->fetch(
        'SELECT COUNT(*) AS total
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table_name
           AND COLUMN_NAME = :column_name',
        [
            'table_name' => $tableName,
            'column_name' => $columnName,
        ]
    );

    return (int) ($row['total'] ?? 0) > 0;
}

function nqAcquireMigrationLock(Database $db, string $lockName, int $timeoutSeconds): bool
{
    $row = $db->fetch(
        'SELECT GET_LOCK(:lock_name, :timeout_seconds) AS lock_result',
        [
            'lock_name' => $lockName,
            'timeout_seconds' => $timeoutSeconds,
        ]
    );

    return (int) ($row['lock_result'] ?? 0) === 1;
}

function nqReleaseMigrationLock(Database $db, string $lockName): void
{
    try {
        $db->fetch(
            'SELECT RELEASE_LOCK(:lock_name) AS release_result',
            ['lock_name' => $lockName]
        );
    } catch (Throwable) {
        // lock release best-effort
    }
}

/**
 * @return array<string, array{
 *   migration_id:string,
 *   checksum:string,
 *   applied_at:string,
 *   script_path:string,
 *   release_run_id:string,
 *   release_version:string
 * }>
 */
function nqLoadAppliedMigrations(Database $db): array
{
    $rows = $db->fetchAll(
        'SELECT migration_id, checksum, applied_at, script_path, COALESCE(release_run_id, \'\') AS release_run_id, COALESCE(release_version, \'\') AS release_version
         FROM schema_migrations
         ORDER BY migration_id ASC'
    );

    $indexed = [];
    foreach ($rows as $row) {
        $id = (string) ($row['migration_id'] ?? '');
        if ($id === '') {
            continue;
        }

        $indexed[$id] = [
            'migration_id' => $id,
            'checksum' => (string) ($row['checksum'] ?? ''),
            'applied_at' => (string) ($row['applied_at'] ?? ''),
            'script_path' => (string) ($row['script_path'] ?? ''),
            'release_run_id' => (string) ($row['release_run_id'] ?? ''),
            'release_version' => (string) ($row['release_version'] ?? ''),
        ];
    }

    return $indexed;
}

/**
 * @param array<int, array{id:string,name:string,script:string,absolute_script:string,checksum:string}> $manifest
 * @param array<string, array{
 *   migration_id:string,
 *   checksum:string,
 *   applied_at:string,
 *   script_path:string,
 *   release_run_id:string,
 *   release_version:string
 * }> $applied
 * @return array<int, array{
 *   id:string,
 *   name:string,
 *   script:string,
 *   absolute_script:string,
 *   checksum:string,
 *   status:string,
 *   applied_at:?string,
 *   applied_checksum:?string,
 *   applied_release_run_id:?string,
 *   applied_release_version:?string
 * }>
 */
function nqBuildMigrationStatusRows(array $manifest, array $applied): array
{
    $rows = [];

    foreach ($manifest as $migration) {
        $appliedRow = $applied[$migration['id']] ?? null;
        $status = 'pending';
        $appliedAt = null;
        $appliedChecksum = null;
        $appliedReleaseRunId = null;
        $appliedReleaseVersion = null;

        if ($appliedRow !== null) {
            $appliedAt = $appliedRow['applied_at'];
            $appliedChecksum = $appliedRow['checksum'];
            $appliedReleaseRunId = $appliedRow['release_run_id'] !== '' ? $appliedRow['release_run_id'] : null;
            $appliedReleaseVersion = $appliedRow['release_version'] !== '' ? $appliedRow['release_version'] : null;
            $status = hash_equals($migration['checksum'], $appliedChecksum) ? 'applied' : 'drift';
        }

        $rows[] = [
            'id' => $migration['id'],
            'name' => $migration['name'],
            'script' => $migration['script'],
            'absolute_script' => $migration['absolute_script'],
            'checksum' => $migration['checksum'],
            'status' => $status,
            'applied_at' => $appliedAt,
            'applied_checksum' => $appliedChecksum,
            'applied_release_run_id' => $appliedReleaseRunId,
            'applied_release_version' => $appliedReleaseVersion,
        ];
    }

    return $rows;
}

/**
 * @param array<int, array{
 *   id:string,
 *   name:string,
 *   script:string,
 *   absolute_script:string,
 *   checksum:string,
 *   status:string,
 *   applied_at:?string,
 *   applied_checksum:?string,
 *   applied_release_run_id:?string,
 *   applied_release_version:?string
 * }> $rows
 */
function nqPrintMigrationStatus(array $rows): void
{
    echo "Estado das migracoes:\n";
    foreach ($rows as $row) {
        $line = '- [' . strtoupper($row['status']) . '] ' . $row['id'] . ' :: ' . $row['name'];

        if ($row['applied_at'] !== null && $row['applied_at'] !== '') {
            $line .= ' (aplicada em ' . $row['applied_at'] . ')';
        }

        $releaseVersion = trim((string) ($row['applied_release_version'] ?? ''));
        if ($releaseVersion !== '') {
            $line .= ' [release=' . $releaseVersion . ']';
        }

        if ($row['status'] === 'drift') {
            $line .= ' [checksum divergente]';
        }

        echo $line . "\n";
    }
}

function nqPrintMigrationReleaseHistory(Database $db, int $limit = 20): void
{
    $limit = max(1, min(200, $limit));
    $rows = $db->fetchAll(
        'SELECT
            run_id,
            release_version,
            release_author,
            release_source,
            backup_ref,
            backup_verified_at,
            planned_migrations,
            applied_migrations,
            status,
            started_at,
            finished_at,
            failed_migration_id
         FROM schema_migration_releases
         ORDER BY started_at DESC
         LIMIT ' . (int) $limit
    );

    if ($rows === []) {
        echo "Nenhuma release de migracao registrada.\n";
        return;
    }

    echo "Historico de releases de migracao:\n";
    foreach ($rows as $row) {
        $line = sprintf(
            '- [%s] %s | run=%s | autor=%s | origem=%s | %d/%d | inicio=%s',
            strtoupper((string) ($row['status'] ?? 'unknown')),
            (string) ($row['release_version'] ?? ''),
            (string) ($row['run_id'] ?? ''),
            (string) ($row['release_author'] ?? 'n/a'),
            (string) ($row['release_source'] ?? 'n/a'),
            (int) ($row['applied_migrations'] ?? 0),
            (int) ($row['planned_migrations'] ?? 0),
            (string) ($row['started_at'] ?? '')
        );

        $finishedAt = trim((string) ($row['finished_at'] ?? ''));
        if ($finishedAt !== '') {
            $line .= ' | fim=' . $finishedAt;
        }

        $failedMigration = trim((string) ($row['failed_migration_id'] ?? ''));
        if ($failedMigration !== '') {
            $line .= ' | falha=' . $failedMigration;
        }

        $backupRef = trim((string) ($row['backup_ref'] ?? ''));
        if ($backupRef !== '') {
            $line .= ' | backup=' . $backupRef;
            $backupVerifiedAt = trim((string) ($row['backup_verified_at'] ?? ''));
            if ($backupVerifiedAt !== '') {
                $line .= ' @' . $backupVerifiedAt;
            }
        }

        echo $line . "\n";
    }
}

function nqPrintRollbackPlan(Database $db, ?string $runId): void
{
    $releaseRow = nqResolveRollbackPlanReleaseRun($db, $runId);
    if ($releaseRow === null) {
        throw new RuntimeException('Nenhum run de release encontrado para gerar rollback-plan.');
    }

    $items = $db->fetchAll(
        'SELECT
            sequence_no,
            migration_id,
            migration_name,
            script_path,
            status,
            runtime_ms,
            executed_at
         FROM schema_migration_release_items
         WHERE run_id = :run_id
           AND status = :status
         ORDER BY sequence_no ASC',
        [
            'run_id' => (string) ($releaseRow['run_id'] ?? ''),
            'status' => 'applied',
        ]
    );

    echo "Rollback Plan (assistido/manual):\n";
    echo 'Release: ' . (string) ($releaseRow['release_version'] ?? '') . ' | run=' . (string) ($releaseRow['run_id'] ?? '') . "\n";
    echo 'Autor: ' . (string) ($releaseRow['release_author'] ?? 'n/a') . ' | Origem: ' . (string) ($releaseRow['release_source'] ?? 'n/a') . "\n";
    echo 'Inicio: ' . (string) ($releaseRow['started_at'] ?? '') . ' | Fim: ' . (string) ($releaseRow['finished_at'] ?? '') . "\n";

    $backupRef = trim((string) ($releaseRow['backup_ref'] ?? ''));
    $backupVerifiedAt = trim((string) ($releaseRow['backup_verified_at'] ?? ''));
    if ($backupRef !== '') {
        $line = 'Backup referenciado: ' . $backupRef;
        if ($backupVerifiedAt !== '') {
            $line .= ' (validado em ' . $backupVerifiedAt . ')';
        }
        echo $line . "\n";
    } else {
        echo "Backup referenciado: n/a (run sem evidencia registrada)\n";
    }

    echo "\n";
    echo "Passos recomendados:\n";
    echo "1. Congelar novos deploys e colocar o sistema em janela de manutencao.\n";
    if ($backupRef !== '') {
        echo "2. Restaurar o backup referenciado antes de qualquer acao de reversao.\n";
    } else {
        echo "2. Gerar/restaurar backup valido imediatamente antes da reversao.\n";
    }
    echo "3. Reverter mudancas desta release em ordem inversa de execucao.\n";
    echo "4. Validar estado do schema e rodar verificacoes pos-restauracao.\n";
    echo "5. Executar verificacao tecnica: composer db:migrate:status e composer verify:release:strict:online.\n";

    echo "\n";
    if ($items === []) {
        echo "Nenhuma migracao aplicada encontrada neste run.\n";
        return;
    }

    echo "Ordem sugerida de reversao (ultima aplicada -> primeira):\n";
    for ($idx = count($items) - 1; $idx >= 0; $idx--) {
        $item = $items[$idx];
        $migrationId = trim((string) ($item['migration_id'] ?? ''));
        $migrationName = trim((string) ($item['migration_name'] ?? ''));
        $sequenceNo = (int) ($item['sequence_no'] ?? 0);
        $rollbackScript = nqResolveRollbackScriptPath($migrationId);
        $requiresSnapshot = nqRollbackScriptRequiresSnapshot($migrationId);

        $line = sprintf(
            '- #%d %s :: %s',
            $sequenceNo,
            $migrationId,
            $migrationName !== '' ? $migrationName : 'sem nome'
        );
        if ($rollbackScript !== null) {
            $line .= ' | rollback=' . $rollbackScript;
            if ($requiresSnapshot) {
                $snapshotSummary = nqSummarizeRollbackSnapshots($db, (string) ($releaseRow['run_id'] ?? ''), $migrationId);
                if ($snapshotSummary['total'] > 0) {
                    $line .= ' | snapshot=' . $snapshotSummary['total'];
                    if ($snapshotSummary['origins'] !== '') {
                        $line .= ' [' . $snapshotSummary['origins'] . ']';
                    }
                    $line .= ' | cmd=php ' . $rollbackScript . ' --apply --confirm --run-id=' . (string) ($releaseRow['run_id'] ?? '');
                } else {
                    $line .= ' | snapshot=ausente';
                    $line .= ' | cmd=manual (snapshot nao encontrado para este run)';
                }
            } else {
                $line .= ' | cmd=php ' . $rollbackScript . ' --apply --confirm';
            }
        } else {
            $line .= ' | rollback=manual';
        }

        echo $line . "\n";
    }
}

function nqResolveRollbackPlanReleaseRun(Database $db, ?string $runId): ?array
{
    if ($runId !== null && trim($runId) !== '') {
        $releaseRow = $db->fetch(
            'SELECT
                run_id,
                release_version,
                release_author,
                release_source,
                backup_ref,
                backup_verified_at,
                planned_migrations,
                applied_migrations,
                status,
                started_at,
                finished_at,
                failed_migration_id
             FROM schema_migration_releases
             WHERE run_id = :run_id
             LIMIT 1',
            ['run_id' => trim($runId)]
        );

        if ($releaseRow === null) {
            throw new RuntimeException('Run informado nao encontrado: ' . trim($runId));
        }

        return $releaseRow;
    }

    $releaseRow = $db->fetch(
        'SELECT
            run_id,
            release_version,
            release_author,
            release_source,
            backup_ref,
            backup_verified_at,
            planned_migrations,
            applied_migrations,
            status,
            started_at,
            finished_at,
            failed_migration_id
         FROM schema_migration_releases
         WHERE status = :status
           AND applied_migrations > 0
         ORDER BY started_at DESC
         LIMIT 1',
        ['status' => 'success']
    );

    if ($releaseRow !== null) {
        return $releaseRow;
    }

    $releaseRow = $db->fetch(
        'SELECT
            run_id,
            release_version,
            release_author,
            release_source,
            backup_ref,
            backup_verified_at,
            planned_migrations,
            applied_migrations,
            status,
            started_at,
            finished_at,
            failed_migration_id
         FROM schema_migration_releases
         WHERE status = :status
         ORDER BY started_at DESC
         LIMIT 1',
        ['status' => 'success']
    );

    return $releaseRow;
}

function nqResolveRollbackScriptPath(string $migrationId): ?string
{
    $normalized = trim($migrationId);
    if ($normalized === '') {
        return null;
    }

    $relativePath = 'database/rollback/' . $normalized . '.php';
    $absolutePath = NQ_ROOT . '/' . $relativePath;
    if (!is_file($absolutePath)) {
        return null;
    }

    return $relativePath;
}

function nqRollbackScriptRequiresSnapshot(string $migrationId): bool
{
    return in_array(trim($migrationId), nqSupportedSnapshotMigrationIds(), true);
}

function nqCountRollbackSnapshots(Database $db, string $runId, string $migrationId): int
{
    if ($runId === '' || !nqTableExists($db, 'schema_migration_rollback_snapshots')) {
        return 0;
    }

    $row = $db->fetch(
        'SELECT COUNT(*) AS total
         FROM schema_migration_rollback_snapshots
         WHERE run_id = :run_id
           AND migration_id = :migration_id',
        [
            'run_id' => $runId,
            'migration_id' => $migrationId,
        ]
    );

    return (int) ($row['total'] ?? 0);
}

function nqRollbackSnapshotExists(Database $db, string $runId, string $migrationId, string $entityKey): bool
{
    if ($runId === '' || $migrationId === '' || $entityKey === '' || !nqTableExists($db, 'schema_migration_rollback_snapshots')) {
        return false;
    }

    $row = $db->fetch(
        'SELECT COUNT(*) AS total
         FROM schema_migration_rollback_snapshots
         WHERE run_id = :run_id
           AND migration_id = :migration_id
           AND entity_key = :entity_key',
        [
            'run_id' => $runId,
            'migration_id' => $migrationId,
            'entity_key' => $entityKey,
        ]
    );

    return (int) ($row['total'] ?? 0) > 0;
}

function nqTableHasIndex(Database $db, string $tableName, string $indexName): bool
{
    $row = $db->fetch(
        'SELECT COUNT(*) AS total
         FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table_name
           AND INDEX_NAME = :index_name',
        [
            'table_name' => $tableName,
            'index_name' => $indexName,
        ]
    );

    return (int) ($row['total'] ?? 0) > 0;
}

function nqTableHasForeignKey(Database $db, string $tableName, string $constraintName): bool
{
    $row = $db->fetch(
        'SELECT COUNT(*) AS total
         FROM information_schema.TABLE_CONSTRAINTS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = :table_name
           AND CONSTRAINT_NAME = :constraint_name
           AND CONSTRAINT_TYPE = :constraint_type',
        [
            'table_name' => $tableName,
            'constraint_name' => $constraintName,
            'constraint_type' => 'FOREIGN KEY',
        ]
    );

    return (int) ($row['total'] ?? 0) > 0;
}

/**
 * @param array<int, string> $candidateColumns
 * @return array<int, string>
 */
function nqFilterExistingColumns(Database $db, string $tableName, array $candidateColumns): array
{
    $columns = [];
    foreach ($candidateColumns as $columnName) {
        $normalized = trim((string) $columnName);
        if ($normalized === '') {
            continue;
        }

        if (nqTableHasColumn($db, $tableName, $normalized)) {
            $columns[] = $normalized;
        }
    }

    return $columns;
}

/**
 * @param array<int, string> $columns
 */
function nqBuildDynamicSelectColumns(array $columns): string
{
    $parts = [];
    foreach ($columns as $columnName) {
        $normalized = trim((string) $columnName);
        if ($normalized === '' || preg_match('/^[a-zA-Z0-9_]+$/', $normalized) !== 1) {
            throw new RuntimeException('Coluna invalida para SELECT dinamico: ' . $columnName);
        }

        $parts[] = '`' . $normalized . '`';
    }

    if ($parts === []) {
        throw new RuntimeException('Lista de colunas vazia para SELECT dinamico.');
    }

    return implode(', ', $parts);
}

/**
 * @param array<int, string> $columns
 */
function nqFetchSingleRowDynamic(Database $db, string $tableName, array $columns, string $suffixSql = ''): ?array
{
    if (preg_match('/^[a-zA-Z0-9_]+$/', $tableName) !== 1) {
        throw new RuntimeException('Tabela invalida para SELECT dinamico: ' . $tableName);
    }

    $selectColumns = nqBuildDynamicSelectColumns($columns);
    $suffix = trim($suffixSql);

    $sql = 'SELECT ' . $selectColumns . ' FROM `' . $tableName . '`';
    if ($suffix !== '') {
        $sql .= ' ' . $suffix;
    }

    return $db->fetch($sql);
}

/**
 * @param array<int, string> $columns
 */
function nqFetchSingleRowByColumnValueDynamic(
    Database $db,
    string $tableName,
    array $columns,
    string $whereColumn,
    string $whereValue
): ?array {
    if (preg_match('/^[a-zA-Z0-9_]+$/', $tableName) !== 1 || preg_match('/^[a-zA-Z0-9_]+$/', $whereColumn) !== 1) {
        throw new RuntimeException('Tabela/coluna invalida para SELECT dinamico com filtro.');
    }

    $selectColumns = nqBuildDynamicSelectColumns($columns);

    return $db->fetch(
        'SELECT ' . $selectColumns . ' FROM `' . $tableName . '` WHERE `' . $whereColumn . '` = :where_value LIMIT 1',
        ['where_value' => $whereValue]
    );
}

/**
 * @return array{total:int,origins:string}
 */
function nqSummarizeRollbackSnapshots(Database $db, string $runId, string $migrationId): array
{
    if ($runId === '' || $migrationId === '' || !nqTableExists($db, 'schema_migration_rollback_snapshots')) {
        return ['total' => 0, 'origins' => ''];
    }

    $rows = $db->fetchAll(
        'SELECT snapshot_origin, COUNT(*) AS total
         FROM schema_migration_rollback_snapshots
         WHERE run_id = :run_id
           AND migration_id = :migration_id
         GROUP BY snapshot_origin
         ORDER BY snapshot_origin ASC',
        [
            'run_id' => $runId,
            'migration_id' => $migrationId,
        ]
    );

    $total = 0;
    $parts = [];
    foreach ($rows as $row) {
        $origin = trim((string) ($row['snapshot_origin'] ?? ''));
        $count = (int) ($row['total'] ?? 0);
        if ($count <= 0) {
            continue;
        }

        $total += $count;
        $parts[] = ($origin !== '' ? $origin : 'unknown') . ':' . $count;
    }

    return [
        'total' => $total,
        'origins' => implode(',', $parts),
    ];
}

/**
 * @param array<int, array{id:string,name:string,script:string,absolute_script:string,checksum:string}> $manifest
 * @param array{run_id:?string,migration_id:?string,overwrite_snapshot:bool} $options
 */
function nqRunSnapshotBackfill(Database $db, array $manifest, array $options): void
{
    $runId = trim((string) ($options['run_id'] ?? ''));
    if ($runId === '') {
        throw new RuntimeException('snapshot-backfill exige --run-id=<run_id>.');
    }

    $releaseRun = nqResolveRollbackPlanReleaseRun($db, $runId);
    if ($releaseRun === null) {
        throw new RuntimeException('Run informado nao encontrado para snapshot-backfill: ' . $runId);
    }

    $manifestById = [];
    foreach ($manifest as $migration) {
        $manifestById[(string) $migration['id']] = $migration;
    }

    $supportedIds = nqSupportedSnapshotMigrationIds();
    $selectedMigrationId = trim((string) ($options['migration_id'] ?? ''));
    $targetIds = [];
    if ($selectedMigrationId !== '') {
        if (!in_array($selectedMigrationId, $supportedIds, true)) {
            throw new RuntimeException(
                'Migration nao suportada para snapshot-backfill: ' . $selectedMigrationId . '. Suportadas: ' . implode(', ', $supportedIds)
            );
        }
        $targetIds[] = $selectedMigrationId;
    } else {
        foreach ($supportedIds as $supportedId) {
            if (isset($manifestById[$supportedId])) {
                $targetIds[] = $supportedId;
            }
        }
    }

    if ($targetIds === []) {
        echo "Nenhuma migracao alvo encontrada para snapshot-backfill.\n";
        return;
    }

    $overwrite = (bool) ($options['overwrite_snapshot'] ?? false);

    echo "Snapshot backfill para run={$runId} (overwrite=" . ($overwrite ? 'yes' : 'no') . ")\n";
    $totalCaptured = 0;

    foreach ($targetIds as $migrationId) {
        if (!isset($manifestById[$migrationId])) {
            echo '- ' . $migrationId . " :: ignorada (nao presente no manifesto atual)\n";
            continue;
        }

        $captured = nqCaptureMigrationRollbackSnapshot(
            $db,
            $runId,
            $manifestById[$migrationId],
            'backfill',
            $overwrite
        );
        $total = nqCountRollbackSnapshots($db, $runId, $migrationId);

        echo '- ' . $migrationId . ' :: capturados=' . $captured . ' | total_no_run=' . $total . "\n";
        $totalCaptured += $captured;
    }

    echo 'Snapshot backfill concluido. Registros capturados nesta execucao: ' . $totalCaptured . "\n";
}

/**
 * @param array<int, array{
 *   id:string,
 *   name:string,
 *   script:string,
 *   absolute_script:string,
 *   checksum:string,
 *   rollback_strategy:string,
 *   rollback_script:string,
 *   rollback_absolute_script:string,
 *   rollback_requires_snapshot:bool
 * }> $manifest
 */
function nqRunRollbackAudit(array $manifest, bool $strict): void
{
    $errors = 0;
    $warnings = 0;

    echo "Audit de prontidao de rollback:\n";
    foreach ($manifest as $migration) {
        $id = trim((string) ($migration['id'] ?? ''));
        if ($id === '') {
            continue;
        }

        $strategy = strtolower(trim((string) ($migration['rollback_strategy'] ?? 'snapshot')));
        $rollbackScript = trim((string) ($migration['rollback_script'] ?? ''));
        $rollbackAbsoluteScript = trim((string) ($migration['rollback_absolute_script'] ?? ''));
        $requiresSnapshot = (bool) ($migration['rollback_requires_snapshot'] ?? false);
        $isSnapshotSupported = in_array($id, nqSupportedSnapshotMigrationIds(), true);
        $scriptExists = $rollbackAbsoluteScript !== '' && is_file($rollbackAbsoluteScript);

        $issues = [];
        if ($rollbackScript === '' || !$scriptExists) {
            $errors++;
            $issues[] = 'erro:script_rollback_ausente';
        }

        if ($requiresSnapshot && !$isSnapshotSupported) {
            $errors++;
            $issues[] = 'erro:snapshot_nao_suportado_no_runner';
        }

        if ($strategy === 'snapshot' && !$requiresSnapshot) {
            $warnings++;
            $issues[] = 'aviso:estrategia_snapshot_sem_flag_rollback_requires_snapshot';
        }

        if ($requiresSnapshot && $scriptExists) {
            $body = @file_get_contents($rollbackAbsoluteScript);
            if (!is_string($body) || !str_contains($body, 'nqRollbackRequireRunId(')) {
                $warnings++;
                $issues[] = 'aviso:script_snapshot_sem_validacao_explicita_de_run_id';
            }
        }

        if (!$requiresSnapshot && $isSnapshotSupported && $strategy !== 'snapshot') {
            $warnings++;
            $issues[] = 'aviso:migracao_com_snapshot_suportado_mas_estrategia_nao_snapshot';
        }

        $line = '- ' . $id
            . ' | strategy=' . $strategy
            . ' | snapshot=' . ($requiresSnapshot ? 'yes' : 'no')
            . ' | script=' . ($rollbackScript !== '' ? $rollbackScript : 'n/a');

        if ($issues === []) {
            $line .= ' | status=OK';
        } else {
            $line .= ' | status=' . implode(',', $issues);
        }

        echo $line . "\n";
    }

    echo 'Resumo: erros=' . $errors . ' | avisos=' . $warnings . ' | strict=' . ($strict ? 'yes' : 'no') . "\n";

    if ($errors > 0 || ($strict && $warnings > 0)) {
        throw new RuntimeException('Rollback audit falhou. Ajuste cobertura de rollback antes de prosseguir.');
    }
}

/**
 * @param array<int, array{
 *   id:string,
 *   name:string,
 *   script:string,
 *   absolute_script:string,
 *   checksum:string,
 *   rollback_strategy:string,
 *   rollback_script:string,
 *   rollback_absolute_script:string,
 *   rollback_requires_snapshot:bool
 * }> $manifest
 */
function nqRunSnapshotCoverageAudit(Database $db, array $manifest, bool $strict, ?string $runId): void
{
    $manifestById = [];
    foreach ($manifest as $migration) {
        $migrationId = trim((string) ($migration['id'] ?? ''));
        if ($migrationId === '') {
            continue;
        }
        $manifestById[$migrationId] = $migration;
    }

    $conditions = [
        'items.status = :item_status',
    ];
    $params = [
        'item_status' => 'applied',
    ];

    $runFilter = trim((string) ($runId ?? ''));
    if ($runFilter !== '') {
        $conditions[] = 'items.run_id = :run_id';
        $params['run_id'] = $runFilter;
    }

    $rows = $db->fetchAll(
        'SELECT
            items.run_id,
            items.migration_id,
            items.executed_at,
            releases.release_version,
            releases.status AS run_status
         FROM schema_migration_release_items AS items
         LEFT JOIN schema_migration_releases AS releases
           ON releases.run_id = items.run_id
         WHERE ' . implode(' AND ', $conditions) . '
         ORDER BY items.executed_at ASC',
        $params
    );

    echo "Audit de cobertura real de snapshots:\n";
    if ($rows === []) {
        echo "- nenhum item aplicado encontrado para auditoria.\n";
        echo 'Resumo: missing=0 | warnings=0 | strict=' . ($strict ? 'yes' : 'no') . "\n";
        return;
    }

    $missing = 0;
    $warnings = 0;
    foreach ($rows as $row) {
        $currentRunId = trim((string) ($row['run_id'] ?? ''));
        $migrationId = trim((string) ($row['migration_id'] ?? ''));
        if ($currentRunId === '' || $migrationId === '') {
            continue;
        }

        if (!isset($manifestById[$migrationId])) {
            $warnings++;
            echo '- run=' . $currentRunId . ' | migration=' . $migrationId . " | status=warning:fora_do_manifesto\n";
            continue;
        }

        $migrationMeta = $manifestById[$migrationId];
        $requiresSnapshot = (bool) ($migrationMeta['rollback_requires_snapshot'] ?? false);
        $strategy = strtolower(trim((string) ($migrationMeta['rollback_strategy'] ?? 'snapshot')));

        if (!$requiresSnapshot) {
            echo '- run=' . $currentRunId . ' | migration=' . $migrationId . ' | strategy=' . $strategy . " | snapshot=n/a\n";
            continue;
        }

        $summary = nqSummarizeRollbackSnapshots($db, $currentRunId, $migrationId);
        if ($summary['total'] <= 0) {
            $missing++;
            echo '- run=' . $currentRunId . ' | migration=' . $migrationId . ' | strategy=' . $strategy . " | snapshot=missing\n";
            continue;
        }

        $origins = $summary['origins'] !== '' ? $summary['origins'] : 'unknown';
        echo '- run=' . $currentRunId . ' | migration=' . $migrationId . ' | strategy=' . $strategy
            . ' | snapshot=' . $summary['total'] . ' [' . $origins . "]\n";
    }

    echo 'Resumo: missing=' . $missing . ' | warnings=' . $warnings . ' | strict=' . ($strict ? 'yes' : 'no') . "\n";
    if ($missing > 0 || ($strict && $warnings > 0)) {
        throw new RuntimeException('Snapshot coverage audit falhou. Execute snapshot-backfill ou ajuste a estrategia de rollback.');
    }
}

/**
 * @param array{
 *   env_name:?string,
 *   all_envs:bool,
 *   strict:bool
 * } $options
 */
function nqRunSnapshotCoverageEnvCheck(array $options): void
{
    $targets = nqResolveSnapshotCoverageReportTargets(NQ_ROOT, $options);
    $strict = (bool) ($options['strict'] ?? false);
    $unavailable = 0;
    $available = 0;

    echo "Pre-check de conectividade para snapshot coverage report:\n";
    foreach ($targets as $target) {
        $environmentName = trim((string) ($target['name'] ?? ''));
        if ($environmentName === '') {
            continue;
        }

        $label = $environmentName;
        if ((bool) ($target['active'] ?? false)) {
            $label .= ' (ativo)';
        }

        $host = trim((string) ($target['host_label'] ?? ''));
        $databaseName = trim((string) ($target['database_label'] ?? ''));
        if ((bool) ($target['runtime_overrides_applied'] ?? false)) {
            $label .= ' [runtime-overrides]';
        }
        if ((bool) ($target['db_env_overrides_applied'] ?? false)) {
            $sources = trim((string) ($target['db_env_overrides_sources'] ?? ''));
            $label .= $sources !== '' ? ' [db-env:' . $sources . ']' : ' [db-env]';
        }

        try {
            $dbConfig = (array) ($target['db_config'] ?? []);
            $envDb = new Database($dbConfig);
            $probe = $envDb->fetch('SELECT 1 AS probe');
            if (!is_array($probe) || (int) ($probe['probe'] ?? 0) !== 1) {
                throw new RuntimeException('Resposta inesperada ao executar SELECT 1.');
            }

            echo '- ' . $label . ' | host=' . $host . ' | db=' . $databaseName . " | status=OK\n";
            $available++;
        } catch (Throwable $exception) {
            $unavailable++;
            echo '- ' . $label . ' | host=' . $host . ' | db=' . $databaseName
                . ' | status=UNAVAILABLE | erro=' . trim($exception->getMessage()) . "\n";
        }
    }

    echo 'Resumo pre-check: available=' . $available . ' | unavailable=' . $unavailable . ' | strict=' . ($strict ? 'yes' : 'no') . "\n";

    if ($strict && $unavailable > 0) {
        throw new RuntimeException('Pre-check multiambiente falhou: existem ambientes indisponiveis.');
    }
}

/**
 * @param array<int, array{
 *   id:string,
 *   name:string,
 *   script:string,
 *   absolute_script:string,
 *   checksum:string,
 *   rollback_strategy:string,
 *   rollback_script:string,
 *   rollback_absolute_script:string,
 *   rollback_requires_snapshot:bool
 * }> $manifest
 * @param array{
 *   run_id:?string,
 *   output_file:?string,
 *   env_name:?string,
 *   all_envs:bool,
 *   strict:bool
 * } $options
 */
function nqRunSnapshotCoverageReport(array $manifest, array $options): void
{
    $manifestById = nqBuildSnapshotCoverageManifestLookup($manifest);
    $targets = nqResolveSnapshotCoverageReportTargets(NQ_ROOT, $options);
    $runFilter = trim((string) ($options['run_id'] ?? ''));
    $runFilter = $runFilter !== '' ? $runFilter : null;
    $strict = (bool) ($options['strict'] ?? false);

    $totalReleases = 0;
    $totalAppliedItems = 0;
    $totalRequired = 0;
    $totalCovered = 0;
    $totalMissing = 0;
    $totalWarnings = 0;
    $unavailableEnvironments = 0;
    $environmentReports = [];

    foreach ($targets as $target) {
        $environmentName = (string) ($target['name'] ?? '');
        $hostLabel = (string) ($target['host_label'] ?? '');
        $databaseLabel = (string) ($target['database_label'] ?? '');

        try {
            $dbConfig = (array) ($target['db_config'] ?? []);
            $envDb = new Database($dbConfig);
            $dataset = nqBuildSnapshotCoverageReportDataset($envDb, $manifestById, $runFilter);

            $environmentReports[] = [
                'name' => $environmentName,
                'active' => (bool) ($target['active'] ?? false),
                'runtime_overrides_applied' => (bool) ($target['runtime_overrides_applied'] ?? false),
                'db_env_overrides_applied' => (bool) ($target['db_env_overrides_applied'] ?? false),
                'db_env_overrides_sources' => (string) ($target['db_env_overrides_sources'] ?? ''),
                'status' => 'ok',
                'host_label' => $hostLabel,
                'database_label' => $databaseLabel,
                'error' => null,
                'dataset' => $dataset,
            ];

            $totalReleases += (int) ($dataset['release_count'] ?? 0);
            $totalAppliedItems += (int) ($dataset['applied_item_count'] ?? 0);
            $totalRequired += (int) ($dataset['required_total'] ?? 0);
            $totalCovered += (int) ($dataset['covered_total'] ?? 0);
            $totalMissing += (int) ($dataset['missing_total'] ?? 0);
            $totalWarnings += (int) ($dataset['warning_total'] ?? 0);
        } catch (Throwable $exception) {
            $unavailableEnvironments++;
            $environmentReports[] = [
                'name' => $environmentName,
                'active' => (bool) ($target['active'] ?? false),
                'runtime_overrides_applied' => (bool) ($target['runtime_overrides_applied'] ?? false),
                'db_env_overrides_applied' => (bool) ($target['db_env_overrides_applied'] ?? false),
                'db_env_overrides_sources' => (string) ($target['db_env_overrides_sources'] ?? ''),
                'status' => 'unavailable',
                'host_label' => $hostLabel,
                'database_label' => $databaseLabel,
                'error' => trim($exception->getMessage()),
                'dataset' => null,
            ];
        }
    }

    $overallConformity = $totalRequired > 0
        ? round(($totalCovered / $totalRequired) * 100, 2)
        : 100.00;
    $driftBaseline = nqBuildSnapshotCoverageDriftBaseline($environmentReports);

    $lines = [
        '# Dashboard de Conformidade de Snapshots por Release',
        '',
        'Gerado em: ' . date('d/m/Y H:i:s'),
        'Modo: ' . ((bool) ($options['all_envs'] ?? false) ? 'multiambiente' : 'ambiente unico'),
        'Strict: ' . ($strict ? 'yes' : 'no'),
    ];

    if ($runFilter !== null) {
        $lines[] = 'Filtro de run: `' . $runFilter . '`';
    }

    $lines[] = '';
    $lines[] = '## Resumo Executivo';
    $lines[] = '';
    $lines[] = '- Ambientes analisados: ' . count($environmentReports);
    $lines[] = '- Ambientes indisponiveis: ' . $unavailableEnvironments;
    $lines[] = '- Releases analisadas: ' . $totalReleases;
    $lines[] = '- Itens aplicados analisados: ' . $totalAppliedItems;
    $lines[] = '- Itens com snapshot obrigatorio: ' . $totalRequired;
    $lines[] = '- Itens com snapshot coberto: ' . $totalCovered;
    $lines[] = '- Itens com snapshot faltante: ' . $totalMissing;
    $lines[] = '- Avisos de manifesto: ' . $totalWarnings;
    $lines[] = '- Releases com drift entre ambientes: ' . (int) ($driftBaseline['drift_count'] ?? 0);
    $lines[] = '- Conformidade geral consolidada: ' . number_format($overallConformity, 2, '.', '') . '%';

    $lines[] = '';
    $lines[] = '## Ambientes Avaliados';
    $lines[] = '';
    $lines[] = '| Ambiente | Ativo | Host | Database | Status |';
    $lines[] = '| --- | --- | --- | --- | --- |';
    foreach ($environmentReports as $environmentReport) {
        $label = (string) $environmentReport['name'];
        if ((bool) $environmentReport['runtime_overrides_applied']) {
            $label .= ' (runtime-overrides)';
        }
        if ((bool) ($environmentReport['db_env_overrides_applied'] ?? false)) {
            $sources = trim((string) ($environmentReport['db_env_overrides_sources'] ?? ''));
            if ($sources !== '') {
                $label .= ' (db-env:' . $sources . ')';
            } else {
                $label .= ' (db-env)';
            }
        }

        $statusCell = strtoupper((string) $environmentReport['status']);
        if ($environmentReport['status'] === 'unavailable') {
            $statusCell .= ' - ' . nqEscapeMarkdownCell((string) ($environmentReport['error'] ?? 'erro desconhecido'));
        }

        $lines[] = sprintf(
            '| %s | %s | %s | %s | %s |',
            nqEscapeMarkdownCell($label),
            ((bool) $environmentReport['active']) ? 'yes' : 'no',
            nqEscapeMarkdownCell((string) $environmentReport['host_label']),
            nqEscapeMarkdownCell((string) $environmentReport['database_label']),
            $statusCell
        );
    }

    $lines[] = '';
    $lines[] = '## Resumo por Ambiente';
    $lines[] = '';
    $lines[] = '| Ambiente | Releases | Required | Covered | Missing | Warnings | Conformidade |';
    $lines[] = '| --- | ---: | ---: | ---: | ---: | ---: | ---: |';
    foreach ($environmentReports as $environmentReport) {
        $dataset = $environmentReport['dataset'];
        if (!is_array($dataset)) {
            $lines[] = '| ' . nqEscapeMarkdownCell((string) $environmentReport['name']) . ' | 0 | 0 | 0 | 0 | 0 | n/a |';
            continue;
        }

        $lines[] = sprintf(
            '| %s | %d | %d | %d | %d | %d | %s%% |',
            nqEscapeMarkdownCell((string) $environmentReport['name']),
            (int) ($dataset['release_count'] ?? 0),
            (int) ($dataset['required_total'] ?? 0),
            (int) ($dataset['covered_total'] ?? 0),
            (int) ($dataset['missing_total'] ?? 0),
            (int) ($dataset['warning_total'] ?? 0),
            number_format((float) ($dataset['conformity_percent'] ?? 100.0), 2, '.', '')
        );
    }

    $lines[] = '';
    $lines[] = '## Baseline de Drift Entre Ambientes';
    if (count((array) ($driftBaseline['env_order'] ?? [])) <= 1) {
        $lines[] = '';
        $lines[] = '- Comparativo nao aplicavel (apenas um ambiente disponivel).';
    } else {
        $referenceEnvironment = (string) ($driftBaseline['reference_env'] ?? 'n/a');
        $lines[] = '';
        $lines[] = '- Ambiente de referencia: ' . nqEscapeMarkdownCell($referenceEnvironment);
        $lines[] = '- Releases comparadas: ' . count((array) ($driftBaseline['release_rows'] ?? []));
        $lines[] = '';
        $lines[] = '| Release | Referencia | Assinatura Ref | Divergencias | Status |';
        $lines[] = '| --- | --- | --- | --- | --- |';

        $releaseRows = is_array($driftBaseline['release_rows'] ?? null) ? $driftBaseline['release_rows'] : [];
        if ($releaseRows === []) {
            $lines[] = '| n/a | n/a | n/a | n/a | OK |';
        } else {
            foreach ($releaseRows as $row) {
                $lines[] = sprintf(
                    '| %s | %s | %s | %s | %s |',
                    nqEscapeMarkdownCell((string) ($row['release_version'] ?? 'n/a')),
                    nqEscapeMarkdownCell((string) ($row['reference_env'] ?? 'n/a')),
                    nqEscapeMarkdownCell((string) ($row['reference_signature'] ?? 'n/a')),
                    nqEscapeMarkdownCell((string) ($row['diff_envs'] ?? '-')),
                    nqEscapeMarkdownCell((string) ($row['status'] ?? 'OK'))
                );
            }
        }
    }

    $lines[] = '';
    $lines[] = '## Detalhamento por Release';

    $pendingEntries = [];
    foreach ($environmentReports as $environmentReport) {
        $lines[] = '';
        $environmentTitle = '### Ambiente ' . (string) $environmentReport['name'];
        if ((bool) $environmentReport['active']) {
            $environmentTitle .= ' (ativo)';
        }
        $lines[] = $environmentTitle;

        if ($environmentReport['status'] !== 'ok' || !is_array($environmentReport['dataset'])) {
            $lines[] = '- Ambiente indisponivel para consulta: ' . nqEscapeMarkdownCell((string) ($environmentReport['error'] ?? 'erro desconhecido'));
            continue;
        }

        $dataset = $environmentReport['dataset'];
        $runRows = is_array($dataset['run_rows'] ?? null) ? $dataset['run_rows'] : [];
        if ($runRows === []) {
            $lines[] = '- Nenhuma release encontrada para o filtro informado.';
            continue;
        }

        $lines[] = '| Release | Run | Status | Aplicadas/Planejadas | Backup | Snapshot obrig. | Cobertos | Faltantes | Conformidade |';
        $lines[] = '| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |';

        foreach ($runRows as $runRow) {
            $releaseVersion = (string) ($runRow['release_version'] ?? '');
            $releaseVersion = $releaseVersion !== '' ? $releaseVersion : 'n/a';
            $backupCell = 'n/a';
            $backupRef = trim((string) ($runRow['backup_ref'] ?? ''));
            if ($backupRef !== '') {
                $backupCell = 'ref=' . $backupRef;
                $backupVerifiedAt = trim((string) ($runRow['backup_verified_at'] ?? ''));
                if ($backupVerifiedAt !== '') {
                    $backupCell .= ' @' . $backupVerifiedAt;
                }
            }

            $lines[] = sprintf(
                '| %s | `%s` | %s | %d/%d | %s | %d | %d | %d | %s%% |',
                nqEscapeMarkdownCell($releaseVersion),
                str_replace('`', '', (string) ($runRow['run_id'] ?? '')),
                strtoupper((string) ($runRow['status'] ?? 'unknown')),
                (int) ($runRow['applied_migrations'] ?? 0),
                (int) ($runRow['planned_migrations'] ?? 0),
                nqEscapeMarkdownCell($backupCell),
                (int) ($runRow['snapshot_required'] ?? 0),
                (int) ($runRow['snapshot_covered'] ?? 0),
                (int) ($runRow['snapshot_missing'] ?? 0),
                number_format((float) ($runRow['conformity_percent'] ?? 100.0), 2, '.', '')
            );

            if ((int) ($runRow['snapshot_missing'] ?? 0) > 0 || (int) ($runRow['manifest_warnings'] ?? 0) > 0) {
                $pendingEntries[] = [
                    'environment' => (string) $environmentReport['name'],
                    'release_version' => $releaseVersion,
                    'run_id' => (string) ($runRow['run_id'] ?? ''),
                    'status' => strtoupper((string) ($runRow['status'] ?? 'unknown')),
                    'snapshot_missing' => (int) ($runRow['snapshot_missing'] ?? 0),
                    'manifest_warnings' => (int) ($runRow['manifest_warnings'] ?? 0),
                    'missing_details' => is_array($runRow['missing_details'] ?? null) ? $runRow['missing_details'] : [],
                    'warning_details' => is_array($runRow['warning_details'] ?? null) ? $runRow['warning_details'] : [],
                ];
            }
        }
    }

    $lines[] = '';
    $lines[] = '## Pendencias por Release';
    if ($pendingEntries === []) {
        $lines[] = '';
        $lines[] = '- Nenhuma pendencia critica identificada.';
    } else {
        foreach ($pendingEntries as $entry) {
            $lines[] = '';
            $lines[] = '### Ambiente ' . nqEscapeMarkdownCell((string) $entry['environment'])
                . ' | Release ' . nqEscapeMarkdownCell((string) $entry['release_version'])
                . ' | run `' . nqEscapeMarkdownCell((string) $entry['run_id']) . '`';
            $lines[] = '- Status do run: ' . (string) $entry['status'];
            $lines[] = '- Snapshot faltante: ' . (int) $entry['snapshot_missing'];
            $lines[] = '- Avisos de manifesto: ' . (int) $entry['manifest_warnings'];
            foreach ((array) $entry['missing_details'] as $missingDetail) {
                $lines[] = '- Pendente: ' . nqEscapeMarkdownCell((string) $missingDetail);
            }
            foreach ((array) $entry['warning_details'] as $warningDetail) {
                $lines[] = '- Aviso: ' . nqEscapeMarkdownCell((string) $warningDetail);
            }
        }
    }

    $lines[] = '';
    $lines[] = '## Acoes Recomendadas';
    $lines[] = '';
    $lines[] = '1. Para cada item com `snapshot_missing`, executar `composer db:migrate:snapshot-backfill -- --run-id=<run_id>`.';
    $lines[] = '2. Reexecutar `composer db:migrate:snapshot-coverage-audit:strict` no ambiente afetado.';
    $lines[] = '3. Publicar este artefato junto da evidencia da release (change log/chamado de deploy).';

    $content = implode("\n", $lines) . "\n";
    $reportPath = nqResolveSnapshotCoverageReportPath(is_string($options['output_file'] ?? null) ? $options['output_file'] : null);
    nqWriteSnapshotCoverageReportFile($reportPath, $content);

    echo 'Relatorio de cobertura de snapshots gerado: ' . $reportPath . "\n";
    echo 'Resumo: envs=' . count($environmentReports)
        . ' | unavailable=' . $unavailableEnvironments
        . ' | releases=' . $totalReleases
        . ' | required=' . $totalRequired
        . ' | missing=' . $totalMissing
        . ' | warnings=' . $totalWarnings
        . ' | conformity=' . number_format($overallConformity, 2, '.', '') . "%\n";

    $driftCount = (int) ($driftBaseline['drift_count'] ?? 0);
    if ($strict && ($unavailableEnvironments > 0 || $totalMissing > 0 || $totalWarnings > 0 || $driftCount > 0)) {
        throw new RuntimeException(
            'Snapshot coverage report estrito detectou pendencias: '
            . 'unavailable=' . $unavailableEnvironments
            . ', missing=' . $totalMissing
            . ', warnings=' . $totalWarnings
            . ', drift=' . $driftCount
            . '.'
        );
    }
}

/**
 * @param array<int, array{
 *   id:string,
 *   name:string,
 *   script:string,
 *   absolute_script:string,
 *   checksum:string,
 *   rollback_strategy:string,
 *   rollback_script:string,
 *   rollback_absolute_script:string,
 *   rollback_requires_snapshot:bool
 * }> $manifest
 * @return array<string, array{name:string,rollback_strategy:string,rollback_requires_snapshot:bool}>
 */
function nqBuildSnapshotCoverageManifestLookup(array $manifest): array
{
    $manifestById = [];
    foreach ($manifest as $migration) {
        $migrationId = trim((string) ($migration['id'] ?? ''));
        if ($migrationId === '') {
            continue;
        }

        $manifestById[$migrationId] = [
            'name' => trim((string) ($migration['name'] ?? '')),
            'rollback_strategy' => strtolower(trim((string) ($migration['rollback_strategy'] ?? 'snapshot'))),
            'rollback_requires_snapshot' => (bool) ($migration['rollback_requires_snapshot'] ?? false),
        ];
    }

    return $manifestById;
}

/**
 * @param array<int, array{
 *   name:string,
 *   active:bool,
 *   status:string,
 *   dataset:?array<string,mixed>
 * }> $environmentReports
 * @return array{
 *   env_order:array<int,string>,
 *   reference_env:string,
 *   release_rows:array<int,array{
 *     release_version:string,
 *     reference_env:string,
 *     reference_signature:string,
 *     diff_envs:string,
 *     status:string
 *   }>,
 *   drift_count:int
 * }
 */
function nqBuildSnapshotCoverageDriftBaseline(array $environmentReports): array
{
    $envOrder = [];
    $releaseStatsByEnv = [];
    $activeReference = '';

    foreach ($environmentReports as $environmentReport) {
        $status = trim((string) ($environmentReport['status'] ?? ''));
        if ($status !== 'ok') {
            continue;
        }

        $dataset = $environmentReport['dataset'] ?? null;
        if (!is_array($dataset)) {
            continue;
        }

        $environmentName = trim((string) ($environmentReport['name'] ?? ''));
        if ($environmentName === '') {
            continue;
        }

        if ((bool) ($environmentReport['active'] ?? false) && $activeReference === '') {
            $activeReference = $environmentName;
        }

        $envOrder[] = $environmentName;
        $releaseStatsByEnv[$environmentName] = [];
        $runRows = is_array($dataset['run_rows'] ?? null) ? $dataset['run_rows'] : [];

        foreach ($runRows as $runRow) {
            $releaseVersion = trim((string) ($runRow['release_version'] ?? ''));
            if ($releaseVersion === '') {
                $releaseVersion = 'n/a';
            }

            if (!isset($releaseStatsByEnv[$environmentName][$releaseVersion])) {
                $releaseStatsByEnv[$environmentName][$releaseVersion] = [
                    'runs' => 0,
                    'required' => 0,
                    'covered' => 0,
                    'missing' => 0,
                    'warnings' => 0,
                ];
            }

            $releaseStatsByEnv[$environmentName][$releaseVersion]['runs']++;
            $releaseStatsByEnv[$environmentName][$releaseVersion]['required'] += (int) ($runRow['snapshot_required'] ?? 0);
            $releaseStatsByEnv[$environmentName][$releaseVersion]['covered'] += (int) ($runRow['snapshot_covered'] ?? 0);
            $releaseStatsByEnv[$environmentName][$releaseVersion]['missing'] += (int) ($runRow['snapshot_missing'] ?? 0);
            $releaseStatsByEnv[$environmentName][$releaseVersion]['warnings'] += (int) ($runRow['manifest_warnings'] ?? 0);
        }
    }

    $envOrder = array_values(array_unique($envOrder));
    $referenceEnv = $activeReference !== '' ? $activeReference : (string) ($envOrder[0] ?? '');
    if ($referenceEnv === '') {
        return [
            'env_order' => [],
            'reference_env' => '',
            'release_rows' => [],
            'drift_count' => 0,
        ];
    }

    $releaseVersions = [];
    foreach ($releaseStatsByEnv as $statsByRelease) {
        foreach (array_keys($statsByRelease) as $releaseVersion) {
            $releaseVersions[$releaseVersion] = true;
        }
    }
    $releaseVersions = array_keys($releaseVersions);
    usort(
        $releaseVersions,
        static function (string $a, string $b): int {
            $aKey = nqReleaseVersionSortKey($a);
            $bKey = nqReleaseVersionSortKey($b);
            if ($aKey === $bKey) {
                return strcmp($a, $b);
            }

            return $bKey <=> $aKey;
        }
    );

    $releaseRows = [];
    $driftCount = 0;
    foreach ($releaseVersions as $releaseVersion) {
        $referenceSignature = nqBuildReleaseBaselineSignature($releaseStatsByEnv, $referenceEnv, $releaseVersion);
        $diffEnvs = [];

        foreach ($envOrder as $environmentName) {
            $signature = nqBuildReleaseBaselineSignature($releaseStatsByEnv, $environmentName, $releaseVersion);
            if ($signature !== $referenceSignature) {
                $diffEnvs[] = $environmentName . '=' . $signature;
            }
        }

        $hasDrift = $diffEnvs !== [];
        if ($hasDrift) {
            $driftCount++;
        }

        $releaseRows[] = [
            'release_version' => $releaseVersion,
            'reference_env' => $referenceEnv,
            'reference_signature' => $referenceSignature,
            'diff_envs' => $hasDrift ? implode(' | ', $diffEnvs) : '-',
            'status' => $hasDrift ? 'DRIFT' : 'OK',
        ];
    }

    return [
        'env_order' => $envOrder,
        'reference_env' => $referenceEnv,
        'release_rows' => $releaseRows,
        'drift_count' => $driftCount,
    ];
}

/**
 * @param array<string, array<string, array{runs:int,required:int,covered:int,missing:int,warnings:int}>> $releaseStatsByEnv
 */
function nqBuildReleaseBaselineSignature(array $releaseStatsByEnv, string $environmentName, string $releaseVersion): string
{
    $stats = $releaseStatsByEnv[$environmentName][$releaseVersion] ?? null;
    if (!is_array($stats)) {
        return 'absent';
    }

    return sprintf(
        'runs=%d req=%d cov=%d miss=%d warn=%d',
        (int) ($stats['runs'] ?? 0),
        (int) ($stats['required'] ?? 0),
        (int) ($stats['covered'] ?? 0),
        (int) ($stats['missing'] ?? 0),
        (int) ($stats['warnings'] ?? 0)
    );
}

function nqReleaseVersionSortKey(string $releaseVersion): int
{
    if (preg_match('/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([0-9]{4})$/', $releaseVersion, $matches) !== 1) {
        return 0;
    }

    $day = (int) $matches[1];
    $month = (int) $matches[2];
    $year = (int) $matches[3];
    if (!checkdate($month, $day, $year)) {
        return 0;
    }

    $timestamp = mktime(0, 0, 0, $month, $day, $year);
    return is_int($timestamp) ? $timestamp : 0;
}

/**
 * @param array{
 *   env_name:?string,
 *   all_envs:bool
 * } $options
 * @return array<int, array{
 *   name:string,
 *   active:bool,
 *   runtime_overrides_applied:bool,
 *   db_env_overrides_applied:bool,
 *   db_env_overrides_sources:string,
 *   db_config:array<string,mixed>,
 *   host_label:string,
 *   database_label:string
 * }>
 */
function nqResolveSnapshotCoverageReportTargets(string $rootPath, array $options): array
{
    $config = nqLoadConfig($rootPath);

    if (class_exists(\NosfirQuotia\System\Support\RuntimeConfigOverrides::class)) {
        /** @var class-string $runtimeClass */
        $runtimeClass = \NosfirQuotia\System\Support\RuntimeConfigOverrides::class;
        $config = $runtimeClass::selectEnvironment($config);
    }

    $resolvedEnvironments = nqResolveMigrationRunnerEnvironments($config);
    if ($resolvedEnvironments === []) {
        throw new RuntimeException('Nenhum ambiente de configuracao foi resolvido para snapshot-coverage-report.');
    }

    $activeEnvironment = trim((string) ($config['environment'] ?? ''));
    if ($activeEnvironment === '' || !isset($resolvedEnvironments[$activeEnvironment])) {
        $activeEnvironment = (string) array_key_first($resolvedEnvironments);
    }

    $selectedNames = [];
    if ((bool) ($options['all_envs'] ?? false)) {
        $selectedNames = array_keys($resolvedEnvironments);
    } else {
        $selectedName = trim((string) ($options['env_name'] ?? ''));
        if ($selectedName === '') {
            $selectedName = $activeEnvironment;
        }

        if ($selectedName === '' || !isset($resolvedEnvironments[$selectedName])) {
            throw new RuntimeException('Ambiente informado para snapshot-coverage-report nao encontrado: ' . $selectedName);
        }

        $selectedNames[] = $selectedName;
    }

    $targets = [];
    foreach ($selectedNames as $environmentName) {
        $environmentConfig = $resolvedEnvironments[$environmentName];
        $runtimeOverridesApplied = false;

        if (
            !$options['all_envs']
            && $environmentName === $activeEnvironment
            && class_exists(\NosfirQuotia\System\Support\RuntimeConfigOverrides::class)
        ) {
            /** @var class-string $runtimeClass */
            $runtimeClass = \NosfirQuotia\System\Support\RuntimeConfigOverrides::class;
            $overridden = $runtimeClass::apply($environmentConfig);
            if ($overridden !== $environmentConfig) {
                $runtimeOverridesApplied = true;
            }
            $environmentConfig = $overridden;
        }

        $dbConfig = nqNormalizeEnvironmentDbConfig($environmentConfig, $environmentName);
        $dbOverride = nqApplySnapshotCoverageDbEnvOverrides(
            $dbConfig,
            $environmentName,
            $environmentName === $activeEnvironment
        );
        $dbConfig = (array) ($dbOverride['db_config'] ?? $dbConfig);

        $targets[] = [
            'name' => $environmentName,
            'active' => $environmentName === $activeEnvironment,
            'runtime_overrides_applied' => $runtimeOverridesApplied,
            'db_env_overrides_applied' => (bool) ($dbOverride['applied'] ?? false),
            'db_env_overrides_sources' => (string) ($dbOverride['sources'] ?? ''),
            'db_config' => $dbConfig,
            'host_label' => trim((string) ($dbConfig['host'] ?? '')),
            'database_label' => trim((string) ($dbConfig['database'] ?? '')),
        ];
    }

    return $targets;
}

/**
 * @param array<string, mixed> $dbConfig
 * @return array{
 *   db_config:array<string,mixed>,
 *   applied:bool,
 *   sources:string
 * }
 */
function nqApplySnapshotCoverageDbEnvOverrides(array $dbConfig, string $environmentName, bool $isActiveEnvironment): array
{
    $normalizedEnvironment = nqNormalizeEnvironmentVarSuffix($environmentName);
    $appliedSources = [];
    $alreadyAppliedColumns = [];
    $passwordEmptySpecificKey = 'NQ_DB_PASSWORD_' . $normalizedEnvironment . '_EMPTY';

    $specificMap = [
        'host' => 'NQ_DB_HOST_' . $normalizedEnvironment,
        'port' => 'NQ_DB_PORT_' . $normalizedEnvironment,
        'database' => 'NQ_DB_DATABASE_' . $normalizedEnvironment,
        'username' => 'NQ_DB_USERNAME_' . $normalizedEnvironment,
        'password' => 'NQ_DB_PASSWORD_' . $normalizedEnvironment,
    ];

    foreach ($specificMap as $columnName => $envKey) {
        $raw = nqReadEnvString($envKey);

        if (
            $columnName === 'password'
            && $raw === null
            && nqEnvFlagEnabled($passwordEmptySpecificKey)
        ) {
            $dbConfig[$columnName] = '';
            $alreadyAppliedColumns[$columnName] = true;
            $appliedSources[] = $passwordEmptySpecificKey;
            continue;
        }

        if ($raw === null) {
            continue;
        }

        $value = trim($raw);
        if ($columnName !== 'password' && $value === '') {
            continue;
        }

        if ($columnName === 'port') {
            if (!preg_match('/^\d+$/', $value)) {
                continue;
            }
            $port = (int) $value;
            if ($port < 1 || $port > 65535) {
                continue;
            }
            $dbConfig[$columnName] = $port;
        } elseif ($columnName === 'password') {
            $dbConfig[$columnName] = $raw;
        } else {
            $dbConfig[$columnName] = $value;
        }

        $alreadyAppliedColumns[$columnName] = true;
        $appliedSources[] = $envKey;
    }

    if ($isActiveEnvironment) {
        $passwordEmptyGenericKey = 'NQ_DB_PASSWORD_EMPTY';
        $genericMap = [
            'host' => 'NQ_DB_HOST',
            'port' => 'NQ_DB_PORT',
            'database' => 'NQ_DB_DATABASE',
            'username' => 'NQ_DB_USERNAME',
            'password' => 'NQ_DB_PASSWORD',
        ];

        foreach ($genericMap as $columnName => $envKey) {
            if (isset($alreadyAppliedColumns[$columnName])) {
                continue;
            }

            $raw = nqReadEnvString($envKey);
            if (
                $columnName === 'password'
                && $raw === null
                && nqEnvFlagEnabled($passwordEmptyGenericKey)
            ) {
                $dbConfig[$columnName] = '';
                $appliedSources[] = $passwordEmptyGenericKey;
                continue;
            }
            if ($raw === null) {
                continue;
            }

            $value = trim($raw);
            if ($columnName !== 'password' && $value === '') {
                continue;
            }

            if ($columnName === 'port') {
                if (!preg_match('/^\d+$/', $value)) {
                    continue;
                }
                $port = (int) $value;
                if ($port < 1 || $port > 65535) {
                    continue;
                }
                $dbConfig[$columnName] = $port;
            } elseif ($columnName === 'password') {
                $dbConfig[$columnName] = $raw;
            } else {
                $dbConfig[$columnName] = $value;
            }

            $appliedSources[] = $envKey;
        }
    }

    return [
        'db_config' => $dbConfig,
        'applied' => $appliedSources !== [],
        'sources' => implode(',', $appliedSources),
    ];
}

function nqNormalizeEnvironmentVarSuffix(string $environmentName): string
{
    $normalized = strtoupper(preg_replace('/[^A-Za-z0-9]+/', '_', trim($environmentName)) ?? '');
    $normalized = trim($normalized, '_');
    if ($normalized === '') {
        return 'DEFAULT';
    }

    return $normalized;
}

function nqReadEnvString(string $key): ?string
{
    $value = getenv($key);
    if ($value !== false) {
        return (string) $value;
    }

    if (isset($_ENV[$key])) {
        return (string) $_ENV[$key];
    }

    if (isset($_SERVER[$key])) {
        return (string) $_SERVER[$key];
    }

    return null;
}

function nqEnvFlagEnabled(string $key): bool
{
    $raw = nqReadEnvString($key);
    if ($raw === null) {
        return false;
    }

    $normalized = strtolower(trim($raw));
    return in_array($normalized, ['1', 'true', 'yes', 'on', 'sim'], true);
}

/**
 * @param array<string, mixed> $config
 * @return array<string, array<string, mixed>>
 */
function nqResolveMigrationRunnerEnvironments(array $config): array
{
    $environments = $config['environments'] ?? null;
    if (!is_array($environments) || $environments === []) {
        $name = trim((string) ($config['environment'] ?? 'default'));
        if ($name === '') {
            $name = 'default';
        }

        return [$name => $config];
    }

    $base = $config;
    unset($base['environments']);

    $resolved = [];
    foreach ($environments as $name => $environmentConfig) {
        if (!is_string($name) || trim($name) === '') {
            continue;
        }

        $snapshot = $base;
        if (is_array($environmentConfig)) {
            $snapshot = array_replace_recursive($snapshot, $environmentConfig);
        }

        $resolved[$name] = $snapshot;
    }

    return $resolved;
}

/**
 * @param array<string, mixed> $environmentConfig
 * @return array<string, mixed>
 */
function nqNormalizeEnvironmentDbConfig(array $environmentConfig, string $environmentName): array
{
    $dbConfig = is_array($environmentConfig['db'] ?? null) ? $environmentConfig['db'] : [];
    if ($dbConfig === []) {
        throw new RuntimeException('Configuracao de banco ausente no ambiente: ' . $environmentName);
    }

    $resolved = array_merge(
        [
            'driver' => 'mysql',
            'host' => '127.0.0.1',
            'port' => 3306,
            'database' => '',
            'username' => '',
            'password' => '',
            'charset' => 'utf8mb4',
        ],
        $dbConfig
    );

    if (trim((string) $resolved['database']) === '' || trim((string) $resolved['username']) === '') {
        throw new RuntimeException('Configuracao de banco incompleta no ambiente: ' . $environmentName);
    }

    return $resolved;
}

/**
 * @param array<string, array{name:string,rollback_strategy:string,rollback_requires_snapshot:bool}> $manifestById
 * @return array{
 *   release_count:int,
 *   applied_item_count:int,
 *   required_total:int,
 *   covered_total:int,
 *   missing_total:int,
 *   warning_total:int,
 *   conformity_percent:float,
 *   run_rows:array<int, array<string, mixed>>
 * }
 */
function nqBuildSnapshotCoverageReportDataset(Database $db, array $manifestById, ?string $runId): array
{
    if (!nqTableExists($db, 'schema_migration_releases') || !nqTableExists($db, 'schema_migration_release_items')) {
        return [
            'release_count' => 0,
            'applied_item_count' => 0,
            'required_total' => 0,
            'covered_total' => 0,
            'missing_total' => 0,
            'warning_total' => 0,
            'conformity_percent' => 100.0,
            'run_rows' => [],
        ];
    }

    $conditions = ['1 = 1'];
    $params = [];
    $runFilter = trim((string) ($runId ?? ''));
    if ($runFilter !== '') {
        $conditions[] = 'run_id = :run_id';
        $params['run_id'] = $runFilter;
    }

    $releaseRows = $db->fetchAll(
        'SELECT
            run_id,
            release_version,
            release_author,
            release_source,
            status,
            started_at,
            finished_at,
            planned_migrations,
            applied_migrations,
            backup_ref,
            backup_verified_at
         FROM schema_migration_releases
         WHERE ' . implode(' AND ', $conditions) . '
         ORDER BY started_at DESC',
        $params
    );

    $releaseCount = 0;
    $appliedItemCount = 0;
    $requiredTotal = 0;
    $coveredTotal = 0;
    $missingTotal = 0;
    $warningTotal = 0;
    $runRows = [];

    foreach ($releaseRows as $releaseRow) {
        $currentRunId = trim((string) ($releaseRow['run_id'] ?? ''));
        if ($currentRunId === '') {
            continue;
        }

        $releaseCount++;
        $items = $db->fetchAll(
            'SELECT
                sequence_no,
                migration_id,
                migration_name
             FROM schema_migration_release_items
             WHERE run_id = :run_id
               AND status = :status
             ORDER BY sequence_no ASC',
            [
                'run_id' => $currentRunId,
                'status' => 'applied',
            ]
        );

        $appliedItems = count($items);
        $snapshotRequired = 0;
        $snapshotCovered = 0;
        $snapshotMissing = 0;
        $manifestWarnings = 0;
        $missingDetails = [];
        $warningDetails = [];

        foreach ($items as $item) {
            $migrationId = trim((string) ($item['migration_id'] ?? ''));
            if ($migrationId === '') {
                continue;
            }

            if (!isset($manifestById[$migrationId])) {
                $manifestWarnings++;
                $warningDetails[] = 'migration=' . $migrationId . ' | issue=fora_do_manifesto';
                continue;
            }

            $migrationMeta = $manifestById[$migrationId];
            $requiresSnapshot = (bool) ($migrationMeta['rollback_requires_snapshot'] ?? false);
            if (!$requiresSnapshot) {
                continue;
            }

            $snapshotRequired++;
            $snapshotSummary = nqSummarizeRollbackSnapshots($db, $currentRunId, $migrationId);
            if ((int) ($snapshotSummary['total'] ?? 0) <= 0) {
                $snapshotMissing++;
                $missingDetails[] = 'migration=' . $migrationId . ' | issue=snapshot_missing';
                continue;
            }

            $snapshotCovered++;
        }

        $conformityPercent = $snapshotRequired > 0
            ? round(($snapshotCovered / $snapshotRequired) * 100, 2)
            : 100.00;

        $runRows[] = [
            'run_id' => $currentRunId,
            'release_version' => trim((string) ($releaseRow['release_version'] ?? '')),
            'release_author' => trim((string) ($releaseRow['release_author'] ?? '')),
            'release_source' => trim((string) ($releaseRow['release_source'] ?? '')),
            'status' => trim((string) ($releaseRow['status'] ?? '')),
            'started_at' => trim((string) ($releaseRow['started_at'] ?? '')),
            'finished_at' => trim((string) ($releaseRow['finished_at'] ?? '')),
            'planned_migrations' => (int) ($releaseRow['planned_migrations'] ?? 0),
            'applied_migrations' => (int) ($releaseRow['applied_migrations'] ?? 0),
            'backup_ref' => trim((string) ($releaseRow['backup_ref'] ?? '')),
            'backup_verified_at' => trim((string) ($releaseRow['backup_verified_at'] ?? '')),
            'applied_items' => $appliedItems,
            'snapshot_required' => $snapshotRequired,
            'snapshot_covered' => $snapshotCovered,
            'snapshot_missing' => $snapshotMissing,
            'manifest_warnings' => $manifestWarnings,
            'conformity_percent' => $conformityPercent,
            'missing_details' => $missingDetails,
            'warning_details' => $warningDetails,
        ];

        $appliedItemCount += $appliedItems;
        $requiredTotal += $snapshotRequired;
        $coveredTotal += $snapshotCovered;
        $missingTotal += $snapshotMissing;
        $warningTotal += $manifestWarnings;
    }

    $overallConformity = $requiredTotal > 0
        ? round(($coveredTotal / $requiredTotal) * 100, 2)
        : 100.00;

    return [
        'release_count' => $releaseCount,
        'applied_item_count' => $appliedItemCount,
        'required_total' => $requiredTotal,
        'covered_total' => $coveredTotal,
        'missing_total' => $missingTotal,
        'warning_total' => $warningTotal,
        'conformity_percent' => $overallConformity,
        'run_rows' => $runRows,
    ];
}

function nqEscapeMarkdownCell(string $value): string
{
    $normalized = str_replace(["\r", "\n"], ' ', $value);
    return str_replace('|', '\\|', trim($normalized));
}

function nqResolveSnapshotCoverageReportPath(?string $outputFile): string
{
    $target = trim((string) ($outputFile ?? ''));
    if ($target === '') {
        $fraction = (int) ((microtime(true) - floor(microtime(true))) * 1000000);
        $target = 'docs/relatorios/snapshot_coverage_dashboard_' . date('Ymd_His') . '_' . str_pad((string) $fraction, 6, '0', STR_PAD_LEFT) . '.md';
    }

    $normalized = str_replace('\\', '/', $target);
    if (preg_match('/^[A-Za-z]:\//', $normalized) === 1 || str_starts_with($normalized, '/')) {
        return str_replace('/', DIRECTORY_SEPARATOR, $normalized);
    }

    return NQ_ROOT . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, ltrim($normalized, '/'));
}

function nqWriteSnapshotCoverageReportFile(string $reportPath, string $content): void
{
    $directory = dirname($reportPath);
    if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
        throw new RuntimeException('Nao foi possivel criar diretorio do relatorio: ' . $directory);
    }

    $written = @file_put_contents($reportPath, $content, LOCK_EX);
    if ($written === false) {
        throw new RuntimeException('Nao foi possivel gravar relatorio em: ' . $reportPath);
    }
}

/**
 * @return array<int, string>
 */
function nqSupportedSnapshotMigrationIds(): array
{
    return [
        '20260505_0001_workflow_client_admin',
        '20260505_0002_tax_features',
        '20260505_0003_admin_permissions',
        '20260506_0006_release_version_format',
    ];
}

/**
 * @param array<string, array{
 *   migration_id:string,
 *   checksum:string,
 *   applied_at:string,
 *   script_path:string,
 *   release_run_id:string,
 *   release_version:string
 * }> $applied
 * @param array<int, array{
 *   id:string,
 *   name:string,
 *   script:string,
 *   absolute_script:string,
 *   checksum:string,
 *   status:string,
 *   applied_at:?string,
 *   applied_checksum:?string,
 *   applied_release_run_id:?string,
 *   applied_release_version:?string
 * }> $rows
 * @return array<int, string>
 */
function nqFindUnknownAppliedMigrationIds(array $applied, array $rows): array
{
    $known = [];
    foreach ($rows as $row) {
        $known[(string) $row['id']] = true;
    }

    $unknown = [];
    foreach ($applied as $id => $_meta) {
        if (!isset($known[$id])) {
            $unknown[] = (string) $id;
        }
    }

    sort($unknown);

    return $unknown;
}

/**
 * @param array<int, array{
 *   id:string,
 *   name:string,
 *   script:string,
 *   absolute_script:string,
 *   checksum:string,
 *   status:string,
 *   applied_at:?string,
 *   applied_checksum:?string,
 *   applied_release_run_id:?string,
 *   applied_release_version:?string
 * }> $rows
 * @return array<int, array{
 *   id:string,
 *   name:string,
 *   script:string,
 *   absolute_script:string,
 *   checksum:string,
 *   status:string,
 *   applied_at:?string,
 *   applied_checksum:?string,
 *   applied_release_run_id:?string,
 *   applied_release_version:?string
 * }>
 */
function nqResolvePendingMigrations(array $rows, ?string $target): array
{
    if ($target !== null) {
        $knownTarget = false;
        foreach ($rows as $row) {
            if ($row['id'] === $target) {
                $knownTarget = true;
                break;
            }
        }

        if (!$knownTarget) {
            throw new RuntimeException('Target de migracao nao encontrado no manifesto: ' . $target);
        }
    }

    $pending = [];
    foreach ($rows as $row) {
        if ($row['status'] === 'pending') {
            $pending[] = $row;
        }

        if ($target !== null && $row['id'] === $target) {
            break;
        }
    }

    return $pending;
}

/**
 * @param array{id:string,name:string,script:string,absolute_script:string,checksum:string,status:string,applied_at:?string,applied_checksum:?string} $migration
 */
function nqCaptureMigrationRollbackSnapshot(
    Database $db,
    string $runId,
    array $migration,
    string $snapshotOrigin = 'runtime',
    bool $overwrite = true
): int
{
    $migrationId = trim((string) ($migration['id'] ?? ''));
    if ($migrationId === '') {
        return 0;
    }

    if ($migrationId === '20260505_0003_admin_permissions') {
        return nqCaptureAdminPermissionsSnapshot($db, $runId, $migrationId, $snapshotOrigin, $overwrite);
    }

    if ($migrationId === '20260505_0001_workflow_client_admin') {
        return nqCaptureWorkflowBaseSnapshot($db, $runId, $migrationId, $snapshotOrigin, $overwrite);
    }

    if ($migrationId === '20260505_0002_tax_features') {
        return nqCaptureTaxFeaturesSchemaSnapshot($db, $runId, $migrationId, $snapshotOrigin, $overwrite);
    }

    if ($migrationId === '20260506_0006_release_version_format') {
        return nqCaptureReleaseVersionSnapshot($db, $runId, $migrationId, $snapshotOrigin, $overwrite);
    }

    return 0;
}

function nqCaptureAdminPermissionsSnapshot(
    Database $db,
    string $runId,
    string $migrationId,
    string $snapshotOrigin,
    bool $overwrite
): int
{
    if (!nqTableExists($db, 'admin_users')) {
        return 0;
    }

    $requiredColumns = [
        'id',
        'access_level',
        'is_general_admin',
        'is_active',
        'permissions_json',
        'updated_at',
    ];

    foreach ($requiredColumns as $columnName) {
        if (!nqTableHasColumn($db, 'admin_users', $columnName)) {
            return 0;
        }
    }

    $rows = $db->fetchAll(
        'SELECT
            id,
            access_level,
            is_general_admin,
            is_active,
            permissions_json,
            updated_at
         FROM admin_users
         ORDER BY id ASC'
    );

    $captured = 0;
    foreach ($rows as $row) {
        $adminId = (int) ($row['id'] ?? 0);
        if ($adminId <= 0) {
            continue;
        }

        $entityKey = 'admin_user:' . $adminId;
        if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
            continue;
        }

        nqInsertRollbackSnapshot(
            $db,
            $runId,
            $migrationId,
            $entityKey,
            [
                'table' => 'admin_users',
                'id' => $adminId,
                'access_level' => $row['access_level'] !== null ? (string) $row['access_level'] : null,
                'is_general_admin' => (int) ($row['is_general_admin'] ?? 0),
                'is_active' => (int) ($row['is_active'] ?? 0),
                'permissions_json' => $row['permissions_json'] !== null ? (string) $row['permissions_json'] : null,
                'updated_at' => $row['updated_at'] !== null ? (string) $row['updated_at'] : null,
            ],
            $snapshotOrigin
        );
        $captured++;
    }

    return $captured;
}

function nqCaptureWorkflowBaseSnapshot(
    Database $db,
    string $runId,
    string $migrationId,
    string $snapshotOrigin,
    bool $overwrite
): int {
    $captured = 0;

    $tableDefs = [
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
    foreach ($tableDefs as $tableName) {
        $entityKey = 'meta:table:' . $tableName;
        if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
            continue;
        }

        nqInsertRollbackSnapshot(
            $db,
            $runId,
            $migrationId,
            $entityKey,
            [
                'kind' => 'schema_presence',
                'table' => $tableName,
                'column' => null,
                'exists' => nqTableExists($db, $tableName) ? 1 : 0,
            ],
            $snapshotOrigin
        );
        $captured++;
    }

    $columnDefs = [
        ['admin_users', 'access_level'],
        ['admin_users', 'is_general_admin'],
        ['admin_users', 'is_active'],
        ['admin_users', 'permissions_json'],
        ['admin_users', 'created_by_admin_id'],
        ['admin_users', 'updated_at'],
        ['design_categories', 'area_type'],
    ];
    foreach ($columnDefs as $def) {
        $tableName = (string) $def[0];
        $columnName = (string) $def[1];
        $entityKey = 'meta:column:' . $tableName . ':' . $columnName;
        if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
            continue;
        }

        nqInsertRollbackSnapshot(
            $db,
            $runId,
            $migrationId,
            $entityKey,
            [
                'kind' => 'schema_presence',
                'table' => $tableName,
                'column' => $columnName,
                'exists' => (nqTableExists($db, $tableName) && nqTableHasColumn($db, $tableName, $columnName)) ? 1 : 0,
            ],
            $snapshotOrigin
        );
        $captured++;
    }

    $indexDefs = [
        ['admin_users', 'idx_admin_users_active'],
        ['design_categories', 'idx_design_categories_area_type'],
    ];
    foreach ($indexDefs as $def) {
        $tableName = (string) $def[0];
        $indexName = (string) $def[1];
        $entityKey = 'meta:index:' . $tableName . ':' . $indexName;
        if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
            continue;
        }

        nqInsertRollbackSnapshot(
            $db,
            $runId,
            $migrationId,
            $entityKey,
            [
                'kind' => 'schema_presence',
                'table' => $tableName,
                'index' => $indexName,
                'exists' => (nqTableExists($db, $tableName) && nqTableHasIndex($db, $tableName, $indexName)) ? 1 : 0,
            ],
            $snapshotOrigin
        );
        $captured++;
    }

    $fkDefs = [
        ['admin_users', 'fk_admin_users_creator'],
    ];
    foreach ($fkDefs as $def) {
        $tableName = (string) $def[0];
        $constraintName = (string) $def[1];
        $entityKey = 'meta:fk:' . $tableName . ':' . $constraintName;
        if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
            continue;
        }

        nqInsertRollbackSnapshot(
            $db,
            $runId,
            $migrationId,
            $entityKey,
            [
                'kind' => 'schema_presence',
                'table' => $tableName,
                'fk' => $constraintName,
                'exists' => (nqTableExists($db, $tableName) && nqTableHasForeignKey($db, $tableName, $constraintName)) ? 1 : 0,
            ],
            $snapshotOrigin
        );
        $captured++;
    }

    $captured += nqCaptureWorkflowFirstAdminSnapshot($db, $runId, $migrationId, $snapshotOrigin, $overwrite);
    $captured += nqCaptureWorkflowDefaultCategoriesSnapshot($db, $runId, $migrationId, $snapshotOrigin, $overwrite);

    return $captured;
}

function nqCaptureWorkflowFirstAdminSnapshot(
    Database $db,
    string $runId,
    string $migrationId,
    string $snapshotOrigin,
    bool $overwrite
): int {
    $entityKey = 'data:first_admin';
    if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
        return 0;
    }

    if (!nqTableExists($db, 'admin_users') || !nqTableHasColumn($db, 'admin_users', 'id')) {
        nqInsertRollbackSnapshot(
            $db,
            $runId,
            $migrationId,
            $entityKey,
            [
                'kind' => 'admin_row',
                'exists' => 0,
                'id' => null,
                'fields' => [],
            ],
            $snapshotOrigin
        );

        return 1;
    }

    $columns = nqFilterExistingColumns(
        $db,
        'admin_users',
        ['access_level', 'is_general_admin', 'is_active', 'permissions_json', 'updated_at']
    );
    $selectColumns = array_merge(['id'], $columns);
    $row = nqFetchSingleRowDynamic($db, 'admin_users', $selectColumns, 'ORDER BY `id` ASC LIMIT 1');

    if ($row === null) {
        nqInsertRollbackSnapshot(
            $db,
            $runId,
            $migrationId,
            $entityKey,
            [
                'kind' => 'admin_row',
                'exists' => 0,
                'id' => null,
                'fields' => [],
            ],
            $snapshotOrigin
        );

        return 1;
    }

    $fields = [];
    foreach ($columns as $columnName) {
        $fields[$columnName] = $row[$columnName] ?? null;
    }

    nqInsertRollbackSnapshot(
        $db,
        $runId,
        $migrationId,
        $entityKey,
        [
            'kind' => 'admin_row',
            'exists' => 1,
            'id' => (int) ($row['id'] ?? 0),
            'fields' => $fields,
        ],
        $snapshotOrigin
    );

    return 1;
}

function nqCaptureWorkflowDefaultCategoriesSnapshot(
    Database $db,
    string $runId,
    string $migrationId,
    string $snapshotOrigin,
    bool $overwrite
): int {
    $captured = 0;
    $slugs = [
        'design-grafico',
        'design-ux-ui',
        'ilustracao-digital',
        'desenvolvimento-web',
        'aplicativo-mobile',
        'software-desktop',
        'integracoes-e-api',
    ];

    if (!nqTableExists($db, 'design_categories') || !nqTableHasColumn($db, 'design_categories', 'slug')) {
        foreach ($slugs as $slug) {
            $entityKey = 'data:design_category_slug:' . $slug;
            if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
                continue;
            }

            nqInsertRollbackSnapshot(
                $db,
                $runId,
                $migrationId,
                $entityKey,
                [
                    'kind' => 'category_row',
                    'slug' => $slug,
                    'exists' => 0,
                    'fields' => [],
                ],
                $snapshotOrigin
            );
            $captured++;
        }

        return $captured;
    }

    $columns = nqFilterExistingColumns(
        $db,
        'design_categories',
        ['id', 'name', 'slug', 'description', 'base_price', 'area_type']
    );

    foreach ($slugs as $slug) {
        $entityKey = 'data:design_category_slug:' . $slug;
        if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
            continue;
        }

        $row = nqFetchSingleRowByColumnValueDynamic(
            $db,
            'design_categories',
            $columns,
            'slug',
            $slug
        );

        if ($row === null) {
            nqInsertRollbackSnapshot(
                $db,
                $runId,
                $migrationId,
                $entityKey,
                [
                    'kind' => 'category_row',
                    'slug' => $slug,
                    'exists' => 0,
                    'fields' => [],
                ],
                $snapshotOrigin
            );
            $captured++;
            continue;
        }

        $fields = [];
        foreach ($columns as $columnName) {
            $fields[$columnName] = $row[$columnName] ?? null;
        }

        nqInsertRollbackSnapshot(
            $db,
            $runId,
            $migrationId,
            $entityKey,
            [
                'kind' => 'category_row',
                'slug' => $slug,
                'exists' => 1,
                'fields' => $fields,
            ],
            $snapshotOrigin
        );
        $captured++;
    }

    return $captured;
}

function nqCaptureTaxFeaturesSchemaSnapshot(
    Database $db,
    string $runId,
    string $migrationId,
    string $snapshotOrigin,
    bool $overwrite
): int {
    $definitions = [
        [
            'entity_key' => 'meta:table:quote_report_taxes',
            'table' => 'quote_report_taxes',
            'column' => null,
        ],
        [
            'entity_key' => 'meta:table:tax_settings',
            'table' => 'tax_settings',
            'column' => null,
        ],
        [
            'entity_key' => 'meta:column:quote_reports:subtotal_value',
            'table' => 'quote_reports',
            'column' => 'subtotal_value',
        ],
        [
            'entity_key' => 'meta:column:quote_reports:taxes_total_value',
            'table' => 'quote_reports',
            'column' => 'taxes_total_value',
        ],
        [
            'entity_key' => 'meta:column:quote_reports:show_tax_details',
            'table' => 'quote_reports',
            'column' => 'show_tax_details',
        ],
    ];

    $captured = 0;
    foreach ($definitions as $definition) {
        $entityKey = (string) $definition['entity_key'];
        if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
            continue;
        }

        $tableName = (string) $definition['table'];
        $columnName = is_string($definition['column']) ? $definition['column'] : null;

        $exists = false;
        if ($columnName === null) {
            $exists = nqTableExists($db, $tableName);
        } else {
            $exists = nqTableExists($db, $tableName) && nqTableHasColumn($db, $tableName, $columnName);
        }

        nqInsertRollbackSnapshot(
            $db,
            $runId,
            $migrationId,
            $entityKey,
            [
                'kind' => 'schema_presence',
                'table' => $tableName,
                'column' => $columnName,
                'exists' => $exists ? 1 : 0,
            ],
            $snapshotOrigin
        );
        $captured++;
    }

    return $captured;
}

function nqCaptureReleaseVersionSnapshot(
    Database $db,
    string $runId,
    string $migrationId,
    string $snapshotOrigin,
    bool $overwrite
): int
{
    $captured = 0;

    if (nqTableExists($db, 'schema_migration_releases') && nqTableHasColumn($db, 'schema_migration_releases', 'release_version')) {
        $rows = $db->fetchAll(
            'SELECT id, release_version
             FROM schema_migration_releases
             ORDER BY id ASC'
        );

        foreach ($rows as $row) {
            $id = (int) ($row['id'] ?? 0);
            if ($id <= 0) {
                continue;
            }

            $entityKey = 'schema_migration_releases:' . $id;
            if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
                continue;
            }

            nqInsertRollbackSnapshot(
                $db,
                $runId,
                $migrationId,
                $entityKey,
                [
                    'table' => 'schema_migration_releases',
                    'id' => $id,
                    'release_version' => $row['release_version'] !== null ? (string) $row['release_version'] : null,
                ],
                $snapshotOrigin
            );
            $captured++;
        }
    }

    if (nqTableExists($db, 'schema_migrations') && nqTableHasColumn($db, 'schema_migrations', 'release_version')) {
        $rows = $db->fetchAll(
            'SELECT id, release_version
             FROM schema_migrations
             ORDER BY id ASC'
        );

        foreach ($rows as $row) {
            $id = (int) ($row['id'] ?? 0);
            if ($id <= 0) {
                continue;
            }

            $entityKey = 'schema_migrations:' . $id;
            if (!$overwrite && nqRollbackSnapshotExists($db, $runId, $migrationId, $entityKey)) {
                continue;
            }

            nqInsertRollbackSnapshot(
                $db,
                $runId,
                $migrationId,
                $entityKey,
                [
                    'table' => 'schema_migrations',
                    'id' => $id,
                    'release_version' => $row['release_version'] !== null ? (string) $row['release_version'] : null,
                ],
                $snapshotOrigin
            );
            $captured++;
        }
    }

    return $captured;
}

/**
 * @param array<string, mixed> $payload
 */
function nqInsertRollbackSnapshot(
    Database $db,
    string $runId,
    string $migrationId,
    string $entityKey,
    array $payload,
    string $snapshotOrigin = 'runtime'
): void
{
    $snapshotJson = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($snapshotJson) || $snapshotJson === '') {
        throw new RuntimeException('Falha ao serializar snapshot de rollback para ' . $migrationId . ' [' . $entityKey . '].');
    }

    $origin = trim($snapshotOrigin) !== '' ? trim($snapshotOrigin) : 'runtime';

    $db->execute(
        'INSERT INTO schema_migration_rollback_snapshots (
            run_id, migration_id, entity_key, snapshot_json, snapshot_origin
         ) VALUES (
            :run_id, :migration_id, :entity_key, :snapshot_json, :snapshot_origin
         )
         ON DUPLICATE KEY UPDATE
            snapshot_json = VALUES(snapshot_json),
            snapshot_origin = VALUES(snapshot_origin),
            captured_at = CURRENT_TIMESTAMP',
        [
            'run_id' => $runId,
            'migration_id' => $migrationId,
            'entity_key' => $entityKey,
            'snapshot_json' => $snapshotJson,
            'snapshot_origin' => $origin,
        ]
    );
}

/**
 * @return array{exit_code:int,output:string}
 */
function nqRunMigrationScript(string $absoluteScriptPath): array
{
    $descriptorSpec = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ];

    $command = [
        PHP_BINARY,
        $absoluteScriptPath,
    ];

    $pipes = [];
    $process = proc_open($command, $descriptorSpec, $pipes, NQ_ROOT);
    if (!is_resource($process)) {
        throw new RuntimeException('Nao foi possivel iniciar processo de migracao: ' . $absoluteScriptPath);
    }

    fclose($pipes[0]);
    $stdout = stream_get_contents($pipes[1]);
    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);

    $exitCode = proc_close($process);

    $output = trim(
        ((is_string($stdout) ? $stdout : '') . PHP_EOL . (is_string($stderr) ? $stderr : ''))
    );

    return [
        'exit_code' => is_int($exitCode) ? $exitCode : -1,
        'output' => $output,
    ];
}

/**
 * @param array{
 *   release_version:string,
 *   release_author:string,
 *   release_source:string,
 *   release_notes:?string,
 *   backup_ref:?string,
 *   backup_verified_at:?string
 * } $releaseContext
 */
function nqCreateMigrationReleaseRun(Database $db, array $releaseContext, int $plannedMigrations): string
{
    $runId = nqGenerateRunId();
    $db->execute(
        'INSERT INTO schema_migration_releases (
            run_id, release_version, release_author, release_source, release_notes, backup_ref, backup_verified_at, planned_migrations, status, executed_host, php_binary
         ) VALUES (
            :run_id, :release_version, :release_author, :release_source, :release_notes, :backup_ref, :backup_verified_at, :planned_migrations, :status, :executed_host, :php_binary
         )',
        [
            'run_id' => $runId,
            'release_version' => $releaseContext['release_version'],
            'release_author' => $releaseContext['release_author'],
            'release_source' => $releaseContext['release_source'],
            'release_notes' => $releaseContext['release_notes'],
            'backup_ref' => $releaseContext['backup_ref'],
            'backup_verified_at' => $releaseContext['backup_verified_at'],
            'planned_migrations' => max(0, $plannedMigrations),
            'status' => 'running',
            'executed_host' => php_uname('n'),
            'php_binary' => PHP_BINARY,
        ]
    );

    return $runId;
}

/**
 * @param array{id:string,name:string,script:string,absolute_script:string,checksum:string,status:string,applied_at:?string,applied_checksum:?string} $migration
 */
function nqRecordMigrationReleaseItem(
    Database $db,
    string $runId,
    int $sequenceNo,
    array $migration,
    string $status,
    ?int $runtimeMs,
    string $output
): void {
    $db->execute(
        'INSERT INTO schema_migration_release_items (
            run_id, sequence_no, migration_id, migration_name, script_path, checksum, status, runtime_ms, output_excerpt
         ) VALUES (
            :run_id, :sequence_no, :migration_id, :migration_name, :script_path, :checksum, :status, :runtime_ms, :output_excerpt
         )',
        [
            'run_id' => $runId,
            'sequence_no' => max(1, $sequenceNo),
            'migration_id' => $migration['id'],
            'migration_name' => $migration['name'],
            'script_path' => $migration['script'],
            'checksum' => $migration['checksum'],
            'status' => $status,
            'runtime_ms' => $runtimeMs !== null && $runtimeMs >= 0 ? $runtimeMs : null,
            'output_excerpt' => nqNormalizeOutputExcerpt($output),
        ]
    );
}

function nqFinalizeMigrationReleaseRun(
    Database $db,
    string $runId,
    string $status,
    int $appliedMigrations,
    ?string $failedMigrationId,
    ?string $errorMessage
): void {
    $normalizedStatus = in_array($status, ['success', 'failed'], true) ? $status : 'failed';

    $db->execute(
        'UPDATE schema_migration_releases
         SET
            status = :status,
            applied_migrations = :applied_migrations,
            failed_migration_id = :failed_migration_id,
            error_message = :error_message,
            finished_at = CURRENT_TIMESTAMP
         WHERE run_id = :run_id',
        [
            'status' => $normalizedStatus,
            'applied_migrations' => max(0, $appliedMigrations),
            'failed_migration_id' => $failedMigrationId,
            'error_message' => nqLimitText($errorMessage, 500),
            'run_id' => $runId,
        ]
    );
}

function nqGenerateRunId(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);

    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function nqNormalizeOutputExcerpt(string $output): ?string
{
    $excerpt = trim($output);
    if ($excerpt === '') {
        return null;
    }

    return nqLimitText($excerpt, 4000);
}

function nqLimitText(?string $value, int $maxLength): ?string
{
    if ($value === null) {
        return null;
    }

    $value = trim($value);
    if ($value === '') {
        return null;
    }

    if (strlen($value) <= $maxLength) {
        return $value;
    }

    return substr($value, 0, $maxLength);
}

/**
 * @param array{id:string,name:string,script:string,absolute_script:string,checksum:string,status:string,applied_at:?string,applied_checksum:?string} $migration
 * @param array{
 *   release_version:string,
 *   release_author:string,
 *   release_source:string,
 *   release_notes:?string
 * } $releaseContext
 */
function nqMarkMigrationApplied(
    Database $db,
    array $migration,
    int $runtimeMs,
    string $output,
    string $runId,
    array $releaseContext
): void
{
    $db->execute(
        'INSERT INTO schema_migrations (
            migration_id, migration_name, script_path, checksum, runtime_ms, output_excerpt, release_run_id, release_version, release_author, release_source
         ) VALUES (
            :migration_id, :migration_name, :script_path, :checksum, :runtime_ms, :output_excerpt, :release_run_id, :release_version, :release_author, :release_source
         )
         ON DUPLICATE KEY UPDATE
            migration_name = VALUES(migration_name),
            script_path = VALUES(script_path),
            checksum = VALUES(checksum),
            runtime_ms = VALUES(runtime_ms),
            output_excerpt = VALUES(output_excerpt),
            release_run_id = VALUES(release_run_id),
            release_version = VALUES(release_version),
            release_author = VALUES(release_author),
            release_source = VALUES(release_source),
            applied_at = CURRENT_TIMESTAMP',
        [
            'migration_id' => $migration['id'],
            'migration_name' => $migration['name'],
            'script_path' => $migration['script'],
            'checksum' => $migration['checksum'],
            'runtime_ms' => $runtimeMs,
            'output_excerpt' => nqNormalizeOutputExcerpt($output),
            'release_run_id' => $runId,
            'release_version' => $releaseContext['release_version'],
            'release_author' => $releaseContext['release_author'],
            'release_source' => $releaseContext['release_source'],
        ]
    );
}
