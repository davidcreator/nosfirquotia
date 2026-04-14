<?php

declare(strict_types=1);

namespace AureaQuotia\Cliente\Controller;

use AureaQuotia\System\Engine\Controller;

final class HomeController extends Controller
{
    public function index(): void
    {
        $this->render(
            'cliente/View/home/index',
            ['clientUser' => $this->clientAuth()->user()],
            'cliente/View/layout'
        );
    }
}
