<?php
if (!defined('APP_NAME')) {
    die('Acesso direto não permitido');
}
?>
<!DOCTYPE html>
<html lang="<?php echo $_SESSION['lang'] ?? 'pt-BR'; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?php echo $lang['app_subtitle']; ?>">
    <meta name="keywords" content="remover fundo, background remover, edição de imagem">
    <title><?php echo $lang['app_title']; ?> - <?php echo APP_NAME; ?></title>
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/style.css">
</head>
<body>