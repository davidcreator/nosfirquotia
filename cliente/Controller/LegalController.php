<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Controller;

use NosfirQuotia\System\Engine\Controller;

final class LegalController extends Controller
{
    public function policyUsage(): void
    {
        $this->render(
            'cliente/View/legal/policy_usage',
            ['pageTitle' => 'Politica de Uso'],
            'cliente/View/layout'
        );
    }

    public function terms(): void
    {
        $this->render(
            'cliente/View/legal/terms',
            ['pageTitle' => 'Termos de Uso'],
            'cliente/View/layout'
        );
    }

    public function privacy(): void
    {
        $this->render(
            'cliente/View/legal/privacy',
            ['pageTitle' => 'Politica de Privacidade e Captacao de Dados'],
            'cliente/View/layout'
        );
    }

    public function cookies(): void
    {
        $this->render(
            'cliente/View/legal/cookies',
            ['pageTitle' => 'Politica de Cookies'],
            'cliente/View/layout'
        );
    }

    public function lgpd(): void
    {
        $this->render(
            'cliente/View/legal/lgpd',
            ['pageTitle' => 'Documento LGPD'],
            'cliente/View/layout'
        );
    }
}
