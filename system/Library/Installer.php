<?php

declare(strict_types=1);

namespace AureaQuotia\System\Library;

use PDO;
use PDOException;
use RuntimeException;
use AureaQuotia\System\Library\Auth;

final class Installer
{
    public function __construct(private readonly string $rootPath)
    {
    }

    public function requirementChecks(): array
    {
        return [
            [
                'label' => 'PHP 8.2 ou superior',
                'status' => version_compare(PHP_VERSION, '8.2.0', '>='),
                'detail' => 'Versao detectada: ' . PHP_VERSION,
            ],
            [
                'label' => 'Extensao PDO',
                'status' => extension_loaded('pdo'),
                'detail' => 'Necessaria para conexao de banco.',
            ],
            [
                'label' => 'Extensao PDO MySQL',
                'status' => extension_loaded('pdo_mysql'),
                'detail' => 'Necessaria para MySQL/MariaDB.',
            ],
            [
                'label' => 'Extensao mbstring',
                'status' => extension_loaded('mbstring'),
                'detail' => 'Recomendada para textos multi-byte.',
            ],
            [
                'label' => 'Extensao json',
                'status' => extension_loaded('json'),
                'detail' => 'Necessaria para respostas JSON.',
            ],
        ];
    }

    public function permissionChecks(): array
    {
        $targets = [
            'config/' => $this->rootPath . '/config',
            'config/config.php' => $this->rootPath . '/config/config.php',
            'storage/' => $this->rootPath . '/storage',
            'storage/cache/' => $this->rootPath . '/storage/cache',
            'storage/logs/' => $this->rootPath . '/storage/logs',
            'storage/sessions/' => $this->rootPath . '/storage/sessions',
        ];

        $checks = [];

        foreach ($targets as $label => $path) {
            if (is_dir($path)) {
                $status = is_writable($path);
            } elseif (is_file($path)) {
                $status = is_writable($path);
            } else {
                $status = is_writable(dirname($path));
            }

            $checks[] = [
                'label' => $label,
                'status' => $status,
                'detail' => $path,
            ];
        }

        return $checks;
    }

    public function install(array $data): array
    {
        $host = trim((string) ($data['db_host'] ?? ''));
        $port = (int) ($data['db_port'] ?? 3306);
        $database = trim((string) ($data['db_name'] ?? ''));
        $username = trim((string) ($data['db_user'] ?? ''));
        $password = (string) ($data['db_pass'] ?? '');
        $adminName = trim((string) ($data['admin_name'] ?? ''));
        $adminEmail = strtolower(trim((string) ($data['admin_email'] ?? '')));
        $adminPass = (string) ($data['admin_pass'] ?? '');
        $importReferencePrices = (bool) ($data['import_reference_prices'] ?? true);

        if ($host === '' || $database === '' || $username === '') {
            return ['success' => false, 'error' => 'Preencha host, banco e usuario do banco.'];
        }

        if ($adminName === '' || $adminEmail === '' || $adminPass === '') {
            return ['success' => false, 'error' => 'Preencha os dados do administrador.'];
        }

        if (filter_var($adminEmail, FILTER_VALIDATE_EMAIL) === false) {
            return ['success' => false, 'error' => 'Email de administrador invalido.'];
        }

        try {
            $serverDsn = sprintf('mysql:host=%s;port=%d;charset=utf8mb4', $host, $port);
            $pdo = new PDO(
                $serverDsn,
                $username,
                $password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );

            $quotedDbName = str_replace('`', '``', $database);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$quotedDbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $pdo->exec("USE `{$quotedDbName}`");

            $schemaPath = $this->rootPath . '/database/schema.sql';
            if (!is_file($schemaPath)) {
                throw new RuntimeException('Arquivo de schema nao encontrado.');
            }

            $this->runSchema($pdo, (string) file_get_contents($schemaPath));
            $this->seedAdmin($pdo, $adminName, $adminEmail, $adminPass);
            $this->seedCategories($pdo);

            if ($importReferencePrices) {
                $this->seedReferencePrices([
                    'driver' => 'mysql',
                    'host' => $host,
                    'port' => $port,
                    'database' => $database,
                    'username' => $username,
                    'password' => $password,
                    'charset' => 'utf8mb4',
                ]);
            }

            $this->writeConfig($host, $port, $database, $username, $password);
            $this->writeInstallLock();

            return [
                'success' => true,
                'error' => null,
                'imported_reference_prices' => $importReferencePrices,
            ];
        } catch (PDOException | RuntimeException $exception) {
            return [
                'success' => false,
                'error' => 'Falha na instalacao: ' . $exception->getMessage(),
                'imported_reference_prices' => false,
            ];
        }
    }

    private function runSchema(PDO $pdo, string $schema): void
    {
        $statements = preg_split('/;\s*[\r\n]+/m', $schema) ?: [];

        foreach ($statements as $statement) {
            $statement = trim($statement);
            if ($statement === '') {
                continue;
            }

            $pdo->exec($statement);
        }
    }

    private function seedAdmin(PDO $pdo, string $name, string $email, string $password): void
    {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $allPermissions = json_encode(Auth::permissionKeys(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        $pdo->prepare(
            'INSERT INTO admin_users (
                name, email, password, access_level, is_general_admin, is_active, permissions_json
             ) VALUES (
                :name, :email, :password, :access_level, :is_general_admin, :is_active, :permissions_json
             )'
        )->execute([
            'name' => $name,
            'email' => $email,
            'password' => $hash,
            'access_level' => 'Administrador Geral',
            'is_general_admin' => 1,
            'is_active' => 1,
            'permissions_json' => $allPermissions,
        ]);
    }

    private function seedCategories(PDO $pdo): void
    {
        $categories = [
            ['design', 'Design Grafico', 'logos, identidade visual, cartazes', 350.00],
            ['design', 'Design de Produto', 'mobiliario, eletronicos, embalagens', 600.00],
            ['design', 'Design de Interiores', 'espacos residenciais e comerciais', 900.00],
            ['design', 'Design de Moda', 'vestuario, acessorios, calcados', 500.00],
            ['design', 'Design UX/UI', 'interfaces de apps e websites', 750.00],
            ['design', 'Motion Design', 'videos explicativos e efeitos visuais', 800.00],
            ['design', 'Design Editorial', 'diagramacao de livros, revistas e jornais', 550.00],
            ['design', 'Ilustracao Digital', 'arte digital e storyboards', 450.00],
            ['development', 'Desenvolvimento Web', 'sites, sistemas web e portais sob medida', 2500.00],
            ['development', 'Aplicativo Mobile', 'aplicativos Android e iOS com foco em produto digital', 5000.00],
            ['development', 'Software Desktop', 'sistemas desktop para operacao interna e produtividade', 3200.00],
            ['development', 'Integracoes e API', 'integracoes entre sistemas, automacoes e API REST', 2800.00],
        ];

        $statement = $pdo->prepare(
            'INSERT INTO design_categories (area_type, name, slug, description, base_price)
             VALUES (:area_type, :name, :slug, :description, :base_price)'
        );

        foreach ($categories as $category) {
            $statement->execute([
                'area_type' => $category[0],
                'name' => $category[1],
                'slug' => $this->slugify($category[1]),
                'description' => $category[2],
                'base_price' => $category[3],
            ]);
        }
    }

    private function seedReferencePrices(array $dbConfig): void
    {
        $jsonPath = $this->rootPath . '/database/reference_prices_2025.json';
        $database = new Database($dbConfig);
        $importer = new ReferencePriceImporter($database);
        $importer->importFromJson($jsonPath);
    }

    private function writeConfig(string $host, int $port, string $database, string $username, string $password): void
    {
        $configPath = $this->rootPath . '/config/config.php';
        $existing = [];

        if (is_file($configPath)) {
            $loaded = require $configPath;
            if (is_array($loaded)) {
                $existing = $loaded;
            }
        }

        $environment = (string) ($existing['environment'] ?? 'online');
        if ($environment === '') {
            $environment = 'online';
        }

        $mailDefaults = [
            'enabled' => true,
            'from_name' => 'Aurea Quotia',
            'from_email' => 'no-reply@localhost',
        ];

        $environments = [];
        if (isset($existing['environments']) && is_array($existing['environments'])) {
            $environments = $existing['environments'];
        } elseif (isset($existing['db']) && is_array($existing['db'])) {
            $environments['online'] = [
                'installed' => (bool) ($existing['installed'] ?? false),
                'db' => $existing['db'],
                'mail' => is_array($existing['mail'] ?? null) ? $existing['mail'] : $mailDefaults,
            ];
        }

        $mail = $mailDefaults;
        if (isset($environments[$environment]['mail']) && is_array($environments[$environment]['mail'])) {
            $mail = $environments[$environment]['mail'];
        } elseif (is_array($existing['mail'] ?? null)) {
            $mail = $existing['mail'];
        }

        $environments[$environment] = [
            'installed' => true,
            'db' => [
                'driver' => 'mysql',
                'host' => $host,
                'port' => $port,
                'database' => $database,
                'username' => $username,
                'password' => $password,
                'charset' => 'utf8mb4',
            ],
            'mail' => $mail,
        ];

        if (!isset($environments['local']) || !is_array($environments['local'])) {
            $environments['local'] = [
                'installed' => false,
                'db' => [
                    'driver' => 'mysql',
                    'host' => '127.0.0.1',
                    'port' => 3306,
                    'database' => '',
                    'username' => 'root',
                    'password' => '',
                    'charset' => 'utf8mb4',
                ],
                'mail' => $mailDefaults,
            ];
        }

        if (!isset($environments['online']) || !is_array($environments['online'])) {
            $environments['online'] = [
                'installed' => false,
                'db' => [
                    'driver' => 'mysql',
                    'host' => 'localhost',
                    'port' => 3306,
                    'database' => '',
                    'username' => '',
                    'password' => '',
                    'charset' => 'utf8mb4',
                ],
                'mail' => $mailDefaults,
            ];
        }

        $config = [
            'name' => (string) ($existing['name'] ?? 'Aurea Quotia'),
            'timezone' => (string) ($existing['timezone'] ?? 'America/Sao_Paulo'),
            'environment' => $environment,
            'environments' => $environments,
        ];

        $content = "<?php\n\n";
        $content .= "declare(strict_types=1);\n\n";
        $content .= 'return ' . var_export($config, true) . ";\n";

        if (file_put_contents($configPath, $content) === false) {
            throw new RuntimeException('Nao foi possivel escrever config/config.php');
        }
    }

    private function writeInstallLock(): void
    {
        $lockPath = $this->rootPath . '/storage/installed.lock';
        if (file_put_contents($lockPath, date('c')) === false) {
            throw new RuntimeException('Nao foi possivel criar storage/installed.lock');
        }
    }

    private function slugify(string $value): string
    {
        $slug = strtolower(trim($value));
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
        $slug = trim($slug, '-');

        return $slug !== '' ? $slug : 'categoria';
    }
}
