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

    public function getToken(): ?string
    {
        $headerValue = $this->requestStack
            ->getCurrentRequest()
            ->headers->get('Authorization');


        if (empty($headerValue)) {
            return null;
        }

        if (!str_contains($headerValue, 'Bearer')) {
            return null;
        }

        return explode(' ', $headerValue)[1];
    }

}
