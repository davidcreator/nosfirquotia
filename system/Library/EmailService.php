<?php

declare(strict_types=1);

namespace AureaQuotia\System\Library;

use Throwable;

final class EmailService
{
    public function __construct(
        private readonly Database $db,
        private readonly array $mailConfig = []
    ) {
    }

    public function send(array $payload): array
    {
        $contextKey = trim((string) ($payload['context_key'] ?? 'general'));
        $recipientName = trim((string) ($payload['recipient_name'] ?? ''));
        $recipientEmail = strtolower(trim((string) ($payload['recipient_email'] ?? '')));
        $subject = $this->sanitizeHeader((string) ($payload['subject'] ?? 'Mensagem do sistema'));
        $htmlBody = (string) ($payload['html_body'] ?? '');
        $textBody = (string) ($payload['text_body'] ?? strip_tags($htmlBody));
        $relatedType = trim((string) ($payload['related_type'] ?? ''));
        $relatedId = (int) ($payload['related_id'] ?? 0);

        if ($recipientEmail === '' || filter_var($recipientEmail, FILTER_VALIDATE_EMAIL) === false) {
            return $this->logAndReturn(
                $contextKey,
                $recipientName,
                $recipientEmail !== '' ? $recipientEmail : 'email-invalido',
                $subject,
                $htmlBody,
                'invalid_email',
                'Email do destinatario invalido.',
                $relatedType,
                $relatedId
            );
        }

        $enabled = (bool) ($this->mailConfig['enabled'] ?? true);
        if (!$enabled) {
            return $this->logAndReturn(
                $contextKey,
                $recipientName,
                $recipientEmail,
                $subject,
                $htmlBody,
                'failed',
                'Envio de email desabilitado na configuracao.',
                $relatedType,
                $relatedId
            );
        }

        $fromEmail = strtolower(trim((string) ($this->mailConfig['from_email'] ?? 'no-reply@localhost')));
        if (filter_var($fromEmail, FILTER_VALIDATE_EMAIL) === false) {
            $fromEmail = 'no-reply@localhost';
        }

        $fromName = trim((string) ($this->mailConfig['from_name'] ?? 'Aurea Quotia'));
        $fromNameSafe = str_replace(['"', "\r", "\n"], '', $fromName);
        $fromHeader = sprintf('"%s" <%s>', $fromNameSafe, $fromEmail);

        $bodyToSend = $htmlBody !== ''
            ? $htmlBody
            : nl2br(htmlspecialchars($textBody, ENT_QUOTES, 'UTF-8'));
        $headers = [
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=UTF-8',
            'From: ' . $fromHeader,
            'Reply-To: ' . $fromEmail,
            'X-Mailer: PHP/' . PHP_VERSION,
        ];

        $sent = @mail($recipientEmail, $subject, $bodyToSend, implode("\r\n", $headers));

        if ($sent) {
            return $this->logAndReturn(
                $contextKey,
                $recipientName,
                $recipientEmail,
                $subject,
                $htmlBody,
                'sent',
                null,
                $relatedType,
                $relatedId
            );
        }

        $error = error_get_last();
        $errorMessage = (string) ($error['message'] ?? 'Falha desconhecida no envio por mail().');

        return $this->logAndReturn(
            $contextKey,
            $recipientName,
            $recipientEmail,
            $subject,
            $htmlBody,
            'failed',
            $errorMessage,
            $relatedType,
            $relatedId
        );
    }

    private function logAndReturn(
        string $contextKey,
        string $recipientName,
        string $recipientEmail,
        string $subject,
        string $htmlBody,
        string $status,
        ?string $errorMessage,
        string $relatedType,
        int $relatedId
    ): array {
        $preview = mb_substr(trim(strip_tags($htmlBody)), 0, 250);

        try {
            $this->db->execute(
                'INSERT INTO email_dispatch_logs (
                    context_key, recipient_name, recipient_email, subject, body_preview, status, error_message, related_type, related_id
                 ) VALUES (
                    :context_key, :recipient_name, :recipient_email, :subject, :body_preview, :status, :error_message, :related_type, :related_id
                 )',
                [
                    'context_key' => $contextKey !== '' ? $contextKey : 'general',
                    'recipient_name' => $recipientName !== '' ? $recipientName : null,
                    'recipient_email' => $recipientEmail,
                    'subject' => $subject !== '' ? $subject : 'Mensagem do sistema',
                    'body_preview' => $preview !== '' ? $preview : null,
                    'status' => $status,
                    'error_message' => $errorMessage !== '' ? $errorMessage : null,
                    'related_type' => $relatedType !== '' ? $relatedType : null,
                    'related_id' => $relatedId > 0 ? $relatedId : null,
                ]
            );
        } catch (Throwable) {
            // Falha de log nao deve interromper fluxo.
        }

        return [
            'success' => $status === 'sent',
            'status' => $status,
            'error' => $errorMessage,
        ];
    }

    private function sanitizeHeader(string $value): string
    {
        $value = str_replace(["\r", "\n"], ' ', trim($value));

        return $value !== '' ? $value : 'Mensagem do sistema';
    }
}
