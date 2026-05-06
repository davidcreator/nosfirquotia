<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\DTO;

final class GenerateQuoteReportResult
{
    /**
     * @param array<int, string> $warnings
     */
    private function __construct(
        public readonly bool $ok,
        public readonly string $redirect,
        public readonly ?string $successMessage,
        public readonly ?string $errorMessage,
        public readonly ?string $errorCode,
        public readonly array $warnings
    ) {
    }

    /**
     * @param array<int, string> $warnings
     */
    public static function success(string $redirect, string $successMessage, array $warnings = []): self
    {
        return new self(
            true,
            $redirect,
            $successMessage,
            null,
            null,
            $warnings
        );
    }

    public static function failure(string $redirect, string $errorMessage, string $errorCode): self
    {
        return new self(
            false,
            $redirect,
            null,
            $errorMessage,
            $errorCode,
            []
        );
    }
}
