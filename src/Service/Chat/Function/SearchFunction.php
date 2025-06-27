<?php

namespace App\Service\Chat\Function;

use OpenAI\Responses\Chat\CreateResponseToolCallFunction;

class SearchFunction
{

    public static function getConfiguration(): array
    {
        return [
            "name" => "get_weather",
            "description" => "Get current temperature for a given location.",
            "parameters" => [
                "type" => "object",
                "properties" => [
                    "location" => [
                        "type" => "string",
                        "description" => "City and country e.g. Bogotá, Colombia"
                    ]
                ],
                "required" => ["location"],
                "additionalProperties" => false
            ],
            "strict" => true
        ];
    }

    public function execute(array $data): string
    {
        return "25º raining";
    }

}
