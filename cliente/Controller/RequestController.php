<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Controller;

use NosfirQuotia\Cliente\Model\ReferencePriceModel;
use NosfirQuotia\Cliente\Model\RequestModel;

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
            'project_title' => $this->sanitizeSingleLineText((string) $this->request->post('project_title', ''), 180),
            'client_person_type' => $personType,
            'company_profile' => $companyProfile,
            'client_area' => $this->sanitizeArea((string) $this->request->post('client_area', '')),
            'client_area_other' => $this->sanitizeSingleLineText((string) $this->request->post('client_area_other', ''), 160),
            'service_category' => $this->sanitizeServiceCategory((string) $this->request->post('service_category', '')),
            'requested_availability' => $this->sanitizeSingleLineText((string) $this->request->post('requested_availability', ''), 150),
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
            $errors[] = 'Selecione a área de atuação.';
        } elseif ($payload['client_area'] === 'outros' && $payload['client_area_other'] === '') {
            $errors[] = 'Descreva sua área de atuação ou serviço.';
        }
        
        if ($payload['service_category'] === '') {
            $errors[] = 'Selecione o serviço principal.';
        }

        if ($personType === 'pj' && $payload['company_profile'] === '') {
            $errors[] = 'Selecione o porte da empresa.';
        }

        if ($payload['business_moment'] === '') {
            $errors[] = 'Selecione o momento do negócio.';
        }

        if ($payload['priority_channel'] === '') {
            $errors[] = 'Selecione o canal prioritário.';
        }

        if ($payload['project_priority'] === '') {
            $errors[] = 'Selecione a prioridade do projeto.';
        }

        if ($serviceIds === []) {
            $errors[] = 'Selecione pelo menos um serviço para cotação.';
        } elseif (count($validServiceIds) !== count($serviceIds)) {
            $errors[] = 'Existe um ou mais serviços inválidos na solicitação.';
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
        $this->session->flash('success', 'Solicitação enviada. O admin irá gerar seu orçamento em breve.');
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
            $this->session->flash('error', 'Solicitação não encontrada.');
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
            'comercio', 'servicos', 'imobiliario', 'eventos', 'industria', 'agro', 'outros',
        ];

        return in_array($area, $allowed, true) ? $area : '';
    }

    private function sanitizeServiceCategory(string $category): string
    {
        $category = strtolower(trim($category));
        $allowed = [
            'criacao_logo', 'criacao_naming', 'criacao_marca_completa',
            'piv', 'manual_identidade', 'papelaria',
            'branding', 'consultoria_design', 'mentoria_design',
            'pecas_promocionais', 'pdv', 'sinalizacao', 'midia_externa',
            'redes_sociais', 'ux_ui', 'email_marketing', 'apresentacoes',
            'ilustracao', 'tipografia', 'embalagem', 'vestuario',
            // Suporte legado
            'recriar_logo', 'identidade_visual', 'naming', 'criar_tipografia', 'criar_ilustracao'
        ];
        return in_array($category, $allowed, true) ? $category : '';
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

        $areaLabel = $this->resolveAreaLabel((string) ($payload['client_area'] ?? ''));
        if (($payload['client_area'] ?? '') === 'outros' && ($payload['client_area_other'] ?? '') !== '') {
            $areaLabel .= ': ' . $payload['client_area_other'];
        }
        $lines[] = 'Área de atuação: ' . $areaLabel;
        $lines[] = 'Serviço principal desejado: ' . $this->resolveServiceCategoryLabel((string) ($payload['service_category'] ?? ''));
        $lines[] = 'Disponibilidade esperada: ' . ($payload['requested_availability'] !== '' ? $payload['requested_availability'] : 'Não informada');
        $lines[] = 'Momento do negócio: ' . $this->resolveBusinessMomentLabel((string) ($payload['business_moment'] ?? ''));
        $lines[] = 'Canal prioritário: ' . $this->resolvePriorityChannelLabel((string) ($payload['priority_channel'] ?? ''));
        $lines[] = 'Prioridade do projeto: ' . $this->resolveProjectPriorityLabel((string) ($payload['project_priority'] ?? ''));
        $lines[] = 'Visualização escolhida no passo 2: ' . $this->resolveServiceViewModeLabel((string) ($payload['service_view_mode'] ?? 'recommended'));
        $lines[] = '[Serviços selecionados]';

        $serviceLines = $this->resolveServiceLines($referenceModel, $serviceIds);
        if ($serviceLines === []) {
            $lines[] = '- Nenhum serviço reconhecido.';
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
        return $personType === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física';
    }

    private function resolveCompanyProfileLabel(string $profile): string
    {
        $map = [
            'mei' => 'MEI',
            'pequena' => 'Pequena empresa',
            'media' => 'Média empresa',
            'grande' => 'Grande empresa',
        ];

        return $map[$profile] ?? 'Não informado';
    }

    private function resolveAreaLabel(string $area): string
    {
        $map = [
            'moda_beleza' => 'Moda e beleza',
            'alimentacao' => 'Alimentação e gastronomia',
            'saude' => 'Saúde e bem-estar',
            'educacao' => 'Educação e treinamentos',
            'tecnologia' => 'Tecnologia e software',
            'comercio' => 'Comércio e varejo',
            'servicos' => 'Serviços profissionais',
            'imobiliario' => 'Imobiliário e construção',
            'eventos' => 'Eventos e entretenimento',
            'industria' => 'Indústria e manufatura',
            'agro' => 'Agronegócio',
            'outros' => 'Outros',
        ];

        return $map[$area] ?? 'Não informada';
    }

    private function resolveServiceCategoryLabel(string $category): string
    {
        $map = [
            'criacao_logo'           => 'Criação de Logo',
            'criacao_naming'         => 'Criação de Nome',
            'criacao_marca_completa' => 'Marca Completa (Logo + Conceito)',
            'piv'                    => 'Projeto de Identidade Visual (PIV)',
            'manual_identidade'      => 'Manual de Identidade Visual',
            'papelaria'              => 'Papelaria Institucional',
            'branding'               => 'Branding e Gestão de Marca',
            'consultoria_design'     => 'Consultoria em Design',
            'mentoria_design'        => 'Mentoria em Design',
            'pecas_promocionais'     => 'Peças Promocionais',
            'pdv'                    => 'Design para PDV',
            'sinalizacao'            => 'Sinalização',
            'midia_externa'          => 'Mídia Interna e Externa',
            'redes_sociais'          => 'Design para Redes Sociais',
            'ux_ui'                  => 'UX/UI Design',
            'email_marketing'        => 'E-mail Marketing',
            'apresentacoes'          => 'Apresentações e Multimídia',
            'ilustracao'             => 'Ilustração',
            'tipografia'             => 'Tipografia Personalizada',
            'embalagem'              => 'Embalagem',
            'vestuario'              => 'Vestuário',
            // Suporte para chaves antigas se necessário
            'recriar_logo'           => 'Recriar um logo (Vetorização)',
            'identidade_visual'      => 'Projeto de Identidade Visual (PIV)',
            'naming'                 => 'Criação de Nome (Naming)',
            'criar_tipografia'       => 'Criar Tipografia',
            'criar_ilustracao'       => 'Criar Ilustração',
        ];

        return $map[$category] ?? 'Não informada';
    }

    private function resolveBusinessMomentLabel(string $moment): string
    {
        $map = [
            'estah_comecando' => 'Está começando',
            'inicio' => 'Início',
            'lancamento' => 'Lançamento',
            'crescimento' => 'Crescimento / escalando o negócio',
            'reposicionamento' => 'Ajustes e reposicionamento da marca',
            'padronizacao' => 'Padronização da marca e processos da empresa',
        ];

        return $map[$moment] ?? 'Não informado';
    }

    private function resolvePriorityChannelLabel(string $channel): string
    {
        $map = [
            'digital' => 'Digital',
            'fisico' => 'Físico',
            'hibrido' => 'Híbrido',
        ];

        return $map[$channel] ?? 'Não informado';
    }

    private function resolveProjectPriorityLabel(string $priority): string
    {
        $map = [
            'equilibrio' => 'Equilíbrio entre prazo e qualidade',
            'inicio_rapido' => 'Início rápido',
            'detalhado' => 'Projeto mais detalhado',
        ];

        return $map[$priority] ?? 'Não informado';
    }

    private function resolveServiceViewModeLabel(string $mode): string
    {
        return $mode === 'all'
            ? 'Mostrar todos os serviços'
            : 'Mostrar recomendados';
    }
}

