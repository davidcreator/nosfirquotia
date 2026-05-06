<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\Model\ReferencePriceModel;

final class ReferencePriceController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('references.view');

        /** @var ReferencePriceModel $model */
        $model = $this->make(ReferencePriceModel::class);
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
