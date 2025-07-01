<?php

namespace App\Service\Product;

use App\Entity\Article;
use App\Entity\Product;
use App\Service\Search\EmbeddingsService;
use Elastica\Document;
use FOS\ElasticaBundle\Event\PostTransformEvent;
use FOS\ElasticaBundle\Finder\PaginatedFinderInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

readonly class ProductSearchService
{
    public function __construct(
        #[Autowire(service: 'fos_elastica.finder.products')]
        private PaginatedFinderInterface $finder,
        private EmbeddingsService        $searchService,
    ) {
    }

    /**
     * Search for articles using Elasticsearch
     *
     * @param string|null $query The search query
     * @return Product[] The search results
     */
    public function search(?string $query): array
    {

        $query = $this->searchService->createEmbeddings($query);

        return $this->finder->find([
            'knn' => [
                'field' => 'title_vector',
                'query_vector' => $query,
                'k' => 10,
                "num_candidates" => 100,
            ]
        ]);
    }

    #[AsEventListener(event: PostTransformEvent::class)]
    public function onPostTransform(PostTransformEvent $event)
    {
        if ($event->getObject() instanceof Product === false) {
            return;
        }

        $this->setEmbeddings($event->getDocument());
    }

    private function setEmbeddings(Document $document): void
    {
        $title = $this->searchService->createEmbeddings($document->get('title'));
        $content = $this->searchService->createEmbeddings($document->get('description'));

        $document->set('title_vector', $title);
        $document->set('description_vector', $content);
    }
}
