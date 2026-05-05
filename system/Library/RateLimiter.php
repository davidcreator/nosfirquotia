<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Library;

final class RateLimiter
{
    public function __construct(private readonly string $storagePath)
    {
        if (!is_dir($this->storagePath)) {
            @mkdir($this->storagePath, 0775, true);
        }
    }

    public function tooManyAttempts(string $key, int $maxAttempts, int $windowSeconds): array
    {
        if ($maxAttempts < 1 || $windowSeconds < 1) {
            return [
                'limited' => false,
                'attempts' => 0,
                'remaining' => 0,
                'retry_after' => 0,
            ];
        }

        $now = time();
        $handle = $this->openBucket($key);
        if ($handle === null) {
            return [
                'limited' => false,
                'attempts' => 0,
                'remaining' => $maxAttempts,
                'retry_after' => 0,
            ];
        }

        $bucket = $this->readBucket($handle, $windowSeconds, $now);
        $limited = $bucket['attempts'] >= $maxAttempts;
        $retryAfter = $limited ? max(1, $bucket['expires_at'] - $now) : 0;
        $remaining = max(0, $maxAttempts - $bucket['attempts']);

        $this->writeBucket($handle, $bucket);
        $this->closeBucket($handle);

        return [
            'limited' => $limited,
            'attempts' => $bucket['attempts'],
            'remaining' => $remaining,
            'retry_after' => $retryAfter,
        ];
    }

    public function hit(string $key, int $maxAttempts, int $windowSeconds): array
    {
        if ($maxAttempts < 1 || $windowSeconds < 1) {
            return [
                'limited' => false,
                'attempts' => 0,
                'remaining' => 0,
                'retry_after' => 0,
            ];
        }

        $now = time();
        $handle = $this->openBucket($key);
        if ($handle === null) {
            return [
                'limited' => false,
                'attempts' => 0,
                'remaining' => $maxAttempts,
                'retry_after' => 0,
            ];
        }

        $bucket = $this->readBucket($handle, $windowSeconds, $now);
        $bucket['attempts']++;
        $bucket['expires_at'] = max($bucket['expires_at'], $now + $windowSeconds);

        $limited = $bucket['attempts'] >= $maxAttempts;
        $remaining = max(0, $maxAttempts - $bucket['attempts']);
        $retryAfter = $limited ? max(1, $bucket['expires_at'] - $now) : 0;

        $this->writeBucket($handle, $bucket);
        $this->closeBucket($handle);

        return [
            'limited' => $limited,
            'attempts' => $bucket['attempts'],
            'remaining' => $remaining,
            'retry_after' => $retryAfter,
        ];
    }

    public function clear(string $key): void
    {
        $path = $this->bucketPath($key);
        if (is_file($path)) {
            @unlink($path);
        }
    }

    private function bucketPath(string $key): string
    {
        return rtrim($this->storagePath, '/\\') . '/rl_' . hash('sha256', trim($key)) . '.json';
    }

    /**
     * @return resource|null
     */
    private function openBucket(string $key)
    {
        $path = $this->bucketPath($key);
        $directory = dirname($path);
        if (!is_dir($directory)) {
            @mkdir($directory, 0775, true);
        }

        $handle = @fopen($path, 'c+');
        if ($handle === false) {
            return null;
        }

        if (!flock($handle, LOCK_EX)) {
            fclose($handle);
            return null;
        }

        return $handle;
    }

    /**
     * @param resource $handle
     */
    private function readBucket($handle, int $windowSeconds, int $now): array
    {
        rewind($handle);
        $raw = stream_get_contents($handle);

        $data = [];
        if (is_string($raw) && trim($raw) !== '') {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $data = $decoded;
            }
        }

        $attempts = max(0, (int) ($data['attempts'] ?? 0));
        $expiresAt = (int) ($data['expires_at'] ?? 0);

        if ($expiresAt <= $now) {
            $attempts = 0;
            $expiresAt = $now + $windowSeconds;
        }

        return [
            'attempts' => $attempts,
            'expires_at' => $expiresAt,
        ];
    }

    /**
     * @param resource $handle
     */
    private function writeBucket($handle, array $bucket): void
    {
        rewind($handle);
        ftruncate($handle, 0);
        fwrite(
            $handle,
            (string) json_encode(
                [
                    'attempts' => (int) ($bucket['attempts'] ?? 0),
                    'expires_at' => (int) ($bucket['expires_at'] ?? 0),
                ],
                JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
            )
        );
        fflush($handle);
    }

    /**
     * @param resource $handle
     */
    private function closeBucket($handle): void
    {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}
