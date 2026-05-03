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
$mode = isset($_POST['mode']) ? strtolower($_POST['mode']) : 'auto';
$feather = isset($_POST['feather']) ? intval($_POST['feather']) : 1;
$autoBg = isset($_POST['autoBg']) ? (($_POST['autoBg'] === '1') || ($_POST['autoBg'] === 'true')) : true;
$noiseClean = isset($_POST['noiseClean']) ? intval($_POST['noiseClean']) : 45;
$fillHoles = isset($_POST['fillHoles']) ? intval($_POST['fillHoles']) : 35;
$edgeTrim = isset($_POST['edgeTrim']) ? intval($_POST['edgeTrim']) : 5;
$presetKey = isset($_POST['presetKey']) ? strtolower(trim((string) $_POST['presetKey'])) : 'custom';
$smartPreset = isset($_POST['smartPreset']) ? (($_POST['smartPreset'] === '1') || ($_POST['smartPreset'] === 'true')) : false;

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

$scriptName = str_replace('\\', '/', (string) ($_SERVER['SCRIPT_NAME'] ?? ''));
$scriptDir = rtrim(str_replace('\\', '/', dirname($scriptName)), '/');
if ($scriptDir === '.' || $scriptDir === '/') {
    $scriptDir = '';
}
$originalWebPath = ($scriptDir !== '' ? $scriptDir . '/' : '/') . 'uploads/' . rawurlencode($uploadFilename);
$processedWebPath = ($scriptDir !== '' ? $scriptDir . '/' : '/') . 'processed/' . rawurlencode($processedFilename);

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
        'noiseClean' => $noiseClean,
        'fillHoles' => $fillHoles,
        'edgeTrim' => $edgeTrim,
        'presetKey' => $presetKey,
        'smartPreset' => $smartPreset,
    ];
    $meta = [];
    $result = removeBackgroundAdvanced($uploadPath, $processedPath, $advOpts, $meta);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => $lang['process_success'],
            'original' => $originalWebPath,
            'processed' => $processedWebPath,
            'meta' => $meta,
        ]);
    } else {
        // Fallback para método anterior, caso haja falha
        $fallback = removeBackground($uploadPath, $processedPath, $tolerance, $bgcolor);
        if ($fallback) {
            $fallbackMeta = [
                'presetRequested' => $presetKey,
                'presetApplied' => 'custom',
                'presetSource' => 'fallback',
                'smartPresetUsed' => false,
            ];
            echo json_encode([
                'success' => true,
                'message' => $lang['process_success'],
                'original' => $originalWebPath,
                'processed' => $processedWebPath,
                'meta' => $fallbackMeta,
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => $lang['process_error']]);
        }
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $lang['process_error']]);
}
?>
