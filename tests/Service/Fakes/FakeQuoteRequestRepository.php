<?php

declare(strict_types=1);

namespace Tests\Service\Fakes;

use NosfirQuotia\Cliente\Repository\QuoteRequestRepositoryInterface;

final class FakeQuoteRequestRepository implements QuoteRequestRepositoryInterface
{
    /**
     * @var array<int, int>
     */
    public array $existingIds = [];

    /**
     * @var array<int, array<string, mixed>>
     */
    public array $servicesById = [];

    public int $requestId = 501;

    /**
     * @var array<string, mixed>|null
     */
    public ?array $lastCreatePayload = null;

    /**
     * @var array<int, int>|null
     */
    public ?array $lastCreateServiceIds = null;

    public ?int $lastCreateClientUserId = null;

    public function existingServiceIds(array $ids): array
    {
        return $this->existingIds;
    }

    public function findServiceById(int $id): ?array
    {
        return $this->servicesById[$id] ?? null;
    }

    public function createRequest(int $clientUserId, array $payload, array $serviceIds): int
    {
        $this->lastCreateClientUserId = $clientUserId;
        $this->lastCreatePayload = $payload;
        $this->lastCreateServiceIds = $serviceIds;

        return $this->requestId;
    }
}

