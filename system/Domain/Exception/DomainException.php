<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Domain\Exception;

use RuntimeException;
use Throwable;

class DomainException extends RuntimeException
{
    /**
     * @param array<string, mixed> $details
     */
    public function __construct(
        string $message,
        private readonly string $errorCode = DomainErrorCodes::DOMAIN_ERROR,
        private readonly array $details = [],
        int $code = 0,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
    }

    public function errorCode(): string
    {
        return $this->errorCode;
    }

    /**
     * @return array<string, mixed>
     */
    public function details(): array
    {
        return $this->details;
    }
}
