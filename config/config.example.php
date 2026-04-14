<?php

declare(strict_types=1);

return [
    'name' => 'Nosfir Quotia',
    'timezone' => 'America/Sao_Paulo',

    // Troque entre 'local' e 'online'
    'environment' => 'local',

    'environments' => [
        'local' => [
            'installed' => false,
            'db' => [
                'driver' => 'mysql',
                'host' => '127.0.0.1',
                'port' => 3306,
                'database' => '',
                'username' => '',
                'password' => '',
                'charset' => 'utf8mb4',
            ],
            'mail' => [
                'enabled' => true,
                'from_name' => 'Nosfir Quotia',
                'from_email' => 'no-reply@localhost',
            ],
        ],
        'online' => [
            'installed' => false,
            'db' => [
                'driver' => 'mysql',
                'host' => 'localhost',
                'port' => 3306,
                'database' => '',
                'username' => '',
                'password' => '',
                'charset' => 'utf8mb4',
            ],
            'mail' => [
                'enabled' => true,
                'from_name' => 'Nosfir Quotia',
                'from_email' => 'no-reply@localhost',
            ],
        ],
    ],
];
