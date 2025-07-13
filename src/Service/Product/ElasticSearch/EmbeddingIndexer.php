<?php

namespace App\Service\Product\ElasticSearch;

use App\Entity\Product;
use App\Service\Search\EmbeddingsService;
use Elastica\Document;
use FOS\ElasticaBundle\Event\PostTransformEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

readonly class EmbeddingIndexer
{
    public function __construct(
        private EmbeddingsService $embeddingsService,
    ) {
    }

    #[AsEventListener(event: PostTransformEvent::class)]
    public function onPostTransform(PostTransformEvent $event): void
    {
        if (false === $event->getObject() instanceof Product) {
            return;
        }

        $this->setEmbeddings($event->getDocument());
    }

    private function setEmbeddings(Document $document): void
    {
        $title = $this->embeddingsService->createEmbeddings($document->get('title'));
        $content = $this->embeddingsService->createEmbeddings($document->get('description'));

        $document->set('title_vector', $title);
        $document->set('description_vector', $content);
    }
}
