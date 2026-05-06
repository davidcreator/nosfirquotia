<?php

declare(strict_types=1);

use NosfirQuotia\Admin\DTO\ValidateTaxSettingsCommand;
use NosfirQuotia\Admin\Service\TaxSettingsService;
use NosfirQuotia\System\Domain\Exception\DomainErrorCodes;

function run_tax_settings_service_tests(): int
{
    $tests = 0;
    $service = new TaxSettingsService();

    $invalid = $service->validateAndBuild(
        new ValidateTaxSettingsCommand(
            [
                'imposto_label' => '',
                'taxa_label' => '',
                'encargo_label' => '',
                'tax_regime' => 'mei',
                'municipality_name' => '',
                'iss_percent' => '',
                'check_regime' => false,
                'check_iss' => false,
                'check_retentions' => false,
                'check_nfse' => false,
                'legal_review_date' => '',
                'legal_responsible_name' => '',
            ]
        )
    );

    test_assert_true(!$invalid->ok, 'TaxSettingsService should fail on invalid payload');
    test_assert_true(count($invalid->errors) > 0, 'TaxSettingsService should expose validation errors');
    test_assert_same(DomainErrorCodes::TAX_SETTINGS_VALIDATION, $invalid->errorCode, 'TaxSettingsService validation error code');
    $tests += 3;

    $valid = $service->validateAndBuild(
        new ValidateTaxSettingsCommand(
            [
                'imposto_label' => 'Impostos',
                'imposto_percent' => '5',
                'taxa_label' => 'Taxas',
                'taxa_percent' => '1',
                'encargo_label' => 'Encargos',
                'encargo_percent' => '2',
                'tax_regime' => 'simples_nacional',
                'municipality_name' => 'Sao Paulo',
                'iss_percent' => '2',
                'apply_iss_withholding' => false,
                'apply_irrf_withholding' => false,
                'apply_pcc_withholding' => false,
                'apply_inss_withholding' => false,
                'legal_responsible_name' => 'Equipe Fiscal',
                'legal_review_date' => '2026-05-05',
                'check_regime' => true,
                'check_iss' => true,
                'check_retentions' => true,
                'check_nfse' => true,
            ]
        )
    );

    test_assert_true($valid->ok, 'TaxSettingsService should succeed on valid payload');
    test_assert_true(isset($valid->settings['legal_notes']), 'TaxSettingsService should produce legal_notes payload');
    $tests += 2;

    return $tests;
}
