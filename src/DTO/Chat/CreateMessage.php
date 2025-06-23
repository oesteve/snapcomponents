<?php

namespace App\DTO\Chat;

use Symfony\Component\Validator\Constraints as Assert;

class CreateMessage
{
    #[Assert\NotBlank(allowNull: false)]
    public string $content;

    public ?int $chatId;
}
