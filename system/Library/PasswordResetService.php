<?php

declare(strict_types=1);

namespace AureaQuotia\System\Library;

final class PasswordResetService
{
    public function __construct(
        private readonly Database $db,
        private readonly EmailService $emailService,
        private readonly string $appName = 'Aurea Quotia'
    ) {
    }

    public function requestReset(string $userType, string $email, string $baseUrl, ?string $requestIp = null): array
    {
        $email = strtolower(trim($email));
        $map = $this->mapType($userType);

        if ($map === null) {
            return ['success' => false, 'status' => 'invalid_type', 'error' => 'Tipo de usuario invalido.'];
        }

        if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            return ['success' => false, 'status' => 'invalid_email', 'error' => 'Email invalido.'];
        }

        $user = $this->db->fetch(
            sprintf(
                'SELECT id, name, email FROM %s WHERE email = :email LIMIT 1',
                $map['table']
            ),
            ['email' => $email]
        );

        if ($user === null) {
            $this->logResetEvent(
                'password_reset_' . $map['user_type'],
                null,
                $email,
                'Recuperacao de senha - ' . $this->appName,
                'invalid_email',
                'Email nao cadastrado para recuperacao.',
                $map['table'],
                null
            );
            return ['success' => true, 'status' => 'not_found', 'error' => null];
        }

        $lastRecent = $this->db->fetch(
            'SELECT id
             FROM password_resets
             WHERE user_type = :user_type
               AND user_id = :user_id
               AND created_at >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
             ORDER BY id DESC
             LIMIT 1',
            [
                'user_type' => $map['user_type'],
                'user_id' => (int) $user['id'],
            ]
        );

        if ($lastRecent !== null) {
            $this->logResetEvent(
                'password_reset_' . $map['user_type'],
                (string) ($user['name'] ?? ''),
                $email,
                'Recuperacao de senha - ' . $this->appName,
                'failed',
                'Solicitacao muito frequente. Aguarde alguns minutos.',
                $map['table'],
                (int) $user['id']
            );
            return ['success' => true, 'status' => 'rate_limited', 'error' => null];
        }

        $this->db->execute(
            'UPDATE password_resets
             SET used_at = NOW()
             WHERE user_type = :user_type
               AND user_id = :user_id
               AND used_at IS NULL',
            [
                'user_type' => $map['user_type'],
                'user_id' => (int) $user['id'],
            ]
        );

        $token = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

        $this->db->execute(
            'INSERT INTO password_resets (
                user_type, user_id, email, token_hash, expires_at, requested_ip
             ) VALUES (
                :user_type, :user_id, :email, :token_hash, :expires_at, :requested_ip
             )',
            [
                'user_type' => $map['user_type'],
                'user_id' => (int) $user['id'],
                'email' => $email,
                'token_hash' => $tokenHash,
                'expires_at' => $expiresAt,
                'requested_ip' => $requestIp,
            ]
        );

        $link = rtrim($baseUrl, '/') . $map['reset_path'] . '?token=' . urlencode($token);
        $name = (string) ($user['name'] ?? 'Usuario');
        $subject = 'Recuperacao de senha - ' . $this->appName;

        $html = $this->buildResetEmailHtml($name, $link, $map['label']);
        $text = $this->buildResetEmailText($name, $link, $map['label']);

        $send = $this->emailService->send(
            [
                'context_key' => 'password_reset_' . $map['user_type'],
                'recipient_name' => $name,
                'recipient_email' => $email,
                'subject' => $subject,
                'html_body' => $html,
                'text_body' => $text,
                'related_type' => $map['table'],
                'related_id' => (int) $user['id'],
            ]
        );

        return [
            'success' => true,
            'status' => $send['status'] ?? 'failed',
            'error' => $send['error'] ?? null,
        ];
    }

    public function tokenData(string $userType, string $token): ?array
    {
        $token = trim($token);
        $map = $this->mapType($userType);
        if ($map === null || $token === '') {
            return null;
        }

        $tokenHash = hash('sha256', $token);
        $reset = $this->db->fetch(
            'SELECT id, user_id, email, expires_at, used_at
             FROM password_resets
             WHERE user_type = :user_type
               AND token_hash = :token_hash
               AND used_at IS NULL
               AND expires_at >= NOW()
             LIMIT 1',
            [
                'user_type' => $map['user_type'],
                'token_hash' => $tokenHash,
            ]
        );

        if ($reset === null) {
            return null;
        }

        $user = $this->db->fetch(
            sprintf('SELECT id, name, email FROM %s WHERE id = :id LIMIT 1', $map['table']),
            ['id' => (int) $reset['user_id']]
        );

        if ($user === null) {
            return null;
        }

        return [
            'reset_id' => (int) $reset['id'],
            'user_id' => (int) $user['id'],
            'name' => (string) ($user['name'] ?? 'Usuario'),
            'email' => (string) ($user['email'] ?? ''),
            'expires_at' => (string) $reset['expires_at'],
            'user_type' => $map['user_type'],
        ];
    }

    public function resetPassword(string $userType, string $token, string $newPassword): array
    {
        $tokenData = $this->tokenData($userType, $token);
        if ($tokenData === null) {
            return ['success' => false, 'error' => 'Token invalido ou expirado.'];
        }

        if (strlen($newPassword) < 6) {
            return ['success' => false, 'error' => 'A senha deve ter pelo menos 6 caracteres.'];
        }

        $map = $this->mapType($userType);
        if ($map === null) {
            return ['success' => false, 'error' => 'Tipo de usuario invalido.'];
        }

        $this->db->execute(
            sprintf('UPDATE %s SET password = :password WHERE id = :id LIMIT 1', $map['table']),
            [
                'password' => password_hash($newPassword, PASSWORD_DEFAULT),
                'id' => $tokenData['user_id'],
            ]
        );

        $this->db->execute(
            'UPDATE password_resets
             SET used_at = NOW()
             WHERE id = :id
             LIMIT 1',
            ['id' => $tokenData['reset_id']]
        );

        return ['success' => true, 'error' => null];
    }

    private function mapType(string $userType): ?array
    {
        $userType = strtolower(trim($userType));

        return match ($userType) {
            'admin' => [
                'user_type' => 'admin',
                'table' => 'admin_users',
                'reset_path' => '/admin/redefinir-senha',
                'label' => 'Administrador',
            ],
            'client', 'cliente' => [
                'user_type' => 'client',
                'table' => 'client_users',
                'reset_path' => '/cliente/redefinir-senha',
                'label' => 'Cliente',
            ],
            default => null,
        };
    }

    private function buildResetEmailHtml(string $name, string $link, string $userLabel): string
    {
        $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeLink = htmlspecialchars($link, ENT_QUOTES, 'UTF-8');
        $safeApp = htmlspecialchars($this->appName, ENT_QUOTES, 'UTF-8');

        return <<<HTML
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
  <h2 style="margin: 0 0 12px 0;">Recuperacao de senha</h2>
  <p>Ola {$safeName},</p>
  <p>Recebemos uma solicitacao para redefinir a senha da conta de {$userLabel} no <strong>{$safeApp}</strong>.</p>
  <p>
    <a href="{$safeLink}" style="display: inline-block; background: #1a4b8f; color: #fff; text-decoration: none; padding: 10px 14px; border-radius: 6px;">
      Redefinir minha senha
    </a>
  </p>
  <p>Se preferir, copie e cole este link no navegador:<br>{$safeLink}</p>
  <p>Este link expira em 1 hora. Se voce nao solicitou esta alteracao, ignore este email.</p>
</div>
HTML;
    }

    private function buildResetEmailText(string $name, string $link, string $userLabel): string
    {
        return "Ola {$name},\n\n" .
            "Recebemos uma solicitacao para redefinir a senha da conta de {$userLabel} no {$this->appName}.\n" .
            "Acesse o link abaixo para redefinir sua senha:\n{$link}\n\n" .
            "Este link expira em 1 hora. Se voce nao solicitou esta alteracao, ignore este email.\n";
    }

    private function logResetEvent(
        string $contextKey,
        ?string $recipientName,
        string $recipientEmail,
        string $subject,
        string $status,
        ?string $errorMessage,
        string $relatedType,
        ?int $relatedId
    ): void {
        try {
            $this->db->execute(
                'INSERT INTO email_dispatch_logs (
                    context_key, recipient_name, recipient_email, subject, status, error_message, related_type, related_id
                 ) VALUES (
                    :context_key, :recipient_name, :recipient_email, :subject, :status, :error_message, :related_type, :related_id
                 )',
                [
                    'context_key' => $contextKey,
                    'recipient_name' => ($recipientName !== null && $recipientName !== '') ? $recipientName : null,
                    'recipient_email' => $recipientEmail,
                    'subject' => $subject,
                    'status' => $status,
                    'error_message' => $errorMessage,
                    'related_type' => $relatedType,
                    'related_id' => $relatedId,
                ]
            );
        } catch (\Throwable) {
            // nao interromper fluxo
        }
    }
}
