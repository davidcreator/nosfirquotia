<?php
require_once 'config.php';

if (!isset($_GET['file'])) {
    die('Arquivo não especificado');
}

$file = basename($_GET['file']);
$filePath = PROCESSED_DIR . $file;

if (!file_exists($filePath)) {
    die('Arquivo não encontrado');
}

header('Content-Type: image/png');
header('Content-Disposition: attachment; filename="sem-fundo-' . $file . '"');
header('Content-Length: ' . filesize($filePath));
readfile($filePath);
exit;
?>
