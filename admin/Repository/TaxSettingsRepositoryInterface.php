<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Repository;

interface TaxSettingsRepositoryInterface
{
    /**
     * @param array<string, mixed> $settings
     */
    public function save(array $settings): void;
}

