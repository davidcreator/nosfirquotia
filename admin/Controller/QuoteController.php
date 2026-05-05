<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\Model\QuoteModel;
use NosfirQuotia\System\Library\EmailService;

final class QuoteController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('quotes.manage');

        $model = new QuoteModel($this->app);
        $requests = $model->all();

        $this->render(
            'admin/View/quotes/index',
            [
                'requests' => $requests,
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }

    public function show(string $id): void
    {
        $this->ensurePermission('quotes.manage');

        $model = new QuoteModel($this->app);
        $request = $model->find((int) $id);

        if ($request === null) {
            $this->session->flash('error', 'Solicitação não encontrada.');
            $this->redirect('/admin/orcamentos');
        }

        $services = $model->requestServices((int) $request['id']);
        $reportItems = [];
        $reportTaxes = [];

        if (!empty($request['report_id'])) {
            $reportItems = $model->reportItems((int) $request['report_id']);
            $reportTaxes = $model->reportTaxes((int) $request['report_id']);
        }

        $brandManual = $model->brandManual((int) $request['id']);
        $taxSettings = $model->taxSettings();

        $this->render(
            'admin/View/quotes/show',
            [
                'requestData' => $request,
                'services' => $services,
                'reportItems' => $reportItems,
                'reportTaxes' => $reportTaxes,
                'brandManual' => $brandManual,
                'taxSettings' => $taxSettings,
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }

    public function downloadBrandManual(string $id): void
    {
        $this->ensurePermission('quotes.manage');

        $requestId = (int) $id;
        $model = new QuoteModel($this->app);
        $request = $model->find($requestId);

        if ($request === null) {
            $this->session->flash('error', 'Solicitação não encontrada.');
            $this->redirect('/admin/orcamentos');
        }

        $manual = $model->brandManual($requestId);
        $payloadJsonRaw = (string) ($manual['payload_json'] ?? '');
        if (trim($payloadJsonRaw) === '') {
            $this->session->flash('warning', 'Não existe manual da marca salvo para download nesta solicitação.');
            $this->redirect('/admin/orcamentos/' . $requestId);
        }

        $fileName = $this->buildBrandManualFileName(
            (string) ($request['project_title'] ?? ''),
            $requestId,
            (string) ($manual['generated_at'] ?? ($manual['updated_at'] ?? ($manual['created_at'] ?? '')))
        );

        header('Content-Type: application/json; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: private, max-age=0, no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        echo $payloadJsonRaw;
        exit;
    }

    public function generateReport(string $id): void
    {
        $this->ensurePermission('quotes.manage');

        $requestId = (int) $id;
        $model = new QuoteModel($this->app);
        $request = $model->find($requestId);

        if ($request === null) {
            $this->session->flash('error', 'Solicitação não encontrada.');
            $this->redirect('/admin/orcamentos');
        }

        $services = $model->requestServices($requestId);
        $selectedProfile = $this->sanitizeCompanyProfile((string) $this->request->post('company_profile', 'todos'));
        if ($selectedProfile !== 'todos') {
            $services = array_values(array_filter(
                $services,
                fn (array $service): bool => $this->matchesCompanyProfile($selectedProfile, (string) ($service['company_profile'] ?? 'geral'))
            ));
        }

        if ($services === []) {
            $this->session->flash('error', 'A solicitação não possui serviços selecionados para o perfil informado.');
            $this->redirect('/admin/orcamentos/' . $requestId);
        }

        $serviceRows = [];
        $errors = [];

        foreach ($services as $service) {
            $serviceId = (int) $service['id'];
            $amount = $this->toFloat($this->request->post('price_' . $serviceId, ''));
            $deadlineRaw = trim((string) $this->request->post('deadline_' . $serviceId, ''));
            $deadlineDays = $deadlineRaw !== '' ? (int) $deadlineRaw : null;
            $availability = $this->sanitizeSingleLineText((string) $this->request->post('availability_' . $serviceId, ''), 120);
            $notes = $this->sanitizeMultilineText((string) $this->request->post('notes_' . $serviceId, ''), 2000);

            if ($amount === null || $amount <= 0) {
                $errors[] = 'Informe um valor válido para o serviço ' . $service['service_name'] . '.';
                continue;
            }

            if ($deadlineDays !== null && $deadlineDays < 1) {
                $errors[] = 'Prazo inválido para o serviço ' . $service['service_name'] . '.';
                continue;
            }
            if ($deadlineDays !== null && $deadlineDays > 3650) {
                $errors[] = 'Prazo muito alto para o serviço ' . $service['service_name'] . '.';
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
            $this->session->flash('error', implode(' ', $errors));
            $this->redirect('/admin/orcamentos/' . $requestId);
        }

        $subtotal = 0.0;
        foreach ($serviceRows as $row) {
            $subtotal += (float) $row['price_value'];
        }

        $settings = $model->taxSettings();
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
            $key = $definition['key'];
            $label = $this->sanitizeSingleLineText((string) $this->request->post('tax_label_' . $key, $definition['default_label']), 150);
            $percent = $this->toFloat((string) $this->request->post('tax_percent_' . $key, (string) $definition['default_percent']));

            if ($label === '') {
                $errors[] = 'Informe o nome do campo tributário: ' . $key . '.';
                continue;
            }

            if ($percent === null) {
                $percent = 0.0;
            }

            if ($percent < 0 || $percent > 100) {
                $errors[] = 'Percentual inválido para ' . $label . '. Use valores entre 0 e 100.';
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
            $this->session->flash('error', implode(' ', $errors));
            $this->redirect('/admin/orcamentos/' . $requestId);
        }

        $totalDeadlineRaw = trim((string) $this->request->post('total_deadline_days', ''));
        $totalDeadline = $totalDeadlineRaw !== '' ? (int) $totalDeadlineRaw : null;
        if ($totalDeadline !== null && $totalDeadline < 1) {
            $this->session->flash('error', 'Prazo total do relatório deve ser maior que zero.');
            $this->redirect('/admin/orcamentos/' . $requestId);
        }
        if ($totalDeadline !== null && $totalDeadline > 3650) {
            $this->session->flash('error', 'Prazo total do relatório está acima do limite permitido.');
            $this->redirect('/admin/orcamentos/' . $requestId);
        }

        $payload = [
            'total_deadline_days' => $totalDeadline,
            'availability_summary' => $this->sanitizeSingleLineText((string) $this->request->post('availability_summary', ''), 180) ?: null,
            'report_notes' => $this->sanitizeMultilineText((string) $this->request->post('report_notes', ''), 5000) ?: null,
            'show_tax_details' => $this->toBoolValue($this->request->post('show_tax_details', false)),
        ];

        $manualPayloadRaw = trim((string) $this->request->post('manual_brand_payload', ''));
        $manualPayloadParsed = null;
        if ($manualPayloadRaw !== '') {
            if (strlen($manualPayloadRaw) > 2_000_000) {
                $this->session->flash('error', 'Payload do manual da marca excede o limite de 2 MB.');
                $this->redirect('/admin/orcamentos/' . $requestId);
            }

            $decoded = json_decode($manualPayloadRaw, true);
            if (!is_array($decoded)) {
                $this->session->flash('error', 'Payload do manual da marca inválido. Verifique o JSON antes de salvar.');
                $this->redirect('/admin/orcamentos/' . $requestId);
            }

            $manualPayloadParsed = [
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
            ];
        }

        $model->createOrUpdateReport(
            $requestId,
            (int) ($this->adminUser()['id'] ?? 0),
            $payload,
            $serviceRows,
            $taxRows
        );

        $warnings = [];
        $manualSaved = false;
        if (is_array($manualPayloadParsed)) {
            $manualSaved = $model->saveBrandManualReport(
                $requestId,
                (int) ($this->adminUser()['id'] ?? 0),
                (string) $manualPayloadParsed['payload_json'],
                (string) $manualPayloadParsed['schema_version'],
                (string) $manualPayloadParsed['tool_source'],
                $manualPayloadParsed['generated_at']
            );

            if (!$manualSaved) {
                $warnings[] = 'Relatório salvo, mas não foi possível registrar o manual da marca no banco. Execute `php database/upgrade_brand_manual_mvp.php` e tente novamente.';
            }
        }

        $emailService = new EmailService($this->db(), (array) $this->app->config('mail', []));
        $accountUrl = rtrim($this->request->fullBaseUrl(), '/') . '/cliente/login';
        $html = $this->buildClientReportReadyEmailHtml(
            (string) ($request['client_name'] ?? 'Cliente'),
            (string) ($request['project_title'] ?? 'Projeto'),
            $accountUrl
        );
        $text = $this->buildClientReportReadyEmailText(
            (string) ($request['client_name'] ?? 'Cliente'),
            (string) ($request['project_title'] ?? 'Projeto'),
            $accountUrl
        );

        $emailResult = $emailService->send(
            [
                'context_key' => 'quote_report_ready',
                'recipient_name' => (string) ($request['client_name'] ?? 'Cliente'),
                'recipient_email' => (string) ($request['client_email'] ?? ''),
                'subject' => 'Seu orçamento está pronto no Quotia',
                'html_body' => $html,
                'text_body' => $text,
                'related_type' => 'quote_request',
                'related_id' => $requestId,
            ]
        );

        $visibilityLabel = !empty($payload['show_tax_details'])
            ? 'com detalhes de tributos visíveis para o cliente'
            : 'com detalhes de tributos ocultos para o cliente';

        $message = 'Relatório de orçamento gerado com validade de 90 dias, ' . $visibilityLabel . '.';
        if ($manualSaved) {
            $message .= ' Manual da marca (MVP) atualizado com sucesso.';
        }
        $emailStatus = (string) ($emailResult['status'] ?? '');
        if ($emailStatus === 'sent') {
            $message .= ' Email enviado ao cliente com sucesso.';
        } elseif ($emailStatus === 'invalid_email') {
            $warnings[] = 'Relatório salvo, mas o e-mail não foi enviado porque o endereço do cliente é inválido.';
        } else {
            $warnings[] = 'Relatório salvo, mas ocorreu problema no envio do e-mail. Verifique em Notificações de E-mail.';
        }

        if ($warnings !== []) {
            $this->session->flash('warning', implode(' ', $warnings));
        }
        $this->session->flash('success', $message);
        $this->redirect('/admin/orcamentos/' . $requestId);
    }

    private function sanitizeText(string $value, int $maxLength, string $fallback = ''): string
    {
        $normalized = trim($value);
        if ($normalized === '') {
            return $fallback;
        }

        if (function_exists('mb_substr')) {
            return (string) mb_substr($normalized, 0, $maxLength, 'UTF-8');
        }

        return substr($normalized, 0, $maxLength);
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

    private function buildBrandManualFileName(string $projectTitle, int $requestId, string $rawDateTime): string
    {
        $projectSlug = $this->sanitizeFileSlug($projectTitle);
        if ($projectSlug === '') {
            $projectSlug = 'solicitacao-' . $requestId;
        }

        $timestamp = strtotime(trim($rawDateTime));
        $dateLabel = $timestamp !== false ? date('Ymd-His', $timestamp) : date('Ymd-His');

        return 'manual-marca-' . $projectSlug . '-id' . $requestId . '-' . $dateLabel . '.json';
    }

    private function sanitizeFileSlug(string $value): string
    {
        $normalized = strtolower(trim($value));
        if ($normalized === '') {
            return '';
        }

        $normalized = preg_replace('/[^a-z0-9]+/', '-', $normalized) ?? '';
        $normalized = trim($normalized, '-');

        if ($normalized === '') {
            return '';
        }

        if (function_exists('mb_substr')) {
            return (string) mb_substr($normalized, 0, 60, 'UTF-8');
        }

        return substr($normalized, 0, 60);
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
  <h2 style="margin: 0 0 12px 0;">Seu orçamento está pronto</h2>
  <p>Olá {$safeName},</p>
  <p>Seu orçamento referente ao projeto <strong>{$safeProject}</strong> já está disponível no Quotia.</p>
  <p>Acesse sua conta para visualizar valores, prazos e disponibilidade:</p>
  <p>
    <a href="{$safeUrl}" style="display: inline-block; background: #1a4b8f; color: #fff; text-decoration: none; padding: 10px 14px; border-radius: 6px;">
      Acessar minha conta
    </a>
  </p>
  <p>Se você não reconhece esta notificação, entre em contato com a equipe de atendimento.</p>
</div>
HTML;
    }

    private function buildClientReportReadyEmailText(string $name, string $projectTitle, string $accountUrl): string
    {
        return "Olá {$name},\n\n" .
            "Seu orçamento referente ao projeto \"{$projectTitle}\" já está disponível no Quotia.\n" .
            "Acesse sua conta para visualizar os detalhes:\n{$accountUrl}\n\n" .
            "Obrigado.\n";
    }
}
