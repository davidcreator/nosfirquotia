<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Controller;

use NosfirQuotia\System\Engine\Controller;

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
