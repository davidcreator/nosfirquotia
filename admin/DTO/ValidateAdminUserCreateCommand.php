<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\DTO;

final class ValidateAdminUserCreateCommand
{
    /**
     * @param array<string, mixed> $input
     */
    public function __construct(public readonly array $input)
    {
    }
}
