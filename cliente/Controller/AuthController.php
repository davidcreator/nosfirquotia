<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Controller;

use NosfirQuotia\System\Engine\Controller;
use NosfirQuotia\System\Library\EmailService;
use NosfirQuotia\System\Library\PasswordResetService;

final class AuthController extends Controller
{
    public function login(): void
    {
        if ($this->clientAuth()->check()) {
            $this->redirect('/orcamentos');
        }

        $this->render('cliente/View/auth/login', [], 'cliente/View/layout');
    }

    public function storeLogin(): void
    {
        $email = strtolower(trim((string) $this->request->post('email', '')));
        $password = (string) $this->request->post('password', '');

        if ($email === '' || $password === '') {
            $this->session->flash('error', 'Informe email e senha para entrar.');
            $this->redirect('/cliente/login');
        }

        if (!$this->clientAuth()->attempt($email, $password)) {
            $this->session->flash('error', 'Credenciais de cliente invalidas.');
            $this->redirect('/cliente/login');
        }

        $this->session->flash('success', 'Login realizado com sucesso.');
        $this->redirect('/orcamentos');
    }

    public function register(): void
    {
        if ($this->clientAuth()->check()) {
            $this->redirect('/orcamentos');
        }

        $this->render('cliente/View/auth/register', [], 'cliente/View/layout');
    }

    public function storeRegister(): void
    {
        $name = trim((string) $this->request->post('name', ''));
        $email = strtolower(trim((string) $this->request->post('email', '')));
        $phone = trim((string) $this->request->post('phone', ''));
        $password = (string) $this->request->post('password', '');
        $passwordConfirm = (string) $this->request->post('password_confirm', '');

        $this->session->set('old_input', [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
        ]);

        if ($password !== $passwordConfirm) {
            $this->session->flash('error', 'As senhas nao conferem.');
            $this->redirect('/cliente/cadastro');
        }

        $result = $this->clientAuth()->register($name, $email, $phone, $password);

        if (!$result['success']) {
            $this->session->flash('error', (string) $result['error']);
            $this->redirect('/cliente/cadastro');
        }

        $this->session->remove('old_input');
        $this->session->flash('success', 'Conta criada com sucesso. Voce ja pode solicitar orcamentos.');
        $this->redirect('/orcamentos');
    }

    public function logout(): void
    {
        $this->clientAuth()->logout();
        $this->session->flash('success', 'Sessao de cliente encerrada.');
        $this->redirect('/');
    }

    public function forgotPassword(): void
    {
        if ($this->clientAuth()->check()) {
            $this->redirect('/orcamentos');
        }

        $this->render('cliente/View/auth/forgot_password', [], 'cliente/View/layout');
    }

    public function sendForgotPassword(): void
    {
        $email = strtolower(trim((string) $this->request->post('email', '')));
        $this->session->set('old_input', ['email' => $email]);

        if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $this->session->flash('error', 'Informe um email valido para recuperar a senha.');
            $this->redirect('/cliente/esqueci-senha');
        }

        $this->resetService()->requestReset(
            'client',
            $email,
            $this->request->fullBaseUrl(),
            (string) ($_SERVER['REMOTE_ADDR'] ?? '')
        );

        $this->session->flash('success', 'Se o email estiver cadastrado, enviaremos o link de redefinicao em instantes.');
        $this->redirect('/cliente/esqueci-senha');
    }

    public function resetPassword(): void
    {
        if ($this->clientAuth()->check()) {
            $this->redirect('/orcamentos');
        }

        $token = trim((string) $this->request->query('token', ''));
        $tokenData = $this->resetService()->tokenData('client', $token);

        if ($token === '' || $tokenData === null) {
            $this->session->flash('error', 'Link de redefinicao invalido ou expirado.');
            $this->redirect('/cliente/esqueci-senha');
        }

        $this->render(
            'cliente/View/auth/reset_password',
            [
                'token' => $token,
                'email' => (string) ($tokenData['email'] ?? ''),
            ],
            'cliente/View/layout'
        );
    }

    public function storeResetPassword(): void
    {
        $token = trim((string) $this->request->post('token', ''));
        $password = (string) $this->request->post('password', '');
        $passwordConfirm = (string) $this->request->post('password_confirm', '');

        if ($password !== $passwordConfirm) {
            $this->session->flash('error', 'As senhas nao conferem.');
            $this->redirect('/cliente/redefinir-senha?token=' . urlencode($token));
        }

        $result = $this->resetService()->resetPassword('client', $token, $password);
        if (!$result['success']) {
            $this->session->flash('error', (string) ($result['error'] ?? 'Nao foi possivel redefinir a senha.'));
            $this->redirect('/cliente/esqueci-senha');
        }

        $this->session->forgetMany(['old_input']);
        $this->session->flash('success', 'Senha redefinida com sucesso. Voce ja pode entrar com a nova senha.');
        $this->redirect('/cliente/login');
    }

    private function resetService(): PasswordResetService
    {
        $emailService = new EmailService($this->db(), (array) $this->app->config('mail', []));

        return new PasswordResetService(
            $this->db(),
            $emailService,
            (string) $this->app->config('name', 'Quotia')
        );
    }
}
