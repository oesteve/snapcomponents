<?php

namespace App\Service\Product\ElasticSearch;

use App\Entity\Agent;
use App\Repository\ProductRepository;
use App\Service\Product\ProductProvider;
use App\Service\Product\ProductProviderBuilder;
use App\Service\Search\Embedder;
use FOS\ElasticaBundle\Finder\PaginatedFinderInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

readonly class ElasticProductProviderBuilder implements ProductProviderBuilder
{
    public function __construct(
        #[Autowire(service: 'fos_elastica.finder.products')]
        private PaginatedFinderInterface $finder,
        private Embedder $searchService,
        private ProductRepository $productRepository,
        private HttpClientInterface $client,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    private static function getDefaultSettings(): array
    {
        return [
            'num_of_products' => 10,
        ];
    }

    public function build(Agent $agent, ?array $settings): ProductProvider
    {
        return new ElasticSearchProductProvider(
            $this->finder,
            $this->searchService,
            $this->productRepository,
            $this->client,
            $agent,
            $settings ?? self::getDefaultSettings(),
        );
    }

    public static function getProviderName(): string
    {
        return ElasticSearchProductProvider::getName();
    }
}
