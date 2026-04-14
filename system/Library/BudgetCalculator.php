<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Library;

final class BudgetCalculator
{
    public function calculate(array $category, int $complexity, string $urgency, int $deliverables): array
    {
        $base = (float) ($category['base_price'] ?? 0);
        $complexity = max(1, min(5, $complexity));
        $deliverables = max(1, min(200, $deliverables));

        $complexityFactor = 1 + (($complexity - 1) * 0.22);
        $urgencyFactor = match ($urgency) {
            'rapido' => 1.2,
            'express' => 1.45,
            default => 1.0,
        };

        $deliverablesCost = $deliverables * 45;
        $subtotal = ($base * $complexityFactor) + $deliverablesCost;
        $managementFee = $subtotal * 0.08;
        $total = ($subtotal + $managementFee) * $urgencyFactor;

        return [
            'base' => round($base, 2),
            'complexity_factor' => round($complexityFactor, 2),
            'urgency_factor' => round($urgencyFactor, 2),
            'deliverables_cost' => round($deliverablesCost, 2),
            'management_fee' => round($managementFee, 2),
            'total' => round($total, 2),
        ];
    }
}
