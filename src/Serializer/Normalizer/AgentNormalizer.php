<?php

namespace App\Serializer\Normalizer;

use App\Entity\Agent;
use App\Service\Agent\AgentService;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class AgentNormalizer implements NormalizerInterface
{
    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private NormalizerInterface $normalizer,
        private AgentService $agentService,
    ) {
    }

    /**
     * @param Agent $object
     */
    public function normalize($object, ?string $format = null, array $context = []): array
    {
        $data = $this->normalizer->normalize(
            $object,
            $format,
            [
                ...$context,
                AbstractNormalizer::IGNORED_ATTRIBUTES => [
                    'user',
                    'chatConfiguration',
                    'articles',
                    'chats',
                ],
            ]
        );

        $data['url'] = $this->agentService->getAgentUrl($object);

        return $data;
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Agent;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [Agent::class => true];
    }
}
