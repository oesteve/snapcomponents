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
    )
    {
    }

    /**
     * Search for articles using Elasticsearch
     *
     * @param string|null $query The search query
     * @param array<string,array{
     *     field: string,
     *     operator: string,
     *     value: string
     * }>|null $filters
     * @return Product[] The search results
     */
    public function search(
        ?string $query,
        ?array  $filters = null,
    ): array
    {
        $request = [];

        if ($query) {
            $queryVector = $this->searchService->createEmbeddings($query);
            $request = [
                'knn' => [
                    'field' => 'title_vector',
                    'query_vector' => $queryVector,
                    'k' => 10,
                    "num_candidates" => 100,
                ]
            ];
        }

        $must = [];
        foreach ($filters ?? [] as $filter) {
            $term = match ($filter['operator']) {
                'eq' => ['term' => [$filter['field'] => $filter['value']]],
                'lt' => ['range' => [$filter['field'] => ['lt' => $filter['value']]]],
                'lte' => ['range' => [$filter['field'] => ['lte' => $filter['value']]]],
                'gt' => ['range' => [$filter['field'] => ['gt' => $filter['value']]]],
                'gte' => ['range' => [$filter['field'] => ['gte' => $filter['value']]]],
                'match' => ['match' => [$filter['field'] => $filter['value']]],
                default => null
            };

            if ($term) {
                $must[] = $term;
            }
        }

        if (count($must)) {
            $request['query'] = [
                'bool' => [
                    'must' => $must,
                ]
            ];
        }

        return $this->finder->find($request);
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
