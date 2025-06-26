<?php

namespace App\Service\Agent;

use App\Entity\Agent;
use App\Repository\AgentRepository;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\RouterInterface;

readonly class AgentService
{
    public function __construct(
        private RequestStack $requestStack,
        private AgentRepository $agentRepository,
        private RouterInterface $router,
    )
    {
    }

    public function getAgentOrFail(): Agent
    {
        $agentCode = $this->requestStack->getCurrentRequest()->cookies->get('agent');

        if (!$agentCode){
            throw new AccessDeniedHttpException('Agent not found');
        }

        return $this->agentRepository->findOneBy([
            'code' => $agentCode,
        ]);
    }

    public function getAgentUrl(Agent $agent): string
    {
        return $this->router->generate('app_agent', [
            'code' => $agent->getCode(),
        ], RouterInterface::ABSOLUTE_URL);
    }
}
