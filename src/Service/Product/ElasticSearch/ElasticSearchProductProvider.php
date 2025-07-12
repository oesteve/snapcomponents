<?php

namespace App\Service\Product\ElasticSearch;

use App\Entity\Agent;
use App\Entity\Product;
use App\Repository\ProductRepository;
use App\Service\Product\ProductProvider;
use App\Service\Search\EmbeddingsService;
use Elastica\Document;
use FOS\ElasticaBundle\Event\PostTransformEvent;
use FOS\ElasticaBundle\Finder\PaginatedFinderInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Contracts\HttpClient\HttpClientInterface;

readonly class ElasticSearchProductProvider implements ProductProvider
{
    public function __construct(
        #[Autowire(service: 'fos_elastica.finder.products')]
        private PaginatedFinderInterface $finder,
        private EmbeddingsService $searchService,
        private ProductRepository $productRepository,
        private HttpClientInterface $client,
        private Agent $agent,
    ) {
    }

    /**
     * Search for products using Elasticsearch.
     *
     * @param string|null $query The search query
     * @param array<string,array{
     *     field: string,
     *     operator: string,
     *     value: string
     * }>|null $filters
     *
     * @return Product[] The search results
     */
    public function search(
        ?string $query,
        ?array $filters = null,
    ): array {
        $request = [];

        if ($query) {
            $queryVector = $this->searchService->createEmbeddings($query);
            $request = [
                'knn' => [
                    'field' => 'title_vector',
                    'query_vector' => $queryVector,
                    'k' => 10,
                    'num_candidates' => 100,
                ],
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
                default => null,
            };

            if ($term) {
                $must[] = $term;
            }
        }

        if (count($must)) {
            $request['query'] = [
                'bool' => [
                    'must' => $must,
                ],
            ];
        }

        /** @var Product[] $results */
        $results = $this->finder->find($request);

        return $results;
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
        $title = $this->searchService->createEmbeddings($document->get('title'));
        $content = $this->searchService->createEmbeddings($document->get('description'));

        $document->set('title_vector', $title);
        $document->set('description_vector', $content);
    }

    /**
     * @return \Generator<ProductData>
     */
    public function getProducts(): \Generator
    {
        $responseData = $this->client->request('GET', 'https://dummyjson.com/products?limit=10')
            ->toArray();
        foreach (
            $responseData['products'] as $itemData
        ) {
            yield new ProductData(
                'product_'.$itemData['id'],
                $itemData['title'],
                $itemData['description'],
                $itemData['price'],
                $itemData['images'][0],
            );
        }
    }

    public function importProducts(Agent $agent): void
    {
        foreach ($this->getProducts() as $productData) {
            $product = $this->productRepository->findOneBy([
                'agent' => $agent,
                'name' => $productData->name,
            ]);

            if (!$product) {
                $product = new Product(
                    $productData->name,
                    $productData->title,
                    $productData->description,
                    $productData->image,
                    $productData->price,
                    $agent
                );
            } else {
                $product->update(
                    $productData->name,
                    $productData->title,
                    $productData->description,
                    $productData->image,
                    $productData->price,
                );
            }

            $this->productRepository->save($product);
        }
    }

    /**
     * @return array<Product>
     */
    public function list(): array
    {
        return $this->productRepository->findBy([
            'agent' => $this->agent,
        ]);
    }
}
