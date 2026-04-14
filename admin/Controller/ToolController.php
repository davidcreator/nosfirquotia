<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\Model\ToolModel;

final class ToolController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('tools.view');

        $model = new ToolModel($this->app);
        $location = $this->resolveToolsLocation();
        $toolsPath = $location['path'];
        $tools = $model->listTools($toolsPath);

        $available = count(array_filter($tools, static fn (array $tool): bool => (bool) $tool['has_entrypoint']));
        $pending = count($tools) - $available;

        $this->render(
            'admin/View/tools/index',
            [
                'tools' => $tools,
                'availableCount' => $available,
                'pendingCount' => $pending,
                'toolsWebBase' => $location['web_base'],
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }

    public function open(string $slug): void
    {
        $this->ensurePermission('tools.view');

        $model = new ToolModel($this->app);
        $location = $this->resolveToolsLocation();
        $toolsPath = $location['path'];
        $tool = $model->findTool($toolsPath, $slug);

        if ($tool === null) {
            $this->session->flash('error', 'Ferramenta nao encontrada.');
            $this->redirect('/admin/ferramentas');
        }

        if (!$tool['has_entrypoint']) {
            $this->session->flash('warning', 'Ferramenta sem entrypoint padrao. Ajuste manual necessario.');
            $this->redirect('/admin/ferramentas');
        }

        $toolUrl = url($location['web_base'] . '/' . $tool['slug'] . '/index.php');

        $this->render(
            'admin/View/tools/show',
            [
                'tool' => $tool,
                'toolUrl' => $toolUrl,
                'adminUser' => $this->adminUser(),
                'isToolWorkspace' => true,
            ],
            'admin/View/layout'
        );
    }

    private function resolveToolsLocation(): array
    {
        $rootPath = $this->app->rootPath();
        $rootToolsPath = $rootPath . '/Tools';

        if (is_dir($rootToolsPath)) {
            return [
                'path' => $rootToolsPath,
                'web_base' => '/Tools',
            ];
        }

        return [
            'path' => $rootPath . '/admin/tools',
            'web_base' => '/admin/tools',
        ];
    }
}
