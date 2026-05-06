<?php

declare(strict_types=1);

return [
    'name' => 'Nosfir Quotia',
    'timezone' => 'America/Sao_Paulo',
    // URL base canonica (recomendado em producao), exemplo:
    // 'https://quotia.seudominio.com.br' ou 'https://seudominio.com/app'
    'app_url' => '',
    'security' => [
        // Hosts permitidos (opcional). Se vazio, a aplicacao usa o host de app_url
        // como referencia minima para validacao de host confiavel.
        // Ex.: ['quotia.seudominio.com.br', 'www.quotia.seudominio.com.br']
        'trusted_hosts' => [],
        // Proxies reversos confiaveis (IP/CIDR) para habilitar leitura segura de
        // Forwarded / X-Forwarded-* sem risco de spoof por clientes externos.
        // Ex.: ['127.0.0.1', '10.0.0.0/8', '192.168.0.0/16']
        'trusted_proxies' => [],
        'monitoring' => [
            'window_hours' => 24,
            // Granularidade da serie temporal de eventos (em minutos).
            // Ex.: 15, 30, 60.
            'bucket_minutes' => 60,
            'thresholds' => [
                'csrf_rejected' => 10,
                'host_header_rejected' => 3,
                'admin_login_blocked' => 3,
                'client_login_blocked' => 3,
            ],
        ],
    ],

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
