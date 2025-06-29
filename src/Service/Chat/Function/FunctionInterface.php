<?php

namespace App\Service\Chat\Function;

use App\Entity\ChatMessage;

interface FunctionInterface
{
    public function getName(): string;

    public function getParameters(
        ChatMessage $message,
    ): array;

    public function getDescription(
        ChatMessage $message,
    ): string;

    public function execute(
        ChatMessage $message,
        array $parameters
    ): string;
}
