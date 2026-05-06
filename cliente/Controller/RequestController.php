<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Controller;

use NosfirQuotia\Cliente\DTO\SubmitQuoteRequestCommand;
use NosfirQuotia\Cliente\Model\ReferencePriceModel;
use NosfirQuotia\Cliente\Model\RequestModel;
use NosfirQuotia\Cliente\Service\QuoteRequestService;

final class RequestController extends BaseClientController
{
    public function create(): void
    {
        $this->ensureClientAuthenticated();

        /** @var ReferencePriceModel $referenceModel */
        $referenceModel = $this->make(ReferencePriceModel::class);
        $serviceCatalogs = $referenceModel->groupedForRequest();

        $this->render(
            'cliente/View/requests/create',
            [
                'serviceCatalogs' => $serviceCatalogs,
                'clientUser' => $this->clientUser(),
            ],
            'cliente/View/layout'
        );
    }

    public function store(): void
    {
        $this->ensureClientAuthenticated();

        /** @var QuoteRequestService $service */
        $service = $this->make(QuoteRequestService::class);
        $result = $service->validateAndCreate(
            new SubmitQuoteRequestCommand(
                (int) ($this->clientUser()['id'] ?? 0),
                $this->request->all()
            )
        );

        if (!$result->ok) {
            $this->logClientSecurityWarning(
                'client_quote_request_validation_failed',
                [
                    'error_code' => (string) ($result->errorCode ?? ''),
                    'error_count' => count($result->errors),
                ]
            );
            $this->session->set('old_input', $result->oldInput);
            $this->session->flash('error', implode(' ', $result->errors));
            $this->redirect('/orcamento/novo');
        }

        $this->session->forgetMany(['old_input']);
        $this->logClientSecurityInfo(
            'client_quote_request_submitted',
            [
                'request_id' => (int) ($result->requestId ?? 0),
            ]
        );
        $this->session->flash('success', 'Solicitacao enviada. O admin ira gerar seu orcamento em breve.');
        $this->redirect('/orcamentos/' . $result->requestId);
    }

    public function index(): void
    {
        $this->ensureClientAuthenticated();

        /** @var RequestModel $requestModel */
        $requestModel = $this->make(RequestModel::class);
        $requests = $requestModel->allByClient((int) ($this->clientUser()['id'] ?? 0));

        $this->render(
            'cliente/View/requests/index',
            [
                'requests' => $requests,
                'clientUser' => $this->clientUser(),
            ],
            'cliente/View/layout'
        );
    }

    public function show(string $id): void
    {
        $this->ensureClientAuthenticated();

        /** @var RequestModel $requestModel */
        $requestModel = $this->make(RequestModel::class);
        $request = $requestModel->findByClient((int) $id, (int) ($this->clientUser()['id'] ?? 0));

        if ($request === null) {
            $this->session->flash('error', 'Solicitacao nao encontrada.');
            $this->redirect('/orcamentos');
        }

        $services = $requestModel->requestServices((int) $request['id']);
        $reportItems = [];
        $reportTaxes = [];

        if (!empty($request['report_id'])) {
            $reportItems = $requestModel->reportItems((int) $request['report_id']);
            if (!empty($request['show_tax_details'])) {
                $reportTaxes = $requestModel->reportTaxes((int) $request['report_id']);
            }
        }

        $this->render(
            'cliente/View/requests/show',
            [
                'requestData' => $request,
                'services' => $services,
                'reportItems' => $reportItems,
                'reportTaxes' => $reportTaxes,
                'clientUser' => $this->clientUser(),
            ],
            'cliente/View/layout'
        );
    }
}
