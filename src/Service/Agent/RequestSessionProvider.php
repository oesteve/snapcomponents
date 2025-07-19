<?php

namespace App\Service\Agent;

use Symfony\Component\HttpFoundation\RequestStack;

readonly class RequestSessionProvider implements SessionProvider
{
    public function __construct(
        private RequestStack $requestStack,
    ) {
    }

    public function getSessionId(): string
    {
        return $this->requestStack->getSession()->getId();
    }
}
