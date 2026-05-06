<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Library;

use Throwable;

final class SecurityEventLogger
{
    private const MAX_DEPTH = 3;
    private const MAX_ITEMS_PER_LEVEL = 40;
    private const MAX_STRING_LENGTH = 500;
    private const DEFAULT_MAX_ACTIVE_FILE_BYTES = 5_242_880; // 5 MB
    private const DEFAULT_RETENTION_DAYS = 30;
    private const DEFAULT_MAX_ARCHIVE_FILES = 180;

    private string $storageDir;
    private int $maxActiveFileBytes;
    private int $retentionDays;
    private int $maxArchiveFiles;

    public function __construct(
        string $storageDir,
        int $maxActiveFileBytes = self::DEFAULT_MAX_ACTIVE_FILE_BYTES,
        int $retentionDays = self::DEFAULT_RETENTION_DAYS,
        int $maxArchiveFiles = self::DEFAULT_MAX_ARCHIVE_FILES
    ) {
        $this->storageDir = $storageDir;
        $this->maxActiveFileBytes = max(1024, $maxActiveFileBytes);
        $this->retentionDays = max(1, $retentionDays);
        $this->maxArchiveFiles = max(1, $maxArchiveFiles);
    }

    public function info(string $event, array $context = []): void
    {
        $this->write('info', $event, $context);
    }

    public function warning(string $event, array $context = []): void
    {
        $this->write('warning', $event, $context);
    }

    public function error(string $event, array $context = []): void
    {
        $this->write('error', $event, $context);
    }

    private function write(string $level, string $event, array $context): void
    {
        $safeEvent = trim($event);
        if ($safeEvent === '') {
            $safeEvent = 'security_event';
        }

        $payload = [
            'timestamp' => date('c'),
            'level' => $level,
            'event' => $safeEvent,
            'context' => $this->normalizeContext($context, 0),
        ];

        $encoded = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if (!is_string($encoded)) {
            return;
        }

        $directory = rtrim($this->storageDir, '/\\');
        if (!is_dir($directory)) {
            @mkdir($directory, 0775, true);
        }

        $path = $directory . '/security-events.log';
        try {
            $this->rotateActiveLogIfNeeded($path, $directory);
            $this->pruneArchivedLogs($directory);
            @file_put_contents($path, $encoded . PHP_EOL, FILE_APPEND | LOCK_EX);
        } catch (Throwable) {
            // Logging nao pode interromper o fluxo principal.
        }
    }

    private function rotateActiveLogIfNeeded(string $activePath, string $directory): void
    {
        if (!is_file($activePath)) {
            return;
        }

        clearstatcache(true, $activePath);
        $fileSize = filesize($activePath);
        $sizeBytes = is_int($fileSize) ? $fileSize : 0;

        $mtime = filemtime($activePath);
        $lastModified = is_int($mtime) ? $mtime : time();

        $isOversized = $sizeBytes >= $this->maxActiveFileBytes;
        $isPreviousDay = date('Y-m-d', $lastModified) !== date('Y-m-d');

        if (!$isOversized && !$isPreviousDay) {
            return;
        }

        $archivePath = $this->nextArchivePath($directory);
        if (@rename($activePath, $archivePath)) {
            return;
        }

        // Fallback para ambientes onde rename pode falhar por lock/permissao.
        if (@copy($activePath, $archivePath)) {
            @unlink($activePath);
        }
    }

    private function nextArchivePath(string $directory): string
    {
        $stamp = date('Ymd-His');
        $base = rtrim($directory, '/\\') . '/security-events-' . $stamp;
        $candidate = $base . '.log';
        $suffix = 0;

        while (is_file($candidate) && $suffix < 200) {
            $suffix++;
            $candidate = $base . '-' . $suffix . '.log';
        }

        return $candidate;
    }

    private function pruneArchivedLogs(string $directory): void
    {
        $pattern = rtrim($directory, '/\\') . '/security-events-*.log';
        $files = glob($pattern);
        if (!is_array($files) || $files === []) {
            return;
        }

        $now = time();
        $retentionSeconds = $this->retentionDays * 86400;
        foreach ($files as $file) {
            if (!is_file($file)) {
                continue;
            }

            $mtime = filemtime($file);
            $lastModified = is_int($mtime) ? $mtime : $now;
            if (($now - $lastModified) > $retentionSeconds) {
                @unlink($file);
            }
        }

        $freshFiles = glob($pattern);
        if (!is_array($freshFiles) || $freshFiles === []) {
            return;
        }

        usort(
            $freshFiles,
            static function (string $a, string $b): int {
                $timeA = filemtime($a);
                $timeB = filemtime($b);
                $mtimeA = is_int($timeA) ? $timeA : 0;
                $mtimeB = is_int($timeB) ? $timeB : 0;

                return $mtimeB <=> $mtimeA;
            }
        );

        if (count($freshFiles) <= $this->maxArchiveFiles) {
            return;
        }

        $toDelete = array_slice($freshFiles, $this->maxArchiveFiles);
        foreach ($toDelete as $file) {
            @unlink($file);
        }
    }

    private function normalizeContext(mixed $value, int $depth): mixed
    {
        if ($depth > self::MAX_DEPTH) {
            return '[depth_limit_reached]';
        }

        if (is_null($value) || is_bool($value) || is_int($value) || is_float($value)) {
            return $value;
        }

        if (is_string($value)) {
            return $this->normalizeString($value);
        }

        if (is_array($value)) {
            $result = [];
            $count = 0;
            foreach ($value as $key => $item) {
                $count++;
                if ($count > self::MAX_ITEMS_PER_LEVEL) {
                    $result['__truncated__'] = true;
                    break;
                }

                $safeKey = is_string($key) ? $this->normalizeKey($key) : (string) $key;
                if ($this->isSensitiveKey($safeKey)) {
                    $result[$safeKey] = '[redacted]';
                    continue;
                }

                $result[$safeKey] = $this->normalizeContext($item, $depth + 1);
            }

            return $result;
        }

        if (is_object($value)) {
            return '[object:' . get_class($value) . ']';
        }

        return '[' . gettype($value) . ']';
    }

    private function normalizeString(string $value): string
    {
        $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? $value;
        $value = trim($value);
        if ($value === '') {
            return '';
        }

        if (function_exists('mb_substr')) {
            return (string) mb_substr($value, 0, self::MAX_STRING_LENGTH, 'UTF-8');
        }

        return substr($value, 0, self::MAX_STRING_LENGTH);
    }

    private function normalizeKey(string $key): string
    {
        $key = strtolower(trim($key));
        $key = preg_replace('/\s+/', '_', $key) ?? $key;

        return $key !== '' ? $key : 'key';
    }

    private function isSensitiveKey(string $key): bool
    {
        $patterns = [
            'password',
            'passwd',
            'senha',
            'token',
            'csrf',
            'cookie',
            'authorization',
            'auth',
            'secret',
        ];

        foreach ($patterns as $pattern) {
            if (str_contains($key, $pattern)) {
                return true;
            }
        }

        return false;
    }
}
