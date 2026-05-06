<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Service;

use NosfirQuotia\Admin\DTO\ValidateCategoryCreateCommand;
use NosfirQuotia\Admin\DTO\ValidateCategoryCreateResult;
use NosfirQuotia\System\Domain\Exception\DomainErrorCodes;

final class CategoryValidationService
{
    public function validateCreate(ValidateCategoryCreateCommand $command): ValidateCategoryCreateResult
    {
        $payload = [
            'area_type' => $this->sanitizeAreaType((string) ($command->input['area_type'] ?? 'design')),
            'name' => $this->sanitizeSingleLineText((string) ($command->input['name'] ?? ''), 160),
            'description' => $this->sanitizeMultilineText((string) ($command->input['description'] ?? ''), 2000),
            'base_price' => $this->toPositiveFloat($command->input['base_price'] ?? 0),
        ];

        $errors = [];
        if ($payload['name'] === '' || $payload['base_price'] === null || $payload['base_price'] <= 0) {
            $errors[] = 'Informe area, nome e valor base valido.';
        }

        if ($payload['base_price'] !== null && $payload['base_price'] > 100000000) {
            $errors[] = 'Valor base acima do limite permitido.';
        }

        if ($errors !== []) {
            return ValidateCategoryCreateResult::failure($errors, DomainErrorCodes::CATEGORY_VALIDATION, $payload);
        }

        $payload['base_price'] = round((float) $payload['base_price'], 2);

        return ValidateCategoryCreateResult::success($payload);
    }

    private function sanitizeAreaType(string $value): string
    {
        $areaType = strtolower(trim($value));
        $allowed = ['design', 'development'];

        return in_array($areaType, $allowed, true) ? $areaType : 'design';
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

    private function sanitizeMultilineText(string $value, int $maxLength): string
    {
        $normalized = str_replace(["\r\n", "\r"], "\n", trim($value));
        if ($normalized === '') {
            return '';
        }

        $normalized = preg_replace('/[^\P{C}\n\t]/u', '', $normalized) ?? $normalized;

        return $this->limitTextLength($normalized, $maxLength);
    }

    private function toPositiveFloat(mixed $value): ?float
    {
        $raw = trim((string) $value);
        if ($raw === '') {
            return null;
        }

        $normalized = str_replace([' ', ','], ['', '.'], $raw);
        $normalized = preg_replace('/[^0-9.\-]/', '', $normalized) ?? '';
        if (substr_count($normalized, '.') > 1) {
            $lastDot = strrpos($normalized, '.');
            if ($lastDot !== false) {
                $whole = str_replace('.', '', substr($normalized, 0, $lastDot));
                $fraction = substr($normalized, $lastDot + 1);
                $normalized = $whole . '.' . $fraction;
            }
        }

        if ($normalized === '' || !is_numeric($normalized)) {
            return null;
        }

        return (float) $normalized;
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
