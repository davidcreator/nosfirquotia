<?php

declare(strict_types=1);

namespace NosfirQuotia\Admin\Model;

use NosfirQuotia\System\Engine\Model;

final class CategoryModel extends Model
{
    public function all(): array
    {
        $this->ensureAreaTypeColumn();
        $this->ensureDefaultCategories();

        return $this->db->fetchAll(
            'SELECT id, area_type, name, description, base_price, created_at
             FROM design_categories
             ORDER BY area_type ASC, name ASC'
        );
    }

    public function create(string $areaType, string $name, string $description, float $basePrice): void
    {
        $this->ensureAreaTypeColumn();

        $this->db->execute(
            'INSERT INTO design_categories (area_type, name, slug, description, base_price)
             VALUES (:area_type, :name, :slug, :description, :base_price)',
            [
                'area_type' => $areaType,
                'name' => $name,
                'slug' => $this->slugify($name),
                'description' => $description,
                'base_price' => $basePrice,
            ]
        );
    }

    private function slugify(string $value): string
    {
        $slug = strtolower(trim($value));
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
        $slug = trim($slug, '-');

        return $slug !== '' ? $slug : 'categoria';
    }

    private function ensureAreaTypeColumn(): void
    {
        $columnExists = $this->db->fetch(
            "SELECT COUNT(*) AS total
             FROM information_schema.COLUMNS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = 'design_categories'
               AND COLUMN_NAME = 'area_type'"
        );

        if ((int) ($columnExists['total'] ?? 0) === 0) {
            $this->db->execute("ALTER TABLE design_categories ADD COLUMN area_type VARCHAR(30) NOT NULL DEFAULT 'design' AFTER id");
        }

        $indexExists = $this->db->fetch(
            "SELECT COUNT(*) AS total
             FROM information_schema.STATISTICS
             WHERE TABLE_SCHEMA = DATABASE()
               AND TABLE_NAME = 'design_categories'
               AND INDEX_NAME = 'idx_design_categories_area_type'"
        );

        if ((int) ($indexExists['total'] ?? 0) === 0) {
            $this->db->execute('CREATE INDEX idx_design_categories_area_type ON design_categories (area_type)');
        }

        $this->db->execute("UPDATE design_categories SET area_type = 'design' WHERE area_type IS NULL OR TRIM(area_type) = ''");
    }

    private function ensureDefaultCategories(): void
    {
        $defaults = [
            ['design', 'Design Grafico', 'logos, identidade visual, cartazes', 350.00],
            ['design', 'Design UX/UI', 'interfaces de apps e websites', 750.00],
            ['design', 'Ilustracao Digital', 'arte digital e storyboards', 450.00],
            ['development', 'Desenvolvimento Web', 'sites, sistemas web e portais sob medida', 2500.00],
            ['development', 'Aplicativo Mobile', 'aplicativos Android e iOS com foco em produto digital', 5000.00],
            ['development', 'Software Desktop', 'sistemas desktop para operacao interna e produtividade', 3200.00],
            ['development', 'Integracoes e API', 'integracoes entre sistemas, automacoes e API REST', 2800.00],
        ];

        foreach ($defaults as $default) {
            $areaType = (string) $default[0];
            $name = (string) $default[1];
            $description = (string) $default[2];
            $basePrice = (float) $default[3];
            $slug = $this->slugify($name);

            $exists = $this->db->fetch(
                'SELECT id FROM design_categories WHERE slug = :slug LIMIT 1',
                ['slug' => $slug]
            );

            if ($exists !== null) {
                $this->db->execute(
                    'UPDATE design_categories
                     SET area_type = :area_type
                     WHERE id = :id',
                    [
                        'id' => (int) $exists['id'],
                        'area_type' => $areaType,
                    ]
                );
                continue;
            }

            $this->db->execute(
                'INSERT INTO design_categories (area_type, name, slug, description, base_price)
                 VALUES (:area_type, :name, :slug, :description, :base_price)',
                [
                    'area_type' => $areaType,
                    'name' => $name,
                    'slug' => $slug,
                    'description' => $description,
                    'base_price' => $basePrice,
                ]
            );
        }
    }
}
