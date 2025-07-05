<?php

namespace App\Service\Chat\Component;

interface ComponentInterface
{
    public function getName(): string;

    public function getDisplayName(): string;

    /**
     * Returns the description of the component
     */
    public function getDescription(): string;

    /**
     * Returns the parameters that the component accepts
     *
     * @return array<string, mixed>
     */
    public function getParameters(): array;

    /**
     * Returns the HTML tag for the component with the given parameters
     *
     * @param array<string, mixed> $parameters
     * @return string
     */
    public function render(array $parameters): string;
}
