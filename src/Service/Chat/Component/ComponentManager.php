<?php

namespace App\Service\Chat\Component;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;

class ComponentManager
{
    public const string PATH_TEMPLATE = '/assets/widgets/%s/usage.md';

    /**
     * @var array<string, ComponentInterface>
     */
    private array $components = [];

    /**
     * @param iterable<ComponentInterface> $components
     */
    public function __construct(
        #[Autowire('%kernel.project_dir%')]
        private readonly string $projectDir,
        #[AutowireIterator(tag: 'app.chat.component')]
        iterable $components = [],
    ) {
        foreach ($components as $component) {
            $this->components[$component->getName()] = $component;
        }
    }

    public function getDefinition(string $componentName): string
    {
        $path = $this->projectDir.sprintf(self::PATH_TEMPLATE, $componentName);

        if (!file_exists($path)) {
            throw new \Exception('Component not found: Definition file '.$path.' does not exist.');
        }

        if (($content = file_get_contents($path)) === false) {
            throw new \Exception('Unable to read file');
        }

        return $content;
    }

    /**
     * @return array<string, array{name: string, description: string}>
     */
    public function getComponents(): array
    {
        $result = [];

        foreach ($this->components as $id => $component) {
            $result[$id] = [
                'name' => $component->getDisplayName(),
                'description' => $component->getDescription(),
            ];
        }

        return $result;
    }

    /**
     * Get a specific component by name.
     */
    public function getComponent(string $name): ?ComponentInterface
    {
        return $this->components[$name] ?? null;
    }

    /**
     * Render a component with the given parameters.
     */
    public function renderComponent(string $name, array $parameters = []): string
    {
        $component = $this->getComponent($name);

        if (null === $component) {
            throw new \Exception("Component not found: $name");
        }

        return $component->render($parameters);
    }
}
