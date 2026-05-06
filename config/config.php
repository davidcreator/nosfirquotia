<?php

declare(strict_types=1);

return array (
  'name' => 'Nosfir Quotia',
  'timezone' => 'America/Sao_Paulo',
  'app_url' => 'http://127.0.0.1',
  'security' => 
  array (
    'trusted_hosts' => 
    array (
      0 => '127.0.0.1',
      1 => 'localhost',
    ),
    'trusted_proxies' => 
    array (
    ),
    'monitoring' => 
    array (
      'window_hours' => 24,
      'bucket_minutes' => 60,
      'thresholds' => 
      array (
        'csrf_rejected' => 10,
        'host_header_rejected' => 3,
        'admin_login_blocked' => 3,
        'client_login_blocked' => 3,
      ),
    ),
  ),
  'environment' => 'local',
  'environments' => 
  array (
    'online' => 
    array (
      'app_url' => 'https://quotia.seudominio.com.br',
      'security' => 
      array (
        'trusted_hosts' => 
        array (
          0 => 'quotia.seudominio.com.br',
          1 => 'www.quotia.seudominio.com.br',
        ),
        'trusted_proxies' => 
        array (
          0 => '10.0.0.0/8',
        ),
      ),
      'installed' => true,
      'db' => 
      array (
        'driver' => 'mysql',
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'nosfirquotia',
        'username' => 'quotia_app',
        'password' => '__ALTERAR_EM_PRODUCAO__',
        'charset' => 'utf8mb4',
      ),
      'mail' => 
      array (
        'enabled' => true,
        'from_name' => 'Nosfir Quotia',
        'from_email' => 'no-reply@quotia.seudominio.com.br',
      ),
    ),
    'local' => 
    array (
      'app_url' => 'http://127.0.0.1',
      'security' => 
      array (
        'trusted_hosts' => 
        array (
          0 => '127.0.0.1',
          1 => 'localhost',
        ),
      ),
      'installed' => true,
      'db' => 
      array (
        'driver' => 'mysql',
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'nosfirquotia',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4',
      ),
      'mail' => 
      array (
        'enabled' => true,
        'from_name' => 'Nosfir Quotia',
        'from_email' => 'no-reply@localhost',
      ),
    ),
  ),
);
