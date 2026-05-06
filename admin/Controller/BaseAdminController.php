<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\System\Engine\Controller;

abstract class BaseAdminController extends Controller
{
    protected function ensureAuthenticated(): void
    {
        if (!$this->auth()->check()) {
            $this->session->flash('error', 'Faça login para acessar a área administrativa.');
            $this->redirect('/admin');
        }
    }

    protected function ensurePermission(string $permission): void
    {
        $this->ensureAuthenticated();

        if ($this->auth()->hasPermission($permission)) {
            return;
        }

        $this->session->flash('error', 'Você não tem permissão para acessar este módulo.');
        $this->redirect($this->auth()->preferredAdminPath());
    }

    protected function ensureGeneralAdmin(): void
    {
        $this->ensureAuthenticated();

        if ($this->auth()->isGeneralAdmin()) {
            return;
        }

        $this->session->flash('error', 'Apenas o Administrador Geral pode gerenciar niveis e permissoes.');
        $this->redirect($this->auth()->preferredAdminPath());
    }

    protected function adminUser(): ?array
    {
        return $this->auth()->user();
    }

    protected function securityIp(): string
    {
        return $this->request->clientIp();
    }

    protected function logAdminSecurityInfo(string $event, array $context = []): void
    {
        $user = $this->adminUser();
        $this->securityLogger()->info(
            $event,
            array_merge(
                [
                    'admin_user_id' => (int) ($user['id'] ?? 0),
                    'ip' => $this->securityIp(),
                ],
                $context
            )
        );
    }

    protected function logAdminSecurityWarning(string $event, array $context = []): void
    {
        $user = $this->adminUser();
        $this->securityLogger()->warning(
            $event,
            array_merge(
                [
                    'admin_user_id' => (int) ($user['id'] ?? 0),
                    'ip' => $this->securityIp(),
                ],
                $context
            )
        );
    }
}
