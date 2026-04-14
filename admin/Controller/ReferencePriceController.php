<?php

declare(strict_types=1);

namespace AureaQuotia\Admin\Controller;

use AureaQuotia\Admin\Model\ReferencePriceModel;

final class ReferencePriceController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('references.view');

        $model = new ReferencePriceModel($this->app);
        $totals = $model->totals();
        $catalogs = $model->grouped();

        $this->render(
            'admin/View/reference/index',
            [
                'totals' => $totals,
                'catalogs' => $catalogs,
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }
}
