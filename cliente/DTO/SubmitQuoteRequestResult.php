<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\DTO;

final class SubmitQuoteRequestResult
{
    /**
     * @param array<int, string> $errors
     * @param array<string, mixed> $oldInput
     */
    private function __construct(
        public readonly bool $ok,
        public readonly int $requestId,
        public readonly array $errors,
        public readonly array $oldInput,
        public readonly ?string $errorCode
    ) {
    }

    public static function success(int $requestId): self
    {
        return new self(true, $requestId, [], [], null);
    }

    /**
     * @param array<int, string> $errors
     * @param array<string, mixed> $oldInput
     */
    public static function failure(array $errors, array $oldInput, string $errorCode): self
    {
        return new self(false, 0, $errors, $oldInput, $errorCode);
    }
}
