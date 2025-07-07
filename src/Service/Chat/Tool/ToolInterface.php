<?php

namespace App\Service\Chat\Tool;

use App\Entity\ChatMessage;

interface ToolInterface
{
    public function getName(): string;

    public function getDisplayName(): string;

    /**
     * @return array<string, mixed>
     */
    public function getParameters(
        ChatMessage $message,
    ): array;

    public function getDescription(
        ChatMessage $message,
    ): string;

    public function execute(
        ChatMessage $message,
        array $parameters,
    ): string;

    public function support(string $scope): bool;
}
