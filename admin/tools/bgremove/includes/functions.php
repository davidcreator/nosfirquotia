<?php
/**
 * Remove o fundo de uma imagem usando transparência
 */
function removeBackground($sourcePath, $outputPath, $tolerance = 10, $bgColorHex = null) {
    $imageInfo = getimagesize($sourcePath);
    $mime = $imageInfo['mime'];
    
    // Criar imagem a partir do arquivo
    switch ($mime) {
        case 'image/jpeg':
            $source = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $source = imagecreatefrompng($sourcePath);
            break;
        default:
            return false;
    }
    
    if (!$source) return false;
    
    $width = imagesx($source);
    $height = imagesy($source);
    
    // Criar imagem com transparência
    $output = imagecreatetruecolor($width, $height);
    imagesavealpha($output, true);
    $transparent = imagecolorallocatealpha($output, 0, 0, 0, 127);
    imagefill($output, 0, 0, $transparent);
    
    // Pegar cor de fundo
    if ($bgColorHex) {
        $bgRGB = hexToRgb($bgColorHex);
    } else {
        $bgColor = imagecolorat($source, 0, 0);
        $bgRGB = imagecolorsforindex($source, $bgColor);
    }
    
    // Processar cada pixel
    for ($y = 0; $y < $height; $y++) {
        for ($x = 0; $x < $width; $x++) {
            $color = imagecolorat($source, $x, $y);
            $rgb = imagecolorsforindex($source, $color);
            
            // Calcular diferença de cor
            $diff = abs($rgb['red'] - $bgRGB['red']) + 
                    abs($rgb['green'] - $bgRGB['green']) + 
                    abs($rgb['blue'] - $bgRGB['blue']);
            
            // Se a cor for diferente do fundo, manter pixel
            if ($diff > $tolerance) {
                imagesetpixel($output, $x, $y, imagecolorallocate(
                    $output, $rgb['red'], $rgb['green'], $rgb['blue']
                ));
            }
        }
    }
    
    // Salvar como PNG com transparência
    imagepng($output, $outputPath, 9);
    
    imagedestroy($source);
    imagedestroy($output);
    
    return true;
}

/**
 * Converte hex (#rrggbb) para array RGB
 */
function hexToRgb($hex) {
    $hex = ltrim($hex, '#');
    if (strlen($hex) === 3) {
        $r = hexdec(str_repeat($hex[0], 2));
        $g = hexdec(str_repeat($hex[1], 2));
        $b = hexdec(str_repeat($hex[2], 2));
    } else {
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
    }
    return ['red' => $r, 'green' => $g, 'blue' => $b];
}

/**
 * Otimiza imagem com resize e qualidade/formato
 */
function optimizeImage($inputPath, $outputPath, $format = 'png', $quality = 80, $maxWidth = null) {
    $info = getimagesize($inputPath);
    if (!$info) return false;

    // Carregar de acordo com tipo
    switch ($info['mime']) {
        case 'image/png':
            $img = imagecreatefrompng($inputPath);
            break;
        case 'image/jpeg':
            $img = imagecreatefromjpeg($inputPath);
            break;
        case 'image/webp':
            if (function_exists('imagecreatefromwebp')) {
                $img = imagecreatefromwebp($inputPath);
            } else {
                return false;
            }
            break;
        default:
            return false;
    }

    if (!$img) return false;

    $w = imagesx($img);
    $h = imagesy($img);

    // Resize proporcional se maxWidth for definido e menor que largura
    if ($maxWidth && $maxWidth > 0 && $w > $maxWidth) {
        $ratio = $h / $w;
        $newW = $maxWidth;
        $newH = (int) round($newW * $ratio);
        $resized = imagecreatetruecolor($newW, $newH);
        // Preservar transparência
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled($resized, $img, 0, 0, 0, 0, $newW, $newH, $w, $h);
        imagedestroy($img);
        $img = $resized;
        $w = $newW; $h = $newH;
    }

    // Salvar no formato desejado
    $ok = false;
    switch (strtolower($format)) {
        case 'png':
            imagesavealpha($img, true);
            $compression = max(0, min(9, (int) round((100 - $quality) / 100 * 9)));
            $ok = imagepng($img, $outputPath, $compression);
            break;
        case 'jpeg':
        case 'jpg':
            // Fundo branco para JPEG (sem transparência)
            $bg = imagecreatetruecolor($w, $h);
            $white = imagecolorallocate($bg, 255, 255, 255);
            imagefilledrectangle($bg, 0, 0, $w, $h, $white);
            imagecopy($bg, $img, 0, 0, 0, 0, $w, $h);
            $ok = imagejpeg($bg, $outputPath, max(0, min(100, $quality)));
            imagedestroy($bg);
            break;
        case 'webp':
            if (function_exists('imagewebp')) {
                // Preservar transparência
                imagesavealpha($img, true);
                $ok = imagewebp($img, $outputPath, max(0, min(100, $quality)));
            } else {
                $ok = false;
            }
            break;
        default:
            $ok = false;
    }

    imagedestroy($img);
    return $ok;
}

/**
 * Valida arquivo de upload
 */
function validateUpload($file) {
    global $lang;
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'message' => $lang['upload_error']];
    }
    
    if ($file['size'] > MAX_FILE_SIZE) {
        return ['success' => false, 'message' => $lang['file_too_large']];
    }
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, ALLOWED_TYPES)) {
        return ['success' => false, 'message' => $lang['invalid_file_type']];
    }
    
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($extension, ALLOWED_EXTENSIONS)) {
        return ['success' => false, 'message' => $lang['invalid_extension']];
    }
    
    return ['success' => true];
}

/**
 * Gera nome único para arquivo
 */
function generateUniqueFilename($extension) {
    return uniqid('img_', true) . '_' . time() . '.' . $extension;
}

/**
 * Limpa arquivos antigos (mais de 1 hora)
 */
function cleanOldFiles() {
    $directories = [UPLOAD_DIR, PROCESSED_DIR];
    $maxAge = 3600; // 1 hora
    
    foreach ($directories as $dir) {
        $files = glob($dir . '*');
        foreach ($files as $file) {
            if (is_file($file) && (time() - filemtime($file)) > $maxAge) {
                unlink($file);
            }
        }
    }
}

// ===== Recursos avançados de remoção =====

function rgbToHsv($r, $g, $b) {
    $r /= 255; $g /= 255; $b /= 255;
    $max = max($r, $g, $b);
    $min = min($r, $g, $b);
    $d = $max - $min;
    $h = 0;
    if ($d == 0) {
        $h = 0;
    } elseif ($max == $r) {
        $h = 60 * fmod((($g - $b) / $d), 6);
    } elseif ($max == $g) {
        $h = 60 * ((($b - $r) / $d) + 2);
    } else {
        $h = 60 * ((($r - $g) / $d) + 4);
    }
    if ($h < 0) $h += 360;
    $s = ($max == 0) ? 0 : $d / $max;
    $v = $max;
    return ['h' => $h, 's' => $s, 'v' => $v];
}

function colorDistance($rgb, $bg, $mode = 'rgb') {
    if ($mode === 'hsv') {
        $hsv1 = rgbToHsv($rgb['red'], $rgb['green'], $rgb['blue']);
        $hsv2 = rgbToHsv($bg['red'], $bg['green'], $bg['blue']);
        $dh = min(abs($hsv1['h'] - $hsv2['h']), 360 - abs($hsv1['h'] - $hsv2['h'])) / 180.0; // 0..1
        $ds = abs($hsv1['s'] - $hsv2['s']); // 0..1
        $dv = abs($hsv1['v'] - $hsv2['v']); // 0..1
        // Peso maior em hue, intermediário em s, menor em v
        return (int) round(($dh * 2 + $ds + $dv * 0.5) * 255); // 0..~637 aprox
    } else {
        return abs($rgb['red'] - $bg['red']) + abs($rgb['green'] - $bg['green']) + abs($rgb['blue'] - $bg['blue']);
    }
}

function sampleBackgroundColor($source) {
    $w = imagesx($source);
    $h = imagesy($source);
    $samples = [];
    $positions = [[0,0], [$w-1,0], [0,$h-1], [$w-1,$h-1]];
    $steps = 8;
    for ($i = 0; $i < $steps; $i++) {
        $x = (int) round($i / ($steps - 1) * ($w - 1));
        $positions[] = [$x, 0];
        $positions[] = [$x, $h - 1];
        $y = (int) round($i / ($steps - 1) * ($h - 1));
        $positions[] = [0, $y];
        $positions[] = [$w - 1, $y];
    }
    foreach ($positions as $pos) {
        $ci = imagecolorat($source, $pos[0], $pos[1]);
        $samples[] = imagecolorsforindex($source, $ci);
    }
    $reds = []; $greens = []; $blues = [];
    foreach ($samples as $s) { $reds[] = $s['red']; $greens[] = $s['green']; $blues[] = $s['blue']; }
    sort($reds); sort($greens); sort($blues);
    $n = count($samples);
    $trim = max(0, (int) floor($n * 0.1));
    $reds = array_slice($reds, $trim, $n - 2 * $trim);
    $greens = array_slice($greens, $trim, $n - 2 * $trim);
    $blues = array_slice($blues, $trim, $n - 2 * $trim);
    $avg = function($arr) { return (int) round(array_sum($arr) / max(1, count($arr))); };
    return ['red' => $avg($reds), 'green' => $avg($greens), 'blue' => $avg($blues)];
}

function createMaskImage($width, $height) {
    $mask = imagecreatetruecolor($width, $height);
    imagesavealpha($mask, false);
    imagealphablending($mask, false);
    $black = imagecolorallocate($mask, 0, 0, 0);
    imagefilledrectangle($mask, 0, 0, $width, $height, $black);
    return $mask;
}

function featherMask($mask, $radius) {
    $radius = max(0, (int) $radius);
    if ($radius <= 0) return $mask;
    $w = imagesx($mask);
    $h = imagesy($mask);
    $scale = max(1, $radius * 2);
    $smallW = max(1, (int) floor($w / $scale));
    $smallH = max(1, (int) floor($h / $scale));
    $small = imagecreatetruecolor($smallW, $smallH);
    imagecopyresampled($small, $mask, 0, 0, 0, 0, $smallW, $smallH, $w, $h);
    $blur = imagecreatetruecolor($w, $h);
    imagecopyresampled($blur, $small, 0, 0, 0, 0, $w, $h, $smallW, $smallH);
    imagedestroy($small);
    imagedestroy($mask);
    return $blur;
}

function removeBackgroundAdvanced($sourcePath, $outputPath, $opts = []) {
    $tolerance = isset($opts['tolerance']) ? (int) $opts['tolerance'] : 15;
    $bgColorHex = isset($opts['bgColorHex']) ? $opts['bgColorHex'] : null;
    $mode = isset($opts['mode']) ? strtolower($opts['mode']) : 'hsv';
    $feather = isset($opts['feather']) ? (int) $opts['feather'] : 2;
    $autoBg = isset($opts['autoBg']) ? (bool) $opts['autoBg'] : true;

    $info = getimagesize($sourcePath);
    $mime = $info['mime'];
    switch ($mime) {
        case 'image/jpeg':
            $src = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $src = imagecreatefrompng($sourcePath);
            break;
        default:
            return false;
    }
    if (!$src) return false;
    $w = imagesx($src);
    $h = imagesy($src);

    $out = imagecreatetruecolor($w, $h);
    imagesavealpha($out, true);
    $transparent = imagecolorallocatealpha($out, 0, 0, 0, 127);
    imagefill($out, 0, 0, $transparent);

    if ($bgColorHex) {
        $bgRGB = hexToRgb($bgColorHex);
    } else {
        $bgRGB = $autoBg ? sampleBackgroundColor($src) : imagecolorsforindex($src, imagecolorat($src, 0, 0));
    }

    $mask = createMaskImage($w, $h);
    $tLow = max(5, $tolerance);
    $tHigh = $tLow * 6;

    for ($y = 0; $y < $h; $y++) {
        for ($x = 0; $x < $w; $x++) {
            $ci = imagecolorat($src, $x, $y);
            $rgb = imagecolorsforindex($src, $ci);
            $diff = colorDistance($rgb, $bgRGB, $mode);
            if ($diff <= $tLow) {
                $maskVal = 0.0;
            } elseif ($diff >= $tHigh) {
                $maskVal = 1.0;
            } else {
                $maskVal = ($diff - $tLow) / ($tHigh - $tLow);
            }
            $g = (int) max(0, min(255, round($maskVal * 255)));
            $gc = imagecolorallocate($mask, $g, $g, $g);
            imagesetpixel($mask, $x, $y, $gc);
        }
    }

    $maskFeathered = featherMask($mask, $feather);

    for ($y = 0; $y < $h; $y++) {
        for ($x = 0; $x < $w; $x++) {
            $ci = imagecolorat($src, $x, $y);
            $rgb = imagecolorsforindex($src, $ci);
            $mcol = imagecolorat($maskFeathered, $x, $y);
            $mrgb = imagecolorsforindex($maskFeathered, $mcol);
            $maskVal = $mrgb['red'] / 255.0;
            $alpha = (int) max(0, min(127, round(127 * (1.0 - $maskVal))));
            $col = imagecolorallocatealpha($out, $rgb['red'], $rgb['green'], $rgb['blue'], $alpha);
            imagesetpixel($out, $x, $y, $col);
        }
    }

    imagepng($out, $outputPath, 9);
    imagedestroy($src);
    imagedestroy($out);
    imagedestroy($maskFeathered);
    return true;
}
?>
