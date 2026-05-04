<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Model;

use NosfirQuotia\System\Engine\Model;

final class ReferencePriceModel extends Model
{
    public function grouped(): array
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
            $catalogCode = (string) $row['catalog_code'];
            $serviceArea = $this->detectServiceArea(
                (string) ($row['catalog_name'] ?? ''),
                (string) ($row['group_name'] ?? ''),
                (string) ($row['service_name'] ?? '')
            );
            $row['service_area'] = $serviceArea;
            $catalogLabel = trim(
                $catalogCode . ' - ' . (string) $row['catalog_name']
                . (!empty($row['catalog_subtitle']) ? ' (' . (string) $row['catalog_subtitle'] . ')' : '')
            );

            if (!isset($grouped[$catalogCode])) {
                $grouped[$catalogCode] = [
                    'label' => $catalogLabel,
                    'items' => [],
                    'design_count' => 0,
                    'development_count' => 0,
                    'area' => 'design',
                ];
            }

            $grouped[$catalogCode]['items'][] = $row;
            if ($serviceArea === 'development') {
                $grouped[$catalogCode]['development_count']++;
            } else {
                $grouped[$catalogCode]['design_count']++;
            }
        }

        foreach ($grouped as &$catalog) {
            $developmentCount = (int) ($catalog['development_count'] ?? 0);
            $designCount = (int) ($catalog['design_count'] ?? 0);

            if ($developmentCount > 0 && $designCount > 0) {
                $catalog['area'] = 'mixed';
            } elseif ($developmentCount > 0) {
                $catalog['area'] = 'development';
            } else {
                $catalog['area'] = 'design';
            }

            unset($catalog['development_count'], $catalog['design_count']);
        }
        unset($catalog);

        return $grouped;
    }

    public function totals(): array
    {
        $row = $this->db->fetch(
            'SELECT
                (SELECT COUNT(*) FROM reference_price_catalogs) AS catalogs_total,
                (SELECT COUNT(*) FROM reference_price_items) AS items_total'
        );

        return [
            'catalogs_total' => (int) ($row['catalogs_total'] ?? 0),
            'items_total' => (int) ($row['items_total'] ?? 0),
        ];
    }

    private function detectServiceArea(string $catalogName, string $groupName, string $serviceName): string
    {
        $text = $this->normalizeAreaText($catalogName . ' ' . $groupName . ' ' . $serviceName);

        $developmentKeywords = [
            'desenvolvimento', 'software', 'sistema', 'sistemas', 'web', 'website', 'portal',
            'mobile', 'app', 'aplicativo', 'desktop', 'saas', 'api', 'integracao', 'backend',
            'frontend', 'fullstack', 'programacao', 'codigo', 'automacao', 'banco de dados'
        ];

        foreach ($developmentKeywords as $keyword) {
            if (str_contains($text, $keyword)) {
                return 'development';
            }
        }

        return 'design';
    }

    private function normalizeAreaText(string $text): string
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
        ]);

        $text = preg_replace('/[^a-z0-9]+/', ' ', $text) ?? $text;
        $text = preg_replace('/\s+/', ' ', $text) ?? $text;

        return trim($text);
    }
}
