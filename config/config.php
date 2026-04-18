<?php

declare(strict_types=1);

return array (
  'name' => 'Nosfir Quotia',
  'timezone' => 'America/Sao_Paulo',
  'environment' => 'online',
  'environments' => 
  array (
    'online' => 
    array (
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
    'local' => 
    array (
      'installed' => true,
      'db' => 
      array (
        'driver' => 'mysql',
        'host' => '127.0.0.1',
        'port' => 3306,
        'database' => 'nosfir_quatia',
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
