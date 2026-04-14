<?php

declare(strict_types=1);

namespace AureaQuotia\System\Engine;

final class Request
{
    private array $query;
    private array $body;
    private array $server;
    private string $method;
    private string $path;
    private string $basePath;

    public function __construct(array $query = [], array $body = [], array $server = [])
    {
        $this->query = $query ?: $_GET;
        $this->body = $body ?: $_POST;
        $this->server = $server ?: $_SERVER;

        $this->method = $this->detectMethod();
        $this->basePath = $this->detectBasePath();
        $this->path = $this->detectPath();
    }

    public function method(): string
    {
        return $this->method;
    }

    public function path(): string
    {
        return $this->path;
    }

    public function basePath(): string
    {
        return $this->basePath;
    }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $this->query[$key] ?? $default;
    }

    public function post(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $default;
    }

    public function query(string $key, mixed $default = null): mixed
    {
        return $this->query[$key] ?? $default;
    }

    public function all(): array
    {
        return array_merge($this->query, $this->body);
    }

    public function fullBaseUrl(): string
    {
        $isSecure = !empty($this->server['HTTPS']) && $this->server['HTTPS'] !== 'off';
        $scheme = $isSecure ? 'https' : 'http';
        $host = (string) ($this->server['HTTP_HOST'] ?? 'localhost');

        return $scheme . '://' . $host . ($this->basePath !== '/' ? $this->basePath : '');
    }

    private function detectMethod(): string
    {
        $method = strtoupper((string) ($this->server['REQUEST_METHOD'] ?? 'GET'));

        if ($method === 'POST' && isset($this->body['_method'])) {
            $method = strtoupper((string) $this->body['_method']);
        }

        return $method;
    }

    private function detectBasePath(): string
    {
        $scriptName = str_replace('\\', '/', (string) ($this->server['SCRIPT_NAME'] ?? ''));
        $dir = str_replace('\\', '/', dirname($scriptName));

        if ($dir === '.' || $dir === '/' || $dir === '\\') {
            return '';
        }

        return rtrim($dir, '/');
    }

    private function detectPath(): string
    {
        $queryRoute = $this->query['route'] ?? null;
        if (is_string($queryRoute) && trim($queryRoute) !== '') {
            return $this->normalizePath($queryRoute);
        }

        $uriPath = parse_url((string) ($this->server['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
        $path = $uriPath !== false && $uriPath !== null ? $uriPath : '/';

        if ($this->basePath !== '' && str_starts_with($path, $this->basePath)) {
            $path = substr($path, strlen($this->basePath));
        }

        if ($path === '/index.php') {
            $path = '/';
        } elseif (str_starts_with($path, '/index.php/')) {
            $path = substr($path, strlen('/index.php'));
        }

        return $this->normalizePath($path);
    }

    private function normalizePath(string $path): string
    {
        $normalized = '/' . ltrim($path, '/');
        $normalized = rtrim($normalized, '/');

        return $normalized === '' ? '/' : $normalized;
    }
}
