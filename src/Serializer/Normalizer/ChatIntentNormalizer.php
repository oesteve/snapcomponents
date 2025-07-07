<?php

namespace App\Serializer\Normalizer;

use App\Entity\ChatIntent;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ChatIntentNormalizer implements NormalizerInterface
{
    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private NormalizerInterface $normalizer,
    ) {
    }

    /**
     * @param ChatIntent $object
     *
     * @return array<string, mixed>
     */
    public function normalize($object, ?string $format = null, array $context = []): array
    {
        $context[AbstractNormalizer::IGNORED_ATTRIBUTES] ??= [
            'configuration',
        ];

        $data = $this->normalizer->normalize($object, $format, $context);

        // TODO: add, edit, or delete some data

        return $data;
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof ChatIntent;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [ChatIntent::class => true];
    }
}
