<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/config.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

const BRIDGE_SESSION_KEY = 'mockup_upload_bridge_v1';
const BRIDGE_MAX_FILE_SIZE = 41943040; // 40 MB

$action = strtolower((string) ($_GET['action'] ?? ''));
$baseDir = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'tmp' . DIRECTORY_SEPARATOR . 'mockups-bridge';

switch ($action) {
    case 'store':
        handleStore($baseDir);
        break;
    case 'read':
        handleRead($baseDir);
        break;
    case 'stream':
        handleStream($baseDir);
        break;
    case 'clear':
        handleClear($baseDir);
        break;
    default:
        respond(400, [
            'ok' => false,
            'error' => 'invalid_action',
        ]);
}

function handleStore(string $baseDir): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        respond(405, [
            'ok' => false,
            'error' => 'method_not_allowed',
        ]);
    }

    if (!isset($_FILES['artwork']) || !is_array($_FILES['artwork'])) {
        respond(400, [
            'ok' => false,
            'error' => 'missing_file',
        ]);
    }

    $file = $_FILES['artwork'];
    $error = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($error !== UPLOAD_ERR_OK) {
        respond(400, [
            'ok' => false,
            'error' => 'upload_error',
        ]);
    }

    $tmpName = (string) ($file['tmp_name'] ?? '');
    $size = (int) ($file['size'] ?? 0);
    $originalName = sanitizeFileName((string) ($file['name'] ?? 'artwork.png'));
    if ($tmpName === '' || !is_uploaded_file($tmpName) || $size <= 0) {
        respond(400, [
            'ok' => false,
            'error' => 'invalid_file',
        ]);
    }

    if ($size > BRIDGE_MAX_FILE_SIZE) {
        respond(413, [
            'ok' => false,
            'error' => 'file_too_large',
        ]);
    }

    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $allowed = ['png', 'jpg', 'jpeg', 'svg'];
    if (!in_array($extension, $allowed, true)) {
        respond(415, [
            'ok' => false,
            'error' => 'invalid_extension',
        ]);
    }

    $resolvedMime = resolveMimeType($tmpName, $extension);
    if ($resolvedMime === null) {
        respond(415, [
            'ok' => false,
            'error' => 'invalid_mime',
        ]);
    }

    $sessionId = session_id();
    if ($sessionId === '') {
        respond(500, [
            'ok' => false,
            'error' => 'missing_session',
        ]);
    }

    $sessionDir = $baseDir . DIRECTORY_SEPARATOR . $sessionId;
    if (!is_dir($sessionDir) && !mkdir($sessionDir, 0775, true) && !is_dir($sessionDir)) {
        respond(500, [
            'ok' => false,
            'error' => 'cannot_create_dir',
        ]);
    }

    removeExistingBridgeFile($baseDir);

    $storedPath = $sessionDir . DIRECTORY_SEPARATOR . 'latest.' . $extension;
    if (!move_uploaded_file($tmpName, $storedPath)) {
        respond(500, [
            'ok' => false,
            'error' => 'cannot_move_file',
        ]);
    }

    $_SESSION[BRIDGE_SESSION_KEY] = [
        'path' => $storedPath,
        'name' => $originalName,
        'type' => $resolvedMime,
        'last_modified' => (int) floor(microtime(true) * 1000),
    ];

    respond(200, [
        'ok' => true,
    ]);
}

function handleRead(string $baseDir): void
{
    $entry = getBridgeEntry($baseDir);
    if ($entry === null) {
        respond(200, [
            'ok' => false,
            'error' => 'not_found',
        ]);
    }

    respond(200, [
        'ok' => true,
        'name' => $entry['name'],
        'type' => $entry['type'],
        'lastModified' => $entry['last_modified'],
        'streamUrl' => './upload-bridge.php?action=stream&ts=' . $entry['last_modified'],
    ]);
}

function handleStream(string $baseDir): void
{
    $entry = getBridgeEntry($baseDir);
    if ($entry === null) {
        respond(404, [
            'ok' => false,
            'error' => 'not_found',
        ]);
    }

    $path = (string) $entry['path'];
    if (!is_file($path)) {
        respond(404, [
            'ok' => false,
            'error' => 'file_missing',
        ]);
    }

    header('Content-Type: ' . (string) $entry['type']);
    header('Content-Length: ' . (string) filesize($path));
    header('Content-Disposition: inline; filename="' . addslashes((string) $entry['name']) . '"');
    readfile($path);
    exit;
}

function handleClear(string $baseDir): void
{
    removeExistingBridgeFile($baseDir);
    respond(200, [
        'ok' => true,
    ]);
}

function getBridgeEntry(string $baseDir): ?array
{
    $entry = $_SESSION[BRIDGE_SESSION_KEY] ?? null;
    if (!is_array($entry)) {
        return null;
    }

    $path = (string) ($entry['path'] ?? '');
    if ($path === '' || !is_file($path)) {
        unset($_SESSION[BRIDGE_SESSION_KEY]);
        return null;
    }

    $realBase = realpath($baseDir);
    $realPath = realpath($path);
    if ($realBase === false || $realPath === false || strpos($realPath, $realBase) !== 0) {
        unset($_SESSION[BRIDGE_SESSION_KEY]);
        return null;
    }

    return [
        'path' => $realPath,
        'name' => sanitizeFileName((string) ($entry['name'] ?? basename($realPath))),
        'type' => (string) ($entry['type'] ?? 'image/png'),
        'last_modified' => (int) ($entry['last_modified'] ?? (int) floor(microtime(true) * 1000)),
    ];
}

function removeExistingBridgeFile(string $baseDir): void
{
    $entry = $_SESSION[BRIDGE_SESSION_KEY] ?? null;
    if (is_array($entry)) {
        $path = (string) ($entry['path'] ?? '');
        if ($path !== '' && is_file($path)) {
            @unlink($path);
        }
    }

    unset($_SESSION[BRIDGE_SESSION_KEY]);

    $sessionId = session_id();
    if ($sessionId === '') {
        return;
    }

    $sessionDir = $baseDir . DIRECTORY_SEPARATOR . $sessionId;
    if (!is_dir($sessionDir)) {
        return;
    }

    $files = glob($sessionDir . DIRECTORY_SEPARATOR . '*') ?: [];
    foreach ($files as $file) {
        if (is_file($file)) {
            @unlink($file);
        }
    }
}

function sanitizeFileName(string $name): string
{
    $clean = preg_replace('/[^a-zA-Z0-9._-]+/', '-', $name);
    $clean = trim((string) $clean, '-');
    if ($clean === '') {
        return 'artwork.png';
    }
    return substr($clean, 0, 120);
}

function resolveMimeType(string $tmpName, string $extension): ?string
{
    $mime = '';
    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo !== false) {
            $detected = finfo_file($finfo, $tmpName);
            finfo_close($finfo);
            $mime = is_string($detected) ? strtolower(trim($detected)) : '';
        }
    }

    $validByExt = [
        'png' => ['image/png'],
        'jpg' => ['image/jpeg'],
        'jpeg' => ['image/jpeg'],
        'svg' => ['image/svg+xml', 'text/plain', 'application/octet-stream'],
    ];

    $allowed = $validByExt[$extension] ?? [];
    if ($mime !== '' && in_array($mime, $allowed, true)) {
        return $extension === 'svg' ? 'image/svg+xml' : $mime;
    }

    if ($extension === 'svg') {
        return 'image/svg+xml';
    }
    if ($extension === 'png') {
        return 'image/png';
    }
    if ($extension === 'jpg' || $extension === 'jpeg') {
        return 'image/jpeg';
    }

    return null;
}

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
