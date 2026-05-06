<?php

declare(strict_types=1);

namespace Tests\Service\Fakes;

use NosfirQuotia\Admin\Repository\QuoteRepositoryInterface;

final class FakeQuoteRepository implements QuoteRepositoryInterface
{
    /**
     * @var array<string, mixed>|null
     */
    public ?array $request = null;

    /**
     * @var array<int, array<string, mixed>>
     */
    public array $services = [];

    /**
     * @var array<string, mixed>
     */
    public array $taxSettings = [
        'imposto_label' => 'Impostos',
        'imposto_percent' => 0,
        'taxa_label' => 'Taxas',
        'taxa_percent' => 0,
        'encargo_label' => 'Encargos',
        'encargo_percent' => 0,
    ];

    /**
     * @var array<string, mixed>|null
     */
    public ?array $lastCreatePayload = null;

    /**
     * @var array<int, array<string, mixed>>|null
     */
    public ?array $lastServiceRows = null;

    /**
     * @var array<int, array<string, mixed>>|null
     */
    public ?array $lastTaxRows = null;

    public bool $saveManualShouldSucceed = true;
    public int $reportId = 1001;

    public function findRequest(int $requestId): ?array
    {
        return $this->request;
    }

    public function requestServices(int $requestId): array
    {
        return $this->services;
    }

    public function taxSettings(): array
    {
        return $this->taxSettings;
    }

    public function createOrUpdateReport(
        int $requestId,
        int $adminUserId,
        array $payload,
        array $serviceRows,
        array $taxRows
    ): int {
        $this->lastCreatePayload = $payload;
        $this->lastServiceRows = $serviceRows;
        $this->lastTaxRows = $taxRows;

        return $this->reportId;
    }

    public function saveBrandManualReport(
        int $requestId,
        int $adminUserId,
        string $payloadJson,
        string $schemaVersion,
        string $toolSource,
        ?string $generatedAt
    ): bool {
        return $this->saveManualShouldSucceed;
    }
}

