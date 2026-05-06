<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Domain\Exception;

final class DomainNotFoundException extends DomainException
{
    public static function forEntity(
        string $entity,
        ?int $id = null,
        array $details = [],
        string $errorCode = DomainErrorCodes::ENTITY_NOT_FOUND
    ): self
    {
        $message = $id === null
            ? $entity . ' nao encontrado.'
            : $entity . ' nao encontrado (id=' . $id . ').';

        if ($id !== null) {
            $details['id'] = $id;
        }

        return new self($message, $errorCode, $details);
    }
}
