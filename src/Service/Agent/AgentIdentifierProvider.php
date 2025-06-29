<?php

namespace App\Service\Agent;

use Symfony\Component\HttpFoundation\RequestStack;

readonly class AgentIdentifierProvider
{

    public function __construct(
        private RequestStack $requestStack,
    )
    {
    }

    public function getCode(): ?string
    {
        return $this->requestStack
            ->getCurrentRequest()
            ->cookies->get('agent');
    }

}
