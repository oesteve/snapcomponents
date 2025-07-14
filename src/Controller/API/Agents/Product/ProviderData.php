<?php

namespace App\Controller\API\Agents\Product;

use Symfony\Component\Validator\Constraints as Assert;

class ProviderData
{
    #[Assert\NotBlank]
    public string $name;

    /**
     * @var array<string, mixed>
     */
    #[Assert\NotBlank]
    #[Assert\Type('array')]
    #[Assert\All(
        constraints: [
            new Assert\NotBlank(),
        ]
    )]
    public array $settings;
}
