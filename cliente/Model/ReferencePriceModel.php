<?php

declare(strict_types=1);

namespace AureaQuotia\Cliente\Model;

use AureaQuotia\System\Engine\Model;

final class ReferencePriceModel extends Model
{
    public function groupedForRequest(): array
    {
        $rows = $this->db->fetchAll(
            'SELECT
                i.id,
                i.reference_code,
                i.service_name,
                i.group_name,
                c.code AS catalog_code,
                c.name AS catalog_name
             FROM reference_price_items i
             INNER JOIN reference_price_catalogs c ON c.id = i.catalog_id
             ORDER BY c.display_order ASC, i.display_order ASC'
        );

        $grouped = [];

        foreach ($rows as $row) {
            $row['company_profile'] = $this->detectCompanyProfile(
                (string) ($row['service_name'] ?? ''),
                (string) ($row['group_name'] ?? '')
            );

            $catalogCode = (string) $row['catalog_code'];
            $catalogName = (string) $row['catalog_name'];
            $catalogLabel = trim($catalogCode . ' - ' . $catalogName);

            if (!isset($grouped[$catalogCode])) {
                $grouped[$catalogCode] = [
                    'label' => $catalogLabel,
                    'items' => [],
                ];
            }

            $grouped[$catalogCode]['items'][] = $row;
        }

        return $grouped;
    }

    public function groupedForSelect(): array
    {
        $rows = $this->db->fetchAll(
            'SELECT
                i.id,
                i.reference_code,
                i.service_name,
                i.group_name,
                i.min_price,
                i.max_price,
                i.min_price_label,
                i.max_price_label,
                c.code AS catalog_code,
                c.name AS catalog_name,
                c.subtitle AS catalog_subtitle
             FROM reference_price_items i
             INNER JOIN reference_price_catalogs c ON c.id = i.catalog_id
             ORDER BY c.display_order ASC, i.display_order ASC'
        );

        $grouped = [];

        foreach ($rows as $row) {
            $row['company_profile'] = $this->detectCompanyProfile(
                (string) ($row['service_name'] ?? ''),
                (string) ($row['group_name'] ?? '')
            );

            $catalogCode = (string) $row['catalog_code'];
            $catalogName = (string) $row['catalog_name'];
            $catalogSubtitle = (string) ($row['catalog_subtitle'] ?? '');
            $catalogLabel = trim($catalogCode . ' - ' . $catalogName . ($catalogSubtitle !== '' ? ' (' . $catalogSubtitle . ')' : ''));

            if (!isset($grouped[$catalogCode])) {
                $grouped[$catalogCode] = [
                    'label' => $catalogLabel,
                    'items' => [],
                ];
            }

            $grouped[$catalogCode]['items'][] = $row;
        }

        return $grouped;
    }

    public function findById(int $id): ?array
    {
        return $this->db->fetch(
            'SELECT
                i.id,
                i.reference_code,
                i.service_name,
                i.group_name,
                i.min_price,
                i.max_price,
                i.min_price_label,
                i.max_price_label,
                c.code AS catalog_code,
                c.name AS catalog_name
             FROM reference_price_items i
             INNER JOIN reference_price_catalogs c ON c.id = i.catalog_id
             WHERE i.id = :id
             LIMIT 1',
            ['id' => $id]
        );
    }

    public function existingIds(array $ids): array
    {
        $ids = array_values(array_unique(array_map('intval', $ids)));
        $ids = array_filter($ids, static fn (int $id): bool => $id > 0);

        if ($ids === []) {
            return [];
        }

        $in = implode(',', $ids);
        $rows = $this->db->fetchAll("SELECT id FROM reference_price_items WHERE id IN ({$in})");

        return array_map(static fn (array $row): int => (int) $row['id'], $rows);
    }

    private function detectCompanyProfile(string $serviceName, string $groupName): string
    {
        $rawText = strtolower($serviceName . ' ' . $groupName);
        if (str_contains($rawText, 'microempreendedor individual') || preg_match('/\bmei\b/i', $serviceName . ' ' . $groupName) === 1) {
            return 'mei';
        }

        $normalized = $this->normalizeProfileText($serviceName . ' ' . $groupName);

        if (str_contains($normalized, 'microempresa')) {
            return 'microempresa';
        }

        if (str_contains($normalized, 'pequena empresa')) {
            return 'pequena';
        }

        if (str_contains($normalized, 'media empresa')) {
            return 'media';
        }

        if (str_contains($normalized, 'grande empresa')) {
            return 'grande';
        }

        return 'geral';
    }

    private function normalizeProfileText(string $text): string
    {
        if (function_exists('mb_strtolower')) {
            $text = mb_strtolower($text, 'UTF-8');
        } else {
            $text = strtolower($text);
        }

        $text = strtr($text, [
            'á' => 'a', 'à' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a',
            'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
            'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
            'ó' => 'o', 'ò' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o',
            'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
            'ç' => 'c',
            // Common mojibake sequences when UTF-8 data is interpreted as ISO-8859-1.
            'ã¡' => 'a', 'ã¢' => 'a', 'ã£' => 'a', 'ã¤' => 'a',
            'ã©' => 'e', 'ãª' => 'e',
            'ã­' => 'i',
            'ã³' => 'o', 'ã´' => 'o', 'ãµ' => 'o',
            'ãº' => 'u',
            'ã§' => 'c',
        ]);

        $text = preg_replace('/[^a-z0-9]+/', ' ', $text) ?? $text;
        $text = preg_replace('/\s+/', ' ', $text) ?? $text;

        return trim($text);
    }
}
