<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Repository;

interface QuoteRequestRepositoryInterface
{
    /**
     * @param array<int, int> $ids
     * @return array<int, int>
     */
    public function existingServiceIds(array $ids): array;

    /**
     * @return array<string, mixed>|null
     */
    public function findServiceById(int $id): ?array;

    /**
     * @param array<string, mixed> $payload
     * @param array<int, int> $serviceIds
     */
    public function createRequest(int $clientUserId, array $payload, array $serviceIds): int;
}

