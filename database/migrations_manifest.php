<?php

declare(strict_types=1);

return [
    [
        'id' => '20260505_0001_workflow_client_admin',
        'name' => 'Workflow base cliente/admin',
        'script' => 'database/upgrade_workflow_client_admin.php',
        'rollback_strategy' => 'snapshot',
        'rollback_script' => 'database/rollback/20260505_0001_workflow_client_admin.php',
        'rollback_requires_snapshot' => true,
    ],
    [
        'id' => '20260505_0002_tax_features',
        'name' => 'Recursos fiscais e central de tributos',
        'script' => 'database/upgrade_tax_features.php',
        'rollback_strategy' => 'snapshot',
        'rollback_script' => 'database/rollback/20260505_0002_tax_features.php',
        'rollback_requires_snapshot' => true,
    ],
    [
        'id' => '20260505_0003_admin_permissions',
        'name' => 'Niveis e permissoes de usuarios administrativos',
        'script' => 'database/upgrade_admin_permissions.php',
        'rollback_strategy' => 'snapshot',
        'rollback_script' => 'database/rollback/20260505_0003_admin_permissions.php',
        'rollback_requires_snapshot' => true,
    ],
    [
        'id' => '20260505_0004_communications_security',
        'name' => 'Comunicacao por email e recuperacao de senha',
        'script' => 'database/upgrade_communications_security.php',
        'rollback_strategy' => 'destructive',
        'rollback_script' => 'database/rollback/20260505_0004_communications_security.php',
        'rollback_requires_snapshot' => false,
    ],
    [
        'id' => '20260505_0005_brand_manual_mvp',
        'name' => 'Persistencia do Manual da Marca (MVP)',
        'script' => 'database/upgrade_brand_manual_mvp.php',
        'rollback_strategy' => 'destructive',
        'rollback_script' => 'database/rollback/20260505_0005_brand_manual_mvp.php',
        'rollback_requires_snapshot' => false,
    ],
    [
        'id' => '20260506_0006_release_version_format',
        'name' => 'Normalizacao de release_version para formato dd/mm/aaaa',
        'script' => 'database/upgrade_release_version_format.php',
        'rollback_strategy' => 'snapshot',
        'rollback_script' => 'database/rollback/20260506_0006_release_version_format.php',
        'rollback_requires_snapshot' => true,
    ],
];
