<?php

namespace App\Serializer\Normalizer;

use App\Entity\Agent;
use App\Service\Agent\AgentService;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

readonly class AgentNormalizer implements NormalizerInterface
{
    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private NormalizerInterface $normalizer,
        private AgentService $agentService,
    ) {
    }

    /**
     * @param Agent               $data
     * @param array<string,mixed> $context
     *
     * @return array<string,mixed>
     */
    public function normalize($data, ?string $format = null, array $context = []): array
    {
        /** @var array<string, mixed> $normalizedData */
        $normalizedData = $this->normalizer->normalize($data, $format, $context);

        $normalizedData['url'] = $this->agentService->getAgentUrl($data);

        return $normalizedData;
    }

    /**
     * @param array<string,mixed> $context
     */
    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Agent;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [Agent::class => true];
    }
}
