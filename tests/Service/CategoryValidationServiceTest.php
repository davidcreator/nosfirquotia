<?php

declare(strict_types=1);

use NosfirQuotia\Admin\DTO\ValidateCategoryCreateCommand;
use NosfirQuotia\Admin\Service\CategoryValidationService;
use NosfirQuotia\System\Domain\Exception\DomainErrorCodes;

function run_category_validation_service_tests(): int
{
    $tests = 0;
    $service = new CategoryValidationService();

    $invalid = $service->validateCreate(
        new ValidateCategoryCreateCommand(
            [
                'area_type' => 'design',
                'name' => '',
                'description' => 'teste',
                'base_price' => '',
            ]
        )
    );
    test_assert_true(!$invalid->ok, 'CategoryValidationService should fail with missing required fields');
    test_assert_true(count($invalid->errors) > 0, 'CategoryValidationService should expose validation errors');
    test_assert_same(
        DomainErrorCodes::CATEGORY_VALIDATION,
        $invalid->errorCode,
        'CategoryValidationService validation error code'
    );
    $tests += 3;

    $valid = $service->validateCreate(
        new ValidateCategoryCreateCommand(
            [
                'area_type' => 'development',
                'name' => ' API Integrations ',
                'description' => "Escopo principal\nIntegracoes",
                'base_price' => '2.500,50',
            ]
        )
    );
    test_assert_true($valid->ok, 'CategoryValidationService should accept valid payload');
    test_assert_same('development', (string) ($valid->payload['area_type'] ?? ''), 'Area type should be normalized');
    test_assert_same(2500.5, (float) ($valid->payload['base_price'] ?? 0.0), 'Base price should parse localized number');
    $tests += 3;

    $tooHigh = $service->validateCreate(
        new ValidateCategoryCreateCommand(
            [
                'area_type' => 'design',
                'name' => 'Branding',
                'base_price' => '100000001',
            ]
        )
    );
    test_assert_true(!$tooHigh->ok, 'CategoryValidationService should reject extremely high base price');
    $tests++;

    return $tests;
}
