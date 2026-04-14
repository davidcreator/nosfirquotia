<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Engine;

use RuntimeException;

final class View
{
    public function __construct(private readonly string $rootPath)
    {
    }

    public function render(string $template, array $data = [], ?string $layout = null): void
    {
        $templateFile = $this->resolvePath($template);

        if (!is_file($templateFile)) {
            throw new RuntimeException('Template nao encontrado: ' . $templateFile);
        }

        extract($data, EXTR_SKIP);

        ob_start();
        include $templateFile;
        $content = (string) ob_get_clean();

        if ($layout === null) {
            echo $content;
            return;
        }

        $layoutFile = $this->resolvePath($layout);

        if (!is_file($layoutFile)) {
            throw new RuntimeException('Layout nao encontrado: ' . $layoutFile);
        }

        include $layoutFile;
    }

    private function resolvePath(string $view): string
    {
        $view = str_replace(['\\', '..'], ['/', ''], $view);

        return $this->rootPath . '/' . trim($view, '/') . '.php';
    }
}
