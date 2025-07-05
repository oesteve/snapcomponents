<?php

namespace App\DTO\Chat;

use Symfony\Component\Validator\Constraints as Assert;

class UpdateIntent
{
    #[Assert\NotBlank(allowNull: false)]
    public string $name;

    #[Assert\NotBlank(allowNull: false)]
    public string $description;

    #[Assert\NotBlank(allowNull: false)]
    public string $instructions;

    /**
     * @var string[]
     */
    #[Assert\NotNull]
    public array $tools = [];

    /**
     * @var string[]
     */
    #[Assert\NotNull]
    public array $widgets = [];
}
