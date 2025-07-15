<?php

namespace App\Service\Articles;

use App\Entity\Agent;
use App\Entity\Article;
use App\Service\Search\Embedder;
use Elastica\Aggregation\Terms;
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
        private Embedder $embbder,
        private ArticleEmbedder $articleEmbedder,
    ) {
    }

    /**
     * Search for articles using Elasticsearch.
     *
     * @return Article[] The search results
     */
    public function search(
        Agent $agent,
        ?string $query,
    ): array {
        $searchParams['post_filter'] = [
            'term' => [
                'agent.id' => $agent->getId(),
            ],
        ];

        if ($query) {
            $queryVector = $this
                ->embbder
                ->createEmbeddings(
                    $query,
                );

            $searchParams['knn'] = [
                'field' => 'vector',
                'query_vector' => $queryVector,
                'k' => 10,
                'num_candidates' => 100,
            ];
        }

        /** @var Article[] $results */
        $results = $this->finder->find($searchParams);

        return $results;
    }

    #[AsEventListener(event: PostTransformEvent::class)]
    public function onPostTransform(PostTransformEvent $event): void
    {
        $object = $event->getObject();

        if (!($object instanceof Article)) {
            return;
        }

        $event->getDocument()->set(
            'vector',
            $this->articleEmbedder->createEmbeddings($object),
        );
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
}
