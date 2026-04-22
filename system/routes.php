<?php

declare(strict_types=1);

use NosfirQuotia\Admin\Controller\AuthController as AdminAuthController;
use NosfirQuotia\Admin\Controller\CategoryController as AdminCategoryController;
use NosfirQuotia\Admin\Controller\DashboardController as AdminDashboardController;
use NosfirQuotia\Admin\Controller\QuoteController as AdminQuoteController;
use NosfirQuotia\Admin\Controller\ReferencePriceController as AdminReferencePriceController;
use NosfirQuotia\Admin\Controller\TaxController as AdminTaxController;
use NosfirQuotia\Admin\Controller\ToolController as AdminToolController;
use NosfirQuotia\Admin\Controller\AdminUserController as AdminUserController;
use NosfirQuotia\Admin\Controller\EmailLogController as AdminEmailLogController;
use NosfirQuotia\Cliente\Controller\AuthController as ClientAuthController;
use NosfirQuotia\Cliente\Controller\HomeController;
use NosfirQuotia\Cliente\Controller\RequestController as ClientRequestController;
use NosfirQuotia\Cliente\Controller\LegalController as ClientLegalController;
use NosfirQuotia\Install\Controller\InstallController;
use NosfirQuotia\System\Engine\Router;

return static function (Router $router): void {
    $router->get('/', [HomeController::class, 'index']);
    $router->get('/cliente/cadastro', [ClientAuthController::class, 'register']);
    $router->post('/cliente/cadastro', [ClientAuthController::class, 'storeRegister']);
    $router->get('/cliente/login', [ClientAuthController::class, 'login']);
    $router->post('/cliente/login', [ClientAuthController::class, 'storeLogin']);
    $router->get('/cliente/esqueci-senha', [ClientAuthController::class, 'forgotPassword']);
    $router->post('/cliente/esqueci-senha', [ClientAuthController::class, 'sendForgotPassword']);
    $router->get('/cliente/redefinir-senha', [ClientAuthController::class, 'resetPassword']);
    $router->post('/cliente/redefinir-senha', [ClientAuthController::class, 'storeResetPassword']);
    $router->get('/cliente/logout', [ClientAuthController::class, 'logout']);

    $router->get('/politica-de-uso', [ClientLegalController::class, 'policyUsage']);
    $router->get('/termos-de-uso', [ClientLegalController::class, 'terms']);
    $router->get('/politica-de-privacidade', [ClientLegalController::class, 'privacy']);
    $router->get('/politica-de-cookies', [ClientLegalController::class, 'cookies']);
    $router->get('/lgpd', [ClientLegalController::class, 'lgpd']);

    $router->get('/orcamento/novo', [ClientRequestController::class, 'create']);
    $router->post('/orcamento/enviar', [ClientRequestController::class, 'store']);
    $router->get('/orcamentos', [ClientRequestController::class, 'index']);
    $router->get('/orcamentos/{id:\d+}', [ClientRequestController::class, 'show']);

    $router->get('/admin', [AdminAuthController::class, 'index']);
    $router->post('/admin/login', [AdminAuthController::class, 'login']);
    $router->get('/admin/esqueci-senha', [AdminAuthController::class, 'forgotPassword']);
    $router->post('/admin/esqueci-senha', [AdminAuthController::class, 'sendForgotPassword']);
    $router->get('/admin/redefinir-senha', [AdminAuthController::class, 'resetPassword']);
    $router->post('/admin/redefinir-senha', [AdminAuthController::class, 'storeResetPassword']);
    $router->get('/admin/logout', [AdminAuthController::class, 'logout']);
    $router->get('/admin/dashboard', [AdminDashboardController::class, 'index']);
    $router->get('/admin/orcamentos', [AdminQuoteController::class, 'index']);
    $router->get('/admin/orcamentos/{id:\d+}', [AdminQuoteController::class, 'show']);
    $router->get('/admin/orcamentos/{id:\d+}/manual-marca.json', [AdminQuoteController::class, 'downloadBrandManual']);
    $router->post('/admin/orcamentos/{id:\d+}/gerar-relatorio', [AdminQuoteController::class, 'generateReport']);
    $router->get('/admin/notificacoes-email', [AdminEmailLogController::class, 'index']);
    $router->get('/admin/referencias', [AdminReferencePriceController::class, 'index']);
    $router->get('/admin/tributos', [AdminTaxController::class, 'index']);
    $router->post('/admin/tributos', [AdminTaxController::class, 'store']);
    $router->get('/admin/usuarios', [AdminUserController::class, 'index']);
    $router->post('/admin/usuarios', [AdminUserController::class, 'store']);
    $router->post('/admin/usuarios/{id:\d+}', [AdminUserController::class, 'update']);
    $router->get('/admin/ferramentas', [AdminToolController::class, 'index']);
    $router->get('/admin/ferramentas/{slug:[a-z0-9\-]+}', [AdminToolController::class, 'open']);
    $router->get('/admin/categorias', [AdminCategoryController::class, 'index']);
    $router->post('/admin/categorias', [AdminCategoryController::class, 'store']);

    $router->get('/install', [InstallController::class, 'step1']);
    $router->get('/install/step1', [InstallController::class, 'step1']);
    $router->post('/install/step1', [InstallController::class, 'storeStep1']);
    $router->get('/install/step2', [InstallController::class, 'step2']);
    $router->post('/install/step2', [InstallController::class, 'storeStep2']);
    $router->get('/install/step3', [InstallController::class, 'step3']);
    $router->post('/install/step3', [InstallController::class, 'storeStep3']);
    $router->get('/install/step4', [InstallController::class, 'step4']);
};
