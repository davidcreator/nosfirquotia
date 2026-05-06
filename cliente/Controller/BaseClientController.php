<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Controller;

use NosfirQuotia\System\Engine\Controller;

abstract class BaseClientController extends Controller
{
    protected function ensureClientAuthenticated(): void
    {
        if (!$this->clientAuth()->check()) {
            $this->session->flash('warning', 'Crie uma conta ou faça login para solicitar um orçamento.');
            $this->redirect('/cliente/login');
        }
    }

    protected function clientUser(): ?array
    {
        return $this->clientAuth()->user();
    }

    protected function securityIp(): string
    {
        return $this->request->clientIp();
    }

    protected function logClientSecurityInfo(string $event, array $context = []): void
    {
        $user = $this->clientUser();
        $this->securityLogger()->info(
            $event,
            array_merge(
                [
                    'client_user_id' => (int) ($user['id'] ?? 0),
                    'ip' => $this->securityIp(),
                ],
                $context
            )
        );
    }

    protected function logClientSecurityWarning(string $event, array $context = []): void
    {
        $user = $this->clientUser();
        $this->securityLogger()->warning(
            $event,
            array_merge(
                [
                    'client_user_id' => (int) ($user['id'] ?? 0),
                    'ip' => $this->securityIp(),
                ],
                $context
            )
        );
    }
}
