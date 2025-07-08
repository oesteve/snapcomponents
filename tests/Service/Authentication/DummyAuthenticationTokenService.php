<?php

namespace App\Tests\Service\Authentication;

use App\Service\Authentication\AuthenticationTokenService;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class DummyAuthenticationTokenService implements AuthenticationTokenService
{
    /**
     * @var array<string, array{claims: array<string, mixed>, expiresAt: \DateTimeImmutable|null}>
     */
    private array $tokens = [];

    public function generateToken(array $claims, ?\DateTimeImmutable $expiresAt = null): string
    {
        // Generate a random token
        $token = bin2hex(random_bytes(16));

        // If no expiration time is provided, set it to 10 minutes from now
        if (null === $expiresAt) {
            $expiresAt = new \DateTimeImmutable('+10 minutes');
        }

        // Store the claims and expiration time
        $this->tokens[$token] = [
            'claims' => $claims,
            'expiresAt' => $expiresAt,
        ];

        return $token;
    }

    public function validateToken(string $token): array
    {
        if (empty($token)) {
            throw new \InvalidArgumentException('Token is empty');
        }

        if (!isset($this->tokens[$token])) {
            throw new AccessDeniedHttpException('Invalid token');
        }

        $tokenData = $this->tokens[$token];

        // Check if token has expired
        if (null !== $tokenData['expiresAt'] && $tokenData['expiresAt'] < new \DateTimeImmutable()) {
            throw new AccessDeniedHttpException('Token has expired');
        }

        return $tokenData['claims'];
    }
}
