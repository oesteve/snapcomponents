<?php

namespace App\Service\Authentication;

interface AuthenticationTokenService
{
    /**
     * Generate a token with the given claims.
     *
     * @param array<non-empty-string, non-empty-string> $claims
     */
    public function generateToken(array $claims, ?\DateTimeImmutable $expiresAt = null): string;

    /**
     * Validate a token.
     *
     * @return array<string, mixed> The token claims
     */
    public function validateToken(string $token): array;
}
