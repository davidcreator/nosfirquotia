<?php
/**
 * Remove o fundo de uma imagem usando transparência
 */
function removeBackground($sourcePath, $outputPath, $tolerance = 10, $bgColorHex = null) {
    $imageInfo = @getimagesize($sourcePath);
    $mime = $imageInfo['mime'];
    
    // Criar imagem a partir do arquivo
    $source = safeImageCreateFromFile($sourcePath, $mime);
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
 * Carrega imagem suprimindo warnings de perfil ICC e chunks PNG inconsistentes.
 */
function safeImageCreateFromFile($path, $mime) {
    switch ($mime) {
        case 'image/jpeg':
            return @imagecreatefromjpeg($path);
        case 'image/png':
            return @imagecreatefrompng($path);
        case 'image/webp':
            if (function_exists('imagecreatefromwebp')) {
                return @imagecreatefromwebp($path);
            }
            return false;
        default:
            return false;
    }
}

/**
 * Otimiza imagem com resize e qualidade/formato
 */
function optimizeImage($inputPath, $outputPath, $format = 'png', $quality = 80, $maxWidth = null) {
    $info = @getimagesize($inputPath);
    if (!$info) return false;

    // Carregar de acordo com tipo
    $img = safeImageCreateFromFile($inputPath, $info['mime']);
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

        // Em baixa saturação (tons cinza/branco), hue deixa de ser confiável.
        $satAvg = ($hsv1['s'] + $hsv2['s']) / 2.0;
        $hueWeight = ($satAvg < 0.20) ? (0.12 + ($satAvg / 0.20) * 0.25) : 1.65;
        $satWeight = 1.20;
        $valWeight = 0.95;
        $weightSum = $hueWeight + $satWeight + $valWeight;
        $score = (($dh * $hueWeight) + ($ds * $satWeight) + ($dv * $valWeight)) / $weightSum;
        return (int) round(max(0, min(255, $score * 255)));
    }

    $dist = abs($rgb['red'] - $bg['red']) + abs($rgb['green'] - $bg['green']) + abs($rgb['blue'] - $bg['blue']);
    return (int) round(($dist / 765.0) * 255.0);
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

function sampleBackgroundPalette($source, $maxColors = 6, $sampleBudget = 340) {
    $w = imagesx($source);
    $h = imagesy($source);
    $trueColor = imageistruecolor($source);
    $hist = [];
    $perimeter = max(1, 2 * ($w + $h));
    $step = max(1, (int) floor($perimeter / max(60, $sampleBudget)));
    $rings = max(1, min(4, (int) round(min($w, $h) / 220)));
    $quant = 24;

    $addSample = function($x, $y, $edgeBit) use ($source, $trueColor, $quant, &$hist) {
        $ci = imagecolorat($source, $x, $y);
        if ($trueColor) {
            $rgb = [
                'red' => ($ci >> 16) & 0xFF,
                'green' => ($ci >> 8) & 0xFF,
                'blue' => $ci & 0xFF
            ];
        } else {
            $rgb = imagecolorsforindex($source, $ci);
        }
        $rb = (int) floor($rgb['red'] / $quant);
        $gb = (int) floor($rgb['green'] / $quant);
        $bb = (int) floor($rgb['blue'] / $quant);
        $key = $rb . '_' . $gb . '_' . $bb;
        if (!isset($hist[$key])) {
            $hist[$key] = ['count' => 0, 'r' => 0, 'g' => 0, 'b' => 0, 'edges' => 0];
        }
        $hist[$key]['count']++;
        $hist[$key]['r'] += $rgb['red'];
        $hist[$key]['g'] += $rgb['green'];
        $hist[$key]['b'] += $rgb['blue'];
        $hist[$key]['edges'] = $hist[$key]['edges'] | $edgeBit;
    };

    for ($ring = 0; $ring < $rings; $ring++) {
        $x0 = $ring;
        $y0 = $ring;
        $x1 = $w - 1 - $ring;
        $y1 = $h - 1 - $ring;
        if ($x0 >= $x1 || $y0 >= $y1) {
            break;
        }
        for ($x = $x0; $x <= $x1; $x += $step) {
            $addSample($x, $y0, 1); // top
            $addSample($x, $y1, 2); // bottom
        }
        for ($y = $y0; $y <= $y1; $y += $step) {
            $addSample($x0, $y, 4); // left
            $addSample($x1, $y, 8); // right
        }
    }

    if (empty($hist)) {
        return [sampleBackgroundColor($source)];
    }

    uasort($hist, function($a, $b) {
        return $b['count'] <=> $a['count'];
    });

    $primary = [];
    $secondary = [];
    foreach ($hist as $entry) {
        $edgeMask = $entry['edges'];
        $edgeCount = 0;
        if (($edgeMask & 1) !== 0) $edgeCount++;
        if (($edgeMask & 2) !== 0) $edgeCount++;
        if (($edgeMask & 4) !== 0) $edgeCount++;
        if (($edgeMask & 8) !== 0) $edgeCount++;
        if ($edgeCount >= 2) {
            $primary[] = $entry;
        } else {
            $secondary[] = $entry;
        }
    }

    $palette = [];
    $pickColor = function($entry) use (&$palette) {
        $count = max(1, $entry['count']);
        $palette[] = [
            'red' => (int) round($entry['r'] / $count),
            'green' => (int) round($entry['g'] / $count),
            'blue' => (int) round($entry['b'] / $count),
        ];
    };

    foreach ($primary as $entry) {
        $pickColor($entry);
        if (count($palette) >= $maxColors) {
            break;
        }
    }
    if (count($palette) === 0) {
        foreach ($secondary as $entry) {
            $pickColor($entry);
            if (count($palette) >= $maxColors) {
                break;
            }
        }
    }

    if (empty($palette)) {
        $palette[] = sampleBackgroundColor($source);
    }
    return $palette;
}

function minPaletteDistance($rgb, $palette, $mode) {
    $min = 255;
    foreach ($palette as $bg) {
        $d = colorDistance($rgb, $bg, $mode);
        if ($d < $min) {
            $min = $d;
            if ($min <= 0) {
                break;
            }
        }
    }
    return $min;
}

function percentileFromSorted($sortedValues, $percentile) {
    $n = count($sortedValues);
    if ($n === 0) {
        return 0;
    }
    $p = max(0.0, min(1.0, (float) $percentile));
    $idx = (int) floor(($n - 1) * $p);
    return $sortedValues[$idx];
}

function sampleBorderDistances($source, $palette, $mode, $sampleBudget = 360) {
    $w = imagesx($source);
    $h = imagesy($source);
    $trueColor = imageistruecolor($source);
    $distances = [];
    $perimeter = max(1, 2 * ($w + $h));
    $step = max(1, (int) floor($perimeter / max(80, $sampleBudget)));

    $add = function($x, $y) use ($source, $trueColor, $palette, $mode, &$distances) {
        $ci = imagecolorat($source, $x, $y);
        if ($trueColor) {
            $rgb = [
                'red' => ($ci >> 16) & 0xFF,
                'green' => ($ci >> 8) & 0xFF,
                'blue' => $ci & 0xFF
            ];
        } else {
            $rgb = imagecolorsforindex($source, $ci);
        }
        $distances[] = minPaletteDistance($rgb, $palette, $mode);
    };

    for ($x = 0; $x < $w; $x += $step) {
        $add($x, 0);
        $add($x, $h - 1);
    }
    for ($y = 0; $y < $h; $y += $step) {
        $add(0, $y);
        $add($w - 1, $y);
    }

    if (empty($distances)) {
        $distances[] = 0;
    }
    sort($distances);
    return $distances;
}

function resolveRemovalMode($requestedMode, $palette) {
    $mode = strtolower((string) $requestedMode);
    if ($mode === 'rgb' || $mode === 'hsv') {
        return $mode;
    }
    if (empty($palette)) {
        return 'rgb';
    }
    $satMean = 0.0;
    foreach ($palette as $c) {
        $hsv = rgbToHsv($c['red'], $c['green'], $c['blue']);
        $satMean += $hsv['s'];
    }
    $satMean /= max(1, count($palette));
    return ($satMean < 0.20) ? 'rgb' : 'hsv';
}

function computeDistanceThresholds($borderDistances, $tolerance) {
    sort($borderDistances);
    $p35 = percentileFromSorted($borderDistances, 0.35);
    $p55 = percentileFromSorted($borderDistances, 0.55);
    $p70 = percentileFromSorted($borderDistances, 0.70);
    $p88 = percentileFromSorted($borderDistances, 0.88);
    $userTol = max(5, min(70, (int) $tolerance));
    $base = (int) round(($p35 * 0.25) + ($p55 * 0.50) + ($p70 * 0.25));
    $spread = max(0, $p88 - $p35);
    $adaptive = min(24, (int) round($spread * 0.18));

    $tLow = max(8, min(170, $base + (int) round($userTol * 0.95) + $adaptive));
    $transition = max(26, (int) round(30 + ($userTol * 1.50) + ($spread * 0.08)));
    $tHigh = min(245, $tLow + $transition);

    $seed = max(6, min(165, (int) round($p35 + ($userTol * 0.30))));
    $expand = max($seed + 4, min(220, $tLow + (int) round($transition * 0.35)));

    return [
        'tLow' => $tLow,
        'tHigh' => $tHigh,
        'seed' => $seed,
        'expand' => $expand
    ];
}

function createMaskImage($width, $height) {
    $mask = imagecreatetruecolor($width, $height);
    imagesavealpha($mask, false);
    imagealphablending($mask, false);
    imagefilledrectangle($mask, 0, 0, $width, $height, 0x000000);
    return $mask;
}

function blurMaskApprox($mask, $radius) {
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
    return $blur;
}

function featherMaskSelective($mask, $radius) {
    $radius = max(0, (int) $radius);
    if ($radius <= 0) {
        return $mask;
    }
    $w = imagesx($mask);
    $h = imagesy($mask);
    $blur = blurMaskApprox($mask, $radius);
    $mixStrength = min(1.0, $radius / 4.0);
    $blended = imagecreatetruecolor($w, $h);
    imagesavealpha($blended, false);
    imagealphablending($blended, false);

    for ($y = 0; $y < $h; $y++) {
        for ($x = 0; $x < $w; $x++) {
            $origGray = (imagecolorat($mask, $x, $y) >> 16) & 0xFF;
            $blurGray = (imagecolorat($blur, $x, $y) >> 16) & 0xFF;
            $edgeMix = 1.0 - (abs($origGray - 128) / 128.0);
            $edgeMix = pow(max(0.0, min(1.0, $edgeMix)), 1.35) * $mixStrength;
            $g = (int) round(($origGray * (1.0 - $edgeMix)) + ($blurGray * $edgeMix));
            $g = max(0, min(255, $g));
            $gc = ($g << 16) | ($g << 8) | $g;
            imagesetpixel($blended, $x, $y, $gc);
        }
    }

    imagedestroy($blur);
    imagedestroy($mask);
    return $blended;
}

function applyMaskLowCut($mask, $lowCut) {
    $lowCut = max(0, min(220, (int) $lowCut));
    if ($lowCut <= 0) {
        return $mask;
    }
    $w = imagesx($mask);
    $h = imagesy($mask);
    $scale = 255.0 / max(1.0, (255.0 - $lowCut));
    for ($y = 0; $y < $h; $y++) {
        for ($x = 0; $x < $w; $x++) {
            $g = (imagecolorat($mask, $x, $y) >> 16) & 0xFF;
            if ($g <= $lowCut) {
                $out = 0;
            } else {
                $out = (int) round(($g - $lowCut) * $scale);
                $out = max(0, min(255, $out));
            }
            $gc = ($out << 16) | ($out << 8) | $out;
            imagesetpixel($mask, $x, $y, $gc);
        }
    }
    return $mask;
}

function morphMask($mask, $operation = 'erode', $iterations = 1) {
    $iterations = max(0, min(5, (int) $iterations));
    if ($iterations <= 0) {
        return $mask;
    }
    $w = imagesx($mask);
    $h = imagesy($mask);
    $isDilate = ($operation === 'dilate');

    for ($iter = 0; $iter < $iterations; $iter++) {
        $next = imagecreatetruecolor($w, $h);
        imagesavealpha($next, false);
        imagealphablending($next, false);
        for ($y = 0; $y < $h; $y++) {
            $y0 = max(0, $y - 1);
            $y1 = min($h - 1, $y + 1);
            for ($x = 0; $x < $w; $x++) {
                $x0 = max(0, $x - 1);
                $x1 = min($w - 1, $x + 1);
                $best = $isDilate ? 0 : 255;
                for ($ny = $y0; $ny <= $y1; $ny++) {
                    for ($nx = $x0; $nx <= $x1; $nx++) {
                        $g = (imagecolorat($mask, $nx, $ny) >> 16) & 0xFF;
                        if ($isDilate) {
                            if ($g > $best) {
                                $best = $g;
                            }
                        } else {
                            if ($g < $best) {
                                $best = $g;
                            }
                        }
                    }
                }
                $gc = ($best << 16) | ($best << 8) | $best;
                imagesetpixel($next, $x, $y, $gc);
            }
        }
        imagedestroy($mask);
        $mask = $next;
    }

    return $mask;
}

function trimMaskEdges($mask, $amount) {
    $amount = max(0, min(30, (int) $amount));
    if ($amount <= 0) {
        return $mask;
    }
    $w = imagesx($mask);
    $h = imagesy($mask);
    $baseShift = $amount * 3.0;

    for ($y = 0; $y < $h; $y++) {
        for ($x = 0; $x < $w; $x++) {
            $g = (imagecolorat($mask, $x, $y) >> 16) & 0xFF;
            if ($g <= 0 || $g >= 255) {
                continue;
            }
            $edgeFactor = 1.0 - (abs($g - 128.0) / 128.0); // 0 em extremos, 1 no meio
            $delta = $baseShift * (0.65 + ($edgeFactor * 0.95));
            $out = (int) round($g - $delta);
            $out = max(0, min(255, $out));
            $gc = ($out << 16) | ($out << 8) | $out;
            imagesetpixel($mask, $x, $y, $gc);
        }
    }

    return $mask;
}

function floodFillBorderBackground($distanceMask, $seedThreshold, $expandThreshold, $jumpLimit = 24) {
    $w = imagesx($distanceMask);
    $h = imagesy($distanceMask);
    $visited = imagecreatetruecolor($w, $h);
    imagesavealpha($visited, false);
    imagealphablending($visited, false);
    imagefilledrectangle($visited, 0, 0, $w, $h, 0x000000);
    $white = 0xFFFFFF;
    $queue = new SplQueue();

    $trySeed = function($x, $y) use ($distanceMask, $visited, $white, $seedThreshold, $queue, $w, $h) {
        if (($x < 0) || ($y < 0) || ($x >= $w) || ($y >= $h)) {
            return;
        }
        if (((imagecolorat($visited, $x, $y) >> 16) & 0xFF) !== 0) {
            return;
        }
        $dist = (imagecolorat($distanceMask, $x, $y) >> 16) & 0xFF;
        if ($dist <= $seedThreshold) {
            imagesetpixel($visited, $x, $y, $white);
            $queue->enqueue([$x, $y]);
        }
    };

    for ($x = 0; $x < $w; $x++) {
        $trySeed($x, 0);
        $trySeed($x, $h - 1);
    }
    for ($y = 0; $y < $h; $y++) {
        $trySeed(0, $y);
        $trySeed($w - 1, $y);
    }

    while (!$queue->isEmpty()) {
        $node = $queue->dequeue();
        $x = $node[0];
        $y = $node[1];
        $currentDist = (imagecolorat($distanceMask, $x, $y) >> 16) & 0xFF;
        $neighbors = [
            [$x - 1, $y],
            [$x + 1, $y],
            [$x, $y - 1],
            [$x, $y + 1],
        ];
        foreach ($neighbors as $n) {
            $nx = $n[0];
            $ny = $n[1];
            if (($nx < 0) || ($ny < 0) || ($nx >= $w) || ($ny >= $h)) {
                continue;
            }
            if (((imagecolorat($visited, $nx, $ny) >> 16) & 0xFF) !== 0) {
                continue;
            }
            $dist = (imagecolorat($distanceMask, $nx, $ny) >> 16) & 0xFF;
            if ($dist <= $expandThreshold && abs($dist - $currentDist) <= $jumpLimit) {
                imagesetpixel($visited, $nx, $ny, $white);
                $queue->enqueue([$nx, $ny]);
            }
        }
    }

    return $visited;
}

function getBgRemovePresetOptions($presetKey) {
    static $presets = null;
    if ($presets === null) {
        $presets = [
            'auto' => [
                'mode' => 'auto',
                'feather' => 1,
                'autoBg' => true,
                'noiseClean' => 45,
                'fillHoles' => 35,
                'edgeTrim' => 5,
            ],
            'portrait' => [
                'mode' => 'auto',
                'feather' => 2,
                'autoBg' => true,
                'noiseClean' => 35,
                'fillHoles' => 50,
                'edgeTrim' => 3,
            ],
            'product' => [
                'mode' => 'rgb',
                'feather' => 1,
                'autoBg' => true,
                'noiseClean' => 65,
                'fillHoles' => 30,
                'edgeTrim' => 8,
            ],
            'logo' => [
                'mode' => 'rgb',
                'feather' => 0,
                'autoBg' => false,
                'noiseClean' => 80,
                'fillHoles' => 20,
                'edgeTrim' => 10,
            ],
            'soft' => [
                'mode' => 'auto',
                'feather' => 3,
                'autoBg' => true,
                'noiseClean' => 25,
                'fillHoles' => 55,
                'edgeTrim' => 2,
            ],
        ];
    }
    $key = strtolower((string) $presetKey);
    return isset($presets[$key]) ? $presets[$key] : null;
}

function analyzePresetSignals($source) {
    $w = imagesx($source);
    $h = imagesy($source);
    if ($w <= 0 || $h <= 0) {
        return [
            'satMean' => 0.0,
            'valMean' => 0.0,
            'grayRatio' => 1.0,
            'edgeDensity' => 0.0,
            'uniqueBins' => 0,
            'borderUniformity' => 0.0,
        ];
    }

    $maxSample = 180;
    $scale = min(1.0, $maxSample / max($w, $h));
    $sw = max(1, (int) round($w * $scale));
    $sh = max(1, (int) round($h * $scale));
    $work = imagecreatetruecolor($sw, $sh);
    imagecopyresampled($work, $source, 0, 0, 0, 0, $sw, $sh, $w, $h);

    $step = 2;
    $samples = 0;
    $satSum = 0.0;
    $valSum = 0.0;
    $grayCount = 0;
    $edgeCount = 0;
    $edgeSamples = 0;
    $bins = [];
    $q = 32;
    $trueColor = imageistruecolor($work);

    for ($y = 0; $y < $sh; $y += $step) {
        for ($x = 0; $x < $sw; $x += $step) {
            $ci = imagecolorat($work, $x, $y);
            if ($trueColor) {
                $r = ($ci >> 16) & 0xFF;
                $g = ($ci >> 8) & 0xFF;
                $b = $ci & 0xFF;
            } else {
                $rgb = imagecolorsforindex($work, $ci);
                $r = $rgb['red'];
                $g = $rgb['green'];
                $b = $rgb['blue'];
            }

            $hsv = rgbToHsv($r, $g, $b);
            $satSum += $hsv['s'];
            $valSum += $hsv['v'];
            if ($hsv['s'] < 0.14) {
                $grayCount++;
            }
            $samples++;

            $key = ((int) floor($r / $q)) . '_' . ((int) floor($g / $q)) . '_' . ((int) floor($b / $q));
            $bins[$key] = 1;

            if (($x + $step) < $sw) {
                $c2 = imagecolorat($work, $x + $step, $y);
                if ($trueColor) {
                    $r2 = ($c2 >> 16) & 0xFF;
                    $g2 = ($c2 >> 8) & 0xFF;
                    $b2 = $c2 & 0xFF;
                } else {
                    $rgb2 = imagecolorsforindex($work, $c2);
                    $r2 = $rgb2['red'];
                    $g2 = $rgb2['green'];
                    $b2 = $rgb2['blue'];
                }
                $d = abs($r - $r2) + abs($g - $g2) + abs($b - $b2);
                if ($d > 95) {
                    $edgeCount++;
                }
                $edgeSamples++;
            }
            if (($y + $step) < $sh) {
                $c3 = imagecolorat($work, $x, $y + $step);
                if ($trueColor) {
                    $r3 = ($c3 >> 16) & 0xFF;
                    $g3 = ($c3 >> 8) & 0xFF;
                    $b3 = $c3 & 0xFF;
                } else {
                    $rgb3 = imagecolorsforindex($work, $c3);
                    $r3 = $rgb3['red'];
                    $g3 = $rgb3['green'];
                    $b3 = $rgb3['blue'];
                }
                $d2 = abs($r - $r3) + abs($g - $g3) + abs($b - $b3);
                if ($d2 > 95) {
                    $edgeCount++;
                }
                $edgeSamples++;
            }
        }
    }

    $border = sampleBackgroundColor($work);
    $borderDistSum = 0.0;
    $borderDistCount = 0;
    $bw = $sw - 1;
    $bh = $sh - 1;
    $bStep = max(1, (int) floor(max($sw, $sh) / 30));
    for ($x = 0; $x <= $bw; $x += $bStep) {
        $top = imagecolorat($work, $x, 0);
        $bottom = imagecolorat($work, $x, $bh);
        $trgb = ['red' => ($top >> 16) & 0xFF, 'green' => ($top >> 8) & 0xFF, 'blue' => $top & 0xFF];
        $brgb = ['red' => ($bottom >> 16) & 0xFF, 'green' => ($bottom >> 8) & 0xFF, 'blue' => $bottom & 0xFF];
        $borderDistSum += colorDistance($trgb, $border, 'rgb');
        $borderDistSum += colorDistance($brgb, $border, 'rgb');
        $borderDistCount += 2;
    }
    for ($y = 0; $y <= $bh; $y += $bStep) {
        $left = imagecolorat($work, 0, $y);
        $right = imagecolorat($work, $bw, $y);
        $lrgb = ['red' => ($left >> 16) & 0xFF, 'green' => ($left >> 8) & 0xFF, 'blue' => $left & 0xFF];
        $rrgb = ['red' => ($right >> 16) & 0xFF, 'green' => ($right >> 8) & 0xFF, 'blue' => $right & 0xFF];
        $borderDistSum += colorDistance($lrgb, $border, 'rgb');
        $borderDistSum += colorDistance($rrgb, $border, 'rgb');
        $borderDistCount += 2;
    }

    imagedestroy($work);

    $sampleDiv = max(1, $samples);
    $edgeDiv = max(1, $edgeSamples);
    $borderDiv = max(1, $borderDistCount);
    $borderAvgDist = $borderDistSum / $borderDiv;
    $uniformity = 1.0 - max(0.0, min(1.0, $borderAvgDist / 255.0));

    return [
        'satMean' => $satSum / $sampleDiv,
        'valMean' => $valSum / $sampleDiv,
        'grayRatio' => $grayCount / $sampleDiv,
        'edgeDensity' => $edgeCount / $edgeDiv,
        'uniqueBins' => count($bins),
        'borderUniformity' => $uniformity,
    ];
}

function smartClamp01($value) {
    return max(0.0, min(1.0, (float) $value));
}

function smartSigmoidScore($value, $center, $slope = 10.0) {
    $x = ((float) $value - (float) $center) * (float) $slope;
    return smartClamp01(1.0 / (1.0 + exp(-$x)));
}

function smartBellScore($value, $center, $radius) {
    $radius = max(0.0001, (float) $radius);
    $distance = abs((float) $value - (float) $center) / $radius;
    return smartClamp01(exp(-($distance * $distance)));
}

function chooseSmartPresetKey($source) {
    $signals = analyzePresetSignals($source);
    $sat = (float) $signals['satMean'];
    $val = (float) $signals['valMean'];
    $gray = (float) $signals['grayRatio'];
    $edge = (float) $signals['edgeDensity'];
    $uniformity = (float) $signals['borderUniformity'];
    $uniqueNorm = smartClamp01(((float) $signals['uniqueBins']) / 140.0);

    $scores = [];
    $scores['logo'] = (
        smartSigmoidScore($gray, 0.42, 10.0) * 0.28 +
        smartSigmoidScore($edge, 0.15, 12.0) * 0.28 +
        (1.0 - smartSigmoidScore($uniqueNorm, 0.30, 10.0)) * 0.26 +
        (1.0 - smartSigmoidScore($sat, 0.30, 8.0)) * 0.18
    );
    $scores['product'] = (
        smartSigmoidScore($uniformity, 0.76, 12.0) * 0.34 +
        smartSigmoidScore($val, 0.56, 8.0) * 0.24 +
        (1.0 - smartSigmoidScore($edge, 0.24, 12.0)) * 0.20 +
        smartSigmoidScore($uniqueNorm, 0.24, 10.0) * 0.12 +
        (1.0 - smartSigmoidScore($gray, 0.84, 8.0)) * 0.10
    );
    $scores['portrait'] = (
        smartBellScore($sat, 0.30, 0.18) * 0.28 +
        smartBellScore($edge, 0.16, 0.10) * 0.24 +
        smartSigmoidScore($uniqueNorm, 0.32, 10.0) * 0.18 +
        (1.0 - smartSigmoidScore($uniformity, 0.90, 10.0)) * 0.16 +
        (1.0 - smartSigmoidScore($gray, 0.70, 10.0)) * 0.14
    );
    $scores['soft'] = (
        (1.0 - smartSigmoidScore($edge, 0.14, 12.0)) * 0.34 +
        (1.0 - smartSigmoidScore($sat, 0.24, 10.0)) * 0.26 +
        smartSigmoidScore($gray, 0.45, 8.0) * 0.20 +
        smartSigmoidScore($uniformity, 0.58, 8.0) * 0.20
    );

    $scores = array_map('smartClamp01', $scores);
    arsort($scores);
    $sortedKeys = array_keys($scores);
    $topKey = $sortedKeys[0];
    $topScore = (float) $scores[$topKey];
    $secondScore = isset($sortedKeys[1]) ? (float) $scores[$sortedKeys[1]] : 0.0;
    $confidence = smartClamp01($topScore - $secondScore);

    $chosen = $topKey;
    if ($topScore < 0.57 || $confidence < 0.08) {
        $chosen = 'auto';
    }

    $roundedScores = [];
    foreach ($scores as $k => $v) {
        $roundedScores[$k] = round((float) $v, 4);
    }

    return [
        'preset' => $chosen,
        'confidence' => round($confidence, 4),
        'topScore' => round($topScore, 4),
        'secondScore' => round($secondScore, 4),
        'signals' => [
            'satMean' => round($sat, 4),
            'valMean' => round($val, 4),
            'grayRatio' => round($gray, 4),
            'edgeDensity' => round($edge, 4),
            'uniqueBins' => (int) $signals['uniqueBins'],
            'uniqueNorm' => round($uniqueNorm, 4),
            'borderUniformity' => round($uniformity, 4),
        ],
        'scores' => $roundedScores,
    ];
}

function removeBackgroundAdvanced($sourcePath, $outputPath, $opts = [], &$meta = null) {
    $tolerance = isset($opts['tolerance']) ? (int) $opts['tolerance'] : 15;
    $bgColorHex = isset($opts['bgColorHex']) ? $opts['bgColorHex'] : null;
    $mode = isset($opts['mode']) ? strtolower($opts['mode']) : 'auto';
    $feather = isset($opts['feather']) ? (int) $opts['feather'] : 1;
    $autoBg = isset($opts['autoBg']) ? (bool) $opts['autoBg'] : true;
    $noiseClean = isset($opts['noiseClean']) ? (int) $opts['noiseClean'] : 45;
    $fillHoles = isset($opts['fillHoles']) ? (int) $opts['fillHoles'] : 35;
    $edgeTrim = isset($opts['edgeTrim']) ? (int) $opts['edgeTrim'] : 5;
    $presetRequested = isset($opts['presetKey']) ? strtolower((string) $opts['presetKey']) : 'custom';
    if ($presetRequested === '') {
        $presetRequested = 'custom';
    }
    $smartPreset = isset($opts['smartPreset']) ? (bool) $opts['smartPreset'] : false;
    $smartConfidence = null;
    $smartSignals = null;
    $smartScores = null;
    $presetApplied = ($presetRequested !== '') ? $presetRequested : 'custom';
    $presetSource = 'custom';
    $noiseClean = max(0, min(100, $noiseClean));
    $fillHoles = max(0, min(100, $fillHoles));
    $edgeTrim = max(0, min(20, $edgeTrim));

    if (function_exists('set_time_limit')) {
        @set_time_limit(120);
    }

    $info = @getimagesize($sourcePath);
    if (!$info || !isset($info['mime'])) {
        return false;
    }
    $mime = $info['mime'];
    $src = safeImageCreateFromFile($sourcePath, $mime);
    if (!$src) return false;
    $origW = imagesx($src);
    $origH = imagesy($src);
    $workSrc = $src;
    $workW = $origW;
    $workH = $origH;
    $ownsWorkSrc = false;
    $maxWorkDimension = isset($opts['maxWorkDimension']) ? (int) $opts['maxWorkDimension'] : 1200;
    $maxWorkDimension = max(700, min(2400, $maxWorkDimension));
    $currentMax = max($origW, $origH);
    if ($currentMax > $maxWorkDimension) {
        $scale = $maxWorkDimension / $currentMax;
        $workW = max(1, (int) round($origW * $scale));
        $workH = max(1, (int) round($origH * $scale));
        $resized = imagecreatetruecolor($workW, $workH);
        imagealphablending($resized, false);
        imagesavealpha($resized, true);
        imagecopyresampled($resized, $src, 0, 0, 0, 0, $workW, $workH, $origW, $origH);
        $workSrc = $resized;
        $ownsWorkSrc = true;
    }

    $manualPreset = getBgRemovePresetOptions($presetRequested);
    if (!$manualPreset && ($presetRequested !== 'custom')) {
        $presetApplied = 'custom';
    }
    if ($manualPreset && ($presetRequested !== 'custom')) {
        $mode = $manualPreset['mode'];
        $feather = (int) $manualPreset['feather'];
        $autoBg = (bool) $manualPreset['autoBg'];
        $noiseClean = (int) $manualPreset['noiseClean'];
        $fillHoles = (int) $manualPreset['fillHoles'];
        $edgeTrim = (int) $manualPreset['edgeTrim'];
        $presetApplied = $presetRequested;
        $presetSource = 'manual';
    }

    if ($smartPreset) {
        $smartDecision = chooseSmartPresetKey($workSrc);
        $smartKey = is_array($smartDecision) ? (string) ($smartDecision['preset'] ?? 'auto') : (string) $smartDecision;
        if (is_array($smartDecision)) {
            $smartConfidence = isset($smartDecision['confidence']) ? (float) $smartDecision['confidence'] : null;
            $smartSignals = isset($smartDecision['signals']) ? $smartDecision['signals'] : null;
            $smartScores = isset($smartDecision['scores']) ? $smartDecision['scores'] : null;
        }
        $smartPresetOpts = getBgRemovePresetOptions($smartKey);
        if ($smartPresetOpts) {
            $mode = $smartPresetOpts['mode'];
            $feather = (int) $smartPresetOpts['feather'];
            $autoBg = (bool) $smartPresetOpts['autoBg'];
            $noiseClean = (int) $smartPresetOpts['noiseClean'];
            $fillHoles = (int) $smartPresetOpts['fillHoles'];
            $edgeTrim = (int) $smartPresetOpts['edgeTrim'];
            $presetApplied = $smartKey;
            $presetSource = 'smart';
        }
    }

    $feather = max(0, min(8, (int) $feather));
    $noiseClean = max(0, min(100, (int) $noiseClean));
    $fillHoles = max(0, min(100, (int) $fillHoles));
    $edgeTrim = max(0, min(20, (int) $edgeTrim));

    $out = imagecreatetruecolor($workW, $workH);
    if (!$out) {
        if ($ownsWorkSrc) {
            imagedestroy($workSrc);
        }
        imagedestroy($src);
        return false;
    }
    imagesavealpha($out, true);
    $transparent = imagecolorallocatealpha($out, 0, 0, 0, 127);
    imagefill($out, 0, 0, $transparent);

    // Libera a imagem original quando houver imagem de trabalho reduzida.
    if ($ownsWorkSrc) {
        imagedestroy($src);
        $src = null;
    }

    $palette = [];
    if ($bgColorHex) {
        $palette[] = hexToRgb($bgColorHex);
    } else {
        if ($autoBg) {
            $palette = sampleBackgroundPalette($workSrc);
        } else {
            $cornerColor = imagecolorat($workSrc, 0, 0);
            if (imageistruecolor($workSrc)) {
                $palette[] = [
                    'red' => ($cornerColor >> 16) & 0xFF,
                    'green' => ($cornerColor >> 8) & 0xFF,
                    'blue' => $cornerColor & 0xFF
                ];
            } else {
                $palette[] = imagecolorsforindex($workSrc, $cornerColor);
            }
        }
    }
    if (empty($palette)) {
        $palette[] = sampleBackgroundColor($workSrc);
    }

    $effectiveMode = resolveRemovalMode($mode, $palette);
    $borderDistances = sampleBorderDistances($workSrc, $palette, $effectiveMode);
    $thresholds = computeDistanceThresholds($borderDistances, $tolerance);
    $tLow = $thresholds['tLow'];
    $tHigh = $thresholds['tHigh'];
    $seedThreshold = $thresholds['seed'];
    $expandThreshold = $thresholds['expand'];
    $workIsTrueColor = imageistruecolor($workSrc);

    $distanceMask = createMaskImage($workW, $workH);
    for ($y = 0; $y < $workH; $y++) {
        for ($x = 0; $x < $workW; $x++) {
            $ci = imagecolorat($workSrc, $x, $y);
            if ($workIsTrueColor) {
                $rgb = [
                    'red' => ($ci >> 16) & 0xFF,
                    'green' => ($ci >> 8) & 0xFF,
                    'blue' => $ci & 0xFF
                ];
            } else {
                $rgb = imagecolorsforindex($workSrc, $ci);
            }
            $d = minPaletteDistance($rgb, $palette, $effectiveMode);
            $d = max(0, min(255, (int) $d));
            $dc = ($d << 16) | ($d << 8) | $d;
            imagesetpixel($distanceMask, $x, $y, $dc);
        }
    }

    $bgConnectedMask = floodFillBorderBackground($distanceMask, $seedThreshold, $expandThreshold);
    $mask = createMaskImage($workW, $workH);

    for ($y = 0; $y < $workH; $y++) {
        for ($x = 0; $x < $workW; $x++) {
            $d = (imagecolorat($distanceMask, $x, $y) >> 16) & 0xFF;
            $isBgConnected = ((imagecolorat($bgConnectedMask, $x, $y) >> 16) & 0xFF) > 0;

            if ($d <= $tLow) {
                $conf = 0.0;
            } elseif ($d >= $tHigh) {
                $conf = 255.0;
            } else {
                $conf = (($d - $tLow) / max(1.0, ($tHigh - $tLow))) * 255.0;
            }

            if ($isBgConnected) {
                $conf *= 0.25;
            } else {
                $conf = $conf + ((255.0 - $conf) * 0.30);
                if ($d < $tLow) {
                    $boost = 170.0 + ((1.0 - ($d / max(1.0, $tLow))) * 70.0);
                    $conf = max($conf, $boost);
                }
            }

            $g = (int) round(max(0.0, min(255.0, $conf)));
            $gc = ($g << 16) | ($g << 8) | $g;
            imagesetpixel($mask, $x, $y, $gc);
        }
    }

    imagedestroy($distanceMask);
    imagedestroy($bgConnectedMask);

    if ($noiseClean > 0) {
        $lowCut = (int) round($noiseClean * 1.10);
        $mask = applyMaskLowCut($mask, $lowCut);
        $openIterations = 0;
        if ($noiseClean >= 80) {
            $openIterations = 2;
        } elseif ($noiseClean >= 45) {
            $openIterations = 1;
        }
        if ($openIterations > 0) {
            $mask = morphMask($mask, 'erode', $openIterations);
            $mask = morphMask($mask, 'dilate', $openIterations);
        }
    }

    if ($fillHoles > 0) {
        $closeIterations = (int) floor($fillHoles / 35);
        $closeIterations = max(0, min(2, $closeIterations));
        if ($closeIterations > 0) {
            $mask = morphMask($mask, 'dilate', $closeIterations);
            $mask = morphMask($mask, 'erode', $closeIterations);
        }
    }

    $maskFeathered = featherMaskSelective($mask, $feather);
    if ($edgeTrim > 0) {
        $maskFeathered = trimMaskEdges($maskFeathered, $edgeTrim);
    }

    for ($y = 0; $y < $workH; $y++) {
        for ($x = 0; $x < $workW; $x++) {
            $ci = imagecolorat($workSrc, $x, $y);
            if ($workIsTrueColor) {
                $r = ($ci >> 16) & 0xFF;
                $g = ($ci >> 8) & 0xFF;
                $b = $ci & 0xFF;
            } else {
                $rgb = imagecolorsforindex($workSrc, $ci);
                $r = $rgb['red'];
                $g = $rgb['green'];
                $b = $rgb['blue'];
            }
            $maskGray = (imagecolorat($maskFeathered, $x, $y) >> 16) & 0xFF;
            $alpha = (int) max(0, min(127, round(127 * (1.0 - ($maskGray / 255.0)))));
            $col = (($alpha & 0x7F) << 24) | (($r & 0xFF) << 16) | (($g & 0xFF) << 8) | ($b & 0xFF);
            imagesetpixel($out, $x, $y, $col);
        }
    }

    imagepng($out, $outputPath, 9);
    if ($ownsWorkSrc) {
        imagedestroy($workSrc);
    }
    if ($src) {
        imagedestroy($src);
    }
    imagedestroy($out);
    imagedestroy($maskFeathered);
    $meta = [
        'presetRequested' => $presetRequested,
        'presetApplied' => $presetApplied,
        'presetSource' => $presetSource,
        'smartPresetUsed' => (bool) $smartPreset,
        'smartConfidence' => $smartConfidence,
        'smartSignals' => $smartSignals,
        'smartScores' => $smartScores,
    ];
    return true;
}
?>
