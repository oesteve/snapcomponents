<?php

namespace App\Service\Product\ElasticSearch;

use App\Entity\Agent;
use App\Repository\ProductRepository;
use App\Service\Product\ProductProvider;
use App\Service\Product\ProductProviderFactory;
use App\Service\Search\EmbeddingsService;
use FOS\ElasticaBundle\Finder\PaginatedFinderInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class ElasticProductProviderFactory implements ProductProviderFactory
{
    public function __construct(
        #[Autowire(service: 'fos_elastica.finder.products')]
        private PaginatedFinderInterface $finder,
        private EmbeddingsService $searchService,
        private ProductRepository $productRepository,
        private HttpClientInterface $client,
    ) {
    }

    public function forAgent(Agent $agent): ProductProvider
    {
        return new ElasticSearchProductProvider(
            $this->finder,
            $this->searchService,
            $this->productRepository,
            $this->client,
            $agent,
        );
    }
}
