<?php

declare(strict_types=1);

namespace NosfirQuotia\System\Engine;

use ReflectionClass;
use ReflectionNamedType;
use RuntimeException;

final class Container
{
    /**
     * @var array<string, callable(self): mixed>
     */
    private array $bindings = [];

    /**
     * @var array<string, bool>
     */
    private array $singletons = [];

    /**
     * @var array<string, mixed>
     */
    private array $instances = [];

    /**
     * @param callable(self): mixed $factory
     */
    public function bind(string $id, callable $factory): void
    {
        $this->bindings[$id] = $factory;
        $this->singletons[$id] = false;
        unset($this->instances[$id]);
    }

    /**
     * @param callable(self): mixed $factory
     */
    public function singleton(string $id, callable $factory): void
    {
        $this->bindings[$id] = $factory;
        $this->singletons[$id] = true;
        unset($this->instances[$id]);
    }

    public function instance(string $id, mixed $instance): void
    {
        $this->instances[$id] = $instance;
    }

    public function has(string $id): bool
    {
        return array_key_exists($id, $this->instances)
            || array_key_exists($id, $this->bindings)
            || class_exists($id);
    }

    public function make(string $id): mixed
    {
        if (array_key_exists($id, $this->instances)) {
            return $this->instances[$id];
        }

        if (array_key_exists($id, $this->bindings)) {
            $resolved = $this->bindings[$id]($this);
            if (!empty($this->singletons[$id])) {
                $this->instances[$id] = $resolved;
            }

            return $resolved;
        }

        if (!class_exists($id)) {
            throw new RuntimeException('Dependencia nao registrada no container: ' . $id);
        }

        $reflection = new ReflectionClass($id);
        if (!$reflection->isInstantiable()) {
            throw new RuntimeException('Classe nao instanciavel no container: ' . $id);
        }

        $constructor = $reflection->getConstructor();
        if ($constructor === null || $constructor->getNumberOfParameters() === 0) {
            return $reflection->newInstance();
        }

        $arguments = [];
        foreach ($constructor->getParameters() as $parameter) {
            $type = $parameter->getType();
            if ($type instanceof ReflectionNamedType && !$type->isBuiltin()) {
                $arguments[] = $this->make($type->getName());
                continue;
            }

            if ($parameter->isDefaultValueAvailable()) {
                $arguments[] = $parameter->getDefaultValue();
                continue;
            }

            throw new RuntimeException(
                'Nao foi possivel resolver parametro $' . $parameter->getName() . ' de ' . $id
            );
        }

        return $reflection->newInstanceArgs($arguments);
    }
}
