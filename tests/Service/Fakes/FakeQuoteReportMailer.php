<?php

declare(strict_types=1);

namespace Tests\Service\Fakes;

use NosfirQuotia\Admin\Service\QuoteReportMailerInterface;

final class FakeQuoteReportMailer implements QuoteReportMailerInterface
{
    /**
     * @var array<string, mixed>|null
     */
    public ?array $lastMessage = null;

    /**
     * @var array<string, mixed>
     */
    public array $response = [
        'status' => 'sent',
    ];

    public function send(array $message): array
    {
        $this->lastMessage = $message;
        return $this->response;
    }
}

