<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\DTO\ValidateCategoryCreateCommand;
use NosfirQuotia\Admin\Model\CategoryModel;
use NosfirQuotia\Admin\Service\CategoryValidationService;
use Throwable;

final class CategoryController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('categories.manage');

        /** @var CategoryModel $model */
        $model = $this->make(CategoryModel::class);
        $categories = $model->all();

        $this->render(
            'admin/View/categories/index',
            [
                'categories' => $categories,
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }

    public function store(): void
    {
        $this->ensurePermission('categories.manage');

        /** @var CategoryValidationService $validationService */
        $validationService = $this->make(CategoryValidationService::class);
        $result = $validationService->validateCreate(
            new ValidateCategoryCreateCommand($this->request->all())
        );
        $payload = $result->payload;

        if (!$result->ok) {
            $this->logAdminSecurityWarning(
                'admin_category_create_validation_failed',
                [
                    'error_code' => (string) ($result->errorCode ?? ''),
                    'error_count' => count($result->errors),
                    'area_type' => (string) ($payload['area_type'] ?? 'design'),
                ]
            );
            $this->session->flash('error', implode(' ', $result->errors));
            $this->redirect('/admin/categorias');
        }

        /** @var CategoryModel $model */
        $model = $this->make(CategoryModel::class);

        try {
            $model->create(
                (string) $payload['area_type'],
                (string) $payload['name'],
                (string) $payload['description'],
                (float) $payload['base_price']
            );
        } catch (Throwable) {
            $this->logAdminSecurityWarning(
                'admin_category_create_failed',
                [
                    'area_type' => (string) $payload['area_type'],
                    'category_name' => (string) $payload['name'],
                ]
            );
            $this->session->flash('error', 'Nao foi possivel criar categoria. Verifique se ja existe com este nome.');
            $this->redirect('/admin/categorias');
        }

        $this->logAdminSecurityInfo(
            'admin_category_created',
            [
                'area_type' => (string) $payload['area_type'],
                'category_name' => (string) $payload['name'],
            ]
        );
        $this->session->flash('success', 'Categoria criada com sucesso.');
        $this->redirect('/admin/categorias');
    }
}
