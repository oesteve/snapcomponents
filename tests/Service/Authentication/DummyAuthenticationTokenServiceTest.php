<?php

namespace App\Tests\Service\Authentication;

use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class DummyAuthenticationTokenServiceTest extends TestCase
{
    private DummyAuthenticationTokenService $service;

    protected function setUp(): void
    {
        $this->service = new DummyAuthenticationTokenService();
    }

    public function testGenerateAndValidateToken(): void
    {
        $claims = ['userId' => '123', 'role' => 'admin'];

        // Generate a token
        $token = $this->service->generateToken($claims);

        // Token should be a non-empty string
        /* @phpstan-ignore-next-line */
        $this->assertIsString($token);
        $this->assertNotEmpty($token);

        // Validate the token and get claims
        $retrievedClaims = $this->service->validateToken($token);

        // Claims should match the original claims
        $this->assertEquals($claims, $retrievedClaims);
    }

    public function testTokenExpiration(): void
    {
        // Create a token that expires immediately
        $claims = ['userId' => '123'];
        $expiresAt = new \DateTimeImmutable('-1 second');

        $token = $this->service->generateToken($claims, $expiresAt);

        // Validating an expired token should throw an exception
        $this->expectException(AccessDeniedHttpException::class);
        $this->expectExceptionMessage('Token has expired');

        $this->service->validateToken($token);
    }

    public function testInvalidToken(): void
    {
        // Validating a non-existent token should throw an exception
        $this->expectException(AccessDeniedHttpException::class);
        $this->expectExceptionMessage('Invalid token');

        $this->service->validateToken('non-existent-token');
    }

    public function testEmptyToken(): void
    {
        // Validating an empty token should throw an exception
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Token is empty');

        $this->service->validateToken('');
    }
}
