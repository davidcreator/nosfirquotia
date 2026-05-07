<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Model;

use NosfirQuotia\System\Engine\Model;

final class QuoteModel extends Model
{
    private ?bool $brandManualTableReady = null;

    public function dashboardStats(): array
    {
        $totalRequests = $this->db->fetch('SELECT COUNT(*) AS total FROM quote_requests');
        $pendingRequests = $this->db->fetch("SELECT COUNT(*) AS total FROM quote_requests WHERE status IN ('pendente', 'em_analise')");
        $generatedReports = $this->db->fetch('SELECT COUNT(*) AS total FROM quote_reports');
        $referenceItems = $this->db->fetch('SELECT COUNT(*) AS total FROM reference_price_items');
        $monthRevenue = $this->db->fetch(
            "SELECT COALESCE(SUM(total_value), 0) AS total
             FROM quote_reports
             WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(NOW(), '%Y-%m')"
        );

        return [
            'total_requests' => (int) ($totalRequests['total'] ?? 0),
            'pending_requests' => (int) ($pendingRequests['total'] ?? 0),
            'generated_reports' => (int) ($generatedReports['total'] ?? 0),
            'reference_items' => (int) ($referenceItems['total'] ?? 0),
            'month_revenue' => (float) ($monthRevenue['total'] ?? 0),
        ];
    }

    public function latest(int $limit = 8): array
    {
        $limit = max(1, min(50, $limit));

        return $this->db->fetchAll(
            "SELECT
                qr.id,
                qr.project_title,
                qr.status,
                qr.created_at,
                cu.name AS client_name,
                (SELECT COUNT(*) FROM quote_request_items qri WHERE qri.quote_request_id = qr.id) AS services_count,
                rep.total_value,
                rep.valid_until
             FROM quote_requests qr
             INNER JOIN client_users cu ON cu.id = qr.client_user_id
             LEFT JOIN quote_reports rep ON rep.quote_request_id = qr.id
             ORDER BY qr.created_at DESC
             LIMIT {$limit}"
        );
    }

    public function all(): array
    {
        return $this->db->fetchAll(
            'SELECT
                qr.id,
                qr.project_title,
                qr.status,
                qr.created_at,
                cu.name AS client_name,
                cu.email AS client_email,
                (SELECT COUNT(*) FROM quote_request_items qri WHERE qri.quote_request_id = qr.id) AS services_count,
                rep.total_value,
                rep.valid_until
             FROM quote_requests qr
             INNER JOIN client_users cu ON cu.id = qr.client_user_id
             LEFT JOIN quote_reports rep ON rep.quote_request_id = qr.id
             ORDER BY qr.created_at DESC'
        );
    }

    public function find(int $requestId): ?array
    {
        return $this->db->fetch(
            'SELECT
                qr.*,
                cu.name AS client_name,
                cu.email AS client_email,
                cu.phone AS client_phone,
                rep.id AS report_id,
                rep.subtotal_value,
                rep.taxes_total_value,
                rep.total_value,
                rep.total_deadline_days,
                rep.availability_summary,
                rep.report_notes,
                rep.show_tax_details,
                rep.valid_until,
                rep.created_at AS report_created_at,
                au.name AS report_admin_name
             FROM quote_requests qr
             INNER JOIN client_users cu ON cu.id = qr.client_user_id
             LEFT JOIN quote_reports rep ON rep.quote_request_id = qr.id
             LEFT JOIN admin_users au ON au.id = rep.admin_user_id
             WHERE qr.id = :id
             LIMIT 1',
            ['id' => $requestId]
        );
    }

    public function requestServices(int $requestId): array
    {
        $rows = $this->db->fetchAll(
            'SELECT
                rpi.id,
                rpi.reference_code,
                rpi.service_name,
                rpi.group_name,
                rpi.min_price,
                rpi.max_price,
                rpi.min_price_label,
                rpi.max_price_label,
                rpc.code AS catalog_code,
                rpc.name AS catalog_name
             FROM quote_request_items qri
             INNER JOIN reference_price_items rpi ON rpi.id = qri.reference_price_item_id
             INNER JOIN reference_price_catalogs rpc ON rpc.id = rpi.catalog_id
             WHERE qri.quote_request_id = :request_id
             ORDER BY rpc.display_order ASC, rpi.display_order ASC',
            ['request_id' => $requestId]
        );

        foreach ($rows as &$row) {
            $row['company_profile'] = $this->detectCompanyProfile(
                (string) ($row['service_name'] ?? ''),
                (string) ($row['group_name'] ?? '')
            );
            $row['service_area'] = $this->detectServiceArea(
                (string) ($row['catalog_name'] ?? ''),
                (string) ($row['group_name'] ?? ''),
                (string) ($row['service_name'] ?? '')
            );
        }
        unset($row);

        return $rows;
    }

    public function reportItems(int $reportId): array
    {
        return $this->db->fetchAll(
            'SELECT
                id,
                reference_price_item_id,
                service_name,
                price_value,
                deadline_days,
                availability_label,
                notes
             FROM quote_report_items
             WHERE quote_report_id = :report_id
             ORDER BY id ASC',
            ['report_id' => $reportId]
        );
    }

    public function reportTaxes(int $reportId): array
    {
        return $this->db->fetchAll(
            'SELECT
                tax_key,
                tax_label,
                tax_percent,
                tax_amount
             FROM quote_report_taxes
             WHERE quote_report_id = :report_id
             ORDER BY id ASC',
            ['report_id' => $reportId]
        );
    }

    public function brandManual(int $requestId): ?array
    {
        if (!$this->ensureBrandManualTable()) {
            return null;
        }

        return $this->db->fetch(
            'SELECT
                bmr.id,
                bmr.quote_request_id,
                bmr.admin_user_id,
                bmr.schema_version,
                bmr.tool_source,
                bmr.generated_at,
                bmr.payload_json,
                bmr.created_at,
                bmr.updated_at,
                au.name AS admin_name
             FROM brand_manual_reports bmr
             LEFT JOIN admin_users au ON au.id = bmr.admin_user_id
             WHERE bmr.quote_request_id = :request_id
             LIMIT 1',
            ['request_id' => $requestId]
        );
    }

    public function saveBrandManualReport(
        int $requestId,
        int $adminUserId,
        string $payloadJson,
        string $schemaVersion,
        string $toolSource,
        ?string $generatedAt
    ): bool {
        if (!$this->ensureBrandManualTable()) {
            return false;
        }
        $this->db->execute(
            'INSERT INTO brand_manual_reports (
                quote_request_id, admin_user_id, schema_version, tool_source, generated_at, payload_json
             ) VALUES (
                :quote_request_id, :admin_user_id, :schema_version, :tool_source, :generated_at, :payload_json
             )
             ON DUPLICATE KEY UPDATE
                admin_user_id = VALUES(admin_user_id),
                schema_version = VALUES(schema_version),
                tool_source = VALUES(tool_source),
                generated_at = VALUES(generated_at),
                payload_json = VALUES(payload_json)',
            [
                'quote_request_id' => $requestId,
                'admin_user_id' => $adminUserId,
                'schema_version' => $schemaVersion,
                'tool_source' => $toolSource,
                'generated_at' => $generatedAt,
                'payload_json' => $payloadJson,
            ]
        );

        return true;
    }

    public function taxSettings(): array
    {
        $defaults = $this->defaultTaxSettings();

        $this->db->execute(
            'INSERT INTO tax_settings (id)
             VALUES (1)
             ON DUPLICATE KEY UPDATE id = id'
        );

        $row = $this->db->fetch(
            'SELECT
                id,
                imposto_label,
                imposto_percent,
                taxa_label,
                taxa_percent,
                encargo_label,
                encargo_percent,
                legal_notes
             FROM tax_settings
             WHERE id = 1
             LIMIT 1'
        );

        if ($row === null) {
            return $defaults;
        }

        $normalized = [
            'id' => (int) ($row['id'] ?? 1),
            'imposto_label' => $this->normalizeTaxLabel(
                trim((string) ($row['imposto_label'] ?? '')),
                'Impostos',
                $defaults['imposto_label']
            ),
            'imposto_percent' => round((float) ($row['imposto_percent'] ?? 0), 2),
            'taxa_label' => $this->normalizeTaxLabel(
                trim((string) ($row['taxa_label'] ?? '')),
                'Taxas',
                $defaults['taxa_label']
            ),
            'taxa_percent' => round((float) ($row['taxa_percent'] ?? 0), 2),
            'encargo_label' => $this->normalizeTaxLabel(
                trim((string) ($row['encargo_label'] ?? '')),
                'Encargos tributarios',
                $defaults['encargo_label']
            ),
            'encargo_percent' => round((float) ($row['encargo_percent'] ?? 0), 2),
            'legal_notes' => $row['legal_notes'],
        ];

        $decodedPayload = $this->decodeTaxCompliancePayload($normalized['legal_notes']);
        $settings = array_merge($defaults, $normalized, $decodedPayload['fields']);

        if (empty($decodedPayload['is_structured']) && $settings['legal_notes_text'] === '') {
            $settings['legal_notes_text'] = trim((string) ($normalized['legal_notes'] ?? ''));
        }

        $settings['legal_notes_is_structured'] = !empty($decodedPayload['is_structured']);
        $settings['legal_notes_raw'] = (string) ($normalized['legal_notes'] ?? '');

        return $settings;
    }

    public function saveTaxSettings(array $settings): void
    {
        $this->db->execute(
            'INSERT INTO tax_settings (
                id, imposto_label, imposto_percent, taxa_label, taxa_percent, encargo_label, encargo_percent, legal_notes
             ) VALUES (
                1, :imposto_label, :imposto_percent, :taxa_label, :taxa_percent, :encargo_label, :encargo_percent, :legal_notes
             )
             ON DUPLICATE KEY UPDATE
                imposto_label = VALUES(imposto_label),
                imposto_percent = VALUES(imposto_percent),
                taxa_label = VALUES(taxa_label),
                taxa_percent = VALUES(taxa_percent),
                encargo_label = VALUES(encargo_label),
                encargo_percent = VALUES(encargo_percent),
                legal_notes = VALUES(legal_notes)',
            [
                'imposto_label' => $settings['imposto_label'],
                'imposto_percent' => $settings['imposto_percent'],
                'taxa_label' => $settings['taxa_label'],
                'taxa_percent' => $settings['taxa_percent'],
                'encargo_label' => $settings['encargo_label'],
                'encargo_percent' => $settings['encargo_percent'],
                'legal_notes' => $settings['legal_notes'],
            ]
        );
    }

    private function defaultTaxSettings(): array
    {
        return [
            'id' => 1,
            'imposto_label' => 'Tributos sobre faturamento',
            'imposto_percent' => 0.0,
            'taxa_label' => 'Taxas administrativas',
            'taxa_percent' => 0.0,
            'encargo_label' => 'Encargos gerais',
            'encargo_percent' => 0.0,
            'legal_notes' => null,
            'tax_regime' => 'simples_nacional',
            'municipality_name' => '',
            'iss_percent' => 2.0,
            'apply_iss_withholding' => 0,
            'iss_withholding_percent' => 0.0,
            'apply_irrf_withholding' => 0,
            'irrf_withholding_percent' => 0.0,
            'apply_pcc_withholding' => 0,
            'pcc_withholding_percent' => 0.0,
            'apply_inss_withholding' => 0,
            'inss_withholding_percent' => 0.0,
            'legal_responsible_name' => '',
            'legal_review_date' => date('Y-m-d'),
            'legal_notes_text' => '',
            'check_regime' => 0,
            'check_iss' => 0,
            'check_retentions' => 0,
            'check_nfse' => 0,
            'legal_references' => $this->defaultTaxLegalReferences(),
            'legal_notes_is_structured' => false,
            'legal_notes_raw' => '',
        ];
    }

    private function defaultTaxLegalReferences(): array
    {
        return [
            [
                'title' => 'Lei Complementar 116/2003',
                'description' => 'Regras gerais do ISS (alíquota mínima de 2% e máxima de 5%).',
                'url' => 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm',
            ],
            [
                'title' => 'Lei Complementar 123/2006',
                'description' => 'Simples Nacional e enquadramento de ME, EPP e MEI.',
                'url' => 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm',
            ],
            [
                'title' => 'NFS-e Padrão Nacional',
                'description' => 'Diretrizes de emissão e integração fiscal para serviços.',
                'url' => 'https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/agosto/nota-fiscal-de-servico-eletronica-nfs-e-padrao-nacional-para-simplificar-o-cotidiano-das-empresas',
            ],
        ];
    }

    private function decodeTaxCompliancePayload(mixed $raw): array
    {
        $rawString = trim((string) ($raw ?? ''));
        if ($rawString === '') {
            return [
                'is_structured' => false,
                'fields' => [],
            ];
        }

        $decoded = json_decode($rawString, true);
        if (!is_array($decoded) || (string) ($decoded['version'] ?? '') !== 'aq_tax_compliance_v1') {
            return [
                'is_structured' => false,
                'fields' => [
                    'legal_notes_text' => $rawString,
                ],
            ];
        }

        $profile = is_array($decoded['profile'] ?? null) ? $decoded['profile'] : [];
        $withholding = is_array($decoded['withholding'] ?? null) ? $decoded['withholding'] : [];
        $legal = is_array($decoded['legal'] ?? null) ? $decoded['legal'] : [];
        $checklist = is_array($decoded['checklist'] ?? null) ? $decoded['checklist'] : [];

        $references = $decoded['legal_references'] ?? null;
        if (!is_array($references) || $references === []) {
            $references = $this->defaultTaxLegalReferences();
        }

        return [
            'is_structured' => true,
            'fields' => [
                'tax_regime' => (string) ($profile['tax_regime'] ?? 'simples_nacional'),
                'municipality_name' => trim((string) ($profile['municipality_name'] ?? '')),
                'iss_percent' => round((float) ($profile['iss_percent'] ?? 2), 2),
                'apply_iss_withholding' => !empty($withholding['apply_iss']) ? 1 : 0,
                'iss_withholding_percent' => round((float) ($withholding['iss_percent'] ?? 0), 2),
                'apply_irrf_withholding' => !empty($withholding['apply_irrf']) ? 1 : 0,
                'irrf_withholding_percent' => round((float) ($withholding['irrf_percent'] ?? 0), 2),
                'apply_pcc_withholding' => !empty($withholding['apply_pcc']) ? 1 : 0,
                'pcc_withholding_percent' => round((float) ($withholding['pcc_percent'] ?? 0), 2),
                'apply_inss_withholding' => !empty($withholding['apply_inss']) ? 1 : 0,
                'inss_withholding_percent' => round((float) ($withholding['inss_percent'] ?? 0), 2),
                'legal_responsible_name' => trim((string) ($legal['responsible_name'] ?? '')),
                'legal_review_date' => trim((string) ($legal['review_date'] ?? date('Y-m-d'))),
                'legal_notes_text' => trim((string) ($decoded['legal_notes_text'] ?? '')),
                'check_regime' => !empty($checklist['regime_confirmed']) ? 1 : 0,
                'check_iss' => !empty($checklist['iss_confirmed']) ? 1 : 0,
                'check_retentions' => !empty($checklist['retentions_confirmed']) ? 1 : 0,
                'check_nfse' => !empty($checklist['nfse_confirmed']) ? 1 : 0,
                'legal_references' => $references,
            ],
        ];
    }

    private function normalizeTaxLabel(string $label, string $legacyDefault, string $fallback): string
    {
        if ($label === '') {
            return $fallback;
        }

        return $label === $legacyDefault ? $fallback : $label;
    }

    private function ensureBrandManualTable(): bool
    {
        if ($this->brandManualTableReady !== null) {
            return $this->brandManualTableReady;
        }

        try {
            $this->db->execute(
                'CREATE TABLE IF NOT EXISTS brand_manual_reports (
                    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    quote_request_id INT UNSIGNED NOT NULL,
                    admin_user_id INT UNSIGNED NOT NULL,
                    schema_version VARCHAR(60) NOT NULL DEFAULT \'brand_manual_mvp_v1\',
                    tool_source VARCHAR(80) NOT NULL DEFAULT \'brandmanual_tool\',
                    generated_at DATETIME NULL,
                    payload_json LONGTEXT NOT NULL,
                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
                    CONSTRAINT fk_brand_manual_reports_request FOREIGN KEY (quote_request_id) REFERENCES quote_requests (id) ON DELETE CASCADE ON UPDATE CASCADE,
                    CONSTRAINT fk_brand_manual_reports_admin FOREIGN KEY (admin_user_id) REFERENCES admin_users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
                    UNIQUE KEY uq_brand_manual_reports_request (quote_request_id),
                    INDEX idx_brand_manual_reports_created (created_at)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
            );
            $this->brandManualTableReady = true;
        } catch (\Throwable) {
            $this->brandManualTableReady = false;
        }

        return $this->brandManualTableReady;
    }

    public function createOrUpdateReport(
        int $requestId,
        int $adminUserId,
        array $payload,
        array $serviceRows,
        array $taxRows
    ): int {
        $subtotalValue = 0.0;
        $maxDeadline = null;

        foreach ($serviceRows as $row) {
            $subtotalValue += (float) $row['price_value'];
            if ($row['deadline_days'] !== null) {
                $deadline = (int) $row['deadline_days'];
                $maxDeadline = $maxDeadline === null ? $deadline : max($maxDeadline, $deadline);
            }
        }

        $taxesTotalValue = 0.0;
        foreach ($taxRows as $taxRow) {
            $taxesTotalValue += (float) ($taxRow['tax_amount'] ?? 0);
        }

        $totalValue = $subtotalValue + $taxesTotalValue;
        $validUntil = date('Y-m-d', strtotime('+90 days'));
        $reportId = 0;

        $this->db->transaction(function () use (&$reportId, $requestId, $adminUserId, $subtotalValue, $taxesTotalValue, $totalValue, $payload, $maxDeadline, $validUntil, $serviceRows, $taxRows): void {
            $existing = $this->db->fetch(
                'SELECT id FROM quote_reports WHERE quote_request_id = :request_id LIMIT 1',
                ['request_id' => $requestId]
            );

            if ($existing === null) {
                $this->db->execute(
                    'INSERT INTO quote_reports (
                        quote_request_id, admin_user_id, subtotal_value, taxes_total_value, total_value, total_deadline_days, availability_summary, report_notes, show_tax_details, valid_until
                     ) VALUES (
                        :quote_request_id, :admin_user_id, :subtotal_value, :taxes_total_value, :total_value, :total_deadline_days, :availability_summary, :report_notes, :show_tax_details, :valid_until
                     )',
                    [
                        'quote_request_id' => $requestId,
                        'admin_user_id' => $adminUserId,
                        'subtotal_value' => round($subtotalValue, 2),
                        'taxes_total_value' => round($taxesTotalValue, 2),
                        'total_value' => round($totalValue, 2),
                        'total_deadline_days' => $payload['total_deadline_days'] ?? $maxDeadline,
                        'availability_summary' => $payload['availability_summary'],
                        'report_notes' => $payload['report_notes'],
                        'show_tax_details' => !empty($payload['show_tax_details']) ? 1 : 0,
                        'valid_until' => $validUntil,
                    ]
                );

                $reportId = $this->db->lastInsertId();
            } else {
                $reportId = (int) $existing['id'];
                $this->db->execute(
                    'UPDATE quote_reports
                     SET
                        admin_user_id = :admin_user_id,
                        subtotal_value = :subtotal_value,
                        taxes_total_value = :taxes_total_value,
                        total_value = :total_value,
                        total_deadline_days = :total_deadline_days,
                        availability_summary = :availability_summary,
                        report_notes = :report_notes,
                        show_tax_details = :show_tax_details,
                        valid_until = :valid_until
                     WHERE id = :id',
                    [
                        'id' => $reportId,
                        'admin_user_id' => $adminUserId,
                        'subtotal_value' => round($subtotalValue, 2),
                        'taxes_total_value' => round($taxesTotalValue, 2),
                        'total_value' => round($totalValue, 2),
                        'total_deadline_days' => $payload['total_deadline_days'] ?? $maxDeadline,
                        'availability_summary' => $payload['availability_summary'],
                        'report_notes' => $payload['report_notes'],
                        'show_tax_details' => !empty($payload['show_tax_details']) ? 1 : 0,
                        'valid_until' => $validUntil,
                    ]
                );

                $this->db->execute(
                    'DELETE FROM quote_report_items WHERE quote_report_id = :report_id',
                    ['report_id' => $reportId]
                );
            }

            $this->db->execute(
                'DELETE FROM quote_report_taxes WHERE quote_report_id = :report_id',
                ['report_id' => $reportId]
            );

            foreach ($serviceRows as $row) {
                $this->db->execute(
                    'INSERT INTO quote_report_items (
                        quote_report_id, reference_price_item_id, service_name, price_value, deadline_days, availability_label, notes
                     ) VALUES (
                        :quote_report_id, :reference_price_item_id, :service_name, :price_value, :deadline_days, :availability_label, :notes
                     )',
                    [
                        'quote_report_id' => $reportId,
                        'reference_price_item_id' => $row['reference_price_item_id'],
                        'service_name' => $row['service_name'],
                        'price_value' => $row['price_value'],
                        'deadline_days' => $row['deadline_days'],
                        'availability_label' => $row['availability_label'],
                        'notes' => $row['notes'],
                    ]
                );
            }

            foreach ($taxRows as $taxRow) {
                $this->db->execute(
                    'INSERT INTO quote_report_taxes (
                        quote_report_id, tax_key, tax_label, tax_percent, tax_amount
                     ) VALUES (
                        :quote_report_id, :tax_key, :tax_label, :tax_percent, :tax_amount
                     )',
                    [
                        'quote_report_id' => $reportId,
                        'tax_key' => $taxRow['tax_key'],
                        'tax_label' => $taxRow['tax_label'],
                        'tax_percent' => $taxRow['tax_percent'],
                        'tax_amount' => $taxRow['tax_amount'],
                    ]
                );
            }

            $this->db->execute(
                "UPDATE quote_requests SET status = 'orcado' WHERE id = :id",
                ['id' => $requestId]
            );
        });

        return $reportId;
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

    private function detectServiceArea(string $catalogName, string $groupName, string $serviceName): string
    {
        $text = $this->normalizeProfileText($catalogName . ' ' . $groupName . ' ' . $serviceName);

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
