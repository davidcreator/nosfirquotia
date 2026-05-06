<?php

declare(strict_types=1);

namespace NosfirQuotia\Cliente\Service;

use NosfirQuotia\Cliente\DTO\SubmitQuoteRequestCommand;
use NosfirQuotia\Cliente\DTO\SubmitQuoteRequestResult;
use NosfirQuotia\Cliente\Repository\QuoteRequestRepositoryInterface;
use NosfirQuotia\System\Domain\Exception\DomainErrorCodes;
use NosfirQuotia\System\Domain\Exception\DomainValidationException;

final class QuoteRequestService
{
    public function __construct(
        private readonly QuoteRequestRepositoryInterface $repository
    ) {
    }

    public function validateAndCreate(SubmitQuoteRequestCommand $command): SubmitQuoteRequestResult
    {
        try {
            $input = $command->input;
            $clientUserId = $command->clientUserId;

            $personType = $this->sanitizePersonType((string) ($input['client_person_type'] ?? 'pf'));
            $companyProfile = $personType === 'pj'
                ? $this->sanitizeCompanyProfile((string) ($input['company_profile'] ?? ''))
                : '';

            $payload = [
                'project_title' => $this->sanitizeSingleLineText((string) ($input['project_title'] ?? ''), 180),
                'client_person_type' => $personType,
                'company_profile' => $companyProfile,
                'client_area' => $this->sanitizeArea((string) ($input['client_area'] ?? '')),
                'client_area_other' => $this->sanitizeSingleLineText((string) ($input['client_area_other'] ?? ''), 160),
                'service_category' => $this->sanitizeServiceCategory((string) ($input['service_category'] ?? '')),
                'requested_availability' => $this->sanitizeSingleLineText((string) ($input['requested_availability'] ?? ''), 150),
                'business_moment' => $this->sanitizeBusinessMoment((string) ($input['business_moment'] ?? '')),
                'priority_channel' => $this->sanitizePriorityChannel((string) ($input['priority_channel'] ?? '')),
                'project_priority' => $this->sanitizeProjectPriority((string) ($input['project_priority'] ?? '')),
                'service_view_mode' => $this->sanitizeServiceViewMode((string) ($input['service_view_mode'] ?? 'recommended')),
            ];

            $serviceIds = $this->normalizeServiceIds($input['service_ids'] ?? []);
            $oldInput = array_merge($payload, ['service_ids' => $serviceIds]);
            $validServiceIds = $this->repository->existingServiceIds($serviceIds);

            $errors = [];

            if ($payload['project_title'] === '') {
                $errors[] = 'Informe o nome do projeto.';
            }

            if ($payload['client_area'] === '') {
                $errors[] = 'Selecione a area de atuacao.';
            } elseif ($payload['client_area'] === 'outros' && $payload['client_area_other'] === '') {
                $errors[] = 'Descreva sua area de atuacao ou servico.';
            }

            if ($payload['service_category'] === '') {
                $errors[] = 'Selecione o servico principal.';
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
                throw DomainValidationException::withErrors(
                    $errors,
                    [
                        'context' => 'quote_request',
                        'old_input' => $oldInput,
                    ],
                    DomainErrorCodes::QUOTE_REQUEST_VALIDATION
                );
            }

            $scope = $this->buildStructuredScope($payload, $validServiceIds);

            $requestId = $this->repository->createRequest(
                $clientUserId,
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

            return SubmitQuoteRequestResult::success($requestId);
        } catch (DomainValidationException $exception) {
            $details = $exception->details();
            $oldInput = $details['old_input'] ?? [];
            if (!is_array($oldInput)) {
                $oldInput = [];
            }

            return SubmitQuoteRequestResult::failure($exception->errors(), $oldInput, $exception->errorCode());
        }
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
            'recriar_logo', 'identidade_visual', 'naming', 'criar_tipografia', 'criar_ilustracao',
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

    private function buildStructuredScope(array $payload, array $serviceIds): string
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

        $lines[] = 'Area de atuacao: ' . $areaLabel;
        $lines[] = 'Servico principal desejado: ' . $this->resolveServiceCategoryLabel((string) ($payload['service_category'] ?? ''));
        $lines[] = 'Disponibilidade esperada: ' . ($payload['requested_availability'] !== '' ? $payload['requested_availability'] : 'Nao informada');
        $lines[] = 'Momento do negocio: ' . $this->resolveBusinessMomentLabel((string) ($payload['business_moment'] ?? ''));
        $lines[] = 'Canal prioritario: ' . $this->resolvePriorityChannelLabel((string) ($payload['priority_channel'] ?? ''));
        $lines[] = 'Prioridade do projeto: ' . $this->resolveProjectPriorityLabel((string) ($payload['project_priority'] ?? ''));
        $lines[] = 'Visualizacao escolhida no passo 2: ' . $this->resolveServiceViewModeLabel((string) ($payload['service_view_mode'] ?? 'recommended'));
        $lines[] = '[Servicos selecionados]';

        $serviceLines = $this->resolveServiceLines($serviceIds);
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

    private function resolveServiceLines(array $serviceIds): array
    {
        $labels = [];

        foreach ($serviceIds as $serviceId) {
            $item = $this->repository->findServiceById((int) $serviceId);
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
            'outros' => 'Outros',
        ];

        return $map[$area] ?? 'Nao informada';
    }

    private function resolveServiceCategoryLabel(string $category): string
    {
        $map = [
            'criacao_logo' => 'Criacao de Logo',
            'criacao_naming' => 'Criacao de Nome',
            'criacao_marca_completa' => 'Marca Completa (Logo + Conceito)',
            'piv' => 'Projeto de Identidade Visual (PIV)',
            'manual_identidade' => 'Manual de Identidade Visual',
            'papelaria' => 'Papelaria Institucional',
            'branding' => 'Branding e Gestao de Marca',
            'consultoria_design' => 'Consultoria em Design',
            'mentoria_design' => 'Mentoria em Design',
            'pecas_promocionais' => 'Pecas Promocionais',
            'pdv' => 'Design para PDV',
            'sinalizacao' => 'Sinalizacao',
            'midia_externa' => 'Midia Interna e Externa',
            'redes_sociais' => 'Design para Redes Sociais',
            'ux_ui' => 'UX/UI Design',
            'email_marketing' => 'E-mail Marketing',
            'apresentacoes' => 'Apresentacoes e Multimedia',
            'ilustracao' => 'Ilustracao',
            'tipografia' => 'Tipografia Personalizada',
            'embalagem' => 'Embalagem',
            'vestuario' => 'Vestuario',
            'recriar_logo' => 'Recriar um logo (Vetorizacao)',
            'identidade_visual' => 'Projeto de Identidade Visual (PIV)',
            'naming' => 'Criacao de Nome (Naming)',
            'criar_tipografia' => 'Criar Tipografia',
            'criar_ilustracao' => 'Criar Ilustracao',
        ];

        return $map[$category] ?? 'Nao informada';
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
