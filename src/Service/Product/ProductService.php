<?php

namespace App\Service\Product;

use App\Entity\Agent;
use App\Entity\Product;
use App\Repository\AgentRepository;
use App\Service\Product\ElasticSearch\ElasticProductProviderBuilder;
use Symfony\Component\DependencyInjection\Attribute\AutowireLocator;
use Symfony\Component\DependencyInjection\ServiceLocator;

readonly class ProductService
{
    public const string PRODUCT_PROVIDER_PREFIX = 'product.provider';

    /**
     * @param ServiceLocator<ProductProviderBuilder> $builderLocator
     */
    public function __construct(
        #[AutowireLocator('app.product_provider.builder', defaultIndexMethod: 'getProviderName')]
        private ServiceLocator $builderLocator,
        private AgentRepository $agentRepository,
    ) {
    }

    public function getProvider(Agent $agent): ProductProvider
    {
        $providerName = $agent->getAttribute(
            self::getProviderNameKey(),
            ElasticProductProviderBuilder::getProviderName()
        );

        $settings = $agent->getAttribute(
            self::getSettingsKey($providerName),
            null
        );

        return $this->builderLocator->get($providerName)->build(
            $agent,
            $settings
        );
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

    /**
     * @param array<string, mixed> $settings
     */
    public function setProvider(Agent $agent, string $name, array $settings): void
    {
        $agent->setAttribute(
            $this->getProviderNameKey(),
            $name,
        );

        $agent->setAttribute(
            self::getSettingsKey($name),
            $settings,
        );

        $this->agentRepository->save($agent);
    }

    /**
     * @param array<string,array{
     *      field: string,
     *      operator: string,
     *      value: mixed
     *  }>|null $filters
     *
     * @return array<Product>
     */
    public function list(Agent $agent, ?string $query = null, ?array $filters = null): array
    {
        return $this->getProvider($agent)->search($query, $filters);
    }

    private static function getProviderNameKey(): string
    {
        return self::PRODUCT_PROVIDER_PREFIX.'.name';
    }

    private static function getSettingsKey(string $providerName): string
    {
        return self::PRODUCT_PROVIDER_PREFIX.".{$providerName}.settings";
    }
}
