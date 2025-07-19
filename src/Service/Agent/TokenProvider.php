<?php

namespace App\Service\Agent;

interface TokenProvider
{
    /**
     * Get the agent token from the request.
     *
     * @return string|null The token or null if not found
     */
    public function getToken(): ?string;
}
