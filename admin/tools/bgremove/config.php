<?php
require_once dirname(__DIR__) . '/bootstrap.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Configurações do sistema
define('APP_NAME', 'Background Remover');
define('APP_VERSION', '1.0.0');
define('BASE_URL', 'http://localhost/bg-remover/');

// Configurações de upload
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/jpg']);
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png']);

// Diretórios
define('UPLOAD_DIR', __DIR__ . '/uploads/');
define('PROCESSED_DIR', __DIR__ . '/processed/');

// Criar diretórios se não existirem
if (!file_exists(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}
if (!file_exists(PROCESSED_DIR)) {
    mkdir(PROCESSED_DIR, 0755, true);
}

// Idioma com mapeamento e fallback
// Aceita códigos curtos (pt, en, es) e regionais (pt-BR, en-US, es-ES)
$currentLang = $_SESSION['lang'] ?? 'pt-BR';
$langMap = [
    'pt' => 'pt-BR',
    'pt_br' => 'pt-BR',
    'pt-BR' => 'pt-BR',
    'en' => 'en-US',
    'en_us' => 'en-US',
    'en-US' => 'en-US',
    'es' => 'es-ES',
    'es_es' => 'es-ES',
    'es-ES' => 'es-ES',
];
$normalizedKey = strtolower(str_replace('-', '_', $currentLang));
$resolvedLang = $langMap[$normalizedKey] ?? $currentLang;
$langFile = __DIR__ . '/language/' . $resolvedLang . '.php';
if (!file_exists($langFile)) {
    // Fallback para inglês caso o arquivo não exista
    $langFile = __DIR__ . '/language/en-US.php';
    $_SESSION['lang'] = 'en-US';
} else {
    $_SESSION['lang'] = $resolvedLang;
}
require_once $langFile;

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Funções auxiliares
require_once __DIR__ . '/includes/functions.php';
?>
