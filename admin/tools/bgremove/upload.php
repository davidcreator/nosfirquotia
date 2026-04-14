<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método inválido']);
    exit;
}

if (!isset($_FILES['image'])) {
    echo json_encode(['success' => false, 'message' => $lang['upload_error']]);
    exit;
}

$file = $_FILES['image'];
$tolerance = isset($_POST['tolerance']) ? intval($_POST['tolerance']) : 15;
$bgcolor = isset($_POST['bgcolor']) && $_POST['bgcolor'] !== '' ? $_POST['bgcolor'] : null;
$mode = isset($_POST['mode']) ? strtolower($_POST['mode']) : 'hsv';
$feather = isset($_POST['feather']) ? intval($_POST['feather']) : 2;
$autoBg = isset($_POST['autoBg']) ? (($_POST['autoBg'] === '1') || ($_POST['autoBg'] === 'true')) : true;

// Validar upload
$validation = validateUpload($file);
if (!$validation['success']) {
    echo json_encode($validation);
    exit;
}

// Gerar nomes únicos
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$uploadFilename = generateUniqueFilename($extension);
$processedFilename = generateUniqueFilename('png');

$uploadPath = UPLOAD_DIR . $uploadFilename;
$processedPath = PROCESSED_DIR . $processedFilename;

// Mover arquivo enviado
if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
    echo json_encode(['success' => false, 'message' => $lang['upload_error']]);
    exit;
}

// Processar imagem
try {
    // Preferir método avançado com opções robustas
    $advOpts = [
        'tolerance' => $tolerance,
        'bgColorHex' => $bgcolor,
        'mode' => $mode,
        'feather' => $feather,
        'autoBg' => $autoBg,
    ];
    $result = removeBackgroundAdvanced($uploadPath, $processedPath, $advOpts);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => $lang['process_success'],
            'original' => 'uploads/' . $uploadFilename,
            'processed' => 'processed/' . $processedFilename
        ]);
    } else {
        // Fallback para método anterior, caso haja falha
        $fallback = removeBackground($uploadPath, $processedPath, $tolerance, $bgcolor);
        if ($fallback) {
            echo json_encode([
                'success' => true,
                'message' => $lang['process_success'],
                'original' => 'uploads/' . $uploadFilename,
                'processed' => 'processed/' . $processedFilename
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => $lang['process_error']]);
        }
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $lang['process_error']]);
}
?>
