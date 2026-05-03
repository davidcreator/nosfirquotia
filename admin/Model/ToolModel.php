<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Model;

use NosfirQuotia\System\Engine\Model;

final class ToolModel extends Model
{
    private const NON_TOOL_DIRECTORIES = [
        'shared',
    ];

    private const TOOL_METADATA = [
        'bgremove' => [
            'name' => 'Background Remover',
            'description' => 'Remove fundo de imagens com opcoes de tolerancia, refinamento e exportacao.',
        ],
        'colorpalette' => [
            'name' => 'Color Palette',
            'description' => 'Gera paletas harmonicas a partir de cor base ou imagem.',
        ],
        'coloradvisor' => [
            'name' => 'Color Strategy Advisor',
            'description' => 'Assistente de decisao de cores para identidade visual com base em psicologia e marketing.',
        ],
        'fontadvisor' => [
            'name' => 'Font Strategy Advisor',
            'description' => 'Define pares tipograficos, hierarquia de fontes e recomendacoes para marca.',
        ],
        'brandmanual' => [
            'name' => 'Brand Manual Report (MVP)',
            'description' => 'Consolida identidade visual (cores, tipografia, mockups e diretriz digital) em um unico relatorio.',
        ],
        'brandbook' => [
            'name' => 'BrandBook',
            'description' => 'Relatorio robusto com paleta, tendencias, tipografia, OG e mockups sincronizados entre ferramentas.',
        ],
        'finalframe' => [
            'name' => 'FinalFrame',
            'description' => 'Relatorio final consolidado com dados de identidade, OG, mockups e background remover.',
        ],
        'mockups' => [
            'name' => 'Mockups',
            'description' => 'Criacao e edicao de mockups para apresentacoes de design.',
        ],
        'ocimage' => [
            'name' => 'OG Image Generator',
            'description' => 'Gerador de imagens para redes sociais (Open Graph).',
        ],
    ];

    public function listTools(string $toolsPath): array
    {
        if (!is_dir($toolsPath)) {
            return [];
        }

        $directories = glob($toolsPath . '/*', GLOB_ONLYDIR) ?: [];
        $tools = [];

        foreach ($directories as $directory) {
            $slug = basename($directory);
            if (in_array($slug, self::NON_TOOL_DIRECTORIES, true)) {
                continue;
            }
            $entrypoint = $directory . '/index.php';
            $hasEntrypoint = is_file($entrypoint);
            $metadata = self::TOOL_METADATA[$slug] ?? [
                'name' => ucwords(str_replace(['-', '_'], ' ', $slug)),
                'description' => 'Ferramenta integrada ao Quotia.',
            ];

            $tools[] = [
                'slug' => $slug,
                'name' => $metadata['name'],
                'description' => $metadata['description'],
                'has_entrypoint' => $hasEntrypoint,
                'status' => $hasEntrypoint ? 'disponivel' : 'pendente',
            ];
        }

        usort(
            $tools,
            static fn (array $a, array $b): int => strcmp((string) $a['name'], (string) $b['name'])
        );

        return $tools;
    }

    public function findTool(string $toolsPath, string $slug): ?array
    {
        $slug = trim($slug);
        if ($slug === '' || preg_match('/^[a-z0-9\\-]+$/', $slug) !== 1) {
            return null;
        }

        $allTools = $this->listTools($toolsPath);
        foreach ($allTools as $tool) {
            if ($tool['slug'] === $slug) {
                return $tool;
            }
        }

        return null;
    }
}
