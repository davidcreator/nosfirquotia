<?php

declare(strict_types=1);

namespace AureaQuotia\System\Engine;

final class Response
{
    public function __construct(private readonly Request $request)
    {
    }

    public function redirect(string $path, int $status = 302): never
    {
        $location = $this->buildLocation($path);
        header('Location: ' . $location, true, $status);
        exit;
    }

    public function text(string $content, int $status = 200): void
    {
        http_response_code($status);
        echo $content;
    }

    public function json(array $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    private function buildLocation(string $path): string
    {
        if (preg_match('#^https?://#i', $path) === 1) {
            return $path;
        }

        $basePath = $this->request->basePath();
        $basePath = $basePath === '/' ? '' : rtrim($basePath, '/');
        $normalized = '/' . ltrim($path, '/');

        return ($basePath !== '' ? $basePath : '') . $normalized;
    }
}
