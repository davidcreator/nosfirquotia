<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\Model\EmailLogModel;

final class EmailLogController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('quotes.manage');

        $model = new EmailLogModel($this->app);
        $logs = $model->latest();

        $this->render(
            'admin/View/notifications/email',
            [
                'logs' => $logs,
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }
}
