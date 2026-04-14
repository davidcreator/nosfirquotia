<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método inválido']);
    exit;
}

$file = isset($_POST['file']) ? basename($_POST['file']) : null;
$format = isset($_POST['format']) ? strtolower($_POST['format']) : 'png';
$quality = isset($_POST['quality']) ? intval($_POST['quality']) : 80;
$maxWidth = isset($_POST['maxWidth']) ? intval($_POST['maxWidth']) : null;

if (!$file) {
    echo json_encode(['success' => false, 'message' => 'Arquivo não especificado']);
    exit;
}

$inputPath = PROCESSED_DIR . $file;
if (!file_exists($inputPath)) {
    echo json_encode(['success' => false, 'message' => 'Arquivo não encontrado']);
    exit;
}

// Gerar nome de saída
$ext = $format === 'jpeg' ? 'jpg' : $format;
$outputName = preg_replace('/\.[a-zA-Z0-9]+$/', '', $file) . '_opt.' . $ext;
$outputPath = PROCESSED_DIR . $outputName;

try {
    $ok = optimizeImage($inputPath, $outputPath, $format, $quality, $maxWidth);
    if ($ok) {
        echo json_encode([
            'success' => true,
            'optimized' => 'processed/' . $outputName
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Falha ao otimizar imagem']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro ao otimizar imagem']);
}

?>