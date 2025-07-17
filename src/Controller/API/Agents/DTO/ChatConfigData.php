<?php

namespace App\Controller\API\Agents\DTO;

use phpDocumentor\Reflection\DocBlock\Description;
use Symfony\Component\Validator\Constraints as Assert;

class ChatConfigData
{
    #[Assert\NotBlank(allowNull: false)]
    public string $instructions;

    /**
     * @var array<int, array{id:int|null, name:string, description: string, instructions:string, tools:array<string>|null, widgets:array<string>|null  }>
     */
    #[Assert\All([
        new Assert\Collection([
            'id' => [new Assert\Optional([new Assert\Positive()])],
            'name' => [new Assert\NotBlank()],
            'description' => [new Assert\NotBlank()],
            'instructions' => [new Assert\NotBlank()],
            'tools' => [new Assert\Optional([new Assert\Type('array'), new Assert\All([new Assert\NotBlank()])])],
            'widgets' => [new Assert\Optional([new Assert\Type('array'), new Assert\All([new Assert\NotBlank()])])],
        ]),
    ])]
    public array $intents = [];
}
