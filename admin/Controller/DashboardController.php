<?php

declare(strict_types=1);

namespace AureaQuotia\Admin\Controller;

use AureaQuotia\Admin\Model\QuoteModel;

final class DashboardController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('dashboard.view');

        $model = new QuoteModel($this->app);
        $stats = $model->dashboardStats();
        $recent = $model->latest();

        $this->render(
            'admin/View/dashboard/index',
            [
                'stats' => $stats,
                'recent' => $recent,
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }
}
