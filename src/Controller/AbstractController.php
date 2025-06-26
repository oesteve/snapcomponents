<?php

namespace App\Controller;

use App\Entity\User;

abstract class AbstractController extends \Symfony\Bundle\FrameworkBundle\Controller\AbstractController
{

    protected function getLoggedUserOrFail(): User
    {
        $user = $this->getUser();

        if ($user instanceof User) {
            return $user;
        }

        throw $this->createAccessDeniedException();
    }
}
