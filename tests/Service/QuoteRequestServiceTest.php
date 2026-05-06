<?php

declare(strict_types=1);

use NosfirQuotia\Cliente\DTO\SubmitQuoteRequestCommand;
use NosfirQuotia\Cliente\Service\QuoteRequestService;
use NosfirQuotia\System\Domain\Exception\DomainErrorCodes;
use Tests\Service\Fakes\FakeQuoteRequestRepository;

function run_quote_request_service_tests(): int
{
    $tests = 0;

    $repo = new FakeQuoteRequestRepository();
    $service = new QuoteRequestService($repo);
    $invalid = $service->validateAndCreate(
        new SubmitQuoteRequestCommand(
            50,
            [
                'project_title' => '',
                'client_person_type' => 'pf',
                'client_area' => '',
                'service_category' => '',
                'business_moment' => '',
                'priority_channel' => '',
                'project_priority' => '',
                'service_ids' => [],
            ]
        )
    );

    test_assert_true(!$invalid->ok, 'QuoteRequestService should fail with invalid payload');
    test_assert_true(count($invalid->errors) > 0, 'QuoteRequestService should expose validation errors');
    test_assert_same(DomainErrorCodes::QUOTE_REQUEST_VALIDATION, $invalid->errorCode, 'QuoteRequestService validation error code');
    $tests += 3;

    $repo = new FakeQuoteRequestRepository();
    $repo->existingIds = [3];
    $repo->servicesById = [
        3 => [
            'reference_code' => 'DV-01',
            'service_name' => 'Criacao de logo',
            'group_name' => 'Design',
        ],
    ];
    $service = new QuoteRequestService($repo);
    $valid = $service->validateAndCreate(
        new SubmitQuoteRequestCommand(
            77,
            [
                'project_title' => 'Projeto Y',
                'client_person_type' => 'pf',
                'client_area' => 'tecnologia',
                'service_category' => 'criacao_logo',
                'requested_availability' => 'Comercial',
                'business_moment' => 'inicio',
                'priority_channel' => 'digital',
                'project_priority' => 'equilibrio',
                'service_view_mode' => 'recommended',
                'service_ids' => [3],
            ]
        )
    );

    test_assert_true($valid->ok, 'QuoteRequestService should succeed with valid payload');
    test_assert_same(77, $repo->lastCreateClientUserId, 'QuoteRequestService should persist with current client user id');
    test_assert_true($repo->lastCreatePayload !== null, 'QuoteRequestService should persist payload');
    test_assert_true($repo->lastCreateServiceIds !== null && count($repo->lastCreateServiceIds) === 1, 'QuoteRequestService should persist selected services');
    $tests += 4;

    return $tests;
}
