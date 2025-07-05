<?php

namespace App\Service\Chat\Widget;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

class ComponentsManager
{

    const string PATH_TEMPLATE = '/assets/widgets/%s/usage.md';

    public function __construct(
        #[Autowire('%kernel.project_dir%')]
        private readonly string $projectDir,
    )
    {
    }

    public function getDefinition(string $componentName): string
    {
        $path = $this->projectDir . sprintf(self::PATH_TEMPLATE, $componentName);

        if (!file_exists($path)) {
            throw new \Exception('Component not found: Definition file ' . $path . ' does not exist.');
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
        $componentsPath = $this->projectDir . '/assets/widgets';
        $components = [];

        if (!is_dir($componentsPath)) {
            return $components;
        }

        $files = scandir($componentsPath);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            if (is_dir($componentsPath . '/' . $file) && file_exists($componentsPath . '/' . $file . '/usage.md')) {
                $content = file_get_contents($componentsPath . '/' . $file . '/usage.md');
                preg_match('/##\s+([^\n]+)/', $content, $matches);
                $name = $matches[1] ?? $file;
                preg_match('/###\s*Description\s*\n+(.+?)(?=\n###|\z)/s', $content, $matches);
                $description = trim($matches[1] ?? '');

                $components[$file] = [
                    'name' => $name,
                    'description' => $description
                ];
            }
        }

        return $components;
    }
}
