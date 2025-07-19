<?php

namespace App\Service\Product\ElasticSearch;

readonly class ProductData
{
    public function __construct(
        public string $referenceCode,
        public string $sku,
        public string $title,
        public string $description,
        public string $brand,
        public float $price,
        public string $currency,
        public string $image,
    ) {
    }
}
