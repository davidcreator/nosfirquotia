<?php

declare(strict_types=1);

namespace AureaQuotia\Admin\Controller;

use AureaQuotia\Admin\Model\AdminUserModel;
use AureaQuotia\System\Library\Auth;
use Throwable;

final class AdminUserController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensureGeneralAdmin();

        $model = new AdminUserModel($this->app);
        $users = $model->all();

        $this->render(
            'admin/View/users/index',
            [
                'users' => $users,
                'permissionCatalog' => Auth::permissionCatalog(),
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }

    public function store(): void
    {
        $this->ensureGeneralAdmin();

        $payload = [
            'name' => trim((string) $this->request->post('name', '')),
            'email' => strtolower(trim((string) $this->request->post('email', ''))),
            'password' => (string) $this->request->post('password', ''),
            'access_level' => trim((string) $this->request->post('access_level', 'Operacional')),
            'is_active' => (bool) $this->request->post('is_active', false),
            'permissions' => $this->normalizePermissionsInput($this->request->post('permissions', [])),
        ];

        $errors = $this->validateCreatePayload($payload);
        if ($errors !== []) {
            $this->session->flash('error', implode(' ', $errors));
            $this->redirect('/admin/usuarios');
        }

        $model = new AdminUserModel($this->app);

        try {
            $model->create($payload, (int) ($this->adminUser()['id'] ?? 0));
        } catch (Throwable) {
            $this->session->flash('error', 'Nao foi possivel criar o usuario admin. Verifique se o email ja existe.');
            $this->redirect('/admin/usuarios');
        }

        $this->session->flash('success', 'Usuario administrativo criado com sucesso.');
        $this->redirect('/admin/usuarios');
    }

    public function update(string $id): void
    {
        $this->ensureGeneralAdmin();

        $adminId = (int) $id;
        if ($adminId < 1) {
            $this->session->flash('error', 'Usuario invalido.');
            $this->redirect('/admin/usuarios');
        }

        $payload = [
            'name' => trim((string) $this->request->post('name', '')),
            'email' => strtolower(trim((string) $this->request->post('email', ''))),
            'new_password' => (string) $this->request->post('new_password', ''),
            'access_level' => trim((string) $this->request->post('access_level', 'Operacional')),
            'is_active' => (bool) $this->request->post('is_active', false),
            'permissions' => $this->normalizePermissionsInput($this->request->post('permissions', [])),
        ];

        $model = new AdminUserModel($this->app);
        $target = $model->find($adminId);
        if ($target === null) {
            $this->session->flash('error', 'Usuario nao encontrado.');
            $this->redirect('/admin/usuarios');
        }

        $errors = $this->validateUpdatePayload($payload, empty($target['is_general_admin']));
        if ($errors !== []) {
            $this->session->flash('error', implode(' ', $errors));
            $this->redirect('/admin/usuarios');
        }

        if (
            $adminId === (int) ($this->adminUser()['id'] ?? 0)
            && !$payload['is_active']
            && empty($target['is_general_admin'])
        ) {
            $this->session->flash('error', 'Voce nao pode desativar sua propria conta logada.');
            $this->redirect('/admin/usuarios');
        }

        try {
            $model->update($adminId, $payload);
        } catch (Throwable) {
            $this->session->flash('error', 'Nao foi possivel atualizar o usuario. Verifique se o email ja existe.');
            $this->redirect('/admin/usuarios');
        }

        $this->session->flash('success', 'Permissoes e configuracoes do usuario atualizadas.');
        $this->redirect('/admin/usuarios');
    }

    private function validateCreatePayload(array $payload): array
    {
        $errors = [];

        if ($payload['name'] === '' || $payload['email'] === '' || $payload['access_level'] === '') {
            $errors[] = 'Preencha nome, email e nivel de acesso.';
        }

        if (filter_var($payload['email'], FILTER_VALIDATE_EMAIL) === false) {
            $errors[] = 'Email invalido.';
        }

        if (strlen((string) $payload['password']) < 6) {
            $errors[] = 'Senha deve ter pelo menos 6 caracteres.';
        }

        if (($payload['permissions'] ?? []) === []) {
            $errors[] = 'Selecione pelo menos uma permissao para o usuario.';
        }

        return $errors;
    }

    private function validateUpdatePayload(array $payload, bool $requirePermissions = true): array
    {
        $errors = [];

        if ($payload['name'] === '' || $payload['email'] === '' || $payload['access_level'] === '') {
            $errors[] = 'Preencha nome, email e nivel de acesso.';
        }

        if (filter_var($payload['email'], FILTER_VALIDATE_EMAIL) === false) {
            $errors[] = 'Email invalido.';
        }

        if ($payload['new_password'] !== '' && strlen((string) $payload['new_password']) < 6) {
            $errors[] = 'Nova senha deve ter pelo menos 6 caracteres.';
        }

        if ($requirePermissions && ($payload['permissions'] ?? []) === []) {
            $errors[] = 'Selecione pelo menos uma permissao para o usuario.';
        }

        return $errors;
    }

    private function normalizePermissionsInput(mixed $raw): array
    {
        if (!is_array($raw)) {
            return [];
        }

        $permissions = [];
        foreach ($raw as $permission) {
            $permission = (string) $permission;
            if ($permission !== '') {
                $permissions[$permission] = $permission;
            }
        }

        return array_values($permissions);
    }
}
