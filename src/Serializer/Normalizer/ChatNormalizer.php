<?php

namespace App\Serializer\Normalizer;

use App\Entity\Chat;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ChatNormalizer implements NormalizerInterface
{
    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private NormalizerInterface $normalizer,
    ) {
    }

    /**
     * @param Chat $object
     *
     * @return array<string, mixed>
     */
    public function normalize($object, ?string $format = null, array $context = []): array
    {
        $data = $this->normalizer->normalize(
            $object,
            $format,
            [
                ...$context,
                AbstractNormalizer::IGNORED_ATTRIBUTES => [
                    'agent',
                    'configuration',
                ],
            ]
        );

        return $data;
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof Chat;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [Chat::class => true];
    }
}
