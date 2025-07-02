<?php

namespace App\Service\Agent;

use App\Entity\Agent;
use App\Repository\AgentRepository;

use DateTimeImmutable;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\JwtFacade;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Encoding\JoseEncoder;
use Lcobucci\JWT\Token\Parser;
use Lcobucci\JWT\Token\Plain;
use Lcobucci\JWT\Validation\Constraint\IssuedBy;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\StrictValidAt;
use Lcobucci\JWT\Validation\Validator;
use Psr\Clock\ClockInterface;
use Symfony\Component\Clock\Clock;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Routing\RouterInterface;

readonly class AgentService
{
    public function __construct(
        private AgentRepository         $agentRepository,
        private RouterInterface         $router,
        private AgentIdentifierProvider $agentIdentifierProvider,
        #[Autowire('%env(APP_SECRET)%')]
        private string                  $secret,
        private ClockInterface          $clock
    )
    {
    }

    public function getAgentOrFail(): Agent
    {
        $agentToken = $this->agentIdentifierProvider->getToken();

        if (!$agentToken) {
            throw new AccessDeniedHttpException('Agent not found');
        }

        $parser = new Parser(new JoseEncoder());

        /** @var Plain $token */
        $token = $parser->parse($agentToken);

        $validator = new Validator();

        $validator->assert($token, new SignedWith(new Sha256(), $this->getKey())); // doesn't throw an exception
        $validator->assert($token, new IssuedBy($this->router->getContext()->getScheme() . '://' . $this->router->getContext()->getHost()));
        $validator->assert($token, new StrictValidAt($this->clock));

        $agent = $this->agentRepository->findOneBy([
            'code' => $token->claims()->get('code'),
        ]);

        if (!$agent) {
            throw new AccessDeniedHttpException('Agent not found');
        }

        return $agent;
    }

    public function generateAgentToken(Agent $agent): string
    {
        $key = $this->getKey();
        $schemeAndHost = $this->router->getContext()->getScheme() . '://' . $this->router->getContext()->getHost();

        if (!$schemeAndHost) {
            throw new \Exception('Scheme and host not found');
        }

        return (new JwtFacade())->issue(
            new Sha256(),
            $key,
            static fn(
                Builder           $builder,
                DateTimeImmutable $issuedAt
            ): Builder => $builder
                ->issuedBy($schemeAndHost)
                ->identifiedBy($agent->getId())
                ->withClaim('code', $agent->getCode())
                ->permittedFor($schemeAndHost)
                ->expiresAt($issuedAt->modify('+10 minutes'))
        )->toString();
    }

    public function getAgentUrl(Agent $agent): string
    {
        return $this->router->generate('app_agent', [
            'code' => $agent->getCode(),
        ], RouterInterface::ABSOLUTE_URL);
    }

    /**
     * @return InMemory
     * @throws \Exception
     */
    private function getKey(): InMemory
    {
        if (!$this->secret) {
            throw new \Exception('Secret not found');
        }

        $key = InMemory::base64Encoded($this->secret);
        return $key;
    }
}
