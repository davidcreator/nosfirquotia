<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Engine;

use NosfirQuotia\Admin\Model\AdminUserModel;
use NosfirQuotia\Admin\Model\CategoryModel;
use NosfirQuotia\Admin\Model\EmailLogModel;
use NosfirQuotia\Admin\Model\QuoteModel;
use NosfirQuotia\Admin\Model\ReferencePriceModel as AdminReferencePriceModel;
use NosfirQuotia\Admin\Model\ToolModel;
use NosfirQuotia\Admin\Repository\QuoteModelRepository;
use NosfirQuotia\Admin\Repository\QuoteRepositoryInterface;
use NosfirQuotia\Admin\Repository\TaxSettingsModelRepository;
use NosfirQuotia\Admin\Repository\TaxSettingsRepositoryInterface;
use NosfirQuotia\Admin\Service\EmailServiceQuoteReportMailer;
use NosfirQuotia\Admin\Service\QuoteReportMailerInterface;
use NosfirQuotia\Admin\Service\SecurityEventMonitoringService;
use NosfirQuotia\Cliente\Model\ReferencePriceModel as ClientReferencePriceModel;
use NosfirQuotia\Cliente\Model\RequestModel;
use NosfirQuotia\Cliente\Repository\QuoteRequestModelRepository;
use NosfirQuotia\Cliente\Repository\QuoteRequestRepositoryInterface;
use NosfirQuotia\System\Library\Auth;
use NosfirQuotia\System\Library\ClientAuth;
use NosfirQuotia\System\Library\Database;
use NosfirQuotia\System\Library\EmailService;
use NosfirQuotia\System\Library\Installer;
use NosfirQuotia\System\Library\PasswordResetService;
use NosfirQuotia\System\Library\RateLimiter;
use NosfirQuotia\System\Library\SecurityEventLogger;
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
    private Container $container;
    private ?Database $database = null;
    private ?Auth $auth = null;
    private ?ClientAuth $clientAuth = null;
    private ?string $cspNonce = null;
    private ?string $cachedFullBaseUrl = null;

    public function __construct(private readonly string $rootPath, private readonly array $config)
    {
        self::$instance = $this;
        $this->request = new Request(
            [],
            [],
            [],
            [],
            $this->configuredTrustedProxies($config)
        );
        $this->response = new Response($this->request);
        $this->session = new Session();
        $this->router = new Router();
        $this->container = new Container();
        $this->container->instance(self::class, $this);
        $this->registerContainerBindings();
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
            if (!$this->enforceTrustedHost()) {
                return;
            }
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

    public function fullBaseUrl(): string
    {
        if ($this->cachedFullBaseUrl !== null) {
            return $this->cachedFullBaseUrl;
        }

        $configured = $this->normalizeConfiguredBaseUrl((string) $this->config('app_url', ''));
        if ($configured === '') {
            $configured = $this->normalizeConfiguredBaseUrl((string) $this->config('url', ''));
        }

        if ($configured !== '') {
            $this->cachedFullBaseUrl = $configured;
            return $this->cachedFullBaseUrl;
        }

        $this->cachedFullBaseUrl = rtrim($this->request->fullBaseUrl(), '/');
        return $this->cachedFullBaseUrl;
    }

    public function absoluteUrl(string $path = ''): string
    {
        $base = rtrim($this->fullBaseUrl(), '/');
        $path = trim($path);

        if ($path === '' || $path === '/') {
            return $base;
        }

        return $base . '/' . ltrim($path, '/');
    }

    public function container(): Container
    {
        return $this->container;
    }

    public function make(string $id): mixed
    {
        return $this->container->make($id);
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

    public function cspNonce(): string
    {
        if ($this->cspNonce !== null) {
            return $this->cspNonce;
        }

        $this->cspNonce = base64_encode($this->randomBytesSafe(18));

        return $this->cspNonce;
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

            $controller = $this->make($controllerClass);
            if (!$controller instanceof $controllerClass) {
                throw new RuntimeException('Controller invalido resolvido pelo container: ' . $controllerClass);
            }

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
            return $this->handleCsrfFailure(
                'origin_untrusted',
                [
                    'origin' => (string) $this->request->header('Origin', ''),
                    'referer' => (string) $this->request->header('Referer', ''),
                    'sec_fetch_site' => (string) $this->request->header('Sec-Fetch-Site', ''),
                ]
            );
        }

        $token = $this->csrfTokenFromRequest();
        if ($this->csrfTokenIsValid($token)) {
            return true;
        }

        return $this->handleCsrfFailure(
            'token_invalid_or_missing',
            [
                'has_token' => $token !== '',
            ]
        );
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
        $expectedOrigin = $this->baseOrigin();
        $origin = trim((string) $this->request->header('Origin', ''));
        if ($origin !== '') {
            return $this->isAcceptedOrigin($origin, $expectedOrigin);
        }

        $referer = trim((string) $this->request->header('Referer', ''));
        if ($referer !== '') {
            return $this->isAcceptedOrigin($referer, $expectedOrigin);
        }

        $fetchSite = strtolower(trim((string) $this->request->header('Sec-Fetch-Site', '')));
        if ($fetchSite !== '' && !in_array($fetchSite, ['same-origin', 'same-site', 'none'], true)) {
            return false;
        }

        // Alguns agentes/proxies removem Origin/Referer; nao bloquear para evitar falso positivo.
        return true;
    }

    private function isAcceptedOrigin(string $sourceUrl, string $expectedOrigin): bool
    {
        if ($this->isSameOrigin($sourceUrl, $expectedOrigin)) {
            return true;
        }

        return $this->isTrustedHostOrigin($sourceUrl, $expectedOrigin);
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

    private function isTrustedHostOrigin(string $sourceUrl, string $expectedOrigin): bool
    {
        $sourceParts = parse_url($sourceUrl);
        $expectedParts = parse_url($expectedOrigin);
        if (!is_array($sourceParts) || !is_array($expectedParts)) {
            return false;
        }

        $sourceScheme = strtolower((string) ($sourceParts['scheme'] ?? ''));
        $sourceHostRaw = (string) ($sourceParts['host'] ?? '');
        $sourceHost = $this->normalizeComparableHost($sourceHostRaw);
        $sourcePort = (int) ($sourceParts['port'] ?? ($sourceScheme === 'https' ? 443 : 80));

        $expectedScheme = strtolower((string) ($expectedParts['scheme'] ?? ''));
        $expectedPort = (int) ($expectedParts['port'] ?? ($expectedScheme === 'https' ? 443 : 80));

        if ($sourceScheme === '' || $sourceHost === '') {
            return false;
        }

        if ($sourceScheme !== $expectedScheme || $sourcePort !== $expectedPort) {
            return false;
        }

        $trustedHosts = $this->trustedHostAllowlist();
        if ($trustedHosts === []) {
            return false;
        }

        return in_array($sourceHost, $trustedHosts, true);
    }

    private function handleCsrfFailure(string $reason = 'unknown', array $extraContext = []): bool
    {
        $this->logSecurityEvent(
            'warning',
            'csrf_rejected',
            array_merge(
                [
                    'reason' => $reason,
                    'method' => $this->request->method(),
                    'path' => $this->request->path(),
                    'ip' => $this->request->clientIp(),
                    'user_agent' => (string) $this->request->header('User-Agent', ''),
                    'accept' => (string) $this->request->header('Accept', ''),
                    'content_type' => (string) $this->request->header('Content-Type', ''),
                ],
                $extraContext
            )
        );

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

    private function logSecurityEvent(string $level, string $event, array $context = []): void
    {
        try {
            /** @var SecurityEventLogger $logger */
            $logger = $this->make(SecurityEventLogger::class);
            if ($level === 'error') {
                $logger->error($event, $context);
                return;
            }

            if ($level === 'warning') {
                $logger->warning($event, $context);
                return;
            }

            $logger->info($event, $context);
        } catch (Throwable) {
            // Logging de seguranca nao deve quebrar o ciclo HTTP.
        }
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

    private function registerContainerBindings(): void
    {
        $this->container->singleton(Database::class, fn (): Database => $this->db());
        $this->container->singleton(Auth::class, fn (): Auth => $this->auth());
        $this->container->singleton(ClientAuth::class, fn (): ClientAuth => $this->clientAuth());

        $this->container->singleton(
            EmailService::class,
            fn (): EmailService => new EmailService($this->db(), (array) $this->config('mail', []))
        );

        $this->container->bind(
            PasswordResetService::class,
            fn (Container $container): PasswordResetService => new PasswordResetService(
                $container->make(Database::class),
                $container->make(EmailService::class),
                (string) $this->config('name', 'Quotia')
            )
        );

        $this->container->singleton(
            RateLimiter::class,
            fn (): RateLimiter => new RateLimiter($this->rootPath . '/storage/cache/rate_limits')
        );

        $this->container->singleton(
            SecurityEventLogger::class,
            fn (): SecurityEventLogger => new SecurityEventLogger(
                $this->rootPath . '/storage/logs',
                (int) $this->config('security.logs.security_events.max_active_file_bytes', 5_242_880),
                (int) $this->config('security.logs.security_events.retention_days', 30),
                (int) $this->config('security.logs.security_events.max_archive_files', 180)
            )
        );

        $this->container->bind(
            SecurityEventMonitoringService::class,
            fn (): SecurityEventMonitoringService => new SecurityEventMonitoringService(
                $this->rootPath . '/storage/logs/security-events.log',
                (array) $this->config('security.monitoring.thresholds', [])
            )
        );

        $this->container->bind(
            Installer::class,
            fn (): Installer => new Installer($this->rootPath)
        );

        $this->container->bind(
            QuoteModel::class,
            fn (): QuoteModel => new QuoteModel($this)
        );
        $this->container->bind(
            AdminReferencePriceModel::class,
            fn (): AdminReferencePriceModel => new AdminReferencePriceModel($this)
        );
        $this->container->bind(
            AdminUserModel::class,
            fn (): AdminUserModel => new AdminUserModel($this)
        );
        $this->container->bind(
            CategoryModel::class,
            fn (): CategoryModel => new CategoryModel($this)
        );
        $this->container->bind(
            EmailLogModel::class,
            fn (): EmailLogModel => new EmailLogModel($this)
        );
        $this->container->bind(
            ToolModel::class,
            fn (): ToolModel => new ToolModel($this)
        );

        $this->container->bind(
            ClientReferencePriceModel::class,
            fn (): ClientReferencePriceModel => new ClientReferencePriceModel($this)
        );
        $this->container->bind(
            RequestModel::class,
            fn (): RequestModel => new RequestModel($this)
        );

        $this->container->bind(
            QuoteRepositoryInterface::class,
            fn (Container $container): QuoteRepositoryInterface => new QuoteModelRepository(
                $container->make(QuoteModel::class)
            )
        );
        $this->container->bind(
            TaxSettingsRepositoryInterface::class,
            fn (Container $container): TaxSettingsRepositoryInterface => new TaxSettingsModelRepository(
                $container->make(QuoteModel::class)
            )
        );
        $this->container->bind(
            QuoteRequestRepositoryInterface::class,
            fn (Container $container): QuoteRequestRepositoryInterface => new QuoteRequestModelRepository(
                $container->make(ClientReferencePriceModel::class),
                $container->make(RequestModel::class)
            )
        );

        $this->container->bind(
            QuoteReportMailerInterface::class,
            fn (Container $container): QuoteReportMailerInterface => new EmailServiceQuoteReportMailer(
                $container->make(EmailService::class)
            )
        );
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

        $cspNonceSource = "'nonce-" . $this->cspNonce() . "'";
        $path = $this->request->path();
        $embeddedToolSlug = '';
        if (preg_match('#^/admin/ferramentas/([a-z0-9\-]+)$#', $path, $matches) === 1) {
            $embeddedToolSlug = (string) ($matches[1] ?? '');
        }

        $toolSlugsRequiringInlineScriptAttr = [];
        $allowInlineScriptAttr = in_array($embeddedToolSlug, $toolSlugsRequiringInlineScriptAttr, true);
        $scriptAttrPolicy = $allowInlineScriptAttr ? "'unsafe-inline'" : "'none'";
        $toolSlugsRequiringInlineStyleAttr = [];
        $allowInlineStyleAttr = in_array($embeddedToolSlug, $toolSlugsRequiringInlineStyleAttr, true);
        $styleAttrPolicy = $allowInlineStyleAttr ? "'unsafe-inline'" : "'none'";

        $csp = implode('; ', [
            "default-src 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            "object-src 'none'",
            "script-src 'self' {$cspNonceSource} https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
            "script-src-elem 'self' {$cspNonceSource} https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
            "script-src-attr {$scriptAttrPolicy}",
            "style-src 'self' {$cspNonceSource} https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com",
            "style-src-elem 'self' {$cspNonceSource} https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com",
            "style-src-attr {$styleAttrPolicy}",
            "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com data:",
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

    private function baseOrigin(): string
    {
        $baseUrl = $this->fullBaseUrl();
        $parts = parse_url($baseUrl);
        if (!is_array($parts)) {
            return $this->request->scheme() . '://' . $this->request->host();
        }

        $scheme = strtolower((string) ($parts['scheme'] ?? $this->request->scheme()));
        $host = strtolower((string) ($parts['host'] ?? ''));
        if ($host === '') {
            return $this->request->scheme() . '://' . $this->request->host();
        }

        $port = isset($parts['port']) ? (int) $parts['port'] : ($scheme === 'https' ? 443 : 80);
        $defaultPort = $scheme === 'https' ? 443 : 80;
        $authority = str_contains($host, ':') ? '[' . $host . ']' : $host;
        if ($port > 0 && $port !== $defaultPort) {
            $authority = $host . ':' . $port;
            if (str_contains($host, ':')) {
                $authority = '[' . $host . ']:' . $port;
            }
        }

        return $scheme . '://' . $authority;
    }

    private function normalizeConfiguredBaseUrl(string $baseUrl): string
    {
        $baseUrl = trim($baseUrl);
        if ($baseUrl === '') {
            return '';
        }

        $parts = parse_url($baseUrl);
        if (!is_array($parts)) {
            return '';
        }

        $scheme = strtolower((string) ($parts['scheme'] ?? ''));
        $host = strtolower((string) ($parts['host'] ?? ''));
        if (!in_array($scheme, ['http', 'https'], true) || $host === '') {
            return '';
        }

        $port = isset($parts['port']) ? (int) $parts['port'] : null;
        if ($port !== null && ($port < 1 || $port > 65535)) {
            return '';
        }

        $path = (string) ($parts['path'] ?? '');
        $path = $path !== '' ? '/' . trim($path, '/') : '';

        $authority = str_contains($host, ':') ? '[' . $host . ']' : $host;
        if ($port !== null) {
            $authority .= ':' . $port;
        }

        return $scheme . '://' . $authority . $path;
    }

    private function enforceTrustedHost(): bool
    {
        $trustedHosts = $this->trustedHostAllowlist();
        if ($trustedHosts === []) {
            return true;
        }

        $effectiveHost = trim((string) $this->request->host());
        $normalizedHost = $this->normalizeComparableHost($effectiveHost);
        if ($normalizedHost === '') {
            return $this->handleUntrustedHost(
                'invalid_effective_host',
                ['effective_host' => $effectiveHost, 'trusted_hosts' => $trustedHosts]
            );
        }

        if (!in_array($normalizedHost, $trustedHosts, true)) {
            return $this->handleUntrustedHost(
                'host_not_allowlisted',
                [
                    'host_header' => (string) $this->request->server('HTTP_HOST', ''),
                    'effective_host' => $effectiveHost,
                    'host' => $normalizedHost,
                    'trusted_hosts' => $trustedHosts,
                ]
            );
        }

        return true;
    }

    /**
     * @return array<int, string>
     */
    private function trustedHostAllowlist(): array
    {
        $configured = $this->config('security.trusted_hosts', null);
        if ($configured === null) {
            $configured = $this->config('allowed_hosts', []);
        }

        $rawList = [];
        if (is_string($configured)) {
            $rawList = array_filter(array_map('trim', explode(',', $configured)));
        } elseif (is_array($configured)) {
            foreach ($configured as $item) {
                if (is_scalar($item) || (is_object($item) && method_exists($item, '__toString'))) {
                    $rawList[] = trim((string) $item);
                }
            }
        }

        $appUrlHost = $this->hostFromConfiguredAppUrl();
        if ($appUrlHost !== '') {
            $rawList[] = $appUrlHost;
        }

        $normalized = [];
        foreach ($rawList as $candidate) {
            $host = $this->normalizeComparableHost($candidate);
            if ($host !== '') {
                $normalized[$host] = $host;
            }
        }

        return array_values($normalized);
    }

    private function handleUntrustedHost(string $reason, array $context = []): bool
    {
        $this->logSecurityEvent(
            'warning',
            'host_header_rejected',
            array_merge(
                [
                    'reason' => $reason,
                    'method' => $this->request->method(),
                    'path' => $this->request->path(),
                    'host_header' => (string) $this->request->server('HTTP_HOST', ''),
                    'effective_host' => $this->request->host(),
                    'server_name' => (string) $this->request->server('SERVER_NAME', ''),
                    'ip' => $this->request->clientIp(),
                    'user_agent' => (string) $this->request->header('User-Agent', ''),
                ],
                $context
            )
        );

        if ($this->requestExpectsJson()) {
            $this->response->json(
                [
                    'success' => false,
                    'code' => 'host_header_rejected',
                    'error' => 'Host invalido para esta aplicacao.',
                ],
                400
            );
            return false;
        }

        $this->response->text('Host invalido para esta aplicacao.', 400);
        return false;
    }

    private function hostFromConfiguredAppUrl(): string
    {
        $appUrl = trim((string) $this->config('app_url', ''));
        if ($appUrl === '') {
            return '';
        }

        $parts = parse_url($appUrl);
        if (!is_array($parts) || !isset($parts['host'])) {
            return '';
        }

        return $this->normalizeComparableHost((string) $parts['host']);
    }

    private function normalizeComparableHost(string $value): string
    {
        $value = trim(strtolower($value));
        if ($value === '') {
            return '';
        }

        if (preg_match('/[\s\/\\\\]/', $value) === 1) {
            return '';
        }

        $source = str_starts_with($value, 'http://') || str_starts_with($value, 'https://')
            ? $value
            : 'http://' . $value;
        $parts = parse_url($source);
        if (!is_array($parts) || !isset($parts['host'])) {
            return '';
        }

        if (isset($parts['user']) || isset($parts['pass']) || isset($parts['query']) || isset($parts['fragment'])) {
            return '';
        }

        $host = strtolower(trim((string) $parts['host'], '.'));
        if ($host === '') {
            return '';
        }

        if ($host === 'localhost') {
            return $host;
        }

        if (filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6) !== false) {
            return $host;
        }

        if (filter_var($host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME) !== false) {
            return $host;
        }

        return '';
    }

    /**
     * @param array<string, mixed> $config
     * @return array<int, string>
     */
    private function configuredTrustedProxies(array $config): array
    {
        $configured = $config['security']['trusted_proxies'] ?? ($config['trusted_proxies'] ?? []);

        if (is_string($configured)) {
            $parts = array_map('trim', explode(',', $configured));
            return array_values(array_filter($parts, static fn (string $value): bool => $value !== ''));
        }

        if (!is_array($configured)) {
            return [];
        }

        $proxies = [];
        foreach ($configured as $value) {
            if (is_scalar($value) || (is_object($value) && method_exists($value, '__toString'))) {
                $normalized = trim((string) $value);
                if ($normalized !== '') {
                    $proxies[] = $normalized;
                }
            }
        }

        return $proxies;
    }
}
