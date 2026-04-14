<?php

declare(strict_types=1);

namespace AureaQuotia\Admin\Model;

use AureaQuotia\System\Engine\Model;
use AureaQuotia\System\Library\Auth;

final class AdminUserModel extends Model
{
    public function all(): array
    {
        $rows = $this->db->fetchAll(
            'SELECT
                au.id,
                au.name,
                au.email,
                au.access_level,
                au.is_general_admin,
                au.is_active,
                au.permissions_json,
                au.created_at,
                au.updated_at,
                creator.name AS created_by_name
             FROM admin_users au
             LEFT JOIN admin_users creator ON creator.id = au.created_by_admin_id
             ORDER BY au.is_general_admin DESC, au.created_at ASC'
        );

        foreach ($rows as &$row) {
            $permissions = $this->decodePermissions($row['permissions_json'] ?? null);
            if (!empty($row['is_general_admin'])) {
                $permissions = Auth::permissionKeys();
            }
            $row['permissions'] = $permissions;
        }
        unset($row);

        return $rows;
    }

    public function find(int $id): ?array
    {
        $row = $this->db->fetch(
            'SELECT
                id,
                name,
                email,
                access_level,
                is_general_admin,
                is_active,
                permissions_json,
                created_at,
                updated_at
             FROM admin_users
             WHERE id = :id
             LIMIT 1',
            ['id' => $id]
        );

        if ($row === null) {
            return null;
        }

        $permissions = $this->decodePermissions($row['permissions_json'] ?? null);
        if (!empty($row['is_general_admin'])) {
            $permissions = Auth::permissionKeys();
        }
        $row['permissions'] = $permissions;

        return $row;
    }

    public function create(array $payload, int $createdByAdminId): void
    {
        $permissionsJson = json_encode(
            $this->sanitizePermissions($payload['permissions'] ?? []),
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );

        $this->db->execute(
            'INSERT INTO admin_users (
                name, email, password, access_level, is_general_admin, is_active, permissions_json, created_by_admin_id
             ) VALUES (
                :name, :email, :password, :access_level, 0, :is_active, :permissions_json, :created_by_admin_id
             )',
            [
                'name' => $payload['name'],
                'email' => $payload['email'],
                'password' => password_hash((string) $payload['password'], PASSWORD_DEFAULT),
                'access_level' => $payload['access_level'],
                'is_active' => !empty($payload['is_active']) ? 1 : 0,
                'permissions_json' => $permissionsJson,
                'created_by_admin_id' => $createdByAdminId > 0 ? $createdByAdminId : null,
            ]
        );
    }

    public function update(int $id, array $payload): void
    {
        $target = $this->find($id);
        if ($target === null) {
            return;
        }

        $isGeneralAdmin = !empty($target['is_general_admin']);
        $permissionsJson = json_encode(
            $isGeneralAdmin
                ? Auth::permissionKeys()
                : $this->sanitizePermissions($payload['permissions'] ?? []),
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );

        $params = [
            'id' => $id,
            'name' => $payload['name'],
            'email' => $payload['email'],
            'access_level' => $isGeneralAdmin ? 'Administrador Geral' : $payload['access_level'],
            'is_active' => $isGeneralAdmin ? 1 : (!empty($payload['is_active']) ? 1 : 0),
            'permissions_json' => $permissionsJson,
        ];

        $sql = 'UPDATE admin_users
                SET
                    name = :name,
                    email = :email,
                    access_level = :access_level,
                    is_active = :is_active,
                    permissions_json = :permissions_json';

        $newPassword = (string) ($payload['new_password'] ?? '');
        if ($newPassword !== '') {
            $sql .= ', password = :password';
            $params['password'] = password_hash($newPassword, PASSWORD_DEFAULT);
        }

        $sql .= ' WHERE id = :id LIMIT 1';

        $this->db->execute($sql, $params);
    }

    private function sanitizePermissions(array $permissions): array
    {
        $allowed = Auth::permissionKeys();
        $normalized = [];

        foreach ($permissions as $permission) {
            $permission = (string) $permission;
            if (in_array($permission, $allowed, true)) {
                $normalized[$permission] = $permission;
            }
        }

        return array_values($normalized);
    }

    private function decodePermissions(mixed $raw): array
    {
        if (!is_string($raw) || trim($raw) === '') {
            return [];
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return [];
        }

        return $this->sanitizePermissions($decoded);
    }
}
