<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\Model\ToolModel;

final class ToolController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('tools.view');

        /** @var ToolModel $model */
        $model = $this->make(ToolModel::class);
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

        /** @var ToolModel $model */
        $model = $this->make(ToolModel::class);
        $location = $this->resolveToolsLocation();
        $toolsPath = $location['path'];
        $tool = $model->findTool($toolsPath, $slug);

        if ($tool === null) {
            $this->session->flash('error', 'Ferramenta não encontrada.');
            $this->redirect('/admin/ferramentas');
        }

        if (!$tool['has_entrypoint']) {
            $this->session->flash('warning', 'Ferramenta sem entrypoint padrão. Ajuste manual necessário.');
            $this->redirect('/admin/ferramentas');
        }

        $toolEntrypoint = $toolsPath . '/' . $tool['slug'] . '/index.php';
        if (!is_file($toolEntrypoint)) {
            $this->session->flash('error', 'Entrypoint da ferramenta não encontrado.');
            $this->redirect('/admin/ferramentas');
        }

        $toolScriptPath = $location['web_base'] . '/' . $tool['slug'] . '/index.php';
        $toolBaseHref = url($location['web_base'] . '/' . $tool['slug'] . '/');
        $toolDir = dirname($toolEntrypoint);

        $toolHtml = $this->executeToolEntrypoint($toolEntrypoint, $toolScriptPath);
        $toolDocument = $this->splitToolDocument($toolHtml);
        $bodyClass = $this->resolveToolBodyClass();
        $toolHostClass = $this->resolveToolHostClass($toolDocument['body_classes'], (string) $tool['slug']);
        $toolHeadContent = $this->buildToolHeadContent($toolDocument['head'], $toolDir);
        $embeddedCompatibilityCss = $this->buildEmbeddedCompatibilityCss($location['path']);
        if ($embeddedCompatibilityCss !== '') {
            $toolHeadContent .= "\n<style id=\"aqToolCompatibilityEmbedded\">\n"
                . $embeddedCompatibilityCss
                . "\n</style>\n";
        }

        $this->render(
            'admin/View/tools/embedded',
            [
                'tool' => $tool,
                'toolDirectUrl' => url($toolScriptPath),
                'toolBodyHtml' => $toolDocument['body'],
                'toolHostClass' => $toolHostClass,
                'extraHeadBaseHref' => $toolBaseHref,
                'extraHeadContent' => $toolHeadContent,
                'extraBodyClass' => $bodyClass,
                'adminUser' => $this->adminUser(),
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

    private function executeToolEntrypoint(string $entrypoint, string $virtualScriptPath): string
    {
        $previousScriptName = isset($_SERVER['SCRIPT_NAME']) ? (string) $_SERVER['SCRIPT_NAME'] : null;
        $previousPhpSelf = isset($_SERVER['PHP_SELF']) ? (string) $_SERVER['PHP_SELF'] : null;
        $previousRequestUri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : null;
        $previousCwd = getcwd();
        $toolDir = dirname($entrypoint);

        $_SERVER['SCRIPT_NAME'] = $virtualScriptPath;
        $_SERVER['PHP_SELF'] = $virtualScriptPath;
        if ($previousRequestUri !== null) {
            $query = parse_url($previousRequestUri, PHP_URL_QUERY);
            $_SERVER['REQUEST_URI'] = $query !== null && $query !== ''
                ? $virtualScriptPath . '?' . $query
                : $virtualScriptPath;
        } else {
            $_SERVER['REQUEST_URI'] = $virtualScriptPath;
        }

        if ($previousCwd !== false) {
            chdir($toolDir);
        }

        ob_start();
        include $entrypoint;
        $html = (string) ob_get_clean();

        if ($previousCwd !== false) {
            chdir($previousCwd);
        }

        if ($previousScriptName !== null) {
            $_SERVER['SCRIPT_NAME'] = $previousScriptName;
        } else {
            unset($_SERVER['SCRIPT_NAME']);
        }

        if ($previousPhpSelf !== null) {
            $_SERVER['PHP_SELF'] = $previousPhpSelf;
        } else {
            unset($_SERVER['PHP_SELF']);
        }

        if ($previousRequestUri !== null) {
            $_SERVER['REQUEST_URI'] = $previousRequestUri;
        } else {
            unset($_SERVER['REQUEST_URI']);
        }

        return $html;
    }

    private function splitToolDocument(string $html): array
    {
        if ($html === '') {
            return [
                'head' => '',
                'body' => '',
                'body_classes' => [],
            ];
        }

        $headInner = '';
        if (preg_match('/<head[^>]*>(.*?)<\/head>/is', $html, $matches) === 1) {
            $headInner = (string) ($matches[1] ?? '');
        }

        $bodyClasses = [];
        if (preg_match('/<body[^>]*class=["\']([^"\']+)["\'][^>]*>/is', $html, $matches) === 1) {
            $rawClasses = preg_split('/\s+/', trim((string) ($matches[1] ?? ''))) ?: [];
            foreach ($rawClasses as $class) {
                $class = trim($class);
                if ($class === '' || preg_match('/^[a-zA-Z0-9_-]+$/', $class) !== 1) {
                    continue;
                }
                $bodyClasses[] = $class;
            }
            $bodyClasses = array_values(array_unique($bodyClasses));
        }

        $bodyInner = $html;
        if (preg_match('/<body[^>]*>(.*?)<\/body>/is', $html, $matches) === 1) {
            $bodyInner = (string) ($matches[1] ?? '');
        }

        $headInner = $this->sanitizeToolHead($headInner);
        $bodyInner = preg_replace('/<!doctype[^>]*>/i', '', $bodyInner) ?? $bodyInner;
        $bodyInner = preg_replace('/<\/?(?:html|head|body)\b[^>]*>/i', '', $bodyInner) ?? $bodyInner;

        return [
            'head' => trim($headInner),
            'body' => trim($bodyInner),
            'body_classes' => $bodyClasses,
        ];
    }

    private function sanitizeToolHead(string $headInner): string
    {
        if ($headInner === '') {
            return '';
        }

        $patterns = [
            '/<title\b[^>]*>.*?<\/title>/is',
            '/<base\b[^>]*>/i',
            '/<meta\b[^>]*charset[^>]*>/i',
            '/<meta\b[^>]*name=[\'"]viewport[\'"][^>]*>/i',
            '/<link\b[^>]*href=[\'"][^\'"]*compatibility\.css[^\'"]*[\'"][^>]*>/i',
        ];

        return (string) preg_replace($patterns, '', $headInner);
    }

    private function resolveToolBodyClass(): string
    {
        return 'aq-admin-tool-embedded-page';
    }

    private function resolveToolHostClass(array $bodyClasses, string $toolSlug): string
    {
        $classes = ['aq-tool-fluid'];

        if ($toolSlug !== '' && preg_match('/^[a-z0-9\\-]+$/', $toolSlug) === 1) {
            $classes[] = 'aq-tool-' . $toolSlug;
        }

        foreach ($bodyClasses as $class) {
            if (!is_string($class) || $class === '') {
                continue;
            }

            if (preg_match('/^[a-zA-Z0-9_-]+$/', $class) !== 1) {
                continue;
            }

            $classes[] = $class;
        }

        return implode(' ', array_values(array_unique($classes)));
    }

    private function buildToolHeadContent(string $headInner, string $toolDir): string
    {
        if ($headInner === '') {
            return '';
        }

        $parts = [];
        $hostSelector = '.aq-admin-tool-embedded-host';

        if (preg_match_all('/<link\b[^>]*>/i', $headInner, $matches) > 0) {
            foreach (($matches[0] ?? []) as $tag) {
                $rel = strtolower($this->extractTagAttribute($tag, 'rel'));
                $href = $this->extractTagAttribute($tag, 'href');
                if ($href === '') {
                    continue;
                }

                if ($rel !== 'stylesheet') {
                    continue;
                }

                $hrefLower = strtolower($href);
                if (str_contains($hrefLower, 'fonts.googleapis.com') || str_contains($hrefLower, 'fonts.gstatic.com')) {
                    continue;
                }

                if (preg_match('#^https?://#i', $href) === 1) {
                    $isIconFontCss = str_contains($hrefLower, 'font-awesome')
                        || str_contains($hrefLower, 'bootstrap-icons')
                        || str_contains($hrefLower, 'material+symbols')
                        || str_contains($hrefLower, 'material-symbols');
                    if ($isIconFontCss) {
                        $parts[] = $tag;
                    }
                    continue;
                }

                $localCssPath = $this->resolveLocalCssPath($toolDir, $href);
                if ($localCssPath === null) {
                    continue;
                }

                $cssContent = file_get_contents($localCssPath);
                if (!is_string($cssContent) || trim($cssContent) === '') {
                    continue;
                }

                $scopedCss = $this->scopeCssToHost($cssContent, $hostSelector);
                if (trim($scopedCss) === '') {
                    continue;
                }

                $parts[] = "<style data-embedded-tool-css=\""
                    . htmlspecialchars((string) basename($localCssPath), ENT_QUOTES, 'UTF-8')
                    . "\">\n"
                    . $scopedCss
                    . "\n</style>";
            }
        }

        if (preg_match_all('/<style\b[^>]*>(.*?)<\/style>/is', $headInner, $matches) > 0) {
            foreach (($matches[1] ?? []) as $inlineCss) {
                $inlineCss = (string) $inlineCss;
                if (trim($inlineCss) === '') {
                    continue;
                }

                $scopedCss = $this->scopeCssToHost($inlineCss, $hostSelector);
                if (trim($scopedCss) === '') {
                    continue;
                }

                $parts[] = "<style data-embedded-inline-css=\"1\">\n"
                    . $scopedCss
                    . "\n</style>";
            }
        }

        if (preg_match_all('/<script\b[^>]*>.*?<\/script>/is', $headInner, $matches) > 0) {
            foreach (($matches[0] ?? []) as $scriptTag) {
                $parts[] = $scriptTag;
            }
        }

        return implode("\n", $parts);
    }

    private function extractTagAttribute(string $tag, string $attribute): string
    {
        $pattern = '/\b' . preg_quote($attribute, '/') . '\s*=\s*([\'"])(.*?)\1/i';
        if (preg_match($pattern, $tag, $matches) !== 1) {
            return '';
        }

        return trim((string) ($matches[2] ?? ''));
    }

    private function resolveLocalCssPath(string $toolDir, string $href): ?string
    {
        $href = trim($href);
        if ($href === '' || str_starts_with($href, 'data:')) {
            return null;
        }

        $href = preg_replace('/[#?].*$/', '', $href) ?? $href;
        if ($href === '') {
            return null;
        }

        $rootPath = str_replace('\\', '/', $this->app->rootPath());
        $rootPathLower = strtolower($rootPath);
        if (str_starts_with($href, '/')) {
            $candidate = str_replace('\\', '/', $this->app->rootPath() . '/' . ltrim($href, '/'));
        } else {
            $candidate = str_replace('\\', '/', $toolDir . '/' . $href);
        }

        $resolved = realpath($candidate);
        if (!is_string($resolved) || $resolved === '' || !is_file($resolved)) {
            return null;
        }

        $resolvedNormalized = str_replace('\\', '/', $resolved);
        $resolvedLower = strtolower($resolvedNormalized);
        if (!str_starts_with($resolvedLower, $rootPathLower . '/')
            && $resolvedLower !== $rootPathLower
        ) {
            return null;
        }

        return $resolved;
    }

    private function scopeCssToHost(string $css, string $hostSelector): string
    {
        $css = preg_replace('/^\xEF\xBB\xBF/', '', $css) ?? $css;
        $css = str_replace(':root', $hostSelector, $css);
        $hostQuoted = preg_quote($hostSelector, '/');

        $scoped = preg_replace_callback(
            '/(^|})\s*([^@{}][^{}]*)\{/m',
            static function (array $matches) use ($hostSelector, $hostQuoted): string {
                $prefix = (string) ($matches[1] ?? '');
                $selectorList = trim((string) ($matches[2] ?? ''));
                if ($selectorList === '') {
                    return (string) $matches[0];
                }

                $selectors = array_filter(array_map('trim', explode(',', $selectorList)), static fn (string $sel): bool => $sel !== '');
                if ($selectors === []) {
                    return (string) $matches[0];
                }

                $allKeyframeSelectors = true;
                foreach ($selectors as $selector) {
                    if (preg_match('/^(from|to|\d+%)$/i', $selector) !== 1) {
                        $allKeyframeSelectors = false;
                        break;
                    }
                }
                if ($allKeyframeSelectors) {
                    return $prefix . ' ' . $selectorList . ' {';
                }

                $normalized = [];
                foreach ($selectors as $selector) {
                    $scopedSelector = str_replace(':root', $hostSelector, $selector);
                    $scopedSelector = preg_replace('/\bhtml\b/i', $hostSelector, $scopedSelector) ?? $scopedSelector;
                    $scopedSelector = preg_replace('/\bbody\b/i', $hostSelector, $scopedSelector) ?? $scopedSelector;
                    if (str_contains($scopedSelector, $hostSelector) === false) {
                        $scopedSelector = $hostSelector . ' ' . $scopedSelector;
                    }
                    $scopedSelector = preg_replace('/(' . $hostQuoted . ')(\s+\1)+/', '$1', $scopedSelector) ?? $scopedSelector;
                    $normalized[] = trim($scopedSelector);
                }

                return $prefix . ' ' . implode(', ', $normalized) . ' {';
            },
            $css
        );

        return trim((string) ($scoped ?? $css));
    }

    private function buildEmbeddedCompatibilityCss(string $toolsRootPath): string
    {
        $cssPath = rtrim($toolsRootPath, '/\\') . '/compatibility.css';
        if (!is_file($cssPath)) {
            $cssPath = $this->app->rootPath() . '/admin/tools/compatibility.css';
        }
        if (!is_file($cssPath)) {
            return '';
        }

        $css = file_get_contents($cssPath);
        if (!is_string($css) || trim($css) === '') {
            return '';
        }

        $css = preg_replace('/^\xEF\xBB\xBF/', '', $css) ?? $css;
        $css = str_replace('body.aq-tool-', '.aq-admin-tool-embedded-host.aq-tool-', $css);
        $css = preg_replace('/(^|[\s,{])body(\s*\{)/m', '$1.aq-admin-tool-embedded-host$2', $css) ?? $css;

        return trim($css);
    }
}
