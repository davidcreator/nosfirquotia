<?php

declare(strict_types=1);

namespace AureaQuotia\Install\Controller;

use AureaQuotia\System\Engine\Controller;
use AureaQuotia\System\Library\Installer;

final class InstallController extends Controller
{
    public function step1(): void
    {
        $installer = new Installer($this->app->rootPath());
        $checks = $installer->requirementChecks();
        $canContinue = $this->allPassed($checks);

        $this->render(
            'install/View/step1',
            [
                'checks' => $checks,
                'canContinue' => $canContinue,
                'step' => 1,
            ],
            'install/View/layout'
        );
    }

    public function storeStep1(): void
    {
        $installer = new Installer($this->app->rootPath());
        $checks = $installer->requirementChecks();

        if (!$this->allPassed($checks)) {
            $this->session->flash('error', 'Alguns requisitos nao foram atendidos.');
            $this->redirect($this->installRoute('/step1'));
        }

        $this->session->set('install.step1', true);
        $this->redirect($this->installRoute('/step2'));
    }

    public function step2(): void
    {
        if (!$this->session->get('install.step1', false)) {
            $this->redirect($this->installRoute('/step1'));
        }

        $installer = new Installer($this->app->rootPath());
        $checks = $installer->permissionChecks();
        $canContinue = $this->allPassed($checks);

        $this->render(
            'install/View/step2',
            [
                'checks' => $checks,
                'canContinue' => $canContinue,
                'step' => 2,
            ],
            'install/View/layout'
        );
    }

    public function storeStep2(): void
    {
        if (!$this->session->get('install.step1', false)) {
            $this->redirect($this->installRoute('/step1'));
        }

        $installer = new Installer($this->app->rootPath());
        $checks = $installer->permissionChecks();

        if (!$this->allPassed($checks)) {
            $this->session->flash('error', 'Corrija as permissoes antes de continuar.');
            $this->redirect($this->installRoute('/step2'));
        }

        $this->session->set('install.step2', true);
        $this->redirect($this->installRoute('/step3'));
    }

    public function step3(): void
    {
        if (!$this->session->get('install.step2', false)) {
            $this->redirect($this->installRoute('/step2'));
        }

        $this->render(
            'install/View/step3',
            ['step' => 3],
            'install/View/layout'
        );
    }

    public function storeStep3(): void
    {
        if (!$this->session->get('install.step2', false)) {
            $this->redirect($this->installRoute('/step2'));
        }

        $payload = [
            'db_host' => trim((string) $this->request->post('db_host', '127.0.0.1')),
            'db_port' => (int) $this->request->post('db_port', 3306),
            'db_name' => trim((string) $this->request->post('db_name', '')),
            'db_user' => trim((string) $this->request->post('db_user', '')),
            'db_pass' => (string) $this->request->post('db_pass', ''),
            'admin_name' => trim((string) $this->request->post('admin_name', '')),
            'admin_email' => strtolower(trim((string) $this->request->post('admin_email', ''))),
            'admin_pass' => (string) $this->request->post('admin_pass', ''),
            'admin_pass_confirm' => (string) $this->request->post('admin_pass_confirm', ''),
            'import_reference_prices' => (bool) $this->request->post('import_reference_prices', false),
        ];

        $this->session->set('old_input', $payload);

        if (strlen($payload['admin_pass']) < 6) {
            $this->session->flash('error', 'Senha do admin deve ter pelo menos 6 caracteres.');
            $this->redirect($this->installRoute('/step3'));
        }

        if ($payload['admin_pass'] !== $payload['admin_pass_confirm']) {
            $this->session->flash('error', 'As senhas do admin nao conferem.');
            $this->redirect($this->installRoute('/step3'));
        }

        $installer = new Installer($this->app->rootPath());
        $result = $installer->install($payload);

        if (!$result['success']) {
            $this->session->flash('error', (string) $result['error']);
            $this->redirect($this->installRoute('/step3'));
        }

        if (!empty($result['imported_reference_prices'])) {
            $this->session->flash('success', 'Base de precos e servicos de referencia importada com sucesso.');
        } else {
            $this->session->flash('warning', 'Instalacao concluida sem importar a base de precos. Voce pode importar depois pelo script.');
        }

        $this->session->forgetMany(['old_input', 'install.step1', 'install.step2']);
        $this->session->set('installer.allow_step4', true);
        $this->redirect($this->installRoute('/step4'));
    }

    public function step4(): void
    {
        if (!$this->session->get('installer.allow_step4', false)) {
            $this->redirect('/');
        }

        $this->session->remove('installer.allow_step4');

        $this->render(
            'install/View/step4',
            ['step' => 4],
            'install/View/layout'
        );
    }

    private function allPassed(array $checks): bool
    {
        foreach ($checks as $check) {
            if (!(bool) ($check['status'] ?? false)) {
                return false;
            }
        }

        return true;
    }

    private function installRoute(string $path = ''): string
    {
        $route = '/install';
        if ($path !== '') {
            $route .= '/' . ltrim($path, '/');
        }

        return '/index.php?route=' . $route;
    }
}
