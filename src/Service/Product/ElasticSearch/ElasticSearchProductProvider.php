<?php

namespace App\Service\Product\ElasticSearch;

use App\Entity\Agent;
use App\Entity\Product;
use App\Repository\ProductRepository;
use App\Service\Product\ProductProvider;
use App\Service\Search\Embedder;
use FOS\ElasticaBundle\Finder\PaginatedFinderInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;

readonly class ElasticSearchProductProvider implements ProductProvider
{
    /**
     * @param array<string,mixed> $settings
     */
    public function __construct(
        private PaginatedFinderInterface $finder,
        private Embedder $searchService,
        private ProductRepository $productRepository,
        private HttpClientInterface $client,
        private Agent $agent,
        private array $settings,
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
                    'field' => 'vector',
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

    /**
     * @return \Generator<ProductData>
     */
    public function getProducts(): \Generator
    {
        $responseData = $this->client->request('GET', 'https://dummyjson.com/products?limit='.$this->settings['num_of_products'])
            ->toArray();
        foreach (
            $responseData['products'] as $itemData
        ) {
            yield new ProductData(
                'product_'.$itemData['id'],
                $itemData['sku'],
                $itemData['title'],
                $itemData['description'],
                $itemData['brand'],
                $itemData['price'],
                'EUR',
                $itemData['images'][0],
            );
        }
    }

    /**
     * @return \generator<Product>
     */
    public function importProducts(): \Generator
    {
        foreach ($this->getProducts() as $productData) {
            $product = $this->productRepository->findOneBy([
                'agent' => $this->agent,
                'referenceCode' => $productData->referenceCode,
            ]);

            if (!$product) {
                $product = new Product(
                    $productData->referenceCode,
                    $productData->title,
                    $productData->description,
                    $productData->sku,
                    $productData->brand,
                    $productData->image,
                    $productData->price,
                    'EUR',
                    $this->agent
                );
            } else {
                $product->update(
                    $productData->referenceCode,
                    $productData->title,
                    $productData->description,
                    $productData->sku,
                    $productData->brand,
                    $productData->image,
                    $productData->price,
                    $productData->currency,
                );
            }

            $this->productRepository->save($product);

            yield $product;
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

    /**
     * @return array<string, mixed>
     */
    public function getSettings(): array
    {
        return $this->settings;
    }

    public static function getName(): string
    {
        return 'ElasticSearch';
    }
}
