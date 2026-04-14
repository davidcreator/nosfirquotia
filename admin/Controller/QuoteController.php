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
            $this->session->flash('error', 'Solicitacao nao encontrada.');
            $this->redirect('/admin/orcamentos');
        }

        $services = $model->requestServices((int) $request['id']);
        $reportItems = [];
        $reportTaxes = [];

        if (!empty($request['report_id'])) {
            $reportItems = $model->reportItems((int) $request['report_id']);
            $reportTaxes = $model->reportTaxes((int) $request['report_id']);
        }

        $taxSettings = $model->taxSettings();

        $this->render(
            'admin/View/quotes/show',
            [
                'requestData' => $request,
                'services' => $services,
                'reportItems' => $reportItems,
                'reportTaxes' => $reportTaxes,
                'taxSettings' => $taxSettings,
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }

    public function generateReport(string $id): void
    {
        $this->ensurePermission('quotes.manage');

        $requestId = (int) $id;
        $model = new QuoteModel($this->app);
        $request = $model->find($requestId);

        if ($request === null) {
            $this->session->flash('error', 'Solicitacao nao encontrada.');
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
            $this->session->flash('error', 'A solicitacao nao possui servicos selecionados para o perfil informado.');
            $this->redirect('/admin/orcamentos/' . $requestId);
        }

        $serviceRows = [];
        $errors = [];

        foreach ($services as $service) {
            $serviceId = (int) $service['id'];
            $amount = $this->toFloat($this->request->post('price_' . $serviceId, ''));
            $deadlineRaw = trim((string) $this->request->post('deadline_' . $serviceId, ''));
            $deadlineDays = $deadlineRaw !== '' ? (int) $deadlineRaw : null;
            $availability = trim((string) $this->request->post('availability_' . $serviceId, ''));
            $notes = trim((string) $this->request->post('notes_' . $serviceId, ''));

            if ($amount === null || $amount <= 0) {
                $errors[] = 'Informe um valor valido para o servico ' . $service['service_name'] . '.';
                continue;
            }

            if ($deadlineDays !== null && $deadlineDays < 1) {
                $errors[] = 'Prazo invalido para o servico ' . $service['service_name'] . '.';
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
            $label = trim((string) $this->request->post('tax_label_' . $key, $definition['default_label']));
            $percent = $this->toFloat((string) $this->request->post('tax_percent_' . $key, (string) $definition['default_percent']));

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
            $this->session->flash('error', implode(' ', $errors));
            $this->redirect('/admin/orcamentos/' . $requestId);
        }

        $totalDeadlineRaw = trim((string) $this->request->post('total_deadline_days', ''));
        $totalDeadline = $totalDeadlineRaw !== '' ? (int) $totalDeadlineRaw : null;
        if ($totalDeadline !== null && $totalDeadline < 1) {
            $this->session->flash('error', 'Prazo total do relatorio deve ser maior que zero.');
            $this->redirect('/admin/orcamentos/' . $requestId);
        }

        $payload = [
            'total_deadline_days' => $totalDeadline,
            'availability_summary' => trim((string) $this->request->post('availability_summary', '')) ?: null,
            'report_notes' => trim((string) $this->request->post('report_notes', '')) ?: null,
            'show_tax_details' => (bool) $this->request->post('show_tax_details', false),
        ];

        $reportId = $model->createOrUpdateReport(
            $requestId,
            (int) ($this->adminUser()['id'] ?? 0),
            $payload,
            $serviceRows,
            $taxRows
        );

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
                'subject' => 'Seu orcamento esta pronto no Nosfir Quotia',
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
        $emailStatus = (string) ($emailResult['status'] ?? '');
        if ($emailStatus === 'sent') {
            $message .= ' Email enviado ao cliente com sucesso.';
        } elseif ($emailStatus === 'invalid_email') {
            $this->session->flash('warning', 'Relatorio salvo, mas o email nao foi enviado porque o endereco do cliente e invalido.');
        } else {
            $this->session->flash('warning', 'Relatorio salvo, mas ocorreu problema no envio do email. Verifique em Notificacoes de Email.');
        }

        $this->session->flash('success', $message);
        $this->redirect('/admin/orcamentos/' . $requestId);
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
  <h2 style="margin: 0 0 12px 0;">Seu orcamento esta pronto</h2>
  <p>Ola {$safeName},</p>
  <p>Seu orcamento referente ao projeto <strong>{$safeProject}</strong> ja esta disponivel no Nosfir Quotia.</p>
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
        return "Ola {$name},\n\n" .
            "Seu orcamento referente ao projeto \"{$projectTitle}\" ja esta disponivel no Nosfir Quotia.\n" .
            "Acesse sua conta para visualizar os detalhes:\n{$accountUrl}\n\n" .
            "Obrigado.\n";
    }
}
