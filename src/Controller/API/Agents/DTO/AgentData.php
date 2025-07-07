<?php

namespace App\Controller\API\Agents\DTO;

use Symfony\Component\Validator\Constraints\NotBlank;

class AgentData
{
    #[NotBlank(allowNull: false)]
    public string $name;
}
