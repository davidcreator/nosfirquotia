<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Engine;

use NosfirQuotia\System\Library\Auth;
use NosfirQuotia\System\Library\ClientAuth;
use NosfirQuotia\System\Library\Database;
use RuntimeException;
use Throwable;

final class Application
{
    private const CSRF_TOKEN_TTL_SECONDS = 7200; // 2 horas
    private const CSRF_TOKEN_MAX_FUTURE_SKEW_SECONDS = 300;

    private static ?self $instance = null;

    private Request $request;
    private Response $response;
    private Session $session;
    private Router $router;
    private ?Database $database = null;
    private ?Auth $auth = null;
    private ?ClientAuth $clientAuth = null;

    public function __construct(private readonly string $rootPath, private readonly array $config)
    {
        self::$instance = $this;
        $this->request = new Request();
        $this->response = new Response($this->request);
        $this->session = new Session();
        $this->router = new Router();
    }

    public static function instance(): self
    {
        if (self::$instance === null) {
            throw new RuntimeException('Application nao inicializada.');
        }

        return self::$instance;
    }

    public function run(): void
    {
        try {
            $timezone = (string) $this->config('timezone', 'UTC');
            date_default_timezone_set($timezone);
            $this->applySecurityHeaders();

            $this->enforceInstallFlow();
            $this->registerRoutes();
            $this->dispatch();
        } catch (Throwable $exception) {
            $this->handleException($exception);
        }
    }

    public function rootPath(): string
    {
        return $this->rootPath;
    }

    public function request(): Request
    {
        return $this->request;
    }

    public function response(): Response
    {
        return $this->response;
    }

    public function session(): Session
    {
        return $this->session;
    }

    public function config(string $key, mixed $default = null): mixed
    {
        $value = $this->config;
        $segments = explode('.', $key);

        foreach ($segments as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }

            $value = $value[$segment];
        }

        return $value;
    }

    public function isInstalled(): bool
    {
        $configured = (bool) ($this->config['installed'] ?? false);
        $locked = is_file($this->rootPath . '/storage/installed.lock');

        return $configured && $locked;
    }

    public function db(): Database
    {
        if ($this->database === null) {
            $this->database = new Database((array) $this->config('db', []));
        }

        return $this->database;
    }

    public function auth(): Auth
    {
        if ($this->auth === null) {
            $this->auth = new Auth($this->session, $this->db());
        }

        return $this->auth;
    }

    public function clientAuth(): ClientAuth
    {
        if ($this->clientAuth === null) {
            $this->clientAuth = new ClientAuth($this->session, $this->db());
        }

        return $this->clientAuth;
    }

    public function csrfToken(): string
    {
        $secret = $this->csrfSecret();
        $issuedAt = time();
        $nonce = bin2hex($this->randomBytesSafe(12));
        $payload = $issuedAt . '|' . $nonce;
        $signature = hash_hmac('sha256', $payload, $secret);

        return $issuedAt . '.' . $nonce . '.' . $signature;
    }

    public function csrfTokenIsValid(string $providedToken): bool
    {
        $providedToken = trim($providedToken);
        if ($providedToken === '') {
            return false;
        }

        // Compatibilidade transitória com tokens legados fixos de sessão.
        $legacyStored = (string) $this->session->get('_csrf_token', '');
        if ($legacyStored !== '' && hash_equals($legacyStored, $providedToken)) {
            return true;
        }

        $parts = explode('.', $providedToken);
        if (count($parts) !== 3) {
            return false;
        }

        [$issuedAtRaw, $nonce, $signature] = $parts;
        if (!ctype_digit($issuedAtRaw)) {
            return false;
        }

        if (!preg_match('/^[a-f0-9]{24}$/', $nonce)) {
            return false;
        }

        if (!preg_match('/^[a-f0-9]{64}$/', $signature)) {
            return false;
        }

        $issuedAt = (int) $issuedAtRaw;
        $now = time();
        if ($issuedAt > ($now + self::CSRF_TOKEN_MAX_FUTURE_SKEW_SECONDS)) {
            return false;
        }

        if (($now - $issuedAt) > self::CSRF_TOKEN_TTL_SECONDS) {
            return false;
        }

        $expectedSignature = hash_hmac('sha256', $issuedAtRaw . '|' . $nonce, $this->csrfSecret());

        return hash_equals($expectedSignature, $signature);
    }

    private function registerRoutes(): void
    {
        $routeFile = $this->rootPath . '/system/routes.php';

        if (!is_file($routeFile)) {
            throw new RuntimeException('Arquivo de rotas nao encontrado.');
        }

        $callback = require $routeFile;

        if (!is_callable($callback)) {
            throw new RuntimeException('Arquivo de rotas invalido.');
        }

        $callback($this->router);
    }

    private function enforceInstallFlow(): void
    {
        $path = $this->request->path();
        $isInstallRoute = str_starts_with($path, '/install');
        $installed = $this->isInstalled();

        if (!$installed && !$isInstallRoute) {
            $this->response->redirect('/index.php?route=/install');
        }

        if ($installed && $isInstallRoute) {
            $allowStep4 = (bool) $this->session->get('installer.allow_step4', false);
            if (!$allowStep4 || $path !== '/install/step4') {
                $this->response->redirect('/');
            }
        }
    }

    private function dispatch(): void
    {
        $result = $this->router->dispatch($this->request->method(), $this->request->path());

        if ($result['status'] === 'not_found') {
            $this->response->text('Pagina nao encontrada.', 404);
            return;
        }

        if ($result['status'] === 'method_not_allowed') {
            $this->response->text('Metodo nao permitido.', 405);
            return;
        }

        if (!$this->enforceCsrfForWriteRequests()) {
            return;
        }

        $handler = $result['handler'];
        $vars = array_values((array) ($result['vars'] ?? []));

        if (is_callable($handler) && !is_array($handler)) {
            $handler($this, ...$vars);
            return;
        }

        if (is_array($handler) && count($handler) === 2) {
            [$controllerClass, $method] = $handler;

            if (!class_exists($controllerClass)) {
                throw new RuntimeException('Controller nao encontrado: ' . $controllerClass);
            }

            $controller = new $controllerClass($this);

            if (!method_exists($controller, $method)) {
                throw new RuntimeException('Metodo de controller nao encontrado: ' . $method);
            }

            $controller->{$method}(...$vars);
            return;
        }

        throw new RuntimeException('Handler de rota invalido.');
    }

    private function enforceCsrfForWriteRequests(): bool
    {
        $method = strtoupper($this->request->method());
        if (!in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true)) {
            return true;
        }

        if (!$this->isRequestFromTrustedOrigin()) {
            return $this->handleCsrfFailure();
        }

        $token = $this->csrfTokenFromRequest();
        if ($this->csrfTokenIsValid($token)) {
            return true;
        }

        return $this->handleCsrfFailure();
    }

    private function csrfTokenFromRequest(): string
    {
        $token = trim((string) $this->request->post('_csrf_token', ''));
        if ($token !== '') {
            return $token;
        }

        $headerCandidates = [
            'X-CSRF-TOKEN',
            'X-CSRF-Token',
            'X-XSRF-TOKEN',
        ];

        foreach ($headerCandidates as $headerName) {
            $headerValue = trim((string) $this->request->header($headerName, ''));
            if ($headerValue !== '') {
                return $headerValue;
            }
        }

        return '';
    }

    private function isRequestFromTrustedOrigin(): bool
    {
        $expectedOrigin = $this->request->scheme() . '://' . $this->request->host();
        $origin = trim((string) $this->request->header('Origin', ''));
        if ($origin !== '') {
            return $this->isSameOrigin($origin, $expectedOrigin);
        }

        $referer = trim((string) $this->request->header('Referer', ''));
        if ($referer !== '') {
            return $this->isSameOrigin($referer, $expectedOrigin);
        }

        $fetchSite = strtolower(trim((string) $this->request->header('Sec-Fetch-Site', '')));
        if ($fetchSite !== '' && !in_array($fetchSite, ['same-origin', 'same-site', 'none'], true)) {
            return false;
        }

        // Alguns agentes/proxies removem Origin/Referer; nao bloquear para evitar falso positivo.
        return true;
    }

    private function isSameOrigin(string $sourceUrl, string $expectedOrigin): bool
    {
        $sourceParts = parse_url($sourceUrl);
        $expectedParts = parse_url($expectedOrigin);
        if (!is_array($sourceParts) || !is_array($expectedParts)) {
            return false;
        }

        $sourceScheme = strtolower((string) ($sourceParts['scheme'] ?? ''));
        $sourceHost = strtolower((string) ($sourceParts['host'] ?? ''));
        $sourcePort = (int) ($sourceParts['port'] ?? ($sourceScheme === 'https' ? 443 : 80));

        $expectedScheme = strtolower((string) ($expectedParts['scheme'] ?? ''));
        $expectedHost = strtolower((string) ($expectedParts['host'] ?? ''));
        $expectedPort = (int) ($expectedParts['port'] ?? ($expectedScheme === 'https' ? 443 : 80));

        return $sourceScheme === $expectedScheme
            && $sourceHost === $expectedHost
            && $sourcePort === $expectedPort;
    }

    private function handleCsrfFailure(): bool
    {
        if ($this->requestExpectsJson()) {
            $this->response->json(
                [
                    'success' => false,
                    'code' => 'csrf_rejected',
                    'error' => 'Token CSRF invalido, expirado ou origem nao confiavel.',
                ],
                403
            );

            return false;
        }

        $this->session->flash('error', 'Sua sessao expirou ou a requisicao e invalida. Tente novamente.');
        $this->response->redirect($this->csrfFailureRedirectPath($this->request->path()));

        return false;
    }

    private function requestExpectsJson(): bool
    {
        $accept = strtolower(trim((string) $this->request->header('Accept', '')));
        if ($accept !== '' && str_contains($accept, 'application/json')) {
            return true;
        }

        $contentType = strtolower(trim((string) $this->request->header('Content-Type', '')));
        if ($contentType !== '' && str_contains($contentType, 'application/json')) {
            return true;
        }

        $requestedWith = strtolower(trim((string) $this->request->header('X-Requested-With', '')));
        if ($requestedWith === 'xmlhttprequest') {
            return true;
        }

        return false;
    }

    private function csrfFailureRedirectPath(string $path): string
    {
        if (str_starts_with($path, '/install')) {
            return '/index.php?route=' . $path;
        }

        if (str_starts_with($path, '/admin')) {
            if (str_starts_with($path, '/admin/orcamentos')) {
                return '/admin/orcamentos';
            }

            if (str_starts_with($path, '/admin/tributos')) {
                return '/admin/tributos';
            }

            if (str_starts_with($path, '/admin/usuarios')) {
                return '/admin/usuarios';
            }

            if (str_starts_with($path, '/admin/categorias')) {
                return '/admin/categorias';
            }

            if (str_starts_with($path, '/admin/esqueci-senha')) {
                return '/admin/esqueci-senha';
            }

            if (str_starts_with($path, '/admin/redefinir-senha')) {
                return '/admin/esqueci-senha';
            }

            return '/admin';
        }

        if (str_starts_with($path, '/cliente/login')) {
            return '/cliente/login';
        }

        if (str_starts_with($path, '/cliente/cadastro')) {
            return '/cliente/cadastro';
        }

        if (str_starts_with($path, '/cliente/esqueci-senha')) {
            return '/cliente/esqueci-senha';
        }

        if (str_starts_with($path, '/cliente/redefinir-senha')) {
            return '/cliente/esqueci-senha';
        }

        if (str_starts_with($path, '/orcamento')) {
            return '/orcamento/novo';
        }

        return '/';
    }

    private function handleException(Throwable $exception): void
    {
        http_response_code(500);
        error_log($exception->getMessage());
        error_log($exception->getTraceAsString());

        echo 'Erro interno. Verifique os logs do servidor.';
    }

    private function csrfSecret(): string
    {
        $secret = (string) $this->session->get('_csrf_secret', '');
        if ($secret !== '' && preg_match('/^[a-f0-9]{64}$/', $secret)) {
            return $secret;
        }

        $secret = bin2hex($this->randomBytesSafe(32));
        $this->session->set('_csrf_secret', $secret);

        return $secret;
    }

    private function randomBytesSafe(int $length): string
    {
        try {
            return random_bytes($length);
        } catch (Throwable) {
            $buffer = '';
            while (strlen($buffer) < $length) {
                $buffer .= hash('sha256', uniqid('csrf_entropy_', true), true);
            }

            return substr($buffer, 0, $length);
        }
    }

    private function applySecurityHeaders(): void
    {
        if (headers_sent()) {
            return;
        }

        $csp = implode('; ', [
            "default-src 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            "object-src 'none'",
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:",
            "img-src 'self' data: blob: https:",
            "connect-src 'self' https://cdn.jsdelivr.net",
            "frame-src 'self'",
        ]);

        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
        header('Cross-Origin-Opener-Policy: same-origin');
        header('Cross-Origin-Resource-Policy: same-origin');
        header('Content-Security-Policy: ' . $csp);
    }
}
