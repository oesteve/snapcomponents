<?php

namespace App\Controller\API\Agents\Articles;

use Symfony\Component\Validator\Constraints as Assert;

class Search
{
    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[Assert\Length(min: 1, max: 255)]
    public ?string $query;
}
