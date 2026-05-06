<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Controller;

use NosfirQuotia\Admin\DTO\GenerateQuoteReportCommand;
use NosfirQuotia\Admin\Model\QuoteModel;
use NosfirQuotia\Admin\Service\QuoteReportService;

final class QuoteController extends BaseAdminController
{
    public function index(): void
    {
        $this->ensurePermission('quotes.manage');

        /** @var QuoteModel $model */
        $model = $this->make(QuoteModel::class);
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

        /** @var QuoteModel $model */
        $model = $this->make(QuoteModel::class);
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
        /** @var QuoteModel $model */
        $model = $this->make(QuoteModel::class);
        $request = $model->find($requestId);

        if ($request === null) {
            $this->session->flash('error', 'Solicitacao nao encontrada.');
            $this->redirect('/admin/orcamentos');
        }

        $manual = $model->brandManual($requestId);
        $payloadJsonRaw = (string) ($manual['payload_json'] ?? '');
        if (trim($payloadJsonRaw) === '') {
            $this->session->flash('warning', 'Nao existe manual da marca salvo para download nesta solicitacao.');
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
        $adminUserId = (int) ($this->adminUser()['id'] ?? 0);

        /** @var QuoteReportService $service */
        $service = $this->make(QuoteReportService::class);

        $result = $service->generate(
            new GenerateQuoteReportCommand(
                $requestId,
                $adminUserId,
                $this->app->absoluteUrl('/cliente/login'),
                $this->request->all()
            )
        );

        if (!$result->ok) {
            $this->logAdminSecurityWarning(
                'admin_quote_report_generation_failed',
                [
                    'request_id' => $requestId,
                    'error_code' => (string) ($result->errorCode ?? ''),
                ]
            );
            $this->session->flash('error', $result->errorMessage ?? 'Nao foi possivel gerar o relatorio.');
            $this->redirect($result->redirect);
        }

        if ($result->warnings !== []) {
            $this->logAdminSecurityWarning(
                'admin_quote_report_generation_warning',
                [
                    'request_id' => $requestId,
                    'warning_count' => count($result->warnings),
                ]
            );
            $this->session->flash('warning', implode(' ', $result->warnings));
        }

        $this->logAdminSecurityInfo(
            'admin_quote_report_generated',
            [
                'request_id' => $requestId,
            ]
        );
        $this->session->flash('success', $result->successMessage ?? 'Relatorio de orcamento gerado com sucesso.');
        $this->redirect($result->redirect);
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
}
