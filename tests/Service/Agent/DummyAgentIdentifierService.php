<?php

namespace App\Tests\Service\Agent;

use App\Service\Agent\AgentIdentifierService;

class DummyAgentIdentifierService implements AgentIdentifierService
{
    private ?string $token = null;

    /**
     * Set the token to be returned by getToken().
     */
    public function setToken(?string $token): void
    {
        $this->token = $token;
    }

    /**
     * Get the agent token.
     *
     * @return string|null The token or null if not set
     */
    public function getToken(): ?string
    {
        return $this->token;
    }
}
