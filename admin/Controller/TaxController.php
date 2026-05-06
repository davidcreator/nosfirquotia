<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\DTO\ValidateTaxSettingsCommand;
use NosfirQuotia\Admin\Model\QuoteModel;
use NosfirQuotia\Admin\Repository\TaxSettingsRepositoryInterface;
use NosfirQuotia\Admin\Service\TaxSettingsService;

final class TaxController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('taxes.manage');

        /** @var QuoteModel $model */
        $model = $this->make(QuoteModel::class);
        $settings = $model->taxSettings();

        $this->render(
            'admin/View/taxes/index',
            [
                'settings' => $settings,
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }

    public function store(): void
    {
        $this->ensurePermission('taxes.manage');

        /** @var TaxSettingsService $service */
        $service = $this->make(TaxSettingsService::class);
        $result = $service->validateAndBuild(
            new ValidateTaxSettingsCommand($this->request->all())
        );

        if (!$result->ok) {
            $this->logAdminSecurityWarning(
                'admin_tax_settings_validation_failed',
                [
                    'error_code' => (string) ($result->errorCode ?? ''),
                    'error_count' => count($result->errors),
                ]
            );
            $this->session->flash('error', implode(' ', $result->errors));
            $this->redirect('/admin/tributos');
        }

        /** @var TaxSettingsRepositoryInterface $repository */
        $repository = $this->make(TaxSettingsRepositoryInterface::class);
        $repository->save($result->settings);
        $this->logAdminSecurityInfo('admin_tax_settings_updated');

        $this->session->flash('success', 'Central Fiscal atualizada com parametros de conformidade e checklist legal.');
        $this->redirect('/admin/tributos');
    }
}
