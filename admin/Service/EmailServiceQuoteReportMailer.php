<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Service;

use NosfirQuotia\System\Library\EmailService;

final class EmailServiceQuoteReportMailer implements QuoteReportMailerInterface
{
    public function __construct(
        private readonly EmailService $emailService
    ) {
    }

    public function send(array $message): array
    {
        return $this->emailService->send($message);
    }
}

