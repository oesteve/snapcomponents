<?php

namespace App\Service\Chat\Function;

use App\Entity\ChatMessage;
use App\Service\Search\ArticleSearchService;
use Symfony\Component\Serializer\SerializerInterface;

class SearchArticle implements FunctionInterface
{

    public const string NAME = "search_article";

    public function __construct(
        private ArticleSearchService $searchService,
        private SerializerInterface  $serializer,
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
                    "description" => "Terms of use"
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
        return "Search in the FAQ database";
    }


    /**
     * @param ChatMessage $message
     *
     * @param array{query: string} $parameters
     */
    public function execute(
        ChatMessage $message,
        array $parameters
    ): string {
        $articles = $this->searchService->search($parameters["query"]);

        return $this->serializer->serialize($articles, 'json');
    }
}
