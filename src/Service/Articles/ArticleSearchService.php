<?php

namespace App\Service\Articles;

use App\Entity\Agent;
use App\Entity\Article;
use App\Service\Search\EmbeddingsService;
use Elastica\Aggregation\Terms;
use Elastica\Document;
use Elastica\Query;
use FOS\ElasticaBundle\Event\PostTransformEvent;
use FOS\ElasticaBundle\Finder\PaginatedFinderInterface;
use FOS\ElasticaBundle\Paginator\FantaPaginatorAdapter;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

readonly class ArticleSearchService
{
    public function __construct(
        #[Autowire(service: 'fos_elastica.finder.articles')]
        private PaginatedFinderInterface $finder,
        private EmbeddingsService $searchService,
    ) {
    }

    /**
     * Search for articles using Elasticsearch.
     *
     * @param Agent  $agent The agent to filter articles by
     * @param string $query The search query
     *
     * @return Article[] The search results
     */
    public function search(
        Agent $agent,
        string $query,
    ): array {
        $queryVector = $this->searchService->createEmbeddings(
            $query,
        );

        $searchParams = [
            'knn' => [
                'field' => 'title_vector',
                'query_vector' => $queryVector,
                'k' => 10,
                'num_candidates' => 100,
            ],
        ];

        $searchParams['post_filter'] = [
            'term' => [
                'agent.id' => $agent->getId(),
            ],
        ];

        /** @var Article[] $results */
        $results = $this->finder->find($searchParams);

        return $results;
    }

    #[AsEventListener(event: PostTransformEvent::class)]
    public function onPostTransform(PostTransformEvent $event): void
    {
        if (false === $event->getObject() instanceof Article) {
            return;
        }

        $this->setEmbeddings($event->getDocument());
    }

    /**
     * @return array<string>
     */
    public function getCategories(): array
    {
        $query = new Query();
        $agg = new Terms('categories');
        $agg->setField('category.name');
        $query->addAggregation($agg);

        $query->setSize(0);

        /** @var FantaPaginatorAdapter<Article> $adapter */
        $adapter = $this->finder->findPaginated($query)
            ->getAdapter();

        $aggregationData = $adapter->getAggregations();

        return array_map(
            fn (array $item) => $item['key'],
            $aggregationData['categories']['buckets']
        );
    }

    private function setEmbeddings(Document $document): void
    {
        $title = $this->searchService->createEmbeddings($document->get('title'));
        $content = $this->searchService->createEmbeddings($document->get('content'));

        $document->set('title_vector', $title);
        $document->set('content_vector', $content);
    }
}
