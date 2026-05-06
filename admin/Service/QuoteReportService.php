<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Service;

use NosfirQuotia\Admin\DTO\GenerateQuoteReportCommand;
use NosfirQuotia\Admin\DTO\GenerateQuoteReportResult;
use NosfirQuotia\Admin\Repository\QuoteRepositoryInterface;
use NosfirQuotia\System\Domain\Exception\DomainErrorCodes;
use NosfirQuotia\System\Domain\Exception\DomainNotFoundException;
use NosfirQuotia\System\Domain\Exception\DomainValidationException;

final class QuoteReportService
{
    public function __construct(
        private readonly QuoteRepositoryInterface $quoteRepository,
        private readonly QuoteReportMailerInterface $mailer
    ) {
    }

    public function generate(GenerateQuoteReportCommand $command): GenerateQuoteReportResult
    {
        try {
            $requestId = $command->requestId;
            $input = $command->input;

            $request = $this->quoteRepository->findRequest($requestId);
            if ($request === null) {
                throw DomainNotFoundException::forEntity(
                    'Solicitacao',
                    $requestId,
                    [],
                    DomainErrorCodes::QUOTE_REQUEST_NOT_FOUND
                );
            }

            $services = $this->quoteRepository->requestServices($requestId);
            $selectedProfile = $this->sanitizeCompanyProfile((string) ($input['company_profile'] ?? 'todos'));
            if ($selectedProfile !== 'todos') {
                $services = array_values(array_filter(
                    $services,
                    fn (array $service): bool => $this->matchesCompanyProfile(
                        $selectedProfile,
                        (string) ($service['company_profile'] ?? 'geral')
                    )
                ));
            }

            if ($services === []) {
                throw DomainValidationException::withErrors(
                    ['A solicitacao nao possui servicos selecionados para o perfil informado.'],
                    ['redirect' => '/admin/orcamentos/' . $requestId],
                    DomainErrorCodes::QUOTE_REPORT_VALIDATION
                );
            }

            $serviceRows = [];
            $errors = [];

            foreach ($services as $service) {
                $serviceId = (int) $service['id'];
                $amount = $this->toFloat((string) ($input['price_' . $serviceId] ?? ''));
                $deadlineRaw = trim((string) ($input['deadline_' . $serviceId] ?? ''));
                $deadlineDays = $deadlineRaw !== '' ? (int) $deadlineRaw : null;
                $availability = $this->sanitizeSingleLineText((string) ($input['availability_' . $serviceId] ?? ''), 120);
                $notes = $this->sanitizeMultilineText((string) ($input['notes_' . $serviceId] ?? ''), 2000);

                if ($amount === null || $amount <= 0) {
                    $errors[] = 'Informe um valor valido para o servico ' . (string) $service['service_name'] . '.';
                    continue;
                }

                if ($deadlineDays !== null && $deadlineDays < 1) {
                    $errors[] = 'Prazo invalido para o servico ' . (string) $service['service_name'] . '.';
                    continue;
                }

                if ($deadlineDays !== null && $deadlineDays > 3650) {
                    $errors[] = 'Prazo muito alto para o servico ' . (string) $service['service_name'] . '.';
                    continue;
                }

                $serviceRows[] = [
                    'reference_price_item_id' => $serviceId,
                    'service_name' => (string) $service['service_name'],
                    'price_value' => round($amount, 2),
                    'deadline_days' => $deadlineDays,
                    'availability_label' => $availability !== '' ? $availability : 'A combinar',
                    'notes' => $notes !== '' ? $notes : null,
                ];
            }

            if ($errors !== []) {
                throw DomainValidationException::withErrors(
                    $errors,
                    ['redirect' => '/admin/orcamentos/' . $requestId],
                    DomainErrorCodes::QUOTE_REPORT_VALIDATION
                );
            }

            $subtotal = 0.0;
            foreach ($serviceRows as $row) {
                $subtotal += (float) $row['price_value'];
            }

            $settings = $this->quoteRepository->taxSettings();
            $taxRows = [];
            $taxDefinitions = [
                [
                    'key' => 'imposto',
                    'default_label' => (string) ($settings['imposto_label'] ?? 'Impostos'),
                    'default_percent' => (float) ($settings['imposto_percent'] ?? 0),
                ],
                [
                    'key' => 'taxa',
                    'default_label' => (string) ($settings['taxa_label'] ?? 'Taxas'),
                    'default_percent' => (float) ($settings['taxa_percent'] ?? 0),
                ],
                [
                    'key' => 'encargo',
                    'default_label' => (string) ($settings['encargo_label'] ?? 'Encargos tributarios'),
                    'default_percent' => (float) ($settings['encargo_percent'] ?? 0),
                ],
            ];

            foreach ($taxDefinitions as $definition) {
                $key = (string) $definition['key'];
                $label = $this->sanitizeSingleLineText(
                    (string) ($input['tax_label_' . $key] ?? $definition['default_label']),
                    150
                );
                $percent = $this->toFloat((string) ($input['tax_percent_' . $key] ?? (string) $definition['default_percent']));

                if ($label === '') {
                    $errors[] = 'Informe o nome do campo tributario: ' . $key . '.';
                    continue;
                }

                if ($percent === null) {
                    $percent = 0.0;
                }

                if ($percent < 0 || $percent > 100) {
                    $errors[] = 'Percentual invalido para ' . $label . '. Use valores entre 0 e 100.';
                    continue;
                }

                if ($percent <= 0) {
                    continue;
                }

                $taxRows[] = [
                    'tax_key' => $key,
                    'tax_label' => $label,
                    'tax_percent' => round($percent, 2),
                    'tax_amount' => round($subtotal * ($percent / 100), 2),
                ];
            }

            if ($errors !== []) {
                throw DomainValidationException::withErrors(
                    $errors,
                    ['redirect' => '/admin/orcamentos/' . $requestId],
                    DomainErrorCodes::QUOTE_REPORT_VALIDATION
                );
            }

            $totalDeadlineRaw = trim((string) ($input['total_deadline_days'] ?? ''));
            $totalDeadline = $totalDeadlineRaw !== '' ? (int) $totalDeadlineRaw : null;
            if ($totalDeadline !== null && $totalDeadline < 1) {
                throw DomainValidationException::withErrors(
                    ['Prazo total do relatorio deve ser maior que zero.'],
                    ['redirect' => '/admin/orcamentos/' . $requestId],
                    DomainErrorCodes::QUOTE_REPORT_VALIDATION
                );
            }

            if ($totalDeadline !== null && $totalDeadline > 3650) {
                throw DomainValidationException::withErrors(
                    ['Prazo total do relatorio esta acima do limite permitido.'],
                    ['redirect' => '/admin/orcamentos/' . $requestId],
                    DomainErrorCodes::QUOTE_REPORT_VALIDATION
                );
            }

            $payload = [
                'total_deadline_days' => $totalDeadline,
                'availability_summary' => $this->sanitizeSingleLineText((string) ($input['availability_summary'] ?? ''), 180) ?: null,
                'report_notes' => $this->sanitizeMultilineText((string) ($input['report_notes'] ?? ''), 5000) ?: null,
                'show_tax_details' => $this->toBoolValue($input['show_tax_details'] ?? false),
            ];

            $manualPayloadParsed = $this->parseManualPayload((string) ($input['manual_brand_payload'] ?? ''));
            if (!$manualPayloadParsed['ok']) {
                throw DomainValidationException::withErrors(
                    [(string) $manualPayloadParsed['error']],
                    ['redirect' => '/admin/orcamentos/' . $requestId],
                    DomainErrorCodes::QUOTE_REPORT_VALIDATION
                );
            }

            $this->quoteRepository->createOrUpdateReport(
                $requestId,
                $command->adminUserId,
                $payload,
                $serviceRows,
                $taxRows
            );

            $warnings = [];
            $manualSaved = false;
            if (is_array($manualPayloadParsed['manual'])) {
                $manual = $manualPayloadParsed['manual'];
                $manualSaved = $this->quoteRepository->saveBrandManualReport(
                    $requestId,
                    $command->adminUserId,
                    (string) $manual['payload_json'],
                    (string) $manual['schema_version'],
                    (string) $manual['tool_source'],
                    $manual['generated_at']
                );

                if (!$manualSaved) {
                    $warnings[] = 'Relatorio salvo, mas nao foi possivel registrar o manual da marca no banco. Execute `php database/upgrade_brand_manual_mvp.php` e tente novamente.';
                }
            }

            $html = $this->buildClientReportReadyEmailHtml(
                (string) ($request['client_name'] ?? 'Cliente'),
                (string) ($request['project_title'] ?? 'Projeto'),
                $command->accountUrl
            );
            $text = $this->buildClientReportReadyEmailText(
                (string) ($request['client_name'] ?? 'Cliente'),
                (string) ($request['project_title'] ?? 'Projeto'),
                $command->accountUrl
            );

            $emailResult = $this->mailer->send(
                [
                    'context_key' => 'quote_report_ready',
                    'recipient_name' => (string) ($request['client_name'] ?? 'Cliente'),
                    'recipient_email' => (string) ($request['client_email'] ?? ''),
                    'subject' => 'Seu orcamento esta pronto no Quotia',
                    'html_body' => $html,
                    'text_body' => $text,
                    'related_type' => 'quote_request',
                    'related_id' => $requestId,
                ]
            );

            $visibilityLabel = !empty($payload['show_tax_details'])
                ? 'com detalhes de tributos visiveis para o cliente'
                : 'com detalhes de tributos ocultos para o cliente';

            $message = 'Relatorio de orcamento gerado com validade de 90 dias, ' . $visibilityLabel . '.';
            if ($manualSaved) {
                $message .= ' Manual da marca (MVP) atualizado com sucesso.';
            }

            $emailStatus = (string) ($emailResult['status'] ?? '');
            if ($emailStatus === 'sent') {
                $message .= ' Email enviado ao cliente com sucesso.';
            } elseif ($emailStatus === 'invalid_email') {
                $warnings[] = 'Relatorio salvo, mas o e-mail nao foi enviado porque o endereco do cliente e invalido.';
            } else {
                $warnings[] = 'Relatorio salvo, mas ocorreu problema no envio do e-mail. Verifique em Notificacoes de E-mail.';
            }

            return GenerateQuoteReportResult::success('/admin/orcamentos/' . $requestId, $message, $warnings);
        } catch (DomainNotFoundException $exception) {
            return GenerateQuoteReportResult::failure(
                '/admin/orcamentos',
                $exception->getMessage(),
                $exception->errorCode()
            );
        } catch (DomainValidationException $exception) {
            $details = $exception->details();
            $redirect = (string) ($details['redirect'] ?? '/admin/orcamentos/' . $command->requestId);
            return GenerateQuoteReportResult::failure(
                $redirect,
                implode(' ', $exception->errors()),
                $exception->errorCode()
            );
        }
    }

    /**
     * @return array{ok: bool, error?: string, manual?: array<string, mixed>|null}
     */
    private function parseManualPayload(string $manualPayloadRaw): array
    {
        $manualPayloadRaw = trim($manualPayloadRaw);
        if ($manualPayloadRaw === '') {
            return [
                'ok' => true,
                'manual' => null,
            ];
        }

        if (strlen($manualPayloadRaw) > 2_000_000) {
            return [
                'ok' => false,
                'error' => 'Payload do manual da marca excede o limite de 2 MB.',
                'manual' => null,
            ];
        }

        $decoded = json_decode($manualPayloadRaw, true);
        if (!is_array($decoded)) {
            return [
                'ok' => false,
                'error' => 'Payload do manual da marca invalido. Verifique o JSON antes de salvar.',
                'manual' => null,
            ];
        }

        return [
            'ok' => true,
            'manual' => [
                'schema_version' => $this->sanitizeText(
                    (string) ($decoded['schema'] ?? ''),
                    60,
                    'manual_brand_payload_v1'
                ),
                'tool_source' => $this->sanitizeText(
                    (string) ($decoded['source'] ?? ''),
                    80,
                    'manual_brand_payload'
                ),
                'generated_at' => $this->normalizeDateTimeForDatabase((string) ($decoded['generatedAt'] ?? '')),
                'payload_json' => $manualPayloadRaw,
            ],
        ];
    }

    private function sanitizeText(string $value, int $maxLength, string $fallback = ''): string
    {
        $normalized = trim($value);
        if ($normalized === '') {
            return $fallback;
        }

        return $this->limitTextLength($normalized, $maxLength);
    }

    private function sanitizeSingleLineText(string $value, int $maxLength): string
    {
        $normalized = trim($value);
        if ($normalized === '') {
            return '';
        }

        $normalized = preg_replace('/\s+/u', ' ', $normalized) ?? $normalized;
        $normalized = preg_replace('/[\x00-\x1F\x7F]/u', '', $normalized) ?? $normalized;

        return $this->limitTextLength($normalized, $maxLength);
    }

    private function sanitizeMultilineText(string $value, int $maxLength): string
    {
        $normalized = str_replace(["\r\n", "\r"], "\n", trim($value));
        if ($normalized === '') {
            return '';
        }

        $normalized = preg_replace('/[^\P{C}\n\t]/u', '', $normalized) ?? $normalized;

        return $this->limitTextLength($normalized, $maxLength);
    }

    private function limitTextLength(string $value, int $maxLength): string
    {
        if ($maxLength < 1) {
            return '';
        }

        if (function_exists('mb_substr')) {
            return (string) mb_substr($value, 0, $maxLength, 'UTF-8');
        }

        return substr($value, 0, $maxLength);
    }

    private function normalizeDateTimeForDatabase(string $raw): ?string
    {
        $value = trim($raw);
        if ($value === '') {
            return null;
        }

        $timestamp = strtotime($value);
        if ($timestamp === false) {
            return null;
        }

        return date('Y-m-d H:i:s', $timestamp);
    }

    private function toFloat(string $value): ?float
    {
        $value = trim($value);
        if ($value === '') {
            return null;
        }

        $normalized = str_replace([' ', ','], ['', '.'], $value);
        $normalized = preg_replace('/[^0-9.\-]/', '', $normalized) ?? '';

        if (substr_count($normalized, '.') > 1) {
            $lastDot = strrpos($normalized, '.');
            $whole = str_replace('.', '', substr($normalized, 0, $lastDot));
            $fraction = substr($normalized, $lastDot + 1);
            $normalized = $whole . '.' . $fraction;
        }

        return is_numeric($normalized) ? (float) $normalized : null;
    }

    private function toBoolValue(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        $normalized = strtolower(trim((string) $value));

        return in_array($normalized, ['1', 'true', 'on', 'sim', 'yes'], true);
    }

    private function sanitizeCompanyProfile(string $profile): string
    {
        $profile = strtolower(trim($profile));
        $allowed = ['todos', 'mei', 'microempresa', 'pequena', 'media', 'grande'];

        if (!in_array($profile, $allowed, true)) {
            return 'todos';
        }

        return $profile;
    }

    private function matchesCompanyProfile(string $selectedProfile, string $serviceProfile): bool
    {
        $serviceProfile = strtolower(trim($serviceProfile));
        if ($selectedProfile === 'todos') {
            return true;
        }

        if ($serviceProfile === '' || $serviceProfile === 'geral') {
            return true;
        }

        return $selectedProfile === $serviceProfile;
    }

    private function buildClientReportReadyEmailHtml(string $name, string $projectTitle, string $accountUrl): string
    {
        $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeProject = htmlspecialchars($projectTitle, ENT_QUOTES, 'UTF-8');
        $safeUrl = htmlspecialchars($accountUrl, ENT_QUOTES, 'UTF-8');

        return <<<HTML
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
  <h2 style="margin: 0 0 12px 0;">Seu orcamento esta pronto</h2>
  <p>Ola {$safeName},</p>
  <p>Seu orcamento referente ao projeto <strong>{$safeProject}</strong> ja esta disponivel no Quotia.</p>
  <p>Acesse sua conta para visualizar valores, prazos e disponibilidade:</p>
  <p>
    <a href="{$safeUrl}" style="display: inline-block; background: #1a4b8f; color: #fff; text-decoration: none; padding: 10px 14px; border-radius: 6px;">
      Acessar minha conta
    </a>
  </p>
  <p>Se voce nao reconhece esta notificacao, entre em contato com a equipe de atendimento.</p>
</div>
HTML;
    }

    private function buildClientReportReadyEmailText(string $name, string $projectTitle, string $accountUrl): string
    {
        return "Ola {$name},\n\n"
            . "Seu orcamento referente ao projeto \"{$projectTitle}\" ja esta disponivel no Quotia.\n"
            . "Acesse sua conta para visualizar os detalhes:\n{$accountUrl}\n\n"
            . "Obrigado.\n";
    }
}
