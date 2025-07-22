<?php

namespace App\Service\Agent;

use Symfony\Component\HttpFoundation\RequestStack;

readonly class RequestSessionProvider implements SessionProvider
{
    private const string DEBUG_ENABLED_KEY = 'agent_debug_enabled';

    public function __construct(
        private RequestStack $requestStack,
    ) {
    }

    public function getSessionId(): string
    {
        return $this->requestStack->getSession()->getId();
    }

    public function setDebugEnabled(bool $enabled): void
    {
        $this->requestStack->getSession()->set(self::DEBUG_ENABLED_KEY, $enabled);
    }

    public function isDebugEnabled(): bool
    {
        return $this->requestStack->getSession()->get(self::DEBUG_ENABLED_KEY, false);
    }
}
