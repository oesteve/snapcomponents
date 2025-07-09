<?php

namespace App\Service\Product;

use App\Entity\Product;

interface ProductSearchService
{
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
}
