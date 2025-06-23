<?php

namespace App\DTO\Chat;

use Symfony\Component\Validator\Constraints as Assert;

class AddMessage
{
    #[Assert\NotBlank(allowNull: false)]
    public string $content;
}
