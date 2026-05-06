<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Service;

final class SecurityEventMonitoringService
{
    private const DEFAULT_BUCKET_MINUTES = 60;
    private const MIN_BUCKET_MINUTES = 5;
    private const MAX_BUCKET_MINUTES = 1440;

    /**
     * @var array<string, int>
     */
    private array $thresholds;

    /**
     * @param array<string, mixed> $thresholds
     */
    public function __construct(
        private readonly string $logPath,
        array $thresholds = []
    ) {
        $defaults = [
            'csrf_rejected' => 10,
            'host_header_rejected' => 3,
            'admin_login_blocked' => 3,
            'client_login_blocked' => 3,
        ];

        $normalized = $defaults;
        foreach ($thresholds as $event => $value) {
            $eventName = trim((string) $event);
            if ($eventName === '') {
                continue;
            }

            $numeric = is_numeric($value) ? (int) $value : null;
            if ($numeric === null) {
                continue;
            }

            $normalized[$eventName] = max(1, $numeric);
        }

        $this->thresholds = $normalized;
    }

    /**
     * @return array{
     *   window_hours:int,
     *   since_iso:string,
     *   total_events:int,
     *   counts:array<string,int>,
     *   alerts:array<int,array<string,mixed>>,
     *   healthy:bool
     * }
     */
    public function summarize(int $windowHours = 24): array
    {
        $windowHours = $this->normalizeWindowHours($windowHours);
        $now = time();
        $windowStart = $now - ($windowHours * 3600);

        $counts = [];
        foreach (array_keys($this->thresholds) as $event) {
            $counts[$event] = 0;
        }

        $totalEvents = 0;
        $lines = $this->readLines();
        foreach ($lines as $line) {
            $decoded = json_decode((string) $line, true);
            if (!is_array($decoded)) {
                continue;
            }

            $timestampRaw = trim((string) ($decoded['timestamp'] ?? ''));
            $eventTime = strtotime($timestampRaw);
            if ($eventTime === false || $eventTime < $windowStart || $eventTime > ($now + 300)) {
                continue;
            }

            $totalEvents++;
            $event = trim((string) ($decoded['event'] ?? ''));
            if ($event === '' || !array_key_exists($event, $counts)) {
                continue;
            }

            $counts[$event]++;
        }

        $alerts = $this->buildAlerts($counts);

        return [
            'window_hours' => $windowHours,
            'since_iso' => date('c', $windowStart),
            'total_events' => $totalEvents,
            'counts' => $counts,
            'alerts' => $alerts,
            'healthy' => $alerts === [],
        ];
    }

    /**
     * @return array{
     *   window_hours:int,
     *   bucket_minutes:int,
     *   since_iso:string,
     *   until_iso:string,
     *   events:array<int,string>,
     *   buckets:array<int,array<string,mixed>>
     * }
     */
    public function timeseries(int $windowHours = 24, int $bucketMinutes = self::DEFAULT_BUCKET_MINUTES): array
    {
        $windowHours = $this->normalizeWindowHours($windowHours);
        $bucketMinutes = $this->normalizeBucketMinutes($bucketMinutes);
        $bucketSeconds = $bucketMinutes * 60;

        $now = time();
        $windowStart = $now - ($windowHours * 3600);
        $alignedStart = intdiv($windowStart, $bucketSeconds) * $bucketSeconds;
        $alignedEnd = intdiv($now + $bucketSeconds - 1, $bucketSeconds) * $bucketSeconds;
        if ($alignedEnd <= $alignedStart) {
            $alignedEnd = $alignedStart + $bucketSeconds;
        }

        $eventKeys = array_values(array_keys($this->thresholds));
        $bucketCount = max(1, intdiv($alignedEnd - $alignedStart, $bucketSeconds));
        $buckets = [];
        for ($index = 0; $index < $bucketCount; $index++) {
            $bucketStart = $alignedStart + ($index * $bucketSeconds);
            $bucketEnd = $bucketStart + $bucketSeconds;
            $counts = [];
            foreach ($eventKeys as $eventKey) {
                $counts[$eventKey] = 0;
            }

            $buckets[$index] = [
                'start_ts' => $bucketStart,
                'end_ts' => $bucketEnd,
                'start_iso' => date('c', $bucketStart),
                'end_iso' => date('c', $bucketEnd),
                'total' => 0,
                'counts' => $counts,
            ];
        }

        $lines = $this->readLines();
        foreach ($lines as $line) {
            $decoded = json_decode((string) $line, true);
            if (!is_array($decoded)) {
                continue;
            }

            $timestampRaw = trim((string) ($decoded['timestamp'] ?? ''));
            $eventTime = strtotime($timestampRaw);
            if ($eventTime === false || $eventTime < $windowStart || $eventTime > ($now + 300)) {
                continue;
            }

            $offset = $eventTime - $alignedStart;
            if ($offset < 0) {
                continue;
            }

            $bucketIndex = intdiv($offset, $bucketSeconds);
            if (!isset($buckets[$bucketIndex])) {
                continue;
            }

            $buckets[$bucketIndex]['total']++;
            $event = trim((string) ($decoded['event'] ?? ''));
            if ($event === '' || !array_key_exists($event, $buckets[$bucketIndex]['counts'])) {
                continue;
            }

            $buckets[$bucketIndex]['counts'][$event]++;
        }

        return [
            'window_hours' => $windowHours,
            'bucket_minutes' => $bucketMinutes,
            'since_iso' => date('c', $windowStart),
            'until_iso' => date('c', $now),
            'events' => $eventKeys,
            'buckets' => array_values($buckets),
        ];
    }

    /**
     * @return array<int, string>
     */
    private function readLines(): array
    {
        if (!is_file($this->logPath)) {
            return [];
        }

        $lines = @file($this->logPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!is_array($lines)) {
            return [];
        }

        return $lines;
    }

    /**
     * @param array<string, int> $counts
     * @return array<int, array<string, mixed>>
     */
    private function buildAlerts(array $counts): array
    {
        $alerts = [];

        foreach ($this->thresholds as $event => $threshold) {
            $count = (int) ($counts[$event] ?? 0);
            if ($count < $threshold) {
                continue;
            }

            $severity = $event === 'host_header_rejected' ? 'critical' : 'warning';
            $alerts[] = [
                'event' => $event,
                'count' => $count,
                'threshold' => $threshold,
                'severity' => $severity,
                'message' => $this->alertMessage($event, $count, $threshold),
            ];
        }

        return $alerts;
    }

    private function alertMessage(string $event, int $count, int $threshold): string
    {
        return match ($event) {
            'csrf_rejected' => 'Pico de rejeicoes CSRF detectado (' . $count . ' >= ' . $threshold . ').',
            'host_header_rejected' => 'Tentativas de Host Header invalido acima do limite (' . $count . ' >= ' . $threshold . ').',
            'admin_login_blocked' => 'Bloqueios de login admin acima do limite (' . $count . ' >= ' . $threshold . ').',
            'client_login_blocked' => 'Bloqueios de login cliente acima do limite (' . $count . ' >= ' . $threshold . ').',
            default => 'Evento de seguranca acima do limite (' . $count . ' >= ' . $threshold . ').',
        };
    }

    private function normalizeWindowHours(int $windowHours): int
    {
        return max(1, min(168, $windowHours));
    }

    private function normalizeBucketMinutes(int $bucketMinutes): int
    {
        return max(self::MIN_BUCKET_MINUTES, min(self::MAX_BUCKET_MINUTES, $bucketMinutes));
    }
}
