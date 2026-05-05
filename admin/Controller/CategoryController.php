<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\Model\CategoryModel;
use Throwable;

final class CategoryController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('categories.manage');

        $model = new CategoryModel($this->app);
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

        $areaType = strtolower(trim((string) $this->request->post('area_type', 'design')));
        $name = $this->sanitizeSingleLineText((string) $this->request->post('name', ''), 160);
        $description = $this->sanitizeMultilineText((string) $this->request->post('description', ''), 2000);
        $basePrice = $this->toPositiveFloat($this->request->post('base_price', 0));
        $allowedAreas = ['design', 'development'];

        if (!in_array($areaType, $allowedAreas, true)) {
            $areaType = 'design';
        }

        if ($name === '' || $basePrice === null || $basePrice <= 0) {
            $this->session->flash('error', 'Informe área, nome e valor base válido.');
            $this->redirect('/admin/categorias');
        }

        $model = new CategoryModel($this->app);

        try {
            $model->create($areaType, $name, $description, $basePrice);
        } catch (Throwable) {
            $this->session->flash('error', 'Não foi possível criar categoria. Verifique se já existe com este nome.');
            $this->redirect('/admin/categorias');
        }

        $this->session->flash('success', 'Categoria criada com sucesso.');
        $this->redirect('/admin/categorias');
    }

    private function toPositiveFloat(mixed $value): ?float
    {
        $raw = trim((string) $value);
        if ($raw === '') {
            return null;
        }

        $normalized = str_replace(',', '.', $raw);
        $normalized = preg_replace('/[^0-9.\-]/', '', $normalized) ?? '';
        if ($normalized === '' || !is_numeric($normalized)) {
            return null;
        }

        return (float) $normalized;
    }
}
