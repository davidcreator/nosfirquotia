<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\Model\QuoteModel;
use NosfirQuotia\Admin\Service\SecurityEventMonitoringService;

final class DashboardController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('dashboard.view');

        /** @var QuoteModel $model */
        $model = $this->make(QuoteModel::class);
        $stats = $model->dashboardStats();
        $recent = $model->latest();
        /** @var SecurityEventMonitoringService $securityMonitoring */
        $securityMonitoring = $this->make(SecurityEventMonitoringService::class);
        $securityWindowHours = (int) $this->app->config('security.monitoring.window_hours', 24);
        $securityBucketMinutes = (int) $this->app->config('security.monitoring.bucket_minutes', 60);
        $securityOverview = $securityMonitoring->summarize(
            $securityWindowHours
        );
        $securityTrend = $securityMonitoring->timeseries($securityWindowHours, $securityBucketMinutes);

        $this->render(
            'admin/View/dashboard/index',
            [
                'stats' => $stats,
                'recent' => $recent,
                'securityOverview' => $securityOverview,
                'securityTrend' => $securityTrend,
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }
}
