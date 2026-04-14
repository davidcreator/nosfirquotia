<?php

declare(strict_types=1);

namespace AureaQuotia\Cliente\Controller;

use AureaQuotia\Cliente\Model\ReferencePriceModel;
use AureaQuotia\Cliente\Model\RequestModel;

final class RequestController extends BaseClientController
{
    public function create(): void
    {
        $this->ensureClientAuthenticated();

        $referenceModel = new ReferencePriceModel($this->app);
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

        $personType = $this->sanitizePersonType((string) $this->request->post('client_person_type', 'pf'));
        $companyProfile = $personType === 'pj'
            ? $this->sanitizeCompanyProfile((string) $this->request->post('company_profile', ''))
            : '';

        $payload = [
            'project_title' => trim((string) $this->request->post('project_title', '')),
            'client_person_type' => $personType,
            'company_profile' => $companyProfile,
            'client_area' => $this->sanitizeArea((string) $this->request->post('client_area', '')),
            'requested_availability' => trim((string) $this->request->post('requested_availability', '')),
            'business_moment' => $this->sanitizeBusinessMoment((string) $this->request->post('business_moment', '')),
            'priority_channel' => $this->sanitizePriorityChannel((string) $this->request->post('priority_channel', '')),
            'project_priority' => $this->sanitizeProjectPriority((string) $this->request->post('project_priority', '')),
            'service_view_mode' => $this->sanitizeServiceViewMode((string) $this->request->post('service_view_mode', 'recommended')),
        ];

        $serviceIds = $this->normalizeServiceIds($this->request->post('service_ids', []));
        $this->session->set('old_input', array_merge($payload, ['service_ids' => $serviceIds]));

        $referenceModel = new ReferencePriceModel($this->app);
        $validServiceIds = $referenceModel->existingIds($serviceIds);

        $errors = [];

        if ($payload['project_title'] === '') {
            $errors[] = 'Informe o nome do projeto.';
        }

        if ($payload['client_area'] === '') {
            $errors[] = 'Selecione a area de atuacao.';
        }

        if ($personType === 'pj' && $payload['company_profile'] === '') {
            $errors[] = 'Selecione o porte da empresa.';
        }

        if ($payload['business_moment'] === '') {
            $errors[] = 'Selecione o momento do negocio.';
        }

        if ($payload['priority_channel'] === '') {
            $errors[] = 'Selecione o canal prioritario.';
        }

        if ($payload['project_priority'] === '') {
            $errors[] = 'Selecione a prioridade do projeto.';
        }

        if ($serviceIds === []) {
            $errors[] = 'Selecione pelo menos um servico para cotacao.';
        } elseif (count($validServiceIds) !== count($serviceIds)) {
            $errors[] = 'Existe um ou mais servicos invalidos na solicitacao.';
        }

        if ($errors !== []) {
            $this->session->flash('error', implode(' ', $errors));
            $this->redirect('/orcamento/novo');
        }

        $scope = $this->buildStructuredScope($payload, $validServiceIds, $referenceModel);

        $requestModel = new RequestModel($this->app);
        $requestId = $requestModel->create(
            (int) ($this->clientUser()['id'] ?? 0),
            [
                'project_title' => $payload['project_title'],
                'scope' => $scope,
                'desired_deadline_days' => null,
                'requested_availability' => $payload['requested_availability'] !== ''
                    ? $payload['requested_availability']
                    : null,
            ],
            $validServiceIds
        );

        $this->session->forgetMany(['old_input']);
        $this->session->flash('success', 'Solicitacao enviada. O admin ira gerar seu orcamento em breve.');
        $this->redirect('/orcamentos/' . $requestId);
    }

    public function index(): void
    {
        $this->ensureClientAuthenticated();

        $requestModel = new RequestModel($this->app);
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

        $requestModel = new RequestModel($this->app);
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

    private function normalizeServiceIds(mixed $raw): array
    {
        if (!is_array($raw)) {
            return [];
        }

        $ids = [];
        foreach ($raw as $value) {
            $id = (int) $value;
            if ($id > 0) {
                $ids[$id] = $id;
            }
        }

        return array_values($ids);
    }

    private function sanitizePersonType(string $personType): string
    {
        $personType = strtolower(trim($personType));
        return $personType === 'pj' ? 'pj' : 'pf';
    }

    private function sanitizeCompanyProfile(string $profile): string
    {
        $profile = strtolower(trim($profile));
        return in_array($profile, ['mei', 'pequena', 'media', 'grande'], true) ? $profile : '';
    }

    private function sanitizeArea(string $area): string
    {
        $area = strtolower(trim($area));
        $allowed = [
            'moda_beleza', 'alimentacao', 'saude', 'educacao', 'tecnologia',
            'comercio', 'servicos', 'imobiliario', 'eventos', 'industria', 'agro',
        ];

        return in_array($area, $allowed, true) ? $area : '';
    }

    private function sanitizeBusinessMoment(string $moment): string
    {
        $moment = strtolower(trim($moment));
        $allowed = ['estah_comecando', 'inicio', 'lancamento', 'crescimento', 'reposicionamento', 'padronizacao'];
        return in_array($moment, $allowed, true) ? $moment : '';
    }

    private function sanitizePriorityChannel(string $channel): string
    {
        $channel = strtolower(trim($channel));
        $allowed = ['digital', 'fisico', 'hibrido'];
        return in_array($channel, $allowed, true) ? $channel : '';
    }

    private function sanitizeProjectPriority(string $priority): string
    {
        $priority = strtolower(trim($priority));
        $allowed = ['equilibrio', 'inicio_rapido', 'detalhado'];
        return in_array($priority, $allowed, true) ? $priority : '';
    }

    private function sanitizeServiceViewMode(string $mode): string
    {
        $mode = strtolower(trim($mode));
        return in_array($mode, ['recommended', 'all'], true) ? $mode : 'recommended';
    }

    private function buildStructuredScope(array $payload, array $serviceIds, ReferencePriceModel $referenceModel): string
    {
        $personType = (string) ($payload['client_person_type'] ?? 'pf');
        $lines = [
            '[Briefing estruturado]',
            'Nome do projeto: ' . (string) ($payload['project_title'] ?? ''),
            'Tipo de cadastro: ' . $this->resolvePersonTypeLabel($personType),
        ];

        if ($personType === 'pj') {
            $lines[] = 'Porte da empresa: ' . $this->resolveCompanyProfileLabel((string) ($payload['company_profile'] ?? ''));
        }

        $lines[] = 'Area de atuacao: ' . $this->resolveAreaLabel((string) ($payload['client_area'] ?? ''));
        $lines[] = 'Disponibilidade esperada: ' . ($payload['requested_availability'] !== '' ? $payload['requested_availability'] : 'Nao informada');
        $lines[] = 'Momento do negocio: ' . $this->resolveBusinessMomentLabel((string) ($payload['business_moment'] ?? ''));
        $lines[] = 'Canal prioritario: ' . $this->resolvePriorityChannelLabel((string) ($payload['priority_channel'] ?? ''));
        $lines[] = 'Prioridade do projeto: ' . $this->resolveProjectPriorityLabel((string) ($payload['project_priority'] ?? ''));
        $lines[] = 'Visualizacao escolhida no passo 2: ' . $this->resolveServiceViewModeLabel((string) ($payload['service_view_mode'] ?? 'recommended'));
        $lines[] = '[Servicos selecionados]';

        $serviceLines = $this->resolveServiceLines($referenceModel, $serviceIds);
        if ($serviceLines === []) {
            $lines[] = '- Nenhum servico reconhecido.';
        } else {
            foreach ($serviceLines as $line) {
                $lines[] = '- ' . $line;
            }
        }

        $lines[] = '[Fim do briefing]';
        return implode("\n", $lines);
    }

    private function resolveServiceLines(ReferencePriceModel $referenceModel, array $serviceIds): array
    {
        $labels = [];

        foreach ($serviceIds as $serviceId) {
            $item = $referenceModel->findById((int) $serviceId);
            if ($item === null) {
                continue;
            }

            $label = trim(
                ((string) ($item['reference_code'] ?? '') !== '' ? '[' . (string) $item['reference_code'] . '] ' : '')
                . (string) ($item['service_name'] ?? '')
            );

            $groupName = trim((string) ($item['group_name'] ?? ''));
            if ($groupName !== '') {
                $label .= ' - ' . $groupName;
            }

            if ($label !== '') {
                $labels[] = $label;
            }
        }

        return $labels;
    }

    private function resolvePersonTypeLabel(string $personType): string
    {
        return $personType === 'pj' ? 'Pessoa Juridica' : 'Pessoa Fisica';
    }

    private function resolveCompanyProfileLabel(string $profile): string
    {
        $map = [
            'mei' => 'MEI',
            'pequena' => 'Pequena empresa',
            'media' => 'Media empresa',
            'grande' => 'Grande empresa',
        ];

        return $map[$profile] ?? 'Nao informado';
    }

    private function resolveAreaLabel(string $area): string
    {
        $map = [
            'moda_beleza' => 'Moda e beleza',
            'alimentacao' => 'Alimentacao e gastronomia',
            'saude' => 'Saude e bem-estar',
            'educacao' => 'Educacao e treinamentos',
            'tecnologia' => 'Tecnologia e software',
            'comercio' => 'Comercio e varejo',
            'servicos' => 'Servicos profissionais',
            'imobiliario' => 'Imobiliario e construcao',
            'eventos' => 'Eventos e entretenimento',
            'industria' => 'Industria e manufatura',
            'agro' => 'Agronegocio',
        ];

        return $map[$area] ?? 'Nao informado';
    }

    private function resolveBusinessMomentLabel(string $moment): string
    {
        $map = [
            'estah_comecando' => 'Esta comecando',
            'inicio' => 'Inicio',
            'lancamento' => 'Lancamento',
            'crescimento' => 'Crescimento / escalando o negocio',
            'reposicionamento' => 'Ajustes e reposicionamento da marca',
            'padronizacao' => 'Padronizacao da marca e processos da empresa',
        ];

        return $map[$moment] ?? 'Nao informado';
    }

    private function resolvePriorityChannelLabel(string $channel): string
    {
        $map = [
            'digital' => 'Digital',
            'fisico' => 'Fisico',
            'hibrido' => 'Hibrido',
        ];

        return $map[$channel] ?? 'Nao informado';
    }

    private function resolveProjectPriorityLabel(string $priority): string
    {
        $map = [
            'equilibrio' => 'Equilibrio entre prazo e qualidade',
            'inicio_rapido' => 'Inicio rapido',
            'detalhado' => 'Projeto mais detalhado',
        ];

        return $map[$priority] ?? 'Nao informado';
    }

    private function resolveServiceViewModeLabel(string $mode): string
    {
        return $mode === 'all'
            ? 'Mostrar todos os servicos'
            : 'Mostrar recomendados';
    }
}
