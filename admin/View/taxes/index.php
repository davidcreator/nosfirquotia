<?php
$taxRegime = (string) ($settings['tax_regime'] ?? 'simples_nacional');
$municipalityName = (string) ($settings['municipality_name'] ?? '');
$issPercent = (float) ($settings['iss_percent'] ?? 2);

$applyIssWithholding = !empty($settings['apply_iss_withholding']);
$issWithholdingPercent = (float) ($settings['iss_withholding_percent'] ?? 0);
$applyIrrfWithholding = !empty($settings['apply_irrf_withholding']);
$irrfWithholdingPercent = (float) ($settings['irrf_withholding_percent'] ?? 0);
$applyPccWithholding = !empty($settings['apply_pcc_withholding']);
$pccWithholdingPercent = (float) ($settings['pcc_withholding_percent'] ?? 0);
$applyInssWithholding = !empty($settings['apply_inss_withholding']);
$inssWithholdingPercent = (float) ($settings['inss_withholding_percent'] ?? 0);

$legalResponsibleName = (string) ($settings['legal_responsible_name'] ?? '');
$legalReviewDate = (string) ($settings['legal_review_date'] ?? date('Y-m-d'));
$legalNotesText = (string) ($settings['legal_notes_text'] ?? '');

$checkRegime = !empty($settings['check_regime']);
$checkIss = !empty($settings['check_iss']);
$checkRetentions = !empty($settings['check_retentions']);
$checkNfse = !empty($settings['check_nfse']);

$legalReferences = $settings['legal_references'] ?? [];
if (!is_array($legalReferences)) {
    $legalReferences = [];
}
?>

<section class="aq-admin-page-hero">
    <div class="row g-2 align-items-center">
        <div class="col-md-8">
            <h1 class="aq-admin-page-hero-title">Central fiscal</h1>
            <p class="aq-admin-page-hero-subtitle">Parâmetros tributários com foco em conformidade brasileira para apoiar a formação de orçamentos.</p>
        </div>
        <div class="col-md-4">
            <div class="aq-admin-page-hero-meta">
                <span class="aq-admin-link-chip"><i class="fa-solid fa-scale-balanced"></i> Compliance</span>
            </div>
        </div>
    </div>
</section>

<section class="row g-3 mb-3">
    <div class="col-lg-8">
        <div class="aq-admin-panel h-100">
            <div class="aq-admin-panel-header">
                <div>
                    <h2 class="aq-admin-panel-title">Configuração de conformidade fiscal</h2>
                    <p class="aq-admin-panel-subtitle">Preencha o perfil tributário da agência para reduzir risco fiscal e padronizar os relatórios.</p>
                </div>
            </div>
            <div class="aq-admin-panel-body">
                <form method="post" action="<?= e(url('/admin/tributos')) ?>" class="row g-3">
                    <div class="col-12">
                        <h3 class="h6 text-uppercase text-muted mb-2">1) Perfil tributário</h3>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Regime tributário</label>
                        <select class="form-select" name="tax_regime" id="taxRegimeField" required>
                            <option value="mei" <?= $taxRegime === 'mei' ? 'selected' : '' ?>>MEI</option>
                            <option value="simples_nacional" <?= $taxRegime === 'simples_nacional' ? 'selected' : '' ?>>Simples Nacional</option>
                            <option value="lucro_presumido" <?= $taxRegime === 'lucro_presumido' ? 'selected' : '' ?>>Lucro Presumido</option>
                            <option value="lucro_real" <?= $taxRegime === 'lucro_real' ? 'selected' : '' ?>>Lucro Real</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Município de referência do ISS</label>
                        <input class="form-control" name="municipality_name" value="<?= e($municipalityName) ?>" placeholder="Ex.: Sao Paulo/SP" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Aliquota de ISS (%)</label>
                        <input type="number" step="0.01" min="0" max="5" class="form-control" name="iss_percent" id="issPercentField"
                               value="<?= e(number_format($issPercent, 2, '.', '')) ?>" required>
                        <div class="form-text" id="issHintText">Faixa legal comum para serviços: entre 2% e 5%.</div>
                    </div>

                    <div class="col-12 pt-2">
                        <h3 class="h6 text-uppercase text-muted mb-2">2) Parâmetros usados no relatório de orçamento</h3>
                    </div>
                    <div class="col-md-8">
                        <label class="form-label">Componente 1 (tributos)</label>
                        <input class="form-control" name="imposto_label" value="<?= e((string) ($settings['imposto_label'] ?? 'Tributos sobre faturamento')) ?>" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Percentual (%)</label>
                        <input type="number" step="0.01" min="0" max="100" class="form-control" name="imposto_percent"
                               value="<?= e(number_format((float) ($settings['imposto_percent'] ?? 0), 2, '.', '')) ?>" required>
                    </div>
                    <div class="col-md-8">
                        <label class="form-label">Componente 2 (taxas)</label>
                        <input class="form-control" name="taxa_label" value="<?= e((string) ($settings['taxa_label'] ?? 'Taxas administrativas')) ?>" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Percentual (%)</label>
                        <input type="number" step="0.01" min="0" max="100" class="form-control" name="taxa_percent"
                               value="<?= e(number_format((float) ($settings['taxa_percent'] ?? 0), 2, '.', '')) ?>" required>
                    </div>
                    <div class="col-md-8">
                        <label class="form-label">Componente 3 (encargos)</label>
                        <input class="form-control" name="encargo_label" value="<?= e((string) ($settings['encargo_label'] ?? 'Encargos gerais')) ?>" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Percentual (%)</label>
                        <input type="number" step="0.01" min="0" max="100" class="form-control" name="encargo_percent"
                               value="<?= e(number_format((float) ($settings['encargo_percent'] ?? 0), 2, '.', '')) ?>" required>
                    </div>

                    <div class="col-12 pt-2">
                        <h3 class="h6 text-uppercase text-muted mb-2">3) Retenções na fonte</h3>
                    </div>
                    <div class="col-md-6">
                        <div class="border rounded-3 p-3 h-100 aq-admin-tax-box">
                            <div class="form-check form-switch mb-2">
                                <input class="form-check-input js-toggle-percent" type="checkbox" id="applyIssWithholding" name="apply_iss_withholding" value="1"
                                       data-target="issWithholdingPercent" <?= $applyIssWithholding ? 'checked' : '' ?>>
                                <label class="form-check-label fw-semibold" for="applyIssWithholding">Aplicar retenção de ISS</label>
                            </div>
                            <label class="form-label mb-1" for="issWithholdingPercent">Percentual (%)</label>
                            <input type="number" step="0.01" min="0" max="5" class="form-control" id="issWithholdingPercent" name="iss_withholding_percent"
                                   value="<?= e(number_format($issWithholdingPercent, 2, '.', '')) ?>" <?= $applyIssWithholding ? '' : 'disabled' ?>>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="border rounded-3 p-3 h-100 aq-admin-tax-box">
                            <div class="form-check form-switch mb-2">
                                <input class="form-check-input js-toggle-percent" type="checkbox" id="applyIrrfWithholding" name="apply_irrf_withholding" value="1"
                                       data-target="irrfWithholdingPercent" <?= $applyIrrfWithholding ? 'checked' : '' ?>>
                                <label class="form-check-label fw-semibold" for="applyIrrfWithholding">Aplicar retenção de IRRF</label>
                            </div>
                            <label class="form-label mb-1" for="irrfWithholdingPercent">Percentual (%)</label>
                            <input type="number" step="0.01" min="0" max="100" class="form-control" id="irrfWithholdingPercent" name="irrf_withholding_percent"
                                   value="<?= e(number_format($irrfWithholdingPercent, 2, '.', '')) ?>" <?= $applyIrrfWithholding ? '' : 'disabled' ?>>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="border rounded-3 p-3 h-100 aq-admin-tax-box">
                            <div class="form-check form-switch mb-2">
                                <input class="form-check-input js-toggle-percent" type="checkbox" id="applyPccWithholding" name="apply_pcc_withholding" value="1"
                                       data-target="pccWithholdingPercent" <?= $applyPccWithholding ? 'checked' : '' ?>>
                                <label class="form-check-label fw-semibold" for="applyPccWithholding">Aplicar PIS/COFINS/CSLL (PCC)</label>
                            </div>
                            <label class="form-label mb-1" for="pccWithholdingPercent">Percentual (%)</label>
                            <input type="number" step="0.01" min="0" max="100" class="form-control" id="pccWithholdingPercent" name="pcc_withholding_percent"
                                   value="<?= e(number_format($pccWithholdingPercent, 2, '.', '')) ?>" <?= $applyPccWithholding ? '' : 'disabled' ?>>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="border rounded-3 p-3 h-100 aq-admin-tax-box">
                            <div class="form-check form-switch mb-2">
                                <input class="form-check-input js-toggle-percent" type="checkbox" id="applyInssWithholding" name="apply_inss_withholding" value="1"
                                       data-target="inssWithholdingPercent" <?= $applyInssWithholding ? 'checked' : '' ?>>
                                <label class="form-check-label fw-semibold" for="applyInssWithholding">Aplicar retenção de INSS</label>
                            </div>
                            <label class="form-label mb-1" for="inssWithholdingPercent">Percentual (%)</label>
                            <input type="number" step="0.01" min="0" max="100" class="form-control" id="inssWithholdingPercent" name="inss_withholding_percent"
                                   value="<?= e(number_format($inssWithholdingPercent, 2, '.', '')) ?>" <?= $applyInssWithholding ? '' : 'disabled' ?>>
                        </div>
                    </div>

                    <div class="col-12 pt-2">
                        <h3 class="h6 text-uppercase text-muted mb-2">4) Governanca e checklist legal</h3>
                    </div>
                    <div class="col-md-7">
                        <label class="form-label">Responsável pela revisão fiscal</label>
                        <input class="form-control" name="legal_responsible_name" value="<?= e($legalResponsibleName) ?>" placeholder="Ex.: Contabilidade Parceira" required>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Data da última revisão</label>
                        <input type="date" class="form-control" name="legal_review_date" value="<?= e($legalReviewDate) ?>" required>
                    </div>
                    <div class="col-12">
                        <label class="form-label">Notas internas de conformidade</label>
                        <textarea class="form-control" rows="3" name="legal_notes_text" placeholder="Ex.: Regras municipais de ISS e cenários de retenção por tipo de contrato."><?= e($legalNotesText) ?></textarea>
                    </div>
                    <div class="col-12">
                        <div class="border rounded-3 p-3 bg-light aq-admin-tax-box">
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="checkRegime" name="check_regime" value="1" required <?= $checkRegime ? 'checked' : '' ?>>
                                <label class="form-check-label" for="checkRegime">Regime tributário revisado e coerente com o CNPJ ativo.</label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="checkIss" name="check_iss" value="1" required <?= $checkIss ? 'checked' : '' ?>>
                                <label class="form-check-label" for="checkIss">Alíquota de ISS validada conforme município e natureza do serviço.</label>
                            </div>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="checkRetentions" name="check_retentions" value="1" required <?= $checkRetentions ? 'checked' : '' ?>>
                                <label class="form-check-label" for="checkRetentions">Retenções na fonte revisadas conforme tomador, contrato e legislação aplicável.</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="checkNfse" name="check_nfse" value="1" required <?= $checkNfse ? 'checked' : '' ?>>
                                <label class="form-check-label" for="checkNfse">Fluxo de emissão de NFS-e e obrigações acessórias confirmado para o município.</label>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 d-flex justify-content-end">
                        <button class="btn btn-primary" type="submit">Salvar Central Fiscal</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="col-lg-4">
        <div class="aq-admin-panel h-100">
            <div class="aq-admin-panel-header">
                <div>
                    <h2 class="aq-admin-panel-title">Assistente fiscal</h2>
                </div>
            </div>
            <div class="aq-admin-panel-body">
                <p class="small text-muted">Este painel ajuda na padronização interna. A validação final deve ser feita por contador responsável antes da proposta ao cliente.</p>

                <div class="alert alert-warning small mb-3">
                    O sistema não substitui consultoria contábil ou jurídica. Use os campos para registrar revisão técnica e rastreabilidade.
                </div>

                <h3 class="h6 text-uppercase text-muted mb-2">Referências legais</h3>
                <?php if ($legalReferences === []): ?>
                    <p class="small text-muted mb-0">Nenhuma referência cadastrada.</p>
                <?php else: ?>
                    <ul class="small mb-3 ps-3">
                        <?php foreach ($legalReferences as $reference): ?>
                            <?php
                            $title = trim((string) ($reference['title'] ?? 'Referencia legal'));
                            $description = trim((string) ($reference['description'] ?? ''));
                            $link = trim((string) ($reference['url'] ?? ''));
                            ?>
                            <li class="mb-2">
                                <div><strong><?= e($title) ?></strong></div>
                                <?php if ($description !== ''): ?>
                                    <div class="text-muted"><?= e($description) ?></div>
                                <?php endif; ?>
                                <?php if ($link !== ''): ?>
                                    <a href="<?= e($link) ?>" target="_blank" rel="noopener">Acessar fonte</a>
                                <?php endif; ?>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>

                <h3 class="h6 text-uppercase text-muted mb-2">Boas praticas</h3>
                <ul class="small mb-0 ps-3">
                    <li>Revisar regras municipais de ISS sempre que houver mudança de tomador.</li>
                    <li>Documentar retenções para evitar divergência entre proposta, nota e recebimento.</li>
                    <li>Atualizar esta central sempre que houver mudança de regime ou de legislação aplicável.</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<section class="aq-admin-panel">
    <div class="aq-admin-panel-header">
        <div>
            <h2 class="aq-admin-panel-title">Simulador fiscal de orçamento</h2>
            <p class="aq-admin-panel-subtitle">Simule incidência tributária e efeito das retenções para estimar valor bruto e líquido.</p>
        </div>
    </div>
    <div class="aq-admin-panel-body">
        <div class="row g-3">
            <div class="col-md-3">
                <label class="form-label">Subtotal dos serviços (R$)</label>
                <input type="number" step="0.01" min="0" id="fiscalSubtotal" class="form-control" value="0.00">
            </div>
            <div class="col-md-3">
                <label class="form-label"><?= e((string) ($settings['imposto_label'] ?? 'Tributos sobre faturamento')) ?> (%)</label>
                <input type="number" step="0.01" min="0" max="100" id="fiscalImpostoPercent" class="form-control"
                       value="<?= e(number_format((float) ($settings['imposto_percent'] ?? 0), 2, '.', '')) ?>">
            </div>
            <div class="col-md-3">
                <label class="form-label"><?= e((string) ($settings['taxa_label'] ?? 'Taxas administrativas')) ?> (%)</label>
                <input type="number" step="0.01" min="0" max="100" id="fiscalTaxaPercent" class="form-control"
                       value="<?= e(number_format((float) ($settings['taxa_percent'] ?? 0), 2, '.', '')) ?>">
            </div>
            <div class="col-md-3">
                <label class="form-label"><?= e((string) ($settings['encargo_label'] ?? 'Encargos gerais')) ?> (%)</label>
                <input type="number" step="0.01" min="0" max="100" id="fiscalEncargoPercent" class="form-control"
                       value="<?= e(number_format((float) ($settings['encargo_percent'] ?? 0), 2, '.', '')) ?>">
            </div>
        </div>

        <div class="row g-3 mt-1">
            <div class="col-md-3">
                <div class="form-check form-switch mb-1">
                    <input class="form-check-input js-sim-toggle" type="checkbox" id="fiscalApplyIssWh" data-target="fiscalIssWhPercent" <?= $applyIssWithholding ? 'checked' : '' ?>>
                    <label class="form-check-label" for="fiscalApplyIssWh">Retencao ISS</label>
                </div>
                <input type="number" step="0.01" min="0" max="5" id="fiscalIssWhPercent" class="form-control form-control-sm"
                       value="<?= e(number_format($issWithholdingPercent, 2, '.', '')) ?>" <?= $applyIssWithholding ? '' : 'disabled' ?>>
            </div>
            <div class="col-md-3">
                <div class="form-check form-switch mb-1">
                    <input class="form-check-input js-sim-toggle" type="checkbox" id="fiscalApplyIrrfWh" data-target="fiscalIrrfWhPercent" <?= $applyIrrfWithholding ? 'checked' : '' ?>>
                    <label class="form-check-label" for="fiscalApplyIrrfWh">Retencao IRRF</label>
                </div>
                <input type="number" step="0.01" min="0" max="100" id="fiscalIrrfWhPercent" class="form-control form-control-sm"
                       value="<?= e(number_format($irrfWithholdingPercent, 2, '.', '')) ?>" <?= $applyIrrfWithholding ? '' : 'disabled' ?>>
            </div>
            <div class="col-md-3">
                <div class="form-check form-switch mb-1">
                    <input class="form-check-input js-sim-toggle" type="checkbox" id="fiscalApplyPccWh" data-target="fiscalPccWhPercent" <?= $applyPccWithholding ? 'checked' : '' ?>>
                    <label class="form-check-label" for="fiscalApplyPccWh">Retencao PCC</label>
                </div>
                <input type="number" step="0.01" min="0" max="100" id="fiscalPccWhPercent" class="form-control form-control-sm"
                       value="<?= e(number_format($pccWithholdingPercent, 2, '.', '')) ?>" <?= $applyPccWithholding ? '' : 'disabled' ?>>
            </div>
            <div class="col-md-3">
                <div class="form-check form-switch mb-1">
                    <input class="form-check-input js-sim-toggle" type="checkbox" id="fiscalApplyInssWh" data-target="fiscalInssWhPercent" <?= $applyInssWithholding ? 'checked' : '' ?>>
                    <label class="form-check-label" for="fiscalApplyInssWh">Retencao INSS</label>
                </div>
                <input type="number" step="0.01" min="0" max="100" id="fiscalInssWhPercent" class="form-control form-control-sm"
                       value="<?= e(number_format($inssWithholdingPercent, 2, '.', '')) ?>" <?= $applyInssWithholding ? '' : 'disabled' ?>>
            </div>
        </div>

        <div class="table-responsive mt-3">
            <table class="table table-sm align-middle mb-0">
                <thead class="table-light">
                <tr>
                    <th>Componente</th>
                    <th class="text-end">Valor</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><?= e((string) ($settings['imposto_label'] ?? 'Tributos sobre faturamento')) ?></td>
                    <td class="text-end" id="fiscalImpostoAmount">R$ 0,00</td>
                </tr>
                <tr>
                    <td><?= e((string) ($settings['taxa_label'] ?? 'Taxas administrativas')) ?></td>
                    <td class="text-end" id="fiscalTaxaAmount">R$ 0,00</td>
                </tr>
                <tr>
                    <td><?= e((string) ($settings['encargo_label'] ?? 'Encargos gerais')) ?></td>
                    <td class="text-end" id="fiscalEncargoAmount">R$ 0,00</td>
                </tr>
                <tr>
                    <td>Retenções na fonte</td>
                    <td class="text-end text-danger" id="fiscalWithholdingAmount">R$ 0,00</td>
                </tr>
                <tr class="table-light">
                    <th>Total bruto estimado</th>
                    <th class="text-end" id="fiscalGrossAmount">R$ 0,00</th>
                </tr>
                <tr class="table-success">
                    <th>Recebimento liquido estimado</th>
                    <th class="text-end" id="fiscalNetAmount">R$ 0,00</th>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</section>

<script>
(() => {
    const taxRegimeField = document.getElementById('taxRegimeField');
    const issPercentField = document.getElementById('issPercentField');
    const issHintText = document.getElementById('issHintText');

    const updateIssHint = () => {
        if (!taxRegimeField || !issHintText || !issPercentField) {
            return;
        }

        const regime = String(taxRegimeField.value || '').toLowerCase();
        if (regime === 'mei') {
            issHintText.textContent = 'Para MEI, o ISS costuma ser recolhido no DAS fixo. Valide com a contabilidade antes de definir percentual.';
            issPercentField.setAttribute('min', '0');
            issPercentField.setAttribute('max', '5');
            return;
        }

        issHintText.textContent = 'Faixa legal comum para serviços: entre 2% e 5%.';
        issPercentField.setAttribute('min', '2');
        issPercentField.setAttribute('max', '5');
    };

    const bindToggleInput = (toggle, targetInput) => {
        if (!toggle || !targetInput) {
            return;
        }

        const sync = () => {
            const enabled = !!toggle.checked;
            targetInput.disabled = !enabled;
            if (!enabled) {
                targetInput.value = '0.00';
            }
        };

        toggle.addEventListener('change', sync);
        sync();
    };

    const formToggles = Array.from(document.querySelectorAll('.js-toggle-percent'));
    for (const toggle of formToggles) {
        const targetId = toggle.getAttribute('data-target');
        if (!targetId) {
            continue;
        }

        const targetInput = document.getElementById(targetId);
        bindToggleInput(toggle, targetInput);
    }

    if (taxRegimeField) {
        taxRegimeField.addEventListener('change', updateIssHint);
    }
    updateIssHint();

    const subtotalInput = document.getElementById('fiscalSubtotal');
    const impostoInput = document.getElementById('fiscalImpostoPercent');
    const taxaInput = document.getElementById('fiscalTaxaPercent');
    const encargoInput = document.getElementById('fiscalEncargoPercent');

    const simToggles = Array.from(document.querySelectorAll('.js-sim-toggle'));
    for (const toggle of simToggles) {
        const targetId = toggle.getAttribute('data-target');
        if (!targetId) {
            continue;
        }
        bindToggleInput(toggle, document.getElementById(targetId));
    }

    const simIssWhInput = document.getElementById('fiscalIssWhPercent');
    const simIrrfWhInput = document.getElementById('fiscalIrrfWhPercent');
    const simPccWhInput = document.getElementById('fiscalPccWhPercent');
    const simInssWhInput = document.getElementById('fiscalInssWhPercent');

    const impostoAmountEl = document.getElementById('fiscalImpostoAmount');
    const taxaAmountEl = document.getElementById('fiscalTaxaAmount');
    const encargoAmountEl = document.getElementById('fiscalEncargoAmount');
    const withholdingAmountEl = document.getElementById('fiscalWithholdingAmount');
    const grossAmountEl = document.getElementById('fiscalGrossAmount');
    const netAmountEl = document.getElementById('fiscalNetAmount');

    const toNumber = (value) => {
        const parsed = parseFloat(String(value).replace(',', '.'));
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const money = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const recalc = () => {
        const subtotal = toNumber(subtotalInput ? subtotalInput.value : 0);
        const imposto = toNumber(impostoInput ? impostoInput.value : 0);
        const taxa = toNumber(taxaInput ? taxaInput.value : 0);
        const encargo = toNumber(encargoInput ? encargoInput.value : 0);

        const impostoAmount = subtotal * (Math.max(0, imposto) / 100);
        const taxaAmount = subtotal * (Math.max(0, taxa) / 100);
        const encargoAmount = subtotal * (Math.max(0, encargo) / 100);

        const issWh = simIssWhInput && !simIssWhInput.disabled ? toNumber(simIssWhInput.value) : 0;
        const irrfWh = simIrrfWhInput && !simIrrfWhInput.disabled ? toNumber(simIrrfWhInput.value) : 0;
        const pccWh = simPccWhInput && !simPccWhInput.disabled ? toNumber(simPccWhInput.value) : 0;
        const inssWh = simInssWhInput && !simInssWhInput.disabled ? toNumber(simInssWhInput.value) : 0;

        const totalWithholdingPercent = Math.max(0, issWh) + Math.max(0, irrfWh) + Math.max(0, pccWh) + Math.max(0, inssWh);
        const withholdings = subtotal * (totalWithholdingPercent / 100);
        const grossTotal = subtotal + impostoAmount + taxaAmount + encargoAmount;
        const netTotal = grossTotal - withholdings;

        if (impostoAmountEl) impostoAmountEl.textContent = money(impostoAmount);
        if (taxaAmountEl) taxaAmountEl.textContent = money(taxaAmount);
        if (encargoAmountEl) encargoAmountEl.textContent = money(encargoAmount);
        if (withholdingAmountEl) withholdingAmountEl.textContent = money(withholdings);
        if (grossAmountEl) grossAmountEl.textContent = money(grossTotal);
        if (netAmountEl) netAmountEl.textContent = money(netTotal);
    };

    const watchInputs = [
        subtotalInput,
        impostoInput,
        taxaInput,
        encargoInput,
        simIssWhInput,
        simIrrfWhInput,
        simPccWhInput,
        simInssWhInput,
        ...simToggles
    ].filter(Boolean);

    for (const input of watchInputs) {
        input.addEventListener('input', recalc);
        input.addEventListener('change', recalc);
    }

    recalc();
})();
</script>

