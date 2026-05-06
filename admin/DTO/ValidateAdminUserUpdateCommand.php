<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\DTO;

final class ValidateAdminUserUpdateCommand
{
    /**
     * @param array<string, mixed> $input
     */
    public function __construct(
        public readonly int $targetAdminId,
        public readonly bool $targetIsGeneralAdmin,
        public readonly int $currentAdminId,
        public readonly array $input
    ) {
    }
}
