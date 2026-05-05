<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\System\Engine\Controller;
use NosfirQuotia\System\Library\EmailService;
use NosfirQuotia\System\Library\PasswordResetService;
use NosfirQuotia\System\Library\RateLimiter;

final class AuthController extends Controller
{
    private const LOGIN_WINDOW_SECONDS = 900;
    private const LOGIN_MAX_ATTEMPTS_PER_EMAIL = 5;
    private const LOGIN_MAX_ATTEMPTS_PER_IP = 20;
    private const REMEMBER_EMAIL_COOKIE = 'aq_admin_remember_email';
    private const REMEMBER_EMAIL_MAX_AGE = 15552000; // 180 dias

    public function index(): void
    {
        if ($this->auth()->check()) {
            $path = $this->auth()->preferredAdminPath();
            if ($path === '/admin/logout') {
                $this->session->flash('error', 'Seu usuário não possui permissões ativas para acessar o painel.');
            }
            $this->redirect($path);
        }

        $rememberedEmail = $this->rememberedEmailFromCookie();
        $this->render(
            'admin/View/auth/login',
            [
                'isLoginPage' => true,
                'rememberedEmail' => $rememberedEmail,
                'rememberEmailChecked' => $rememberedEmail !== '',
            ],
            'admin/View/layout'
        );
    }

    public function login(): void
    {
        $emailRaw = $this->sanitizeSingleLineText((string) $this->request->post('email', ''), 190);
        $email = $this->sanitizeEmailAddress($emailRaw);
        $password = (string) $this->request->post('password', '');
        $rememberEmail = $this->toBoolValue($this->request->post('remember_email', false));
        $this->session->set('old_input', [
            'email' => $emailRaw,
            'remember_email' => $rememberEmail ? '1' : '0',
        ]);

        if (!$rememberEmail) {
            $this->clearRememberedEmailCookie();
        }

        if ($email === '' || $password === '') {
            $this->session->flash('error', 'Informe email e senha.');
            $this->redirect('/admin');
        }

        if (!$this->canAttemptLogin($email)) {
            $this->redirect('/admin');
        }

        if (!$this->auth()->attempt($email, $password)) {
            $this->registerLoginFailure($email);
            $this->session->flash('error', 'Credenciais inválidas ou usuário sem acesso ativo.');
            $this->redirect('/admin');
        }

        $this->clearLoginFailures($email);
        $this->syncRememberedEmailCookie($email, $rememberEmail);
        $this->session->forgetMany(['old_input']);

        $path = $this->auth()->preferredAdminPath();
        if ($path === '/admin/logout') {
            $this->auth()->logout();
            $this->session->flash('error', 'Seu usuário não possui permissões ativas. Contate o Administrador Geral.');
            $this->redirect('/admin');
        }

        $this->session->flash('success', 'Login realizado com sucesso.');
        $this->redirect($path);
    }

    public function logout(): void
    {
        $this->auth()->logout();
        $this->session->flash('success', 'Sessão encerrada.');
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
        $email = $this->sanitizeEmailAddress((string) $this->request->post('email', ''));
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
            $this->session->flash('error', 'Link de redefinição inválido ou expirado.');
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
            $this->session->flash('error', 'As senhas não conferem.');
            $this->redirect('/admin/redefinir-senha?token=' . urlencode($token));
        }

        if (strlen($password) > 200) {
            $this->session->flash('error', 'Senha excede o tamanho máximo permitido.');
            $this->redirect('/admin/redefinir-senha?token=' . urlencode($token));
        }

        $result = $this->resetService()->resetPassword('admin', $token, $password);
        if (!$result['success']) {
            $this->session->flash('error', (string) ($result['error'] ?? 'Não foi possível redefinir a senha.'));
            $this->redirect('/admin/esqueci-senha');
        }

        $this->session->forgetMany(['old_input']);
        $this->session->flash('success', 'Senha redefinida com sucesso. Você já pode entrar com a nova senha.');
        $this->redirect('/admin');
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

    private function canAttemptLogin(string $email): bool
    {
        $keys = $this->loginThrottleKeys('admin', $email);
        $limiter = $this->rateLimiter();

        $emailCheck = $limiter->tooManyAttempts(
            $keys['email'],
            self::LOGIN_MAX_ATTEMPTS_PER_EMAIL,
            self::LOGIN_WINDOW_SECONDS
        );
        $ipCheck = $limiter->tooManyAttempts(
            $keys['ip'],
            self::LOGIN_MAX_ATTEMPTS_PER_IP,
            self::LOGIN_WINDOW_SECONDS
        );

        $limited = !empty($emailCheck['limited']) || !empty($ipCheck['limited']);
        if (!$limited) {
            return true;
        }

        $retryAfter = max(
            (int) ($emailCheck['retry_after'] ?? 0),
            (int) ($ipCheck['retry_after'] ?? 0)
        );

        $this->session->flash(
            'error',
            'Muitas tentativas de login. Aguarde ' . $this->formatRetryAfter($retryAfter) . ' para tentar novamente.'
        );

        return false;
    }

    private function registerLoginFailure(string $email): void
    {
        $keys = $this->loginThrottleKeys('admin', $email);
        $limiter = $this->rateLimiter();
        $limiter->hit($keys['email'], self::LOGIN_MAX_ATTEMPTS_PER_EMAIL, self::LOGIN_WINDOW_SECONDS);
        $limiter->hit($keys['ip'], self::LOGIN_MAX_ATTEMPTS_PER_IP, self::LOGIN_WINDOW_SECONDS);
    }

    private function clearLoginFailures(string $email): void
    {
        $keys = $this->loginThrottleKeys('admin', $email);
        $limiter = $this->rateLimiter();
        $limiter->clear($keys['email']);
        $limiter->clear($keys['ip']);
    }

    private function loginThrottleKeys(string $scope, string $email): array
    {
        $email = strtolower(trim($email));
        $ip = trim((string) ($_SERVER['REMOTE_ADDR'] ?? 'ip-desconhecido'));
        if ($ip === '') {
            $ip = 'ip-desconhecido';
        }

        return [
            'email' => $scope . '|email|' . $email,
            'ip' => $scope . '|ip|' . $ip,
        ];
    }

    private function rateLimiter(): RateLimiter
    {
        return new RateLimiter($this->app->rootPath() . '/storage/cache/rate_limits');
    }

    private function formatRetryAfter(int $seconds): string
    {
        $seconds = max(1, $seconds);
        if ($seconds < 60) {
            return $seconds . 's';
        }

        $minutes = (int) ceil($seconds / 60);

        return $minutes . ' min';
    }

    private function rememberedEmailFromCookie(): string
    {
        $email = $this->sanitizeSingleLineText((string) $this->request->cookie(self::REMEMBER_EMAIL_COOKIE, ''), 190);

        return $this->sanitizeEmailAddress($email);
    }

    private function syncRememberedEmailCookie(string $email, bool $remember): void
    {
        if (!$remember) {
            $this->clearRememberedEmailCookie();
            return;
        }

        $sanitized = $this->sanitizeEmailAddress($email);
        if ($sanitized === '') {
            $this->clearRememberedEmailCookie();
            return;
        }

        $this->writeCookie(self::REMEMBER_EMAIL_COOKIE, $sanitized, self::REMEMBER_EMAIL_MAX_AGE, true);
    }

    private function clearRememberedEmailCookie(): void
    {
        $this->clearCookie(self::REMEMBER_EMAIL_COOKIE, true);
    }
}
