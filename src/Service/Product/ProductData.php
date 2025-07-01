<?php

namespace App\Service\Product;

readonly class ProductData
{
    public function __construct(
        public string $name,
        public string $title,
        public string $description,
        public float $price,
        public string $image,
    )
    {
    }
}
