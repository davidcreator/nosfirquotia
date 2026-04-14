<?php

declare(strict_types=1);

namespace AureaQuotia\System\Library;

use RuntimeException;

final class ReferencePriceImporter
{
    public function __construct(private readonly Database $database)
    {
    }

    public function importFromJson(string $path): void
    {
        if (!is_file($path)) {
            throw new RuntimeException('Arquivo de referencia de precos nao encontrado: ' . $path);
        }

        $raw = file_get_contents($path);
        if ($raw === false) {
            throw new RuntimeException('Nao foi possivel ler o arquivo de referencia de precos.');
        }

        $payload = json_decode($raw, true);
        if (!is_array($payload) || !isset($payload['catalogs']) || !is_array($payload['catalogs'])) {
            throw new RuntimeException('JSON de referencia de precos invalido.');
        }

        $this->database->execute('DELETE FROM reference_price_items');
        $this->database->execute('DELETE FROM reference_price_catalogs');

        $catalogOrder = 1;
        foreach ($payload['catalogs'] as $catalog) {
            if (!is_array($catalog)) {
                continue;
            }

            $catalogCode = trim((string) ($catalog['code'] ?? ''));
            $catalogName = trim((string) ($catalog['name'] ?? ''));
            $catalogSubtitle = trim((string) ($catalog['subtitle'] ?? ''));

            if ($catalogCode === '' || $catalogName === '') {
                continue;
            }

            $this->database->execute(
                'INSERT INTO reference_price_catalogs (code, name, subtitle, display_order)
                 VALUES (:code, :name, :subtitle, :display_order)',
                [
                    'code' => $catalogCode,
                    'name' => $catalogName,
                    'subtitle' => $catalogSubtitle !== '' ? $catalogSubtitle : null,
                    'display_order' => $catalogOrder,
                ]
            );

            $catalogId = $this->database->lastInsertId();
            $catalogOrder++;

            $items = $catalog['items'] ?? [];
            if (!is_array($items)) {
                continue;
            }

            $itemOrder = 1;
            foreach ($items as $item) {
                if (!is_array($item)) {
                    continue;
                }

                $serviceName = trim((string) ($item['name'] ?? ''));
                if ($serviceName === '') {
                    continue;
                }

                $groupName = trim((string) ($item['group'] ?? ''));
                $referenceCode = trim((string) ($item['reference_code'] ?? ''));
                $minLabel = trim((string) ($item['min_price_raw'] ?? ''));
                $maxLabel = trim((string) ($item['max_price_raw'] ?? ''));

                $minPrice = $this->asNullableFloat($item['min_price'] ?? null);
                $maxPrice = $this->asNullableFloat($item['max_price'] ?? null);

                if ($minLabel === '' && $minPrice !== null) {
                    $minLabel = (string) number_format($minPrice, 2, ',', '.');
                }

                if ($maxLabel === '' && $maxPrice !== null) {
                    $maxLabel = (string) number_format($maxPrice, 2, ',', '.');
                }

                if ($minLabel === '') {
                    $minLabel = '-';
                }

                if ($maxLabel === '') {
                    $maxLabel = '-';
                }

                $this->database->execute(
                    'INSERT INTO reference_price_items (
                        catalog_id, display_order, group_name, reference_code, service_name,
                        min_price, max_price, min_price_label, max_price_label, currency
                    ) VALUES (
                        :catalog_id, :display_order, :group_name, :reference_code, :service_name,
                        :min_price, :max_price, :min_price_label, :max_price_label, :currency
                    )',
                    [
                        'catalog_id' => $catalogId,
                        'display_order' => $itemOrder,
                        'group_name' => $groupName !== '' ? $groupName : null,
                        'reference_code' => $referenceCode !== '' ? $referenceCode : null,
                        'service_name' => $serviceName,
                        'min_price' => $minPrice,
                        'max_price' => $maxPrice,
                        'min_price_label' => $minLabel,
                        'max_price_label' => $maxLabel,
                        'currency' => 'BRL',
                    ]
                );

                $itemOrder++;
            }
        }
    }

    private function asNullableFloat(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_numeric($value)) {
            return round((float) $value, 2);
        }

        return null;
    }
}
