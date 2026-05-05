<?php
$selectedServices = old('service_ids', []);
if (!is_array($selectedServices)) {
    $selectedServices = [];
}
$selectedMap = array_fill_keys(array_map('intval', $selectedServices), true);

$personTypeOptions = [
    'pf' => 'Pessoa Física',
    'pj' => 'Pessoa Jurídica',
];

$companyProfileOptions = [
    'mei' => 'MEI',
    'pequena' => 'Pequena empresa',
    'media' => 'Média empresa',
    'grande' => 'Grande empresa',
];

$areaOptions = [
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

$businessMomentOptions = [
    'estah_comecando' => 'Está começando',
    'inicio' => 'Início',
    'lancamento' => 'Lançamento',
    'crescimento' => 'Crescimento / escalando o negócio',
    'reposicionamento' => 'Ajustes e reposicionamento da marca',
    'padronizacao' => 'Padronização da marca e processos da empresa',
];

$channelOptions = [
    'digital' => 'Digital',
    'fisico' => 'Físico',
    'hibrido' => 'Híbrido',
];

$priorityOptions = [
    'equilibrio' => 'Equilíbrio entre prazo e qualidade',
    'inicio_rapido' => 'Início rápido',
    'detalhado' => 'Projeto mais detalhado',
];

$serviceCategoryOptions = [
    'criacao_marca' => [
        'label' => 'Criação de marca',
        'items' => [
            'criacao_logo'   => 'Criação de Logo',
            'criacao_naming' => 'Criação de Nome',
            'criacao_marca_completa' => 'Marca Completa (Logo + Conceito)',
        ]
    ],
    'identidade_visual' => [
        'label' => 'Identidade Visual',
        'items' => [
            'piv' => 'Projeto de Identidade Visual (PIV)',
            'manual_identidade' => 'Manual de Identidade Visual',
            'papelaria' => 'Papelaria Institucional',
        ]
    ],
    'branding' => [
        'label' => 'Branding & Estratégia',
        'items' => [
            'branding' => 'Branding e Gestão de Marca',
            'consultoria_design' => 'Consultoria em Design',
            'mentoria_design' => 'Mentoria em Design',
        ]
    ],
    'design_grafico' => [
        'label' => 'Design Gráfico & Comunicação',
        'items' => [
            'pecas_promocionais' => 'Peças Promocionais',
            'pdv' => 'Design para PDV',
            'sinalizacao' => 'Sinalização',
            'midia_externa' => 'Mídia Interna e Externa',
        ]
    ],
    'digital' => [
        'label' => 'Digital & Experiência',
        'items' => [
            'redes_sociais' => 'Design para Redes Sociais',
            'ux_ui' => 'UX/UI Design',
            'email_marketing' => 'E-mail Marketing',
            'apresentacoes' => 'Apresentações e Multimídia',
        ]
    ],
    'criacao_personalizada' => [
        'label' => 'Criação Personalizada',
        'items' => [
            'ilustracao' => 'Ilustração',
            'tipografia' => 'Tipografia Personalizada',
            'embalagem' => 'Embalagem',
            'vestuario' => 'Vestuário',
        ]
    ],
];

$selectedPersonType = (string) old('client_person_type', 'pf');
if (!isset($personTypeOptions[$selectedPersonType])) {
    $selectedPersonType = 'pf';
}
$selectedCompanyProfile = (string) old('company_profile', '');
if ($selectedCompanyProfile !== '' && !isset($companyProfileOptions[$selectedCompanyProfile])) {
    $selectedCompanyProfile = '';
}
$selectedArea = (string) old('client_area', '');
if ($selectedArea !== '' && !isset($areaOptions[$selectedArea])) {
    $selectedArea = '';
}
$selectedBusinessMoment = (string) old('business_moment', '');
if ($selectedBusinessMoment !== '' && !isset($businessMomentOptions[$selectedBusinessMoment])) {
    $selectedBusinessMoment = '';
}
$selectedChannel = (string) old('priority_channel', '');
if ($selectedChannel !== '' && !isset($channelOptions[$selectedChannel])) {
    $selectedChannel = '';
}
$selectedPriority = (string) old('project_priority', '');
if ($selectedPriority !== '' && !isset($priorityOptions[$selectedPriority])) {
    $selectedPriority = '';
}
$selectedServiceCategory = (string) old('service_category', '');
if ($selectedServiceCategory !== '' && !isset($serviceCategoryOptions[$selectedServiceCategory])) {
    $selectedServiceCategory = '';
}
$selectedServiceMode = (string) old('service_view_mode', 'recommended');
if (!in_array($selectedServiceMode, ['recommended', 'all'], true)) {
    $selectedServiceMode = 'recommended';
}

$classifyServiceGroup = static function (array $item, string $catalogLabel): string {
    $text = strtolower(trim(implode(' ', [
        (string) $catalogLabel,
        (string) ($item['group_name'] ?? ''),
        (string) ($item['service_name'] ?? ''),
        (string) ($item['reference_code'] ?? ''),
    ])));

    $has = static function (string $haystack, array $terms): bool {
        foreach ($terms as $term) {
            if (str_contains($haystack, $term)) {
                return true;
            }
        }
        return false;
    };

    if ($has($text, ['logo', 'logotipo', 'logomarca', 'identidade visual', 'manual de marca'])) {
        return 'identidade_visual';
    }
    if ($has($text, ['impresso', 'papelaria', 'embalagem', 'rotulo', 'folder', 'panfleto', 'cartao', 'editorial', 'sinalizacao', 'banner', 'fachada'])) {
        return 'materiais_impressos';
    }
    if ($has($text, ['digital', 'social', 'site', 'landing', 'app', 'online', 'rede', 'video', 'audiovisual', 'motion', 'animacao', 'email'])) {
        return 'materiais_digitais';
    }

    return 'branding_estrategia';
};

$serviceGroupDefinitions = [
    'branding_estrategia' => 'Branding e estrategia de marca',
    'identidade_visual' => 'Identidade visual',
    'materiais_digitais' => 'Materiais digitais',
    'materiais_impressos' => 'Materiais impressos',
];

$serviceGroups = [];
foreach ($serviceGroupDefinitions as $groupKey => $groupLabel) {
    $serviceGroups[$groupKey] = ['label' => $groupLabel, 'items' => []];
}

foreach ($serviceCatalogs as $catalog) {
    $catalogLabel = (string) ($catalog['label'] ?? '');
    foreach ((array) ($catalog['items'] ?? []) as $item) {
        $groupKey = $classifyServiceGroup($item, $catalogLabel);
        if (!isset($serviceGroups[$groupKey])) {
            continue;
        }
        $item['catalog_label'] = $catalogLabel;
        $serviceGroups[$groupKey]['items'][] = $item;
    }
}
?>

<section class="aq-request-create row justify-content-center">
    <div class="col-xl-10">
        <div class="card border-0 shadow-sm">
            <div class="card-body p-4 p-lg-5">
                <h1 class="h3 mb-2"><i class="fa-solid fa-wand-magic-sparkles me-2 text-primary"></i>Formulário de Orçamento</h1>
                <p class="text-muted mb-4">Preencha em 4 passos e receba um atendimento estratégico para marca, identidade visual e materiais da sua empresa.</p>

                <form method="post" action="<?= e(url('/orcamento/enviar')) ?>" data-quote-wizard>
                    <?= csrf_field() ?>
                    <div class="aq-assistant-shell aq-wizard-shell">
                        <div class="aq-assistant-header">
                            <div>
                                <h2 class="h5 mb-1">Assistente de autoatendimento</h2>
                                <p class="text-muted small mb-0">Siga a jornada orientada para montar um pedido claro e objetivo.</p>
                            </div>
                            <span class="badge rounded-pill text-bg-primary"><i class="fa-solid fa-route me-1"></i>4 passos</span>
                        </div>

                        <div class="aq-assistant-progress-wrap mt-3">
                            <div class="progress aq-assistant-progress" role="progressbar" aria-label="Progresso do formulário">
                                <div class="progress-bar bg-primary" data-wizard-progressbar style="width:25%;" aria-valuemin="0" aria-valuemax="100" aria-valuenow="25"></div>
                            </div>
                            <div class="aq-assistant-stepper mt-2">
                                <button type="button" class="aq-assistant-step is-active" data-step-target="0"><i class="fa-solid fa-id-card"></i>1. Perfil</button>
                                <button type="button" class="aq-assistant-step" data-step-target="1"><i class="fa-solid fa-list-check"></i>2. Serviços</button>
                                <button type="button" class="aq-assistant-step" data-step-target="2"><i class="fa-solid fa-compass-drafting"></i>3. Estratégia</button>
                                <button type="button" class="aq-assistant-step" data-step-target="3"><i class="fa-solid fa-square-check"></i>4. Revisão</button>
                            </div>
                        </div>

                        <div class="aq-wizard-helper mt-3">
                            <p class="aq-wizard-helper-title mb-1" data-assistant-title>Passo 1 - Perfil do cliente</p>
                            <p class="aq-wizard-helper-text mb-0" data-assistant-text>Informe os dados iniciais para que o passo de serviços seja personalizado para seu perfil.</p>
                        </div>
                        <p class="aq-wizard-step-error mt-2 mb-0 d-none" data-step-error></p>

                        <div class="aq-assistant-flow mt-3">
                            <section class="aq-wizard-stage" data-step="0">
                                <div class="row g-3">
                                    <div class="col-md-8">
                                        <label class="form-label" for="projectTitle">Nome do projeto</label>
                                        <input class="form-control" id="projectTitle" name="project_title" required value="<?= e((string) old('project_title')) ?>" placeholder="Ex.: Rebranding para novo posicionamento">
                                    </div>

                                    <div class="col-md-4">
                                        <label class="form-label" for="personType">Tipo de cadastro</label>
                                        <select class="form-select" id="personType" name="client_person_type" data-person-type required>
                                            <?php foreach ($personTypeOptions as $value => $label): ?>
                                                <option value="<?= e($value) ?>" <?= $selectedPersonType === $value ? 'selected' : '' ?>><?= e($label) ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label" for="clientArea">Área de atuação</label>
                                        <select class="form-select" id="clientArea" name="client_area" data-client-area required>
                                            <option value="">Selecione a área</option>
                                            <?php foreach ($areaOptions as $value => $label): ?>
                                                <option value="<?= e($value) ?>" <?= $selectedArea === $value ? 'selected' : '' ?>><?= e($label) ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>

                                    <div class="col-12 d-none" data-area-other-group>
                                        <label class="form-label" for="clientAreaOther">Especifique sua área de atuação ou serviço</label>
                                        <input type="text" class="form-control" id="clientAreaOther" name="client_area_other" value="<?= e((string) old('client_area_other')) ?>" placeholder="Descreva aqui sua área ou o serviço específico que busca">
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label" for="serviceCategory">Serviço principal desejado</label>
                                        <select class="form-select" id="serviceCategory" name="service_category" data-service-category required>
                                            <option value="">Selecione um serviço</option>
                                            <?php foreach ($serviceCategoryOptions as $groupKey => $groupData): ?>
                                                <optgroup label="<?= e($groupData['label']) ?>">
                                                    <?php foreach ($groupData['items'] as $value => $label): ?>
                                                        <option value="<?= e($value) ?>" <?= $selectedServiceCategory === $value ? 'selected' : '' ?>><?= e($label) ?></option>
                                                    <?php endforeach; ?>
                                                </optgroup>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>

                                    <div class="col-md-6" data-company-profile-group>
                                        <label class="form-label" for="companyProfile">Porte da empresa</label>
                                        <select class="form-select" id="companyProfile" name="company_profile" data-company-profile>
                                            <option value="">Selecione o porte</option>
                                            <?php foreach ($companyProfileOptions as $value => $label): ?>
                                                <option value="<?= e($value) ?>" <?= $selectedCompanyProfile === $value ? 'selected' : '' ?>><?= e($label) ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label" for="requestedAvailability">Disponibilidade esperada</label>
                                        <input class="form-control" id="requestedAvailability" name="requested_availability" value="<?= e((string) old('requested_availability')) ?>" placeholder="Ex.: início imediato, reuniões no período da tarde">
                                    </div>
                                </div>
                            </section>

                            <section class="aq-wizard-stage d-none" data-step="1">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <div class="aq-step-hint">
                                            <strong>Escolha dos serviços</strong>
                                            <p class="mb-0">Use a lista recomendada com base no seu perfil ou ative a visualização completa para ver todo o catálogo.</p>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label d-block mb-2">Visualização dos serviços</label>
                                        <div class="aq-service-visibility" role="group" aria-label="Visualização de serviços">
                                            <label class="aq-service-visibility-option">
                                                <input type="radio" name="service_view_mode" value="recommended" data-service-mode <?= $selectedServiceMode === 'recommended' ? 'checked' : '' ?>>
                                                <span>Mostrar recomendados</span>
                                            </label>
                                            <label class="aq-service-visibility-option">
                                                <input type="radio" name="service_view_mode" value="all" data-service-mode <?= $selectedServiceMode === 'all' ? 'checked' : '' ?>>
                                                <span>Mostrar todos os serviços</span>
                                            </label>
                                        </div>
                                        <div class="form-text" data-service-mode-helper>As recomendações consideram tipo de cadastro, area, serviço principal e porte.</div>
                                    </div>

                                    <div class="col-12"><p class="small text-muted mb-2" data-service-counter aria-live="polite"></p></div>
                                    <?php foreach ($serviceGroups as $groupKey => $group): ?>
                                        <div class="col-12" data-service-group-section>
                                            <div class="aq-service-group">
                                                <h3 class="h6 mb-2"><?= e($group['label']) ?></h3>
                                                <div class="aq-service-list">
                                                    <?php foreach ($group['items'] as $item): ?>
                                                        <?php
                                                        $itemId = (int) ($item['id'] ?? 0);
                                                        if ($itemId <= 0) {
                                                            continue;
                                                        }
                                                        $isChecked = isset($selectedMap[$itemId]);
                                                        $companyProfile = strtolower(trim((string) ($item['company_profile'] ?? 'geral')));
                                                        if ($companyProfile === '') {
                                                            $companyProfile = 'geral';
                                                        }
                                                        $label = trim(
                                                            ((string) ($item['reference_code'] ?? '') !== '' ? '[' . (string) $item['reference_code'] . '] ' : '')
                                                            . ((string) ($item['service_name'] ?? ''))
                                                        );
                                                        $meta = trim((string) ($item['group_name'] ?? ''));
                                                        $searchText = trim(implode(' ', [
                                                            (string) ($group['label'] ?? ''),
                                                            (string) ($item['catalog_label'] ?? ''),
                                                            (string) ($item['reference_code'] ?? ''),
                                                            (string) ($item['service_name'] ?? ''),
                                                            (string) ($item['group_name'] ?? ''),
                                                            $companyProfile,
                                                            (string) $groupKey,
                                                        ]));
                                                        ?>
                                                        <div class="aq-service-row" data-service-option data-service-id="<?= $itemId ?>" data-service-profile="<?= e($companyProfile) ?>" data-service-group="<?= e($groupKey) ?>" data-service-text="<?= e($searchText) ?>">
                                                            <label class="aq-service-card">
                                                                <input class="form-check-input" type="checkbox" name="service_ids[]" value="<?= $itemId ?>" <?= $isChecked ? 'checked' : '' ?>>
                                                                <span class="aq-service-card-content">
                                                                    <span class="aq-service-card-title"><?= e($label) ?></span>
                                                                    <?php if ($meta !== ''): ?>
                                                                        <span class="aq-service-card-meta"><?= e($meta) ?></span>
                                                                    <?php endif; ?>
                                                                </span>
                                                                <span class="badge rounded-pill aq-assistant-tag d-none" data-recommended-badge>Recomendado</span>
                                                            </label>
                                                        </div>
                                                    <?php endforeach; ?>
                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; ?>
                                </div>
                            </section>

                            <section class="aq-wizard-stage d-none" data-step="2">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <div class="aq-step-hint">
                                            <strong>Direcionamento estratégico</strong>
                                            <p class="mb-0">Essas respostas ajudam a agência a analisar melhor o contexto e construir um orçamento mais aderente.</p>
                                        </div>
                                    </div>

                                    <div class="col-12">
                                        <label class="form-label" for="businessMoment">Momento do negócio</label>
                                        <select class="form-select" id="businessMoment" name="business_moment" data-business-moment required>
                                            <option value="">Selecione o momento</option>
                                            <?php foreach ($businessMomentOptions as $value => $label): ?>
                                                <option value="<?= e($value) ?>" <?= $selectedBusinessMoment === $value ? 'selected' : '' ?>><?= e($label) ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label" for="priorityChannel">Canal prioritário</label>
                                        <select class="form-select" id="priorityChannel" name="priority_channel" data-priority-channel required>
                                            <option value="">Selecione o canal</option>
                                            <?php foreach ($channelOptions as $value => $label): ?>
                                                <option value="<?= e($value) ?>" <?= $selectedChannel === $value ? 'selected' : '' ?>><?= e($label) ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label" for="projectPriority">Prioridade do projeto</label>
                                        <select class="form-select" id="projectPriority" name="project_priority" data-project-priority required>
                                            <option value="">Selecione a prioridade</option>
                                            <?php foreach ($priorityOptions as $value => $label): ?>
                                                <option value="<?= e($value) ?>" <?= $selectedPriority === $value ? 'selected' : '' ?>><?= e($label) ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </div>
                                </div>
                            </section>

                            <section class="aq-wizard-stage d-none" data-step="3">
                                <div class="aq-step-hint mb-3">
                                    <strong>Resumo e revisão final</strong>
                                    <p class="mb-0">Revise as escolhas antes de enviar. Se precisar, volte e ajuste qualquer etapa.</p>
                                </div>

                                <div class="aq-summary-grid">
                                    <div class="aq-summary-card">
                                        <h3 class="h6">Perfil do cliente</h3>
                                        <dl class="aq-summary-list mb-0">
                                            <div><dt>Nome do projeto</dt><dd data-summary-project-title>-</dd></div>
                                            <div><dt>Tipo de cadastro</dt><dd data-summary-person-type>-</dd></div>
                                            <div data-summary-company-profile-row><dt>Porte da empresa</dt><dd data-summary-company-profile>-</dd></div>
                                            <div><dt>Área de atuação</dt><dd data-summary-client-area>-</dd></div>
                                            <div><dt>Serviço principal</dt><dd data-summary-service-category>-</dd></div>
                                            <div><dt>Disponibilidade esperada</dt><dd data-summary-availability>-</dd></div>
                                        </dl>
                                    </div>

                                    <div class="aq-summary-card">
                                        <h3 class="h6">Serviços selecionados</h3>
                                        <ul class="aq-summary-services mb-0" data-summary-services></ul>
                                    </div>

                                    <div class="aq-summary-card">
                                        <h3 class="h6">Estratégia</h3>
                                        <dl class="aq-summary-list mb-0">
                                            <div><dt>Momento do negócio</dt><dd data-summary-business-moment>-</dd></div>
                                            <div><dt>Canal prioritário</dt><dd data-summary-priority-channel>-</dd></div>
                                            <div><dt>Prioridade do projeto</dt><dd data-summary-project-priority>-</dd></div>
                                        </dl>
                                    </div>
                                </div>

                                <div class="aq-summary-actions mt-3">
                                    <button type="button" class="btn btn-outline-secondary btn-sm" data-edit-step="0">Editar perfil</button>
                                    <button type="button" class="btn btn-outline-secondary btn-sm" data-edit-step="1">Editar serviços</button>
                                    <button type="button" class="btn btn-outline-secondary btn-sm" data-edit-step="2">Editar estratégia</button>
                                </div>
                            </section>
                        </div>

                        <div class="aq-assistant-nav mt-4">
                            <button type="button" class="btn btn-outline-secondary" data-prev-step><i class="fa-solid fa-arrow-left me-1"></i>Etapa anterior</button>
                            <span class="small text-muted" data-step-label>Passo 1 de 4 - Perfil</span>
                            <div class="d-flex gap-2">
                                <button type="button" class="btn btn-primary" data-next-step>Próximo passo<i class="fa-solid fa-arrow-right ms-1"></i></button>
                                <button type="submit" class="btn btn-primary d-none" data-submit-request><i class="fa-solid fa-paper-plane me-1"></i>Seguir para orçamento</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('[data-quote-wizard]');
    if (!form) {
        return;
    }

    const stepSections = Array.from(form.querySelectorAll('[data-step]'));
    const stepButtons = Array.from(form.querySelectorAll('[data-step-target]'));
    const progressBar = form.querySelector('[data-wizard-progressbar]');
    const stepLabel = form.querySelector('[data-step-label]');
    const assistantTitle = form.querySelector('[data-assistant-title]');
    const assistantText = form.querySelector('[data-assistant-text]');
    const stepError = form.querySelector('[data-step-error]');

    const prevButton = form.querySelector('[data-prev-step]');
    const nextButton = form.querySelector('[data-next-step]');
    const submitButton = form.querySelector('[data-submit-request]');

    const personTypeSelect = form.querySelector('[data-person-type]');
    const companyProfileGroup = form.querySelector('[data-company-profile-group]');
    const companyProfileSelect = form.querySelector('[data-company-profile]');
    const clientAreaSelect = form.querySelector('[data-client-area]');
    const areaOtherGroup = form.querySelector('[data-area-other-group]');
    const areaOtherInput = form.querySelector('input[name="client_area_other"]');
    const serviceCategorySelect = form.querySelector('[data-service-category]');

    const serviceModeRadios = Array.from(form.querySelectorAll('[data-service-mode]'));
    const serviceModeHelper = form.querySelector('[data-service-mode-helper]');
    const serviceCounter = form.querySelector('[data-service-counter]');
    const serviceGroupSections = Array.from(form.querySelectorAll('[data-service-group-section]'));

    const businessMomentSelect = form.querySelector('[data-business-moment]');
    const priorityChannelSelect = form.querySelector('[data-priority-channel]');
    const projectPrioritySelect = form.querySelector('[data-project-priority]');
    const summaryProjectTitle = form.querySelector('[data-summary-project-title]');
    const summaryPersonType = form.querySelector('[data-summary-person-type]');
    const summaryCompanyProfile = form.querySelector('[data-summary-company-profile]');
    const summaryCompanyProfileRow = form.querySelector('[data-summary-company-profile-row]');
    const summaryClientArea = form.querySelector('[data-summary-client-area]');
    const summaryServiceCategory = form.querySelector('[data-summary-service-category]');
    const summaryAvailability = form.querySelector('[data-summary-availability]');
    const summaryServices = form.querySelector('[data-summary-services]');
    const summaryBusinessMoment = form.querySelector('[data-summary-business-moment]');
    const summaryPriorityChannel = form.querySelector('[data-summary-priority-channel]');
    const summaryProjectPriority = form.querySelector('[data-summary-project-priority]');

    const projectTitleInput = form.querySelector('input[name="project_title"]');
    const availabilityInput = form.querySelector('input[name="requested_availability"]');

    const stepMeta = [
        { label: 'Perfil', title: 'Passo 1 - Perfil do cliente', text: 'Informe os dados iniciais para que o passo de serviços seja personalizado para seu perfil.' },
        { label: 'Serviços', title: 'Passo 2 - Escolha dos serviços', text: 'Você pode usar os serviços recomendados para acelerar sua decisão ou visualizar o catálogo completo.' },
        { label: 'Estratégia', title: 'Passo 3 - Estratégia do projeto', text: 'Defina momento, canal e prioridade para direcionar uma análise mais precisa do orçamento.' },
        { label: 'Revisão', title: 'Passo 4 - Resumo e revisão', text: 'Revise todos os dados antes de enviar. Se necessário, volte para editar qualquer etapa.' }
    ];

    const areaKeywords = {
        moda_beleza: ['moda', 'beleza', 'estetica', 'editorial', 'campanha', 'identidade'],
        alimentacao: ['alimentacao', 'gastronomia', 'restaurante', 'cardapio', 'embalagem', 'delivery'],
        saude: ['saude', 'clinica', 'bem estar', 'institucional'],
        educacao: ['educacao', 'curso', 'treinamento', 'institucional'],
        tecnologia: ['tecnologia', 'software', 'digital', 'site', 'app'],
        comercio: ['comercio', 'varejo', 'promocao', 'campanha'],
        servicos: ['servicos', 'institucional', 'branding'],
        imobiliario: ['imobiliario', 'construcao', 'institucional', 'lancamento'],
        eventos: ['evento', 'entretenimento', 'campanha', 'digital'],
        industria: ['industria', 'catalogo', 'manual', 'tecnico', 'embalagem'],
        agro: ['agro', 'institucional', 'rotulo', 'embalagem', 'marca'],
        outros: []
    };

    const categoryKeywords = {
        criacao_logo: ['logo', 'logotipo', 'logomarca', 'piv', 'identidade visual'],
        criacao_naming: ['naming', 'nome', 'marca', 'slogan', 'tagline'],
        criacao_marca_completa: ['logo', 'logotipo', 'conceito', 'completa', 'piv'],
        piv: ['identidade visual', 'piv', 'marca', 'manual'],
        manual_identidade: ['manual', 'identidade', 'guia', 'uso'],
        papelaria: ['papelaria', 'cartao', 'envelope', 'pasta', 'timbrado'],
        branding: ['branding', 'gestao', 'diagnostico', 'estrategia'],
        consultoria_design: ['consultoria', 'design', 'orientacao'],
        mentoria_design: ['mentoria', 'design', 'aprendizado'],
        pecas_promocionais: ['promocional', 'folder', 'flyer', 'banner'],
        pdv: ['pdv', 'ponto de venda', 'expositor', 'display'],
        sinalizacao: ['sinalizacao', 'placa', 'adesivo', 'interno', 'externo'],
        midia_externa: ['externa', 'outdoor', 'busdoor', 'fachada'],
        redes_sociais: ['social', 'instagram', 'facebook', 'post', 'stories'],
        ux_ui: ['ux', 'ui', 'interface', 'usuario', 'site', 'app'],
        email_marketing: ['email', 'marketing', 'newsletter'],
        apresentacoes: ['apresentacao', 'multimidia', 'ppt', 'deck'],
        ilustracao: ['ilustracao', 'iconografia', 'mascote'],
        tipografia: ['tipografia', 'fonte', 'lettering'],
        embalagem: ['embalagem', 'rotulo', 'caixa', 'pacote'],
        vestuario: ['vestuario', 'uniforme', 'camiseta', 'bone'],
        // Legado
        recriar_logo: ['redesenho', 'vetorizacao', 'atualizacao', 'reformulacao', 'logo', 'logotipo'],
        identidade_visual: ['identidade visual', 'piv', 'marca', 'manual'],
        naming: ['naming', 'nome', 'marca', 'slogan', 'tagline'],
        criar_tipografia: ['tipografia', 'fonte', 'lettering'],
        criar_ilustracao: ['ilustracao', 'iconografia', 'mascote']
    };

    const areaPreferredGroups = {
        moda_beleza: ['identidade_visual', 'materiais_digitais'],
        alimentacao: ['identidade_visual', 'materiais_impressos'],
        saude: ['branding_estrategia', 'materiais_digitais'],
        educacao: ['materiais_digitais', 'branding_estrategia'],
        tecnologia: ['materiais_digitais', 'identidade_visual'],
        comercio: ['materiais_digitais', 'materiais_impressos'],
        servicos: ['branding_estrategia', 'identidade_visual'],
        imobiliario: ['materiais_digitais', 'materiais_impressos'],
        eventos: ['materiais_digitais', 'identidade_visual'],
        industria: ['materiais_impressos', 'branding_estrategia'],
        agro: ['materiais_impressos', 'identidade_visual'],
        outros: []
    };

    const serviceOptions = Array.from(form.querySelectorAll('[data-service-option]')).map(function (element) {
        const checkbox = element.querySelector('input[type="checkbox"]');
        const title = element.querySelector('.aq-service-card-title');
        return {
            element: element,
            checkbox: checkbox,
            id: String(element.getAttribute('data-service-id') || ''),
            profile: String(element.getAttribute('data-service-profile') || 'geral').toLowerCase(),
            group: String(element.getAttribute('data-service-group') || ''),
            text: normalizeText(element.getAttribute('data-service-text') || ''),
            label: title ? String(title.textContent || '').trim() : '',
            badge: element.querySelector('[data-recommended-badge]')
        };
    });

    let currentStep = 0;

    function normalizeText(value) {
        const raw = String(value || '');
        const normalized = typeof raw.normalize === 'function' ? raw.normalize('NFD') : raw;
        return normalized.replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9\s]/g, ' ').toLowerCase().replace(/\s+/g, ' ').trim();
    }

    function selectText(select) {
        if (!select || select.selectedIndex < 0) {
            return '';
        }
        const option = select.options[select.selectedIndex];
        return option ? String(option.textContent || '').trim() : '';
    }

    function selectedPersonType() {
        return String((personTypeSelect && personTypeSelect.value) || 'pf') === 'pj' ? 'pj' : 'pf';
    }

    function selectedServiceMode() {
        const selected = serviceModeRadios.find(function (radio) { return radio.checked; });
        return selected && selected.value === 'all' ? 'all' : 'recommended';
    }

    function clearStepError() {
        if (stepError) {
            stepError.textContent = '';
            stepError.classList.add('d-none');
        }
    }

    function showStepError(message, focusElement) {
        if (stepError) {
            stepError.textContent = message;
            stepError.classList.remove('d-none');
        }
        if (focusElement && typeof focusElement.focus === 'function') {
            focusElement.focus();
        }
    }

    function syncPersonTypeFields() {
        const isPj = selectedPersonType() === 'pj';
        if (companyProfileGroup) {
            companyProfileGroup.classList.toggle('d-none', !isPj);
        }
        if (companyProfileSelect) {
            companyProfileSelect.required = isPj;
            if (!isPj) {
                companyProfileSelect.value = '';
            }
        }
    }

    function syncAreaOtherField() {
        if (!clientAreaSelect || !areaOtherGroup) { return; }
        const isOther = clientAreaSelect.value === 'outros';
        areaOtherGroup.classList.toggle('d-none', !isOther);
        if (areaOtherInput) {
            areaOtherInput.required = isOther;
            if (!isOther) {
                areaOtherInput.value = '';
            }
        }
    }

    function computeRecommendedIds() {
        const personType = selectedPersonType();
        const companyProfile = String((companyProfileSelect && companyProfileSelect.value) || '');
        const area = String((clientAreaSelect && clientAreaSelect.value) || '');
        const category = String((serviceCategorySelect && serviceCategorySelect.value) || '');
        const keywords = areaKeywords[area] || [];
        const catKeywords = categoryKeywords[category] || [];
        const preferredGroups = areaPreferredGroups[area] || [];

        const scored = serviceOptions.map(function (option) {
            let score = 0;
            if (option.profile === 'geral') { score += 2; }
            if (personType === 'pf' && option.profile === 'geral') { score += 2; }
            if (personType === 'pj' && companyProfile !== '' && option.profile === companyProfile) { score += 5; }
            if (personType === 'pj' && companyProfile === 'pequena' && option.profile === 'microempresa') { score += 3; }
            
            keywords.forEach(function (term) {
                if (option.text.indexOf(term) !== -1) { score += 2; }
            });

            catKeywords.forEach(function (term) {
                if (option.text.indexOf(term) !== -1) { score += 10; } // High score for matching category
            });

            if (preferredGroups.indexOf(option.group) !== -1) { score += 2; }
            if (option.group === 'branding_estrategia' || option.group === 'identidade_visual') { score += 1; }
            return { id: option.id, score: score, label: option.label };
        }).filter(function (entry) {
            return entry.score > 0;
        }).sort(function (a, b) {
            if (b.score !== a.score) { return b.score - a.score; }
            return a.label.localeCompare(b.label, 'pt-BR');
        });

        const ids = scored.length > 0
            ? scored.slice(0, 15).map(function (entry) { return entry.id; }) // Increased to 15 to show more options if filtered
            : serviceOptions.slice(0, Math.min(10, serviceOptions.length)).map(function (option) { return option.id; });

        return new Set(ids);
    }

    function updateServiceVisibility() {
        const mode = selectedServiceMode();
        const recommendedIds = computeRecommendedIds();
        let visibleCount = 0;

        serviceOptions.forEach(function (option) {
            const checked = option.checkbox && option.checkbox.checked;
            const isRecommended = recommendedIds.has(option.id);
            const visible = mode === 'all' || isRecommended || checked;

            option.element.classList.toggle('d-none', !visible);
            option.element.classList.toggle('aq-service-recommended', isRecommended && mode !== 'all');

            if (option.badge) {
                option.badge.classList.toggle('d-none', !isRecommended || mode === 'all');
            }

            if (visible) { visibleCount++; }
        });

        serviceGroupSections.forEach(function (section) {
            const visibleInGroup = section.querySelectorAll('[data-service-option]:not(.d-none)').length;
            section.classList.toggle('d-none', visibleInGroup === 0);

            const visibleOptions = Array.from(section.querySelectorAll('[data-service-option]:not(.d-none)'));
            visibleOptions.forEach(function (optionElement, index) {
                optionElement.classList.toggle('aq-service-row-alt', index % 2 === 1);
            });
        });

        if (serviceCounter) {
            const selectedCount = serviceOptions.filter(function (option) {
                return option.checkbox && option.checkbox.checked;
            }).length;
            const visibleText = visibleCount === 1 ? '1 serviço visível' : visibleCount + ' serviços visíveis';
            const selectedText = selectedCount === 1 ? '1 selecionado' : selectedCount + ' selecionados';
            serviceCounter.textContent = visibleText + ' | ' + selectedText + '.';
        }

        if (serviceModeHelper) {
            serviceModeHelper.textContent = mode === 'all'
                ? 'Você está visualizando todo o catálogo de serviços da agência.'
                : 'Você está visualizando a lista recomendada para o seu perfil.';
        }
    }

    function updateSummary() {
        if (summaryProjectTitle) { summaryProjectTitle.textContent = String(projectTitleInput ? projectTitleInput.value : '').trim() || 'Não informado'; }
        if (summaryPersonType) { summaryPersonType.textContent = selectText(personTypeSelect) || 'Não informado'; }
        
        if (summaryClientArea) { 
            let areaText = selectText(clientAreaSelect);
            if (clientAreaSelect && clientAreaSelect.value === 'outros' && areaOtherInput && areaOtherInput.value.trim() !== '') {
                areaText += ': ' + areaOtherInput.value.trim();
            }
            summaryClientArea.textContent = areaText || 'Não informado'; 
        }
        if (summaryServiceCategory) { summaryServiceCategory.textContent = selectText(serviceCategorySelect) || 'Não informado'; }
        if (summaryAvailability) { summaryAvailability.textContent = String(availabilityInput ? availabilityInput.value : '').trim() || 'Não informado'; }
        if (summaryBusinessMoment) { summaryBusinessMoment.textContent = selectText(businessMomentSelect) || 'Não informado'; }
        if (summaryPriorityChannel) { summaryPriorityChannel.textContent = selectText(priorityChannelSelect) || 'Não informado'; }
        if (summaryProjectPriority) { summaryProjectPriority.textContent = selectText(projectPrioritySelect) || 'Não informado'; }

        const isPj = selectedPersonType() === 'pj';
        if (summaryCompanyProfileRow) { summaryCompanyProfileRow.classList.toggle('d-none', !isPj); }
        if (summaryCompanyProfile) { summaryCompanyProfile.textContent = isPj ? (selectText(companyProfileSelect) || 'Não informado') : 'Não se aplica'; }

        if (summaryServices) {
            const selectedLabels = serviceOptions.filter(function (option) {
                return option.checkbox && option.checkbox.checked;
            }).map(function (option) {
                return option.label;
            }).filter(Boolean);

            summaryServices.innerHTML = '';
            if (selectedLabels.length === 0) {
                const emptyItem = document.createElement('li');
                emptyItem.textContent = 'Nenhum serviço selecionado.';
                summaryServices.appendChild(emptyItem);
            } else {
                selectedLabels.forEach(function (label) {
                    const item = document.createElement('li');
                    item.textContent = label;
                    summaryServices.appendChild(item);
                });
            }
        }
    }

    function validateStep(stepIndex) {
        const personType = selectedPersonType();

        if (stepIndex === 0) {
            if (String(projectTitleInput ? projectTitleInput.value : '').trim() === '') {
                showStepError('Informe o nome do projeto para continuar.', projectTitleInput);
                return false;
            }
            if (String(clientAreaSelect ? clientAreaSelect.value : '').trim() === '') {
                showStepError('Selecione a área de atuação para continuar.', clientAreaSelect);
                return false;
            }
            if (clientAreaSelect && clientAreaSelect.value === 'outros' && String(areaOtherInput ? areaOtherInput.value : '').trim() === '') {
                showStepError('Descreva sua área de atuação ou serviço.', areaOtherInput);
                return false;
            }
            if (String(serviceCategorySelect ? serviceCategorySelect.value : '').trim() === '') {
                showStepError('Selecione o serviço principal para continuar.', serviceCategorySelect);
                return false;
            }
            if (personType === 'pj' && String(companyProfileSelect ? companyProfileSelect.value : '').trim() === '') {
                showStepError('Selecione o porte da empresa para continuar.', companyProfileSelect);
                return false;
            }
            return true;
        }

        if (stepIndex === 1) {
            const hasService = serviceOptions.some(function (option) {
                return option.checkbox && option.checkbox.checked;
            });
            if (!hasService) {
                showStepError('Selecione pelo menos um serviço para o orçamento.', serviceOptions[0] ? serviceOptions[0].checkbox : null);
                return false;
            }
            return true;
        }

        if (stepIndex === 2) {
            if (String(businessMomentSelect ? businessMomentSelect.value : '').trim() === '') {
                showStepError('Selecione o momento do negócio para continuar.', businessMomentSelect);
                return false;
            }
            if (String(priorityChannelSelect ? priorityChannelSelect.value : '').trim() === '') {
                showStepError('Selecione o canal prioritário para continuar.', priorityChannelSelect);
                return false;
            }
            if (String(projectPrioritySelect ? projectPrioritySelect.value : '').trim() === '') {
                showStepError('Selecione a prioridade do projeto para continuar.', projectPrioritySelect);
                return false;
            }
            return true;
        }

        return true;
    }

    function renderStep(stepIndex) {
        const safeStep = Math.max(0, Math.min(stepMeta.length - 1, stepIndex));
        currentStep = safeStep;

        stepSections.forEach(function (section, index) {
            const isCurrent = index === currentStep;
            section.classList.toggle('d-none', !isCurrent);
            section.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');
        });

        stepButtons.forEach(function (button) {
            const target = Number(button.getAttribute('data-step-target'));
            const isActive = target === currentStep;
            const isComplete = target < currentStep;
            button.classList.toggle('is-active', isActive);
            button.classList.toggle('is-complete', isComplete);
            button.setAttribute('aria-current', isActive ? 'step' : 'false');
        });

        const progress = Math.round(((currentStep + 1) / stepMeta.length) * 100);
        if (progressBar) {
            progressBar.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', String(progress));
        }

        if (stepLabel) { stepLabel.textContent = 'Passo ' + (currentStep + 1) + ' de ' + stepMeta.length + ' - ' + stepMeta[currentStep].label; }
        if (assistantTitle) { assistantTitle.textContent = stepMeta[currentStep].title; }
        if (assistantText) { assistantText.textContent = stepMeta[currentStep].text; }
        if (prevButton) { prevButton.disabled = currentStep === 0; }

        const isFinalStep = currentStep === stepMeta.length - 1;
        if (nextButton) { nextButton.classList.toggle('d-none', isFinalStep); }
        if (submitButton) { submitButton.classList.toggle('d-none', !isFinalStep); }
        if (isFinalStep) { updateSummary(); }
    }

    function goToStep(target) {
        const safeTarget = Math.max(0, Math.min(stepMeta.length - 1, target));
        if (safeTarget > currentStep) {
            for (let step = currentStep; step < safeTarget; step++) {
                if (!validateStep(step)) {
                    return;
                }
            }
        }
        clearStepError();
        renderStep(safeTarget);
    }

    if (prevButton) {
        prevButton.addEventListener('click', function () {
            clearStepError();
            renderStep(currentStep - 1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function () {
            if (!validateStep(currentStep)) { return; }
            clearStepError();
            renderStep(currentStep + 1);
        });
    }

    stepButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            goToStep(Number(button.getAttribute('data-step-target')));
        });
    });

    Array.from(form.querySelectorAll('[data-edit-step]')).forEach(function (button) {
        button.addEventListener('click', function () {
            goToStep(Number(button.getAttribute('data-edit-step')));
        });
    });

    [personTypeSelect, companyProfileSelect, clientAreaSelect, serviceCategorySelect].forEach(function (input) {
        if (!input) { return; }
        input.addEventListener('change', function () {
            syncPersonTypeFields();
            syncAreaOtherField();
            updateServiceVisibility();
            updateSummary();
        });
    });

    [projectTitleInput, availabilityInput, areaOtherInput, businessMomentSelect, priorityChannelSelect, projectPrioritySelect].forEach(function (input) {
        if (!input) { return; }
        input.addEventListener('input', updateSummary);
        input.addEventListener('change', updateSummary);
    });

    serviceModeRadios.forEach(function (radio) {
        radio.addEventListener('change', updateServiceVisibility);
    });

    serviceOptions.forEach(function (option) {
        if (!option.checkbox) { return; }
        option.checkbox.addEventListener('change', function () {
            updateServiceVisibility();
            updateSummary();
        });
    });

    form.addEventListener('submit', function (event) {
        for (let step = 0; step <= 2; step++) {
            if (!validateStep(step)) {
                event.preventDefault();
                renderStep(step);
                return;
            }
        }
        clearStepError();
    });

    syncPersonTypeFields();
    syncAreaOtherField();
    updateServiceVisibility();
    updateSummary();
    renderStep(0);
});
</script>

