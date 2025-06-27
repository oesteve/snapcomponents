<?php

namespace App\Service\Chat\Function;

interface FunctionInterface
{
    public function getName(): string;

    public function getParameters(): array;

    public function getDescription(): string;

    public function execute(array $parameters): string;
}
