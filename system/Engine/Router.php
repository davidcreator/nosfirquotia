<?php

declare(strict_types=1);

namespace AureaQuotia\System\Engine;

use FastRoute\Dispatcher;
use FastRoute\RouteCollector;
use function FastRoute\simpleDispatcher;

final class Router
{
    private array $routes = [];

    public function add(string $method, string $route, mixed $handler): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'route' => $route,
            'handler' => $handler,
        ];
    }

    public function get(string $route, mixed $handler): void
    {
        $this->add('GET', $route, $handler);
    }

    public function post(string $route, mixed $handler): void
    {
        $this->add('POST', $route, $handler);
    }

    public function dispatch(string $method, string $uri): array
    {
        $dispatcher = simpleDispatcher(function (RouteCollector $collector): void {
            foreach ($this->routes as $route) {
                $collector->addRoute($route['method'], $route['route'], $route['handler']);
            }
        });

        $routeInfo = $dispatcher->dispatch(strtoupper($method), $uri);
        $status = $routeInfo[0] ?? Dispatcher::NOT_FOUND;
        $handler = $routeInfo[1] ?? null;
        $vars = $routeInfo[2] ?? [];

        return match ($status) {
            Dispatcher::NOT_FOUND => ['status' => 'not_found'],
            Dispatcher::METHOD_NOT_ALLOWED => ['status' => 'method_not_allowed'],
            default => [
                'status' => 'found',
                'handler' => $handler,
                'vars' => $vars,
            ],
        };
    }
}
