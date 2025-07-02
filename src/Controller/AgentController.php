<?php

namespace App\Controller;

use App\Entity\Agent;
use App\Repository\AgentRepository;

use App\Service\Agent\AgentIdentifierProvider;
use App\Service\Agent\AgentService;
use Pentatrion\ViteBundle\Service\EntrypointRenderer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AgentController extends AbstractController
{
    #[Route('/agent-{code:agent}.js', name: 'app_agent')]
    public function index(
        Agent              $agent,
        EntrypointRenderer $entrypointRenderer,
        AgentService $agentService,
        Request            $request,
    ): Response
    {


        $scripts = $entrypointRenderer->renderScripts('widgets', ['dependency' => "react"]);
        $schemeAndHttpHost = $request->getSchemeAndHttpHost();
        $content = <<<JS
(() => {

    function setUpEnvironment() {
        window.__snapComponents = {
            baseUrl: '{$schemeAndHttpHost}',
            token: '{$agentService->generateAgentToken($agent)}',
        }
    }

    function injectScripts(scriptsHtml) {
        const template = document.createElement('template');
        template.innerHTML = scriptsHtml;
        const scripts = template.content.querySelectorAll('script');

        scripts.forEach((script) => {
            const newScript = document.createElement('script');

            for (const attr of script.attributes) {

                if (attr.name === 'src' && !attr.value.startsWith('http')) {
                    newScript.src = '{$schemeAndHttpHost}'+attr.value;
                    continue;
                }

                newScript.setAttribute(attr.name, attr.value);
            }

            if (script.innerHTML.trim()) {
                newScript.innerHTML = script.innerHTML;
            }

            document.head.appendChild(newScript);
        });
    }

    setUpEnvironment();
    injectScripts(`{$scripts}`);
})();
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

    #[Route('/agents', name: 'app_agents_list')]
    public function list(
        AgentRepository $agentRepository,
    ): Response
    {

        return $this->render('admin/list.html.twig', [
            'agents' => $agentRepository->findAll(),
        ]);
    }
}
