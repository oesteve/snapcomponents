<?php

namespace App\Service\Agent;

interface SessionProvider
{
    public function getSessionId(): string;

    public function setDebugEnabled(bool $enabled): void;

    public function isDebugEnabled(): bool;
}
