<?php

namespace App\Tests\Service\Authentication;

use App\Service\Authentication\AuthenticationTokenService;
use App\Tests\BaseTestCase;

class AuthenticationTokenServiceConfigurationTest extends BaseTestCase
{
    public function testAuthenticationTokenServiceIsDummyInTestEnvironment(): void
    {
        $service = $this->getService(AuthenticationTokenService::class);

        $this->assertInstanceOf(DummyAuthenticationTokenService::class, $service);
    }
}
