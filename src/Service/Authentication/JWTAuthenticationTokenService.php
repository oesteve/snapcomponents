<?php

namespace App\Service\Authentication;

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\JwtFacade;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Token\Plain;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\StrictValidAt;
use Lcobucci\JWT\Validation\Validator;
use Psr\Clock\ClockInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Routing\RouterInterface;

readonly class JWTAuthenticationTokenService implements AuthenticationTokenService
{
    public function __construct(
        private RouterInterface $router,
        #[Autowire('%env(APP_SECRET)%')]
        private string $secret,
        private ClockInterface $clock,
    ) {
    }

    /**
     * @param array<non-empty-string, non-empty-string> $claims
     *
     * @throws \DateMalformedStringException
     */
    public function generateToken(array $claims, ?\DateTimeImmutable $expiresAt = null): string
    {
        $key = $this->getKey();
        $schemeAndHost = $this->getSchemeAndHost();

        return (new JwtFacade())->issue(
            new Sha256(),
            $key,
            static function (
                Builder $builder,
                \DateTimeImmutable $issuedAt,
            ) use ($claims, $schemeAndHost, $expiresAt): Builder {
                $builder = $builder
                    ->issuedBy($schemeAndHost)
                    ->permittedFor($schemeAndHost);

                foreach ($claims as $name => $value) {
                    $builder = $builder->withClaim($name, $value);
                }

                if (isset($claims['id'])) {
                    $builder = $builder->identifiedBy($claims['id']);
                }

                if ($expiresAt) {
                    $builder = $builder->expiresAt($expiresAt);
                } else {
                    $builder = $builder->expiresAt($issuedAt->modify('+10 minutes'));
                }

                return $builder;
            }
        )->toString();
    }

    public function validateToken(string $token): array
    {
        $parser = new Parser(new JoseEncoder());
        if (empty($token)) {
            throw new \InvalidArgumentException('Token is empty');
        }

        /** @var Plain $parsedToken */
        $parsedToken = $parser->parse($token);

        $validator = new Validator();

        $validator->assert($parsedToken, new SignedWith(new Sha256(), $this->getKey()));
        $validator->assert($parsedToken, new IssuedBy($this->getSchemeAndHost()));
        $validator->assert($parsedToken, new StrictValidAt($this->clock));

        // Convert claims to array
        $claims = [];
        foreach ($parsedToken->claims()->all() as $name => $value) {
            $claims[$name] = $value;
        }

        return $claims;
    }

    /**
     * @throws \Exception
     */
    private function getKey(): InMemory
    {
        if (!$this->secret) {
            throw new \Exception('Secret not found');
        }

        return InMemory::base64Encoded($this->secret);
    }

    /**
     * @return non-empty-string
     */
    private function getSchemeAndHost(): string
    {
        return $this->router->getContext()->getScheme().'://'.$this->router->getContext()->getHost();
    }
}
