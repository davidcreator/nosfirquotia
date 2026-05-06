<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Engine;

use NosfirQuotia\System\Library\Auth;
use NosfirQuotia\System\Library\ClientAuth;
use NosfirQuotia\System\Library\Database;
use NosfirQuotia\System\Library\SecurityEventLogger;

abstract class Controller
{
    protected Request $request;
    protected Response $response;
    protected Session $session;
    protected View $view;

    public function __construct(protected readonly Application $app)
    {
        $this->request = $app->request();
        $this->response = $app->response();
        $this->session = $app->session();
        $this->view = new View($app->rootPath());
    }

    protected function render(string $template, array $data = [], ?string $layout = null): void
    {
        $shared = [
            'appName' => $this->app->config('name', 'Nosfir Quotia'),
            'currentPath' => $this->request->path(),
        ];

        $this->view->render($template, array_merge($shared, $data), $layout);
    }

    protected function redirect(string $path, int $status = 302): never
    {
        $this->response->redirect($path, $status);
    }

    protected function db(): Database
    {
        return $this->app->db();
    }

    protected function auth(): Auth
    {
        return $this->app->auth();
    }

    protected function clientAuth(): ClientAuth
    {
        return $this->app->clientAuth();
    }

    protected function make(string $id): mixed
    {
        return $this->app->make($id);
    }

    protected function securityLogger(): SecurityEventLogger
    {
        /** @var SecurityEventLogger $logger */
        $logger = $this->make(SecurityEventLogger::class);

        return $logger;
    }

    protected function sanitizeSingleLineText(string $value, int $maxLength): string
    {
        $normalized = trim($value);
        if ($normalized === '') {
            return '';
        }

        $normalized = preg_replace('/\s+/u', ' ', $normalized) ?? $normalized;
        $normalized = preg_replace('/[\x00-\x1F\x7F]/u', '', $normalized) ?? $normalized;

        return $this->limitTextLength($normalized, $maxLength);
    }

    protected function sanitizeMultilineText(string $value, int $maxLength): string
    {
        $normalized = str_replace(["\r\n", "\r"], "\n", trim($value));
        if ($normalized === '') {
            return '';
        }

        $normalized = preg_replace('/[^\P{C}\n\t]/u', '', $normalized) ?? $normalized;

        return $this->limitTextLength($normalized, $maxLength);
    }

    protected function sanitizeEmailAddress(string $value): string
    {
        $email = strtolower(trim($value));
        $email = preg_replace('/[\x00-\x1F\x7F\s]+/u', '', $email) ?? $email;

        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false ? $email : '';
    }

    protected function toBoolValue(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        $normalized = strtolower(trim((string) $value));

        return in_array($normalized, ['1', 'true', 'on', 'sim', 'yes'], true);
    }

    protected function writeCookie(string $name, string $value, int $maxAgeSeconds, bool $httpOnly = true): void
    {
        $isSecure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie(
            $name,
            $value,
            [
                'expires' => time() + max(0, $maxAgeSeconds),
                'path' => '/',
                'secure' => $isSecure,
                'httponly' => $httpOnly,
                'samesite' => 'Lax',
            ]
        );
    }

    protected function clearCookie(string $name, bool $httpOnly = true): void
    {
        $isSecure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie(
            $name,
            '',
            [
                'expires' => time() - 3600,
                'path' => '/',
                'secure' => $isSecure,
                'httponly' => $httpOnly,
                'samesite' => 'Lax',
            ]
        );
    }

    private function limitTextLength(string $value, int $maxLength): string
    {
        if ($maxLength < 1) {
            return '';
        }

        if (function_exists('mb_substr')) {
            return (string) mb_substr($value, 0, $maxLength, 'UTF-8');
        }

        return substr($value, 0, $maxLength);
    }
}
