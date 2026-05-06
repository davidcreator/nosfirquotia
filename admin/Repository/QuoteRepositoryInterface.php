<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Repository;

interface QuoteRepositoryInterface
{
    /**
     * @return array<string, mixed>|null
     */
    public function findRequest(int $requestId): ?array;

    /**
     * @return array<int, array<string, mixed>>
     */
    public function requestServices(int $requestId): array;

    /**
     * @return array<string, mixed>
     */
    public function taxSettings(): array;

    /**
     * @param array<string, mixed> $payload
     * @param array<int, array<string, mixed>> $serviceRows
     * @param array<int, array<string, mixed>> $taxRows
     */
    public function createOrUpdateReport(
        int $requestId,
        int $adminUserId,
        array $payload,
        array $serviceRows,
        array $taxRows
    ): int;

    public function saveBrandManualReport(
        int $requestId,
        int $adminUserId,
        string $payloadJson,
        string $schemaVersion,
        string $toolSource,
        ?string $generatedAt
    ): bool;
}

