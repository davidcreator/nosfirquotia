<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Service;

interface QuoteReportMailerInterface
{
    /**
     * @param array<string, mixed> $message
     * @return array<string, mixed>
     */
    public function send(array $message): array;
}

