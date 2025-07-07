<?php

namespace App\Service\Chat\Component;

class Counter implements ComponentInterface
{
    public const string NAME = 'counter';

    public function getName(): string
    {
        return self::NAME;
    }

    public function getDisplayName(): string
    {
        return 'SimpleCounter Widget';
    }

    public function getDescription(): string
    {
        return 'A simple counter widget that allows users to increment and decrement a numeric value. It displays the current count in a card with plus and minus buttons to adjust the value.';
    }

    public function getParameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'initial-value' => [
                    'type' => 'number',
                    'description' => 'The starting value for the counter',
                    'default' => 0,
                ],
            ],
            'required' => [],
            'additionalProperties' => false,
        ];
    }

    public function render(array $parameters): string
    {
        $initialValue = $parameters['initial-value'] ?? 0;

        return "<wg-counter initial-value=\"{$initialValue}\"></wg-counter>";
    }
}
