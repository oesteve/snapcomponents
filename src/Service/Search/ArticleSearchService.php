<?php

namespace App\Service\Search;

use App\Entity\Article;
use Elastica\Document;
use FOS\ElasticaBundle\Event\PostTransformEvent;
use FOS\ElasticaBundle\Finder\PaginatedFinderInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

readonly class ArticleSearchService
{
    public function __construct(
        #[Autowire(service: 'fos_elastica.finder.articles')]
        private PaginatedFinderInterface $finder,
        private EmbeddingsService        $searchService,
    )
    {
    }

    /**
     * Search for articles using Elasticsearch
     *
     * @param string|null $query The search query
     * @return Article[] The search results
     */
    public function search(
        ?string $query
    ): array
    {
        $query = $this->searchService->createEmbeddings(
            $query,
        );

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
        if ($event->getObject() instanceof Article === false) {
            return;
        }

        $this->setEmbeddings($event->getDocument());
    }

    private function setEmbeddings(Document $document): void
    {
        $title = $this->searchService->createEmbeddings($document->get('title'));
        $content = $this->searchService->createEmbeddings($document->get('content'));

        $document->set('title_vector', $title);
        $document->set('content_vector', $content);
    }
}
