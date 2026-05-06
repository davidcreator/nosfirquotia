<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Repository;

use NosfirQuotia\Cliente\Model\ReferencePriceModel;
use NosfirQuotia\Cliente\Model\RequestModel;

final class QuoteRequestModelRepository implements QuoteRequestRepositoryInterface
{
    public function __construct(
        private readonly ReferencePriceModel $referenceModel,
        private readonly RequestModel $requestModel
    ) {
    }

    public function existingServiceIds(array $ids): array
    {
        return $this->referenceModel->existingIds($ids);
    }

    public function findServiceById(int $id): ?array
    {
        return $this->referenceModel->findById($id);
    }

    public function createRequest(int $clientUserId, array $payload, array $serviceIds): int
    {
        return $this->requestModel->create($clientUserId, $payload, $serviceIds);
    }
}

