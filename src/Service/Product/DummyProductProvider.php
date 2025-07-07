<?php

namespace App\Service\Product;

use App\Entity\Product;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class DummyProductProvider implements ProductProvider
{
    public function __construct(
        private HttpClientInterface $client,
    ) {
    }

    /**
     * @return \Generator<Product>
     */
    public function getProducts(): \Generator
    {
        $responseData = $this->client->request('GET', 'https://dummyjson.com/products?limit=10')
            ->toArray();
        foreach (
            $responseData['products'] as $itemData
        ) {
            yield new ProductData(
                'product_'.$itemData['id'],
                $itemData['title'],
                $itemData['description'],
                $itemData['price'],
                $itemData['images'][0],
            );
        }
    }
}
