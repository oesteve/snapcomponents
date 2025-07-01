<?php

namespace App\Service\Chat\Widget;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

class WidgetProvider
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
}
