<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Controller;

use NosfirQuotia\System\Engine\Controller;
use NosfirQuotia\System\Library\EmailService;
use NosfirQuotia\System\Library\PasswordResetService;
use NosfirQuotia\System\Library\RateLimiter;

final class AuthController extends Controller
{
    private const LOGIN_WINDOW_SECONDS = 900;
    private const LOGIN_MAX_ATTEMPTS_PER_EMAIL = 5;
    private const LOGIN_MAX_ATTEMPTS_PER_IP = 20;
    private const REMEMBER_EMAIL_COOKIE = 'aq_client_remember_email';
    private const REMEMBER_EMAIL_MAX_AGE = 15552000; // 180 dias

    public function login(): void
    {
        if ($this->clientAuth()->check()) {
            $this->redirect('/orcamentos');
        }

        $rememberedEmail = $this->rememberedEmailFromCookie();
        $this->render(
            'cliente/View/auth/login',
            [
                'rememberedEmail' => $rememberedEmail,
                'rememberEmailChecked' => $rememberedEmail !== '',
            ],
            'cliente/View/layout'
        );
    }

    public function storeLogin(): void
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
            $this->session->flash('error', 'Informe email e senha para entrar.');
            $this->redirect('/cliente/login');
        }

        if (!$this->canAttemptLogin($email)) {
            $this->redirect('/cliente/login');
        }

        if (!$this->clientAuth()->attempt($email, $password)) {
            $this->registerLoginFailure($email);
            $this->session->flash('error', 'Credenciais de cliente inválidas.');
            $this->redirect('/cliente/login');
        }

        $this->clearLoginFailures($email);
        $this->syncRememberedEmailCookie($email, $rememberEmail);
        $this->session->forgetMany(['old_input']);

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
        $name = $this->sanitizeSingleLineText((string) $this->request->post('name', ''), 150);
        $email = $this->sanitizeEmailAddress((string) $this->request->post('email', ''));
        $phoneRaw = (string) $this->request->post('phone', '');
        $phoneDigits = preg_replace('/\D+/', '', $phoneRaw);
        $phone = is_string($phoneDigits) ? substr($phoneDigits, 0, 11) : '';
        $password = (string) $this->request->post('password', '');
        $passwordConfirm = (string) $this->request->post('password_confirm', '');

        $this->session->set('old_input', [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
        ]);

        if ($password !== $passwordConfirm) {
            $this->session->flash('error', 'As senhas não conferem.');
            $this->redirect('/cliente/cadastro');
        }

        if (strlen($password) > 200) {
            $this->session->flash('error', 'Senha excede o tamanho máximo permitido.');
            $this->redirect('/cliente/cadastro');
        }

        $result = $this->clientAuth()->register($name, $email, $phone, $password);

        if (!$result['success']) {
            $this->session->flash('error', (string) $result['error']);
            $this->redirect('/cliente/cadastro');
        }

        $this->session->remove('old_input');
        $this->session->flash('success', 'Conta criada com sucesso. Você já pode solicitar orçamentos.');
        $this->redirect('/orcamentos');
    }

    public function logout(): void
    {
        $this->clientAuth()->logout();
        $this->session->flash('success', 'Sessão de cliente encerrada.');
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
        $email = $this->sanitizeEmailAddress((string) $this->request->post('email', ''));
        $this->session->set('old_input', ['email' => $email]);

        if ($email === '' || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $this->session->flash('error', 'Informe um email válido para recuperar a senha.');
            $this->redirect('/cliente/esqueci-senha');
        }

        $this->resetService()->requestReset(
            'client',
            $email,
            $this->request->fullBaseUrl(),
            (string) ($_SERVER['REMOTE_ADDR'] ?? '')
        );

        $this->session->flash('success', 'Se o email estiver cadastrado, enviaremos o link de redefinição em instantes.');
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
            $this->session->flash('error', 'Link de redefinição inválido ou expirado.');
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
            $this->session->flash('error', 'As senhas não conferem.');
            $this->redirect('/cliente/redefinir-senha?token=' . urlencode($token));
        }

        if (strlen($password) > 200) {
            $this->session->flash('error', 'Senha excede o tamanho máximo permitido.');
            $this->redirect('/cliente/redefinir-senha?token=' . urlencode($token));
        }

        $result = $this->resetService()->resetPassword('client', $token, $password);
        if (!$result['success']) {
            $this->session->flash('error', (string) ($result['error'] ?? 'Não foi possível redefinir a senha.'));
            $this->redirect('/cliente/esqueci-senha');
        }

        $this->session->forgetMany(['old_input']);
        $this->session->flash('success', 'Senha redefinida com sucesso. Você já pode entrar com a nova senha.');
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

    private function canAttemptLogin(string $email): bool
    {
        $keys = $this->loginThrottleKeys('client', $email);
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
        $keys = $this->loginThrottleKeys('client', $email);
        $limiter = $this->rateLimiter();
        $limiter->hit($keys['email'], self::LOGIN_MAX_ATTEMPTS_PER_EMAIL, self::LOGIN_WINDOW_SECONDS);
        $limiter->hit($keys['ip'], self::LOGIN_MAX_ATTEMPTS_PER_IP, self::LOGIN_WINDOW_SECONDS);
    }

    private function clearLoginFailures(string $email): void
    {
        $keys = $this->loginThrottleKeys('client', $email);
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
