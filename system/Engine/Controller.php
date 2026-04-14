<?php

declare(strict_types=1);

namespace AureaQuotia\System\Engine;

use AureaQuotia\System\Library\Auth;
use AureaQuotia\System\Library\ClientAuth;
use AureaQuotia\System\Library\Database;

abstract class Controller
{
    protected Request $request;
    protected Response $response;
    protected Session $session;
    protected View $view;

    public function __construct(protected readonly Application $app)
    {
        $this->request = $app->request();
        $this->response = $app->response();
        $this->session = $app->session();
        $this->view = new View($app->rootPath());
    }

    protected function render(string $template, array $data = [], ?string $layout = null): void
    {
        $shared = [
            'appName' => $this->app->config('name', 'Aurea Quotia'),
            'currentPath' => $this->request->path(),
        ];

        $this->view->render($template, array_merge($shared, $data), $layout);
    }

    protected function redirect(string $path, int $status = 302): never
    {
        $this->response->redirect($path, $status);
    }

    protected function db(): Database
    {
        return $this->app->db();
    }

    protected function auth(): Auth
    {
        return $this->app->auth();
    }

    protected function clientAuth(): ClientAuth
    {
        return $this->app->clientAuth();
    }
}
