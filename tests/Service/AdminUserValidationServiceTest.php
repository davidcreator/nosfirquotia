<?php

declare(strict_types=1);

use NosfirQuotia\Admin\DTO\ValidateAdminUserCreateCommand;
use NosfirQuotia\Admin\DTO\ValidateAdminUserUpdateCommand;
use NosfirQuotia\Admin\Service\AdminUserValidationService;
use NosfirQuotia\System\Domain\Exception\DomainErrorCodes;

function run_admin_user_validation_service_tests(): int
{
    $tests = 0;
    $service = new AdminUserValidationService();

    $invalidCreate = $service->validateCreate(
        new ValidateAdminUserCreateCommand(
            [
                'name' => '',
                'email' => 'invalido',
                'password' => '123',
                'access_level' => '',
                'permissions' => [],
            ]
        )
    );
    test_assert_true(!$invalidCreate->ok, 'AdminUserValidationService should fail create with invalid payload');
    test_assert_true(count($invalidCreate->errors) > 0, 'AdminUserValidationService should expose create validation errors');
    test_assert_same(
        DomainErrorCodes::ADMIN_USER_VALIDATION,
        $invalidCreate->errorCode,
        'AdminUserValidationService create error code'
    );
    $tests += 3;

    $validCreate = $service->validateCreate(
        new ValidateAdminUserCreateCommand(
            [
                'name' => '  Maria  ',
                'email' => ' MARIA@EXAMPLE.COM ',
                'password' => 'SenhaForte123',
                'access_level' => 'Operacional',
                'is_active' => 'on',
                'permissions' => ['dashboard.view', 'dashboard.view', 'invalida'],
            ]
        )
    );
    test_assert_true($validCreate->ok, 'AdminUserValidationService should accept valid create payload');
    test_assert_same('maria@example.com', (string) ($validCreate->payload['email'] ?? ''), 'Create email should be sanitized');
    test_assert_same(
        ['dashboard.view'],
        $validCreate->payload['permissions'] ?? [],
        'Create permissions should be normalized and deduplicated'
    );
    $tests += 3;

    $selfDisable = $service->validateUpdate(
        new ValidateAdminUserUpdateCommand(
            15,
            false,
            15,
            [
                'name' => 'Admin Operacional',
                'email' => 'admin@example.com',
                'new_password' => '',
                'access_level' => 'Operacional',
                'is_active' => false,
                'permissions' => ['dashboard.view'],
            ]
        )
    );
    test_assert_true(!$selfDisable->ok, 'AdminUserValidationService should block self disable');
    test_assert_true(
        in_array('Voce nao pode desativar sua propria conta logada.', $selfDisable->errors, true),
        'AdminUserValidationService should expose self disable error'
    );
    $tests += 2;

    $generalAdminUpdate = $service->validateUpdate(
        new ValidateAdminUserUpdateCommand(
            1,
            true,
            99,
            [
                'name' => 'Administrador Geral',
                'email' => 'geral@example.com',
                'new_password' => '',
                'access_level' => 'Operacional',
                'is_active' => false,
                'permissions' => [],
            ]
        )
    );
    test_assert_true($generalAdminUpdate->ok, 'AdminUserValidationService should accept general admin update');
    test_assert_same(
        'Administrador Geral',
        (string) ($generalAdminUpdate->payload['access_level'] ?? ''),
        'General admin should keep fixed access level'
    );
    test_assert_true(
        (bool) ($generalAdminUpdate->payload['is_active'] ?? false),
        'General admin should remain active'
    );
    $tests += 3;

    return $tests;
}
