<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Repository;

use NosfirQuotia\Admin\Model\QuoteModel;

final class TaxSettingsModelRepository implements TaxSettingsRepositoryInterface
{
    public function __construct(
        private readonly QuoteModel $model
    ) {
    }

    public function save(array $settings): void
    {
        $this->model->saveTaxSettings($settings);
    }
}

