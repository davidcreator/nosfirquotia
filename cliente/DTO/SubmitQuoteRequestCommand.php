<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\DTO;

final class SubmitQuoteRequestCommand
{
    /**
     * @param array<string, mixed> $input
     */
    public function __construct(
        public readonly int $clientUserId,
        public readonly array $input
    ) {
    }
}

