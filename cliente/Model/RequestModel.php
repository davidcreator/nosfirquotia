<?php

declare(strict_types=1);

namespace AureaQuotia\Cliente\Model;

use AureaQuotia\System\Engine\Model;

final class RequestModel extends Model
{
    public function create(int $clientUserId, array $payload, array $serviceIds): int
    {
        $this->db->execute(
            'INSERT INTO quote_requests (
                client_user_id, project_title, scope, desired_deadline_days, requested_availability, status
            ) VALUES (
                :client_user_id, :project_title, :scope, :desired_deadline_days, :requested_availability, :status
            )',
            [
                'client_user_id' => $clientUserId,
                'project_title' => $payload['project_title'],
                'scope' => $payload['scope'],
                'desired_deadline_days' => $payload['desired_deadline_days'],
                'requested_availability' => $payload['requested_availability'],
                'status' => 'pendente',
            ]
        );

        $requestId = $this->db->lastInsertId();

        foreach ($serviceIds as $serviceId) {
            $this->db->execute(
                'INSERT INTO quote_request_items (quote_request_id, reference_price_item_id)
                 VALUES (:quote_request_id, :reference_price_item_id)',
                [
                    'quote_request_id' => $requestId,
                    'reference_price_item_id' => $serviceId,
                ]
            );
        }

        return $requestId;
    }

    public function allByClient(int $clientUserId): array
    {
        return $this->db->fetchAll(
            'SELECT
                qr.id,
                qr.project_title,
                qr.status,
                qr.created_at,
                qr.desired_deadline_days,
                qr.requested_availability,
                COUNT(qri.id) AS services_count,
                rep.total_value,
                rep.total_deadline_days,
                rep.valid_until
             FROM quote_requests qr
             LEFT JOIN quote_request_items qri ON qri.quote_request_id = qr.id
             LEFT JOIN quote_reports rep ON rep.quote_request_id = qr.id
             WHERE qr.client_user_id = :client_user_id
             GROUP BY
                qr.id, qr.project_title, qr.status, qr.created_at, qr.desired_deadline_days, qr.requested_availability,
                rep.total_value, rep.total_deadline_days, rep.valid_until
             ORDER BY qr.created_at DESC',
            ['client_user_id' => $clientUserId]
        );
    }

    public function findByClient(int $requestId, int $clientUserId): ?array
    {
        return $this->db->fetch(
            'SELECT
                qr.*,
                rep.id AS report_id,
                rep.subtotal_value,
                rep.taxes_total_value,
                rep.total_value,
                rep.total_deadline_days,
                rep.availability_summary,
                rep.report_notes,
                rep.show_tax_details,
                rep.valid_until,
                rep.created_at AS report_created_at
             FROM quote_requests qr
             LEFT JOIN quote_reports rep ON rep.quote_request_id = qr.id
             WHERE qr.id = :id
               AND qr.client_user_id = :client_user_id
             LIMIT 1',
            [
                'id' => $requestId,
                'client_user_id' => $clientUserId,
            ]
        );
    }

    public function requestServices(int $requestId): array
    {
        return $this->db->fetchAll(
            'SELECT
                rpi.id,
                rpi.reference_code,
                rpi.service_name,
                rpi.group_name,
                rpc.code AS catalog_code,
                rpc.name AS catalog_name
             FROM quote_request_items qri
             INNER JOIN reference_price_items rpi ON rpi.id = qri.reference_price_item_id
             INNER JOIN reference_price_catalogs rpc ON rpc.id = rpi.catalog_id
             WHERE qri.quote_request_id = :request_id
             ORDER BY rpc.display_order ASC, rpi.display_order ASC',
            ['request_id' => $requestId]
        );
    }

    public function reportItems(int $reportId): array
    {
        return $this->db->fetchAll(
            'SELECT
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
                tax_label,
                tax_percent,
                tax_amount
             FROM quote_report_taxes
             WHERE quote_report_id = :report_id
             ORDER BY id ASC',
            ['report_id' => $reportId]
        );
    }
}
