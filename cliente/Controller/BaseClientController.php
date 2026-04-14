<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Controller;

use NosfirQuotia\System\Engine\Controller;

abstract class BaseClientController extends Controller
{
    protected function ensureClientAuthenticated(): void
    {
        if (!$this->clientAuth()->check()) {
            $this->session->flash('warning', 'Crie uma conta ou faca login para solicitar um orcamento.');
            $this->redirect('/cliente/login');
        }
    }

    protected function clientUser(): ?array
    {
        return $this->clientAuth()->user();
    }
}
