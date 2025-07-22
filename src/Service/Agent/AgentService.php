<?php

namespace App\Service\Agent;

use App\Entity\Agent;
use App\Repository\AgentRepository;
use App\Service\Authentication\AuthenticationTokenService;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\RouterInterface;

readonly class AgentService
{
    public function __construct(
        private AgentRepository $agentRepository,
        private RouterInterface $router,
        private TokenProvider $agentIdentifierProvider,
        private AuthenticationTokenService $authenticationTokenService,
        private SessionProvider $sessionProvider,
        #[Autowire(param: '%kernel.debug%')]
        private bool $kernelDebugEnabled,
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
        /* @phpstan-ignore-next-line */
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

    public function getSessionId(): string
    {
        return $this->sessionProvider->getSessionId();
    }

    public function isDebugEnabled(): bool
    {
        return $this->kernelDebugEnabled || $this->sessionProvider->isDebugEnabled();
    }

    public function setDebugEnabled(bool $enabled = true): void
    {
        $this->sessionProvider->setDebugEnabled($enabled);
    }
}
