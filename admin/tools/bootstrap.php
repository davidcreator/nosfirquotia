<?php

declare(strict_types=1);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

if (isset($_SESSION['admin_user']) && is_array($_SESSION['admin_user'])) {
    $adminUser = $_SESSION['admin_user'];
    $isGeneralAdmin = !empty($adminUser['is_general_admin']);
    $permissions = isset($adminUser['permissions']) && is_array($adminUser['permissions'])
        ? $adminUser['permissions']
        : [];

    if ($isGeneralAdmin || in_array('tools.view', $permissions, true)) {
        return;
    }

    $scriptName = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? ''));
    $marker = '/admin/tools/';
    $position = strpos($scriptName, $marker);
    $basePath = $position !== false ? substr($scriptName, 0, $position) : '';
    $fallbackPath = '/admin';
    if (in_array('dashboard.view', $permissions, true)) {
        $fallbackPath = '/admin/dashboard';
    } elseif (in_array('quotes.manage', $permissions, true)) {
        $fallbackPath = '/admin/orcamentos';
    } elseif (in_array('references.view', $permissions, true)) {
        $fallbackPath = '/admin/referencias';
    } elseif (in_array('taxes.manage', $permissions, true)) {
        $fallbackPath = '/admin/tributos';
    } elseif (in_array('categories.manage', $permissions, true)) {
        $fallbackPath = '/admin/categorias';
    }

    $dashboardPath = ($basePath !== '' ? $basePath : '') . $fallbackPath;

    header('Location: ' . $dashboardPath, true, 302);
    exit;
}

$scriptName = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? ''));
$marker = '/admin/tools/';
$position = strpos($scriptName, $marker);
$basePath = $position !== false ? substr($scriptName, 0, $position) : '';
$loginPath = ($basePath !== '' ? $basePath : '') . '/admin';

$accept = strtolower((string) ($_SERVER['HTTP_ACCEPT'] ?? ''));
$xrw = strtolower((string) ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? ''));
$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
$isJsonRequest = str_contains($accept, 'application/json') || $xrw === 'xmlhttprequest' || $method !== 'GET';

if ($isJsonRequest) {
    http_response_code(401);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(
        [
            'success' => false,
            'message' => 'Acesso negado. Faca login no painel admin.',
            'redirect' => $loginPath,
        ],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

header('Location: ' . $loginPath, true, 302);
exit;
