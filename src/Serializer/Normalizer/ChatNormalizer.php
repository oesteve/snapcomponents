<?php

namespace App\Serializer\Normalizer;

use App\Entity\Chat;
use App\Service\Agent\AgentService;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

readonly class ChatNormalizer implements NormalizerInterface
{
    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private NormalizerInterface $normalizer,
        private AgentService $agentService,
    ) {
    }

    /**
     * @param Chat                 $data
     * @param array<string, mixed> $context
     *
     * @return array<string, mixed>
     */
    public function normalize($data, ?string $format = null, array $context = []): array
    {
        $normalizer = $this->normalizer;

        /** @var array<string, mixed> $normalizedData */
        $normalizedData = $normalizer->normalize($data, $format,
            [
                ...$context,
                AbstractNormalizer::IGNORED_ATTRIBUTES => [
                    'messages',
                ],
            ]
        );

        // Filter tools values
        $normalizedData['messages'] = $data->getMessages($this->agentService->isDebugEnabled())->map(function ($message) use ($normalizer, $format, $context) {
            return $normalizer->normalize($message, $format, $context);
        })->toArray();

        return $normalizedData;
    }

    /**
     * @param object              $data
     * @param array<string,mixed> $context
     */
    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Chat;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [Chat::class => true];
    }
}
