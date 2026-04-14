<?php
require_once dirname(__DIR__, 2) . '/bootstrap.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

// Obter idioma do navegador
$accept_language = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'en';
$language_priority = substr($accept_language, 0, 2);

// Mapear países para idiomas
$country_to_language = [
    'pt' => 'pt', // Português
    'es' => 'es', // Espanhol
    'en' => 'en', // Inglês
];

// Definir idioma automaticamente
if (!isset($_SESSION['lang'])) {
    $_SESSION['lang'] = $country_to_language[$language_priority] ?? 'en';
}

// Permitir alteração manual via parâmetro na URL
if (isset($_GET['lang'])) {
    $_SESSION['lang'] = $_GET['lang'];
}

// Definir o idioma final
$lang = $_SESSION['lang'];
$lang_file = __DIR__ . '/../languages/' . $lang . '.php';

// Carregar arquivo de tradução
if (file_exists($lang_file)) {
    $lang_data = include($lang_file);
} else {
    $lang_data = include(__DIR__ . '/../languages/en.php'); // Default: Inglês
}
