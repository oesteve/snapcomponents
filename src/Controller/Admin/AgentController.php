<?php

namespace App\Controller\Admin;

use App\Controller\AbstractController;
use App\Repository\AgentRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/agents')]
final class AgentController extends AbstractController
{
    #[Route('{path}', name: 'app_admin_agent_list', requirements: ['path' => '.+'], defaults: ['path' => ''])]
    public function list(
        AgentRepository $agentRepository,
    ): Response
    {

        return $this->render('admin/list.html.twig', [
            'agents' => $agentRepository->findBy([
                'user' => $this->getLoggedUserOrFail()
            ]),
        ]);
    }
}
