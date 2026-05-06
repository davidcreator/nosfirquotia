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
            echo $this->injectCspNonceAttributes($content);
            return;
        }

        $layoutFile = $this->resolvePath($layout);

        if (!is_file($layoutFile)) {
            throw new RuntimeException('Layout nao encontrado: ' . $layoutFile);
        }

        ob_start();
        include $layoutFile;
        $layoutContent = (string) ob_get_clean();

        echo $this->injectCspNonceAttributes($layoutContent);
    }

    private function resolvePath(string $view): string
    {
        $view = str_replace(['\\', '..'], ['/', ''], $view);

        return $this->rootPath . '/' . trim($view, '/') . '.php';
    }

    private function injectCspNonceAttributes(string $html): string
    {
        if ($html === '' || strpos($html, '<') === false) {
            return $html;
        }

        $nonce = htmlspecialchars(\NosfirQuotia\System\Engine\Application::instance()->cspNonce(), ENT_QUOTES, 'UTF-8');
        $inject = static function (array $matches) use ($nonce): string {
            $tag = (string) ($matches[0] ?? '');
            if ($tag === '' || preg_match('/\snonce\s*=/i', $tag) === 1) {
                return $tag;
            }

            $trimmed = rtrim($tag);
            if (str_ends_with($trimmed, '/>')) {
                return substr($trimmed, 0, -2) . ' nonce="' . $nonce . '" />';
            }

            if (str_ends_with($trimmed, '>')) {
                return substr($trimmed, 0, -1) . ' nonce="' . $nonce . '">';
            }

            return $tag;
        };

        $html = preg_replace_callback('/<script\b[^>]*>/i', $inject, $html) ?? $html;
        $html = preg_replace_callback('/<style\b[^>]*>/i', $inject, $html) ?? $html;

        return $html;
    }
}
