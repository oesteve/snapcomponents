<?php

namespace App\Service\Chat\Tool;

use App\Entity\ChatMessage;
use App\Service\Product\ProductService;

readonly class SearchProduct implements ToolInterface
{
    public const string NAME = 'search_product';

    public function __construct(
        private ProductService $productService,
    ) {
    }

    public function getName(): string
    {
        return self::NAME;
    }

    public function getDisplayName(): string
    {
        return 'Search Products in the database';
    }

    /**
     * @return array<string, mixed>
     */
    public function getParameters(
        ChatMessage $message,
    ): array {
        return [
            'type' => 'object',
            'properties' => [
                'query' => [
                    'type' => 'string',
                    'description' => 'Terms to search about',
                ],
                'filters' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'required' => ['field', 'operator', 'value'],
                        'properties' => [
                            'field' => [
                                'type' => 'string',
                                'enum' => ['price'],
                                'minLength' => 1,
                            ],
                            'operator' => [
                                'type' => 'string',
                                'enum' => ['eq', 'lt', 'lte', 'gt', 'gte', 'match'],
                            ],
                            'value' => [
                                'type' => ['number', 'string'],
                            ],
                        ],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            'required' => [],
            'additionalProperties' => false,
        ];
    }

    public function getDescription(
        ChatMessage $message,
    ): string {
        return 'Search in the product database, with filter for price.';
    }

    /**
     * @param array{
     *     query: string|null,
     *     filters: array<array{
     *         field: string,
     *         operator: string,
     *         value: mixed
     *     }>|null
     * } $parameters
     */
    public function execute(
        ChatMessage $message,
        array $parameters,
    ): string {
        $products = $this->productService->list(
            $message->getChat()->getAgent(),
            $parameters['query'] ?? null,
            $parameters['filters'] ?? null,
        );

        if (!count($products)) {
            return 'No products found';
        }

        $result = "These are the products that match your search: \n";

        foreach ($products as $product) {
            $result .= "<wg-product-card title=\"{$product->getTitle()}\" image=\"{$product->getImage()}\" price=\"{$product->getPrice()}\" ></wg-product-card>\n";
        }

        return $result;
    }

    public function support(string $scope): bool
    {
        return in_array($scope, [ToolManager::CHAT_SCOPE]);
    }
}
