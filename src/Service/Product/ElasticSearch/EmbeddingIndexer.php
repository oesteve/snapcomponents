<?php

namespace App\Service\Product\ElasticSearch;

use App\Entity\Product;
use App\Service\Product\ProductEmbedder;
use Elastica\Document;
use FOS\ElasticaBundle\Event\PostTransformEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

readonly class EmbeddingIndexer
{
    public function __construct(
        private ProductEmbedder $embeddingsService,
    ) {
    }

    #[AsEventListener(event: PostTransformEvent::class)]
    public function onPostTransform(PostTransformEvent $event): void
    {
        $object = $event->getObject();

        if (!($object instanceof Product)) {
            return;
        }

        $this->setEmbeddings($object, $event->getDocument());
    }

    private function setEmbeddings(Product $product, Document $document): void
    {
        $vectors = $this->embeddingsService->createEmbeddings($product);
        $document->set('vector', $vectors);
    }
}
