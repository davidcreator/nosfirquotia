<?php

declare(strict_types=1);

return array (
  'name' => 'Aurea Quotia',
  'timezone' => 'America/Sao_Paulo',
  'environment' => 'local',
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
        'database' => 'u163008030_quotia',
        'username' => 'u163008030_aureaquotia',
        'password' => 'kP7%Tn)+99r,Ktb',
        'charset' => 'utf8mb4',
      ),
      'mail' => 
      array (
        'enabled' => true,
        'from_name' => 'Aurea Quotia',
        'from_email' => 'no-reply@localhost',
      ),
    ),
    'local' => 
    array (
      'installed' => true,
      'db' => 
      array (
        'driver' => 'mysql',
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'aurea_quotia',
        'username' => 'root',
        'password' => '',
        'charset' => 'utf8mb4',
      ),
      'mail' => 
      array (
        'enabled' => true,
        'from_name' => 'Aurea Quotia',
        'from_email' => 'no-reply@localhost',
      ),
    ),
  ),
);
