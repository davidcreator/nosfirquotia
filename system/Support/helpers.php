<?php

declare(strict_types=1);

use NosfirQuotia\System\Engine\Application;

if (!function_exists('app')) {
    function app(): Application
    {
        return Application::instance();
    }
}

if (!function_exists('e')) {
    function e(?string $value): string
    {
        return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('url')) {
    function url(string $path = ''): string
    {
        $basePath = app()->request()->basePath();
        $basePath = $basePath === '/' ? '' : rtrim($basePath, '/');
        $path = trim($path);

        if ($path === '') {
            return $basePath !== '' ? $basePath : '/';
        }

        return ($basePath !== '' ? $basePath : '') . '/' . ltrim($path, '/');
    }
}

if (!function_exists('asset')) {
    function asset(string $path): string
    {
        return url($path);
    }
}

if (!function_exists('old')) {
    function old(string $key, mixed $default = ''): mixed
    {
        $oldInput = app()->session()->get('old_input', []);

        return is_array($oldInput) && array_key_exists($key, $oldInput) ? $oldInput[$key] : $default;
    }
}

if (!function_exists('flash')) {
    function flash(string $key, mixed $default = null): mixed
    {
        return app()->session()->getFlash($key, $default);
    }
}

if (!function_exists('csrf_token')) {
    function csrf_token(): string
    {
        return app()->csrfToken();
    }
}

if (!function_exists('csrf_field')) {
    function csrf_field(): string
    {
        return '<input type="hidden" name="_csrf_token" value="' . e(csrf_token()) . '">';
    }
}

if (!function_exists('client_user')) {
    function client_user(): ?array
    {
        $user = app()->session()->get('client_user');

        return is_array($user) ? $user : null;
    }
}

if (!function_exists('admin_user')) {
    function admin_user(): ?array
    {
        $user = app()->session()->get('admin_user');

        return is_array($user) ? $user : null;
    }
}

if (!function_exists('admin_is_general')) {
    function admin_is_general(): bool
    {
        $user = admin_user();

        return $user !== null && !empty($user['is_general_admin']);
    }
}

if (!function_exists('admin_can')) {
    function admin_can(string $permission): bool
    {
        $auth = app()->auth();

        return $auth->hasPermission($permission);
    }
}
