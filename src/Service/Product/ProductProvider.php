<?php

namespace App\Service\Product;

use App\Entity\Product;

interface ProductProvider
{

    /**
     * @return \Generator<ProductData>
     */
    public function getProducts(): \Generator;



}
