<?php

namespace App\Serializer\Normalizer;

use App\Entity\ArticleCategory;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class ArticleCategoryNormalizer implements NormalizerInterface
{
    public function __construct(
        #[Autowire(service: 'serializer.normalizer.object')]
        private NormalizerInterface $normalizer,
    ) {
    }

    /**
     * @param ArticleCategory $object
     *
     * @return array<string,mixed>
     *
     * @throws ExceptionInterface
     */
    public function normalize($object, ?string $format = null, array $context = []): array
    {
        $context[AbstractNormalizer::IGNORED_ATTRIBUTES][] = 'articles';

        $data = $this->normalizer->normalize(
            $object,
            $format,
            $context
        );

        return $data;
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        return $data instanceof ArticleCategory;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [ArticleCategory::class => true];
    }
}
