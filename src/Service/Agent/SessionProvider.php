<?php

namespace App\Service\Agent;

interface SessionProvider
{
    public function getSessionId(): string;
}
