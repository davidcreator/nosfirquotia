<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$path = parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH) ?: '/';
$file = $root . DIRECTORY_SEPARATOR . ltrim($path, '/');

// Mantem base canonica dos testes HTTP desacoplada do app_url de producao.
if (getenv('NQ_TEST_KEEP_APP_URL') !== '1') {
    putenv('NQ_APP_URL=http://127.0.0.1');
    $_ENV['NQ_APP_URL'] = 'http://127.0.0.1';
    $_SERVER['NQ_APP_URL'] = 'http://127.0.0.1';
}

if (getenv('NQ_TEST_KEEP_DB_OVERRIDES') !== '1') {
    putenv('NQ_DB_HOST=localhost');
    putenv('NQ_DB_PORT=3306');
    putenv('NQ_DB_DATABASE=nosfirquotia');
    putenv('NQ_DB_USERNAME=root');
    putenv('NQ_DB_PASSWORD=');
    $_ENV['NQ_DB_HOST'] = 'localhost';
    $_ENV['NQ_DB_PORT'] = '3306';
    $_ENV['NQ_DB_DATABASE'] = 'nosfirquotia';
    $_ENV['NQ_DB_USERNAME'] = 'root';
    $_ENV['NQ_DB_PASSWORD'] = '';
    $_SERVER['NQ_DB_HOST'] = 'localhost';
    $_SERVER['NQ_DB_PORT'] = '3306';
    $_SERVER['NQ_DB_DATABASE'] = 'nosfirquotia';
    $_SERVER['NQ_DB_USERNAME'] = 'root';
    $_SERVER['NQ_DB_PASSWORD'] = '';
}

if ($path !== '/' && is_file($file)) {
    return false;
}

$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = $root . '/index.php';

require $root . '/index.php';
