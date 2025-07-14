<?php

namespace App\Controller\API\Agents\Product;

use Symfony\Component\Validator\Constraints as Assert;

class Search
{
    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[Assert\Length(min: 1, max: 255)]
    public ?string $query;

    /**
     * @var array<string,array{
     *      field: string,
     *      operator: string,
     *      value: mixed
     *  }>|null $filters
     */
    #[Assert\Type('array')]
    #[Assert\All(
        constraints: [
            new Assert\Type('array'),
            new Assert\Collection(
                fields: [
                    'field' => [
                        new Assert\NotBlank(),
                    ],
                    'operator' => [
                        new Assert\NotBlank(),
                    ],
                    'value' => [
                        new Assert\NotBlank(),
                    ],
                ]
            ),
        ]
    )]
    public ?array $filters;

    #[Assert\Type('int')]
    #[Assert\GreaterThanOrEqual(1)]
    #[Assert\LessThanOrEqual(100)]
    public ?int $size;
}
