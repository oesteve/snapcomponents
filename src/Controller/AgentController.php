<?php

namespace App\Controller;

use App\Entity\Agent;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AgentController extends AbstractController
{
    #[Route('/agent-{code:agent}.js', name: 'app_agent')]
    public function index(
        Agent $agent
    ): Response
    {
        $content = <<<JS
console.log('Agent {$agent->getId()} loaded');
JS;
        $response = new Response($content, 200, ['Content-Type' => 'application/javascript']);

        $response->headers->setCookie(
            new Cookie(
                'agent',
                $agent->getCode(),
                time() + 3600,
            )
        );

        return $response;
    }
}
