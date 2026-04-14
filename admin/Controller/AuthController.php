<?php

declare(strict_types=1);

namespace AureaQuotia\Admin\Controller;

use AureaQuotia\System\Engine\Controller;
use AureaQuotia\System\Library\EmailService;
use AureaQuotia\System\Library\PasswordResetService;

final class AuthController extends Controller
{
    public function index(): void
    {
        if ($this->auth()->check()) {
            $path = $this->auth()->preferredAdminPath();
            if ($path === '/admin/logout') {
                $this->session->flash('error', 'Seu usuario nao possui permissoes ativas para acessar o painel.');
            }
            $this->redirect($path);
        }

        $this->render(
            'admin/View/auth/login',
            ['isLoginPage' => true],
            'admin/View/layout'
        );
    }

    public function login(): void
    {
        $email = strtolower(trim((string) $this->request->post('email', '')));
        $password = (string) $this->request->post('password', '');

        if ($email === '' || $password === '') {
            $this->session->flash('error', 'Informe email e senha.');
            $this->redirect('/admin');
        }

        if (!$this->auth()->attempt($email, $password)) {
            $this->session->flash('error', 'Credenciais invalidas ou usuario sem acesso ativo.');
            $this->redirect('/admin');
        }

        $path = $this->auth()->preferredAdminPath();
        if ($path === '/admin/logout') {
            $this->auth()->logout();
            $this->session->flash('error', 'Seu usuario nao possui permissoes ativas. Contate o Administrador Geral.');
            $this->redirect('/admin');
        }

        $this->session->flash('success', 'Login realizado com sucesso.');
        $this->redirect($path);
    }

    public function logout(): void
    {
        $this->auth()->logout();
        $this->session->flash('success', 'Sessao encerrada.');
        $this->redirect('/admin');
    }

    public function forgotPassword(): void
    {
        if ($this->auth()->check()) {
            $this->redirect($this->auth()->preferredAdminPath());
        }

        $this->render(
            'admin/View/auth/forgot_password',
            ['isLoginPage' => true],
            'admin/View/layout'
        );
    }

    public function sendForgotPassword(): void
    {
        $email = strtolower(trim((string) $this->request->post('email', '')));
        $this->session->set('old_input', ['email' => $email]);

        if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $this->session->flash('error', 'Informe um email valido para recuperar a senha.');
            $this->redirect('/admin/esqueci-senha');
        }

        $resetService = $this->resetService();
        $resetService->requestReset(
            'admin',
            $email,
            $this->request->fullBaseUrl(),
            (string) ($_SERVER['REMOTE_ADDR'] ?? '')
        );

        $this->session->flash('success', 'Se o email estiver cadastrado, enviaremos o link de redefinicao em instantes.');
        $this->redirect('/admin/esqueci-senha');
    }

    public function resetPassword(): void
    {
        $token = trim((string) $this->request->query('token', ''));
        $tokenData = $this->resetService()->tokenData('admin', $token);

        if ($token === '' || $tokenData === null) {
            $this->session->flash('error', 'Link de redefinicao invalido ou expirado.');
            $this->redirect('/admin/esqueci-senha');
        }

        $this->render(
            'admin/View/auth/reset_password',
            [
                'isLoginPage' => true,
                'token' => $token,
                'email' => (string) ($tokenData['email'] ?? ''),
            ],
            'admin/View/layout'
        );
    }

    public function storeResetPassword(): void
    {
        $token = trim((string) $this->request->post('token', ''));
        $password = (string) $this->request->post('password', '');
        $passwordConfirm = (string) $this->request->post('password_confirm', '');

        if ($password !== $passwordConfirm) {
            $this->session->flash('error', 'As senhas nao conferem.');
            $this->redirect('/admin/redefinir-senha?token=' . urlencode($token));
        }

        $result = $this->resetService()->resetPassword('admin', $token, $password);
        if (!$result['success']) {
            $this->session->flash('error', (string) ($result['error'] ?? 'Nao foi possivel redefinir a senha.'));
            $this->redirect('/admin/esqueci-senha');
        }

        $this->session->forgetMany(['old_input']);
        $this->session->flash('success', 'Senha redefinida com sucesso. Voce ja pode entrar com a nova senha.');
        $this->redirect('/admin');
    }

    private function resetService(): PasswordResetService
    {
        $emailService = new EmailService($this->db(), (array) $this->app->config('mail', []));

        return new PasswordResetService(
            $this->db(),
            $emailService,
            (string) $this->app->config('name', 'Aurea Quotia')
        );
    }
}
