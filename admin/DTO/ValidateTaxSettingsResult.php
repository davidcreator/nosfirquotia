<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\DTO;

final class ValidateTaxSettingsResult
{
    /**
     * @param array<int, string> $errors
     * @param array<string, mixed> $settings
     */
    private function __construct(
        public readonly bool $ok,
        public readonly array $errors,
        public readonly array $settings,
        public readonly ?string $errorCode
    ) {
    }

    /**
     * @param array<string, mixed> $settings
     */
    public static function success(array $settings): self
    {
        return new self(true, [], $settings, null);
    }

    /**
     * @param array<int, string> $errors
     */
    public static function failure(array $errors, string $errorCode): self
    {
        return new self(false, $errors, [], $errorCode);
    }
}
