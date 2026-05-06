<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Engine;

final class Request
{
    private array $query;
    private array $body;
    private array $cookies;
    private array $server;
    private string $method;
    private string $path;
    private string $basePath;
    /**
     * @var array<int, string>
     */
    private array $trustedProxies;

    /**
     * @param array<int, string> $trustedProxies
     */
    public function __construct(
        array $query = [],
        array $body = [],
        array $server = [],
        array $cookies = [],
        array $trustedProxies = []
    )
    {
        $this->query = $query ?: $_GET;
        $this->body = $body ?: $_POST;
        $this->cookies = $cookies ?: $_COOKIE;
        $this->server = $server ?: $_SERVER;
        $this->trustedProxies = $this->normalizeTrustedProxies($trustedProxies);

        $this->method = $this->detectMethod();
        $this->basePath = $this->detectBasePath();
        $this->path = $this->detectPath();
    }

    public function method(): string
    {
        return $this->method;
    }

    public function path(): string
    {
        return $this->path;
    }

    public function basePath(): string
    {
        return $this->basePath;
    }

    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $this->query[$key] ?? $default;
    }

    public function post(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $default;
    }

    public function query(string $key, mixed $default = null): mixed
    {
        return $this->query[$key] ?? $default;
    }

    public function cookie(string $key, mixed $default = null): mixed
    {
        return $this->cookies[$key] ?? $default;
    }

    public function server(string $key, mixed $default = null): mixed
    {
        return $this->server[$key] ?? $default;
    }

    public function header(string $name, mixed $default = null): mixed
    {
        $normalized = strtoupper(str_replace('-', '_', trim($name)));
        if ($normalized === '') {
            return $default;
        }

        $candidates = [
            'HTTP_' . $normalized,
            $normalized,
        ];

        foreach ($candidates as $candidate) {
            if (array_key_exists($candidate, $this->server)) {
                return $this->server[$candidate];
            }
        }

        return $default;
    }

    public function isSecure(): bool
    {
        $forwardedProto = $this->forwardedProto();
        if ($forwardedProto !== '') {
            return $forwardedProto === 'https';
        }

        return $this->rawIsSecure();
    }

    public function scheme(): string
    {
        return $this->isSecure() ? 'https' : 'http';
    }

    public function host(): string
    {
        $forwardedHost = $this->forwardedHost();
        if ($forwardedHost !== '') {
            return $forwardedHost;
        }

        $serverName = $this->normalizeHostName((string) ($this->server['SERVER_NAME'] ?? ''));
        if ($serverName !== '') {
            $port = $this->normalizePort((string) ($this->server['SERVER_PORT'] ?? ''));
            if ($port !== null) {
                $defaultPort = $this->rawIsSecure() ? 443 : 80;
                if ($port !== $defaultPort) {
                    return $this->formatHostWithPort($serverName, $port);
                }
            }

            return $serverName;
        }

        $httpHost = $this->normalizeHostHeader((string) ($this->server['HTTP_HOST'] ?? ''));
        if ($httpHost !== '') {
            return $httpHost;
        }

        return 'localhost';
    }

    public function clientIp(): string
    {
        if ($this->isFromTrustedProxy()) {
            $forwardedFor = $this->forwardedHeaderParameter('for');
            if ($forwardedFor !== '') {
                $forwardedIp = $this->normalizeForwardedForToken($forwardedFor);
                if ($forwardedIp !== '') {
                    return $forwardedIp;
                }
            }

            $xForwardedFor = $this->firstHeaderListValue((string) $this->header('X-Forwarded-For', ''));
            if ($xForwardedFor !== '') {
                $forwardedIp = $this->normalizeForwardedForToken($xForwardedFor);
                if ($forwardedIp !== '') {
                    return $forwardedIp;
                }
            }
        }

        $remote = $this->normalizeIpLiteral((string) ($this->server['REMOTE_ADDR'] ?? ''));
        if ($remote !== '') {
            return $remote;
        }

        return 'ip-desconhecido';
    }

    public function all(): array
    {
        return array_merge($this->query, $this->body);
    }

    public function fullBaseUrl(): string
    {
        $scheme = $this->scheme();
        $host = $this->host();

        return $scheme . '://' . $host . ($this->basePath !== '/' ? $this->basePath : '');
    }

    private function normalizeHostHeader(string $rawHost): string
    {
        $rawHost = trim($rawHost);
        if ($rawHost === '') {
            return '';
        }

        if (preg_match('/[\s\/\\\\]/', $rawHost) === 1) {
            return '';
        }

        $parts = parse_url('http://' . $rawHost);
        if (!is_array($parts) || !isset($parts['host'])) {
            return '';
        }

        if (isset($parts['path']) && $parts['path'] !== '') {
            return '';
        }

        if (isset($parts['query']) || isset($parts['fragment']) || isset($parts['user']) || isset($parts['pass'])) {
            return '';
        }

        $host = $this->normalizeHostName((string) $parts['host']);
        if ($host === '') {
            return '';
        }

        if (isset($parts['port'])) {
            $port = (int) $parts['port'];
            if ($port < 1 || $port > 65535) {
                return '';
            }

            return $this->formatHostWithPort($host, $port);
        }

        return $host;
    }

    private function forwardedProto(): string
    {
        if (!$this->isFromTrustedProxy()) {
            return '';
        }

        $proto = strtolower(trim($this->forwardedHeaderParameter('proto')));
        if (in_array($proto, ['http', 'https'], true)) {
            return $proto;
        }

        $proto = strtolower(trim($this->firstHeaderListValue((string) $this->header('X-Forwarded-Proto', ''))));
        if (in_array($proto, ['http', 'https'], true)) {
            return $proto;
        }

        return '';
    }

    private function forwardedHost(): string
    {
        if (!$this->isFromTrustedProxy()) {
            return '';
        }

        $rawHost = $this->forwardedHeaderParameter('host');
        if ($rawHost === '') {
            $rawHost = $this->firstHeaderListValue((string) $this->header('X-Forwarded-Host', ''));
        }

        $host = $this->normalizeHostHeader($rawHost);
        if ($host === '') {
            return '';
        }

        if ($this->hostContainsPort($host)) {
            return $host;
        }

        $port = $this->forwardedPort();
        if ($port === null) {
            return $host;
        }

        $scheme = $this->forwardedProto();
        if ($scheme === '') {
            $scheme = $this->rawIsSecure() ? 'https' : 'http';
        }

        $defaultPort = $scheme === 'https' ? 443 : 80;
        if ($port === $defaultPort) {
            return $host;
        }

        return $this->formatHostWithPort($host, $port);
    }

    private function forwardedPort(): ?int
    {
        if (!$this->isFromTrustedProxy()) {
            return null;
        }

        $rawPort = $this->firstHeaderListValue((string) $this->header('X-Forwarded-Port', ''));
        return $this->normalizePort($rawPort);
    }

    private function normalizeHostName(string $host): string
    {
        $host = strtolower(trim($host));
        $host = trim($host, '.');
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

    private function normalizePort(string $rawPort): ?int
    {
        $rawPort = trim($rawPort);
        if ($rawPort === '' || !ctype_digit($rawPort)) {
            return null;
        }

        $port = (int) $rawPort;
        if ($port < 1 || $port > 65535) {
            return null;
        }

        return $port;
    }

    private function formatHostWithPort(string $host, int $port): string
    {
        if (str_contains($host, ':') && !str_starts_with($host, '[')) {
            return '[' . $host . ']:' . $port;
        }

        return $host . ':' . $port;
    }

    private function detectMethod(): string
    {
        $method = strtoupper((string) ($this->server['REQUEST_METHOD'] ?? 'GET'));

        if ($method === 'POST' && isset($this->body['_method'])) {
            $method = strtoupper((string) $this->body['_method']);
        }

        return $method;
    }

    private function rawIsSecure(): bool
    {
        return !empty($this->server['HTTPS']) && $this->server['HTTPS'] !== 'off';
    }

    private function isFromTrustedProxy(): bool
    {
        if ($this->trustedProxies === []) {
            return false;
        }

        $remoteIp = $this->normalizeIpLiteral((string) ($this->server['REMOTE_ADDR'] ?? ''));
        if ($remoteIp === '') {
            return false;
        }

        foreach ($this->trustedProxies as $trustedProxy) {
            if ($trustedProxy === '') {
                continue;
            }

            if (str_contains($trustedProxy, '/')) {
                if ($this->ipMatchesCidr($remoteIp, $trustedProxy)) {
                    return true;
                }
                continue;
            }

            if ($remoteIp === $trustedProxy) {
                return true;
            }
        }

        return false;
    }

    private function forwardedHeaderParameter(string $parameter): string
    {
        $raw = trim((string) $this->header('Forwarded', ''));
        if ($raw === '') {
            return '';
        }

        $first = trim(explode(',', $raw, 2)[0] ?? '');
        if ($first === '') {
            return '';
        }

        $segments = explode(';', $first);
        foreach ($segments as $segment) {
            $parts = explode('=', $segment, 2);
            if (count($parts) !== 2) {
                continue;
            }

            $key = strtolower(trim($parts[0]));
            if ($key !== strtolower(trim($parameter))) {
                continue;
            }

            return trim((string) $parts[1], " \t\n\r\0\x0B\"");
        }

        return '';
    }

    private function firstHeaderListValue(string $rawHeader): string
    {
        $rawHeader = trim($rawHeader);
        if ($rawHeader === '') {
            return '';
        }

        $first = explode(',', $rawHeader, 2)[0] ?? '';
        return trim($first);
    }

    private function normalizeForwardedForToken(string $rawToken): string
    {
        $token = trim($rawToken, " \t\n\r\0\x0B\"");
        if ($token === '' || strtolower($token) === 'unknown' || str_starts_with($token, '_')) {
            return '';
        }

        if (str_starts_with($token, '[')) {
            $closing = strpos($token, ']');
            if ($closing === false) {
                return '';
            }

            return $this->normalizeIpLiteral(substr($token, 1, $closing - 1));
        }

        if (preg_match('/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/', $token) === 1) {
            $token = (string) substr($token, 0, strrpos($token, ':'));
        }

        return $this->normalizeIpLiteral($token);
    }

    private function normalizeIpLiteral(string $ip): string
    {
        $ip = trim($ip, " \t\n\r\0\x0B[]");
        if ($ip === '') {
            return '';
        }

        return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6) !== false ? $ip : '';
    }

    /**
     * @param array<int, string> $trustedProxies
     * @return array<int, string>
     */
    private function normalizeTrustedProxies(array $trustedProxies): array
    {
        $normalized = [];

        foreach ($trustedProxies as $candidate) {
            $value = strtolower(trim((string) $candidate));
            if ($value === '') {
                continue;
            }

            if (str_contains($value, '/')) {
                [$networkRaw, $maskRaw] = explode('/', $value, 2);
                $network = $this->normalizeIpLiteral($networkRaw);
                $mask = trim($maskRaw);
                if ($network === '' || $mask === '' || !ctype_digit($mask)) {
                    continue;
                }

                $maskBits = (int) $mask;
                $maxBits = str_contains($network, ':') ? 128 : 32;
                if ($maskBits < 0 || $maskBits > $maxBits) {
                    continue;
                }

                $normalized[] = $network . '/' . $maskBits;
                continue;
            }

            $ip = $this->normalizeIpLiteral($value);
            if ($ip !== '') {
                $normalized[] = $ip;
            }
        }

        return array_values(array_unique($normalized));
    }

    private function ipMatchesCidr(string $ip, string $cidr): bool
    {
        if (!str_contains($cidr, '/')) {
            return $ip === $cidr;
        }

        [$networkRaw, $bitsRaw] = explode('/', $cidr, 2);
        $network = $this->normalizeIpLiteral($networkRaw);
        if ($network === '' || !ctype_digit($bitsRaw)) {
            return false;
        }

        $ipBinary = @inet_pton($ip);
        $networkBinary = @inet_pton($network);
        if (!is_string($ipBinary) || !is_string($networkBinary)) {
            return false;
        }

        if (strlen($ipBinary) !== strlen($networkBinary)) {
            return false;
        }

        $maxBits = strlen($networkBinary) * 8;
        $bits = (int) $bitsRaw;
        if ($bits < 0 || $bits > $maxBits) {
            return false;
        }

        $fullBytes = intdiv($bits, 8);
        $remainingBits = $bits % 8;

        if ($fullBytes > 0 && substr($ipBinary, 0, $fullBytes) !== substr($networkBinary, 0, $fullBytes)) {
            return false;
        }

        if ($remainingBits === 0) {
            return true;
        }

        $mask = (0xFF << (8 - $remainingBits)) & 0xFF;
        $ipByte = ord($ipBinary[$fullBytes]);
        $networkByte = ord($networkBinary[$fullBytes]);

        return ($ipByte & $mask) === ($networkByte & $mask);
    }

    private function hostContainsPort(string $host): bool
    {
        if (preg_match('/^\[[^\]]+\]:\d+$/', $host) === 1) {
            return true;
        }

        return preg_match('/^[^:]+:\d+$/', $host) === 1;
    }

    private function detectBasePath(): string
    {
        $scriptName = str_replace('\\', '/', (string) ($this->server['SCRIPT_NAME'] ?? ''));
        $dir = str_replace('\\', '/', dirname($scriptName));

        if ($dir === '.' || $dir === '/' || $dir === '\\') {
            return '';
        }

        return rtrim($dir, '/');
    }

    private function detectPath(): string
    {
        $queryRoute = $this->query['route'] ?? null;
        if (is_string($queryRoute) && trim($queryRoute) !== '') {
            return $this->normalizePath($queryRoute);
        }

        $uriPath = parse_url((string) ($this->server['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
        $path = $uriPath !== false && $uriPath !== null ? $uriPath : '/';

        if ($this->basePath !== '' && str_starts_with($path, $this->basePath)) {
            $path = substr($path, strlen($this->basePath));
        }

        if ($path === '/index.php') {
            $path = '/';
        } elseif (str_starts_with($path, '/index.php/')) {
            $path = substr($path, strlen('/index.php'));
        }

        return $this->normalizePath($path);
    }

    private function normalizePath(string $path): string
    {
        $normalized = '/' . ltrim($path, '/');
        $normalized = rtrim($normalized, '/');

        return $normalized === '' ? '/' : $normalized;
    }
}
