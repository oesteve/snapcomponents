<?php

namespace App\Service\Product;

use App\Entity\Product;

interface ProductProvider
{
    /**
     * @return array<Product>
     */
    public function list(): array;

    /**
     * Search for products using Elasticsearch.
     *
     * @param string|null $query The search query
     * @param array<string,array{
     *     field: string,
     *     operator: string,
     *     value: mixed
     * }>|null $filters
     *
     * @return Product[] The search results
     */
    public function search(
        ?string $query,
        ?array $filters = null,
    ): array;

    /**
     * @return array<string, mixed>
     */
    public function getSettings(): array;

    public static function getName(): string;
}
