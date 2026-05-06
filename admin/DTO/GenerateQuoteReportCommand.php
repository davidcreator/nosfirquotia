<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\DTO;

final class GenerateQuoteReportCommand
{
    /**
     * @param array<string, mixed> $input
     */
    public function __construct(
        public readonly int $requestId,
        public readonly int $adminUserId,
        public readonly string $accountUrl,
        public readonly array $input
    ) {
    }
}

