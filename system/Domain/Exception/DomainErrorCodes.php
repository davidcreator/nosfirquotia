<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Domain\Exception;

final class DomainErrorCodes
{
    public const DOMAIN_ERROR = 'domain_error';
    public const VALIDATION_FAILED = 'validation_failed';
    public const ENTITY_NOT_FOUND = 'entity_not_found';

    public const QUOTE_REQUEST_NOT_FOUND = 'quote_request_not_found';
    public const QUOTE_REPORT_VALIDATION = 'quote_report_validation';
    public const TAX_SETTINGS_VALIDATION = 'tax_settings_validation';
    public const QUOTE_REQUEST_VALIDATION = 'quote_request_validation';
    public const ADMIN_USER_VALIDATION = 'admin_user_validation';
    public const CATEGORY_VALIDATION = 'category_validation';
}
