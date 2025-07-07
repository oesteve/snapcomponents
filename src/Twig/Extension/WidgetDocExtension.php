<?php

namespace App\Twig\Extension;

use App\Service\Chat\Component\ComponentManager;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class WidgetDocExtension extends AbstractExtension
{
    public function __construct(
        private ComponentManager $widgetProvider,
    ) {
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('widget_doc', [$this, 'getWidgetDoc'], [
                'is_safe' => ['html'],
            ]),
        ];
    }

    public function getWidgetDoc(string $widgetName): string
    {
        return $this->widgetProvider->getDefinition($widgetName);
    }
}
