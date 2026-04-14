<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$scriptName = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? ''));
$marker = '/admin/tools';
$position = strpos($scriptName, $marker);
$basePath = $position !== false ? substr($scriptName, 0, $position) : '';
$target = ($basePath !== '' ? $basePath : '') . '/admin/ferramentas';

header('Location: ' . $target, true, 302);
exit;
