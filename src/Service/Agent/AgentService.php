<?php

namespace App\Service\Agent;

use App\Entity\Agent;
use App\Repository\AgentRepository;
use App\Service\Authentication\AuthenticationTokenService;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\RouterInterface;

readonly class AgentService
{
    public function __construct(
        private AgentRepository $agentRepository,
        private RouterInterface $router,
        private AgentIdentifierService $agentIdentifierProvider,
        private AuthenticationTokenService $authenticationTokenService,
    ) {
    }

    public function getAgentOrFail(): Agent
    {
        $agentToken = $this->agentIdentifierProvider->getToken();

        if (!$agentToken) {
            throw new AccessDeniedHttpException('Agent not found');
        }

        $claims = $this->authenticationTokenService->validateToken($agentToken);

        $agent = $this->agentRepository->findOneBy([
            'code' => $claims['code'],
        ]);

        if (!$agent) {
            throw new AccessDeniedHttpException('Agent not found');
        }

        return $agent;
    }

    public function generateAgentToken(Agent $agent): string
    {
        return $this->authenticationTokenService->generateToken([
            'id' => $agent->getId(),
            'code' => $agent->getCode(),
        ]);
    }

    public function getAgentUrl(Agent $agent): string
    {
        return $this->router->generate('app_agent', [
            'code' => $agent->getCode(),
        ], RouterInterface::ABSOLUTE_URL);
    }
}
