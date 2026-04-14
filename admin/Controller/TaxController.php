<?php

declare(strict_types=1);

namespace AureaQuotia\Admin\Controller;

use AureaQuotia\Admin\Model\QuoteModel;

final class TaxController extends BaseAdminController
{
    /**
     * @var array<int, string>
     */
    private const ALLOWED_TAX_REGIMES = [
        'mei',
        'simples_nacional',
        'lucro_presumido',
        'lucro_real',
    ];

    public function index(): void
    {
        $this->ensurePermission('taxes.manage');

        $model = new QuoteModel($this->app);
        $settings = $model->taxSettings();

        $this->render(
            'admin/View/taxes/index',
            [
                'settings' => $settings,
                'adminUser' => $this->adminUser(),
            ],
            'admin/View/layout'
        );
    }

    public function store(): void
    {
        $this->ensurePermission('taxes.manage');

        $payload = [
            'imposto_label' => trim((string) $this->request->post('imposto_label', 'Tributos sobre faturamento')),
            'imposto_percent' => $this->toPercent($this->request->post('imposto_percent', '0')),
            'taxa_label' => trim((string) $this->request->post('taxa_label', 'Taxas administrativas')),
            'taxa_percent' => $this->toPercent($this->request->post('taxa_percent', '0')),
            'encargo_label' => trim((string) $this->request->post('encargo_label', 'Encargos gerais')),
            'encargo_percent' => $this->toPercent($this->request->post('encargo_percent', '0')),
            'tax_regime' => $this->normalizeTaxRegime((string) $this->request->post('tax_regime', 'simples_nacional')),
            'municipality_name' => trim((string) $this->request->post('municipality_name', '')),
            'iss_percent' => $this->toPercent($this->request->post('iss_percent', '')),
            'apply_iss_withholding' => $this->toBool($this->request->post('apply_iss_withholding', false)),
            'iss_withholding_percent' => $this->toPercent($this->request->post('iss_withholding_percent', '0')),
            'apply_irrf_withholding' => $this->toBool($this->request->post('apply_irrf_withholding', false)),
            'irrf_withholding_percent' => $this->toPercent($this->request->post('irrf_withholding_percent', '0')),
            'apply_pcc_withholding' => $this->toBool($this->request->post('apply_pcc_withholding', false)),
            'pcc_withholding_percent' => $this->toPercent($this->request->post('pcc_withholding_percent', '0')),
            'apply_inss_withholding' => $this->toBool($this->request->post('apply_inss_withholding', false)),
            'inss_withholding_percent' => $this->toPercent($this->request->post('inss_withholding_percent', '0')),
            'legal_responsible_name' => trim((string) $this->request->post('legal_responsible_name', '')),
            'legal_review_date' => trim((string) $this->request->post('legal_review_date', '')),
            'legal_notes_text' => trim((string) $this->request->post('legal_notes_text', '')),
            'check_regime' => $this->toBool($this->request->post('check_regime', false)),
            'check_iss' => $this->toBool($this->request->post('check_iss', false)),
            'check_retentions' => $this->toBool($this->request->post('check_retentions', false)),
            'check_nfse' => $this->toBool($this->request->post('check_nfse', false)),
        ];

        $errors = [];

        if ($payload['imposto_label'] === '' || $payload['taxa_label'] === '' || $payload['encargo_label'] === '') {
            $errors[] = 'Todos os nomes de campos tributarios devem ser preenchidos.';
        }

        foreach (['imposto_percent', 'taxa_percent', 'encargo_percent'] as $percentKey) {
            $value = $payload[$percentKey];
            if ($value === null || $value < 0 || $value > 100) {
                $errors[] = 'Percentuais devem ficar entre 0 e 100.';
                break;
            }
        }

        if (!in_array($payload['tax_regime'], self::ALLOWED_TAX_REGIMES, true)) {
            $errors[] = 'Selecione um regime tributario valido.';
        }

        if ($payload['municipality_name'] === '') {
            $errors[] = 'Informe o municipio de referencia para o ISS.';
        }

        if ($payload['iss_percent'] === null) {
            $errors[] = 'Informe a aliquota de ISS.';
        } elseif ($payload['tax_regime'] === 'mei') {
            if ($payload['iss_percent'] < 0 || $payload['iss_percent'] > 5) {
                $errors[] = 'Para MEI, use ISS entre 0 e 5% (normalmente recolhido no DAS fixo).';
            }
        } elseif ($payload['iss_percent'] < 2 || $payload['iss_percent'] > 5) {
            $errors[] = 'Para servicos em geral, a aliquota de ISS deve ficar entre 2% e 5%.';
        }

        $withholdingFields = [
            [
                'enabled' => 'apply_iss_withholding',
                'percent' => 'iss_withholding_percent',
                'label' => 'retencao de ISS',
                'max' => 5.0,
            ],
            [
                'enabled' => 'apply_irrf_withholding',
                'percent' => 'irrf_withholding_percent',
                'label' => 'retencao de IRRF',
                'max' => 100.0,
            ],
            [
                'enabled' => 'apply_pcc_withholding',
                'percent' => 'pcc_withholding_percent',
                'label' => 'retencao de PIS/COFINS/CSLL',
                'max' => 100.0,
            ],
            [
                'enabled' => 'apply_inss_withholding',
                'percent' => 'inss_withholding_percent',
                'label' => 'retencao de INSS',
                'max' => 100.0,
            ],
        ];

        foreach ($withholdingFields as $field) {
            $enabledKey = $field['enabled'];
            $percentKey = $field['percent'];
            $percentValue = $payload[$percentKey];

            if (!$payload[$enabledKey]) {
                $payload[$percentKey] = 0.0;
                continue;
            }

            if ($percentValue === null || $percentValue <= 0 || $percentValue > $field['max']) {
                $errors[] = 'Informe um percentual valido para ' . $field['label'] . '.';
            }
        }

        if ($payload['legal_responsible_name'] === '') {
            $errors[] = 'Informe o responsavel pela revisao fiscal.';
        }

        if (!$this->isDateYmd($payload['legal_review_date'])) {
            $errors[] = 'Informe uma data valida para a revisao fiscal.';
        }

        if (
            !$payload['check_regime']
            || !$payload['check_iss']
            || !$payload['check_retentions']
            || !$payload['check_nfse']
        ) {
            $errors[] = 'Confirme todos os itens do checklist de conformidade antes de salvar.';
        }

        if ($errors !== []) {
            $this->session->flash('error', implode(' ', $errors));
            $this->redirect('/admin/tributos');
        }

        $legalPayload = $this->buildCompliancePayload($payload);

        $model = new QuoteModel($this->app);
        $model->saveTaxSettings(
            [
                'imposto_label' => $payload['imposto_label'],
                'imposto_percent' => round((float) $payload['imposto_percent'], 2),
                'taxa_label' => $payload['taxa_label'],
                'taxa_percent' => round((float) $payload['taxa_percent'], 2),
                'encargo_label' => $payload['encargo_label'],
                'encargo_percent' => round((float) $payload['encargo_percent'], 2),
                'legal_notes' => $legalPayload,
            ]
        );

        $this->session->flash('success', 'Central Fiscal atualizada com parametros de conformidade e checklist legal.');
        $this->redirect('/admin/tributos');
    }

    private function buildCompliancePayload(array $payload): string
    {
        $data = [
            'version' => 'aq_tax_compliance_v1',
            'profile' => [
                'tax_regime' => $payload['tax_regime'],
                'municipality_name' => $payload['municipality_name'],
                'iss_percent' => round((float) $payload['iss_percent'], 2),
            ],
            'withholding' => [
                'apply_iss' => (bool) $payload['apply_iss_withholding'],
                'iss_percent' => round((float) $payload['iss_withholding_percent'], 2),
                'apply_irrf' => (bool) $payload['apply_irrf_withholding'],
                'irrf_percent' => round((float) $payload['irrf_withholding_percent'], 2),
                'apply_pcc' => (bool) $payload['apply_pcc_withholding'],
                'pcc_percent' => round((float) $payload['pcc_withholding_percent'], 2),
                'apply_inss' => (bool) $payload['apply_inss_withholding'],
                'inss_percent' => round((float) $payload['inss_withholding_percent'], 2),
            ],
            'legal' => [
                'responsible_name' => $payload['legal_responsible_name'],
                'review_date' => $payload['legal_review_date'],
            ],
            'checklist' => [
                'regime_confirmed' => (bool) $payload['check_regime'],
                'iss_confirmed' => (bool) $payload['check_iss'],
                'retentions_confirmed' => (bool) $payload['check_retentions'],
                'nfse_confirmed' => (bool) $payload['check_nfse'],
            ],
            'legal_references' => $this->legalReferences(),
            'legal_notes_text' => $payload['legal_notes_text'],
            'updated_at_iso' => date('c'),
        ];

        $encoded = json_encode($data, JSON_UNESCAPED_SLASHES);

        return is_string($encoded) ? $encoded : '';
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function legalReferences(): array
    {
        return [
            [
                'title' => 'Lei Complementar 116/2003',
                'description' => 'Base legal do ISS e limites de aliquota para servicos.',
                'url' => 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp116.htm',
            ],
            [
                'title' => 'Lei Complementar 123/2006',
                'description' => 'Regime do Simples Nacional e regras para MEI, ME e EPP.',
                'url' => 'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm',
            ],
            [
                'title' => 'NFS-e Padrao Nacional',
                'description' => 'Boas praticas de emissao fiscal e padronizacao nacional.',
                'url' => 'https://www.gov.br/receitafederal/pt-br/assuntos/noticias/2025/agosto/nota-fiscal-de-servico-eletronica-nfs-e-padrao-nacional-para-simplificar-o-cotidiano-das-empresas',
            ],
        ];
    }

    private function normalizeTaxRegime(string $value): string
    {
        $normalized = strtolower(trim($value));

        return str_replace(' ', '_', $normalized);
    }

    private function toBool(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        $normalized = strtolower(trim((string) $value));

        return in_array($normalized, ['1', 'true', 'on', 'sim', 'yes'], true);
    }

    private function isDateYmd(string $value): bool
    {
        if (!preg_match('/^\d{4}\-\d{2}\-\d{2}$/', $value)) {
            return false;
        }

        $date = \DateTimeImmutable::createFromFormat('Y-m-d', $value);

        return $date instanceof \DateTimeImmutable && $date->format('Y-m-d') === $value;
    }

    private function toPercent(mixed $raw): ?float
    {
        $value = trim((string) $raw);
        if ($value === '') {
            return 0.0;
        }

        $normalized = str_replace([' ', ','], ['', '.'], $value);
        $normalized = preg_replace('/[^0-9.\-]/', '', $normalized) ?? '';

        if ($normalized === '' || !is_numeric($normalized)) {
            return null;
        }

        return (float) $normalized;
    }
}
