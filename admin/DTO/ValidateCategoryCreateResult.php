<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\DTO;

final class ValidateCategoryCreateResult
{
    /**
     * @param array<string, mixed> $payload
     * @param array<int, string> $errors
     */
    public function __construct(
        public readonly bool $ok,
        public readonly array $payload = [],
        public readonly array $errors = [],
        public readonly ?string $errorCode = null
    ) {
    }

    /**
     * @param array<string, mixed> $payload
     */
    public static function success(array $payload): self
    {
        return new self(true, $payload, [], null);
    }

    /**
     * @param array<int, string> $errors
     * @param array<string, mixed> $payload
     */
    public static function failure(array $errors, string $errorCode, array $payload = []): self
    {
        return new self(false, $payload, $errors, $errorCode);
    }
}
