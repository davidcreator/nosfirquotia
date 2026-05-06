<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Repository;

use NosfirQuotia\Admin\Model\QuoteModel;

final class QuoteModelRepository implements QuoteRepositoryInterface
{
    public function __construct(
        private readonly QuoteModel $model
    ) {
    }

    public function findRequest(int $requestId): ?array
    {
        return $this->model->find($requestId);
    }

    public function requestServices(int $requestId): array
    {
        return $this->model->requestServices($requestId);
    }

    public function taxSettings(): array
    {
        return $this->model->taxSettings();
    }

    public function createOrUpdateReport(
        int $requestId,
        int $adminUserId,
        array $payload,
        array $serviceRows,
        array $taxRows
    ): int {
        return $this->model->createOrUpdateReport(
            $requestId,
            $adminUserId,
            $payload,
            $serviceRows,
            $taxRows
        );
    }

    public function saveBrandManualReport(
        int $requestId,
        int $adminUserId,
        string $payloadJson,
        string $schemaVersion,
        string $toolSource,
        ?string $generatedAt
    ): bool {
        return $this->model->saveBrandManualReport(
            $requestId,
            $adminUserId,
            $payloadJson,
            $schemaVersion,
            $toolSource,
            $generatedAt
        );
    }
}

