<?php

declare(strict_types=1);

namespace AureaQuotia\Admin\Model;

use AureaQuotia\System\Engine\Model;

final class EmailLogModel extends Model
{
    public function latest(int $limit = 200): array
    {
        $limit = max(10, min(500, $limit));

        return $this->db->fetchAll(
            "SELECT
                id,
                context_key,
                recipient_name,
                recipient_email,
                subject,
                status,
                error_message,
                related_type,
                related_id,
                created_at
             FROM email_dispatch_logs
             ORDER BY created_at DESC, id DESC
             LIMIT {$limit}"
        );
    }
}
