<?php

namespace App\Service\Chat\Component;

class ProductCard implements ComponentInterface
{
    public const string NAME = 'product-card';

    public function getName(): string
    {
        return self::NAME;
    }

    public function getDisplayName(): string
    {
        return 'Product Card Widget';
    }

    public function getDescription(): string
    {
        return 'A product card widget that displays product information in an attractive card format. It shows the product image, title, rating, price, and an "Add to cart" button.';
    }

    public function getParameters(): array
    {
        return [
            'type' => 'object',
            'properties' => [
                'image' => [
                    'type' => 'string',
                    'description' => 'URL of the product image',
                ],
                'title' => [
                    'type' => 'string',
                    'description' => 'Title/name of the product',
                ],
                'price' => [
                    'type' => 'number',
                    'description' => 'Price of the product (without $)',
                ],
            ],
            'required' => ['image', 'title', 'price'],
            'additionalProperties' => false,
        ];
    }

    public function render(array $parameters): string
    {
        $image = $parameters['image'] ?? '';
        $title = $parameters['title'] ?? '';
        $price = $parameters['price'] ?? '';

        return "<wg-product-card image=\"{$image}\" title=\"{$title}\" price=\"{$price}\"></wg-product-card>";
    }
}
