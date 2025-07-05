<?php

namespace App\Serializer\Normalizer;

use App\Entity\ChatConfiguration;
use App\Entity\ChatIntent;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ChatConfigurationNormalizer implements NormalizerInterface
{
    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private NormalizerInterface $normalizer
    )
    {
    }

    /**
     * @param ChatConfiguration $object
     * @param string|null $format
     * @param array $context
     * @return array
     * @throws ExceptionInterface
     */
    public function normalize($object, ?string $format = null, array $context = []): array
    {

        $context[AbstractNormalizer::IGNORED_ATTRIBUTES] ??= [
            'user',
            'agent',
            'intents'
        ];

        $normalizer = $this->normalizer;

        $data = $normalizer->normalize(
            $object,
            $format,
            $context
        );


        $data['intents'] = $object->getIntents()->map(
            fn(ChatIntent $intent) => $normalizer->normalize($intent, $format, [
                AbstractNormalizer::IGNORED_ATTRIBUTES => [
                    'configuration'
                ]
            ]))->toArray();

        return $data;
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof ChatConfiguration;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [ChatConfiguration::class => true];
    }
}
