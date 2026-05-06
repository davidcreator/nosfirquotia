<?php

declare(strict_types=1);

use NosfirQuotia\Admin\DTO\GenerateQuoteReportCommand;
use NosfirQuotia\Admin\Service\QuoteReportService;
use NosfirQuotia\System\Domain\Exception\DomainErrorCodes;
use Tests\Service\Fakes\FakeQuoteReportMailer;
use Tests\Service\Fakes\FakeQuoteRepository;

function run_quote_report_service_tests(): int
{
    $tests = 0;

    $repo = new FakeQuoteRepository();
    $mailer = new FakeQuoteReportMailer();
    $service = new QuoteReportService($repo, $mailer);
    $result = $service->generate(
        new GenerateQuoteReportCommand(10, 7, 'http://localhost/cliente/login', [])
    );
    test_assert_true(!$result->ok, 'QuoteReportService should fail when request does not exist');
    test_assert_same('/admin/orcamentos', $result->redirect, 'QuoteReportService fallback redirect');
    test_assert_same(DomainErrorCodes::QUOTE_REQUEST_NOT_FOUND, $result->errorCode, 'QuoteReportService not found error code');
    $tests += 3;

    $repo = new FakeQuoteRepository();
    $repo->request = [
        'id' => 22,
        'client_name' => 'Cliente Teste',
        'project_title' => 'Projeto X',
        'client_email' => 'cliente@example.com',
    ];
    $repo->services = [
        [
            'id' => 3,
            'service_name' => 'Criacao de logo',
            'company_profile' => 'geral',
        ],
    ];
    $repo->taxSettings = [
        'imposto_label' => 'Impostos',
        'imposto_percent' => 5.0,
        'taxa_label' => 'Taxas',
        'taxa_percent' => 0,
        'encargo_label' => 'Encargos',
        'encargo_percent' => 0,
    ];
    $mailer = new FakeQuoteReportMailer();
    $service = new QuoteReportService($repo, $mailer);

    $result = $service->generate(
        new GenerateQuoteReportCommand(
            22,
            99,
            'http://localhost/cliente/login',
            [
                'price_3' => '1500',
                'deadline_3' => '20',
                'availability_3' => 'Seg a Sex',
                'notes_3' => 'Teste',
                'tax_label_imposto' => 'Impostos',
                'tax_percent_imposto' => '5',
                'show_tax_details' => '1',
            ]
        )
    );

    test_assert_true($result->ok, 'QuoteReportService should succeed with valid payload');
    test_assert_true($repo->lastCreatePayload !== null, 'QuoteReportService should persist report payload');
    test_assert_true($repo->lastServiceRows !== null && count($repo->lastServiceRows) === 1, 'QuoteReportService should persist service rows');
    test_assert_true($repo->lastTaxRows !== null && count($repo->lastTaxRows) === 1, 'QuoteReportService should persist tax rows');
    test_assert_true($mailer->lastMessage !== null, 'QuoteReportService should send email');
    $tests += 5;

    return $tests;
}
