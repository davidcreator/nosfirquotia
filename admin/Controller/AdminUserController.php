<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\DTO\ValidateAdminUserCreateCommand;
use NosfirQuotia\Admin\DTO\ValidateAdminUserUpdateCommand;
use NosfirQuotia\Admin\Model\AdminUserModel;
use NosfirQuotia\Admin\Service\AdminUserValidationService;
use NosfirQuotia\System\Library\Auth;
use Throwable;

final class AdminUserController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensureGeneralAdmin();

        /** @var AdminUserModel $model */
        $model = $this->make(AdminUserModel::class);
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

        /** @var AdminUserValidationService $validationService */
        $validationService = $this->make(AdminUserValidationService::class);
        $result = $validationService->validateCreate(
            new ValidateAdminUserCreateCommand($this->request->all())
        );
        $payload = $result->payload;

        if (!$result->ok) {
            $this->logAdminSecurityWarning(
                'admin_user_create_validation_failed',
                [
                    'error_code' => (string) ($result->errorCode ?? ''),
                    'error_count' => count($result->errors),
                    'target_email_hash' => hash('sha256', strtolower((string) ($payload['email'] ?? ''))),
                ]
            );
            $this->session->flash('error', implode(' ', $result->errors));
            $this->redirect('/admin/usuarios');
        }

        /** @var AdminUserModel $model */
        $model = $this->make(AdminUserModel::class);

        try {
            $model->create($payload, (int) ($this->adminUser()['id'] ?? 0));
        } catch (Throwable) {
            $this->logAdminSecurityWarning(
                'admin_user_create_failed',
                [
                    'target_email_hash' => hash('sha256', strtolower((string) ($payload['email'] ?? ''))),
                ]
            );
            $this->session->flash('error', 'Nao foi possivel criar o usuario admin. Verifique se o e-mail ja existe.');
            $this->redirect('/admin/usuarios');
        }

        $this->logAdminSecurityInfo(
            'admin_user_created',
            [
                'target_email_hash' => hash('sha256', strtolower((string) ($payload['email'] ?? ''))),
            ]
        );
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

        /** @var AdminUserModel $model */
        $model = $this->make(AdminUserModel::class);
        $target = $model->find($adminId);
        if ($target === null) {
            $this->session->flash('error', 'Usuario nao encontrado.');
            $this->redirect('/admin/usuarios');
        }

        /** @var AdminUserValidationService $validationService */
        $validationService = $this->make(AdminUserValidationService::class);
        $result = $validationService->validateUpdate(
            new ValidateAdminUserUpdateCommand(
                $adminId,
                !empty($target['is_general_admin']),
                (int) ($this->adminUser()['id'] ?? 0),
                $this->request->all()
            )
        );
        $payload = $result->payload;

        if (!$result->ok) {
            $this->logAdminSecurityWarning(
                'admin_user_update_validation_failed',
                [
                    'target_admin_id' => $adminId,
                    'error_code' => (string) ($result->errorCode ?? ''),
                    'error_count' => count($result->errors),
                ]
            );
            $this->session->flash('error', implode(' ', $result->errors));
            $this->redirect('/admin/usuarios');
        }

        try {
            $model->update($adminId, $payload);
        } catch (Throwable) {
            $this->logAdminSecurityWarning(
                'admin_user_update_failed',
                [
                    'target_admin_id' => $adminId,
                ]
            );
            $this->session->flash('error', 'Nao foi possivel atualizar o usuario. Verifique se o e-mail ja existe.');
            $this->redirect('/admin/usuarios');
        }

        $this->logAdminSecurityInfo(
            'admin_user_updated',
            [
                'target_admin_id' => $adminId,
            ]
        );
        $this->session->flash('success', 'Permissoes e configuracoes do usuario atualizadas.');
        $this->redirect('/admin/usuarios');
    }
}
