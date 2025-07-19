<?php

namespace App\Tests\Service\Agent;

use App\Service\Agent\SessionProvider;

class DummySessionProvider implements SessionProvider
{
    private string $sessionId = 'default';

    /**
     * Set the session ID to be returned by getSessionId().
     */
    public function setSessionId(string $sessionId): void
    {
        $this->sessionId = $sessionId;
    }

    /**
     * Get the session ID.
     *
     * @return string The session ID
     */
    public function getSessionId(): string
    {
        return $this->sessionId;
    }
}
