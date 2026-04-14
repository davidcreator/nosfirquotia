<?php

declare(strict_types=1);

$currentScript = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? '/index.php'));
$frontController = preg_replace('#/install/index\.php$#', '/index.php', $currentScript);

if (is_string($frontController) && $frontController !== '') {
    $_SERVER['SCRIPT_NAME'] = $frontController;
}

$_GET['route'] = '/install';
$_SERVER['QUERY_STRING'] = http_build_query($_GET);

$basePath = str_replace('\\', '/', dirname((string) $_SERVER['SCRIPT_NAME']));
if ($basePath === '.' || $basePath === '/') {
    $basePath = '';
}

$_SERVER['REQUEST_URI'] = ($basePath !== '' ? $basePath : '') . '/index.php?' . $_SERVER['QUERY_STRING'];

require dirname(__DIR__) . '/index.php';
