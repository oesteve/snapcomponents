<?php

namespace App\Service\Chat\Function;

use App\Entity\ChatMessage;
use App\Service\Product\ProductSearchService;
use App\Service\Search\ArticleSearchService;
use Symfony\Component\Serializer\Exception\ExceptionInterface;
use Symfony\Component\Serializer\SerializerInterface;

readonly class SearchProduct implements FunctionInterface
{

    public const string NAME = "search_product";


    public function __construct(
        private ProductSearchService $productSearch,
    )
    {
    }

    public function getName(): string
    {
        return self::NAME;
    }

    /**
     * @param ChatMessage $message
     * @return array<string, mixed>
     */
    public function getParameters(
        ChatMessage $message,
    ): array
    {
        return [
            "type" => "object",
            "properties" => [
                "query" => [
                    "type" => "string",
                    "description" => "Terms to search about"
                ]
            ],
            "required" => ["query"],
            "additionalProperties" => false
        ];
    }

    public function getDescription(
        ChatMessage $message,
    ): string
    {
        return "Search in the database of articles";
    }

    /**
     * @param ChatMessage $message
     * @param array{query:string} $parameters
     * @return string
     * @throws ExceptionInterface
     */
    public function execute(
        ChatMessage $message,
        array $parameters
    ): string {

        $products = $this->productSearch->search($parameters["query"]);


        if(!count($products)){
            return "No products found";
        }

        $result = "These are the products that match your search: \n";

        foreach ($products as $product){
            $result .= "<wg-product-card title=\"{$product->getTitle()}\" image=\"{$product->getImage()}\" price=\"{$product->getPrice()}\" ></wg-product-card>\n";
        }

        return $result;
    }
}
