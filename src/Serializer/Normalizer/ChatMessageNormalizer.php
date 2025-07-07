<?php

namespace App\Serializer\Normalizer;

use App\Entity\ChatMessage;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ChatMessageNormalizer implements NormalizerInterface
{
    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private NormalizerInterface $normalizer,
    ) {
    }

    /**
     * @param ChatMessage $object
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
                AbstractNormalizer::IGNORED_ATTRIBUTES => ['chat'],
            ]
        );

        return $data;
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof ChatMessage;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [ChatMessage::class => true];
    }
}
