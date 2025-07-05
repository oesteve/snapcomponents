<?php

namespace App\Controller\API\User;

use App\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/user', format: 'json')]
class UserController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function profile(): JsonResponse
    {
        $user = $this->getLoggedUserOrFail();

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'github' => $user->getGithub(),
            'picture' => $user->getPicture(),
            'roles' => $user->getRoles(),
        ]);
    }
}
