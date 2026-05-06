<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Service;

use NosfirQuotia\Admin\DTO\ValidateAdminUserCreateCommand;
use NosfirQuotia\Admin\DTO\ValidateAdminUserResult;
use NosfirQuotia\Admin\DTO\ValidateAdminUserUpdateCommand;
use NosfirQuotia\System\Domain\Exception\DomainErrorCodes;
use NosfirQuotia\System\Library\Auth;

final class AdminUserValidationService
{
    public function validateCreate(ValidateAdminUserCreateCommand $command): ValidateAdminUserResult
    {
        $payload = [
            'name' => $this->sanitizeSingleLineText((string) ($command->input['name'] ?? ''), 120),
            'email' => $this->sanitizeEmailAddress((string) ($command->input['email'] ?? '')),
            'password' => (string) ($command->input['password'] ?? ''),
            'access_level' => $this->sanitizeSingleLineText((string) ($command->input['access_level'] ?? 'Operacional'), 80),
            'is_active' => $this->toBoolValue($command->input['is_active'] ?? false),
            'permissions' => $this->normalizePermissionsInput($command->input['permissions'] ?? []),
        ];

        $errors = $this->validateBasePayload($payload, true);

        if (strlen((string) $payload['password']) < 6) {
            $errors[] = 'Senha deve ter pelo menos 6 caracteres.';
        }
        if (strlen((string) $payload['password']) > 200) {
            $errors[] = 'Senha excede o tamanho maximo permitido.';
        }

        if ($errors !== []) {
            return ValidateAdminUserResult::failure($errors, DomainErrorCodes::ADMIN_USER_VALIDATION, $payload);
        }

        return ValidateAdminUserResult::success($payload);
    }

    public function validateUpdate(ValidateAdminUserUpdateCommand $command): ValidateAdminUserResult
    {
        $payload = [
            'name' => $this->sanitizeSingleLineText((string) ($command->input['name'] ?? ''), 120),
            'email' => $this->sanitizeEmailAddress((string) ($command->input['email'] ?? '')),
            'new_password' => (string) ($command->input['new_password'] ?? ''),
            'access_level' => $this->sanitizeSingleLineText((string) ($command->input['access_level'] ?? 'Operacional'), 80),
            'is_active' => $this->toBoolValue($command->input['is_active'] ?? false),
            'permissions' => $this->normalizePermissionsInput($command->input['permissions'] ?? []),
        ];

        if ($command->targetIsGeneralAdmin) {
            $payload['access_level'] = 'Administrador Geral';
            $payload['is_active'] = true;
            $payload['permissions'] = Auth::permissionKeys();
        }

        $errors = $this->validateBasePayload($payload, !$command->targetIsGeneralAdmin);

        if ($payload['new_password'] !== '' && strlen((string) $payload['new_password']) < 6) {
            $errors[] = 'Nova senha deve ter pelo menos 6 caracteres.';
        }
        if (strlen((string) $payload['new_password']) > 200) {
            $errors[] = 'Nova senha excede o tamanho maximo permitido.';
        }

        if (
            !$command->targetIsGeneralAdmin
            && $command->targetAdminId === $command->currentAdminId
            && !$payload['is_active']
        ) {
            $errors[] = 'Voce nao pode desativar sua propria conta logada.';
        }

        if ($errors !== []) {
            return ValidateAdminUserResult::failure($errors, DomainErrorCodes::ADMIN_USER_VALIDATION, $payload);
        }

        return ValidateAdminUserResult::success($payload);
    }

    /**
     * @param array<string, mixed> $payload
     * @return array<int, string>
     */
    private function validateBasePayload(array $payload, bool $requirePermissions): array
    {
        $errors = [];

        if ($payload['name'] === '' || $payload['email'] === '' || $payload['access_level'] === '') {
            $errors[] = 'Preencha nome, email e nivel de acesso.';
        }

        if (filter_var((string) $payload['email'], FILTER_VALIDATE_EMAIL) === false) {
            $errors[] = 'E-mail invalido.';
        }

        if ($requirePermissions && ($payload['permissions'] ?? []) === []) {
            $errors[] = 'Selecione pelo menos uma permissao para o usuario.';
        }

        return $errors;
    }

    /**
     * @return array<int, string>
     */
    private function normalizePermissionsInput(mixed $raw): array
    {
        if (!is_array($raw)) {
            return [];
        }

        $allowedPermissions = array_keys(Auth::permissionCatalog());
        $permissions = [];
        foreach ($raw as $permission) {
            $permission = (string) $permission;
            if ($permission !== '' && in_array($permission, $allowedPermissions, true)) {
                $permissions[$permission] = $permission;
            }
        }

        return array_values($permissions);
    }

    private function sanitizeSingleLineText(string $value, int $maxLength): string
    {
        $normalized = trim($value);
        if ($normalized === '') {
            return '';
        }

        $normalized = preg_replace('/\s+/u', ' ', $normalized) ?? $normalized;
        $normalized = preg_replace('/[\x00-\x1F\x7F]/u', '', $normalized) ?? $normalized;

        return $this->limitTextLength($normalized, $maxLength);
    }

    private function sanitizeEmailAddress(string $value): string
    {
        $email = strtolower(trim($value));
        $email = preg_replace('/[\x00-\x1F\x7F\s]+/u', '', $email) ?? $email;

        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false ? $email : '';
    }

    private function toBoolValue(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        $normalized = strtolower(trim((string) $value));

        return in_array($normalized, ['1', 'true', 'on', 'sim', 'yes'], true);
    }

    private function limitTextLength(string $value, int $maxLength): string
    {
        if ($maxLength < 1) {
            return '';
        }

        if (function_exists('mb_substr')) {
            return (string) mb_substr($value, 0, $maxLength, 'UTF-8');
        }

        return substr($value, 0, $maxLength);
    }
}
