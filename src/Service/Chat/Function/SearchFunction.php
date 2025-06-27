<?php

namespace App\Service\Chat\Function;

use OpenAI\Responses\Chat\CreateResponseToolCallFunction;

class SearchFunction implements FunctionInterface
{
    public function getName(): string
    {
        return "get_weather";
    }

    public function getDescription(): string
    {
        return "Get current temperature for a given location.";
    }

    public function getParameters(): array
    {
        return [
            "type" => "object",
            "properties" => [
                "location" => [
                    "type" => "string",
                    "description" => "City and country e.g. Bogotá, Colombia"
                ]
            ],
            "required" => ["location"],
            "additionalProperties" => false
        ];
    }

    public function execute(array $parameters): string
    {
        return "25º raining";
    }

}
