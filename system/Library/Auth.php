<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Library;

use NosfirQuotia\System\Engine\Session;
use Throwable;

final class Auth
{
    public function __construct(
        private readonly Session $session,
        private readonly Database $database
    ) {
    }

    public function attempt(string $email, string $password): bool
    {
        $email = strtolower(trim($email));

        try {
            $user = $this->database->fetch(
                'SELECT id, name, email, password, access_level, is_general_admin, is_active, permissions_json
                 FROM admin_users
                 WHERE email = :email
                 LIMIT 1',
                ['email' => $email]
            );
        } catch (Throwable) {
            // Compatibilidade com bancos ainda sem upgrade de permissoes.
            $user = $this->database->fetch(
                'SELECT id, name, email, password FROM admin_users WHERE email = :email LIMIT 1',
                ['email' => $email]
            );

            if ($user !== null) {
                $user['access_level'] = ((int) ($user['id'] ?? 0) === 1) ? 'Administrador Geral' : 'Administrador';
                $user['is_general_admin'] = ((int) ($user['id'] ?? 0) === 1) ? 1 : 0;
                $user['is_active'] = 1;
                $user['permissions_json'] = null;
            }
        }

        if ($user === null || !password_verify($password, (string) $user['password'])) {
            return false;
        }

        if (isset($user['is_active']) && (int) $user['is_active'] !== 1) {
            return false;
        }

        $isGeneralAdmin = (int) ($user['is_general_admin'] ?? 0) === 1;
        $permissions = $isGeneralAdmin
            ? self::permissionKeys()
            : $this->normalizePermissions($user['permissions_json'] ?? null);

        $this->session->regenerate();
        $this->session->set('admin_user', [
            'id' => (int) $user['id'],
            'name' => (string) $user['name'],
            'email' => (string) $user['email'],
            'access_level' => (string) ($user['access_level'] ?? 'Administrador'),
            'is_general_admin' => $isGeneralAdmin,
            'permissions' => $permissions,
        ]);

        return true;
    }

    public function check(): bool
    {
        return $this->session->has('admin_user');
    }

    public function user(): ?array
    {
        $user = $this->session->get('admin_user');

        return is_array($user) ? $user : null;
    }

    public function permissions(): array
    {
        $user = $this->user();
        if ($user === null) {
            return [];
        }

        if (!empty($user['is_general_admin'])) {
            return self::permissionKeys();
        }

        $permissions = $user['permissions'] ?? [];
        return is_array($permissions) ? array_values(array_unique(array_map('strval', $permissions))) : [];
    }

    public function isGeneralAdmin(): bool
    {
        $user = $this->user();
        return $user !== null && !empty($user['is_general_admin']);
    }

    public function hasPermission(string $permission): bool
    {
        if (!$this->check()) {
            return false;
        }

        if ($this->isGeneralAdmin()) {
            return true;
        }

        return in_array($permission, $this->permissions(), true);
    }

    public function preferredAdminPath(): string
    {
        $priority = [
            'dashboard.view' => '/admin/dashboard',
            'quotes.manage' => '/admin/orcamentos',
            'references.view' => '/admin/referencias',
            'taxes.manage' => '/admin/tributos',
            'tools.view' => '/admin/ferramentas',
            'categories.manage' => '/admin/categorias',
            'admins.manage' => '/admin/usuarios',
        ];

        foreach ($priority as $permission => $path) {
            if ($this->hasPermission($permission)) {
                return $path;
            }
        }

        return '/admin/logout';
    }

    public function logout(): void
    {
        $this->session->remove('admin_user');
        $this->session->regenerate();
    }

    public static function permissionCatalog(): array
    {
        return [
            'dashboard.view' => 'Dashboard',
            'quotes.manage' => 'Solicitacoes e Relatorios',
            'references.view' => 'Precos e Servicos',
            'taxes.manage' => 'Tributos',
            'tools.view' => 'Ferramentas',
            'categories.manage' => 'Categorias',
            'admins.manage' => 'Usuarios e Permissoes',
        ];
    }

    public static function permissionKeys(): array
    {
        return array_keys(self::permissionCatalog());
    }

    private function normalizePermissions(mixed $rawPermissions): array
    {
        $decoded = [];

        if (is_string($rawPermissions) && trim($rawPermissions) !== '') {
            $parsed = json_decode($rawPermissions, true);
            if (is_array($parsed)) {
                $decoded = $parsed;
            }
        } elseif (is_array($rawPermissions)) {
            $decoded = $rawPermissions;
        }

        $allowed = self::permissionKeys();
        $normalized = [];

        foreach ($decoded as $permission) {
            $permission = (string) $permission;
            if (in_array($permission, $allowed, true)) {
                $normalized[$permission] = $permission;
            }
        }

        return array_values($normalized);
    }
}
