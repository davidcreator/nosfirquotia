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
        $name = trim((string) $this->request->post('name', ''));
        $description = trim((string) $this->request->post('description', ''));
        $basePrice = (float) $this->request->post('base_price', 0);
        $allowedAreas = ['design', 'development'];

        if (!in_array($areaType, $allowedAreas, true)) {
            $areaType = 'design';
        }

        if ($name === '' || $basePrice <= 0) {
            $this->session->flash('error', 'Informe area, nome e valor base valido.');
            $this->redirect('/admin/categorias');
        }

        $model = new CategoryModel($this->app);

        try {
            $model->create($areaType, $name, $description, $basePrice);
        } catch (Throwable) {
            $this->session->flash('error', 'Nao foi possivel criar categoria. Verifique se ja existe com este nome.');
            $this->redirect('/admin/categorias');
        }

        $this->session->flash('success', 'Categoria criada com sucesso.');
        $this->redirect('/admin/categorias');
    }
}
