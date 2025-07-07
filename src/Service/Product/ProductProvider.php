<?php

namespace App\Service\Product;

interface ProductProvider
{
    /**
     * @return \Generator<ProductData>
     */
    public function getProducts(): \Generator;
}
