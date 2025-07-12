<?php

namespace App\Service\Product;

use App\Entity\Agent;
use App\Service\Product\ElasticSearch\ElasticProductProviderBuilder;
use Symfony\Component\DependencyInjection\Attribute\AutowireLocator;
use Symfony\Component\DependencyInjection\ServiceLocator;

readonly class ProductProviderFactory
{
    /**
     * @param ServiceLocator<ProductProviderBuilder> $builderLocator
     */
    public function __construct(
        #[AutowireLocator('app.product_provider.builder', defaultIndexMethod: 'getProviderName')]
        private ServiceLocator $builderLocator,
    ) {
    }

    public function forAgent(Agent $agent): ProductProvider
    {
        $providerName = $agent->getAttribute(
            'product_provider',
            ElasticProductProviderBuilder::getProviderName()
        );

        return $this->builderLocator->get($providerName)->build($agent);
    }

    /**
     * @return array<string>
     */
    public function getAvailableProviders(): array
    {
        $providers = [];
        foreach ($this->builderLocator->getProvidedServices() as $builder) {
            $providers[] = $builder::getProviderName();
        }

        return $providers;
    }
}
