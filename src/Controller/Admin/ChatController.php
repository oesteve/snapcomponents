<?php

namespace App\Controller\Admin;

use App\Entity\Agent;
use App\Repository\AgentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/agents')]
final class ChatController extends AbstractController
{
    #[Route('', name: 'app_admin_chat_list')]
    public function list(
        AgentRepository $agentRepository,
    ): Response
    {

        return $this->render('admin/list.html.twig', [
            'agents' => $agentRepository->findAll(),
        ]);
    }
}
