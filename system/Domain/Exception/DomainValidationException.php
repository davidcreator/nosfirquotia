<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Domain\Exception;

final class DomainValidationException extends DomainException
{
    /**
     * @param array<int, string> $errors
     */
    public static function withErrors(
        array $errors,
        array $details = [],
        string $errorCode = DomainErrorCodes::VALIDATION_FAILED
    ): self
    {
        $details['errors'] = array_values($errors);

        return new self(
            'Falha de validacao de dominio.',
            $errorCode,
            $details
        );
    }

    /**
     * @return array<int, string>
     */
    public function errors(): array
    {
        $errors = $this->details()['errors'] ?? [];
        if (!is_array($errors)) {
            return [];
        }

        return array_values(array_map('strval', $errors));
    }
}
