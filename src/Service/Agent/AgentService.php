<?php

namespace App\Service\Agent;

use App\Entity\Agent;
use App\Repository\AgentRepository;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

readonly class AgentService
{
    public function __construct(
        private RequestStack $requestStack,
        private AgentRepository $agentRepository,
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
}
