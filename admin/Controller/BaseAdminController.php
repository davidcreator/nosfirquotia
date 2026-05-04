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
}
